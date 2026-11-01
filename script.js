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
      'main section, body > section:not(.site-next-steps), .service-card, .pricing-card, .industry-card, .principle-card, .story-grid > *, .card, .faq-item, .site-next-steps-heading, .site-next-step-card, .site-next-steps-link, .site-idea-copy, .site-idea-shuffle, .home-project-intro, .home-project-form'
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
  const currentTheme = 'red-signal';
  html.setAttribute('data-theme', currentTheme);
  if (themeSelect) {
    themeSelect.value = currentTheme;
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
  // 5. CLIENT LOGO MARQUEE
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

  function brandMarkup(logo, decorative = false) {
    return `
      <div class="brand-chip" role="listitem" data-brand="${logo.brand || ''}"${decorative ? '' : ` title="${logo.name}"`}>
        <img src="assets/logos/clean/${logo.file}" alt="${decorative ? '' : logo.name}" loading="eager" class="brand-marquee-img">
      </div>
    `;
  }

  const staticBrandRow = document.getElementById('brandsStaticRow');
  if (staticBrandRow) {
    const logos = BRANDS.map(logo => brandMarkup(logo)).join('');
    const repeatedLogos = BRANDS.map(logo => brandMarkup(logo, true)).join('');
    staticBrandRow.classList.add('brands-marquee-root');
    staticBrandRow.setAttribute('role', 'region');
    staticBrandRow.setAttribute('aria-label', 'Client logos');
    staticBrandRow.innerHTML = `
      <div class="brand-marquee-viewport">
        <div class="brand-marquee-track">
          <div class="brand-marquee-group" role="list">${logos}</div>
          <div class="brand-marquee-group" role="list" aria-hidden="true">${repeatedLogos}</div>
        </div>
      </div>
      <button class="brand-marquee-toggle" type="button" aria-label="Pause logo movement" aria-pressed="false">Pause</button>
    `;

    const marqueeToggle = staticBrandRow.querySelector('.brand-marquee-toggle');
    marqueeToggle?.addEventListener('click', () => {
      const paused = staticBrandRow.classList.toggle('is-paused');
      marqueeToggle.setAttribute('aria-pressed', String(paused));
      marqueeToggle.setAttribute('aria-label', paused ? 'Resume logo movement' : 'Pause logo movement');
      marqueeToggle.textContent = paused ? 'Resume' : 'Pause';
    });
  }

  document.querySelectorAll('.industry-card .ind-header').forEach((header, index) => {
    const card = header.closest('.industry-card');
    const body = card?.querySelector('.ind-body');
    if (!card || !body) return;

    body.id = body.id || `industryDetails${index + 1}`;
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-controls', body.id);
    header.setAttribute('aria-expanded', 'false');
    card.classList.add('is-collapsible');

    const toggle = () => {
      const isOpen = card.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. MULTI-STEP INTAKE FORM & CONFETTI (Contact Page)
  // -------------------------------------------------------------------------
  const intakeForm = document.getElementById('intakeForm');
  if (intakeForm) {
    let currentStep = 1;
    const totalSteps = 4;
    const progressBar = document.getElementById('intakeProgressBar');

    function goToStep(stepNum) {
      intakeForm.style.setProperty('--step-offset', stepNum > currentStep ? '16px' : '-16px');
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
      const stepIndicators = document.querySelector('.form-step-indicators');
      if (stepIndicators) {
        stepIndicators.setAttribute('aria-label', `Step ${currentStep} of ${totalSteps}`);
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
          const nameInput = document.getElementById('clientName');
          const bizInput = document.getElementById('businessName');
          const phoneInput = document.getElementById('clientPhone');
          const emailInput = document.getElementById('clientEmail');
          const fieldChecks = [
            [nameInput, document.getElementById('clientNameError'), Boolean(nameInput?.value.trim()), 'Enter your name.'],
            [bizInput, document.getElementById('businessNameError'), Boolean(bizInput?.value.trim()), 'Enter your business name.'],
            [phoneInput, document.getElementById('clientPhoneError'), false, 'Enter a valid 10-digit Indian mobile number.'],
            [emailInput, document.getElementById('clientEmailError'), Boolean(emailInput?.value.trim()) && Boolean(emailInput?.validity.valid), 'Enter a valid email address.']
          ];
          let valid = true;
          fieldChecks.forEach(([input, error, isValid, message]) => {
            const fieldIsValid = input === phoneInput
              ? (() => {
                const digits = input.value.replace(/\D/g, '');
                const nationalNumber = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
                return /^[6-9]\d{9}$/.test(nationalNumber);
              })()
              : isValid;
            input.classList.toggle('is-invalid', !fieldIsValid);
            input.setAttribute('aria-invalid', fieldIsValid ? 'false' : 'true');
            error.textContent = fieldIsValid ? '' : message;
            if (!fieldIsValid) valid = false;
          });
          if (!valid) return;
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

    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('intakeFeedback');
      if (feedback) {
        feedback.className = 'form-feedback-msg';
        feedback.textContent = 'Your message is ready in WhatsApp. Review it there and tap Send to contact us.';
      }
      const name = document.getElementById('clientName').value.trim();
      const business = document.getElementById('businessName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const services = [...intakeForm.querySelectorAll('input[name="services"]:checked')].map(input => input.value);
      const budget = intakeForm.querySelector('input[name="budget"]:checked')?.value || 'Not specified';
      const message = [
        'Hi Explore Wings, I would like to discuss a project.',
        `Name: ${name}`,
        `Business: ${business}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Services: ${services.join(', ') || 'To discuss'}`,
        `Budget: ${budget}`
      ].join('\n');
      window.open(`https://wa.me/918921309190?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  }

  const freePlanForm = document.getElementById('freePlanForm');
  if (freePlanForm) {
    freePlanForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(freePlanForm);
      const phone = String(formData.get('fpPhone') || '').trim();
      const message = [
        'Hi Explore Wings, I would like to request a digital review.',
        `Website or social page: ${formData.get('fpWebsite') || '-'}`,
        `Reference business or website: ${formData.get('fpCompetitor') || 'Not provided'}`,
        `Main topic: ${formData.get('fpBottleneck') || '-'}`,
        `Name: ${formData.get('fpName') || '-'}`,
        `Phone: ${phone}`
      ].join('\n');
      const feedback = document.getElementById('fpFeedback');
      if (feedback) {
        feedback.textContent = 'Your request is ready in WhatsApp. Review it there and tap Send to contact us.';
      }
      window.open(`https://wa.me/918921309190?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  }

  // -------------------------------------------------------------------------
  // 7. AUTO-SCROLL ENGINE
  // -------------------------------------------------------------------------
  const autoScrollBtn = document.getElementById('autoScrollToggle');
  if (autoScrollBtn) {
    let isAutoScrolling = false;
    let animId = null;

    autoScrollBtn.addEventListener('click', () => {
      isAutoScrolling = !isAutoScrolling;
      autoScrollBtn.setAttribute('aria-pressed', isAutoScrolling ? 'true' : 'false');
      autoScrollBtn.classList.toggle('is-scrolling', isAutoScrolling);

      if (isAutoScrolling) {
        function scrollStep() {
          if (!isAutoScrolling) return;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (window.scrollY >= maxScroll - 2) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollBy(0, 1.2);
          }
          animId = requestAnimationFrame(scrollStep);
        }
        animId = requestAnimationFrame(scrollStep);
      } else {
        cancelAnimationFrame(animId);
      }
    });

    ['wheel', 'touchstart', 'mousedown'].forEach(ev => {
      window.addEventListener(ev, () => {
        if (isAutoScrolling) {
          isAutoScrolling = false;
          autoScrollBtn.setAttribute('aria-pressed', 'false');
          autoScrollBtn.classList.remove('is-scrolling');
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
  const chatMinimize = document.getElementById('chatbotMinimize') || document.getElementById('chatbotClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatReplies = document.getElementById('chatQuickReplies');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInput = document.getElementById('chatInput');

  if (chatToggle && chatWidget) {
    if (chatMessages) chatMessages.setAttribute('aria-live', 'polite');
    chatToggle.hidden = false;

    const assistantTitle = chatWidget.querySelector('.chat-header-brand > div > div:first-child');
    const assistantCredit = chatWidget.querySelector('.chat-header-brand > div > div:nth-child(2)');
    if (assistantTitle) assistantTitle.textContent = 'Webinc Smart Assistant';
    if (assistantCredit) assistantCredit.textContent = 'Built by Webinc · Explore Wings, Kerala';
    const welcomeText = 'Hi, I’m the Webinc Smart Assistant for Explore Wings. Ask me about services, project costs, timelines, our process, or getting in touch. I use a local knowledge base to help you find the right next step.';
    const welcomeMessage = chatMessages && chatMessages.querySelector('.chat-msg-bot');
    if (welcomeMessage) welcomeMessage.textContent = welcomeText;
    const chatHeader = chatWidget.querySelector('.chat-header');
    let newChatButton = chatWidget.querySelector('#chatNewConversation');
    if (chatHeader && !newChatButton) {
      newChatButton = document.createElement('button');
      newChatButton.type = 'button';
      newChatButton.id = 'chatNewConversation';
      newChatButton.className = 'chat-new-conversation';
      newChatButton.textContent = 'New chat';
      newChatButton.setAttribute('aria-label', 'Start a new chat');
      chatHeader.insertBefore(newChatButton, chatMinimize || null);
    }

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
        if (chatToggle) {
          chatToggle.setAttribute('aria-expanded', 'true');
          chatToggle.setAttribute('aria-label', 'Minimize Webinc Smart Assistant');
        }
        try {
          localStorage.removeItem('ew_chatbot_minimized');
          sessionStorage.removeItem('ew_chatbot_minimized');
        } catch (_) {}
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
      if (chatToggle) {
        chatToggle.setAttribute('aria-expanded', 'false');
        chatToggle.setAttribute('aria-label', 'Open Webinc Smart Assistant');
      }
      chatWidget.classList.add('is-minimizing');
      minButtons.forEach(btn => btn.blur());
      minimizeTimer = window.setTimeout(() => {
        chatWidget.classList.remove('is-open', 'is-minimizing');
        chatWidget.style.display = 'none';
      }, 260);
    }

    let wasMinimized = false;
    try {
      wasMinimized = localStorage.getItem('ew_chatbot_minimized') === 'true' || sessionStorage.getItem('ew_chatbot_minimized') === 'true';
    } catch (_) {}

    if (!wasMinimized) {
      setChatOpen(true);
    } else {
      chatWidget.classList.remove('is-open', 'is-minimizing');
      chatWidget.style.display = 'none';
      chatWidget.setAttribute('aria-hidden', 'true');
      chatToggle.setAttribute('aria-expanded', 'false');
      chatToggle.setAttribute('aria-label', 'Open Webinc Smart Assistant');
    }

    if (chatToggle) {
      chatToggle.addEventListener('click', (event) => {
        event.preventDefault();
        const isOpen = chatWidget.classList.contains('is-open') && !chatWidget.classList.contains('is-minimizing');
        setChatOpen(!isOpen, !isOpen);
      });
    }

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

    const assistantTopics = {
      services: {
        terms: ['services', 'what do you do', 'offer', 'capabilities'],
        answer: 'Explore Wings supports Kerala businesses with website design and development, branding and logo systems, local SEO, paid search and social campaigns, social media support, and commercial photo/video. We can focus on one need or scope a joined-up project. Tell me what you are trying to improve and I can point you to the relevant service.'
      },
      website: {
        terms: ['website', 'web design', 'web development', 'landing page', 'ecommerce', 'online store'],
        answer: 'Website projects can include planning, responsive design, development, content structure, enquiry forms, WhatsApp paths, basic search setup, testing, launch, and handover. The right scope depends on pages, integrations, content, and who will maintain it. Use the Services page or tell us what the site needs to do.'
      },
      branding: {
        terms: ['brand', 'branding', 'logo', 'identity', 'visual identity', 'brand kit'],
        answer: 'Brand work can cover a logo, visual identity, color and type choices, and practical brand files for digital use. We first learn where the brand appears and what needs to stay consistent, then agree on deliverables and review rounds. Share your business name and intended uses to start a brief.'
      },
      marketing: {
        terms: ['marketing', 'ads', 'advertising', 'google ads', 'meta ads', 'facebook ads', 'instagram ads', 'campaign'],
        answer: 'Campaign support can include Google or Meta advertising, audience and offer planning, campaign setup, creative coordination, and performance review. Budgets and deliverables depend on the audience, objective, and assets available; ad spend is scoped separately from studio work. We can discuss the numbers after understanding your goal.'
      },
      seo: {
        terms: ['seo', 'local seo', 'google maps', 'map listing', 'search ranking', 'search engine', 'google business'],
        answer: 'Local search work focuses on helping nearby customers find accurate business information: Google Business Profile setup or improvements, location and service details, on-site search basics, and a practical review plan. Results depend on competition, location, and the state of existing listings, so we do not promise a specific ranking.'
      },
      social: {
        terms: ['social media', 'instagram', 'facebook page', 'content calendar', 'posts', 'reels'],
        answer: 'Social media support can include content planning, post and creative direction, publishing coordination, and campaign alignment. The exact channel mix and posting cadence are agreed around your audience and available content rather than assumed in advance.'
      },
      pricing: {
        terms: ['price', 'pricing', 'cost', 'quote', 'budget', 'how much', 'fee', 'rates'],
        answer: 'Project pricing is quoted after we understand the deliverables, timeline, integrations, and support needed. There are no reliable one-size-fits-all figures for a website, brand, or campaign; the proposal explains the agreed scope and costs. Share a rough budget and priority on the Pricing or Contact page to get a relevant estimate.'
      },
      timeline: {
        terms: ['timeline', 'how long', 'deadline', 'launch date', 'turnaround', 'duration'],
        answer: 'Timing depends on the scope, how quickly content and feedback are available, and any third-party integrations. We agree on milestones before work begins and flag dependencies in the plan. Tell us your target launch date and project type so the team can assess feasibility.'
      },
      process: {
        terms: ['process', 'how we work', 'steps', 'workflow', 'what happens next'],
        answer: 'We start by understanding your business and desired outcome, then confirm scope, deliverables, and timing. Work moves through planning, design or production, review, and launch or handover, with agreed feedback points. Ongoing support can be discussed separately when useful.'
      },
      consultation: {
        terms: ['consultation', 'free consultation', 'audit', 'review', 'digital plan', 'recommendation'],
        answer: 'You can request a no-obligation discussion or digital review through the Free Digital Plan or Contact page. Include your website or social profile, your main goal, and any issue you want us to look at; that helps the team make the conversation specific.'
      },
      location: {
        terms: ['location', 'where', 'address', 'trivandrum', 'thiruvananthapuram', 'kerala', 'visit'],
        answer: 'Our studio is based in Trivandrum, Kerala, but we work with clients across Kerala, throughout India and internationally. Most projects can be handled remotely. Call +91 75104 05067 or +91 62389 76168 to discuss your project or arrange a studio visit.'
      },
      contact: {
        terms: ['contact', 'phone', 'call', 'whatsapp', 'email', 'talk to someone', 'human', 'team'],
        answer: 'You can call the studio at +91 75104 05067 or +91 62389 76168, or message on WhatsApp at +91 89213 09190. The Contact page has the enquiry form and current contact options. For project enquiries, include your business, goal, and preferred way to be reached.'
      },
      about: {
        terms: ['who are you', 'about explore wings', 'about the studio', 'team', 'webinc', 'are you ai', 'artificial intelligence', 'generative ai'],
        answer: 'Explore Wings Digital Technologies is an independent digital studio based in Trivandrum, Kerala, serving clients across India and internationally. This on-site assistant is built by Webinc and uses a curated knowledge base to help with common project questions; it is not a live generative-AI service.'
      }
    };

    let projectBriefStep = -1;
    let conversationVersion = 0;
    let assistantThinking = false;
    const projectBrief = {};
    const briefQuestions = [
      { key: 'business', prompt: 'What kind of business or organization is this for? You can include the city or service area.' },
      { key: 'service', prompt: 'What would you like help with: a website, branding, local SEO, advertising, social media, or something else?' },
      { key: 'goal', prompt: 'What is the main outcome you want—for example more calls, bookings, store visits, or a clearer brand?' },
      { key: 'timing', prompt: 'Do you have a target launch date or preferred timeframe? “Flexible” is fine.' }
    ];

    function appendAssistantMessage(text, whatsappMessage) {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg chat-msg-bot';
      botMsg.textContent = text;
      if (whatsappMessage) {
        const actionLink = document.createElement('a');
        actionLink.className = 'chat-assistant-action';
        actionLink.href = `https://wa.me/918921309190?text=${encodeURIComponent(whatsappMessage)}`;
        actionLink.target = '_blank';
        actionLink.rel = 'noopener noreferrer';
        actionLink.textContent = 'Review brief in WhatsApp';
        botMsg.appendChild(document.createElement('br'));
        botMsg.appendChild(actionLink);
      }
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBriefResponse(message) {
      if (/^(cancel|stop|exit|never mind)$/i.test(message.trim())) {
        projectBriefStep = -1;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        return { text: 'No problem—your project brief has been cleared. Ask me another question, or type “start a project brief” whenever you are ready.' };
      }

      const question = briefQuestions[projectBriefStep];
      projectBrief[question.key] = message.trim();
      projectBriefStep += 1;
      if (projectBriefStep < briefQuestions.length) {
        return { text: briefQuestions[projectBriefStep].prompt };
      }

      const summary = [
        'Project enquiry for Explore Wings',
        `Business / area: ${projectBrief.business}`,
        `Service: ${projectBrief.service}`,
        `Goal: ${projectBrief.goal}`,
        `Timing: ${projectBrief.timing}`
      ].join('\n');
      projectBriefStep = -1;
      Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
      return {
        text: `Here is the brief we put together:\n\n${summary}\n\nNothing has been sent or saved. You can review it in WhatsApp before choosing to send it.`,
        whatsappMessage: summary
      };
    }

    function getAssistantResponse(message, forcedTopic) {
      const query = message.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
      if (forcedTopic === 'brief' || /\b(start|create|build|make)\b.*\b(project|brief|plan|new one)\b|\bhelp me (plan|start|scope)\b.*\b(project|brief|proposal)\b/i.test(query)) {
        projectBriefStep = 0;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        return { text: `Great, let’s shape a useful project brief. ${briefQuestions[0].prompt}\n\nType “cancel” any time to stop. I will not send or save your answers.` };
      }

      if (projectBriefStep >= 0) return getBriefResponse(message);

      if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(query)) {
        return 'Hello! I can help with services, websites, branding, local search, campaigns, pricing, timelines, or contacting the studio. What are you planning?';
      }

      if (forcedTopic && assistantTopics[forcedTopic]) return assistantTopics[forcedTopic].answer;

      const words = new Set(query.split(' '));
      const matches = Object.entries(assistantTopics)
        .filter(([topic]) => topic !== 'services')
        .map(([topic, details]) => ({
          topic,
          score: details.terms.reduce((total, term) => {
            const normalizedTerm = term.toLowerCase();
            return total + (normalizedTerm.includes(' ')
              ? (query.includes(normalizedTerm) ? 3 : 0)
              : (words.has(normalizedTerm) ? 1 : 0));
          }, 0)
        }))
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);

      if (matches.length) {
        return { text: matches.slice(0, 2).map(match => assistantTopics[match.topic].answer).join('\n\n') };
      }

      if (words.has('service') || words.has('services') || query.includes('what do you do')) {
        return { text: assistantTopics.services.answer };
      }

      return { text: 'I do not have a confident answer for that yet. I can help with services, websites, branding, SEO, campaigns, project costs, timelines, the studio location, or contact details. For a tailored recommendation, type “start a project brief”.' };
    }

    function sendAssistantMessage(message, forcedTopic) {
      if (!chatMessages || !message.trim() || assistantThinking) return;
      assistantThinking = true;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg chat-msg-user';
      userMsg.textContent = message.trim();
      chatMessages.appendChild(userMsg);
      const typing = document.createElement('div');
      typing.className = 'chat-msg chat-msg-bot assistant-typing';
      typing.setAttribute('aria-label', 'Assistant is thinking');
      typing.textContent = 'Thinking…';
      chatMessages.appendChild(typing);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      const currentVersion = conversationVersion;
      if (chatInput) chatInput.disabled = true;
      window.setTimeout(() => {
        if (currentVersion !== conversationVersion) return;
        const response = getAssistantResponse(message.trim(), forcedTopic);
        typing.remove();
        if (typeof response === 'string') {
          appendAssistantMessage(response);
        } else {
          appendAssistantMessage(response.text, response.whatsappMessage);
        }
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.focus();
        }
        assistantThinking = false;
      }, 350);
    }

    if (chatInputForm && chatInput) {
      chatInputForm.addEventListener('submit', event => {
        event.preventDefault();
        sendAssistantMessage(chatInput.value);
        chatInput.value = '';
        chatInput.focus();
      });
    }

    if (chatReplies) {
      if (!chatReplies.querySelector('[data-reply="brief"]')) {
        const briefButton = document.createElement('button');
        briefButton.type = 'button';
        briefButton.className = 'quick-reply-btn';
        briefButton.setAttribute('data-reply', 'brief');
        briefButton.textContent = 'Start a project brief';
        chatReplies.appendChild(briefButton);
      }
      chatReplies.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-reply');
          sendAssistantMessage(btn.textContent, key);
        });
      });
    }

    if (newChatButton && chatMessages) {
      newChatButton.addEventListener('click', () => {
        conversationVersion += 1;
        assistantThinking = false;
        projectBriefStep = -1;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        chatMessages.replaceChildren();
        const welcome = document.createElement('div');
        welcome.className = 'chat-msg chat-msg-bot';
        welcome.textContent = welcomeText;
        chatMessages.appendChild(welcome);
        chatMessages.scrollTop = 0;
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.value = '';
          chatInput.focus();
        }
      });
    }
  }

  const homeProjectForm = document.getElementById('homeProjectForm');
  if (homeProjectForm) {
    const feedback = document.getElementById('homeProjectFeedback');
    const whatsappLink = document.getElementById('homeProjectWhatsAppLink');
    homeProjectForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(homeProjectForm);
      const message = [
        'Hi Explore Wings, I would like to discuss a project.',
        `Name: ${String(formData.get('name') || '').trim()}`,
        `Business: ${String(formData.get('business') || '').trim() || 'Not provided'}`,
        `Project area: ${String(formData.get('service') || '')}`,
        `Goal: ${String(formData.get('goal') || '').trim()}`
      ].join('\n');

      if (whatsappLink) {
        whatsappLink.href = `https://wa.me/918921309190?text=${encodeURIComponent(message)}`;
        whatsappLink.hidden = false;
      }
      if (feedback) {
        feedback.textContent = 'Your message is ready. Open WhatsApp to review it and tap Send when you’re ready.';
      }
    });
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
