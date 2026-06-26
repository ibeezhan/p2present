// cut — instant swap, no animation.
export const cut = {
  name: 'cut',
  async run({ incoming, outgoing }) {
    if (outgoing) outgoing.style.display = 'none';
    if (incoming) incoming.style.display = '';
  },
};
