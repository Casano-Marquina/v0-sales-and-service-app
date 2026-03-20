# Guía Rápida de Troubleshooting

## Error: "supabaseKey is required"

### Síntomas
```
An application error has occurred while loading /auth
supabaseKey is required.
```

### Solución Rápida

1. **Limpiar caché**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   ```

2. **Reiniciar servidor**
   ```bash
   Ctrl+C (para detener)
   pnpm dev (para reiniciar)
   ```

3. **Hard refresh del navegador**
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

4. **Verificar `.env.local`**
   ```bash
   # Asegúrate que tiene estas variables:
   grep "NEXT_PUBLIC_SUPABASE_URL" .env.local
   grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local
   ```

---

## Error: "Cannot sign up because a user with this email already exists"

### Síntomas
No puedes crear una nueva cuenta con un email

### Solución

1. **Intenta login con ese email**
   - Quizás ya existe la cuenta
   - Usa "Olvidé mi contraseña" si es necesario

2. **Usa un email diferente**
   - Para pruebas, usa direcciones como:
     - `test+1@example.com`
     - `test+2@example.com`
     - (Gmail acepta variaciones con `+`)

3. **Limpiar base de datos** (desarrollo)
   ```sql
   -- En Supabase SQL Editor
   DELETE FROM auth.users WHERE email = 'test@example.com';
   ```

---

## Error: "Email not confirmed"

### Síntomas
No puedes ingresar aunque la contraseña es correcta

### Solución

1. **Confirmar email**
   - Revisa tu bandeja de entrada
   - Revisa spam
   - El link expira en 24 horas

2. **Reenviar email de confirmación**
   - En Supabase > Authentication > Users
   - Busca el usuario
   - Haz clic en los 3 puntos > Copy magic link
   - Pega en navegador

3. **Deshabilitar confirmación de email** (solo desarrollo)
   - Supabase > Authentication > Email
   - Desactiva "Confirm email"
   - ⚠️ NO HACER EN PRODUCCIÓN

---

## Error: "Unauthorized" o "Access denied"

### Síntomas
Ves mensajes de error de autorización en transacciones

### Solución

1. **Verificar sesión activa**
   ```javascript
   // En consola del navegador (F12)
   // Ir a Application > Cookies > supabase-auth-token
   // Debe existir y no estar expirado
   ```

2. **Crear workspace**
   - Ve a Settings
   - Crea un nuevo workspace
   - O verifica que perteneces a uno

3. **Reloguear**
   - Cierra sesión
   - Limpia cookies: `Ctrl+Shift+Delete`
   - Ingresa nuevamente

---

## Error: "Cannot read properties of undefined (reading 'id')"

### Síntomas
Error en consola, el dashboard no carga

### Solución

1. **Esperar a que cargue el usuario**
   - El componente intenta acceder a `user.id` antes de cargar
   - Ya está arreglado, pero si persiste:

2. **Verificar estructura del componente**
   ```typescript
   // CORRECTO ✓
   useEffect(() => {
     if (!user) return // Esperar a que user cargue
     // Ahora usar user.id
   }, [user])
   
   // INCORRECTO ❌
   const id = user.id // Puede ser undefined
   ```

---

## Error: "Transacción no se guarda"

### Síntomas
Haces clic en Guardar pero la transacción no aparece

### Solución

1. **Ver error en consola**
   - Abre F12 > Console
   - Busca mensajes en rojo
   - Copia el error completo

2. **Verificar que el workspace está seleccionado**
   - En el sidebar, verifica que hay un workspace seleccionado
   - Si no, créalo en Settings

3. **Revisar Supabase Logs**
   - Supabase Dashboard > Logs
   - Busca la transacción que intentaste crear
   - Ve el mensaje de error exacto

4. **Verificar RLS**
   - En Supabase > SQL Editor:
   ```sql
   -- Ver políticas RLS
   SELECT * FROM pg_policies WHERE tablename = 'transactions';
   ```

---

## Error: "No funciona la importación de CSV/Excel"

### Síntomas
El archivo no se carga o muestra error

### Solución

1. **Verificar formato del archivo**
   - Asegúrate que es CSV o XLSX válido
   - Abre con Excel o Google Sheets
   - Verifica que tiene encabezados

2. **Nombres de columnas**
   - El sistema detecta automáticamente:
     - fecha, date, transaction_date
     - descripción, description, concepto
     - monto, amount, valor
     - cliente, provider, client_provider_name
     - etc.
   
   - Si tus columnas se llaman diferente, mápealas manualmente

3. **Ver error exacto**
   - Abre consola (F12)
   - Intenta importar nuevamente
   - Copia el error completo

---

## La página está en blanco o dice "Cargando..."

### Síntomas
Solo ves "Cargando..." y nunca carga

### Solución

1. **Verificar que el servidor corre**
   ```bash
   # En la terminal, debe decir:
   # ▲ Next.js 16.x.x
   # Local: http://localhost:3000
   ```

2. **Hard refresh**
   - `Ctrl+Shift+R` (Windows/Linux)
   - `Cmd+Shift+R` (Mac)

3. **Limpiar datos del navegador**
   - F12 > Application > Cookies
   - Elimina todas las cookies de localhost
   - Recarga

4. **Verificar Network tab**
   - F12 > Network
   - Intenta navegar
   - Si ves errores en rojo, anota el status code

---

## Error de CORS o "Access-Control-Allow-Origin"

### Síntomas
Error en consola del navegador sobre CORS

### Solución

1. **Generalmente, esto NO es un problema real en desarrollo**
   - Next.js maneja CORS correctamente
   - Ignora estos warnings si funciona

2. **Si realmente es un problema**
   - Supabase > API > CORS
   - Añade `http://localhost:3000`
   - Para producción, añade tu dominio

---

## Los recordatorios no funcionan

### Síntomas
Los recordatorios no se crean automáticamente

### Solución

1. **Recordatorios manuales**
   - Deberían funcionar desde la interfaz
   - Ve a Transacciones > Haz clic en los 3 puntos > Crear Recordatorio

2. **Recordatorios automáticos**
   - Requieren un cron job externo
   - Supabase Functions, Vercel Crons, etc.
   - Llama a: `POST /api/reminders/check`
   - Con header: `Authorization: Bearer $CRON_SECRET`

3. **Verificar logs**
   - Supabase > Logs > Functions
   - Busca errores en los trabajos cron

---

## Olvidé mi contraseña

### Solución

1. **En la página de login**
   - Haz clic en "Olvidé mi contraseña"
   - (Si no aparece, ir a `/auth/sign-up`)

2. **Restablecer desde Supabase** (desarrollo)
   - Supabase > Authentication > Users
   - Busca el usuario
   - Haz clic en Reset Password

---

## Quiero eliminar mis datos de prueba

### Solución

```sql
-- Ejecuta en Supabase > SQL Editor

-- Eliminar transacciones de un workspace
DELETE FROM transactions WHERE workspace_id = 'workspace_id_aqui';

-- Eliminar workspace
DELETE FROM workspaces WHERE id = 'workspace_id_aqui';

-- Eliminar usuario (CUIDADO: elimina toda su data)
DELETE FROM auth.users WHERE email = 'email@example.com';
```

---

## Necesito reiniciar todo

### Solución (Nuclear Option)

```bash
# 1. Limpiar proyecto local
rm -rf .next
rm -rf node_modules
rm -rf .env.local (si quieres nuevas variables)

# 2. Reinstalar
pnpm install

# 3. Reiniciar servidor
pnpm dev

# 4. Limpiar datos Supabase
# → Ve a Supabase Dashboard
# → Elimina tablas (o todo)
# → Ejecuta migraciones nuevamente
```

---

## Aún así no funciona

### Recopila información

1. **Versiones**
   ```bash
   node --version
   pnpm --version
   npm list next
   ```

2. **Consola del navegador** (F12 > Console)
   - Copia los errores en ROJO

3. **Logs del servidor**
   - En la terminal donde corre `pnpm dev`
   - Copia los mensajes de error

4. **Supabase Logs**
   - Dashboard > Logs
   - Copia eventos relevantes

5. **`.env.local`** (sin valores sensibles)
   ```bash
   # NO copies los valores, solo confirma que existen
   echo "NEXT_PUBLIC_SUPABASE_URL: $(if [ -z $NEXT_PUBLIC_SUPABASE_URL ]; then echo 'NO'; else echo 'YES'; fi)"
   ```

### Contacta al soporte

Incluyendo toda la información anterior en un issue de GitHub o en el formulario de soporte.

---

**Última actualización**: Marzo 2026
**Para más ayuda**: Ver README.md, VERIFICATION_CHECKLIST.md y CHANGES_SUMMARY.md
