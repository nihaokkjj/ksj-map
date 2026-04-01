const FILTER_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'completed' },
]

export function TaskFilters({
  filter,
  keyword,
  visibleCount,
  totalCount,
  completedCount,
  onFilterChange,
  onKeywordChange,
  onClearCompleted,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-pills">
          {FILTER_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={item.value === filter ? 'filter-pill is-active' : 'filter-pill'}
              onClick={() => onFilterChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="filter-summary">
          <span>当前显示 {visibleCount}</span>
          <strong>总计 {totalCount}</strong>
        </div>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="search"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          placeholder="搜索任务名或备注"
        />

        <button
          type="button"
          className="text-button"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
        >
          清空已完成
        </button>
      </div>
    </div>
  )
}
