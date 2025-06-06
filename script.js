// Script voor Wittebrug E-mailgenerator

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function validateField(id) {
  const field = document.getElementById(id);
  const error = document.getElementById('error-' + id);
  if (field.hasAttribute('required') && !field.value.trim()) {
    field.classList.add('error');
    error.textContent = 'Dit veld is verplicht';
    error.style.display = 'block';
    return false;
  } else {
    field.classList.remove('error');
    if (error) {
      error.style.display = 'none';
    }
    return true;
  }
}

function validateForm() {
  let valid = true;
  ['aanhef', 'merk', 'model', 'emailtype'].forEach(id => {
    if (!validateField(id)) valid = false;
  });
  // Validate visible fields
  document.querySelectorAll('.field-group').forEach(group => {
    if (group.style.display !== 'none') {
      const input = group.querySelector('input, select');
      if (input && input.hasAttribute('required')) {
        if (!validateField(input.id)) valid = false;
      }
    }
  });
  document.getElementById('generateBtn').disabled = !valid;
  return valid;
}

function toggleFields() {
  const type = document.getElementById('emailtype').value;
  const veldgroepen = {
    offerte: ['prijs', 'levertijd'],
    inruil: ['prijs', 'levertijd', 'inruilprijs', 'kenteken'],
    proefrit: ['datum', 'tijd'],
    afspraak: ['datum', 'tijd'],
    showroom: ['prijs', 'levertijd'],
    lease: ['prijs', 'levertijd', 'looptijd', 'kilometers', 'eigenrisico', 'maandbedrag', 'banden'],
    followup: ['model'],
    status: ['leverdatum']
  };
  const allFields = ['prijs', 'levertijd', 'inruilprijs', 'kenteken', 'datum', 'tijd', 'looptijd', 'kilometers', 'eigenrisico', 'maandbedrag', 'banden', 'leverdatum'];
  allFields.forEach(id => {
    const elem = document.getElementById('veld-' + id);
    if (elem) {
      elem.style.display = (veldgroepen[type] && veldgroepen[type].includes(id)) ? 'block' : 'none';
    }
  });
  validateForm();
}

function generateEmail() {
  if (!validateForm()) {
    showToast('Vul eerst alle verplichte velden in.');
    return;
  }
  const aanhef = document.getElementById('aanhef').value;
  const voornaam = document.getElementById('voornaam').value.trim();
  const achternaam = document.getElementById('achternaam').value.trim();
  const merk = document.getElementById('merk').value;
  const model = document.getElementById('model').value.trim();
  const type = document.getElementById('emailtype').value;

  let aanspreking = '';
  if (aanhef === 'voornaam') {
    aanspreking = `Beste ${voornaam},`;
  } else if (aanhef === 'heer') {
    aanspreking = `Beste heer ${achternaam},`;
  } else {
    aanspreking = `Beste mevrouw ${achternaam},`;
  }

  const prijs = document.getElementById('prijs').value.trim();
  const levertijd = document.getElementById('levertijd').value.trim();
  const inruilprijs = document.getElementById('inruilprijs').value.trim();
  const kenteken = document.getElementById('kenteken').value.trim();
  const datum = document.getElementById('datum').value;
  const tijd = document.getElementById('tijd').value;
  const looptijd = document.getElementById('looptijd').value.trim();
  const kilometers = document.getElementById('kilometers').value.trim();
  const eigenrisico = document.getElementById('eigenrisico').value.trim();
  const maandbedrag = document.getElementById('maandbedrag').value.trim();
  const banden = document.getElementById('banden').value;
  const leverdatum = document.getElementById('leverdatum').value;

  const datumFormatted = datum ? new Date(datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const leverdatumFormatted = leverdatum ? new Date(leverdatum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  let tekst = `${aanspreking}

`;

  if (type === 'offerte') {
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

  if (type === 'inruil') {
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
`;
    tekst += `1. De offerte voor de ${merk} ${model} met specificaties en prijsdetails.
`;
    tekst += `2. De taxatie van uw huidige auto, inclusief het inruilbedrag.
`;
    tekst += `3. Optioneel: financierings- of leaseopties (indien van toepassing).

`;
    tekst += `Graag nodig ik u uit voor een definitieve taxatie in onze showroom, zodat we het inruilbedrag definitief kunnen vaststellen.`;
  }

  if (type === 'lease') {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
    tekst += `Zoals beloofd stuur ik hierbij ons private leasevoorstel. In deze e-mail vindt u de belangrijkste details:
`;
    tekst += `• Model: ${merk} ${model}
• Maandbedrag: €${maandbedrag} per maand
• Looptijd: ${looptijd} maanden
`;
    tekst += `• Kilometrage: ${kilometers} km per jaar
• Type banden: ${banden}
• Eigen risico: €${eigenrisico}
`;
    tekst += `• Inclusief: Wegenbelasting, onderhoud, reparaties en allriskverzekering

`;
    tekst += `Vervolgstappen:
`;
    tekst += `1. Reageer positief op deze e-mail wanneer u de private lease-aanvraag wilt starten.
`;
    tekst += `2. U ontvangt dan een e-mail van Volkswagen Pon Financial Services (VWPFS) om de krediettoetsing te doorlopen.

`;
    tekst += `Laat me weten wat u ervan vindt of als u vragen heeft; ik help u graag verder!`;
  }

  if (type === 'proefrit') {
    tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
    tekst += `Hierbij bevestigen wij graag uw proefritafspraak op ${datumFormatted} om ${tijd} met de ${merk} ${model}.

`;
    tekst += `Wij ontvangen u bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet alstublieft uw rijbewijs niet mee te nemen.

`;
    tekst += `Mocht u vooraf nog vragen hebben of iets willen wijzigen, neem gerust contact met ons op.`;
  }

  if (type === 'afspraak') {
    tekst += `Leuk dat we een afspraak hebben gepland voor de ${merk} ${model} op ${datumFormatted} om ${tijd}.

`;
    tekst += `U bent van harte welkom bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag.

`;
    tekst += `Heeft u vooraf nog vragen of wilt u de afspraak wijzigen? Laat het gerust weten.`;
  }

  if (type === 'showroom') {
    tekst += `Hartelijk dank voor uw bezoek aan onze showroom.

`;
    tekst += `Zoals besproken ontvangt u hierbij de offerte voor de ${merk} ${model}.

`;
    tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.
`;
    tekst += `De verwachte levertijd is ${levertijd}.

`;
    tekst += `De offerte heb ik als bijlage toegevoegd.

`;
    tekst += `Heeft u nog vragen of opmerkingen? Laat het gerust weten; ik help u graag verder.`;
  }

  if (type === 'followup') {
    tekst += `Enige tijd geleden ontving u van mij de offerte voor de ${merk} ${model}.
`;
    tekst += `Ik hoor graag wat u ervan vindt en of u nog vragen heeft over de offerte of de uitvoering.

`;
    tekst += `Uiteraard sta ik voor u klaar om eventuele onderdelen van de offerte toe te lichten of alternatieve opties te bespreken.`;
  }

  if (type === 'status') {
    tekst += `Wij hebben voor u de ${merk} ${model} in bestelling staan en willen u graag op de hoogte houden van de status van deze bestelling.

`;
    tekst += `We verwachten dat wij de auto rond ${leverdatumFormatted} kunnen leveren. Op dit moment is dit nog niet definitief, dus dit kan nog wijzigen.

`;
    tekst += `Mocht dit wijzigen, dan laten wij het uiteraard aan u weten.

`;
    tekst += `Mocht u nog vragen hebben, neem dan gerust contact met ons op.`;
  }

  document.getElementById('previewContent').textContent = tekst;
  document.getElementById('copyBtn').disabled = false;
  showToast('E-mailtekst is gegenereerd!');
}

function copyEmail() {
  const tekst = document.getElementById('previewContent').textContent;
  navigator.clipboard.writeText(tekst);
  showToast('E-mailtekst gekopieerd naar klembord');
}

function resetForm() {
  document.getElementById('previewContent').textContent = '';
  document.getElementById('copyBtn').disabled = true;
}

document.getElementById('emailtype').addEventListener('change', toggleFields);
document.getElementById('emailForm').addEventListener('input', validateForm);
document.getElementById('generateBtn').addEventListener('click', generateEmail);
document.getElementById('copyBtn').addEventListener('click', copyEmail);
document.getElementById('resetBtn').addEventListener('click', () => {
  resetForm();
  document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
  document.querySelectorAll('input, select').forEach(f => f.classList.remove('error'));
});

window.addEventListener('DOMContentLoaded', toggleFields);
