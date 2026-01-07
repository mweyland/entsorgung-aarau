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

  enableDisableReminders();

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

// Enable reminder controls when respective checkbox is on
function enableDisableReminders() {
  const r1Enabled = document.getElementById('reminder1-checkbox').checked;
  document.getElementById('reminder1-day').disabled = !r1Enabled;
  document.getElementById('reminder1-time').disabled = !r1Enabled;

  const r2Enabled = document.getElementById('reminder2-checkbox').checked;
  document.getElementById('reminder2-day').disabled = !r2Enabled;
  document.getElementById('reminder2-time').disabled = !r2Enabled;
}

// Returns a pair of values corresponding to the two reminder checkboxes.
// If checkbox not checked, value is null
// Otherwise, value is the alarm offset in minutes from the start of the event date.
// Positive offsets are into the day, negative offsets are the day(s) before.
function getReminderValues() {
    let ret1 = null;
    let ret2 = null;
    if(document.getElementById('reminder1-checkbox').checked) {
      const [hours, minutes] = document.getElementById('reminder1-time').value.split(':').map(Number);
      ret1 = hours*60+minutes - 24*60*document.getElementById('reminder1-day').value;
    }
    if(document.getElementById('reminder2-checkbox').checked) {
      const [hours, minutes] = document.getElementById('reminder2-time').value.split(':').map(Number);
      ret2 = hours*60+minutes - 24*60*document.getElementById('reminder2-day').value;
    }
    return [ret1, ret2];
}

// Generate calendar URL without protocol prefix
function generateCalendarURL(regions, services) {
  // reminderTest is true if one of the two checkboxes is checked while its time is unset
  const reminderTest = (document.getElementById('reminder1-checkbox').checked && document.getElementById('reminder1-time').value === "") || (document.getElementById('reminder2-checkbox').checked && document.getElementById('reminder2-time').value ==="");
  if (regions.length === 0 || services.length === 0 || reminderTest) return null;

  const params = new URLSearchParams({
    regions: regions.join(','),
    services: services.join(',')
  });

  const reminderValues = getReminderValues();
  if(reminderValues[0] !== null) {
    params.append('reminder1', reminderValues[0]);
  }

  if(reminderValues[1] !== null) {
    params.append('reminder2', reminderValues[1]);
  }

  const BASE_URL = 'entsorgung-aarau-760482908713.europe-west6.run.app';
  return `${BASE_URL}/calendar?${params.toString()}`;

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
