'use client';

import { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  Plus,
  ArrowRight,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

export function FacturacionContent() {
  const [selectedType, setSelectedType] = useState('all');

  const facturacionSummary = {
    totalEmitted: 156,
    totalAmount: 2500000,
    thisMonth: 23,
    thisMonthAmount: 450000,
    pending: 5,
    pendingAmount: 85000,
  };

  const invoices = [
    {
      id: 'A-0001-00000001',
      type: 'A',
      client: 'Empresa ABC S.A.',
      amount: 525000,
      date: '2024-01-15',
      status: 'approved',
      cae: '12345678901234',
      caeExpiry: '2024-02-15',
    },
    {
      id: 'B-0001-00000002',
      type: 'B',
      client: 'Juan Pérez',
      amount: 315000,
      date: '2024-01-14',
      status: 'pending',
      cae: null,
      caeExpiry: null,
    },
    {
      id: 'C-0001-00000003',
      type: 'C',
      client: 'María González',
      amount: 420000,
      date: '2024-01-13',
      status: 'approved',
      cae: '12345678901235',
      caeExpiry: '2024-02-13',
    },
    {
      id: 'A-0001-00000004',
      type: 'A',
      client: 'Comercio XYZ',
      amount: 280000,
      date: '2024-01-12',
      status: 'rejected',
      cae: null,
      caeExpiry: null,
    },
  ];

  const invoiceTypes = [
    { type: 'A', name: 'Factura A', description: 'Responsable Inscripto' },
    { type: 'B', name: 'Factura B', description: 'Consumidor Final' },
    { type: 'C', name: 'Factura C', description: 'Monotributista' },
    { type: 'E', name: 'Factura E', description: 'Exportación' },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Factura emitida',
      invoice: 'A-0001-00000001',
      amount: 525000,
      date: 'Hace 2 horas',
      status: 'success',
    },
    {
      id: 2,
      action: 'CAE solicitado',
      invoice: 'B-0001-00000002',
      amount: 315000,
      date: 'Hace 4 horas',
      status: 'pending',
    },
    {
      id: 3,
      action: 'Factura rechazada',
      invoice: 'A-0001-00000004',
      amount: 280000,
      date: 'Ayer',
      status: 'error',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facturación Electrónica</h1>
        <p className="text-gray-600">Gestión de facturas electrónicas y comprobantes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Emitidas</h3>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {facturacionSummary.totalEmitted}
          </div>
          <p className="text-gray-600">${facturacionSummary.totalAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Este Mes</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            {facturacionSummary.thisMonth}
          </div>
          <p className="text-gray-600">${facturacionSummary.thisMonthAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {facturacionSummary.pending}
          </div>
          <p className="text-gray-600">${facturacionSummary.pendingAmount.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tasa Aprobación</h3>
            <CheckCircle className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            95%
          </div>
          <p className="text-gray-600">Este mes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Facturas Recientes</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar facturas..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nueva Factura</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      invoice.status === 'approved' ? 'bg-green-100' : 
                      invoice.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {invoice.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : invoice.status === 'pending' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('es-AR')}
                    </p>
                    {invoice.cae && (
                      <p className="text-xs text-green-600">CAE: {invoice.cae}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                Ver todas las facturas
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Types & Recent Activity */}
        <div className="space-y-6">
          {/* Invoice Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tipos de Factura</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {invoiceTypes.map((type) => (
                  <div key={type.type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {type.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' : 
                        activity.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {activity.status === 'success' ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : activity.status === 'pending' ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.invoice}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${activity.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Nueva Factura</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          <Upload className="h-5 w-5" />
          <span>Solicitar CAE</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Descargar PDF</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
          <Filter className="h-5 w-5" />
          <span>Filtrar</span>
        </button>
      </div>
    </div>
  );
} 