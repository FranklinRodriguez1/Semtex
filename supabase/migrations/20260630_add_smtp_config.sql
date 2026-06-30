-- Añade las columnas de configuración SMTP a la tabla de organizaciones.
-- Ejecutar en: Supabase Dashboard → SQL Editor
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS smtp_email    TEXT,
  ADD COLUMN IF NOT EXISTS smtp_password TEXT;
