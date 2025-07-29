# 🐳 AFIP App - Docker Deployment

Esta documentación explica cómo desplegar y gestionar la aplicación AFIP App usando Docker, especialmente diseñado para múltiples clientes en un servidor con Plesk.

## 📋 Requisitos Previos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Acceso SSH al servidor

## 🚀 Deployment Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/nodonorteit/afip-app.git
cd afip-app
```

### 2. Configurar Variables de Entorno

```bash
# Crear archivo .env
cp .env.example .env

# Editar variables de entorno
nano .env
```

Variables importantes:
```env
# Configuración de AFIP
IFACTURA_EMAIL=tu-email@ejemplo.com
IFACTURA_PASSWORD=tu-password

# Configuración del cliente
CLIENTE_NAME=nombre-cliente
DOMAIN=afip-app.tudominio.com
```

### 3. Desplegar para un Cliente

```bash
# Desplegar cliente "empresa1" en puerto 3001
./docker-deploy.sh empresa1 3001

# Desplegar cliente "empresa2" en puerto 3002
./docker-deploy.sh empresa2 3002
```

## 🛠️ Gestión de Clientes

### Comandos Principales

```bash
# Ver todos los clientes
./docker-manage.sh list

# Desplegar nuevo cliente
./docker-manage.sh deploy cliente1 3001

# Iniciar cliente
./docker-manage.sh start cliente1

# Detener cliente
./docker-manage.sh stop cliente1

# Reiniciar cliente
./docker-manage.sh restart cliente1

# Ver logs
./docker-manage.sh logs cliente1

# Ver estado
./docker-manage.sh status cliente1

# Hacer backup
./docker-manage.sh backup cliente1

# Restaurar backup
./docker-manage.sh restore cliente1 backup-cliente1-20240101-120000.tar

# Actualizar aplicación
./docker-manage.sh update cliente1

# Eliminar cliente
./docker-manage.sh remove cliente1
```

## 🏗️ Arquitectura Multi-Cliente

### Estrategia: Un Contenedor por Cliente

**Ventajas:**
- ✅ Aislamiento completo entre clientes
- ✅ Configuración independiente
- ✅ Escalabilidad horizontal
- ✅ Fácil backup/restore individual
- ✅ Actualizaciones independientes
- ✅ Recursos dedicados

**Consideraciones:**
- ⚠️ Mayor uso de recursos
- ⚠️ Más contenedores que gestionar
- ⚠️ Puertos únicos por cliente

### Estructura de Contenedores

```
afip-app-cliente1:3001  ← Puerto único por cliente
afip-app-cliente2:3002
afip-app-cliente3:3003
...
```

### Volúmenes de Datos

Cada cliente tiene su propio volumen:
```
afip-data-cliente1  ← Datos independientes
afip-data-cliente2
afip-data-cliente3
...
```

## 🔧 Configuración Avanzada

### Docker Compose Personalizado

Cada cliente genera su propio archivo:
```yaml
# docker-compose.cliente1.yml
version: '3.8'
services:
  afip-app-cliente1:
    build: .
    container_name: afip-app-cliente1
    ports:
      - "3001:3000"
    environment:
      - CLIENTE_NAME=cliente1
    volumes:
      - afip-data-cliente1:/app/data
```

### Variables de Entorno por Cliente

```bash
# Crear archivo .env.cliente1
CLIENTE_NAME=cliente1
DOMAIN=cliente1.tudominio.com
IFACTURA_EMAIL=cliente1@ejemplo.com
IFACTURA_PASSWORD=password-cliente1
```

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Logs de un cliente específico
./docker-manage.sh logs cliente1

# Logs con Docker directamente
docker logs -f afip-app-cliente1
```

### Monitoreo de Recursos

```bash
# Ver uso de recursos
docker stats afip-app-cliente1

# Ver todos los contenedores
docker stats $(docker ps --format "{{.Names}}")
```

## 🔒 Seguridad

### Usuario No-Root

La aplicación se ejecuta como usuario `nextjs` (UID 1001) para mayor seguridad.

### Headers de Seguridad

```typescript
// next.config.ts
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
]
```

### Volúmenes Aislados

Cada cliente tiene su propio volumen de datos, evitando acceso cruzado.

## 💾 Backup y Restore

### Backup Automático

```bash
# Crear backup
./docker-manage.sh backup cliente1

# Resultado: backup-cliente1-20240101-120000.tar
```

### Restore de Datos

```bash
# Restaurar backup
./docker-manage.sh restore cliente1 backup-cliente1-20240101-120000.tar
```

### Backup Programado

Agregar al crontab:
```bash
# Backup diario a las 2 AM
0 2 * * * /ruta/a/afip-app/docker-manage.sh backup cliente1
```

## 🔄 Actualizaciones

### Actualizar un Cliente

```bash
# Actualizar aplicación de un cliente
./docker-manage.sh update cliente1
```

### Actualizar Todos los Clientes

```bash
# Script para actualizar todos
for cliente in $(docker ps --format "{{.Names}}" | grep "afip-app-"); do
  nombre_cliente=$(echo $cliente | sed 's/afip-app-//')
  ./docker-manage.sh update $nombre_cliente
done
```

## 🌐 Integración con Plesk

### Configuración de Dominio

1. Crear dominio en Plesk
2. Configurar proxy reverso a `localhost:PUERTO`
3. Configurar SSL con Let's Encrypt

### Ejemplo de Configuración Nginx

```nginx
server {
    listen 80;
    server_name cliente1.tudominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🚨 Troubleshooting

### Problemas Comunes

**Contenedor no inicia:**
```bash
# Ver logs detallados
docker logs afip-app-cliente1

# Verificar puerto disponible
netstat -tuln | grep :3001
```

**Error de permisos:**
```bash
# Verificar permisos de volúmenes
docker volume inspect afip-data-cliente1
```

**Problemas de memoria:**
```bash
# Ver uso de recursos
docker stats afip-app-cliente1

# Ajustar límites en docker-compose
services:
  afip-app-cliente1:
    deploy:
      resources:
        limits:
          memory: 512M
```

### Logs de Debug

```bash
# Habilitar logs detallados
docker run -e NODE_ENV=development afip-app-cliente1

# Ver logs de build
docker-compose -f docker-compose.cliente1.yml build --no-cache
```

## 📈 Escalabilidad

### Horizontal Scaling

Para más clientes, simplemente ejecutar:
```bash
./docker-deploy.sh cliente4 3004
./docker-deploy.sh cliente5 3005
```

### Vertical Scaling

Ajustar recursos por cliente:
```yaml
services:
  afip-app-cliente1:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 🤝 Soporte

Para problemas o consultas:
- 📧 Email: soporte@nodonorte.com
- 📱 WhatsApp: +54 9 11 1234-5678
- 🐛 Issues: GitHub Issues

---

**Nota:** Esta configuración está optimizada para Plesk y múltiples clientes. Para desarrollo local, usar `docker-compose.yml` estándar. 