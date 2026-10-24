// contact.js runs on the Contact page.
// It checks the form, sends it to /api/contact, and shows the result.

const form = document.querySelector('[data-contact-form]');
const success = document.querySelector('[data-success]');
const formError = document.querySelector('[data-form-error]');
const submitButton = document.querySelector('[data-submit]');
const submitLabel = document.querySelector('[data-submit-label]');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each rule returns true when the value is OK
const rules = {
  name: (value) => value.length > 0,
  email: (value) => EMAIL_PATTERN.test(value),
  message: (value) => value.length >= 10,
};

function showFieldError(field, show) {
  const input = form.elements[field];
  const error = form.querySelector('[data-error-for="' + field + '"]');
  input.setAttribute('aria-invalid', String(show));
  error.classList.toggle('hidden', !show);
}

function validate(data) {
  let firstBadField = null;
  Object.keys(rules).forEach((field) => {
    const ok = rules[field](data[field]);
    showFieldError(field, !ok);
    if (!ok && !firstBadField) firstBadField = field;
  });
  return firstBadField;
}

// Hide a field's error as soon as the person fixes it
Object.keys(rules).forEach((field) => {
  form.elements[field].addEventListener('input', () => {
    if (form.elements[field].getAttribute('aria-invalid') === 'true') {
      showFieldError(field, !rules[field](form.elements[field].value.trim()));
    }
  });
});

function setSending(sending) {
  submitButton.disabled = sending;
  submitLabel.textContent = sending ? 'SENDING…' : 'SEND MESSAGE';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.classList.add('hidden');

  const data = {
    name: form.elements.name.value.trim(),
    company: form.elements.company.value.trim(),
    email: form.elements.email.value.trim(),
    message: form.elements.message.value.trim(),
    website: form.elements.website.value, // spam trap, should stay empty
  };

  const badField = validate(data);
  if (badField) {
    form.elements[badField].focus();
    return;
  }

  setSending(true);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong. Please try again.');
    }

    // Show the success screen
    const firstName = data.name.split(' ')[0];
    document.querySelector('[data-success-text]').textContent =
      'Thank you, ' + firstName + '. I will reply to ' + data.email + ' as soon as I can.';
    form.classList.add('hidden');
    success.classList.remove('hidden');
    success.classList.add('flex');
  } catch (error) {
    formError.textContent =
      error.message === 'Failed to fetch'
        ? 'Could not connect. Please check your internet and try again, or email me directly.'
        : error.message;
    formError.classList.remove('hidden');
  } finally {
    setSending(false);
  }
});

// "Send another message" brings the empty form back
document.querySelector('[data-reset]').addEventListener('click', () => {
  form.reset();
  success.classList.add('hidden');
  success.classList.remove('flex');
  form.classList.remove('hidden');
  form.elements.name.focus();
});
