export function LearningHero({
  eyebrow,
  title,
  intro,
  badges,
  stats,
  snippetLabel,
  snippet,
  calloutTitle,
  calloutText,
  calloutMeta,
  actions,
}) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-intro">{intro}</p>

        <div className="hero-badges">
          {badges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>

        <div className="hero-metrics">
          {stats.map((item) => (
            <div key={item.label}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-preview">
        <div className="preview-window">
          <div className="preview-window__dots">
            <span />
            <span />
            <span />
          </div>
          <p className="preview-window__label">{snippetLabel}</p>
          <pre>
            <code>{snippet}</code>
          </pre>
        </div>

        <div className="preview-callout">
          <p>{calloutTitle}</p>
          <strong>{calloutText}</strong>
          <span>{calloutMeta}</span>

          {actions ? <div className="hero-action-row">{actions}</div> : null}
        </div>
      </div>
    </section>
  )
}
