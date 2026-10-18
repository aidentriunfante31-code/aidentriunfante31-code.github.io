/* ATRIndustries: deck behaviour */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  $('#year').textContent = new Date().getFullYear();

  /* The deck remembers the last chip you opened and folds a tab on it */
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const work = $('.chip-work');
  if (store.get('atr-last-chip') === '001') work.classList.add('seen');
  $$('a.chip[data-chip]').forEach(a => a.addEventListener('click', () => store.set('atr-last-chip', a.dataset.chip)));

  /* Pins and notes light together, so each note points at its place on the screenshot */
  const pins = $$('.pin');
  const notes = $$('.notes li');
  const light = (n, on) => {
    pins.forEach(p => p.classList.toggle('on', on && p.dataset.n === n));
    notes.forEach(l => l.classList.toggle('on', on && l.dataset.n === n));
  };
  notes.forEach(li => {
    li.addEventListener('pointerenter', () => light(li.dataset.n, true));
    li.addEventListener('pointerleave', () => light(li.dataset.n, false));
  });
  pins.forEach(p => {
    p.addEventListener('pointerenter', () => light(p.dataset.n, true));
    p.addEventListener('pointerleave', () => light(p.dataset.n, false));
  });

  /* Pins drop onto the screenshot in order when it scrolls into view.
     Visible by default; only held back when the figure starts below the fold. */
  const annotated = $('.annotated');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches
      && annotated.getBoundingClientRect().top > innerHeight) {
    pins.forEach((p, i) => p.style.setProperty('--pd', 150 + i * 140 + 'ms'));
    annotated.classList.add('pre');
    let alive = false;
    const io = new IntersectionObserver(entries => {
      alive = true;
      if (entries.some(e => e.isIntersecting)) { annotated.classList.remove('pre'); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(annotated);
    setTimeout(() => { if (!alive) annotated.classList.remove('pre'); }, 2500);
  }
})();
