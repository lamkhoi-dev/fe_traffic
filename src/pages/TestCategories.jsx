import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiFileText, FiArrowLeft, FiList } from 'react-icons/fi'
import api from '../services/api'

// Type label and color mappings
const typeConfig = {
  'iq': { label: 'IQ Test', icon: '🧠', color: 'from-purple-500 to-blue-500' },
  'eq': { label: 'EQ Test', icon: '❤️', color: 'from-pink-500 to-orange-500' },
  'toan': { label: 'Toán học', icon: '📐', color: 'from-blue-500 to-cyan-500' },
  'ly': { label: 'Vật lý', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  'hoa': { label: 'Hóa học', icon: '🧪', color: 'from-green-500 to-emerald-500' },
  'sinh': { label: 'Sinh học', icon: '🧬', color: 'from-teal-500 to-green-500' },
  'anh': { label: 'Tiếng Anh', icon: '🔤', color: 'from-red-500 to-pink-500' },
  'su': { label: 'Lịch sử', icon: '📜', color: 'from-amber-500 to-yellow-500' },
  'dia': { label: 'Địa lý', icon: '🌍', color: 'from-indigo-500 to-purple-500' },
  'van': { label: 'Ngữ văn', icon: '📖', color: 'from-rose-500 to-red-500' },
  'gdcd': { label: 'GDCD', icon: '⚖️', color: 'from-slate-500 to-zinc-500' },
}

const getTypeConfig = (type) => {
  return typeConfig[type.toLowerCase()] || { 
    label: type.toUpperCase(), 
    icon: '📋', 
    color: 'from-slate-500 to-slate-600' 
  }
}

const TestCategories = () => {
  const { type } = useParams()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [allCategories, setAllCategories] = useState([])

  useEffect(() => {
    fetchTests()
  }, [type])

  const fetchTests = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/tests?all=true')
      const allTests = response.data.tests || []
      
      // Get unique categories (excluding iq and eq which have their own pages)
      const categories = [...new Set(allTests.map(t => t.type))]
        .filter(t => t && !['iq', 'eq'].includes(t.toLowerCase()))
      setAllCategories(categories)
      
      // Filter by type if provided
      if (type) {
        setTests(allTests.filter(t => t.type.toLowerCase() === type.toLowerCase() && t.isActive))
      } else {
        // Show tests from custom categories only
        setTests(allTests.filter(t => !['iq', 'eq'].includes(t.type.toLowerCase()) && t.isActive))
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const currentType = type ? getTypeConfig(type) : null

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all"
          >
            <FiArrowLeft />
            <span>Về trang chủ</span>
          </Link>
          
          {currentType ? (
            <>
              <div className="text-6xl mb-4">{currentType.icon}</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Bài Thi {currentType.label}
              </h1>
              <p className="text-xl text-white/60">
                Tổng cộng {tests.length} bài thi
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📚</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Bài Thi Khác
              </h1>
              <p className="text-xl text-white/60">
                Các bài thi theo chủ đề khác
              </p>
            </>
          )}
        </motion.div>

        {/* Categories Pills (if no specific type selected) */}
        {!type && allCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <Link
              to="/categories"
              className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 
                         hover:bg-white/20 transition-all"
            >
              Tất cả ({tests.length})
            </Link>
            {allCategories.map(cat => {
              const config = getTypeConfig(cat)
              const count = tests.filter(t => t.type.toLowerCase() === cat.toLowerCase()).length
              return (
                <Link
                  key={cat}
                  to={`/categories/${cat}`}
                  className={`px-4 py-2 rounded-full bg-gradient-to-r ${config.color} text-white 
                             hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{count}</span>
                </Link>
              )
            })}
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : tests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">Chưa có bài thi nào</h2>
            <p className="text-white/60">
              {type 
                ? `Chưa có bài thi nào trong danh mục ${currentType?.label || type}`
                : 'Chưa có bài thi nào trong các danh mục khác'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test, idx) => {
              const config = getTypeConfig(test.type)
              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Link
                    to={`/test/${test.type}/${test._id}`}
                    className="block bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden 
                               border border-white/10 hover:border-white/30 transition-all group"
                  >
                    {/* Color bar */}
                    <div className={`h-2 bg-gradient-to-r ${config.color}`}></div>
                    
                    <div className="p-6">
                      {/* Type badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{config.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                            {config.label}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty === 'easy' ? 'Dễ' : test.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {test.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-white/40 text-sm">
                        <span className="flex items-center gap-1">
                          <FiFileText className="w-4 h-4" />
                          {test.questionCount} câu
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {test.duration} phút
                        </span>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className={`w-full py-2 rounded-xl bg-gradient-to-r ${config.color} text-white 
                                        text-center font-medium group-hover:shadow-lg transition-all`}>
                          Bắt đầu làm bài
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TestCategories
