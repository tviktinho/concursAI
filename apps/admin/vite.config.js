import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        usuarios: resolve(__dirname, 'usuarios.html'),
        temas: resolve(__dirname, 'temas.html'),
        categorias: resolve(__dirname, 'categorias.html'),
        relatorios: resolve(__dirname, 'relatorios.html'),
      },
    },
  },
})
