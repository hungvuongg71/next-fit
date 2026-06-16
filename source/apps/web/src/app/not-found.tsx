'use client'
import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: "var(--color-bg)" }}>
      <p className="font-number text-7xl mb-4" style={{ color: "var(--color-primary)" }}>404</p>
      <h1 className="font-display font-bold text-2xl mb-3" style={{ color: "var(--color-text)" }}>Trang không tồn tại</h1>
      <p className="font-body text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>Trang bạn tìm kiếm không có ở đây.</p>
      <Link href="/" className="px-8 py-4 rounded-2xl font-heading font-bold text-sm"
        style={{ background: "var(--color-primary)", color: '#fff' }}>
        Về Trang Chính
      </Link>
    </div>
  )
}
