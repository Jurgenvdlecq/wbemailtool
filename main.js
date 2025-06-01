
function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const type = document.getElementById("emailtype").value;

  const aanspreking = (aanhef === "voornaam") ? `Beste ${voornaam},` :
                      aanhef === "heer" ? `Geachte heer ${achternaam},` :
                      `Geachte mevrouw ${achternaam},`;

  const model = document.getElementById("model")?.value || "";
  const uitvoering = document.getElementById("kleur")?.value || "";
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
    tekst += `In de kleur ${uitvoering}.\n`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.\n`;
    tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.\n\n`;
    tekst += `De offerte heb ik toegevoegd als bijlage.\n\n`;
    tekst += `Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken. Laat het gerust weten als ik u ergens mee kan helpen of als u de offerte verder wilt bespreken.`;
  }

  if (type === "inruil") {
    tekst += `Leuk om u zojuist gesproken te hebben! Bedankt voor uw interesse in de SEAT ${model}.\n\n`;
    tekst += `Zoals besproken heb ik een offerte voor u opgesteld, inclusief de taxatie van uw inruilauto.\n\n`;
    tekst += `✔️ De offerte voor de SEAT ${model} met specificaties en prijsdetails.\n✔️ De taxatie van uw huidige auto, met een inruilprijs van €${inruilprijs}.\n✔️ Eventuele financierings- of leaseopties (indien van toepassing).\n\n`;
    tekst += `De offerte heb ik toegevoegd als bijlage.\n\n`;
    tekst += `Ik ben erg benieuwd wat u van mijn voorstel vindt. Laat u het mij weten of alles naar wens is? Mocht u nog vragen hebben of aanpassingen willen bespreken, dan hoor ik dat graag.`;
  }

  if (type === "lease") {
    tekst += `Bedankt voor uw bezoek aan onze showroom en/of uw interesse in de SEAT ${model}.\n\n`;
    tekst += `Zoals beloofd deel ik hierbij het private lease voorstel. In deze e-mail licht ik de hoogtepunten toe:\n`;
    tekst += `• Model: SEAT ${model}\n• Uitvoering: ${uitvoering}\n• Maandbedrag: €${maandbedrag} per maand\n• Looptijd: ${looptijd}\n• Kilometrage: ${kilometers} km per jaar\n• Type banden: ${banden}\n• Eigen risico: €${eigenrisico}\n• Inclusief: Wegenbelasting, onderhoud, reparaties en allriskverzekering\n\n`;
    tekst += `Mocht u de private lease aanvraag willen starten, kunt u positief op deze mail reageren. Ik zal dan direct de aanvraag voor u starten.\n\n`;
    tekst += `U ontvangt daarna een link vanuit Volkswagen Pon Financial Services (VWPFS) om de krediettoetsing te doorlopen.\n\n`;
    tekst += `Ik hoor graag uw reactie op ons voorstel. Mocht u nog vragen hebben, laat het gerust weten. Ik help u graag verder.`;
  }

  if (type === "proefrit") {
    tekst += `Hierbij bevestigen wij uw proefritafspraak op ${datumFormatted} om ${tijd} met de SEAT ${model}.\n\n`;
    tekst += `Wij verwelkomen u bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet uw rijbewijs niet mee te nemen.\n\n`;
    tekst += `Neem gerust contact met ons op bij vragen of wijzigingen.\n\n`;
    tekst += `We kijken ernaar uit u te mogen ontvangen.`;
  }

  if (type === "afspraak") {
    tekst += `Leuk dat we een afspraak hebben gepland voor de SEAT ${model} op ${datumFormatted} om ${tijd}.\n\n`;
    tekst += `We ontvangen u graag bij Wittebrug SEAT, Donau 120 in Den Haag.\n\n`;
    tekst += `Heeft u nog vragen of wilt u de afspraak wijzigen? Laat het gerust even weten.\n\n`;
    tekst += `Tot dan!`;
  }

  if (type === "showroom") {
    tekst += `Bedankt voor uw bezoek aan onze showroom.\n\n`;
    tekst += `Zoals besproken ontvangt u hierbij de offerte voor de SEAT ${model} in de kleur ${uitvoering}.\n`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.\n`;
    tekst += `De verwachte levertijd is ${levertijd}.\n\n`;
    tekst += `De offerte heb ik als bijlage toegevoegd.\n\n`;
    tekst += `Heeft u nog vragen of opmerkingen? Ik hoor het graag.`;
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
  const outlookBtn = document.getElementById("outlookBtn");
  outlookBtn.onclick = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${mailBody}`;
  };
  outlookBtn.style.display = 'inline-block';

  // Feedback
  const feedback = document.getElementById("feedback");
  feedback.textContent = "✅ E-mailtekst is gegenereerd!";
  setTimeout(() => feedback.textContent = "", 3000);
}

function kopieerTekst() {
  const tekst = document.getElementById("output").textContent;
  navigator.clipboard.writeText(tekst);
}
