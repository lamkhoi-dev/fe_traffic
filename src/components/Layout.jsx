import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBrain, FaHome, FaChartBar } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'

const Layout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const otherTestCategories = [
    { id: 'mbti', label: 'Trắc nghiệm MBTI', icon: '🧠', special: true, path: '/mbti' },
    { id: 'toan', label: 'Toán học', icon: '📐' },
    { id: 'ly', label: 'Vật lý', icon: '⚡' },
    { id: 'hoa', label: 'Hóa học', icon: '🧪' },
    { id: 'sinh', label: 'Sinh học', icon: '🧬' },
    { id: 'anh', label: 'Tiếng Anh', icon: '🔤' },
    { id: 'su', label: 'Lịch sử', icon: '📜' },
    { id: 'dia', label: 'Địa lý', icon: '🌍' },
    { id: 'van', label: 'Ngữ văn', icon: '📖' },
    { id: 'gdcd', label: 'GDCD', icon: '⚖️' },
  ]

  return (
    <div className="relative z-10">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl 
                           flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <FaBrain className="text-2xl text-white" />
              </motion.div>
              <span className="text-xl font-bold font-display gradient-text">
                IQ & EQ Test
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300
                           ${isHome 
                             ? 'bg-white/10 text-white' 
                             : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <FaHome />
                <span className="hidden sm:inline">Trang chủ</span>
              </Link>
              <Link
                to="/tests/iq"
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2"
              >
                <span>🧠</span>
                <span className="hidden sm:inline">IQ Test</span>
              </Link>
              <Link
                to="/tests/eq"
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2"
              >
                <span>💖</span>
                <span className="hidden sm:inline">EQ Test</span>
              </Link>
              
              {/* Dropdown for other tests */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                             transition-all duration-300 flex items-center space-x-2 ${
                               showDropdown ? 'bg-white/10 text-white' : ''
                             }`}
                >
                  <span>📋</span>
                  <span className="hidden sm:inline">Bài Thi Khác</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl 
                                 border border-white/10 shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <Link
                          to="/categories"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 
                                     transition-all font-medium border-b border-white/10 mb-1"
                        >
                          <span>📚</span>
                          <span>Xem tất cả</span>
                        </Link>
                        <div className="max-h-64 overflow-y-auto">
                          {otherTestCategories.map(cat => (
                            <Link
                              key={cat.id}
                              to={cat.path || `/categories/${cat.id}`}
                              onClick={() => setShowDropdown(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/80 
                                         hover:bg-white/10 hover:text-white transition-all ${
                                           cat.special ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-1' : ''
                                         }`}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                              {cat.special && <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">HOT</span>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/grades"
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2"
              >
                <span>📚</span>
                <span className="hidden sm:inline">Bài Thi Học Đường</span>
              </Link>
              <Link
                to="/assessment"
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 
                           transition-all duration-300 flex items-center space-x-2"
              >
                <span>🎯</span>
                <span className="hidden sm:inline">Đánh Giá Năng Lực</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                              flex items-center justify-center">
                <FaBrain className="text-sm text-white" />
              </div>
              <span className="text-slate-400 text-sm">
                © 2026 IQ & EQ Test. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
