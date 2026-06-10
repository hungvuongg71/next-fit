'use client'
import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: '#000000' }}>
      <p className="font-number text-7xl mb-4" style={{ color: '#2979FF' }}>404</p>
      <h1 className="font-display font-bold text-2xl mb-3" style={{ color: '#E0E0E0' }}>Trang không tồn tại</h1>
      <p className="font-body text-sm mb-8" style={{ color: '#6B6B7A' }}>Trang bạn tìm kiếm không có ở đây.</p>
      <Link href="/" className="px-8 py-4 rounded-2xl font-heading font-bold text-sm"
        style={{ background: '#2979FF', color: '#fff' }}>
        Về Trang Chính
      </Link>
    </div>
  )
}
