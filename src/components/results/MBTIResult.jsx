import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaRedo, FaShare, FaBriefcase, FaHeart, FaPercent } from 'react-icons/fa'

/**
 * MBTIResult - Result layout for MBTI personality tests
 * Shows 4 dimensions, type description, strengths/weaknesses, careers
 */
const MBTIResult = ({ result }) => {
  const labels = result.labels || {}
  const displayOptions = result.displayOptions || {}
  const mbtiConfig = result.mbtiConfig || {}
  const mbtiTypeConfig = result.mbtiTypeConfig || result.result || {}

  // MBTI type from result
  const mbtiType = result.type || result.mbtiType || result.analysis?.mbtiType
  const dimensionScores = result.dimensionScores || result.analysis?.dimensionScores

  // Default dimension names
  const defaultDimNames = {
    EI: { leftLabel: 'Hướng ngoại (E)', rightLabel: 'Hướng nội (I)', leftCode: 'E', rightCode: 'I' },
    SN: { leftLabel: 'Giác quan (S)', rightLabel: 'Trực giác (N)', leftCode: 'S', rightCode: 'N' },
    TF: { leftLabel: 'Lý trí (T)', rightLabel: 'Cảm xúc (F)', leftCode: 'T', rightCode: 'F' },
    JP: { leftLabel: 'Nguyên tắc (J)', rightLabel: 'Linh hoạt (P)', leftCode: 'J', rightCode: 'P' }
  }

  // Merge profile dimensions with defaults
  const getDimensionLabels = (dimCode) => {
    const profileDim = mbtiConfig.dimensions?.find(d => d.code === dimCode)
    return profileDim || defaultDimNames[dimCode] || { leftLabel: '', rightLabel: '', leftCode: dimCode[0], rightCode: dimCode[1] }
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
              {mbtiTypeConfig.emoji || '🧠'}
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white mb-2"
            >
              {mbtiType}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-white/90"
            >
              {mbtiTypeConfig.title}
            </motion.p>
            {mbtiTypeConfig.nickname && (
              <p className="text-white/60 mt-2 text-lg">{mbtiTypeConfig.nickname}</p>
            )}
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-3">
                {labels.mbtiType || 'Mô tả tính cách'}
              </h2>
              <p className="text-white/70 leading-relaxed text-lg">
                {mbtiTypeConfig.description}
              </p>
            </motion.div>

            {/* Dimension Scores */}
            {displayOptions.showDimensionScores !== false && dimensionScores && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {labels.mbtiDimensions || 'Phân tích chi tiết'}
                </h2>
                <div className="grid gap-4">
                  {Object.entries(dimensionScores).map(([dim, data]) => {
                    const dimLabels = getDimensionLabels(dim)
                    const leftKey = dimLabels.leftCode
                    const rightKey = dimLabels.rightCode
                    const leftScore = data[leftKey] || 0
                    const rightScore = data[rightKey] || 0
                    const total = leftScore + rightScore
                    const leftPercent = total > 0 ? Math.round((leftScore / total) * 100) : 50

                    return (
                      <div key={dim} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className={`${data.dominant === leftKey ? 'text-purple-400 font-semibold' : 'text-white/50'}`}>
                            {dimLabels.leftLabel}: {leftScore}
                          </span>
                          <span className={`${data.dominant === rightKey ? 'text-pink-400 font-semibold' : 'text-white/50'}`}>
                            {dimLabels.rightLabel}: {rightScore}
                          </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${leftPercent}%` }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="bg-gradient-to-r from-purple-500 to-purple-600"
                          />
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - leftPercent}%` }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="bg-gradient-to-r from-pink-500 to-pink-600"
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-white/40">
                          <span>{leftPercent}%</span>
                          <span>{100 - leftPercent}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Strengths & Weaknesses */}
            {displayOptions.showStrengths !== false && (
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-green-500/10 rounded-xl p-6 border border-green-500/20"
                >
                  <h3 className="text-lg font-semibold text-green-400 mb-3">
                    💪 {labels.strengths || 'Điểm mạnh'}
                  </h3>
                  <ul className="space-y-2">
                    {(mbtiTypeConfig.strengths || []).map((s, i) => (
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
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">
                    ⚡ {labels.improvements || 'Điểm cần cải thiện'}
                  </h3>
                  <ul className="space-y-2">
                    {(mbtiTypeConfig.weaknesses || []).map((w, i) => (
                      <li key={i} className="text-white/70 flex items-center gap-2">
                        <span className="text-orange-400">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}

            {/* Careers */}
            {mbtiConfig.showCareerSuggestions !== false && mbtiTypeConfig.careers && mbtiTypeConfig.careers.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaBriefcase className="text-blue-400" />
                  {labels.mbtiCareers || 'Nghề nghiệp phù hợp'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mbtiTypeConfig.careers.map((c, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Relationships */}
            {mbtiTypeConfig.relationships && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.95 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaHeart className="text-pink-400" />
                  Trong các mối quan hệ
                </h3>
                <p className="text-white/70 leading-relaxed bg-pink-500/10 p-4 rounded-xl border border-pink-500/20">
                  {mbtiTypeConfig.relationships}
                </p>
              </motion.div>
            )}

            {/* Compatibility */}
            {mbtiTypeConfig.compatibility && mbtiTypeConfig.compatibility.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">❤️ Tương hợp với</h3>
                <div className="flex gap-3">
                  {mbtiTypeConfig.compatibility.map((c, i) => (
                    <span key={i} className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Celebrities */}
            {mbtiConfig.showCelebrities !== false && mbtiTypeConfig.celebrities && mbtiTypeConfig.celebrities.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.05 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  ⭐ {labels.mbtiCelebrities || 'Người nổi tiếng cùng loại'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mbtiTypeConfig.celebrities.map((celeb, i) => (
                    <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {celeb}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Percentage stat */}
            {mbtiTypeConfig.percentage && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="text-white/50 flex items-center gap-2">
                  <FaPercent className="text-purple-400" />
                  Tỷ lệ dân số
                </span>
                <span className="text-2xl font-bold text-purple-400">{mbtiTypeConfig.percentage}</span>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link to="/" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl 
                             font-semibold text-white flex items-center justify-center space-x-2
                             transition-colors"
                >
                  <FaHome />
                  <span>{labels.homeButton || 'Về trang chủ'}</span>
                </motion.button>
              </Link>

              <Link to="/mbti" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl 
                             font-semibold text-white flex items-center justify-center space-x-2
                             shadow-lg shadow-purple-500/25"
                >
                  <FaRedo />
                  <span>{labels.retryButton || 'Làm lại'}</span>
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
                <span>{labels.shareButton || 'Chia sẻ'}</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MBTIResult
