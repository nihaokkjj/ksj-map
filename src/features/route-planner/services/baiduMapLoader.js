const BAIDU_MAP_SCRIPT_ID = 'baidu-map-webgl-sdk'
const BAIDU_MAP_PROMISE_KEY = '__baiduMapWebglPromise__'

export function getBaiduMapAk() {
  return (
    import.meta.env.VITE_BAIDU_MAP_AK ||
    import.meta.env.VITE_BMAP_AK ||
    import.meta.env.VITE_MAP_AK ||
    ''
  )
}

export function loadBaiduMapGL(ak) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('This environment cannot load Baidu Map.'))
  }

  if (window.BMapGL) {
    return Promise.resolve(window.BMapGL)
  }

  if (!ak) {
    return Promise.reject(
      new Error('Missing Baidu Map AK. Provide VITE_BAIDU_MAP_AK in Vite env.'),
    )
  }

  if (window[BAIDU_MAP_PROMISE_KEY]) {
    return window[BAIDU_MAP_PROMISE_KEY]
  }

  window[BAIDU_MAP_PROMISE_KEY] = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(BAIDU_MAP_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.BMapGL))
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Baidu Map script. Check network and AK.'))
      })
      return
    }

    const script = document.createElement('script')
    script.id = BAIDU_MAP_SCRIPT_ID
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${encodeURIComponent(ak)}`
    script.async = true
    script.onload = () => {
      if (window.BMapGL) {
        resolve(window.BMapGL)
      } else {
        reject(new Error('Baidu Map script loaded, but BMapGL was not found.'))
      }
    }
    script.onerror = () => {
      reject(new Error('Failed to load Baidu Map script. Check network and AK.'))
    }

    document.head.appendChild(script)
  })

  return window[BAIDU_MAP_PROMISE_KEY]
}
