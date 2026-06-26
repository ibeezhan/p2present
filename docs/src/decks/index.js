// decks/index.js — deck adapter registry + interface contract.
//
// A DeckAdapter exposes a slide deck (HTML, PDF, …) behind a uniform surface
// the sync engine drives. Implement (see BaseDeckAdapter in base.js):
//
//   async load()                     mount; resolve when navigable
//   get slideCount() -> number
//   get currentSlide() -> number     1-BASED (matches manifest.sync[].slide)
//   async goTo(slide, opts)          go to a 1-based slide; opts:{transition,direction}
//   destroy()
//
// And EMIT 'slidechange' (with the new 1-based slide number) whenever the user
// navigates inside the deck itself (keyboard in the iframe, thumbnail click…),
// so the sync engine can seek the video to match.
//
// Add an adapter:  deckAdapters.register('mdx', MyMdxAdapter)

import { Registry } from '../registry.js';
import { BaseDeckAdapter } from './base.js';
import { HtmlDeckAdapter } from './html-deck.js';
import { PdfDeckAdapter } from './pdf-deck.js';
import { EmbedDeckAdapter } from './embed-deck.js';

export { BaseDeckAdapter };

export const deckAdapters = new Registry('deck adapter');
deckAdapters.register('html', HtmlDeckAdapter);
deckAdapters.register('pdf', PdfDeckAdapter);
deckAdapters.register('embed', EmbedDeckAdapter);
