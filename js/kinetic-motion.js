// GSAP entrance + independent ScrollTrigger reveals.
(() => {
 if (!window.gsap) return;
 const hasScroll = !!window.ScrollTrigger;
 if (hasScroll) gsap.registerPlugin(ScrollTrigger);
 const mm = gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)', () => {
  const introTargets = '.nav,.eyebrow,.intro-lead,.intro-name,.roles,.actions';
  const intro = gsap.timeline({
   defaults: {ease: 'power3.out'},
   onComplete: () => gsap.set(introTargets, {clearProps: 'transform,opacity,visibility,clipPath'})
  });
  intro.timeScale(.8);
  window.kineticIntro = intro;
  intro.from('.nav', {y:-12, opacity:0, duration:.45}, 0)
   .from('.eyebrow', {y:12, opacity:0, duration:.45}, .08)
   .from('.intro-lead', {y:38, opacity:0, duration:.65}, .14)
   .from('.intro-name', {clipPath:'inset(0 100% 0 0)', x:-20, duration:.85, ease:'power4.out'}, .28)
   .from('.roles', {y:16, opacity:0, duration:.5}, .52)
   .from('.actions', {y:18, opacity:0, duration:.55}, .6);

  const reveals = [];
  if (hasScroll) {
   // Animate content itself, with progress tied to scrolling rather than a timed reveal.
   // Static card borders preserve the grid while their heading/body enter independently.
   const selector = '.stat,.section h2,.heading > p,.recognition-top,.logo-sample > *,.service .symbol,.service h3,.service p,.about-copy > div > p,.portrait,.person h3,.person > p,.profilelinks,.blog img,.blog .category,.blog h3,.blog p:not(.category),.contact-copy > h3,.contact-copy > p,.contact-copy address,.form > label,.form > .button,.feedback,footer > p,footer .socials';
   const restingTop = element => element.getBoundingClientRect().top + window.scrollY - (parseFloat(gsap.getProperty(element, 'y')) || 0);
   gsap.utils.toArray(selector).forEach((element) => {
    const image = element.matches('img');
    const heading = element.matches('h2,h3');
    const from = {y:heading ? 32 : 50, x:heading ? -24 : 0, opacity:0.08};
    const to = {y:0, x:0, opacity:1, ease:'none'};
    if(element.matches('.button')){delete from.x;delete from.y;delete to.x;delete to.y}
    if(image){from.clipPath='inset(0 0 18% 0)';to.clipPath='inset(0 0 0% 0)'}
    // Clamp thresholds so the last content can fully reveal at the bottom of the page.
    const tween = gsap.fromTo(element, from, {
     ...to,
     scrollTrigger: {
      trigger:element,
      start:() => restingTop(element) - innerHeight * .96,
      end:() => Math.min(ScrollTrigger.maxScroll(window), restingTop(element) - innerHeight * .52),
      scrub:.45, invalidateOnRefresh:true,
      onUpdate:self => {
       // Fast wheel gestures, scrollbar jumps and End should not leave content trailing.
       if (Math.abs(self.getVelocity()) > 3000 || self.scroll() >= ScrollTrigger.maxScroll(window) - 2) {
        self.getTween()?.progress(1);
        self.animation.progress(self.progress);
       }
      }
     }
    });
    // Use a gradual catch-up curve; ScrollTrigger's default accelerates too quickly.
    const catchUp = tween.scrollTrigger.getTween();
    if (catchUp) {catchUp.vars.ease = 'power1.inOut'; catchUp.invalidate()}
    reveals.push({element, tween});
   });
   // Decorative accents track scroll; text itself remains readable.
   gsap.utils.toArray('.section h2').forEach((heading) => {
    gsap.fromTo(heading, {'--line-progress':0}, {
     '--line-progress':1, ease:'none',
     scrollTrigger:{trigger:heading.closest('.section'), start:'top 88%', end:'top 35%', scrub:.3}
    });
   });
   gsap.fromTo('.scroll-progress', {scaleX:0}, {
    scaleX:1, ease:'none',
    scrollTrigger:{start:0, end:()=>ScrollTrigger.maxScroll(window), scrub:true, invalidateOnRefresh:true}
   });
  }
  // Opacity preserves keyboard access. Immediately reveal any focused content.
  const finishFocused = event => {
   if (intro.progress()<1) intro.progress(1);
   reveals.forEach(({element,tween}) => {
    if (element.contains(event.target)) {
     tween.scrollTrigger?.kill(false);
     tween.progress(1).pause();
     gsap.set(element, {clearProps:'transform,opacity,clipPath'});
    }
   });
  };
  document.addEventListener('focusin',finishFocused);
  return () => {
   document.removeEventListener('focusin',finishFocused);
   window.kineticIntro = null;
  };
 });
})();
