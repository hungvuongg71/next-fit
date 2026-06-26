import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/state/context'
import ActiveWorkoutBanner from '@/components/ui/ActiveWorkoutBanner'

export const metadata: Metadata = {
  title: 'NextFit — Gym Workout Planner',
  description: 'Gợi ý bài tập cá nhân hoá mỗi ngày',
  icons: { icon: '/next-fit/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AppProvider>
          {children}
          <ActiveWorkoutBanner />
        </AppProvider>
      </body>
    </html>
  )
}
