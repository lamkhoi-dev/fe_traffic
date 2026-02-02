import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiGlobe, FiPlus, FiEdit2, FiTrash2, FiCopy, 
  FiCheck, FiX, FiExternalLink, FiCode, FiPieChart,
  FiFileText, FiBarChart2, FiLogOut, FiMenu, FiRefreshCw,
  FiTarget, FiTrendingUp, FiList, FiUpload, FiLink
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AdminSites = () => {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSite, setEditingSite] = useState(null)
  const [showCodeModal, setShowCodeModal] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showTaskStepsModal, setShowTaskStepsModal] = useState(null)
  const defaultTaskSteps = {
    step1: { label: '1', title: 'Tìm kiếm trên Google', description: 'Mở Google và tìm kiếm từ khóa:' },
    step2: { label: '2', title: 'Truy cập website', description: 'Tìm và click vào kết quả' },
    step3: { label: '3', title: 'Lấy mã xác nhận', description: 'Cuộn xuống footer, bấm vào chữ "Mã Code" và đợi 60 giây để nhận mã xác nhận' },
    step4: { label: '4', title: 'Nhập mã bên dưới', description: 'Copy mã và dán vào ô bên dưới để xem kết quả' }
  }
  const [taskStepsForm, setTaskStepsForm] = useState(defaultTaskSteps)
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    url: '',
    searchKeyword: '',
    instruction: '',
    step2Image: '',
    step3Image: '',
    isActive: true,
    quota: 0,
    priority: 1
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchSites()
  }, [navigate])

  const fetchSites = async () => {
    try {
      const response = await api.get('/api/sites')
      setSites(response.data.sites || [])
    } catch (error) {
      toast.error('Không thể tải danh sách sites')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSite) {
        await api.put(`/api/sites/${editingSite._id}`, formData)
        toast.success('Cập nhật site thành công!')
      } else {
        await api.post('/api/sites', formData)
        toast.success('Thêm site thành công!')
      }
      setShowModal(false)
      setEditingSite(null)
      setFormData({ name: '', domain: '', url: '', searchKeyword: '', instruction: '', step2Image: '', step3Image: '', isActive: true, quota: 0, priority: 1 })
      fetchSites()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (site) => {
    setEditingSite(site)
    setFormData({
      name: site.name,
      domain: site.domain,
      url: site.url,
      searchKeyword: site.searchKeyword,
      instruction: site.instruction,
      step2Image: site.step2Image || '',
      step3Image: site.step3Image || '',
      isActive: site.isActive,
      quota: site.quota || 0,
      priority: site.priority || 1
    })
    setShowModal(true)
  }

  const handleDelete = async (siteId) => {
    if (!confirm('Bạn có chắc muốn xóa site này?')) return
    try {
      await api.delete(`/api/sites/${siteId}`)
      toast.success('Xóa site thành công!')
      fetchSites()
    } catch (error) {
      toast.error('Không thể xóa site')
    }
  }

  const handleResetQuota = async (site) => {
    const newQuota = prompt(`Nhập quota mới cho ${site.name}:`, site.quota || 0)
    if (newQuota === null) return
    
    try {
      await api.post(`/api/sites/${site._id}/reset-quota`, { newQuota: parseInt(newQuota) || 0 })
      toast.success('Reset quota thành công!')
      fetchSites()
    } catch (error) {
      toast.error('Không thể reset quota')
    }
  }

  const handleEditTaskSteps = (site) => {
    setShowTaskStepsModal(site)
    setTaskStepsForm({
      step1: { ...defaultTaskSteps.step1, ...site.taskSteps?.step1 },
      step2: { ...defaultTaskSteps.step2, ...site.taskSteps?.step2 },
      step3: { ...defaultTaskSteps.step3, ...site.taskSteps?.step3 },
      step4: { ...defaultTaskSteps.step4, ...site.taskSteps?.step4 }
    })
  }

  const handleSaveTaskSteps = async () => {
    try {
      await api.put(`/api/sites/${showTaskStepsModal._id}`, { taskSteps: taskStepsForm })
      toast.success('Cập nhật nội dung các bước thành công!')
      setShowTaskStepsModal(null)
      fetchSites()
    } catch (error) {
      toast.error('Không thể cập nhật')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã copy!')
  }

  const getWidgetCode = (site) => {
    const serverUrl = 'https://betraffic-production.up.railway.app'
    return `<script src="${serverUrl}/widget.js?siteKey=${site.siteKey}"></script>`
  }

  // Upload image handler
  const handleImageUpload = async (file, field) => {
    if (!file) return
    
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    
    try {
      toast.loading('Đang upload ảnh...', { id: 'upload' })
      const response = await api.post('/api/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, [field]: response.data.url }))
        toast.success('Upload thành công!', { id: 'upload' })
      }
    } catch (error) {
      toast.error('Upload thất bại: ' + (error.response?.data?.message || error.message), { id: 'upload' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  // Calculate total priority for percentage display
  const totalPriority = sites.reduce((sum, s) => sum + (s.priority || 1), 0)

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites', active: true },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
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
            <span className="hidden sm:inline">IQ Admin</span>
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
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-white/10 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white flex-shrink-0"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-base md:text-xl font-semibold text-white truncate">Quản lý Sites</h2>
          </div>
          <button
            onClick={() => {
              setEditingSite(null)
              setFormData({ name: '', domain: '', url: '', searchKeyword: '', instruction: '', isActive: true, quota: 0, priority: 1 })
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl border-2 border-purple-400/50 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 hover:border-purple-300 transition-all text-sm md:text-base flex-shrink-0"
          >
            <FiPlus />
            <span className="hidden sm:inline">Thêm Site</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {sites.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  Chưa có site nào. Nhấn "Thêm Site" để bắt đầu.
                </div>
              ) : (
                sites.map((site, idx) => (
                  <motion.div
                    key={site._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <FiGlobe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-white truncate">{site.name}</h3>
                          <p className="text-white/60 text-xs md:text-sm truncate">{site.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          site.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {site.isActive ? 'Hoạt động' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>

                    {/* Quota & Priority Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 p-3 md:p-4 bg-white/5 rounded-xl">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                          <FiTarget className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Quota</span>
                        </div>
                        <p className="text-white font-bold text-sm md:text-base">
                          {site.quota === 0 ? '∞' : site.remainingQuota + '/' + site.quota}
                        </p>
                        <p className="text-white/40 text-[10px] md:text-xs">
                          {site.quota === 0 ? 'Unlimited' : `Còn ${site.remainingQuota}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                          <FiPieChart className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Priority</span>
                        </div>
                        <p className="text-white font-bold text-sm md:text-base">{site.priority || 1}</p>
                        <p className="text-white/40 text-[10px] md:text-xs">
                          ~{totalPriority > 0 ? Math.round(((site.priority || 1) / totalPriority) * 100) : 0}% traffic
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <FiCheck className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Hoàn thành</span>
                        </div>
                        <p className="text-white font-bold text-sm md:text-base">{site.totalCompleted || 0}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                          <FiTrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-[10px] md:text-xs">Visits</span>
                        </div>
                        <p className="text-white font-bold text-sm md:text-base">{site.totalVisits || 0}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4">
                      <div>
                        <p className="text-white/40 text-xs md:text-sm mb-1">URL</p>
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs md:text-sm break-all">
                          {site.url} <FiExternalLink className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        </a>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs md:text-sm mb-1">Site Key</p>
                        <div className="flex items-center gap-2">
                          <code className="text-white/80 bg-white/10 px-2 py-1 rounded text-xs md:text-sm truncate">{site.siteKey}</code>
                          <button onClick={() => copyToClipboard(site.siteKey)} className="text-white/40 hover:text-white flex-shrink-0">
                            <FiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 md:gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setShowCodeModal(site)}
                        className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl text-white transition-all text-xs md:text-sm"
                      >
                        <FiCode className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Widget</span>
                      </button>
                      <button
                        onClick={() => handleEditTaskSteps(site)}
                        className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg md:rounded-xl text-purple-400 transition-all text-xs md:text-sm"
                      >
                        <FiList className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Bước</span>
                      </button>
                      <button
                        onClick={() => handleResetQuota(site)}
                        className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg md:rounded-xl text-yellow-400 transition-all text-xs md:text-sm"
                      >
                        <FiRefreshCw className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Reset</span>
                      </button>
                      <button
                        onClick={() => handleEdit(site)}
                        className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg md:rounded-xl text-blue-400 transition-all text-xs md:text-sm"
                      >
                        <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(site._id)}
                        className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg md:rounded-xl text-red-400 transition-all text-xs md:text-sm col-span-2 sm:col-span-1"
                      >
                        <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Task Steps Configuration Modal */}
      <AnimatePresence>
        {showTaskStepsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4"
            onClick={() => setShowTaskStepsModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 w-full max-w-2xl border border-white/10 max-h-[95vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">
                Tuỳ chỉnh nội dung các bước
              </h3>
              <p className="text-white/60 text-xs md:text-sm mb-4 md:mb-6">Site: {showTaskStepsModal.name}</p>
              
              <div className="space-y-4 md:space-y-6">
                {['step1', 'step2', 'step3', 'step4'].map((stepKey, index) => (
                  <div key={stepKey} className="p-3 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <span className={`min-w-[2rem] h-8 px-2 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm ${
                        index === 0 ? 'bg-blue-500/20 text-blue-400' :
                        index === 1 ? 'bg-purple-500/20 text-purple-400' :
                        index === 2 ? 'bg-pink-500/20 text-pink-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {taskStepsForm[stepKey].label}
                      </span>
                      <h4 className="text-white font-medium text-sm md:text-base">Bước {index + 1}</h4>
                    </div>
                    
                    <div className="grid gap-2 md:gap-3">
                      <div>
                        <label className="block text-white/60 text-[10px] md:text-xs mb-1">Ký hiệu (1, 2, 3...)</label>
                        <input
                          type="text"
                          value={taskStepsForm[stepKey].label}
                          onChange={e => setTaskStepsForm({
                            ...taskStepsForm,
                            [stepKey]: { ...taskStepsForm[stepKey], label: e.target.value }
                          })}
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs md:text-sm"
                          placeholder="VD: 1, A, ★..."
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-[10px] md:text-xs mb-1">Tiêu đề</label>
                        <input
                          type="text"
                          value={taskStepsForm[stepKey].title}
                          onChange={e => setTaskStepsForm({
                            ...taskStepsForm,
                            [stepKey]: { ...taskStepsForm[stepKey], title: e.target.value }
                          })}
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs md:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-[10px] md:text-xs mb-1">Mô tả</label>
                        <textarea
                          value={taskStepsForm[stepKey].description}
                          onChange={e => setTaskStepsForm({
                            ...taskStepsForm,
                            [stepKey]: { ...taskStepsForm[stepKey], description: e.target.value }
                          })}
                          rows={2}
                          className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 text-xs md:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6">
                <button
                  type="button"
                  onClick={() => setTaskStepsForm(defaultTaskSteps)}
                  className="px-3 md:px-4 py-2 md:py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg md:rounded-xl text-yellow-400 transition-all text-xs md:text-sm"
                >
                  Reset mặc định
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskStepsModal(null)}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white/10 hover:bg-white/20 rounded-lg md:rounded-xl text-white transition-all text-xs md:text-sm"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveTaskSteps}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all text-xs md:text-sm"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {editingSite ? 'Chỉnh sửa Site' : 'Thêm Site mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Tên site *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Domain *</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                {/* Quota & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Quota <span className="text-white/40">(0 = unlimited)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quota}
                      onChange={e => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                    <p className="text-white/40 text-xs mt-1">Số traffic cần chạy</p>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Priority <span className="text-white/40">(1-100)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.priority}
                      onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                    <p className="text-white/40 text-xs mt-1">Tỉ lệ phân bổ traffic</p>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Từ khóa tìm kiếm (SEO)</label>
                  <input
                    type="text"
                    value={formData.searchKeyword}
                    onChange={e => setFormData({ ...formData, searchKeyword: e.target.value })}
                    placeholder="keyword để tìm kiếm"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Hướng dẫn cho người dùng</label>
                  <textarea
                    value={formData.instruction}
                    onChange={e => setFormData({ ...formData, instruction: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Ảnh minh họa Bước 2 - Truy cập website
                  </label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-all">
                        <FiUpload className="w-4 h-4" />
                        <span>Upload ảnh</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files[0], 'step2Image')}
                      />
                    </label>
                    <span className="flex items-center text-white/40">hoặc</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-white/5 border border-white/10 rounded-l-xl text-white/40">
                      <FiLink className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.step2Image}
                      onChange={e => setFormData({ ...formData, step2Image: e.target.value })}
                      placeholder="Nhập URL ảnh..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {formData.step2Image && (
                    <div className="mt-2 relative inline-block">
                      <img 
                        src={formData.step2Image} 
                        alt="Preview" 
                        className="max-h-32 rounded-lg border border-white/10" 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, step2Image: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Ảnh minh họa Bước 3 - Lấy mã xác nhận
                  </label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 transition-all">
                        <FiUpload className="w-4 h-4" />
                        <span>Upload ảnh</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files[0], 'step3Image')}
                      />
                    </label>
                    <span className="flex items-center text-white/40">hoặc</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-white/5 border border-white/10 rounded-l-xl text-white/40">
                      <FiLink className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.step3Image}
                      onChange={e => setFormData({ ...formData, step3Image: e.target.value })}
                      placeholder="Nhập URL ảnh..."
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 border-l-0 rounded-r-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  {formData.step3Image && (
                    <div className="mt-2 relative inline-block">
                      <img 
                        src={formData.step3Image} 
                        alt="Preview" 
                        className="max-h-32 rounded-lg border border-white/10" 
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, step3Image: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/10"
                  />
                  <label htmlFor="isActive" className="text-white/80">Kích hoạt site</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    {editingSite ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCodeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Mã Widget cho {showCodeModal.name}</h3>
              <p className="text-white/60 mb-4">Copy đoạn code này và dán vào website của bạn trước thẻ &lt;/body&gt;</p>
              <div className="relative">
                <pre className="bg-slate-900 p-4 rounded-xl text-green-400 text-sm overflow-x-auto">
                  <code>{getWidgetCode(showCodeModal)}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(getWidgetCode(showCodeModal))}
                  className="absolute top-2 right-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm flex items-center gap-1"
                >
                  <FiCopy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <button
                onClick={() => setShowCodeModal(null)}
                className="w-full mt-4 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminSites
