import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { LearningHero } from '../components/LearningHero'
import { ReducerActionList } from '../components/ReducerActionList'
import { RemoteLessonPanel } from '../components/RemoteLessonPanel'
import { TaskComposer } from '../components/TaskComposer'
import { TaskFilters } from '../components/TaskFilters'
import { TaskList } from '../components/TaskList'
import { CATEGORY_OPTIONS, REDUCER_ACTIONS } from '../data/courseData'
import { BOARD_STORAGE_KEY, boardReducer, initBoardState } from '../reducers/boardReducer'
import { fetchStudyFeed, resetStudyFeedCache } from '../services/studyApi'

const boardSnippet = `const [state, dispatch] = useReducer(boardReducer, undefined, initBoardState)

useEffect(() => {
  dispatch({ type: 'request_started' })
  fetchStudyFeed().then(...)
}, [])`

export function BoardPage() {
  const [state, dispatch] = useReducer(boardReducer, undefined, initBoardState)

  const summary = useMemo(() => {
    const completedCount = state.tasks.filter((task) => task.completed).length
    const totalMinutes = state.tasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0)
    const totalCount = state.tasks.length

    return {
      completedCount,
      activeCount: totalCount - completedCount,
      totalCount,
      totalMinutes,
      progress: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    }
  }, [state.tasks])

  const visibleTasks = useMemo(() => {
    const normalizedKeyword = state.keyword.trim().toLowerCase()

    return state.tasks.filter((task) => {
      const matchesFilter =
        state.filter === 'all' ||
        (state.filter === 'active' && !task.completed) ||
        (state.filter === 'completed' && task.completed)

      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        task.title.toLowerCase().includes(normalizedKeyword) ||
        task.note.toLowerCase().includes(normalizedKeyword)

      return matchesFilter && matchesKeyword
    })
  }, [state.filter, state.keyword, state.tasks])

  const importedIds = useMemo(
    () => state.tasks.map((task) => task.remoteId).filter(Boolean),
    [state.tasks],
  )
  const nextTask = state.tasks.find((task) => !task.completed) ?? null

  const loadFeed = useCallback(async () => {
    dispatch({ type: 'request_started' })

    try {
      const payload = await fetchStudyFeed()
      dispatch({
        type: 'request_succeeded',
        payload: {
          items: payload.modules,
          fetchedAt: payload.fetchedAt,
        },
      })
    } catch (error) {
      dispatch({
        type: 'request_failed',
        payload: error instanceof Error ? error.message : '未知错误',
      })
    }
  }, [])

  useEffect(() => {
    loadFeed()
  }, [loadFeed])

  useEffect(() => {
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(state.tasks))
    document.title = `任务板 ${summary.completedCount}/${summary.totalCount}`
  }, [state.tasks, summary.completedCount, summary.totalCount])

  function handleFieldChange(event) {
    dispatch({
      type: 'field_changed',
      payload: {
        name: event.target.name,
        value: event.target.value,
      },
    })
  }

  function handleAddTask(event) {
    event.preventDefault()
    dispatch({ type: 'task_added' })
  }

  function handleRetryRequest() {
    resetStudyFeedCache()
    loadFeed()
  }

  return (
    <div className="page-stack">
      <LearningHero
        eyebrow="Board Route"
        title="把交互、请求和状态都放进一个真正的页面里。"
        intro="这个页面是本项目的核心练习区。你会在这里同时看到 reducer、fetch、派生数据、受控表单和列表更新。"
        badges={['useReducer', 'fetch()', 'localStorage', 'derived state', 'dispatch', 'retry']}
        stats={[
          { label: '总任务', value: summary.totalCount },
          { label: '进行中', value: summary.activeCount },
          { label: '完成度', value: `${summary.progress}%` },
        ]}
        snippetLabel="页面核心模式"
        snippet={boardSnippet}
        calloutTitle="当前建议"
        calloutText={nextTask ? nextTask.title : '本地任务已经全部完成'}
        calloutMeta={
          nextTask
            ? `${nextTask.category} · ${nextTask.minutes} 分钟`
            : `可以从右侧接口推荐里继续导入新练习。`
        }
      />

      <main className="workspace">
        <div className="workspace-main">
          <TaskComposer
            form={state.form}
            categoryOptions={CATEGORY_OPTIONS}
            onChange={handleFieldChange}
            onSubmit={handleAddTask}
            onReset={() => dispatch({ type: 'board_reset' })}
          />

          <section className="surface">
            <div className="section-heading">
              <p>任务列表</p>
              <h2>由 reducer 驱动的本地交互区</h2>
              <span>提交表单、切换状态、删除任务和过滤列表都会走 dispatch。</span>
            </div>

            <TaskFilters
              filter={state.filter}
              keyword={state.keyword}
              visibleCount={visibleTasks.length}
              totalCount={summary.totalCount}
              completedCount={summary.completedCount}
              onFilterChange={(value) => dispatch({ type: 'filter_set', payload: value })}
              onKeywordChange={(value) => dispatch({ type: 'keyword_set', payload: value })}
              onClearCompleted={() => dispatch({ type: 'completed_cleared' })}
            />

            <TaskList
              tasks={visibleTasks}
              onToggle={(id) => dispatch({ type: 'task_toggled', payload: id })}
              onRemove={(id) => dispatch({ type: 'task_removed', payload: id })}
            />
          </section>
        </div>

        <aside className="workspace-side">
          <section className="surface surface-accent">
            <div className="section-heading">
              <p>页面概览</p>
              <h2>useMemo 继续负责派生数据</h2>
              <span>虽然状态管理升级成 reducer，但统计值依旧来自同一份任务数组。</span>
            </div>

            <div className="overview-grid">
              <article className="overview-item">
                <span>已完成</span>
                <strong>{summary.completedCount}</strong>
              </article>
              <article className="overview-item">
                <span>总时长</span>
                <strong>{summary.totalMinutes} 分钟</strong>
              </article>
              <article className="overview-item">
                <span>推荐课程</span>
                <strong>{state.request.items.length}</strong>
              </article>
            </div>

            <div className="progress-panel">
              <div className="progress-panel__text">
                <span>进度</span>
                <strong>{summary.progress}%</strong>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-bar" style={{ width: `${summary.progress}%` }} />
              </div>
            </div>

            <p className="surface-note">
              本地任务会在每次更新后自动保存到 localStorage，所以切换路由再回来也不会丢。
            </p>
          </section>

          <RemoteLessonPanel
            request={state.request}
            importedIds={importedIds}
            onRetry={handleRetryRequest}
            onImport={(item) => dispatch({ type: 'remote_task_imported', payload: item })}
          />

          <ReducerActionList actions={REDUCER_ACTIONS} />
        </aside>
      </main>
    </div>
  )
}
