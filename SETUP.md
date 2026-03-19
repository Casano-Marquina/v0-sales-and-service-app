# Gestor de Transacciones - Guía de Configuración

## Descripción General

Esta es una aplicación integral para gestionar ventas, compras y servicios con las siguientes características:

- **Gestión de Transacciones**: Crear, leer, actualizar y eliminar ventas, compras y servicios
- **Importación de Datos**: Cargar transacciones desde archivos CSV o Excel
- **Reportes Mensuales/Anuales**: Visualizar datos con gráficos y descargar reportes en CSV/JSON
- **Recordatorios Automáticos**: Sistema de alertas para pagos próximos y vencidos
- **Sistema Multiusuario**: Roles y permisos (Owner, Admin, Editor, Viewer)
- **Autenticación**: Sistema de autenticación con Supabase
- **Base de Datos en la Nube**: PostgreSQL en Supabase con Row Level Security

## Requisitos Previos

1. **Node.js** 18+ y **pnpm** (o npm)
2. **Supabase Project** - Crea uno en https://supabase.com
3. **Cuenta de Google Drive** (opcional, para futuras integraciones)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repo>
cd tu-proyecto
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego actualiza los valores con tus credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
POSTGRES_URL=postgresql://user:password@host/database
POSTGRES_PRISMA_URL=postgresql://user:password@host/database?schema=public
POSTGRES_URL_NON_POOLING=postgresql://user:password@host/database
CRON_SECRET=your-secret-for-cron-jobs
```

### 4. Configurar la Base de Datos

#### Opción A: Ejecutar Scripts SQL (Recomendado)

Los scripts SQL están en `/scripts`:

1. **01-create-schema.sql** - Crea las tablas
2. **03-enable-rls.sql** - Habilita Row Level Security
3. **04-policies-users.sql** - Políticas de usuarios
4. **05-policies-workspaces.sql** - Políticas de workspaces
5. **06-policies-transactions.sql** - Políticas de transacciones

Ejecuta cada uno en el editor SQL de Supabase (Dashboard > SQL).

#### Opción B: Usar Prisma (Alternativa)

```bash
pnpm exec prisma migrate dev
```

### 5. Ejecutar la Aplicación

```bash
pnpm dev
```

Abre http://localhost:3000 en tu navegador.

## Uso

### Autenticación

1. Ve a `/auth`
2. Registrate con tu email y contraseña
3. Inicia sesión

### Crear un Workspace

1. Ve a **Configuración**
2. Ingresa el nombre del nuevo workspace
3. Haz clic en "Crear Workspace"

### Agregar Transacciones

#### Opción 1: Crear Manualmente
1. Ve a **Transacciones**
2. Haz clic en "Nueva Transacción"
3. Completa el formulario

#### Opción 2: Importar desde CSV/Excel
1. Ve a **Importar**
2. Carga tu archivo (CSV o Excel)
3. Verifica el mapeo de columnas
4. Valida los datos
5. Haz clic en "Importar"

### Ver Reportes

1. Ve a **Reportes**
2. Selecciona el mes y año
3. Visualiza gráficos y estadísticas
4. Descarga en CSV o JSON

### Configurar Recordatorios

Los recordatorios se crean automáticamente para transacciones con fechas de vencimiento:

1. Configura un cron job para llamar a `/api/reminders/check`
2. Los recordatorios se crean automáticamente para fechas próximas
3. Ve a **Recordatorios** para ver los pendientes

## Estructura de Carpetas

```
/app
  /api              # Endpoints API (reminders, imports, etc)
  /auth             # Página de autenticación
  /dashboard        # Páginas protegidas
    /transactions   # Gestión de transacciones
    /import         # Importación de datos
    /reports        # Reportes y análisis
    /reminders      # Recordatorios
    /settings       # Configuración

/components
  /ui               # Componentes shadcn/ui
  transaction-form  # Formulario de transacciones

/hooks
  use-auth          # Hook de autenticación
  use-workspace     # Hook de workspace
  use-transactions  # Hook de transacciones
  use-reports       # Hook de reportes
  use-reminders     # Hook de recordatorios

/lib
  supabase          # Cliente y tipos de Supabase
  import-utils      # Utilidades de importación

/scripts
  *.sql             # Scripts de BD
```

## Modelos de Datos

### Transacciones
- `id`: UUID
- `workspace_id`: Referencia a workspace
- `type`: 'venta' | 'compra' | 'servicio'
- `category_id`: Opcional, referencia a categoría
- `description`: Descripción de la transacción
- `amount`: Monto decimal
- `client_provider_name`: Cliente o proveedor
- `payment_status`: 'pendiente' | 'pagado' | 'vencido' | 'parcial'
- `transaction_date`: Fecha de la transacción
- `due_date`: Fecha de vencimiento (opcional)
- `paid_date`: Fecha en que se pagó (opcional)

### Recordatorios
- `id`: UUID
- `transaction_id`: Referencia a transacción
- `reminder_date`: Fecha del recordatorio
- `reminder_type`: Tipo de recordatorio
- `notified`: ¿Notificado en la app?
- `email_sent`: ¿Email enviado?

### Usuarios y Workspaces
- Soporte multiusuario con roles
- Owner, Admin, Editor, Viewer
- RLS policies para control de acceso

## API Endpoints

### Reminders
- **POST** `/api/reminders/create` - Crear recordatorio manual
- **POST** `/api/reminders/check` - Verificar y crear recordatorios automáticos (requiere CRON_SECRET)

## Características Futuras

- [ ] Integración con Google Drive
- [ ] Envío automático de emails con recordatorios
- [ ] Integraciones con pasarelas de pago
- [ ] App móvil
- [ ] Sincronización offline
- [ ] Exportación a Excel con estilos
- [ ] Historial de cambios y auditoría
- [ ] Permisos granulares

## Configurar Cron Jobs

Para que los recordatorios se creen automáticamente:

### Vercel Cron
Agrega a `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reminders/check",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Alternativas
- Google Cloud Scheduler
- AWS EventBridge
- Heroku Scheduler
- Zapier
- IFTTT

## Solución de Problemas

### "Table doesn't exist"
- Verifica que los scripts SQL se ejecutaron en Supabase
- Revisa que las variables de entorno sean correctas

### "Unauthorized" al importar
- Verifica que estés logueado
- Asegúrate de que el workspace esté seleccionado

### Los recordatorios no se crean
- Verifica que el CRON_SECRET sea correcto
- Revisa que las transacciones tengan `due_date`
- Comprueba los logs en Vercel

## Soporte

Para reportar bugs o sugerir mejoras, crea un issue en el repositorio.

## Licencia

MIT
