'use client';

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Send,
  User,
  FileText,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { 
  Cliente, 
  ItemFactura, 
  TIPOS_COMPROBANTE,
  CONDICIONES_IMPOSITIVAS,
  ALICUOTAS_IVA,
  CONCEPTOS,
  UNIDADES_MEDIDA,
  TIPOS_DOCUMENTO,
  TIPOS_PERSONA,
  PROVINCIAS
} from '@/types/facturacion';
import { facturacionService } from '@/services/facturacionService';

export function FacturaCreator() {
  const [cliente, setCliente] = useState<Cliente>({
    Documento: '',
    TipoDocumento: TIPOS_DOCUMENTO.CUIT,
    Nombre: '',
    TipoPersona: TIPOS_PERSONA.FISICA,
    CondicionImpositiva: CONDICIONES_IMPOSITIVAS.CONSUMIDOR_FINAL
  });

  const [items, setItems] = useState<ItemFactura[]>([
    {
      Descripcion: '',
      Cantidad: 1,
      PrecioUnitario: 0,
      Concepto: CONCEPTOS.PRODUCTO,
      UnidadMedida: UNIDADES_MEDIDA.UNIDADES,
      AlicuotaIVA: ALICUOTAS_IVA.VEINTIUNO
    }
  ]);

  const [fechaComprobante, setFechaComprobante] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [puntoVenta, setPuntoVenta] = useState(1);
  const [tipoComprobante, setTipoComprobante] = useState(TIPOS_COMPROBANTE.FACTURA_B);
  const [leyenda, setLeyenda] = useState('');
  const [mensajeInicial, setMensajeInicial] = useState('');
  const [autoEnvioCorreo, setAutoEnvioCorreo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const agregarItem = () => {
    setItems([...items, {
      Descripcion: '',
      Cantidad: 1,
      PrecioUnitario: 0,
      Concepto: CONCEPTOS.PRODUCTO,
      UnidadMedida: UNIDADES_MEDIDA.UNIDADES,
      AlicuotaIVA: ALICUOTAS_IVA.VEINTIUNO
    }]);
  };

  const eliminarItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const actualizarItem = (index: number, field: keyof ItemFactura, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const actualizarCliente = (field: keyof Cliente, value: any) => {
    setCliente({ ...cliente, [field]: value });
  };

  const validarFormulario = () => {
    const newErrors: string[] = [];

    // Validar cliente
    const clienteValidation = facturacionService.validarCliente(cliente);
    if (!clienteValidation.isValid) {
      newErrors.push(...clienteValidation.errors);
    }

    // Validar items
    const itemsValidation = facturacionService.validarItems(items);
    if (!itemsValidation.isValid) {
      newErrors.push(...itemsValidation.errors);
    }

    // Validar fecha
    if (!fechaComprobante) {
      newErrors.push('La fecha del comprobante es obligatoria');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const emitirFactura = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const request = {
        TipoComprobante: tipoComprobante,
        PuntoVenta: puntoVenta,
        FechaComprobante: fechaComprobante,
        Cliente: cliente,
        Items: items,
        Leyenda: leyenda,
        MensajeInicial: mensajeInicial,
        AutoEnvioCorreo: autoEnvioCorreo
      };

      const response = await facturacionService.emitirFactura(request);
      
      if (response.success) {
        alert('Factura emitida exitosamente');
        // Aquí podrías redirigir o mostrar el PDF
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      alert('Error al emitir la factura');
    } finally {
      setLoading(false);
    }
  };

  const totales = facturacionService.calcularTotales(items);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Crear Factura Electrónica
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Errores de validación:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración del comprobante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comprobante
              </label>
              <select
                value={tipoComprobante}
                onChange={(e) => setTipoComprobante(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TIPOS_COMPROBANTE.FACTURA_A}>Factura A</option>
                <option value={TIPOS_COMPROBANTE.FACTURA_B}>Factura B</option>
                <option value={TIPOS_COMPROBANTE.FACTURA_C}>Factura C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Punto de Venta
              </label>
              <input
                type="number"
                value={puntoVenta}
                onChange={(e) => setPuntoVenta(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Comprobante
              </label>
              <input
                type="date"
                value={fechaComprobante}
                onChange={(e) => setFechaComprobante(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Datos del cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Datos del Cliente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={cliente.TipoDocumento}
                  onChange={(e) => actualizarCliente('TipoDocumento', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={TIPOS_DOCUMENTO.CUIT}>CUIT</option>
                  <option value={TIPOS_DOCUMENTO.CUIL}>CUIL</option>
                  <option value={TIPOS_DOCUMENTO.DNI}>DNI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={cliente.Documento}
                  onChange={(e) => actualizarCliente('Documento', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej: 20-12345678-9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Persona
                </label>
                <select
                  value={cliente.TipoPersona}
                  onChange={(e) => actualizarCliente('TipoPersona', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={TIPOS_PERSONA.FISICA}>Física</option>
                  <option value={TIPOS_PERSONA.JURIDICA}>Jurídica</option>
                </select>
              </div>

              {cliente.TipoPersona === TIPOS_PERSONA.FISICA ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={cliente.Nombre}
                      onChange={(e) => actualizarCliente('Nombre', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={cliente.Apellido || ''}
                      onChange={(e) => actualizarCliente('Apellido', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={cliente.RazonSocial || ''}
                    onChange={(e) => actualizarCliente('RazonSocial', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condición Impositiva
                </label>
                <select
                  value={cliente.CondicionImpositiva}
                  onChange={(e) => actualizarCliente('CondicionImpositiva', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={CONDICIONES_IMPOSITIVAS.RESPONSABLE_INSCRIPTO}>Responsable Inscripto</option>
                  <option value={CONDICIONES_IMPOSITIVAS.EXENTO}>Exento</option>
                  <option value={CONDICIONES_IMPOSITIVAS.MONOTRIBUTO}>Monotributo</option>
                  <option value={CONDICIONES_IMPOSITIVAS.CONSUMIDOR_FINAL}>Consumidor Final</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={cliente.Email || ''}
                  onChange={(e) => actualizarCliente('Email', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Items de la factura */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calculator className="mr-2 h-4 w-4" />
                Items de la Factura
              </h3>
              <button
                onClick={agregarItem}
                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Agregar Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        onClick={() => eliminarItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={item.Descripcion}
                        onChange={(e) => actualizarItem(index, 'Descripcion', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        value={item.Cantidad}
                        onChange={(e) => actualizarItem(index, 'Cantidad', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Unitario
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.PrecioUnitario}
                        onChange={(e) => actualizarItem(index, 'PrecioUnitario', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concepto
                      </label>
                      <select
                        value={item.Concepto}
                        onChange={(e) => actualizarItem(index, 'Concepto', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={CONCEPTOS.PRODUCTO}>Producto</option>
                        <option value={CONCEPTOS.SERVICIO}>Servicio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidad de Medida
                      </label>
                      <select
                        value={item.UnidadMedida}
                        onChange={(e) => actualizarItem(index, 'UnidadMedida', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={UNIDADES_MEDIDA.UNIDADES}>Unidades</option>
                        <option value={UNIDADES_MEDIDA.KILOGRAMOS}>Kilogramos</option>
                        <option value={UNIDADES_MEDIDA.METROS}>Metros</option>
                        <option value={UNIDADES_MEDIDA.LITROS}>Litros</option>
                        <option value={UNIDADES_MEDIDA.HORAS}>Horas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alícuota IVA
                      </label>
                      <select
                        value={item.AlicuotaIVA}
                        onChange={(e) => actualizarItem(index, 'AlicuotaIVA', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={ALICUOTAS_IVA.VEINTIUNO}>21%</option>
                        <option value={ALICUOTAS_IVA.DIEZ_CINCO}>10.5%</option>
                        <option value={ALICUOTAS_IVA.VEINTISIETE}>27%</option>
                        <option value={ALICUOTAS_IVA.CERO}>0%</option>
                        <option value={ALICUOTAS_IVA.EXENTO}>Exento</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bonificación (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.Bonificacion || 0}
                        onChange={(e) => actualizarItem(index, 'Bonificacion', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Totales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Subtotal:</span>
                <div className="text-lg font-semibold">${totales.subtotal.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">IVA:</span>
                <div className="text-lg font-semibold">${totales.iva.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total:</span>
                <div className="text-2xl font-bold text-blue-600">${totales.total.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Datos adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leyenda
              </label>
              <textarea
                value={leyenda}
                onChange={(e) => setLeyenda(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Leyenda del comprobante..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje Inicial
              </label>
              <textarea
                value={mensajeInicial}
                onChange={(e) => setMensajeInicial(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Mensaje para el cliente..."
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoEnvioCorreo"
              checked={autoEnvioCorreo}
              onChange={(e) => setAutoEnvioCorreo(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoEnvioCorreo" className="ml-2 block text-sm text-gray-900">
              Enviar automáticamente por correo electrónico
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={emitirFactura}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Emitir Factura
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 