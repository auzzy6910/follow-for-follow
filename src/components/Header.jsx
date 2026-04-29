import { Menu, Search } from 'lucide-react'

export default function Header({ onSidebarToggle }) {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-16 px-4 sm:px-6 gap-4 shrink-0">
      <button
        type="button"
        onClick={onSidebarToggle}
        aria-label="Toggle navigation"
        className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 hover:text-[#af101a] flex items-center justify-center transition-colors shrink-0"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl font-extrabold text-[#af101a] tracking-tight whitespace-nowrap">Follow for Follow</span>
      </div>

      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-72 shrink-0 ml-auto">
        <Search size={16} className="text-gray-500 shrink-0" />
        <input
          type="text"
          placeholder="Search creators..."
          className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full placeholder-gray-500 ml-2 text-gray-800"
        />
      </div>
    </header>
  )
}
