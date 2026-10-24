// Checks the contact form data on the server.
// The browser also checks it, but anyone can skip the browser and call the API directly,
// so the server must never trust what it receives.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateContact(body) {
  const data = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    company: clean(body.company),
    message: clean(body.message),
  };

  const errors = {};
  if (data.name.length < 1 || data.name.length > 100) errors.name = 'Please enter your name (up to 100 characters).';
  if (!EMAIL_PATTERN.test(data.email) || data.email.length > 200) errors.email = 'Please enter a valid email address.';
  if (data.company.length > 100) errors.company = 'Company name is too long.';
  if (data.message.length < 10 || data.message.length > 3000) errors.message = 'Message must be 10 to 3000 characters.';

  return { data, errors, ok: Object.keys(errors).length === 0 };
}
