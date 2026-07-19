/**
 * Suncoast Senior Living — Main JavaScript
 * Handles search filtering, FAQ toggles, mobile nav, and the embedded lead form.
 *
 * NOTE: Lead capture is handled entirely by the embedded form at
 * pages/request-info.html (ECP CRM + Klaviyo). This file no longer processes
 * or stores any form submissions — it only sizes the embed to its content.
 */

(function () {
  'use strict';

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

  // ---- Embedded Lead Form: auto-resize ----
  // The lead form lives in an <iframe> (pages/request-info.html) and reports its
  // height via postMessage so it never clips or shows an inner scrollbar.
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data.suncoastFormHeight !== 'number') return;
    var frames = document.querySelectorAll('iframe.suncoast-form-frame');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].style.height = e.data.suncoastFormHeight + 'px';
      }
    }
  });

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
