// ==================== TIPOS GLOBALES DEL SISTEMA DE GIMNASIO ====================

// Roles del sistema
export type Rol = 'dueno' | 'administrador' | 'recepcionista' | 'entrenador' | 'socio'

// Estados de membresía
export type EstadoMembresia = 'activo' | 'inactivo' | 'congelado' | 'vencido' | 'pendiente'

// Estados de acceso
export type EstadoAcceso = 'permitido' | 'denegado' | 'vencido' | 'no_encontrado'

// Métodos de pago
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'yape' | 'plin'

// Categorías de productos
export type CategoriaProducto = 'suplementos' | 'bebidas' | 'snacks' | 'accesorios' | 'ropa'

// Estados de stock
export type EstadoStock = 'ok' | 'bajo' | 'critico' | 'agotado'

// Tipos de movimiento de inventario
export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste' | 'venta' | 'devolucion'

// Plan de suscripción del tenant
export type PlanSuscripcion = 'basico' | 'profesional' | 'enterprise'

// ==================== INTERFACES ====================

// Configuración del Tenant (Gimnasio)
export interface TenantConfig {
  id: string
  slug: string
  nombre: string
  logo: string
  favicon: string
  colorPrimario: string
  colorAcento: string
  moneda: string
  simboloMoneda: string
  idioma: string
  zonaHoraria: string
  pais: string
  modulos: ModulosTenant
  planSuscripcion: PlanSuscripcion
  maxSocios: number
  maxPersonal: number
}

export interface ModulosTenant {
  controlAcceso: boolean
  agenda: boolean
  entrenamientoPersonal: boolean
  ventasNutricion: boolean
  gestionProveedores: boolean
  comisiones: boolean
  puntosLealtad: boolean
  botWhatsapp: boolean
  mantenimientoEquipos: boolean
  multiSede: boolean
}

// Usuario del sistema
export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  avatar?: string
  rol: Rol
  tenantId: string
  permisos: string[]
  activo: boolean
  ultimoAcceso?: Date
  createdAt: Date
  updatedAt: Date
}

// Socio del gimnasio
export interface Socio {
  id: string
  tenantId: string
  codigo: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaNacimiento: Date
  genero: 'masculino' | 'femenino' | 'otro'
  direccion?: string
  avatar?: string
  contactoEmergencia: ContactoEmergencia
  objetivosFisicos: string[]
  restriccionesMedicas?: string
  qrCode: string
  membresiaActual?: Membresia
  estado: EstadoMembresia
  fechaRegistro: Date
  ultimaVisita?: Date
  puntosLealtad: number
  notas?: string
  createdAt: Date
  updatedAt: Date
}

export interface ContactoEmergencia {
  nombre: string
  telefono: string
  relacion: string
}

// Membresía
export interface Membresia {
  id: string
  socioId: string
  planId: string
  plan: PlanMembresia
  fechaInicio: Date
  fechaFin: Date
  estado: EstadoMembresia
  diasCongelados: number
  renovacionAutomatica: boolean
  precio: number
  descuento?: number
  metodoPago: MetodoPago
  createdAt: Date
  updatedAt: Date
}

// Plan de membresía
export interface PlanMembresia {
  id: string
  tenantId: string
  nombre: string
  descripcion: string
  duracionDias: number
  precio: number
  caracteristicas: string[]
  incluyeClases: boolean
  incluyeEntrenadorPersonal: boolean
  maxVisitasDiarias: number
  activo: boolean
  orden: number
  createdAt: Date
  updatedAt: Date
}

// Registro de acceso
export interface RegistroAcceso {
  id: string
  socioId: string
  socio: Socio
  tenantId: string
  fechaHora: Date
  tipo: 'entrada' | 'salida'
  estado: EstadoAcceso
  metodo: 'qr' | 'codigo' | 'huella' | 'tarjeta' | 'manual'
  notas?: string
}

// Producto
export interface Producto {
  id: string
  tenantId: string
  sku: string
  nombre: string
  descripcion?: string
  categoria: CategoriaProducto
  costo: number
  precio: number
  margen: number
  stock: number
  stockMinimo: number
  stockMaximo: number
  estadoStock: EstadoStock
  fechaVencimiento?: Date
  proveedorId?: string
  imagen?: string
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

// Venta
export interface Venta {
  id: string
  tenantId: string
  socioId?: string
  socio?: Socio
  usuarioId: string
  usuario: Usuario
  items: ItemVenta[]
  subtotal: number
  descuento: number
  total: number
  metodoPago: MetodoPago
  efectivoRecibido?: number
  vuelto?: number
  fecha: Date
  numeroComprobante: string
  createdAt: Date
}

export interface ItemVenta {
  id: string
  productoId: string
  producto: Producto
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// Pago
export interface Pago {
  id: string
  tenantId: string
  socioId: string
  concepto: 'membresia' | 'servicio' | 'producto' | 'otro'
  descripcion: string
  monto: number
  metodoPago: MetodoPago
  fecha: Date
  comprobante?: string
  createdAt: Date
}

// Entrenador
export interface Entrenador {
  id: string
  usuarioId: string
  usuario: Usuario
  tenantId: string
  especialidades: string[]
  certificaciones: string[]
  horario: HorarioSemanal
  comisionPorcentaje: number
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HorarioSemanal {
  lunes: RangoHorario[]
  martes: RangoHorario[]
  miercoles: RangoHorario[]
  jueves: RangoHorario[]
  viernes: RangoHorario[]
  sabado: RangoHorario[]
  domingo: RangoHorario[]
}

export interface RangoHorario {
  inicio: string
  fin: string
}

// Clase
export interface Clase {
  id: string
  tenantId: string
  nombre: string
  descripcion?: string
  entrenadorId: string
  entrenador: Entrenador
  fechaHora: Date
  duracionMinutos: number
  capacidadMaxima: number
  inscritos: number
  ubicacion?: string
  tipo: 'grupal' | 'personal'
  activa: boolean
}

// Reserva
export interface Reserva {
  id: string
  socioId: string
  socio: Socio
  claseId: string
  clase: Clase
  estado: 'confirmada' | 'cancelada' | 'asistio' | 'no_asistio'
  fechaReserva: Date
  notas?: string
}

// Rutina
export interface Rutina {
  id: string
  tenantId: string
  nombre: string
  descripcion?: string
  dias: DiaRutina[]
  objetivo: string
  nivel: 'principiante' | 'intermedio' | 'avanzado'
  duracionSemanas: number
  createdAt: Date
  updatedAt: Date
}

export interface DiaRutina {
  dia: number
  nombre: string
  ejercicios: EjercicioRutina[]
}

export interface EjercicioRutina {
  id: string
  nombre: string
  series: number
  repeticiones: string
  descansoSegundos: number
  notas?: string
  videoUrl?: string
}

// Progreso del socio
export interface ProgresoSocio {
  id: string
  socioId: string
  fecha: Date
  peso?: number
  altura?: number
  grasaCorporal?: number
  masaMuscular?: number
  medidas: MedidasCorporales
  fotos?: string[]
  notas?: string
  entrenadorId?: string
}

export interface MedidasCorporales {
  pecho?: number
  cintura?: number
  cadera?: number
  brazoIzquierdo?: number
  brazoDerecho?: number
  musloIzquierdo?: number
  musloDerecho?: number
  pantorrillaIzquierda?: number
  pantorrillaDerecha?: number
}

// Proveedor
export interface Proveedor {
  id: string
  tenantId: string
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion?: string
  productos: string[]
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

// Orden de compra
export interface OrdenCompra {
  id: string
  tenantId: string
  proveedorId: string
  proveedor: Proveedor
  items: ItemOrdenCompra[]
  subtotal: number
  impuestos: number
  total: number
  estado: 'pendiente' | 'enviada' | 'recibida' | 'cancelada'
  fechaPedido: Date
  fechaRecepcion?: Date
  notas?: string
  createdAt: Date
}

export interface ItemOrdenCompra {
  productoId: string
  producto: Producto
  cantidad: number
  costoUnitario: number
  subtotal: number
}

// Equipo
export interface Equipo {
  id: string
  tenantId: string
  nombre: string
  tipo: string
  marca?: string
  modelo?: string
  numeroSerie?: string
  fechaCompra?: Date
  precioCompra?: number
  ubicacion?: string
  estado: 'operativo' | 'en_mantenimiento' | 'fuera_de_servicio'
  ultimoMantenimiento?: Date
  proximoMantenimiento?: Date
  imagen?: string
  createdAt: Date
  updatedAt: Date
}

// Mantenimiento
export interface Mantenimiento {
  id: string
  equipoId: string
  equipo: Equipo
  tipo: 'preventivo' | 'correctivo'
  descripcion: string
  costo: number
  fecha: Date
  tecnico?: string
  notas?: string
  createdAt: Date
}

// Gasto
export interface Gasto {
  id: string
  tenantId: string
  categoria: 'alquiler' | 'sueldos' | 'servicios' | 'mantenimiento' | 'inventario' | 'publicidad' | 'limpieza' | 'otros'
  descripcion: string
  monto: number
  fecha: Date
  comprobante?: string
  usuarioId: string
  createdAt: Date
}

// Campaña de marketing
export interface Campana {
  id: string
  tenantId: string
  nombre: string
  tipo: 'email' | 'whatsapp' | 'sms'
  segmento: 'todos' | 'nuevos' | 'inactivos' | 'vencidos' | 'cumpleanos'
  mensaje: string
  fechaProgramada?: Date
  estado: 'borrador' | 'programada' | 'enviada'
  enviados: number
  abiertos: number
  clicks: number
  createdAt: Date
}

// KPIs del Dashboard
export interface DashboardKPIs {
  sociosActivos: number
  sociosTendencia: number
  ingresosHoy: number
  ingresosTendencia: number
  renovacionesPendientes: number
  alertasStock: number
  asistenciaHoy: number
  asistenciaTendencia: number
}

// Reporte financiero
export interface ReporteFinanciero {
  ingresosMembresías: number
  ingresosVentas: number
  ingresosServicios: number
  totalIngresos: number
  totalGastos: number
  utilidadNeta: number
  periodo: {
    inicio: Date
    fin: Date
  }
}

// Checklist de operaciones
export interface Checklist {
  id: string
  tenantId: string
  tipo: 'apertura' | 'cierre' | 'limpieza' | 'equipos'
  items: ItemChecklist[]
  fecha: Date
  usuarioId: string
  completado: boolean
  createdAt: Date
}

export interface ItemChecklist {
  id: string
  descripcion: string
  completado: boolean
  hora?: string
  notas?: string
}

// Notificación
export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  leida: boolean
  fecha: Date
  accionUrl?: string
}
