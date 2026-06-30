import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeamContainer } from "./TeamContainer";

export default function TeamPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <TeamContainer />
    </RoleGuard>
  );
}
