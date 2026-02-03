import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaTrophy, FaChartLine, FaShare, FaRedo, FaStar, 
  FaArrowUp, FaArrowDown, FaCheckCircle, FaTimesCircle, 
  FaQuestionCircle, FaChevronDown, FaLightbulb
} from 'react-icons/fa'
import MathText from '../MathText'

/**
 * ScoreResult - Result layout for IQ/EQ score-based tests
 * Shows score on IQ scale (70-150), percentile, comparison
 */
const ScoreResult = ({ result }) => {
  const [showQuestionDetails, setShowQuestionDetails] = useState(false)
  const [questionFilter, setQuestionFilter] = useState('all')

  // Extract labels and displayOptions with defaults
  const labels = result.labels || {}
  const displayOptions = result.displayOptions || {}
  const theme = result.theme || {}

  const getScoreColor = (score) => {
    const gradients = theme?.gradients || {}
    if (score >= 130) return gradients.excellent || 'from-yellow-400 to-orange-500'
    if (score >= 115) return gradients.good || 'from-green-400 to-emerald-500'
    if (score >= 100) return gradients.average || 'from-blue-400 to-cyan-500'
    if (score >= 85) return gradients.belowAverage || 'from-purple-400 to-pink-500'
    return gradients.needsWork || 'from-slate-400 to-slate-500'
  }

  const getScoreLabel = () => {
    const analysis = result.analysis
    if (analysis?.level && analysis?.emoji) {
      return { text: analysis.level, emoji: analysis.emoji }
    }
    const score = result.score
    if (score >= 130) return { text: 'Xuất sắc', emoji: '🏆' }
    if (score >= 115) return { text: 'Trên trung bình', emoji: '⭐' }
    if (score >= 100) return { text: 'Trung bình', emoji: '👍' }
    if (score >= 85) return { text: 'Dưới trung bình', emoji: '📈' }
    return { text: 'Cần cải thiện', emoji: '💪' }
  }

  const scoreGradient = getScoreColor(result?.score)
  const scoreLabel = getScoreLabel()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Animation */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -20,
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
          <h1 className="text-4xl font-bold text-white mb-2">{labels.congratulations || 'Chúc mừng!'}</h1>
          <p className="text-xl text-slate-400">
            {labels.completedTest || 'Bạn đã hoàn thành bài test'} {result?.testName}
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
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="text-6xl font-bold text-white"
                >
                  {result?.score}
                </motion.span>
                <span className="text-slate-400 text-sm">/ {result?.maxScore || 150}</span>
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
              className="grid grid-cols-4 gap-3"
            >
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="text-2xl font-bold text-green-400">{result?.correctAnswers || 0}</div>
                <div className="text-xs text-slate-400">{labels.correctAnswers || 'Câu đúng'}</div>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="text-2xl font-bold text-red-400">{result?.wrongAnswers || 0}</div>
                <div className="text-xs text-slate-400">{labels.wrongAnswers || 'Câu sai'}</div>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">{result?.unansweredQuestions || 0}</div>
                <div className="text-xs text-slate-400">{labels.unanswered || 'Chưa làm'}</div>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">{result?.percentile}%</div>
                <div className="text-xs text-slate-400">{labels.percentile || 'Percentile'}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        {displayOptions.showStrengths !== false && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FaArrowUp className="text-green-400" />
              <span>{labels.strengths || 'Điểm mạnh'}</span>
            </h3>
            <ul className="space-y-3">
              {(result?.analysis?.strengths || []).map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 text-slate-300"
                >
                  <span className="text-green-400 mt-1">✓</span>
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <FaArrowDown className="text-blue-400" />
              <span>{labels.improvements || 'Cần cải thiện'}</span>
            </h3>
            <ul className="space-y-3">
              {(result?.analysis?.improvements || []).map((improvement, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3 text-slate-300"
                >
                  <span className="text-blue-400 mt-1">→</span>
                  <span>{improvement}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        )}

        {/* Comparison Section */}
        {displayOptions.showComparison !== false && result?.comparison && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <FaChartLine className="text-blue-400" />
              <span>{labels.comparison || 'So sánh với người khác'}</span>
            </h3>
            
            <div className="relative h-20 mb-4">
              <div className="absolute inset-x-0 top-1/2 h-2 bg-slate-700 rounded-full">
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-l-full" />
              </div>
              
              <div className="absolute top-1/2 left-0 w-4 h-4 -translate-y-1/2 bg-slate-600 rounded-full" />
              <div className="absolute top-1/2 left-1/2 w-4 h-4 -translate-y-1/2 -translate-x-1/2 bg-slate-600 rounded-full" />
              <div className="absolute top-1/2 right-0 w-4 h-4 -translate-y-1/2 bg-slate-600 rounded-full" />
              
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
        )}

        {/* Description */}
        {displayOptions.showDescription !== false && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">📝 {labels.description || 'Nhận xét chi tiết'}</h3>
            <p className="text-slate-300 leading-relaxed">
              {result?.analysis?.description}
            </p>
          </motion.div>
        )}

        {/* Advice Section */}
        {displayOptions.showAdvice !== false && result?.advice && result.advice.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="glass-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <FaLightbulb className="text-yellow-400" />
              <span>{labels.advice || 'Lời khuyên dành cho bạn'}</span>
            </h3>
            <ul className="space-y-3">
              {result.advice.map((advice, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
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
            transition={{ delay: 0.8 }}
            className="glass-card p-6 mb-8"
          >
            <button 
              onClick={() => setShowQuestionDetails(!showQuestionDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <FaQuestionCircle className="text-blue-400" />
                <span>{labels.questionDetails || 'Chi tiết từng câu hỏi'} ({result.questionDetails.length} câu)</span>
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
                      Chưa làm ({result.unansweredQuestions})
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
          <Link to="/tests/iq" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                         font-semibold text-white flex items-center justify-center space-x-2
                         shadow-lg shadow-blue-500/25"
            >
              <FaRedo />
              <span>{labels.retryButton || 'Làm bài test khác'}</span>
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
      <span className={`text-sm font-medium ${
        q.isCorrect ? 'text-green-400' : q.isUnanswered ? 'text-yellow-400' : 'text-red-400'
      }`}>
        {q.isCorrect ? '+' + q.points + ' điểm' : q.isUnanswered ? 'Bỏ qua' : '0 điểm'}
      </span>
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

export default ScoreResult
