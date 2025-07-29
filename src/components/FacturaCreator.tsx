'use client';

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  User,
  Users,
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
  TIPOS_PERSONA
} from '@/types/facturacion';
import { facturacionService } from '@/services/facturacionService';
import { afipService, DatosAFIP } from '@/services/afipService';
import { clientesService } from '@/services/clientesService';
import { ClienteDB } from '@/types/clientes';

export function FacturaCreator() {
  const [cliente, setCliente] = useState<Cliente>({
    Documento: '',
    TipoDocumento: TIPOS_DOCUMENTO.CUIT,
    Nombre: '',
    TipoPersona: TIPOS_PERSONA.FISICA,
    CondicionImpositiva: CONDICIONES_IMPOSITIVAS.CONSUMIDOR_FINAL
  });

  const [consultandoAFIP, setConsultandoAFIP] = useState(false);
  const [datosAFIP, setDatosAFIP] = useState<DatosAFIP | null>(null);
  const [clientesDisponibles, setClientesDisponibles] = useState<ClienteDB[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteDB | null>(null);
  const [mostrarSelectorClientes, setMostrarSelectorClientes] = useState(false);

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
  const [tipoComprobante, setTipoComprobante] = useState<number>(TIPOS_COMPROBANTE.FACTURA_B);
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

  const actualizarItem = (index: number, field: keyof ItemFactura, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const actualizarCliente = (field: keyof Cliente, value: string | number) => {
    setCliente({ ...cliente, [field]: value });
  };

  const consultarDatosAFIP = async (cuit: string) => {
    if (cuit.length < 11) return;

    setConsultandoAFIP(true);
    try {
      // Usar datos simulados para desarrollo
      const datos = await afipService.consultarDatosSimulados(cuit);
      
      if (datos) {
        setDatosAFIP(datos);
        
        // Autocompletar datos del cliente
        const nuevoCliente: Cliente = {
          Documento: datos.cuit,
          TipoDocumento: afipService.determinarTipoDocumento(datos.cuit),
          TipoPersona: afipService.determinarTipoPersona(datos.tipoPersona),
          CondicionImpositiva: afipService.determinarCondicionImpositiva(datos.condicionImpositiva),
          Nombre: datos.nombre || '',
          Apellido: datos.apellido || '',
          RazonSocial: datos.razonSocial || '',
          Email: datos.email || '',
          Telefono: datos.telefono || '',
          Domicilio: datos.domicilio || '',
          Localidad: datos.localidad || '',
          CodigoPostal: datos.codigoPostal || ''
        };

        setCliente(nuevoCliente);
      }
    } catch (error) {
      console.error('Error al consultar datos de AFIP:', error);
    } finally {
      setConsultandoAFIP(false);
    }
  };

  const handleDocumentoChange = (value: string) => {
    // Limpiar el documento (remover guiones)
    const documentoLimpio = afipService.limpiarCUIT(value);
    
    // Actualizar el documento sin guiones
    actualizarCliente('Documento', documentoLimpio);
    
    // Consultar AFIP si es un CUIT válido
    if (documentoLimpio.length === 11) {
      consultarDatosAFIP(documentoLimpio);
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await clientesService.getClientes({ activo: true }, 1, 100);
      setClientesDisponibles(response.clientes);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const seleccionarCliente = (cliente: ClienteDB) => {
    setClienteSeleccionado(cliente);
    setMostrarSelectorClientes(false);
    
    // Autocompletar datos del cliente seleccionado
    const nuevoCliente: Cliente = {
      Documento: cliente.documento,
      TipoDocumento: cliente.tipoDocumento,
      Nombre: cliente.nombre,
      Apellido: cliente.apellido || '',
      RazonSocial: cliente.razonSocial || '',
      TipoPersona: cliente.tipoPersona,
      CondicionImpositiva: cliente.condicionImpositiva,
      Email: cliente.email || '',
      Telefono: cliente.telefono || '',
      Domicilio: cliente.domicilio || '',
      Localidad: cliente.localidad || '',
      CodigoPostal: cliente.codigoPostal || ''
    };

    setCliente(nuevoCliente);
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="mr-2 h-4 w-4" />
                Datos del Cliente
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                  CUITs de prueba: 20123456789, 20345678901, 20123456780, 20234567890
                </div>
                <button
                  onClick={() => {
                    cargarClientes();
                    setMostrarSelectorClientes(true);
                  }}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Seleccionar Cliente
                </button>
              </div>
            </div>

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
                <div className="relative">
                  <input
                    type="text"
                    value={afipService.formatearCUIT(cliente.Documento)}
                    onChange={(e) => handleDocumentoChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej: 20-12345678-9"
                  />
                  {consultandoAFIP && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                {datosAFIP && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm text-green-800">
                          Datos obtenidos de AFIP: {datosAFIP.condicionImpositiva}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                        <option value={UNIDADES_MEDIDA.UNIDADES}>Horas</option>
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

      {/* Modal de selección de clientes */}
      {mostrarSelectorClientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Seleccionar Cliente</h3>
              <button
                onClick={() => setMostrarSelectorClientes(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {clientesDisponibles.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay clientes disponibles</p>
                <button
                  onClick={() => window.location.href = '/clientes/nuevo'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Crear nuevo cliente
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {clientesDisponibles.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => seleccionarCliente(cliente)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {cliente.tipoPersona === 1
                            ? `${cliente.nombre} ${cliente.apellido || ''}`
                            : cliente.razonSocial || cliente.nombre
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {afipService.formatearCUIT(cliente.documento)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {cliente.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cliente.tipoPersona === 1 ? 'Física' : 'Jurídica'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 