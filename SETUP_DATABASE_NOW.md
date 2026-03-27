# Setup de Base de Datos - Pasos Finales

Tu aplicación está funcionando con autenticación. Ahora necesitas crear las tablas en Supabase para que funcionen todas las características.

## Status Actual
- ✅ Login/Signup funcionando
- ✅ Autenticación Supabase configurada
- ❌ Tablas de BD no creadas
- ❌ Features (Transacciones, Reportes, etc.) desactivadas

## Pasos para Completar Setup

### 1. Abre Supabase Dashboard
Ve a: https://supabase.com/dashboard

### 2. Selecciona tu Proyecto
Busca y selecciona el proyecto conectado a esta app.

### 3. Abre SQL Editor
- Haz clic en "SQL Editor" en el menú izquierdo
- Haz clic en "New Query"

### 4. Copia el Código SQL
Abre el archivo `/scripts/setup-minimal.sql` en tu proyecto y copia TODO el contenido.

### 5. Pega y Ejecuta
- Pega el código en Supabase SQL Editor
- Presiona "Run" (botón azul)
- Espera a que se complete (verás mensajes de confirmación)

### 6. Verifica en Supabase
Deberías ver estas tablas en "Table Editor":
- `profiles`
- `workspaces`
- `workspace_members`
- `categories`
- `transactions`
- `reminders`

### 7. Vuelve a la App
- Recarga la página (F5 o Ctrl+R)
- Haz logout y vuelve a hacer login
- Ahora el dashboard mostrará todas las features activadas

## Contenido del Script SQL

El script `setup-minimal.sql` hace lo siguiente:

1. **Crea 6 tablas principales:**
   - `profiles` - Perfil de usuario
   - `workspaces` - Espacios de trabajo para equipos
   - `workspace_members` - Miembros del equipo
   - `categories` - Categorías de transacciones
   - `transactions` - Historial de ventas/compras/servicios
   - `reminders` - Recordatorios automáticos

2. **Habilita Row Level Security (RLS):**
   - Protege los datos para que cada usuario solo vea sus datos
   - Cada workspace es independiente

3. **Crea un Trigger Automático:**
   - Al registrarse, automáticamente crea un perfil
   - Al crear workspace, crea el workspace del usuario

4. **Crea Índices:**
   - Mejora la velocidad de búsquedas

## Solución de Problemas

### Error: "Permission denied"
**Causa:** Las variables de entorno no están configuradas correctamente.
**Solución:** Verifica en Supabase que tu `SUPABASE_SERVICE_ROLE_KEY` esté configurada en v0.

### Error: "Table already exists"
**Causa:** Ya ejecutaste el script una vez.
**Solución:** Continúa, no hay problema. El script verifica si existen antes de crear.

### Las tablas no aparecen
**Causa:** Podrías estar en el schema equivocado.
**Solución:** En Supabase, verifica que estés en el schema "public".

### El login aún falla después de crear tablas
**Causa:** La sesión de Supabase no se actualizó.
**Solución:** 
1. Abre DevTools (F12)
2. Ve a Application > Cookies
3. Elimina todos los cookies de localhost
4. Recarga la página
5. Intenta de nuevo

## ¿Necesitas Ayuda?

Si algo no funciona:
1. Abre la consola del navegador (F12)
2. Copia el error que ves
3. Verifica el script SQL esté completo
4. Intenta ejecutarlo de nuevo en Supabase

## Próximos Pasos Después del Setup

Una vez las tablas estén creadas:

1. **Crear Workspace**
   - El sistema creará automáticamente tu primer workspace
   - Puedes invitar miembros del equipo

2. **Agregar Transacciones**
   - Manualmente o importando CSV/Excel
   - Sistema de categorías y estados de pago

3. **Generar Reportes**
   - Estadísticas mensuales y anuales
   - Gráficos interactivos
   - Exportar a Excel/PDF

4. **Configurar Recordatorios**
   - Alertas automáticas para pagos vencidos
   - Notificaciones por email
   - Sistema de deadlines

## Script SQL Ubicación

Ruta: `/scripts/setup-minimal.sql`

O cópialo directamente desde aquí:

```sql
-- El contenido del setup-minimal.sql va aquí
```

¡Eso es todo! Después de estos pasos, tu aplicación estará completamente funcional.
