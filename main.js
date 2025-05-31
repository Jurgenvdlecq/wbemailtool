
function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const type = document.getElementById("emailtype").value;

  const aanspreking = (aanhef === "voornaam") ? `Beste ${voornaam},` :
                      aanhef === "heer" ? `Geachte heer ${achternaam},` :
                      `Geachte mevrouw ${achternaam},`;

  const jevorm = aanhef === "voornaam";
  const model = document.getElementById("model")?.value || "";
  const kleur = document.getElementById("kleur")?.value || "";
  const prijs = document.getElementById("prijs")?.value || "";
  const levertijd = document.getElementById("levertijd")?.value || "";
  const inruilprijs = document.getElementById("inruilprijs")?.value || "";
  const kenteken = document.getElementById("kenteken")?.value || "";
  const datum = document.getElementById("datum")?.value;
  const tijd = document.getElementById("tijd")?.value || "";
  const looptijd = document.getElementById("looptijd")?.value || "";
  const kilometers = document.getElementById("kilometers")?.value || "";
  const eigenrisico = document.getElementById("eigenrisico")?.value || "";
  const maandbedrag = document.getElementById("maandbedrag")?.value || "";

  const datumFormatted = datum ? new Date(datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : "";

  let tekst = `${aanspreking}\n\n`;

  if (type === "offerte") {
    tekst += jevorm
      ? `Bedankt voor je interesse in de SEAT ${model}. Zoals gevraagd ontvang je hierbij de vrijblijvende offerte voor de uitvoering in ${kleur}.\n\n`
      : `Bedankt voor uw interesse in de SEAT ${model}. Zoals gevraagd ontvangt u hierbij de vrijblijvende offerte voor de uitvoering in ${kleur}.\n\n`;
    tekst += `De rijklaarprijs bedraagt €${prijs}, inclusief afleverpakket, leges en fabrieksgarantie.\n`;
    tekst += `De verwachte levertijd is ${levertijd}.\n\n`;
    tekst += jevorm
      ? `Laat het gerust weten als je de auto in het echt wilt bekijken of een proefrit wilt maken.`
      : `Laat het gerust weten als u de auto in het echt wilt bekijken of een proefrit wilt maken.`;
  }

  if (type === "inruil") {
    tekst += jevorm
      ? `Zoals besproken ontvang je hierbij de offerte voor de SEAT ${model} in de kleur ${kleur}.\n\n`
      : `Zoals besproken ontvangt u hierbij de offerte voor de SEAT ${model} in de kleur ${kleur}.\n\n`;
    tekst += `De rijklaarprijs bedraagt €${prijs}.\n`;
    tekst += `Op basis van het kenteken ${kenteken} stellen we een voorlopige inruilwaarde voor van €${inruilprijs}.\n`;
    tekst += `Deze waarde is geldig gedurende twee weken.\n\n`;
    tekst += jevorm
      ? `We nodigen je graag uit in onze showroom voor een definitieve taxatie.`
      : `We nodigen u graag uit in onze showroom voor een definitieve taxatie.`;
  }

  if (type === "proefrit") {
    tekst += jevorm
      ? `Je proefrit met de SEAT ${model} is bevestigd voor ${datumFormatted} om ${tijd}.\n\n`
      : `Uw proefrit met de SEAT ${model} is bevestigd voor ${datumFormatted} om ${tijd}.\n\n`;
    tekst += `We ontvangen je graag bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet je rijbewijs niet mee te nemen.`;
  }

  if (type === "afspraak") {
    tekst += jevorm
      ? `Je afspraak voor de SEAT ${model} staat gepland op ${datumFormatted} om ${tijd}.\n\n`
      : `Uw afspraak voor de SEAT ${model} staat gepland op ${datumFormatted} om ${tijd}.\n\n`;
    tekst += `We ontvangen je graag bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag.`;
  }

  if (type === "showroom") {
    tekst += jevorm
      ? `Bedankt voor je bezoek aan onze showroom. Zoals besproken ontvang je hierbij de offerte voor de SEAT ${model} in de kleur ${kleur}.\n\n`
      : `Bedankt voor uw bezoek aan onze showroom. Zoals besproken ontvangt u hierbij de offerte voor de SEAT ${model} in de kleur ${kleur}.\n\n`;
    tekst += `De rijklaarprijs bedraagt €${prijs}, inclusief afleverpakket, leges en fabrieksgarantie.\n`;
    tekst += `De levertijd is ${levertijd}.`;
  }

  if (type === "lease") {
    tekst += jevorm
      ? `Hierbij ontvang je de private leaseofferte voor een nieuwe SEAT ${model} in ${kleur}.\n\n`
      : `Hierbij ontvangt u de private leaseofferte voor een nieuwe SEAT ${model} in ${kleur}.\n\n`;
    tekst += `- Looptijd: ${looptijd} maanden\n- Kilometrage: ${kilometers} km/jaar\n- Maandbedrag: €${maandbedrag}\n- Eigen risico: €${eigenrisico}\n`;
    tekst += `- Inclusief onderhoud, verzekering, wegenbelasting, pechhulp, vervangend vervoer\n\n`;
    tekst += `Levertijd: ${levertijd}`;
  }

  tekst += `\n\nMet vriendelijke groet,\nWittebrug SEAT`;

  document.getElementById("output").textContent = tekst;

  const onderwerp = {
    offerte: `Offerteaanvraag – SEAT ${model}`,
    inruil: `Offerte SEAT ${model} inclusief inruilvoorstel`,
    proefrit: `Bevestiging proefrit – SEAT ${model}`,
    afspraak: `Bevestiging afspraak – SEAT ${model}`,
    showroom: `Offerte SEAT ${model} – nav showroombezoek`,
    lease: `Private lease SEAT ${model} – voorstel`
  };

  const subject = onderwerp[type] || `SEAT ${model}`;
  const mailBody = encodeURIComponent(tekst);
  document.getElementById("outlookButton").href = `mailto:?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
  document.getElementById("outlookButton").style.display = 'inline-block';
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
