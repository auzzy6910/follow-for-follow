import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
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
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import ToastContainer from './components/ToastContainer'
import FollowOverlay from './components/FollowOverlay'
import EscrowDrawer from './components/EscrowDrawer'
import WarmingWizard from './components/WarmingWizard'
import AuthModal from './components/AuthModal'
import { AuthGuardProvider } from './context/AuthGuardContext'

function AppShell() {
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
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
      <ToastContainer />
      <FollowOverlay />
      <EscrowDrawer />
      <WarmingWizard />
      <AuthModal />
    </div>
  )
}

function App() {
  return (
    <AuthGuardProvider>
      <AppShell />
    </AuthGuardProvider>
  )
}

export default App
