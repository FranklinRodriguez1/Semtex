export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col justify-between border-r border-[#3a494b] bg-[#131315] px-6 py-8">
      <div className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#74f5ff]">SEMTEX</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-[#b9cacb]">V-0.42_CORE</p>
        </div>
        <nav className="space-y-2">
          {/* Fíjate que aquí puedes cambiar el 'bg' según la página activa */}
          <a className="flex items-center gap-3 rounded px-4 py-3 text-sm font-semibold text-[#E5E1E4] hover:bg-[#201f21]" href="/terminal">
            <span className="text-base">⌁</span> Terminal
          </a>
          <a className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]" href="/view/transfer">
            <span className="text-base">⬢</span> Upload - Receive
          </a>
          <a className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]" href="/view/configuration">
            <span className="text-base">⚙</span> Config
          </a>
          <a className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]" href="/audit">
            <span className="text-base">⚖</span> Audit
          </a>
        </nav>
      </div>
      <div className="space-y-2 border-t border-[#3a494b] pt-5">
        <a className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]" href="/settings">
          <span className="text-base">⚙</span> Settings
        </a>
        <a className="flex items-center gap-3 rounded px-4 py-3 text-sm text-[#b9cacb] hover:bg-[#201f21]" href="/security">
          <span className="text-base">🛡</span> Security
        </a>
      </div>
    </aside>
  );
}