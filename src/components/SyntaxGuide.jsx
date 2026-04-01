export function SyntaxGuide({ learningPoints, vueToReact, fileGuide }) {
  return (
    <div className="guide-stack">
      <section className="surface">
        <div className="section-heading">
          <p>语法地图</p>
          <h2>这个项目把 React 基础串在了一起</h2>
          <span>先看状态和组件，再回头对照 Vue，会更容易建立心智模型。</span>
        </div>

        <div className="point-list">
          {learningPoints.map((item) => (
            <article key={item.title} className="point-item">
              <span className="point-label">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface">
        <div className="section-heading">
          <p>Vue 对照</p>
          <h2>把熟悉的概念映射到 React</h2>
        </div>

        <div className="comparison-list">
          {vueToReact.map((item) => (
            <article key={item.vue} className="comparison-row">
              <div>
                <small>Vue</small>
                <strong>{item.vue}</strong>
              </div>
              <span className="comparison-arrow">→</span>
              <div>
                <small>React</small>
                <strong>{item.react}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface">
        <div className="section-heading">
          <p>看源码顺序</p>
          <h2>建议你按这条路径阅读</h2>
        </div>

        <div className="file-list">
          {fileGuide.map((item) => (
            <article key={item.path} className="file-item">
              <span className="inline-code">{item.path}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
