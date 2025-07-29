// Tipos para el ABM de clientes

export interface ClienteDB {
  id: string;
  documento: string;
  tipoDocumento: number;
  nombre: string;
  apellido?: string;
  razonSocial?: string;
  tipoPersona: number;
  condicionImpositiva: number;
  email?: string;
  telefono?: string;
  domicilio?: string;
  localidad?: string;
  provincia?: number;
  codigoPostal?: string;
  pais?: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaModificacion: string;
  activo: boolean;
}

export interface ClienteFormData {
  documento: string;
  tipoDocumento: number;
  nombre: string;
  apellido?: string;
  razonSocial?: string;
  tipoPersona: number;
  condicionImpositiva: number;
  email?: string;
  telefono?: string;
  domicilio?: string;
  localidad?: string;
  provincia?: number;
  codigoPostal?: string;
  pais?: string;
  observaciones?: string;
}

export interface ClienteFilters {
  search?: string;
  tipoPersona?: number;
  condicionImpositiva?: number;
  activo?: boolean;
}

export interface ClienteListResponse {
  clientes: ClienteDB[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 