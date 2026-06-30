import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminContainer } from "./AdminContainer";

export default function SuperAdminPage() {
  return (
    <RoleGuard superAdminOnly>
      <AdminContainer />
    </RoleGuard>
  );
}
