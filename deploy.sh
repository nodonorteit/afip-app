#!/bin/bash

# Script de deployment para AFIP App en servidor Ubuntu con Plesk
# Dominio: afip-app.nodonorte.com

set -e

echo "🚀 Iniciando deployment de AFIP App..."

# Variables de configuración
DOMAIN="afip-app.nodonorte.com"
APP_NAME="afip-app"
NODE_VERSION="18"
PM2_APP_NAME="afip-app"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
fi

# Instalar/actualizar Node.js si es necesario
log "Verificando versión de Node.js..."
if ! command -v node &> /dev/null; then
    log "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_CURRENT_VERSION=$(node --version)
log "Node.js versión: $NODE_CURRENT_VERSION"

# Instalar PM2 si no está instalado
if ! command -v pm2 &> /dev/null; then
    log "Instalando PM2..."
    sudo npm install -g pm2
fi

# Instalar dependencias
log "Instalando dependencias..."
npm ci --production

# Construir la aplicación
log "Construyendo la aplicación..."
npm run build

# Crear archivo de configuración para PM2
log "Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${PM2_APP_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Crear directorio de logs si no existe
mkdir -p logs

# Detener aplicación si está corriendo
if pm2 list | grep -q "${PM2_APP_NAME}"; then
    log "Deteniendo aplicación existente..."
    pm2 stop ${PM2_APP_NAME}
    pm2 delete ${PM2_APP_NAME}
fi

# Iniciar aplicación con PM2
log "Iniciando aplicación con PM2..."
pm2 start ecosystem.config.js

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar automáticamente en el boot
pm2 startup

log "✅ Deployment completado exitosamente!"
log "📊 Estado de la aplicación:"
pm2 status

log "🌐 La aplicación estará disponible en: https://${DOMAIN}"
log "📝 Logs disponibles en: ./logs/"
log "🔧 Comandos útiles:"
echo "  - Ver logs: pm2 logs ${PM2_APP_NAME}"
echo "  - Reiniciar: pm2 restart ${PM2_APP_NAME}"
echo "  - Detener: pm2 stop ${PM2_APP_NAME}"
echo "  - Status: pm2 status" 