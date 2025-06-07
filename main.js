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
  if (aan === 'voornaam') greet = currentLang === 'nl' ? `Beste ${fn},` : `Dear ${fn},`;
  else if (aan === 'heer') greet = currentLang === 'nl' ? `Beste heer ${ln},` : `Dear Mr. ${ln},`;
  else greet = currentLang === 'nl' ? `Beste mevrouw ${ln},` : `Dear Ms. ${ln},`;

  const data = {
    merk,
    model,
    prijs: formatPriceNL(document.getElementById('prijs')?.value.trim()),
    levertijd: currentLang === 'en' ? translateDuration(document.getElementById('levertijd')?.value.trim()) : document.getElementById('levertijd')?.value.trim(),
    inruilprijs: formatPriceNL(document.getElementById('inruilprijs')?.value.trim()),
    kenteken: document.getElementById('kenteken')?.value.trim(),
    datum: document.getElementById('datum')?.value ? new Date(document.getElementById('datum')?.value).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    tijd: document.getElementById('tijd')?.value,
    looptijd: document.getElementById('looptijd')?.value,
    kilometers: document.getElementById('kilometers')?.value,
    eigenrisico: formatPriceNL(document.getElementById('eigenrisico')?.value),
    maandbedrag: formatPriceNL(document.getElementById('maandbedrag')?.value),
    banden: document.getElementById('banden')?.value,
    leverdatum: document.getElementById('leverdatum')?.value ? new Date(document.getElementById('leverdatum')?.value).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  };

  // Onderwerp
  const subjMap = {
    nl: {
      offerte: `Offerteaanvraag – ${merk} ${model}`,
      inruil: `Offerte ${merk} ${model} inclusief inruil`,
      lease: `Private lease ${merk} ${model}`,
      proefrit: `Bevestiging proefrit ${merk} ${model}`,
      afspraak: `Bevestiging afspraak ${merk} ${model}`,
      showroom: `Showroombezoek – Offerte ${merk} ${model}`,
      followup: `Follow-up offerte ${merk} ${model}`,
      status: `Status levering ${merk} ${model}`
    },
    en: {
      offerte: `Quote request – ${merk} ${model}`,
      inruil: `Quote including trade-in – ${merk} ${model}`,
      lease: `Private lease proposal – ${merk} ${model}`,
      proefrit: `Test drive confirmation – ${merk} ${model}`,
      afspraak: `Appointment confirmation – ${merk} ${model}`,
      showroom: `Showroom visit quote – ${merk} ${model}`,
      followup: `Follow-up quote – ${merk} ${model}`,
      status: `Delivery status – ${merk} ${model}`
    }
  };

  lastSubject = subjMap[currentLang][type];
  const bodyFunc = currentLang === 'nl' ? emailBodiesNL[type] : emailBodiesEN[type];
  lastBody = greet + "\n\n" + bodyFunc(data);

  document.getElementById('previewContent').innerText = lastBody;
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('outlookBtn').disabled = false;
}
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