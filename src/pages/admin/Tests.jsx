import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiFileText, FiPlus, FiEdit2, FiTrash2, 
  FiClock, FiPieChart, FiGlobe, FiBarChart2, 
  FiLogOut, FiMenu, FiX, FiEye, FiToggleLeft, FiToggleRight,
  FiList, FiTrendingUp, FiSettings
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AdminTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTest, setEditingTest] = useState(null)
  const [customType, setCustomType] = useState('')
  const [showCustomType, setShowCustomType] = useState(false)
  const [formData, setFormData] = useState({
    type: 'iq',
    name: '',
    description: '',
    duration: 15,
    questionCount: 20,
    difficulty: 'medium',
    isActive: true
  })
  const navigate = useNavigate()

  // Get unique test types from existing tests
  const existingTypes = [...new Set(tests.map(t => t.type))].filter(t => t && !['iq', 'eq'].includes(t))

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
      const response = await api.get('/api/tests?all=true')
      setTests(response.data.tests || [])
    } catch (error) {
      toast.error('Không thể tải danh sách tests')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTest) {
        await api.put(`/api/tests/${editingTest._id}`, formData)
        toast.success('Cập nhật test thành công!')
      } else {
        await api.post('/api/tests', formData)
        toast.success('Thêm test thành công!')
      }
      setShowModal(false)
      setEditingTest(null)
      setFormData({ type: 'iq', name: '', description: '', duration: 15, questionCount: 20, difficulty: 'medium', isActive: true })
      fetchTests()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (test) => {
    setEditingTest(test)
    setFormData({
      type: test.type,
      name: test.name,
      description: test.description,
      duration: test.duration,
      questionCount: test.questionCount,
      difficulty: test.difficulty,
      isActive: test.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (testId) => {
    if (!confirm('Xóa test này sẽ xóa luôn tất cả câu hỏi. Bạn có chắc?')) return
    try {
      await api.delete(`/api/tests/${testId}`)
      toast.success('Xóa test thành công!')
      fetchTests()
    } catch (error) {
      toast.error('Không thể xóa test')
    }
  }

  const handleToggleActive = async (test) => {
    try {
      await api.post(`/api/tests/${test._id}/toggle-active`)
      toast.success(test.isActive ? 'Đã ẩn test' : 'Đã kích hoạt test')
      fetchTests()
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái')
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
    const colors = {
      'iq': 'bg-gradient-to-br from-purple-500 to-blue-500',
      'eq': 'bg-gradient-to-br from-pink-500 to-orange-500',
      'toan': 'bg-gradient-to-br from-blue-500 to-cyan-500',
      'ly': 'bg-gradient-to-br from-yellow-500 to-orange-500',
      'hoa': 'bg-gradient-to-br from-green-500 to-emerald-500',
      'sinh': 'bg-gradient-to-br from-teal-500 to-green-500',
      'anh': 'bg-gradient-to-br from-red-500 to-pink-500',
      'su': 'bg-gradient-to-br from-amber-500 to-yellow-500',
      'dia': 'bg-gradient-to-br from-indigo-500 to-purple-500',
      'van': 'bg-gradient-to-br from-rose-500 to-red-500',
    }
    return colors[type.toLowerCase()] || 'bg-gradient-to-br from-slate-500 to-slate-600'
  }

  const getTypeLabel = (type) => {
    const labels = {
      'iq': 'IQ Test',
      'eq': 'EQ Test',
      'toan': 'Toán học',
      'ly': 'Vật lý',
      'hoa': 'Hóa học',
      'sinh': 'Sinh học',
      'anh': 'Tiếng Anh',
      'su': 'Lịch sử',
      'dia': 'Địa lý',
      'van': 'Ngữ văn',
    }
    return labels[type.toLowerCase()] || type.toUpperCase()
  }

  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests', active: true },
    { label: 'Quản lý Questions', icon: FiList, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiBarChart2, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
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
            onClick={() => {
              setEditingTest(null)
              setFormData({ type: 'iq', name: '', description: '', duration: 15, questionCount: 20, difficulty: 'medium', isActive: true })
              setCustomType('')
              setShowCustomType(false)
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
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
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-white/60 text-sm mb-2">Đang hoạt động</p>
                  <p className="text-3xl font-bold text-green-400">{tests.filter(t => t.isActive).length}</p>
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
                    className={`bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group ${!test.isActive && 'opacity-60'}`}
                  >
                    <div className={`h-2 ${getTypeColor(test.type)}`}></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                              {getTypeLabel(test.type)}
                            </span>
                            {!test.isActive && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">Ẩn</span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-white">{test.name}</h3>
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
                          onClick={() => navigate(`/admin/questions?testId=${test._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all text-sm"
                        >
                          <FiList className="w-4 h-4" />
                          Câu hỏi
                        </button>
                        <button
                          onClick={() => handleToggleActive(test)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all text-sm ${
                            test.isActive 
                              ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                              : 'bg-slate-500/20 hover:bg-slate-500/30 text-slate-400'
                          }`}
                          title={test.isActive ? 'Ẩn test' : 'Hiện test'}
                        >
                          {test.isActive ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(test)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-all text-sm"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(test._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition-all text-sm"
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
                  Chưa có test nào. Nhấn "Thêm Test" để bắt đầu.
                </div>
              )}
            </>
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
                {editingTest ? 'Chỉnh sửa Test' : 'Thêm Test mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Loại test *</label>
                  
                  {/* Default types: IQ and EQ */}
                  <div className="flex gap-4 mb-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                      formData.type === 'iq' && !showCustomType
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-white/10 hover:border-white/30'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="iq"
                        checked={formData.type === 'iq' && !showCustomType}
                        onChange={e => { setFormData({ ...formData, type: e.target.value }); setShowCustomType(false); }}
                        className="sr-only"
                      />
                      <span className="text-xl">🧠</span>
                      <span className="text-white font-medium text-sm">IQ</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                      formData.type === 'eq' && !showCustomType
                        ? 'border-pink-500 bg-pink-500/20' 
                        : 'border-white/10 hover:border-white/30'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="eq"
                        checked={formData.type === 'eq' && !showCustomType}
                        onChange={e => { setFormData({ ...formData, type: e.target.value }); setShowCustomType(false); }}
                        className="sr-only"
                      />
                      <span className="text-xl">❤️</span>
                      <span className="text-white font-medium text-sm">EQ</span>
                    </label>
                  </div>

                  {/* Existing custom types */}
                  {existingTypes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-white/50 text-xs mb-2">Loại đã có:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingTypes.map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => { setFormData({ ...formData, type }); setShowCustomType(false); }}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                              formData.type === type && !showCustomType
                                ? 'bg-emerald-500/30 border-2 border-emerald-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white/70 border-2 border-transparent'
                            }`}
                          >
                            {getTypeLabel(type)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add custom type */}
                  <div className="border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowCustomType(!showCustomType)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all text-sm ${
                        showCustomType
                          ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400'
                          : 'bg-white/5 border-2 border-dashed border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                      }`}
                    >
                      <span>➕</span>
                      <span>Thêm loại mới</span>
                    </button>
                    
                    {showCustomType && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={customType}
                          onChange={e => {
                            setCustomType(e.target.value)
                            setFormData({ ...formData, type: e.target.value.toLowerCase().trim() })
                          }}
                          placeholder="VD: toan, ly, hoa, anh, gdcd..."
                          className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-xl text-white focus:outline-none focus:border-cyan-500 placeholder:text-white/30"
                        />
                        <p className="text-white/40 text-xs mt-2">
                          💡 Nhập tên loại test mới (không dấu, viết thường). VD: "toan", "kinhdoanh", "luatgiaothong"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Tên test *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Trắc nghiệm IQ cơ bản"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Mô tả *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Mô tả ngắn gọn về bài test"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Thời gian (phút)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Số câu hỏi</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.questionCount}
                      onChange={e => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 20 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Độ khó</label>
                  <div className="flex gap-2">
                    {['easy', 'medium', 'hard'].map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: diff })}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          formData.difficulty === diff
                            ? getDifficultyColor(diff)
                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Trung bình' : 'Khó'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/10"
                  />
                  <label htmlFor="isActive" className="text-white/80">Kích hoạt test (hiện cho người dùng)</label>
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
                    {editingTest ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminTests
