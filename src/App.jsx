import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Credits from './pages/Credits'
import GoldenHour from './pages/GoldenHour'
import QualityScore from './pages/QualityScore'
import Tribes from './pages/Tribes'
import Gamification from './pages/Gamification'
import Safety from './pages/Safety'
import Settings from './pages/Settings'
import Wallet from './pages/Wallet'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      <div className="hidden md:flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/golden-hour" element={<GoldenHour />} />
            <Route path="/quality" element={<QualityScore />} />
            <Route path="/tribes" element={<Tribes />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default App
