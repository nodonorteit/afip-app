import { 
  FacturaRequest, 
  FacturaResponse, 
  Cliente, 
  ItemFactura,
  TIPOS_COMPROBANTE,
  CONDICIONES_IMPOSITIVAS,
  ALICUOTAS_IVA
} from '@/types/facturacion';

// Servicio de facturación electrónica
// Basado en la API de iFactura: https://github.com/wnpower/iFactura-API-Integracion

export class FacturacionService {
  private baseUrl: string;
  private credentials: { email: string; password: string };

  constructor(email: string, password: string, baseUrl: string = 'https://app.ifactura.com.ar/API') {
    this.baseUrl = baseUrl;
    this.credentials = { email, password };
  }

  /**
   * Emitir una nueva factura electrónica
   * Equivalente a EmitirFactura de iFactura
   */
  async emitirFactura(request: Omit<FacturaRequest, 'APIJson'>): Promise<FacturaResponse> {
    try {
      const fullRequest: FacturaRequest = {
        ...request,
        APIJson: {
          Email: this.credentials.email,
          Password: this.credentials.password
        }
      };

      const response = await fetch(`${this.baseUrl}/EmitirFactura`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullRequest)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al emitir factura:', error);
      return {
        success: false,
        message: 'Error al emitir la factura'
      };
    }
  }

  /**
   * Emitir nota de débito
   */
  async emitirNotaDebito(
    hashComprobanteRelacionado: string,
    request: Omit<FacturaRequest, 'APIJson' | 'TipoComprobante' | 'HashComprobanteRelacionado'>
  ): Promise<FacturaResponse> {
    const tipoComprobante = this.determinarTipoNotaDebito(request.Cliente.CondicionImpositiva);
    
    return this.emitirFactura({
      ...request,
      TipoComprobante: tipoComprobante,
      HashComprobanteRelacionado: hashComprobanteRelacionado
    });
  }

  /**
   * Emitir nota de crédito
   */
  async emitirNotaCredito(
    hashComprobanteRelacionado: string,
    request: Omit<FacturaRequest, 'APIJson' | 'TipoComprobante' | 'HashComprobanteRelacionado'>
  ): Promise<FacturaResponse> {
    const tipoComprobante = this.determinarTipoNotaCredito(request.Cliente.CondicionImpositiva);
    
    return this.emitirFactura({
      ...request,
      TipoComprobante: tipoComprobante,
      HashComprobanteRelacionado: hashComprobanteRelacionado
    });
  }

  /**
   * Obtener comprobante por hash
   */
  async obtenerComprobante(hash: string): Promise<FacturaResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ObtenerComprobante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          APIJson: this.credentials,
          Hash: hash
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener comprobante:', error);
      return {
        success: false,
        message: 'Error al obtener el comprobante'
      };
    }
  }

  /**
   * Anular comprobante
   */
  async anularComprobante(hash: string, motivo: string): Promise<FacturaResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/AnularComprobante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          APIJson: this.credentials,
          Hash: hash,
          Motivo: motivo
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al anular comprobante:', error);
      return {
        success: false,
        message: 'Error al anular el comprobante'
      };
    }
  }

  /**
   * Obtener puntos de venta disponibles
   */
  async obtenerPuntosVenta(): Promise<{ success: boolean; message?: string; data?: unknown }> {
    try {
      const response = await fetch(`${this.baseUrl}/ObtenerPuntosVenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          APIJson: this.credentials
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener puntos de venta:', error);
      return {
        success: false,
        message: 'Error al obtener puntos de venta'
      };
    }
  }

  /**
   * Validar datos del cliente
   */
  validarCliente(cliente: Cliente): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!cliente.Documento) {
      errors.push('El documento es obligatorio');
    }

    if (!cliente.Nombre) {
      errors.push('El nombre es obligatorio');
    }

    if (cliente.TipoPersona === 1 && !cliente.Apellido) {
      errors.push('El apellido es obligatorio para personas físicas');
    }

    if (cliente.TipoPersona === 2 && !cliente.RazonSocial) {
      errors.push('La razón social es obligatoria para personas jurídicas');
    }

    if (!cliente.CondicionImpositiva) {
      errors.push('La condición impositiva es obligatoria');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar items de la factura
   */
  validarItems(items: ItemFactura[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('Debe incluir al menos un item');
      return { isValid: false, errors };
    }

    items.forEach((item, index) => {
      if (!item.Descripcion) {
        errors.push(`Item ${index + 1}: La descripción es obligatoria`);
      }

      if (!item.Cantidad || item.Cantidad <= 0) {
        errors.push(`Item ${index + 1}: La cantidad debe ser mayor a 0`);
      }

      if (!item.PrecioUnitario || item.PrecioUnitario <= 0) {
        errors.push(`Item ${index + 1}: El precio unitario debe ser mayor a 0`);
      }

      if (!item.Concepto) {
        errors.push(`Item ${index + 1}: El concepto es obligatorio`);
      }

      if (!item.UnidadMedida) {
        errors.push(`Item ${index + 1}: La unidad de medida es obligatoria`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcular totales de la factura
   */
  calcularTotales(items: ItemFactura[]): {
    subtotal: number;
    iva: number;
    total: number;
    desgloseIva: { [key: number]: number };
  } {
    let subtotal = 0;
    const desgloseIva: { [key: number]: number } = {};

    items.forEach(item => {
      const itemSubtotal = item.Cantidad * item.PrecioUnitario;
      const bonificacion = item.Bonificacion || 0;
      const subtotalConBonificacion = itemSubtotal * (1 - bonificacion / 100);
      
      subtotal += subtotalConBonificacion;

      // Calcular IVA
      if (item.AlicuotaIVA) {
        const porcentajeIva = this.obtenerPorcentajeIva(item.AlicuotaIVA);
        const ivaItem = subtotalConBonificacion * (porcentajeIva / 100);
        
        if (!desgloseIva[item.AlicuotaIVA]) {
          desgloseIva[item.AlicuotaIVA] = 0;
        }
        desgloseIva[item.AlicuotaIVA] += ivaItem;
      }
    });

    const iva = Object.values(desgloseIva).reduce((sum, value) => sum + value, 0);
    const total = subtotal + iva;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      iva: Math.round(iva * 100) / 100,
      total: Math.round(total * 100) / 100,
      desgloseIva
    };
  }

  /**
   * Determinar tipo de nota de débito según condición impositiva
   */
  private determinarTipoNotaDebito(condicionImpositiva: number): number {
    switch (condicionImpositiva) {
      case CONDICIONES_IMPOSITIVAS.RESPONSABLE_INSCRIPTO:
        return TIPOS_COMPROBANTE.NOTA_DEBITO_A;
      case CONDICIONES_IMPOSITIVAS.MONOTRIBUTO:
        return TIPOS_COMPROBANTE.NOTA_DEBITO_B;
      default:
        return TIPOS_COMPROBANTE.NOTA_DEBITO_B;
    }
  }

  /**
   * Determinar tipo de nota de crédito según condición impositiva
   */
  private determinarTipoNotaCredito(condicionImpositiva: number): number {
    switch (condicionImpositiva) {
      case CONDICIONES_IMPOSITIVAS.RESPONSABLE_INSCRIPTO:
        return TIPOS_COMPROBANTE.NOTA_CREDITO_A;
      case CONDICIONES_IMPOSITIVAS.MONOTRIBUTO:
        return TIPOS_COMPROBANTE.NOTA_CREDITO_B;
      default:
        return TIPOS_COMPROBANTE.NOTA_CREDITO_B;
    }
  }

  /**
   * Obtener porcentaje de IVA según ID
   */
  private obtenerPorcentajeIva(alicuotaId: number): number {
    switch (alicuotaId) {
      case ALICUOTAS_IVA.CERO:
        return 0;
      case ALICUOTAS_IVA.DIEZ_CINCO:
        return 10.5;
      case ALICUOTAS_IVA.VEINTIUNO:
        return 21;
      case ALICUOTAS_IVA.VEINTISIETE:
        return 27;
      case ALICUOTAS_IVA.CINCO:
        return 5;
      case ALICUOTAS_IVA.DOS_CINCO:
        return 2.5;
      case ALICUOTAS_IVA.EXENTO:
      case ALICUOTAS_IVA.NO_GRAVADO:
        return 0;
      default:
        return 21; // Por defecto 21%
    }
  }
}

// Instancia global del servicio
export const facturacionService = new FacturacionService(
  process.env.NEXT_PUBLIC_IFACTURA_EMAIL || '',
  process.env.NEXT_PUBLIC_IFACTURA_PASSWORD || ''
); 