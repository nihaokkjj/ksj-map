export function RemoteLessonPanel({ request, importedIds, onRetry, onImport }) {
  return (
    <section className="surface">
      <div className="section-heading">
        <p>接口请求</p>
        <h2>fetch 回来的推荐练习</h2>
        <span>这个模块会请求本地 mock 接口，并把返回结果渲染成真实可操作的列表。</span>
      </div>

      {request.status === 'loading' ? (
        <div className="request-state">
          <strong>正在请求课程推荐...</strong>
          <p>观察这里的 loading UI，再对照 BoardPage 里的 useEffect 和 reducer action。</p>
        </div>
      ) : null}

      {request.status === 'error' ? (
        <div className="request-state request-state--error">
          <strong>请求失败</strong>
          <p>{request.error}</p>
          <button type="button" className="secondary-button" onClick={onRetry}>
            重新请求
          </button>
        </div>
      ) : null}

      {request.status === 'success' ? (
        <div className="request-list">
          <p className="request-meta">最近同步：{request.fetchedAt}</p>

          {request.items.map((item) => {
            const imported = importedIds.includes(item.id)

            return (
              <article key={item.id} className="request-item">
                <div className="request-item__copy">
                  <div className="task-header">
                    <h3>{item.title}</h3>
                    <span className="task-tag">{item.category}</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="request-focus-list">
                    {item.focus.map((focus) => (
                      <span key={focus}>{focus}</span>
                    ))}
                  </div>
                </div>

                <div className="request-item__meta">
                  <span className="task-time">{item.minutes} 分钟</span>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => onImport(item)}
                    disabled={imported}
                  >
                    {imported ? '已导入' : '导入任务板'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
