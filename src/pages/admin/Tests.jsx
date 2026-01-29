import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiFileText, FiPlus, FiEdit2, FiTrash2, 
  FiClock, FiPieChart, FiGlobe, FiBarChart2, 
  FiLogOut, FiMenu, FiEye
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AdminTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchTests()
  }, [navigate])

  const fetchTests = async () => {
    try {
      const response = await api.get('/api/tests')
      setTests(response.data.tests || [])
    } catch (error) {
      toast.error('Không thể tải danh sách tests')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'hard': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getTypeColor = (type) => {
    return type === 'iq' 
      ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
      : 'bg-gradient-to-br from-pink-500 to-orange-500'
  }

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests', active: true },
    { label: 'Thống kê', icon: FiBarChart2, path: '/admin/stats' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:relative z-30 w-64 h-full bg-slate-800/50 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              🧠
            </span>
            IQ Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-white">Quản lý Tests</h2>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white/40 cursor-not-allowed"
            title="Tính năng đang phát triển"
          >
            <FiPlus />
            Thêm Test
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/60 text-sm mb-2">Tổng số Tests</p>
                  <p className="text-3xl font-bold text-white">{tests.length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/60 text-sm mb-2">IQ Tests</p>
                  <p className="text-3xl font-bold text-purple-400">{tests.filter(t => t.type === 'iq').length}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/60 text-sm mb-2">EQ Tests</p>
                  <p className="text-3xl font-bold text-pink-400">{tests.filter(t => t.type === 'eq').length}</p>
                </div>
              </div>

              {/* Tests Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tests.map((test, idx) => (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className={`h-2 ${getTypeColor(test.type)}`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                            {test.type === 'iq' ? 'IQ Test' : 'EQ Test'}
                          </span>
                          <h3 className="text-lg font-semibold text-white mt-1">{test.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty === 'easy' ? 'Dễ' : test.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-white/40 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <FiFileText className="w-4 h-4" />
                          {test.questionCount} câu
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {test.duration} phút
                        </span>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        <button
                          onClick={() => navigate(`/test/${test._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                        >
                          <FiEye className="w-4 h-4" />
                          Xem
                        </button>
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-xl text-blue-400/50 cursor-not-allowed"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-xl text-red-400/50 cursor-not-allowed"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {tests.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  Chưa có test nào. Chạy seed để tạo dữ liệu mẫu.
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminTests
