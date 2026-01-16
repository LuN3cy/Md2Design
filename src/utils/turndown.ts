import TurndownService from 'turndown';
// @ts-expect-error turndown-plugin-gfm has no type definitions
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  br: '  ', // Use two spaces for line breaks
});

turndownService.use(gfm);

// Rule to handle Feishu/Notion style line breaks and paragraphs
turndownService.addRule('paragraph', {
  filter: 'p',
  replacement: function (content) {
    // If content is empty or just whitespace/br, preserve it as a blank line in a way MD renders it
    // We use a non-breaking space to ensure it's not collapsed by MD parsers
    const isBlank = !content || content.trim() === '' || content === '<br>' || content === '&nbsp;';
    if (isBlank) {
      return '\n&nbsp;\n';
    }
    return '\n' + content + '\n';
  }
});

// Custom rule for images to preserve them nicely if needed, or rely on default
// Feishu often wraps things in div/p. Turndown handles this well.

export const htmlToMarkdown = (html: string): string => {
  return turndownService.turndown(html);
};
