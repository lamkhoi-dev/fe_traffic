import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUsers, FiFileText, FiGlobe, FiActivity, 
  FiTrendingUp, FiClock, FiCheckCircle, FiLogOut,
  FiMenu, FiX, FiPieChart, FiBarChart2, FiList, FiSettings, FiEdit2
} from 'react-icons/fi'
import api from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    pendingTasks: 0,
    totalSites: 0,
    todaySessions: 0,
    successRate: 0
  })
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/stats/dashboard')
      setStats(response.data.stats || stats)
      setRecentSessions(response.data.recentSessions || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  const statCards = [
    { label: 'Tổng phiên test', value: stats.totalSessions, icon: FiFileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Hoàn thành', value: stats.completedSessions, icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Đang chờ task', value: stats.pendingTasks, icon: FiClock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Trang đích', value: stats.totalSites, icon: FiGlobe, color: 'from-purple-500 to-pink-500' },
    { label: 'Hôm nay', value: stats.todaySessions, icon: FiTrendingUp, color: 'from-pink-500 to-rose-500' },
    { label: 'Tỉ lệ thành công', value: `${stats.successRate}%`, icon: FiActivity, color: 'from-indigo-500 to-violet-500' },
  ]

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard', active: true },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
    { label: 'Bài viết', icon: FiEdit2, path: '/admin/posts' },
    { label: 'Cài đặt', icon: FiSettings, path: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:relative z-30 w-64 h-full bg-slate-800/95 lg:bg-slate-800/50 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
              🧠
            </span>
            <span>IQ Admin</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                item.active 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 md:p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm md:text-base"
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">
              {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-white">{card.value}</span>
                    </div>
                    <p className="text-white/60">{card.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Sessions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Phiên test gần đây</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left text-white/60 font-medium px-6 py-4">Session ID</th>
                        <th className="text-left text-white/60 font-medium px-6 py-4">Bài test</th>
                        <th className="text-left text-white/60 font-medium px-6 py-4">Trạng thái</th>
                        <th className="text-left text-white/60 font-medium px-6 py-4">Điểm</th>
                        <th className="text-left text-white/60 font-medium px-6 py-4">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSessions.length > 0 ? recentSessions.map((session, idx) => (
                        <tr key={idx} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-6 py-4 text-white/80 font-mono text-sm">
                            {session._id?.slice(-8) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-white">{session.testName || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              session.status === 'pending_task' ? 'bg-yellow-500/20 text-yellow-400' :
                              session.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {session.status === 'completed' ? 'Hoàn thành' :
                               session.status === 'pending_task' ? 'Chờ task' :
                               session.status === 'in_progress' ? 'Đang làm' : session.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white">{session.score || '-'}</td>
                          <td className="px-6 py-4 text-white/60 text-sm">
                            {session.createdAt ? new Date(session.createdAt).toLocaleString('vi-VN') : 'N/A'}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-white/40">
                            Chưa có dữ liệu
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
