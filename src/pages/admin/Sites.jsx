import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiGlobe, FiPlus, FiEdit2, FiTrash2, FiCopy, 
  FiCheck, FiX, FiExternalLink, FiCode, FiPieChart,
  FiFileText, FiBarChart2, FiLogOut, FiMenu, FiRefreshCw,
  FiTarget, FiTrendingUp, FiList
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã copy!')
  }

  const getWidgetCode = (site) => {
    const serverUrl = 'https://betraffic-production.up.railway.app'
    return `<script src="${serverUrl}/widget.js?siteKey=${site.siteKey}"></script>`
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
            <h2 className="text-xl font-semibold text-white">Quản lý Sites</h2>
          </div>
          <button
            onClick={() => {
              setEditingSite(null)
              setFormData({ name: '', domain: '', url: '', searchKeyword: '', instruction: '', isActive: true, quota: 0, priority: 1 })
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <FiPlus />
            Thêm Site
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
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
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <FiGlobe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{site.name}</h3>
                          <p className="text-white/60 text-sm">{site.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          site.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {site.isActive ? 'Đang hoạt động' : 'Đã tắt'}
                        </span>
                      </div>
                    </div>

                    {/* Quota & Priority Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-white/5 rounded-xl">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                          <FiTarget className="w-4 h-4" />
                          <span className="text-xs">Quota</span>
                        </div>
                        <p className="text-white font-bold">
                          {site.quota === 0 ? '∞' : site.remainingQuota + ' / ' + site.quota}
                        </p>
                        <p className="text-white/40 text-xs">
                          {site.quota === 0 ? 'Unlimited' : `Còn ${site.remainingQuota}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                          <FiPieChart className="w-4 h-4" />
                          <span className="text-xs">Priority</span>
                        </div>
                        <p className="text-white font-bold">{site.priority || 1}</p>
                        <p className="text-white/40 text-xs">
                          ~{totalPriority > 0 ? Math.round(((site.priority || 1) / totalPriority) * 100) : 0}% traffic
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <FiCheck className="w-4 h-4" />
                          <span className="text-xs">Hoàn thành</span>
                        </div>
                        <p className="text-white font-bold">{site.totalCompleted || 0}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                          <FiTrendingUp className="w-4 h-4" />
                          <span className="text-xs">Visits</span>
                        </div>
                        <p className="text-white font-bold">{site.totalVisits || 0}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-white/40 text-sm mb-1">URL</p>
                        <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                          {site.url} <FiExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div>
                        <p className="text-white/40 text-sm mb-1">Site Key</p>
                        <div className="flex items-center gap-2">
                          <code className="text-white/80 bg-white/10 px-2 py-1 rounded text-sm">{site.siteKey}</code>
                          <button onClick={() => copyToClipboard(site.siteKey)} className="text-white/40 hover:text-white">
                            <FiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => setShowCodeModal(site)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all text-sm"
                      >
                        <FiCode className="w-4 h-4" />
                        Widget
                      </button>
                      <button
                        onClick={() => handleResetQuota(site)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl text-yellow-400 transition-all text-sm"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Reset Quota
                      </button>
                      <button
                        onClick={() => handleEdit(site)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-all text-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(site._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-all text-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

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
                    Ảnh minh họa Bước 2 - Truy cập website (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.step2Image}
                    onChange={e => setFormData({ ...formData, step2Image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                  {formData.step2Image && (
                    <img 
                      src={formData.step2Image} 
                      alt="Preview" 
                      className="mt-2 max-h-32 rounded-lg" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Ảnh minh họa Bước 3 - Lấy mã xác nhận (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.step3Image}
                    onChange={e => setFormData({ ...formData, step3Image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                  {formData.step3Image && (
                    <img 
                      src={formData.step3Image} 
                      alt="Preview" 
                      className="mt-2 max-h-32 rounded-lg" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
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
