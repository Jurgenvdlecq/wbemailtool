// Wittebrug E-mailtool – Main JS
const seatModels = ["Ibiza","Leon","Leon Sportstourer","Arona","Ateca"];
const cupraModels = ["Born","Formentor","Leon","Leon Sportstourer","Terramar","Tavascan"];

// Helper: vertaalt NL-duur naar Engels
function translateDuration(text) {
  if (!text) return '';
  const mapping = {
    'weken': 'weeks',
    'week':  'week',
    'maanden': 'months',
    'maand': 'month',
    'dagen': 'days',
    'dag': 'day'
  };
  return text.replace(/(\d+)\s*(weken|week|maanden|maand|dagen|dag)/gi,
    (_, num, unit) => `${num} ${mapping[unit.toLowerCase()]}`);
}

// Prijsformatter NL
function formatPriceNL(val) {
  const n = Number(val) || 0;
  return '€ ' + new Intl.NumberFormat('nl-NL').format(n) + ',-';
}

let currentLang = 'nl';

window.addEventListener('DOMContentLoaded', () => {
  populateModels();
  toggleFields();
  validateForm();

  document.getElementById('merk').addEventListener('change', () => {
    populateModels(); validateForm();
  });
  document.getElementById('emailtype').addEventListener('change', () => {
    toggleFields(); validateForm();
  });
  document.getElementById('languageSelect').addEventListener('change', e => {
    currentLang = e.target.value;
    generateEmail();
  });

  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      toggleFields(); validateForm();
    });
  });

  document.getElementById('generateBtn').addEventListener('click', generateEmail);
  document.getElementById('outlookBtn').addEventListener('click', openOutlook);
});

function populateModels() {
  const m = document.getElementById('merk').value;
  const sel = document.getElementById('model');
  sel.innerHTML = '<option value="">-- Kies --</option>';
  const list = m==='SEAT' ? seatModels : (m==='CUPRA' ? cupraModels : []);
  list.forEach(x => sel.innerHTML += `<option value="${x}">${x}</option>`);
}

function toggleFields() {
  const groups = {
    offerte:['prijs','levertijd'],
    inruil:['prijs','levertijd','inruilprijs','kenteken'],
    proefrit:['datum','tijd'],
    afspraak:['datum','tijd'],
    showroom:['prijs','levertijd'],
    lease:['looptijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup:[],
    status:['leverdatum']
  };
  const type = document.getElementById('emailtype').value;
  const all = ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  all.forEach(id => {
    const el = document.getElementById('veld-'+id);
    if (el) el.style.display = (groups[type]||[]).includes(id) ? 'block' : 'none';
  });
}

function validateForm() {
  const req = ['aanhef','voornaam','achternaam','merk','model','emailtype'];
  let ok = req.every(id => !!document.getElementById(id).value);
  const type = document.getElementById('emailtype').value;
  const groups = {
    offerte:['prijs','levertijd'],
    inruil:['prijs','levertijd','inruilprijs','kenteken'],
    proefrit:['datum','tijd'],
    afspraak:['datum','tijd'],
    showroom:['prijs','levertijd'],
    lease:['looptijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup:[],
    status:['leverdatum']
  };
  (groups[type]||[]).forEach(id => {
    if (!document.getElementById(id).value) ok = false;
  });
  document.getElementById('generateBtn').disabled = !ok;
}

function generateEmail() {
  const d = {
    naam:       document.getElementById('voornaam').value.trim(),
    ak:         document.getElementById('achternaam').value.trim(),
    merk:       document.getElementById('merk').value,
    model:      document.getElementById('model').value,
    prijs:      document.getElementById('prijs').value,
    levertijd:  document.getElementById('levertijd').value,
    inruilprijs:document.getElementById('inruilprijs').value,
    kenteken:   document.getElementById('kenteken').value,
    datum:      document.getElementById('datum').value,
    tijd:       document.getElementById('tijd').value,
    looptijd:   document.getElementById('looptijd').value,
    kilometers: document.getElementById('kilometers').value,
    eigenrisico:document.getElementById('eigenrisico').value,
    maandbedrag:document.getElementById('maandbedrag').value,
    banden:     document.getElementById('banden').value,
    leverdatum: document.getElementById('leverdatum').value
  };
  // Aanhef-bepaling
  const a = document.getElementById('aanhef').value;
  let greet = '';
  if (currentLang==='nl') {
    if (a==='voornaam') greet = `Beste ${d.naam},`;
    else if (a==='heer') greet = `Beste meneer ${d.ak},`;
    else greet = `Beste mevrouw ${d.ak},`;
  } else {
    if (a==='voornaam') greet = `Dear ${d.naam},`;
    else if (a==='heer') greet = `Dear Mr. ${d.ak},`;
    else greet = `Dear Ms. ${d.ak},`;
  }
  // NL-templates
  const tplNL = {
    offerte: d => `${greet}\n\nHartelijk dank voor uw interesse in de ${d.merk} ${d.model}.\nDe totale aanschafprijs bedraagt ${formatPriceNL(d.prijs)}\nDe geschatte levertijd is circa ${d.levertijd} na akkoord.\n\nIn de bijlage vindt u de complete offerte.\nU bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
    // … overige NL-templates ongewijzigd …
  };
  // EN-templates (geüpdatet met translateDuration)
  const tplEN = {
    offerte: d => `${greet}\n\nThank you for your interest in the ${d.merk} ${d.model}.\nThe total purchase price is ${formatPriceNL(d.prijs)} including delivery costs.\nThe estimated delivery time is approximately ${translateDuration(d.levertijd)} upon confirmation.\n\nYou’ll find the full quote attached.\nYou’re welcome to visit our showroom for a viewing or test drive.`,
    // … overige EN-templates, zie voorbeeld hierboven …
  };
  const type = document.getElementById('emailtype').value;
  const body = (currentLang==='en' ? tplEN : tplNL)[type](d);
  document.getElementById('output').innerText = body;
  document.getElementById('outlookBtn').style.display = 'inline-block';
}

function openOutlook() {
  const subject = currentLang==='nl' ? 'Voorstel Wittebrug' : 'Your Quote from Wittebrug';
  const body = encodeURIComponent(document.getElementById('output').innerText);
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function kopieerTekst() {
  const fb = document.getElementById('feedback');
  navigator.clipboard.writeText(document.getElementById('output').innerText)
    .then(() => {
      fb.innerText = currentLang==='nl' ? 'Tekst gekopieerd!' : 'Text copied!';
      setTimeout(() => fb.innerText = '', 2000);
    });
}
