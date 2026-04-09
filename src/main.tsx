import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'

const documentRoot = document.documentElement
const lightPrimaryColor = import.meta.env.VITE_PRIMARY_COLOR_LIGHT?.trim()
const darkPrimaryColor = import.meta.env.VITE_PRIMARY_COLOR_DARK?.trim()

if (lightPrimaryColor) {
  documentRoot.style.setProperty('--primary-light', lightPrimaryColor)
}

if (darkPrimaryColor) {
  documentRoot.style.setProperty('--primary-dark', darkPrimaryColor)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>,
)
