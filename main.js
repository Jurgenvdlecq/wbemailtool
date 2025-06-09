
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("emailForm");
  const generateBtn = document.getElementById("generateBtn");
  const outlookBtn = document.getElementById("outlookBtn");
  const output = document.getElementById("output");
  const feedback = document.getElementById("feedback");

  // Invoervelden controleren
  const requiredFields = ["aanhef", "model", "merk", "emailtype"];
  requiredFields.forEach((id) => {
    document.getElementById(id).addEventListener("change", checkFormValidity);
  });

  function checkFormValidity() {
    const isValid = requiredFields.every(
      (id) => document.getElementById(id).value.trim() !== ""
    );
    generateBtn.disabled = !isValid;
  }

  generateBtn.addEventListener("click", genereerEmail);

  outlookBtn?.addEventListener("click", () => {
    const body = encodeURIComponent(output.innerText);
    window.location.href = `mailto:?subject=Wittebrug voorstel&body=${body}`;
  });
});

function kopieerTekst() {
  const tekst = document.getElementById("output").innerText;
  navigator.clipboard.writeText(tekst).then(() => {
    const feedback = document.getElementById("feedback");
    feedback.innerText = "Tekst gekopieerd naar klembord.";
    setTimeout(() => (feedback.innerText = ""), 3000);
  });
}

function genereerEmail() {
  const aanhef = document.getElementById("aanhef").value;
  const voornaam = document.getElementById("voornaam").value;
  const achternaam = document.getElementById("achternaam").value;
  const merk = document.getElementById("merk").value;
  const model = document.getElementById("model").value;
  const type = document.getElementById("emailtype").value;
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
  const leverdatum = document.getElementById("leverdatum")?.value;

  let aanspreking = "";
  if (aanhef === "voornaam") {
    aanspreking = `Beste ${voornaam},`;
  } else if (aanhef === "heer") {
    aanspreking = `Beste heer ${achternaam},`;
  } else if (aanhef === "mevrouw") {
    aanspreking = `Beste mevrouw ${achternaam},`;
  }

  const datumFormatted = datum
    ? new Date(datum).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const leverdatumFormatted = leverdatum
    ? new Date(leverdatum).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  let tekst = `${aanspreking}

`;

  if (type === "offerte") {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.
`;
    tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.

`;
    tekst += `In de bijlage vindt u de complete offerte.

`;
    tekst += `Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken.`;
  }

  if (type === "inruil") {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
    tekst += `Zoals besproken stuur ik u hierbij de offerte, inclusief de definitieve inruilwaarde voor uw huidige auto (kenteken ${kenteken}).

`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.
`;
    tekst += `De inruilwaarde van uw huidige auto bedraagt €${inruilprijs}.
`;
    tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.

`;
    tekst += `In de bijlage vindt u:
1. De offerte voor de ${merk} ${model} met specificaties en prijsdetails.
2. De taxatie van uw huidige auto.

`;
    tekst += `Heeft u nog vragen of wilt u langskomen voor een proefrit, dan hoor ik het graag.`;
  }

  if (type === "proefrit") {
    tekst += `Bedankt voor het plannen van de proefrit in de ${merk} ${model}!

`;
    tekst += `Hierbij bevestigen wij uw afspraak op ${datumFormatted} om ${tijd} uur.
`;
    tekst += `U bent van harte welkom bij Wittebrug SEAT, Donau 120 in Den Haag.
`;
    tekst += `Vergeet niet uw rijbewijs mee te nemen.`;
  }

  if (type === "afspraak") {
    tekst += `Bedankt voor het maken van een afspraak.

`;
    tekst += `Hierbij bevestigen wij uw bezoek met betrekking tot de ${merk} ${model} op ${datumFormatted} om ${tijd} uur.
`;
    tekst += `U bent van harte welkom op onze vestiging aan de Donau 120 in Den Haag.
`;
    tekst += `Mocht u vooraf vragen hebben, laat het gerust weten.`;
  }

  if (type === "showroom") {
    tekst += `Nogmaals bedankt voor uw bezoek aan onze showroom.

`;
    tekst += `Zoals besproken ontvangt u hierbij de offerte voor de ${merk} ${model}.
`;
    tekst += `De totaalprijs bedraagt €${prijs}, inclusief afleverkosten.

`;
    tekst += `Heeft u nog vragen of wilt u alsnog een proefrit maken? Neem gerust contact met ons op.`;
  }

  if (type === "lease") {
    tekst += `Bedankt voor uw interesse in private lease via Wittebrug.

`;
    tekst += `In deze e-mail vindt u ons voorstel voor de ${merk} ${model}:

`;
    tekst += `• Looptijd: ${looptijd} maanden
• Kilometers per jaar: ${kilometers}
• Eigen risico: €${eigenrisico}
• Maandbedrag: €${maandbedrag} incl. btw
• Banden: ${banden}

`;
    tekst += `De volledige leaseofferte vindt u in de bijlage. We lichten deze graag toe als u dat wenst.

`;
    tekst += `Wanneer u akkoord gaat met dit voorstel, kunnen wij de online leaseaanvraag voor u starten.`;
  }

  if (type === "status") {
    tekst += `Hierbij informeer ik u over de actuele status van uw bestelling.

`;
    tekst += `De verwachte leverdatum voor uw ${merk} ${model} is: ${leverdatumFormatted}.

`;
    tekst += `Heeft u vragen? Neem gerust contact met ons op.`;
  }

  document.getElementById("output").innerText = tekst;
  document.getElementById("outlookBtn").style.display = "inline-block";
}
