'use client';

import { useState } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';

export function IVAContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  const ivaSummary = {
    grossIncome: 2500000,
    netIncome: 2200000,
    ivaCollected: 525000,
    ivaPaid: 420000,
    ivaToPay: 105000,
    ivaToRefund: 0,
  };

  const declarations = [
    {
      id: 1,
      period: 'Diciembre 2023',
      status: 'pending',
      dueDate: '2024-01-20',
      ivaToPay: 105000,
      ivaToRefund: 0,
      description: 'Declaración mensual de IVA',
    },
    {
      id: 2,
      period: 'Noviembre 2023',
      status: 'completed',
      dueDate: '2023-12-20',
      ivaToPay: 89000,
      ivaToRefund: 0,
      description: 'Declaración mensual de IVA',
    },
    {
      id: 3,
      period: 'Octubre 2023',
      status: 'completed',
      dueDate: '2023-11-20',
      ivaToPay: 125000,
      ivaToRefund: 0,
      description: 'Declaración mensual de IVA',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'Venta',
      description: 'Factura A 0001-00000001',
      amount: 525000,
      date: '2024-01-15',
      iva: 105000,
    },
    {
      id: 2,
      type: 'Compra',
      description: 'Factura B 0001-00000002',
      amount: -420000,
      date: '2024-01-14',
      iva: -84000,
    },
    {
      id: 3,
      type: 'Venta',
      description: 'Factura A 0001-00000003',
      amount: 315000,
      date: '2024-01-13',
      iva: 63000,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">IVA</h1>
        <p className="text-gray-600">Gestión de declaraciones y pagos de IVA</p>
      </div>

      {/* IVA Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">IVA a Pagar</h3>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            ${ivaSummary.ivaToPay.toLocaleString()}
          </div>
          <p className="text-gray-600">Diciembre 2023</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">IVA Cobrado</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${ivaSummary.ivaCollected.toLocaleString()}
          </div>
          <p className="text-gray-600">Este mes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">IVA Pagado</h3>
            <Receipt className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${ivaSummary.ivaPaid.toLocaleString()}
          </div>
          <p className="text-gray-600">Este mes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos Brutos</h3>
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            ${ivaSummary.grossIncome.toLocaleString()}
          </div>
          <p className="text-gray-600">Este mes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Declarations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Declaraciones</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Nueva Declaración
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {declarations.map((declaration) => (
                <div key={declaration.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      declaration.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      {declaration.status === 'pending' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{declaration.period}</p>
                      <p className="text-sm text-gray-500">{declaration.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${declaration.ivaToPay.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vence: {new Date(declaration.dueDate).toLocaleDateString('es-AR')}
                    </p>
                    {declaration.status === 'pending' && (
                      <button className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                        Presentar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'Venta' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'Venta' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <Receipt className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      IVA: ${Math.abs(transaction.iva).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                Ver todas las transacciones
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
          <Upload className="h-5 w-5" />
          <span>Presentar Declaración</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Descargar Formulario</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
          <DollarSign className="h-5 w-5" />
          <span>Realizar Pago</span>
        </button>
      </div>
    </div>
  );
} 