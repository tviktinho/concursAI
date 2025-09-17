import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        authsuccess: resolve(__dirname, 'auth-success.html'),
        authfailure: resolve(__dirname, 'auth-failure.html'),
        login: resolve(__dirname, 'login.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        resultados: resolve(__dirname, 'resultados.html'),
        desempenho: resolve(__dirname, 'desempenho.html'),
        history: resolve(__dirname, 'history.html'),
        account: resolve(__dirname, 'account.html'),
        consentimentos: resolve(__dirname, 'consentimentos.html'),
      },
    },
  },
})
