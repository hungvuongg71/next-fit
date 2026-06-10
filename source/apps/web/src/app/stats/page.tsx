'use client'
import TopHeader from '@/components/layout/TopHeader'
import BottomNav from '@/components/layout/BottomNav'
import { BarChart2 } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
      <TopHeader />
      <main className="flex-1 px-4 pt-8 pb-24 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(41,121,255,0.1)' }}>
          <BarChart2 size={28} style={{ color: '#2979FF' }} />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2" style={{ color: '#E0E0E0' }}>Thống kê</h1>
        <p className="font-body text-sm text-center" style={{ color: '#6B6B7A' }}>
          Lịch sử buổi tập và tiến trình của bạn sẽ hiển thị tại đây.
        </p>
      </main>
      <BottomNav />
    </div>
  )
}
