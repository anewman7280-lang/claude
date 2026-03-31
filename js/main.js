/**
 * Suncoast Senior Living — Main JavaScript
 * Handles lead capture forms, search filtering, FAQ toggles, and mobile nav.
 */

(function () {
  'use strict';

  // Community data with ECP contact page URLs
  var COMMUNITIES = {
    'suncoast-east': {
      name: 'Suncoast East',
      url: 'https://suncoasteastsl.com/contact-us/'
    },
    'suncoast-club': {
      name: 'Suncoast Club at Prestancia',
      url: 'https://suncoastclubsl.com/contact-us/'
    },
    'suncoast-house': {
      name: 'Suncoast House',
      url: 'https://suncoasthousesl.com/contact-us/'
    }
  };

  // ---- Mobile Navigation ----
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
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

      // Scroll to communities section
      var communitiesSection = document.getElementById('communities');
      if (communitiesSection) {
        communitiesSection.scrollIntoView({ behavior: 'smooth' });
      }
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

    // If nothing matches, show all with a message
    if (!anyVisible) {
      cards.forEach(function (card) { card.style.display = ''; });
    }
  }

  // ---- Lead Form Handling ----
  // All forms either redirect to the appropriate ECP contact page
  // or show a success message and can be configured to POST to your CRM.

  function handleLeadForm(form, formName) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      // Check if a specific community was selected
      var community = data.community || '';

      if (community && COMMUNITIES[community]) {
        // Redirect to the specific community's ECP contact page
        var popup = window.open(COMMUNITIES[community].url, '_blank');
        showFormSuccess(form, COMMUNITIES[community].name, COMMUNITIES[community].url, popup);
      } else {
        // No specific community — show success and provide options
        showFormSuccess(form);
      }

      // Log lead data (replace with actual CRM API call)
      console.log('[Suncoast Lead]', formName, data);

      // --- CRM INTEGRATION POINT ---
      // To send leads directly to ECP or another CRM, uncomment and configure:
      //
      // fetch('YOUR_CRM_ENDPOINT_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // }).then(function(response) {
      //   console.log('Lead sent to CRM', response);
      // }).catch(function(error) {
      //   console.error('CRM error', error);
      // });
    });
  }

  function showFormSuccess(form, communityName, communityUrl, popup) {
    var wrapper = form.parentElement;
    var successMsg = document.createElement('div');
    successMsg.className = 'form-success';

    if (communityName) {
      var popupBlocked = !popup || popup.closed;
      if (popupBlocked) {
        successMsg.innerHTML =
          '<h3>Thank You!</h3>' +
          '<p>We\'ve received your message. Please visit the contact page for <strong>' + communityName + '</strong> to get in touch directly:</p>' +
          '<div style="margin-top:16px">' +
          '<a href="' + communityUrl + '" class="btn btn-primary" target="_blank" rel="noopener">Contact ' + communityName + '</a>' +
          '</div>' +
          '<p style="margin-top:12px">A member of our team will also follow up with you shortly.</p>';
      } else {
        successMsg.innerHTML =
          '<h3>Thank You!</h3>' +
          '<p>We\'ve opened the contact page for <strong>' + communityName + '</strong> so you can get in touch directly.</p>' +
          '<p>A member of our team will also follow up with you shortly.</p>';
      }
    } else {
      successMsg.innerHTML =
        '<h3>Thank You!</h3>' +
        '<p>We\'ve received your information and a member of our team will contact you shortly.</p>' +
        '<p>In the meantime, feel free to contact any of our communities directly:</p>' +
        '<div style="margin-top:16px">' +
        '<a href="' + COMMUNITIES['suncoast-east'].url + '" class="btn btn-sm btn-primary" target="_blank" rel="noopener" style="margin:4px">Suncoast East</a> ' +
        '<a href="' + COMMUNITIES['suncoast-club'].url + '" class="btn btn-sm btn-primary" target="_blank" rel="noopener" style="margin:4px">Suncoast Club</a> ' +
        '<a href="' + COMMUNITIES['suncoast-house'].url + '" class="btn btn-sm btn-primary" target="_blank" rel="noopener" style="margin:4px">Suncoast House</a>' +
        '</div>';
    }

    form.style.display = 'none';
    wrapper.appendChild(successMsg);
  }

  // Quick lead form (name + phone only)
  var quickLeadForm = document.getElementById('quick-lead-form');
  if (quickLeadForm) {
    quickLeadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(quickLeadForm);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      console.log('[Suncoast Quick Lead]', data);

      // Replace form with thank you
      quickLeadForm.innerHTML =
        '<span style="font-size:1.1rem;font-weight:600">Thank you! We\'ll call you back shortly.</span>';

      // --- CRM INTEGRATION POINT ---
      // fetch('YOUR_CRM_ENDPOINT_URL', { ... });
    });
  }

  // Initialize all lead forms
  var mainLeadForm = document.getElementById('main-lead-form');
  if (mainLeadForm) handleLeadForm(mainLeadForm, 'Main Consultation Form');

  var contactLeadForm = document.getElementById('contact-lead-form');
  if (contactLeadForm) handleLeadForm(contactLeadForm, 'Contact Page Form');

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Sticky header shadow on scroll ----
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }
    });
  }

})();
