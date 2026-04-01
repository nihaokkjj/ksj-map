import { useEffect } from 'react'
import { ReducerActionList } from '../components/ReducerActionList'
import { SyntaxGuide } from '../components/SyntaxGuide'
import {
  FILE_GUIDE,
  LEARNING_POINTS,
  REDUCER_ACTIONS,
  VUE_TO_REACT,
} from '../data/courseData'

export function GuidePage() {
  useEffect(() => {
    document.title = '学习地图'
  }, [])

  return (
    <div className="page-stack">
      <section className="surface guide-hero">
        <div className="section-heading">
          <p>Guide Route</p>
          <h2>把 React 进阶练习串成一张完整地图</h2>
          <span>当你开始写多页面和异步逻辑时，理解结构比背 API 更重要。</span>
        </div>
      </section>

      <div className="workspace">
        <div className="workspace-main">
          <SyntaxGuide
            learningPoints={LEARNING_POINTS}
            vueToReact={VUE_TO_REACT}
            fileGuide={FILE_GUIDE}
          />
        </div>

        <aside className="workspace-side">
          <ReducerActionList actions={REDUCER_ACTIONS} />
        </aside>
      </div>
    </div>
  )
}
