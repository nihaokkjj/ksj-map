import { useEffect, useState } from 'react'
import { loadBaiduMapGL } from '../services/baiduMapLoader.js'

export function useBaiduMapLoader(ak) {
  const initialApi = typeof window !== 'undefined' ? window.BMapGL || null : null
  const [loaderState, setLoaderState] = useState({
    api: initialApi,
    status: initialApi ? 'ready' : ak ? 'loading' : 'missing-ak',
    error: '',
  })

  useEffect(() => {
    let cancelled = false

    if (!ak) {
      return undefined
    }

    loadBaiduMapGL(ak)
      .then((api) => {
        if (cancelled) {
          return
        }

        setLoaderState({
          api,
          status: 'ready',
          error: '',
        })
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        setLoaderState({
          api: null,
          status: 'error',
          error: error.message,
        })
      })

    return () => {
      cancelled = true
    }
  }, [ak])

  if (!ak) {
    return {
      api: null,
      status: 'missing-ak',
      error: 'Baidu Map AK was not found.',
    }
  }

  return loaderState
}
