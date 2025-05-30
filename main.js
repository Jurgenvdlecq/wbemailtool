function genereerEmail() {
    const type = document.getElementById('emailtype').value;
    const klant = document.getElementById('klantnaam').value;
    const model = document.getElementById('model').value;
    const kleur = document.getElementById('kleur').value;
    const prijs = document.getElementById('prijs').value;
    const levertijd = document.getElementById('levertijd').value;
    let tekst = '';

    if (type === 'offerte') {
        tekst = `Beste ${klant},\n\nBedankt voor je interesse in de SEAT ${model} in ${kleur}.\nDe rijklaarprijs bedraagt €${prijs}.\nLevertijd: ${levertijd}.\n\nMet vriendelijke groet,\nWittebrug SEAT`;
    } else if (type === 'proefrit') {
        tekst = `Beste ${klant},\n\nJe proefrit met de SEAT ${model} in ${kleur} is bevestigd.\nWe verwachten je graag op de afgesproken datum.\n\nMet vriendelijke groet,\nWittebrug SEAT`;
    } else if (type === 'inruil') {
        tekst = `Beste ${klant},\n\nHierbij ontvang je de offerte voor de SEAT ${model} in ${kleur}.\nDe rijklaarprijs is €${prijs}.\nWe nemen graag je huidige auto in overweging voor inruil.\nLevertijd: ${levertijd}.\n\nMet vriendelijke groet,\nWittebrug SEAT`;
    }

    document.getElementById('emailPreview').innerText = tekst;
}

function kopieerTekst() {
    const tekst = document.getElementById('emailPreview').innerText;
    navigator.clipboard.writeText(tekst).then(() => {
        alert('Tekst gekopieerd!');
    });
}