import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { AppProvider } from './context/AppContext'
import './index.css'
import App from './App.jsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) {
  console.warn(
    'VITE_CONVEX_URL is not set. Convex queries will fail silently and the ' +
      'app will render with bundled fallback data. Add VITE_CONVEX_URL to ' +
      '.env.local to enable the live backend.',
  )
}

// ConvexProvider is always mounted so the hooks-in-hooks rules hold. When no
// URL is configured we use a placeholder that never resolves — queries return
// undefined and the hook layer falls back to bundled mock data.
const convex = new ConvexReactClient(
  convexUrl || 'https://invalid-convex-url.invalid',
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexProvider client={convex}>
        <AppProvider>
          <App />
        </AppProvider>
      </ConvexProvider>
    </BrowserRouter>
  </StrictMode>,
)
