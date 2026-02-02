import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaArrowLeft, FaArrowRight, FaClock, FaCheck, 
  FaFlag, FaBrain, FaHeart, FaPaperPlane 
} from 'react-icons/fa'
import api from '../services/api'
import { getDeviceFingerprint } from '../utils/fingerprint'
import toast from 'react-hot-toast'

const Test = () => {
  const { type, id } = useParams()
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

  const isIQ = type === 'iq'
  const gradientFrom = isIQ ? 'from-blue-500' : 'from-orange-500'
  const gradientTo = isIQ ? 'to-purple-600' : 'to-pink-600'

  useEffect(() => {
    initTest()
  }, [id])

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
        testId: id,
        fingerprint
      })
      setSessionId(sessionRes.data.sessionId)

      // Get questions
      const testRes = await api.get(`/api/tests/${id}/questions`)
      setTest(testRes.data.test)
      setQuestions(testRes.data.questions)
      setTimeLeft(testRes.data.test.duration * 60)
    } catch (error) {
      console.error('Error initializing test:', error)
      toast.error(error.response?.data?.message || 'Không thể tải bài test. Vui lòng thử lại!')
      navigate(-1) // Go back
    } finally {
      setLoading(false)
    }
  }

  const generateDemoQuestions = (type) => {
    if (type === 'iq') {
      return [
        {
          _id: '1',
          question: 'Số tiếp theo trong dãy: 2, 4, 8, 16, ?',
          options: [
            { id: 'A', text: '24' },
            { id: 'B', text: '32' },
            { id: 'C', text: '30' },
            { id: 'D', text: '20' },
          ],
        },
        {
          _id: '2',
          question: 'Nếu TẤT CẢ chó đều là động vật, và TẤT CẢ động vật đều cần ăn, thì:',
          options: [
            { id: 'A', text: 'Một số chó không cần ăn' },
            { id: 'B', text: 'Tất cả chó đều cần ăn' },
            { id: 'C', text: 'Không chó nào cần ăn' },
            { id: 'D', text: 'Không thể kết luận' },
          ],
        },
        {
          _id: '3',
          question: 'Từ nào KHÔNG cùng nhóm với các từ còn lại?',
          options: [
            { id: 'A', text: 'Cà chua' },
            { id: 'B', text: 'Khoai tây' },
            { id: 'C', text: 'Cà rốt' },
            { id: 'D', text: 'Táo' },
          ],
        },
        {
          _id: '4',
          question: 'Hoàn thành dãy: 1, 1, 2, 3, 5, 8, ?',
          options: [
            { id: 'A', text: '11' },
            { id: 'B', text: '12' },
            { id: 'C', text: '13' },
            { id: 'D', text: '10' },
          ],
        },
        {
          _id: '5',
          question: 'MÁY TÍNH : TÍNH TOÁN :: ĐIỆN THOẠI : ?',
          options: [
            { id: 'A', text: 'Nghe nhạc' },
            { id: 'B', text: 'Liên lạc' },
            { id: 'C', text: 'Chơi game' },
            { id: 'D', text: 'Chụp ảnh' },
          ],
        },
        // Add more questions to reach 20
        ...Array.from({ length: 15 }, (_, i) => ({
          _id: String(i + 6),
          question: `Câu hỏi IQ #${i + 6}: Đây là câu hỏi mẫu để test hệ thống`,
          options: [
            { id: 'A', text: 'Đáp án A' },
            { id: 'B', text: 'Đáp án B' },
            { id: 'C', text: 'Đáp án C' },
            { id: 'D', text: 'Đáp án D' },
          ],
        }))
      ]
    } else {
      return [
        {
          _id: '1',
          question: 'Khi gặp một tình huống căng thẳng, bạn thường:',
          options: [
            { id: 'A', text: 'Bình tĩnh phân tích và tìm giải pháp' },
            { id: 'B', text: 'Lo lắng nhưng cố gắng giải quyết' },
            { id: 'C', text: 'Tránh né hoặc trì hoãn' },
            { id: 'D', text: 'Dễ bị choáng ngợp và hoảng loạn' },
          ],
        },
        {
          _id: '2',
          question: 'Khi một người bạn đang buồn, bạn sẽ:',
          options: [
            { id: 'A', text: 'Lắng nghe và chia sẻ cảm xúc cùng họ' },
            { id: 'B', text: 'Đưa ra lời khuyên ngay lập tức' },
            { id: 'C', text: 'Cố gắng làm họ vui lên bằng đùa vui' },
            { id: 'D', text: 'Để họ một mình vì không biết phải làm gì' },
          ],
        },
        {
          _id: '3',
          question: 'Bạn nhận ra cảm xúc của mình như thế nào?',
          options: [
            { id: 'A', text: 'Luôn nhận biết rõ ràng và có thể gọi tên' },
            { id: 'B', text: 'Thường nhận ra sau một lúc suy nghĩ' },
            { id: 'C', text: 'Đôi khi khó phân biệt các cảm xúc' },
            { id: 'D', text: 'Hiếm khi chú ý đến cảm xúc của mình' },
          ],
        },
        {
          _id: '4',
          question: 'Khi bị chỉ trích, phản ứng đầu tiên của bạn là:',
          options: [
            { id: 'A', text: 'Lắng nghe và xem xét ý kiến đó' },
            { id: 'B', text: 'Hơi khó chịu nhưng cố giữ bình tĩnh' },
            { id: 'C', text: 'Phản bác ngay lập tức' },
            { id: 'D', text: 'Cảm thấy tổn thương và thu mình lại' },
          ],
        },
        {
          _id: '5',
          question: 'Trong một cuộc tranh luận, bạn thường:',
          options: [
            { id: 'A', text: 'Cố gắng hiểu quan điểm của người khác' },
            { id: 'B', text: 'Tập trung vào việc chứng minh mình đúng' },
            { id: 'C', text: 'Dễ nổi nóng khi bị phản đối' },
            { id: 'D', text: 'Né tránh tranh luận hoàn toàn' },
          ],
        },
        // Add more EQ questions
        ...Array.from({ length: 15 }, (_, i) => ({
          _id: String(i + 6),
          question: `Câu hỏi EQ #${i + 6}: Đây là câu hỏi mẫu về cảm xúc`,
          options: [
            { id: 'A', text: 'Luôn luôn' },
            { id: 'B', text: 'Thường xuyên' },
            { id: 'C', text: 'Đôi khi' },
            { id: 'D', text: 'Hiếm khi' },
          ],
        }))
      ]
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải bài test...</p>
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
              <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} 
                              rounded-xl flex items-center justify-center`}>
                {isIQ ? <FaBrain className="text-xl text-white" /> : <FaHeart className="text-xl text-white" />}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{test?.name}</h1>
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
                              bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}>
                Câu {currentIndex + 1}
              </span>
              <h2 className="text-2xl font-bold text-white leading-relaxed">
                {currentQuestion?.question}
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
                                ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg` 
                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20'}`}
                  >
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold
                                    ${isSelected 
                                      ? 'bg-white/20' 
                                      : 'bg-white/10'}`}>
                      {option.id}
                    </span>
                    <span className="flex-1 text-lg">{option.text}</span>
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
                             ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white` 
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
                         bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg`}
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
                         bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg`}
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
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} 
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
                                 bg-gradient-to-r ${gradientFrom} ${gradientTo}
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

export default Test
