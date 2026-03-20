# Limpieza de Caché - Instrucciones Urgentes

Si ves el error `supabaseKey is required`, sigue estos pasos:

## Paso 1: Detener el servidor de desarrollo

Presiona **Ctrl + C** en la terminal donde está ejecutándose `pnpm dev`

## Paso 2: Limpiar el caché

Ejecuta estos comandos en orden:

```bash
# Eliminar caché de Next.js
rm -rf .next

# Eliminar caché de Turbopack
rm -rf .turbo

# Limpiar caché de pnpm (opcional pero recomendado)
pnpm store prune
```

## Paso 3: Reinstalar dependencias (si sigue fallando)

```bash
rm -rf node_modules
pnpm install
```

## Paso 4: Iniciar nuevamente

```bash
pnpm dev
```

---

## ¿Por qué sucede esto?

Next.js y su bundler Turbopack cachean archivos compilados en el directorio `.next/`. Cuando eliminamos archivos o cambiamos imports, el caché antiguo puede servir código desactualizado.

## Verificación Final

Una vez reiniciado, deberías ver:

```
> dev
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

Sin mensajes de error sobre `supabaseKey`.

---

## Alternativa Rápida (v0 Preview)

Si estás usando v0, presiona el botón **Refresh** o **Reload** en la interfaz para forzar una reconstrucción completa.

