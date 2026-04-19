/* ==========================================================================
   Nithish Marneni — Portfolio JS
   ==========================================================================*/

(() => {
    'use strict';

    // ---- Year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // ---- Nav: scrolled state + mobile toggle
    const nav = document.getElementById('nav');
    const burger = document.getElementById('navBurger');

    const onScroll = () => {
        if (!nav) return;
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
        const toTop = document.getElementById('toTop');
        if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            burger.setAttribute('aria-expanded', String(isOpen));
        });
        nav.querySelectorAll('.nav__menu a').forEach(a => {
            a.addEventListener('click', () => {
                nav.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Back to top
    const toTop = document.getElementById('toTop');
    if (toTop) {
        toTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Console: animated fraud-scoring log
    const log = document.getElementById('log');
    const tpsEl = document.getElementById('tps');

    if (log) {
        const MAX_LINES = 9;
        const lines = [];

        const pad2 = n => String(n).padStart(2, '0');
        const now = () => {
            const d = new Date();
            return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
        };
        const hex = (n) => Math.floor(Math.random() * 16 ** n)
            .toString(16).padStart(n, '0');
        const txnId = () => `txn_${hex(4)}_${hex(4)}`;

        // Score distribution: mostly low risk, occasional medium, rare high.
        const nextScore = () => {
            const r = Math.random();
            if (r < 0.82) return 0.01 + Math.random() * 0.22;   // allow
            if (r < 0.96) return 0.28 + Math.random() * 0.35;   // review
            return 0.78 + Math.random() * 0.21;                 // block
        };
        const verdict = (s) => {
            if (s >= 0.75) return ['BLOCK', 'block'];
            if (s >= 0.30) return ['REVIEW', 'score'];
            return ['ALLOW', 'allow'];
        };

        const addLine = () => {
            const s = nextScore();
            const [v, cls] = verdict(s);
            const line = `<span class="ts">[${now()}]</span> <span class="id">${txnId()}</span>  score=<span class="score">${s.toFixed(2)}</span>  <span class="${cls}">${v}</span>`;
            lines.push(line);
            if (lines.length > MAX_LINES) lines.shift();
            const caret = '<span class="caret"></span>';
            log.innerHTML = lines.join('\n') + caret;
        };

        // Prime with a few lines, then tick
        for (let i = 0; i < MAX_LINES; i++) addLine();

        const scheduleNext = () => {
            const delay = 650 + Math.random() * 900;
            setTimeout(() => { addLine(); scheduleNext(); }, delay);
        };
        scheduleNext();

        // Subtle TPS flicker
        if (tpsEl) {
            setInterval(() => {
                const base = 40000;
                const jitter = Math.floor((Math.random() - 0.5) * 1800);
                tpsEl.textContent = (base + jitter).toLocaleString() + ' TPS';
            }, 1500);
        }
    }

    // ---- Reveal on scroll
    const revealTargets = document.querySelectorAll(
        '.section__head, .role, .project, .stack__col, .creds__block, .contact__card, .impact__cell'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(el => io.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('is-in'));
    }

    // ---- Smooth anchor scroll with nav offset
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

})();
