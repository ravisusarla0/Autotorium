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

// The id a shop-floor ticket links back to. Builds saved before build ids
// existed fall back to their own storage id.
export const getBuildId = (build) => build?.buildId ?? build?.id ?? null

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

  const updateBuild = useCallback((buildId, patch) => {
    setBuilds((prev) =>
      prev.map((build) => (build.id === buildId ? { ...build, ...patch } : build)),
    )
  }, [])

  const removeBuild = useCallback((buildId) => {
    setBuilds((prev) => prev.filter((build) => build.id !== buildId))
  }, [])

  return { builds, addBuild, updateBuild, removeBuild }
}
