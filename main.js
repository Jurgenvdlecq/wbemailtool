// Wittebrug E-mailgenerator – main.js

// Modellen
const seatModels = ["Ibiza", "Leon", "Leon Sportstourer", "Arona", "Ateca"];
const cupraModels = ["Born", "Formentor", "Leon", "Leon Sportstourer", "Terramar", "Tavascan"];

// Helpers
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
function formatPriceNL(num) {
  return '€ ' + new Intl.NumberFormat('nl-NL').format(num) + ',-';
}

// Dropdown logica
function populateModels() {
  const merk = document.getElementById('merk').value;
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">-- Kies --</option>';
  const list = merk==='SEAT' ? seatModels : (merk==='CUPRA'?cupraModels:[]);
  list.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = m;
    modelSelect.appendChild(opt);
  });
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(()=>t.style.display='none',3000);
}

// Validatie
function validateField(id) {
  const f = document.getElementById(id), e = document.getElementById('error-'+id);
  if (f.required && !f.value.trim()) {
    f.classList.add('error'); e.textContent='Dit veld is verplicht'; e.style.display='block'; return false;
  }
  f.classList.remove('error'); if(e) e.style.display='none'; return true;
}
function validateForm() {
  let ok = true;
  ['aanhef','voornaam','achternaam','merk','model','emailtype'].forEach(id=>{
    if(!validateField(id)) ok=false;
  });
  document.querySelectorAll('.field-group').forEach(g=>{
    if(window.getComputedStyle(g).display!=='none'){
      const inp = g.querySelector('input,select');
      if(inp && inp.required && !validateField(inp.id)) ok=false;
    }
  });
  document.getElementById('generateBtn').disabled = !ok;
  return ok;
}

// Velden tonen/verbergen
function toggleFields() {
  const t = document.getElementById('emailtype').value;
  document.getElementById('veld-prijs').style.display = (t==='lease')?'none':'block';
  const map = {
    offerte:['prijs','levertijd'],
    inruil:['prijs','levertijd','inruilprijs','kenteken'],
    proefrit:['datum','tijd'],
    afspraak:['datum','tijd'],
    showroom:['prijs','levertijd'],
    lease:['levertijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup:['model'],status:['leverdatum']
  };
  ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum']
    .forEach(id=>{
      const el = document.getElementById('veld-'+id);
      if(el) el.style.display = map[t]?.includes(id)?'block':'none';
    });
  validateForm();
}

// Initialisatie
['aanhef','voornaam','achternaam','merk','model','emailtype','prijs','levertijd','datum','tijd','kilometers']
  .forEach(id=>document.getElementById(id)?.addEventListener('blur',()=>validateField(id)));

let currentLang='nl', lastSub='', lastBody='';

function updateLanguage(){
  currentLang = document.getElementById('languageSelect').value;
  if(!document.getElementById('copyBtn').disabled) generateEmail();
}

// E-mail genereren
function generateEmail(){
  if(!validateForm()){ showToast('Vul eerst alle verplichte velden in.'); return; }
  const aan = document.getElementById('aanhef').value;
  const fn = document.getElementById('voornaam').value.trim();
  const ln = document.getElementById('achternaam').value.trim();
  const merk = document.getElementById('merk').value;
  const model = document.getElementById('model').value;
  const type = document.getElementById('emailtype').value;

  // Aanhef
  let greet='';
  if(aan==='voornaam') greet = currentLang==='nl'?`Beste ${fn},`:`Dear ${fn},`;
  else if(aan==='heer') greet = currentLang==='nl'?`Beste heer ${ln},`:`Dear Mr. ${ln},`;
  else greet = currentLang==='nl'?`Beste mevrouw ${ln},`:`Dear Ms. ${ln},`;

  // Velden
  const pr = document.getElementById('prijs').value.trim();
  const prTxt = pr? formatPriceNL(pr):'';
  const lv = document.getElementById('levertijd').value.trim();
  const lvTxt = currentLang==='en'?translateDuration(lv):lv;
  const ip = document.getElementById('inruilprijs').value.trim();
  const kt = document.getElementById('kenteken').value.trim();
  const dt = document.getElementById('datum').value;
  const tm = document.getElementById('tijd').value;
  const km = document.getElementById('kilometers').value.trim();
  const er = document.getElementById('eigenrisico').value.trim();
  const mb = document.getElementById('maandbedrag').value.trim();
  const bd = document.getElementById('banden').value;
  const ld = document.getElementById('leverdatum').value;

  // Onderwerp templates
  const subjNl = {
    offerte:`Offerteaanvraag – ${merk} ${model}`,
    inruil:`Offerte ${merk} ${model} inclusief inruil`,
    lease:`Private lease ${merk} ${model}`,
    proefrit:`Bevestiging proefrit ${merk} ${model}`,
    afspraak:`Bevestiging afspraak ${merk} ${model}`,
    showroom:`Showroombezoek – Offerte ${merk} ${model}`,
    followup:`Follow-up offerte ${merk} ${model}`,
    status:`Status levering ${merk} ${model}`
  };
  const subjEn = {
    offerte:`Quote request – ${merk} ${model}`,
    inruil:`Quote including trade-in – ${merk} ${model}`,
    lease:`Private lease proposal – ${merk} ${model}`,
    proefrit:`Test drive confirmation – ${merk} ${model}`,
    afspraak:`Appointment confirmation – ${merk} ${model}`,
    showroom:`Showroom visit quote – ${merk} ${model}`,
    followup:`Follow-up quote – ${merk} ${model}`,
    status:`Delivery status – ${merk} ${model}`
  };
  lastSub = currentLang==='nl'?subjNl[type]:subjEn[type];

  // Body opbouw (voorbeeld Offerte)
  let body = greet + "\n\n";
  if(type==='offerte'){
    body += `Hartelijk dank voor uw interesse in de ${merk} ${model}.\n`;
    body += `De totale aanschafprijs bedraagt ${prTxt}, inclusief afleverkosten.\n`;
    body += `De verwachte levertijd is ongeveer ${lvTxt} na akkoord.\n\n`;
    body += `In de bijlage vindt u de complete offerte.\n`;
    body += `Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken.\n`;
  }
  // (breid uit voor de overige types...)

  lastBody = body;
  document.getElementById('previewContent').innerText = body;
  document.getElementById('copyBtn').disabled = false;
  document.getElementById('outlookBtn').disabled = false;
}

// Copy & Outlook
function copyEmail(){ navigator.clipboard.writeText(lastBody); showToast('E-mailtekst gekopieerd naar klembord'); }
function openInOutlook(){ window.location.href=`mailto:?subject=${encodeURIComponent(lastSub)}&body=${encodeURIComponent(lastBody)}`; }
function resetForm(){ document.getElementById('previewContent').innerText=''; document.getElementById('copyBtn').disabled=true; document.getElementById('outlookBtn').disabled=true; }

// Event listeners
document.getElementById('merk').addEventListener('change',()=>{populateModels();validateForm();});
document.getElementById('emailtype').addEventListener('change',()=>{toggleFields();validateForm();});
document.getElementById('emailForm').addEventListener('input', validateForm);
document.getElementById('generateBtn').addEventListener('click', generateEmail);
document.getElementById('copyBtn').addEventListener('click', copyEmail);
document.getElementById('outlookBtn').addEventListener('click', openInOutlook);
document.getElementById('resetBtn').addEventListener('click', resetForm);
document.getElementById('languageSelect').addEventListener('change', updateLanguage);

window.addEventListener('DOMContentLoaded', ()=>{
  populateModels();
  toggleFields();
  validateForm();
  updateLanguage();
});
