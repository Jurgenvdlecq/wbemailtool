let currentLang = 'nl';
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('languageSelect').addEventListener('change', e => {
    currentLang = e.target.value;
    toggleFields(); validateForm();
  });
  ['aanhef','voornaam','achternaam','merk','model','emailtype'].forEach(id =>
    document.getElementById(id).addEventListener('input', ()=>{toggleFields(); validateForm();})
  );
  document.getElementById('generateBtn').addEventListener('click', generateEmail);
});

function validateForm() {
  const req = ['aanhef','voornaam','achternaam','merk','model','emailtype'];
  let ok = req.every(id=>document.getElementById(id).value);
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
  let type = document.getElementById('emailtype').value;
  groups[type].forEach(id=>{if(!document.getElementById(id).value) ok=false;});
  document.getElementById('generateBtn').disabled=!ok;
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
  const all = Object.values(groups).flat();
  const type = document.getElementById('emailtype').value;
  all.forEach(id=>document.getElementById('veld-'+id).style.display = groups[type].includes(id)?'block':'none');
}

function generateEmail() {
  const data = {naam:document.getElementById('voornaam').value.trim(),name:document.getElementById('voornaam').value.trim(),
    merk:document.getElementById('merk').value,model:document.getElementById('model').value,prijs:document.getElementById('prijs').value,
    levertijd:document.getElementById('levertijd').value,inruilprijs:document.getElementById('inruilprijs').value,
    kenteken:document.getElementById('kenteken').value,datum:document.getElementById('datum').value,tijd:document.getElementById('tijd').value,
    looptijd:document.getElementById('looptijd').value,kilometers:document.getElementById('kilometers').value,
    eigenrisico:document.getElementById('eigenrisico').value,maandbedrag:document.getElementById('maandbedrag').value,
    banden:document.getElementById('banden').value,leverdatum:document.getElementById('leverdatum').value};
  const nl={offerte:d=>`Beste ${d.naam},

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
De totale aanschafprijs bedraagt € ${d.prijs}, inclusief afleverkosten.
De geschatte levertijd is circa ${d.levertijd} na akkoord.

In de bijlage vindt u de complete offerte.
U bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
    inruil:d=>`Beste ${d.naam},

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
Hierbij onze vrijblijvende offerte. Prijs € ${d.prijs}, inclusief afleverkosten.
Uw inruilauto (kenteken ${d.kenteken}) is gewaardeerd op € ${d.inruilprijs}.
De levertijd bedraagt circa ${d.levertijd}.

Graag hoor ik uw reactie.`,
    proefrit:d=>`Beste ${d.naam},

Bedankt voor het plannen van de proefrit in de ${d.merk} ${d.model}!
Afspraak: ${d.datum} om ${d.tijd}.
Locatie: Wittebrug SEAT, Donau 120, Den Haag.
Vergeet uw rijbewijs niet.`,
    afspraak:d=>`Beste ${d.naam},

Bedankt voor uw afspraak voor de ${d.merk} ${d.model} op ${d.datum} om ${d.tijd}.
U bent welkom aan Donau 120, Den Haag.
Vragen? Laat het weten.`,
    showroom:d=>`Beste ${d.naam},

Nogmaals bedankt voor uw bezoek.
Hierbij de offerte voor de ${d.merk} ${d.model}.
Prijs € ${d.prijs}, inclusief afleverkosten.
Vragen? Graag!`,
    lease:d=>`Beste ${d.naam},

Dank voor uw interesse in private lease.
Voorstel ${d.merk} ${d.model}:
• Looptijd: ${d.looptijd} maanden
• Km/jr: ${d.kilometers}
• ER: € ${d.eigenrisico}
• Maandbedrag: € ${d.maandbedrag} incl. btw
• Banden: ${d.banden}

In de bijlage volledige offerte.
Bij akkoord starten we aanvraag.`,
    followup:d=>`Beste ${d.naam},

Onlangs stuurde ik de offerte voor de ${d.merk} ${d.model}.
Ik hoor graag uw feedback.`,
    status:d=>`Beste ${d.naam},

Update bestelling ${d.merk} ${d.model}.
Verwachte leverdatum: ${d.leverdatum}.
Bij vragen, graag contact.`
  };
  const en={offerte:d=>`Dear ${d.name},

Thank you for your interest in the ${d.merk} ${d.model}.
The total purchase price is € ${d.prijs}, including delivery costs.
The estimated delivery time is approximately ${d.levertijd} upon confirmation.

You’ll find the full quote attached.
You’re welcome to visit our showroom for a viewing or test drive.`,
    inruil:d=>`Dear ${d.name},

Thank you for your interest in the ${d.merk} ${d.model}.
Please find our non-binding quote attached. Total € ${d.prijs}, including delivery costs.
Your trade-in vehicle (license ${d.kenteken}) has been valued at € ${d.inruilprijs}.
Estimated delivery time: ${d.levertijd}.

I look forward to your feedback.`,
    proefrit:d=>`Dear ${d.name},

Thank you for booking a test drive in the ${d.merk} ${d.model}!
Appointment: ${d.datum} at ${d.tijd}.
Location: Wittebrug SEAT, Donau 120, The Hague.
Please bring your driver’s license.`,
    afspraak:d=>`Dear ${d.name},

Thank you for scheduling an appointment for the ${d.merk} ${d.model} on ${d.datum} at ${d.tijd}.
You’re welcome at Donau 120, The Hague.
Questions? Let me know.`,
    showroom:d=>`Dear ${d.name},

Thank you again for visiting our showroom.
Here is the quote for the ${d.merk} ${d.model}.
Price: € ${d.prijs}, including delivery costs.
Questions? Please contact us.`,
    lease:d=>`Dear ${d.name},

Thank you for your interest in private leasing.
Proposal for the ${d.merk} ${d.model}:
• Term: ${d.looptijd} months
• Annual mileage: ${d.kilometers} km
• Excess: € ${d.eigenrisico}
• Monthly payment: € ${d.maandbedrag} incl. VAT
• Tyres: ${d.banden}

Full proposal attached.
If you agree, we can start the online application.`,
    followup:d=>`Dear ${d.name},

You recently received our quote for the ${d.merk} ${d.model}.
I’d appreciate your feedback or any questions you have.`,
    status:d=>`Dear ${d.name},

Update on your order of the ${d.merk} ${d.model}.
Expected delivery date: ${d.leverdatum}.
If you have any questions, please contact me.`
  };
  const bodies = currentLang==='en'?en:nl;
  const type = document.getElementById('emailtype').value;
  const text = bodies[type](data);
  document.getElementById('output').innerText = text;
  document.getElementById('outlookBtn').style.display = 'inline-block';
}

function kopieerTekst() {
  const text = document.getElementById('output').innerText;
  navigator.clipboard.writeText(text).then(()=>{
    document.getElementById('feedback').innerText = 'Tekst gekopieerd!';
    setTimeout(()=>document.getElementById('feedback').innerText='',2000);
  });
}
