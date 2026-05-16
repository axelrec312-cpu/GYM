'use client'

import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { StatsCard, PageHeader, SectionCard, QuickAction } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  DollarSign,
  Clock,
  Package,
  TrendingUp,
  UserPlus,
  CreditCard,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  CalendarClock,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { 
  dashboardKPIs, 
  ingresosUltimos30Dias, 
  asistenciaUltimas2Semanas,
  desglosIngresos,
  productosTopVentas,
  sociosProximosVencer,
  registrosAcceso
} from '@/lib/mock-data'
import { formatMoneda, formatHora, formatFechaCorta, obtenerIniciales } from '@/lib/helpers'
import { useTenantStore } from '@/lib/stores'
import Link from 'next/link'

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DashboardPage() {
  const { tenant } = useTenantStore()

  return (
    <DashboardLayout>
      <PageHeader
        titulo="Dashboard"
        descripcion={`Bienvenido a ${tenant.nombre}. Aquí tienes un resumen de tu negocio.`}
        acciones={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/reportes">Ver reportes</Link>
            </Button>
            <Button asChild>
              <Link href="/socios/nuevo">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo socio
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPIs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          titulo="Socios Activos"
          valor={dashboardKPIs.sociosActivos.toLocaleString()}
          tendencia={{ valor: dashboardKPIs.sociosTendencia, direccion: 'up' }}
          descripcion="vs. mes anterior"
          icono={Users}
        />
        <StatsCard
          titulo="Ingresos Hoy"
          valor={formatMoneda(dashboardKPIs.ingresosHoy)}
          tendencia={{ valor: dashboardKPIs.ingresosTendencia, direccion: 'up' }}
          descripcion="vs. ayer"
          icono={DollarSign}
        />
        <StatsCard
          titulo="Renovaciones Pendientes"
          valor={dashboardKPIs.renovacionesPendientes}
          descripcion="próximos 7 días"
          icono={Clock}
        />
        <StatsCard
          titulo="Alertas de Stock"
          valor={dashboardKPIs.alertasStock}
          descripcion="productos con stock bajo"
          icono={Package}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickAction icono={UserPlus} label="Nuevo Socio" href="/socios/nuevo" variant="primary" />
          <QuickAction icono={CreditCard} label="Cobrar Membresía" href="/membresias" />
          <QuickAction icono={ShoppingCart} label="Punto de Venta" href="/caja" />
          <QuickAction icono={Package} label="Ver Inventario" href="/inventario" />
          <QuickAction icono={CalendarClock} label="Agenda" href="/agenda" />
          <QuickAction icono={TrendingUp} label="Reportes" href="/reportes" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Ingresos Chart */}
        <SectionCard
          titulo="Ingresos Últimos 30 Días"
          descripcion="Comparativa entre membresías y ventas de nutrición"
        >
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingresosUltimos30Dias.slice(-15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => formatFechaCorta(value)}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${tenant.simboloMoneda}${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => formatFechaCorta(value)}
                  formatter={(value: number) => [formatMoneda(value), '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="membresias" 
                  name="Membresías"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="nutricion" 
                  name="Nutrición"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Asistencia Chart */}
        <SectionCard
          titulo="Asistencia Diaria"
          descripcion="Últimas 2 semanas"
        >
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={asistenciaUltimas2Semanas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => formatFechaCorta(value)}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => formatFechaCorta(value)}
                />
                <Bar 
                  dataKey="asistencia" 
                  name="Asistencia"
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Desglose de Ingresos */}
        <SectionCard titulo="Desglose de Ingresos" descripcion="Este mes">
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={desglosIngresos}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="valor"
                  nameKey="categoria"
                >
                  {desglosIngresos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatMoneda(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {desglosIngresos.map((item, index) => (
              <div key={item.categoria} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: CHART_COLORS[index] }}
                  />
                  <span className="text-muted-foreground">{item.categoria}</span>
                </div>
                <span className="font-medium">{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Productos */}
        <SectionCard 
          titulo="Top Productos" 
          descripcion="Más vendidos este mes"
          acciones={
            <Button variant="ghost" size="sm" asChild>
              <Link href="/inventario">Ver todo</Link>
            </Button>
          }
        >
          <div className="space-y-4 mt-4">
            {productosTopVentas.map((producto, index) => (
              <div key={producto.nombre} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{producto.nombre}</p>
                    <p className="text-xs text-muted-foreground">{producto.vendidos} unidades</p>
                  </div>
                </div>
                <span className="font-medium text-sm">{formatMoneda(producto.ingresos)}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Membresías por vencer + Accesos recientes */}
        <div className="space-y-6">
          {/* Membresías por vencer */}
          <SectionCard 
            titulo="Membresías por Vencer" 
            descripcion="Próximos 7 días"
            acciones={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/membresias">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3 mt-4">
              {sociosProximosVencer.slice(0, 4).map((socio) => (
                <div key={socio.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {obtenerIniciales(socio.nombre, socio.apellido)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{socio.nombre} {socio.apellido}</p>
                      <p className="text-xs text-muted-foreground">Plan Premium</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                    5 días
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Últimos accesos */}
          <SectionCard 
            titulo="Accesos Recientes" 
            descripcion="Hoy"
            acciones={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/acceso">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          >
            <div className="space-y-3 mt-4">
              {registrosAcceso.slice(0, 4).map((registro) => (
                <div key={registro.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-1 ${
                      registro.estado === 'permitido' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {registro.estado === 'permitido' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {registro.socio.nombre} {registro.socio.apellido}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatHora(registro.fechaHora)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={registro.estado === 'permitido' 
                      ? 'text-emerald-500 border-emerald-500/30' 
                      : 'text-red-500 border-red-500/30'
                    }
                  >
                    {registro.estado === 'permitido' ? 'Entrada' : 'Denegado'}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
