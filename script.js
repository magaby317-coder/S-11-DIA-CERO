/**
 * D&Iacute;A CERO &mdash; El 11 de Septiembre y la Transformaci&oacute;n del Mundo
 * PROYECTO DE INVESTIGACI&Oacute;N &bull; GIMNASIO VALLEGRANDE
 * L&oacute;gica interactiva, pedag&oacute;gica y multimedia (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. PARTICULAS AMBIENTALES EN CANVAS (PORTADA)
  // ==========================================================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor(width * 0.04), 50);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.6,
          speedY: -(Math.random() * 0.3 + 0.08),
          speedX: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    }

    initParticles();

    function renderParticles() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${Math.max(0.1, Math.min(0.7, p.opacity))})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderParticles);
      }
    }

    if (!prefersReducedMotion) {
      renderParticles();
    }
  }

  // ==========================================================================
  // 2. BARRA DE PROGRESO Y ENCABEZADO PERSISTENTE
  // ==========================================================================
  const scrollProgress = document.getElementById('scroll-progress');
  const mainHeader = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    }

    if (mainHeader) {
      if (scrollTop > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    let currentSection = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollTop >= secTop && scrollTop < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navList = document.getElementById('nav-links');
  if (mobileNavToggle && navList) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('mobile-open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
    });

    navList.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navList.classList.remove('mobile-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================================================
  // 3. APARICION PROGRESIVA CON INTERSECTION OBSERVER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));
  // ==========================================================================
  // 4. SISTEMA GLOBAL DE MODALES ACCESIBLES
  // ==========================================================================
  const modalOverlay = document.getElementById('global-modal-overlay');
  const modalContainer = document.getElementById('global-modal-container');
  const modalCategoryBadge = document.getElementById('modal-category-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  let lastActiveElement = null;

  function openModal(category, title, subtitle, contentHtml) {
    lastActiveElement = document.activeElement;

    if (modalCategoryBadge) modalCategoryBadge.innerHTML = category;
    if (modalTitle) modalTitle.innerHTML = title;
    if (modalSubtitle) modalSubtitle.innerHTML = subtitle;
    if (modalBody) {
      modalBody.innerHTML = contentHtml;
      modalBody.scrollTop = 0;
    }

    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (modalCloseBtn) modalCloseBtn.focus();
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveElement) lastActiveElement.focus();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-active')) {
      closeModal();
    }
  });

  // ==========================================================================
  // 5. FICHAS TÉCNICAS DE LOS CUATRO VUELOS
  const flightData = {
    aa11: {
      category: 'TELEMETR&Iacute;A DE VUELO &bull; AMERICAN AIRLINES 11',
      title: 'American Airlines 11 (AA 11) &mdash; Impacto Torre Norte',
      subtitle: 'Boeing 767-223ER &bull; Matr&iacute;cula N334AA &bull; Boston (BOS) &rarr; Los &Aacute;ngeles (LAX)',
      body: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">AERONAVE</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">Boeing 767-223ER</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">Capacidad combustible: ~38,000 L</p>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">OCUPANTES</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">92 personas</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">81 pasajeros + 11 tripulantes</p>
          </div>
        </div>

        <h4 style="color:#fff; margin-bottom:0.5rem;">Cronolog&iacute;a del Vuelo</h4>
        <ul style="padding-left:1.5rem; margin-bottom:1.5rem; color:#cbd5e1;">
          <li><strong>07:59 EDT:</strong> Despega del Aeropuerto Logan de Boston rumbo a Los &Aacute;ngeles.</li>
          <li><strong>08:14 EDT:</strong> &Uacute;ltima comunicaci&oacute;n rutinaria por radio. Los secuestradores toman el control de la cabina.</li>
          <li><strong>08:24 EDT:</strong> Transmisi&oacute;n accidental del secuestrador a los controladores: <em>"Tenemos algunos aviones. Qu&eacute;dense quietos y todo estar&aacute; bien."</em></li>
          <li><strong>08:46:40 EDT:</strong> Colisi&oacute;n a 790 km/h contra la fachada norte de la Torre Norte (WTC 1), entre los pisos 93 y 99.</li>
        </ul>

        <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:1.2rem;">
          <h5 style="color:#fca5a5; font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.3rem;">CONSECUENCIA ESTRUCTURAL CLAVE</h5>
          <p style="font-size:0.9rem; color:#e2e8f0; margin:0;">El impacto cort&oacute; inmediatamente las tres cajas de escaleras de escape (Escaleras A, B y C) en el n&uacute;cleo central, impidiendo que ninguna persona por encima del piso 92 pudiera descender con vida.</p>
        </div>
      `
    },
    ua175: {
      category: 'TELEMETR&Iacute;A DE VUELO &bull; UNITED AIRLINES 175',
      title: 'United Airlines 175 (UA 175) &mdash; Impacto Torre Sur',
      subtitle: 'Boeing 767-222 &bull; Matr&iacute;cula N612UA &bull; Boston (BOS) &rarr; Los &Aacute;ngeles (LAX)',
      body: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">AERONAVE</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">Boeing 767-222</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">Velocidad de impacto: 950 km/h</p>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">OCUPANTES</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">65 personas</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">56 pasajeros + 9 tripulantes</p>
          </div>
        </div>

        <h4 style="color:#fff; margin-bottom:0.5rem;">Cronolog&iacute;a del Vuelo</h4>
        <ul style="padding-left:1.5rem; margin-bottom:1.5rem; color:#cbd5e1;">
          <li><strong>08:14 EDT:</strong> Despegue de Boston, con retraso de 16 minutos sobre la pista.</li>
          <li><strong>08:42&ndash;08:46 EDT:</strong> Los secuestradores irrumpen en la cabina mientras el vuelo 11 impactaba la Torre Norte.</li>
          <li><strong>08:52 EDT:</strong> Desv&iacute;o brusco hacia el sur sobre Nueva Jersey.</li>
          <li><strong>09:03:02 EDT:</strong> Impacto en &aacute;ngulo contra la fachada sur de la Torre Sur (WTC 2), entre los pisos 77 y 85, transmitido en directo a nivel global.</li>
        </ul>

        <div style="background:rgba(249,115,22,0.1); border:1px solid rgba(249,115,22,0.3); border-radius:8px; padding:1.2rem;">
          <h5 style="color:#fdba74; font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.3rem;">DIFERENCIA T&Eacute;CNICA DECISIVA</h5>
          <p style="font-size:0.9rem; color:#e2e8f0; margin:0;">Debido al &aacute;ngulo lateral del impacto, la Escalera A qued&oacute; transitable aunque da&ntilde;ada, permitiendo que al menos 18 personas por encima del piso 77 lograran evacuar antes del colapso de la torre a las 09:59.</p>
        </div>
      `
    },
    aa77: {
      category: 'TELEMETR&Iacute;A DE VUELO &bull; AMERICAN AIRLINES 77',
      title: 'American Airlines 77 (AA 77) &mdash; Impacto El Pent&aacute;gono',
      subtitle: 'Boeing 757-223 &bull; Matr&iacute;cula N644AA &bull; Washington Dulles (IAD) &rarr; Los &Aacute;ngeles (LAX)',
      body: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">AERONAVE</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">Boeing 757-223</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">Bimotor de fuselaje estrecho</p>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">OCUPANTES</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">64 personas</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">58 pasajeros + 6 tripulantes</p>
          </div>
        </div>

        <h4 style="color:#fff; margin-bottom:0.5rem;">Cronolog&iacute;a del Vuelo</h4>
        <ul style="padding-left:1.5rem; margin-bottom:1.5rem; color:#cbd5e1;">
          <li><strong>08:20 EDT:</strong> Despegue del Aeropuerto Dulles de Washington.</li>
          <li><strong>08:51&ndash;08:54 EDT:</strong> Secuestro sobre Ohio. El transpondedor es apagado para desaparecer de los radares secundarios.</li>
          <li><strong>08:56 EDT:</strong> El piloto secuestrador vira 180 grados en direcci&oacute;n hacia la capital federal.</li>
          <li><strong>09:37:46 EDT:</strong> El avi&oacute;n desciende a ras de suelo y penetra en la fachada oeste del Pent&aacute;gono a 850 km/h.</li>
        </ul>

        <div style="background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.3); border-radius:8px; padding:1.2rem;">
          <h5 style="color:#7dd3fc; font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.3rem;">IMPACTO Y DEFENSA</h5>
          <p style="font-size:0.9rem; color:#e2e8f0; margin:0;">La secci&oacute;n impactada acababa de ser reforzada con ventanas antibalas de 5 cm de grosor y columnas de acero como parte de una remodelaci&oacute;n estructural, lo que evit&oacute; un colapso mayor y salv&oacute; cientos de vidas militares y civiles.</p>
        </div>
      `
    },
    ua93: {
      category: 'TELEMETR&Iacute;A DE VUELO &bull; UNITED AIRLINES 93',
      title: 'United Airlines 93 (UA 93) &mdash; Ca&iacute;da en Shanksville, PA',
      subtitle: 'Boeing 757-222 &bull; Matr&iacute;cula N591UA &bull; Newark (EWR) &rarr; San Francisco (SFO)',
      body: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">AERONAVE</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">Boeing 757-222</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">Velocidad terminal: 906 km/h</p>
          </div>
          <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:8px;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#94a3b8;">OCUPANTES</span>
            <p style="font-size:1.05rem; font-weight:700; color:#fff; margin:0.2rem 0 0 0;">44 personas</p>
            <p style="font-size:0.82rem; color:#cbd5e1; margin:0;">37 pasajeros + 7 tripulantes</p>
          </div>
        </div>

        <h4 style="color:#fff; margin-bottom:0.5rem;">Cronolog&iacute;a del Vuelo</h4>
        <ul style="padding-left:1.5rem; margin-bottom:1.5rem; color:#cbd5e1;">
          <li><strong>08:42 EDT:</strong> Despegue con 42 minutos de retraso por congesti&oacute;n en Newark. Este retraso fue decisivo.</li>
          <li><strong>09:28 EDT:</strong> Secuestro sobre Ohio mientras los pasajeros ya conoc&iacute;an los ataques en Nueva York a trav&eacute;s de tel&eacute;fonos a&eacute;reos Airfone.</li>
          <li><strong>09:57 EDT:</strong> Los pasajeros organizan una revuelta coordinada y asaltan la cabina utilizando un carrito de servicio.</li>
          <li><strong>10:03:11 EDT:</strong> El avi&oacute;n se estrella en un campo abierto recuperado de miner&iacute;a en Shanksville, Pensilvania, a 20 minutos de vuelo de Washington.</li>
        </ul>

        <div style="background:rgba(192,132,252,0.1); border:1px solid rgba(192,132,252,0.3); border-radius:8px; padding:1.2rem;">
          <h5 style="color:#d8b4fe; font-family:var(--font-mono); font-size:0.85rem; margin-bottom:0.3rem;">EL ACTO QUE SALV&Oacute; EL CAPITOLIO</h5>
          <p style="font-size:0.9rem; color:#e2e8f0; margin:0;">La investigaci&oacute;n oficial determin&oacute; que el objetivo era el Capitolio de los Estados Unidos o la Casa Blanca. El sacrificio de los pasajeros impidi&oacute; un golpe devastador al centro neur&aacute;lgico legislativo de la naci&oacute;n.</p>
        </div>
      `
    }
  };

  document.querySelectorAll('.btn-flight-inspect').forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-flight');
      if (flightData[code]) {
        const f = flightData[code];
        openModal(f.category, f.title, f.subtitle, f.body);
      }
    });
  });
  // ==========================================================================
  // 8. SECCION "EL MAPA"
  // ==========================================================================
  const mapFilterBtns = document.querySelectorAll('.btn-map-filter');
  const flightPaths = {
    aa11: document.getElementById('path-aa11'),
    ua175: document.getElementById('path-ua175'),
    aa77: document.getElementById('path-aa77'),
    ua93: document.getElementById('path-ua93'),
  };

  mapFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mapFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-map-filter');

      Object.keys(flightPaths).forEach((key) => {
        const p = flightPaths[key];
        if (!p) return;
        if (filter === 'all' || filter === key) {
          p.style.opacity = '1';
          p.style.strokeWidth = '3.5';
        } else {
          p.style.opacity = '0.12';
          p.style.strokeWidth = '1.5';
        }
      });
    });
  });

  const mapPointTooltip = document.getElementById('map-point-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipBadge = document.getElementById('tooltip-badge');
  const tooltipMediaBox = document.getElementById('tooltip-media-box');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipCloseBtn = document.getElementById('tooltip-close-btn');

  const mapLocations = {
    boston: {
      title: 'Boston &mdash; Aeropuerto Logan (BOS)',
      badge: 'PUNTO DE ORIGEN &bull; VUELOS AA11 &amp; UA175',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <line x1="20" y1="70" x2="280" y2="70" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6"/>
          <circle cx="50" cy="70" r="14" fill="#38bdf8"/>
          <text x="75" y="75" fill="#fff" font-size="14" font-weight="700" font-family="'Inter', sans-serif">Pistas 04R y 09</text>
          <text x="75" y="95" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">07:59 y 08:14 EDT</text>
        </svg>
      `,
      desc: 'Punto de partida de los dos Boeing 767 que impactaron las Torres Gemelas. Ambos vuelos ten&iacute;an como destino programado la ciudad de Los &Aacute;ngeles con los tanques llenos de combustible Jet-A.'
    },
    newark: {
      title: 'Newark &mdash; Aeropuerto Liberty (EWR)',
      badge: 'PUNTO DE ORIGEN &bull; VUELO UA93',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <circle cx="150" cy="65" r="30" fill="rgba(192,132,252,0.2)" stroke="#c084fc" stroke-width="2"/>
          <text x="150" y="70" fill="#fff" font-size="14" font-weight="700" text-anchor="middle" font-family="'Inter', sans-serif">Retraso de 42 min</text>
          <text x="150" y="90" fill="#d8b4fe" font-size="11" text-anchor="middle" font-family="'JetBrains Mono', monospace">Despegue 08:42 EDT</text>
        </svg>
      `,
      desc: 'El vuelo United 93 permaneci&oacute; en la pista durante 42 minutos por tr&aacute;fico a&eacute;reo. Ese retraso involuntario permiti&oacute; a los pasajeros enterarse de los ataques en Manhattan y planificar la revuelta heroica.'
    },
    nyc: {
      title: 'Nueva York &mdash; World Trade Center',
      badge: 'ZONA CERO &bull; IMPACTO EN TORRES GEMELAS',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <rect x="110" y="20" width="35" height="100" fill="#ef4444" opacity="0.8"/>
          <rect x="155" y="35" width="35" height="85" fill="#f97316" opacity="0.8"/>
          <text x="127" y="15" fill="#fff" font-size="11" text-anchor="middle" font-weight="700">WTC 1</text>
          <text x="172" y="30" fill="#fff" font-size="11" text-anchor="middle" font-weight="700">WTC 2</text>
        </svg>
      `,
      desc: 'Epicentro del ataque coordinado. Dos rascacielos de 110 pisos impactados sucesivamente a las 08:46 y 09:03 EDT. Ambas estructuras colapsaron en menos de dos horas.'
    },
    pentagon: {
      title: 'Arlington, VA &mdash; El Pent&aacute;gono',
      badge: 'IMPACTO EN COMANDO MILITAR SUPREMO',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <polygon points="150,20 230,55 200,125 100,125 70,55" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
          <polygon points="150,40 205,65 185,110 115,110 95,65" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="95" cy="65" r="8" fill="#ef4444"/>
        </svg>
      `,
      desc: 'Sede del Departamento de Defensa. El vuelo AA 77 perfor&oacute; tres de los anillos conc&eacute;ntricos del flanco occidental, cobr&aacute;ndose la vida de 125 militares y civiles en tierra.'
    },
    shanksville: {
      title: 'Shanksville, Pensilvania',
      badge: 'CAMPO ABIERTO &bull; CA&Iacute;DA DEL VUELO UA93',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <circle cx="150" cy="70" r="32" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" stroke-width="2"/>
          <path d="M150 45 L155 60 L170 60 L158 70 L162 85 L150 75 L138 85 L142 70 L130 60 L145 60 Z" fill="#fbbf24"/>
        </svg>
      `,
      desc: 'Punto de impacto a 906 km/h en un terreno deshabitado de Pensilvania. La resistencia colectiva de pasajeros y tripulantes impidi&oacute; la destrucci&oacute;n del Capitolio en Washington.'
    },
    lax: {
      title: 'Los &Aacute;ngeles &mdash; Aeropuerto LAX',
      badge: 'DESTINO PROGRAMADO DE 3 VUELOS',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <text x="150" y="65" fill="#fff" font-size="18" font-weight="700" text-anchor="middle" font-family="'Inter', sans-serif">Destino Costa Oeste</text>
          <text x="150" y="85" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">AA11 &bull; UA175 &bull; AA77</text>
        </svg>
      `,
      desc: 'Los aviones seleccionados cubr&iacute;an la ruta transcontinental este-oeste para transportar la m&aacute;xima carga de combustible (~38,000 a 43,000 litros), utiliz&aacute;ndolo como arma incendiaria masiva.'
    },
    sfo: {
      title: 'San Francisco &mdash; Aeropuerto SFO',
      badge: 'DESTINO PROGRAMADO &bull; VUELO UA93',
      graphic: `
        <svg viewBox="0 0 300 140" style="width:100%; height:100%;">
          <rect width="300" height="140" fill="#132438"/>
          <text x="150" y="65" fill="#fff" font-size="18" font-weight="700" text-anchor="middle" font-family="'Inter', sans-serif">Ruta Transcontinental</text>
          <text x="150" y="85" fill="#c084fc" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">Destino UA93 &bull; 41,000 L</text>
        </svg>
      `,
      desc: 'Destino final programado del vuelo 93. La aeronave contaba con autonom&iacute;a para volar m&aacute;s de 4,000 kil&oacute;metros a trav&eacute;s de Norteam&eacute;rica.'
    }
  };

  document.querySelectorAll('.map-node').forEach((node) => {
    node.addEventListener('click', () => {
      const locKey = node.getAttribute('data-loc');
      if (mapLocations[locKey] && mapPointTooltip) {
        const data = mapLocations[locKey];
        if (tooltipTitle) tooltipTitle.innerHTML = data.title;
        if (tooltipBadge) tooltipBadge.innerHTML = data.badge;
        if (tooltipMediaBox) tooltipMediaBox.innerHTML = data.graphic;
        if (tooltipDesc) tooltipDesc.innerHTML = data.desc;
        mapPointTooltip.classList.add('is-active');
      }
    });
  });

  if (tooltipCloseBtn && mapPointTooltip) {
    tooltipCloseBtn.addEventListener('click', () => {
      mapPointTooltip.classList.remove('is-active');
    });
  }  // ==========================================================================
  // 6. SECCION "LAS TORRES" — 4 HOTSPOTS CONCISOS (<100 PALABRAS)
  // ==========================================================================
  function openHotspot1() {
    openModal(
      '01 &bull; HISTORIA',
      'Transformaci&oacute;n Hist&oacute;rica Global',
      'Contexto geopol&iacute;tico, ataque coordinado y respuesta internacional',
      `
      <div class="modal-hotspot-media">
        <img src="wtc-history.jpg" alt="Impacto historico en el World Trade Center" class="modal-preview-img" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='wtc-history.jpg';}else{this.src='wtc-1995.jpg';}">
      </div>
      <div class="modal-hotspot-facts">
        <div class="modal-fact-item">
          <strong>1. Contexto geopol&iacute;tico:</strong> Conflicto asim&eacute;trico orquestado por Al-Qaeda tras d&eacute;cadas de tensiones en Oriente Medio.
        </div>
        <div class="modal-fact-item">
          <strong>2. Ataque coordinado:</strong> Colisi&oacute;n premeditada de dos aviones comerciales a 790 y 950 km/h contra las torres.
        </div>
        <div class="modal-fact-item">
          <strong>3. Respuesta internacional:</strong> Invocaci&oacute;n hist&oacute;rica del Art&iacute;culo 5 de la OTAN y cambio radical de la diplomacia mundial.
        </div>
      </div>
      `
    );
  }

  function openHotspot2() {
    openModal(
      '02 &bull; MATEM&Aacute;TICAS',
      'Cifras Esenciales del Suceso',
      'Dimensiones f&iacute;sicas, distancia de vuelo y costos econ&oacute;micos',
      `
      <div class="modal-hotspot-media">
        <div class="scale-compare-chart" style="margin-bottom:1rem;">
          <div class="scale-bar-item"><span class="scale-val">300 m</span><div class="scale-bar eiffel" style="height:60%;"></div><span class="scale-label">Eiffel</span></div>
          <div class="scale-bar-item"><span class="scale-val">381 m</span><div class="scale-bar esb" style="height:76%;"></div><span class="scale-label">Empire State</span></div>
          <div class="scale-bar-item"><span class="scale-val">417 m</span><div class="scale-bar wtc" style="height:90%;"></div><span class="scale-label">Torre WTC 1</span></div>
        </div>
      </div>
      <div class="modal-hotspot-facts">
        <div class="modal-fact-item">
          <strong>417 metros:</strong> Altura monumental de 110 pisos que domin&oacute; el horizonte de Manhattan.
        </div>
        <div class="modal-fact-item">
          <strong>110 pisos:</strong> Espacio vertical que albergaba diariamente a m&aacute;s de 50,000 personas de 26 pa&iacute;ses.
        </div>
        <div class="modal-fact-item">
          <strong>3,800 km:</strong> Ruta transcontinental elegida deliberadamente para maximizar el combustible (~38,000 L).
        </div>
        <div class="modal-fact-item">
          <strong>$10,000+ millones:</strong> P&eacute;rdidas materiales directas y $40,000 millones en reclamos de seguros mundiales.
        </div>
      </div>
      `
    );
  }

  function openHotspot3() {
    openModal(
      '03 &bull; CIENCIAS NATURALES',
      'Medio Ambiente y Qu&iacute;mica Atmosf&eacute;rica',
      'Part&iacute;culas en suspensi&oacute;n, contaminaci&oacute;n alcalina y salud humana',
      `
      <div class="modal-hotspot-media">
        <img src="wtc-dust-plume.jpg" alt="Pluma de polvo y humo sobre la Zona Cero" class="modal-preview-img" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='wtc-dust-plume.jpg';}else{this.src='pentagon-aerial.jpg';}">
      </div>
      <div class="modal-hotspot-facts">
        <div class="modal-fact-item">
          <strong>Part&iacute;culas PM2.5 y PM10:</strong> Aerosoles microsc&oacute;picos que permanecieron semanas suspendidos en el aire.
        </div>
        <div class="modal-fact-item">
          <strong>Contaminaci&oacute;n qu&iacute;mica:</strong> Liberaci&oacute;n masiva de amianto (crisotilo), s&iacute;lice pulverizada, plomo y dioxinas.
        </div>
        <div class="modal-fact-item">
          <strong>Calidad del aire:</strong> Nube fuertemente b&aacute;sica (pH 10 a 11) que provoc&oacute; quemaduras en v&iacute;as respiratorias.
        </div>
        <div class="modal-fact-item">
          <strong>Impacto ambiental:</strong> M&aacute;s de 100,000 personas atendidas por enfermedades pulmonares y oncol&oacute;gicas.
        </div>
      </div>
      `
    );
  }

  function openHotspot4() {
    openModal(
      '04 &bull; INGENIER&Iacute;A',
      'Sistema Estructural de las Torres',
      'N&uacute;cleo central, fachada perimetral, pisos y colapso t&eacute;rmico',
      `
      <div class="modal-hotspot-media">
        <img src="wtc-structure-drawing.png" alt="Diagrama estructural del World Trade Center" class="modal-preview-img" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='wtc-structure-drawing.png';}">
      </div>
      <div class="modal-hotspot-facts">
        <div class="modal-fact-item">
          <strong>N&uacute;cleo central:</strong> 47 columnas de acero que alojaban ascensores y tres escaleras de evacuaci&oacute;n.
        </div>
        <div class="modal-fact-item">
          <strong>Tubo perimetral (Fachada):</strong> Malla exterior de 236 columnas estrechas actuando como un tubo portante continuo.
        </div>
        <div class="modal-fact-item">
          <strong>Pisos sin pilares:</strong> Cerchas de acero ligero de 18 metros que proporcionaban plantas completamente di&aacute;fanas.
        </div>
        <div class="modal-fact-item">
          <strong>Falla t&eacute;rmica a 600 &deg;C:</strong> El acero perdi&oacute; la mitad de su resistencia mec&aacute;nica, provocando el colapso progresivo.
        </div>
      </div>
      `
    );
  }

  const hs1 = document.getElementById('hotspot-1');
  const hs2 = document.getElementById('hotspot-2');
  const hs3 = document.getElementById('hotspot-3');
  const hs4 = document.getElementById('hotspot-4');

  if (hs1) hs1.addEventListener('click', openHotspot1);
  if (hs2) hs2.addEventListener('click', openHotspot2);
  if (hs3) hs3.addEventListener('click', openHotspot3);
  if (hs4) hs4.addEventListener('click', openHotspot4);

  const mhs1 = document.getElementById('btn-mobile-hs1');
  const mhs2 = document.getElementById('btn-mobile-hs2');
  const mhs3 = document.getElementById('btn-mobile-hs3');
  const mhs4 = document.getElementById('btn-mobile-hs4');

  if (mhs1) mhs1.addEventListener('click', openHotspot1);
  if (mhs2) mhs2.addEventListener('click', openHotspot2);
  if (mhs3) mhs3.addEventListener('click', openHotspot3);
  if (mhs4) mhs4.addEventListener('click', openHotspot4);

  // ==========================================================================
  // 7. MANEJO UNIVERSAL DE FALLBACK Y RESOLUCION DE RUTAS DE IMAGENES
  // ==========================================================================
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function () {
      if (!this.dataset.retry) {
        this.dataset.retry = '1';
        const currentSrc = this.getAttribute('src') || '';
        if (currentSrc.indexOf('images/') !== -1) {
          this.src = currentSrc.replace(/.*images\//, '');
          return;
        } else if (currentSrc.indexOf('/') === -1) {
          this.src = 'images/' + currentSrc;
          return;
        }
      }
      const fallback = this.nextElementSibling;
      if (fallback && fallback.classList.contains('img-fallback-card')) {
        this.style.display = 'none';
        fallback.style.display = 'flex';
      }
    });
  });

});;

