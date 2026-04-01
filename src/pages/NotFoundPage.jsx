import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="surface not-found">
      <div className="section-heading">
        <p>404</p>
        <h2>这个路由不存在</h2>
        <span>你可以回到概览页，继续从任务板或学习地图进入练习。</span>
      </div>

      <Link className="primary-button" to="/">
        返回首页
      </Link>
    </section>
  )
}
