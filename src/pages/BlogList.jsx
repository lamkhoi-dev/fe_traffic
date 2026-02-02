import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, FaClock, FaEye, FaTag, FaFolder, 
  FaChevronLeft, FaChevronRight, FaStar, FaCalendar
} from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  
  const currentPage = parseInt(searchParams.get('page')) || 1
  const currentCategory = searchParams.get('category') || ''
  const currentTag = searchParams.get('tag') || ''
  const searchQuery = searchParams.get('search') || ''
  const [searchInput, setSearchInput] = useState(searchQuery)

  useEffect(() => {
    fetchPosts()
    fetchCategories()
    fetchTags()
    fetchFeaturedPosts()
  }, [currentPage, currentCategory, currentTag, searchQuery])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', currentPage)
      params.append('limit', 9)
      if (currentCategory) params.append('category', currentCategory)
      if (currentTag) params.append('tag', currentTag)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await api.get(`/api/posts?${params}`)
      setPosts(response.data.posts || [])
      setPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0 })
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const response = await api.get('/api/posts?featured=true&limit=3')
      setFeaturedPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/posts/categories')
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/posts/tags')
      setTags(response.data.tags || [])
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchInput) {
      params.set('search', searchInput)
    } else {
      params.delete('search')
    }
    params.delete('page')
    setSearchParams(params)
  }

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    setSearchParams(params)
  }

  const handleTagClick = (tag) => {
    const params = new URLSearchParams()
    if (tag) params.set('tag', tag)
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getCategoryLabel = (cat) => {
    const labels = {
      'general': 'Tổng hợp',
      'iq-test': 'IQ Test',
      'eq-test': 'EQ Test',
      'psychology': 'Tâm lý học',
      'education': 'Giáo dục',
      'tips': 'Mẹo hay',
      'news': 'Tin tức'
    }
    return labels[cat] || cat
  }

  return (
    <>
      <Helmet>
        <title>Blog - IQ & EQ Test | Kiến thức về trí tuệ và cảm xúc</title>
        <meta name="description" content="Khám phá các bài viết về IQ, EQ, tâm lý học và phát triển bản thân. Cập nhật kiến thức mới nhất về trí tuệ và cảm xúc." />
        <meta property="og:title" content="Blog - IQ & EQ Test" />
        <meta property="og:description" content="Khám phá các bài viết về IQ, EQ, tâm lý học và phát triển bản thân." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Kiến Thức
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Khám phá các bài viết về trí tuệ, cảm xúc và phát triển bản thân
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/20 rounded-2xl text-white 
                           placeholder-white/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-500 rounded-xl text-white font-medium hover:bg-purple-600 transition-colors"
              >
                Tìm
              </button>
            </div>
          </motion.form>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !currentCategory 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentCategory === cat.name 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {getCategoryLabel(cat.name)} ({cat.count})
              </button>
            ))}
          </motion.div>

          {/* Active Filters */}
          {(currentCategory || currentTag || searchQuery) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-white/60 text-sm">Đang lọc:</span>
              {currentCategory && (
                <span className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  <FaFolder className="text-xs" />
                  {getCategoryLabel(currentCategory)}
                  <button onClick={() => handleCategoryClick('')} className="hover:text-white">×</button>
                </span>
              )}
              {currentTag && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  <FaTag className="text-xs" />
                  {currentTag}
                  <button onClick={() => handleTagClick('')} className="hover:text-white">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  <FaSearch className="text-xs" />
                  "{searchQuery}"
                  <button onClick={() => {
                    setSearchInput('')
                    const params = new URLSearchParams(searchParams)
                    params.delete('search')
                    setSearchParams(params)
                  }} className="hover:text-white">×</button>
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Posts */}
              {!currentCategory && !currentTag && !searchQuery && currentPage === 1 && featuredPosts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    Bài viết nổi bật
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredPosts.map((post, idx) => (
                      <motion.article
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group"
                      >
                        <Link to={`/blog/${post.slug}`}>
                          <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video bg-white/5">
                            {post.thumbnail ? (
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                                <span className="text-4xl">📝</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                                <FaStar className="text-[10px]" /> Nổi bật
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                            {post.title}
                          </h3>
                          <p className="text-white/60 text-sm line-clamp-2">{post.excerpt}</p>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-white/10 rounded-2xl h-48 mb-4" />
                      <div className="bg-white/10 h-6 rounded mb-2" />
                      <div className="bg-white/10 h-4 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy bài viết</h3>
                  <p className="text-white/60">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="wait">
                      {posts.map((post, idx) => (
                        <motion.article
                          key={post._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: idx * 0.05 }}
                          className="glass-card overflow-hidden group"
                        >
                          <Link to={`/blog/${post.slug}`}>
                            <div className="relative overflow-hidden aspect-video">
                              {post.thumbnail ? (
                                <img
                                  src={post.thumbnail}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30">
                                  <span className="text-4xl">📝</span>
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-lg">
                                  {getCategoryLabel(post.category)}
                                </span>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                                {post.title}
                              </h3>
                              <p className="text-white/60 text-sm line-clamp-2 mb-4">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-xs text-white/40">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <FaCalendar />
                                    {formatDate(post.publishedAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FaClock />
                                    {post.readingTime} phút
                                  </span>
                                </div>
                                <span className="flex items-center gap-1">
                                  <FaEye />
                                  {post.views}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      >
                        <FaChevronLeft />
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const page = i + 1
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-xl font-medium transition-all ${
                                page === currentPage
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="text-white/40">...</span>
                        }
                        return null
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="p-3 rounded-xl bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}

                  <p className="text-center text-white/40 text-sm mt-4">
                    Hiển thị {posts.length} / {pagination.total} bài viết
                  </p>
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Popular Tags */}
              {tags.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaTag className="text-purple-400" />
                    Tags phổ biến
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 15).map(tag => (
                      <button
                        key={tag.name}
                        onClick={() => handleTagClick(tag.name)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          currentTag === tag.name
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-4">Khám phá</h3>
                <div className="space-y-3">
                  <Link 
                    to="/tests/iq" 
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">🧠</span>
                    <div>
                      <p className="text-white font-medium">Test IQ</p>
                      <p className="text-white/50 text-xs">Kiểm tra chỉ số thông minh</p>
                    </div>
                  </Link>
                  <Link 
                    to="/tests/eq" 
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">💖</span>
                    <div>
                      <p className="text-white font-medium">Test EQ</p>
                      <p className="text-white/50 text-xs">Đánh giá trí tuệ cảm xúc</p>
                    </div>
                  </Link>
                  <Link 
                    to="/mbti" 
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="text-white font-medium">Trắc nghiệm MBTI</p>
                      <p className="text-white/50 text-xs">Khám phá tính cách</p>
                    </div>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogList
