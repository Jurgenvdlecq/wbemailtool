
function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const type = document.getElementById("emailtype").value;

  const aanspreking = (aanhef === "voornaam") ? `Beste ${voornaam},` :
                      aanhef === "heer" ? `Geachte heer ${achternaam},` :
                      `Geachte mevrouw ${achternaam},`;

  const model = document.getElementById("model").value;
  const kleur = document.getElementById("kleur")?.value;
  const prijs = document.getElementById("prijs")?.value;
  const levertijd = document.getElementById("levertijd")?.value;
  const inruilprijs = document.getElementById("inruilprijs")?.value;
  const kenteken = document.getElementById("kenteken")?.value;
  const datum = document.getElementById("datum")?.value;
  const tijd = document.getElementById("tijd")?.value;
  const looptijd = document.getElementById("looptijd")?.value;
  const kilometers = document.getElementById("kilometers")?.value;
  const eigenrisico = document.getElementById("eigenrisico")?.value;
  const maandbedrag = document.getElementById("maandbedrag")?.value;

  const datumFormatted = datum ? new Date(datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : "";

  let tekst = `${aanspreking}\n\n`;

  switch(type) {
    case "offerte":
      tekst += `Bedankt voor je interesse in de ${model}. Zoals besproken ontvang je hierbij de vrijblijvende offerte.\n\n`;
      tekst += `Uitvoering: ${kleur}\nRijklaarprijs: €${prijs}\nLevertijd: ${levertijd}\n\n`;
      tekst += `Mocht je de auto graag komen bekijken of een proefrit willen maken, dan hoor ik het graag.`;
      break;
    case "inruil":
      tekst += `Hierbij ontvang je de offerte voor een nieuwe ${model} in de kleur ${kleur}, inclusief een indicatie van de inruilwaarde van je huidige auto met kenteken ${kenteken}.\n\n`;
      tekst += `Rijklaarprijs: €${prijs}\nInruilvoorstel: €${inruilprijs} (geldig tot twee weken na vandaag)\nLevertijd: ${levertijd}\n\n`;
      tekst += `Graag nodig ik je uit in onze showroom voor een definitieve taxatie.`;
      break;
    case "proefrit":
      tekst += `Je proefrit met de ${model} is bevestigd voor ${datumFormatted} om ${tijd}.\n\n`;
      tekst += `We verwelkomen je graag bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet je rijbewijs niet mee te nemen.\n\nTot dan!`;
      break;
    case "afspraak":
      tekst += `De afspraak voor de ${model} is bevestigd voor ${datumFormatted} om ${tijd}.\n\n`;
      tekst += `We zien je graag bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Laat het gerust weten als er nog vragen zijn.`;
      break;
    case "showroom":
      tekst += `Bedankt voor je bezoek aan onze showroom. Zoals besproken ontvang je hierbij de offerte voor een ${model} in ${kleur}.\n\n`;
      tekst += `Prijs: €${prijs}\nLevertijd: ${levertijd}\n\nMocht je verdere vragen hebben of een vervolggesprek willen, laat het gerust weten.`;
      break;
    case "lease":
      tekst += `Hierbij ontvang je de private leaseofferte voor een ${model} in ${kleur}.\n\n`;
      tekst += `- Looptijd: ${looptijd} maanden\n- Kilometrage: ${kilometers} km/jaar\n- Maandbedrag: €${maandbedrag}\n- Eigen risico: €${eigenrisico}\n`;
      tekst += `- Inclusief onderhoud, verzekering, wegenbelasting, pechhulp en vervangend vervoer\n\n`;
      tekst += `Levertijd: ${levertijd}\nLaat me weten als je vragen hebt of deze auto graag wil reserveren.`;
      break;
    default:
      tekst += "Er is geen geldig e-mailtype geselecteerd.";
  }

  document.getElementById("output").textContent = tekst;

  const subject = `SEAT ${model} - ${type}`;
  const mailBody = encodeURIComponent(tekst);
  document.getElementById("outlookButton").href = `mailto:?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
  document.getElementById("outlookButton").style.display = 'inline-block';
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
