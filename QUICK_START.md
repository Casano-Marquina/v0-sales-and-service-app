# Inicio Rápido

## En 5 Minutos

### 1️⃣ Instalar Dependencias
```bash
pnpm install
```

### 2️⃣ Verificar Variables de Entorno
```bash
# Confirma que .env.local tiene estas variables:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 3️⃣ Ejecutar Migraciones (primera vez)

En **Supabase Dashboard > SQL Editor**, ejecuta en este orden:

1. Copia contenido de `/scripts/01-create-schema.sql` → Pega y ejecuta
2. Copia contenido de `/scripts/03-enable-rls.sql` → Pega y ejecuta
3. Copia contenido de `/scripts/04-policies-users.sql` → Pega y ejecuta
4. Copia contenido de `/scripts/05-policies-workspaces.sql` → Pega y ejecuta
5. Copia contenido de `/scripts/06-policies-transactions.sql` → Pega y ejecuta

⏱️ **Toma ~2 minutos**

### 4️⃣ Iniciar Servidor
```bash
pnpm dev
```

Abre: **http://localhost:3000**

### 5️⃣ Crear Primera Cuenta
```
1. Haz clic en "Registrarse"
2. Ingresa email y contraseña
3. Confirma el email (revisa bandeja)
4. ¡Bienvenido! 🎉
```

---

## Dashboard Principal

Una vez autenticado, verás:

```
┌─────────────────────────────────────────┐
│  Sidebar                                 │
├─────────────────────────────────────────┤
│ 📊 Dashboard                            │
│ 💳 Transacciones                        │
│ 📥 Importar                             │
│ 📈 Reportes                             │
│ 🔔 Recordatorios                        │
│ ⚙️  Configuración                        │
└─────────────────────────────────────────┘
```

---

## Funciones Principales

### 📊 Dashboard
- Vista general de estadísticas
- Últimas transacciones
- Resumen de pagos pendientes

### 💳 Transacciones
- ➕ Crear transacción nueva
- ✏️ Editar transacción
- 🗑️ Eliminar transacción
- 🔍 Filtrar y buscar
- 📌 Asignar categorías

### 📥 Importar
- Cargar archivos CSV
- Cargar archivos Excel
- Detección automática de columnas
- Previsualización antes de importar
- Mapeo flexible de campos

### 📈 Reportes
- 📊 Estadísticas mensuales
- 📈 Estadísticas anuales
- 📥 Descargar CSV
- 📥 Descargar JSON
- 📊 Gráficos interactivos

### 🔔 Recordatorios
- ⏰ Crear recordatorios manuales
- 🔄 Recordatorios automáticos por vencimiento
- 🔔 Ver listado de recordatorios
- ✅ Marcar como visto

### ⚙️ Configuración
- 👤 Perfil de usuario
- 🏢 Gestión de workspace
- 👥 Añadir miembros
- 🔑 Cambiar contraseña

---

## Ejemplos de Uso

### Crear una Venta
```
1. Ve a Transacciones
2. Haz clic en "Nueva Transacción"
3. Completa:
   - Tipo: VENTA
   - Descripción: "Venta producto X"
   - Monto: 500
   - Cliente: "Acme Inc."
   - Fecha: Hoy
   - Estado: Pendiente
4. Haz clic en "Guardar"
```

### Importar Datos desde Excel
```
1. Ve a Importar
2. Haz clic en "Seleccionar archivo"
3. Elige tu archivo Excel
4. Mapea columnas (se auto-detecta)
5. Haz clic en "Vista previa"
6. Verifica datos
7. Haz clic en "Importar"
```

### Ver Reporte Mensual
```
1. Ve a Reportes
2. Selecciona mes y año
3. Haz clic en "Generar Reporte"
4. Ve estadísticas y gráficos
5. Descarga CSV o JSON
```

---

## Atajos Útiles

| Acción | Atajo |
|--------|-------|
| Abrir Transacciones | Cmd/Ctrl + T |
| Crear Nueva | Cmd/Ctrl + N |
| Buscar | Cmd/Ctrl + K |
| Cerrar Sesión | Configuración → Cerrar Sesión |

---

## Preguntas Frecuentes

### ❓ ¿Cómo cambio mi contraseña?
En **Configuración > Perfil**, aparecerá la opción.

### ❓ ¿Puedo invitar a otros usuarios?
Sí, en **Configuración > Workspace > Añadir Miembro**

### ❓ ¿Qué pasa con mis datos?
Se guardan en PostgreSQL (Supabase) - completamente seguro.

### ❓ ¿Puedo exportar mis datos?
Sí, desde Reportes puedes descargar CSV/JSON.

### ❓ ¿Cómo configuro recordatorios automáticos?
Ver SETUP.md - Sección "Configurar Sistema de Recordatorios"

---

## Documentación Completa

Para más detalles, revisa:

| Archivo | Descripción |
|---------|-------------|
| **README.md** | Documentación completa |
| **VERIFICATION_CHECKLIST.md** | Verificar que todo está correcto |
| **TROUBLESHOOTING.md** | Resolver problemas comunes |
| **CHANGES_SUMMARY.md** | Cambios técnicos realizados |

---

## Siguiente Paso

¡Ahora prueba tu app! 🚀

```bash
pnpm dev
```

Si algo no funciona, ve a **TROUBLESHOOTING.md** para encontrar la solución rápidamente.

---

**¿Necesitas ayuda?** Ver TROUBLESHOOTING.md
