"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/state/context"
import TopHeader from "@/components/layout/TopHeader"
import BottomNav from "@/components/layout/BottomNav"
import CookieConsent from "@/components/ui/CookieConsent"
import StatsCard from "@/components/ui/StatsCard"
import RecentSessions from "@/components/ui/RecentSessions"
import WorkoutBanner from "@/components/ui/WorkoutBanner"
import { generateWeeklyPlan } from "@/lib/weekly-plan"
import { getCurrentStreak, getTotalWorkouts } from "@/lib/weekly-stats"

export default function HomePage() {
  const router = useRouter()
  const { state, setWeeklyPlan } = useApp()
  const [ready, setReady] = useState(false)
  const [dismissedWorkoutBanner, setDismissedWorkoutBanner] = useState(false)

  useEffect(() => {
    if (state.criteria && !state.weeklyPlan) {
      const plan = generateWeeklyPlan(state.criteria)
      setWeeklyPlan(plan)
    }
  }, [state.criteria, state.weeklyPlan, setWeeklyPlan])

  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready && state.isFirstVisit && !state.criteria) {
      router.replace("/onboarding")
    }
  }, [ready, state.isFirstVisit, state.criteria, router])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <TopHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 pt-5 pb-24">
          {/* Resume banner */}
          {state.workoutStarted && !dismissedWorkoutBanner && (
            <div className="mb-4">
              <WorkoutBanner onDismiss={() => setDismissedWorkoutBanner(true)} />
            </div>
          )}

          {/* Zone 1: Stats */}
          <section className="mb-6">
            <StatsCard
              streak={getCurrentStreak(state.workoutHistory)}
              totalWorkouts={getTotalWorkouts(state.workoutHistory)}
              history={state.workoutHistory}
            />
          </section>

          {/* Zone 2: Recent Sessions */}
          <section className="mb-6">
            <RecentSessions history={state.workoutHistory} />
          </section>
        </div>
      </main>

      <BottomNav />
      <CookieConsent />
    </div>
  )
}
