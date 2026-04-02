import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', '*')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  const target = (req.query.url as string)?.trim() ?? ''
  if (!target || (!target.startsWith('http://') && !target.startsWith('https://'))) {
    return res.status(400).send('Missing or invalid "url" query parameter')
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (compatible; EvenBrowser/1.0)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }

    // Forward auth header from client
    const auth = req.headers['authorization']
    if (auth) headers['Authorization'] = Array.isArray(auth) ? auth[0] : auth

    // Forward cookies from client
    const forwardCookies = req.headers['x-forward-cookies']
    if (forwardCookies) headers['Cookie'] = Array.isArray(forwardCookies) ? forwardCookies[0] : forwardCookies

    const upstream = await fetch(target, {
      method: 'GET',
      headers,
      redirect: 'follow',
    })
    const body = await upstream.text()
    const contentType = upstream.headers.get('content-type') ?? 'text/html; charset=utf-8'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Expose-Headers', 'X-Set-Cookies, X-Upstream-Status')
    res.setHeader('X-Upstream-Status', String(upstream.status))

    // Capture Set-Cookie headers from upstream
    const setCookies = upstream.headers.getSetCookie?.() ?? []
    if (setCookies.length > 0) {
      res.setHeader('X-Set-Cookies', JSON.stringify(setCookies))
    }

    return res.status(upstream.status).send(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(502).send(`Proxy request failed: ${message}`)
  }
}
