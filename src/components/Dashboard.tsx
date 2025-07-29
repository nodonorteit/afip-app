'use client';

import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      name: 'Monotributo',
      value: 'Categoría A',
      change: '+2.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      name: 'IVA a Pagar',
      value: '$45,230',
      change: '-12.3%',
      changeType: 'negative',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Vencimientos',
      value: '3 pendientes',
      change: 'Esta semana',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      name: 'Facturas Emitidas',
      value: '156',
      change: '+8.1%',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Pago',
      description: 'Pago de monotributo realizado',
      amount: '$12,500',
      date: 'Hace 2 horas',
      status: 'completed',
    },
    {
      id: 2,
      type: 'Declaración',
      description: 'IVA mensual presentado',
      amount: '$23,400',
      date: 'Ayer',
      status: 'completed',
    },
    {
      id: 3,
      type: 'Vencimiento',
      description: 'Ganancias vence en 5 días',
      amount: '$8,900',
      date: 'En 5 días',
      status: 'pending',
    },
    {
      id: 4,
      type: 'Facturación',
      description: 'Factura electrónica emitida',
      amount: '$15,600',
      date: 'Hace 3 días',
      status: 'completed',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Ganancias - 4to Trimestre',
      date: '15 de Enero',
      daysLeft: 5,
      priority: 'high',
    },
    {
      id: 2,
      title: 'IVA - Diciembre',
      date: '20 de Enero',
      daysLeft: 10,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Monotributo - Enero',
      date: '25 de Enero',
      daysLeft: 15,
      priority: 'low',
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu situación fiscal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {stat.change}
                </span>
                <ArrowUpRight className={`ml-1 h-4 w-4 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {activity.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Vencimientos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                      <p className="text-sm text-gray-500">{deadline.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deadline.daysLeft} días
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Ver todos los vencimientos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 