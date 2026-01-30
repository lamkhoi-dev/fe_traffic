import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiBarChart2, FiPieChart, FiGlobe, FiFileText, 
  FiLogOut, FiMenu, FiTrendingUp, FiUsers,
  FiCalendar, FiClock, FiList
} from 'react-icons/fi'
import api from '../../services/api'

const AdminStats = () => {
  const [stats, setStats] = useState({
    daily: [],
    byTest: [],
    bySite: [],
    totals: {}
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchStats()
  }, [navigate, dateRange])

  const fetchStats = async () => {
    try {
      const response = await api.get(`/api/stats/detailed?range=${dateRange}`)
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats', active: true },
  ]

  // Calculate bar heights for chart visualization
  const maxValue = Math.max(...(stats.daily?.map(d => d.count) || [1]), 1)

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
            <h2 className="text-xl font-semibold text-white">Thống kê chi tiết</h2>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  dateRange === range
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:text-white'
                }`}
              >
                {range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : '90 ngày'}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white/60">Tổng phiên</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totals?.totalSessions || 0}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-white/60">Hoàn thành</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totals?.completed || 0}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-white/60">Đang chờ task</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totals?.pending || 0}</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <FiBarChart2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white/60">Tỉ lệ hoàn thành</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.totals?.completionRate || 0}%</p>
                </div>
              </div>

              {/* Daily Chart */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5" />
                  Số phiên theo ngày
                </h3>
                <div className="h-64 flex items-end gap-2">
                  {stats.daily?.length > 0 ? (
                    stats.daily.map((day, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.count / maxValue) * 200}px` }}
                            transition={{ delay: idx * 0.05 }}
                            className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg min-h-[4px]"
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.count} phiên
                          </div>
                        </div>
                        <span className="text-white/40 text-xs">
                          {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/40">
                      Chưa có dữ liệu
                    </div>
                  )}
                </div>
              </div>

              {/* Stats by Test & Site */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Test */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiFileText className="w-5 h-5" />
                    Thống kê theo Test
                  </h3>
                  <div className="space-y-3">
                    {stats.byTest?.length > 0 ? (
                      stats.byTest.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              item.type === 'iq' ? 'bg-purple-500' : 'bg-pink-500'
                            }`}></div>
                            <span className="text-white">{item.name}</span>
                          </div>
                          <span className="text-white/60">{item.count} lượt</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 text-center py-4">Chưa có dữ liệu</p>
                    )}
                  </div>
                </div>

                {/* By Site */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiGlobe className="w-5 h-5" />
                    Thống kê theo Site
                  </h3>
                  <div className="space-y-3">
                    {stats.bySite?.length > 0 ? (
                      stats.bySite.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <FiGlobe className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white">{item.name}</p>
                              <p className="text-white/40 text-sm">{item.domain}</p>
                            </div>
                          </div>
                          <span className="text-white/60">{item.visits} lượt</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/40 text-center py-4">Chưa có dữ liệu</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminStats
