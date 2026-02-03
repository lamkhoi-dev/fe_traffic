import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaChartPie, FaCheckCircle, FaTimesCircle, FaQuestionCircle,
  FaChevronDown, FaLightbulb, FaRedo, FaShare, FaHome,
  FaThumbsUp, FaThumbsDown, FaTrophy, FaMedal
} from 'react-icons/fa'
import MathText from '../MathText'

/**
 * PercentResult - Result layout for school/grade tests
 * Shows percentage correct, pass/fail, question review
 */
const PercentResult = ({ result }) => {
  const [showQuestionDetails, setShowQuestionDetails] = useState(false)
  const [questionFilter, setQuestionFilter] = useState('all')

  const labels = result.labels || {}
  const displayOptions = result.displayOptions || {}
  const theme = result.theme || {}
  const percentConfig = result.percentConfig || {}
  const percentAnalysis = result.percentAnalysis || {}

  // Calculate percent from result
  const percent = percentAnalysis.percent ?? Math.round((result.correctAnswers / result.totalQuestions) * 100)
  const passingPercent = percentConfig.passingPercent || 50
  const isPassed = percent >= passingPercent

  const getPercentColor = () => {
    if (percent >= 90) return 'from-yellow-400 to-orange-500'
    if (percent >= 70) return 'from-green-400 to-emerald-500'
    if (percent >= 50) return 'from-blue-400 to-cyan-500'
    if (percent >= 30) return 'from-purple-400 to-pink-500'
    return 'from-red-400 to-rose-500'
  }

  const getPercentLabel = () => {
    if (percentAnalysis.level && percentAnalysis.emoji) {
      return { text: percentAnalysis.level, emoji: percentAnalysis.emoji }
    }
    if (percent >= 90) return { text: 'Xuất sắc', emoji: '🏆' }
    if (percent >= 70) return { text: 'Giỏi', emoji: '⭐' }
    if (percent >= 50) return { text: 'Khá', emoji: '👍' }
    if (percent >= 30) return { text: 'Trung bình', emoji: '📚' }
    return { text: 'Yếu', emoji: '💪' }
  }

  const percentGradient = getPercentColor()
  const percentLabel = getPercentLabel()

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

        {/* Main Percent Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 mb-8 text-center relative overflow-hidden"
        >
          <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${percentGradient} 
                          rounded-full opacity-20 blur-3xl`} />
          <div className={`absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br ${percentGradient} 
                          rounded-full opacity-20 blur-3xl`} />

          <div className="relative z-10">
            {/* Percent circle */}
            <div className="relative w-48 h-48 mx-auto mb-6">
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
                  stroke="url(#percentGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 553' }}
                  animate={{ strokeDasharray: `${(percent / 100) * 553} 553` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="percentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={isPassed ? '#22c55e' : '#ef4444'} />
                    <stop offset="100%" stopColor={isPassed ? '#10b981' : '#f97316'} />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="text-6xl font-bold text-white"
                >
                  {percent}%
                </motion.span>
                <span className="text-slate-400 text-sm">
                  {result.correctAnswers}/{result.totalQuestions} {labels.questionsCorrect || 'câu đúng'}
                </span>
              </div>
            </div>

            {/* Pass/Fail badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-6"
            >
              <span className="text-4xl mb-2 block">{percentLabel.emoji}</span>
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-lg font-bold
                             ${isPassed ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                       : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {isPassed ? <FaThumbsUp /> : <FaThumbsDown />}
                {percentLabel.text}
              </div>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <FaCheckCircle className="text-2xl text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{result.correctAnswers}</div>
                <div className="text-xs text-slate-400">{labels.correctAnswers || 'Câu đúng'}</div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <FaTimesCircle className="text-2xl text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-400">{result.wrongAnswers}</div>
                <div className="text-xs text-slate-400">{labels.wrongAnswers || 'Câu sai'}</div>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <FaQuestionCircle className="text-2xl text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">{result.unansweredQuestions}</div>
                <div className="text-xs text-slate-400">{labels.unanswered || 'Chưa làm'}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Score breakdown bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FaChartPie className="text-purple-400" />
            {labels.breakdown || 'Phân bổ kết quả'}
          </h3>
          
          <div className="h-8 rounded-full overflow-hidden flex bg-slate-700/50">
            {result.correctAnswers > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
              >
                {(result.correctAnswers / result.totalQuestions) * 100 > 15 && (
                  <span className="text-white text-xs font-bold">{result.correctAnswers}</span>
                )}
              </motion.div>
            )}
            {result.wrongAnswers > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(result.wrongAnswers / result.totalQuestions) * 100}%` }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center"
              >
                {(result.wrongAnswers / result.totalQuestions) * 100 > 15 && (
                  <span className="text-white text-xs font-bold">{result.wrongAnswers}</span>
                )}
              </motion.div>
            )}
            {result.unansweredQuestions > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(result.unansweredQuestions / result.totalQuestions) * 100}%` }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center"
              >
                {(result.unansweredQuestions / result.totalQuestions) * 100 > 15 && (
                  <span className="text-white text-xs font-bold">{result.unansweredQuestions}</span>
                )}
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-slate-400">Đúng</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-slate-400">Sai</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-slate-400">Bỏ qua</span>
            </span>
          </div>
        </motion.div>

        {/* Description */}
        {displayOptions.showDescription !== false && percentAnalysis.description && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">📝 {labels.description || 'Nhận xét'}</h3>
            <p className="text-slate-300 leading-relaxed">
              {percentAnalysis.description}
            </p>
          </motion.div>
        )}

        {/* Advice Section */}
        {displayOptions.showAdvice !== false && percentAnalysis.advices && percentAnalysis.advices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FaLightbulb className="text-yellow-400" />
              <span>{labels.advice || 'Lời khuyên'}</span>
            </h3>
            <ul className="space-y-3">
              {percentAnalysis.advices.map((advice, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-3 text-slate-300 p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-lg">{advice}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Question Details Section */}
        {displayOptions.showQuestionDetails !== false && result?.questionDetails && result.questionDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 mb-8"
          >
            <button 
              onClick={() => setShowQuestionDetails(!showQuestionDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <FaQuestionCircle className="text-blue-400" />
                <span>{labels.questionDetails || 'Xem lại bài làm'} ({result.questionDetails.length} câu)</span>
              </h3>
              <motion.div
                animate={{ rotate: showQuestionDetails ? 180 : 0 }}
                className="text-slate-400"
              >
                <FaChevronDown className="text-xl" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showQuestionDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Filter buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 mb-4">
                    <button
                      onClick={() => setQuestionFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        questionFilter === 'all' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      Tất cả ({result.questionDetails.length})
                    </button>
                    <button
                      onClick={() => setQuestionFilter('correct')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        questionFilter === 'correct' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      <FaCheckCircle className="inline mr-1" />
                      Đúng ({result.correctAnswers})
                    </button>
                    <button
                      onClick={() => setQuestionFilter('wrong')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        questionFilter === 'wrong' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      <FaTimesCircle className="inline mr-1" />
                      Sai ({result.wrongAnswers})
                    </button>
                    <button
                      onClick={() => setQuestionFilter('unanswered')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        questionFilter === 'unanswered' 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      <FaQuestionCircle className="inline mr-1" />
                      Bỏ qua ({result.unansweredQuestions})
                    </button>
                  </div>

                  {/* Question list */}
                  <div className="space-y-4 mt-4">
                    {result.questionDetails
                      .filter(q => {
                        if (questionFilter === 'correct') return q.isCorrect
                        if (questionFilter === 'wrong') return !q.isCorrect && !q.isUnanswered
                        if (questionFilter === 'unanswered') return q.isUnanswered
                        return true
                      })
                      .map((q, index) => (
                        <QuestionCard key={index} question={q} index={index} />
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                         font-semibold text-white flex items-center justify-center space-x-2
                         shadow-lg shadow-blue-500/25"
            >
              <FaHome />
              <span>{labels.homeButton || 'Về trang chủ'}</span>
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
            <span>{labels.shareButton || 'Chia sẻ kết quả'}</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// Question Card Component
const QuestionCard = ({ question: q, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`p-4 rounded-xl border ${
      q.isCorrect 
        ? 'bg-green-500/10 border-green-500/30'
        : q.isUnanswered
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'bg-red-500/10 border-red-500/30'
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          q.isCorrect 
            ? 'bg-green-500 text-white'
            : q.isUnanswered
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
        }`}>
          Câu {q.questionNumber}
        </span>
        {q.isCorrect && <FaCheckCircle className="text-green-400" />}
        {!q.isCorrect && !q.isUnanswered && <FaTimesCircle className="text-red-400" />}
        {q.isUnanswered && <FaQuestionCircle className="text-yellow-400" />}
      </div>
    </div>

    <div className="text-slate-200 mb-3">
      <MathText>{q.question}</MathText>
    </div>

    {q.image && (
      <img 
        src={q.image} 
        alt="Question" 
        className="max-w-full h-auto rounded-lg mb-3 max-h-48 object-contain"
      />
    )}

    <div className="grid gap-2">
      {q.options.map((opt) => {
        const isUserAnswer = q.userAnswer === opt.id
        const isCorrectAnswer = q.correctAnswer === opt.id
        
        let optionClass = 'bg-white/5 border-white/10'
        if (isCorrectAnswer) {
          optionClass = 'bg-green-500/20 border-green-500/50'
        } else if (isUserAnswer && !q.isCorrect) {
          optionClass = 'bg-red-500/20 border-red-500/50'
        }

        return (
          <div 
            key={opt.id}
            className={`p-3 rounded-lg border ${optionClass} flex items-center gap-3`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              isCorrectAnswer 
                ? 'bg-green-500 text-white'
                : isUserAnswer && !q.isCorrect
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-slate-300'
            }`}>
              {opt.id.toUpperCase()}
            </span>
            <span className={`flex-1 ${
              isCorrectAnswer ? 'text-green-300' : isUserAnswer && !q.isCorrect ? 'text-red-300' : 'text-slate-300'
            }`}>
              <MathText>{opt.text}</MathText>
            </span>
            {isCorrectAnswer && <FaCheckCircle className="text-green-400" />}
            {isUserAnswer && !q.isCorrect && <FaTimesCircle className="text-red-400" />}
          </div>
        )
      })}
    </div>

    {q.explanation && (
      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
          <FaLightbulb />
          <span>Giải thích:</span>
        </div>
        <p className="text-slate-300 text-sm">
          <MathText>{q.explanation}</MathText>
        </p>
      </div>
    )}

    {!q.isCorrect && (
      <div className="mt-3 text-sm">
        <span className="text-slate-400">Đáp án đúng: </span>
        <span className="text-green-400 font-medium">{q.correctAnswer.toUpperCase()}</span>
        {!q.isUnanswered && (
          <>
            <span className="text-slate-400"> | Bạn chọn: </span>
            <span className="text-red-400 font-medium">{q.userAnswer?.toUpperCase() || 'N/A'}</span>
          </>
        )}
      </div>
    )}
  </motion.div>
)

export default PercentResult
