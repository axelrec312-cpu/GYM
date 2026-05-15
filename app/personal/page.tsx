'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockInstructores, mockEmpleados } from '@/lib/mock-data'
import { Empleado, Instructor, TipoEmpleado, RolUsuario } from '@/lib/types'
import { formatCurrency, getInitials } from '@/lib/helpers'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  UserCog,
  Dumbbell,
  Clock,
  Calendar,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Eye,
  FileText,
  DollarSign,
  Star,
  Shield
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'

const estadisticasPersonal = {
  totalEmpleados: 24,
  instructores: 12,
  administrativos: 8,
  mantenimiento: 4,
  nominaMensual: 45000000,
}

export default function PersonalPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoEmpleado | 'todos'>('todos')
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | Instructor | null>(null)

  const personalCompleto = useMemo(() => {
    const empleados = mockEmpleados.map(e => ({ ...e, esInstructor: false }))
    const instructores = mockInstructores.map(i => ({ 
      ...i, 
      tipoEmpleado: 'instructor' as TipoEmpleado,
      esInstructor: true 
    }))
    return [...empleados, ...instructores]
  }, [])

  const personalFiltrado = useMemo(() => {
    return personalCompleto.filter(persona => {
      const nombreCompleto = `${persona.nombre} ${persona.apellido}`.toLowerCase()
      const coincideBusqueda = nombreCompleto.includes(busqueda.toLowerCase()) ||
                               persona.documento.includes(busqueda) ||
                               persona.email.toLowerCase().includes(busqueda.toLowerCase())
      const coincideTipo = filtroTipo === 'todos' || persona.tipoEmpleado === filtroTipo
      return coincideBusqueda && coincideTipo
    })
  }, [personalCompleto, busqueda, filtroTipo])

  const handleNuevoEmpleado = () => {
    setEmpleadoSeleccionado(null)
    setDialogoAbierto(true)
  }

  const handleEditarEmpleado = (empleado: Empleado | Instructor) => {
    setEmpleadoSeleccionado(empleado)
    setDialogoAbierto(true)
  }

  const getTipoBadge = (tipo: TipoEmpleado) => {
    const estilos: Record<TipoEmpleado, string> = {
      instructor: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      recepcionista: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
      administrativo: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
      mantenimiento: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
      gerente: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
    }
    return <Badge variant="outline" className={`capitalize ${estilos[tipo]}`}>{tipo}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Personal</h1>
            <p className="text-muted-foreground">
              Gestiona empleados, instructores y sus horarios
            </p>
          </div>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button onClick={handleNuevoEmpleado} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{empleadoSeleccionado ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
                <DialogDescription>
                  Ingresa los datos del empleado
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre" 
                      defaultValue={empleadoSeleccionado?.nombre}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input 
                      id="apellido" 
                      defaultValue={empleadoSeleccionado?.apellido}
                      required 
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="documento">Documento</Label>
                    <Input 
                      id="documento" 
                      defaultValue={empleadoSeleccionado?.documento}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoEmpleado">Tipo de Empleado</Label>
                    <Select defaultValue={empleadoSeleccionado?.tipoEmpleado || 'recepcionista'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue={empleadoSeleccionado?.email}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input 
                      id="telefono" 
                      defaultValue={empleadoSeleccionado?.telefono}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    defaultValue={empleadoSeleccionado?.direccion}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="salario">Salario Base (COP)</Label>
                    <Input 
                      id="salario" 
                      type="number"
                      defaultValue={(empleadoSeleccionado as Empleado)?.salario}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
                    <Input 
                      id="fechaContratacion" 
                      type="date"
                      defaultValue={empleadoSeleccionado?.fechaContratacion}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" onClick={(e) => {
                    e.preventDefault()
                    toast.success(empleadoSeleccionado ? 'Empleado actualizado' : 'Empleado creado')
                    setDialogoAbierto(false)
                  }}>
                    {empleadoSeleccionado ? 'Guardar Cambios' : 'Crear Empleado'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Personal</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPersonal.totalEmpleados}</div>
              <p className="text-xs text-muted-foreground">empleados activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Instructores</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPersonal.instructores}</div>
              <p className="text-xs text-muted-foreground">certificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrativos</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPersonal.administrativos}</div>
              <p className="text-xs text-muted-foreground">en oficina</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mantenimiento</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPersonal.mantenimiento}</div>
              <p className="text-xs text-muted-foreground">operarios</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nómina Mensual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estadisticasPersonal.nominaMensual)}</div>
              <p className="text-xs text-muted-foreground">total salarios</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, documento o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as TipoEmpleado | 'todos')}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tipo de empleado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="instructor">Instructores</SelectItem>
              <SelectItem value="recepcionista">Recepcionistas</SelectItem>
              <SelectItem value="administrativo">Administrativos</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="gerente">Gerentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs de visualización */}
        <Tabs defaultValue="lista">
          <TabsList>
            <TabsTrigger value="lista">Vista Lista</TabsTrigger>
            <TabsTrigger value="tarjetas">Vista Tarjetas</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Fecha Ingreso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {personalFiltrado.map((persona) => (
                      <TableRow key={persona.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={persona.fotoUrl} />
                              <AvatarFallback>{getInitials(persona.nombre, persona.apellido)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{persona.nombre} {persona.apellido}</p>
                              <p className="text-xs text-muted-foreground">{persona.documento}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getTipoBadge(persona.tipoEmpleado)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {persona.email}
                            </div>
                            {persona.telefono && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {persona.telefono}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {persona.fechaContratacion ? new Date(persona.fechaContratacion).toLocaleDateString('es-ES') : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={persona.activo ? 'default' : 'secondary'}>
                            {persona.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditarEmpleado(persona)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="mr-2 h-4 w-4" />
                                Ver horarios
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Documentos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tarjetas" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {personalFiltrado.map((persona) => (
                <Card key={persona.id} className="overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={persona.fotoUrl} />
                          <AvatarFallback>{getInitials(persona.nombre, persona.apellido)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{persona.nombre} {persona.apellido}</CardTitle>
                          <CardDescription>{persona.documento}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditarEmpleado(persona)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver perfil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getTipoBadge(persona.tipoEmpleado)}
                    
                    {'especialidades' in persona && persona.especialidades && (
                      <div className="flex flex-wrap gap-1">
                        {persona.especialidades.slice(0, 3).map((esp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{persona.email}</span>
                      </div>
                      {persona.telefono && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{persona.telefono}</span>
                        </div>
                      )}
                    </div>

                    {'calificacionPromedio' in persona && persona.calificacionPromedio && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="font-medium">{persona.calificacionPromedio.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">/ 5.0</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Badge variant={persona.activo ? 'default' : 'secondary'} className="w-full justify-center">
                      {persona.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {personalFiltrado.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No se encontró personal</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
