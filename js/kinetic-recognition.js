// One native horizontal scroller; no autoplay, cloned items, or external assets.
(() => {
 const strip = document.querySelector('.logo-strip');
 if (!strip) return;
 const controls = document.querySelector('.logo-controls');
 const previous = controls.querySelector('[data-logo-direction="-1"]');
 const next = controls.querySelector('[data-logo-direction="1"]');
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const update = () => {
  const end = Math.max(0, strip.scrollWidth - strip.clientWidth);
  previous.disabled = strip.scrollLeft <= 2;
  next.disabled = strip.scrollLeft >= end - 2;
 };
 controls.hidden = false;
 controls.addEventListener('click', event => {
  const button = event.target.closest('[data-logo-direction]');
  if (!button || button.disabled) return;
  const step = strip.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(strip).columnGap);
  strip.scrollBy({left:step * Number(button.dataset.logoDirection), behavior:reduced.matches ? 'instant' : 'smooth'});
 });
 strip.addEventListener('scroll', update, {passive:true});
 window.addEventListener('resize', update);
 if (window.ResizeObserver) new ResizeObserver(update).observe(strip);
 update();
})();
