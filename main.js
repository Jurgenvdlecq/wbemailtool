// Taalkeuze
let currentLang = 'nl';
document.getElementById('languageSelect').addEventListener('change', e => {
  currentLang = e.target.value;
  // bij language switch direct opnieuw genereren als er al tekst is
  if (!document.getElementById('output').innerText.trim() === false) {
    genereerEmail();
  }
});

// Model-lijsten
const seatModels = ["Ibiza","Leon","Leon Sportstourer","Arona","Ateca"];
const cupraModels = ["Born","Formentor","Leon","Leon Sportstourer","Terramar","Tavascan"];
document.getElementById('merk').addEventListener('change', () => {
  const merk = document.getElementById('merk').value;
  const select = document.getElementById('model');
  select.innerHTML = '<option value="">-- Kies --</option>';
  const list = merk === 'SEAT' ? seatModels : (merk==='CUPRA'?cupraModels:[]);
  list.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    select.appendChild(o);
  });
});

// Check validatie
function validateField(id) {
  const el = document.getElementById(id);
  const err = document.getElementById('error-'+id);
  if (el.required && !el.value.trim()) {
    err.textContent = 'Dit veld is verplicht';
    return false;
  }
  err.textContent = '';
  return true;
}
function checkForm() {
  const ok = ['aanhef','voornaam','achternaam','merk','model','emailtype']
    .map(validateField).every(v=>v);
  document.getElementById('generateBtn').disabled = !ok;
}
document.querySelectorAll('#emailForm input, #emailForm select')
  .forEach(i=>i.addEventListener('input', checkForm));

document.getElementById('generateBtn').addEventListener('click', genereerEmail);

// Kopieer functie
function kopieerTekst() {
  const t = document.getElementById('output').innerText;
  navigator.clipboard.writeText(t);
  document.getElementById('feedback').innerText = 'Tekst gekopieerd!';
  setTimeout(()=>document.getElementById('feedback').innerText='', 2000);
}

// E-mail templates
const templates = {
  nl: {
    offerte: d=>`Beste ${d.name},\n\nHartelijk dank voor uw interesse in de ${d.merk} ${d.model}.\nDe totale aanschafprijs bedraagt €${d.prijs}, inclusief afleverkosten.\nDe verwachte levertijd is circa ${d.levertijd} na akkoord.\n\nIn de bijlage vindt u de complete offerte.\nU bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
    inruil: d=>`Beste ${d.name},\n\nHartelijk dank voor uw interesse in de ${d.merk} ${d.model} en de bespreking van uw inruilwagen.\nHierbij ontvangt u onze vrijblijvende offerte. De totaalprijs bedraagt €${d.prijs}, inclusief afleverkosten.\nUw inruilauto (kenteken ${d.kenteken}) is gewaardeerd op €${d.inruilprijs}.\nDe verwachte levertijd is circa ${d.levertijd} na akkoord.\n\nIk ben erg benieuwd wat u van de offerte vindt. Mocht u vragen hebben, dan hoor ik dat graag!`,
    proefrit: d=>`Beste ${d.name},\n\nBedankt voor het plannen van uw proefrit in de ${d.merk} ${d.model}!\nHierbij bevestigen wij uw afspraak op ${d.datum} om ${d.tijd} uur.\nU bent van harte welkom bij Wittebrug SEAT, Donau 120 in Den Haag.\nVergeet niet uw rijbewijs mee te nemen.`,
    afspraak: d=>`Beste ${d.name},\n\nDank voor het maken van een afspraak.\nHierbij bevestigen wij uw bezoek voor de ${d.merk} ${d.model} op ${d.datum} om ${d.tijd} uur.\nU bent van harte welkom aan Donau 120, Den Haag.\nHeeft u vooraf nog vragen, laat het gerust weten.`,
    showroom: d=>`Beste ${d.name},\n\nNogmaals bedankt voor uw bezoek aan onze showroom.\nZoals besproken ontvangt u hierbij de offerte voor de ${d.merk} ${d.model}.\nDe totaalprijs bedraagt €${d.prijs}, inclusief afleverkosten.\n\nHeeft u nog vragen of wilt u een proefrit maken? Neem gerust contact op.`,
    lease: d=>`Beste ${d.name},\n\nBedankt voor uw interesse in private lease via Wittebrug.\nIn deze e-mail vindt u ons voorstel voor de ${d.merk} ${d.model}:\n• Looptijd: ${d.looptijd} maanden\n• Kilometerbundel: ${d.kilometers} km per jaar\n• Eigen risico: €${d.eigenrisico}\n• Maandbedrag: €${d.maandbedrag} incl. btw\n• Banden: ${d.banden}\n\nDe volledige leaseofferte vindt u in de bijlage. Wanneer u akkoord gaat, kunnen wij de online aanvraag starten via Volkswagen Pon Financial Services.`,
    followup: d=>`Beste ${d.name},\n\nOnlangs heeft u van mij de offerte voor de ${d.merk} ${d.model} ontvangen.\nIk ben benieuwd naar uw reactie en of u nog vragen heeft.\n\nLaat gerust weten hoe ik u verder kan helpen.`,
    status: d=>`Beste ${d.name},\n\nHierbij een update over uw bestelling van de ${d.merk} ${d.model}.\nDe verwachte leverdatum is ${d.leverdatum}. Dit is onder voorbehoud; wijzigingen melden wij direct.\n\nHeeft u vragen, dan hoor ik het graag.`
  },
  en: {
    offerte: d=>`Dear ${d.name},\n\nThank you for your interest in the ${d.merk} ${d.model}.\nThe total purchase price is €${d.prijs}, including delivery costs.\nThe estimated delivery time is approximately ${d.levertijd} upon confirmation.\n\nYou’ll find the full quote attached.\nYou’re welcome to visit our showroom for a viewing or test drive.`,
    inruil: d=>`Dear ${d.name},\n\nThank you for your interest in the ${d.merk} ${d.model} and for discussing your trade-in vehicle.\nPlease find our non-binding quote attached.\nThe total price is €${d.prijs}, including delivery costs.\nYour trade-in vehicle (license ${d.kenteken}) has been valued at €${d.inruilprijs}.\nThe estimated delivery time is about ${d.levertijd} after approval.\n\nI look forward to your feedback.\nShould you have any questions, please let me know!`,
    proefrit: d=>`Dear ${d.name},\n\nThank you for booking a test drive in the ${d.merk} ${d.model}!\nWe confirm your appointment on ${d.datum} at ${d.tijd}.\nYou’re welcome at Wittebrug SEAT, Donau 120 in The Hague.\nPlease remember to bring your driver’s license.`,
    afspraak: d=>`Dear ${d.name},\n\nThank you for scheduling an appointment.\nWe confirm your visit for the ${d.merk} ${d.model} on ${d.datum} at ${d.tijd}.\nYou’re welcome at our location: Donau 120, The Hague.\nIf you have any questions beforehand, please let us know.`,
    showroom: d=>`Dear ${d.name},\n\nThank you again for visiting our showroom.\nAs discussed, please find attached the quote for the ${d.merk} ${d.model}.\nThe total price is €${d.prijs}, including delivery costs.\n\nIf you have any questions or would like a test drive, please feel free to contact us.`,
    lease: d=>`Dear ${d.name},\n\nThank you for your interest in private leasing with Wittebrug.\nHere is our proposal for the ${d.merk} ${d.model}:\n• Term: ${d.looptijd} months\n• Annual mileage: ${d.kilometers} km\n• Excess: €${d.eigenrisico}\n• Monthly payment: €${d.maandbedrag} incl. VAT\n• Tyres: ${d.banden}\n\nThe full lease proposal is attached.\nShould you agree, we can initiate the online application via Volkswagen Pon Financial Services.`,
    followup: d=>`Dear ${d.name},\n\nYou recently received our quote for the ${d.merk} ${d.model}.\nI’m interested to hear your feedback or any questions you may have.\n\nPlease let me know how I can assist further.`,
    status: d=>`Dear ${d.name},\n\nHere’s an update on your order of the ${d.merk} ${d.model}.\nThe expected delivery date is ${d.leverdatum}. This date is provisional; we will inform you of any changes.\n\nIf you have any questions, feel free to contact me.`
  }
};

function genereerEmail() {
  const d = {
    name: document.getElementById('aanhef').value==='voornaam'
      ? document.getElementById('voornaam').value
      : document.getElementById('achternaam').value,
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

  const tpl = templates[currentLang][document.getElementById('emailtype').value];
  document.getElementById('output').innerText = tpl(d);
  document.getElementById('outlookBtn').style.display = 'inline-block';
}
