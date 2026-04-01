# React 进阶练习版

这个项目是在“React 基础任务板”的基础上继续升级出来的第二阶段练习版，适合你在掌握 JSX、props、useState、列表渲染之后，继续练这三块：

- 路由拆页
- 接口请求
- `useReducer`

## 这版新增了什么

- `react-router-dom` 路由结构
- `AppShell + Outlet` 布局思路
- `fetch('/api/study-feed.json')` 请求 mock 接口
- loading / error / success 三态渲染
- `useReducer` 统一管理任务板状态
- `services` 和 `reducers` 分层

## 运行项目

```bash
pnpm dev
```

验证：

```bash
pnpm build
pnpm lint
```

## 推荐阅读顺序

1. `src/main.jsx`
2. `src/App.jsx`
3. `src/layouts/AppShell.jsx`
4. `src/pages/BoardPage.jsx`
5. `src/reducers/boardReducer.js`
6. `src/services/studyApi.js`
7. `src/components/RemoteLessonPanel.jsx`
8. `src/pages/GuidePage.jsx`

## 每个关键文件负责什么

- `src/main.jsx`
  - 给整个应用包上 `BrowserRouter`
- `src/App.jsx`
  - 定义路由表
- `src/layouts/AppShell.jsx`
  - 放导航、品牌区和 `Outlet`
- `src/pages/BoardPage.jsx`
  - 任务板主页面，集中展示 reducer、请求、副作用和派生数据
- `src/reducers/boardReducer.js`
  - 所有状态更新规则都写在这里
- `src/services/studyApi.js`
  - 把 `fetch` 请求封装出去
- `public/api/study-feed.json`
  - 本地 mock 接口数据

## 这版项目重点练什么

### 1. React Router

你会看到一个最基础但真实的结构：

- `BrowserRouter`
- `Routes / Route`
- `NavLink`
- `Outlet`

这已经是很多 React 项目的常见起点。

### 2. fetch 请求三态

请求不只是“拿到数据”，更重要的是把下面三种状态清楚地表达出来：

- loading
- success
- error

### 3. useReducer

当页面里有这些状态同时存在时：

- 任务列表
- 表单输入
- 筛选条件
- 搜索关键词
- 请求状态

继续堆很多 `useState` 就会开始乱。这个时候 `useReducer` 会更适合。

## Vue 到 React 的迁移提示

你可以先这样记：

- `vue-router` 对应 `react-router-dom`
- `Pinia action` 对应 `dispatch(action)`
- `store state` 对应 `reducer state`
- `onMounted + axios` 常对应 `useEffect + fetch`
- `provide / inject` 对应 `Context`

## 下一步还能继续怎么练

1. 给任务板加详情页和动态路由
2. 把 reducer 再和 Context 组合，做跨页面共享状态
3. 接入真实后端接口
4. 再升级到 `Zustand` 或 `Redux Toolkit`
