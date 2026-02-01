import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiArrowLeft, FiArrowRight, FiCheckCircle, FiRefreshCw } from 'react-icons/fi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://betraffic-production.up.railway.app'

const MBTITest = () => {
  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch test data
  useEffect(() => {
    fetchTest()
  }, [])

  const fetchTest = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/tests/mbti/start`)
      const data = await response.json()
      
      if (data.success) {
        setTestData(data.test)
        setQuestions(data.questions)
        setTimeLeft(data.test.duration * 60)
      }
    } catch (error) {
      console.error('Error fetching MBTI test:', error)
    } finally {
      setLoading(false)
    }
  }

  // Timer
  useEffect(() => {
    if (loading || showResult) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [loading, showResult])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
    
    // Auto next after small delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      }
    }, 300)
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    try {
      setSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/tests/mbti/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        setShowResult(true)
      }
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setShowResult(false)
    setResult(null)
    setAnswers({})
    setCurrentQuestion(0)
    fetchTest()
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/60">Đang tải bài test MBTI...</p>
        </div>
      </div>
    )
  }

  // Result Screen
  if (showResult && result) {
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
                {result.result.title}
              </motion.p>
              <p className="text-white/60 mt-2">{result.result.nickname}</p>
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
                <p className="text-white/70 leading-relaxed">{result.result.description}</p>
              </motion.div>

              {/* Dimension Scores */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Phân tích chi tiết</h2>
                <div className="grid gap-4">
                  {Object.entries(result.dimensionScores).map(([dim, data], idx) => {
                    const dimNames = {
                      EI: ['Hướng ngoại (E)', 'Hướng nội (I)'],
                      SN: ['Giác quan (S)', 'Trực giác (N)'],
                      TF: ['Lý trí (T)', 'Cảm xúc (F)'],
                      JP: ['Nguyên tắc (J)', 'Linh hoạt (P)']
                    }
                    const [leftLabel, rightLabel] = dimNames[dim]
                    const leftKey = dim[0]
                    const rightKey = dim[1]
                    const leftScore = data[leftKey]
                    const rightScore = data[rightKey]
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
                    {result.result.strengths?.map((s, i) => (
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
                    {result.result.weaknesses?.map((w, i) => (
                      <li key={i} className="text-white/70 flex items-center gap-2">
                        <span className="text-orange-400">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Careers */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">🎯 Nghề nghiệp phù hợp</h3>
                <div className="flex flex-wrap gap-2">
                  {result.result.careers?.map((c, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Compatibility */}
              {result.result.compatibility && (
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
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="text-white/50">Tỷ lệ dân số</span>
                <span className="text-2xl font-bold text-purple-400">{result.result.percentage}</span>
              </motion.div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Link
                  to="/"
                  className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-white text-center transition-all"
                >
                  <FiArrowLeft className="inline mr-2" />
                  Về trang chủ
                </Link>
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  <FiRefreshCw className="inline mr-2" />
                  Làm lại
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Test Screen
  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-white/60 hover:text-white flex items-center gap-2">
            <FiArrowLeft /> Thoát
          </Link>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
          }`}>
            <FiClock />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Tiến độ: {answeredCount}/{questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          >
            {/* Question number and dimension */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {currentQuestion + 1}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">
                {question?.dimension === 'EI' && 'Hướng ngoại / Hướng nội'}
                {question?.dimension === 'SN' && 'Giác quan / Trực giác'}
                {question?.dimension === 'TF' && 'Lý trí / Cảm xúc'}
                {question?.dimension === 'JP' && 'Nguyên tắc / Linh hoạt'}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-xl text-white font-medium mb-8 leading-relaxed">
              {question?.question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {question?.options.map((option) => {
                const isSelected = answers[question.id] === option.id
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(question.id, option.id)}
                    className={`w-full p-5 rounded-xl text-left transition-all border-2 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-transparent hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isSelected 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {option.id}
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {isSelected && <FiCheckCircle className="text-purple-400 text-xl" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white transition-all flex items-center gap-2"
          >
            <FiArrowLeft /> Trước
          </button>

          {/* Question dots */}
          <div className="flex gap-1 flex-wrap justify-center max-w-md">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentQuestion
                    ? 'bg-purple-500 scale-125'
                    : answers[q.id]
                      ? 'bg-green-500'
                      : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < 20 || submitting}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              {submitting ? 'Đang xử lý...' : 'Xem kết quả'} <FiCheckCircle />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all flex items-center gap-2"
            >
              Tiếp <FiArrowRight />
            </button>
          )}
        </div>

        {/* Submit hint */}
        {answeredCount >= 20 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-white/50 text-sm mb-3">
              Bạn đã trả lời {answeredCount}/{questions.length} câu. Có thể xem kết quả ngay hoặc tiếp tục.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-300 transition-all text-sm"
            >
              Xem kết quả ngay
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MBTITest
