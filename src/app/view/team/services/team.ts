import { getInternal, postInternal } from "@/lib/session";

export interface BackendUser {
  id: string;
  email: string;
  role: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export async function listUsers(): Promise<BackendUser[]> {
  return getInternal<BackendUser[]>("/api/users");
}

export async function inviteUser(email: string, password: string, role: string): Promise<void> {
  await postInternal("/api/team/invite", { email, password, role });
}
