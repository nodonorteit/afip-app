// Servicio para consultar datos de AFIP
// Basado en los Web Services de AFIP

export interface DatosAFIP {
  cuit: string;
  razonSocial?: string;
  nombre?: string;
  apellido?: string;
  tipoPersona: 'FISICA' | 'JURIDICA';
  condicionImpositiva: string;
  domicilio?: string;
  localidad?: string;
  provincia?: string;
  codigoPostal?: string;
  email?: string;
  telefono?: string;
  fechaInscripcion?: string;
  estado?: string;
}

export class AFIPService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/afip') {
    this.baseUrl = baseUrl;
  }

  /**
   * Formatear CUIT con guiones
   */
  formatearCUIT(cuit: string): string {
    // Remover todos los caracteres no numéricos
    const numeros = cuit.replace(/\D/g, '');
    
    if (numeros.length === 11) {
      return `${numeros.slice(0, 2)}-${numeros.slice(2, 10)}-${numeros.slice(10)}`;
    }
    
    return cuit;
  }

  /**
   * Limpiar CUIT (remover guiones)
   */
  limpiarCUIT(cuit: string): string {
    return cuit.replace(/\D/g, '');
  }

  /**
   * Validar formato de CUIT
   */
  validarCUIT(cuit: string): { isValid: boolean; message?: string } {
    const numeros = this.limpiarCUIT(cuit);
    
    if (numeros.length !== 11) {
      return { isValid: false, message: 'El CUIT debe tener 11 dígitos' };
    }

    // Validar dígito verificador
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    
    for (let i = 0; i < 10; i++) {
      suma += parseInt(numeros[i]) * multiplicadores[i];
    }
    
    const resto = suma % 11;
    const digitoVerificador = resto === 0 ? 0 : 11 - resto;
    
    if (parseInt(numeros[10]) !== digitoVerificador) {
      return { isValid: false, message: 'El dígito verificador del CUIT es incorrecto' };
    }

    return { isValid: true };
  }

  /**
   * Consultar datos de AFIP por CUIT
   * Simula la consulta a los Web Services de AFIP
   */
  async consultarDatosAFIP(cuit: string): Promise<DatosAFIP | null> {
    try {
      const cuitLimpio = this.limpiarCUIT(cuit);
      
      // Simular consulta a AFIP
      // En producción, aquí se haría la llamada real a los Web Services de AFIP
      const response = await fetch(`${this.baseUrl}/consultar/${cuitLimpio}`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al consultar datos de AFIP:', error);
      return null;
    }
  }

  /**
   * Consultar datos simulados (para desarrollo)
   */
  async consultarDatosSimulados(cuit: string): Promise<DatosAFIP | null> {
    const cuitLimpio = this.limpiarCUIT(cuit);
    
    // Datos simulados para desarrollo
    const datosSimulados: { [key: string]: DatosAFIP } = {
      '20123456789': {
        cuit: '20123456789',
        razonSocial: 'EMPRESA EJEMPLO S.A.',
        nombre: '',
        apellido: '',
        tipoPersona: 'JURIDICA',
        condicionImpositiva: 'Responsable Inscripto',
        domicilio: 'Av. Corrientes 1234',
        localidad: 'Ciudad Autónoma de Buenos Aires',
        provincia: 'Ciudad Autónoma de Buenos Aires',
        codigoPostal: '1043',
        email: 'contacto@empresaejemplo.com',
        telefono: '011-1234-5678',
        fechaInscripcion: '2020-01-15',
        estado: 'Activo'
      },
      '20345678901': {
        cuit: '20345678901',
        razonSocial: 'COMERCIO XYZ S.R.L.',
        nombre: '',
        apellido: '',
        tipoPersona: 'JURIDICA',
        condicionImpositiva: 'Responsable Inscripto',
        domicilio: 'Calle Florida 567',
        localidad: 'Ciudad Autónoma de Buenos Aires',
        provincia: 'Ciudad Autónoma de Buenos Aires',
        codigoPostal: '1005',
        email: 'info@comercioxyz.com',
        telefono: '011-9876-5432',
        fechaInscripcion: '2019-06-20',
        estado: 'Activo'
      },
      '20123456780': {
        cuit: '20123456780',
        nombre: 'Juan Carlos',
        apellido: 'Pérez González',
        razonSocial: '',
        tipoPersona: 'FISICA',
        condicionImpositiva: 'Monotributo',
        domicilio: 'Av. Santa Fe 789',
        localidad: 'Ciudad Autónoma de Buenos Aires',
        provincia: 'Ciudad Autónoma de Buenos Aires',
        codigoPostal: '1059',
        email: 'juan.perez@email.com',
        telefono: '011-4567-8901',
        fechaInscripcion: '2021-03-10',
        estado: 'Activo'
      },
      '20234567890': {
        cuit: '20234567890',
        nombre: 'María Elena',
        apellido: 'Rodríguez López',
        razonSocial: '',
        tipoPersona: 'FISICA',
        condicionImpositiva: 'Consumidor Final',
        domicilio: 'Calle Lavalle 456',
        localidad: 'Ciudad Autónoma de Buenos Aires',
        provincia: 'Ciudad Autónoma de Buenos Aires',
        codigoPostal: '1047',
        email: 'maria.rodriguez@email.com',
        telefono: '011-2345-6789',
        fechaInscripcion: '2022-08-15',
        estado: 'Activo'
      }
    };

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    return datosSimulados[cuitLimpio] || null;
  }

  /**
   * Determinar tipo de documento según CUIT
   */
  determinarTipoDocumento(cuit: string): number {
    const cuitLimpio = this.limpiarCUIT(cuit);
    
    if (cuitLimpio.length === 11) {
      return 1; // CUIT
    } else if (cuitLimpio.length === 10) {
      return 2; // CUIL
    } else if (cuitLimpio.length === 8) {
      return 10; // DNI
    }
    
    return 1; // Por defecto CUIT
  }

  /**
   * Determinar condición impositiva según datos de AFIP
   */
  determinarCondicionImpositiva(condicionAFIP: string): number {
    const condicion = condicionAFIP.toLowerCase();
    
    if (condicion.includes('responsable inscripto')) {
      return 1;
    } else if (condicion.includes('exento')) {
      return 2;
    } else if (condicion.includes('monotributo')) {
      return 3;
    } else {
      return 4; // Consumidor Final
    }
  }

  /**
   * Determinar tipo de persona según datos de AFIP
   */
  determinarTipoPersona(tipoPersonaAFIP: string): number {
    return tipoPersonaAFIP === 'FISICA' ? 1 : 2;
  }
}

// Instancia global del servicio
export const afipService = new AFIPService(); 