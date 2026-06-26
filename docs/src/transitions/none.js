// none — explicit no-op. Like cut but never touches display either, leaving
// visibility entirely to the adapter (useful when slides are stacked/opacity-0).
export const none = {
  name: 'none',
  async run() {},
};
