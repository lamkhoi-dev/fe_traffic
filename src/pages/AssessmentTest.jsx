import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClock, FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaTrophy, FaRedo, FaHome, FaList } from 'react-icons/fa'
import { HiAcademicCap, HiSparkles, HiLightningBolt } from 'react-icons/hi'
import MathText from '../components/MathText'

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://betraffic-production.up.railway.app')

const AssessmentTest = () => {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  // Fetch mixed questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/tests/assessment/${assessmentId}`)
        const data = await response.json()
        
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
        } else {
          setError('Không tìm thấy câu hỏi cho bài đánh giá này')
        }
      } catch (err) {
        console.error('Error fetching assessment:', err)
        setError('Lỗi khi tải bài đánh giá')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [assessmentId])

  // Timer
  useEffect(() => {
    if (showResult || loading) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showResult, loading])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const handleSubmit = useCallback(() => {
    let correct = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++
      }
    })
    setScore(correct)
    setShowResult(true)
    setShowConfirmSubmit(false)
  }, [questions, answers])

  const getGrade = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return { grade: 'Xuất sắc', color: 'text-green-400', emoji: '🏆' }
    if (percentage >= 80) return { grade: 'Giỏi', color: 'text-blue-400', emoji: '🌟' }
    if (percentage >= 70) return { grade: 'Khá', color: 'text-yellow-400', emoji: '👍' }
    if (percentage >= 60) return { grade: 'Trung bình', color: 'text-orange-400', emoji: '📚' }
    return { grade: 'Cần cố gắng', color: 'text-red-400', emoji: '💪' }
  }

  const currentQuestion = questions[currentIndex]

  // Subject colors
  const subjectColors = {
    math: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', name: 'Toán' },
    physics: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', name: 'Vật Lý' },
    english: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', name: 'Tiếng Anh' },
    history: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', name: 'Lịch Sử' },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <Link to="/assessment" className="text-purple-400 hover:underline">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    )
  }

  // Result Screen
  if (showResult) {
    const { grade, color, emoji } = getGrade(score, questions.length)
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl p-8 
                       border border-white/10 backdrop-blur-sm text-center"
          >
            {/* Trophy Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 
                         flex items-center justify-center shadow-2xl shadow-yellow-500/30 mb-6"
            >
              <FaTrophy className="text-4xl text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">Hoàn thành bài đánh giá!</h2>
            <p className="text-slate-400 mb-6">Bài Đánh Giá #{assessmentId}</p>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-700"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 553' }}
                  animate={{ strokeDasharray: `${(percentage / 100) * 553} 553` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{percentage}%</span>
                <span className="text-slate-400">Điểm số</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-slate-400">Đúng</div>
              </div>
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                <div className="text-sm text-slate-400">Sai</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-400">{questions.length}</div>
                <div className="text-sm text-slate-400">Tổng</div>
              </div>
            </div>

            {/* Grade */}
            <div className={`text-2xl font-bold mb-6 ${color}`}>
              {emoji} {grade}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/assessment/${assessmentId}`}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                           bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium
                           hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <FaRedo />
                Làm lại
              </Link>
              <Link
                to="/assessment"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                           bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                <FaList />
                Danh sách bài thi
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                           bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
              >
                <FaHome />
                Trang chủ
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 p-4 rounded-2xl 
                     bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 
                            flex items-center justify-center">
              <HiAcademicCap className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Bài Đánh Giá #{assessmentId}</h1>
              <p className="text-sm text-slate-400">Tổng hợp 4 môn • Lớp 10-12</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xl font-bold
                          ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white'}`}>
            <FaClock />
            {formatTime(timeLeft)}
          </div>
        </motion.div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Câu {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-slate-400">
              Đã trả lời: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 
                       border border-white/10 mb-6"
          >
            {/* Subject & Grade Badge */}
            <div className="flex items-center gap-2 mb-4">
              {currentQuestion?.subject && (
                <span className={`px-3 py-1 rounded-lg text-sm font-medium border
                                ${subjectColors[currentQuestion.subject]?.bg || 'bg-white/10'}
                                ${subjectColors[currentQuestion.subject]?.text || 'text-white'}
                                ${subjectColors[currentQuestion.subject]?.border || 'border-white/20'}`}>
                  {subjectColors[currentQuestion.subject]?.name || currentQuestion.subject}
                </span>
              )}
              {currentQuestion?.grade && (
                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/10 text-slate-300 border border-white/20">
                  Lớp {currentQuestion.grade}
                </span>
              )}
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
              <span className="text-purple-400 mr-2">Q{currentIndex + 1}.</span>
              <MathText>{currentQuestion?.question}</MathText>
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(currentIndex, idx)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3
                    ${answers[currentIndex] === idx
                      ? 'bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 border-2 border-purple-500'
                      : 'bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10'
                    }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${answers[currentIndex] === idx
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-slate-400'
                    }`}>
                    {option.id || String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`flex-1 ${answers[currentIndex] === idx ? 'text-white' : 'text-slate-300'}`}>
                    <MathText>{option.text || option}</MathText>
                  </span>
                  {answers[currentIndex] === idx && (
                    <FaCheck className="text-purple-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white 
                       hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaArrowLeft />
            Câu trước
          </button>

          <div className="flex items-center gap-2">
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl 
                           bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium
                           hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                <FaCheck />
                Nộp bài
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-3 rounded-xl 
                           bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium
                           hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Câu tiếp
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800/50 border border-white/10">
          <p className="text-sm text-slate-400 mb-3">Chọn nhanh câu hỏi:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all
                  ${idx === currentIndex
                    ? 'bg-purple-500 text-white'
                    : answers[idx] !== undefined
                      ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-slate-400 hover:bg-white/20'
                  }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Submit Modal */}
        <AnimatePresence>
          {showConfirmSubmit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full 
                           border border-white/10"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                    <HiLightningBolt className="text-3xl text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Xác nhận nộp bài?</h3>
                  <p className="text-slate-400 mb-4">
                    Bạn đã trả lời {Object.keys(answers).length}/{questions.length} câu hỏi.
                    {Object.keys(answers).length < questions.length && (
                      <span className="text-yellow-400 block mt-1">
                        Còn {questions.length - Object.keys(answers).length} câu chưa trả lời!
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowConfirmSubmit(false)}
                      className="px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 
                                 text-white font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
                    >
                      Nộp bài
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AssessmentTest
