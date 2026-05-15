// Constantes globales de la aplicación

// Estados de membresía con colores
export const ESTADOS_MEMBRESIA = {
  activo: { label: 'Activo', color: 'bg-emerald-500/20 text-emerald-500', icon: 'CheckCircle' },
  inactivo: { label: 'Inactivo', color: 'bg-zinc-500/20 text-zinc-400', icon: 'MinusCircle' },
  congelado: { label: 'Congelado', color: 'bg-blue-500/20 text-blue-400', icon: 'Snowflake' },
  vencido: { label: 'Vencido', color: 'bg-red-500/20 text-red-400', icon: 'AlertCircle' },
  pendiente: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-400', icon: 'Clock' },
} as const

// Estados de stock con colores
export const ESTADOS_STOCK = {
  ok: { label: 'Stock OK', color: 'bg-emerald-500/20 text-emerald-500' },
  bajo: { label: 'Stock Bajo', color: 'bg-amber-500/20 text-amber-400' },
  critico: { label: 'Crítico', color: 'bg-red-500/20 text-red-400' },
  agotado: { label: 'Agotado', color: 'bg-zinc-500/20 text-zinc-400' },
} as const

// Métodos de pago
export const METODOS_PAGO = {
  efectivo: { label: 'Efectivo', icon: 'Banknote' },
  tarjeta: { label: 'Tarjeta', icon: 'CreditCard' },
  transferencia: { label: 'Transferencia', icon: 'Building2' },
  yape: { label: 'Yape', icon: 'Smartphone' },
  plin: { label: 'Plin', icon: 'Smartphone' },
} as const

// Categorías de productos
export const CATEGORIAS_PRODUCTO = {
  suplementos: { label: 'Suplementos', icon: 'Pill', color: 'bg-purple-500/20 text-purple-400' },
  bebidas: { label: 'Bebidas', icon: 'Cup', color: 'bg-blue-500/20 text-blue-400' },
  snacks: { label: 'Snacks', icon: 'Cookie', color: 'bg-amber-500/20 text-amber-400' },
  accesorios: { label: 'Accesorios', icon: 'ShoppingBag', color: 'bg-emerald-500/20 text-emerald-400' },
  ropa: { label: 'Ropa', icon: 'Shirt', color: 'bg-pink-500/20 text-pink-400' },
} as const

// Roles y sus permisos
export const ROLES_PERMISOS = {
  dueno: {
    label: 'Dueño',
    descripcion: 'Acceso completo a todos los módulos',
    permisos: ['*'],
  },
  administrador: {
    label: 'Administrador',
    descripcion: 'Acceso a todos los módulos excepto finanzas detalladas',
    permisos: [
      'socios:*',
      'membresias:*',
      'control_acceso:*',
      'agenda:*',
      'caja:*',
      'inventario:*',
      'proveedores:*',
      'personal:ver',
      'marketing:*',
      'reportes:ver',
    ],
  },
  recepcionista: {
    label: 'Recepcionista',
    descripcion: 'Gestión de socios, acceso y caja',
    permisos: [
      'socios:ver',
      'socios:crear',
      'socios:editar',
      'membresias:ver',
      'membresias:crear',
      'control_acceso:*',
      'agenda:ver',
      'agenda:reservar',
      'caja:*',
    ],
  },
  entrenador: {
    label: 'Entrenador',
    descripcion: 'Gestión de rutinas y progreso de socios asignados',
    permisos: [
      'socios:ver',
      'rutinas:*',
      'progreso:*',
      'agenda:ver_propio',
      'clases:impartir',
    ],
  },
  socio: {
    label: 'Socio',
    descripcion: 'Portal de socio con acceso a su perfil',
    permisos: [
      'perfil:ver_propio',
      'perfil:editar_propio',
      'agenda:reservar',
      'rutinas:ver_propio',
      'progreso:ver_propio',
    ],
  },
} as const

// Días de la semana
export const DIAS_SEMANA = [
  { key: 'lunes', label: 'Lunes', short: 'Lun' },
  { key: 'martes', label: 'Martes', short: 'Mar' },
  { key: 'miercoles', label: 'Miércoles', short: 'Mié' },
  { key: 'jueves', label: 'Jueves', short: 'Jue' },
  { key: 'viernes', label: 'Viernes', short: 'Vie' },
  { key: 'sabado', label: 'Sábado', short: 'Sáb' },
  { key: 'domingo', label: 'Domingo', short: 'Dom' },
] as const

// Objetivos físicos comunes
export const OBJETIVOS_FISICOS = [
  'Perder peso',
  'Ganar masa muscular',
  'Mejorar resistencia',
  'Tonificar',
  'Mejorar flexibilidad',
  'Rehabilitación',
  'Salud general',
  'Preparación deportiva',
] as const

// Categorías de gastos
export const CATEGORIAS_GASTOS = {
  alquiler: { label: 'Alquiler', icon: 'Building' },
  sueldos: { label: 'Sueldos', icon: 'Users' },
  servicios: { label: 'Servicios', icon: 'Zap' },
  mantenimiento: { label: 'Mantenimiento', icon: 'Wrench' },
  inventario: { label: 'Inventario', icon: 'Package' },
  publicidad: { label: 'Publicidad', icon: 'Megaphone' },
  limpieza: { label: 'Limpieza', icon: 'Sparkles' },
  otros: { label: 'Otros', icon: 'MoreHorizontal' },
} as const

// Configuración de paginación
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const

// Configuración de alertas
export const ALERTAS = {
  stockBajoUmbral: 10, // unidades
  stockCriticoUmbral: 5, // unidades
  vencimientoProximoDias: 30, // días
  membresiaProximaVencerDias: 7, // días
} as const
