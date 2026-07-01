import { RoleGuard } from '@/components/auth/RoleGuard';
import { AuditContainer } from './AuditContainer';

/**
 * Oculta a propósito: `roles={[]}` nunca coincide con ningún rol, así que
 * RoleGuard siempre deniega. El link ya se quitó del Sidebar; esto bloquea
 * también el acceso por URL directa mientras no se integre con el backend.
 */
export default function AuditPage() {
  return (
    <RoleGuard roles={[]}>
      <AuditContainer />
    </RoleGuard>
  );
}
