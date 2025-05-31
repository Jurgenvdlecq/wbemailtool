
function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const type = document.getElementById("emailtype").value;
  const model = document.getElementById("model").value;
  const kleur = document.getElementById("kleur").value;
  const prijs = document.getElementById("prijs").value;
  const levertijd = document.getElementById("levertijd").value;
  const inruilprijs = document.getElementById("inruilprijs").value;
  const kenteken = document.getElementById("kenteken").value;
  const datum = document.getElementById("datum").value;
  const tijd = document.getElementById("tijd").value;
  const looptijd = document.getElementById("looptijd").value;
  const kilometers = document.getElementById("kilometers").value;
  const eigenrisico = document.getElementById("eigenrisico").value;
  const maandbedrag = document.getElementById("maandbedrag").value;

  const output = document.getElementById("output");

  let tekst = "Beste klant,\n\nHier komt de juiste mailtekst afhankelijk van het gekozen type.\n";

  output.textContent = tekst;

  const subject = "SEAT aanvraag";
  const mailBody = encodeURIComponent(tekst);
  document.getElementById("outlookButton").href = `mailto:?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
  document.getElementById("outlookButton").style.display = 'inline-block';
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
