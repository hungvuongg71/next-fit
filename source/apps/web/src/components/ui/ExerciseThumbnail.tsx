"use client"

import { useState, useMemo, useCallback } from "react"
import { Exercise } from "@/types"

function getYouTubeThumbnailUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

interface ExerciseThumbnailProps {
  exercise: Exercise
  className?: string
  style?: React.CSSProperties
  onError?: () => void
}

export default function ExerciseThumbnail({ exercise, className, style, onError }: ExerciseThumbnailProps) {
  const urls = useMemo(() => {
    const list: string[] = []
    const vThumb = getYouTubeThumbnailUrl(exercise.in_depth_youtube_explanation)
    if (vThumb) list.push(vThumb)
    const sThumb = getYouTubeThumbnailUrl(exercise.short_youtube_demonstration)
    if (sThumb) list.push(sThumb)
    if (vThumb) list.push(vThumb.replace("hqdefault", "default"))
    if (sThumb) list.push(sThumb.replace("hqdefault", "default"))
    if (exercise.in_depth_youtube_explanation) list.push(exercise.in_depth_youtube_explanation)
    if (exercise.short_youtube_demonstration) list.push(exercise.short_youtube_demonstration)
    return list
  }, [exercise])

  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  const handleError = useCallback(() => {
    if (index < urls.length - 1) {
      setIndex((i) => i + 1)
    } else {
      setFailed(true)
      onError?.()
    }
  }, [index, urls.length, onError])

  if (failed || !urls.length) return null

  return (
    <img
      src={urls[index]}
      alt={exercise.name}
      className={className}
      style={style}
      loading="lazy"
      onError={handleError}
    />
  )
}
