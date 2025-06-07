// script.js updated with Open in Outlook
// ... existing code above ...
// After lastBody and lastSubject defined:
function openInOutlook() {
  const mailto = `mailto:?subject=${encodeURIComponent(lastSubject)}&body=${encodeURIComponent(lastBody)}`;
  window.location.href = mailto;
}
document.getElementById('outlookBtn').addEventListener('click', openInOutlook);
