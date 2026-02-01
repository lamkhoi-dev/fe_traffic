// Grade configuration for grades 1-12
// Grades 1-6: Under development
// Grades 7-9: Borrow tests from grades 10-12
// Grades 10-12: Full data available

export const SUBJECTS = {
  math: { id: 'math', name: 'Toán học', prefix: 'toan', icon: '📐', color: 'from-blue-500 to-cyan-500' },
  physics: { id: 'physics', name: 'Vật lý', prefix: 'ly', icon: '⚛️', color: 'from-purple-500 to-pink-500' },
  english: { id: 'english', name: 'Tiếng Anh', prefix: 'anh', icon: '🌍', color: 'from-green-500 to-emerald-500' },
  history: { id: 'history', name: 'Lịch sử', prefix: 'su', icon: '📜', color: 'from-orange-500 to-red-500' },
}

export const GRADE_CONFIG = {
  // Grades 1-6: Under development
  1: {
    name: 'Lớp 1',
    description: 'Chương trình học dành cho học sinh lớp 1, tập trung vào nền tảng đọc, viết và tính toán cơ bản.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  2: {
    name: 'Lớp 2',
    description: 'Chương trình học dành cho học sinh lớp 2, phát triển kỹ năng đọc hiểu và toán học cơ bản.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  3: {
    name: 'Lớp 3',
    description: 'Chương trình học dành cho học sinh lớp 3, mở rộng kiến thức về ngôn ngữ và toán học.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  4: {
    name: 'Lớp 4',
    description: 'Chương trình học dành cho học sinh lớp 4, bắt đầu học các môn khoa học tự nhiên và xã hội.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  5: {
    name: 'Lớp 5',
    description: 'Chương trình học dành cho học sinh lớp 5, hoàn thiện kiến thức tiểu học chuẩn bị lên cấp 2.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  6: {
    name: 'Lớp 6',
    description: 'Chương trình học dành cho học sinh lớp 6, năm đầu cấp THCS với nhiều môn học mới.',
    status: 'development',
    subjects: [],
    borrowFrom: null,
  },
  // Grades 7-9: Borrow from grades 10-12
  7: {
    name: 'Lớp 7',
    description: 'Chương trình học dành cho học sinh lớp 7 với các môn Toán, Lý, Tiếng Anh, Lịch Sử.',
    status: 'borrowed',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: 10, // Borrow tests from grade 10
  },
  8: {
    name: 'Lớp 8',
    description: 'Chương trình học dành cho học sinh lớp 8 với các môn Toán, Lý, Tiếng Anh, Lịch Sử.',
    status: 'borrowed',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: 11, // Borrow tests from grade 11
  },
  9: {
    name: 'Lớp 9',
    description: 'Chương trình học dành cho học sinh lớp 9, chuẩn bị cho kỳ thi tuyển sinh vào lớp 10.',
    status: 'borrowed',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: 12, // Borrow tests from grade 12
  },
  // Grades 10-12: Full data
  10: {
    name: 'Lớp 10',
    description: 'Chương trình học dành cho học sinh lớp 10, năm đầu cấp THPT.',
    status: 'active',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: null,
  },
  11: {
    name: 'Lớp 11',
    description: 'Chương trình học dành cho học sinh lớp 11, nâng cao kiến thức chuyên sâu.',
    status: 'active',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: null,
  },
  12: {
    name: 'Lớp 12',
    description: 'Chương trình học dành cho học sinh lớp 12, chuẩn bị cho kỳ thi tốt nghiệp THPT.',
    status: 'active',
    subjects: ['math', 'physics', 'english', 'history'],
    borrowFrom: null,
  },
}

// Get display grade (for borrowed grades, show the target grade not source)
export const getDisplayGrade = (grade) => {
  return GRADE_CONFIG[grade]?.name || `Lớp ${grade}`
}

// Get actual data source grade (for grades 7-9, return the source grade 10-12)
export const getSourceGrade = (grade) => {
  const config = GRADE_CONFIG[grade]
  return config?.borrowFrom || grade
}

// Check if grade is under development
export const isUnderDevelopment = (grade) => {
  return GRADE_CONFIG[grade]?.status === 'development'
}

// Check if grade borrows from another grade
export const isBorrowedGrade = (grade) => {
  return GRADE_CONFIG[grade]?.status === 'borrowed'
}

// Get all grades as array for display
export const getAllGrades = () => {
  return Object.entries(GRADE_CONFIG).map(([grade, config]) => ({
    grade: parseInt(grade),
    ...config,
  }))
}

// Get grades by status
export const getGradesByStatus = (status) => {
  return Object.entries(GRADE_CONFIG)
    .filter(([_, config]) => config.status === status)
    .map(([grade, config]) => ({
      grade: parseInt(grade),
      ...config,
    }))
}

// Map grade type for API (e.g., grade7 -> grade10 for data fetching)
export const getGradeType = (grade) => {
  const sourceGrade = getSourceGrade(grade)
  return `grade${sourceGrade}`
}

// Subject prefix to subject ID mapping
export const prefixToSubject = {
  toan: 'math',
  ly: 'physics',
  anh: 'english',
  su: 'history',
}

// Subject ID to prefix mapping
export const subjectToPrefix = {
  math: 'toan',
  physics: 'ly',
  english: 'anh',
  history: 'su',
}
