import { postInternal } from "@/lib/session";

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
