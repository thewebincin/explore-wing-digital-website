/**
 * EXPLORE WINGS DIGITAL TECHNOLOGIES - MASTER INTERACTIVE ENGINE
 * Dual-Theme System (Red Signal & iOS 28), Mode Toggle, Multi-Step Form,
 * Confetti Particles, Chatbot Assistant, Brand Marquee, and Auto-Scroll.
 */

function initializePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  preloader.classList.add('has-runtime-progress');
  preloader.setAttribute('aria-hidden', 'false');

  const progressFill = preloader.querySelector('#preloaderProgress');
  const progressBar = progressFill && progressFill.parentElement;
  const displayRoot = preloader.querySelector('.preloader-content') || preloader;
  const runtime = document.createElement('div');
  runtime.className = 'preloader-runtime';

  const orbit = document.createElement('div');
  orbit.className = 'preloader-orbit';
  orbit.setAttribute('aria-hidden', 'true');
  orbit.innerHTML = '<span class="preloader-orbit-ring"></span><span class="preloader-orbit-ring"></span><span class="preloader-orbit-core"></span>';
  const logo = document.createElement('img');
  const logoSource = document.querySelector(
    '.site-header .brand-logo-img, .site-header .logo-img, .brand-link .logo-img, .preloader-chip img'
  );
  if (logoSource) logo.src = logoSource.currentSrc || logoSource.src;
  logo.className = 'preloader-orbit-logo';
  logo.alt = '';
  logo.decoding = 'async';
  orbit.querySelector('.preloader-orbit-core').appendChild(logo);
  displayRoot.insertBefore(orbit, displayRoot.firstChild);

  const brand = document.createElement('div');
  brand.className = 'preloader-brand';
  brand.innerHTML = '<strong>EXPLORE WINGS</strong><span>DIGITAL STUDIO · KERALA &amp; BEYOND</span>';

  const status = document.createElement('span');
  status.className = 'preloader-runtime-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Bringing your page together';

  const progressRow = document.createElement('div');
  progressRow.className = 'preloader-runtime-row';

  if (progressBar) {
    progressBar.classList.add('preloader-runtime-bar');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page loading progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressRow.appendChild(progressBar);
  } else {
    const bar = document.createElement('div');
    bar.className = 'preloader-runtime-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Page loading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const fill = document.createElement('span');
    fill.className = 'preloader-runtime-fill';
    bar.appendChild(fill);
    progressRow.appendChild(bar);
    preloader.dataset.runtimeProgress = 'true';
  }

  const percentage = document.createElement('span');
  percentage.className = 'preloader-runtime-percent';
  percentage.textContent = '0%';
  progressRow.appendChild(percentage);

  const skip = document.createElement('button');
  skip.className = 'preloader-runtime-skip';
  skip.type = 'button';
  skip.textContent = 'Skip intro';

  runtime.append(brand, status, progressRow, skip);
  displayRoot.appendChild(runtime);

  const images = Array.from(document.querySelectorAll(
    '.site-header .brand-logo-img, .site-header .logo-img, .brand-link .logo-img, .preloader-chip img'
  ));
  const imagesReady = Promise.all(images.map(image => {
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(imageTimeout);
        image.removeEventListener('load', settle);
        image.removeEventListener('error', settle);
        resolve();
      };
      const imageTimeout = window.setTimeout(settle, 900);
      image.addEventListener('load', settle, { once: true });
      image.addEventListener('error', settle, { once: true });
      if (image.complete) settle();
    });
  }));
  const pageReady = new Promise(resolve => {
    if (document.readyState !== 'loading') resolve();
    else document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });
  const fontsReady = document.fonts ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function settleWithin(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise(resolve => window.setTimeout(resolve, timeoutMs))
    ]);
  }
  const startedAt = performance.now();
  const minimumDisplay = reducedMotion ? 0 : 320;
  let progress = 0;
  let target = 24;
  let complete = false;
  let finished = false;
  let frame;
  let safetyTimer;

  function setStatus(message) {
    status.textContent = message;
  }

  function advanceTo(nextTarget, message) {
    if (nextTarget <= target) return;
    target = nextTarget;
    setStatus(message);
  }

  function updateProgress(value) {
    progress = Math.min(100, value);
    const rounded = Math.floor(progress);
    percentage.textContent = `${rounded}%`;
    const bar = progressRow.querySelector('[role="progressbar"]');
    if (bar) bar.setAttribute('aria-valuenow', String(rounded));
    const fill = progressRow.querySelector('.preloader-runtime-fill') || progressFill;
    if (fill) fill.style.width = `${progress}%`;
  }

  function finish(message = 'Everything is ready') {
    if (finished) return;
    finished = true;
    window.clearInterval(frame);
    window.clearTimeout(safetyTimer);
    document.removeEventListener('visibilitychange', finishWhenHidden);
    updateProgress(100);
    setStatus(message);
    preloader.setAttribute('aria-hidden', 'true');
    preloader.classList.add('is-hidden');
    window.setTimeout(() => preloader.remove(), reducedMotion ? 0 : 520);
  }

  function finishWhenHidden() {
    if (document.hidden) finish();
  }

  frame = window.setInterval(() => {
    if (finished) return;
    const difference = target - progress;
    if (difference > 0) updateProgress(progress + Math.max(4, difference * 0.24));
    if (complete && (reducedMotion || progress >= 99) &&
        performance.now() - startedAt >= minimumDisplay) finish();
  }, 32);

  pageReady.then(() => {
    advanceTo(56, 'Loading page content');
  });
  imagesReady.then(() => {
    advanceTo(78, 'Preparing your visuals');
  });
  fontsReady.then(() => {
    advanceTo(92, 'Finishing the details');
  });
  Promise.all([
    pageReady,
    settleWithin(imagesReady, 1000),
    settleWithin(fontsReady, 900)
  ]).then(() => {
    target = 100;
    complete = true;
  });

  skip.addEventListener('click', () => finish(), { once: true });
  document.addEventListener('visibilitychange', finishWhenHidden);
  finishWhenHidden();
  if (finished) return;
  safetyTimer = window.setTimeout(() => finish('Opening your page'), 2400);
}

document.addEventListener('DOMContentLoaded', () => {
  function initPageEnhancements() {
    const isNestedPage = /\/(services|industries)\//.test(location.pathname);
    const linkPrefix = isNestedPage ? '../' : './';
    const section = document.createElement('section');
    section.className = 'site-next-steps';
    section.setAttribute('aria-labelledby', 'siteNextStepsTitle');

    const isLegalPage = /\/(privacy|terms)\.html$/i.test(location.pathname);
    if (isLegalPage) {
      section.innerHTML = `
        <div class="container site-next-steps-inner">
          <div class="site-next-steps-heading">
            <span class="site-next-steps-eyebrow">WE’RE HERE TO HELP</span>
            <h2 id="siteNextStepsTitle">Questions about our policies?</h2>
            <p>Get in touch with the studio and we’ll help clarify the information on this page.</p>
          </div>
          <a class="site-next-steps-link" href="${linkPrefix}contact.html">Contact the team <span aria-hidden="true">→</span></a>
        </div>`;
    } else {
      section.innerHTML = `
        <div class="container site-next-steps-inner">
          <div class="site-next-steps-heading">
            <span class="site-next-steps-eyebrow">A PRACTICAL PLACE TO START</span>
            <h2 id="siteNextStepsTitle">The next step should feel simple.</h2>
            <p>Start with one useful change: help people find you, understand your offer or get in touch.</p>
          </div>
          <div class="site-next-steps-grid">
            <a class="site-next-step-card" href="${linkPrefix}services/local-seo.html">
              <span class="site-next-step-top">
                <span class="site-next-step-number">01 <span aria-hidden="true">/</span> GET DISCOVERED</span>
                <span class="site-next-step-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M19 10.1c0 5.1-7 11-7 11s-7-5.9-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/></svg></span>
              </span>
              <h3>Be easier to find</h3>
              <p>Make your services, location and contact details clear when nearby customers search.</p>
              <span class="site-next-step-action">Explore local SEO <span aria-hidden="true">→</span></span>
            </a>
            <a class="site-next-step-card" href="${linkPrefix}services/website-design.html">
              <span class="site-next-step-top">
                <span class="site-next-step-number">02 <span aria-hidden="true">/</span> EARN TRUST</span>
                <span class="site-next-step-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9h17M7 6.8h.01M10 6.8h.01M8 13h8M8 16h5"/></svg></span>
              </span>
              <h3>Make a strong first impression</h3>
              <p>Give people a fast, mobile-friendly place to understand your business and choose what to do next.</p>
              <span class="site-next-step-action">Explore website design <span aria-hidden="true">→</span></span>
            </a>
            <a class="site-next-step-card" href="${linkPrefix}free-digital-plan.html">
              <span class="site-next-step-top">
                <span class="site-next-step-number">03 <span aria-hidden="true">/</span> KEEP IMPROVING</span>
                <span class="site-next-step-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M8.5 10l1.5 1.5 3-3M8.5 16l1.5 1.5 3-3M15.5 11h2M15.5 17h2"/></svg></span>
              </span>
              <h3>Choose your next move</h3>
              <p>Start with your priorities, then shape a practical plan around your goals and resources.</p>
              <span class="site-next-step-action">Get a free digital plan <span aria-hidden="true">→</span></span>
            </a>
          </div>
          <a class="site-next-steps-link" href="${linkPrefix}contact.html">Talk through your idea <span aria-hidden="true">→</span></a>
        </div>`;
    }

    const makeIdeas = (items) => items.map(([text, label, title, detail, action]) => ({ text, label, title, detail, action }));
    const defaultIdeas = makeIdeas([
      ['Put your main contact option near the information customers need before they call.', 'MAKE CONTACT EASY', 'Have a question?', 'Phone · Email · WhatsApp', 'Contact us'],
      ['Check that your opening hours and service area match across your website and business listing.', 'CHECK YOUR DETAILS', 'Plan a visit', 'Hours · Address · Directions', 'Get directions'],
      ['Answer a common customer question on the page where they are likely to need the answer.', 'ANSWER A REAL QUESTION', 'Do you serve my area?', 'See our service area', 'Find out more']
    ]);
    const ideasByPage = {
      'local-seo.html': makeIdeas([
        ['Check that your business name, address, phone and hours match across your website and Google listing.', 'LOCAL DETAILS', 'Find the right location', 'Address · Hours · Phone', 'View details'],
        ['Create service pages only for work and locations your team actually covers.', 'BE SPECIFIC', 'What do you offer?', 'Services · Areas · Contact', 'See services'],
        ['Reply to reviews politely and avoid sharing a customer’s private details in public.', 'REVIEW RESPONSES', 'Thanks for your feedback', 'A reply from the business', 'Read reviews']
      ]),
      'website-design.html': makeIdeas([
        ['Put the phone, email or WhatsApp link where visitors expect it, then test it on a phone.', 'CONTACT BY DESIGN', 'Talk to the team', 'Choose a contact method', 'Get in touch'],
        ['Write down the questions customers ask before they decide, and answer them on the relevant page.', 'USEFUL PAGE CONTENT', 'What should I know?', 'Answers beside each service', 'Read more'],
        ['Use current photos of your people, products or premises instead of generic imagery.', 'SHOW THE REAL BUSINESS', 'Meet the team', 'People · Work · Location', 'About us']
      ]),
      'web-development.html': makeIdeas([
        ['Decide where each form enquiry should go before development starts.', 'PLAN THE WORKFLOW', 'Send an enquiry', 'Choose a department', 'Continue'],
        ['Agree which catalogue details customers need to compare, such as model, size or availability.', 'MAKE CATALOGUES USEFUL', 'Browse products', 'Category · Details · Enquire', 'View products'],
        ['Test important forms and integrations with sample information before publishing.', 'CHECK THE DETAILS', 'Request received', 'We’ll confirm the next step', 'Submit enquiry']
      ]),
      'business-websites.html': makeIdeas([
        ['Group catalogue items in the same way customers describe them, not only by internal department.', 'PLAN THE NAVIGATION', 'Browse the catalogue', 'Choose a product category', 'Browse'],
        ['Give each branch a current address, phone number and opening hours.', 'BRANCH INFORMATION', 'Choose a location', 'Address · Hours · Phone', 'Find a branch'],
        ['Decide who on your team will update product and location information after launch.', 'PLAN FOR UPDATES', 'Information updated', 'Last checked by your team', 'See details']
      ]),
      'branding.html': makeIdeas([
        ['Choose a small set of colours and type styles your team can use consistently.', 'SET A VISUAL DIRECTION', 'Explore Wings', 'Colour · Type · Images', 'Learn about us'],
        ['Check whether the same identity works on your website, signboard and printed materials.', 'CHECK EACH APPLICATION', 'The same brand', 'Website · Sign · Print', 'View examples'],
        ['Write down a few words that describe your business before choosing visual references.', 'START WITH YOUR BUSINESS', 'How should it feel?', 'Friendly · Skilled · Clear', 'Meet the team']
      ]),
      'branding-logos.html': makeIdeas([
        ['Check the logo at the smallest size it will be used, such as a browser icon or social profile.', 'TEST SMALL SIZES', 'Explore Wings', 'Logo preview · Small size', 'View logo'],
        ['Prepare light and dark-background versions if the mark will appear on different materials.', 'PLAN FOR DIFFERENT BACKGROUNDS', 'Light or dark?', 'Choose a suitable logo file', 'See options'],
        ['Ask your printer which file type and colour profile they need before production.', 'CHECK PRINT REQUIREMENTS', 'Ready for print', 'Artwork · Size · Colour', 'Download files']
      ]),
      'digital-marketing.html': makeIdeas([
        ['Choose one offer and one audience for each campaign so results are easier to review.', 'KEEP THE CAMPAIGN FOCUSED', 'Current offer', 'Who it is for · Dates', 'See the offer'],
        ['Decide which action matters—such as a form, call or booking enquiry—and check it works before launch.', 'MEASURE AN ACTION', 'Request a callback', 'A clear form · Working link', 'Send a request'],
        ['Review search terms and placements regularly, then adjust the campaign with your team.', 'REVIEW SPEND', 'Campaign summary', 'Budget · Clicks · Enquiries', 'View report']
      ]),
      'social-media.html': makeIdeas([
        ['Plan posts around something customers can actually see, use or ask your team about.', 'POST WITH A PURPOSE', 'This week at the studio', 'A real update from your team', 'See the post'],
        ['Use one clear point in each caption and tell people what to do next.', 'KEEP CAPTIONS CLEAR', 'New collection', 'Available in store · Ask us', 'Send a message'],
        ['Agree who will reply to comments and what questions should go to your staff.', 'PLAN THE REPLIES', 'Thanks for asking', 'Our team can help with that', 'Contact us']
      ]),
      'photo-video.html': makeIdeas([
        ['Make a short shot list of the dishes, products or spaces that are most important to show.', 'PLAN THE SHOOT', 'What we photographed', 'Products · People · Place', 'See the gallery'],
        ['Photograph a product or room from the angles customers want to compare.', 'SHOW USEFUL DETAILS', 'Room details', 'Bed · View · Facilities', 'See the room'],
        ['Choose image crops for the places they will appear, such as a menu, website or social post.', 'PREPARE THE RIGHT FORMATS', 'Image ready', 'Web · Social · Print', 'View gallery']
      ]),
      'restaurants-cafes.html': makeIdeas([
        ['Check that the online menu shows current dishes, prices and any items that are unavailable.', 'MENU CHECK', 'Today’s menu', 'Dishes · Prices · Updates', 'View menu'],
        ['Show the actual food and dining space so visitors know what to expect.', 'SHOW YOUR PLACE', 'At the restaurant', 'Food · Tables · People', 'See photos'],
        ['Check the map pin, opening hours and entrance directions before a busy weekend.', 'HELP GUESTS ARRIVE', 'Find us', 'Address · Hours · Parking', 'Get directions']
      ]),
      'resorts-hotels.html': makeIdeas([
        ['List room types, what each rate includes and how guests can check availability.', 'ROOM INFORMATION', 'Choose a room', 'Room details · Enquire', 'Check availability'],
        ['If you promote a seasonal package, show its dates, inclusions and booking terms.', 'SEASONAL OFFER', 'A stay in Kerala', 'Dates · Inclusions · Terms', 'View package'],
        ['Use current photos of rooms and shared facilities, and label them accurately.', 'SET CLEAR EXPECTATIONS', 'Explore the property', 'Rooms · Dining · Facilities', 'View photos']
      ]),
      'healthcare.html': makeIdeas([
        ['Check that clinician profiles list current specialties, consultation days and contact details.', 'CLINIC INFORMATION', 'Find a clinician', 'Specialty · Hours · Contact', 'View profiles'],
        ['Collect only the details your reception team needs for an appointment enquiry.', 'KEEP FORMS RELEVANT', 'Appointment enquiry', 'Preferred time · Contact', 'Send enquiry'],
        ['Make the clinic address, map pin, entrance and opening hours easy to confirm.', 'HELP PATIENTS FIND YOU', 'Visit the clinic', 'Address · Hours · Directions', 'Get directions']
      ]),
      'education.html': makeIdeas([
        ['Put the course duration, entry requirements and next intake date on each course page.', 'COURSE DETAILS', 'Explore a course', 'Duration · Requirements · Dates', 'View course'],
        ['Use current fees and application dates, and make it clear when details may change.', 'KEEP ADMISSIONS CURRENT', 'Applications open', 'Dates · Fees · Contact', 'Ask admissions'],
        ['Show the actual campus, classrooms or labs students will use.', 'SHOW THE LEARNING SPACE', 'Visit the campus', 'Classrooms · Labs · People', 'See the campus']
      ]),
      'fitness-wellness.html': makeIdeas([
        ['Keep class times, booking instructions and trainer names up to date.', 'CLASS SCHEDULE', 'Choose a class', 'Time · Instructor · Level', 'View timetable'],
        ['Explain what a first-time visitor should bring and how to join a trial session.', 'FIRST VISIT', 'Try a class', 'What to bring · How to book', 'Ask about a trial'],
        ['Use coach profiles to explain their experience and the classes they teach.', 'MEET THE COACHES', 'Your training team', 'Coaches · Classes · Approach', 'Meet the team']
      ]),
      'shops-malls.html': makeIdeas([
        ['Share current product photos and say how customers can check stock or sizes.', 'PRODUCT ENQUIRIES', 'Check availability', 'Product · Size · Colour', 'Ask the store'],
        ['Include the dates and conditions on every seasonal promotion.', 'SALE DETAILS', 'Seasonal offer', 'Dates · Products · Terms', 'View offer'],
        ['Check store hours, parking details and map directions before a campaign goes live.', 'STORE VISIT', 'Plan your visit', 'Hours · Parking · Directions', 'Get directions']
      ]),
      'real-estate.html': makeIdeas([
        ['Keep project status, floor plans and specifications in line with information approved by your team.', 'PROJECT DETAILS', 'Explore the project', 'Plans · Location · Status', 'View details'],
        ['Use current images and label model units or completed spaces clearly.', 'PROPERTY PHOTOS', 'See the property', 'Current images · Captions', 'View gallery'],
        ['Make it easy to ask a question or arrange a visit, then confirm the details with your team.', 'SITE VISIT ENQUIRY', 'Arrange a visit', 'Contact the project team', 'Ask about a visit']
      ]),
      'business-services.html': makeIdeas([
        ['Describe your services and the types of organisations your team works with.', 'EXPLAIN YOUR WORK', 'What we do', 'Services · Sectors · Locations', 'View services'],
        ['Include relevant team experience and qualifications, with details checked by your firm.', 'SHOW VERIFIED EXPERIENCE', 'Meet the team', 'Experience · Credentials', 'Read profiles'],
        ['Give new clients a clear contact route and say what information is useful in their first enquiry.', 'MAKE THE FIRST STEP CLEAR', 'Discuss a project', 'Tell us about your needs', 'Contact the firm']
      ])
    };
    const pageKey = location.pathname.toLowerCase().split('/').pop();
    const ideas = ideasByPage[pageKey] || defaultIdeas;
    const ideaSection = isLegalPage ? null : document.createElement('section');
    if (ideaSection) {
      ideaSection.className = 'site-idea-section';
      ideaSection.setAttribute('aria-labelledby', 'siteIdeaTitle');
      const initialIdea = Math.floor(Date.now() / 86400000) % ideas.length;
      ideaSection.innerHTML = `
        <div class="container site-idea-inner">
          <div class="site-idea-mark" aria-hidden="true">✦</div>
          <div class="site-idea-copy">
            <span class="site-next-steps-eyebrow">A QUICK DIGITAL IDEA · <span id="siteIdeaCount">${String(initialIdea + 1).padStart(2, '0')} / 03</span></span>
            <h2 id="siteIdeaTitle">One small improvement can make the next step clearer.</h2>
            <p id="siteIdeaText" aria-live="polite">${ideas[initialIdea].text}</p>
            <button type="button" class="site-idea-shuffle" id="siteIdeaShuffle">Show another idea <span aria-hidden="true">↗</span></button>
          </div>
          <div class="site-idea-preview" aria-label="Example of how to apply this idea">
            <div class="site-idea-preview-bar"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span>YOUR WEBSITE</span></div>
            <div class="site-idea-preview-content">
              <span class="site-idea-preview-label" id="siteIdeaPreviewLabel">${ideas[initialIdea].label}</span>
              <h3 id="siteIdeaPreviewTitle">${ideas[initialIdea].title}</h3>
              <p id="siteIdeaPreviewDetail">${ideas[initialIdea].detail}</p>
              <span class="site-idea-preview-action" id="siteIdeaPreviewAction">${ideas[initialIdea].action}<span aria-hidden="true">↗</span></span>
            </div>
            <div class="site-idea-preview-foot"><span aria-hidden="true">✦</span> A small change, made clear</div>
          </div>
        </div>`;
      const count = ideaSection.querySelector('#siteIdeaCount');
      const text = ideaSection.querySelector('#siteIdeaText');
      const previewLabel = ideaSection.querySelector('#siteIdeaPreviewLabel');
      const previewTitle = ideaSection.querySelector('#siteIdeaPreviewTitle');
      const previewDetail = ideaSection.querySelector('#siteIdeaPreviewDetail');
      const previewAction = ideaSection.querySelector('#siteIdeaPreviewAction');
      let ideaIndex = initialIdea;
      ideaSection.querySelector('#siteIdeaShuffle').addEventListener('click', () => {
        ideaIndex = (ideaIndex + 1) % ideas.length;
        count.textContent = `${String(ideaIndex + 1).padStart(2, '0')} / 03`;
        text.textContent = ideas[ideaIndex].text;
        previewLabel.textContent = ideas[ideaIndex].label;
        previewTitle.textContent = ideas[ideaIndex].title;
        previewDetail.textContent = ideas[ideaIndex].detail;
        previewAction.firstChild.textContent = ideas[ideaIndex].action;
      });
    }

    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    if (footer && footer.parentNode) {
      if (ideaSection) footer.parentNode.insertBefore(ideaSection, footer);
      footer.parentNode.insertBefore(section, footer);
    } else if (main) {
      if (ideaSection) main.appendChild(ideaSection);
      main.appendChild(section);
    } else {
      if (ideaSection) document.body.appendChild(ideaSection);
      document.body.appendChild(section);
    }

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll(
      'main section, body > section:not(.site-next-steps), .service-card, .pricing-card, .industry-card, .principle-card, .story-grid > *, .card, .faq-item, .site-next-steps-heading, .site-next-step-card, .site-next-steps-link, .site-idea-copy, .site-idea-shuffle'
    );
    if (!targets.length) return;

    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    targets.forEach((element, index) => {
      element.dataset.motionReveal = '';
      element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 55}ms`);
      observer.observe(element);
    });
  }

  // -------------------------------------------------------------------------
  // 1. DUAL-THEME SWITCHER & MODE ENGINE
  // -------------------------------------------------------------------------
  const html = document.documentElement;
  const themeSelect = document.getElementById('themeSelect');
  const modeButtons = document.querySelectorAll('[data-set-mode]');
  modeButtons.forEach(button => {
    if (button.getAttribute('data-set-mode') === 'split') {
      button.setAttribute('data-set-mode', 'light');
    }
  });

  // Initialize Theme from localStorage or DOM attribute
  let currentTheme = 'red-signal';
  try {
    currentTheme = localStorage.getItem('ew_theme') || html.getAttribute('data-theme') || 'red-signal';
  } catch (e) {}
  html.setAttribute('data-theme', currentTheme);
  if (themeSelect) {
    themeSelect.value = currentTheme;
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      html.setAttribute('data-theme', selected);
      try {
        localStorage.setItem('ew_theme', selected);
      } catch (err) {}
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: selected } }));
    });
  }

  // Initialize Light / Dark Mode
  let currentMode = 'dark';
  try {
    currentMode = localStorage.getItem('ew_mode') || localStorage.getItem('ew_theme_mode') || html.getAttribute('data-mode') || 'dark';
  } catch (e) {}
  if (currentMode === 'split') currentMode = 'light';
  if (!['light', 'dark'].includes(currentMode)) currentMode = 'dark';
  html.setAttribute('data-mode', currentMode);
  updateModeButtons(currentMode);

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-set-mode');
      html.setAttribute('data-mode', targetMode);
      try {
        localStorage.setItem('ew_mode', targetMode);
        localStorage.setItem('ew_theme_mode', targetMode);
      } catch (err) {}
      updateModeButtons(targetMode);
    });
  });

  function updateModeButtons(mode) {
    modeButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-set-mode') === mode);
    });
  }

  // -------------------------------------------------------------------------
  // 2. SCROLL PROGRESS BAR
  // -------------------------------------------------------------------------
  const scrollBar = document.getElementById('scrollProgressBar');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      scrollBar.style.width = pct + '%';
    }, { passive: true });
  }

  const utilityBar = document.querySelector('.top-bar');
  const siteHeaders = document.querySelectorAll('.site-header, .navbar');
  if (utilityBar || siteHeaders.length) {
    let lastScrollY = window.scrollY;
    let scrollUpdateScheduled = false;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (currentScrollY > 120) {
        html.classList.add('utility-bar-hidden');
      } else {
        html.classList.remove('utility-bar-hidden');
      }

      if (currentScrollY <= 120 || scrollDelta < -4) {
        html.classList.remove('header-hidden');
      } else if (currentScrollY > 160 && scrollDelta > 4) {
        html.classList.add('header-hidden');
      }

      lastScrollY = currentScrollY;
      scrollUpdateScheduled = false;
    };

    updateHeaderVisibility();
    window.addEventListener('scroll', () => {
      if (scrollUpdateScheduled) return;
      scrollUpdateScheduled = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    }, { passive: true });

    siteHeaders.forEach(header => {
      header.addEventListener('focusin', () => html.classList.remove('header-hidden'));
    });
  }

  // -------------------------------------------------------------------------
  // 3. PRELOADER DISMISSAL
  // -------------------------------------------------------------------------
  initializePreloader();

  // -------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER
  // -------------------------------------------------------------------------
  const openBtn = document.getElementById('mobileMenuOpen') || document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuClose') || document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer') || document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // -------------------------------------------------------------------------
  // 5. CLIENT BRAND GRID
  // -------------------------------------------------------------------------
  const BRANDS = [
    { name: 'Aadisaktthi Resorts & Spa', file: 'aadisaktthi-resorts-spa.webp' },
    { name: 'Terrace by Makkawao', file: 'terrace-by-makkawao.webp' },
    { name: 'Elaf', file: 'elaf.webp' },
    { name: 'Global Fitness', file: 'global-fitness.webp' },
    { name: 'Edustudy International', file: 'edustudy-international-png.webp' },
    { name: 'Transorze Information Technology', file: 'transorze-updated.png', brand: 'transorze' },
    { name: 'LuLu Mall', file: 'lulu-png.webp' },
    { name: 'Munch', file: 'munch-png.webp' },
    { name: 'Milagro Homes', file: 'milagro-homes.jpg', brand: 'milagro-homes' }
  ];
  const brandAssetPrefix = /\/(services|industries)\//.test(window.location.pathname) ? '../assets/logos/clean/' : 'assets/logos/clean/';

  const staticBrandRow = document.getElementById('brandsStaticRow');
  if (staticBrandRow) {
    staticBrandRow.innerHTML = BRANDS.map(logo => `
      <div class="brand-chip" data-brand="${logo.brand || ''}" title="${logo.name}">
        <img src="${brandAssetPrefix}${logo.file}" alt="${logo.name}" loading="lazy" decoding="async" fetchpriority="low" class="brand-marquee-img">
      </div>
    `).join('');
  }
  // -------------------------------------------------------------------------
  // 6. MULTI-STEP INTAKE FORM & CONFETTI (Contact Page)
  // -------------------------------------------------------------------------
  const intakeForm = document.getElementById('intakeForm');
  if (intakeForm) {
    let currentStep = 1;
    const totalSteps = 4;
    const progressBar = document.getElementById('intakeProgressBar');

    function goToStep(stepNum) {
      currentStep = stepNum;
      for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.getElementById('intakeStep' + i);
        const indEl = document.getElementById('stepIndicator' + i);
        if (stepEl) stepEl.classList.toggle('is-active', i === currentStep);
        if (indEl) indEl.classList.toggle('is-active', i === currentStep);
      }
      if (progressBar) {
        progressBar.style.width = ((currentStep / totalSteps) * 100) + '%';
      }
      if (currentStep === 4) {
        populateSummary();
      }
    }

    function populateSummary() {
      const name = document.getElementById('clientName')?.value || '-';
      const biz = document.getElementById('businessName')?.value || '-';
      const phone = document.getElementById('clientPhone')?.value || '-';
      const email = document.getElementById('clientEmail')?.value || '-';

      const checkedServices = [];
      intakeForm.querySelectorAll('input[name="services"]:checked').forEach(cb => checkedServices.push(cb.value));
      const budget = intakeForm.querySelector('input[name="budget"]:checked')?.value || 'Flexible';

      const sName = document.getElementById('sumName'); if (sName) sName.textContent = name;
      const sBiz = document.getElementById('sumBiz'); if (sBiz) sBiz.textContent = biz;
      const sPhone = document.getElementById('sumPhone'); if (sPhone) sPhone.textContent = phone;
      const sEmail = document.getElementById('sumEmail'); if (sEmail) sEmail.textContent = email;
      const sServices = document.getElementById('sumServices'); if (sServices) sServices.textContent = checkedServices.join(', ') || 'Comprehensive Sprint';
      const sBudget = document.getElementById('sumBudget'); if (sBudget) sBudget.textContent = budget;
    }

    intakeForm.querySelectorAll('.next-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target'), 10);
        if (currentStep === 1) {
          const step1 = document.getElementById('intakeStep1');
          if (step1) {
            let valid = true;
            const nameInput = document.getElementById('clientName');
            const bizInput = document.getElementById('businessName');
            const phoneInput = document.getElementById('clientPhone');

            if (nameInput && !nameInput.value.trim()) { nameInput.style.borderColor = '#E4202D'; valid = false; }
            else if (nameInput) { nameInput.style.borderColor = ''; }

            if (bizInput && !bizInput.value.trim()) { bizInput.style.borderColor = '#E4202D'; valid = false; }
            else if (bizInput) { bizInput.style.borderColor = ''; }

            if (phoneInput) {
              const clean = phoneInput.value.replace(/[^0-9]/g, '');
              if (clean.length < 10) {
                phoneInput.style.borderColor = '#E4202D';
                valid = false;
              } else {
                phoneInput.style.borderColor = '';
              }
            }
            if (!valid) return;
          }
        }
        goToStep(target);
      });
    });

    intakeForm.querySelectorAll('.prev-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.getAttribute('data-target'), 10);
        goToStep(target);
      });
    });

    // WhatsApp Dispatch
    const waBtn = document.getElementById('sendWhatsAppBtn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const name = document.getElementById('clientName')?.value || '';
        const biz = document.getElementById('businessName')?.value || '';
        const phone = document.getElementById('clientPhone')?.value || '';
        const checkedServices = [];
        intakeForm.querySelectorAll('input[name="services"]:checked').forEach(cb => checkedServices.push(cb.value));
        const budget = intakeForm.querySelector('input[name="budget"]:checked')?.value || '';

        const msg = encodeURIComponent(`Hello Explore Wings Studio! I would like to initiate a project.
Name: ${name}
Business: ${biz}
Phone: ${phone}
Services: ${checkedServices.join(', ')}
Budget: ${budget}`);
        window.open(`https://wa.me/918921309190?text=${msg}`, '_blank');
      });
    }

    // Direct Form Submit + Confetti Burst
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('intakeFeedback');
      if (feedback) {
        feedback.className = 'form-feedback-msg is-success';
        feedback.textContent = 'Project brief received! Our team will review your brief and contact you within 2 business hours.';
      }
      triggerConfetti();
    });
  }

  // Pure Vanilla Canvas Confetti Burst
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#E4202D', '#007AFF', '#FFD700', '#5856D6', '#0F766E', '#FFFFFF'];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.opacity -= 0.012;
        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (active && frame < 120) {
        frame++;
        requestAnimationFrame(render);
      } else {
        canvas.remove();
      }
    }
    render();
  }

  // -------------------------------------------------------------------------
  // 7. AUTO-SCROLL ENGINE
  // -------------------------------------------------------------------------
  const autoScrollBtn = document.getElementById('autoScrollToggle');
  if (autoScrollBtn) {
    let isAutoScrolling = false;
    let animId = null;
    let previousFrameTime = 0;

    autoScrollBtn.addEventListener('click', () => {
      isAutoScrolling = !isAutoScrolling;
      autoScrollBtn.setAttribute('aria-pressed', isAutoScrolling ? 'true' : 'false');
      autoScrollBtn.classList.toggle('is-scrolling', isAutoScrolling);
      document.documentElement.classList.toggle('is-auto-scrolling', isAutoScrolling);

      if (isAutoScrolling) {
        previousFrameTime = 0;
        function scrollStep(timestamp) {
          if (!isAutoScrolling) return;
          if (!previousFrameTime) previousFrameTime = timestamp;
          const elapsed = Math.min(timestamp - previousFrameTime, 50);
          previousFrameTime = timestamp;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (window.scrollY >= maxScroll - 2) {
            window.scrollTo(0, 0);
          } else {
            window.scrollTo(0, window.scrollY + 72 * elapsed / 1000);
          }
          animId = requestAnimationFrame(scrollStep);
        }
        animId = requestAnimationFrame(scrollStep);
      } else {
        cancelAnimationFrame(animId);
      }
    });

    ['wheel', 'touchstart', 'mousedown'].forEach(ev => {
      window.addEventListener(ev, (event) => {
        if (isAutoScrolling) {
          if (ev === 'mousedown' && autoScrollBtn.contains(event.target)) return;
          isAutoScrolling = false;
          autoScrollBtn.setAttribute('aria-pressed', 'false');
          autoScrollBtn.classList.remove('is-scrolling');
          document.documentElement.classList.remove('is-auto-scrolling');
          cancelAnimationFrame(animId);
        }
      }, { passive: true });
    });
  }

  // -------------------------------------------------------------------------
  // 8. CHATBOT ASSISTANT
  // -------------------------------------------------------------------------
  const chatToggle = document.getElementById('chatbotToggle');
  const chatWidget = document.getElementById('chatbotWidget');
  const chatClose = document.getElementById('chatbotClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatReplies = document.getElementById('chatQuickReplies');

  if (chatToggle && chatWidget) {
    const minButtons = chatWidget.querySelectorAll('#chatbotMinimize, #chatbotClose, .chatbot-minimize');
    minButtons.forEach(btn => {
      btn.id = 'chatbotMinimize';
      btn.className = 'chatbot-minimize';
      btn.type = 'button';
      btn.hidden = false;
      btn.setAttribute('aria-label', 'Minimize assistant');
      btn.title = 'Minimize assistant';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
    });

    let minimizeTimer;
    function setChatOpen(isOpen, focusInput = false) {
      window.clearTimeout(minimizeTimer);
      if (isOpen) {
        chatWidget.style.display = 'flex';
        void chatWidget.offsetWidth;
        chatWidget.classList.remove('is-minimizing');
        chatWidget.classList.add('is-open');
        chatWidget.setAttribute('aria-hidden', 'false');
        chatToggle.setAttribute('aria-expanded', 'true');
        chatToggle.setAttribute('aria-label', 'Minimize Webinc Smart Assistant');
        try {
          localStorage.removeItem('ew_chatbot_minimized');
          sessionStorage.removeItem('ew_chatbot_minimized');
        } catch (_) {}
        const chatInput = document.getElementById('chatInput');
        if (focusInput && chatInput) chatInput.focus();
        return;
      }

      if (!chatWidget.classList.contains('is-open')) {
        chatWidget.classList.remove('is-minimizing');
        chatWidget.style.display = 'none';
        return;
      }

      try {
        localStorage.setItem('ew_chatbot_minimized', 'true');
        sessionStorage.setItem('ew_chatbot_minimized', 'true');
      } catch (_) {}

      chatWidget.setAttribute('aria-hidden', 'true');
      chatToggle.setAttribute('aria-expanded', 'false');
      chatToggle.setAttribute('aria-label', 'Open Webinc Smart Assistant');
      chatWidget.classList.add('is-minimizing');
      minButtons.forEach(btn => btn.blur());
      minimizeTimer = window.setTimeout(() => {
        chatWidget.classList.remove('is-open', 'is-minimizing');
        chatWidget.style.display = 'none';
      }, 260);
    }

    chatToggle.hidden = false;
    chatWidget.classList.remove('is-open', 'is-minimizing');
    chatWidget.style.display = 'none';
    chatWidget.setAttribute('aria-hidden', 'true');
    chatToggle.setAttribute('aria-expanded', 'false');
    chatToggle.setAttribute('aria-label', 'Open Webinc Smart Assistant');

    chatToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = chatWidget.classList.contains('is-open') && !chatWidget.classList.contains('is-minimizing');
      setChatOpen(!isOpen, !isOpen);
    });

    minButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setChatOpen(false);
      });
    });

    chatWidget.addEventListener('keydown', event => {
      if (event.key === 'Escape') setChatOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && chatWidget.classList.contains('is-open')) {
        setChatOpen(false);
      }
    });

    const responses = {
      services: "We engineer 6 core capabilities: 1) High-speed Web Engineering, 2) Meta & Google Performance Ads, 3) Local Search Engine Optimization, 4) WhatsApp Lead Automation, 5) Brand Identity & Visual Systems, and 6) Revenue Tracking Analytics.",
      pricing: "Our investment tiers: ₹25,000/mo (Local Growth), ₹45,000/mo (Multi-Channel Scale), ₹85,000/mo (Market Leader Retainer), and Custom Enterprise Sprints. All retainers are month-to-month with no locked contracts.",
      how_we_work: "We operate in 6 focused stages: Discovery Audit, Strategy Blueprint, Rapid Engineering Build, Traffic Deployment, Conversion Calibration, and Monthly Revenue Compounding.",
      location: "Our studio is based in Trivandrum (Thiruvananthapuram), Kerala, and we work with clients across Kerala, throughout India and internationally. Most projects can be handled remotely. Direct studio lines: +91 75104 05067 / +91 62389 76168.",
      consultation: "We offer a complimentary 72-Hour Strategic Plan. We analyze your website speed, local map pack positioning, and ad performance. Visit free-plan.html to request yours.",
      whatsapp: "You can message our studio directly on WhatsApp at +91 89213 09190 for instant responses during business hours."
    };

    if (chatReplies) {
      chatReplies.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-reply');
          const replyText = responses[key];
          if (!replyText) return;

          // Append user message
          const userMsg = document.createElement('div');
          userMsg.className = 'chat-msg chat-msg-user';
          userMsg.textContent = btn.textContent;
          chatMessages.appendChild(userMsg);

          // Append bot message after slight delay
          setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg chat-msg-bot';
            botMsg.textContent = replyText;
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 250);

          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. ACCORDIONS (FAQ)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  initPageEnhancements();
});
