import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm has no type definitions
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

turndownService.use(gfm);

// Custom rule for images to preserve them nicely if needed, or rely on default
// Feishu often wraps things in div/p. Turndown handles this well.

export const htmlToMarkdown = (html: string): string => {
  return turndownService.turndown(html);
};
