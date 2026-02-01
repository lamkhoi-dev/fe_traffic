import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaArrowLeft, FaArrowRight, FaClock, FaCheck, 
  FaFlag, FaGraduationCap, FaPaperPlane 
} from 'react-icons/fa'
import api from '../services/api'
import { getDeviceFingerprint } from '../utils/fingerprint'
import toast from 'react-hot-toast'
import { 
  GRADE_CONFIG, SUBJECTS, getSourceGrade, isBorrowedGrade 
} from '../utils/gradeConfig'
import MathText from '../components/MathText'

const GradeTest = () => {
  const { gradeNum, subjectId, testId } = useParams()
  const navigate = useNavigate()
  
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const grade = parseInt(gradeNum)
  const gradeConfig = GRADE_CONFIG[grade]
  const subject = SUBJECTS[subjectId]
  const sourceGrade = getSourceGrade(grade)
  const isBorrowed = isBorrowedGrade(grade)

  useEffect(() => {
    initTest()
  }, [testId])

  useEffect(() => {
    if (timeLeft <= 0) return

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
  }, [timeLeft])

  const initTest = async () => {
    try {
      setLoading(true)
      const fingerprint = await getDeviceFingerprint()
      
      // Start session
      const sessionRes = await api.post('/api/sessions/start', {
        testId: testId,
        fingerprint
      })
      setSessionId(sessionRes.data.sessionId)

      // Get questions
      const testRes = await api.get(`/api/tests/${testId}/questions`)
      setTest(testRes.data.test)
      setQuestions(testRes.data.questions)
      setTimeLeft(testRes.data.test.duration * 60)
    } catch (error) {
      console.error('Error initializing test:', error)
      // Demo data fallback
      const demoQuestions = generateDemoQuestions()
      setTest({
        _id: testId,
        name: `Đề kiểm tra ${subject?.name || 'Môn học'} ${gradeConfig?.name || 'Lớp'}`,
        duration: 45,
        questionCount: 20
      })
      setQuestions(demoQuestions)
      setTimeLeft(45 * 60)
      setSessionId('demo-session-' + Date.now())
    } finally {
      setLoading(false)
    }
  }

  const generateDemoQuestions = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      _id: String(i + 1),
      question: `Câu hỏi mẫu #${i + 1}: Đây là câu hỏi kiểm tra cho môn ${subject?.name || 'học'} ${gradeConfig?.name || ''}`,
      options: [
        { id: 'A', text: 'Đáp án A' },
        { id: 'B', text: 'Đáp án B' },
        { id: 'C', text: 'Đáp án C' },
        { id: 'D', text: 'Đáp án D' },
      ],
    }))
  }

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
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const fingerprint = await getDeviceFingerprint()
      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))

      const response = await api.post('/api/sessions/submit', {
        sessionId,
        answers: answersArray,
        fingerprint
      })

      if (response.data.success) {
        toast.success('Nộp bài thành công!')
        navigate(`/task/${sessionId}`)
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi nộp bài!')
    } finally {
      setSubmitting(false)
      setShowConfirmModal(false)
    }
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  const gradientFrom = subject?.color?.split(' ')[0] || 'from-blue-500'
  const gradientTo = subject?.color?.split(' ')[1] || 'to-purple-600'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    )
  }

  if (!gradeConfig || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy bài kiểm tra</h2>
          <Link to="/grades" className="text-blue-400 hover:text-blue-300">
            ← Quay về chọn lớp
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} 
                              rounded-xl flex items-center justify-center`}>
                <span className="text-2xl">{subject.icon}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {subject.name} - {gradeConfig.name}
                </h1>
                <p className="text-sm text-slate-400">
                  Câu {currentIndex + 1} / {questions.length}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl 
                            ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
              <FaClock className={timeLeft < 60 ? 'animate-pulse' : ''} />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Tiến độ</span>
              <span>{answeredCount} / {questions.length} câu đã trả lời</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 mb-6"
          >
            {/* Question */}
            <div className="mb-8">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4
                              bg-gradient-to-r ${subject.color} text-white`}>
                Câu {currentIndex + 1}
              </span>
              <h2 className="text-2xl font-bold text-white leading-relaxed">
                <MathText>{currentQuestion?.question}</MathText>
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion?.options.map((option, index) => {
                const isSelected = answers[currentQuestion._id] === option.id
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(currentQuestion._id, option.id)}
                    className={`w-full p-5 rounded-xl text-left transition-all duration-300 flex items-center space-x-4
                              ${isSelected 
                                ? `bg-gradient-to-r ${subject.color} text-white shadow-lg` 
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20'}`}
                  >
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold
                                    ${isSelected 
                                      ? 'bg-white/20' 
                                      : 'bg-white/10'}`}>
                      {option.id}
                    </span>
                    <span className="flex-1 text-lg"><MathText>{option.text}</MathText></span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <FaCheck />
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2
                       ${currentIndex === 0 
                         ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                         : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <FaArrowLeft />
            <span>Câu trước</span>
          </motion.button>

          {/* Question dots */}
          <div className="hidden md:flex items-center space-x-2 flex-wrap justify-center max-w-md">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                           ${i === currentIndex 
                             ? `bg-gradient-to-r ${subject.color} text-white` 
                             : answers[q._id] 
                               ? 'bg-green-500/30 text-green-400' 
                               : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfirmModal(true)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2
                         bg-gradient-to-r ${subject.color} text-white shadow-lg`}
            >
              <FaPaperPlane />
              <span>Nộp bài</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2
                         bg-gradient-to-r ${subject.color} text-white shadow-lg`}
            >
              <span>Câu tiếp</span>
              <FaArrowRight />
            </motion.button>
          )}
        </div>

        {/* Confirm Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="glass-card p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${subject.color} 
                                  rounded-2xl flex items-center justify-center`}>
                    <FaFlag className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Xác nhận nộp bài?</h3>
                  <p className="text-slate-400 mb-6">
                    Bạn đã trả lời {answeredCount} / {questions.length} câu hỏi.
                    {answeredCount < questions.length && (
                      <span className="block text-yellow-400 mt-2">
                        ⚠️ Còn {questions.length - answeredCount} câu chưa trả lời!
                      </span>
                    )}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 py-3 bg-white/10 rounded-xl font-semibold text-white 
                                 hover:bg-white/20 transition-colors"
                    >
                      Tiếp tục làm
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={`flex-1 py-3 rounded-xl font-semibold text-white 
                                 bg-gradient-to-r ${subject.color}
                                 disabled:opacity-50`}
                    >
                      {submitting ? 'Đang nộp...' : 'Nộp bài'}
                    </motion.button>
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

export default GradeTest
