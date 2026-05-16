import type { TenantConfig } from './types'

// Configuración por defecto del Tenant
export const defaultTenantConfig: TenantConfig = {
  id: 'gym-001',
  slug: 'power-fitness',
  nombre: 'Power Fitness Gym',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  colorPrimario: '#2563EB', // Azul eléctrico
  colorAcento: '#10B981', // Verde esmeralda
  moneda: 'PEN',
  simboloMoneda: 'S/',
  idioma: 'es-PE',
  zonaHoraria: 'America/Lima',
  pais: 'PE',
  modulos: {
    controlAcceso: true,
    agenda: true,
    entrenamientoPersonal: true,
    ventasNutricion: true,
    gestionProveedores: true,
    comisiones: true,
    puntosLealtad: true,
    botWhatsapp: false,
    mantenimientoEquipos: true,
    multiSede: false,
  },
  planSuscripcion: 'profesional',
  maxSocios: 500,
  maxPersonal: 20,
}

// Monedas soportadas
export const monedasSoportadas = [
  { codigo: 'PEN', simbolo: 'S/', nombre: 'Sol Peruano' },
  { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense' },
  { codigo: 'MXN', simbolo: '$', nombre: 'Peso Mexicano' },
  { codigo: 'COP', simbolo: '$', nombre: 'Peso Colombiano' },
  { codigo: 'ARS', simbolo: '$', nombre: 'Peso Argentino' },
  { codigo: 'CLP', simbolo: '$', nombre: 'Peso Chileno' },
  { codigo: 'EUR', simbolo: '€', nombre: 'Euro' },
] as const

// Países soportados
export const paisesSoportados = [
  { codigo: 'PE', nombre: 'Perú', zonaHoraria: 'America/Lima' },
  { codigo: 'MX', nombre: 'México', zonaHoraria: 'America/Mexico_City' },
  { codigo: 'CO', nombre: 'Colombia', zonaHoraria: 'America/Bogota' },
  { codigo: 'AR', nombre: 'Argentina', zonaHoraria: 'America/Argentina/Buenos_Aires' },
  { codigo: 'CL', nombre: 'Chile', zonaHoraria: 'America/Santiago' },
  { codigo: 'EC', nombre: 'Ecuador', zonaHoraria: 'America/Guayaquil' },
  { codigo: 'US', nombre: 'Estados Unidos', zonaHoraria: 'America/New_York' },
] as const

// Descripción de módulos
export const modulosDescripcion = {
  controlAcceso: {
    nombre: 'Control de Acceso',
    descripcion: 'Gestión de entradas con QR, código o tarjeta',
    icono: 'Shield',
  },
  agenda: {
    nombre: 'Agenda',
    descripcion: 'Reserva de clases y horarios',
    icono: 'Calendar',
  },
  entrenamientoPersonal: {
    nombre: 'Entrenamiento Personal',
    descripcion: 'Gestión de sesiones personalizadas',
    icono: 'Dumbbell',
  },
  ventasNutricion: {
    nombre: 'Ventas de Nutrición',
    descripcion: 'Tienda de suplementos y accesorios',
    icono: 'ShoppingBag',
  },
  gestionProveedores: {
    nombre: 'Gestión de Proveedores',
    descripcion: 'Control de compras y reabastecimiento',
    icono: 'Truck',
  },
  comisiones: {
    nombre: 'Comisiones',
    descripcion: 'Cálculo automático de comisiones',
    icono: 'DollarSign',
  },
  puntosLealtad: {
    nombre: 'Programa de Lealtad',
    descripcion: 'Sistema de puntos y recompensas',
    icono: 'Award',
  },
  botWhatsapp: {
    nombre: 'Bot de WhatsApp',
    descripcion: 'Atención automatizada por WhatsApp',
    icono: 'MessageSquare',
  },
  mantenimientoEquipos: {
    nombre: 'Mantenimiento de Equipos',
    descripcion: 'Control de mantenimiento preventivo',
    icono: 'Wrench',
  },
  multiSede: {
    nombre: 'Multi-sede',
    descripcion: 'Gestión de múltiples locales',
    icono: 'Building',
  },
} as const

// Límites por plan de suscripción
export const limitesPorPlan = {
  basico: {
    maxSocios: 100,
    maxPersonal: 5,
    modulos: ['controlAcceso', 'agenda'],
  },
  profesional: {
    maxSocios: 500,
    maxPersonal: 20,
    modulos: [
      'controlAcceso',
      'agenda',
      'entrenamientoPersonal',
      'ventasNutricion',
      'gestionProveedores',
      'comisiones',
      'puntosLealtad',
      'mantenimientoEquipos',
    ],
  },
  enterprise: {
    maxSocios: -1, // ilimitado
    maxPersonal: -1, // ilimitado
    modulos: [
      'controlAcceso',
      'agenda',
      'entrenamientoPersonal',
      'ventasNutricion',
      'gestionProveedores',
      'comisiones',
      'puntosLealtad',
      'botWhatsapp',
      'mantenimientoEquipos',
      'multiSede',
    ],
  },
} as const
