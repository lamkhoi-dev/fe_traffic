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
 * Detect incognito/private browsing mode
 * Returns 1 if incognito detected, 0 if normal mode
 */
const detectIncognito = async () => {
  return new Promise((resolve) => {
    // Method 1: Check storage quota (Chrome/Edge)
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(({ quota }) => {
        // In incognito, quota is typically limited to ~120MB
        // Normal mode usually has much more (GBs)
        if (quota && quota < 200 * 1024 * 1024) { // Less than 200MB
          resolve(1)
          return
        }
      }).catch(() => {})
    }

    // Method 2: Check IndexedDB (Firefox)
    try {
      const db = indexedDB.open('test')
      db.onerror = () => resolve(1)
      db.onsuccess = () => {
        // Check if we can use it normally
        try {
          db.result.close()
          indexedDB.deleteDatabase('test')
        } catch (e) {
          resolve(1)
          return
        }
      }
    } catch (e) {
      resolve(1)
      return
    }

    // Method 3: Check FileSystem API (older Chrome)
    if (window.webkitRequestFileSystem) {
      window.webkitRequestFileSystem(
        window.TEMPORARY, 
        1,
        () => resolve(0), // Normal mode
        () => resolve(1)  // Incognito
      )
      return
    }

    // Method 4: Safari - check localStorage behavior
    try {
      localStorage.setItem('test_incognito', '1')
      localStorage.removeItem('test_incognito')
    } catch (e) {
      resolve(1)
      return
    }

    // Default: assume not incognito after 100ms
    setTimeout(() => resolve(0), 100)
  })
}

/**
 * Generate device fingerprint - SYNC với widget.js
 * Chỉ dùng các thuộc tính ỔN ĐỊNH - không thay đổi theo zoom/cửa sổ
 * ĐÃ BỎ: devicePixelRatio vì nó thay đổi theo browser zoom level
 * THÊM: Incognito detection
 */
export const getDeviceFingerprint = async () => {
  try {
    // Detect incognito mode
    const isIncognito = await detectIncognito()
    
    const data = [
      screen.width,           // Độ phân giải màn hình - ổn định
      screen.height,          // Độ phân giải màn hình - ổn định
      screen.colorDepth,      // Độ sâu màu - phần cứng
      Intl.DateTimeFormat().resolvedOptions().timeZone,  // Timezone - hệ thống
      new Date().getTimezoneOffset(),  // Timezone offset - hệ thống
      navigator.hardwareConcurrency || 0,  // CPU cores - phần cứng
      navigator.maxTouchPoints || 0,  // Touch support - phần cứng
      isIncognito             // Incognito mode flag
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
