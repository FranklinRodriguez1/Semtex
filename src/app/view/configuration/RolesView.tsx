'use client';

interface RoleDefinition {
  name: string;
  label: string;
  color: string;
  description: string;
  permissions: string[];
}

const ROLES: RoleDefinition[] = [
  {
    name: 'ADMIN',
    label: 'Administrador',
    color: '#F97316',
    description: 'Acceso completo a la organización. Gestiona usuarios, documentos, chat y auditoría.',
    permissions: [
      'Subir y consultar documentos',
      'Ver registros financieros',
      'Chat con el agente IA',
      'Configurar su propio correo de envío y enviar correos',
      'Crear y administrar usuarios de su organización',
    ],
  },
  {
    name: 'OPERATOR',
    label: 'Operador',
    color: '#00E5FF',
    description: 'Puede operar el flujo de documentos y usar el agente IA.',
    permissions: [
      'Subir y consultar documentos',
      'Ver registros financieros',
      'Chat con el agente IA',
      'Configurar su propio correo de envío y enviar correos',
    ],
  },
];

export function RolesView() {
  return (
    <>
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="h-0.5 w-full bg-[#F97316]/20 animate-scan shadow-[0_0_10px_#F97316]" />
      </div>

      <div className="flex justify-between items-end border-b border-[#3a494b] pb-4 mb-6">
        <div>
          <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#F97316]">
            Roles del sistema
          </h1>
          <p className="text-[10px] text-[#3a494b] mt-1 tracking-[0.15em]">
            RBAC — ACCESS_CONTROL
          </p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#b9cacb] font-mono">
          <p>3 ROLES · BACKEND ENFORCED</p>
        </div>
      </div>

      <div className="space-y-4">
        {ROLES.map((role) => (
          <div
            key={role.name}
            className="rounded-2xl border border-[#3a494b] bg-[#0e0e10]/40 px-5 py-4"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold font-mono"
                    style={{ color: role.color, backgroundColor: `${role.color}18`, border: `1px solid ${role.color}30` }}
                  >
                    {role.name}
                  </span>
                  <span className="text-[12px] font-semibold text-[#E5E1E4]">{role.label}</span>
                </div>
                <p className="mt-1 text-[11px] text-[#b9cacb]">{role.description}</p>
              </div>
            </div>

            <ul className="space-y-1">
              {role.permissions.map((perm) => (
                <li key={perm} className="flex items-center gap-2 text-[10px] text-[#b9cacb]">
                  <span style={{ color: role.color }}>✓</span>
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[#3a494b] bg-[#0e0e10]/20 px-5 py-3">
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#3a494b]">
          Los roles los asigna el backend. El superadmin crea empresas y admins;
          los admins invitan a su equipo desde la sección Usuarios.
        </p>
      </div>
    </>
  );
}
