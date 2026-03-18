/**
 * Search within page text content.
 */

import { useState, useCallback } from 'react'
import type { PageContentLine } from '../types'

export function useContentSearch(lines: PageContentLine[]) {
  const [query, setQuery] = useState('')
  const [matchIndices, setMatchIndices] = useState<number[]>([])
  const [currentMatch, setCurrentMatch] = useState(0)

  const search = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) {
      setMatchIndices([])
      setCurrentMatch(0)
      return
    }
    const lower = q.toLowerCase()
    const matches = lines
      .map((line, i) => (line.text.toLowerCase().includes(lower) ? i : -1))
      .filter(i => i >= 0)
    setMatchIndices(matches)
    setCurrentMatch(0)
  }, [lines])

  const nextMatch = useCallback(() => {
    if (matchIndices.length === 0) return -1
    const next = (currentMatch + 1) % matchIndices.length
    setCurrentMatch(next)
    return matchIndices[next]
  }, [matchIndices, currentMatch])

  const prevMatch = useCallback(() => {
    if (matchIndices.length === 0) return -1
    const prev = (currentMatch - 1 + matchIndices.length) % matchIndices.length
    setCurrentMatch(prev)
    return matchIndices[prev]
  }, [matchIndices, currentMatch])

  return {
    query,
    search,
    matchIndices,
    currentMatch,
    currentMatchLine: matchIndices[currentMatch] ?? -1,
    totalMatches: matchIndices.length,
    nextMatch,
    prevMatch,
  }
}
