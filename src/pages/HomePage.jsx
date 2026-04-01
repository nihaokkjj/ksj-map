import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LearningHero } from '../components/LearningHero'
import { PRACTICE_NOTES, STAGE_ROUTES } from '../data/courseData'

const homeSnippet = `function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route path="board" element={<BoardPage />} />
      </Route>
    </Routes>
  )
}`

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'React 进阶练习版'
  }, [location.pathname])

  return (
    <div className="page-stack">
      <LearningHero
        eyebrow="Stage Upgrade"
        title="现在开始按真实项目的方式练 React。"
        intro="这一版不再只是基础语法演示，而是把路由、接口请求和 reducer 组织方式一起纳入练习路径。"
        badges={['Routes', 'NavLink', 'fetch', 'loading/error', 'useReducer', 'service layer']}
        stats={[
          { label: '练习主题', value: '3 大模块' },
          { label: '页面数量', value: '3 个路由' },
          { label: '状态策略', value: 'Reducer' },
        ]}
        snippetLabel="路由入口"
        snippet={homeSnippet}
        calloutTitle="建议路径"
        calloutText="先逛一圈结构，再进入任务板做交互练习。"
        calloutMeta="理解页面、布局和状态的关系，比只会写单个组件更重要。"
        actions={
          <>
            <Link className="primary-button" to="/board">
              进入任务板
            </Link>
            <Link className="secondary-button" to="/guide">
              查看学习地图
            </Link>
          </>
        }
      />

      <section className="route-grid">
        {STAGE_ROUTES.map((item) => (
          <article key={item.to} className="surface route-card">
            <p className="eyebrow">{item.kicker}</p>
            <h2>{item.title}</h2>
            <p className="route-card__description">{item.description}</p>
            <Link className="text-link" to={item.to}>
              打开这个页面
            </Link>
          </article>
        ))}
      </section>

      <section className="workspace workspace--wide">
        <section className="surface">
          <div className="section-heading">
            <p>这一阶段的重点</p>
            <h2>你会从“会写组件”过渡到“会搭结构”</h2>
            <span>路由、请求和状态收口，是 React 项目开始像项目的第一步。</span>
          </div>

          <div className="note-list">
            {PRACTICE_NOTES.map((item) => (
              <article key={item} className="note-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="surface surface-accent">
          <div className="section-heading">
            <p>升级线索</p>
            <h2>这版项目为什么值得练</h2>
            <span>你之后学 Context、状态库、路由守卫和真实接口时，都会从这里顺下来。</span>
          </div>

          <div className="timeline-list">
            <article className="timeline-item">
              <span className="inline-code">1</span>
              <div>
                <h3>先看布局和页面出口</h3>
                <p>理解 AppShell + Outlet 后，页面切换的整体结构会一下清晰很多。</p>
              </div>
            </article>
            <article className="timeline-item">
              <span className="inline-code">2</span>
              <div>
                <h3>再看 BoardPage 里的 reducer</h3>
                <p>观察 action 如何集中管理表单、列表、筛选和请求状态。</p>
              </div>
            </article>
            <article className="timeline-item">
              <span className="inline-code">3</span>
              <div>
                <h3>最后对照 Guide 页面</h3>
                <p>把 Vue 里的路由、store、异步请求思维映射到 React。</p>
              </div>
            </article>
          </div>
        </section>
      </section>
    </div>
  )
}
