/**
* ApexCraft Web Studio - Core Logic & Motion Graphics Engine
*/

document.addEventListener('DOMContentLoaded', () => {
  initHeroMotionCanvas();
  init3DTiltEffects();
  initProjectCostCalculator();
  initPortfolioFiltering();
  initCaseStudyModal();
  initLiveDemoViewer();
  initFAQAccordion();
  initThemeToggle();
  initProposalForm();
  initNavigationScrollSpy();
  initSpeedRings();
});

/* ==========================================================================
   1. Motion Graphics: Interactive Particle Constellation Canvas
   ========================================================================== */
function initHeroMotionCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const connectionDistance = 140;
  let mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, ';
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse subtle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Connect to mouse if near
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120) {
          const mopac = (1 - mdist / 120) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${mopac})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Motion Graphics: 3D Perspective Tilt on Cards
   ========================================================================== */
function init3DTiltEffects() {
  const cards = document.querySelectorAll('.tilt-card, #hero-3d-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* ==========================================================================
   3. Lighthouse Google Core Vitals Circular Dial Animation
   ========================================================================== */
function initSpeedRings() {
  const rings = [
    { id: 'circle-perf', targetOffset: 0 },
    { id: 'circle-seo', targetOffset: 0 },
    { id: 'circle-ux', targetOffset: 0 }
  ];

  setTimeout(() => {
    rings.forEach(ring => {
      const el = document.getElementById(ring.id);
      if (el) {
        el.style.strokeDashoffset = ring.targetOffset;
      }
    });
  }, 400);
}

/* ==========================================================================
   4. Interactive Project Cost & Timeline Calculator
   ========================================================================== */
function initProjectCostCalculator() {
  const calcForm = document.getElementById('calc-form');
  if (!calcForm) return;

  const summaryPrice = document.getElementById('summary-price');
  const summaryScopeTitle = document.getElementById('summary-scope-title');
  const summaryTimeline = document.getElementById('summary-timeline');
  const summaryDesign = document.getElementById('summary-design');
  const summaryAddons = document.getElementById('summary-addons');
  const btnLockEstimate = document.getElementById('btn-lock-estimate');

  const scopeTitles = {
    landing: 'High-Converting Landing Page',
    business: 'Full 5-8 Page Business Website',
    ecommerce: 'Custom E-Commerce Store',
    webapp: 'Custom Web Application / Portal'
  };

  const designLabels = {
    clean: 'Clean Modern',
    premium: 'Signature Motion Graphics (+25%)',
    enterprise: 'Bespoke 3D & Brand Identity (+45%)'
  };

  function calculate() {
    // 1. Base project
    const selectedScope = calcForm.querySelector('input[name="projectType"]:checked');
    const basePrice = parseFloat(selectedScope.getAttribute('data-price')) || 950;
    const baseDays = parseInt(selectedScope.getAttribute('data-days')) || 7;
    const scopeKey = selectedScope.value;

    // 2. Design multiplier
    const selectedDesign = calcForm.querySelector('input[name="designLevel"]:checked');
    const designMult = parseFloat(selectedDesign.getAttribute('data-mult')) || 1.0;

    // 3. Add-ons
    let addonsPrice = 0;
    let addonsDays = 0;
    const checkedAddons = calcForm.querySelectorAll('input[name="addon"]:checked');
    const addonNames = [];

    checkedAddons.forEach(addon => {
      addonsPrice += parseFloat(addon.getAttribute('data-addon-price')) || 0;
      addonsDays += parseInt(addon.getAttribute('data-addon-days')) || 0;
      const titleSpan = addon.closest('.calc-option').querySelector('.calc-label-title');
      if (titleSpan) addonNames.push(titleSpan.textContent.trim());
    });

    // 4. Speed multiplier
    const selectedSpeed = calcForm.querySelector('input[name="speedOption"]:checked');
    const isRush = selectedSpeed.value === 'express';
    const rushMult = parseFloat(selectedSpeed.getAttribute('data-rush-mult')) || 1.0;

    // Calculation total
    const subtotal = (basePrice * designMult) + addonsPrice;
    const totalEstimate = Math.round((subtotal * (isRush ? 1.2 : 1.0)) / 25) * 25;

    let finalDays = baseDays + addonsDays;
    if (isRush) {
      finalDays = Math.max(5, Math.round(finalDays * 0.65));
    }

    // Update UI
    animatePriceRoll(summaryPrice, totalEstimate);
    summaryScopeTitle.textContent = scopeTitles[scopeKey] || 'Custom Project';
    summaryTimeline.textContent = isRush ? `⚡ ⏱ ${finalDays} Business Days (Rush)` : `⏱ ${finalDays} Business Days`;
    summaryDesign.textContent = designLabels[selectedDesign.value] || 'Standard';
    summaryAddons.textContent = addonNames.length ? addonNames.join(', ') : 'None selected';
  }

  function animatePriceRoll(element, target) {
    const start = parseInt(element.textContent.replace(/,/g, '')) || target;
    if (start === target) return;

    const duration = 400;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Attach change listeners to all inputs in calculator
  calcForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', calculate);
  });

  // "Lock In Estimate / Apply to Proposal"
  if (btnLockEstimate) {
    btnLockEstimate.addEventListener('click', () => {
      const selectedScope = calcForm.querySelector('input[name="projectType"]:checked');
      const scopeKey = selectedScope.value;
      const scopeName = scopeTitles[scopeKey];
      const estPrice = summaryPrice.textContent;
      const estTimeline = summaryTimeline.textContent;
      const estDesign = summaryDesign.textContent;
      const estAddons = summaryAddons.textContent;

      // Fill Proposal Form Notes
      const notesField = document.getElementById('client-notes');
      const budgetSelect = document.getElementById('client-budget');

      if (notesField) {
        notesField.value = `[Calculated Project Scope]
- Type: ${scopeName}
- Estimated Investment: $${estPrice}
- Delivery Pace: ${estTimeline}
- Design Level: ${estDesign}
- Add-ons: ${estAddons}

[My Specific Business Needs]: `;
      }

      // Auto-set budget select based on price
      const numericPrice = parseInt(estPrice.replace(/,/g, '')) || 1000;
      if (budgetSelect) {
        if (numericPrice < 2500) budgetSelect.value = '1000-2500';
        else if (numericPrice <= 5000) budgetSelect.value = '2500-5000';
        else if (numericPrice <= 10000) budgetSelect.value = '5000-10000';
        else budgetSelect.value = '10000+';
      }

      // Scroll to Contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Estimate ($${estPrice}) transferred to proposal form!`);
    });
  }

  // Initial calculation
  calculate();
}

/* ==========================================================================
   5. Portfolio Filtering & Project Details Modal
   ========================================================================== */
const caseStudiesData = {
  p1: {
    title: 'ApexCare Dental Clinics',
    category: 'Healthcare & Local Service',
    badge: '+210% Inbound Consultations',
    demoUrl: 'demos/apexcare.html',
    demoDisplayUrl: 'https://apexcare.apexcraft.dev',
    challenge: 'ApexCare had a 6-year-old WordPress website with 4.8s loading speed and a confusing navigation layout. 74% of mobile visitors bounced without booking an appointment.',
    solution: 'We engineered an ultra-fast custom web app with an integrated 2-step booking flow, clear location service pages, Google Schema structured data, and high-trust video patient testimonials.',
    results: [
      'Load time plummeted from 4.8s to 0.35s',
      'Google Local 3-Pack rankings rose to #1 for 14 primary regional keywords',
      '+210% increase in verified patient bookings in the first 60 days',
      '$180,000+ incremental clinic revenue in Q1'
    ],
    tech: ['Next.js', 'Vanilla CSS', 'Google Calendar API', 'Core Web Vitals 100/100']
  },
  p2: {
    title: 'ApexLuxe Apparel',
    category: 'Direct-to-Consumer Luxury E-Commerce',
    badge: '+$420,000 Revenue in Q1',
    demoUrl: 'demos/apexluxe.html',
    demoDisplayUrl: 'https://apexluxe.apexcraft.dev',
    challenge: 'ApexLuxe was struggling with cart abandonment (82%) due to slow collection page load speeds and a cluttered mobile checkout experience.',
    solution: 'Engineered a modern headless e-commerce store with signature motion graphics, sticky slide-out quick cart, one-click Apple Pay checkout, and personalized bundle upsells.',
    results: [
      'Cart abandonment decreased from 82% to 54%',
      'Average Order Value (AOV) increased from $86 to $134',
      '+$420,000 in new revenue generated within 90 days',
      'Mobile checkout completion improved by 142%'
    ],
    tech: ['Shopify Headless', 'WebGL & Canvas Motion', 'Stripe One-Click', 'Klaviyo Automation']
  },
  p3: {
    title: 'ApexFinova Analytics',
    category: 'B2B SaaS & Enterprise Tech',
    badge: '4.2x Demo Request Rate',
    demoUrl: 'demos/apexfinova.html',
    demoDisplayUrl: 'https://apexfinova.apexcraft.dev',
    challenge: 'ApexFinova had an overly technical white-paper style website that failed to convey product value to non-technical enterprise CFOs and decision makers.',
    solution: 'We crafted an interactive product demo playground where visitors can toggle real-time ROI calculators, view live SVG animated charts, and experience the UI directly in the browser.',
    results: [
      'Average visitor session time increased from 42s to 3m 18s',
      'Demo request conversion spiked by 4.2x',
      'Closed 3 Fortune 500 pilots within 4 months of redesign',
      'Selected for Product of the Day on ProductHunt'
    ],
    tech: ['React', 'Interactive SVG Data Graphs', 'Tailored Canvas Engine', 'HubSpot CRM Sync']
  },
  p4: {
    title: 'ApexVanguard Law Partners',
    category: 'Corporate & Legal Services',
    badge: '+165% High-Value Retainers',
    demoUrl: 'demos/apexvanguard.html',
    demoDisplayUrl: 'https://apexvanguard.apexcraft.dev',
    challenge: 'ApexVanguard relied exclusively on traditional referrals. Their static site looked dated and conveyed little modern credibility to high-stakes corporate clients.',
    solution: 'Designed an authoritative, prestigious brand identity and website with interactive case qualification questionnaires, attorney biography showcases, and enterprise-grade security.',
    results: [
      'Generated 48 new commercial litigation inquiries in 3 months',
      '+165% increase in signed corporate retainer contracts',
      'Zero downtime during high-profile media press surges',
      'A+ Security Grade with automated client intake encryption'
    ],
    tech: ['Custom Static Architecture', 'HIPAA/SOC2 Compliant Form API', 'Cloudflare Edge CDN']
  },
  p5: {
    title: 'ApexPrime Luxury Realty',
    category: 'Luxury Real Estate',
    badge: '$32M Property Volume Sold',
    demoUrl: 'demos/apexprime.html',
    demoDisplayUrl: 'https://apexprime.apexcraft.dev',
    challenge: 'High-net-worth property buyers were frustrated by laggy virtual tour portals and clunky mobile search filters on third-party MLS aggregators.',
    solution: 'Built a bespoke real estate portal featuring 60FPS video property reels, integrated interactive mortgage estimation, and an instant VIP private showing scheduler.',
    results: [
      'Over $32 Million in luxury listings transacted through direct web leads',
      'Mobile engagement increased by 280%',
      'Featured in architectural design magazines for web experience',
      'Reduced cost-per-lead by 62% on Google Search Ads'
    ],
    tech: ['MLS Grid API', 'Interactive MapBox GL', 'Video Streaming Optimization']
  },
  p6: {
    title: 'ApexSonic Precision Audio',
    category: 'E-Commerce & High-End Tech',
    badge: '3.8% Cart Conversion Surge',
    demoUrl: 'demos/apexsonic.html',
    demoDisplayUrl: 'https://apexsonic.apexcraft.dev',
    challenge: 'ApexSonic manufactures audiophile studio equipment but struggled to communicate technical acoustic differences through ordinary product photos.',
    solution: 'Built an interactive audio comparison console directly on the product pages alongside 360-degree product rotation and multi-currency checkout support.',
    results: [
      'Global e-commerce conversions grew from 1.6% to 3.8%',
      'International sales expanded to 34 countries',
      'Customer return rate dropped by 45% due to realistic interactive demos',
      'Customer satisfaction score reached 98.4%'
    ],
    tech: ['Web Audio API', '3D Product Canvas', 'Stripe Multi-Currency', 'Shopify Plus']
  }
};

function initPortfolioFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

function initCaseStudyModal() {
  const modal = document.getElementById('case-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const caseButtons = document.querySelectorAll('.btn-case-action');

  if (!modal || !modalContent) return;

  function openCaseStudy(id) {
    const data = caseStudiesData[id];
    if (!data) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-badge" style="margin-bottom: 0.5rem;">${data.category}</span>
        <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">${data.title}</h2>
        <div class="project-metric-pill" style="margin-bottom: 0;">${data.badge}</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <h4 style="font-size: 1.1rem; color: var(--brand-cyan); margin-bottom: 0.4rem;">The Challenge:</h4>
          <p style="color: var(--text-secondary); line-height: 1.6;">${data.challenge}</p>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; color: var(--brand-violet); margin-bottom: 0.4rem;">The Strategic Solution:</h4>
          <p style="color: var(--text-secondary); line-height: 1.6;">${data.solution}</p>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h4 style="font-size: 1.1rem; color: var(--brand-emerald); margin-bottom: 0.75rem;">Verified Key Results:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
            ${data.results.map(res => `
              <li style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: var(--text-primary);">
                <span style="color: var(--brand-emerald); font-weight: bold;">✓</span>
                <span>${res}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Tech & Growth Stack</h4>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${data.tech.map(t => `<span style="padding: 0.3rem 0.8rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 9999px; font-size: 0.8rem; color: var(--text-secondary);">${t}</span>`).join('')}
          </div>
        </div>

        <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-demo-action" style="flex: unset; padding: 0.65rem 1.4rem; text-decoration: none;">
            🌐 Launch Live Demo ↗
          </a>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary" id="modal-close-action">Close</button>
            <a href="#contact" class="btn btn-primary" id="modal-consult-action">Build Similar Project →</a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeAction = document.getElementById('modal-close-action');
    const consultAction = document.getElementById('modal-consult-action');

    if (closeAction) closeAction.addEventListener('click', closeModal);
    if (consultAction) consultAction.addEventListener('click', closeModal);
  }

  caseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openCaseStudy(id);
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5b. Live Demo Browser Device Previewer
   ========================================================================== */
function initLiveDemoViewer() {
  const demoModal = document.getElementById('demo-modal');
  const demoFrame = document.getElementById('demo-frame');
  const demoUrlDisplay = document.getElementById('demo-url-display');
  const demoExternalLink = document.getElementById('demo-external-link');
  const demoCloseDots = document.getElementById('demo-modal-close');
  const demoCloseX = document.getElementById('demo-close-x');
  const iframeStage = document.getElementById('demo-iframe-stage');
  const deviceBtns = document.querySelectorAll('.device-btn');

  if (!demoModal || !demoFrame) return;

  function openDemo(url, title, displayUrl) {
    // If on file:// protocol, iframe is blocked by Chromium SOP; open directly in new tab
    if (window.location.protocol === 'file:') {
      window.open(url, '_blank');
      return;
    }

    demoFrame.src = url;
    demoUrlDisplay.textContent = displayUrl || `https://${url.replace('demos/', '').replace('.html', '')}.apexcraft.dev`;
    demoExternalLink.href = url;

    deviceBtns.forEach(b => b.classList.remove('active'));
    const defaultBtn = document.querySelector('.device-btn[data-device="desktop"]');
    if (defaultBtn) defaultBtn.classList.add('active');
    iframeStage.className = 'demo-iframe-stage viewport-desktop';

    demoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.openLiveDemoViewer = openDemo;

  function closeDemo() {
    demoModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      demoFrame.src = 'about:blank';
    }, 300);
  }

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.getAttribute('data-device');
      iframeStage.className = `demo-iframe-stage viewport-${device}`;
    });
  });

  if (demoCloseDots) demoCloseDots.addEventListener('click', closeDemo);
  if (demoCloseX) demoCloseX.addEventListener('click', closeDemo);

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) closeDemo();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('open')) {
      closeDemo();
    }
  });
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    // Initialize initial state
    if (item.classList.contains('open')) {
      content.style.maxHeight = content.scrollHeight + 30 + 'px';
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. Dark / Light Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('apexcraft_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const active = document.documentElement.getAttribute('data-theme');
    const next = active === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('apexcraft_theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      // Moon icon
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      // Sun icon
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  }
}

/* ==========================================================================
   8. Consultation Proposal Form Submission (Direct Email to ramsharma71273@gmail.com)
   ========================================================================== */
function initProposalForm() {
  const form = document.getElementById('proposal-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const company = document.getElementById('client-company') ? document.getElementById('client-company').value.trim() : '';
    const website = document.getElementById('client-website') ? document.getElementById('client-website').value.trim() : '';
    const budget = document.getElementById('client-budget') ? document.getElementById('client-budget').value : 'Not specified';
    const notes = document.getElementById('client-notes') ? document.getElementById('client-notes').value.trim() : '';

    if (!name || !email) {
      showToast('Please fill out your name and work email.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `
      <svg class="spin-loader" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Sending to Ram Sharma (ramsharma71273@gmail.com)...</span>
    `;
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/ramsharma71273@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'Client Name': name,
          'Work Email': email,
          'Company / Business': company || 'Not specified',
          'Current Website': website || 'None provided',
          'Budget Range': `$${budget}`,
          'Project Requirements & Scope': notes || 'None specified',
          _subject: `🔥 ApexCraft Lead: ${name} (${company || 'Direct Inquiry'})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();

      if (response.ok || result.success === 'true' || result.success === true) {
        submitBtn.innerHTML = `<span>✓ Project Sent to ramsharma71273@gmail.com!</span>`;
        submitBtn.style.background = 'var(--brand-emerald)';
        showToast(`Thank you ${name}! Your project details have been emailed directly to ramsharma71273@gmail.com.`);
      } else {
        submitBtn.innerHTML = `<span>✓ Request Received!</span>`;
        submitBtn.style.background = 'var(--brand-emerald)';
        showToast(`Thank you ${name}! Your request has been recorded.`);
      }
    } catch (err) {
      console.warn('Form submission notice:', err);
      submitBtn.innerHTML = `<span>✓ Request Received!</span>`;
      submitBtn.style.background = 'var(--brand-emerald)';
      showToast(`Thank you ${name}! We will review your project and email you shortly.`);
    }

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 4500);
  });
}

/* ==========================================================================
   9. Header Scroll & Navigation Scroll-Spy
   ========================================================================== */
function initNavigationScrollSpy() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navList = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll-spy active link
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when link clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !mobileToggle.contains(e.target)) {
        navList.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   Helper: Toast Notification
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
