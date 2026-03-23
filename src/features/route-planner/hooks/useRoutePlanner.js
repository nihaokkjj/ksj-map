import { useEffect, useEffectEvent, useRef, useState } from 'react'

const DEFAULT_CENTER = { lng: 116.404, lat: 39.915 }
const INPUT_IDS = {
  start: 'route-start-input',
  end: 'route-end-input',
}

function buildAddressLabel(value = {}) {
  return [
    value.province,
    value.city,
    value.district,
    value.street,
    value.streetNumber,
    value.business,
  ]
    .filter(Boolean)
    .join('')
}

function formatPoint(point) {
  return `${point.lng.toFixed(6)}, ${point.lat.toFixed(6)}`
}

function getStrategyLabel() {
  return 'Avoid congestion'
}

export function useRoutePlanner(BMapGL, ak) {
  const mapElementRef = useRef(null)
  const mapRef = useRef(null)
  const geocoderRef = useRef(null)
  const drivingRef = useRef(null)
  const autocompleteCleanupRef = useRef([])
  const markerCleanupRef = useRef([])
  const formRef = useRef({ start: '', end: '' })
  const routePathRef = useRef([])
  const pointRef = useRef({ start: null, end: null })
  const pointMetaRef = useRef({
    start: { city: '', confirmed: false },
    end: { city: '', confirmed: false },
  })
  const requestIdRef = useRef(0)

  const [form, setForm] = useState({ start: '', end: '' })
  const [plannerState, setPlannerState] = useState({
    loading: false,
    routeReady: false,
    error: '',
    info: 'Enter a start and destination. Selecting a suggestion works best.',
  })
  const [summary, setSummary] = useState({
    distance: '--',
    duration: '--',
    strategy: getStrategyLabel(),
  })
  const [routeRequest, setRouteRequest] = useState(null)

  useEffect(() => {
    formRef.current = form
  }, [form])

  const clearMarkerHandlers = () => {
    markerCleanupRef.current.forEach((cleanup) => cleanup())
    markerCleanupRef.current = []
  }

  const queueRouteRequest = ({ points = null } = {}) => {
    if (!ak) {
      setPlannerState({
        loading: false,
        routeReady: false,
        error: 'No Baidu Map AK is available, so route planning is disabled.',
        info: 'Add the project AK to enable the live map flow.',
      })
      return
    }

    requestIdRef.current += 1
    setRouteRequest({
      id: requestIdRef.current,
      points,
    })
  }

  const setFieldValue = (field, value) => {
    formRef.current = {
      ...formRef.current,
      [field]: value,
    }

    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    pointRef.current[field] = null
    pointMetaRef.current[field] = {
      city: '',
      confirmed: false,
    }

    setPlannerState((current) => ({
      ...current,
      error: '',
      info: 'Address updated. You can continue typing or select a suggestion.',
    }))
  }

  const resetViewport = () => {
    const map = mapRef.current

    if (!map || routePathRef.current.length === 0) {
      return
    }

    const focusPoint = routePathRef.current[Math.floor(routePathRef.current.length / 2)]
    map.panTo(focusPoint)

    setPlannerState((current) => ({
      ...current,
      info: 'Map recentered on the route. Zoom is still fully manual.',
    }))
  }

  const submitRoute = async () => {
    queueRouteRequest()
  }

  const swapLocations = async () => {
    const nextForm = {
      start: formRef.current.end,
      end: formRef.current.start,
    }
    const nextPoints = {
      start: pointRef.current.end,
      end: pointRef.current.start,
    }
    const nextMeta = {
      start: pointMetaRef.current.end,
      end: pointMetaRef.current.start,
    }

    pointRef.current = nextPoints
    pointMetaRef.current = nextMeta
    formRef.current = nextForm
    setForm(nextForm)

    if (nextForm.start.trim() && nextForm.end.trim()) {
      queueRouteRequest({ points: nextPoints })
    }
  }

  const reverseGeocode = useEffectEvent((point) => {
    const geocoder = geocoderRef.current

    return new Promise((resolve) => {
      if (!geocoder) {
        resolve(formatPoint(point))
        return
      }

      geocoder.getLocation(point, (result) => {
        resolve(result?.address || formatPoint(point))
      })
    })
  })

  const geocodeAddress = useEffectEvent((field, fallbackAddress) => {
    const geocoder = geocoderRef.current
    const address = fallbackAddress || formRef.current[field]
    const city = pointMetaRef.current[field].city

    return new Promise((resolve, reject) => {
      if (!geocoder) {
        reject(new Error('The map geocoder is not ready yet.'))
        return
      }

      geocoder.getPoint(
        address,
        (point) => {
          if (point) {
            resolve(point)
            return
          }

          reject(new Error(`Could not resolve the ${field} address: ${address}`))
        },
        city,
      )
    })
  })

  const handleMarkerDragEnd = useEffectEvent(async (field, marker) => {
    const point = marker.getPosition()
    const label = await reverseGeocode(point)

    pointRef.current = {
      ...pointRef.current,
      [field]: point,
    }
    pointMetaRef.current[field] = {
      city: '',
      confirmed: true,
    }
    formRef.current = {
      ...formRef.current,
      [field]: label,
    }

    setForm((current) => ({
      ...current,
      [field]: label,
    }))

    queueRouteRequest({
      points: {
        ...pointRef.current,
        [field]: point,
      },
    })
  })

  const handleSearchComplete = useEffectEvent((results) => {
    const map = mapRef.current
    const driving = drivingRef.current

    if (!map || !driving || driving.getStatus() !== window.BMAP_STATUS_SUCCESS) {
      setPlannerState({
        loading: false,
        routeReady: false,
        error: 'Route planning failed. Please verify the addresses.',
        info: 'Try selecting a suggestion from the autocomplete list.',
      })
      return
    }

    if (!results || results.getNumPlans() === 0) {
      setPlannerState({
        loading: false,
        routeReady: false,
        error: 'No route could be found.',
        info: 'Try a different start point, destination, or city scope.',
      })
      return
    }

    const plan = results.getPlan(0)
    const path = []

    for (let routeIndex = 0; routeIndex < plan.getNumRoutes(); routeIndex += 1) {
      const route = plan.getRoute(routeIndex)
      path.push(...route.getPath())
    }

    routePathRef.current = path.length > 0 ? path : Object.values(pointRef.current).filter(Boolean)

    setSummary((current) => ({
      ...current,
      distance: plan.getDistance(true),
      duration: plan.getDuration(true),
      strategy: getStrategyLabel(),
    }))
    if (routePathRef.current.length > 0) {
      const focusPoint = routePathRef.current[Math.floor(routePathRef.current.length / 2)]
      map.panTo(focusPoint)
    }

    setPlannerState({
      loading: false,
      routeReady: true,
      error: '',
      info: 'Route ready. Zoom in and out with the mouse or map controls only.',
    })
  })

  useEffect(() => {
    if (!BMapGL || !mapElementRef.current || mapRef.current) {
      return undefined
    }

    const map = new BMapGL.Map(mapElementRef.current)
    const center = new BMapGL.Point(DEFAULT_CENTER.lng, DEFAULT_CENTER.lat)

    map.centerAndZoom(center, 11)
    map.enableScrollWheelZoom()
    map.enableContinuousZoom()
    map.enableDoubleClickZoom()
    map.addControl(new BMapGL.ScaleControl())
    map.addControl(new BMapGL.ZoomControl())

    geocoderRef.current = new BMapGL.Geocoder()
    mapRef.current = map

    drivingRef.current = new BMapGL.DrivingRoute(map, {
      renderOptions: {
        map,
        autoViewport: false,
      },
      policy: window.BMAP_DRIVING_POLICY_AVOID_CONGESTION,
      onSearchComplete: handleSearchComplete,
      onMarkersSet: (pois) => {
        clearMarkerHandlers()

        ;['start', 'end'].forEach((field, index) => {
          const marker = pois[index]?.marker
          if (!marker) {
            return
          }

          marker.enableDragging()

          const markerDragHandler = () => {
            void handleMarkerDragEnd(field, marker)
          }

          marker.addEventListener('dragend', markerDragHandler)
          markerCleanupRef.current.push(() => {
            marker.removeEventListener('dragend', markerDragHandler)
          })
        })
      },
    })

    const queueAutocompleteRouteRequest = () => {
      requestIdRef.current += 1
      setRouteRequest({
        id: requestIdRef.current,
        interactive: false,
        focusPoint: null,
        points: null,
      })
    }

    ;['start', 'end'].forEach((field) => {
      const autocomplete = new BMapGL.Autocomplete({
        input: INPUT_IDS[field],
        location: map,
      })

      const handleConfirm = ({ item }) => {
        const value = item?.value || {}
        const label = buildAddressLabel(value)

        if (!label) {
          return
        }

        const nextForm = {
          ...formRef.current,
          [field]: label,
        }

        formRef.current = nextForm
        pointRef.current[field] = null
        pointMetaRef.current[field] = {
          city: value.city || value.province || '',
          confirmed: true,
        }

        setForm(nextForm)

        if (nextForm.start.trim() && nextForm.end.trim()) {
          queueAutocompleteRouteRequest()
        }
      }

      autocomplete.addEventListener('onconfirm', handleConfirm)
      autocompleteCleanupRef.current.push(() => {
        autocomplete.removeEventListener('onconfirm', handleConfirm)
      })
    })

    return () => {
      clearMarkerHandlers()
      autocompleteCleanupRef.current.forEach((cleanup) => cleanup())
      autocompleteCleanupRef.current = []

      mapRef.current = null
      drivingRef.current = null
      geocoderRef.current = null
    }
  }, [BMapGL])

  useEffect(() => {
    if (!routeRequest || !BMapGL || !mapRef.current || !drivingRef.current) {
      return undefined
    }

    if (!ak) {
      return undefined
    }

    let cancelled = false

    const runRouteSearch = async () => {
      const startAddress = formRef.current.start.trim()
      const endAddress = formRef.current.end.trim()

      if (!startAddress || !endAddress) {
        setPlannerState((current) => ({
          ...current,
          error: 'Both start and destination are required.',
          info: 'Selecting addresses from autocomplete improves accuracy.',
        }))
        return
      }

      setPlannerState((current) => ({
        ...current,
        loading: true,
        error: '',
        info: routeRequest.interactive
          ? 'Recalculating the route from the drag result...'
          : 'Planning route...',
      }))

      try {
        const nextPoints = {
          start:
            routeRequest.points?.start ||
            pointRef.current.start ||
            (await geocodeAddress('start', startAddress)),
          end:
            routeRequest.points?.end ||
            pointRef.current.end ||
            (await geocodeAddress('end', endAddress)),
        }

        if (cancelled) {
          return
        }

        pointRef.current = nextPoints

        drivingRef.current.clearResults()
        drivingRef.current.search(nextPoints.start, nextPoints.end)
      } catch (error) {
        if (cancelled) {
          return
        }

        setPlannerState({
          loading: false,
          routeReady: false,
          error: error.message,
          info: 'If parsing fails, try a suggestion from the autocomplete list.',
        })
      }
    }

    void runRouteSearch()

    return () => {
      cancelled = true
    }
  }, [BMapGL, ak, routeRequest])

  return {
    form,
    plannerState,
    summary,
    mapElementRef,
    setFieldValue,
    resetViewport,
    submitRoute,
    swapLocations,
  }
}
