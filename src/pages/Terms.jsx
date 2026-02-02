import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFileContract, FaCheckCircle, FaShieldAlt, FaUserCheck, FaInfoCircle } from 'react-icons/fa'
import api from '../services/api'

const Terms = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await api.get('/api/settings/terms')
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
    title: 'Điều Khoản Sử Dụng',
    lastUpdated: '01/02/2026',
    sections: [
      {
        icon: 'check',
        title: '1. Chấp nhận điều khoản',
        content: `Bằng việc truy cập và sử dụng website IQ & EQ Test, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.`
      },
      {
        icon: 'user',
        title: '2. Điều kiện sử dụng',
        content: `• Bạn phải từ 13 tuổi trở lên để sử dụng dịch vụ\n• Bạn chịu trách nhiệm bảo mật thông tin tài khoản của mình\n• Không được sử dụng dịch vụ cho mục đích bất hợp pháp\n• Không được cố gắng can thiệp hoặc phá hoại hệ thống`
      },
      {
        icon: 'shield',
        title: '3. Quyền sở hữu trí tuệ',
        content: `Tất cả nội dung trên website bao gồm nhưng không giới hạn: văn bản, đồ họa, logo, hình ảnh, câu hỏi trắc nghiệm, thuật toán đánh giá đều thuộc quyền sở hữu của IQ & EQ Test hoặc các đối tác được cấp phép. Bạn không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.`
      },
      {
        icon: 'info',
        title: '4. Giới hạn trách nhiệm',
        content: `• Kết quả bài test chỉ mang tính chất tham khảo, không thay thế đánh giá chuyên môn\n• Chúng tôi không chịu trách nhiệm về các quyết định dựa trên kết quả test\n• Dịch vụ được cung cấp "nguyên trạng" không có bảo đảm về tính chính xác tuyệt đối\n• Chúng tôi có quyền thay đổi hoặc ngừng dịch vụ bất cứ lúc nào`
      },
      {
        icon: 'check',
        title: '5. Thay đổi điều khoản',
        content: `Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới. Chúng tôi khuyến khích bạn thường xuyên kiểm tra trang này để cập nhật thông tin mới nhất.`
      }
    ]
  }

  const displayContent = content || defaultContent

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'check': return <FaCheckCircle className="text-green-400" />
      case 'shield': return <FaShieldAlt className="text-blue-400" />
      case 'user': return <FaUserCheck className="text-purple-400" />
      case 'info': return <FaInfoCircle className="text-yellow-400" />
      default: return <FaCheckCircle className="text-green-400" />
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
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 
                          rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <FaFileContract className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{displayContent.title}</h1>
          <p className="text-slate-400">
            Cập nhật lần cuối: {displayContent.lastUpdated}
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

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-slate-400"
        >
          <p>Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ:</p>
          <a href="mailto:support@iqeqtest.com" className="text-blue-400 hover:text-blue-300 transition-colors">
            support@iqeqtest.com
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default Terms
