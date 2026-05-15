'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { PageHeader, SectionCard, StatusBadge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Edit,
  CreditCard,
  Snowflake,
  QrCode,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  AlertCircle,
  User,
  Heart,
  ShoppingBag,
  Dumbbell,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { socios } from '@/lib/mock-data'
import { 
  formatFecha, 
  formatMoneda, 
  obtenerIniciales, 
  calcularEdad,
  diasHastaVencimiento 
} from '@/lib/helpers'
import { ESTADOS_MEMBRESIA } from '@/lib/constants'

// Datos de ejemplo para el progreso del socio
const historialPeso = [
  { fecha: '2024-01', peso: 85 },
  { fecha: '2024-02', peso: 83 },
  { fecha: '2024-03', peso: 81 },
  { fecha: '2024-04', peso: 79 },
  { fecha: '2024-05', peso: 78 },
]

const historialAsistencia = [
  { fecha: '2024-05-01', hora: '07:30' },
  { fecha: '2024-05-02', hora: '18:15' },
  { fecha: '2024-05-04', hora: '06:45' },
  { fecha: '2024-05-05', hora: '19:00' },
  { fecha: '2024-05-07', hora: '07:00' },
  { fecha: '2024-05-08', hora: '17:45' },
  { fecha: '2024-05-10', hora: '08:00' },
]

const historialPagos = [
  { id: 1, concepto: 'Membresía Premium - Mayo', fecha: new Date('2024-05-01'), monto: 159, estado: 'pagado' },
  { id: 2, concepto: 'Membresía Premium - Abril', fecha: new Date('2024-04-01'), monto: 159, estado: 'pagado' },
  { id: 3, concepto: 'Membresía Premium - Marzo', fecha: new Date('2024-03-01'), monto: 159, estado: 'pagado' },
]

const historialCompras = [
  { id: 1, producto: 'Proteína Whey Gold', fecha: new Date('2024-05-10'), cantidad: 1, total: 249 },
  { id: 2, producto: 'Barra Quest (x3)', fecha: new Date('2024-05-05'), cantidad: 3, total: 36 },
  { id: 3, producto: 'Shaker Bottle', fecha: new Date('2024-04-20'), cantidad: 1, total: 35 },
]

export default function SocioDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('informacion')
  
  const socio = socios.find((s) => s.id === params.id)
  
  if (!socio) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-2">Socio no encontrado</h1>
          <p className="text-muted-foreground mb-4">El socio que buscas no existe.</p>
          <Button asChild>
            <Link href="/socios">Volver a socios</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const edad = calcularEdad(socio.fechaNacimiento)
  const diasRestantes = 15 // Simulado

  return (
    <DashboardLayout>
      <PageHeader
        titulo=""
        breadcrumbs={[
          { label: 'Socios', href: '/socios' },
          { label: `${socio.nombre} ${socio.apellido}` },
        ]}
      />

      {/* Header del socio */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={socio.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {obtenerIniciales(socio.nombre, socio.apellido)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{socio.nombre} {socio.apellido}</h1>
                <StatusBadge status={socio.estado as keyof typeof ESTADOS_MEMBRESIA}>
                  {ESTADOS_MEMBRESIA[socio.estado as keyof typeof ESTADOS_MEMBRESIA]?.label}
                </StatusBadge>
              </div>
              <p className="text-muted-foreground mb-2">
                Código: <span className="font-mono">{socio.codigo}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Plan Premium</Badge>
                <Badge variant="outline">{edad} años</Badge>
                <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                  {diasRestantes} días restantes
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Ver QR
            </Button>
            <Button variant="outline" size="sm">
              <Snowflake className="mr-2 h-4 w-4" />
              Congelar
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Renovar
            </Button>
          </div>
        </div>

        {/* Progreso de membresía */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progreso de membresía</span>
            <span className="text-sm font-medium">{diasRestantes} días restantes</span>
          </div>
          <Progress value={50} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Inicio: 01/05/2024</span>
            <span>Vence: 31/05/2024</span>
          </div>
        </div>
      </div>

      {/* Tabs de contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="informacion">
            <User className="mr-2 h-4 w-4" />
            Información
          </TabsTrigger>
          <TabsTrigger value="membresia">
            <CreditCard className="mr-2 h-4 w-4" />
            Membresía
          </TabsTrigger>
          <TabsTrigger value="asistencia">
            <Clock className="mr-2 h-4 w-4" />
            Asistencia
          </TabsTrigger>
          <TabsTrigger value="rutinas">
            <Dumbbell className="mr-2 h-4 w-4" />
            Rutinas
          </TabsTrigger>
          <TabsTrigger value="progreso">
            <TrendingUp className="mr-2 h-4 w-4" />
            Progreso
          </TabsTrigger>
          <TabsTrigger value="compras">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Compras
          </TabsTrigger>
        </TabsList>

        {/* Tab: Información Personal */}
        <TabsContent value="informacion">
          <div className="grid gap-6 md:grid-cols-2">
            <SectionCard titulo="Datos Personales">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{socio.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{socio.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium">{socio.direccion || 'No registrada'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de nacimiento</p>
                    <p className="font-medium">{formatFecha(socio.fechaNacimiento)} ({edad} años)</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard titulo="Contacto de Emergencia">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-medium">{socio.contactoEmergencia.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{socio.contactoEmergencia.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Relación</p>
                    <p className="font-medium">{socio.contactoEmergencia.relacion}</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard titulo="Objetivos Físicos">
              <div className="flex flex-wrap gap-2">
                {socio.objetivosFisicos.map((objetivo) => (
                  <Badge key={objetivo} variant="secondary">
                    <Target className="mr-1 h-3 w-3" />
                    {objetivo}
                  </Badge>
                ))}
              </div>
            </SectionCard>

            <SectionCard titulo="Restricciones Médicas">
              {socio.restriccionesMedicas ? (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm">{socio.restriccionesMedicas}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Sin restricciones registradas</p>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        {/* Tab: Membresía */}
        <TabsContent value="membresia">
          <div className="grid gap-6 md:grid-cols-3">
            <SectionCard titulo="Plan Actual" className="md:col-span-2">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <h3 className="text-xl font-bold">Plan Premium</h3>
                  <p className="text-muted-foreground">Acceso completo con clases grupales</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatMoneda(159)}</p>
                  <p className="text-sm text-muted-foreground">/mes</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Acceso los 7 días de la semana</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Clases grupales ilimitadas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Área de cardio premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Casillero incluido</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard titulo="Puntos de Lealtad">
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-primary">{socio.puntosLealtad}</p>
                <p className="text-muted-foreground">puntos acumulados</p>
                <Button variant="outline" className="mt-4" size="sm">
                  Ver catálogo de premios
                </Button>
              </div>
            </SectionCard>
          </div>

          <SectionCard titulo="Historial de Pagos" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historialPagos.map((pago) => (
                  <TableRow key={pago.id}>
                    <TableCell className="font-medium">{pago.concepto}</TableCell>
                    <TableCell>{formatFecha(pago.fecha)}</TableCell>
                    <TableCell>{formatMoneda(pago.monto)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                        Pagado
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </TabsContent>

        {/* Tab: Asistencia */}
        <TabsContent value="asistencia">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <SectionCard titulo="Historial de Visitas">
                <div className="space-y-3">
                  {historialAsistencia.map((visita, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-500/10 p-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium">{formatFecha(visita.fecha, 'EEEE, dd MMM')}</p>
                          <p className="text-sm text-muted-foreground">Entrada: {visita.hora}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <SectionCard titulo="Estadísticas">
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold">{historialAsistencia.length}</p>
                  <p className="text-sm text-muted-foreground">visitas este mes</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold">07:30</p>
                  <p className="text-sm text-muted-foreground">hora promedio</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-3xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">asistencia mensual</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Tab: Progreso */}
        <TabsContent value="progreso">
          <div className="grid gap-6 md:grid-cols-2">
            <SectionCard titulo="Evolución de Peso">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historialPeso}>
                    <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="peso" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold">85 kg</p>
                  <p className="text-sm text-muted-foreground">Peso inicial</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-500">78 kg</p>
                  <p className="text-sm text-muted-foreground">Peso actual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">-7 kg</p>
                  <p className="text-sm text-muted-foreground">Progreso</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard titulo="Medidas Corporales">
              <div className="space-y-4">
                {[
                  { label: 'Pecho', actual: 102, anterior: 105 },
                  { label: 'Cintura', actual: 82, anterior: 88 },
                  { label: 'Cadera', actual: 98, anterior: 101 },
                  { label: 'Brazo', actual: 35, anterior: 33 },
                  { label: 'Muslo', actual: 58, anterior: 60 },
                ].map((medida) => (
                  <div key={medida.label} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{medida.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{medida.actual} cm</span>
                      <Badge 
                        variant="outline" 
                        className={medida.actual < medida.anterior 
                          ? 'text-emerald-500 border-emerald-500/30' 
                          : 'text-amber-500 border-amber-500/30'
                        }
                      >
                        {medida.actual - medida.anterior > 0 ? '+' : ''}{medida.actual - medida.anterior} cm
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* Tab: Compras */}
        <TabsContent value="compras">
          <SectionCard titulo="Historial de Compras">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historialCompras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell className="font-medium">{compra.producto}</TableCell>
                    <TableCell>{formatFecha(compra.fecha)}</TableCell>
                    <TableCell>{compra.cantidad}</TableCell>
                    <TableCell className="text-right">{formatMoneda(compra.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="text-muted-foreground">Total compras (último mes)</span>
              <span className="font-bold">{formatMoneda(320)}</span>
            </div>
          </SectionCard>

          <SectionCard titulo="Recomendaciones" className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Basado en los objetivos del socio y su historial de compras:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { nombre: 'BCAA Recovery', precio: 89, razon: 'Complementa su proteína' },
                { nombre: 'Pre-Entreno C4', precio: 139, razon: 'Mejora rendimiento' },
                { nombre: 'Multivitamínico', precio: 65, razon: 'Salud general' },
              ].map((producto) => (
                <div key={producto.nombre} className="p-4 rounded-lg border">
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-muted-foreground">{producto.razon}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">{formatMoneda(producto.precio)}</span>
                    <Button size="sm" variant="outline">Sugerir</Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Tab: Rutinas */}
        <TabsContent value="rutinas">
          <SectionCard titulo="Rutina Asignada">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-lg">Rutina de Hipertrofia - Nivel Intermedio</h3>
                <p className="text-muted-foreground">Asignada por: Entrenador Miguel Torres</p>
              </div>
              
              {['Lunes - Pecho y Tríceps', 'Miércoles - Espalda y Bíceps', 'Viernes - Piernas'].map((dia) => (
                <div key={dia} className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">{dia}</h4>
                  <div className="space-y-2">
                    {['Press de banca 4x10', 'Press inclinado 3x12', 'Aperturas 3x15', 'Fondos 3x12'].map((ejercicio) => (
                      <div key={ejercicio} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {ejercicio}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
