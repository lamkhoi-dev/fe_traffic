/**
 * Device Fingerprint Generator
 * 
 * Tạo fingerprint dựa trên đặc điểm thiết bị (không phụ thuộc browser)
 * QUAN TRỌNG: Thuật toán này PHẢI GIỐNG với widget.js và test-widget.html
 */

// Hàm hash - GIỐNG WIDGET
const simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).toUpperCase()
}

/**
 * Generate device fingerprint - SYNC với widget.js
 * Chỉ dùng các thuộc tính ỔN ĐỊNH - không thay đổi theo zoom/cửa sổ
 * ĐÃ BỎ: devicePixelRatio vì nó thay đổi theo browser zoom level
 */
export const getDeviceFingerprint = async () => {
  try {
    const data = [
      screen.width,           // Độ phân giải màn hình - ổn định
      screen.height,          // Độ phân giải màn hình - ổn định
      screen.colorDepth,      // Độ sâu màu - phần cứng
      Intl.DateTimeFormat().resolvedOptions().timeZone,  // Timezone - hệ thống
      new Date().getTimezoneOffset(),  // Timezone offset - hệ thống
      navigator.hardwareConcurrency || 0,  // CPU cores - phần cứng
      navigator.maxTouchPoints || 0   // Touch support - phần cứng
    ].join('|')

    const fingerprint = 'FP_' + simpleHash(data)
    
    // Store in localStorage for consistency
    localStorage.setItem('device_fp', fingerprint)
    
    return fingerprint
  } catch (error) {
    console.error('Error generating fingerprint:', error)
    // Fallback: generate random ID and store it
    const fallbackFp = 'FP_FB' + Math.random().toString(36).substr(2, 6).toUpperCase()
    localStorage.setItem('device_fp', fallbackFp)
    return fallbackFp
  }
}

/**
 * Get stored fingerprint (without regenerating)
 */
export const getStoredFingerprint = () => {
  return localStorage.getItem('device_fp')
}

/**
 * Clear stored fingerprint
 */
export const clearFingerprint = () => {
  localStorage.removeItem('device_fp')
}

export default {
  getDeviceFingerprint,
  getStoredFingerprint,
  clearFingerprint,
}
