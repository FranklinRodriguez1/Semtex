import { type Company } from "../services/admin";

export function CompanyList({
  companies,
  error,
  onSelect,
}: {
  companies: Company[];
  error: string | null;
  onSelect: (c: Company) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40">
      <div className="border-b border-[#3a494b] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
        Organizaciones ({companies.length})
      </div>
      {error ? (
        <p className="p-4 text-[11px] text-[#EF4444]">{error}</p>
      ) : companies.length === 0 ? (
        <p className="p-4 text-[11px] italic text-[#3a494b]">
          Sin empresas aún. Crea la primera.
        </p>
      ) : (
        <ul className="divide-y divide-[#3a494b]/40">
          {companies.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#201f21]"
              >
                <div>
                  <p className="text-[13px] text-[#E5E1E4]">{c.name}</p>
                  <p className="font-mono text-[10px] text-[#3a494b]">{c.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#b9cacb]">
                    {c.userCount} usuarios
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] ${
                      c.isActive
                        ? "bg-[#22C55E]/10 text-[#22C55E]"
                        : "bg-[#EF4444]/10 text-[#EF4444]"
                    }`}
                  >
                    {c.isActive ? "Activa" : "Inactiva"}
                  </span>
                  <span className="text-[#06B6D4]">›</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
