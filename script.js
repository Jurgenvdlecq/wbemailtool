// Wittebrug E-mailgenerator (v13)

const seatModels = ["Ibiza", "Leon", "Leon Sportstourer", "Arona", "Ateca"];
const cupraModels = ["Born", "Formentor", "Leon", "Leon Sportstourer", "Terramar", "Tavascan"];

// Translate Dutch durations like "2 weken" to English "2 weeks"
function translateDuration(text) {
  if (!text) return '';
  const mappings = [
    { nl: 'weken', en: 'weeks' },
    { nl: 'week',  en: 'week' },
    { nl: 'dagen', en: 'days' },
    { nl: 'dag',   en: 'day' },
    { nl: 'maanden', en: 'months' },
    { nl: 'maand', en: 'month' }
  ];
  let result = text;
  mappings.forEach(m => {
    const re = new RegExp('\\b(\\d+)\\s*' + m.nl + '\\b', 'gi');
    result = result.replace(re, '$1 ' + m.en);
  });
  return result;
}

function formatPriceNL(num) {
  // Format number to Dutch format "23.950"
  const formatted = new Intl.NumberFormat('nl-NL').format(num);
  return '€ ' + formatted + ',-';
}

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
    if (error) error.style.display = 'none';
    return true;
  }
}

function validateForm() {
  let valid = true;
  ['aanhef', 'merk', 'model', 'emailtype', 'voornaam', 'achternaam'].forEach(id => {
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

// Add real-time validation on blur
['aanhef','voornaam','achternaam','merk','model','emailtype','prijs','levertijd','datum','tijd','looptijd','kilometers'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => validateField(id));
  }
});

let currentLang = 'nl';

function updateLanguage() {
  currentLang = document.getElementById('languageSelect').value;
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

  let prijsVal = document.getElementById('prijs').value.trim();
  let prijsText = '';
  if (prijsVal && currentLang === 'nl') {
    prijsText = `<strong>${formatPriceNL(prijsVal)}</strong>`;
  } else if (prijsVal) {
    prijsText = `<strong>${formatPriceNL(prijsVal)}</strong>`;
  }

  let levertijd = document.getElementById('levertijd').value.trim();
  let levertijdText = (currentLang === 'en') ? translateDuration(levertijd) : levertijd;

  const inruilprijs = document.getElementById('inruilprijs').value.trim();
  let inruilText = '';
  if (inruilprijs && currentLang === 'nl') {
    inruilText = `<strong>${formatPriceNL(inruilprijs)}</strong>`;
  } else if (inruilprijs) {
    inruilText = `<strong>${formatPriceNL(inruilprijs)}</strong>`;
  }

  const kenteken = document.getElementById('kenteken').value.trim();
  const datum = document.getElementById('datum').value;
  const tijd = document.getElementById('tijd').value;
  let looptijd = document.getElementById('looptijd').value.trim();
  const kilometers = document.getElementById('kilometers').value.trim();
  const eigenrisico = document.getElementById('eigenrisico').value.trim();
  const maandbedrag = document.getElementById('maandbedrag').value.trim();
  const banden = document.getElementById('banden').value;
  const leverdatum = document.getElementById('leverdatum').value;

  const datumFormatted = datum ? new Date(datum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const leverdatumFormatted = leverdatum ? new Date(leverdatum).toLocaleDateString(currentLang === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  let tekstHTML = `<p>${aanspreking}</p>`;

  // Offerte zonder inruil
  if (type === 'offerte') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Hartelijk dank voor uw interesse in de ${merk} ${model}.</p>`;
      tekstHTML += `<p>De totale aanschafprijs bedraagt ${prijsText}, inclusief afleverkosten.<br>
      De verwachte levertijd is ongeveer <strong>${levertijdText}</strong> na akkoord.</p>`;
      tekstHTML += `<p>In de bijlage vindt u de complete offerte.</p>`;
      tekstHTML += `<p>Uiteraard bent u van harte welkom om de auto in het echt te bekijken of een proefrit te maken.</p>`;
    } else {
      tekstHTML += `<p>Thank you for your interest in the ${merk} ${model}.</p>`;
      tekstHTML += `<p>The total purchase price is ${prijsText}, including delivery costs.<br>
      The expected delivery time is approximately <strong>${levertijdText}</strong> after approval.</p>`;
      tekstHTML += `<p>You will find the full quote attached.</p>`;
      tekstHTML += `<p>Of course, you are very welcome to come and see the car in person or schedule a test drive.</p>`;
    }
  }

  // Offerte met inruil
  if (type === 'inruil') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Hartelijk dank voor uw interesse in de ${merk} ${model}.</p>`;
      tekstHTML += `<p>Zoals besproken stuur ik u hierbij de offerte, inclusief de definitieve inruilwaarde voor uw huidige auto (kenteken <strong>${kenteken}</strong>).</p>`;
      tekstHTML += `<p>De totale aanschafprijs bedraagt ${prijsText}, inclusief afleverkosten.<br>
      De inruilwaarde van uw huidige auto bedraagt ${inruilText}.<br>
      De verwachte levertijd is ongeveer <strong>${levertijdText}</strong> na akkoord.</p>`;
      tekstHTML += `<p>In de bijlage vindt u:<br>
      1. De offerte voor de ${merk} ${model} met specificaties en prijsdetails.<br>
      2. De taxatie van uw huidige auto, inclusief het inruilbedrag.<br>
      3. Optioneel: financierings- of leaseopties (indien van toepassing).</p>`;
      tekstHTML += `<p>Graag nodig ik u uit voor een definitieve taxatie in onze showroom, zodat we het inruilbedrag definitief kunnen vaststellen.</p>`;
    } else {
      tekstHTML += `<p>Thank you for your interest in the ${merk} ${model}.</p>`;
      tekstHTML += `<p>As discussed, I am sending you the quote, including the confirmed trade-in value for your current car (license plate <strong>${kenteken}</strong>).</p>`;
      tekstHTML += `<p>The total purchase price is ${prijsText}, including delivery costs.<br>
      The trade-in value of your current car is ${inruilText}.<br>
      The expected delivery time is approximately <strong>${levertijdText}</strong> after approval.</p>`;
      tekstHTML += `<p>Attached you will find:<br>
      1. The quote for the ${merk} ${model} with specifications and pricing details.<br>
      2. The appraisal of your current car, including the trade-in amount.<br>
      3. Optional: financing or leasing options (if applicable).</p>`;
      tekstHTML += `<p>You are kindly invited for a final appraisal in our showroom so that we can confirm the trade-in amount.</p>`;
    }
  }

  // Private lease
  if (type === 'lease') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Hartelijk dank voor uw interesse in de ${merk} ${model}.</p>`;
      tekstHTML += `<p>Zoals beloofd stuur ik hierbij ons private leasevoorstel. In deze e-mail vindt u de belangrijkste details:</p>`;
      tekstHTML += `<ul>
        <li>Model: <strong>${merk} ${model}</strong></li>
        <li>Looptijd: <strong>${looptijd}</strong> maanden</li>
        <li>Kilometrage: <strong>${kilometers}</strong> km per jaar</li>
        <li>Type banden: <strong>${banden}</strong></li>
        <li>Eigen risico: <strong>${formatPriceNL(eigenrisico)}</strong></li>
        <li>Inclusief: Wegenbelasting, onderhoud, reparaties en allriskverzekering</li>
      </ul>`;
      tekstHTML += `<p>Vervolgstappen:<br>
        1. Reageer positief op deze e-mail wanneer u de private lease-aanvraag wilt starten.<br>
        2. U ontvangt dan een e-mail van Volkswagen Pon Financial Services (VWPFS) om de krediettoetsing te doorlopen.</p>`;
      tekstHTML += `<p>Laat me weten wat u ervan vindt of als u vragen heeft; ik help u graag verder!</p>`;
    } else {
      tekstHTML += `<p>Thank you for your interest in the ${merk} ${model}.</p>`;
      tekstHTML += `<p>As promised, I am sending you our private lease proposal. In this email you will find the key details:</p>`;
      tekstHTML += `<ul>
        <li>Model: <strong>${merk} ${model}</strong></li>
        <li>Duration: <strong>${looptijd}</strong> months</li>
        <li>Mileage: <strong>${kilometers}</strong> km per year</li>
        <li>Tire type: <strong>${banden}</strong></li>
        <li>Deductible: <strong>${formatPriceNL(eigenrisico)}</strong></li>
        <li>Included: Road tax, maintenance, repairs, and comprehensive insurance</li>
      </ul>`;
      tekstHTML += `<p>Next steps:<br>
        1. Reply positively to this email if you want to proceed with the privatelease application.<br>
        2. You will then receive an email from Volkswagen Pon Financial Services (VWPFS) to complete the credit check.</p>`;
      tekstHTML += `<p>Let me know what you think or if you have any questions; I am happy to help!</p>`;
    }
  }

  // Proefritbevestiging
  if (type === 'proefrit') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Hartelijk dank voor uw interesse in de ${merk} ${model}.</p>`;
      tekstHTML += `<p>Hierbij bevestigen wij graag uw proefritafspraak op <strong>${datumFormatted}</strong> om <strong>${tijd}</strong> met de ${merk} ${model}.</p>`;
      tekstHTML += `<p>Wij ontvangen u bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Vergeet alstublieft uw rijbewijs niet mee te nemen.</p>`;
      tekstHTML += `<p>Mocht u vooraf nog vragen hebben of iets willen wijzigen, neem gerust contact met ons op.</p>`;
    } else {
      tekstHTML += `<p>Thank you for your interest in the ${merk} ${model}.</p>`;
      tekstHTML += `<p>We are pleased to confirm your test drive appointment on <strong>${datumFormatted}</strong> at <strong>${tijd}</strong> with the ${merk} ${model}.</p>`;
      tekstHTML += `<p>We look forward to welcoming you at Wittebrug SEAT, Donau 120, 2491 BC Den Haag. Please remember to bring your driver’s license.</p>`;
      tekstHTML += `<p>If you have any questions or need to make changes, feel free to contact us.</p>`;
    }
  }

  // Afspraakbevestiging
  if (type === 'afspraak') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Leuk dat we een afspraak hebben gepland voor de ${merk} ${model} op <strong>${datumFormatted}</strong> om <strong>${tijd}</strong>.</p>`;
      tekstHTML += `<p>U bent van harte welkom bij Wittebrug SEAT, Donau 120, 2491 BC Den Haag.</p>`;
      tekstHTML += `<p>Heeft u vooraf nog vragen of wilt u de afspraak wijzigen? Laat het gerust weten.</p>`;
    } else {
      tekstHTML += `<p>We are glad to have an appointment scheduled for the ${merk} ${model} on <strong>${datumFormatted}</strong> at <strong>${tijd}</strong>.</p>`;
      tekstHTML += `<p>You are welcome at Wittebrug SEAT, Donau 120, 2491 BC Den Haag.</p>`;
      tekstHTML += `<p>If you have any questions beforehand or need to modify the appointment, please let us know.</p>`;
    }
  }

  // Showroombezoek
  if (type === 'showroom') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Hartelijk dank voor uw bezoek aan onze showroom.</p>`;
      tekstHTML += `<p>Zoals besproken ontvangt u hierbij de offerte voor de ${merk} ${model}.</p>`;
      tekstHTML += `<p>De totale aanschafprijs bedraagt ${prijsText}, inclusief afleverkosten.<br>
      De verwachte levertijd is <strong>${levertijdText}</strong>.</p>`;
      tekstHTML += `<p>De offerte heb ik als bijlage toegevoegd.</p>`;
      tekstHTML += `<p>Heeft u nog vragen of opmerkingen? Laat het gerust weten; ik help u graag verder.</p>`;
    } else {
      tekstHTML += `<p>Thank you for visiting our showroom.</p>`;
      tekstHTML += `<p>As discussed, you will find the quote for the ${merk} ${model} below.</p>`;
      tekstHTML += `<p>The total purchase price is ${prijsText}, including delivery costs.<br>
      The expected delivery is <strong>${levertijdText}</strong>.</p>`;
      tekstHTML += `<p>The quote is attached.</p>`;
      tekstHTML += `<p>If you have any questions or comments, please let me know; I am happy to help.</p>`;
    }
  }

  // Follow-up offerte
  if (type === 'followup') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Enige tijd geleden ontving u van mij de offerte voor de ${merk} ${model}.</p>`;
      tekstHTML += `<p>Ik hoor graag wat u ervan vindt en of u nog vragen heeft over de offerte of de uitvoering.</p>`;
      tekstHTML += `<p>Uiteraard sta ik voor u klaar om eventuele onderdelen van de offerte toe te lichten of alternatieve opties te bespreken.</p>`;
    } else {
      tekstHTML += `<p>Some time ago, you received the quote for the ${merk} ${model} from me.</p>`;
      tekstHTML += `<p>I would love to hear what you think and if you have any questions about the quote or the specifications.</p>`;
      tekstHTML += `<p>Of course, I am available to explain any part of the quote or discuss alternative options.</p>`;
    }
  }

  // Status levering
  if (type === 'status') {
    if (currentLang === 'nl') {
      tekstHTML += `<p>Wij hebben voor u de ${merk} ${model} in bestelling staan en willen u graag op de hoogte houden van de status van deze bestelling.</p>`;
      tekstHTML += `<p>We verwachten dat wij de auto rond <strong>${leverdatumFormatted}</strong> kunnen leveren. Op dit moment is dit nog niet definitief, dus dit kan nog wijzigen.</p>`;
      tekstHTML += `<p>Mocht dit wijzigen, dan laten wij het uiteraard aan u weten.</p>`;
      tekstHTML += `<p>Mocht u nog vragen hebben, neem dan gerust contact met ons op.</p>`;
    } else {
      tekstHTML += `<p>We have the ${merk} ${model} on order for you and would like to keep you informed about the status of this order.</p>`;
      tekstHTML += `<p>We expect to deliver the car around <strong>${leverdatumFormatted}</strong>. At this time, this is not final, so it may still change.</p>`;
      tekstHTML += `<p>If this changes, we will of course let you know.</p>`;
      tekstHTML += `<p>If you have any further questions, please feel free to contact us.</p>`;
    }
  }

  document.getElementById('previewContent').innerHTML = tekstHTML;
  document.getElementById('copyBtn').disabled = false;
}

function copyEmail() {
  const tekst = document.getElementById('previewContent').innerText;
  navigator.clipboard.writeText(tekst);
  showToast('E-mailtekst gekopieerd naar klembord');
}

function resetForm() {
  document.getElementById('previewContent').innerHTML = '';
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
