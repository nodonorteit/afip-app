// Tipos basados en la API de iFactura
// Referencia: https://github.com/wnpower/iFactura-API-Integracion

export interface Cliente {
  // Datos obligatorios
  Documento: string; // CUIT/CUIL/DNI
  TipoDocumento: number; // 1=CUIT, 2=CUIL, 10=DNI
  Nombre: string;
  Apellido?: string; // Para personas físicas
  RazonSocial?: string; // Para personas jurídicas
  TipoPersona: number; // 1=Física, 2=Jurídica
  CondicionImpositiva: number; // 1=RI, 2=Exento, 3=Monotributo, 4=Consumidor Final
  
  // Datos de contacto
  Email?: string;
  Telefono?: string;
  
  // Dirección
  Domicilio?: string;
  Localidad?: string;
  Provincia?: number; // ID de provincia
  CodigoPostal?: string;
  
  // Datos adicionales
  Pais?: string;
  Observaciones?: string;
}

export interface ItemFactura {
  // Datos obligatorios
  Descripcion: string;
  Cantidad: number;
  PrecioUnitario: number;
  Concepto: number; // 1=Producto, 2=Servicio
  UnidadMedida: number; // ID de unidad de medida
  
  // Datos opcionales
  Bonificacion?: number;
  AlicuotaIVA?: number; // ID de alícuota IVA
  Observaciones?: string;
}

export interface FacturaRequest {
  // Datos de autenticación
  APIJson: {
    Email: string;
    Password: string;
  };
  
  // Datos del comprobante
  TipoComprobante: number; // 1=Factura A, 4=Factura B, 19=Factura C
  PuntoVenta: number; // ID del punto de venta
  FechaComprobante: string; // yyyy-mm-dd
  FechaServicioDesde?: string;
  FechaServicioHasta?: string;
  FechaVencimientoPago?: string;
  
  // Datos del cliente
  Cliente: Cliente;
  
  // Items de la factura
  Items: ItemFactura[];
  
  // Datos opcionales
  Leyenda?: string;
  OrdenPago?: string;
  MensajeInicial?: string;
  Remito?: string;
  AutoEnvioCorreo?: boolean;
  
  // Para notas de crédito/débito
  HashComprobanteRelacionado?: string;
}

export interface FacturaResponse {
  success: boolean;
  message?: string;
  data?: {
    Hash: string;
    CAE: string;
    FechaVencimientoCAE: string;
    NumeroComprobante: string;
    PuntoVenta: number;
    TipoComprobante: number;
    PDF?: string; // Base64 del PDF
  };
}

// Tipos de comprobantes según iFactura
export const TIPOS_COMPROBANTE = {
  FACTURA_A: 1,
  NOTA_DEBITO_A: 2,
  NOTA_CREDITO_A: 3,
  FACTURA_B: 4,
  NOTA_DEBITO_B: 5,
  NOTA_CREDITO_B: 6,
  RECIBO_A: 7,
  RECIBO_B: 9,
  FACTURA_C: 19,
  NOTA_DEBITO_C: 20,
  NOTA_CREDITO_C: 21,
  RECIBO_C: 22,
} as const;

// Tipos de documento
export const TIPOS_DOCUMENTO = {
  CUIT: 1,
  CUIL: 2,
  CDI: 3,
  LE: 4,
  LC: 5,
  CI_EXTRANJERA: 6,
  DNI: 10,
  CI_POLICIA_FEDERAL: 12,
  DOC_OTRO: 36,
} as const;

// Condiciones impositivas
export const CONDICIONES_IMPOSITIVAS = {
  RESPONSABLE_INSCRIPTO: 1,
  EXENTO: 2,
  MONOTRIBUTO: 3,
  CONSUMIDOR_FINAL: 4,
} as const;

// Alícuotas de IVA
export const ALICUOTAS_IVA = {
  CERO: 1, // 0%
  DIEZ_CINCO: 2, // 10.5%
  VEINTIUNO: 3, // 21%
  VEINTISIETE: 4, // 27%
  CINCO: 5, // 5%
  DOS_CINCO: 6, // 2.5%
  EXENTO: 7,
  NO_GRAVADO: 8,
} as const;

// Conceptos
export const CONCEPTOS = {
  PRODUCTO: 1,
  SERVICIO: 2,
} as const;

// Formas de pago
export const FORMAS_PAGO = {
  CONTADO: 1,
  TARJETA_DEBITO: 2,
  TARJETA_CREDITO: 3,
  CUENTA_CORRIENTE: 4,
  CHEQUE: 5,
  OTRO: 7,
} as const;

// Unidades de medida
export const UNIDADES_MEDIDA = {
  KILOGRAMOS: 1,
  METROS: 2,
  METROS_CUADRADOS: 3,
  METROS_CUBICOS: 4,
  LITROS: 5,
  KWH: 6,
  UNIDADES: 7,
  PARES: 8,
  DOCENAS: 9,
  QUILATES: 10,
  MILLARES: 11,
  GRAMOS: 12,
  MILIMETROS: 13,
  MM_CUBICOS: 14,
  KILOMETROS: 15,
  HECTOLITROS: 16,
  CENTIMETROS: 17,
  TONELADAS: 20,
  MILIGRAMOS: 27,
  MILILITROS: 28,
  PACKS: 44,
  SEÑA_ANTICIPO: 45,
  OTRAS_UNIDADES: 46,
  BONIFICACION: 47,
} as const;

// Provincias
export const PROVINCIAS = {
  CABA: 1,
  BUENOS_AIRES: 2,
  CATAMARCA: 3,
  CORDOBA: 4,
  CORRIENTES: 5,
  ENTRE_RIOS: 6,
  JUJUY: 7,
  MENDOZA: 8,
  LA_RIOJA: 9,
  SALTA: 10,
  SAN_JUAN: 11,
  SAN_LUIS: 12,
  SANTA_FE: 13,
  SANTIAGO_DEL_ESTERO: 14,
  TUCUMAN: 15,
  CHACO: 16,
  CHUBUT: 17,
  FORMOSA: 18,
  MISIONES: 19,
  NEUQUEN: 20,
  LA_PAMPA: 21,
  RIO_NEGRO: 22,
  SANTA_CRUZ: 23,
  TIERRA_DEL_FUEGO: 24,
} as const;

// Tipos de persona
export const TIPOS_PERSONA = {
  FISICA: 1,
  JURIDICA: 2,
} as const; 