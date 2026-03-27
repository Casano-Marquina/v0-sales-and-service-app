# Configuración Manual de Supabase

## El problema

Las tablas de Supabase no están creadas. Por eso obtienes "Failed to fetch" en el login y "Tenant or user not found" en el dashboard.

## Solución: Ejecutar el script SQL en Supabase

### Paso 1: Ir a Supabase Dashboard

1. Abre [https://supabase.com](https://supabase.com)
2. Ingresa a tu cuenta
3. Selecciona tu proyecto
4. En el menú izquierdo, haz clic en **"SQL Editor"**

### Paso 2: Crear nueva query

1. Haz clic en **"New Query"** (botón azul arriba a la derecha)
2. Verás un editor SQL vacío

### Paso 3: Copiar el código

Copia TODO el código de abajo y pégalo en el editor SQL de Supabase:

```sql
-- Crear tabla de perfiles (extensión de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  PRIMARY KEY (id)
);

-- Crear tabla de workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Crear tabla de miembros del workspace
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'editor', 'viewer'))
);

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  client_provider TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  payment_status TEXT DEFAULT 'pending',
  transaction_date DATE NOT NULL,
  due_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT valid_type CHECK (type IN ('venta', 'compra', 'servicio')),
  CONSTRAINT valid_status CHECK (payment_status IN ('pending', 'paid', 'overdue', 'partial'))
);

-- Crear tabla de recordatorios
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  reminder_type TEXT DEFAULT 'upcoming',
  message TEXT,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Crear política para profiles: usuarios solo ven su propio perfil
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Crear política para workspaces: usuarios ven workspaces donde son miembros
CREATE POLICY "Users can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Crear trigger para auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_workspace_id ON public.transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_workspace_id ON public.reminders(workspace_id);
```

### Paso 4: Ejecutar el script

1. Haz clic en el botón **"Run"** (flecha azul) en la esquina superior derecha
2. Espera a que termine la ejecución (debe decir "success")
3. Verifica que NO haya errores

### Paso 5: Verificar que funcionó

1. En el menú izquierdo, haz clic en **"Table Editor"**
2. Deberías ver estas tablas:
   - `profiles`
   - `workspaces`
   - `workspace_members`
   - `categories`
   - `transactions`
   - `reminders`

Si ves estas 6 tablas, ¡todo está correcto!

### Paso 6: Vuelve a la app y recarga

1. Regresa a tu aplicación
2. Haz **Ctrl+Shift+R** (o Cmd+Shift+R en Mac) para limpiar caché
3. Intenta hacer login de nuevo

Ahora debería funcionar sin errores.

## Si algo falla

Si ves un error al ejecutar el script:

1. **"Syntax error"** - Asegúrate de copiar TODO el código exactamente
2. **"Table already exists"** - Significa que el script ya se ejecutó. Es normal.
3. **"Permission denied"** - Asegúrate de estar usando el rol correcto (debe ser owner del proyecto)

## Próximos pasos después del setup

Una vez que el login funcione:

1. Crea una cuenta nueva en `/auth/sign-up`
2. Confirma tu email
3. Ingresa en el dashboard
4. Ahora puedes:
   - Crear transacciones
   - Importar CSV/Excel
   - Ver reportes
   - Configurar recordatorios
