'use strict';
/**
 * Explore Wings Client-Side Data & Maintenance Bridge for GitHub Pages
 */
(function() {
  const isGitHubPages = window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:';
  
  // Default Seed Fallback
  const DEFAULT_KEY = 'ew_site_content';
  const MAINT_KEY = 'maintenance_mode';
  const BYPASS_KEY = 'ew_preview_live';

  // 1. Check URL parameters for bypass or preview toggles
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('preview') === 'live' || urlParams.get('bypass') === 'ew-preview') {
    localStorage.setItem(BYPASS_KEY, 'true');
  } else if (urlParams.get('preview') === 'off') {
    localStorage.removeItem(BYPASS_KEY);
  }

  const isMaintOn = localStorage.getItem(MAINT_KEY) === 'on';
  const isPreviewLive = localStorage.getItem(BYPASS_KEY) === 'true';
  const isCurrentMaintPage = window.location.pathname.endsWith('maintenance.html');

  // 2. Handle Maintenance Mode Redirection on Static Hosting
  if (isMaintOn && !isPreviewLive && !isCurrentMaintPage) {
    window.location.replace('./maintenance.html');
    return;
  }

  if (!isMaintOn && isCurrentMaintPage) {
    window.location.replace('./index.html');
    return;
  }

  // 3. Inject Floating Preview Banner if previewing live while maintenance is on
  if (isMaintOn && isPreviewLive && !isCurrentMaintPage) {
    window.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.maintenance-preview-floating-bar')) {
        const bar = document.createElement('aside');
        bar.className = 'maintenance-preview-floating-bar';
        bar.style.cssText = 'position: sticky; top: 0; z-index: 99999; background: #D97706; color: #FFFFFF; padding: 10px 20px; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.25); flex-wrap: wrap; gap: 10px; font-family: sans-serif;';
        bar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">⚠️</span>
            <span><strong>Live Preview Active:</strong> Maintenance Mode is ON in GitHub Pages. Public visitors see the 503 Maintenance Page.</span>
          </div>
        `;
        document.body.prepend(bar);
      }
    });
  }

  // 5. Client-Side Form Handling for Static Hosting (Captures leads into localStorage)
  window.addEventListener('DOMContentLoaded', () => {
    // Lead capture forms
    const leadForms = document.querySelectorAll('#heroConsultForm, #projectEnquiryForm, form[action*="/api/consultation"]');
    leadForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (isGitHubPages) {
          e.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          data.submitted_at = new Date().toISOString();
          
          const existing = JSON.parse(localStorage.getItem('ew_enquiries') || '[]');
          existing.unshift(data);
          localStorage.setItem('ew_enquiries', JSON.stringify(existing));
          
          alert('Thank you! Your enquiry has been received by Explore Wings Digital Technologies.');
          form.reset();
        }
      });
    });

    // Maintenance notification form
    const notifyForm = document.getElementById('notifyForm');
    if (notifyForm) {
      notifyForm.addEventListener('submit', (e) => {
        if (isGitHubPages) {
          e.preventDefault();
          const contact = notifyForm.contact.value;
          const subscribers = JSON.parse(localStorage.getItem('ew_subscribers') || '[]');
          subscribers.unshift({ contact, created_at: new Date().toISOString() });
          localStorage.setItem('ew_subscribers', JSON.stringify(subscribers));
          
          const msgDiv = document.getElementById('notifyMsg');
          if (msgDiv) {
            msgDiv.style.display = 'block';
            msgDiv.style.color = '#10B981';
            msgDiv.textContent = 'Thank you! You will be notified the moment we are back online.';
          }
          notifyForm.reset();
        }
      });
    }

    // Apply any customized section edits from localStorage to DOM
    try {
      const storedData = JSON.parse(localStorage.getItem('ew_custom_sections') || '{}');
      if (storedData) {
        // Hero headline
        if (storedData['home_hero_title']) {
          const el = document.querySelector('.hero-headline');
          if (el) el.innerHTML = storedData['home_hero_title'];
        }
        if (storedData['home_hero_subtitle']) {
          const el = document.querySelector('.hero-lead-text');
          if (el) el.textContent = storedData['home_hero_subtitle'];
        }
      }
    } catch(err) {}
  });
})();
