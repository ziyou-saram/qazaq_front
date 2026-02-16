import DOMPurify from "isomorphic-dompurify";

/**
 * Renders markdown content to sanitized HTML.
 * Supports: headings (h1-h6), bold, italic, links, unordered lists, paragraphs.
 */
export function renderMarkdown(markdown: string): string {
    const escapeHtml = (input: string) =>
        input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const formatInline = (input: string) => {
        const escaped = escapeHtml(input);
        return escaped
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    };

    const lines = markdown.split(/\r?\n/);
    let html = "";
    let paragraph: string[] = [];
    let inList = false;

    const flushParagraph = () => {
        if (!paragraph.length) return;
        html += `<p>${formatInline(paragraph.join(" "))}</p>`;
        paragraph = [];
    };

    const closeList = () => {
        if (!inList) return;
        html += "</ul>";
        inList = false;
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            flushParagraph();
            closeList();
            continue;
        }

        const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
        if (headingMatch) {
            flushParagraph();
            closeList();
            const level = headingMatch[1].length;
            html += `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
            continue;
        }

        const listMatch = /^[-*]\s+(.*)$/.exec(trimmed);
        if (listMatch) {
            flushParagraph();
            if (!inList) {
                html += "<ul>";
                inList = true;
            }
            html += `<li>${formatInline(listMatch[1])}</li>`;
            continue;
        }

        paragraph.push(trimmed);
    }

    flushParagraph();
    closeList();
    return html;
}

/**
 * Renders content to sanitized HTML.
 * Detects whether content is HTML or Markdown and processes accordingly.
 */
export function renderContent(content: string): string {
    if (!content) return "";

    // Heuristic: check if content looks like HTML
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(content) || content.includes("<p>");

    if (isHtml) {
        return DOMPurify.sanitize(content, { ADD_ATTR: ['style', 'class'] });
    }

    return renderMarkdown(content);
}
