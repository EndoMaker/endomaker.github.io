(() => {
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });

  // Scroll explicitly because mobile browsers can treat a fragment target near
  // the sticky header as already visible. Keep the link as a no-JS fallback.
  document.querySelectorAll('.footer a[href="#top"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const toggle = document.querySelector('.menu-button');
  const menu = document.querySelector('.mobile-menu');
  const desktop = matchMedia('(min-width: 681px)');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', event => {
      if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false);
    });
    desktop.addEventListener('change', () => { if (desktop.matches) setMenu(false); });
  }

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project-card[data-category]')];
  const count = document.querySelector('.project-count');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    projects.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) visible++;
    });
    if (count) count.textContent = visible + (visible === 1 ? ' project' : ' projects');
  }));

  // Only a surface's decorative edge moves. There are no background animation
  // loops, animated masks, or effects over text and interactive controls.
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(pointer: fine)');
  const resets = [];
  document.querySelectorAll('.dither-surface').forEach(surface => {
    let frame = 0;
    let shift = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      surface.style.removeProperty('--dither-shift');
    };
    surface.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
      const rect = surface.getBoundingClientRect();
      shift = ((event.clientX - rect.left) / rect.width - .5) * 12;
      if (!frame) frame = requestAnimationFrame(() => {
        surface.style.setProperty('--dither-shift', shift.toFixed(2) + 'px');
        frame = 0;
      });
    }, { passive: true });
    surface.addEventListener('pointerleave', reset);
    resets.push(reset);
  });
  motion.addEventListener('change', () => resets.forEach(reset => reset()));
  pointer.addEventListener('change', () => resets.forEach(reset => reset()));
  document.addEventListener('visibilitychange', () => { if (document.hidden) resets.forEach(reset => reset()); });
})();
