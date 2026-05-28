(function () {
  'use strict';

  // ===== KLAVIYO CONFIGURATION =====
  var KLAVIYO_PUBLIC_KEY = 'TSAcWK';
  var KLAVIYO_LIST_ID = 'YOUR_KLAVIYO_LIST_ID';

  var COMMUNITIES = {
    'suncoast-east': { name: 'Suncoast East' },
    'suncoast-club': { name: 'Suncoast Club at Prestancia' },
    'suncoast-house': { name: 'Suncoast House' }
  };

  // ---- Mobile Navigation ----
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- FAQ Toggles ----
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // ---- Hero Search / Filter ----
  var heroSearchForm = document.getElementById('hero-search-form');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var careType = document.getElementById('care-type').value;
      var budget = document.getElementById('budget').value;
      filterCommunities(careType, budget);
      var section = document.getElementById('communities');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function filterCommunities(careType, budget) {
    var cards = document.querySelectorAll('.community-card');
    var anyVisible = false;
    cards.forEach(function (card) {
      var cardCare = card.getAttribute('data-care') || '';
      var cardBudget = card.getAttribute('data-budget') || '';
      var matchesCare = !careType || cardCare.indexOf(careType) !== -1;
      var matchesBudget = !budget || cardBudget.indexOf(budget) !== -1;
      if (matchesCare && matchesBudget) {
        card.style.display = '';
        anyVisible = true;
      } else {
        card.style.display = 'none';
      }
    });
    if (!anyVisible) {
      cards.forEach(function (card) { card.style.display = ''; });
    }
  }

  // ---- Klaviyo Integration ----

  function splitName(fullName) {
    var parts = (fullName || '').trim().split(/\s+/);
    return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' };
  }

  function formatPhone(phone) {
    var digits = (phone || '').replace(/\D/g, '');
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits[0] === '1') return '+' + digits;
    return '+' + digits;
  }

  function getThankYouPath() {
    if (window.location.pathname.indexOf('/pages/') !== -1) return 'thank-you.html';
    return 'pages/thank-you.html';
  }

  function submitToKlaviyo(profileData, formSource) {
    if (KLAVIYO_PUBLIC_KEY === 'YOUR_KLAVIYO_PUBLIC_KEY' || KLAVIYO_LIST_ID === 'YOUR_KLAVIYO_LIST_ID') {
      console.warn('[Suncoast] Klaviyo not configured — set KLAVIYO_PUBLIC_KEY and KLAVIYO_LIST_ID in js/main.js');
      console.log('[Suncoast Lead]', formSource, profileData);
      return Promise.resolve({ ok: true });
    }

    var name;
    if (profileData.full_name) {
      name = splitName(profileData.full_name);
    } else {
      name = { first: profileData.first_name || '', last: profileData.last_name || '' };
    }

    var community = profileData.community || '';
    var communityName = (community && COMMUNITIES[community]) ? COMMUNITIES[community].name : 'General Inquiry';

    return fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_PUBLIC_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'revision': '2024-10-15' },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            custom_source: formSource,
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: profileData.email,
                  phone_number: formatPhone(profileData.phone),
                  first_name: name.first,
                  last_name: name.last,
                  properties: {
                    community_interest: communityName,
                    message: profileData.message || '',
                    source_form: formSource,
                    relationship: profileData.relationship || '',
                    care_type: profileData.care_type || '',
                    timeline: profileData.timeline || ''
                  }
                }
              }
            }
          },
          relationships: {
            list: {
              data: { type: 'list', id: KLAVIYO_LIST_ID }
            }
          }
        }
      })
    });
  }

  // ---- Form Handler ----

  function handleLeadForm(form, formSource) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }

      var existing = form.querySelector('.form-error');
      if (existing) existing.remove();

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      submitToKlaviyo(data, formSource)
        .then(function (response) {
          if (!response.ok && response.status !== 202 && response.status !== 409) {
            throw new Error('Server returned ' + response.status);
          }
          window.location.href = getThankYouPath();
        })
        .catch(function (err) {
          console.error('[Suncoast Lead Error]', err);
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
          var msg = document.createElement('p');
          msg.className = 'form-error';
          msg.textContent = 'Something went wrong. Please try again or call us at (941) 555-5555.';
          btn.parentNode.insertBefore(msg, btn.nextSibling);
        });
    });
  }

  // ---- Initialize All Forms ----

  function initForms() {
    var forms = [
      { id: 'contact-lead-form', source: 'Suncoast Senior Living Contact Page' },
      { id: 'east-lead-form', source: 'Suncoast East Contact Form' },
      { id: 'club-lead-form', source: 'Suncoast Club Contact Form' },
      { id: 'house-lead-form', source: 'Suncoast House Contact Form' },
      { id: 'main-lead-form', source: 'Homepage Consultation Form' },
      { id: 'quick-lead-form', source: 'Homepage Quick Lead' }
    ];

    forms.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el && !el._klInit) {
        el._klInit = true;
        handleLeadForm(el, f.source);
      }
    });
  }

  initForms();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Sticky Header Shadow ----
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.06)';
    });
  }

})();
