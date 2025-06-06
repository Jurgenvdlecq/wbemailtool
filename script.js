const subjectInput = document.getElementById('subject');
const recipientInput = document.getElementById('recipient');
const bodyInput = document.getElementById('body');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const resetBtn = document.getElementById('reset');
const previewContent = document.getElementById('preview-content');
const emailForm = document.getElementById('emailForm');

// Functie om de preview te genereren
function generatePreview() {
  const subject = subjectInput.value.trim();
  const recipient = recipientInput.value.trim();
  const body = bodyInput.value.trim();

  if (!subject || !recipient || !body) {
    previewContent.innerHTML = '<em>Vul alle velden in om de e-mail te bekijken.</em>';
    copyBtn.disabled = true;
    return;
  }

  const preview = 
`Aan: ${recipient}
Onderwerp: ${subject}

${body}

Met vriendelijke groet,
[Je naam]`;

  previewContent.textContent = preview;
  copyBtn.disabled = false;
}

// Genereer-knop
generateBtn.addEventListener('click', generatePreview);

// Kopieer-knop
copyBtn.addEventListener('click', () => {
  const text = previewContent.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "Gekopieerd!";
      setTimeout(() => copyBtn.textContent = "Kopieer email", 1500);
    });
  }
});

// Reset-knop
resetBtn.addEventListener('click', () => {
  previewContent.innerHTML = '';
  copyBtn.disabled = true;
});

// Live preview bij typen (optioneel, kun je weghalen)
[emailForm].forEach
? emailForm.addEventListener('input', generatePreview)
: [subjectInput, recipientInput, bodyInput].forEach(input => input.addEventListener('input', generatePreview));

// Start met lege preview
copyBtn.disabled = true;
