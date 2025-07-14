function updateURL() {
  // Grab selection from form
  const form = document.getElementById('calendarForm');
  const selectedRegions = [...form.querySelectorAll('input[name="region"]:checked')].map(cb => cb.value);
  const selectedTypes = [...form.querySelectorAll('input[name="service"]:checked')].map(cb => cb.value);

  // Generate URL, not encoded and without protocol prefix. Returns null on incomplete selection
  const url = generateCalendarURL(selectedRegions, selectedTypes);

  // fields, buttons and <a> elements for links...
  const urlField = document.getElementById('calendarUrl');

  const googleLink = document.getElementById('googleLink');
  const outlookLink = document.getElementById('outlookLink');
  const webcalLink = document.getElementById('webcalLink');
  const downloadLink = document.getElementById('downloadLink');

  if (url) {
    // Populate URLs and activate buttons
    urlField.value = 'webcal://' + url;

    googleLink.href = 'https://calendar.google.com/calendar/r?cid=' + encodeURIComponent('webcal://' + url);
    outlookLink.href = 'https://outlook.office.com/calendar/0/addfromweb?url=' + encodeURIComponent('https://' + url);
    webcalLink.href = 'webcal://' + url;
    downloadLink.href = 'https://' + url;

    googleLink.classList.remove('disabled');
    outlookLink.classList.remove('disabled');
    webcalLink.classList.remove('disabled');
    downloadLink.classList.remove('disabled');
  } else {
    // Disable buttons on incomplete selection
    urlField.value = '';
    downloadLink.href = '#';
    googleLink.classList.add('disabled');
    outlookLink.classList.add('disabled');
    webcalLink.classList.add('disabled');
    downloadLink.classList.add('disabled');
  }
}

// Generate calendar URL without protocol prefix
function generateCalendarURL(regions, services) {
  if (regions.length === 0 || services.length === 0) return null;

  const regionParam = regions.map(encodeURIComponent).join(',');
  const serviceParam = services.map(encodeURIComponent).join(',');
  const BASE_URL = 'entsorgung-aarau-760482908713.europe-west6.run.app';
  return `${BASE_URL}/calendar?regions=${regionParam}&services=${serviceParam}`;
}

// Copy calendarUrl content to clipboard
function copyURL() {
  const input = document.getElementById('calendarUrl');
  if (input.value) {
    navigator.clipboard.writeText(input.value).then(() => {
    }, () => {
    console.log('Failed to copy URL.');
    });
  }
}

// Ensure this is called on reload
updateURL();
