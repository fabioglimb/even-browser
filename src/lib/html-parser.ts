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
import { Readability } from '@mozilla/readability'
import { cleanForG2 } from './text-clean'
import { wordWrap } from 'even-toolkit/paginate-text'
import { resolveUrl } from './url-utils'

const DEFAULT_CHARS_PER_LINE = 46

export interface FetchOptions {
  authorization?: string
  cookies?: string
}

export interface FetchResult {
  pageData: PageData
  status: number
  setCookies: string[]
}

/** Fetch and parse a URL into PageData */
export async function fetchAndParse(
  url: string,
  charsPerLine = DEFAULT_CHARS_PER_LINE,
  options?: FetchOptions,
): Promise<FetchResult> {
  const proxyBase = `${import.meta.env.VITE_PROXY_URL}/browse`;

  const headers: Record<string, string> = {}
  if (import.meta.env.VITE_PROXY_KEY) headers['X-Proxy-Key'] = import.meta.env.VITE_PROXY_KEY

  const res = await fetch(`${proxyBase}?url=${encodeURIComponent(url)}`, { headers })

  const status = parseInt(res.headers.get('x-upstream-status') || String(res.status), 10)
  const setCookiesRaw = res.headers.get('x-set-cookies')
  const setCookies: string[] = setCookiesRaw ? JSON.parse(setCookiesRaw) : []

  if (status === 401 || status === 403) {
    throw Object.assign(new Error(`Authentication required (${status})`), { status })
  }

  if (!res.ok && status >= 400) {
    throw new Error(`HTTP ${status}: ${res.statusText}`)
  }

  const html = await res.text()
  const pageData = parseHtml(html, url, charsPerLine)
  return { pageData, status, setCookies }
}

/** Parse raw HTML string into PageData */
export function parseHtml(html: string, baseUrl: string, charsPerLine = DEFAULT_CHARS_PER_LINE): PageData {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const title = cleanForG2(doc.title || extractDomainSimple(baseUrl))

  const readablePage = parseReadableHtml(html, baseUrl, charsPerLine, title)
  if (readablePage && countMeaningfulLines(readablePage.lines) >= 3) {
    return readablePage
  }

  const structuredPage = parseStructuredDocument(doc, baseUrl, charsPerLine, title)
  if (countMeaningfulLines(structuredPage.lines) >= 3) {
    return structuredPage
  }

  return buildPlainTextPageData(doc.body?.textContent ?? '', baseUrl, charsPerLine, title)
}

function parseReadableHtml(
  html: string,
  baseUrl: string,
  charsPerLine: number,
  fallbackTitle: string,
): PageData | null {
  try {
    const readabilityDoc = new DOMParser().parseFromString(html, 'text/html')
    const article = new Readability(readabilityDoc).parse()
    if (!article) return null

    const title = cleanForG2(article.title || fallbackTitle)

    if (article.content?.trim()) {
      const articleDoc = new DOMParser().parseFromString(`<article>${article.content}</article>`, 'text/html')
      const blocks: PageBlock[] = []
      const links: PageLink[] = []
      const root = articleDoc.querySelector('article') || articleDoc.body
      if (root) walkNode(root, blocks, links, baseUrl)

      const pageData = buildPageData(baseUrl, title, blocks, links, charsPerLine)
      if (countMeaningfulLines(pageData.lines) >= 3) {
        return pageData
      }
    }

    if (article.textContent?.trim()) {
      return buildPlainTextPageData(article.textContent, baseUrl, charsPerLine, title)
    }
  } catch {
    // Fall back to the structured DOM walker below.
  }

  return null
}

function parseStructuredDocument(
  doc: Document,
  baseUrl: string,
  charsPerLine: number,
  title: string,
): PageData {
  const blocks: PageBlock[] = []
  const links: PageLink[] = []

  const root = doc.querySelector('article') || doc.querySelector('main') || doc.body
  if (root) {
    walkNode(root, blocks, links, baseUrl)
  }

  if (blocks.filter(block => block.type !== 'separator').length < 3 && doc.body) {
    blocks.length = 0
    links.length = 0
    walkNode(doc.body, blocks, links, baseUrl)
  }

  return buildPageData(baseUrl, title, blocks, links, charsPerLine)
}

function buildPlainTextPageData(
  rawText: string,
  baseUrl: string,
  charsPerLine: number,
  title: string,
): PageData {
  const text = rawText
    .replace(/\r/g, '')
    .split('\n')
    .map(line => cleanForG2(line))
    .map(line => line.trim())
    .filter(Boolean)

  const paragraphs: string[] = []
  let current = ''

  for (const line of text) {
    if (line.length < 2) continue
    if (!current) {
      current = line
      continue
    }

    if ((current.length + line.length + 1) <= 240) {
      current = `${current} ${line}`
    } else {
      paragraphs.push(current)
      current = line
    }
  }

  if (current) paragraphs.push(current)

  const blocks: PageBlock[] = paragraphs
    .slice(0, 80)
    .map((paragraph) => ({ type: 'paragraph' as const, text: paragraph }))

  return buildPageData(baseUrl, title, blocks, [], charsPerLine)
}

function buildPageData(
  baseUrl: string,
  title: string,
  blocks: PageBlock[],
  links: PageLink[],
  charsPerLine: number,
): PageData {
  const deduped = dedupeSeparators(blocks)
  const { lines, linkLineMap } = buildDisplayLines(deduped, links, charsPerLine)
  const mappedLinks = links.map((link, i) => ({
    ...link,
    lineIndex: linkLineMap.get(i) ?? 0,
  }))

  return { url: baseUrl, title, blocks: deduped, links: mappedLinks, lines }
}

function countMeaningfulLines(lines: PageContentLine[]): number {
  return lines.filter((line) => line.text.trim() && line.text !== '---').length
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
