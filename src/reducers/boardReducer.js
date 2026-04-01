import { INITIAL_FORM, createInitialTasks } from '../data/courseData'

export const BOARD_STORAGE_KEY = 'react-study-lab-v2'

function readStoredTasks() {
  try {
    const rawValue = localStorage.getItem(BOARD_STORAGE_KEY)

    if (!rawValue) {
      return createInitialTasks()
    }

    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return createInitialTasks()
    }

    return parsedValue
  } catch {
    return createInitialTasks()
  }
}

export function initBoardState() {
  return {
    tasks: readStoredTasks(),
    form: { ...INITIAL_FORM },
    filter: 'all',
    keyword: '',
    request: {
      status: 'idle',
      items: [],
      fetchedAt: '',
      error: '',
    },
  }
}

export function boardReducer(state, action) {
  switch (action.type) {
    case 'field_changed': {
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.name]: action.payload.value,
        },
      }
    }

    case 'task_added': {
      const title = state.form.title.trim()

      if (!title) {
        return state
      }

      const note = state.form.note.trim()
      const minutes = Number(state.form.minutes)

      return {
        ...state,
        tasks: [
          {
            id: Date.now(),
            title,
            category: state.form.category,
            minutes: Number.isNaN(minutes) || minutes <= 0 ? 30 : minutes,
            note,
            completed: false,
          },
          ...state.tasks,
        ],
        form: { ...INITIAL_FORM },
        filter: 'all',
        keyword: '',
      }
    }

    case 'task_toggled': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task,
        ),
      }
    }

    case 'task_removed': {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }
    }

    case 'filter_set': {
      return {
        ...state,
        filter: action.payload,
      }
    }

    case 'keyword_set': {
      return {
        ...state,
        keyword: action.payload,
      }
    }

    case 'completed_cleared': {
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed),
      }
    }

    case 'board_reset': {
      return {
        ...state,
        tasks: createInitialTasks(),
        form: { ...INITIAL_FORM },
        filter: 'all',
        keyword: '',
      }
    }

    case 'request_started': {
      return {
        ...state,
        request: {
          ...state.request,
          status: 'loading',
          error: '',
        },
      }
    }

    case 'request_succeeded': {
      return {
        ...state,
        request: {
          status: 'success',
          items: action.payload.items,
          fetchedAt: action.payload.fetchedAt,
          error: '',
        },
      }
    }

    case 'request_failed': {
      return {
        ...state,
        request: {
          status: 'error',
          items: [],
          fetchedAt: '',
          error: action.payload,
        },
      }
    }

    case 'remote_task_imported': {
      const remoteItem = action.payload
      const exists = state.tasks.some(
        (task) => task.remoteId === remoteItem.id || task.title === remoteItem.title,
      )

      if (exists) {
        return state
      }

      return {
        ...state,
        tasks: [
          {
            id: Date.now(),
            remoteId: remoteItem.id,
            title: remoteItem.title,
            category: remoteItem.category,
            minutes: remoteItem.minutes,
            note: remoteItem.description,
            completed: false,
          },
          ...state.tasks,
        ],
      }
    }

    default: {
      return state
    }
  }
}
