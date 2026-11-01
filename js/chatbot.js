/**
 * EXPLORE WINGS DIGITAL TECHNOLOGIES — RED SIGNAL JAVASCRIPT ENGINE
 * Studio: Trivandrum (Thiruvananthapuram), Kerala, India
 * Clean, lightweight, 60fps animations with GSAP and native fallbacks.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. CLIENT BRANDS ARRAY (Phase 4 requirement: single array builds rows)
  // -------------------------------------------------------------------------
  const BRANDS = [
    { name: 'Transorze Information Technology', file: 'assets/logos/clean/transorze-updated.png' },
    { name: 'Terrace by Makkawao', file: 'assets/logos/terrace-by-makkawao.png' },
    { name: 'Global Fitness', file: 'assets/logos/global-fitness.png' },
    { name: 'Edustudy International', file: 'assets/logos/edustudy-international.png' },
    { name: 'Aadisaktthi Resorts & Spa', file: 'assets/logos/aadisaktthi-resorts-spa.png' },
    { name: 'Elaf', file: 'assets/logos/elaf.png' },
    { name: 'LuLu Mall', file: 'assets/logos/lulu.png' },
    { name: 'Munch', file: 'assets/logos/munch.png' },
    { name: 'Milagro Homes', file: 'assets/logos/clean/milagro-homes.jpg' }
  ];

  function initBrandMarquees() {
    const forwardTracks = document.querySelectorAll('.marquee-forward');
    const reverseTracks = document.querySelectorAll('.marquee-reverse');

    function createBrandNodes(items) {
      let html = '';
      items.forEach(b => {
        html += `<div class="brand-item" title="${b.name}">
          <img src="${b.file}" alt="${b.name} logo" width="160" height="42" loading="lazy">
        </div>`;
      });
      return html;
    }

    if (forwardTracks.length > 0) {
      const fullList = [...BRANDS, ...BRANDS]; // Duplicate for seamless infinite loop
      forwardTracks.forEach(t => {
        t.innerHTML = createBrandNodes(fullList);
      });
    }

    if (reverseTracks.length > 0) {
      const reversed = [...BRANDS].reverse();
      const fullReversed = [...reversed, ...reversed];
      reverseTracks.forEach(t => {
        t.innerHTML = createBrandNodes(fullReversed);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 3. THEME TOGGLE: persistent light and dark modes
  // -------------------------------------------------------------------------
  function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle-btn, #themeToggleBtn');
    if (!toggleBtn) return;

    let savedTheme = localStorage.getItem('ew_mode')
      || localStorage.getItem('ew_theme_mode')
      || localStorage.getItem('explorewings_theme')
      || document.documentElement.getAttribute('data-mode')
      || 'dark';
    if (savedTheme === 'split') savedTheme = 'light';
    if (!['light', 'dark'].includes(savedTheme)) savedTheme = 'dark';
    document.documentElement.setAttribute('data-mode', savedTheme);
    updateThemeLabel(savedTheme);

    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-mode') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-mode', next);
      localStorage.setItem('ew_mode', next);
      localStorage.setItem('ew_theme_mode', next);
      localStorage.setItem('explorewings_theme', next);
      updateThemeLabel(next);
    });

    function updateThemeLabel(mode) {
      const textSpan = toggleBtn.querySelector('.theme-text, .theme-mode-text');
      if (textSpan) {
        textSpan.textContent = mode === 'dark' ? 'Light' : 'Dark';
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. AUTO-SCROLL CONTROLLER (1x, 2x, 3x with natural interrupt)
  // -------------------------------------------------------------------------
  let autoScrollId = null;
  let scrollSpeed = 1;
  let isAutoScrolling = false;

  function initAutoScroll() {
    const toggleBtn = document.getElementById('autoScrollToggle');
    const speedChips = document.querySelectorAll('.speed-chip');
    if (!toggleBtn) return;

    function startAutoScroll() {
      isAutoScrolling = true;
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-pressed', 'true');
      const step = () => {
        if (!isAutoScrolling) return;
        window.scrollBy(0, scrollSpeed);
        if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2) {
          stopAutoScroll();
          return;
        }
        autoScrollId = requestAnimationFrame(step);
      };
      autoScrollId = requestAnimationFrame(step);
    }

    function stopAutoScroll() {
      isAutoScrolling = false;
      if (autoScrollId) cancelAnimationFrame(autoScrollId);
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }

    toggleBtn.addEventListener('click', () => {
      if (isAutoScrolling) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });

    speedChips.forEach(chip => {
      chip.addEventListener('click', () => {
        speedChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        scrollSpeed = parseInt(chip.getAttribute('data-speed') || '1', 10);
      });
    });

    // Interrupt on user gesture
    ['wheel', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (isAutoScrolling) stopAutoScroll();
      }, { passive: true });
    });
  }

  // -------------------------------------------------------------------------
  // 5. NAVBAR SCROLL PROGRESS & SHOW/HIDE
  // -------------------------------------------------------------------------
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scrollProgressBar');
    let lastScrollY = window.pageYOffset;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Progress Bar
      if (progressBar && docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100));
        progressBar.style.width = pct + '%';
      }

      // Hide navbar on downscroll (> 160px), reveal on upscroll
      if (navbar) {
        if (currentScrollY > 160 && currentScrollY > lastScrollY) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 6. MOBILE MENU DRAWER
  // -------------------------------------------------------------------------
  function initMobileDrawer() {
    const menuBtn = document.getElementById('mobileMenuBtn') || document.getElementById('mobileNavToggle');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const closeBtn = document.getElementById('mobileDrawerClose');
    if (!drawer) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      if (backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      if (backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    drawer.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
    document.querySelectorAll('.mobile-drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // -------------------------------------------------------------------------
  // 7. ACCORDION / FAQ COMPONENT
  // -------------------------------------------------------------------------
  function initAccordions() {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('is-open');
        
        // Optional: close other items in the same container
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('is-open');
          });
        }
        item.classList.toggle('is-open', !isOpen);
      });
    });
  }

  // -------------------------------------------------------------------------
  // 8. MULTI-STEP CONTACT FORM (Step 1 of 4 with Validation & WhatsApp Fallback)
  // -------------------------------------------------------------------------
  function initMultiStepForm() {
    const form = document.getElementById('projectIntakeForm');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 4;
    const progressBar = document.getElementById('formProgressFill');
    const stepLabel = document.getElementById('formStepLabel');

    function updateStepView() {
      document.querySelectorAll('.form-step').forEach(stepEl => {
        const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
        stepEl.classList.toggle('is-active', stepNum === currentStep);
      });

      if (progressBar) {
        const pct = (currentStep / totalSteps) * 100;
        progressBar.style.width = pct + '%';
      }
      if (stepLabel) {
        stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
      }
    }

    // Step navigation buttons
    form.querySelectorAll('.btn-form-next').forEach(btn => {
      btn.addEventListener('click', () => {
        // Simple step validation
        const activeStepEl = form.querySelector(`.form-step[data-step="${currentStep}"]`);
        let valid = true;
        
        if (activeStepEl) {
          const requiredInputs = activeStepEl.querySelectorAll('[required]');
          requiredInputs.forEach(inp => {
            const group = inp.closest('.form-group');
            if (!inp.value.trim()) {
              valid = false;
              if (group) group.classList.add('has-error');
            } else {
              if (group) group.classList.remove('has-error');
            }
          });
        }

        if (valid && currentStep < totalSteps) {
          currentStep++;
          updateStepView();
        }
      });
    });

    form.querySelectorAll('.btn-form-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepView();
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.querySelector('#clientName') || {}).value || '';
      const phone = (form.querySelector('#clientPhone') || {}).value || '';
      const service = (form.querySelector('#clientService') || {}).value || 'Website Design';
      const notes = (form.querySelector('#clientNotes') || {}).value || '';

      const summaryText = `*Project Enquiry - Explore Wings*\n` +
        `Name: ${encodeURIComponent(name)}\n` +
        `Phone: ${encodeURIComponent(phone)}\n` +
        `Service: ${encodeURIComponent(service)}\n` +
        `Details: ${encodeURIComponent(notes)}`;

      // Show success step
      const formCard = form.closest('.form-card');
      if (formCard) {
        formCard.innerHTML = `<div style="text-align: center; padding: 32px 16px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #E4202D; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 20px;">✓</div>
          <h3 style="font-family: var(--font-display); font-size: 28px; margin-bottom: 12px; color: var(--color-ink);">Enquiry Received!</h3>
          <p style="font-size: 16px; color: var(--muted-light); margin-bottom: 28px; max-width: 460px; margin-left: auto; margin-right: auto;">
            Thank you! Our team will review your project details and contact you within 4 hours.
          </p>
          <a href="https://wa.me/918921309190?text=${summaryText}" target="_blank" rel="noopener noreferrer" class="btn btn-signal" style="display: inline-flex;">
            Send these details directly on WhatsApp &rarr;
          </a>
        </div>`;
      }
    });

    updateStepView();
  }

  // -------------------------------------------------------------------------
  // 9. ASSISTANT CHATBOT MODAL
  // -------------------------------------------------------------------------
  function initChatbot() {
    const trigger = document.getElementById('chatbotTrigger');
    const modal = document.getElementById('chatbotModal');
    let minimizeButton = modal && modal.querySelector('#chatbotMinimize');
    if (!minimizeButton && modal) {
      minimizeButton = modal.querySelector('#chatbotClose');
      if (minimizeButton) minimizeButton.id = 'chatbotMinimize';
    }
    const messages = document.getElementById('chatMessages');
    const quickReplies = document.getElementById('chatQuickReplies');
    if (!trigger || !modal) return;
    if (messages) messages.setAttribute('aria-live', 'polite');
    let conversationVersion = 0;
    let assistantThinking = false;
    let projectBriefStep = -1;
    const projectBrief = {};
    const briefQuestions = [
      { key: 'business', prompt: 'What kind of business or organization is this for? You can include the city or service area.' },
      { key: 'service', prompt: 'What would you like help with: a website, branding, local SEO, advertising, social media, or something else?' },
      { key: 'goal', prompt: 'What is the main outcome you want—for example more calls, bookings, store visits, or a clearer brand?' },
      { key: 'timing', prompt: 'Do you have a target launch date or preferred timeframe? “Flexible” is fine.' }
    ];

    const title = modal.querySelector('.chatbot-title-box strong');
    if (title) title.textContent = 'Webinc Smart Assistant';
    const titleBox = modal.querySelector('.chatbot-title-box');
    if (titleBox && !titleBox.querySelector('.chatbot-credit')) {
      const credit = document.createElement('span');
      credit.className = 'chatbot-credit';
      credit.textContent = 'Built by Webinc · Explore Wings, Kerala';
      titleBox.appendChild(credit);
    }
    const header = modal.querySelector('.chatbot-header');
    let newChatButton = modal.querySelector('#chatNewConversation');
    if (header && !newChatButton) {
      newChatButton = document.createElement('button');
      newChatButton.type = 'button';
      newChatButton.id = 'chatNewConversation';
      newChatButton.className = 'chat-new-conversation';
      newChatButton.textContent = 'New chat';
      newChatButton.setAttribute('aria-label', 'Start a new chat');
      header.insertBefore(newChatButton, minimizeButton || null);
    }
    if (minimizeButton) {
      minimizeButton.className = 'chatbot-minimize';
      minimizeButton.type = 'button';
      minimizeButton.setAttribute('aria-label', 'Minimize assistant');
      minimizeButton.title = 'Minimize assistant';
      minimizeButton.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>';
    }
    const welcomeText = 'Hi, I’m the Webinc Smart Assistant for Explore Wings. Ask me about services, project costs, timelines, our process, or getting in touch. I use a local knowledge base to help you find the right next step.';
    const welcome = messages && messages.querySelector('.chat-msg-bot');
    if (welcome) {
      welcome.textContent = welcomeText;
    }

    let chatForm = modal.querySelector('#chatInputForm');
    let chatInput;
    if (messages && !chatForm) {
      chatForm = document.createElement('form');
      chatForm.className = 'chat-input-form';
      chatForm.id = 'chatInputForm';
      chatForm.innerHTML = '<label class="sr-only" for="chatInput">Ask the Webinc Smart Assistant</label><input id="chatInput" name="message" type="text" autocomplete="off" maxlength="500" placeholder="Ask a question..." required><button type="submit">Send</button>';
      messages.insertAdjacentElement('afterend', chatForm);
    }
    chatInput = chatForm && chatForm.querySelector('#chatInput');
    let promptRow = modal.querySelector('.chat-assistant-prompts');
    if (chatForm && !promptRow) {
      promptRow = document.createElement('div');
      promptRow.className = 'chat-assistant-prompts chat-quick-replies';
      promptRow.setAttribute('aria-label', 'Suggested assistant prompts');
      [
        { label: 'Services', value: 'What services do you offer?' },
        { label: 'Pricing', value: 'How does pricing work?' },
        { label: 'Start a project brief', value: 'Start a project brief' }
      ].forEach(prompt => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quick-reply-btn';
        button.textContent = prompt.label;
        button.dataset.message = prompt.value;
        promptRow.appendChild(button);
      });
      chatForm.insertAdjacentElement('beforebegin', promptRow);
    }

    const topics = [
      { terms: ['services', 'what do you do', 'offer', 'capabilities'], answer: 'Explore Wings supports Kerala businesses with website design and development, branding and logo systems, local SEO, paid search and social campaigns, social media support, and commercial photo/video. We can focus on one need or scope a joined-up project. Tell me what you are trying to improve and I can point you to the relevant service.' },
      { terms: ['website', 'web design', 'web development', 'landing page', 'ecommerce', 'online store'], answer: 'Website projects can include planning, responsive design, development, content structure, enquiry forms, WhatsApp paths, basic search setup, testing, launch, and handover. The right scope depends on pages, integrations, content, and who will maintain it. Tell us what the site needs to do.' },
      { terms: ['brand', 'branding', 'logo', 'identity', 'visual identity', 'brand kit'], answer: 'Brand work can cover a logo, visual identity, color and type choices, and practical brand files for digital use. We first learn where the brand appears and what needs to stay consistent, then agree on deliverables and review rounds. Share your business name and intended uses to start a brief.' },
      { terms: ['marketing', 'ads', 'advertising', 'google ads', 'meta ads', 'facebook ads', 'instagram ads', 'campaign'], answer: 'Campaign support can include Google or Meta advertising, audience and offer planning, campaign setup, creative coordination, and performance review. Budgets and deliverables depend on the audience, objective, and assets available; ad spend is scoped separately from studio work.' },
      { terms: ['seo', 'local seo', 'google maps', 'map listing', 'search ranking', 'search engine', 'google business'], answer: 'Local search work focuses on helping nearby customers find accurate business information: Google Business Profile setup or improvements, location and service details, on-site search basics, and a practical review plan. Results depend on competition, location, and the state of existing listings, so we do not promise a specific ranking.' },
      { terms: ['social media', 'instagram', 'facebook page', 'content calendar', 'posts', 'reels'], answer: 'Social media support can include content planning, post and creative direction, publishing coordination, and campaign alignment. The channel mix and posting cadence are agreed around your audience and available content.' },
      { terms: ['price', 'pricing', 'cost', 'quote', 'budget', 'how much', 'fee', 'rates'], answer: 'Project pricing is quoted after we understand the deliverables, timeline, integrations, and support needed. There are no reliable one-size-fits-all figures; the proposal explains the agreed scope and costs. Share a rough budget and priority through the Pricing or Contact page to get a relevant estimate.' },
      { terms: ['timeline', 'how long', 'deadline', 'launch date', 'turnaround', 'duration'], answer: 'Timing depends on the scope, how quickly content and feedback are available, and any third-party integrations. We agree on milestones before work begins and flag dependencies in the plan. Tell us your target launch date and project type so the team can assess feasibility.' },
      { terms: ['process', 'how we work', 'steps', 'workflow', 'what happens next'], answer: 'We start by understanding your business and desired outcome, then confirm scope, deliverables, and timing. Work moves through planning, design or production, review, and launch or handover, with agreed feedback points. Ongoing support can be discussed separately.' },
      { terms: ['consultation', 'free consultation', 'audit', 'review', 'digital plan', 'recommendation'], answer: 'You can request a no-obligation discussion or digital review through the Free Digital Plan or Contact page. Include your website or social profile, your main goal, and any issue you want us to look at; that helps the team make the conversation specific.' },
      { terms: ['location', 'where', 'address', 'trivandrum', 'thiruvananthapuram', 'kerala', 'visit'], answer: 'Our studio is based in Trivandrum, Kerala, but we work with clients across Kerala, throughout India and internationally. Most projects can be handled remotely. Call +91 75104 05067 or +91 62389 76168 to discuss your project or arrange a studio visit.' },
      { terms: ['contact', 'phone', 'call', 'whatsapp', 'email', 'talk to someone', 'human', 'team'], answer: 'Call the studio at +91 75104 05067 or +91 62389 76168, or message on WhatsApp at +91 89213 09190. The Contact page has the enquiry form and current contact options. Include your business, goal, and preferred way to be reached.' },
      { terms: ['who are you', 'about explore wings', 'about the studio', 'webinc', 'are you ai', 'artificial intelligence', 'generative ai'], answer: 'Explore Wings Digital Technologies is an independent digital studio based in Trivandrum, Kerala, serving clients across India and internationally. This on-site assistant is built by Webinc and uses a curated knowledge base to help with common project questions; it is not a live generative-AI service.' }
    ];

    function appendAnswer(text, whatsappMessage) {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg chat-msg-bot';
      botMsg.style.whiteSpace = 'pre-line';
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
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }

    function getBriefAnswer(message) {
      if (/^(cancel|stop|exit|never mind)$/i.test(message.trim())) {
        projectBriefStep = -1;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        return { text: 'No problem—your project brief has been cleared. Ask me another question, or type “start a project brief” whenever you are ready.' };
      }

      projectBrief[briefQuestions[projectBriefStep].key] = message.trim();
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

    function getAnswer(message) {
      const query = message.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
      if (/\b(start|create|build|make)\b.*\b(project|brief|plan|new one)\b|\bhelp me (plan|start|scope)\b.*\b(project|brief|proposal)\b/i.test(query)) {
        projectBriefStep = 0;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        return { text: `Great, let’s shape a useful project brief. ${briefQuestions[0].prompt}\n\nType “cancel” any time to stop. I will not send or save your answers.` };
      }

      if (projectBriefStep >= 0) return getBriefAnswer(message);

      if (/^(hi|hello|hey|good morning|good afternoon)\b/.test(query)) {
        return 'Hello! I can help with services, websites, branding, local search, campaigns, project costs, timelines, or contacting the studio. What are you planning?';
      }

      const words = new Set(query.split(' '));
      const matches = topics
        .filter(topic => !topic.terms.includes('services'))
        .map(topic => ({
          topic,
          score: topic.terms.reduce((total, term) => total + (term.includes(' ')
            ? (query.includes(term) ? 3 : 0)
            : (words.has(term) ? 1 : 0)), 0)
        }))
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score);

      if (matches.length) return matches.slice(0, 2).map(match => match.topic.answer).join('\n\n');
      if (words.has('service') || words.has('services') || query.includes('what do you do')) {
        return topics[0].answer;
      }

      return 'I do not have a confident answer for that yet. I can help with services, websites, branding, SEO, campaigns, project costs, timelines, the studio location, or contact details. For a specific question, please send it to the Explore Wings team through the Contact page.';
    }

    function sendMessage(message) {
      if (!messages || !message.trim() || assistantThinking) return;
      assistantThinking = true;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg chat-msg-user';
      userMsg.textContent = message.trim();
      messages.appendChild(userMsg);
      const typing = document.createElement('div');
      typing.className = 'chat-msg chat-msg-bot assistant-typing';
      typing.setAttribute('aria-label', 'Assistant is thinking');
      typing.textContent = 'Thinking…';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      const currentVersion = conversationVersion;
      if (chatInput) chatInput.disabled = true;
      window.setTimeout(() => {
        if (currentVersion !== conversationVersion) return;
        const response = getAnswer(message.trim());
        typing.remove();
        if (typeof response === 'string') {
          appendAnswer(response);
        } else {
          appendAnswer(response.text, response.whatsappMessage);
        }
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.focus();
        }
        assistantThinking = false;
      }, 350);
    }

    const minButtons = modal.querySelectorAll('#chatbotMinimize, #chatbotClose, .chatbot-minimize');
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
    function setChatbotOpen(isOpen, focusInput = false) {
      window.clearTimeout(minimizeTimer);
      if (isOpen) {
        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.remove('is-minimizing');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', 'Minimize Webinc Smart Assistant chat');
        try {
          localStorage.removeItem('ew_chatbot_minimized');
          sessionStorage.removeItem('ew_chatbot_minimized');
        } catch (_) {}
        if (focusInput && chatInput) chatInput.focus();
        return;
      }

      if (!modal.classList.contains('is-open')) {
        modal.classList.remove('is-minimizing');
        modal.style.display = 'none';
        return;
      }

      try {
        localStorage.setItem('ew_chatbot_minimized', 'true');
        sessionStorage.setItem('ew_chatbot_minimized', 'true');
      } catch (_) {}

      modal.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open Webinc Smart Assistant chat');
      modal.classList.add('is-minimizing');
      minButtons.forEach(btn => btn.blur());
      minimizeTimer = window.setTimeout(() => {
        modal.classList.remove('is-open', 'is-minimizing');
        modal.style.display = 'none';
      }, 260);
    }

    trigger.hidden = false;
    let wasMinimized = false;
    try {
      wasMinimized = localStorage.getItem('ew_chatbot_minimized') === 'true' || sessionStorage.getItem('ew_chatbot_minimized') === 'true';
    } catch (_) {}

    if (!wasMinimized) {
      setChatbotOpen(true);
    } else {
      modal.classList.remove('is-open', 'is-minimizing');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open Webinc Smart Assistant chat');
    }
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = modal.classList.contains('is-open') && !modal.classList.contains('is-minimizing');
      setChatbotOpen(!isOpen, !isOpen);
    });

    minButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setChatbotOpen(false);
      });
    });

    modal.addEventListener('keydown', event => {
      if (event.key === 'Escape') setChatbotOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        setChatbotOpen(false);
      }
    });

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', event => {
        event.preventDefault();
        sendMessage(chatInput.value);
        chatInput.value = '';
        chatInput.focus();
      });
    }

    if (quickReplies && messages) {
      quickReplies.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sendMessage(btn.textContent);
        });
      });
    }

    if (promptRow && messages) {
      promptRow.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => sendMessage(btn.dataset.message || btn.textContent));
      });
    }

    if (newChatButton && messages) {
      newChatButton.addEventListener('click', () => {
        conversationVersion += 1;
        assistantThinking = false;
        projectBriefStep = -1;
        Object.keys(projectBrief).forEach(key => delete projectBrief[key]);
        messages.replaceChildren();
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'chat-msg chat-msg-bot';
        welcomeMessage.textContent = welcomeText;
        messages.appendChild(welcomeMessage);
        messages.scrollTop = 0;
        if (chatInput) {
          chatInput.disabled = false;
          chatInput.value = '';
          chatInput.focus();
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // INITIALIZE ALL COMPONENTS
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initBrandMarquees();
    initThemeToggle();
    initAutoScroll();
    initNavbar();
    initMobileDrawer();
    initAccordions();
    initMultiStepForm();
    initChatbot();
  });

})();
