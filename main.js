function genereerEmail() {
    const klant = document.getElementById('klantnaam').value;
    const model = document.getElementById('model').value;
    const kleur = document.getElementById('kleur').value;
    const prijs = document.getElementById('prijs').value;
    const levertijd = document.getElementById('levertijd').value;
    const tekst = `Beste ${klant},\n\nBedankt voor je interesse in de SEAT ${model} in de kleur ${kleur}.\nDe rijklaarprijs bedraagt €${prijs}.\nDe levertijd is ${levertijd}.\n\nLaat het gerust weten als je vragen hebt.\n\nMet vriendelijke groet,\nWittebrug SEAT`;
    document.getElementById('emailPreview').innerText = tekst;
}

function kopieerTekst() {
    const tekst = document.getElementById('emailPreview').innerText;
    navigator.clipboard.writeText(tekst).then(() => {
        alert('Tekst gekopieerd!');
    });
}