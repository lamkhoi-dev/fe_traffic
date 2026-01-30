import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaClipboard, FaCheck, FaExternalLinkAlt, FaArrowRight,
  FaSearch, FaGlobe, FaKey, FaInfoCircle
} from 'react-icons/fa'
import api from '../services/api'
import { getDeviceFingerprint } from '../utils/fingerprint'
import toast from 'react-hot-toast'

const TaskPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  
  const [task, setTask] = useState(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [sessionId])

  const fetchTask = async () => {
    try {
      setLoading(true)
      console.log('[TaskPage] Fetching task for sessionId:', sessionId)
      const response = await api.get(`/api/sessions/${sessionId}/task`)
      console.log('[TaskPage] API Response:', response)
      console.log('[TaskPage] Task data:', response.data)
      console.log('[TaskPage] searchKeyword:', response.data?.searchKeyword)
      console.log('[TaskPage] siteName:', response.data?.siteName)
      console.log('[TaskPage] siteUrl:', response.data?.siteUrl)
      setTask(response.data)
    } catch (error) {
      console.error('[TaskPage] Error fetching task:', error)
      console.error('[TaskPage] Error response:', error.response)
      toast.error('Không thể tải nhiệm vụ!')
      // Redirect back if no task found
      setTimeout(() => navigate('/'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã xác nhận!')
      return
    }

    setVerifying(true)
    try {
      const fingerprint = await getDeviceFingerprint()
      const response = await api.post('/api/codes/verify', {
        sessionId,
        code: code.trim(),
        fingerprint
      })

      if (response.data.success) {
        setVerified(true)
        toast.success('Xác nhận thành công!')
        setTimeout(() => {
          navigate(`/result/${sessionId}`)
        }, 1500)
      } else {
        toast.error(response.data.message || 'Mã không chính xác!')
      }
    } catch (error) {
      console.error('Error verifying:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Đang tải nhiệm vụ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success animation */}
        {verified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full 
                         flex items-center justify-center shadow-2xl shadow-green-500/50"
            >
              <FaCheck className="text-6xl text-white" />
            </motion.div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 
                       rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30"
          >
            <FaKey className="text-3xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Hoàn thành nhiệm vụ</h1>
          <p className="text-slate-400">
            Thực hiện nhiệm vụ dưới đây để xem kết quả bài test
          </p>
        </motion.div>

        {/* Task Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6"
        >
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl 
                            flex items-center justify-center flex-shrink-0">
              <FaGlobe className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Nhiệm vụ của bạn</h2>
              <p className="text-slate-400">{task?.instruction}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center 
                              text-blue-400 font-bold flex-shrink-0">
                1
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">Tìm kiếm trên Google</h3>
                <p className="text-slate-400 text-sm mb-2">
                  Mở Google và tìm kiếm từ khóa:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="px-3 py-2 bg-slate-800 rounded-lg text-green-400 text-sm">
                    {task?.searchKeyword || 'Tech Blog Vietnam traffic'}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(task?.searchKeyword || 'Tech Blog Vietnam traffic')
                      toast.success('Đã copy từ khóa!')
                    }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <FaClipboard className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center 
                              text-purple-400 font-bold flex-shrink-0">
                2
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Truy cập website</h3>
                <p className="text-slate-400 text-sm">
                  Tìm và click vào kết quả <strong className="text-white">{task?.siteName}</strong>
                </p>
                {task?.step2Image && (
                  <div className="mt-3">
                    <img 
                      src={task.step2Image} 
                      alt="Hướng dẫn bước 2" 
                      className="rounded-lg border border-white/10 max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center 
                              text-pink-400 font-bold flex-shrink-0">
                3
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Lấy mã xác nhận</h3>
                <p className="text-slate-400 text-sm">
                  Cuộn xuống footer, bấm vào chữ "Mã Code" và đợi 60 giây để nhận mã xác nhận
                </p>
                {task?.step3Image && (
                  <div className="mt-3">
                    <img 
                      src={task.step3Image} 
                      alt="Hướng dẫn bước 3" 
                      className="rounded-lg border border-white/10 max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center 
                              text-green-400 font-bold flex-shrink-0">
                4
              </span>
              <div>
                <h3 className="font-semibold text-white mb-1">Nhập mã bên dưới</h3>
                <p className="text-slate-400 text-sm">
                  Copy mã và dán vào ô bên dưới để xem kết quả
                </p>
              </div>
            </div>
          </div>

          {/* Direct link (optional) */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
            <div className="flex items-center space-x-2 text-blue-400 text-sm mb-2">
              <FaInfoCircle />
              <span>Hoặc truy cập trực tiếp:</span>
            </div>
            <a
              href={task?.siteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
            >
              <FaExternalLinkAlt />
              <span className="truncate">{task?.siteUrl || 'https://example.com'}</span>
            </a>
          </div>
        </motion.div>

        {/* Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <FaKey className="text-yellow-400" />
            <span>Nhập mã xác nhận</span>
          </h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã xác nhận (VD: ABC123)"
              className="input-glass text-center text-2xl font-mono tracking-widest uppercase"
              maxLength={10}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={verifying || verified}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl 
                         font-semibold text-white text-lg flex items-center justify-center space-x-2
                         shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xác nhận...</span>
                </>
              ) : verified ? (
                <>
                  <FaCheck />
                  <span>Đã xác nhận!</span>
                </>
              ) : (
                <>
                  <FaArrowRight />
                  <span>Xác nhận và xem kết quả</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Hint */}
          <p className="text-center text-slate-500 text-sm mt-4">
            💡 Demo mode: Nhập "DEMO123" để test
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default TaskPage
