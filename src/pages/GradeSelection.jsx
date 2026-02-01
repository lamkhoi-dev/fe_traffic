import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaGraduationCap, FaArrowRight, FaLock, FaTools, 
  FaBook, FaChevronDown, FaChevronUp 
} from 'react-icons/fa'
import { GRADE_CONFIG, getAllGrades, isUnderDevelopment } from '../utils/gradeConfig'

const GradeSelection = () => {
  const navigate = useNavigate()
  const [expandedGrade, setExpandedGrade] = useState(null)

  const grades = getAllGrades()
  
  // Group grades by level
  const primaryGrades = grades.filter(g => g.grade >= 1 && g.grade <= 5)
  const middleGrades = grades.filter(g => g.grade >= 6 && g.grade <= 9)
  const highGrades = grades.filter(g => g.grade >= 10 && g.grade <= 12)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'development':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
            <FaTools className="text-xs" />
            Đang phát triển
          </span>
        )
      case 'borrowed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Sẵn sàng
          </span>
        )
      case 'active':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
            Đầy đủ
          </span>
        )
      default:
        return null
    }
  }

  const getGradeIcon = (grade) => {
    if (grade <= 5) return '🎒'
    if (grade <= 9) return '📚'
    return '🎓'
  }

  const handleGradeClick = (gradeNum, status) => {
    if (status === 'development') {
      setExpandedGrade(expandedGrade === gradeNum ? null : gradeNum)
    } else {
      navigate(`/grade/${gradeNum}`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  }

  const GradeCard = ({ gradeData }) => {
    const { grade, name, description, status } = gradeData
    const isExpanded = expandedGrade === grade
    const isDev = status === 'development'

    return (
      <motion.div
        variants={itemVariants}
        className={`glass-card overflow-hidden transition-all duration-300 ${
          isDev ? 'opacity-75' : 'hover:scale-[1.02]'
        }`}
      >
        <div
          onClick={() => handleGradeClick(grade, status)}
          className={`p-4 cursor-pointer ${!isDev && 'group'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${isDev ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                {isDev ? <FaLock className="text-slate-400 text-lg" /> : getGradeIcon(grade)}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDev ? 'text-slate-400' : 'text-white group-hover:text-blue-400'}`}>
                  {name}
                </h3>
                <p className="text-slate-500 text-sm">
                  {status === 'active' ? '4 môn học' : status === 'borrowed' ? '4 môn học' : 'Sắp ra mắt'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(status)}
              {isDev ? (
                isExpanded ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />
              ) : (
                <FaArrowRight className="text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded content for development grades */}
        {isDev && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 border-t border-slate-700/50"
          >
            <div className="pt-4">
              <p className="text-slate-400 text-sm mb-3">{description}</p>
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-500/10 p-3 rounded-lg">
                <FaTools />
                <span className="text-sm">Nội dung đang được phát triển. Vui lòng quay lại sau!</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  const GradeSection = ({ title, grades, icon, color }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-slate-400 text-sm">({grades.length} lớp)</span>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {grades.map(gradeData => (
          <GradeCard key={gradeData.grade} gradeData={gradeData} />
        ))}
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 
                        rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/30"
          >
            <FaGraduationCap className="text-5xl text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold font-display mb-4">
            <span className="text-white">Chọn </span>
            <span className="gradient-text">Lớp học</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Hệ thống bài kiểm tra từ lớp 1 đến lớp 12 với đầy đủ các môn học
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Tổng số lớp', value: '12', icon: <FaGraduationCap /> },
            { label: 'Lớp sẵn sàng', value: '6', icon: <FaBook /> },
            { label: 'Môn học', value: '4', icon: '📚' },
            { label: 'Bài test', value: '240+', icon: '📝' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Grade Sections - High School First (most content) */}
        <GradeSection
          title="Cấp 3 - THPT"
          grades={highGrades}
          icon={<span className="text-lg">🎓</span>}
          color="from-purple-500 to-pink-500"
        />

        <GradeSection
          title="Cấp 2 - THCS"
          grades={middleGrades}
          icon={<span className="text-lg">📚</span>}
          color="from-blue-500 to-cyan-500"
        />

        <GradeSection
          title="Cấp 1 - Tiểu học"
          grades={primaryGrades}
          icon={<span className="text-lg">🎒</span>}
          color="from-green-500 to-emerald-500"
        />

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Quay về trang chủ
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default GradeSelection
