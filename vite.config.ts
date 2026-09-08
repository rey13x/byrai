import { defineConfig } from 'vite'
import { cpSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const jagaLinkRoot = fileURLToPath(new URL('./JagaLink/link-lock', import.meta.url))
const jagaLinkDirectories = ['/buat', '/decrypt', '/sembunyi', '/bruteforce', '/jaga-link']
const jagaLinkFiles = ['/api.js', '/b64.js', '/favicon.ico', '/favicon.svg', '/style.css']

const contentTypes: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
}

const getJagaLinkFile = (requestPath: string) => {
  const normalizedPath = requestPath.split('?')[0].replace(/\/$/, '') || '/'
  const directory = jagaLinkDirectories.find((prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`))

  if (directory) {
    const relativePath = normalizedPath === directory ? 'index.html' : normalizedPath.slice(directory.length + 1)
    return `${jagaLinkRoot}/${directory === '/jaga-link' ? '' : directory.slice(1)}/${relativePath}`.replace('//', '/')
  }

  if (jagaLinkFiles.includes(normalizedPath)) {
    return `${jagaLinkRoot}${normalizedPath}`
  }

  return null
}

const serveJagaLinkInDev = () => ({
  name: 'serve-jaga-link-in-dev',
  configureServer(server: { middlewares: { use: (handler: (request: { url?: string }, response: { setHeader: (name: string, value: string) => void; end: (content: Buffer) => void }, next: () => void) => void) => void } }) {
    server.middlewares.use((request, response, next) => {
      const filePath = getJagaLinkFile(request.url || '/')
      if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
        next()
        return
      }

      const extension = filePath.slice(filePath.lastIndexOf('.'))
      response.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream')
      response.end(readFileSync(filePath))
    })
  },
})

const copyJagaLink = () => ({
  name: 'copy-jaga-link',
  closeBundle() {
    const outputRoot = fileURLToPath(new URL('./dist', import.meta.url))
    const files = [
      'api.js',
      'b64.js',
      'corner-ribbon-minified.svg',
      'corner-ribbon.svg',
      'favicon.ico',
      'favicon.svg',
      'index.js',
      'style.css',
    ]
    const directories = ['bruteforce', 'buat', 'decrypt', 'sembunyi']

    files.forEach((file) => cpSync(`${jagaLinkRoot}/${file}`, `${outputRoot}/${file}`))
    directories.forEach((directory) => cpSync(`${jagaLinkRoot}/${directory}`, `${outputRoot}/${directory}`, { recursive: true }))

    mkdirSync(`${outputRoot}/jaga-link`, { recursive: true })
    cpSync(`${jagaLinkRoot}/index.html`, `${outputRoot}/jaga-link/index.html`)
    files.forEach((file) => cpSync(`${jagaLinkRoot}/${file}`, `${outputRoot}/jaga-link/${file}`))
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), serveJagaLinkInDev(), copyJagaLink()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'ui-vendor': ['lucide-react', 'react-icons'],
        }
      }
    }
  }
})
