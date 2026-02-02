document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.main-nav');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });
  }

  // Future logic for "Event Pop-up" can go here

  // --- Footer newsletter: send submissions to Google Apps Script Web App ---
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzkmAz4_RC3wtjm6FcbgGhDRnFeI16dHyXIbYVNMs82ReL7cxL6gkfvs14PVhmOQ55Z/exec'; // Web App URL provided by user

  document.querySelectorAll('.footer-newsletter').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const hp = form.querySelector('input[name="hp"]')?.value;
      if (hp) return; // honeypot triggered — likely spam

      // basic client-side validation
      const email = emailInput?.value?.trim();
      const name = nameInput?.value?.trim();
      if (!email) {
        const err = document.createElement('div'); err.className = 'newsletter-error'; err.textContent = 'Please enter an email address.'; form.appendChild(err); setTimeout(()=>err.remove(),4000); return;
      }

      // set hidden page field
      const pageInput = form.querySelector('input[name="page"]');
      if (pageInput) pageInput.value = window.location.pathname || window.location.href;

      if (submitBtn) {
        submitBtn.disabled = true;
        var orig = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      }

      try {
        const res = await fetch(WEB_APP_URL, { method: 'POST', body: new URLSearchParams(new FormData(form)) });
        const text = await res.text();
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch (err) { json = null; }
        if (res.ok && json && json.status === 'ok') {
          const msg = document.createElement('div'); msg.className = 'newsletter-success'; msg.textContent = 'Thanks — you\'re subscribed!'; form.appendChild(msg); form.reset(); setTimeout(()=>msg.remove(),4000);
        } else {
          console.error('Newsletter submission failed', { status: res.status, text, json });
          throw new Error((json && json.error) ? json.error : 'Submission failed');
        }
      } catch (err) {
        const errDiv = form.querySelector('.newsletter-error') || document.createElement('div');
        errDiv.className = 'newsletter-error';
        errDiv.textContent = 'Could not submit — please try again later.';
        if (!form.contains(errDiv)) form.appendChild(errDiv);
        setTimeout(()=>{ if (form.contains(errDiv)) errDiv.remove(); }, 5000);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = orig;
        }
      }
    });
  });

});