import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSettings, FiPieChart, FiGlobe, FiFileText, 
  FiLogOut, FiMenu, FiX, FiTrendingUp, FiList,
  FiBarChart2, FiSave, FiPlus, FiTrash2, FiEdit2,
  FiChevronDown, FiChevronUp
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AdminSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('terms')
  const [termsContent, setTermsContent] = useState(null)
  const [privacyContent, setPrivacyContent] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchSettings()
  }, [navigate])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings')
      setTermsContent(response.data.terms)
      setPrivacyContent(response.data.privacy)
    } catch (error) {
      toast.error('Không thể tải cài đặt')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (activeTab === 'terms') {
        await api.put('/api/settings/terms', { content: termsContent })
        toast.success('Đã lưu Điều khoản sử dụng!')
      } else {
        await api.put('/api/settings/privacy', { content: privacyContent })
        toast.success('Đã lưu Chính sách bảo mật!')
      }
    } catch (error) {
      toast.error('Lỗi khi lưu: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const getCurrentContent = () => activeTab === 'terms' ? termsContent : privacyContent
  const setCurrentContent = (content) => activeTab === 'terms' ? setTermsContent(content) : setPrivacyContent(content)

  const handleTitleChange = (value) => {
    setCurrentContent({ ...getCurrentContent(), title: value })
  }

  const handleSectionChange = (index, field, value) => {
    const content = getCurrentContent()
    const newSections = [...content.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setCurrentContent({ ...content, sections: newSections })
  }

  const addSection = () => {
    const content = getCurrentContent()
    const newIndex = content.sections.length + 1
    setCurrentContent({
      ...content,
      sections: [...content.sections, {
        icon: 'check',
        title: `${newIndex}. Tiêu đề mới`,
        content: 'Nội dung mới...'
      }]
    })
  }

  const removeSection = (index) => {
    if (!confirm('Xóa mục này?')) return
    const content = getCurrentContent()
    const newSections = content.sections.filter((_, i) => i !== index)
    setCurrentContent({ ...content, sections: newSections })
  }

  const toggleSection = (index) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin')
  }

  const iconOptions = activeTab === 'terms' 
    ? [
        { value: 'check', label: '✓ Check' },
        { value: 'shield', label: '🛡 Shield' },
        { value: 'user', label: '👤 User' },
        { value: 'info', label: 'ℹ Info' }
      ]
    : [
        { value: 'database', label: '💾 Database' },
        { value: 'lock', label: '🔒 Lock' },
        { value: 'cookie', label: '🍪 Cookie' },
        { value: 'shield', label: '🛡 Shield' },
        { value: 'user', label: '👤 User' },
        { value: 'email', label: '✉ Email' }
      ]

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
    { label: 'Cài đặt', icon: FiSettings, path: '/admin/settings', active: true },
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
            <h2 className="text-base md:text-xl font-semibold text-white truncate">Cài đặt nội dung</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm md:text-base flex-shrink-0 disabled:opacity-50"
          >
            <FiSave className={saving ? 'animate-pulse' : ''} />
            <span className="hidden sm:inline">{saving ? 'Đang lưu...' : 'Lưu'}</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'terms'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  📄 Điều khoản sử dụng
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'privacy'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  🔒 Chính sách bảo mật
                </button>
              </div>

              {/* Editor */}
              <div className="space-y-6">
                {/* Title */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <label className="block text-white/60 text-sm mb-2">Tiêu đề trang</label>
                  <input
                    type="text"
                    value={getCurrentContent()?.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg font-semibold focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Các mục nội dung</h3>
                    <button
                      onClick={addSection}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all text-sm"
                    >
                      <FiPlus />
                      Thêm mục
                    </button>
                  </div>

                  {getCurrentContent()?.sections?.map((section, index) => (
                    <motion.div
                      key={index}
                      layout
                      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                    >
                      {/* Section Header */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
                            {section.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); removeSection(index) }}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          {expandedSections[index] ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>

                      {/* Section Content */}
                      <AnimatePresence>
                        {expandedSections[index] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-4 space-y-4">
                              {/* Icon selector */}
                              <div>
                                <label className="block text-white/60 text-sm mb-2">Icon</label>
                                <select
                                  value={section.icon}
                                  onChange={(e) => handleSectionChange(index, 'icon', e.target.value)}
                                  className="w-full md:w-48 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                >
                                  {iconOptions.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-slate-800">
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Title */}
                              <div>
                                <label className="block text-white/60 text-sm mb-2">Tiêu đề mục</label>
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                                />
                              </div>

                              {/* Content */}
                              <div>
                                <label className="block text-white/60 text-sm mb-2">Nội dung (hỗ trợ xuống dòng)</label>
                                <textarea
                                  value={section.content}
                                  onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                  rows={6}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none resize-y"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Preview Link */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/60 text-sm">
                    Xem trước: {' '}
                    <a 
                      href={activeTab === 'terms' ? '/terms' : '/privacy'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      {activeTab === 'terms' ? '/terms' : '/privacy'}
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminSettings
