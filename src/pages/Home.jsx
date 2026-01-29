import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBrain, FaHeart, FaArrowRight, FaChartLine, FaClock, FaUsers, FaStar } from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: <FaChartLine className="text-2xl" />,
      title: 'Phân tích chi tiết',
      description: 'Nhận báo cáo phân tích đầy đủ về điểm mạnh và điểm cần cải thiện',
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: 'Nhanh chóng',
      description: 'Chỉ mất 10-15 phút để hoàn thành mỗi bài test',
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: 'So sánh chuẩn',
      description: 'So sánh kết quả của bạn với hàng nghìn người khác',
    },
    {
      icon: <FaStar className="text-2xl" />,
      title: 'Chuyên nghiệp',
      description: 'Bài test được thiết kế bởi các chuyên gia tâm lý học',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm 
                         border border-white/20 text-sm text-slate-300 mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Hơn 10,000+ người đã tham gia
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display mb-6">
              <span className="text-white">Khám phá </span>
              <span className="gradient-text">Trí Tuệ</span>
              <br />
              <span className="text-white">của bạn</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
              Đánh giá chỉ số IQ và EQ với các bài test khoa học, 
              chuyên nghiệp. Hiểu rõ bản thân để phát triển tốt hơn.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/tests/iq">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                             rounded-2xl font-semibold text-white text-lg shadow-2xl shadow-blue-500/30
                             hover:shadow-blue-500/50 transition-shadow duration-300 flex items-center space-x-3"
                >
                  <FaBrain className="text-xl" />
                  <span>Bắt đầu test IQ</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <div className="pulse-ring" />
                </motion.button>
              </Link>

              <Link to="/tests/eq">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 
                             rounded-2xl font-semibold text-white text-lg shadow-2xl shadow-orange-500/30
                             hover:shadow-orange-500/50 transition-shadow duration-300 flex items-center space-x-3"
                >
                  <FaHeart className="text-xl" />
                  <span>Bắt đầu test EQ</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Floating cards preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 flex justify-center"
          >
            <div className="relative">
              {/* IQ Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -left-20 top-10 w-48 glass-card p-6 transform -rotate-6"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl 
                                flex items-center justify-center mb-4">
                  <FaBrain className="text-xl text-white" />
                </div>
                <h3 className="font-bold text-white mb-1">IQ Test</h3>
                <p className="text-sm text-slate-400">Trí thông minh logic</p>
                <div className="mt-3 flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
              </motion.div>

              {/* Center Score Display */}
              <div className="w-64 h-64 glass-card flex flex-col items-center justify-center glow-blue">
                <span className="text-6xl font-bold gradient-text mb-2">120</span>
                <span className="text-slate-400">Điểm IQ trung bình</span>
                <div className="mt-4 w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ delay: 1, duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
              </div>

              {/* EQ Card */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -right-20 top-10 w-48 glass-card p-6 transform rotate-6"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl 
                                flex items-center justify-center mb-4">
                  <FaHeart className="text-xl text-white" />
                </div>
                <h3 className="font-bold text-white mb-1">EQ Test</h3>
                <p className="text-sm text-slate-400">Trí tuệ cảm xúc</p>
                <div className="mt-3 flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              <span className="text-white">Tại sao chọn </span>
              <span className="gradient-text">chúng tôi?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Nền tảng đánh giá IQ/EQ hàng đầu với công nghệ hiện đại
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="glass-card p-8 text-center card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                                rounded-2xl flex items-center justify-center text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Test Types Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              <span className="text-white">Chọn loại </span>
              <span className="gradient-text">bài test</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* IQ Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
              <div className="glass-card p-10 relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl 
                                  flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <FaBrain className="text-4xl text-white" />
                  </div>
                  <span className="px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
                    5 bài test
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">IQ Test</h3>
                <p className="text-slate-400 mb-6 text-lg">
                  Đánh giá khả năng tư duy logic, phân tích, giải quyết vấn đề 
                  và nhận diện mẫu hình.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Suy luận logic
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Dãy số và quy luật
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Hình ảnh và không gian
                  </li>
                </ul>
                <Link to="/tests/iq">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                               font-semibold text-white flex items-center justify-center space-x-2
                               shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                  >
                    <span>Làm bài test IQ</span>
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* EQ Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-pink-600/30" />
              <div className="glass-card p-10 relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl 
                                  flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <FaHeart className="text-4xl text-white" />
                  </div>
                  <span className="px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
                    5 bài test
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">EQ Test</h3>
                <p className="text-slate-400 mb-6 text-lg">
                  Đánh giá khả năng nhận biết, hiểu và quản lý cảm xúc của 
                  bản thân và người khác.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                    Nhận thức bản thân
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                    Kỹ năng xã hội
                  </li>
                  <li className="flex items-center text-slate-300">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                    Quản lý cảm xúc
                  </li>
                </ul>
                <Link to="/tests/eq">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl 
                               font-semibold text-white flex items-center justify-center space-x-2
                               shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
                  >
                    <span>Làm bài test EQ</span>
                    <FaArrowRight />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            
            <h2 className="text-4xl font-bold font-display mb-4 relative">
              <span className="text-white">Sẵn sàng </span>
              <span className="gradient-text">khám phá?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 relative">
              Bắt đầu ngay để hiểu rõ hơn về bản thân và tiềm năng của bạn
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link to="/tests/iq">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl 
                             font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  Bắt đầu ngay
                </motion.button>
              </Link>
              <button className="px-8 py-4 bg-white/10 rounded-xl font-semibold text-white 
                               border border-white/20 hover:bg-white/20 transition-colors">
                Tìm hiểu thêm
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
