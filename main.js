// Modellen
const seatModels = ["Ibiza","Leon","Leon Sportstourer","Arona","Ateca"];
const cupraModels = ["Born","Formentor","Leon","Leon Sportstourer","Terramar","Tavascan"];

// Price formatter
function formatPriceNL(val) {
  const num = Number(val) || 0;
  return '€ ' + new Intl.NumberFormat('nl-NL').format(num) + ',-';
}

let currentLang = 'nl';

document.addEventListener('DOMContentLoaded', () => {
  populateModels();
  toggleFields();
  validateForm();

  document.getElementById('languageSelect').addEventListener('change', e => {
    currentLang = e.target.value;
    generateEmail();
  });
  document.getElementById('merk').addEventListener('change', () => {
    populateModels();
    toggleFields();
    validateForm();
  });
  document.getElementById('emailtype').addEventListener('change', () => {
    toggleFields();
    validateForm();
  });

  // Validate inputs
  document.querySelectorAll('#aanhef, #voornaam, #achternaam, #model').forEach(el => {
    el.addEventListener('input', validateForm);
  });
  document.querySelectorAll('#prijs, #levertijd, #inruilprijs, #kenteken, #datum, #tijd, #looptijd, #kilometers, #eigenrisico, #maandbedrag, #banden, #leverdatum')
    .forEach(el => el.addEventListener('input', validateForm));

  document.getElementById('generateBtn').addEventListener('click', generateEmail);
  document.getElementById('outlookBtn').addEventListener('click', () => {
    const text = document.getElementById('output').innerText;
    const subject = currentLang==='nl' ? 'Voorstel Wittebrug' : 'Your Quote from Wittebrug';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  });
});

function populateModels() {
  const merk = document.getElementById('merk').value;
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">-- Kies --</option>';
  const list = merk==='SEAT' ? seatModels : (merk==='CUPRA'?cupraModels:[]);
  list.forEach(m => modelSelect.innerHTML += `<option value="${m}">${m}</option>`);
}

function validateForm() {
  const req = ['aanhef','voornaam','achternaam','merk','model','emailtype'];
  let ok = req.every(id => document.getElementById(id).value);
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
  (groups[type]||[]).forEach(id => {
    if(!document.getElementById(id).value) ok=false;
  });
  document.getElementById('generateBtn').disabled = !ok;
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
  const all = ['prijs','levertijd','inruilprijs','kenteken','datum','tijd','looptijd','kilometers','eigenrisico','maandbedrag','banden','leverdatum'];
  const type = document.getElementById('emailtype').value;
  all.forEach(id => {
    document.getElementById('veld-'+id).style.display = (groups[type]||[]).includes(id)?'block':'none';
  });
}

function generateEmail() {
  // Collect data
  const data = {
    naam: document.getElementById('voornaam').value.trim(),
    name: document.getElementById('voornaam').value.trim(),
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
  let greeting = '';
  if(currentLang==='nl') {
    const a = document.getElementById('aanhef').value;
    if(a==='voornaam') greeting = `Beste ${data.naam},`;
    else if(a==='heer') greeting = `Beste meneer ${document.getElementById('achternaam').value},`;
    else greeting = `Beste mevrouw ${document.getElementById('achternaam').value},`;
  } else {
    const a = document.getElementById('aanhef').value;
    if(a==='voornaam') greeting = `Dear ${data.name},`;
    else if(a==='heer') greeting = `Dear Mr. ${document.getElementById('achternaam').value},`;
    else greeting = `Dear Ms. ${document.getElementById('achternaam').value},`;
  }
  // Templates
  const nl = {
    offerte: d=>`${greeting}

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
De totale aanschafprijs bedraagt ${formatPriceNL(d.prijs)}
De geschatte levertijd is circa ${d.levertijd} na akkoord.

In de bijlage vindt u de complete offerte.
U bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
    inruil: d=>`${greeting}

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
Hierbij onze vrijblijvende offerte. Prijs ${formatPriceNL(d.prijs)}
Uw inruilauto (kenteken ${d.kenteken}) is gewaardeerd op ${formatPriceNL(d.inruilprijs)}
De levertijd bedraagt circa ${d.levertijd} na akkoord.

Graag hoor ik uw reactie.`,
    proefrit: d=>`${greeting}

Bedankt voor het plannen van de proefrit in de ${d.merk} ${d.model}!
Afspraak: ${d.datum} om ${d.tijd} uur.
Locatie: Wittebrug SEAT, Donau 120, Den Haag.
Vergeet uw rijbewijs niet.`,
    afspraak: d=>`${greeting}

Bedankt voor uw afspraak voor de ${d.merk} ${d.model} op ${d.datum} om ${d.tijd} uur.
U bent welkom aan Donau 120, Den Haag.
Heeft u vooraf vragen? Laat gerust weten.`,
    showroom: d=>`${greeting}

Nogmaals bedankt voor uw bezoek.
Hierbij de offerte voor de ${d.merk} ${d.model}.
Prijs ${formatPriceNL(d.prijs)}

Vragen? Graag!`,
    lease: d=>`${greeting}

Dank voor uw interesse in private lease.
Voorstel ${d.merk} ${d.model}:
• Looptijd: ${d.looptijd} maanden
• Km/jr: ${d.kilometers}
• ER: ${formatPriceNL(d.eigenrisico)}
• Maandbedrag: ${formatPriceNL(d.maandbedrag)} incl. btw
• Banden: ${d.banden}

In de bijlage volledige offerte.
Bij akkoord starten we aanvraag.`,
    followup: d=>`${greeting}

Onlangs stuurde ik de offerte voor de ${d.merk} ${d.model}.
Ik hoor graag uw feedback.`,
    status: d=>`${greeting}

Update bestelling ${d.merk} ${d.model}.
Verwachte leverdatum: ${d.leverdatum}.
Bij vragen, graag contact.`
  };
  const en = {
    offerte: d=>`${greeting}

Thank you for your interest in the ${d.merk} ${d.model}.
The total purchase price is ${formatPriceNL(d.prijs)} including delivery costs.
The estimated delivery time is approximately ${d.levertijd} upon confirmation.

You’ll find the full quote attached.
You’re welcome to visit our showroom for a viewing or test drive.`,
    inruil: d=>`${greeting}

Thank you for your interest in the ${d.merk} ${d.model}.
Please find our non-binding quote attached. Total ${formatPriceNL(d.prijs)} including delivery costs.
Your trade-in vehicle (license ${d.kenteken}) has been valued at ${formatPriceNL(d.inruilprijs)}.
Estimated delivery time: ${d.levertijd} upon confirmation.

I look forward to your feedback.`,
    proefrit: d=>`${greeting}

Thank you for booking a test drive in the ${d.merk} ${d.model}!
Appointment: ${d.datum} at ${d.tijd}.
Location: Wittebrug SEAT, Donau 120, The Hague.
Please bring your driver’s license.`,
    afspraak: d=>`${greeting}

Thank you for scheduling an appointment for the ${d.merk} ${d.model} on ${d.datum} at ${d.tijd}.
You’re welcome at Donau 120, The Hague.
If you have any questions beforehand, please let me know.`,
    showroom: d=>`${greeting}

Thank you again for visiting our showroom.
Here is the quote for the ${d.merk} ${d.model}.
Price: ${formatPriceNL(d.prijs)} including delivery costs.

If you have any questions or would like a test drive, feel free to contact us.`,
    lease: d=>`${greeting}

Thank you for your interest in private leasing.
Proposal for the ${d.merk} ${d.model}:
• Term: ${d.looptijd} months
• Annual mileage: ${d.kilometers} km
• Excess: ${formatPriceNL(d.eigenrisico)}
• Monthly payment: ${formatPriceNL(d.maandbedrag)} incl. VAT
• Tyres: ${d.banden}

Full proposal attached.
If you agree, we can start the online application.`,
    followup: d=>`${greeting}

You recently received our quote for the ${d.merk} ${d.model}.
I’d appreciate your feedback or any questions you have.`,
    status: d=>`${greeting}

Here’s an update on your order of the ${d.merk} ${d.model}.
Expected delivery date: ${d.leverdatum}.
If you have any questions, please contact me.`
  };

  const body = currentLang === 'en' ? en[type](data) : nl[type](data);
  document.getElementById('output').innerText = body;
  document.getElementById('outlookBtn').style.display = 'inline-block';
}

function kopieerTekst() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('feedback').innerText = 'Tekst gekopieerd!';
    setTimeout(() => document.getElementById('feedback').innerText = '', 2000);
  });
}
