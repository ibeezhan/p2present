// transitions/index.js — slide transition registry.
//
// A transition is an object: { name, run({ incoming, outgoing, container, duration }) }
//   - incoming: the DOM element becoming visible (may be null)
//   - outgoing: the DOM element leaving (may be null)
//   - container: the wrapper holding both
//   - duration: ms hint
// run() returns a Promise that resolves when the animation finishes.
//
// Transitions are used by adapters that render slides as DOM the player owns
// (e.g. the PDF deck). HTML decks animate internally via their own engine, so
// the chosen transition is passed through as a hint but may be a no-op there.
//
// Add a transition:  transitions.register('myfx', { name:'myfx', run(){...} })

import { Registry } from '../registry.js';
import { cut } from './cut.js';
import { fade } from './fade.js';
import { slide } from './slide.js';
import { none } from './none.js';

export const transitions = new Registry('transition');
transitions.register('cut', cut);
transitions.register('fade', fade);
transitions.register('slide', slide);
transitions.register('none', none);

/** Resolve a transition by name, falling back to "cut". */
export function getTransition(name) {
  return transitions.has(name) ? transitions.get(name) : transitions.get('cut');
}

// Helper shared by DOM transitions: animate via the Web Animations API and
// resolve when done (respecting prefers-reduced-motion).
export function animate(el, keyframes, duration) {
  if (!el) return Promise.resolve();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return Promise.resolve();
  return el.animate(keyframes, { duration, easing: 'ease', fill: 'both' }).finished
    .catch(() => {}); // ignore cancelled animations
}
