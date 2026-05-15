'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/helpers'
import { 
  Search, 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  FileText,
  Wallet,
  Building2,
  Users,
  Package,
  Percent
} from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Pie, PieChart as RePieChart, Cell, Area, AreaChart } from 'recharts'

const ingresosMensuales = [
  { mes: 'Ene', membresias: 35000000, productos: 8500000, servicios: 3200000 },
  { mes: 'Feb', membresias: 38000000, productos: 9200000, servicios: 3800000 },
  { mes: 'Mar', membresias: 42000000, productos: 10500000, servicios: 4100000 },
  { mes: 'Abr', membresias: 40000000, productos: 9800000, servicios: 3900000 },
  { mes: 'May', membresias: 45000000, productos: 11200000, servicios: 4500000 },
  { mes: 'Jun', membresias: 48000000, productos: 12000000, servicios: 5000000 },
]

const gastosPorCategoria = [
  { nombre: 'Nómina', valor: 45000000, porcentaje: 55 },
  { nombre: 'Servicios', valor: 12000000, porcentaje: 15 },
  { nombre: 'Inventario', valor: 10000000, porcentaje: 12 },
  { nombre: 'Mantenimiento', valor: 8000000, porcentaje: 10 },
  { nombre: 'Marketing', valor: 4000000, porcentaje: 5 },
  { nombre: 'Otros', valor: 2500000, porcentaje: 3 },
]

const coloresPie = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280']

const transaccionesRecientes = [
  { id: 1, concepto: 'Membresía Premium - María García', tipo: 'ingreso', monto: 180000, fecha: '2024-01-15', metodo: 'Tarjeta' },
  { id: 2, concepto: 'Pago de nómina - Enero', tipo: 'egreso', monto: 45000000, fecha: '2024-01-14', metodo: 'Transferencia' },
  { id: 3, concepto: 'Venta de productos - Suplementos', tipo: 'ingreso', monto: 450000, fecha: '2024-01-14', metodo: 'Efectivo' },
  { id: 4, concepto: 'Servicio de agua', tipo: 'egreso', monto: 850000, fecha: '2024-01-13', metodo: 'Transferencia' },
  { id: 5, concepto: 'Membresía VIP - Carlos López', tipo: 'ingreso', monto: 250000, fecha: '2024-01-13', metodo: 'Tarjeta' },
  { id: 6, concepto: 'Compra de inventario', tipo: 'egreso', monto: 3500000, fecha: '2024-01-12', metodo: 'Transferencia' },
  { id: 7, concepto: 'Renovación membresía - Ana Ruiz', tipo: 'ingreso', monto: 150000, fecha: '2024-01-12', metodo: 'Efectivo' },
  { id: 8, concepto: 'Mantenimiento equipos', tipo: 'egreso', monto: 1200000, fecha: '2024-01-11', metodo: 'Transferencia' },
]

const estadisticas = {
  ingresosMes: 65000000,
  egresosMes: 81500000,
  utilidadNeta: -16500000,
  ingresosPendientes: 8500000,
  crecimientoIngresos: 12.5,
  crecimientoSocios: 8.3,
}

export default function FinanzasPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ingreso' | 'egreso'>('todos')
  const [busqueda, setBusqueda] = useState('')

  const transaccionesFiltradas = useMemo(() => {
    return transaccionesRecientes.filter(t => {
      const coincideTipo = filtroTipo === 'todos' || t.tipo === filtroTipo
      const coincideBusqueda = t.concepto.toLowerCase().includes(busqueda.toLowerCase())
      return coincideTipo && coincideBusqueda
    })
  }, [filtroTipo, busqueda])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finanzas</h1>
            <p className="text-muted-foreground">
              Control financiero, ingresos, egresos y reportes
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mes</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="año">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs principales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(estadisticas.ingresosMes)}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{estadisticas.crecimientoIngresos}% vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Egresos del Mes</CardTitle>
              <CreditCard className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(estadisticas.egresosMes)}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <ArrowDownRight className="h-3 w-3" />
                <span>Nómina + gastos operativos</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${estadisticas.utilidadNeta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(estadisticas.utilidadNeta)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estadisticas.utilidadNeta >= 0 ? 'Ganancia' : 'Déficit'} este período
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
              <Receipt className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(estadisticas.ingresosPendientes)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Membresías y servicios pendientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Ingresos por categoría */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Categoría</CardTitle>
              <CardDescription>Distribución mensual de ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={ingresosMensuales}>
                  <defs>
                    <linearGradient id="colorMembresias" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProductos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorServicios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="membresias" name="Membresías" stroke="#3b82f6" fill="url(#colorMembresias)" />
                  <Area type="monotone" dataKey="productos" name="Productos" stroke="#22c55e" fill="url(#colorProductos)" />
                  <Area type="monotone" dataKey="servicios" name="Servicios" stroke="#f59e0b" fill="url(#colorServicios)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribución de gastos */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Gastos</CardTitle>
              <CardDescription>Desglose por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie
                      data={gastosPorCategoria}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="valor"
                      nameKey="nombre"
                    >
                      {gastosPorCategoria.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={coloresPie[index % coloresPie.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px' }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-2 w-full md:w-auto">
                  {gastosPorCategoria.map((gasto, index) => (
                    <div key={gasto.nombre} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: coloresPie[index] }}
                        />
                        <span className="text-sm">{gasto.nombre}</span>
                      </div>
                      <span className="text-sm font-medium">{gasto.porcentaje}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transacciones */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Transacciones Recientes</CardTitle>
                <CardDescription>Movimientos de ingresos y egresos</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transacción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as 'todos' | 'ingreso' | 'egreso')}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="egreso">Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaccionesFiltradas.map((transaccion) => (
                  <TableRow key={transaccion.id}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{transaccion.concepto}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaccion.tipo === 'ingreso' ? 'default' : 'destructive'}>
                        {transaccion.tipo === 'ingreso' ? (
                          <><TrendingUp className="mr-1 h-3 w-3" /> Ingreso</>
                        ) : (
                          <><TrendingDown className="mr-1 h-3 w-3" /> Egreso</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        {transaccion.metodo === 'Efectivo' && <Banknote className="h-3 w-3" />}
                        {transaccion.metodo === 'Tarjeta' && <CreditCard className="h-3 w-3" />}
                        {transaccion.metodo === 'Transferencia' && <Building2 className="h-3 w-3" />}
                        {transaccion.metodo}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaccion.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(transaccion.monto)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center border-t">
            <Button variant="ghost" className="gap-2">
              <FileText className="h-4 w-4" />
              Ver todas las transacciones
            </Button>
          </CardFooter>
        </Card>

        {/* Resumen rápido */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membresías Activas</p>
                  <p className="text-xl font-bold">847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Package className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ventas Hoy</p>
                  <p className="text-xl font-bold">{formatCurrency(2350000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Percent className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margen Promedio</p>
                  <p className="text-xl font-bold">42.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crecimiento</p>
                  <p className="text-xl font-bold">+{estadisticas.crecimientoSocios}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
