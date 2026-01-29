import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBrain, FaHome, FaChartBar } from 'react-icons/fa'

const Layout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

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
