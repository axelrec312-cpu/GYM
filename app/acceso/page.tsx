'use client'

import { useState, useMemo, useEffect } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockSocios, mockAccesos } from '@/lib/mock-data'
import { getInitials } from '@/lib/helpers'
import { Socio, Acceso } from '@/lib/types'
import { 
  Search, 
  ScanLine,
  UserCheck,
  UserX,
  Clock,
  DoorOpen,
  DoorClosed,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Users,
  TrendingUp,
  Activity,
  Fingerprint,
  CreditCard,
  Keyboard,
  Camera
} from 'lucide-react'
import { toast } from 'sonner'

const estadisticasAcceso = {
  dentroDelGimnasio: 127,
  accesosHoy: 342,
  accesosDenegados: 8,
  promedioEstancia: '1h 45min',
}

export default function AccesoPage() {
  const [busqueda, setBusqueda] = useState('')
  const [modoRegistro, setModoRegistro] = useState<'entrada' | 'salida'>('entrada')
  const [accesosHoy, setAccesosHoy] = useState<Acceso[]>(mockAccesos)
  const [ultimoAcceso, setUltimoAcceso] = useState<{ socio: Socio; tipo: 'entrada' | 'salida'; hora: string } | null>(null)

  const sociosFiltrados = useMemo(() => {
    if (!busqueda) return []
    return mockSocios.filter(socio => {
      const busquedaLower = busqueda.toLowerCase()
      return socio.nombre.toLowerCase().includes(busquedaLower) ||
             socio.apellido.toLowerCase().includes(busquedaLower) ||
             socio.documento.includes(busqueda) ||
             socio.codigoAcceso?.includes(busqueda)
    }).slice(0, 5)
  }, [busqueda])

  const registrarAcceso = (socio: Socio, tipo: 'entrada' | 'salida') => {
    const ahora = new Date()
    const horaFormateada = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    
    if (socio.estadoMembresia !== 'activa') {
      toast.error('Acceso denegado', {
        description: `La membresía de ${socio.nombre} ${socio.apellido} no está activa.`,
      })
      return
    }

    const nuevoAcceso: Acceso = {
      id: `acc-${Date.now()}`,
      socioId: socio.id,
      fechaHora: ahora.toISOString(),
      tipo,
      metodo: 'manual',
      autorizado: true,
    }

    setAccesosHoy([nuevoAcceso, ...accesosHoy])
    setUltimoAcceso({ socio, tipo, hora: horaFormateada })
    setBusqueda('')

    toast.success(`${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada`, {
      description: `${socio.nombre} ${socio.apellido} - ${horaFormateada}`,
    })
  }

  const getEstadoBadge = (socio: Socio) => {
    switch (socio.estadoMembresia) {
      case 'activa':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Activa</Badge>
      case 'vencida':
        return <Badge variant="destructive">Vencida</Badge>
      case 'congelada':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Congelada</Badge>
      default:
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Control de Acceso</h1>
            <p className="text-muted-foreground">
              Registro de entradas y salidas del gimnasio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={modoRegistro === 'entrada' ? 'default' : 'outline'}
              onClick={() => setModoRegistro('entrada')}
              className="gap-2"
            >
              <DoorOpen className="h-4 w-4" />
              Entrada
            </Button>
            <Button
              variant={modoRegistro === 'salida' ? 'default' : 'outline'}
              onClick={() => setModoRegistro('salida')}
              className="gap-2"
            >
              <DoorClosed className="h-4 w-4" />
              Salida
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En el Gimnasio</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{estadisticasAcceso.dentroDelGimnasio}</div>
              <p className="text-xs text-muted-foreground">personas ahora mismo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Accesos Hoy</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasAcceso.accesosHoy}</div>
              <p className="text-xs text-muted-foreground">entradas registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Denegados</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{estadisticasAcceso.accesosDenegados}</div>
              <p className="text-xs text-muted-foreground">intentos fallidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Estancia Promedio</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasAcceso.promedioEstancia}</div>
              <p className="text-xs text-muted-foreground">tiempo en gimnasio</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Panel de registro */}
          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5" />
                Registrar {modoRegistro === 'entrada' ? 'Entrada' : 'Salida'}
              </CardTitle>
              <CardDescription>
                Escanea el código o busca al socio por nombre o documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Métodos de registro */}
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="flex-col h-auto py-3 gap-1">
                  <ScanLine className="h-5 w-5" />
                  <span className="text-xs">QR/Código</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-3 gap-1">
                  <Fingerprint className="h-5 w-5" />
                  <span className="text-xs">Huella</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-3 gap-1">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Tarjeta</span>
                </Button>
                <Button variant="outline" className="flex-col h-auto py-3 gap-1 bg-primary/10 border-primary">
                  <Keyboard className="h-5 w-5" />
                  <span className="text-xs">Manual</span>
                </Button>
              </div>

              {/* Campo de búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Documento, código o nombre del socio..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9 text-lg h-12"
                  autoFocus
                />
              </div>

              {/* Resultados de búsqueda */}
              {sociosFiltrados.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {sociosFiltrados.map((socio) => (
                    <div
                      key={socio.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => registrarAcceso(socio, modoRegistro)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={socio.fotoUrl} />
                          <AvatarFallback>{getInitials(socio.nombre, socio.apellido)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{socio.nombre} {socio.apellido}</p>
                          <p className="text-sm text-muted-foreground">{socio.documento}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEstadoBadge(socio)}
                        {socio.estadoMembresia === 'activa' ? (
                          <Button size="sm" className="gap-1">
                            {modoRegistro === 'entrada' ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                            Registrar
                          </Button>
                        ) : (
                          <Button size="sm" variant="destructive" disabled>
                            <XCircle className="h-4 w-4 mr-1" />
                            Denegado
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {busqueda && sociosFiltrados.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No se encontraron socios</p>
                </div>
              )}

              {/* Último acceso registrado */}
              {ultimoAcceso && (
                <Card className={`${ultimoAcceso.tipo === 'entrada' ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${ultimoAcceso.tipo === 'entrada' ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                        {ultimoAcceso.tipo === 'entrada' ? (
                          <UserCheck className="h-6 w-6 text-green-600" />
                        ) : (
                          <UserX className="h-6 w-6 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${ultimoAcceso.tipo === 'entrada' ? 'text-green-600' : 'text-amber-600'}`}>
                          {ultimoAcceso.tipo === 'entrada' ? 'Entrada Registrada' : 'Salida Registrada'}
                        </p>
                        <p className="text-lg font-medium">
                          {ultimoAcceso.socio.nombre} {ultimoAcceso.socio.apellido}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{ultimoAcceso.hora}</p>
                        <p className="text-xs text-muted-foreground">hora de registro</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Accesos recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos Recientes</CardTitle>
              <CardDescription>Últimos movimientos de hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {accesosHoy.slice(0, 15).map((acceso) => {
                    const socio = mockSocios.find(s => s.id === acceso.socioId)
                    if (!socio) return null
                    return (
                      <div
                        key={acceso.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-full ${acceso.tipo === 'entrada' ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                            {acceso.tipo === 'entrada' ? (
                              <DoorOpen className="h-4 w-4 text-green-600" />
                            ) : (
                              <DoorClosed className="h-4 w-4 text-amber-600" />
                            )}
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={socio.fotoUrl} />
                            <AvatarFallback className="text-xs">{getInitials(socio.nombre, socio.apellido)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{socio.nombre} {socio.apellido}</p>
                            <p className="text-xs text-muted-foreground capitalize">{acceso.tipo}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(acceso.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {!acceso.autorizado && (
                            <Badge variant="destructive" className="text-xs">Denegado</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Socios dentro del gimnasio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Dentro del Gimnasio
              </CardTitle>
              <CardDescription>{estadisticasAcceso.dentroDelGimnasio} personas actualmente</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="grid grid-cols-2 gap-2">
                  {mockSocios.filter(s => s.estadoMembresia === 'activa').slice(0, 20).map((socio) => (
                    <div
                      key={socio.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={socio.fotoUrl} />
                        <AvatarFallback className="text-xs">{getInitials(socio.nombre, socio.apellido)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{socio.nombre} {socio.apellido}</p>
                        <p className="text-xs text-muted-foreground">2h 15min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de historial completo */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Accesos</CardTitle>
            <CardDescription>Registro completo del día</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Socio</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accesosHoy.slice(0, 10).map((acceso) => {
                  const socio = mockSocios.find(s => s.id === acceso.socioId)
                  if (!socio) return null
                  return (
                    <TableRow key={acceso.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {new Date(acceso.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={socio.fotoUrl} />
                            <AvatarFallback className="text-xs">{getInitials(socio.nombre, socio.apellido)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{socio.nombre} {socio.apellido}</p>
                            <p className="text-xs text-muted-foreground">{socio.documento}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={acceso.tipo === 'entrada' ? 'default' : 'outline'} className={acceso.tipo === 'entrada' ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'border-amber-500 text-amber-500'}>
                          {acceso.tipo === 'entrada' ? <DoorOpen className="mr-1 h-3 w-3" /> : <DoorClosed className="mr-1 h-3 w-3" />}
                          {acceso.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{acceso.metodo}</TableCell>
                      <TableCell>
                        {acceso.autorizado ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Autorizado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Denegado
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
