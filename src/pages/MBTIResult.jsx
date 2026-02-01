import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi'
import { FaExclamationCircle, FaRedo } from 'react-icons/fa'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://betraffic-production.up.railway.app'

const MBTIResult = () => {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResult()
  }, [sessionId])

  const fetchResult = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_BASE_URL}/api/tests/mbti/result/${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Không thể tải kết quả')
      }
    } catch (err) {
      console.error('Error fetching MBTI result:', err)
      setError('Không thể tải kết quả. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải kết quả MBTI...</p>
        </div>
      </div>
    )
  }

  if (error) {
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
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <FaRedo />
            Về trang chủ
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-8xl mb-4"
            >
              🧠
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {result.type}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90"
            >
              {result.result?.title}
            </motion.p>
            <p className="text-white/60 mt-2">{result.result?.nickname}</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-3">Mô tả</h2>
              <p className="text-white/70 leading-relaxed">{result.result?.description}</p>
            </motion.div>

            {/* Dimension Scores */}
            {result.dimensionScores && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Phân tích chi tiết</h2>
                <div className="grid gap-4">
                  {Object.entries(result.dimensionScores).map(([dim, data]) => {
                    const dimNames = {
                      EI: ['Hướng ngoại (E)', 'Hướng nội (I)'],
                      SN: ['Giác quan (S)', 'Trực giác (N)'],
                      TF: ['Lý trí (T)', 'Cảm xúc (F)'],
                      JP: ['Nguyên tắc (J)', 'Linh hoạt (P)']
                    }
                    const [leftLabel, rightLabel] = dimNames[dim] || ['', '']
                    const leftKey = dim[0]
                    const rightKey = dim[1]
                    const leftScore = data[leftKey] || 0
                    const rightScore = data[rightKey] || 0
                    const total = leftScore + rightScore
                    const leftPercent = total > 0 ? Math.round((leftScore / total) * 100) : 50
                    
                    return (
                      <div key={dim} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className={`${data.dominant === leftKey ? 'text-purple-400 font-semibold' : 'text-white/50'}`}>
                            {leftLabel}: {leftScore}
                          </span>
                          <span className={`${data.dominant === rightKey ? 'text-pink-400 font-semibold' : 'text-white/50'}`}>
                            {rightLabel}: {rightScore}
                          </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${leftPercent}%` }}
                          />
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500"
                            style={{ width: `${100 - leftPercent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-green-500/10 rounded-xl p-6 border border-green-500/20"
              >
                <h3 className="text-lg font-semibold text-green-400 mb-3">💪 Điểm mạnh</h3>
                <ul className="space-y-2">
                  {result.result?.strengths?.map((s, i) => (
                    <li key={i} className="text-white/70 flex items-center gap-2">
                      <span className="text-green-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20"
              >
                <h3 className="text-lg font-semibold text-orange-400 mb-3">⚡ Điểm cần cải thiện</h3>
                <ul className="space-y-2">
                  {result.result?.weaknesses?.map((w, i) => (
                    <li key={i} className="text-white/70 flex items-center gap-2">
                      <span className="text-orange-400">•</span> {w}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Careers */}
            {result.result?.careers && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">🎯 Nghề nghiệp phù hợp</h3>
                <div className="flex flex-wrap gap-2">
                  {result.result.careers.map((c, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Compatibility */}
            {result.result?.compatibility && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">❤️ Tương hợp với</h3>
                <div className="flex gap-3">
                  {result.result.compatibility.map((c, i) => (
                    <span key={i} className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Stats */}
            {result.result?.percentage && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="text-white/50">Tỷ lệ dân số</span>
                <span className="text-2xl font-bold text-purple-400">{result.result.percentage}</span>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Link
                to="/"
                className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-white text-center transition-all"
              >
                <FiArrowLeft className="inline mr-2" />
                Về trang chủ
              </Link>
              <Link
                to="/mbti"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all text-center"
              >
                <FiRefreshCw className="inline mr-2" />
                Làm lại
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MBTIResult
