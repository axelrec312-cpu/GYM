'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockClases, mockInstructores, mockSocios } from '@/lib/mock-data'
import { Clase, TipoClase } from '@/lib/types'
import { getInitials } from '@/lib/helpers'
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Dumbbell,
  Heart,
  Bike,
  Waves,
  Music,
  Flame,
  Zap,
  UserCheck,
  X,
  Edit,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'

const iconosClase: Record<TipoClase, React.ReactNode> = {
  spinning: <Bike className="h-4 w-4" />,
  yoga: <Heart className="h-4 w-4" />,
  crossfit: <Flame className="h-4 w-4" />,
  funcional: <Zap className="h-4 w-4" />,
  pilates: <Waves className="h-4 w-4" />,
  zumba: <Music className="h-4 w-4" />,
  boxeo: <Dumbbell className="h-4 w-4" />,
  natacion: <Waves className="h-4 w-4" />,
  otro: <Dumbbell className="h-4 w-4" />,
}

const coloresClase: Record<TipoClase, string> = {
  spinning: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  yoga: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  crossfit: 'bg-red-500/20 text-red-600 border-red-500/30',
  funcional: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  pilates: 'bg-teal-500/20 text-teal-600 border-teal-500/30',
  zumba: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
  boxeo: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  natacion: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
  otro: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
}

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const horariosDisponibles = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
]

export default function AgendaPage() {
  const [semanaActual, setSemanaActual] = useState(0)
  const [clases, setClases] = useState<Clase[]>(mockClases)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [dialogoDetalle, setDialogoDetalle] = useState(false)
  const [claseSeleccionada, setClaseSeleccionada] = useState<Clase | null>(null)

  const getFechasSemana = () => {
    const hoy = new Date()
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1 + (semanaActual * 7))
    
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(inicioSemana)
      fecha.setDate(inicioSemana.getDate() + i)
      return fecha
    })
  }

  const fechasSemana = getFechasSemana()

  const getClasesPorDia = (fecha: Date) => {
    const diaSemana = fecha.getDay()
    const diaIndex = diaSemana === 0 ? 6 : diaSemana - 1
    return clases.filter(clase => clase.diasSemana.includes(diaIndex))
  }

  const handleNuevaClase = () => {
    setClaseSeleccionada(null)
    setDialogoAbierto(true)
  }

  const handleVerDetalle = (clase: Clase) => {
    setClaseSeleccionada(clase)
    setDialogoDetalle(true)
  }

  const handleGuardarClase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const diasSeleccionados = Array.from(formData.getAll('dias')).map(d => parseInt(d as string))
    
    const claseData: Clase = {
      id: claseSeleccionada?.id || `clase-${Date.now()}`,
      nombre: formData.get('nombre') as string,
      tipo: formData.get('tipo') as TipoClase,
      descripcion: formData.get('descripcion') as string,
      instructorId: formData.get('instructor') as string,
      sala: formData.get('sala') as string,
      horaInicio: formData.get('horaInicio') as string,
      horaFin: formData.get('horaFin') as string,
      diasSemana: diasSeleccionados,
      capacidadMaxima: parseInt(formData.get('capacidad') as string),
      participantesInscritos: claseSeleccionada?.participantesInscritos || [],
      activa: true,
    }

    if (claseSeleccionada) {
      setClases(clases.map(c => c.id === claseSeleccionada.id ? claseData : c))
      toast.success('Clase actualizada correctamente')
    } else {
      setClases([...clases, claseData])
      toast.success('Clase creada correctamente')
    }
    
    setDialogoAbierto(false)
  }

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const esHoy = (fecha: Date) => {
    const hoy = new Date()
    return fecha.toDateString() === hoy.toDateString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agenda de Clases</h1>
            <p className="text-muted-foreground">
              Programa y gestiona las clases grupales del gimnasio
            </p>
          </div>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button onClick={handleNuevaClase} className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Clase
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{claseSeleccionada ? 'Editar Clase' : 'Nueva Clase'}</DialogTitle>
                <DialogDescription>
                  Configura los detalles de la clase grupal
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGuardarClase} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Clase</Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      defaultValue={claseSeleccionada?.nombre}
                      placeholder="Ej: Spinning Intenso"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Clase</Label>
                    <Select name="tipo" defaultValue={claseSeleccionada?.tipo || 'funcional'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spinning">Spinning</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="crossfit">CrossFit</SelectItem>
                        <SelectItem value="funcional">Funcional</SelectItem>
                        <SelectItem value="pilates">Pilates</SelectItem>
                        <SelectItem value="zumba">Zumba</SelectItem>
                        <SelectItem value="boxeo">Boxeo</SelectItem>
                        <SelectItem value="natacion">Natación</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion"
                    defaultValue={claseSeleccionada?.descripcion}
                    placeholder="Describe brevemente la clase..."
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Select name="instructor" defaultValue={claseSeleccionada?.instructorId || mockInstructores[0]?.id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInstructores.map(instructor => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.nombre} {instructor.apellido}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sala">Sala / Ubicación</Label>
                    <Select name="sala" defaultValue={claseSeleccionada?.sala || 'Sala 1'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sala 1">Sala 1 - Principal</SelectItem>
                        <SelectItem value="Sala 2">Sala 2 - Spinning</SelectItem>
                        <SelectItem value="Sala 3">Sala 3 - Yoga/Pilates</SelectItem>
                        <SelectItem value="Piscina">Piscina</SelectItem>
                        <SelectItem value="Exterior">Área Exterior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicio">Hora Inicio</Label>
                    <Select name="horaInicio" defaultValue={claseSeleccionada?.horaInicio || '07:00'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponibles.map(hora => (
                          <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaFin">Hora Fin</Label>
                    <Select name="horaFin" defaultValue={claseSeleccionada?.horaFin || '08:00'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponibles.map(hora => (
                          <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad</Label>
                    <Input 
                      id="capacidad" 
                      name="capacidad" 
                      type="number"
                      defaultValue={claseSeleccionada?.capacidadMaxima || 20}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Días de la Semana</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {diasSemana.map((dia, index) => (
                      <label 
                        key={dia}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          name="dias" 
                          value={index}
                          defaultChecked={claseSeleccionada?.diasSemana.includes(index)}
                          className="sr-only peer"
                        />
                        <div className="w-full py-2 text-center text-xs border rounded-lg peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors">
                          {dia.slice(0, 3)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {claseSeleccionada ? 'Guardar Cambios' : 'Crear Clase'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Navegación de semanas */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => setSemanaActual(semanaActual - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold">
              {formatFecha(fechasSemana[0])} - {formatFecha(fechasSemana[6])}
            </h2>
            {semanaActual === 0 && (
              <Badge variant="outline" className="mt-1">Semana actual</Badge>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={() => setSemanaActual(semanaActual + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendario semanal */}
        <div className="grid grid-cols-7 gap-2">
          {fechasSemana.map((fecha, index) => (
            <Card 
              key={index} 
              className={`min-h-[400px] ${esHoy(fecha) ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="p-3 pb-2">
                <div className={`text-center ${esHoy(fecha) ? 'text-primary font-bold' : ''}`}>
                  <p className="text-xs text-muted-foreground">{diasSemana[index]}</p>
                  <p className="text-lg font-semibold">{fecha.getDate()}</p>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[320px]">
                  <div className="space-y-2">
                    {getClasesPorDia(fecha)
                      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                      .map((clase) => {
                        const instructor = mockInstructores.find(i => i.id === clase.instructorId)
                        return (
                          <div
                            key={clase.id}
                            className={`p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${coloresClase[clase.tipo]}`}
                            onClick={() => handleVerDetalle(clase)}
                          >
                            <div className="flex items-center gap-1 text-xs font-medium mb-1">
                              {iconosClase[clase.tipo]}
                              <span>{clase.horaInicio}</span>
                            </div>
                            <p className="font-medium text-sm line-clamp-1">{clase.nombre}</p>
                            <p className="text-xs opacity-75 line-clamp-1">
                              {instructor?.nombre} {instructor?.apellido}
                            </p>
                            <div className="flex items-center gap-1 text-xs mt-1 opacity-75">
                              <Users className="h-3 w-3" />
                              <span>{clase.participantesInscritos.length}/{clase.capacidadMaxima}</span>
                            </div>
                          </div>
                        )
                      })}
                    {getClasesPorDia(fecha).length === 0 && (
                      <p className="text-xs text-center text-muted-foreground py-4">
                        Sin clases
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Diálogo de detalle de clase */}
        <Dialog open={dialogoDetalle} onOpenChange={setDialogoDetalle}>
          <DialogContent className="max-w-md">
            {claseSeleccionada && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${coloresClase[claseSeleccionada.tipo]}`}>
                      {iconosClase[claseSeleccionada.tipo]}
                    </div>
                    <div>
                      <DialogTitle>{claseSeleccionada.nombre}</DialogTitle>
                      <DialogDescription className="capitalize">
                        {claseSeleccionada.tipo}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{claseSeleccionada.horaInicio} - {claseSeleccionada.horaFin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{claseSeleccionada.sala}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{claseSeleccionada.participantesInscritos.length}/{claseSeleccionada.capacidadMaxima} inscritos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{claseSeleccionada.diasSemana.map(d => diasSemana[d].slice(0,3)).join(', ')}</span>
                    </div>
                  </div>

                  {claseSeleccionada.descripcion && (
                    <p className="text-sm text-muted-foreground">
                      {claseSeleccionada.descripcion}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Label>Instructor</Label>
                    {(() => {
                      const instructor = mockInstructores.find(i => i.id === claseSeleccionada.instructorId)
                      return instructor ? (
                        <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                          <Avatar>
                            <AvatarImage src={instructor.fotoUrl} />
                            <AvatarFallback>{getInitials(instructor.nombre, instructor.apellido)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{instructor.nombre} {instructor.apellido}</p>
                            <p className="text-xs text-muted-foreground">{instructor.especialidades?.join(', ')}</p>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>

                  {claseSeleccionada.participantesInscritos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Participantes inscritos</Label>
                      <ScrollArea className="h-[120px]">
                        <div className="space-y-1">
                          {claseSeleccionada.participantesInscritos.map(participanteId => {
                            const socio = mockSocios.find(s => s.id === participanteId)
                            return socio ? (
                              <div key={participanteId} className="flex items-center gap-2 p-1.5 hover:bg-muted rounded">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={socio.fotoUrl} />
                                  <AvatarFallback className="text-xs">{getInitials(socio.nombre, socio.apellido)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{socio.nombre} {socio.apellido}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => {
                    setDialogoDetalle(false)
                    handleNuevaClase()
                    setClaseSeleccionada(claseSeleccionada)
                  }}>
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button className="gap-2">
                    <UserCheck className="h-4 w-4" />
                    Tomar Asistencia
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
