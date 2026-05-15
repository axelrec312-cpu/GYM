'use client'

import { useAuthStore, useTenantStore } from '@/lib/stores'
import type { Rol } from '@/lib/types'

// Hook para verificar permisos
export function usePermisos() {
  const { usuario, hasPermiso, hasRol } = useAuthStore()

  const puedeVer = (modulo: string) => hasPermiso(`${modulo}:ver`) || hasPermiso(`${modulo}:*`)
  const puedeCrear = (modulo: string) => hasPermiso(`${modulo}:crear`) || hasPermiso(`${modulo}:*`)
  const puedeEditar = (modulo: string) => hasPermiso(`${modulo}:editar`) || hasPermiso(`${modulo}:*`)
  const puedeEliminar = (modulo: string) => hasPermiso(`${modulo}:eliminar`) || hasPermiso(`${modulo}:*`)

  const esDueno = () => usuario?.rol === 'dueno'
  const esAdmin = () => usuario?.rol === 'administrador' || usuario?.rol === 'dueno'
  const esRecepcionista = () => usuario?.rol === 'recepcionista'
  const esEntrenador = () => usuario?.rol === 'entrenador'
  const esSocio = () => usuario?.rol === 'socio'

  return {
    usuario,
    hasPermiso,
    hasRol,
    puedeVer,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    esDueno,
    esAdmin,
    esRecepcionista,
    esEntrenador,
    esSocio,
  }
}

// Hook para verificar módulos del tenant
export function useTenant() {
  const { tenant, hasModulo, applyTenantStyles } = useTenantStore()

  return {
    tenant,
    hasModulo,
    applyTenantStyles,
    moneda: tenant.moneda,
    simboloMoneda: tenant.simboloMoneda,
    nombreGimnasio: tenant.nombre,
    logo: tenant.logo,
    colorPrimario: tenant.colorPrimario,
  }
}

// Hook para obtener la navegación según rol y módulos
export function useNavegacion() {
  const { usuario } = useAuthStore()
  const { hasModulo } = useTenantStore()

  const navegacionPorRol: Record<Rol, string[]> = {
    dueno: [
      'dashboard',
      'socios',
      'membresias',
      'control-acceso',
      'agenda',
      'caja',
      'inventario',
      'proveedores',
      'personal',
      'marketing',
      'rutinas',
      'finanzas',
      'equipos',
      'operaciones',
      'reportes',
      'configuracion',
    ],
    administrador: [
      'dashboard',
      'socios',
      'membresias',
      'control-acceso',
      'agenda',
      'caja',
      'inventario',
      'proveedores',
      'personal',
      'marketing',
      'rutinas',
      'equipos',
      'operaciones',
      'reportes',
    ],
    recepcionista: [
      'dashboard',
      'socios',
      'membresias',
      'control-acceso',
      'agenda',
      'caja',
    ],
    entrenador: [
      'dashboard',
      'agenda',
      'rutinas',
      'socios',
    ],
    socio: [
      'mi-perfil',
      'mis-reservas',
      'mi-rutina',
      'mi-progreso',
    ],
  }

  const modulosRequeridos: Record<string, keyof typeof hasModulo extends (k: infer K) => unknown ? K : never> = {
    'control-acceso': 'controlAcceso',
    'agenda': 'agenda',
    'inventario': 'ventasNutricion',
    'proveedores': 'gestionProveedores',
    'marketing': 'puntosLealtad',
    'equipos': 'mantenimientoEquipos',
  }

  const getNavegacionDisponible = () => {
    if (!usuario) return []

    const navegacionRol = navegacionPorRol[usuario.rol] || []

    return navegacionRol.filter((item) => {
      const moduloRequerido = modulosRequeridos[item]
      if (moduloRequerido) {
        return hasModulo(moduloRequerido as keyof ReturnType<typeof useTenantStore>['tenant']['modulos'])
      }
      return true
    })
  }

  return {
    navegacionDisponible: getNavegacionDisponible(),
    navegacionPorRol,
  }
}
