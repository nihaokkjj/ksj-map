const STUDY_FEED_URL = '/api/study-feed.json'

let cachedFeed = null
let pendingFeed = null

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

export async function fetchStudyFeed() {
  if (cachedFeed) {
    return cachedFeed
  }

  if (!pendingFeed) {
    pendingFeed = (async () => {
      await wait(650)

      const response = await fetch(STUDY_FEED_URL)

      if (!response.ok) {
        throw new Error(`请求失败：${response.status}`)
      }

      const payload = await response.json()
      cachedFeed = payload
      return payload
    })()
  }

  try {
    return await pendingFeed
  } finally {
    pendingFeed = null
  }
}

export function resetStudyFeedCache() {
  cachedFeed = null
  pendingFeed = null
}
