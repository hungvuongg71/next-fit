import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/state/context'
import ActiveWorkoutBanner from '@/components/ui/ActiveWorkoutBanner'

export const metadata: Metadata = {
  title: 'NextFit — Gym Workout Planner',
  description:
    'NextFit — Gym Workout Planner cá nhân hoá. Gợi ý bài tập theo mục tiêu, trình độ, thiết bị. Lên giáo án tuần, theo dõi lịch sử tập luyện. Dành cho người tập Việt Nam.',
  icons: { icon: '/next-fit/favicon.ico' },
  openGraph: {
    title: 'NextFit — Gym Workout Planner',
    description: 'Gợi ý bài tập cá nhân hoá mỗi ngày. Lên giáo án tuần, theo dõi lịch sử tập luyện.',
    type: 'website',
    locale: 'vi_VN',
    images: [{ url: '/next-fit/cover.png', width: 1729, height: 910 }],
  },
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
