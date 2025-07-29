'use client';

import { useState } from 'react';
import {
  Home,
  FileText,
  Calculator,
  Receipt,
  Calendar,
  CreditCard,
  Building,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Monotributo', href: '/monotributo', icon: Calculator },
  { name: 'IVA', href: '/iva', icon: Receipt },
  { name: 'Ganancias', href: '/ganancias', icon: BarChart3 },
  { name: 'Facturación', href: '/facturacion', icon: FileText },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Pagos', href: '/pagos', icon: CreditCard },
  { name: 'Vencimientos', href: '/vencimientos', icon: Calendar },
  { name: 'Empresas', href: '/empresas', icon: Building },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">AFIP App</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                {!collapsed && item.name}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="text-xs text-gray-500">
              <p>Versión 1.0.0</p>
              <p>© 2024 AFIP App</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 