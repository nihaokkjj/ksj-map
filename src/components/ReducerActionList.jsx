export function ReducerActionList({ actions }) {
  return (
    <section className="surface surface-accent">
      <div className="section-heading">
        <p>Reducer Flow</p>
        <h2>状态变化都经过 action</h2>
        <span>如果你想知道界面为什么变了，就先看 dispatch 了哪个 action。</span>
      </div>

      <div className="reducer-list">
        {actions.map((item) => (
          <article key={item.type} className="reducer-item">
            <span className="inline-code">{item.type}</span>
            <h3>{item.summary}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
