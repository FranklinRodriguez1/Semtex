import { getInternal, postInternal } from "@/lib/session";

export interface Company {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  userCount: number;
}

export interface CompanyUser {
  id: string;
  email: string;
  role: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export async function listCompanies(): Promise<Company[]> {
  return getInternal<Company[]>("/api/admin/companies");
}

export async function listCompanyUsers(orgId: string): Promise<CompanyUser[]> {
  return getInternal<CompanyUser[]>(
    `/api/admin/companies/${orgId}/users`,
  );
}

export interface CreateCompanyInput {
  companyName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface CreateCompanyResponse {
  email: string;
  companyName: string;
}

export async function createCompany(
  input: CreateCompanyInput,
): Promise<CreateCompanyResponse> {
  const payload = {
    companyName: input.companyName.trim(),
    adminEmail: input.adminEmail.trim(),
    adminPassword: input.adminPassword,
  };

  return postInternal<CreateCompanyResponse>("/api/admin/companies", payload);
}
