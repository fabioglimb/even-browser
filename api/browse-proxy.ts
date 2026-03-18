import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  const target = (req.query.url as string)?.trim() ?? ''
  if (!target || (!target.startsWith('http://') && !target.startsWith('https://'))) {
    return res.status(400).send('Missing or invalid "url" query parameter')
  }

  try {
    const upstream = await fetch(target, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EvenBrowser/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    })
    const body = await upstream.text()
    const contentType = upstream.headers.get('content-type') ?? 'text/html; charset=utf-8'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(upstream.status).send(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return res.status(502).send(`Proxy request failed: ${message}`)
  }
}
