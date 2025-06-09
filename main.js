
let currentLang = 'nl';
document.getElementById('languageSelect').addEventListener('change', e => {
  currentLang = e.target.value;
});

// Templates
const emailBodiesNL = {
  offerte: d => `Beste ${d.naam},

Hartelijk dank voor uw interesse in de ${d.merk} ${d.model}.
De totale aanschafprijs bedraagt € ${d.prijs}, inclusief afleverkosten.
De geschatte levertijd is circa ${d.levertijd} na akkoord.

In de bijlage vindt u de complete offerte.
U bent van harte welkom in onze showroom voor een bezichtiging of proefrit.`,
  /*... overige NL templates ...*/
};

const emailBodiesEN = {
  offerte: d => `Dear ${d.name},

Thank you for your interest in the ${d.merk} ${d.model}.
The total purchase price is € ${d.prijs}, including delivery costs.
The estimated delivery time is approximately ${d.levertijd} upon confirmation.

You’ll find the full quote attached.
You’re welcome to visit our showroom for a viewing or test drive.`,
  /*... overige EN templates ...*/
};

function generateEmail() {
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
  const type = document.getElementById('emailtype').value;
  const template = currentLang === 'nl' ? emailBodiesNL[type] : emailBodiesEN[type];
  const text = template(data);
  document.getElementById('output').innerText = text;
  document.getElementById('outlookBtn').style.display = 'inline-block';
}

