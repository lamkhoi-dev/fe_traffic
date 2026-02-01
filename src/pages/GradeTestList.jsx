import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaClock, FaQuestionCircle, FaArrowRight, 
  FaStar, FaPlay, FaGraduationCap 
} from 'react-icons/fa'
import api from '../services/api'
import toast from 'react-hot-toast'
import { 
  GRADE_CONFIG, SUBJECTS, getDisplayGrade, 
  getSourceGrade, isBorrowedGrade, getGradeType 
} from '../utils/gradeConfig'

const GradeTestList = () => {
  const { gradeNum, subjectId } = useParams()
  const navigate = useNavigate()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const grade = parseInt(gradeNum)
  const gradeConfig = GRADE_CONFIG[grade]
  const subject = SUBJECTS[subjectId]
  const sourceGrade = getSourceGrade(grade)
  const isBorrowed = isBorrowedGrade(grade)

  useEffect(() => {
    fetchTests()
  }, [gradeNum, subjectId])

  const fetchTests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch tests from the source grade (for borrowed grades, this will be 10/11/12)
      const gradeType = getGradeType(grade)
      const response = await api.get(`/api/tests/grade/${sourceGrade}/subject/${subjectId}`)
      
      if (response.data.success && response.data.tests) {
        // Transform tests to show correct grade display name
        const transformedTests = response.data.tests.map(test => ({
          ...test,
          displayGrade: grade, // Show the requested grade (7/8/9)
          displayName: test.name.replace(/Lớp \d+/g, gradeConfig.name), // Replace grade in name
        }))
        setTests(transformedTests)
      } else {
        setTests([])
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
      setError('Không thể tải danh sách bài test. Vui lòng thử lại.')
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ'
      case 'medium':
        return 'Trung bình'
      case 'hard':
        return 'Khó'
      default:
        return difficulty
    }
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  if (!gradeConfig || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy</h2>
          <Link to="/grades" className="text-blue-400 hover:text-blue-300">
            ← Quay về chọn lớp
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Link
            to={`/grade/${grade}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <FaArrowLeft />
            Quay về {gradeConfig.name}
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${subject.color} 
                        rounded-3xl flex items-center justify-center shadow-2xl`}
          >
            <span className="text-5xl">{subject.icon}</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold font-display mb-4">
            <span className="text-white">{subject.name} </span>
            <span className="gradient-text">{gradeConfig.name}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Danh sách bài kiểm tra môn {subject.name} dành cho {gradeConfig.name}
          </p>
          
          {isBorrowed && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
              <span>💡</span>
              <span>Bài test được điều chỉnh phù hợp trình độ {gradeConfig.name}</span>
            </div>
          )}
        </motion.div>

        {/* Test Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchTests}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-4">Chưa có bài test nào.</p>
            <Link 
              to={`/grade/${grade}`}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block"
            >
              Quay về {gradeConfig.name}
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {tests.map((test, index) => (
              <motion.div
                key={test._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/grade/${grade}/subject/${subjectId}/test/${test._id}`)}
              >
                {/* Card Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${subject.color}`} />
                
                <div className="p-5">
                  {/* Test number badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} 
                                    rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border
                                     ${getDifficultyColor(test.difficulty)}`}>
                      {getDifficultyText(test.difficulty)}
                    </span>
                  </div>

                  {/* Test info */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                    Đề số {index + 1}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {subject.name} {gradeConfig.name} - {test.questionCount || 20} câu hỏi
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-blue-400" />
                      <span>{test.duration || 45} phút</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaQuestionCircle className="text-purple-400" />
                      <span>{test.questionCount || 20} câu</span>
                    </div>
                  </div>

                  {/* Start button */}
                  <div className={`flex items-center justify-center py-2.5 rounded-xl 
                                  bg-gradient-to-r ${subject.color} text-white font-medium text-sm
                                  opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <FaPlay className="mr-2" />
                    Làm bài
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Back to grade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to={`/grade/${grade}`}
            className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Quay về {gradeConfig.name}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default GradeTestList
