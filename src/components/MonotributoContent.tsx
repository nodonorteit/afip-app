'use client';

import { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';

export function MonotributoContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

  const categoryInfo = {
    currentCategory: 'A',
    nextCategory: 'B',
    grossIncome: 850000,
    maxIncome: 1000000,
    percentage: 85,
  };

  const obligations = [
    {
      id: 1,
      name: 'Pago Mensual',
      amount: 12500,
      dueDate: '2024-01-20',
      status: 'pending',
      description: 'Pago de monotributo mensual',
    },
    {
      id: 2,
      name: 'Declaración Anual',
      amount: 0,
      dueDate: '2024-06-30',
      status: 'upcoming',
      description: 'Declaración jurada anual',
    },
    {
      id: 3,
      name: 'Pago Trimestral',
      amount: 37500,
      dueDate: '2024-04-20',
      status: 'upcoming',
      description: 'Pago trimestral de monotributo',
    },
  ];

  const paymentHistory = [
    {
      id: 1,
      period: 'Diciembre 2023',
      amount: 12000,
      date: '2023-12-20',
      status: 'paid',
    },
    {
      id: 2,
      period: 'Noviembre 2023',
      amount: 12000,
      date: '2023-11-20',
      status: 'paid',
    },
    {
      id: 3,
      period: 'Octubre 2023',
      amount: 12000,
      date: '2023-10-20',
      status: 'paid',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Monotributo</h1>
        <p className="text-gray-600">Gestión de categorización y pagos</p>
      </div>

      {/* Category Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Categoría Actual</h3>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Categoría {categoryInfo.currentCategory}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ingresos Brutos:</span>
              <span className="font-medium">${categoryInfo.grossIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Límite Categoría:</span>
              <span className="font-medium">${categoryInfo.maxIncome.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${categoryInfo.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {categoryInfo.percentage}% del límite utilizado
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximo Pago</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">
              ${obligations[0].amount.toLocaleString()}
            </div>
            <p className="text-gray-600">Vence el 20 de Enero</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Realizar Pago
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumen Anual</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">
              $144,000
            </div>
            <p className="text-gray-600">Total pagado en 2023</p>
            <div className="text-sm text-green-600">
              +5.2% vs año anterior
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obligations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Obligaciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {obligations.map((obligation) => (
                <div key={obligation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      obligation.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {obligation.status === 'pending' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{obligation.name}</p>
                      <p className="text-sm text-gray-500">{obligation.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${obligation.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vence: {new Date(obligation.dueDate).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Pagos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{payment.period}</p>
                      <p className="text-sm text-gray-500">
                        Pagado: {new Date(payment.date).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Pagado
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                Ver historial completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 