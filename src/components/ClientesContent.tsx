'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  UserPlus,
  Building,
  User
} from 'lucide-react';
import { ClienteDB, ClienteFilters } from '@/types/clientes';
import { clientesService } from '@/services/clientesService';
import { afipService } from '@/services/afipService';
import { CONDICIONES_IMPOSITIVAS, TIPOS_PERSONA } from '@/types/facturacion';

export function ClientesContent() {
  const [clientes, setClientes] = useState<ClienteDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ClienteFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    porTipoPersona: { fisica: 0, juridica: 0 },
    porCondicion: {} as { [key: string]: number }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteDB | null>(null);

  useEffect(() => {
    loadClientes();
    loadEstadisticas();
  }, [filters, currentPage]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const response = await clientesService.getClientes(filters, currentPage, 10);
      setClientes(response.clientes);
      setTotalPages(response.totalPages);
      setTotalClientes(response.total);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const stats = await clientesService.getEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ClienteFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeleteCliente = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesService.deleteCliente(id);
        loadClientes();
        loadEstadisticas();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const handleReactivateCliente = async (id: string) => {
    try {
      await clientesService.reactivateCliente(id);
      loadClientes();
      loadEstadisticas();
    } catch (error) {
      console.error('Error al reactivar cliente:', error);
      alert('Error al reactivar el cliente');
    }
  };

  const getCondicionImpositivaLabel = (condicion: number): string => {
    switch (condicion) {
      case CONDICIONES_IMPOSITIVAS.RESPONSABLE_INSCRIPTO: return 'Responsable Inscripto';
      case CONDICIONES_IMPOSITIVAS.EXENTO: return 'Exento';
      case CONDICIONES_IMPOSITIVAS.MONOTRIBUTO: return 'Monotributo';
      case CONDICIONES_IMPOSITIVAS.CONSUMIDOR_FINAL: return 'Consumidor Final';
      default: return 'Desconocido';
    }
  };

  const getTipoPersonaLabel = (tipo: number): string => {
    return tipo === TIPOS_PERSONA.FISICA ? 'Física' : 'Jurídica';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600">Administra tu base de datos de clientes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.activos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Personas Físicas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.porTipoPersona.fisica}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Personas Jurídicas</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.porTipoPersona.juridica}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
            <button
              onClick={() => window.location.href = '/clientes/nuevo'}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Persona
                </label>
                <select
                  value={filters.tipoPersona || ''}
                  onChange={(e) => handleFilterChange('tipoPersona', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value={TIPOS_PERSONA.FISICA}>Física</option>
                  <option value={TIPOS_PERSONA.JURIDICA}>Jurídica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condición Impositiva
                </label>
                <select
                  value={filters.condicionImpositiva || ''}
                  onChange={(e) => handleFilterChange('condicionImpositiva', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value={CONDICIONES_IMPOSITIVAS.RESPONSABLE_INSCRIPTO}>Responsable Inscripto</option>
                  <option value={CONDICIONES_IMPOSITIVAS.EXENTO}>Exento</option>
                  <option value={CONDICIONES_IMPOSITIVAS.MONOTRIBUTO}>Monotributo</option>
                  <option value={CONDICIONES_IMPOSITIVAS.CONSUMIDOR_FINAL}>Consumidor Final</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.activo?.toString() || ''}
                  onChange={(e) => handleFilterChange('activo', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Clientes ({totalClientes})
            </h2>
            <button
              onClick={loadClientes}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando clientes...</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="p-6 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron clientes</p>
              <button
                onClick={() => window.location.href = '/clientes/nuevo'}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Crear primer cliente
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.tipoPersona === TIPOS_PERSONA.FISICA
                            ? `${cliente.nombre} ${cliente.apellido || ''}`
                            : cliente.razonSocial || cliente.nombre
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {cliente.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {afipService.formatearCUIT(cliente.documento)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.tipoPersona === TIPOS_PERSONA.FISICA
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {getTipoPersonaLabel(cliente.tipoPersona)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {getCondicionImpositivaLabel(cliente.condicionImpositiva)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cliente.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.location.href = `/clientes/${cliente.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/clientes/${cliente.id}/editar`}
                          className="text-green-600 hover:text-green-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {cliente.activo ? (
                          <button
                            onClick={() => handleDeleteCliente(cliente.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateCliente(cliente.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Reactivar"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 