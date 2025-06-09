// Wittebrug E-mailtool - Main JS
const seatModels = ["Ibiza","Leon","Leon Sportstourer","Arona","Ateca"];
const cupraModels = ["Born","Formentor","Leon","Leon Sportstourer","Terramar","Tavascan"];

function formatPriceNL(val) {
  const n = Number(val) || 0;
  return '€ ' + new Intl.NumberFormat('nl-NL').format(n) + ',-';
}

let currentLang = 'nl';

window.addEventListener('DOMContentLoaded', () => {
  // Cache elements
  const langSelect = document.getElementById('languageSelect');
  const merk = document.getElementById('merk');
  const emailtype = document.getElementById('emailtype');
  const generateBtn = document.getElementById('generateBtn');
  const outlookBtn = document.getElementById('outlookBtn');

  // Populate and toggle on load
  populateModels();
  toggleFields();
  validateForm();

  // Event listeners
  langSelect.addEventListener('change', e => {
    currentLang = e.target.value;
    generateEmail();
  });
  merk.addEventListener('change', () => {
    populateModels();
    toggleFields();
    validateForm();
  });
  emailtype.addEventListener('change', () => {
    toggleFields();
    validateForm();
  });
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      toggleFields();
      validateForm();
    });
  });
  generateBtn.addEventListener('click', generateEmail);
  outlookBtn.addEventListener('click', openOutlook);
});

function populateModels() {
  const m = document.getElementById('merk').value;
  const sel = document.getElementById('model');
  sel.innerHTML = '<option value="">-- Kies --</option>';
  (m==='SEAT' ? seatModels : (m==='CUPRA' ? cupraModels : []))
    .forEach(x => sel.innerHTML += `<option value="${x}">${x}</option>`);
}

function toggleFields() {
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
  const all = ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  all.forEach(id => {
    const el = document.getElementById('veld-'+id);
    if(el) el.style.display = groups[type].includes(id) ? 'block' : 'none';
  });
}

function validateForm() {
  const req = ['aanhef','voornaam','achternaam','merk','model','emailtype'];
  let ok = req.every(id => document.getElementById(id).value.trim() !== '');
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
  (groups[type] || []).forEach(id => {
    if(!document.getElementById(id).value.trim()) ok = false;
  });
  document.getElementById('generateBtn').disabled = !ok;
}

function generateEmail() {
  const d = {
    naam: document.getElementById('voornaam').value.trim(),
    ak: document.getElementById('achternaam').value.trim(),
    merk: document.getElementById('merk').value,
    model: document.getElementById('model').value,
    prijs: document.getElementById('prijs').value,
    levertijd: document.getElementById('levertijd').value,
    inruilprijs: document.getElementById('inruilprijs').value,
    kenteken: document.getElementById('kenteken').value,
    datum: document.getElementById('datum').value,
    tijd: document.getElementById('tijd').value,
    looptijd: document.getElementById('looptijd').value,
    kilometers: document.getElementById('kilometers').value,
    eigenrisico: document.getElementById('eigenrisico').value,
    maandbedrag: document.getElementById('maandbedrag').value,
    banden: document.getElementById('banden').value,
    leverdatum: document.getElementById('leverdatum').value
  };
  // Greeting
  let greet = '';
  const a = document.getElementById('aanhef').value;
  if(currentLang==='nl') {
    if(a==='voornaam') greet = `Beste ${d.naam},`;
    else if(a==='heer') greet = `Beste meneer ${d.ak},`;
    else greet = `Beste mevrouw ${d.ak},`;
  } else {
    if(a==='voornaam') greet = `Dear ${d.naam},`;
    else if(a==='heer') greet = `Dear Mr. ${d.ak},`;
    else greet = `Dear Ms. ${d.ak},`;
  }
  // Templates
  const nl = {
    offerte: d=>`${greet}

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
De totale aanschafprijs bedraagt ${formatPriceNL(d.prijs)}
De geschatte levertijd is circa ${d.levertijd} na akkoord.

In de bijlage vindt u de complete offerte.
U bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
    inruil: d=>`${greet}

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
Hierbij onze vrijblijvende offerte. Prijs ${formatPriceNL(d.prijs)}
Uw inruilauto (kenteken ${d.kenteken}) is gewaardeerd op ${formatPriceNL(d.inruilprijs)}
De levertijd bedraagt circa ${d.levertijd} na akkoord.

Graag hoor ik uw reactie.`,
    proefrit: d=>`${greet}

Bedankt voor het plannen van de proefrit in de ${d.merk} ${d.model}!
Afspraak: ${d.datum} om ${d.tijd} uur.
Locatie: Wittebrug SEAT, Donau 120, Den Haag.
Vergeet uw rijbewijs niet.`,
    afspraak: d=>`${greet}

Bedankt voor uw afspraak voor de ${d.merk} ${d.model} op ${d.datum} om ${d.tijd} uur.
U bent welkom aan Donau 120, Den Haag.
Heeft u vooraf vragen? Laat gerust weten.`,
    showroom: d=>`${greet}

Nogmaals bedankt voor uw bezoek.
Hierbij de offerte voor de ${d.merk} ${d.model}.
Prijs ${formatPriceNL(d.prijs)}

Vragen? Graag!`,
    lease: d=>`${greet}

Dank voor uw interesse in private lease.
Voorstel ${d.merk} ${d.model}:
• Looptijd: ${d.looptijd} maanden
• Km/jr: ${d.kilometers}
• ER: ${formatPriceNL(d.eigenrisico)}
• Maandbedrag: ${formatPriceNL(d.maandbedrag)}
• Banden: ${d.banden}

In de bijlage volledige offerte.
Bij akkoord starten we aanvraag.`,
    followup: d=>`${greet}

Onlangs stuurde ik de offerte voor de ${d.merk} ${d.model}.
Ik hoor graag uw feedback.`,
    status: d=>`${greet}

Update bestelling ${d.merk} ${d.model}.
Verwachte leverdatum: ${d.leverdatum}.
Bij vragen, graag contact.`
  };
  const en = {
    offerte: d=>`${greet}

Thank you for your interest in the ${d.merk} ${d.model}.
The total purchase price is ${formatPriceNL(d.prijs)} including delivery costs.
The estimated delivery time is approximately ${d.levertijd} upon confirmation.

You’ll find the full quote attached.
You’re welcome to visit our showroom for a viewing or test drive.`,
    inruil: d=>`${greet}

Thank you for your interest in the ${d.merk} ${d.model}.
Please find our non-binding quote attached. Total ${formatPriceNL(d.prijs)} including delivery costs.
Your trade-in vehicle (license ${d.kenteken}) has been valued at ${formatPriceNL(d.inruilprijs)}.
Estimated delivery time: ${d.levertijd} upon confirmation.

I look forward to your feedback.`,
    proefrit: d=>`${greet}

Thank you for booking a test drive in the ${d.merk} ${d.model}!
Appointment: ${d.datum} at ${d.tijd}.
Location: Wittebrug SEAT, Donau 120, The Hague.
Please bring your driver’s license.`,
    afspraak: d=>`${greet}

Thank you for scheduling an appointment for the ${d.merk} ${d.model} on ${d.datum} at ${d.tijd}.
You’re welcome at Donau 120, The Hague.
If you have any questions beforehand, please let me know.`,
    showroom: d=>`${greet}

Thank you again for visiting our showroom.
Here is the quote for the ${d.merk} ${d.model}.
Price: ${formatPriceNL(d.prijs)} including delivery costs.

If you have any questions or would like a test drive, feel free to contact us.`,
    lease: d=>`${greet}

Thank you for your interest in private leasing.
Proposal for the ${d.merk} ${d.model}:
• Term: ${d.looptijd} months
• Annual mileage: ${d.kilometers} km
• Excess: ${formatPriceNL(d.eigenrisico)}
• Monthly payment: ${formatPriceNL(d.maandbedrag)} incl. VAT
• Tyres: ${d.banden}

Full proposal attached.
If you agree, we can start the online application.`,
    followup: d=>`${greet}

You recently received our quote for the ${d.merk} ${d.model}.
I’d appreciate your feedback or any questions you have.`,
    status: d=>`${greet}

Here’s an update on your order of the ${d.merk} ${d.model}.
Expected delivery date: ${d.leverdatum}.
If you have any questions, please contact me.`
  };
  const body = (currentLang==='en' ? en : nl)[document.getElementById('emailtype').value](d);
  document.getElementById('output').innerText = body;
  document.getElementById('outlookBtn').style.display = 'inline-block';
}

function openOutlook() {
  const subject = currentLang==='nl' ? 'Voorstel Wittebrug' : 'Your Quote from Wittebrug';
  const body = encodeURIComponent(document.getElementById('output').innerText);
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function kopieerTekst() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const fb = document.getElementById('feedback');
    fb.innerText = currentLang==='nl'?'Tekst gekopieerd!':'Text copied!';
    setTimeout(()=>fb.innerText='',2000);
  });
}
