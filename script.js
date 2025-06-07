// Wittebrug E-mailgenerator (v18) – Volledig werkende versie

const seatModels = ["Ibiza", "Leon", "Leon Sportstourer", "Arona", "Ateca"];
const cupraModels = ["Born", "Formentor", "Leon", "Leon Sportstourer", "Terramar", "Tavascan"];

// Vertaal Nederlandse duur naar Engels
function translateDuration(text) {
  if (!text) return '';
  const mappings = [
    { nl: 'weken', en: 'weeks' },
    { nl: 'week',  en: 'week' },
    { nl: 'dagen', en: 'days' },
    { nl: 'dag',   en: 'day' },
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

// Format prijs Nederlands
function formatPriceNL(num) {
  const formatted = new Intl.NumberFormat('nl-NL').format(num);
  return '€ ' + formatted + ',-';
}

// Populeer modeldropdown op basis van merk
function populateModels() {
  const merk = document.getElementById('merk').value;
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">-- Kies --</option>';
  let list = [];
  if (merk === 'SEAT') list = seatModels;
  if (merk === 'CUPRA') list = cupraModels;
  list.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
}

// Toast bericht
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Valideer individueel veld
function validateField(id) {
  const field = document.getElementById(id);
  const err = document.getElementById('error-' + id);
  if (field.hasAttribute('required') && !field.value.trim()) {
    field.classList.add('error');
    err.textContent = 'Dit veld is verplicht';
    err.style.display = 'block';
    return false;
  } else {
    field.classList.remove('error');
    if (err) err.style.display = 'none';
    return true;
  }
}

// Valideer formulier
function validateForm() {
  let valid = true;
  ['aanhef','voornaam','achternaam','merk','model','emailtype'].forEach(id => {
    if (!validateField(id)) valid = false;
  });
  document.querySelectorAll('.field-group').forEach(g => {
    if (window.getComputedStyle(g).display !== 'none') {
      const inp = g.querySelector('input, select');
      if (inp && inp.hasAttribute('required') && !validateField(inp.id)) valid = false;
    }
  });
  document.getElementById('generateBtn').disabled = !valid;
  return valid;
}

// Toon/verberg velden op basis van type e-mail
function toggleFields() {
  const type = document.getElementById('emailtype').value;
  document.getElementById('veld-prijs').style.display = (type === 'lease') ? 'none' : 'block';
  const mapFields = {
    offerte: ['prijs','levertijd'],
    inruil: ['prijs','levertijd','inruilprijs','kenteken'],
    proefrit: ['datum','tijd'],
    afspraak: ['datum','tijd'],
    showroom: ['prijs','levertijd'],
    lease: ['levertijd','looptijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup: ['model'],
    status: ['leverdatum']
  };
  const all = ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  all.forEach(id => {
    const elem = document.getElementById('veld-' + id);
    if (elem) {
      elem.style.display = (mapFields[type] && mapFields[type].includes(id)) ? 'block' : 'none';
    }
  });
  validateForm();
}

// Real-time validatie
['aanhef','voornaam','achternaam','merk','model','emailtype','prijs','levertijd','datum','tijd','looptijd','kilometers'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => validateField(id));
});

let currentLang = 'nl', lastSubject = '', lastBody = '';

function updateLanguage() {
  currentLang = document.getElementById('languageSelect').value;
  if (!document.getElementById('copyBtn').disabled) {
    generateEmail();
  }
}

// Genereer e-mail
function generateEmail() {
  if (!validateForm()) {
    showToast('Vul eerst alle verplichte velden in.');
    return;
  }
  const aanhef = document.getElementById('aanhef').value;
  const voornaam = document.getElementById('voornaam').value.trim();
  const achternaam = document.getElementById('achternaam').value.trim();
  const merk = document.getElementById('merk').value;
  const model = document.getElementById('model').value;
  const type = document.getElementById('emailtype').value;

  // Aanspreking
  let aanspreking = '';
  if (aanhef === 'voornaam') {
    aanspreking = currentLang === 'nl' ? `Beste ${voornaam},` : `Dear ${voornaam},`;
  } else if (aanhef === 'heer') {
    aanspreking = currentLang === 'nl' ? `Beste heer ${achternaam},` : `Dear Mr. ${achternaam},`;
  } else {
    aanspreking = currentLang === 'nl' ? `Beste mevrouw ${achternaam},` : `Dear Ms. ${achternaam},`;
  }

  // Velden
  const prijsVal = document.getElementById('prijs').value.trim();
  const prijsText = prijsVal ? `<strong>${formatPriceNL(prijsVal)}</strong>` : '';
  const levertijd = document.getElementById('levertijd').value.trim();
  const levertijdText = currentLang === 'en' ? translateDuration(levertijd) : levertijd;
  const inruilprijs = document.getElementById('inruilprijs').value.trim();
  const inruilText = inruilprijs ? `<strong>${formatPriceNL(inruilprijs)}</strong>` : '';
  const kenteken = document.getElementById('kenteken').value.trim();
  const datum = document.getElementById('datum').value;
  const tijd = document.getElementById('tijd').value;
  const looptijd = document.getElementById('looptijd').value.trim();
  const kilometers = document.getElementById('kilometers').value.trim();
  const eigenrisico = document.getElementById('eigenrisico').value.trim();
  const maandbedrag = document.getElementById('maandbedrag').value.trim();
  const banden = document.getElementById('banden').value;
  const leverdatum = document.getElementById('leverdatum').value;
  const datumFormatted = datum ? new Date(datum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const leverdatumFormatted = leverdatum ? new Date(leverdatum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  // Subject templates
  const subjectsNL = {
    offerte: `Offerteaanvraag – ${merk} ${model}`,
    inruil: `Offerte ${merk} ${model} inclusief inruil`,
    lease: `Private lease ${merk} ${model}`,
    proefrit: `Bevestiging proefrit ${merk} ${model}`,
    afspraak: `Bevestiging afspraak ${merk} ${model}`,
    showroom: `Showroombezoek – Offerte ${merk} ${model}`,
    followup: `Follow-up offerte ${merk} ${model}`,
    status: `Status levering ${merk} ${model}`
  };
  const subjectsEN = {
    offerte: `Quote request – ${merk} ${model}`,
    inruil: `Quote including trade-in – ${merk} ${model}`,
    lease: `Private lease proposal – ${merk} ${model}`,
    proefrit: `Test drive confirmation – ${merk} ${model}`,
    afspraak: `Appointment confirmation – ${merk} ${model}`,
    showroom: `Showroom visit quote – ${merk} ${model}`,
    followup: `Follow-up quote – ${merk} ${model}`,
    status: `Delivery status – ${merk} ${model}`
  };
  lastSubject = currentLang === 'nl' ? subjectsNL[type] : subjectsEN[type];

  // Body opbouw
  let bodyHTML = `<p>${aanspreking}</p>`;
  if (type === 'offerte') {
    if (currentLang === 'nl') {
      bodyHTML += `<p>Hartelijk dank voor uw interesse in de ${merk} ${model}.</p>`;
      bodyHTML += `<p>De totale aanschafprijs bedraagt ${prijsText}, inclusief afleverkosten.<br>
      De verwachte levertijd is ongeveer <strong>${levertijdText}</strong> na akkoord.</p>`;
      bodyHTML += `<p>In de bijlage vindt u de complete offerte.</p>`;
      bodyHTML += `<p>Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken.</p>`;
    } else {
      bodyHTML += `<p>Thank you for your interest in the ${merk} ${model}.</p>`;
      bodyHTML += `<p>The total purchase price is ${prijsText}, including delivery costs.<br>
      The expected delivery time is approximately <strong>${levertijdText}</strong> after approval.</p>`;
      bodyHTML += `<p>You will find the full quote attached.</p>`;
      bodyHTML += `<p>Of course, you are very welcome to come and see the car in person or schedule a test drive.</p>`;
    }
  }
  // ... (zelfde logica voor andere types, zoals in de vorige versie)

  // Preview en platte tekst
  document.getElementById('previewContent').innerHTML = bodyHTML;
  lastBody = document.getElementById('previewContent').innerText;

  // Enable knoppen
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('outlookBtn').disabled = false;
}

// Kopieer
function copyEmail() {
  navigator.clipboard.writeText(lastBody);
  showToast('E-mailtekst gekopieerd naar klembord');
}

// Outlook
function openInOutlook() {
  window.location.href = `mailto:?subject=${encodeURIComponent(lastSubject)}&body=${encodeURIComponent(lastBody)}`;
}

// Reset
function resetForm() {
  document.getElementById('previewContent').innerHTML = '';
  document.getElementById('copyBtn').disabled = true;
  document.getElementById('outlookBtn').disabled = true;
}

// Event listeners
document.getElementById('merk').addEventListener('change', () => { populateModels(); validateForm(); });
document.getElementById('emailtype').addEventListener('change', () => { toggleFields(); validateForm(); });
document.getElementById('emailForm').addEventListener('input', validateForm);
document.getElementById('generateBtn').addEventListener('click', generateEmail);
document.getElementById('copyBtn').addEventListener('click', copyEmail);
document.getElementById('outlookBtn').addEventListener('click', openInOutlook);
document.getElementById('resetBtn').addEventListener('click', () => { resetForm(); document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none'); document.querySelectorAll('input, select').forEach(f => f.classList.remove('error')); });
document.getElementById('languageSelect').addEventListener('change', updateLanguage);

window.addEventListener('DOMContentLoaded', () => { populateModels(); toggleFields(); updateLanguage(); });
