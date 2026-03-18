/**
 * HTML -> PageData parser for Even Browser.
 *
 * Pipeline:
 *   1. Fetch HTML via proxy
 *   2. DOMParser -> parse structure
 *   3. Walk DOM -> PageBlock[] + PageLink[]
 *   4. Resolve relative URLs
 *   5. Clean text for G2
 *   6. Word-wrap -> PageContentLine[]
 *   7. Map links to line indices
 */

import type { PageData, PageBlock, PageLink, PageContentLine } from '../types'
import { cleanForG2 } from './text-clean'
import { wordWrap } from 'even-toolkit/paginate-text'
import { resolveUrl } from './url-utils'

const DEFAULT_CHARS_PER_LINE = 46

/** Fetch and parse a URL into PageData */
export async function fetchAndParse(url: string, charsPerLine = DEFAULT_CHARS_PER_LINE): Promise<PageData> {
  const res = await fetch(`/__browse_proxy?url=${encodeURIComponent(url)}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  const html = await res.text()
  return parseHtml(html, url, charsPerLine)
}

/** Parse raw HTML string into PageData */
export function parseHtml(html: string, baseUrl: string, charsPerLine = DEFAULT_CHARS_PER_LINE): PageData {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const title = cleanForG2(doc.title || extractDomainSimple(baseUrl))

  const blocks: PageBlock[] = []
  const links: PageLink[] = []

  // Try <article>, <main>, then <body>
  const root = doc.querySelector('article') || doc.querySelector('main') || doc.body
  if (root) {
    walkNode(root, blocks, links, baseUrl)
  }

  // If we got very little content, try full body
  if (blocks.filter(b => b.type !== 'separator').length < 3) {
    blocks.length = 0
    links.length = 0
    walkNode(doc.body, blocks, links, baseUrl)
  }

  // Deduplicate consecutive separators
  const deduped = dedupeSeparators(blocks)

  // Word-wrap blocks into display lines and map links
  const { lines, linkLineMap } = buildDisplayLines(deduped, links, charsPerLine)

  // Update link line indices
  const mappedLinks = links.map((link, i) => ({
    ...link,
    lineIndex: linkLineMap.get(i) ?? 0,
  }))

  return { url: baseUrl, title, blocks: deduped, links: mappedLinks, lines }
}

// Elements to skip entirely
const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'svg', 'iframe',
  'form', 'button', 'input', 'select', 'textarea',
  'img', 'video', 'audio', 'canvas', 'map', 'picture',
])

// Elements that should be treated as inline (extract content with links)
const INLINE_TAGS = new Set([
  'strong', 'b', 'em', 'i', 'span', 'code', 'small', 'mark',
  'abbr', 'time', 'sup', 'sub', 'cite', 'q', 'dfn', 'data',
  'label', 'output', 'var', 'kbd', 'samp', 'u', 's', 'del', 'ins',
])

/** Walk a DOM node and extract blocks + links */
function walkNode(
  node: Node,
  blocks: PageBlock[],
  links: PageLink[],
  baseUrl: string,
): void {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element
    const tag = el.tagName.toLowerCase()

    // Skip non-content elements
    if (SKIP_TAGS.has(tag)) return

    // Skip hidden elements
    if (el.getAttribute('aria-hidden') === 'true' || el.getAttribute('hidden') !== null) return

    // Skip nav/footer/aside but still check for useful content
    if (['nav', 'footer', 'aside'].includes(tag)) return

    // Headings — extract with links
    if (/^h[1-6]$/.test(tag)) {
      const result = extractInlineContent(el, links, baseUrl)
      if (result.text) {
        blocks.push({ type: 'heading', text: result.text.toUpperCase() })
      }
      return
    }

    // Paragraphs
    if (tag === 'p') {
      const result = extractInlineContent(el, links, baseUrl)
      if (result.text) {
        blocks.push({ type: 'paragraph', text: result.text })
      }
      return
    }

    // List items
    if (tag === 'li') {
      const result = extractInlineContent(el, links, baseUrl)
      if (result.text) {
        blocks.push({ type: 'listItem', text: `* ${result.text}` })
      }
      return
    }

    // Anchor tags at block level (e.g. <a> wrapping a <div>)
    if (tag === 'a') {
      const href = el.getAttribute('href')
      const linkText = cleanForG2(el.textContent || '')
      if (href && linkText && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const absoluteHref = resolveUrl(href, baseUrl)
        links.push({ text: linkText, href: absoluteHref, lineIndex: 0 })
        blocks.push({ type: 'paragraph', text: `[${linkText}]` })
      } else if (linkText) {
        blocks.push({ type: 'paragraph', text: linkText })
      }
      return
    }

    // Horizontal rules
    if (tag === 'hr') {
      blocks.push({ type: 'separator', text: '' })
      return
    }

    // Block-level elements that create visual separation
    if (['div', 'section', 'article', 'header', 'blockquote', 'figure', 'table', 'dl', 'details', 'main'].includes(tag)) {
      if (blocks.length > 0 && blocks[blocks.length - 1].type !== 'separator') {
        blocks.push({ type: 'separator', text: '' })
      }
    }

    // Recurse into children
    for (const child of Array.from(node.childNodes)) {
      walkNode(child, blocks, links, baseUrl)
    }

    return
  }

  // Text nodes (direct text not inside p/li/h)
  if (node.nodeType === Node.TEXT_NODE) {
    const text = cleanForG2(node.textContent || '')
    if (text && text.length > 1) {
      blocks.push({ type: 'paragraph', text })
    }
  }
}

/** Extract inline text content from an element, recording any links */
function extractInlineContent(
  el: Element,
  links: PageLink[],
  baseUrl: string,
): { text: string } {
  let text = ''

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += cleanForG2(child.textContent || '')
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as Element
      const tag = childEl.tagName.toLowerCase()

      if (tag === 'a') {
        const href = childEl.getAttribute('href')
        const linkText = cleanForG2(childEl.textContent || '')
        if (href && linkText && !href.startsWith('#') && !href.startsWith('javascript:')) {
          const absoluteHref = resolveUrl(href, baseUrl)
          links.push({ text: linkText, href: absoluteHref, lineIndex: 0 })
          text += `[${linkText}]`
        } else if (linkText) {
          text += linkText
        }
      } else if (INLINE_TAGS.has(tag)) {
        const inner = extractInlineContent(childEl, links, baseUrl)
        text += inner.text
      } else if (tag === 'br') {
        text += ' '
      } else if (SKIP_TAGS.has(tag)) {
        // skip
      } else {
        // For nested block elements inside inline context, extract their content
        const inner = extractInlineContent(childEl, links, baseUrl)
        text += inner.text
      }
    }
  }

  return { text: text.trim() }
}

/** Remove consecutive separators */
function dedupeSeparators(blocks: PageBlock[]): PageBlock[] {
  return blocks.filter((block, i) => {
    if (block.type === 'separator' && i > 0 && blocks[i - 1].type === 'separator') return false
    if (block.type === 'separator' && i === 0) return false
    return true
  })
}

/** Word-wrap blocks into display lines and build link-to-line map */
function buildDisplayLines(
  blocks: PageBlock[],
  links: PageLink[],
  charsPerLine: number,
): { lines: PageContentLine[]; linkLineMap: Map<number, number> } {
  const lines: PageContentLine[] = []
  const linkLineMap = new Map<number, number>()

  // Build a set of link texts for matching
  const linkTexts = links.map(l => `[${l.text}]`)

  for (const block of blocks) {
    if (block.type === 'separator') {
      lines.push({ text: '---', style: 'meta' })
      continue
    }

    const style: PageContentLine['style'] = block.type === 'heading' ? 'heading' : 'normal'
    const wrapped = wordWrap(block.text, charsPerLine)

    for (const wline of wrapped) {
      const lineIdx = lines.length
      let foundLinkIndex: number | undefined

      // Check if this line contains a link marker [text]
      for (let li = 0; li < linkTexts.length; li++) {
        if (wline.includes(linkTexts[li])) {
          foundLinkIndex = li
          if (!linkLineMap.has(li)) {
            linkLineMap.set(li, lineIdx)
          }
          break
        }
      }

      lines.push({ text: wline, style, linkIndex: foundLinkIndex })
    }
  }

  return { lines, linkLineMap }
}

function extractDomainSimple(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return 'Page'
  }
}
