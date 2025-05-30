function genereerEmail() {
    const type = document.getElementById('emailtype').value;
    const klant = document.getElementById('klantnaam').value;
    const model = document.getElementById('model').value;
    const kleur = document.getElementById('kleur').value;
    const prijs = document.getElementById('prijs').value;
    const levertijd = document.getElementById('levertijd').value;
    let tekst = '';

    switch (type) {
        case 'internetlead':
            tekst = `Beste ${klant},\n\nBedankt voor je interesse in een nieuwe SEAT ${model} via onze website.\nZoals aangevraagd ontvang je hierbij een vrijblijvende offerte voor de uitvoering in ${kleur}.\n\nDe rijklaarprijs bedraagt €${prijs}, inclusief actiekorting, afleverpakket, leges en fabrieksgarantie.\nDe levertijd is ${levertijd} na akkoord.\n\nMocht je de auto graag in het echt willen bekijken of een proefrit willen plannen, laat het dan gerust weten.`;
            break;
        case 'telefonisch':
            tekst = `Beste ${klant},\n\nZoals telefonisch besproken stuur ik je hierbij de vrijblijvende offerte voor een nieuwe SEAT ${model} in de kleur ${kleur}.\n\nDe rijklaarprijs bedraagt €${prijs}, inclusief alle kosten en fabrieksgarantie.\nDe levertijd is circa ${levertijd} na akkoord.\n\nWil je de auto komen bekijken of heb je nog vragen over de specificaties? Laat het gerust weten.`;
            break;
        case 'showroom':
            tekst = `Beste ${klant},\n\nBedankt voor je bezoek aan onze showroom. Zoals besproken ontvang je hierbij de offerte voor een nieuwe SEAT ${model}, in de kleur ${kleur}.\n\nDe rijklaarprijs bedraagt €${prijs}, inclusief fabrieksgarantie, afleverpakket en leges.\nDe levertijd bedraagt ${levertijd} na akkoord.\n\nMocht je nog vragen hebben of de offerte verder willen bespreken, dan hoor ik het graag.`;
            break;
        case 'offerte_met_inruil':
            tekst = `Beste ${klant},\n\nHierbij ontvang je de offerte voor een nieuwe SEAT ${model} in ${kleur}, gecombineerd met een voorlopig inruilvoorstel voor je huidige auto.\n\nDe rijklaarprijs voor de nieuwe auto bedraagt €${prijs}.\nOp basis van de gegevens die je hebt doorgegeven, stellen we een voorlopige inruilwaarde voor (onder voorbehoud van inspectie).\n\nDe levertijd is ${levertijd} na akkoord. Ik nodig je graag uit voor een definitieve taxatie bij ons in de showroom.`;
            break;
        case 'offerte_zonder_inruil':
            tekst = `Beste ${klant},\n\nZoals besproken ontvang je hierbij de offerte voor een nieuwe SEAT ${model}, zonder inruil.\n\nDe uitvoering betreft ${kleur}.\nDe rijklaarprijs is €${prijs}, inclusief afleverpakket, garantie en leges.\nLevertijd: ${levertijd}.\n\nLaat me gerust weten wanneer je wilt langskomen of de offerte verder wilt bespreken.`;
            break;
        case 'private_lease':
            tekst = `Beste ${klant},\n\nHierbij ontvang je de private leaseofferte voor een nieuwe SEAT ${model} in ${kleur}.\n\n- Looptijd: 48 maanden\n- Kilometrage: 15.000 km/jaar\n- Maandbedrag: €XXX incl. btw\n- Inclusief: onderhoud, verzekering, wegenbelasting, pechhulp, vervangend vervoer\n\nDe levertijd is ${levertijd} na akkoord.\nLaat me weten of je nog vragen hebt of deze auto graag wil reserveren.`;
            break;
        case 'proefrit':
            tekst = `Beste ${klant},\n\nJe proefrit met de SEAT ${model} in ${kleur} is bevestigd.\nWe verwachten je graag op de afgesproken datum bij Wittebrug, Donau 120, 2491 BC in Den Haag.\n\nLaat het weten als je verhinderd bent of vragen hebt.\n\nTot dan!`;
            break;
        case 'afspraak':
            tekst = `Beste ${klant},\n\nJe afspraak staat gepland bij Wittebrug, Donau 120, 2491 BC in Den Haag.\nWe kijken ernaar uit je te ontvangen.\n\nLaat het weten als je verhinderd bent of iets wilt aanpassen.\n\nMet vriendelijke groet,\nWittebrug SEAT`;
            break;
    }

    document.getElementById('emailPreview').innerText = tekst;
}

function kopieerTekst() {
    const tekst = document.getElementById('emailPreview').innerText;
    navigator.clipboard.writeText(tekst).then(() => {
        alert('Tekst gekopieerd!');
    });
}