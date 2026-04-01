export const CATEGORY_OPTIONS = [
  '环境搭建',
  'JSX 语法',
  '组件拆分',
  'Hooks',
  '路由',
  '接口请求',
  '状态管理',
]

export const INITIAL_FORM = {
  title: '',
  category: '状态管理',
  minutes: '30',
  note: '',
}

const seedTasks = [
  {
    id: 1,
    title: '把 BrowserRouter 放进 main.jsx',
    category: '路由',
    minutes: 15,
    note: '先理解为什么应用入口要包住路由容器。',
    completed: true,
  },
  {
    id: 2,
    title: '用 Routes 和 Route 拆出页面',
    category: '路由',
    minutes: 30,
    note: '从单页思维切到布局 + 页面模块。',
    completed: true,
  },
  {
    id: 3,
    title: '用 useReducer 管理任务板状态',
    category: '状态管理',
    minutes: 35,
    note: '观察 action 和 reducer 如何代替多个 useState。',
    completed: false,
  },
  {
    id: 4,
    title: '用 fetch 请求课程推荐数据',
    category: '接口请求',
    minutes: 25,
    note: '重点看 loading、error、success 三种状态怎么写。',
    completed: false,
  },
  {
    id: 5,
    title: '把远程推荐任务导入本地任务板',
    category: '接口请求',
    minutes: 20,
    note: '练习异步数据和本地状态的合并。',
    completed: false,
  },
]

export function createInitialTasks() {
  return seedTasks.map((task) => ({ ...task }))
}

export const LEARNING_POINTS = [
  {
    label: 'React Router',
    title: '开始从单页组件进入多页面结构',
    description: '通过布局组件、嵌套路由和 NavLink 建立真正的页面切换思维。',
  },
  {
    label: 'fetch',
    title: '学会处理异步请求的三态',
    description: 'loading、error、success 是最常见也最重要的请求状态。',
  },
  {
    label: 'useReducer',
    title: '把复杂状态更新统一收口',
    description: '当多个状态彼此关联时，用 action 描述变化会比散落的 setState 更清晰。',
  },
  {
    label: 'Service',
    title: '把请求逻辑从组件里分离出去',
    description: '组件只管渲染和交互，接口细节交给 services 层处理。',
  },
  {
    label: 'Layout',
    title: '用布局组件承接导航与公共结构',
    description: '头部导航、页面容器和出口都放到同一层，页面本身只关注业务区域。',
  },
]

export const VUE_TO_REACT = [
  {
    vue: 'vue-router',
    react: 'react-router-dom',
    description: '都负责页面切换，只是 React 通过组件来描述路由树。',
  },
  {
    vue: 'Pinia action',
    react: 'dispatch(action)',
    description: '都用一个明确的动作去驱动状态变化，方便排查和维护。',
  },
  {
    vue: 'store state',
    react: 'reducer state',
    description: '都可以集中管理复杂状态，只是 React 原生能力不自带跨组件共享。',
  },
  {
    vue: 'onMounted + axios',
    react: 'useEffect + fetch',
    description: '组件挂载后发请求是最常见的入门异步模式。',
  },
  {
    vue: 'provide / inject',
    react: 'Context',
    description: '如果以后任务板状态要跨多页共享，就会很自然过渡到 Context。',
  },
]

export const FILE_GUIDE = [
  {
    path: 'src/main.jsx',
    title: '路由入口',
    description: 'BrowserRouter 在这里接管整个应用的路由环境。',
  },
  {
    path: 'src/App.jsx',
    title: '路由表',
    description: 'Routes 和 Route 决定了每个 URL 渲染哪个页面。',
  },
  {
    path: 'src/layouts/AppShell.jsx',
    title: '公共布局',
    description: '导航、品牌信息和 Outlet 都放在这一层。',
  },
  {
    path: 'src/pages/BoardPage.jsx',
    title: '任务板页面',
    description: 'useReducer、useMemo、useEffect 和 fetch 都在这里串起来。',
  },
  {
    path: 'src/reducers/boardReducer.js',
    title: '状态规则',
    description: '所有任务板状态变化都通过 reducer 的 action 分支集中处理。',
  },
  {
    path: 'src/services/studyApi.js',
    title: '接口服务',
    description: '把 fetch 和错误处理从组件中拆出去。',
  },
]

export const STAGE_ROUTES = [
  {
    to: '/',
    kicker: 'Overview',
    title: '先看整体结构，再进入具体练习页面。',
    description: '这一页帮助你先建立多页面应用的全局认知。',
  },
  {
    to: '/board',
    kicker: 'Board',
    title: '在任务板里练 reducer、请求和派生状态。',
    description: '最核心的交互、状态和副作用都集中在这个页面。',
  },
  {
    to: '/guide',
    kicker: 'Guide',
    title: '把 Vue 心智映射到 React 进阶语法。',
    description: '把 useReducer、路由和 fetch 的思路串成一张学习地图。',
  },
]

export const REDUCER_ACTIONS = [
  {
    type: 'field_changed',
    summary: '更新表单输入',
    detail: '把 input/select/textarea 的变化统一映射到 reducer state.form。',
  },
  {
    type: 'task_added',
    summary: '提交表单并创建任务',
    detail: '从当前表单读取值，生成新任务，再顺带重置筛选和关键词。',
  },
  {
    type: 'task_toggled',
    summary: '切换完成状态',
    detail: '通过 id 精准更新数组中的目标任务，而不是直接修改原对象。',
  },
  {
    type: 'request_started / request_succeeded / request_failed',
    summary: '管理接口请求三态',
    detail: '把异步过程拆成清晰的状态节点，界面就更容易渲染 loading 和错误提示。',
  },
  {
    type: 'remote_task_imported',
    summary: '把远程课程导入本地任务板',
    detail: '这是接口返回数据和本地 reducer 状态结合的关键例子。',
  },
]

export const PRACTICE_NOTES = [
  '单页组件开始承受多块状态时，优先考虑 useReducer，而不是继续堆很多 useState。',
  'fetch 最重要的不是“发出去”，而是把 loading、error、success 清晰地落到界面。',
  '路由不是单纯换页面，而是帮助你按职责拆开页面、布局和共享结构。',
]
