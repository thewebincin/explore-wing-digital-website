'use strict';
/**
 * Explore Wings Client-Side Data & Maintenance Bridge for GitHub Pages
 */
(function() {
  const isGitHubPages = window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:';
  
  const MAINT_KEY = 'maintenance_mode';
  const BYPASS_KEY = 'ew_preview_live';
  const currentScriptUrl = document.currentScript ? document.currentScript.src : '';
  const nestedDirectory = /\/(?:services|industries)\//i.test(window.location.pathname);
  const fallbackScriptPath = nestedDirectory ? '../store.js' : './store.js';
  const storeScriptUrl = currentScriptUrl || new URL(fallbackScriptPath, window.location.href).href;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('preview') === 'live') {
    localStorage.setItem(BYPASS_KEY, 'true');
  } else if (urlParams.get('preview') === 'off') {
    localStorage.removeItem(BYPASS_KEY);
  }

  async function loadSiteControls() {
    if (window.location.protocol === 'file:') return null;
    try {
      const response = await fetch(new URL('site-control.json', storeScriptUrl), { cache: 'no-store' });
      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`Site controls returned HTTP ${response.status}`);
      const controls = await response.json();
      if (!controls || typeof controls !== 'object' || Array.isArray(controls)) {
        throw new Error('Site controls must be a JSON object.');
      }
      return controls;
    } catch (error) {
      console.error('Unable to load site-control.json; maintenance mode is not being applied.', error);
      return null;
    }
  }

  function applyMaintenanceControls(controls) {
    const isCurrentMaintPage = window.location.pathname.endsWith('maintenance.html');
    const maintenanceEnabled = controls
      ? controls[MAINT_KEY] === 'on'
      : localStorage.getItem(MAINT_KEY) === 'on';
    const hasPreviewToken = Boolean(
      controls &&
      typeof controls.preview_token === 'string' &&
      controls.preview_token &&
      urlParams.get('bypass') === controls.preview_token
    );
    const isPreviewLive = localStorage.getItem(BYPASS_KEY) === 'true' || hasPreviewToken;

    if (controls && isCurrentMaintPage) {
      const message = document.getElementById('maintenanceMessage');
      if (message && typeof controls.maintenance_message === 'string' && controls.maintenance_message.trim()) {
        message.textContent = controls.maintenance_message;
      }
      const returnTime = document.getElementById('maintenanceReturnTime');
      if (returnTime) {
        returnTime.hidden = !controls.maintenance_return_time;
        if (controls.maintenance_return_time) {
          returnTime.textContent = controls.maintenance_return_time;
        }
      }
    }

    if (maintenanceEnabled && !isPreviewLive && !isCurrentMaintPage) {
      const siteRoot = new URL('.', storeScriptUrl);
      window.location.replace(new URL('maintenance.html', siteRoot).href);
      return;
    }

    if (!maintenanceEnabled && isCurrentMaintPage) {
      window.location.replace(new URL('index.html', new URL('.', storeScriptUrl)).href);
      return;
    }

    if (maintenanceEnabled && isPreviewLive && !isCurrentMaintPage) {
      window.addEventListener('DOMContentLoaded', () => {
      if (!document.querySelector('.maintenance-preview-floating-bar')) {
        const bar = document.createElement('aside');
        bar.className = 'maintenance-preview-floating-bar';
        bar.style.cssText = 'position: sticky; top: 0; z-index: 99999; background: #D97706; color: #FFFFFF; padding: 10px 20px; font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.25); flex-wrap: wrap; gap: 10px; font-family: sans-serif;';
        bar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.1rem;">⚠️</span>
            <span><strong>Live Preview:</strong> This browser is bypassing maintenance mode. Public visitors see the maintenance page.</span>
          </div>
        `;
        document.body.prepend(bar);
      }
      });
    }
  }

  loadSiteControls().then(applyMaintenanceControls);

  // Client-side form handling for static hosting captures leads into localStorage.
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
