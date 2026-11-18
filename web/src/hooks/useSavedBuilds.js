import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'autotorium.saved-builds.v1'

function readStoredBuilds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function useSavedBuilds() {
  const [builds, setBuilds] = useState(readStoredBuilds)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(builds))
    } catch {
      // Storage can be unavailable (private mode / quotas). The session still works.
    }
  }, [builds])

  const addBuild = useCallback((build) => {
    setBuilds((prev) => [build, ...prev])
  }, [])

  const removeBuild = useCallback((buildId) => {
    setBuilds((prev) => prev.filter((build) => build.id !== buildId))
  }, [])

  return { builds, addBuild, removeBuild }
}
