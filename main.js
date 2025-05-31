
function genereerEmail() {
  document.getElementById("output").textContent = "E-mailtekst gegenereerd op basis van invoer.";
  document.getElementById("outlookButton").href = "mailto:?subject=SEAT offerte&body=Voorbeeldtekst";
  document.getElementById("outlookButton").style.display = 'inline-block';
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
