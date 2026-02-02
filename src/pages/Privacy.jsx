import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaDatabase, FaCookieBite, FaLock, FaUserShield, FaEnvelope } from 'react-icons/fa'
import api from '../services/api'

const Privacy = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await api.get('/api/settings/privacy')
      if (response.data?.content) {
        setContent(response.data.content)
      }
    } catch (error) {
      console.log('Using default content')
    } finally {
      setLoading(false)
    }
  }

  // Default content if no custom content
  const defaultContent = {
    title: 'Chính Sách Bảo Mật',
    lastUpdated: '01/02/2026',
    sections: [
      {
        icon: 'database',
        title: '1. Thông tin chúng tôi thu thập',
        content: `Chúng tôi thu thập các loại thông tin sau để cung cấp dịch vụ tốt hơn:\n\n• **Thông tin thiết bị:** Loại trình duyệt, hệ điều hành, địa chỉ IP\n• **Dữ liệu sử dụng:** Các bài test đã làm, điểm số, thời gian hoàn thành\n• **Thông tin kỹ thuật:** Device fingerprint để ngăn chặn gian lận\n\nChúng tôi KHÔNG thu thập thông tin cá nhân nhạy cảm như tên thật, địa chỉ, số điện thoại trừ khi bạn tự nguyện cung cấp.`
      },
      {
        icon: 'lock',
        title: '2. Cách chúng tôi sử dụng thông tin',
        content: `Thông tin thu thập được sử dụng để:\n\n• Cung cấp và cải thiện dịch vụ test IQ, EQ\n• Phân tích xu hướng và tạo thống kê ẩn danh\n• Ngăn chặn gian lận và đảm bảo tính công bằng\n• Cá nhân hóa trải nghiệm người dùng\n• Gửi thông báo về kết quả test (nếu được yêu cầu)`
      },
      {
        icon: 'cookie',
        title: '3. Cookie và công nghệ theo dõi',
        content: `Website sử dụng cookies và localStorage để:\n\n• Lưu trữ tiến trình làm bài test\n• Ghi nhớ cài đặt người dùng\n• Phân tích lưu lượng truy cập (Google Analytics)\n• Ngăn chặn việc làm lại test nhiều lần\n\nBạn có thể tắt cookies trong trình duyệt, nhưng một số tính năng có thể không hoạt động đúng.`
      },
      {
        icon: 'shield',
        title: '4. Bảo mật dữ liệu',
        content: `Chúng tôi cam kết bảo vệ dữ liệu của bạn bằng:\n\n• Mã hóa SSL/TLS cho tất cả kết nối\n• Lưu trữ dữ liệu trên máy chủ bảo mật\n• Giới hạn quyền truy cập nội bộ\n• Không bán hoặc chia sẻ dữ liệu với bên thứ ba\n• Xóa dữ liệu session sau 30 ngày không hoạt động`
      },
      {
        icon: 'user',
        title: '5. Quyền của bạn',
        content: `Bạn có quyền:\n\n• **Truy cập:** Yêu cầu bản sao dữ liệu của bạn\n• **Chỉnh sửa:** Yêu cầu sửa thông tin không chính xác\n• **Xóa:** Yêu cầu xóa dữ liệu của bạn\n• **Phản đối:** Từ chối việc sử dụng dữ liệu cho mục đích marketing\n\nĐể thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email.`
      },
      {
        icon: 'email',
        title: '6. Liên hệ về bảo mật',
        content: `Nếu bạn có câu hỏi hoặc lo ngại về chính sách bảo mật, vui lòng liên hệ:\n\n📧 Email: privacy@iqeqtest.com\n🌐 Website: iqeqtest.com/contact\n\nChúng tôi sẽ phản hồi trong vòng 48 giờ làm việc.`
      }
    ]
  }

  const displayContent = content || defaultContent

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'database': return <FaDatabase className="text-blue-400" />
      case 'lock': return <FaLock className="text-green-400" />
      case 'cookie': return <FaCookieBite className="text-yellow-400" />
      case 'shield': return <FaShieldAlt className="text-purple-400" />
      case 'user': return <FaUserShield className="text-pink-400" />
      case 'email': return <FaEnvelope className="text-cyan-400" />
      default: return <FaShieldAlt className="text-blue-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-600 
                          rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{displayContent.title}</h1>
          <p className="text-slate-400">
            Cập nhật lần cuối: {displayContent.lastUpdated}
          </p>
        </motion.div>

        {/* Highlight Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaLock className="text-green-400 text-xl" />
            <h3 className="text-lg font-bold text-white">Cam kết của chúng tôi</h3>
          </div>
          <p className="text-slate-300">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Dữ liệu của bạn được bảo vệ và 
            không bao giờ được bán hoặc chia sẻ với bên thứ ba vì mục đích thương mại.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {displayContent.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  {getIcon(section.icon)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-center"
        >
          <p className="text-slate-400 mb-2">
            Chính sách này có thể được cập nhật định kỳ. Vui lòng kiểm tra thường xuyên.
          </p>
          <p className="text-slate-500 text-sm">
            Bằng việc tiếp tục sử dụng dịch vụ, bạn đồng ý với chính sách bảo mật này.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy
