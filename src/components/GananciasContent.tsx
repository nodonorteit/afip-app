'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar,
  FileText,
  ArrowRight,
  Download,
  Upload,
  Calculator
} from 'lucide-react';

export function GananciasContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q4');

  const gananciasSummary = {
    grossIncome: 3500000,
    netIncome: 2800000,
    deductions: 700000,
    taxableIncome: 2100000,
    taxToPay: 315000,
    taxPaid: 252000,
    taxRemaining: 63000,
  };

  const declarations = [
    {
      id: 1,
      period: '4to Trimestre 2023',
      status: 'pending',
      dueDate: '2024-01-15',
      taxToPay: 63000,
      description: 'Declaración jurada trimestral',
    },
    {
      id: 2,
      period: '3er Trimestre 2023',
      status: 'completed',
      dueDate: '2023-10-15',
      taxToPay: 58000,
      description: 'Declaración jurada trimestral',
    },
    {
      id: 3,
      period: '2do Trimestre 2023',
      status: 'completed',
      dueDate: '2023-07-15',
      taxToPay: 52000,
      description: 'Declaración jurada trimestral',
    },
  ];

  const incomeBreakdown = [
    {
      category: 'Ingresos por Actividad',
      amount: 2800000,
      percentage: 80,
    },
    {
      category: 'Rendimientos Financieros',
      amount: 350000,
      percentage: 10,
    },
    {
      category: 'Otros Ingresos',
      amount: 350000,
      percentage: 10,
    },
  ];

  const deductions = [
    {
      category: 'Gastos Deducibles',
      amount: 500000,
      percentage: 71,
    },
    {
      category: 'Contribuciones',
      amount: 150000,
      percentage: 21,
    },
    {
      category: 'Otros Deducciones',
      amount: 50000,
      percentage: 8,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ganancias</h1>
        <p className="text-gray-600">Gestión de declaraciones y pagos de Ganancias</p>
      </div>

      {/* Ganancias Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Impuesto a Pagar</h3>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600">
            ${gananciasSummary.taxRemaining.toLocaleString()}
          </div>
          <p className="text-gray-600">4to Trimestre 2023</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos Brutos</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${gananciasSummary.grossIncome.toLocaleString()}
          </div>
          <p className="text-gray-600">Este año</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ganancia Neta</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${gananciasSummary.netIncome.toLocaleString()}
          </div>
          <p className="text-gray-600">Este año</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deducciones</h3>
            <Calculator className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">
            ${gananciasSummary.deductions.toLocaleString()}
          </div>
          <p className="text-gray-600">Este año</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      ${declaration.taxToPay.toLocaleString()}
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

        {/* Income Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Composición de Ingresos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {incomeBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{item.percentage}% del total</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Deducciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {deductions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.category}</span>
                    <span className="font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{item.percentage}% del total</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tax Calculation */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cálculo del Impuesto</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Ingresos Brutos</p>
              <p className="text-2xl font-bold text-gray-900">${gananciasSummary.grossIncome.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">- Deducciones</p>
              <p className="text-2xl font-bold text-red-600">-${gananciasSummary.deductions.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">= Ganancia Imponible</p>
              <p className="text-2xl font-bold text-blue-600">${gananciasSummary.taxableIncome.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Impuesto (15%)</p>
              <p className="text-2xl font-bold text-purple-600">${gananciasSummary.taxToPay.toLocaleString()}</p>
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