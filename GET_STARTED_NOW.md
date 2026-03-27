# ¡Comienza Ahora! - 3 Pasos Simples

## El Problema Actual

El login muestra "Failed to fetch" porque **las tablas de Supabase aún no existen**.

## Solución Rápida (5 minutos)

### 1️⃣ Abre Supabase Dashboard
- Ve a [https://supabase.com](https://supabase.com)
- Ingresa tu proyecto
- Haz clic en **"SQL Editor"** (menú izquierdo)

### 2️⃣ Copia el script SQL
Lee el archivo `MANUAL_SETUP.md` en el proyecto. Copia TODO el código SQL que está entre los markers `\`\`\`sql` y `\`\`\``.

### 3️⃣ Ejecuta en Supabase
- Pega el código en el editor SQL
- Haz clic en **"Run"**
- Espera que termine (debe decir "success")

### 4️⃣ Verifica y vuelve a la app
- En "Table Editor" (menú izquierdo), verifica que veas estas tablas:
  - ✅ profiles
  - ✅ workspaces
  - ✅ workspace_members
  - ✅ categories
  - ✅ transactions
  - ✅ reminders

- Regresa a la app
- Presiona **Ctrl+Shift+R** para limpiar caché
- Intenta hacer login nuevamente

## ¿Qué pasará después?

Una vez ejecutado el script:

1. ✅ El error "Failed to fetch" desaparecerá
2. ✅ Podrás crear una cuenta en `/auth/sign-up`
3. ✅ Tendrás acceso completo al dashboard
4. ✅ Podrás crear transacciones, importar datos, ver reportes

## ¿Necesitas ayuda?

Lee `MANUAL_SETUP.md` para instrucciones detalladas paso a paso.
