import { RoleGuard } from "@/components/auth/RoleGuard";
import { ConfigurationContainer } from "./ConfigurationContainer";

export default function ConfigurationPage() {
  return (
    <RoleGuard superAdminOnly>
      <ConfigurationContainer />
    </RoleGuard>
  );
}
