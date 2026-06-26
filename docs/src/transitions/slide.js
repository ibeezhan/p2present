// slide — horizontal push. Direction follows navigation (forward/back).
import { animate } from './index.js';

export const slide = {
  name: 'slide',
  async run({ incoming, outgoing, duration = 360, direction = 1 }) {
    const dx = direction >= 0 ? 1 : -1;
    if (incoming) incoming.style.display = '';
    await Promise.all([
      animate(outgoing, [
        { transform: 'translateX(0)' },
        { transform: `translateX(${-100 * dx}%)` },
      ], duration),
      animate(incoming, [
        { transform: `translateX(${100 * dx}%)` },
        { transform: 'translateX(0)' },
      ], duration),
    ]);
    if (outgoing) outgoing.style.display = 'none';
  },
};
