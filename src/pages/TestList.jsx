import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBrain, FaHeart, FaClock, FaQuestionCircle, FaArrowRight, FaStar, FaPlay } from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'

const TestList = () => {
  const { type } = useParams()
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isIQ = type === 'iq'
  const gradientFrom = isIQ ? 'from-blue-500' : 'from-orange-500'
  const gradientTo = isIQ ? 'to-purple-600' : 'to-pink-600'
  const glowColor = isIQ ? 'shadow-blue-500/30' : 'shadow-orange-500/30'
  const textGradient = isIQ ? 'gradient-text-iq' : 'gradient-text-eq'

  useEffect(() => {
    fetchTests()
  }, [type])

  const fetchTests = async () => {
    try {
      setLoading(true)
      setError(null)
      // Đúng endpoint: /api/tests/type/:type
      const response = await api.get(`/api/tests/type/${type}`)
      if (response.data.success && response.data.tests) {
        setTests(response.data.tests)
      } else {
        setTests([])
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
      setError('Không thể tải danh sách bài test. Vui lòng thử lại.')
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ'
      case 'medium':
        return 'Trung bình'
      case 'hard':
        return 'Khó'
      default:
        return difficulty
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} 
                        rounded-3xl flex items-center justify-center shadow-2xl ${glowColor}`}
          >
            {isIQ ? (
              <FaBrain className="text-5xl text-white" />
            ) : (
              <FaHeart className="text-5xl text-white" />
            )}
          </motion.div>
          
          <h1 className="text-5xl font-bold font-display mb-4">
            <span className="text-white">Bài test </span>
            <span className={textGradient}>{type.toUpperCase()}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {isIQ 
              ? 'Đánh giá chỉ số thông minh qua các bài test logic và suy luận'
              : 'Khám phá trí tuệ cảm xúc của bạn qua các bài test tâm lý'}
          </p>
        </motion.div>

        {/* Test Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchTests}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">Chưa có bài test {type.toUpperCase()} nào.</p>
            <Link 
              to="/"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block"
            >
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tests.map((test, index) => (
              <motion.div
                key={test._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/test/${type}/${test._id}`)}
              >
                {/* Card Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
                
                <div className="p-6">
                  {/* Test number badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} 
                                    rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border
                                     ${getDifficultyColor(test.difficulty)}`}>
                      {getDifficultyText(test.difficulty)}
                    </span>
                  </div>

                  {/* Test info */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {test.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-blue-400" />
                      <span>{test.duration} phút</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaQuestionCircle className="text-purple-400" />
                      <span>{test.questionCount} câu</span>
                    </div>
                  </div>

                  {/* Start button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} 
                               rounded-xl font-semibold text-white flex items-center justify-center 
                               space-x-2 shadow-lg ${glowColor} opacity-0 group-hover:opacity-100 
                               transition-all duration-300`}
                  >
                    <FaPlay className="text-sm" />
                    <span>Bắt đầu làm bài</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">📝 Hướng dẫn làm bài</h2>
          <div className="grid md:grid-cols-3 gap-6 text-slate-400">
            <div className="flex items-start space-x-3">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">Chọn bài test</h3>
                <p className="text-sm">Chọn bài test phù hợp với trình độ và mục tiêu của bạn</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 flex-shrink-0">
                2
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">Hoàn thành bài test</h3>
                <p className="text-sm">Trả lời 20 câu hỏi trong thời gian quy định</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 flex-shrink-0">
                3
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">Xem kết quả</h3>
                <p className="text-sm">Hoàn thành nhiệm vụ đơn giản để nhận kết quả chi tiết</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TestList
