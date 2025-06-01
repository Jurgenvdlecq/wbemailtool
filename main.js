
function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const merk = document.getElementById("merk").value;
  const model = document.getElementById("model").value;
  const type = document.getElementById("emailtype").value;

  const aanspreking = `Beste ${achternaam},`;
  const jevorm = aanhef === "voornaam";

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
  const banden = document.getElementById("banden")?.value || "";

  const datumFormatted = datum ? new Date(datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : "";

  let tekst = `${aanspreking}\n\n`;

  if (type === "offerte") {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.\n\n`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.\n`;
    tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.\n\n`;
    tekst += `In de bijlage vindt u de complete offerte.\n\n`;
    tekst += `Uiteraard bent u van harte welkom om de auto in het echt te komen bekijken of een proefrit te maken.`;
  }

  if (type === "inruil") {
    tekst += `Bedankt voor uw interesse in de ${merk} ${model}.\n\n`;
    tekst += `Zoals besproken stuur ik u hierbij de offerte, inclusief de definitieve inruilwaarde voor uw huidige auto (kenteken ${kenteken}).\n\n`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.\n`;
    tekst += `De inruilwaarde van uw huidige auto bedraagt €${inruilprijs}.\n`;
    tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.\n\n`;
    tekst += `In de bijlage vindt u:\n`;
    tekst += `1. De offerte voor de ${merk} ${model} met specificaties en prijsdetails.\n`;
    tekst += `2. De taxatie van uw huidige auto, inclusief het inruilbedrag.\n`;
    tekst += `3. Optioneel: financierings- of leaseopties (indien van toepassing).\n\n`;
    tekst += `Graag nodig ik u uit voor een definitieve taxatie in onze showroom, zodat we het inruilbedrag definitief kunnen vaststellen.`;
  }

  if (type === "lease") {
    tekst += `Bedankt voor uw interesse in de ${merk} ${model}.\n\n`;
    tekst += `Zoals beloofd stuur ik hierbij ons private leasevoorstel. In deze e-mail vindt u de belangrijkste details:\n`;
    tekst += `• Model: ${merk} ${model}\n• Maandbedrag: €${maandbedrag} per maand\n• Looptijd: ${looptijd} maanden\n`;
    tekst += `• Kilometrage: ${kilometers} km per jaar\n• Type banden: ${banden}\n• Eigen risico: €${eigenrisico}\n`;
    tekst += `• Inclusief: Wegenbelasting, onderhoud, reparaties en allriskverzekering\n\n`;
    tekst += `Vervolgstappen:\n`;
    tekst += `1. Reageer positief op deze e-mail wanneer u de private lease-aanvraag wilt starten.\n`;
    tekst += `2. U ontvangt dan een e-mail van Volkswagen Pon Financial Services (VWPFS) om de krediettoetsing te doorlopen.\n\n`;
    tekst += `Laat me weten wat u ervan vindt of als u vragen heeft; ik help u graag verder!`;
  }

  if (type === "proefrit") {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.\n`;
    tekst += `Hierbij bevestigen wij graag uw proefritafspraak op ${datumFormatted} om ${tijd} met de ${merk} ${model}.\n\n`;
    tekst += `Wij ontvangen u bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet alstublieft uw rijbewijs niet mee te nemen.\n`;
    tekst += `Mocht u vooraf nog vragen hebben of iets willen wijzigen, neem gerust contact met ons op.`;
  }

  if (type === "afspraak") {
    tekst += `Leuk dat we een afspraak hebben gepland voor de ${merk} ${model} op ${datumFormatted} om ${tijd}.\n\n`;
    tekst += `U bent van harte welkom bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag.\n`;
    tekst += `Heeft u vooraf nog vragen of wilt u de afspraak wijzigen? Laat het gerust weten.`;
  }

  if (type === "showroom") {
    tekst += `Hartelijk dank voor uw bezoek aan onze showroom.\n`;
    tekst += `Zoals besproken ontvangt u hierbij de offerte voor de ${merk} ${model}.\n\n`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.\n`;
    tekst += `De verwachte levertijd is ${levertijd}.\n\n`;
    tekst += `De offerte heb ik als bijlage toegevoegd.\n`;
    tekst += `Heeft u nog vragen of opmerkingen? Laat het gerust weten; ik help u graag verder.`;
  }

  if (type === "followup") {
    tekst += `Beste ${achternaam},\n\n`;
    tekst += `Enige tijd geleden ontving u van mij de offerte voor de ${merk} ${model}.\n`;
    tekst += `Ik wilde even navragen of alles duidelijk is en of u nog vragen heeft over de offerte of de uitvoering.\n\n`;
    tekst += `Uiteraard sta ik voor u klaar om eventuele onderdelen van de offerte toe te lichten of alternatieve opties te bespreken.`;
  }

  // Append signature placeholder
  // signature is omitted

  document.getElementById("output").textContent = tekst;

  const onderwerp = {
    offerte: `Offerteaanvraag – ${merk} ${model}`,
    inruil: `Offerte ${merk} ${model} inclusief inruilvoorstel`,
    proefrit: `Bevestiging proefrit – ${merk} ${model}`,
    afspraak: `Bevestiging afspraak – ${merk} ${model}`,
    showroom: `Offerte ${merk} ${model} – nav showroombezoek`,
    lease: `Private lease ${merk} ${model} – voorstel`,
    followup: `Follow-up offerte – ${merk} ${model}`
  };

  const subject = onderwerp[type] || `${merk} ${model}`;
  const mailBody = encodeURIComponent(tekst);
  const outlookBtn = document.getElementById("outlookBtn");
  outlookBtn.onclick = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
  };
  outlookBtn.style.display = 'inline-block';

  const feedback = document.getElementById("feedback");
  feedback.textContent = "✅ E-mailtekst is gegenereerd!";
  setTimeout(() => feedback.textContent = "", 3000);
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
