import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaClock, FaEye, FaTag, FaFolder, FaCalendar, FaUser,
  FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaLink,
  FaChevronLeft, FaArrowLeft, FaCheck, FaTimes, FaLightbulb,
  FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaQuoteLeft, FaPlay, FaExternalLinkAlt
} from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import MathText from '../components/MathText'

// Block Renderers
const HeadingBlock = ({ data }) => {
  const Tag = `h${data.level || 2}`
  const sizes = {
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
    5: 'text-base md:text-lg',
    6: 'text-sm md:text-base'
  }
  
  return (
    <Tag 
      id={data.id || ''} 
      className={`${sizes[data.level] || sizes[2]} font-bold text-white mb-4 mt-8`}
    >
      {data.text}
    </Tag>
  )
}

const ParagraphBlock = ({ data }) => (
  <div className="text-gray-300 leading-relaxed mb-4">
    <MathText text={data.text || ''} />
  </div>
)

const ImageBlock = ({ data }) => (
  <figure className="my-6">
    <img 
      src={data.url} 
      alt={data.alt || ''} 
      className="w-full rounded-xl shadow-lg"
      loading="lazy"
    />
    {data.caption && (
      <figcaption className="text-center text-sm text-gray-400 mt-3 italic">
        {data.caption}
      </figcaption>
    )}
  </figure>
)

const GalleryBlock = ({ data }) => {
  const cols = data.columns || 3
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }
  
  return (
    <div className={`grid ${gridClass[cols] || gridClass[3]} gap-4 my-6`}>
      {(data.images || []).map((img, idx) => (
        <figure key={idx} className="relative group">
          <img 
            src={img.url} 
            alt={img.alt || ''} 
            className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {img.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

const ListBlock = ({ data }) => {
  const style = data.style || 'unordered'
  const items = data.items || []
  
  if (style === 'checklist') {
    return (
      <ul className="space-y-2 my-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            {item.checked ? (
              <FaCheck className="text-green-400 mt-1 flex-shrink-0" />
            ) : (
              <FaTimes className="text-gray-500 mt-1 flex-shrink-0" />
            )}
            <span className={item.checked ? 'text-gray-300' : 'text-gray-400'}>{item.text}</span>
          </li>
        ))}
      </ul>
    )
  }
  
  const ListTag = style === 'ordered' ? 'ol' : 'ul'
  const listClass = style === 'ordered' ? 'list-decimal' : 'list-disc'
  
  return (
    <ListTag className={`${listClass} list-inside space-y-2 my-4 text-gray-300 ml-4`}>
      {items.map((item, idx) => (
        <li key={idx}>{typeof item === 'string' ? item : item.text}</li>
      ))}
    </ListTag>
  )
}

const QuoteBlock = ({ data }) => (
  <blockquote className="my-6 pl-6 border-l-4 border-purple-500 bg-white/5 rounded-r-xl p-6">
    <FaQuoteLeft className="text-purple-400 text-2xl mb-3 opacity-50" />
    <p className="text-lg text-gray-200 italic mb-3">{data.text}</p>
    {data.author && (
      <cite className="text-purple-300 not-italic">— {data.author}</cite>
    )}
  </blockquote>
)

const CodeBlock = ({ data }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(data.code || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="my-6 rounded-xl overflow-hidden">
      {data.language && (
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase font-mono">{data.language}</span>
          <button 
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="bg-gray-900 p-4 overflow-x-auto">
        <code className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
          {data.code}
        </code>
      </pre>
      {data.caption && (
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 italic">
          {data.caption}
        </div>
      )}
    </div>
  )
}

const EmbedBlock = ({ data }) => {
  const getEmbedUrl = () => {
    const url = data.url || ''
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : new URLSearchParams(new URL(url).search).get('v')
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // TikTok
    if (url.includes('tiktok.com')) {
      return url // TikTok requires special embed handling
    }
    
    return url
  }
  
  if (data.type === 'youtube' || data.url?.includes('youtube') || data.url?.includes('youtu.be')) {
    return (
      <div className="my-6">
        <div className="relative pb-[56.25%] rounded-xl overflow-hidden bg-black">
          <iframe
            src={getEmbedUrl()}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title={data.caption || 'Video embed'}
          />
        </div>
        {data.caption && (
          <p className="text-center text-sm text-gray-400 mt-3 italic">{data.caption}</p>
        )}
      </div>
    )
  }
  
  // Generic embed
  return (
    <div className="my-6 bg-white/5 rounded-xl p-6 text-center">
      <FaPlay className="text-4xl text-purple-400 mx-auto mb-3" />
      <a 
        href={data.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-purple-300 hover:text-purple-200 flex items-center justify-center gap-2"
      >
        Xem nội dung <FaExternalLinkAlt />
      </a>
    </div>
  )
}

const CalloutBlock = ({ data }) => {
  const types = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500', icon: FaInfoCircle, iconColor: 'text-blue-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', icon: FaExclamationTriangle, iconColor: 'text-yellow-400' },
    success: { bg: 'bg-green-500/10', border: 'border-green-500', icon: FaCheckCircle, iconColor: 'text-green-400' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500', icon: FaTimesCircle, iconColor: 'text-red-400' },
    tip: { bg: 'bg-purple-500/10', border: 'border-purple-500', icon: FaLightbulb, iconColor: 'text-purple-400' }
  }
  
  const config = types[data.type] || types.info
  const Icon = config.icon
  
  return (
    <div className={`my-6 ${config.bg} border-l-4 ${config.border} rounded-r-xl p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${config.iconColor} text-xl flex-shrink-0 mt-1`} />
        <div>
          {data.title && (
            <h4 className="font-semibold text-white mb-1">{data.title}</h4>
          )}
          <p className="text-gray-300">{data.text}</p>
        </div>
      </div>
    </div>
  )
}

const DividerBlock = () => (
  <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
)

const TableBlock = ({ data }) => (
  <div className="my-6 overflow-x-auto rounded-xl">
    <table className="w-full border-collapse">
      {data.withHeadings && data.content?.[0] && (
        <thead>
          <tr className="bg-purple-500/20">
            {data.content[0].map((cell, idx) => (
              <th key={idx} className="border border-white/10 px-4 py-3 text-left text-white font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {(data.withHeadings ? data.content?.slice(1) : data.content || []).map((row, rowIdx) => (
          <tr key={rowIdx} className="bg-white/5 hover:bg-white/10 transition-colors">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="border border-white/10 px-4 py-3 text-gray-300">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const FAQBlock = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null)
  
  return (
    <div className="my-6 space-y-3">
      {(data.items || []).map((item, idx) => (
        <div key={idx} className="bg-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="font-medium text-white">{item.question}</span>
            <FaChevronLeft className={`text-purple-400 transition-transform ${openIndex === idx ? '-rotate-90' : ''}`} />
          </button>
          {openIndex === idx && (
            <div className="px-5 pb-4 text-gray-300">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const ButtonBlock = ({ data }) => {
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    outline: 'bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white'
  }
  
  return (
    <div className={`my-6 text-${data.alignment || 'left'}`}>
      <a
        href={data.url}
        target={data.newTab ? '_blank' : '_self'}
        rel={data.newTab ? 'noopener noreferrer' : ''}
        className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all ${sizes[data.size] || sizes.medium} ${variants[data.variant] || variants.primary}`}
      >
        {data.text}
        {data.newTab && <FaExternalLinkAlt className="text-sm" />}
      </a>
    </div>
  )
}

const HTMLBlock = ({ data }) => (
  <div 
    className="my-6 prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: data.html || '' }} 
  />
)

// Block Renderer Map
const blockRenderers = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  list: ListBlock,
  quote: QuoteBlock,
  code: CodeBlock,
  embed: EmbedBlock,
  callout: CalloutBlock,
  divider: DividerBlock,
  table: TableBlock,
  faq: FAQBlock,
  button: ButtonBlock,
  html: HTMLBlock
}

// Related Post Card
const RelatedPostCard = ({ post }) => (
  <Link 
    to={`/blog/${post.slug}`}
    className="block bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors group"
  >
    {post.thumbnail && (
      <img 
        src={post.thumbnail} 
        alt={post.title}
        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    )}
    <div className="p-4">
      <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2">
        {post.title}
      </h4>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <FaClock />
        <span>{post.readingTime} phút đọc</span>
      </div>
    </div>
  </Link>
)

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPost()
    window.scrollTo(0, 0)
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/posts/${slug}`)
      setPost(response.data.post)
      
      // Fetch related posts
      if (response.data.post?._id) {
        const relatedRes = await api.get(`/api/posts/related/${response.data.post._id}`)
        setRelatedPosts(relatedRes.data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      navigate('/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(post?.title || '')
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy bài viết</h2>
          <Link to="/blog" className="text-purple-400 hover:text-purple-300">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    )
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt || '',
    image: post.thumbnail || '',
    author: {
      '@type': 'Person',
      name: post.author || 'Admin'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IQ Test Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': window.location.href
    }
  }

  // Generate FAQ structured data if there are FAQ blocks
  const faqBlocks = post.content?.filter(block => block.type === 'faq') || []
  const faqJsonLd = faqBlocks.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlocks.flatMap(block => 
      (block.data?.items || []).map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer
        }
      }))
    )
  } : null

  return (
    <>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} | Blog</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt || ''} />
        <meta name="keywords" content={post.seo?.keywords?.join(', ') || post.tags?.join(', ') || ''} />
        {post.seo?.canonicalUrl && <link rel="canonical" href={post.seo.canonicalUrl} />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.seo?.ogTitle || post.title} />
        <meta property="og:description" content={post.seo?.ogDescription || post.excerpt || ''} />
        <meta property="og:image" content={post.seo?.ogImage || post.thumbnail || ''} />
        <meta property="og:url" content={window.location.href} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        {post.category && <meta property="article:section" content={post.category} />}
        {post.tags?.map((tag, idx) => (
          <meta key={idx} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={post.seo?.twitterCard || 'summary_large_image'} />
        <meta name="twitter:title" content={post.seo?.twitterTitle || post.title} />
        <meta name="twitter:description" content={post.seo?.twitterDescription || post.excerpt || ''} />
        <meta name="twitter:image" content={post.seo?.twitterImage || post.thumbnail || ''} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
      </Helmet>

      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <FaArrowLeft />
            Quay lại Blog
          </Link>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <Link 
                  to={`/blog?category=${post.category}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                >
                  <FaFolder />
                  {post.category}
                </Link>
              )}
              {post.tags?.slice(0, 3).map(tag => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs hover:bg-white/20 transition-colors"
                >
                  <FaTag className="text-xs" />
                  {tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-8 pb-8 border-b border-white/10">
              {post.author && (
                <span className="flex items-center gap-2">
                  <FaUser className="text-purple-400" />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <FaCalendar className="text-purple-400" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="text-purple-400" />
                {post.readingTime} phút đọc
              </span>
              <span className="flex items-center gap-2">
                <FaEye className="text-purple-400" />
                {post.views?.toLocaleString()} lượt xem
              </span>
            </div>

            {/* Thumbnail */}
            {post.thumbnail && (
              <figure className="mb-8">
                <img 
                  src={post.thumbnail} 
                  alt={post.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              </figure>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-8 leading-relaxed italic border-l-4 border-purple-500 pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Content Blocks */}
            <div className="prose prose-invert max-w-none">
              {post.content?.map((block, idx) => {
                const BlockRenderer = blockRenderers[block.type]
                if (!BlockRenderer) return null
                return <BlockRenderer key={idx} data={block.data || {}} />
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Chia sẻ bài viết</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaFacebook />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  <FaTwitter />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                >
                  <FaLinkedin />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('pinterest')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <FaPinterest />
                  Pinterest
                </button>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <FaLink />
                  {copied ? 'Đã copy!' : 'Copy link'}
                </button>
              </div>
            </div>

            {/* Tags Footer */}
            {post.tags?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/blog?tag=${tag}`}
                      className="px-3 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(post => (
                  <RelatedPostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

export default BlogPost
