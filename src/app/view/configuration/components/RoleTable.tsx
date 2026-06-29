import type { Role } from '../types';

interface RoleTableProps {
  roles: Role[];
}

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function RoleTable({ roles }: RoleTableProps) {
  if (roles.length === 0) {
    return (
      <div className="border border-[#3a494b] bg-[#0e0e10]/30">
        <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
          Roles del Sistema
        </div>
        <div className="p-4 text-[10px] text-[#3a494b] italic">
          No hay roles configurados...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#3a494b] bg-[#0e0e10]/30">
      <div className="px-4 py-2 border-b border-[#3a494b] text-[10px] uppercase tracking-[0.2em] text-[#b9cacb]">
        Roles del Sistema
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[#3a494b] text-[9px] uppercase tracking-[0.2em] text-[#3a494b]">
              <th className="text-left px-4 py-2 font-normal">Rol</th>
              <th className="text-left px-4 py-2 font-normal">Descripción</th>
              <th className="text-left px-4 py-2 font-normal">Permisos</th>
              <th className="text-left px-4 py-2 font-normal">Usuarios</th>
              <th className="text-left px-4 py-2 font-normal">Creado</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="border-b border-[#3a494b]/40 transition-all duration-200"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#E5E1E4] font-mono text-[12px]">{role.name}</span>
                    {role.system && (
                      <span className="text-[8px] uppercase tracking-[0.15em] text-[#3a494b] border border-[#3a494b] px-1.5 py-0.5">
                        SISTEMA
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#b9cacb] text-[10px]">{role.description}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.filter(p => p.granted).slice(0, 3).map(p => (
                      <span
                        key={p.id}
                        className="text-[8px] uppercase tracking-[0.1em] text-[#00E5FF] border border-[#00E5FF]/30 px-1.5 py-0.5"
                      >
                        {p.label}
                      </span>
                    ))}
                    {role.permissions.filter(p => p.granted).length > 3 && (
                      <span className="text-[8px] text-[#3a494b]">
                        +{role.permissions.filter(p => p.granted).length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#b9cacb] text-[11px] font-mono">{role.userCount}</td>
                <td className="px-4 py-3 text-[#b9cacb] text-[10px] font-mono">{formatTimestamp(role.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
