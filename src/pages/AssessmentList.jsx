import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGraduationCap, FaClock, FaQuestionCircle, FaStar, FaFire, FaTrophy, FaRocket, FaBolt, FaMedal, FaAward } from 'react-icons/fa'
import { HiSparkles, HiLightningBolt, HiAcademicCap } from 'react-icons/hi'

const AssessmentList = () => {
  // Generate 50 assessment tests
  const assessments = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Bài Đánh Giá #${String(i + 1).padStart(2, '0')}`,
    questions: 30,
    duration: 45,
    difficulty: ['Cơ bản', 'Trung bình', 'Nâng cao'][i % 3],
    subjects: ['Toán', 'Lý', 'Anh', 'Sử'],
    grades: ['10', '11', '12'],
    completions: Math.floor(Math.random() * 1000) + 100,
    rating: (4 + Math.random()).toFixed(1),
  }))

  const difficultyColors = {
    'Cơ bản': 'from-green-500 to-emerald-600',
    'Trung bình': 'from-yellow-500 to-orange-600',
    'Nâng cao': 'from-red-500 to-pink-600'
  }

  const difficultyBg = {
    'Cơ bản': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Trung bình': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Nâng cao': 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const icons = [FaStar, FaFire, FaTrophy, FaRocket, FaBolt, FaMedal, FaAward]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl 
                       bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 
                       shadow-2xl shadow-purple-500/40 mb-6"
          >
            <HiAcademicCap className="text-5xl text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Đánh Giá Năng Lực
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
            Bài thi tổng hợp kiến thức từ 4 môn học (Toán, Lý, Anh, Sử) và 3 khối lớp (10, 11, 12).
            Mỗi bài gồm 30 câu hỏi ngẫu nhiên để đánh giá toàn diện năng lực học tập.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              <HiSparkles className="text-yellow-400" />
              <span className="text-white font-medium">50 Bài thi</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              <FaQuestionCircle className="text-blue-400" />
              <span className="text-white font-medium">30 Câu/bài</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              <FaClock className="text-green-400" />
              <span className="text-white font-medium">45 Phút</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              <FaGraduationCap className="text-purple-400" />
              <span className="text-white font-medium">4 Môn học</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {assessments.map((assessment, index) => {
            const IconComponent = icons[index % icons.length]
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link to={`/assessment/${assessment.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative h-full p-5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 
                               border border-white/10 hover:border-purple-500/50 
                               backdrop-blur-sm transition-all duration-300 group overflow-hidden"
                  >
                    {/* Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${difficultyColors[assessment.difficulty]} 
                                    opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                    
                    {/* Test Number Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${difficultyBg[assessment.difficulty]}`}>
                        {assessment.difficulty}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${difficultyColors[assessment.difficulty]} 
                                    flex items-center justify-center mb-4 shadow-lg 
                                    group-hover:shadow-xl transition-shadow`}>
                      <IconComponent className="text-2xl text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {assessment.title}
                    </h3>

                    {/* Subjects Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {assessment.subjects.map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs rounded-md bg-white/10 text-slate-300"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <FaQuestionCircle className="text-xs" />
                        <span>{assessment.questions} câu</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        <span>{assessment.duration} phút</span>
                      </div>
                    </div>

                    {/* Rating & Completions */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar className="text-xs" />
                        <span className="text-sm font-medium">{assessment.rating}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {assessment.completions.toLocaleString()} lượt thi
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 
                                    transform translate-x-2 group-hover:translate-x-0 transition-all">
                      <HiLightningBolt className="text-purple-400 text-xl" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 mb-4">
            Chọn bất kỳ bài đánh giá nào để bắt đầu kiểm tra năng lực của bạn!
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <HiSparkles />
            <span className="text-sm">Mỗi bài thi là một thử thách mới</span>
            <HiSparkles />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AssessmentList
