import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import type { Plugin } from 'vite'

const appRoot = resolve(__dirname)
const nm = (pkg: string) => resolve(appRoot, 'node_modules', pkg)

function browseProxy(): Plugin {
  function attachMiddleware(middlewares: { use: Function }) {
    middlewares.use('/__browse_proxy', async (req: any, res: any) => {
      if (req.method !== 'GET') {
        res.statusCode = 405
        res.setHeader('content-type', 'text/plain; charset=utf-8')
        res.end('Method Not Allowed')
        return
      }

      try {
        const parsed = new URL(req.url ?? '', 'http://localhost')
        const target = parsed.searchParams.get('url')?.trim() ?? ''
        if (!target || (!target.startsWith('http://') && !target.startsWith('https://'))) {
          res.statusCode = 400
          res.setHeader('content-type', 'text/plain; charset=utf-8')
          res.end('Missing or invalid "url" query parameter')
          return
        }

        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (compatible; EvenBrowse/1.0)',
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

        res.statusCode = upstream.status
        res.setHeader('content-type', contentType)
        res.setHeader('access-control-allow-origin', '*')
        res.setHeader('access-control-expose-headers', 'X-Set-Cookies, X-Upstream-Status')
        res.setHeader('x-upstream-status', String(upstream.status))

        // Capture Set-Cookie headers from upstream
        const setCookies = upstream.headers.getSetCookie?.() ?? []
        if (setCookies.length > 0) {
          res.setHeader('x-set-cookies', JSON.stringify(setCookies))
        }

        res.end(body)
      } catch (error) {
        res.statusCode = 502
        res.setHeader('content-type', 'text/plain; charset=utf-8')
        const message = error instanceof Error ? error.message : String(error)
        res.end(`Proxy request failed: ${message}`)
      }
    })
  }

  return {
    name: 'browse-proxy',
    configureServer(server) {
      attachMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares)
    },
  }
}

export default [
  react(),
  tailwindcss(),
  browseProxy(),
  {
    name: 'even-browser-resolve',
    config() {
      return {
        resolve: {
          alias: {
            'react/jsx-dev-runtime': nm('react/jsx-dev-runtime'),
            'react/jsx-runtime': nm('react/jsx-runtime'),
            'react-dom/client': nm('react-dom/client'),
            'react-dom': nm('react-dom'),
            'react': nm('react'),
            'react-router': nm('react-router'),
            'class-variance-authority': nm('class-variance-authority'),
            'clsx': nm('clsx'),
            'tailwind-merge': nm('tailwind-merge'),
            'upng-js': nm('upng-js'),
          },
        },
      }
    },
    resolveId(source: string) {
      if (source === '@evenrealities/even_hub_sdk') {
        const sdkDir = resolve(appRoot, 'node_modules/@evenrealities/even_hub_sdk')
        return { id: resolve(sdkDir, 'dist/index.js'), external: false }
      }
      if (source === '@jappyjan/even-better-sdk') {
        const betterSdkDir = resolve(appRoot, 'node_modules/@jappyjan/even-better-sdk')
        return { id: resolve(betterSdkDir, 'dist/index.js'), external: false }
      }
      return null
    },
  },
]
