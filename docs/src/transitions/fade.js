// fade — cross-fade between outgoing and incoming slides.
import { animate } from './index.js';

export const fade = {
  name: 'fade',
  async run({ incoming, outgoing, duration = 320 }) {
    if (incoming) incoming.style.display = '';
    await Promise.all([
      animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], duration),
      animate(incoming, [{ opacity: 0 }, { opacity: 1 }], duration),
    ]);
    if (outgoing) outgoing.style.display = 'none';
  },
};
