import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiGlobe, FiFileText, FiTrendingUp, FiLogOut, FiMenu, FiX, 
  FiPieChart, FiBarChart2, FiRefreshCw, FiTrash2, FiClock,
  FiCheckCircle, FiAlertCircle, FiPlay, FiPause, FiFilter,
  FiActivity, FiZap, FiList, FiSettings
} from 'react-icons/fi'
import api from '../../services/api'
import toast from 'react-hot-toast'

const AdminTasks = () => {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    expired: 0,
    total: 0,
    todayTotal: 0,
    todayCompleted: 0
  })
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(3000) // 3 seconds
  const [filter, setFilter] = useState({ status: 'all', siteId: 'all' })
  const [selectedTasks, setSelectedTasks] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchSites()
    fetchTasks()
  }, [navigate])

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchRealtimeStats()
      }, refreshInterval)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoRefresh, refreshInterval])

  const fetchSites = async () => {
    try {
      const response = await api.get('/api/sites')
      setSites(response.data?.sites || response.data || [])
    } catch (error) {
      console.error('Error fetching sites:', error)
      setSites([])
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.status !== 'all') params.append('status', filter.status)
      if (filter.siteId !== 'all') params.append('siteId', filter.siteId)
      params.append('limit', '100')
      
      const response = await api.get(`/api/tasks/admin/list?${params}`)
      if (response.data.success) {
        setTasks(response.data.tasks || [])
        setStats(response.data.stats || {})
        setLastUpdate(new Date())
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Lỗi khi tải danh sách tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchRealtimeStats = useCallback(async () => {
    try {
      const response = await api.get('/api/tasks/admin/realtime-stats')
      if (response.data.success) {
        setStats(response.data.stats || {})
        setTasks(response.data.recentTasks || [])
        setLastUpdate(new Date(response.data.timestamp))
      }
    } catch (error) {
      console.error('Error fetching realtime stats:', error)
      // Don't crash on error, just keep existing state
    }
  }, [])

  const handleDelete = async (taskId) => {
    if (!confirm('Bạn có chắc muốn xóa task này?')) return
    try {
      await api.delete(`/api/tasks/admin/${taskId}`)
      toast.success('Đã xóa task')
      fetchTasks()
    } catch (error) {
      toast.error('Lỗi khi xóa task')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) {
      toast.error('Chọn ít nhất 1 task để xóa')
      return
    }
    if (!confirm(`Xóa ${selectedTasks.length} tasks đã chọn?`)) return
    
    try {
      await api.post('/api/tasks/admin/bulk-delete', { taskIds: selectedTasks })
      toast.success(`Đã xóa ${selectedTasks.length} tasks`)
      setSelectedTasks([])
      fetchTasks()
    } catch (error) {
      toast.error('Lỗi khi xóa tasks')
    }
  }

  const handleClearExpired = async () => {
    if (!confirm('Xóa tất cả tasks đã hết hạn?')) return
    try {
      const response = await api.post('/api/tasks/admin/clear-expired')
      toast.success(`Đã xóa ${response.data.deletedCount} tasks hết hạn`)
      fetchTasks()
    } catch (error) {
      toast.error('Lỗi khi xóa tasks')
    }
  }

  const toggleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map(t => t._id))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />
      case 'in_progress': return <FiPlay className="w-4 h-4" />
      case 'completed': return <FiCheckCircle className="w-4 h-4" />
      case 'expired': return <FiAlertCircle className="w-4 h-4" />
      default: return null
    }
  }

  const formatTime = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit'
    })
  }

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks', active: true },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
    { label: 'Cài đặt', icon: FiSettings, path: '/admin/settings' },
  ]

  const statCards = [
    { label: 'Pending', value: stats.pending, icon: FiClock, color: 'from-yellow-500 to-orange-500' },
    { label: 'In Progress', value: stats.inProgress, icon: FiPlay, color: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Expired', value: stats.expired, icon: FiAlertCircle, color: 'from-red-500 to-pink-500' },
    { label: 'Hôm nay', value: stats.todayTotal, icon: FiActivity, color: 'from-purple-500 to-violet-500' },
    { label: 'Hoàn thành hôm nay', value: stats.todayCompleted, icon: FiZap, color: 'from-emerald-500 to-teal-500' },
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
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-slate-800/30 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all lg:hidden"
              >
                {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiList className="w-6 h-6 text-purple-400" />
                  Quản lý Tasks
                  {autoRefresh && (
                    <span className="ml-2 flex items-center gap-1 text-xs text-green-400">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                </h2>
                {lastUpdate && (
                  <p className="text-white/40 text-xs mt-1">
                    Cập nhật: {formatTime(lastUpdate)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auto Refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  autoRefresh 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {autoRefresh ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                {autoRefresh ? 'Pause' : 'Auto'}
              </button>
              
              {/* Manual Refresh */}
              <button
                onClick={fetchTasks}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Refresh Interval */}
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value={1000}>1s</option>
                <option value={3000}>3s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
              </select>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-4 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="px-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-white/40" />
            <select
              value={filter.status}
              onChange={(e) => {
                setFilter(f => ({ ...f, status: e.target.value }))
                setTimeout(fetchTasks, 100)
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={filter.siteId}
              onChange={(e) => {
                setFilter(f => ({ ...f, siteId: e.target.value }))
                setTimeout(fetchTasks, 100)
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">Tất cả sites</option>
              {sites.map(site => (
                <option key={site._id} value={site._id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1"></div>

          {selectedTasks.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
            >
              <FiTrash2 className="w-4 h-4" />
              Xóa {selectedTasks.length} đã chọn
            </button>
          )}

          <button
            onClick={handleClearExpired}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-all"
          >
            <FiAlertCircle className="w-4 h-4" />
            Xóa expired
          </button>
        </div>

        {/* Tasks Table */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Code</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Site</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Fingerprint</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Created</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Expires</th>
                  <th className="p-3 text-left text-white/60 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tasks.map((task, idx) => (
                    <motion.tr
                      key={task._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                        selectedTasks.includes(task._id) ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task._id)}
                          onChange={() => toggleSelectTask(task._id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <code className="text-purple-400 font-mono text-sm bg-purple-500/10 px-2 py-1 rounded">
                          {task.code}
                        </code>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-white text-sm">{task.siteId?.name || '-'}</p>
                          <p className="text-white/40 text-xs">{task.siteId?.siteKey || '-'}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <code className="text-white/60 text-xs font-mono">
                          {task.fingerprint?.substring(0, 12)}...
                        </code>
                      </td>
                      <td className="p-3 text-white/60 text-sm">
                        {formatTime(task.createdAt)}
                      </td>
                      <td className="p-3">
                        <span className={`text-sm ${
                          new Date(task.expiresAt) < new Date() 
                            ? 'text-red-400' 
                            : 'text-white/60'
                        }`}>
                          {formatTime(task.expiresAt)}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {tasks.length === 0 && !loading && (
              <div className="p-8 text-center text-white/40">
                <FiList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Không có tasks nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTasks
