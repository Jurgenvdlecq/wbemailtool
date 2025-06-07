
// --- BEGIN GEGENEREERD BESTAND: main.js ---

// Wittebrug E-mailgenerator – main.js (aangepast)

// Modellen
const seatModels = ["Ibiza", "Leon", "Leon Sportstourer", "Arona", "Ateca"];
const cupraModels = ["Born", "Formentor", "Leon", "Leon Sportstourer", "Terramar", "Tavascan"];

// Helpers
function translateDuration(text) {
  if (!text) return '';
  const mappings = [
    { nl: 'weken', en: 'weeks' },
    { nl: 'week',  en: 'week'  },
    { nl: 'dagen', en: 'days'  },
    { nl: 'dag',   en: 'day'   },
    { nl: 'maanden', en: 'months' },
    { nl: 'maand', en: 'month' }
  ];
  let result = text;
  mappings.forEach(m => {
    const re = new RegExp('\\b(\\d+)\\s*' + m.nl + '\\b', 'gi');
    result = result.replace(re, '$1 ' + m.en);
  });
  return result;
}
function formatPriceNL(num) {
  return '€ ' + new Intl.NumberFormat('nl-NL').format(num) + ',-';
}

// Dropdown logica
function populateModels() {
  const merk = document.getElementById('merk').value;
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">-- Kies --</option>';
  const list = merk === 'SEAT' ? seatModels : (merk === 'CUPRA' ? cupraModels : []);
  list.forEach(m => {
    const opt = document.createElement('option'); opt.value = m; opt.textContent = m;
    modelSelect.appendChild(opt);
  });
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}

// Validatie
function validateField(id) {
  const f = document.getElementById(id), e = document.getElementById('error-' + id);
  if (f.required && !f.value.trim()) {
    f.classList.add('error'); e.textContent = 'Dit veld is verplicht'; e.style.display = 'block';
    return false;
  }
  f.classList.remove('error'); if (e) e.style.display = 'none'; return true;
}
function validateForm() {
  let ok = true;
  ['aanhef','voornaam','achternaam','merk','model','emailtype'].forEach(id => {
    if (!validateField(id)) ok = false;
  });
  document.querySelectorAll('.field-group').forEach(g => {
    if (getComputedStyle(g).display !== 'none') {
      const inp = g.querySelector('input,select');
      if (inp && inp.required && !validateField(inp.id)) ok = false;
    }
  });
  document.getElementById('generateBtn').disabled = !ok;
  return ok;
}

// Toon/verberg velden op basis van type e-mail
function toggleFields() {
  const t = document.getElementById('emailtype').value;
  // Bij lease geen levertijd, wel looptijd
  const map = {
    offerte: ['prijs','levertijd'],
    inruil:  ['prijs','levertijd','inruilprijs','kenteken'],
    proefrit:['datum','tijd'],
    afspraak:['datum','tijd'],
    showroom:['prijs','levertijd'],
    lease:   ['looptijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup:['model'],
    status:  ['leverdatum']
  };
  const all = ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  all.forEach(id => {
    const el = document.getElementById('veld-' + id);
    if (el) el.style.display = map[t]?.includes(id) ? 'block' : 'none';
  });
  validateForm();
}

document.querySelectorAll('input,select').forEach(el => {
  if (['aanhef','voornaam','achternaam','merk','model','emailtype','prijs','levertijd','datum','tijd','looptijd','kilometers'].includes(el.id)) {
    el.addEventListener('blur', () => validateField(el.id));
  }
});

let currentLang = 'nl', lastSubject = '', lastBody = '';
function updateLanguage() {
  currentLang = document.getElementById('languageSelect').value;
  if (!document.getElementById('copyBtn').disabled) generateEmail();
}

// E-mail genereren en templates invullen
function generateEmail() {
  if (!validateForm()) { showToast('Vul eerst alle verplichte velden in.'); return; }
  const aan = document.getElementById('aanhef').value;
  const fn = document.getElementById('voornaam').value.trim();
  const ln = document.getElementById('achternaam').value.trim();
  const merk = document.getElementById('merk').value;
  const model = document.getElementById('model').value;
  const type = document.getElementById('emailtype').value;

  // Aanhef
  let greet = '';
  if (aan === 'voornaam') greet = currentLang === 'nl' ? `Beste ${fn},` : `Dear ${fn},`;
  else if (aan === 'heer') greet = currentLang === 'nl' ? `Beste heer ${ln},` : `Dear Mr. ${ln},`;
  else greet = currentLang === 'nl' ? `Beste mevrouw ${ln},` : `Dear Ms. ${ln},`;

  // Velden
  const pr = document.getElementById('prijs').value.trim();
  const prTxt = pr ? formatPriceNL(pr) : '';
  const lv = document.getElementById('levertijd')?.value.trim();
  const lvTxt = currentLang === 'en' ? translateDuration(lv) : lv;
  const lt = document.getElementById('looptijd')?.value.trim();
  const km = document.getElementById('kilometers')?.value.trim();
  const er = document.getElementById('eigenrisico')?.value.trim();
  const mb = document.getElementById('maandbedrag')?.value.trim();
  const bd = document.getElementById('banden')?.value;
  const dt = document.getElementById('datum')?.value;
  const tm = document.getElementById('tijd')?.value;
  const ld = document.getElementById('leverdatum')?.value;
  const dtFmt = dt ? new Date(dt).toLocaleDateString(currentLang==='nl'?'nl-NL':'en-US',{day:'numeric',month:'long',year:'numeric'}) : '';
  const ldFmt = ld ? new Date(ld).toLocaleDateString(currentLang==='nl'?'nl-NL':'en-US',{day:'numeric',month:'long',year:'numeric'}) : '';

  // Subject templates
  const subjNL = {
    offerte: `Offerteaanvraag – ${merk} ${model}`,
    inruil:  `Offerte ${merk} ${model} inclusief inruil`,
    lease:   `Private lease ${merk} ${model}`,
    proefrit:`Bevestiging proefrit ${merk} ${model}`,
    afspraak:`Bevestiging afspraak ${merk} ${model}`,
    showroom:`Showroombezoek – Offerte ${merk} ${model}`,
    followup:`Follow-up offerte ${merk} ${model}`,
    status:  `Status levering ${merk} ${model}`
  };
  const subjEN = {
    offerte: `Quote request – ${merk} ${model}`,
    inruil:  `Quote including trade-in – ${merk} ${model}`,
    lease:   `Private lease proposal – ${merk} ${model}`,
    proefrit:`Test drive confirmation – ${merk} ${model}`,
    afspraak:`Appointment confirmation – ${merk} ${model}`,
    showroom:`Showroom visit quote – ${merk} ${model}`,
    followup:`Follow-up quote – ${merk} ${model}`,
    status:  `Delivery status – ${merk} ${model}`
  };
  lastSubject = currentLang === 'nl' ? subjNL[type] : subjEN[type];

  // Body opbouw per type
  let body = greet + "\n\n";
  switch(type) {
    case 'offerte':
      body += `Hartelijk dank voor uw interesse in de ${merk} ${model}.\n`;
      body += `De totale aanschafprijs bedraagt ${prTxt}, inclusief afleverkosten.\n`;
      body += `De verwachte levertijd is ongeveer ${lvTxt} na akkoord.\n\n`;
      body += `In de bijlage vindt u de complete offerte.\n`;
      body += `Uiteraard bent u welkom om de auto in het echt te bekijken of een proefrit te maken.\n`;
      break;
    case 'inruil':
      body += `Zoals besproken ontvangt u hierbij de vrijblijvende offerte voor de ${merk} ${model}.\n`;
      body += `De totale aanschafprijs bedraagt ${prTxt}, inclusief afleverkosten.\n`;
      body += `Inruilauto (kenteken ${kt}) is gewaardeerd op ${formatPriceNL(er)}.\n`;
      body += `De levertijd is ongeveer ${lvTxt} na akkoord.\n\n`;
      body += `U bent van harte welkom voor een definitieve taxatie.\n`;
      break;
    case 'proefrit':
      body += `Hierbij bevestigen wij uw proefritafspraak voor de ${merk} ${model} op ${dtFmt} om ${tm}.\n`;
      body += `Wij ontvangen u bij Wittebrug SEAT, Donau 120, Den Haag. Vergeet uw rijbewijs niet.\n`;
      break;
    case 'afspraak':
      body += `Hierbij bevestigen wij uw afspraak voor de ${merk} ${model} op ${dtFmt} om ${tm}.\n`;
      body += `Locatie: Donau 120, Den Haag.\n`;
      break;
    case 'showroom':
      body += `Bedankt voor uw bezoek aan onze showroom. Zoals afgesproken stuur ik u de offerte voor de ${merk} ${model}.\n`;
      body += `De prijs bedraagt ${prTxt}, inclusief afleverkosten.\n`;
      break;
    case 'lease':
      body += `Hierbij ontvangt u ons private lease voorstel voor de ${merk} ${model}.\n`;
      body += `• Looptijd: ${lt} maanden\n`;
      body += `• Kilometers per jaar: ${km} km\n`;
      body += `• Eigen risico: ${formatPriceNL(er)}\n`;
      body += `• Maandbedrag: ${formatPriceNL(mb)} incl. btw\n`;
      body += `• Type banden: ${bd}\n`;
      body += `In de bijlage vindt u het volledige voorstel.\n`;
      break;
    case 'followup':
      body += `Enige tijd geleden stuurde ik u de offerte voor de ${merk} ${model}.\n`;
      body += `Ik hoor graag wat u ervan vindt of als u vragen heeft.\n`;
      break;
    case 'status':
      body += `Wij houden u graag op de hoogte van de status van uw bestelling.\n`;
      body += `Uw ${merk} ${model} staat in bestelling en wordt verwacht op ${ldFmt}.\n`;
      body += `Dit is nog onder voorbehoud; wijzigingen zullen we direct melden.\n`;
      break;
  }
  lastBody = body;
  document.getElementById('previewContent').innerText = body;
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('outlookBtn').disabled = false;
}

// Copy & Outlook
function copyEmail(){ navigator.clipboard.writeText(lastBody); showToast('E-mailtekst gekopieerd naar klembord'); }
function openInOutlook(){ window.location.href = `mailto:?subject=${encodeURIComponent(lastSubject)}&body=${encodeURIComponent(lastBody)}`; }
function resetForm(){ document.getElementById('previewContent').innerText = ''; document.getElementById('copyBtn').disabled = true; document.getElementById('outlookBtn').disabled = true; }

// Listeners & init
['merk','emailtype'].forEach(id=>document.getElementById(id).addEventListener('change',()=>{populateModels();toggleFields();validateForm();}));
document.getElementById('emailForm').addEventListener('input', validateForm);
document.getElementById('generateBtn').addEventListener('click', generateEmail);
document.getElementById('copyBtn').addEventListener('click', copyEmail);
document.getElementById('outlookBtn').addEventListener('click', openInOutlook);
document.getElementById('resetBtn').addEventListener('click', resetForm);
document.getElementById('languageSelect').addEventListener('change', updateLanguage);
window.addEventListener('DOMContentLoaded', ()=>{populateModels();toggleFields();validateForm();updateLanguage();});


// Toevoegen of vervangen van de generateEmail functie
function generateEmail() {
  if (!validateForm()) {
    showToast('Vul eerst alle verplichte velden in.');
    return;
  }

  const aan = document.getElementById('aanhef').value;
  const fn = document.getElementById('voornaam').value.trim();
  const ln = document.getElementById('achternaam').value.trim();
  const merk = document.getElementById('merk').value;
  const model = document.getElementById('model').value;
  const type = document.getElementById('emailtype').value;

  // Aanhef
  let greet = '';
  if (aan === 'voornaam') greet = currentLang === 'nl' ? `Beste {fn},` : `Dear {fn},`;
  else if (aan === 'heer') greet = currentLang === 'nl' ? `Beste heer {ln},` : `Dear Mr. {ln},`;
  else greet = currentLang === 'nl' ? `Beste mevrouw {ln},` : `Dear Ms. {ln},`;

  // Velden ophalen
  const data = {
    merk,
    model,
    prijs: formatPriceNL(document.getElementById('prijs')?.value.trim()),
    levertijd: currentLang === 'en' ? translateDuration(document.getElementById('levertijd')?.value.trim()) : document.getElementById('levertijd')?.value.trim(),
    inruilprijs: formatPriceNL(document.getElementById('inruilprijs')?.value.trim()),
    kenteken: document.getElementById('kenteken')?.value.trim(),
    datum: new Date(document.getElementById('datum')?.value).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    tijd: document.getElementById('tijd')?.value,
    looptijd: document.getElementById('looptijd')?.value,
    kilometers: document.getElementById('kilometers')?.value,
    eigenrisico: formatPriceNL(document.getElementById('eigenrisico')?.value),
    maandbedrag: formatPriceNL(document.getElementById('maandbedrag')?.value),
    banden: document.getElementById('banden')?.value,
    leverdatum: new Date(document.getElementById('leverdatum')?.value).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  // Onderwerp
  const subj = {
    nl: {
      offerte: `Offerteaanvraag – {merk} {model}`,
      inruil: `Offerte {merk} {model} inclusief inruil`,
      lease: `Private lease {merk} {model}`,
      proefrit: `Bevestiging proefrit {merk} {model}`,
      afspraak: `Bevestiging afspraak {merk} {model}`,
      showroom: `Showroombezoek – Offerte {merk} {model}`,
      followup: `Follow-up offerte {merk} {model}`,
      status: `Status levering {merk} {model}`
    },
    en: {
      offerte: `Quote request – {merk} {model}`,
      inruil: `Quote including trade-in – {merk} {model}`,
      lease: `Private lease proposal – {merk} {model}`,
      proefrit: `Test drive confirmation – {merk} {model}`,
      afspraak: `Appointment confirmation – {merk} {model}`,
      showroom: `Showroom visit quote – {merk} {model}`,
      followup: `Follow-up quote – {merk} {model}`,
      status: `Delivery status – {merk} {model}`
    }
  };

  lastSubject = subj[currentLang][type].replace('{merk}', merk).replace('{model}', model);

  const bodyTemplate = currentLang === 'nl' ? emailBodiesNL[type] : emailBodiesEN[type];
  lastBody = greet + '\n\n' + bodyTemplate(data);

  document.getElementById('previewContent').innerText = lastBody;
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('outlookBtn').disabled = false;
}
