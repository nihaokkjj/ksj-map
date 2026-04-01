import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: '概览' },
  { to: '/board', label: '任务板' },
  { to: '/guide', label: '学习地图' },
]

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="shell-header">
        <div className="shell-brand">
          <p>React Stage 2</p>
          <strong>路由、请求、Reducer 练习场</strong>
        </div>

        <nav className="shell-nav" aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'shell-link is-active' : 'shell-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="shell-body">
        <Outlet />
      </div>
    </div>
  )
}
