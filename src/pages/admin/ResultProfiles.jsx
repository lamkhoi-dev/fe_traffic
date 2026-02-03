import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPieChart, FiGlobe, FiFileText, FiBarChart2, 
  FiList, FiTrendingUp, FiEdit2, FiSettings, FiLogOut, 
  FiX, FiSliders, FiMenu, FiPlus, FiTrash2, FiCopy,
  FiCheck, FiSave, FiRefreshCw, FiChevronDown, FiChevronUp,
  FiEye, FiLayers, FiGrid, FiType
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api'

// ============ PROFILE LIST COMPONENT ============
const ProfileList = ({ profiles, selectedProfile, onSelect, onDelete, onClone, onSetDefault }) => {
  return (
    <div className="space-y-2">
      {profiles.map(profile => (
        <motion.div
          key={profile._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedProfile?._id === profile._id
              ? 'bg-purple-600/20 border-purple-500'
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
          }`}
          onClick={() => onSelect(profile)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white truncate">{profile.name}</h3>
                {profile.isDefault && (
                  <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                    Mặc định
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span className={`px-2 py-0.5 rounded-full ${
                  profile.layoutType === 'score' ? 'bg-blue-500/20 text-blue-400' :
                  profile.layoutType === 'percent' ? 'bg-green-500/20 text-green-400' :
                  profile.layoutType === 'mbti' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {profile.layoutType}
                </span>
                <span className="truncate">{profile.testTypes?.join(', ')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {!profile.isDefault && (
                <button
                  onClick={(e) => { e.stopPropagation(); onSetDefault(profile._id) }}
                  className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg"
                  title="Đặt làm mặc định"
                >
                  <FiCheck size={14} />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onClone(profile._id) }}
                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                title="Nhân bản"
              >
                <FiCopy size={14} />
              </button>
              {!profile.isDefault && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(profile._id) }}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  title="Xóa"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ============ SCORE LEVEL EDITOR ============
const ScoreLevelEditor = ({ levels, onChange }) => {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  
  const handleEdit = (level) => {
    setEditingId(level._id)
    setEditData({ ...level, strengths: level.strengths?.join('\n') || '', improvements: level.improvements?.join('\n') || '' })
  }
  
  const handleSave = () => {
    const updated = levels.map(l => 
      l._id === editingId 
        ? { ...editData, strengths: editData.strengths.split('\n').filter(Boolean), improvements: editData.improvements.split('\n').filter(Boolean) }
        : l
    )
    onChange(updated)
    setEditingId(null)
  }
  
  const handleAdd = () => {
    const newLevel = {
      _id: 'new-' + Date.now(),
      minScore: 0,
      maxScore: 100,
      level: 'Mức mới',
      emoji: '⭐',
      description: 'Mô tả...',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-purple-600',
      strengths: [],
      improvements: []
    }
    onChange([...levels, newLevel])
    setShowAdd(false)
  }
  
  const handleDelete = (id) => {
    if (confirm('Xóa mức điểm này?')) {
      onChange(levels.filter(l => l._id !== id))
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Mức điểm</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg"
        >
          <FiPlus size={14} /> Thêm
        </button>
      </div>
      
      <div className="space-y-3">
        {levels.map(level => (
          <div key={level._id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            {editingId === level._id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={editData.minScore}
                    onChange={e => setEditData({ ...editData, minScore: parseInt(e.target.value) })}
                    placeholder="Điểm min"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="number"
                    value={editData.maxScore}
                    onChange={e => setEditData({ ...editData, maxScore: parseInt(e.target.value) })}
                    placeholder="Điểm max"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editData.level}
                    onChange={e => setEditData({ ...editData, level: e.target.value })}
                    placeholder="Tên mức"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="text"
                    value={editData.emoji}
                    onChange={e => setEditData({ ...editData, emoji: e.target.value })}
                    placeholder="Emoji"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Mô tả"
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <textarea
                  value={editData.strengths}
                  onChange={e => setEditData({ ...editData, strengths: e.target.value })}
                  placeholder="Điểm mạnh (mỗi dòng 1 điểm)"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <textarea
                  value={editData.improvements}
                  onChange={e => setEditData({ ...editData, improvements: e.target.value })}
                  placeholder="Cần cải thiện (mỗi dòng 1 điểm)"
                  rows={3}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">
                    <FiCheck size={14} className="inline mr-1" /> Lưu
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg">
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{level.level}</span>
                      <span className="text-sm text-gray-400">{level.minScore} - {level.maxScore}</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">{level.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(level)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(level._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {showAdd && (
        <button
          onClick={handleAdd}
          className="w-full p-4 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 transition-colors"
        >
          <FiPlus className="inline mr-2" /> Thêm mức điểm mới
        </button>
      )}
    </div>
  )
}

// ============ PERCENT RANGE EDITOR ============
const PercentRangeEditor = ({ ranges, onChange }) => {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  
  const handleEdit = (range) => {
    setEditingId(range._id)
    setEditData({ ...range, advices: range.advices?.join('\n') || '' })
  }
  
  const handleSave = () => {
    const updated = ranges.map(r => 
      r._id === editingId 
        ? { ...editData, advices: editData.advices.split('\n').filter(Boolean) }
        : r
    )
    onChange(updated)
    setEditingId(null)
  }
  
  const handleAdd = () => {
    const newRange = {
      _id: 'new-' + Date.now(),
      minPercent: 0,
      maxPercent: 100,
      level: 'Mức mới',
      emoji: '📊',
      color: '#3b82f6',
      description: 'Mô tả...',
      advices: []
    }
    onChange([...ranges, newRange])
  }
  
  const handleDelete = (id) => {
    if (confirm('Xóa khoảng này?')) {
      onChange(ranges.filter(r => r._id !== id))
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Khoảng phần trăm</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg"
        >
          <FiPlus size={14} /> Thêm
        </button>
      </div>
      
      <div className="space-y-3">
        {ranges.map(range => (
          <div key={range._id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            {editingId === range._id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={editData.minPercent}
                    onChange={e => setEditData({ ...editData, minPercent: parseInt(e.target.value) })}
                    placeholder="% min"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="number"
                    value={editData.maxPercent}
                    onChange={e => setEditData({ ...editData, maxPercent: parseInt(e.target.value) })}
                    placeholder="% max"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editData.level}
                    onChange={e => setEditData({ ...editData, level: e.target.value })}
                    placeholder="Tên mức"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="text"
                    value={editData.emoji}
                    onChange={e => setEditData({ ...editData, emoji: e.target.value })}
                    placeholder="Emoji"
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                  placeholder="Mô tả"
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <textarea
                  value={editData.advices}
                  onChange={e => setEditData({ ...editData, advices: e.target.value })}
                  placeholder="Lời khuyên (mỗi dòng 1 lời khuyên)"
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">
                    <FiCheck size={14} className="inline mr-1" /> Lưu
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg">
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{range.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{range.level}</span>
                      <span className="text-sm text-gray-400">{range.minPercent}% - {range.maxPercent}%</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">{range.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(range)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(range._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ DISPLAY OPTIONS EDITOR ============
const DisplayOptionsEditor = ({ options, onChange }) => {
  const toggles = [
    { key: 'showHeader', label: 'Hiện header', desc: 'Tiêu đề và chúc mừng' },
    { key: 'showScore', label: 'Hiện điểm số', desc: 'Hiển thị điểm đạt được' },
    { key: 'showPercentile', label: 'Hiện percentile', desc: 'So sánh với người khác' },
    { key: 'showComparison', label: 'Hiện so sánh', desc: 'Biểu đồ so sánh' },
    { key: 'showStrengths', label: 'Hiện điểm mạnh', desc: 'Danh sách điểm mạnh' },
    { key: 'showImprovements', label: 'Hiện cải thiện', desc: 'Điểm cần cải thiện' },
    { key: 'showAdvice', label: 'Hiện lời khuyên', desc: 'Lời khuyên cho user' },
    { key: 'showQuestionDetails', label: 'Chi tiết câu hỏi', desc: 'Xem lại câu đúng/sai' },
    { key: 'showShareButtons', label: 'Nút chia sẻ', desc: 'Chia sẻ lên MXH' },
    { key: 'showRetryButton', label: 'Nút làm lại', desc: 'Làm lại bài test' }
  ]
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Tuỳ chọn hiển thị</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {toggles.map(toggle => (
          <label key={toggle.key} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600">
            <div>
              <span className="text-white">{toggle.label}</span>
              <p className="text-xs text-gray-400">{toggle.desc}</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={options[toggle.key] !== false}
                onChange={e => onChange({ ...options, [toggle.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-700 peer-checked:bg-purple-600 rounded-full transition-colors"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

// ============ LABELS EDITOR ============
const LabelsEditor = ({ labels, onChange }) => {
  const labelFields = [
    { key: 'pageTitle', label: 'Tiêu đề trang' },
    { key: 'pageSubtitle', label: 'Phụ đề' },
    { key: 'scoreLabel', label: 'Nhãn điểm' },
    { key: 'correctAnswers', label: 'Câu đúng' },
    { key: 'wrongAnswers', label: 'Câu sai' },
    { key: 'unanswered', label: 'Chưa làm' },
    { key: 'strengths', label: 'Điểm mạnh' },
    { key: 'improvements', label: 'Cần cải thiện' },
    { key: 'advice', label: 'Lời khuyên' },
    { key: 'retryButton', label: 'Nút làm lại' },
    { key: 'homeButton', label: 'Nút về home' }
  ]
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Tuỳ chỉnh nhãn</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {labelFields.map(field => (
          <div key={field.key}>
            <label className="block text-sm text-gray-400 mb-1">{field.label}</label>
            <input
              type="text"
              value={labels[field.key] || ''}
              onChange={e => onChange({ ...labels, [field.key]: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ THEME EDITOR ============
const ThemeEditor = ({ theme, onChange }) => {
  const colorFields = [
    { key: 'primaryColor', label: 'Màu chính' },
    { key: 'secondaryColor', label: 'Màu phụ' },
    { key: 'accentColor', label: 'Màu nhấn' }
  ]
  
  const gradientFields = [
    { key: 'excellent', label: 'Xuất sắc' },
    { key: 'good', label: 'Tốt' },
    { key: 'average', label: 'Trung bình' },
    { key: 'belowAverage', label: 'Dưới TB' },
    { key: 'needsWork', label: 'Cần CĐ' }
  ]
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Giao diện</h3>
      
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">Màu sắc</h4>
        <div className="grid grid-cols-3 gap-3">
          {colorFields.map(field => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[field.key] || '#3b82f6'}
                  onChange={e => onChange({ ...theme, [field.key]: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={theme[field.key] || '#3b82f6'}
                  onChange={e => onChange({ ...theme, [field.key]: e.target.value })}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">Gradient theo mức</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gradientFields.map(field => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
              <input
                type="text"
                value={theme.gradients?.[field.key] || ''}
                onChange={e => onChange({ 
                  ...theme, 
                  gradients: { ...theme.gradients, [field.key]: e.target.value } 
                })}
                placeholder="from-color-500 to-color-600"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ PROFILE EDITOR MODAL ============
const ProfileEditorModal = ({ profile, testTypes, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    testTypes: profile?.testTypes || [],
    layoutType: profile?.layoutType || 'score',
    scoreConfig: profile?.scoreConfig || { scoreLevels: [], adviceRanges: [], minScore: 70, maxScore: 150 },
    percentConfig: profile?.percentConfig || { percentRanges: [], passingPercent: 50 },
    mbtiConfig: profile?.mbtiConfig || { dimensions: [], types: [] },
    displayOptions: profile?.displayOptions || {},
    theme: profile?.theme || {},
    labels: profile?.labels || {},
    isActive: profile?.isActive !== false
  })
  const [activeTab, setActiveTab] = useState('basic')
  const [saving, setSaving] = useState(false)
  
  const tabs = [
    { id: 'basic', label: 'Cơ bản', icon: FiType },
    { id: 'config', label: 'Cấu hình', icon: FiSliders },
    { id: 'display', label: 'Hiển thị', icon: FiEye },
    { id: 'labels', label: 'Nhãn', icon: FiGrid },
    { id: 'theme', label: 'Giao diện', icon: FiLayers }
  ]
  
  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Vui lòng nhập tên profile')
      return
    }
    if (formData.testTypes.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 loại test')
      return
    }
    
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {profile ? 'Sửa Profile' : 'Tạo Profile Mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
            <FiX size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-slate-700 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'text-purple-400 border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tên Profile</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: IQ Test Standard"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả profile..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Loại Layout</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'score', label: 'Score-based', desc: 'IQ, EQ (điểm số)' },
                    { id: 'percent', label: 'Percent-based', desc: 'School (% đúng)' },
                    { id: 'mbti', label: 'MBTI', desc: 'Tính cách 16 loại' }
                  ].map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setFormData({ ...formData, layoutType: layout.id })}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        formData.layoutType === layout.id
                          ? 'bg-purple-600/20 border-purple-500'
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-medium text-white">{layout.label}</div>
                      <div className="text-xs text-gray-400">{layout.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Áp dụng cho loại test</label>
                <div className="flex flex-wrap gap-2">
                  {testTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => {
                        const current = formData.testTypes
                        if (current.includes(type.value)) {
                          setFormData({ ...formData, testTypes: current.filter(t => t !== type.value) })
                        } else {
                          setFormData({ ...formData, testTypes: [...current, type.value] })
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        formData.testTypes.includes(type.value)
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <label className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-white">Kích hoạt profile này</span>
              </label>
            </div>
          )}
          
          {activeTab === 'config' && (
            <div className="space-y-6">
              {formData.layoutType === 'score' && (
                <>
                  <ScoreLevelEditor
                    levels={formData.scoreConfig.scoreLevels || []}
                    onChange={levels => setFormData({
                      ...formData,
                      scoreConfig: { ...formData.scoreConfig, scoreLevels: levels }
                    })}
                  />
                  <hr className="border-slate-700" />
                  <PercentRangeEditor
                    ranges={formData.scoreConfig.adviceRanges || []}
                    onChange={ranges => setFormData({
                      ...formData,
                      scoreConfig: { ...formData.scoreConfig, adviceRanges: ranges }
                    })}
                  />
                </>
              )}
              
              {formData.layoutType === 'percent' && (
                <PercentRangeEditor
                  ranges={formData.percentConfig.percentRanges || []}
                  onChange={ranges => setFormData({
                    ...formData,
                    percentConfig: { ...formData.percentConfig, percentRanges: ranges }
                  })}
                />
              )}
              
              {formData.layoutType === 'mbti' && (
                <div className="text-center py-12 text-gray-400">
                  <FiSliders className="mx-auto text-4xl mb-4" />
                  <p>MBTI config sẽ được load từ file mbti.json</p>
                  <p className="text-sm">Bạn có thể tuỳ chỉnh display options và labels</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'display' && (
            <DisplayOptionsEditor
              options={formData.displayOptions}
              onChange={options => setFormData({ ...formData, displayOptions: options })}
            />
          )}
          
          {activeTab === 'labels' && (
            <LabelsEditor
              labels={formData.labels}
              onChange={labels => setFormData({ ...formData, labels: labels })}
            />
          )}
          
          {activeTab === 'theme' && (
            <ThemeEditor
              theme={formData.theme}
              onChange={theme => setFormData({ ...formData, theme: theme })}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
          >
            {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
            Lưu
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
export default function ResultProfiles() {
  const [profiles, setProfiles] = useState([])
  const [testTypes, setTestTypes] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterLayoutType, setFilterLayoutType] = useState('')
  const navigate = useNavigate()
  
  const menuItems = [
    { label: 'Dashboard', icon: FiPieChart, path: '/admin/dashboard' },
    { label: 'Quản lý Sites', icon: FiGlobe, path: '/admin/sites' },
    { label: 'Quản lý Tests', icon: FiFileText, path: '/admin/tests' },
    { label: 'Quản lý Questions', icon: FiBarChart2, path: '/admin/questions' },
    { label: 'Quản lý Tasks', icon: FiList, path: '/admin/tasks' },
    { label: 'Thống kê', icon: FiTrendingUp, path: '/admin/stats' },
    { label: 'Bài viết', icon: FiEdit2, path: '/admin/posts' },
    { label: 'Cấu hình kết quả', icon: FiSliders, path: '/admin/result-profiles', active: true },
    { label: 'Cài đặt', icon: FiSettings, path: '/admin/settings' },
  ]
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin')
      return
    }
    fetchData()
  }, [navigate])
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const [profilesRes, typesRes] = await Promise.all([
        api.get('/api/result-profiles'),
        api.get('/api/result-profiles/test-types')
      ])
      setProfiles(profilesRes.data.profiles || [])
      setTestTypes(typesRes.data.testTypes || [])
    } catch (error) {
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateDefaults = async () => {
    try {
      const res = await api.post('/api/result-profiles/create-defaults')
      toast.success(`Đã tạo ${res.data.created?.length || 0} profiles mặc định`)
      fetchData()
    } catch (error) {
      toast.error('Lỗi khi tạo profiles mặc định')
    }
  }
  
  const handleSaveProfile = async (data) => {
    try {
      if (editingProfile?._id) {
        await api.put(`/api/result-profiles/${editingProfile._id}`, data)
        toast.success('Đã cập nhật profile!')
      } else {
        await api.post('/api/result-profiles', data)
        toast.success('Đã tạo profile mới!')
      }
      setShowEditor(false)
      setEditingProfile(null)
      fetchData()
    } catch (error) {
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message))
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Xóa profile này?')) return
    try {
      await api.delete(`/api/result-profiles/${id}`)
      toast.success('Đã xóa profile')
      if (selectedProfile?._id === id) setSelectedProfile(null)
      fetchData()
    } catch (error) {
      toast.error('Lỗi: ' + (error.response?.data?.message || error.message))
    }
  }
  
  const handleClone = async (id) => {
    const name = prompt('Nhập tên cho bản sao:')
    if (!name) return
    try {
      await api.post(`/api/result-profiles/${id}/clone`, { name })
      toast.success('Đã nhân bản profile')
      fetchData()
    } catch (error) {
      toast.error('Lỗi khi nhân bản')
    }
  }
  
  const handleSetDefault = async (id) => {
    try {
      await api.post(`/api/result-profiles/${id}/set-default`)
      toast.success('Đã đặt làm mặc định')
      fetchData()
    } catch (error) {
      toast.error('Lỗi')
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }
  
  const filteredProfiles = filterLayoutType 
    ? profiles.filter(p => p.layoutType === filterLayoutType)
    : profiles
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-30 w-64 h-screen bg-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-xl"
          >
            <FiLogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-white hover:bg-white/10 rounded-lg">
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Cấu hình kết quả</h1>
            <div></div>
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white hidden lg:block">Cấu hình trang kết quả</h1>
              <p className="text-gray-400">Tuỳ chỉnh giao diện và nội dung trang kết quả theo từng loại test</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateDefaults}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
              >
                <FiRefreshCw /> Tạo mặc định
              </button>
              <button
                onClick={() => { setEditingProfile(null); setShowEditor(true) }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              >
                <FiPlus /> Tạo Profile
              </button>
            </div>
          </div>
          
          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterLayoutType('')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                !filterLayoutType ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterLayoutType('score')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                filterLayoutType === 'score' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Score (IQ/EQ)
            </button>
            <button
              onClick={() => setFilterLayoutType('percent')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                filterLayoutType === 'percent' ? 'bg-green-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Percent (Học đường)
            </button>
            <button
              onClick={() => setFilterLayoutType('mbti')}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                filterLayoutType === 'mbti' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              MBTI
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Đang tải...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-2xl">
              <FiSliders className="text-5xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Chưa có profile nào</h3>
              <p className="text-gray-400 mb-4">Tạo profile mới hoặc tạo các profile mặc định</p>
              <button
                onClick={handleCreateDefaults}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Tạo profiles mặc định
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map(profile => (
                <motion.div
                  key={profile._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{profile.name}</h3>
                        {profile.isDefault && (
                          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{profile.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      profile.layoutType === 'score' ? 'bg-blue-500/20 text-blue-400' :
                      profile.layoutType === 'percent' ? 'bg-green-500/20 text-green-400' :
                      profile.layoutType === 'mbti' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {profile.layoutType}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.testTypes?.slice(0, 4).map(type => (
                      <span key={type} className="px-2 py-0.5 text-xs bg-slate-700 text-gray-300 rounded">
                        {type}
                      </span>
                    ))}
                    {profile.testTypes?.length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-slate-700 text-gray-400 rounded">
                        +{profile.testTypes.length - 4}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
                    <button
                      onClick={() => { setEditingProfile(profile); setShowEditor(true) }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      <FiEdit2 size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => handleClone(profile._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                    >
                      <FiCopy size={14} /> Clone
                    </button>
                    {!profile.isDefault && (
                      <button
                        onClick={() => handleDelete(profile._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Editor Modal */}
      {showEditor && (
        <ProfileEditorModal
          profile={editingProfile}
          testTypes={testTypes}
          onSave={handleSaveProfile}
          onClose={() => { setShowEditor(false); setEditingProfile(null) }}
        />
      )}
    </div>
  )
}
