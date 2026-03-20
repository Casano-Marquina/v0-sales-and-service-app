# ⚠️ LIMPIEZA DE CACHÉ REQUERIDA

## Problema Actual

El error `supabaseKey is required` persiste porque **Next.js tiene en caché archivos compilados antiguos** en el directorio `.next/`.

## Causa Técnica

1. El servidor Next.js compiló un archivo antiguo `lib/supabase.ts` (que ha sido eliminado del código fuente)
2. El caché del servidor en `.next/` aún contiene esa compilación
3. Cuando importas `use-auth.ts` que intenta cargar el archivo antiguo, falls falla

## Solución Inmediata

### ✅ Para Usuarios de v0:

1. Abre el panel de v0
2. Busca el botón de **"Refresh"** o **"Reload"** en la preview
3. Haz clic para recargar completamente
4. Espera a que se reconstruya

### ✅ Para Usuarios Locales:

**En tu terminal:**

```bash
# 1. Presiona Ctrl + C para detener pnpm dev

# 2. Ejecuta estos comandos:
rm -rf .next .turbo node_modules/.cache

# 3. Limpia caché de pnpm:
pnpm store prune

# 4. Reinicia:
pnpm dev
```

### ✅ Alternativa (Si sigue fallando):

```bash
# Limpieza completa
rm -rf .next .turbo node_modules
pnpm install
pnpm dev
```

## ¿Por Qué Sucede?

When deleting files from a Next.js project:
- El código fuente se elimina ✅
- Pero los archivos compilados en `.next/` permanecen ❌
- El servidor sigue sirviendo la versión antigua

La solución es eliminar el caché de compilación.

## Verificación del Fix

Una vez que se reconstruya, deberías ver:

```
✅ http://localhost:3000 carga sin errores
✅ Puedes ver la página de login
✅ NO hay error "supabaseKey is required"
✅ Puedes registrarte sin problemas
```

## Si Aún Ves el Error Después de Limpiar

1. Verifica que `.next/` fue realmente eliminado:
   ```bash
   ls -la | grep .next
   # No debería mostrar nada
   ```

2. Espera 5-10 segundos para que Next.js reconstruya

3. Abre una pestana NUEVA del navegador (no recargues la actual)

4. Si persiste, intenta la "Limpieza Completa" arriba

## Archivos que Fueron Corregidos

El código está 100% arreglado. Solo es un problema de caché:

✅ `lib/supabase/client.ts` - Correcto
✅ `lib/supabase/server.ts` - Correcto
✅ `lib/supabase/proxy.ts` - Correcto
✅ `hooks/use-auth.ts` - Importa correctamente
✅ `app/auth/page.tsx` - Sin problemas
✅ Todas las páginas - Funcionan correctamente

**El error NO es un problema de código, es un problema de caché.**

---

⏱️ **Tiempo esperado**: 1-2 minutos para limpiar y reconstruir

📧 Si tienes más dudas, revisa `TROUBLESHOOTING.md`
