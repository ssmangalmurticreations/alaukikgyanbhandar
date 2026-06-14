/* ── MODAL ── */
const infoModal     = document.getElementById('infoModal');
const closeInfo     = document.getElementById('closeInfo');
const infoBtnTop    = document.getElementById('infoBtnTop');
const langToggleTop = document.getElementById('langToggleTop');

let lockedScrollY = 0;

function lockPageScroll() {
  lockedScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
}

function unlockPageScroll() {
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, lockedScrollY);
}

const openModal = () => {
  infoModal.classList.add('show');
  infoModal.setAttribute('aria-hidden', 'false');
  lockPageScroll();
};

const closeModal = () => {
  infoModal.classList.remove('show');
  infoModal.setAttribute('aria-hidden', 'true');
  unlockPageScroll();

  /* reset scroll + accordion on close */
  const card = infoModal.querySelector('.info-card');
  if (card) card.scrollTop = 0;
  document.querySelectorAll('.info-acc-body').forEach(b => b.classList.remove('acc-open'));
  document.querySelectorAll('.info-toc-item').forEach(b => b.classList.remove('acc-active'));
};

infoBtnTop.addEventListener('click', openModal);
closeInfo.addEventListener('click', closeModal);
infoModal.addEventListener('click', e => { if (e.target === infoModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* stop background scroll-chaining on touch devices */
infoModal.addEventListener('touchmove', e => {
  const card = e.target.closest('.info-card');
  if (!card) e.preventDefault();
}, { passive: false });

/* ── ACCORDION TOGGLE ── */
document.querySelectorAll('.info-toc-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const accItem = btn.closest('.info-acc-item');
    const body    = accItem.querySelector('.info-acc-body');
    const isOpen  = body.classList.contains('acc-open');

    /* close all panels */
    document.querySelectorAll('.info-acc-body').forEach(b => b.classList.remove('acc-open'));
    document.querySelectorAll('.info-toc-item').forEach(b => b.classList.remove('acc-active'));

    /* open this one if it was closed */
    if (!isOpen) {
      body.classList.add('acc-open');
      btn.classList.add('acc-active');

      /* scroll the newly opened item into view inside the card */
      setTimeout(() => {
        const card = document.querySelector('.info-card');
        if (card) {
          const btnRect  = btn.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          const diff = btnRect.top - cardRect.top;
          if (diff > 0) card.scrollBy({ top: diff - 12, behavior: 'smooth' });
        }
      }, 60);
    }
  });
});

/* ── LANG TOGGLE ── */
let langState = 0;
langToggleTop.addEventListener('click', () => {
  langState ^= 1;
  langToggleTop.textContent = langState ? 'A / अ' : 'अ / A';
});

    /* ══════════════════════════════════════════
       DIVINE TAP ANIMATION
    ══════════════════════════════════════════ */
    function spawnRipple(btn) {
      btn.querySelectorAll('.ripple-ring').forEach(r => r.remove());
      const ring = document.createElement('div');
      ring.className = 'ripple-ring';
      btn.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    }

    function spawnSparks(btn) {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const COUNT = 12;

      for (let i = 0; i < COUNT; i++) {
        const el  = document.createElement('div');
        el.className = 'spark';

        const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - .5) * .9;
        const dist  = 24 + Math.random() * 34;
        const dx    = Math.cos(angle) * dist;
        const dy    = Math.sin(angle) * dist;
        const size  = 2 + Math.random() * 3.5;
        const hue   = 255 + Math.random() * 50;
        const dur   = (.45 + Math.random() * .35) + 's';

        el.style.cssText = [
          `left:${cx - size/2}px`,
          `top:${cy - size/2}px`,
          `width:${size}px`,
          `height:${size}px`,
          `background:hsl(${hue},88%,80%)`,
          `box-shadow:0 0 ${size*2.2}px hsl(${hue},90%,72%)`,
          `--dx:${dx}px`,
          `--dy:${dy}px`,
          `--dur:${dur}`,
          `animation-delay:${(Math.random()*.09).toFixed(3)}s`
        ].join(';');

        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }
    }

    document.querySelectorAll('.circle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        /* burst */
        btn.classList.remove('burst');
        requestAnimationFrame(() => {
          btn.classList.add('burst');
          btn.addEventListener('animationend', () => btn.classList.remove('burst'), { once: true });
        });
        /* ripple + sparks */
        spawnRipple(btn);
        spawnSparks(btn);
      });
    });

    /* ══════════════════════════════════════════
       LONG-PRESS TOOLTIPS (mobile touch)
       Desktop hover is handled in CSS via .btn-wrap:hover
    ══════════════════════════════════════════ */
    function setupLongPress(wrap) {
      let pressTimer  = null;
      let hideTimer   = null;

      const show = () => {
        clearTimeout(hideTimer);
        wrap.classList.add('tooltip-show');
      };
      const hide = (ms = 1100) => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => wrap.classList.remove('tooltip-show'), ms);
      };

      wrap.addEventListener('touchstart', () => {
        clearTimeout(pressTimer);
        pressTimer = setTimeout(() => { show(); hide(); }, 480);
      }, { passive: true });

      wrap.addEventListener('touchend',  () => clearTimeout(pressTimer), { passive: true });
      wrap.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
    }

    setupLongPress(document.getElementById('langWrap'));
    setupLongPress(document.getElementById('infoWrap'));
    setupLongPress(document.getElementById('phase1LangWrap'));
    setupLongPress(document.getElementById('phase1InfoWrap'));


/* ══════════════════════════════════════
   EPISODE DATA
   Add more episodes here — just add to this array.
══════════════════════════════════════ */
const EPISODES = [
  {
    number: '01',
    title: 'Devotion or Power',
    videoId: '6bH_yr7CjRA',
    hindi: 'assets/downloads/epsdkdmsubtitles/hindi/dkdm-ep-1-hindi.srt',
    both: 'assets/downloads/epsdkdmsubtitles/bilingual/dkdm-ep-1-bilingual.srt',
    english: 'assets/downloads/epsdkdmsubtitles/english/dkdm-ep-1-english.srt',
  },
  {
    number: '02',
    title: 'Prajapati Daksh\'s arrogance',
    videoId: 'y6kOvbI-Cl8',
    hindi: 'assets/downloads/epsdkdmsubtitles/hindi/dkdm-ep-2-hindi.srt',
    both: 'assets/downloads/epsdkdmsubtitles/bilingual/dkdm-ep-2-bilingual.srt',
    english: 'assets/downloads/epsdkdmsubtitles/english/dkdm-ep-2-english.srt',
  },
  {
    number: '03',
    title: 'The Pain of a Mother',
    videoId: 'Tv_hQ6UKJ8I',
    hindi: '#',
    both: '#',
    english: '#',
  },
  {
    number: '04',
    title: 'Sati in search of flowers',
    videoId: 'g8Jg54jB2EY',
    hindi: '#',
    both: '#',
    english: '#',
  },
  {
    number: '05',
    title: 'A boon or a curse ?',
    videoId: 'XdN4HzoHSxc',
    hindi: '#',
    both: '#',
    english: '#',
  },
  {
    number: '06',
    title: 'Daksh\'s plan',
    videoId: '',
    hindi: '#',
    both: '#',
    english: '#',
    comingSoon: true,
  },
];


function getYouTubeThumbnail(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function loadEpisodeVideo(videoWrap, ep) {
  if (!videoWrap || videoWrap.classList.contains('loaded')) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${ep.videoId}?autoplay=1&playsinline=1&rel=0`;
  iframe.loading = 'eager';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.title = `Devon Ke Dev Mahadev – Episode ${ep.number}`;

  videoWrap.classList.add('loaded');
  videoWrap.innerHTML = '';
  videoWrap.appendChild(iframe);
}

function attachVideoThumbnailInteraction(cardEl, ep) {
  const thumbBtn = cardEl.querySelector('.video-thumb');
  const videoWrap = cardEl.querySelector('.video-wrap');
  if (!thumbBtn || !videoWrap) return;

  thumbBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    loadEpisodeVideo(videoWrap, ep);
  });
}

/* ══════════════════════════════════════
   BUILD ONE CARD — returns DOM element
══════════════════════════════════════ */
function buildCard(ep, idx) {
  const wrap = document.createElement('div');
  wrap.className = 'card-wrap' + (ep.comingSoon ? ' card-coming-soon' : '');
  wrap.dataset.title = ep.title.toLowerCase();
  wrap.dataset.number = ep.number;

  if (ep.comingSoon) {
    wrap.innerHTML = `
      <article class="episode-card">
        <div class="card-header">
          <p class="ep-number">Episode · ${ep.number}</p>
          <h2 class="ep-title">${ep.title}</h2>
        </div>
        <div class="card-divider" aria-hidden="true"></div>
        <div class="coming-soon-body">
          <div class="cs-om">ॐ</div>
          <p class="cs-label">Subtitles Coming Soon</p>
          <p class="cs-sub">Being crafted with devotion</p>
        </div>
        <div class="card-foot" aria-hidden="true">
          <div class="cf-line"></div>
          <div class="cf-tilak">
            <div class="cf-s"></div>
            <div class="cf-dot"></div>
            <div class="cf-s sm"></div>
          </div>
          <div class="cf-line r"></div>
        </div>
      </article>
    `;
    attachCardInteraction(wrap);
    return wrap;
  }

  wrap.innerHTML = `
    <article class="episode-card">
      <div class="card-header">
        <p class="ep-number">Episode · ${ep.number}</p>
        <h2 class="ep-title">${ep.title}</h2>
      </div>
      <div class="card-divider" aria-hidden="true"></div>
      <div class="video-wrap">
        <button class="video-thumb" type="button" aria-label="Play episode ${ep.number}: ${ep.title}">
          <img
            class="video-thumb-img"
            src="${getYouTubeThumbnail(ep.videoId)}"
            alt="Episode ${ep.number} thumbnail"
            loading="lazy"
            decoding="async"
          />
          <span class="video-thumb-overlay" aria-hidden="true">
            <span class="video-thumb-play">▶</span>
          </span>
        </button>
      </div>
      <div class="sub-info">
        <p class="sub-langs">
          Hindi <span class="dot">·</span> Hindi &amp; English <span class="dot">·</span> English
        </p>
      </div>
      <div class="btn-row" role="group" aria-label="Subtitle options">
        <a class="btn btn-hindi"   href="${ep.hindi}"   download data-lang="Hindi">Hindi</a>
        <a class="btn btn-both"    href="${ep.both}"    download data-lang="Hindi & English">Hindi &amp; English</a>
        <a class="btn btn-english" href="${ep.english}" download data-lang="English">English</a>
      </div>
      <div class="card-foot" aria-hidden="true">
        <div class="cf-line"></div>
        <div class="cf-tilak">
          <div class="cf-s"></div>
          <div class="cf-dot"></div>
          <div class="cf-s sm"></div>
        </div>
        <div class="cf-line r"></div>
      </div>
    </article>
  `;

  attachCardInteraction(wrap);
  attachBtnInteraction(wrap);
  attachVideoThumbnailInteraction(wrap, ep);
  return wrap;
}

/* ══════════════════════════════════════
   CARD SPRING INTERACTION (per card)
══════════════════════════════════════ */
function attachCardInteraction(card) {
  let moved = false, startX = 0, startY = 0, pressTimer = null;

  card.addEventListener('pointerdown', e => {
    if (e.target.closest('.btn')) return;
    moved = false; startX = e.clientX; startY = e.clientY;
    card.classList.add('is-pressed');
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => activate(card), 120);
  }, { passive: true });

  card.addEventListener('pointermove', e => {
    if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) moved = true;
  }, { passive: true });

  card.addEventListener('pointerup', e => {
    if (e.target.closest('.btn')) return;
    clearTimeout(pressTimer);
    card.classList.remove('is-pressed');
    if (!moved) activate(card);
  });

  card.addEventListener('pointercancel', () => {
    clearTimeout(pressTimer);
    card.classList.remove('is-pressed', 'is-lifting');
  });
}

function activate(card) {
  card.classList.remove('is-active', 'is-lifting');
  requestAnimationFrame(() => card.classList.add('is-active'));
}

/* Deactivate card when tapping outside */
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.card-wrap')) {
    document.querySelectorAll('.card-wrap.is-active').forEach(c => c.classList.remove('is-active'));
  }
}, { capture: true, passive: true });

/* ══════════════════════════════════════
   BUTTON SPRING INTERACTION
══════════════════════════════════════ */
function attachBtnInteraction(cardEl) {
  cardEl.querySelectorAll('.btn').forEach(btn => {
    /* Prevent href="#" placeholder from scrolling page to top */
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') e.preventDefault();
    });

    btn.addEventListener('pointerdown', () => {
      btn.classList.remove('spring-back');
      requestAnimationFrame(() => btn.classList.add('tapped'));
    }, { passive: true });

    const release = () => {
      btn.classList.remove('tapped');
      btn.classList.add('spring-back');
      setTimeout(() => btn.classList.remove('spring-back'), 450);
      /* Toast */
      const lang = btn.dataset.lang || btn.textContent.trim();
      showToast(lang);
    };
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', () => btn.classList.remove('tapped', 'spring-back'));
  });
}

/* ══════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
══════════════════════════════════════ */
let toastTimer = null;

function showToast(lang) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  /* Remove existing */
  const existing = container.querySelector('.toast');
  if (existing) existing.classList.remove('toast-show');

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✦</span>
    <span class="toast-msg"><strong>${lang}</strong> subtitle downloading…</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast-show')));

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 380);
  }, 2200);
}

/* ══════════════════════════════════════
   SCROLL REVEAL — smooth fade+rise on scroll
══════════════════════════════════════ */
function initScrollReveal() {
  const cards = document.querySelectorAll('.card-wrap:not(.card-visible)');

  /* Fallback: no IntersectionObserver support */
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('card-visible'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const card    = entry.target;
      const allCards = [...document.querySelectorAll('.card-wrap')];
      const idx     = allCards.indexOf(card);

      /* Stagger: each card 80ms after previous — feels organic, not mechanical */
      const delay = (idx % 2) * 80;   /* left col 0ms, right col 80ms */

      setTimeout(() => card.classList.add('card-visible'), delay);
      observer.unobserve(card);
    });
  }, {
    threshold:   0.06,               /* fire early — card just peeking in */
    rootMargin: '0px 0px -24px 0px', /* slight bottom offset for natural feel */
  });

  cards.forEach(c => io.observe(c));
}

/* ══════════════════════════════════════
   RENDER ALL CARDS
══════════════════════════════════════ */
const grid = document.getElementById('cardsGrid');

function renderCards(list) {
  grid.innerHTML = '';

  /* Update episode count badge */
  const countEl = document.getElementById('epCount');
  if (countEl) countEl.textContent = list.length > 0 ? `(${list.length})` : '';

  /* Empty search state */
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-om">ॐ</div>
        <p class="empty-title">No episodes found</p>
        <p class="empty-sub">Try a different name or episode number</p>
      </div>
    `;
    return;
  }

  list.forEach((ep, i) => {
    grid.appendChild(buildCard(ep, i));
  });
  initScrollReveal();
}

renderCards(EPISODES);

/* ══════════════════════════════════════
   SEARCH / FILTER
══════════════════════════════════════ */
const searchInput = document.getElementById('searchInput');

function filterCards() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderCards(EPISODES); return; }
  const filtered = EPISODES.filter(ep =>
    ep.title.toLowerCase().includes(q) ||
    ep.number.includes(q)
  );
  renderCards(filtered);
}

let searchTimer;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(filterCards, 160);
});
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(searchTimer); filterCards(); } });

(function () {
  const phase1Lang = document.getElementById('phase1LangToggle');
  const phase1Info = document.getElementById('phase1InfoBtn');
  const topLang = document.getElementById('langToggleTop');
  const topInfo = document.getElementById('infoBtnTop');
  const toolbar = document.querySelector('.floating-toolbar');
  const phase1Controls = document.getElementById('phase1Controls');
  const phase2Start = document.getElementById('phase2Start');

  if (phase1Lang && topLang) {
    phase1Lang.addEventListener('click', () => {
      topLang.click();
      phase1Lang.textContent = topLang.textContent;
    });
  }

  if (phase1Info && topInfo) {
    phase1Info.addEventListener('click', () => {
      topInfo.click();
    });
  }

  const setToolbarVisible = (visible) => {
    if (!toolbar || !phase1Controls) return;
    toolbar.classList.toggle('show-toolbar', visible);
    phase1Controls.classList.toggle('hidden', visible);
  };

  setToolbarVisible(false);

  if (window.IntersectionObserver && phase2Start) {
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setToolbarVisible(entry.isIntersecting);
    }, { threshold: 0.08 });
    io.observe(phase2Start);
  } else {
    const onScroll = () => {
      const rect = phase2Start.getBoundingClientRect();
      setToolbarVisible(rect.top <= window.innerHeight * 0.92);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

/* ══════════════════════════════════════
   SECTION SCROLL SNAP — Phase 1 ↔ Phase 2
══════════════════════════════════════ */
(function () {
  const phase1 = document.getElementById('phase1Screen');
  const phase2 = document.getElementById('phase2Start');
  if (!phase1 || !phase2) return;

  let snapping      = false;
  let inPhase1Touch = false;
  let touchStartY   = 0;

  function snapTo(target) {
    if (snapping) return;
    snapping = true;
    const dest = target === 'phase2' ? phase2.offsetTop : 0;
    window.scrollTo({ top: dest, behavior: 'smooth' });
    setTimeout(() => { snapping = false; }, 800);
  }

  /* ── TOUCH (mobile) ── */
  window.addEventListener('touchstart', (e) => {
    touchStartY   = e.touches[0].clientY;
    inPhase1Touch = window.scrollY < phase1.offsetHeight;
  }, { passive: true });

  /* Non-passive: phase1 mein natural scroll rok do —
     taaki momentum se aage na jaaye                  */
  window.addEventListener('touchmove', (e) => {
    /* Don't intercept touch when info modal is open — infoModal handler takes care of it */
    if (infoModal.classList.contains('show')) return;
    if (inPhase1Touch && !snapping && !e.target.closest('.info-card')) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (snapping) return;
    const dy      = touchStartY - e.changedTouches[0].clientY;
    const scrollY = window.scrollY;
    const p1H     = phase1.offsetHeight;

    if (scrollY < p1H && dy > 30) {
      snapTo('phase2');
    } else if (scrollY > 0 && scrollY < p1H + 40 && dy < -30) {
      snapTo('phase1');
    }
  }, { passive: true });

  /* ── WHEEL (desktop) ── */
  window.addEventListener('wheel', (e) => {
    /* Don't intercept wheel when info modal is open — let .info-card scroll */
    if (infoModal.classList.contains('show')) return;
    if (snapping) { e.preventDefault(); return; }
    const scrollY = window.scrollY;
    const p1H     = phase1.offsetHeight;

    if (scrollY < p1H && e.deltaY > 0) {
      e.preventDefault();
      snapTo('phase2');
    } else if (scrollY > 0 && scrollY <= p1H && e.deltaY < 0) {
      e.preventDefault();
      snapTo('phase1');
    }
  }, { passive: false });

})();