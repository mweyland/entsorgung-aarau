function updateURL() {
  // Grab selection from form
  const form = document.getElementById('calendarForm');
  const selectedRegions = [...form.querySelectorAll('input[name="region"]:checked')].map(cb => cb.value);
  const selectedTypes = [...form.querySelectorAll('input[name="service"]:checked')].map(cb => cb.value);

  // Generate URL, not encoded and without protocol prefix. Returns null on incomplete selection
  const url = generateCalendarURL(selectedRegions, selectedTypes);

  // fields, buttons and <a> elements for links...
  const urlField = document.getElementById('calendarUrl');

  const googleButton = document.getElementById('googleButton');
  const googleLink = document.getElementById('googleLink');

  const outlookButton = document.getElementById('outlookButton');
  const outlookLink = document.getElementById('outlookLink');

  const webcalButton = document.getElementById('webcalButton');
  const webcalLink = document.getElementById('webcalLink');

  const downloadButton = document.getElementById('downloadButton');
  const downloadLink = document.getElementById('downloadLink');

  if (url) {
    // Populate URLs and activate buttons
    urlField.value = 'webcal://' + url;

    googleLink.href = 'https://calendar.google.com/calendar/r?cid=webcal://' + encodeURIComponent(url);
    googleButton.disabled = false;

    outlookLink.href = 'https://outlook.office.com/calendar/0/addfromweb?url=https://' + encodeURIComponent(url);
    outlookButton.disabled = false;

    webcalLink.href = 'webcal://' + url;
    webcalButton.disabled = false;

    downloadLink.href = 'https://' + url;
    downloadButton.disabled = false;
  } else {
    // Disable buttons on incomplete selection
    urlField.value = '';
    downloadLink.href = '#';
    googleButton.disabled = true;
    outlookButton.disabled = true;
    webcalButton.disabled = true;
    downloadButton.disabled = true;
  }
}

// Generate calendar URL without protocol prefix
function generateCalendarURL(regions, services) {
  if (regions.length === 0 || services.length === 0) return null;

  const regionParam = regions.map(encodeURIComponent).join(',');
  const serviceParam = services.map(encodeURIComponent).join(',');
  return `y4vqyvdr69.execute-api.eu-central-1.amazonaws.com/calendar?regions=${regionParam}&services=${serviceParam}`;
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
