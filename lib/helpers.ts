import { format, formatDistanceToNow, differenceInDays, isAfter, isBefore, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTenantStore } from './stores'

// ==================== FORMATO DE MONEDA ====================
export function formatMoneda(
  monto: number,
  moneda?: string,
  simbolo?: string
): string {
  const tenant = useTenantStore.getState().tenant
  const currencyCode = moneda ?? tenant.moneda
  const currencySymbol = simbolo ?? tenant.simboloMoneda
  
  return `${currencySymbol} ${monto.toFixed(2)}`
}

export function formatMonedaCompacta(monto: number): string {
  const tenant = useTenantStore.getState().tenant
  const simbolo = tenant.simboloMoneda
  
  if (monto >= 1000000) {
    return `${simbolo}${(monto / 1000000).toFixed(1)}M`
  }
  if (monto >= 1000) {
    return `${simbolo}${(monto / 1000).toFixed(1)}K`
  }
  return `${simbolo}${monto.toFixed(0)}`
}

// ==================== FORMATO DE FECHAS ====================
export function formatFecha(fecha: Date | string, formato: string = 'dd/MM/yyyy'): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(date, formato, { locale: es })
}

export function formatFechaHora(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(date, "dd/MM/yyyy HH:mm", { locale: es })
}

export function formatFechaCorta(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(date, "dd MMM", { locale: es })
}

export function formatFechaLarga(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatHora(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(date, 'HH:mm', { locale: es })
}

export function formatTiempoRelativo(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

export function diasHastaVencimiento(fechaFin: Date | string): number {
  const date = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin
  return differenceInDays(date, new Date())
}

export function estaProximoAVencer(fechaFin: Date | string, diasUmbral: number = 7): boolean {
  const dias = diasHastaVencimiento(fechaFin)
  return dias >= 0 && dias <= diasUmbral
}

export function estaVencido(fechaFin: Date | string): boolean {
  const date = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin
  return isBefore(date, new Date())
}

// ==================== GENERADORES ====================
export function generarCodigoSocio(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SOC-${timestamp}-${random}`
}

export function generarNumeroComprobante(): string {
  const fecha = format(new Date(), 'yyyyMMdd')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `VTA-${fecha}-${random}`
}

export function generarSKU(categoria: string, nombre: string): string {
  const cat = categoria.substring(0, 3).toUpperCase()
  const nom = nombre.substring(0, 3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${cat}-${nom}-${random}`
}

// ==================== CÁLCULOS ====================
export function calcularMargen(costo: number, precio: number): number {
  if (costo === 0) return 0
  return ((precio - costo) / precio) * 100
}

export function calcularPrecioConMargen(costo: number, margenPorcentaje: number): number {
  return costo / (1 - margenPorcentaje / 100)
}

export function calcularEdad(fechaNacimiento: Date | string): number {
  const birthDate = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// ==================== VALIDADORES ====================
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validarTelefono(telefono: string): boolean {
  // Acepta formatos: +51999999999, 999999999, 999-999-999
  const regex = /^(\+?\d{1,3})?[\s.-]?\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}$/
  return regex.test(telefono.replace(/\s/g, ''))
}

export function validarDNI(dni: string): boolean {
  // DNI peruano: 8 dígitos
  return /^\d{8}$/.test(dni)
}

// ==================== FORMATEO DE TEXTO ====================
export function capitalizarPalabras(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function obtenerIniciales(nombre: string, apellido?: string): string {
  const inicial1 = nombre.charAt(0).toUpperCase()
  const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : nombre.charAt(1)?.toUpperCase() || ''
  return `${inicial1}${inicial2}`
}

export function truncarTexto(texto: string, maxLength: number): string {
  if (texto.length <= maxLength) return texto
  return texto.substring(0, maxLength - 3) + '...'
}

// ==================== COLORES ====================
export function getColorEstadoMembresia(estado: string): string {
  const colores: Record<string, string> = {
    activo: 'bg-emerald-500/20 text-emerald-500',
    inactivo: 'bg-zinc-500/20 text-zinc-400',
    congelado: 'bg-blue-500/20 text-blue-400',
    vencido: 'bg-red-500/20 text-red-400',
    pendiente: 'bg-amber-500/20 text-amber-400',
  }
  return colores[estado] ?? colores.inactivo
}

export function getColorEstadoStock(nivel: number, minimo: number): string {
  const porcentaje = (nivel / minimo) * 100
  if (nivel === 0) return 'bg-zinc-500/20 text-zinc-400'
  if (porcentaje <= 50) return 'bg-red-500/20 text-red-400'
  if (porcentaje <= 100) return 'bg-amber-500/20 text-amber-400'
  return 'bg-emerald-500/20 text-emerald-500'
}

// ==================== TENDENCIAS ====================
export function calcularTendencia(actual: number, anterior: number): { porcentaje: number; direccion: 'up' | 'down' | 'neutral' } {
  if (anterior === 0) return { porcentaje: 0, direccion: 'neutral' }
  const porcentaje = ((actual - anterior) / anterior) * 100
  return {
    porcentaje: Math.abs(porcentaje),
    direccion: porcentaje > 0 ? 'up' : porcentaje < 0 ? 'down' : 'neutral',
  }
}

// ==================== ORDENAMIENTO ====================
export function ordenarPorFecha<T extends { fecha: Date | string }>(items: T[], orden: 'asc' | 'desc' = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const fechaA = typeof a.fecha === 'string' ? new Date(a.fecha) : a.fecha
    const fechaB = typeof b.fecha === 'string' ? new Date(b.fecha) : b.fecha
    return orden === 'desc' 
      ? fechaB.getTime() - fechaA.getTime() 
      : fechaA.getTime() - fechaB.getTime()
  })
}

// ==================== AGRUPAMIENTO ====================
export function agruparPorFecha<T extends { fecha: Date | string }>(items: T[]): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const fecha = typeof item.fecha === 'string' ? new Date(item.fecha) : item.fecha
    const key = format(fecha, 'yyyy-MM-dd')
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

// ==================== EXPORTACIÓN CSV ====================
export function exportarCSV<T extends Record<string, unknown>>(
  datos: T[],
  nombreArchivo: string,
  columnas?: { key: keyof T; label: string }[]
): void {
  if (datos.length === 0) return

  const keys = columnas?.map((c) => c.key) ?? (Object.keys(datos[0]) as (keyof T)[])
  const headers = columnas?.map((c) => c.label) ?? keys.map(String)

  const csvContent = [
    headers.join(','),
    ...datos.map((row) =>
      keys
        .map((key) => {
          const value = row[key]
          const stringValue = value?.toString() ?? ''
          // Escapar comillas y valores con comas
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${nombreArchivo}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
