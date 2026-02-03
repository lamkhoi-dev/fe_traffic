import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSettings, FiPieChart, FiGlobe, FiFileText, 
  FiLogOut, FiMenu, FiX, FiTrendingUp, FiList,
  FiBarChart2, FiSave, FiPlus, FiTrash2, FiEdit2,
  FiChevronDown, FiChevronUp, FiEye, FiCopy, FiStar,
  FiSearch, FiFilter, FiImage, FiVideo, FiCode,
  FiAlignLeft, FiType, FiCheck, FiSliders
} from 'react-icons/fi'
import { 
  FaGripVertical, FaHeading, FaParagraph, FaImage, 
  FaImages, FaListUl, FaListOl, FaCheckSquare,
  FaQuoteLeft, FaCode, FaYoutube, FaInfoCircle,
  FaMinus, FaTable, FaQuestionCircle, FaExternalLinkAlt,
  FaHtml5
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../services/api'

// Block Types Configuration
const BLOCK_TYPES = [
  { type: 'heading', icon: FaHeading, label: 'Tiêu đề', defaultData: { level: 2, text: 'Tiêu đề mới' } },
  { type: 'paragraph', icon: FaParagraph, label: 'Đoạn văn', defaultData: { text: 'Nội dung đoạn văn...' } },
  { type: 'image', icon: FaImage, label: 'Hình ảnh', defaultData: { url: '', alt: '', caption: '' } },
  { type: 'gallery', icon: FaImages, label: 'Thư viện ảnh', defaultData: { images: [], columns: 3 } },
  { type: 'list', icon: FaListUl, label: 'Danh sách', defaultData: { style: 'unordered', items: ['Mục 1', 'Mục 2'] } },
  { type: 'quote', icon: FaQuoteLeft, label: 'Trích dẫn', defaultData: { text: '', author: '' } },
  { type: 'code', icon: FaCode, label: 'Code', defaultData: { language: 'javascript', code: '', caption: '' } },
  { type: 'embed', icon: FaYoutube, label: 'Embed Video', defaultData: { type: 'youtube', url: '', caption: '' } },
  { type: 'callout', icon: FaInfoCircle, label: 'Callout', defaultData: { type: 'info', title: '', text: '' } },
  { type: 'divider', icon: FaMinus, label: 'Đường kẻ', defaultData: {} },
  { type: 'table', icon: FaTable, label: 'Bảng', defaultData: { withHeadings: true, content: [['Cột 1', 'Cột 2'], ['Dữ liệu 1', 'Dữ liệu 2']] } },
  { type: 'faq', icon: FaQuestionCircle, label: 'FAQ', defaultData: { items: [{ question: 'Câu hỏi?', answer: 'Câu trả lời...' }] } },
  { type: 'button', icon: FaExternalLinkAlt, label: 'Nút bấm', defaultData: { text: 'Click here', url: '#', variant: 'primary', size: 'medium' } },
  { type: 'html', icon: FaHtml5, label: 'HTML', defaultData: { html: '' } }
]

// Block Editor Component
const BlockEditor = ({ block, index, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [expanded, setExpanded] = useState(true)
  const blockConfig = BLOCK_TYPES.find(b => b.type === block.type)
  const Icon = blockConfig?.icon || FaParagraph

  const updateData = (field, value) => {
    onChange(index, { ...block, data: { ...block.data, [field]: value } })
  }

  const renderBlockFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cấp độ</label>
              <select
                value={block.data?.level || 2}
                onChange={(e) => updateData('level', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
                <option value={5}>H5</option>
                <option value={6}>H6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nội dung</label>
              <input
                type="text"
                value={block.data?.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="Nhập tiêu đề..."
              />
            </div>
          </div>
        )

      case 'paragraph':
        return (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nội dung (hỗ trợ LaTeX với $...$)</label>
            <textarea
              value={block.data?.text || ''}
              onChange={(e) => updateData('text', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-32 resize-y"
              placeholder="Nhập nội dung đoạn văn..."
            />
          </div>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL hình ảnh</label>
              <input
                type="text"
                value={block.data?.url || ''}
                onChange={(e) => updateData('url', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Alt text</label>
              <input
                type="text"
                value={block.data?.alt || ''}
                onChange={(e) => updateData('alt', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="Mô tả hình ảnh..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Caption</label>
              <input
                type="text"
                value={block.data?.caption || ''}
                onChange={(e) => updateData('caption', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="Chú thích hình ảnh..."
              />
            </div>
            {block.data?.url && (
              <img src={block.data.url} alt={block.data.alt} className="w-full max-h-48 object-cover rounded-lg" />
            )}
          </div>
        )

      case 'gallery':
        const images = block.data?.images || []
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Số cột</label>
              <select
                value={block.data?.columns || 3}
                onChange={(e) => updateData('columns', parseInt(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value={2}>2 cột</option>
                <option value={3}>3 cột</option>
                <option value={4}>4 cột</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hình ảnh</label>
              {images.map((img, imgIdx) => (
                <div key={imgIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => {
                      const newImages = [...images]
                      newImages[imgIdx] = { ...newImages[imgIdx], url: e.target.value }
                      updateData('images', newImages)
                    }}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="URL ảnh..."
                  />
                  <button
                    onClick={() => updateData('images', images.filter((_, i) => i !== imgIdx))}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateData('images', [...images, { url: '', alt: '', caption: '' }])}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                <FiPlus /> Thêm ảnh
              </button>
            </div>
          </div>
        )

      case 'list':
        const items = block.data?.items || []
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Kiểu danh sách</label>
              <select
                value={block.data?.style || 'unordered'}
                onChange={(e) => updateData('style', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="unordered">Bullet (•)</option>
                <option value="ordered">Số (1, 2, 3...)</option>
                <option value="checklist">Checklist (✓)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Các mục</label>
              {items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex gap-2 mb-2">
                  {block.data?.style === 'checklist' && (
                    <button
                      onClick={() => {
                        const newItems = [...items]
                        newItems[itemIdx] = typeof item === 'string' 
                          ? { text: item, checked: false }
                          : { ...item, checked: !item.checked }
                        updateData('items', newItems)
                      }}
                      className={`p-2 rounded-lg ${typeof item === 'object' && item.checked ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-gray-400'}`}
                    >
                      <FiCheck />
                    </button>
                  )}
                  <input
                    type="text"
                    value={typeof item === 'string' ? item : item.text}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[itemIdx] = block.data?.style === 'checklist'
                        ? { text: e.target.value, checked: typeof item === 'object' ? item.checked : false }
                        : e.target.value
                      updateData('items', newItems)
                    }}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={() => updateData('items', items.filter((_, i) => i !== itemIdx))}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                onClick={() => updateData('items', [...items, block.data?.style === 'checklist' ? { text: '', checked: false } : ''])}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                <FiPlus /> Thêm mục
              </button>
            </div>
          </div>
        )

      case 'quote':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nội dung trích dẫn</label>
              <textarea
                value={block.data?.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-24 resize-y"
                placeholder="Nhập trích dẫn..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tác giả</label>
              <input
                type="text"
                value={block.data?.author || ''}
                onChange={(e) => updateData('author', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="Tên tác giả..."
              />
            </div>
          </div>
        )

      case 'code':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ngôn ngữ</label>
              <input
                type="text"
                value={block.data?.language || ''}
                onChange={(e) => updateData('language', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="javascript, python, html..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Code</label>
              <textarea
                value={block.data?.code || ''}
                onChange={(e) => updateData('code', e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-green-400 font-mono h-40 resize-y"
                placeholder="// Code here..."
              />
            </div>
          </div>
        )

      case 'embed':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Loại embed</label>
              <select
                value={block.data?.type || 'youtube'}
                onChange={(e) => updateData('type', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                type="text"
                value={block.data?.url || ''}
                onChange={(e) => updateData('url', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Caption</label>
              <input
                type="text"
                value={block.data?.caption || ''}
                onChange={(e) => updateData('caption', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                placeholder="Mô tả video..."
              />
            </div>
          </div>
        )

      case 'callout':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Loại</label>
              <select
                value={block.data?.type || 'info'}
                onChange={(e) => updateData('type', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="info">Info (xanh dương)</option>
                <option value="warning">Warning (vàng)</option>
                <option value="success">Success (xanh lá)</option>
                <option value="error">Error (đỏ)</option>
                <option value="tip">Tip (tím)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tiêu đề (tùy chọn)</label>
              <input
                type="text"
                value={block.data?.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nội dung</label>
              <textarea
                value={block.data?.text || ''}
                onChange={(e) => updateData('text', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-20 resize-y"
              />
            </div>
          </div>
        )

      case 'divider':
        return (
          <div className="text-center text-gray-500 py-4">
            <hr className="border-slate-600" />
            <span className="text-xs">Đường kẻ ngang</span>
          </div>
        )

      case 'table':
        const tableContent = block.data?.content || [['', '']]
        return (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={block.data?.withHeadings || false}
                onChange={(e) => updateData('withHeadings', e.target.checked)}
                className="rounded"
              />
              Hàng đầu tiên là header
            </label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {tableContent.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="border border-slate-600 p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => {
                              const newContent = tableContent.map((r, ri) => 
                                ri === rowIdx ? r.map((c, ci) => ci === cellIdx ? e.target.value : c) : [...r]
                              )
                              updateData('content', newContent)
                            }}
                            className="w-full bg-slate-700 px-2 py-1 text-white text-sm"
                          />
                        </td>
                      ))}
                      <td className="px-1">
                        <button
                          onClick={() => updateData('content', tableContent.filter((_, i) => i !== rowIdx))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateData('content', [...tableContent, tableContent[0].map(() => '')])}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                + Thêm hàng
              </button>
              <button
                onClick={() => updateData('content', tableContent.map(row => [...row, '']))}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                + Thêm cột
              </button>
            </div>
          </div>
        )

      case 'faq':
        const faqItems = block.data?.items || []
        return (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400 mb-1">Câu hỏi & Trả lời</label>
            {faqItems.map((item, itemIdx) => (
              <div key={itemIdx} className="bg-slate-800 p-3 rounded-lg space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqItems]
                      newItems[itemIdx] = { ...newItems[itemIdx], question: e.target.value }
                      updateData('items', newItems)
                    }}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Câu hỏi?"
                  />
                  <button
                    onClick={() => updateData('items', faqItems.filter((_, i) => i !== itemIdx))}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <textarea
                  value={item.answer}
                  onChange={(e) => {
                    const newItems = [...faqItems]
                    newItems[itemIdx] = { ...newItems[itemIdx], answer: e.target.value }
                    updateData('items', newItems)
                  }}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm h-20 resize-y"
                  placeholder="Câu trả lời..."
                />
              </div>
            ))}
            <button
              onClick={() => updateData('items', [...faqItems, { question: '', answer: '' }])}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
            >
              <FiPlus /> Thêm câu hỏi
            </button>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Text</label>
                <input
                  type="text"
                  value={block.data?.text || ''}
                  onChange={(e) => updateData('text', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input
                  type="text"
                  value={block.data?.url || ''}
                  onChange={(e) => updateData('url', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Variant</label>
                <select
                  value={block.data?.variant || 'primary'}
                  onChange={(e) => updateData('variant', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Size</label>
                <select
                  value={block.data?.size || 'medium'}
                  onChange={(e) => updateData('size', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={block.data?.newTab || false}
                onChange={(e) => updateData('newTab', e.target.checked)}
                className="rounded"
              />
              Mở trong tab mới
            </label>
          </div>
        )

      case 'html':
        return (
          <div>
            <label className="block text-sm text-gray-400 mb-1">HTML Code</label>
            <textarea
              value={block.data?.html || ''}
              onChange={(e) => updateData('html', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-orange-400 font-mono h-40 resize-y"
              placeholder="<div>...</div>"
            />
          </div>
        )

      default:
        return <p className="text-gray-500">Loại block không được hỗ trợ</p>
    }
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Block Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <FaGripVertical className="text-gray-500 cursor-move" />
        <Icon className="text-purple-400" />
        <span className="text-white font-medium flex-1">{blockConfig?.label || block.type}</span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(index)}
            disabled={isFirst}
            className={`p-1.5 rounded ${isFirst ? 'text-gray-600' : 'text-gray-400 hover:bg-slate-700'}`}
          >
            <FiChevronUp size={16} />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={isLast}
            className={`p-1.5 rounded ${isLast ? 'text-gray-600' : 'text-gray-400 hover:bg-slate-700'}`}
          >
            <FiChevronDown size={16} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-gray-400 hover:bg-slate-700 rounded"
          >
            {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Block Content */}
      {expanded && (
        <div className="p-4">
          {renderBlockFields()}
        </div>
      )}
    </div>
  )
}

// Post Editor Modal
const PostEditorModal = ({ post, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    thumbnail: post?.thumbnail || '',
    category: post?.category || '',
    tags: post?.tags?.join(', ') || '',
    author: post?.author || '',
    status: post?.status || 'draft',
    content: post?.content || [],
    seo: post?.seo || {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords?.length 
            ? formData.seo.keywords 
            : formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }
      }

      if (post?._id) {
        await api.put(`/api/posts/${post._id}`, payload)
        toast.success('Đã cập nhật bài viết!')
      } else {
        await api.post('/api/posts', payload)
        toast.success('Đã tạo bài viết mới!')
      }
      onSave()
    } catch (error) {
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const addBlock = (blockType) => {
    const config = BLOCK_TYPES.find(b => b.type === blockType)
    const newBlock = {
      type: blockType,
      data: { ...config.defaultData }
    }
    setFormData({ ...formData, content: [...formData.content, newBlock] })
    setShowBlockPicker(false)
  }

  const updateBlock = (index, block) => {
    const newContent = [...formData.content]
    newContent[index] = block
    setFormData({ ...formData, content: newContent })
  }

  const deleteBlock = (index) => {
    setFormData({ ...formData, content: formData.content.filter((_, i) => i !== index) })
  }

  const moveBlockUp = (index) => {
    if (index === 0) return
    const newContent = [...formData.content]
    ;[newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]]
    setFormData({ ...formData, content: newContent })
  }

  const moveBlockDown = (index) => {
    if (index >= formData.content.length - 1) return
    const newContent = [...formData.content]
    ;[newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]]
    setFormData({ ...formData, content: newContent })
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {post ? 'Sửa bài viết' : 'Tạo bài viết mới'}
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
            >
              <FiSave />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {['content', 'seo', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-purple-400 border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'content' ? 'Nội dung' : tab === 'seo' ? 'SEO' : 'Cài đặt'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg"
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tóm tắt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white h-20 resize-y"
                  placeholder="Mô tả ngắn về bài viết..."
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ảnh thumbnail</label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white"
                  placeholder="URL ảnh đại diện..."
                />
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="" className="mt-2 h-32 object-cover rounded-lg" />
                )}
              </div>

              {/* Content Blocks */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">Nội dung bài viết</label>
                <div className="space-y-3">
                  {formData.content.map((block, idx) => (
                    <BlockEditor
                      key={idx}
                      block={block}
                      index={idx}
                      onChange={updateBlock}
                      onDelete={deleteBlock}
                      onMoveUp={moveBlockUp}
                      onMoveDown={moveBlockDown}
                      isFirst={idx === 0}
                      isLast={idx === formData.content.length - 1}
                    />
                  ))}
                </div>

                {/* Add Block Button */}
                <div className="mt-4 relative">
                  <button
                    onClick={() => setShowBlockPicker(!showBlockPicker)}
                    className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPlus />
                    Thêm block
                  </button>

                  {/* Block Picker */}
                  {showBlockPicker && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl z-10">
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {BLOCK_TYPES.map(bt => (
                          <button
                            key={bt.type}
                            onClick={() => addBlock(bt.type)}
                            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-slate-700 transition-colors group"
                          >
                            <bt.icon className="text-xl text-gray-400 group-hover:text-purple-400" />
                            <span className="text-xs text-gray-500 group-hover:text-white">{bt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h3 className="font-medium text-white mb-4">Meta Tags</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, metaTitle: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder={formData.title || 'Tiêu đề SEO...'}
                    />
                    <p className="text-xs text-gray-500 mt-1">{(formData.seo.metaTitle || formData.title).length}/60 ký tự</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Meta Description</label>
                    <textarea
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, metaDescription: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-24 resize-y"
                      placeholder="Mô tả SEO..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seo.metaDescription.length}/160 ký tự</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h3 className="font-medium text-white mb-4">Open Graph (Facebook)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">OG Title</label>
                    <input
                      type="text"
                      value={formData.seo.ogTitle}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, ogTitle: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder={formData.title || 'Tiêu đề khi share Facebook...'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">OG Description</label>
                    <textarea
                      value={formData.seo.ogDescription}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, ogDescription: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-20 resize-y"
                      placeholder="Mô tả khi share Facebook..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">OG Image</label>
                    <input
                      type="text"
                      value={formData.seo.ogImage}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seo: { ...formData.seo, ogImage: e.target.value }
                      })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                      placeholder={formData.thumbnail || 'URL ảnh khi share Facebook...'}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h3 className="font-medium text-white mb-4">Canonical URL</h3>
                <input
                  type="text"
                  value={formData.seo.canonicalUrl || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    seo: { ...formData.seo, canonicalUrl: e.target.value }
                  })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  placeholder="https://example.com/blog/bai-viet"
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Tự động tạo từ tiêu đề"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Admin"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Danh mục</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Tin tức, Hướng dẫn..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tags (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="iq, test, trí tuệ..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Main Component
const AdminPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingPost, setEditingPost] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchPosts()
  }, [navigate])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterStatus) params.append('status', filterStatus)
      
      const response = await api.get(`/api/posts/admin/list?${params}`)
      setPosts(response.data.posts || [])
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchPosts, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, filterStatus])

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return
    try {
      await api.delete(`/api/posts/${id}`)
      toast.success('Đã xóa bài viết')
      fetchPosts()
    } catch (error) {
      toast.error('Lỗi khi xóa')
    }
  }

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/api/posts/${id}/duplicate`)
      toast.success('Đã nhân bản bài viết')
      fetchPosts()
    } catch (error) {
      toast.error('Lỗi khi nhân bản')
    }
  }

  const handleToggleFeatured = async (id) => {
    try {
      await api.post(`/api/posts/${id}/toggle-featured`)
      toast.success('Đã cập nhật')
      fetchPosts()
    } catch (error) {
      toast.error('Lỗi')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  const navItems = [
    { icon: FiPieChart, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiGlobe, label: 'Sites', path: '/admin/sites' },
    { icon: FiFileText, label: 'Tests', path: '/admin/tests' },
    { icon: FiList, label: 'Questions', path: '/admin/questions' },
    { icon: FiTrendingUp, label: 'Tasks', path: '/admin/tasks' },
    { icon: FiBarChart2, label: 'Stats', path: '/admin/stats' },
    { icon: FiEdit2, label: 'Bài viết', path: '/admin/posts', active: true },
    { icon: FiSliders, label: 'Cấu hình kết quả', path: '/admin/result-profiles' },
    { icon: FiSettings, label: 'Cài đặt', path: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-800/80 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-40 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white hover:bg-white/10 rounded-lg">
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Bài viết</h1>
        <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        item.active
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <FiLogOut size={20} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Quản lý bài viết</h1>
                <p className="text-gray-400">Tạo và quản lý bài viết cho SEO</p>
              </div>
              <button
                onClick={() => { setEditingPost(null); setShowEditor(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                <FiPlus />
                Tạo bài viết
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>

            {/* Posts List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Đang tải...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-2xl">
                <FiFileText className="text-5xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Chưa có bài viết nào</h3>
                <p className="text-gray-400 mb-4">Tạo bài viết đầu tiên để bắt đầu SEO</p>
                <button
                  onClick={() => { setEditingPost(null); setShowEditor(true) }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Tạo bài viết
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Thumbnail */}
                      {post.thumbnail && (
                        <img 
                          src={post.thumbnail} 
                          alt={post.title}
                          className="w-full md:w-32 h-24 object-cover rounded-lg"
                        />
                      )}
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {post.isFeatured && (
                            <FiStar className="text-yellow-400" />
                          )}
                          <h3 className="font-medium text-white truncate">{post.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-1 mb-2">{post.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className={`px-2 py-1 rounded-full ${
                            post.status === 'published' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                          </span>
                          {post.category && (
                            <span className="flex items-center gap-1">
                              <FiFilter /> {post.category}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FiEye /> {post.views || 0}
                          </span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingPost(post); setShowEditor(true) }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                          title="Sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(post._id)}
                          className={`p-2 rounded-lg ${post.isFeatured ? 'text-yellow-400 bg-yellow-500/20' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'}`}
                          title="Featured"
                        >
                          <FiStar />
                        </button>
                        <button
                          onClick={() => handleDuplicate(post._id)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                          title="Nhân bản"
                        >
                          <FiCopy />
                        </button>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                          title="Xem"
                        >
                          <FiEye />
                        </a>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <PostEditorModal
          post={editingPost}
          onClose={() => setShowEditor(false)}
          onSave={() => { setShowEditor(false); fetchPosts() }}
        />
      )}
    </div>
  )
}

export default AdminPosts
