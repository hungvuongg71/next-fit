import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/state/context'
import ActiveWorkoutBanner from '@/components/ui/ActiveWorkoutBanner'

export const metadata: Metadata = {
  title: 'NextFit — Gym Workout Planner',
  description:
    'NextFit — Gym Workout Planner cá nhân hoá. Gợi ý bài tập theo mục tiêu, trình độ, thiết bị. Lên giáo án tuần, theo dõi lịch sử tập luyện. Dành cho người tập Việt Nam.',
  icons: { icon: '/next-fit/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <meta property="og:title" content="NextFit — Gym Workout Planner" />
        <meta property="og:description" content="Gợi ý bài tập cá nhân hoá mỗi ngày. Lên giáo án tuần, theo dõi lịch sử tập luyện." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:image" content="https://hungvuongg71.github.io/next-fit/cover.png" />
        <meta property="og:image:width" content="1729" />
        <meta property="og:image:height" content="910" />
        <meta property="og:url" content="https://hungvuongg71.github.io/next-fit" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NextFit — Gym Workout Planner" />
        <meta name="twitter:description" content="Gợi ý bài tập cá nhân hoá mỗi ngày. Lên giáo án tuần, theo dõi lịch sử tập luyện." />
        <meta name="twitter:image" content="https://hungvuongg71.github.io/next-fit/cover.png" />
        <AppProvider>
          {children}
          <ActiveWorkoutBanner />
        </AppProvider>
      </body>
    </html>
  )
}
