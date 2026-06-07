document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const alert = document.getElementById('formAlert');

  // Collect values
  const name        = document.getElementById('name').value.trim();
  const email       = document.getElementById('email').value.trim();
  const institution = document.getElementById('institution').value.trim();
  const interest    = document.getElementById('interest').value;
  const message     = document.getElementById('message').value.trim();
  const resumeLink  = document.getElementById('resumeLink').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    showAlert('Please fill in all required fields (name, email, message).', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  alert.style.display = 'none';

  try {
  const response = await fetch('https://my-portfolio-hqwo.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, institution, interest, message, resumeLink })
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Your message was sent successfully! I will get back to you soon.', 'success');
      document.getElementById('contactForm').reset();
    } else {
      showAlert(data.error || 'Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    showAlert('Could not connect to the server. Make sure the backend is running.', 'error');
  }

  btn.textContent = 'Send Message';
  btn.disabled = false;
});

function showAlert(msg, type) {
  const el = document.getElementById('formAlert');
  el.textContent = msg;
  el.className = 'alert ' + type;
  el.style.display = 'block';
}
