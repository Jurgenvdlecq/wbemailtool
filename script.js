// Wittebrug E-mailgenerator (v12)

const seatModels = ["Ibiza", "Leon", "Leon Sportstourer", "Arona", "Ateca"];
const cupraModels = ["Born", "Formentor", "Leon", "Leon Sportstourer", "Terramar", "Tavascan"];

function populateModels() {
  const merk = document.getElementById('merk').value;
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">-- Kies --</option>';
  let list = [];
  if (merk === 'SEAT') list = seatModels;
  if (merk === 'CUPRA') list = cupraModels;
  list.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
}

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
  document.querySelectorAll('.field-group').forEach(group => {
    if (window.getComputedStyle(group).display !== 'none') {
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
  const lease = (type === 'lease');
  document.getElementById('veld-prijs').style.display = lease ? 'none' : 'block';

  const veldgroepen = {
    offerte: ['prijs', 'levertijd'],
    inruil: ['prijs', 'levertijd', 'inruilprijs', 'kenteken'],
    proefrit: ['datum', 'tijd'],
    afspraak: ['datum', 'tijd'],
    showroom: ['prijs', 'levertijd'],
    lease: ['levertijd', 'looptijd', 'kilometers', 'eigenrisico', 'maandbedrag', 'banden'],
    followup: ['model'],
    status: ['leverdatum']
  };
  const allFields = ['prijs', 'levertijd', 'inruilprijs', 'kenteken', 'datum', 'tijd', 'looptijd', 
                     'kilometers', 'eigenrisico', 'maandbedrag', 'banden', 'leverdatum'];
  allFields.forEach(id => {
    const elem = document.getElementById('veld-' + id);
    if (elem) {
      elem.style.display = (veldgroepen[type] && veldgroepen[type].includes(id)) ? 'block' : 'none';
    }
  });
  validateForm();
}

let currentLang = 'nl';

function updateLanguage() {
  currentLang = document.getElementById('languageSelect').value;
  // labels remain in Dutch; only regenerate email outputs
  if (!document.getElementById('copyBtn').disabled) {
    generateEmail();
  }
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
  const model = document.getElementById('model').value;
  const type = document.getElementById('emailtype').value;

  let aanspreking = '';
  if (aanhef === 'voornaam') {
    aanspreking = currentLang === 'nl' ? `Beste ${voornaam},` : `Dear ${voornaam},`;
  } else if (aanhef === 'heer') {
    aanspreking = currentLang === 'nl' ? `Beste heer ${achternaam},` : `Dear Mr. ${achternaam},`;
  } else {
    aanspreking = currentLang === 'nl' ? `Beste mevrouw ${achternaam},` : `Dear Ms. ${achternaam},`;
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

  const datumFormatted = datum ? new Date(datum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const leverdatumFormatted = leverdatum ? new Date(leverdatum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  let tekst = `${aanspreking}

`;

  if (type === 'offerte') {
    if (currentLang === 'nl') {
      tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
      tekst += `De totale aanschafprijs bedraagt €${prijs}, inclusief afleverkosten.
`;
      tekst += `De verwachte levertijd is ongeveer ${levertijd} na akkoord.

`;
      tekst += `In de bijlage vindt u de complete offerte.

`;
      tekst += `Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken.`;
    } else {
      tekst += `Thank you for your interest in the ${merk} ${model}.

`;
      tekst += `The total purchase price is €${prijs}, including delivery costs.
`;
      tekst += `The expected delivery time is approximately ${levertijd} after approval.

`;
      tekst += `You will find the full quote attached.

`;
      tekst += `Of course, you are very welcome to come and see the car in person or schedule a test drive.`;
    }
  }

  if (type === 'inruil') {
    if (currentLang === 'nl') {
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
    } else {
      tekst += `Thank you for your interest in the ${merk} ${model}.

`;
      tekst += `As discussed, I am sending you the quote, including the confirmed trade-in value for your current car (license plate ${kenteken}).

`;
      tekst += `The total purchase price is €${prijs}, including delivery costs.
`;
      tekst += `The trade-in value of your current car is €${inruilprijs}.
`;
      tekst += `The expected delivery time is approximately ${levertijd} after approval.

`;
      tekst += `Attached you will find:
`;
      tekst += `1. The quote for the ${merk} ${model} with specifications and pricing details.
`;
      tekst += `2. The appraisal of your current car, including the trade-in amount.
`;
      tekst += `3. Optional: financing or leasing options (if applicable).

`;
      tekst += `You are kindly invited for a final appraisal in our showroom so that we can confirm the trade-in amount.`;
    }
  }

  if (type === 'lease') {
    if (currentLang === 'nl') {
      tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
      tekst += `Zoals beloofd stuur ik hierbij ons private leasevoorstel. In deze e-mail vindt u de belangrijkste details:
`;
      tekst += `• Model: ${merk} ${model}
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
    } else {
      tekst += `Thank you for your interest in the ${merk} ${model}.

`;
      tekst += `As promised, I am sending you our private lease proposal. In this email you will find the key details:
`;
      tekst += `• Model: ${merk} ${model}
• Duration: ${looptijd} months
`;
      tekst += `• Mileage: ${kilometers} km per year
• Tire type: ${banden}
• Deductible: €${eigenrisico}
`;
      tekst += `• Included: Road tax, maintenance, repairs, and comprehensive insurance

`;
      tekst += `Next steps:
`;
      tekst += `1. Reply positively to this email if you want to proceed with the private lease application.
`;
      tekst += `2. You will then receive an email from Volkswagen Pon Financial Services (VWPFS) to complete the credit check.

`;
      tekst += `Let me know what you think or if you have any questions; I am happy to help!`;
    }
  }

  if (type === 'proefrit') {
    if (currentLang === 'nl') {
      tekst += `Hartelijk dank voor uw interesse in de ${merk} ${model}.

`;
      tekst += `Hierbij bevestigen wij graag uw proefritafspraak op ${datumFormatted} om ${tijd} met de ${merk} ${model}.

`;
      tekst += `Wij ontvangen u bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet alstublieft uw rijbewijs niet mee te nemen.

`;
      tekst += `Mocht u vooraf nog vragen hebben of iets willen wijzigen, neem gerust contact met ons op.`;
    } else {
      tekst += `Thank you for your interest in the ${merk} ${model}.

`;
      tekst += `We are pleased to confirm your test drive appointment on ${datumFormatted} at ${tijd} with the ${merk} ${model}.

`;
      tekst += `We look forward to welcoming you at Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Please remember to bring your driver’s license.

`;
      tekst += `If you have any questions or need to make changes, feel free to contact us.`;
    }
  }

  if (type === 'afspraak') {
    if (currentLang === 'nl') {
      tekst += `Leuk dat we een afspraak hebben gepland voor de ${merk} ${model} op ${datumFormatted} om ${tijd}.

`;
      tekst += `U bent van harte welkom bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag.

`;
      tekst += `Heeft u vooraf nog vragen of wilt u de afspraak wijzigen? Laat het gerust weten.`;
    } else {
      tekst += `We are glad to have an appointment scheduled for the ${merk} ${model} on ${datumFormatted} at ${tijd}.

`;
      tekst += `You are welcome at Wittebrug SEAT, Donau 120, 2491 BC Den Haag.

`;
      tekst += `If you have any questions beforehand or need to modify the appointment, please let us know.`;
    }
  }

  if (type === 'showroom') {
    if (currentLang === 'nl') {
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
    } else {
      tekst += `Thank you for visiting our showroom.

`;
      tekst += `As discussed, you will find the quote for the ${merk} ${model} below.

`;
      tekst += `The total purchase price is €${prijs}, including delivery costs.
`;
      tekst += `The expected delivery is ${levertijd}.

`;
      tekst += `The quote is attached.

`;
      tekst += `If you have any questions or comments, please let me know; I am happy to help.`;
    }
  }

  if (type === 'followup') {
    if (currentLang === 'nl') {
      tekst += `Enige tijd geleden ontving u van mij de offerte voor de ${merk} ${model}.
`;
      tekst += `Ik hoor graag wat u ervan vindt en of u nog vragen heeft over de offerte of de uitvoering.

`;
      tekst += `Uiteraard sta ik voor u klaar om eventuele onderdelen van de offerte toe te lichten of alternatieve opties te bespreken.`;
    } else {
      tekst += `Some time ago, you received the quote for the ${merk} ${model} from me.
`;
      tekst += `I would love to hear what you think and if you have any questions about the quote or the specifications.

`;
      tekst += `Of course, I am available to explain any part of the quote or discuss alternative options.`;
    }
  }

  if (type === 'status') {
    if (currentLang === 'nl') {
      tekst += `Wij hebben voor u de ${merk} ${model} in bestelling staan en willen u graag op de hoogte houden van de status van deze bestelling.

`;  
      tekst += `We verwachten dat wij de auto rond ${leverdatumFormatted} kunnen leveren. Op dit moment is dit nog niet definitief, dus dit kan nog wijzigen.

`;
      tekst += `Mocht dit wijzigen, dan laten wij het uiteraard aan u weten.

`;
      tekst += `Mocht u nog vragen hebben, neem dan gerust contact met ons op.`;
    } else {
      tekst += `We have the ${merk} ${model} on order for you and would like to keep you informed about the status of this order.

`;
      tekst += `We expect to deliver the car around ${leverdatumFormatted}. At this time, this is not final, so it may still change.

`;
      tekst += `If this changes, we will of course let you know.

`;
      tekst += `If you have any further questions, please feel free to contact us.`;
    }
  }

  document.getElementById('previewContent').textContent = tekst;
  document.getElementById('copyBtn').disabled = false;
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

document.getElementById('merk').addEventListener('change', () => {
  populateModels();
  validateForm();
});
document.getElementById('emailtype').addEventListener('change', () => {
  toggleFields();
  validateForm();
});
document.getElementById('emailForm').addEventListener('input', validateForm);
document.getElementById('generateBtn').addEventListener('click', generateEmail);
document.getElementById('copyBtn').addEventListener('click', copyEmail);
document.getElementById('resetBtn').addEventListener('click', () => {
  resetForm();
  document.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
  document.querySelectorAll('input, select').forEach(f => f.classList.remove('error'));
});
document.getElementById('languageSelect').addEventListener('change', updateLanguage);

window.addEventListener('DOMContentLoaded', () => {
  populateModels();
  toggleFields();
  updateLanguage();
});
