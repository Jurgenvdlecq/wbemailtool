// Wittebrug E-mailgenerator (v17)
// Models
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
    const re = new RegExp('\b(\d+)\s*' + m.nl + '\b', 'gi');
    result = result.replace(re, '$1 ' + m.en);
  });
  return result;
}
function formatPriceNL(num) {
  const formatted = new Intl.NumberFormat('nl-NL').format(num);
  return '€ ' + formatted + ',-';
}

// Populate models
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

// Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// Validation
function validateField(id) {
  const f = document.getElementById(id);
  const err = document.getElementById('error-' + id);
  if (f.hasAttribute('required') && !f.value.trim()) {
    f.classList.add('error');
    err.textContent = 'Dit veld is verplicht';
    err.style.display = 'block';
    return false;
  } else {
    f.classList.remove('error');
    if (err) err.style.display = 'none';
    return true;
  }
}
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

// Toggle fields
function toggleFields() {
  const type = document.getElementById('emailtype').value;
  document.getElementById('veld-prijs').style.display = (type==='lease')?'none':'block';
  const map = {
    offerte:['prijs','levertijd'],
    inruil:['prijs','levertijd','inruilprijs','kenteken'],
    proefrit:['datum','tijd'],
    afspraak:['datum','tijd'],
    showroom:['prijs','levertijd'],
    lease:['levertijd','looptijd','kilometers','eigenrisico','maandbedrag','banden'],
    followup:['model'],status:['leverdatum']
  };
  const all=['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  all.forEach(id=>{const el=document.getElementById('veld-'+id); if(el) el.style.display = (map[type] && map[type].includes(id))?'block':'none';});
  validateForm();
}

// Blur validation
['aanhef','voornaam','achternaam','merk','model','emailtype','prijs','levertijd','datum','tijd','looptijd','kilometers'].forEach(id=>{
  const el=document.getElementById(id); if(el) el.addEventListener('blur',()=>validateField(id));
});

let currentLang='nl', lastSubject='', lastBody='';

function updateLanguage(){
  currentLang=document.getElementById('languageSelect').value;
  if(!document.getElementById('copyBtn').disabled) generateEmail();
}

function generateEmail(){
  if(!validateForm()){ showToast('Vul eerst alle verplichte velden in.'); return; }
  const aan=document.getElementById('aanhef').value;
  const fn=document.getElementById('voornaam').value.trim();
  const ln=document.getElementById('achternaam').value.trim();
  const merk=document.getElementById('merk').value;
  const model=document.getElementById('model').value;
  const type=document.getElementById('emailtype').value;
  let greet='';
  if(aan==='voornaam') greet=currentLang==='nl'?`Beste ${fn},`:`Dear ${fn},`;
  else if(aan==='heer') greet=currentLang==='nl'?`Beste heer ${ln},`:`Dear Mr. ${ln},`;
  else greet=currentLang==='nl'?`Beste mevrouw ${ln},`:`Dear Ms. ${ln},`;
  const prVal=document.getElementById('prijs').value.trim();
  const prTxt=prVal?formatPriceNL(prVal):'';
  const lv=document.getElementById('levertijd').value.trim();
  const lvTxt=currentLang==='en'?translateDuration(lv):lv;
  const irp=document.getElementById('inruilprijs').value.trim();
  const kt=document.getElementById('kenteken').value.trim();
  const dt=document.getElementById('datum').value;
  const tm=document.getElementById('tijd').value;
  const lt=document.getElementById('looptijd').value.trim();
  const km=document.getElementById('kilometers').value.trim();
  const er=document.getElementById('eigenrisico').value.trim();
  const mb=document.getElementById('maandbedrag').value.trim();
  const bd=document.getElementById('banden').value;
  const ld=document.getElementById('leverdatum').value;
  const dtFmt=dt?new Date(dt).toLocaleDateString(currentLang==='nl'?'nl-NL':'en-US',{day:'numeric',month:'long',year:'numeric'}):'';
  const ldFmt=ld?new Date(ld).toLocaleDateString(currentLang==='nl'?'nl-NL':'en-US',{day:'numeric',month:'long',year:'numeric'}):'';
  const subjNL={offerte:`Offerteaanvraag – ${merk} ${model}`,inruil:`Offerte ${merk} ${model} inclusief inruil`,lease:`Private lease ${merk} ${model}`,proefrit:`Bevestiging proefrit ${merk} ${model}`,afspraak:`Bevestiging afspraak ${merk} ${model}`,showroom:`Showroombezoek – Offerte ${merk} ${model}`,followup:`Follow-up offerte ${merk} ${model}`,status:`Status levering ${merk} ${model}`};
  const subjEN={offerte:`Quote request – ${merk} ${model}`,inruil:`Quote including trade-in – ${merk} ${model}`,lease:`Private lease proposal – ${merk} ${model}`,proefrit:`Test drive confirmation – ${merk} ${model}`,afspraak:`Appointment confirmation – ${merk} ${model}`,showroom:`Showroom visit quote – ${merk} ${model}`,followup:`Follow-up quote – ${merk} ${model}`,status:`Delivery status – ${merk} ${model}`};
  const subject=currentLang==='nl'?subjNL[type]:subjEN[type];
  lastSubject=subject;
  let body=`${greet}

`;
  // Here you insert full content based on type as in v16...
  body+=`[...]`;
  lastBody=body;
  document.getElementById('previewContent').innerText=body;
  document.getElementById('copyBtn').disabled=false;
  document.getElementById('outlookBtn').disabled=false;
}

function copyEmail(){ navigator.clipboard.writeText(lastBody); showToast('E-mailtekst gekopieerd naar klembord'); }
function openInOutlook(){ window.location.href=`mailto:?subject=${encodeURIComponent(lastSubject)}&body=${encodeURIComponent(lastBody)}`; }
function resetForm(){ document.getElementById('previewContent').innerText=''; document.getElementById('copyBtn').disabled=true; document.getElementById('outlookBtn').disabled=true; }

document.getElementById('merk').addEventListener('change',()=>{populateModels();validateForm();});
document.getElementById('emailtype').addEventListener('change',()=>{toggleFields();validateForm();});
document.getElementById('emailForm').addEventListener('input',validateForm);
document.getElementById('generateBtn').addEventListener('click',generateEmail);
document.getElementById('copyBtn').addEventListener('click',copyEmail);
document.getElementById('outlookBtn').addEventListener('click',openInOutlook);
document.getElementById('resetBtn').addEventListener('click',()=>{resetForm();document.querySelectorAll('.error-message').forEach(e=>e.style.display='none');document.querySelectorAll('input,select').forEach(f=>f.classList.remove('error'));});
document.getElementById('languageSelect').addEventListener('change',updateLanguage);

window.addEventListener('DOMContentLoaded',()=>{populateModels();toggleFields();updateLanguage();});
