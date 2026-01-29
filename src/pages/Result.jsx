import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaBrain, FaHeart, FaTrophy, FaChartLine, FaShare, 
  FaRedo, FaDownload, FaStar, FaArrowUp, FaArrowDown,
  FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa'
import api from '../services/api'

const Result = () => {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResult()
  }, [sessionId])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/sessions/${sessionId}`)
      setResult(response.data)
    } catch (error) {
      console.error('Error fetching result:', error)
      // Show error message
      setResult({
        error: true,
        message: 'Không thể tải kết quả. Vui lòng hoàn thành nhiệm vụ trước!'
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 130) return 'from-yellow-400 to-orange-500'
    if (score >= 115) return 'from-green-400 to-emerald-500'
    if (score >= 100) return 'from-blue-400 to-cyan-500'
    if (score >= 85) return 'from-purple-400 to-pink-500'
    return 'from-slate-400 to-slate-500'
  }

  const getScoreLabel = (score) => {
    if (score >= 130) return { text: 'Xuất sắc', emoji: '🏆' }
    if (score >= 115) return { text: 'Trên trung bình', emoji: '⭐' }
    if (score >= 100) return { text: 'Trung bình', emoji: '👍' }
    if (score >= 85) return { text: 'Dưới trung bình', emoji: '📈' }
    return { text: 'Cần cải thiện', emoji: '💪' }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải kết quả...</p>
        </div>
      </div>
    )
  }

  // Check for error state
  if (result?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <FaExclamationCircle className="text-3xl text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Không thể xem kết quả</h2>
          <p className="text-slate-400 mb-6">{result.message}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <FaRedo />
            Về trang chủ
          </Link>
        </motion.div>
      </div>
    )
  }

  const isIQ = result?.type === 'iq'
  const gradientFrom = isIQ ? 'from-blue-500' : 'from-orange-500'
  const gradientTo = isIQ ? 'to-purple-600' : 'to-pink-600'
  const scoreLabel = getScoreLabel(result?.score)
  const scoreGradient = getScoreColor(result?.score)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Confetti effect placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                opacity: 0
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
              className={`absolute w-3 h-3 rounded-sm ${
                ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-green-500'][i % 5]
              }`}
            />
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 
                       rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/30"
          >
            <FaTrophy className="text-5xl text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Chúc mừng!</h1>
          <p className="text-xl text-slate-400">
            Bạn đã hoàn thành bài test {result?.testName}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${scoreGradient} 
                          rounded-full opacity-20 blur-3xl`} />
          <div className={`absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br ${scoreGradient} 
                          rounded-full opacity-20 blur-3xl`} />

          <div className="relative z-10">
            {/* Score circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 553' }}
                  animate={{ strokeDasharray: `${(result?.score / 150) * 553} 553` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="text-6xl font-bold text-white"
                >
                  {result?.score}
                </motion.span>
                <span className="text-slate-400 text-sm">/ {result?.maxScore}</span>
              </div>
            </div>

            {/* Score label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <span className="text-4xl mb-2 block">{scoreLabel.emoji}</span>
              <h2 className={`text-3xl font-bold bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}>
                {scoreLabel.text}
              </h2>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{result?.correctAnswers}</div>
                <div className="text-sm text-slate-400">Câu đúng</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{result?.percentile}%</div>
                <div className="text-sm text-slate-400">Percentile</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">{result?.timeSpent}</div>
                <div className="text-sm text-slate-400">Thời gian</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FaCheckCircle className="text-green-400" />
              <span>Điểm mạnh</span>
            </h3>
            <ul className="space-y-3">
              {result?.analysis?.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Improvements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FaExclamationCircle className="text-yellow-400" />
              <span>Cần cải thiện</span>
            </h3>
            <ul className="space-y-3">
              {result?.analysis?.improvements.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <FaChartLine className="text-blue-400" />
            <span>So sánh với người khác</span>
          </h3>
          
          <div className="relative h-20 mb-4">
            {/* Scale */}
            <div className="absolute inset-x-0 top-1/2 h-2 bg-slate-700 rounded-full">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-l-full" />
            </div>
            
            {/* Markers */}
            <div className="absolute top-1/2 left-0 w-4 h-4 -translate-y-1/2 bg-slate-600 rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-y-1/2 -translate-x-1/2 bg-slate-600 rounded-full" />
            <div className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 bg-slate-600 rounded-full" />
            
            {/* Your score marker */}
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${(result?.score / 150) * 100}%` }}
              transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
                                flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <FaStar className="text-white text-sm" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 
                                bg-blue-500 rounded-lg text-white text-sm font-bold whitespace-nowrap">
                  Bạn: {result?.score}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 
                                  w-2 h-2 bg-blue-500 rotate-45" />
                </div>
              </div>
            </motion.div>
            
            {/* Average marker */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-slate-400 text-sm whitespace-nowrap">
                TB: {result?.comparison?.average}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-400 mt-8">
            <span>70</span>
            <span>100</span>
            <span>150</span>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
            <span className="text-blue-400 font-semibold">{result?.comparison?.yourRank}</span>
            <span className="text-slate-400"> người làm bài test này</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">📝 Nhận xét chi tiết</h3>
          <p className="text-slate-300 leading-relaxed">
            {result?.analysis?.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/tests/iq" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                         font-semibold text-white flex items-center justify-center space-x-2
                         shadow-lg shadow-blue-500/25"
            >
              <FaRedo />
              <span>Làm bài test khác</span>
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 bg-white/10 border border-white/20 rounded-xl 
                       font-semibold text-white flex items-center justify-center space-x-2
                       hover:bg-white/20 transition-colors"
          >
            <FaShare />
            <span>Chia sẻ kết quả</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Result
