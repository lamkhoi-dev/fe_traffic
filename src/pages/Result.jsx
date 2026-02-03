import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaExclamationCircle, FaRedo } from 'react-icons/fa'
import api from '../services/api'
import { ScoreResult, PercentResult, MBTIResult } from '../components/results'

/**
 * Result - Router component that renders the appropriate result layout
 * based on the layoutType from the API response
 */
const Result = () => {
  const { sessionId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResult()
  }, [sessionId])

  const fetchResult = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/sessions/${sessionId}`)
      setResult(response.data)
    } catch (error) {
      console.error('Error fetching result:', error)
      setResult({
        error: true,
        message: 'Không thể tải kết quả. Vui lòng hoàn thành nhiệm vụ trước!'
      })
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải kết quả...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (result?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <FaExclamationCircle className="text-3xl text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Không thể xem kết quả</h2>
          <p className="text-slate-400 mb-6">{result.message}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <FaRedo />
            Về trang chủ
          </Link>
        </motion.div>
      </div>
    )
  }

  // Determine layout type from result
  const layoutType = result?.profile?.layoutType || result?.layoutType || detectLayoutType(result)

  // Render appropriate component based on layout type
  switch (layoutType) {
    case 'percent':
      return <PercentResult result={result} />
    
    case 'mbti':
      return <MBTIResult result={result} />
    
    case 'score':
    default:
      return <ScoreResult result={result} />
  }
}

/**
 * Auto-detect layout type based on result data
 * Used as fallback when no profile is available
 */
const detectLayoutType = (result) => {
  // Check test type
  const testType = result?.type || ''
  
  // MBTI detection
  if (testType === 'mbti' || result?.mbtiType || result?.analysis?.mbtiType) {
    return 'mbti'
  }
  
  // Percent-based (school tests) detection
  const percentTestTypes = ['grade10', 'grade11', 'grade12', 'toan', 'ly', 'hoa', 'anh', 'sinh', 'su', 'dia']
  if (percentTestTypes.includes(testType) || testType.startsWith('grade')) {
    return 'percent'
  }
  
  // Check if it looks like a percent-based result (score equals correct count)
  if (result?.score === result?.correctAnswers && result?.maxScore === result?.totalQuestions) {
    return 'percent'
  }
  
  // Default to score-based (IQ/EQ)
  return 'score'
}

export default Result
