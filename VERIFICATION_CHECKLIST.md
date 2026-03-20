# Lista de Verificación - Configuración de la App

Usa esta lista para asegurarte de que todo está configurado correctamente.

## Variables de Entorno ✓

- [ ] `NEXT_PUBLIC_SUPABASE_URL` está configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` está configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurada
- [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` está configurada
- [ ] `CRON_SECRET` está configurada (opcional pero recomendado)

**Cómo verificar:**
```bash
# Ver variables en .env.local
cat .env.local
```

## Base de Datos ✓

- [ ] Tabla `workspaces` existe
- [ ] Tabla `users` existe
- [ ] Tabla `transactions` existe
- [ ] Tabla `categories` existe
- [ ] Tabla `reminders` existe
- [ ] RLS está habilitado en todas las tablas

**Cómo verificar:**
1. Ve a Supabase Dashboard > SQL Editor
2. Copia y ejecuta:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

3. Verifica que aparezcan todas estas tablas:
   - workspaces
   - workspace_members
   - users (nota: parte de auth.users)
   - transactions
   - categories
   - reminders

## Dependencias ✓

- [ ] `pnpm install` fue ejecutado
- [ ] `node_modules/` existe
- [ ] `@supabase/supabase-js` está instalado
- [ ] `@supabase/ssr` está instalado
- [ ] `papaparse` está instalado
- [ ] `xlsx` está instalado

**Cómo verificar:**
```bash
# Verificar que todas las dependencias están instaladas
pnpm list | grep -E "supabase|papaparse|xlsx"
```

## Cliente Supabase ✓

Verifica que los archivos están correctamente configurados:

- [ ] `/lib/supabase/client.ts` existe y exporta `createClient`
- [ ] `/lib/supabase/server.ts` existe y exporta `createClient`
- [ ] `/lib/supabase/proxy.ts` existe y exporta `updateSession`
- [ ] `/middleware.ts` existe y usa `updateSession`
- [ ] `/lib/types.ts` existe con todos los tipos

**Cómo verificar:**
```bash
# Ver que los archivos existen
ls -la lib/supabase/
ls -la middleware.ts
```

## Rutas y Páginas ✓

- [ ] `/app/page.tsx` existe (redirecciona a login/dashboard)
- [ ] `/app/auth/login/page.tsx` existe
- [ ] `/app/auth/sign-up/page.tsx` existe
- [ ] `/app/auth/callback/route.ts` existe
- [ ] `/app/auth/error/page.tsx` existe
- [ ] `/app/dashboard/page.tsx` existe
- [ ] `/app/dashboard/layout.tsx` existe
- [ ] `/app/dashboard/transactions/page.tsx` existe
- [ ] `/app/dashboard/import/page.tsx` existe
- [ ] `/app/dashboard/reports/page.tsx` existe
- [ ] `/app/dashboard/reminders/page.tsx` existe

## Ejecución ✓

### Antes de iniciar

```bash
# Limpiar caché
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar dependencias
pnpm install

# Verificar que el servidor inicia sin errores
pnpm dev
```

### Durante el inicio

- [ ] No hay errores de "supabaseKey is required"
- [ ] No hay errores de imports
- [ ] El servidor inicia en `http://localhost:3000`

### Prueba de Login

1. Abre `http://localhost:3000` en el navegador
2. Deberías ser redirigido a `/auth/login`
3. Haz clic en "Registrarse" o ve a `/auth/sign-up`
4. Crea una cuenta con email de prueba
5. Confirma el email
6. Ingresa con tus credenciales
7. Deberías ver el Dashboard

### Prueba de Transacciones

1. En el Dashboard, haz clic en "Transacciones"
2. Haz clic en "Nueva Transacción"
3. Completa el formulario:
   - Tipo: Venta
   - Descripción: "Transacción de prueba"
   - Monto: 100
   - Cliente/Proveedor: "Cliente Test"
   - Fecha: Hoy
4. Haz clic en "Guardar"
5. La transacción debe aparecer en la lista

## Errores Comunes

### Error: "Unauthorized" en Dashboard
**Causa**: No hay workspace
**Solución**: 
1. Crea un workspace en Settings
2. O verifica que perteneces a un workspace

### Error: "Cannot read properties of undefined"
**Causa**: Variables de entorno no configuradas
**Solución**:
1. Verifica `.env.local`
2. Reinicia el servidor: `Ctrl+C` y `pnpm dev`
3. Hard refresh del navegador: `Ctrl+Shift+R`

### Transacciones no se guardan
**Causa**: Problemas con RLS o permisos
**Solución**:
1. Verifica que las políticas RLS están correctas
2. Abre la consola del navegador (F12) y revisa los errores
3. Consulta Supabase Dashboard > Logs

### Email de confirmación no llega
**Causa**: Configuración de email en Supabase
**Solución**:
1. Ve a Supabase > Authentication > Email Templates
2. Verifica que está configurado correctly
3. Revisa spam
4. Intenta usar una dirección de email diferente

## Solicitar Soporte

Si aún tienes problemas:

1. **Recopila información:**
   - Versión de Node.js: `node --version`
   - Versión de pnpm: `pnpm --version`
   - Tu navegador y versión
   - El mensaje de error exacto

2. **Verifica los logs:**
   - Consola del navegador (F12 > Console)
   - Terminal del servidor
   - Logs de Supabase (Dashboard > Logs)

3. **Prueba en modo incógnito:**
   - Abre el navegador en modo incógnito
   - A veces los cookies causan problemas

## Checklist de Deployment (Vercel)

Si planeas desplegar a Vercel:

- [ ] Variables de entorno están configuradas en Vercel > Settings > Environment Variables
- [ ] `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` apunta al dominio correcto (sin localhost)
- [ ] Todas las migraciones de BD están aplicadas
- [ ] Probaste localmente antes de hacer push

---

**Última actualización**: 2024
**Versión de la app**: 1.0.0
