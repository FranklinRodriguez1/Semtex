import { RoleGuard } from "@/components/auth/RoleGuard";
import { TransferContainer } from "./TransferContainer";

export default function TransferPage() {
  return (
    <RoleGuard roles={["ADMIN", "OPERATOR"]}>
      <TransferContainer />
    </RoleGuard>
  );
}
