# Gestor Integral de Ventas, Compras y Servicios

Una aplicación web moderna para gestionar transacciones comerciales con autenticación multiusuario, reportes mensuales, importación de datos y sistema de recordatorios automáticos.

## Características

- 🔐 **Autenticación Segura**: Supabase Auth con email/contraseña
- 👥 **Multiusuario**: Workspaces con sistema de roles (Owner, Admin, Editor, Viewer)
- 💾 **Base de Datos Robusta**: PostgreSQL en Supabase con Row Level Security
- 📊 **Gestión de Transacciones**: CRUD completo (Ventas, Compras, Servicios)
- 📈 **Reportes Inteligentes**: Estadísticas mensuales/anuales con gráficos
- 📥 **Importación**: Carga masiva desde CSV y Excel con detección automática de columnas
- 📤 **Exportación**: Descarga de reportes en CSV, Excel y JSON
- 🔔 **Recordatorios**: Sistema dual (app + email) para pagos próximos y vencidos
- ☁️ **Integración Google Drive**: Almacenamiento automático de reportes en Drive

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4, Shadcn/UI
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Importación**: PapaParse (CSV), XLSX (Excel)
- **Gráficos**: Recharts

## Instalación Rápida

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar variables de entorno

Asegúrate de que tu archivo `.env.local` (creado automáticamente por v0) contiene:

```env
NEXT_PUBLIC_SUPABASE_URL=<tu_url_supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<tu_service_role_key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
CRON_SECRET=<tu_secret_para_cron_jobs>
```

### 3. Ejecutar migraciones de base de datos

En Supabase Dashboard > SQL Editor, ejecuta los scripts en este orden:

1. **01-create-schema.sql** - Crea todas las tablas
2. **03-enable-rls.sql** - Habilita Row Level Security
3. **04-policies-users.sql** - Políticas de usuarios
4. **05-policies-workspaces.sql** - Políticas de workspaces
5. **06-policies-transactions.sql** - Políticas de transacciones

### 4. Iniciar desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Primer Inicio de Sesión

1. Ve a `/auth/sign-up` para crear una cuenta
2. Confirma tu email (revisa spam si es necesario)
3. Ingresa con tus credenciales
4. Se creará automáticamente tu primer Workspace

## Estructura del Proyecto

```
app/
├── auth/                 # Autenticación (login, signup, callback)
├── dashboard/           # Dashboard principal
│   ├── transactions/    # Gestión de transacciones
│   ├── import/         # Importación CSV/Excel
│   ├── reports/        # Reportes y estadísticas
│   ├── reminders/      # Sistema de recordatorios
│   └── settings/       # Configuración
├── api/                # Endpoints API
│   └── reminders/      # APIs para recordatorios
└── page.tsx            # Página principal

lib/
├── supabase/
│   ├── client.ts       # Cliente para navegador
│   ├── server.ts       # Cliente para servidor
│   └── proxy.ts        # Middleware de sesión
├── types.ts            # Tipos de datos
└── import-utils.ts     # Utilidades de importación

hooks/
├── use-auth.ts         # Autenticación
├── use-workspace.ts    # Gestión de workspaces
├── use-transactions.ts # Gestión de transacciones
├── use-reports.ts      # Reportes
└── use-reminders.ts    # Recordatorios
```

## Flujo de Uso

### 1. Autenticación
- Registro: `/auth/sign-up`
- Login: `/auth/login`
- Confirmación de email requerida

### 2. Dashboard
- Vista de estadísticas de transacciones
- Acceso rápido a todas las funciones
- Selector de Workspace

### 3. Transacciones
- Crear/editar/eliminar transacciones
- Tipos: Venta, Compra, Servicio
- Estados: Pendiente, Pagado, Vencido, Parcial
- Filtros y búsqueda

### 4. Importar Datos
- CSV o Excel
- Detección automática de columnas
- Mapeo flexible
- Previsualización antes de importar

### 5. Reportes
- Estadísticas por mes/año
- Gráficos interactivos
- Descarga CSV/JSON

### 6. Recordatorios
- Sistema automático para pagos
- Recordatorios manuales
- Notificaciones en app

## Resolución de Problemas

### Error: "supabaseKey is required"
**Solución**: 
- Verifica que `.env.local` tiene las variables correctas
- Reinicia: `Ctrl+C` y `pnpm dev`
- Recarga el navegador (hard refresh: Ctrl+Shift+R)

### Login no funciona
- Verifica que confirmaste el email en Supabase
- Comprueba que las credenciales son correctas
- Revisa la consola del navegador (F12) para errores

### No puedo ver transacciones
- Crea primero un workspace en Dashboard
- Verifica que está seleccionado el workspace correcto
- Comprueba que tienes permisos de acceso

### Importación falla
- Asegúrate que el archivo es CSV o Excel válido
- Verifica que tienes las columnas requeridas
- Comprueba los tipos de datos

## Próximas Mejoras

- Soporte para múltiples monedas
- Categorías personalizables
- Auditoría y historial
- Notificaciones en tiempo real
- Integración con pasarelas de pago
- API pública para integraciones

## Built with v0

Este proyecto fue creado con [v0](https://v0.app) - la plataforma de AI para frontend.

[Continuar trabajando en v0 →](https://v0.app/chat/projects/prj_g7FRXBcacpsG8oScxIbUr4hknAtq)
