// Preserve native form submission when JavaScript is unavailable.
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.mobile-nav').removeAttribute('open'));
});

const form = document.querySelector('.form');
const feedback = form.querySelector('.feedback');
const submit = form.querySelector('[type="submit"]');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submit.disabled || !form.reportValidity()) return;
  const body = new FormData(form);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  form.setAttribute('aria-busy', 'true');
  submit.disabled = true;
  submit.textContent = 'Sending…';
  feedback.textContent = 'Sending your message…';
  try {
    const response = await fetch(form.action, {
      method: 'POST', body, headers: {Accept: 'application/json'}, signal: controller.signal
    });
    if (!response.ok) {
      feedback.textContent = 'Your message could not be submitted. Please try again later or email security@vulgone.com.';
      return;
    }
    form.reset();
    feedback.textContent = 'Thank you. Your message has been sent.';
  } catch {
    feedback.textContent = 'We could not confirm delivery. Please try again later or email security@vulgone.com.';
  } finally {
    clearTimeout(timeout);
    form.removeAttribute('aria-busy');
    submit.disabled = false;
    submit.textContent = 'Send Message';
  }
});
