import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { Loader2 } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Credits from './pages/Credits'
import GoldenHour from './pages/GoldenHour'
import QualityScore from './pages/QualityScore'
import Tribes from './pages/Tribes'
import TribeDetail from './pages/TribeDetail'
import Gamification from './pages/Gamification'
import Safety from './pages/Safety'
import Settings from './pages/Settings'
import Wallet from './pages/Wallet'
import SignIn from './pages/SignIn'
import ToastContainer from './components/ToastContainer'
import FollowOverlay from './components/FollowOverlay'
import EscrowDrawer from './components/EscrowDrawer'
import WarmingWizard from './components/WarmingWizard'

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 text-gray-300">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-green-accent" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  )
}

function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const closeMobileSidebar = () => setMobileSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen(o => !o)

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 pb-24 lg:pb-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/golden-hour" element={<GoldenHour />} />
            <Route path="/quality" element={<QualityScore />} />
            <Route path="/tribes" element={<Tribes />} />
            <Route path="/tribes/:tribeId" element={<TribeDetail />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
      <ToastContainer />
      <FollowOverlay />
      <EscrowDrawer />
      <WarmingWizard />
    </div>
  )
}

function App() {
  return (
    <>
      <AuthLoading>
        <AuthLoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>
    </>
  )
}

export default App
