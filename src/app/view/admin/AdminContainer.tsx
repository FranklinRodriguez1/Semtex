"use client";

import { useCallback, useEffect, useState } from "react";
import { listCompanies, type Company } from "./services/admin";
import { CompanyList } from "./components/CompanyList";
import { CompanyUsers } from "./components/CompanyUsers";
import { CreateCompanyForm } from "./components/CreateCompanyForm";

export function AdminContainer() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadCompanies = useCallback(async () => {
    try {
      const data = await listCompanies();
      setCompanies(data);
      setListError(null);
    } catch (err) {
      setListError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      const data = await listCompanies().catch((err) => {
        if (active) setListError((err as Error).message);
        return null;
      });
      if (active && data) setCompanies(data);
    }
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-full bg-[#000000] p-8 text-[#E5E1E4]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-end justify-between border-b border-[#3a494b] pb-4">
          <div>
            <h1 className="text-[14px] uppercase tracking-[0.2em] text-[#06B6D4]">
              Super-Admin · Empresas
            </h1>
            <p className="mt-1 text-[10px] tracking-[0.15em] text-[#3a494b]">
              PLATFORM_PROVISIONING
            </p>
          </div>
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-xl border border-[#06B6D4]/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#06B6D4] transition hover:bg-[#06B6D4]/10"
          >
            {showCreate ? "Cerrar" : "+ Nueva empresa"}
          </button>
        </div>

        {showCreate && (
          <CreateCompanyForm onCreated={() => { void loadCompanies(); }} />
        )}

        {selected ? (
          <CompanyUsers
            key={selected.id}
            company={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <CompanyList
            companies={companies}
            error={listError}
            onSelect={setSelected}
          />
        )}
      </div>
    </div>
  );
}
