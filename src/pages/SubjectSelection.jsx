import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaGraduationCap, FaArrowRight, FaArrowLeft,
  FaCalculator, FaAtom, FaGlobe, FaLandmark
} from 'react-icons/fa'
import { 
  GRADE_CONFIG, SUBJECTS, getDisplayGrade, 
  isUnderDevelopment, isBorrowedGrade, getSourceGrade 
} from '../utils/gradeConfig'

const SubjectSelection = () => {
  const { gradeNum } = useParams()
  const navigate = useNavigate()
  const grade = parseInt(gradeNum)
  
  const gradeConfig = GRADE_CONFIG[grade]
  
  // If invalid grade or under development, redirect
  if (!gradeConfig || isUnderDevelopment(grade)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lớp học không tồn tại</h2>
          <Link to="/grades" className="text-blue-400 hover:text-blue-300">
            ← Quay về chọn lớp
          </Link>
        </div>
      </div>
    )
  }

  const subjectIcons = {
    math: <FaCalculator className="text-2xl" />,
    physics: <FaAtom className="text-2xl" />,
    english: <FaGlobe className="text-2xl" />,
    history: <FaLandmark className="text-2xl" />,
  }

  const subjectTestCounts = {
    math: 20,
    physics: 10,
    english: 10,
    history: 10,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  }

  const sourceGrade = getSourceGrade(grade)
  const isBorrowed = isBorrowedGrade(grade)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link
            to="/grades"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            Quay về chọn lớp
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 
                        rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
          >
            <FaGraduationCap className="text-5xl text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold font-display mb-4">
            <span className="text-white">{gradeConfig.name}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4">
            {gradeConfig.description}
          </p>
          
          {isBorrowed && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
              <span>📚</span>
              <span>Bài test được điều chỉnh phù hợp với trình độ {gradeConfig.name}</span>
            </div>
          )}
        </motion.div>

        {/* Subject Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {gradeConfig.subjects.map((subjectId) => {
            const subject = SUBJECTS[subjectId]
            return (
              <motion.div
                key={subjectId}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(`/grade/${grade}/subject/${subjectId}`)}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                {/* Card Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} 
                                    rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{subject.icon}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                      {subjectTestCounts[subjectId]} bài test
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Môn {subject.name} {gradeConfig.name} với {subjectTestCounts[subjectId]} bài kiểm tra
                  </p>

                  {/* Start button */}
                  <div className={`flex items-center justify-center py-3 rounded-xl 
                                  bg-gradient-to-r ${subject.color} text-white font-semibold
                                  group-hover:shadow-lg transition-all`}>
                    <span>Bắt đầu làm bài</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Môn học', value: gradeConfig.subjects.length, icon: '📚' },
            { label: 'Tổng bài test', value: '50', icon: '📝' },
            { label: 'Câu hỏi', value: '1000+', icon: '❓' },
            { label: 'Thời gian/bài', value: '45 phút', icon: '⏱️' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default SubjectSelection
