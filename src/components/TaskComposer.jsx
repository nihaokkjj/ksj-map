export function TaskComposer({ form, categoryOptions, onChange, onSubmit, onReset }) {
  return (
    <section className="surface">
      <div className="section-heading">
        <p>受控表单</p>
        <h2>添加一个新的学习任务</h2>
        <span>输入框仍然由 value 和 onChange 控制，只是最终会统一 dispatch 成 reducer action。</span>
      </div>

      <form className="composer-form" onSubmit={onSubmit}>
        <div className="field-group">
          <label htmlFor="title">任务名称</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="例如：把筛选区拆成单独组件"
          />
        </div>

        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="category">分类</label>
            <select id="category" name="category" value={form.category} onChange={onChange}>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="minutes">预计时长</label>
            <input
              id="minutes"
              name="minutes"
              type="number"
              min="5"
              step="5"
              value={form.minutes}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="note">学习备注</label>
          <textarea
            id="note"
            name="note"
            rows="4"
            value={form.note}
            onChange={onChange}
            placeholder="写下这次练习想重点观察的 React 语法点"
          />
        </div>

        <div className="action-row">
          <button className="primary-button" type="submit">
            dispatch 添加任务
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            恢复默认示例
          </button>
        </div>
      </form>
    </section>
  )
}
