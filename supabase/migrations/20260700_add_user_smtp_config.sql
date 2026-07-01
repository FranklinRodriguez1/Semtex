-- Permite que cada usuario (ADMIN u OPERATOR) registre su propio correo de envío,
-- distinto del correo con el que inicia sesión. Opcional: NULL si no lo configuró.
-- Reemplaza el uso de organizations.smtp_email/smtp_password (quedan sin usar).
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS smtp_email    TEXT,
  ADD COLUMN IF NOT EXISTS smtp_password TEXT;
