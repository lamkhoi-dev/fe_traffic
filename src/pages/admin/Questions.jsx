import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiList, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX,
  FiPieChart, FiGlobe, FiFileText, FiLogOut, FiMenu,
  FiChevronDown, FiChevronUp, FiImage, FiTrendingUp, FiBarChart2, FiSettings
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

const AdminQuestions = () => {
  const [tests, setTests] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedTest, setSelectedTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [searchParams] = useSearchParams()
  const [typeFilter, setTypeFilter] = useState('all')
  const [showTestDropdown, setShowTestDropdown] = useState(false)
  const [testSearch, setTestSearch] = useState('')
  
  const [formData, setFormData] = useState({
    type: 'single_choice',
    question: '',
    image: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ],
    correctAnswer: 'A',
    points: 5,
    explanation: ''
  })
  
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchTests()
  }, [navigate])

  useEffect(() => {
    const testId = searchParams.get('testId')
    if (testId && tests.length > 0) {
      const test = tests.find(t => t._id === testId)
      if (test) {
        setSelectedTest(test)
        fetchQuestions(testId)
      }
    }
  }, [searchParams, tests])

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

  const fetchQuestions = async (testId) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/questions/test/${testId}`)
      setQuestions(response.data.questions || [])
    } catch (error) {
      toast.error('Không thể tải câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTest = (test) => {
    setSelectedTest(test)
    setQuestions([])
    fetchQuestions(test._id)
    navigate(`/admin/questions?testId=${test._id}`, { replace: true })
    setShowTestDropdown(false)
    setTestSearch('')
  }

  // Get unique test types for filter
  const testTypes = [...new Set(tests.map(t => t.type))].sort()
  
  // Filter tests by type and search
  const filteredTests = tests.filter(t => {
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchSearch = !testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase())
    return matchType && matchSearch
  })

  // Type label helper
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
      'mbti': 'MBTI',
    }
    return labels[type?.toLowerCase()] || type?.toUpperCase()
  }

  const getTypeColor = (type) => {
    const colors = {
      'iq': 'bg-purple-500/30 text-purple-300',
      'eq': 'bg-pink-500/30 text-pink-300',
      'toan': 'bg-blue-500/30 text-blue-300',
      'ly': 'bg-yellow-500/30 text-yellow-300',
      'hoa': 'bg-green-500/30 text-green-300',
      'mbti': 'bg-cyan-500/30 text-cyan-300',
    }
    return colors[type?.toLowerCase()] || 'bg-slate-500/30 text-slate-300'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate options
    const filledOptions = formData.options.filter(o => o.text.trim())
    if (filledOptions.length < 2) {
      toast.error('Cần ít nhất 2 đáp án')
      return
    }
    
    try {
      const payload = {
        ...formData,
        testId: selectedTest._id,
        options: formData.options.filter(o => o.text.trim())
      }
      
      if (editingQuestion) {
        await api.put(`/api/questions/${editingQuestion._id}`, payload)
        toast.success('Cập nhật câu hỏi thành công!')
      } else {
        await api.post('/api/questions', payload)
        toast.success('Thêm câu hỏi thành công!')
      }
      
      setShowModal(false)
      setEditingQuestion(null)
      resetForm()
      fetchQuestions(selectedTest._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    
    // Ensure 4 options
    const options = [...question.options]
    while (options.length < 4) {
      options.push({ id: String.fromCharCode(65 + options.length), text: '' })
    }
    
    setFormData({
      type: question.type,
      question: question.question,
      image: question.image || '',
      options,
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (questionId) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return
    try {
      await api.delete(`/api/questions/${questionId}`)
      toast.success('Xóa câu hỏi thành công!')
      fetchQuestions(selectedTest._id)
    } catch (error) {
      toast.error('Không thể xóa câu hỏi')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'single_choice',
      question: '',
      image: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctAnswer: 'A',
      points: 5,
      explanation: ''
    })
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
    { label: 'Quản lý Questions', icon: FiList, path: '/admin/questions', active: true },
    { label: 'Quản lý Tasks', icon: FiBarChart2, path: '/admin/tasks' },
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-white">Quản lý Questions</h2>
          </div>
          {selectedTest && (
            <button
              onClick={() => {
                setEditingQuestion(null)
                resetForm()
                setShowModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              <FiPlus />
              Thêm Câu hỏi
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Test Selector - Compact */}
          <div className="mb-6 bg-white/5 rounded-2xl border border-white/10 p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Type Filter Pills */}
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">Loại:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      typeFilter === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    Tất cả ({tests.length})
                  </button>
                  {testTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        typeFilter === type
                          ? getTypeColor(type)
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {getTypeLabel(type)} ({tests.filter(t => t.type === type).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Dropdown */}
              <div className="flex-1 min-w-[300px] relative">
                <div
                  onClick={() => setShowTestDropdown(!showTestDropdown)}
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    showTestDropdown ? 'border-purple-500' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {selectedTest ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(selectedTest.type)}`}>
                        {getTypeLabel(selectedTest.type)}
                      </span>
                      <span className="text-white font-medium">{selectedTest.name}</span>
                      <span className="text-white/40 text-sm">({questions.length} câu)</span>
                    </div>
                  ) : (
                    <span className="text-white/40">-- Chọn Test --</span>
                  )}
                  <FiChevronDown className={`w-5 h-5 text-white/50 transition-transform ${showTestDropdown ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                  {showTestDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 top-full left-0 right-0 mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {/* Search */}
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          value={testSearch}
                          onChange={(e) => setTestSearch(e.target.value)}
                          placeholder="Tìm kiếm test..."
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Test List */}
                      <div className="max-h-64 overflow-y-auto">
                        {filteredTests.length === 0 ? (
                          <div className="p-4 text-center text-white/40 text-sm">Không tìm thấy test</div>
                        ) : (
                          filteredTests.map(test => (
                            <button
                              key={test._id}
                              onClick={() => handleSelectTest(test)}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all hover:bg-white/10 ${
                                selectedTest?._id === test._id ? 'bg-purple-500/20' : ''
                              }`}
                            >
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(test.type)}`}>
                                {getTypeLabel(test.type)}
                              </span>
                              <span className="text-white flex-1 truncate">{test.name}</span>
                              <span className="text-white/40 text-xs">{test.questionCount} câu</span>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {selectedTest ? (
            loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Câu hỏi của: {selectedTest.name}
                  </h3>
                  <span className="text-white/40 text-sm">{questions.length} câu hỏi</span>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-white/40 mb-4">Chưa có câu hỏi nào</p>
                    <button
                      onClick={() => {
                        setEditingQuestion(null)
                        resetForm()
                        setShowModal(true)
                      }}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl text-white transition-all"
                    >
                      Thêm câu hỏi đầu tiên
                    </button>
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <motion.div
                      key={q._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-white font-medium">{q.question}</p>
                            {q.image && (
                              <div className="mt-2 flex items-center gap-2 text-white/40 text-sm">
                                <FiImage className="w-4 h-4" />
                                <span>Có hình ảnh</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                            {q.points} điểm
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {q.options.map(opt => (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl text-sm ${
                              q.correctAnswer === opt.id
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 text-white/60'
                            }`}
                          >
                            <span className="font-bold mr-2">{opt.id}.</span>
                            {opt.text}
                            {q.correctAnswer === opt.id && (
                              <FiCheck className="inline-block ml-2 w-4 h-4" />
                            )}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-blue-300 text-sm">
                            <strong>Giải thích:</strong> {q.explanation}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleEdit(q)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-all text-sm"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
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
            )
          ) : (
            <div className="text-center py-12 text-white/40">
              Chọn một test để xem và quản lý câu hỏi
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
              className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {editingQuestion ? 'Chỉnh sửa Câu hỏi' : 'Thêm Câu hỏi mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Nội dung câu hỏi *</label>
                  <textarea
                    value={formData.question}
                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                    rows={3}
                    placeholder="VD: Số tiếp theo trong dãy 2, 4, 8, 16 là?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">URL hình ảnh (tùy chọn)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Các đáp án *</label>
                  <div className="space-y-2">
                    {formData.options.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, correctAnswer: opt.id })}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                            formData.correctAnswer === opt.id
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-white/40 hover:bg-white/20'
                          }`}
                        >
                          {opt.id}
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={e => {
                            const newOptions = [...formData.options]
                            newOptions[idx].text = e.target.value
                            setFormData({ ...formData, options: newOptions })
                          }}
                          placeholder={`Đáp án ${opt.id}`}
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-2">
                    Click vào chữ cái để chọn đáp án đúng (hiện tại: <span className="text-green-400 font-bold">{formData.correctAnswer}</span>)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Điểm</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.points}
                      onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) || 5 })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Loại câu hỏi</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="single_choice">Chọn 1 đáp án</option>
                      <option value="multiple_choice">Chọn nhiều đáp án</option>
                      <option value="image">Câu hỏi hình ảnh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Giải thích (tùy chọn)</label>
                  <textarea
                    value={formData.explanation}
                    onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                    rows={2}
                    placeholder="Giải thích tại sao đáp án này đúng"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
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
                    {editingQuestion ? 'Cập nhật' : 'Thêm'}
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

export default AdminQuestions
