// Servicio para el ABM de clientes
import { 
  ClienteDB, 
  ClienteFormData, 
  ClienteFilters, 
  ClienteListResponse 
} from '@/types/clientes';
import { afipService } from './afipService';

export class ClientesService {
  private baseUrl: string;
  private storageKey = 'afip-app-clientes';

  constructor(baseUrl: string = '/api/clientes') {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtener clientes del localStorage (simulación de base de datos)
   */
  private getClientesFromStorage(): ClienteDB[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al obtener clientes del storage:', error);
      return [];
    }
  }

  /**
   * Guardar clientes en localStorage
   */
  private saveClientesToStorage(clientes: ClienteDB[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(clientes));
    } catch (error) {
      console.error('Error al guardar clientes en storage:', error);
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Obtener lista de clientes con filtros y paginación
   */
  async getClientes(
    filters: ClienteFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ClienteListResponse> {
    try {
      let clientes = this.getClientesFromStorage();

      // Aplicar filtros
      if (filters.search) {
        const search = filters.search.toLowerCase();
        clientes = clientes.filter(cliente => 
          cliente.nombre.toLowerCase().includes(search) ||
          cliente.apellido?.toLowerCase().includes(search) ||
          cliente.razonSocial?.toLowerCase().includes(search) ||
          cliente.documento.includes(search) ||
          cliente.email?.toLowerCase().includes(search)
        );
      }

      if (filters.tipoPersona !== undefined) {
        clientes = clientes.filter(cliente => cliente.tipoPersona === filters.tipoPersona);
      }

      if (filters.condicionImpositiva !== undefined) {
        clientes = clientes.filter(cliente => cliente.condicionImpositiva === filters.condicionImpositiva);
      }

      if (filters.activo !== undefined) {
        clientes = clientes.filter(cliente => cliente.activo === filters.activo);
      }

      // Ordenar por fecha de creación (más recientes primero)
      clientes.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

      // Aplicar paginación
      const total = clientes.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const clientesPaginated = clientes.slice(startIndex, endIndex);

      return {
        clientes: clientesPaginated,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return {
        clientes: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
  }

  /**
   * Obtener cliente por ID
   */
  async getClienteById(id: string): Promise<ClienteDB | null> {
    try {
      const clientes = this.getClientesFromStorage();
      return clientes.find(cliente => cliente.id === id) || null;
    } catch (error) {
      console.error('Error al obtener cliente por ID:', error);
      return null;
    }
  }

  /**
   * Obtener cliente por documento
   */
  async getClienteByDocumento(documento: string): Promise<ClienteDB | null> {
    try {
      const clientes = this.getClientesFromStorage();
      const documentoLimpio = afipService.limpiarCUIT(documento);
      return clientes.find(cliente => 
        afipService.limpiarCUIT(cliente.documento) === documentoLimpio
      ) || null;
    } catch (error) {
      console.error('Error al obtener cliente por documento:', error);
      return null;
    }
  }

  /**
   * Crear nuevo cliente
   */
  async createCliente(data: ClienteFormData): Promise<ClienteDB> {
    try {
      const clientes = this.getClientesFromStorage();
      
      // Verificar si ya existe un cliente con ese documento
      const documentoLimpio = afipService.limpiarCUIT(data.documento);
      const clienteExistente = clientes.find(cliente => 
        afipService.limpiarCUIT(cliente.documento) === documentoLimpio
      );

      if (clienteExistente) {
        throw new Error('Ya existe un cliente con ese documento');
      }

      const nuevoCliente: ClienteDB = {
        id: this.generateId(),
        ...data,
        documento: documentoLimpio, // Guardar sin guiones
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
        activo: true
      };

      clientes.push(nuevoCliente);
      this.saveClientesToStorage(clientes);

      return nuevoCliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  }

  /**
   * Actualizar cliente existente
   */
  async updateCliente(id: string, data: Partial<ClienteFormData>): Promise<ClienteDB> {
    try {
      const clientes = this.getClientesFromStorage();
      const index = clientes.findIndex(cliente => cliente.id === id);

      if (index === -1) {
        throw new Error('Cliente no encontrado');
      }

      // Verificar si el documento ya existe en otro cliente
      if (data.documento) {
        const documentoLimpio = afipService.limpiarCUIT(data.documento);
        const clienteExistente = clientes.find(cliente => 
          cliente.id !== id && 
          afipService.limpiarCUIT(cliente.documento) === documentoLimpio
        );

        if (clienteExistente) {
          throw new Error('Ya existe otro cliente con ese documento');
        }
      }

      const clienteActualizado: ClienteDB = {
        ...clientes[index],
        ...data,
        documento: data.documento ? afipService.limpiarCUIT(data.documento) : clientes[index].documento,
        fechaModificacion: new Date().toISOString()
      };

      clientes[index] = clienteActualizado;
      this.saveClientesToStorage(clientes);

      return clienteActualizado;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  }

  /**
   * Eliminar cliente (marcar como inactivo)
   */
  async deleteCliente(id: string): Promise<void> {
    try {
      const clientes = this.getClientesFromStorage();
      const index = clientes.findIndex(cliente => cliente.id === id);

      if (index === -1) {
        throw new Error('Cliente no encontrado');
      }

      // Marcar como inactivo en lugar de eliminar
      clientes[index].activo = false;
      clientes[index].fechaModificacion = new Date().toISOString();

      this.saveClientesToStorage(clientes);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  }

  /**
   * Reactivar cliente
   */
  async reactivateCliente(id: string): Promise<ClienteDB> {
    try {
      const clientes = this.getClientesFromStorage();
      const index = clientes.findIndex(cliente => cliente.id === id);

      if (index === -1) {
        throw new Error('Cliente no encontrado');
      }

      clientes[index].activo = true;
      clientes[index].fechaModificacion = new Date().toISOString();

      this.saveClientesToStorage(clientes);
      return clientes[index];
    } catch (error) {
      console.error('Error al reactivar cliente:', error);
      throw error;
    }
  }

  /**
   * Importar cliente desde datos de AFIP
   */
  async importFromAFIP(documento: string): Promise<ClienteDB | null> {
    try {
      const datosAFIP = await afipService.consultarDatosSimulados(documento);
      
      if (!datosAFIP) {
        return null;
      }

      // Verificar si ya existe
      const clienteExistente = await this.getClienteByDocumento(documento);
      if (clienteExistente) {
        return clienteExistente;
      }

      // Crear nuevo cliente con datos de AFIP
      const clienteData: ClienteFormData = {
        documento: datosAFIP.cuit,
        tipoDocumento: afipService.determinarTipoDocumento(datosAFIP.cuit),
        nombre: datosAFIP.nombre || '',
        apellido: datosAFIP.apellido || '',
        razonSocial: datosAFIP.razonSocial || '',
        tipoPersona: afipService.determinarTipoPersona(datosAFIP.tipoPersona),
        condicionImpositiva: afipService.determinarCondicionImpositiva(datosAFIP.condicionImpositiva),
        email: datosAFIP.email || '',
        telefono: datosAFIP.telefono || '',
        domicilio: datosAFIP.domicilio || '',
        localidad: datosAFIP.localidad || '',
        codigoPostal: datosAFIP.codigoPostal || ''
      };

      return await this.createCliente(clienteData);
    } catch (error) {
      console.error('Error al importar cliente desde AFIP:', error);
      return null;
    }
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getEstadisticas(): Promise<{
    total: number;
    activos: number;
    inactivos: number;
    porTipoPersona: { fisica: number; juridica: number };
    porCondicion: { [key: string]: number };
  }> {
    try {
      const clientes = this.getClientesFromStorage();
      
      const total = clientes.length;
      const activos = clientes.filter(c => c.activo).length;
      const inactivos = total - activos;
      
      const porTipoPersona = {
        fisica: clientes.filter(c => c.tipoPersona === 1).length,
        juridica: clientes.filter(c => c.tipoPersona === 2).length
      };

      const porCondicion: { [key: string]: number } = {};
      clientes.forEach(cliente => {
        const condicion = this.getCondicionImpositivaLabel(cliente.condicionImpositiva);
        porCondicion[condicion] = (porCondicion[condicion] || 0) + 1;
      });

      return {
        total,
        activos,
        inactivos,
        porTipoPersona,
        porCondicion
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        total: 0,
        activos: 0,
        inactivos: 0,
        porTipoPersona: { fisica: 0, juridica: 0 },
        porCondicion: {}
      };
    }
  }

  /**
   * Obtener etiqueta de condición impositiva
   */
  private getCondicionImpositivaLabel(condicion: number): string {
    switch (condicion) {
      case 1: return 'Responsable Inscripto';
      case 2: return 'Exento';
      case 3: return 'Monotributo';
      case 4: return 'Consumidor Final';
      default: return 'Desconocido';
    }
  }
}

// Instancia global del servicio
export const clientesService = new ClientesService(); 