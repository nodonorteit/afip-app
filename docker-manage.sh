#!/bin/bash

# Script para gestionar múltiples clientes de AFIP App con Docker
# Uso: ./docker-manage.sh [comando] [cliente] [puerto]

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

# Función para mostrar ayuda
show_help() {
    echo "AFIP App - Gestor de Clientes Docker"
    echo ""
    echo "Uso: $0 [comando] [cliente] [puerto]"
    echo ""
    echo "Comandos:"
    echo "  deploy [cliente] [puerto]    - Desplegar aplicación para un cliente"
    echo "  start [cliente]              - Iniciar contenedor de un cliente"
    echo "  stop [cliente]               - Detener contenedor de un cliente"
    echo "  restart [cliente]            - Reiniciar contenedor de un cliente"
    echo "  remove [cliente]             - Eliminar contenedor de un cliente"
    echo "  logs [cliente]               - Ver logs de un cliente"
    echo "  status [cliente]             - Ver estado de un cliente"
    echo "  list                         - Listar todos los clientes"
    echo "  backup [cliente]             - Hacer backup de datos de un cliente"
    echo "  restore [cliente] [archivo]  - Restaurar datos de un cliente"
    echo "  update [cliente]             - Actualizar aplicación de un cliente"
    echo "  help                         - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 deploy cliente1 3001"
    echo "  $0 start cliente1"
    echo "  $0 logs cliente1"
    echo "  $0 list"
}

# Función para listar clientes
list_clients() {
    log "📋 Listando clientes activos..."
    
    # Buscar contenedores de AFIP App
    CONTAINERS=$(docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "afip-app-" || true)
    
    if [ -z "$CONTAINERS" ]; then
        warning "No se encontraron contenedores de AFIP App"
        return
    fi
    
    echo ""
    echo "Contenedores de AFIP App:"
    echo "$CONTAINERS"
    echo ""
    
    # Mostrar estadísticas
    TOTAL=$(echo "$CONTAINERS" | wc -l)
    RUNNING=$(echo "$CONTAINERS" | grep "Up" | wc -l)
    STOPPED=$(echo "$CONTAINERS" | grep "Exited" | wc -l)
    
    log "📊 Estadísticas:"
    echo "   - Total de clientes: $TOTAL"
    echo "   - Activos: $RUNNING"
    echo "   - Detenidos: $STOPPED"
}

# Función para verificar si un cliente existe
client_exists() {
    local cliente=$1
    docker ps -a --format "{{.Names}}" | grep -q "^afip-app-${cliente}$"
}

# Función para obtener puerto de un cliente
get_client_port() {
    local cliente=$1
    docker port "afip-app-${cliente}" 2>/dev/null | grep "3000/tcp" | cut -d: -f2 || echo "N/A"
}

# Función para deploy
deploy_client() {
    local cliente=$1
    local puerto=$2
    
    if [ -z "$cliente" ] || [ -z "$puerto" ]; then
        error "Uso: $0 deploy [cliente] [puerto]"
    fi
    
    log "🚀 Desplegando cliente: $cliente en puerto: $puerto"
    
    # Verificar si el puerto está disponible
    if netstat -tuln | grep -q ":$puerto "; then
        error "El puerto $puerto ya está en uso"
    fi
    
    # Ejecutar script de deployment
    ./docker-deploy.sh "$cliente" "$puerto"
}

# Función para start
start_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 start [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "▶️  Iniciando cliente: $cliente"
    docker start "afip-app-${cliente}"
    
    local puerto=$(get_client_port "$cliente")
    log "✅ Cliente iniciado en puerto: $puerto"
}

# Función para stop
stop_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 stop [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "⏹️  Deteniendo cliente: $cliente"
    docker stop "afip-app-${cliente}"
    log "✅ Cliente detenido"
}

# Función para restart
restart_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 restart [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "🔄 Reiniciando cliente: $cliente"
    docker restart "afip-app-${cliente}"
    
    local puerto=$(get_client_port "$cliente")
    log "✅ Cliente reiniciado en puerto: $puerto"
}

# Función para remove
remove_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 remove [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    warning "⚠️  Esto eliminará el contenedor y todos los datos del cliente '$cliente'"
    read -p "¿Está seguro? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "🗑️  Eliminando cliente: $cliente"
        docker stop "afip-app-${cliente}" 2>/dev/null || true
        docker rm "afip-app-${cliente}"
        docker volume rm "afip-data-${cliente}" 2>/dev/null || true
        log "✅ Cliente eliminado"
    else
        log "❌ Operación cancelada"
    fi
}

# Función para logs
show_logs() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 logs [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "📋 Mostrando logs del cliente: $cliente"
    docker logs -f "afip-app-${cliente}"
}

# Función para status
show_status() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 status [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "📊 Estado del cliente: $cliente"
    docker ps -a --filter "name=afip-app-${cliente}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Size}}"
    
    local puerto=$(get_client_port "$cliente")
    if [ "$puerto" != "N/A" ]; then
        echo ""
        log "🌐 URL de acceso:"
        echo "   - Local: http://localhost:$puerto"
        echo "   - Red: http://$(hostname -I | awk '{print $1}'):$puerto"
    fi
}

# Función para backup
backup_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 backup [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    local backup_file="backup-${cliente}-$(date +%Y%m%d-%H%M%S).tar"
    
    log "💾 Creando backup del cliente: $cliente"
    docker run --rm -v "afip-data-${cliente}:/data" -v "$(pwd):/backup" alpine tar czf "/backup/${backup_file}" -C /data .
    
    log "✅ Backup creado: $backup_file"
}

# Función para restore
restore_client() {
    local cliente=$1
    local backup_file=$2
    
    if [ -z "$cliente" ] || [ -z "$backup_file" ]; then
        error "Uso: $0 restore [cliente] [archivo]"
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "El archivo de backup '$backup_file' no existe"
    fi
    
    warning "⚠️  Esto sobrescribirá los datos actuales del cliente '$cliente'"
    read -p "¿Está seguro? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "🔄 Restaurando backup del cliente: $cliente"
        docker run --rm -v "afip-data-${cliente}:/data" -v "$(pwd):/backup" alpine sh -c "rm -rf /data/* && tar xzf /backup/${backup_file} -C /data"
        log "✅ Backup restaurado"
    else
        log "❌ Operación cancelada"
    fi
}

# Función para update
update_client() {
    local cliente=$1
    
    if [ -z "$cliente" ]; then
        error "Uso: $0 update [cliente]"
    fi
    
    if ! client_exists "$cliente"; then
        error "El cliente '$cliente' no existe"
    fi
    
    log "🔄 Actualizando cliente: $cliente"
    
    # Obtener puerto actual
    local puerto=$(get_client_port "$cliente")
    if [ "$puerto" = "N/A" ]; then
        error "No se pudo obtener el puerto del cliente"
    fi
    
    # Hacer backup antes de actualizar
    backup_client "$cliente"
    
    # Reconstruir y reiniciar
    docker-compose -f "docker-compose.${cliente}.yml" build
    docker-compose -f "docker-compose.${cliente}.yml" up -d
    
    log "✅ Cliente actualizado"
}

# Procesar comandos
case "${1:-help}" in
    deploy)
        deploy_client "$2" "$3"
        ;;
    start)
        start_client "$2"
        ;;
    stop)
        stop_client "$2"
        ;;
    restart)
        restart_client "$2"
        ;;
    remove)
        remove_client "$2"
        ;;
    logs)
        show_logs "$2"
        ;;
    status)
        show_status "$2"
        ;;
    list)
        list_clients
        ;;
    backup)
        backup_client "$2"
        ;;
    restore)
        restore_client "$2" "$3"
        ;;
    update)
        update_client "$2"
        ;;
    help|*)
        show_help
        ;;
esac 