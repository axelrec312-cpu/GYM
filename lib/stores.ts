import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Usuario, Rol, Notificacion } from './types'

// ==================== AUTH STORE ====================
interface AuthState {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUsuario: (usuario: Usuario | null) => void
  setToken: (token: string | null) => void
  login: (usuario: Usuario, token: string) => void
  logout: () => void
  hasPermiso: (permiso: string) => boolean
  hasRol: (roles: Rol[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUsuario: (usuario) =>
        set((state) => {
          state.usuario = usuario
          state.isAuthenticated = !!usuario
        }),

      setToken: (token) =>
        set((state) => {
          state.token = token
        }),

      login: (usuario, token) =>
        set((state) => {
          state.usuario = usuario
          state.token = token
          state.isAuthenticated = true
          state.isLoading = false
        }),

      logout: () =>
        set((state) => {
          state.usuario = null
          state.token = null
          state.isAuthenticated = false
        }),

      hasPermiso: (permiso: string) => {
        const { usuario } = get()
        if (!usuario) return false
        if (usuario.rol === 'dueno') return true
        return usuario.permisos.includes(permiso) || usuario.permisos.includes('*')
      },

      hasRol: (roles: Rol[]) => {
        const { usuario } = get()
        if (!usuario) return false
        return roles.includes(usuario.rol)
      },
    })),
    {
      name: 'gym-auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)

// ==================== THEME STORE ====================
type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',

      setTheme: (theme) =>
        set((state) => {
          state.theme = theme
          if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            state.resolvedTheme = prefersDark ? 'dark' : 'light'
          } else {
            state.resolvedTheme = theme
          }
          // Actualizar clase en HTML
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(state.resolvedTheme)
          }
        }),

      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      },
    })),
    {
      name: 'gym-theme-storage',
    }
  )
)

// ==================== UI STORE ====================
interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  activeModal: string | null
  modalData: Record<string, unknown> | null
  notificaciones: Notificacion[]
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openModal: (modalId: string, data?: Record<string, unknown>) => void
  closeModal: () => void
  addNotificacion: (notificacion: Omit<Notificacion, 'id' | 'fecha' | 'leida'>) => void
  markNotificacionAsRead: (id: string) => void
  clearNotificaciones: () => void
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    sidebarOpen: true,
    sidebarCollapsed: false,
    activeModal: null,
    modalData: null,
    notificaciones: [],

    setSidebarOpen: (open) =>
      set((state) => {
        state.sidebarOpen = open
      }),

    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),

    setSidebarCollapsed: (collapsed) =>
      set((state) => {
        state.sidebarCollapsed = collapsed
      }),

    openModal: (modalId, data) =>
      set((state) => {
        state.activeModal = modalId
        state.modalData = data ?? null
      }),

    closeModal: () =>
      set((state) => {
        state.activeModal = null
        state.modalData = null
      }),

    addNotificacion: (notificacion) =>
      set((state) => {
        state.notificaciones.unshift({
          ...notificacion,
          id: crypto.randomUUID(),
          fecha: new Date(),
          leida: false,
        })
      }),

    markNotificacionAsRead: (id) =>
      set((state) => {
        const notif = state.notificaciones.find((n) => n.id === id)
        if (notif) {
          notif.leida = true
        }
      }),

    clearNotificaciones: () =>
      set((state) => {
        state.notificaciones = []
      }),
  }))
)

// ==================== TENANT STORE ====================
import type { TenantConfig } from './types'
import { defaultTenantConfig } from './tenant-config'

interface TenantState {
  tenant: TenantConfig
  isLoading: boolean
  setTenant: (tenant: TenantConfig) => void
  updateTenant: (updates: Partial<TenantConfig>) => void
  applyTenantStyles: () => void
  hasModulo: (modulo: keyof TenantConfig['modulos']) => boolean
}

export const useTenantStore = create<TenantState>()(
  immer((set, get) => ({
    tenant: defaultTenantConfig,
    isLoading: false,

    setTenant: (tenant) =>
      set((state) => {
        state.tenant = tenant
      }),

    updateTenant: (updates) =>
      set((state) => {
        Object.assign(state.tenant, updates)
      }),

    applyTenantStyles: () => {
      const { tenant } = get()
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--color-primary-tenant', tenant.colorPrimario)
        document.documentElement.style.setProperty('--color-accent-tenant', tenant.colorAcento)
      }
    },

    hasModulo: (modulo) => {
      const { tenant } = get()
      return tenant.modulos[modulo]
    },
  }))
)

// ==================== POS STORE (Punto de Venta) ====================
import type { Producto, ItemVenta, Socio, MetodoPago } from './types'

interface POSState {
  items: ItemVenta[]
  socioSeleccionado: Socio | null
  metodoPago: MetodoPago
  descuentoGlobal: number
  efectivoRecibido: number
  addItem: (producto: Producto, cantidad?: number) => void
  updateItemQuantity: (productoId: string, cantidad: number) => void
  removeItem: (productoId: string) => void
  clearCart: () => void
  setSocio: (socio: Socio | null) => void
  setMetodoPago: (metodo: MetodoPago) => void
  setDescuento: (descuento: number) => void
  setEfectivoRecibido: (monto: number) => void
  getSubtotal: () => number
  getTotal: () => number
  getVuelto: () => number
}

export const usePOSStore = create<POSState>()(
  immer((set, get) => ({
    items: [],
    socioSeleccionado: null,
    metodoPago: 'efectivo',
    descuentoGlobal: 0,
    efectivoRecibido: 0,

    addItem: (producto, cantidad = 1) =>
      set((state) => {
        const existingItem = state.items.find((item) => item.productoId === producto.id)
        if (existingItem) {
          existingItem.cantidad += cantidad
          existingItem.subtotal = existingItem.cantidad * existingItem.precioUnitario
        } else {
          state.items.push({
            id: crypto.randomUUID(),
            productoId: producto.id,
            producto,
            cantidad,
            precioUnitario: producto.precio,
            subtotal: cantidad * producto.precio,
          })
        }
      }),

    updateItemQuantity: (productoId, cantidad) =>
      set((state) => {
        const item = state.items.find((i) => i.productoId === productoId)
        if (item) {
          item.cantidad = cantidad
          item.subtotal = cantidad * item.precioUnitario
        }
      }),

    removeItem: (productoId) =>
      set((state) => {
        state.items = state.items.filter((i) => i.productoId !== productoId)
      }),

    clearCart: () =>
      set((state) => {
        state.items = []
        state.socioSeleccionado = null
        state.descuentoGlobal = 0
        state.efectivoRecibido = 0
      }),

    setSocio: (socio) =>
      set((state) => {
        state.socioSeleccionado = socio
      }),

    setMetodoPago: (metodo) =>
      set((state) => {
        state.metodoPago = metodo
      }),

    setDescuento: (descuento) =>
      set((state) => {
        state.descuentoGlobal = descuento
      }),

    setEfectivoRecibido: (monto) =>
      set((state) => {
        state.efectivoRecibido = monto
      }),

    getSubtotal: () => {
      const { items } = get()
      return items.reduce((acc, item) => acc + item.subtotal, 0)
    },

    getTotal: () => {
      const { descuentoGlobal } = get()
      const subtotal = get().getSubtotal()
      return subtotal - descuentoGlobal
    },

    getVuelto: () => {
      const { efectivoRecibido, metodoPago } = get()
      if (metodoPago !== 'efectivo') return 0
      const total = get().getTotal()
      return Math.max(0, efectivoRecibido - total)
    },
  }))
)
