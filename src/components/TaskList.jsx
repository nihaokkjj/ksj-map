export function TaskList({ tasks, onToggle, onRemove }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <strong>当前筛选结果为空</strong>
        <p>你可以切换筛选条件，或者导入右侧远程练习，继续观察 reducer 驱动的重新渲染。</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'task-item is-done' : 'task-item'}>
          <button
            type="button"
            className="task-toggle"
            aria-pressed={task.completed}
            onClick={() => onToggle(task.id)}
          >
            {task.completed ? '完成' : '待办'}
          </button>

          <div className="task-copy">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className="task-tag">{task.category}</span>
            </div>

            {task.note ? <p className="task-note">{task.note}</p> : null}
          </div>

          <div className="task-meta">
            <span className="task-time">{task.minutes} 分钟</span>
            <button type="button" className="ghost-button" onClick={() => onRemove(task.id)}>
              删除
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
