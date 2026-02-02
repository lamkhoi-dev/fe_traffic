import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AdjustmentsHorizontalIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  SwatchIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { 
  FiPieChart, FiGlobe, FiFileText, FiBarChart2, 
  FiList, FiTrendingUp, FiEdit2, FiSettings, FiLogOut, FiX, FiSliders
} from 'react-icons/fi'
import api from '../../services/api'

export default function ResultConfig() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  
  // Edit states
  const [editingLevel, setEditingLevel] = useState(null)
  const [editingAdvice, setEditingAdvice] = useState(null)
  const [showAddLevel, setShowAddLevel] = useState(false)
  const [showAddAdvice, setShowAddAdvice] = useState(false)
  
  // Collapsed sections
  const [collapsedSections, setCollapsedSections] = useState({
    levels: false,
    advice: false,
    labels: true,
    colors: true
  })
  
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
      setLoading(true)
      const res = await api.get('/api/settings/result/config')
      setSettings(res.data.settings)
    } catch (err) {
      setError('Không thể tải cấu hình')
    } finally {
      setLoading(false)
    }
  }
  
  const saveSettings = async (updates) => {
    try {
      setSaving(true)
      setError('')
      const res = await api.put('/api/settings/result/config', updates)
      setSettings(res.data.settings)
      setSuccess('Đã lưu thay đổi!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Không thể lưu cấu hình')
    } finally {
      setSaving(false)
    }
  }
  
  const resetSettings = async () => {
    if (!confirm('Bạn có chắc muốn khôi phục cài đặt mặc định? Tất cả thay đổi sẽ bị mất.')) return
    
    try {
      setSaving(true)
      const res = await api.post('/api/settings/result/reset')
      setSettings(res.data.settings)
      setSuccess('Đã khôi phục cài đặt mặc định!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Không thể khôi phục cài đặt')
    } finally {
      setSaving(false)
    }
  }
  
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }))
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
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
    { label: 'Bài viết', icon: FiEdit2, path: '/admin/posts' },
    { label: 'Cấu hình kết quả', icon: FiSliders, path: '/admin/result-config', active: true },
    { label: 'Cài đặt', icon: FiSettings, path: '/admin/settings' },
  ]
  
  // Score Level handlers
  const handleSaveLevel = async (level, isNew = false) => {
    try {
      setSaving(true)
      if (isNew) {
        const res = await api.post('/api/settings/result/score-level', level)
        setSettings(res.data.settings)
        setShowAddLevel(false)
      } else {
        const res = await api.put(`/api/settings/result/score-level/${level._id}`, level)
        setSettings(res.data.settings)
        setEditingLevel(null)
      }
      setSuccess('Đã lưu!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('Lỗi khi lưu')
    } finally {
      setSaving(false)
    }
  }
  
  const handleDeleteLevel = async (id) => {
    if (!confirm('Xóa mức điểm này?')) return
    try {
      const res = await api.delete(`/api/settings/result/score-level/${id}`)
      setSettings(res.data.settings)
    } catch (err) {
      setError('Lỗi khi xóa')
    }
  }
  
  // Advice Range handlers
  const handleSaveAdvice = async (advice, isNew = false) => {
    try {
      setSaving(true)
      if (isNew) {
        const res = await api.post('/api/settings/result/advice-range', advice)
        setSettings(res.data.settings)
        setShowAddAdvice(false)
      } else {
        const res = await api.put(`/api/settings/result/advice-range/${advice._id}`, advice)
        setSettings(res.data.settings)
        setEditingAdvice(null)
      }
      setSuccess('Đã lưu!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('Lỗi khi lưu')
    } finally {
      setSaving(false)
    }
  }
  
  const handleDeleteAdvice = async (id) => {
    if (!confirm('Xóa khoảng lời khuyên này?')) return
    try {
      const res = await api.delete(`/api/settings/result/advice-range/${id}`)
      setSettings(res.data.settings)
    } catch (err) {
      setError('Lỗi khi xóa')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }
  
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
            className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full text-sm md:text-base"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/60 hover:text-white"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="text-white font-semibold">Cấu hình kết quả</span>
          <div className="w-10" />
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-7 h-7 text-purple-400" />
            Cấu hình trang kết quả
          </h1>
          <p className="text-gray-400 mt-1">Tùy chỉnh các mức điểm, lời khuyên và giao diện trang kết quả</p>
        </div>
        <button
          onClick={resetSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Khôi phục mặc định
        </button>
      </div>
      
      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Page Title */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
        <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề trang kết quả</label>
        <input
          type="text"
          value={settings?.pageTitle || ''}
          onChange={(e) => setSettings({ ...settings, pageTitle: e.target.value })}
          onBlur={() => saveSettings({ pageTitle: settings?.pageTitle })}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Chúc mừng! Bạn đã hoàn thành bài test"
        />
      </div>
      
      {/* Score Levels Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection('levels')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Các mức điểm</h2>
              <p className="text-sm text-gray-400">Định nghĩa các mức điểm IQ và phân tích tương ứng</p>
            </div>
          </div>
          {collapsedSections.levels ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {!collapsedSections.levels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-6 space-y-4">
                {settings?.scoreLevels?.map((level) => (
                  <ScoreLevelCard
                    key={level._id}
                    level={level}
                    isEditing={editingLevel === level._id}
                    onEdit={() => setEditingLevel(level._id)}
                    onSave={(updated) => handleSaveLevel({ ...updated, _id: level._id })}
                    onCancel={() => setEditingLevel(null)}
                    onDelete={() => handleDeleteLevel(level._id)}
                  />
                ))}
                
                {showAddLevel ? (
                  <ScoreLevelCard
                    level={{ minScore: 0, maxScore: 70, level: '', emoji: '⭐', description: '', strengths: [], improvements: [] }}
                    isEditing={true}
                    isNew={true}
                    onSave={(newLevel) => handleSaveLevel(newLevel, true)}
                    onCancel={() => setShowAddLevel(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowAddLevel(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Thêm mức điểm mới
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Advice Ranges Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection('advice')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Lời khuyên theo % đúng</h2>
              <p className="text-sm text-gray-400">Lời khuyên hiển thị dựa trên % câu trả lời đúng</p>
            </div>
          </div>
          {collapsedSections.advice ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {!collapsedSections.advice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-6 space-y-4">
                {settings?.adviceRanges?.map((range) => (
                  <AdviceRangeCard
                    key={range._id}
                    range={range}
                    isEditing={editingAdvice === range._id}
                    onEdit={() => setEditingAdvice(range._id)}
                    onSave={(updated) => handleSaveAdvice({ ...updated, _id: range._id })}
                    onCancel={() => setEditingAdvice(null)}
                    onDelete={() => handleDeleteAdvice(range._id)}
                  />
                ))}
                
                {showAddAdvice ? (
                  <AdviceRangeCard
                    range={{ minPercent: 0, maxPercent: 100, advices: [] }}
                    isEditing={true}
                    isNew={true}
                    onSave={(newRange) => handleSaveAdvice(newRange, true)}
                    onCancel={() => setShowAddAdvice(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowAddAdvice(true)}
                    className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Thêm khoảng lời khuyên mới
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Labels Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection('labels')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="w-6 h-6 text-green-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Nhãn hiển thị</h2>
              <p className="text-sm text-gray-400">Tùy chỉnh text hiển thị trên trang kết quả</p>
            </div>
          </div>
          {collapsedSections.labels ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {!collapsedSections.labels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(settings?.labels || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setSettings({
                        ...settings,
                        labels: { ...settings.labels, [key]: e.target.value }
                      })}
                      onBlur={() => saveSettings({ labels: settings.labels })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Colors Section */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SwatchIcon className="w-6 h-6 text-pink-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Màu sắc</h2>
              <p className="text-sm text-gray-400">Tùy chỉnh màu sắc cho các mức kết quả</p>
            </div>
          </div>
          {collapsedSections.colors ? (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {!collapsedSections.colors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700/50"
            >
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(settings?.colors || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-400 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setSettings({
                          ...settings,
                          colors: { ...settings.colors, [key]: e.target.value }
                        })}
                        onBlur={() => saveSettings({ colors: settings.colors })}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setSettings({
                          ...settings,
                          colors: { ...settings.colors, [key]: e.target.value }
                        })}
                        onBlur={() => saveSettings({ colors: settings.colors })}
                        className="flex-1 px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-white text-sm font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Score Level Card Component
function ScoreLevelCard({ level, isEditing, isNew, onEdit, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(level)
  const [strengthInput, setStrengthInput] = useState('')
  const [improvementInput, setImprovementInput] = useState('')
  
  useEffect(() => {
    setForm(level)
  }, [level])
  
  const addStrength = () => {
    if (!strengthInput.trim()) return
    setForm({ ...form, strengths: [...(form.strengths || []), strengthInput.trim()] })
    setStrengthInput('')
  }
  
  const removeStrength = (index) => {
    setForm({ ...form, strengths: form.strengths.filter((_, i) => i !== index) })
  }
  
  const addImprovement = () => {
    if (!improvementInput.trim()) return
    setForm({ ...form, improvements: [...(form.improvements || []), improvementInput.trim()] })
    setImprovementInput('')
  }
  
  const removeImprovement = (index) => {
    setForm({ ...form, improvements: form.improvements.filter((_, i) => i !== index) })
  }
  
  if (isEditing) {
    return (
      <div className="bg-gray-700/50 rounded-xl p-4 border border-purple-500/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Điểm tối thiểu</label>
            <input
              type="number"
              value={form.minScore}
              onChange={(e) => setForm({ ...form, minScore: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Điểm tối đa</label>
            <input
              type="number"
              value={form.maxScore}
              onChange={(e) => setForm({ ...form, maxScore: parseInt(e.target.value) || 150 })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tên mức</label>
            <input
              type="text"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              placeholder="VD: Xuất sắc"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Emoji</label>
            <input
              type="text"
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-xl"
              placeholder="🏆"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
            placeholder="Mô tả chi tiết về mức điểm này..."
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Điểm mạnh</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={strengthInput}
                onChange={(e) => setStrengthInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStrength()}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                placeholder="Thêm điểm mạnh..."
              />
              <button onClick={addStrength} className="px-3 py-2 bg-green-600 rounded-lg text-white">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {form.strengths?.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded text-sm text-green-400">
                  <span className="flex-1">{s}</span>
                  <button onClick={() => removeStrength(i)} className="text-red-400 hover:text-red-300">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cần cải thiện</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={improvementInput}
                onChange={(e) => setImprovementInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                placeholder="Thêm điểm cần cải thiện..."
              />
              <button onClick={addImprovement} className="px-3 py-2 bg-orange-600 rounded-lg text-white">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {form.improvements?.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-orange-500/10 px-2 py-1 rounded text-sm text-orange-400">
                  <span className="flex-1">{s}</span>
                  <button onClick={() => removeImprovement(i)} className="text-red-400 hover:text-red-300">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {isNew ? 'Thêm' : 'Lưu'}
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{level.emoji}</span>
          <div>
            <h3 className="font-semibold text-white">{level.level}</h3>
            <p className="text-sm text-gray-400">{level.minScore} - {level.maxScore} điểm</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-2">{level.description}</p>
      <div className="flex flex-wrap gap-2">
        {level.strengths?.slice(0, 2).map((s, i) => (
          <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">💪 {s}</span>
        ))}
        {level.strengths?.length > 2 && (
          <span className="text-xs text-gray-400">+{level.strengths.length - 2} khác</span>
        )}
      </div>
    </div>
  )
}

// Advice Range Card Component
function AdviceRangeCard({ range, isEditing, isNew, onEdit, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState(range)
  const [adviceInput, setAdviceInput] = useState('')
  
  useEffect(() => {
    setForm(range)
  }, [range])
  
  const addAdvice = () => {
    if (!adviceInput.trim()) return
    setForm({ ...form, advices: [...(form.advices || []), adviceInput.trim()] })
    setAdviceInput('')
  }
  
  const removeAdvice = (index) => {
    setForm({ ...form, advices: form.advices.filter((_, i) => i !== index) })
  }
  
  if (isEditing) {
    return (
      <div className="bg-gray-700/50 rounded-xl p-4 border border-blue-500/50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">% đúng tối thiểu</label>
            <input
              type="number"
              value={form.minPercent}
              onChange={(e) => setForm({ ...form, minPercent: parseInt(e.target.value) || 0 })}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">% đúng tối đa</label>
            <input
              type="number"
              value={form.maxPercent}
              onChange={(e) => setForm({ ...form, maxPercent: parseInt(e.target.value) || 100 })}
              min="0"
              max="100"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Lời khuyên</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={adviceInput}
              onChange={(e) => setAdviceInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAdvice()}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
              placeholder="Thêm lời khuyên (có thể dùng emoji)..."
            />
            <button onClick={addAdvice} className="px-3 py-2 bg-blue-600 rounded-lg text-white">
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {form.advices?.map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-blue-500/10 px-3 py-2 rounded text-sm text-blue-300">
                <span className="flex-1">{a}</span>
                <button onClick={() => removeAdvice(i)} className="text-red-400 hover:text-red-300">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {isNew ? 'Thêm' : 'Lưu'}
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white">{range.minPercent}% - {range.maxPercent}% đúng</h3>
          <p className="text-sm text-gray-400">{range.advices?.length || 0} lời khuyên</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {range.advices?.slice(0, 2).map((a, i) => (
          <p key={i} className="text-sm text-gray-300 truncate">• {a}</p>
        ))}
        {range.advices?.length > 2 && (
          <p className="text-xs text-gray-400">+{range.advices.length - 2} lời khuyên khác</p>
        )}
      </div>
    </div>
  )
}
