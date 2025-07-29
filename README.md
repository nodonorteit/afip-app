# AFIP App - Gestión Tributaria

Una aplicación moderna para gestionar trámites y obligaciones fiscales de AFIP (Administración Federal de Ingresos Públicos de Argentina).

## 🚀 Características

- **Dashboard Principal**: Resumen completo de la situación fiscal
- **Gestión de Monotributo**: Categorización, pagos y obligaciones
- **Gestión de IVA**: Declaraciones, pagos y transacciones
- **Ganancias**: Declaraciones y cálculos
- **Facturación Electrónica**: Emisión y gestión de facturas
- **Pagos**: Gestión centralizada de pagos
- **Vencimientos**: Calendario de fechas importantes
- **Empresas**: Gestión de múltiples empresas

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **App Router** - Nuevo sistema de rutas de Next.js

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd afip-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal (Dashboard)
│   ├── monotributo/       # Página de Monotributo
│   ├── iva/              # Página de IVA
│   └── layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── Header.tsx        # Header con navegación
│   ├── Sidebar.tsx       # Barra lateral
│   ├── Dashboard.tsx     # Dashboard principal
│   ├── MonotributoContent.tsx
│   └── IVAContent.tsx
└── globals.css           # Estilos globales
```

## 🎨 Componentes Principales

### Dashboard
- Resumen de estadísticas fiscales
- Actividad reciente
- Próximos vencimientos
- Tarjetas informativas

### Monotributo
- Información de categorización
- Gestión de pagos
- Historial de obligaciones
- Progreso hacia límites

### IVA
- Declaraciones mensuales
- Transacciones recientes
- Cálculo de IVA a pagar
- Gestión de comprobantes

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código

## 🚧 Próximas Funcionalidades

- [ ] Autenticación con AFIP
- [ ] Integración con APIs reales
- [ ] Generación de reportes
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Exportación de datos
- [ ] Múltiples idiomas

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Objetivos

- Simplificar la gestión fiscal
- Reducir errores en declaraciones
- Centralizar información tributaria
- Mejorar la experiencia del usuario
- Automatizar procesos repetitivos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Desarrollado con ❤️ para la comunidad fiscal argentina**
