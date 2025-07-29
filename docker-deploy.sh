#!/bin/bash

# Script de deployment para AFIP App con Docker
# Uso: ./docker-deploy.sh [cliente] [puerto]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Variables de configuración
CLIENTE=${1:-"default"}
PUERTO=${2:-"3000"}
DOMAIN=${3:-"afip-app.nodonorte.com"}

# Validar parámetros
if [ -z "$CLIENTE" ]; then
    error "Debe especificar un nombre de cliente"
fi

if ! [[ "$PUERTO" =~ ^[0-9]+$ ]]; then
    error "El puerto debe ser un número"
fi

# Nombres de contenedores
CONTAINER_NAME="afip-app-${CLIENTE}"
NETWORK_NAME="afip-network-${CLIENTE}"
VOLUME_NAME="afip-data-${CLIENTE}"

log "🚀 Iniciando deployment de AFIP App para cliente: $CLIENTE"
log "📊 Configuración:"
echo "   - Cliente: $CLIENTE"
echo "   - Puerto: $PUERTO"
echo "   - Dominio: $DOMAIN"
echo "   - Contenedor: $CONTAINER_NAME"
echo ""

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    error "Docker no está instalado. Por favor instale Docker primero."
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose no está instalado. Por favor instale Docker Compose primero."
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Asegúrese de estar en el directorio raíz del proyecto."
fi

if [ ! -f "Dockerfile" ]; then
    error "No se encontró Dockerfile. Asegúrese de estar en el directorio raíz del proyecto."
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    log "📝 Creando archivo .env..."
    cat > .env << EOF
# Configuración de AFIP App
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Variables de entorno para iFactura (configurar según necesidad)
IFACTURA_EMAIL=
IFACTURA_PASSWORD=

# Configuración del cliente
CLIENTE_NAME=$CLIENTE
DOMAIN=$DOMAIN
EOF
    warning "Archivo .env creado. Configure las credenciales de iFactura si es necesario."
fi

# Crear docker-compose personalizado para el cliente
log "🔧 Creando docker-compose para cliente $CLIENTE..."
cat > docker-compose.${CLIENTE}.yml << EOF
version: '3.8'

services:
  afip-app-${CLIENTE}:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${CONTAINER_NAME}
    restart: unless-stopped
    ports:
      - "${PUERTO}:3000"
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
      - CLIENTE_NAME=${CLIENTE}
      - DOMAIN=${DOMAIN}
      - IFACTURA_EMAIL=\${IFACTURA_EMAIL}
      - IFACTURA_PASSWORD=\${IFACTURA_PASSWORD}
    volumes:
      - ${VOLUME_NAME}:/app/data
    networks:
      - ${NETWORK_NAME}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  ${VOLUME_NAME}:
    driver: local

networks:
  ${NETWORK_NAME}:
    driver: bridge
EOF

# Detener contenedor existente si existe
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    log "🛑 Deteniendo contenedor existente..."
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
fi

# Construir y ejecutar el contenedor
log "🔨 Construyendo imagen Docker..."
docker-compose -f docker-compose.${CLIENTE}.yml build

log "🚀 Iniciando contenedor..."
docker-compose -f docker-compose.${CLIENTE}.yml up -d

# Verificar que el contenedor esté corriendo
log "🔍 Verificando estado del contenedor..."
sleep 10

if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    log "✅ Contenedor iniciado exitosamente!"
    
    # Mostrar información del contenedor
    log "📊 Información del contenedor:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    log "🌐 La aplicación estará disponible en:"
    echo "   - Local: http://localhost:${PUERTO}"
    echo "   - Red: http://$(hostname -I | awk '{print $1}'):${PUERTO}"
    
    log "📝 Comandos útiles:"
    echo "   - Ver logs: docker logs -f ${CONTAINER_NAME}"
    echo "   - Reiniciar: docker restart ${CONTAINER_NAME}"
    echo "   - Detener: docker stop ${CONTAINER_NAME}"
    echo "   - Eliminar: docker rm ${CONTAINER_NAME}"
    echo "   - Acceder al contenedor: docker exec -it ${CONTAINER_NAME} sh"
    
else
    error "❌ Error: El contenedor no se inició correctamente"
fi

log "🎉 Deployment completado para cliente: $CLIENTE" 