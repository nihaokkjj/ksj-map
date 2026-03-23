import { getBaiduMapAk } from './services/baiduMapLoader.js'
import { useBaiduMapLoader } from './hooks/useBaiduMapLoader.js'
import { useRoutePlanner } from './hooks/useRoutePlanner.js'

const baiduMapAk = getBaiduMapAk()

export function RoutePlanner() {
  const loader = useBaiduMapLoader(baiduMapAk)
  const {
    form,
    plannerState,
    summary,
    mapElementRef,
    setFieldValue,
    resetViewport,
    submitRoute,
    swapLocations,
  } = useRoutePlanner(loader.api, baiduMapAk)

  const handleSubmit = async (event) => {
    event.preventDefault()
    await submitRoute()
  }

  return (
    <main className="planner-page">
      <section className="planner-hero">
        <div className="planner-copy">
          <p className="planner-kicker">Baidu Map Route Skeleton</p>
          <h1>Plan two points first, then leave zooming entirely to the user.</h1>
          <p className="planner-intro">
            This scaffold wires a Baidu Map route-planning surface with two location inputs,
            distance and duration summary, auto-rendered driving directions, and draggable route
            endpoints while keeping zoom control fully manual.
          </p>
        </div>
        <div className="planner-status-strip">
          <span>Map status: {loader.status}</span>
          <span>Strategy: {summary.strategy}</span>
          <span>Zoom mode: manual only</span>
        </div>
      </section>

      <section className="planner-shell">
        <aside className="planner-sidebar">
          <form className="planner-form" onSubmit={handleSubmit}>
            <label className="planner-field">
              <span>Start</span>
              <input
                id="route-start-input"
                name="start"
                type="text"
                value={form.start}
                onChange={(event) => setFieldValue('start', event.target.value)}
                placeholder="Example: Beijing West Railway Station"
                autoComplete="off"
              />
            </label>

            <label className="planner-field">
              <span>Destination</span>
              <input
                id="route-end-input"
                name="end"
                type="text"
                value={form.end}
                onChange={(event) => setFieldValue('end', event.target.value)}
                placeholder="Example: Beijing South Railway Station"
                autoComplete="off"
              />
            </label>

            <div className="planner-actions">
              <button type="submit" className="primary-action" disabled={plannerState.loading}>
                {plannerState.loading ? 'Planning...' : 'Plan route'}
              </button>
              <button type="button" className="secondary-action" onClick={swapLocations}>
                Swap points
              </button>
              <button type="button" className="ghost-action" onClick={resetViewport}>
                Center route
              </button>
            </div>
          </form>

          <section className="summary-grid">
            <article className="summary-card emphasis">
              <p>Distance</p>
              <strong>{summary.distance}</strong>
            </article>
            <article className="summary-card">
              <p>Duration</p>
              <strong>{summary.duration}</strong>
            </article>
            <article className="summary-card">
              <p>Zoom</p>
              <strong>Manual</strong>
            </article>
          </section>

          <div className="notice-stack">
            {!baiduMapAk && (
              <div className="planner-notice warning">
                No Baidu Map AK was found in the current project. The scaffold is wired to read
                <code>VITE_BAIDU_MAP_AK</code> as soon as it exists.
              </div>
            )}

            {loader.error && <div className="planner-notice error">{loader.error}</div>}
            {plannerState.error && (
              <div className="planner-notice error">{plannerState.error}</div>
            )}

            <div className="planner-notice info">{plannerState.info}</div>
            <div className="planner-notice neutral">
              Current scaffold coverage: Baidu autocomplete, driving directions, draggable
              endpoints for replanning, and user-controlled zoom through the mouse wheel or map
              controls.
            </div>
          </div>
        </aside>

        <section className="planner-stage">
          <div className="map-hud">
            <span>Baidu Map WebGL</span>
            <span>Picking an autocomplete suggestion usually resolves more reliably</span>
          </div>
          <div className="map-frame">
            <div ref={mapElementRef} className="map-canvas" />
            {!baiduMapAk && (
              <div className="map-overlay">
                <div>
                  <p>Waiting for a Baidu Map AK</p>
                  <strong>The live map and route will appear here once the key is available.</strong>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
