'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  type LucideIcon 
} from 'lucide-react'

// ==================== STATS CARD ====================
const statsCardVariants = cva(
  'rounded-xl border p-6 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        gradient: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
        outline: 'bg-transparent border-border hover:bg-card/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  titulo: string
  valor: string | number
  descripcion?: string
  tendencia?: {
    valor: number
    direccion: 'up' | 'down' | 'neutral'
  }
  icono?: LucideIcon
  className?: string
  formatoValor?: 'moneda' | 'numero' | 'porcentaje'
}

export function StatsCard({
  titulo,
  valor,
  descripcion,
  tendencia,
  icono: Icono,
  variant,
  className,
}: StatsCardProps) {
  return (
    <div className={cn(statsCardVariants({ variant }), className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="text-3xl font-bold tracking-tight">{valor}</p>
        </div>
        {Icono && (
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icono className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      {(tendencia || descripcion) && (
        <div className="mt-4 flex items-center gap-2">
          {tendencia && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                tendencia.direccion === 'up' && 'bg-emerald-500/10 text-emerald-500',
                tendencia.direccion === 'down' && 'bg-red-500/10 text-red-500',
                tendencia.direccion === 'neutral' && 'bg-zinc-500/10 text-zinc-500'
              )}
            >
              {tendencia.direccion === 'up' && <TrendingUp className="h-3 w-3" />}
              {tendencia.direccion === 'down' && <TrendingDown className="h-3 w-3" />}
              {tendencia.direccion === 'neutral' && <Minus className="h-3 w-3" />}
              {tendencia.valor}%
            </span>
          )}
          {descripcion && (
            <span className="text-xs text-muted-foreground">{descripcion}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== PAGE HEADER ====================
interface PageHeaderProps {
  titulo: string
  descripcion?: string
  acciones?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function PageHeader({ titulo, descripcion, acciones, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{titulo}</h1>
          {descripcion && (
            <p className="mt-1 text-muted-foreground">{descripcion}</p>
          )}
        </div>
        {acciones && <div className="flex items-center gap-3">{acciones}</div>}
      </div>
    </div>
  )
}

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icono?: LucideIcon
  titulo: string
  descripcion?: string
  accion?: React.ReactNode
}

export function EmptyState({ icono: Icono, titulo, descripcion, accion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icono && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icono className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{titulo}</h3>
      {descripcion && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{descripcion}</p>
      )}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  )
}

// ==================== STATUS BADGE ====================
const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        activo: 'bg-emerald-500/10 text-emerald-500',
        inactivo: 'bg-zinc-500/10 text-zinc-400',
        congelado: 'bg-blue-500/10 text-blue-400',
        vencido: 'bg-red-500/10 text-red-400',
        pendiente: 'bg-amber-500/10 text-amber-400',
        ok: 'bg-emerald-500/10 text-emerald-500',
        bajo: 'bg-amber-500/10 text-amber-400',
        critico: 'bg-red-500/10 text-red-400',
        agotado: 'bg-zinc-500/10 text-zinc-400',
      },
    },
    defaultVariants: {
      status: 'activo',
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode
  icono?: LucideIcon
}

export function StatusBadge({ status, children, icono: Icono }: StatusBadgeProps) {
  return (
    <span className={statusBadgeVariants({ status })}>
      {Icono && <Icono className="h-3 w-3" />}
      {children}
    </span>
  )
}

// ==================== DATA TABLE WRAPPER ====================
interface DataTableWrapperProps {
  children: React.ReactNode
  className?: string
}

export function DataTableWrapper({ children, className }: DataTableWrapperProps) {
  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      {children}
    </div>
  )
}

// ==================== SECTION CARD ====================
interface SectionCardProps {
  titulo?: string
  descripcion?: string
  acciones?: React.ReactNode
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function SectionCard({ 
  titulo, 
  descripcion, 
  acciones, 
  children, 
  className,
  noPadding 
}: SectionCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      {(titulo || acciones) && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            {titulo && <h3 className="font-semibold">{titulo}</h3>}
            {descripcion && (
              <p className="text-sm text-muted-foreground">{descripcion}</p>
            )}
          </div>
          {acciones && <div className="flex items-center gap-2">{acciones}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-6')}>{children}</div>
    </div>
  )
}

// ==================== QUICK ACTION BUTTON ====================
interface QuickActionProps {
  icono: LucideIcon
  label: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'primary'
}

export function QuickAction({ icono: Icono, label, onClick, href, variant = 'default' }: QuickActionProps) {
  const Comp = href ? 'a' : 'button'
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:scale-105',
        variant === 'default' && 'bg-card hover:bg-accent',
        variant === 'primary' && 'bg-primary/10 border-primary/20 hover:bg-primary/20'
      )}
    >
      <div className={cn(
        'rounded-lg p-2',
        variant === 'default' && 'bg-muted',
        variant === 'primary' && 'bg-primary/20'
      )}>
        <Icono className={cn(
          'h-5 w-5',
          variant === 'default' && 'text-foreground',
          variant === 'primary' && 'text-primary'
        )} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Comp>
  )
}

// ==================== LOADING SKELETON ====================
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-10 flex-1 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="h-3 w-40 animate-pulse rounded bg-muted" />
    </div>
  )
}
