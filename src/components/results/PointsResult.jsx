import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaChartPie, FaCheckCircle, FaTimesCircle, FaQuestionCircle,
  FaChevronDown, FaLightbulb, FaRedo, FaShare, FaHome,
  FaThumbsUp, FaThumbsDown, FaTrophy, FaMedal, FaStar
} from 'react-icons/fa'
import MathText from '../MathText'

/**
 * PointsResult - Result layout for point-based scoring
 * Shows score = correctCount × pointsPerQuestion
 */
const PointsResult = ({ result }) => {
  const [showQuestionDetails, setShowQuestionDetails] = useState(false)
  const [questionFilter, setQuestionFilter] = useState('all')

  const labels = result.labels || {}
  const displayOptions = result.displayOptions || {}
  const theme = result.theme || {}
  const pointsConfig = result.pointsConfig || {}

  // Get values
  const score = result.score || 0
  const maxScore = result.maxScore || 100
  const correctAnswers = result.correctAnswers || 0
  const totalQuestions = result.totalQuestions || 0
  const wrongAnswers = result.wrongAnswers || 0
  const unanswered = result.unanswered || 0
  const pointsPerQuestion = pointsConfig.pointsPerQuestion || result.pointsPerQuestion || 10
  const passingScore = pointsConfig.passingScore || 0

  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const isPassed = passingScore > 0 ? score >= passingScore : percent >= 50

  const getScoreColor = () => {
    if (percent >= 90) return 'from-yellow-400 to-orange-500'
    if (percent >= 70) return 'from-green-400 to-emerald-500'
    if (percent >= 50) return 'from-blue-400 to-cyan-500'
    if (percent >= 30) return 'from-purple-400 to-pink-500'
    return 'from-red-400 to-rose-500'
  }

  const getScoreLabel = () => {
    if (percent >= 90) return { text: 'Xuất sắc', emoji: '🏆' }
    if (percent >= 70) return { text: 'Giỏi', emoji: '⭐' }
    if (percent >= 50) return { text: 'Khá', emoji: '👍' }
    if (percent >= 30) return { text: 'Trung bình', emoji: '📚' }
    return { text: 'Cần cố gắng', emoji: '💪' }
  }

  const scoreGradient = getScoreColor()
  const scoreLabel = getScoreLabel()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${isPassed ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500'} 
                       rounded-full flex items-center justify-center shadow-2xl ${isPassed ? 'shadow-green-500/30' : 'shadow-red-500/30'}`}
          >
            {isPassed ? (
              <FaTrophy className="text-5xl text-white" />
            ) : (
              <FaMedal className="text-5xl text-white" />
            )}
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isPassed ? (labels.passTitle || 'Chúc mừng!') : (labels.failTitle || 'Hoàn thành!')}
          </h1>
          <p className="text-xl text-slate-400">
            {labels.completedTest || 'Bạn đã hoàn thành bài test'} <span className="text-white font-semibold">{result?.testName}</span>
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8 text-center relative overflow-hidden"
        >
          <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${scoreGradient} 
                          rounded-full opacity-20 blur-3xl`} />
          <div className={`absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br ${scoreGradient} 
                          rounded-full opacity-20 blur-3xl`} />

          <div className="relative z-10">
            {/* Score circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-700"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={553}
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * percent) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={percent >= 70 ? "#4ade80" : percent >= 50 ? "#60a5fa" : "#f97316"} />
                    <stop offset="100%" stopColor={percent >= 70 ? "#22c55e" : percent >= 50 ? "#3b82f6" : "#ea580c"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className={`text-5xl font-bold bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {score}
                </motion.span>
                <span className="text-slate-400 text-lg">/ {maxScore} điểm</span>
              </div>
            </div>

            {/* Score label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${scoreGradient}`}
            >
              <span className="text-2xl">{scoreLabel.emoji}</span>
              <span className="text-xl font-bold text-white">{scoreLabel.text}</span>
            </motion.div>

            {/* Pass/Fail indicator */}
            {passingScore > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isPassed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {isPassed ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'}</span>
                <span className="text-sm opacity-75">(Yêu cầu: {passingScore} điểm)</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">{correctAnswers}</div>
            <div className="text-xs text-green-400 flex items-center justify-center gap-1">
              <FaCheckCircle /> Đúng
            </div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">{wrongAnswers}</div>
            <div className="text-xs text-red-400 flex items-center justify-center gap-1">
              <FaTimesCircle /> Sai
            </div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">{unanswered}</div>
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <FaQuestionCircle /> Bỏ qua
            </div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-white">{pointsPerQuestion}</div>
            <div className="text-xs text-blue-400 flex items-center justify-center gap-1">
              <FaStar /> Điểm/câu
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaChartPie className="text-purple-400" />
            {labels.breakdown || 'Chi tiết điểm'}
          </h3>
          
          <div className="space-y-4">
            {/* Score bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Điểm đạt được</span>
                <span className="text-white">{score} / {maxScore} ({percent}%)</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className={`h-full bg-gradient-to-r ${scoreGradient} rounded-full`}
                />
              </div>
            </div>

            {/* Formula */}
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm mb-2">Công thức tính điểm:</div>
              <div className="text-white font-mono">
                <span className="text-green-400">{correctAnswers}</span> câu đúng × 
                <span className="text-blue-400"> {pointsPerQuestion}</span> điểm = 
                <span className="text-yellow-400 font-bold"> {score}</span> điểm
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Details */}
        {(pointsConfig.showQuestionReview !== false) && result.questionDetails && result.questionDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card mb-8 overflow-hidden"
          >
            <button
              onClick={() => setShowQuestionDetails(!showQuestionDetails)}
              className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold flex items-center gap-2">
                <FaChartPie className="text-purple-400" />
                {labels.questionDetails || 'Chi tiết câu hỏi'}
              </span>
              <motion.div animate={{ rotate: showQuestionDetails ? 180 : 0 }}>
                <FaChevronDown />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showQuestionDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-700"
                >
                  {/* Filter buttons */}
                  <div className="p-4 border-b border-slate-700 flex gap-2 flex-wrap">
                    {[
                      { id: 'all', label: 'Tất cả', count: totalQuestions },
                      { id: 'correct', label: 'Đúng', count: correctAnswers, color: 'text-green-400' },
                      { id: 'wrong', label: 'Sai', count: wrongAnswers, color: 'text-red-400' },
                      { id: 'unanswered', label: 'Bỏ qua', count: unanswered, color: 'text-gray-400' }
                    ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setQuestionFilter(filter.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          questionFilter === filter.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <span className={filter.color}>{filter.label}</span>
                        <span className="ml-1 opacity-60">({filter.count})</span>
                      </button>
                    ))}
                  </div>

                  {/* Questions list */}
                  <div className="max-h-96 overflow-y-auto">
                    {result.questionDetails
                      .filter(q => {
                        if (questionFilter === 'all') return true
                        if (questionFilter === 'correct') return q.isCorrect
                        if (questionFilter === 'wrong') return !q.isCorrect && q.userAnswer
                        if (questionFilter === 'unanswered') return !q.userAnswer
                        return true
                      })
                      .map((q, idx) => (
                        <div
                          key={q.id || idx}
                          className={`p-4 border-b border-slate-700/50 ${
                            q.isCorrect ? 'bg-green-500/5' : q.userAnswer ? 'bg-red-500/5' : 'bg-gray-500/5'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              q.isCorrect 
                                ? 'bg-green-500/20 text-green-400' 
                                : q.userAnswer 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {q.isCorrect ? <FaCheckCircle /> : q.userAnswer ? <FaTimesCircle /> : <FaQuestionCircle />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-400 mb-1">Câu {q.index || idx + 1}</div>
                              <div className="text-white mb-2">
                                <MathText text={q.question} />
                              </div>
                              <div className="flex flex-wrap gap-2 text-sm">
                                {q.userAnswer && (
                                  <span className={`px-2 py-1 rounded ${q.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    Bạn chọn: {q.userAnswer}
                                  </span>
                                )}
                                {!q.isCorrect && (
                                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                    Đáp án: {q.correctAnswer}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              <span className={q.isCorrect ? 'text-green-400' : 'text-red-400'}>
                                {q.isCorrect ? `+${pointsPerQuestion}` : '0'} điểm
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to={`/test/${result.testId}`}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                     text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <FaRedo /> {labels.retryButton || 'Làm lại'}
          </Link>
          <button
            onClick={() => {
              const text = `Tôi đạt ${score}/${maxScore} điểm (${percent}%) - ${scoreLabel.text}! 🎉`
              if (navigator.share) {
                navigator.share({ title: result.testName, text, url: window.location.href })
              } else {
                navigator.clipboard.writeText(text)
                alert('Đã copy kết quả!')
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold 
                     rounded-xl hover:bg-slate-600 transition-all"
          >
            <FaShare /> {labels.shareButton || 'Chia sẻ'}
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-gray-300 font-semibold 
                     rounded-xl hover:bg-slate-700 transition-all"
          >
            <FaHome /> {labels.homeButton || 'Về trang chủ'}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default PointsResult
