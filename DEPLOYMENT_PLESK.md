# 🚀 Guía de Deployment - AFIP App en Plesk

## 📋 Requisitos Previos

- Servidor Ubuntu con Plesk instalado
- Node.js 18+ instalado
- PM2 instalado globalmente
- Dominio `afip-app.nodonorte.com` configurado en Plesk

## 🔧 Configuración en Plesk

### 1. Crear Dominio en Plesk

1. Accede al panel de Plesk
2. Ve a **Domains** → **Add Domain**
3. Configura:
   - **Domain name**: `afip-app.nodonorte.com`
   - **Document root**: `/httpdocs`
   - **PHP support**: Deshabilitado (usamos Node.js)
   - **SSL**: Habilitado con Let's Encrypt

### 2. Configurar Node.js en Plesk

1. Ve a **Tools & Settings** → **Node.js**
2. Habilita Node.js para el dominio
3. Configura:
   - **Node.js version**: 18.x
   - **Application mode**: Production
   - **Application URL**: `https://afip-app.nodonorte.com`

### 3. Subir Código al Servidor

```bash
# Conectar al servidor via SSH
ssh usuario@tu-servidor.com

# Navegar al directorio del dominio
cd /var/www/vhosts/afip-app.nodonorte.com/httpdocs

# Clonar el repositorio
git clone https://github.com/nodonorteit/afip-app.git .

# Dar permisos de ejecución al script de deployment
chmod +x deploy.sh
```

### 4. Ejecutar Deployment

```bash
# Ejecutar el script de deployment
./deploy.sh
```

## 🔄 Proceso de Deployment

El script `deploy.sh` realizará automáticamente:

1. ✅ Verificar versión de Node.js
2. ✅ Instalar PM2 si no está disponible
3. ✅ Instalar dependencias (`npm ci --production`)
4. ✅ Construir la aplicación (`npm run build`)
5. ✅ Configurar PM2 con `ecosystem.config.js`
6. ✅ Iniciar la aplicación en modo cluster
7. ✅ Configurar auto-start en boot

## 🌐 Configuración de Nginx

### Opción 1: Usar configuración automática de Plesk

Plesk configurará automáticamente Nginx para el dominio.

### Opción 2: Configuración manual

Si necesitas configuración personalizada:

1. Ve a **Apache & nginx Settings**
2. Edita la configuración de Nginx
3. Usa el contenido del archivo `nginx.conf`

## 🔒 Configuración SSL

1. Ve a **SSL/TLS Certificates**
2. Selecciona **Let's Encrypt**
3. Configura:
   - **Domain**: `afip-app.nodonorte.com`
   - **Email**: tu-email@nodonorte.com
   - **Include www subdomain**: Opcional

## 📊 Monitoreo y Logs

### Comandos PM2 útiles:

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs afip-app

# Reiniciar aplicación
pm2 restart afip-app

# Detener aplicación
pm2 stop afip-app

# Ver uso de recursos
pm2 monit
```

### Logs disponibles:

- **PM2 logs**: `./logs/combined.log`
- **Error logs**: `./logs/err.log`
- **Output logs**: `./logs/out.log`
- **Nginx logs**: `/var/log/nginx/afip-app.nodonorte.com.error.log`

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# Conectar al servidor
ssh usuario@tu-servidor.com

# Navegar al directorio
cd /var/www/vhosts/afip-app.nodonorte.com/httpdocs

# Actualizar código
git pull origin main

# Reinstalar dependencias si es necesario
npm ci --production

# Reconstruir aplicación
npm run build

# Reiniciar aplicación
pm2 restart afip-app
```

## 🛠️ Troubleshooting

### Problema: La aplicación no inicia

```bash
# Verificar logs de PM2
pm2 logs afip-app

# Verificar que el puerto 3000 esté libre
netstat -tlnp | grep :3000

# Verificar permisos
ls -la /var/www/vhosts/afip-app.nodonorte.com/httpdocs
```

### Problema: Error de permisos

```bash
# Cambiar propietario de archivos
sudo chown -R psaserv:psaserv /var/www/vhosts/afip-app.nodonorte.com/httpdocs

# Dar permisos de ejecución
chmod +x deploy.sh
```

### Problema: SSL no funciona

1. Verificar certificado en Plesk
2. Verificar configuración de Nginx
3. Verificar DNS del dominio

## 📈 Optimización

### Configuración de caché:

```bash
# Limpiar caché de Next.js
rm -rf .next/cache

# Reconstruir con caché limpio
npm run build
```

### Monitoreo de recursos:

```bash
# Instalar herramientas de monitoreo
sudo apt-get install htop iotop

# Monitorear uso de CPU y memoria
htop
```

## 🔐 Seguridad

### Firewall:

```bash
# Configurar UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Actualizaciones:

```bash
# Actualizar sistema regularmente
sudo apt update && sudo apt upgrade -y
```

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs de PM2 y Nginx
2. Verificar configuración en Plesk
3. Consultar documentación de Next.js
4. Contactar soporte técnico

---

**¡Tu aplicación AFIP estará disponible en https://afip-app.nodonorte.com!** 🎉 