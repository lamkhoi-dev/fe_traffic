import { Link } from 'react-router-dom'

function TestWidgetPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Test Widget</h1>
          <p className="text-sm text-white/60">Trang test widget đã được chuyển qua FE</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="text-sm text-indigo-300 hover:text-indigo-200"
            href="/test-widget.html"
            target="_blank"
            rel="noreferrer"
          >
            Mở trực tiếp
          </a>
          <Link className="text-sm text-white/80 hover:text-white" to="/">
            Về trang chủ
          </Link>
        </div>
      </header>
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <iframe
          title="Test Widget"
          src="/test-widget.html"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  )
}

export default TestWidgetPage
