(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    nav?.classList.remove('is-open');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  const tabs = [...document.querySelectorAll('.explorer-tab')];
  const activateTab = button => {
    tabs.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(`panel-${tab.dataset.panel}`);
      if (panel) { panel.hidden = !selected; panel.classList.toggle('is-active', selected); }
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else next = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      activateTab(tabs[next]); tabs[next].focus();
    });
  });

  const box = document.querySelector('.demo-box');
  const version = document.getElementById('demo-version');
  const result = document.getElementById('demo-result');
  const label = document.querySelector('.render-label');
  const promote = document.getElementById('demo-promote');
  const fail = document.getElementById('demo-fail');
  const reset = document.getElementById('demo-reset');
  let promoted = false;
  let pendingTimer = null;
  const clearPending = () => {
    if (pendingTimer !== null) clearTimeout(pendingTimer);
    pendingTimer = null;
  };
  const setDemo = (mode) => {
    if (!box || !version || !result || !label || !promote || !fail) return;
    promoted = mode === 'success';
    const validating = mode === 'validating';
    box.classList.toggle('is-upgraded', promoted);
    box.classList.toggle('has-failed', mode === 'failure');
    box.setAttribute('aria-busy', String(validating));
    version.textContent = promoted ? 'Display v2.0' : 'Display v1.0';
    result.textContent = validating ? 'Validating v2 — v1 still serving' : mode === 'failure' ? 'Candidate rejected — v1 continues' : promoted ? 'Validated — seamless handover' : 'Stable / serving';
    label.textContent = promoted ? 'RENDERER V2 / 3D SHADED' : 'RENDERER V1 / 2D PROJECTION';
    promote.disabled = promoted || validating;
    fail.disabled = promoted || validating;
    promote.innerHTML = promoted ? 'v2 active <span aria-hidden="true">✓</span>' : validating ? 'Validating candidate…' : 'Validate & activate v2 <span aria-hidden="true">↗</span>';
  };
  const simulate = outcome => {
    if (promoted || pendingTimer !== null) return;
    setDemo('validating');
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      setDemo(outcome);
    }, 1100);
  };
  promote?.addEventListener('click', () => simulate('success'));
  fail?.addEventListener('click', () => simulate('failure'));
  reset?.addEventListener('click', () => { clearPending(); setDemo('reset'); });
  const copyright = document.getElementById('copyright-year');
  if (copyright) copyright.textContent = String(new Date().getFullYear());
})();
