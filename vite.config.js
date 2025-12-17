import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_BASE_URL || 'http://202.10.47.174:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const setCookie = proxyRes.headers['set-cookie']
              if (!setCookie) return
              const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
              )
            })
          },
        },
      },
    },
  }
})
