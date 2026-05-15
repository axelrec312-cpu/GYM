'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { mockPlanes } from '@/lib/mock-data'
import { Plan, TipoPlan } from '@/lib/types'
import { formatCurrency } from '@/lib/helpers'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  CheckCircle2,
  Dumbbell,
  Sparkles,
  Crown,
  Building2,
  Copy,
  MoreVertical,
  TrendingUp,
  Calendar,
  Percent
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const iconosPorTipo: Record<TipoPlan, React.ReactNode> = {
  basico: <Dumbbell className="h-5 w-5" />,
  premium: <Sparkles className="h-5 w-5" />,
  vip: <Crown className="h-5 w-5" />,
  corporativo: <Building2 className="h-5 w-5" />,
  promocional: <Percent className="h-5 w-5" />,
}

const coloresPorTipo: Record<TipoPlan, string> = {
  basico: 'from-slate-500 to-slate-600',
  premium: 'from-blue-500 to-indigo-600',
  vip: 'from-amber-500 to-orange-600',
  corporativo: 'from-emerald-500 to-teal-600',
  promocional: 'from-pink-500 to-rose-600',
}

const estadisticasPlanes = {
  totalActivos: 8,
  sociosConMembresia: 847,
  ingresosMensuales: 42350000,
  tasaRenovacion: 78.5,
}

export default function MembresiasPage() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<TipoPlan | 'todos'>('todos')
  const [planes, setPlanes] = useState<Plan[]>(mockPlanes)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [planEditando, setPlanEditando] = useState<Plan | null>(null)

  const planesFiltrados = useMemo(() => {
    return planes.filter(plan => {
      const coincideBusqueda = plan.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                               plan.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      const coincideTipo = filtroTipo === 'todos' || plan.tipo === filtroTipo
      return coincideBusqueda && coincideTipo
    })
  }, [planes, busqueda, filtroTipo])

  const handleNuevoPlan = () => {
    setPlanEditando(null)
    setDialogoAbierto(true)
  }

  const handleEditarPlan = (plan: Plan) => {
    setPlanEditando(plan)
    setDialogoAbierto(true)
  }

  const handleDuplicarPlan = (plan: Plan) => {
    const nuevoPlan: Plan = {
      ...plan,
      id: `plan-${Date.now()}`,
      nombre: `${plan.nombre} (Copia)`,
      activo: false,
    }
    setPlanes([...planes, nuevoPlan])
    toast.success('Plan duplicado correctamente')
  }

  const handleEliminarPlan = (planId: string) => {
    setPlanes(planes.filter(p => p.id !== planId))
    toast.success('Plan eliminado correctamente')
  }

  const handleToggleActivo = (planId: string) => {
    setPlanes(planes.map(p => 
      p.id === planId ? { ...p, activo: !p.activo } : p
    ))
  }

  const handleGuardarPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const planData: Plan = {
      id: planEditando?.id || `plan-${Date.now()}`,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      tipo: formData.get('tipo') as TipoPlan,
      precio: parseFloat(formData.get('precio') as string),
      duracionDias: parseInt(formData.get('duracion') as string),
      beneficios: (formData.get('beneficios') as string).split('\n').filter(Boolean),
      limiteAccesos: formData.get('limiteAccesos') ? parseInt(formData.get('limiteAccesos') as string) : undefined,
      horariosPermitidos: formData.get('horariosPermitidos') as string || undefined,
      activo: formData.get('activo') === 'on',
      destacado: formData.get('destacado') === 'on',
    }

    if (planEditando) {
      setPlanes(planes.map(p => p.id === planEditando.id ? planData : p))
      toast.success('Plan actualizado correctamente')
    } else {
      setPlanes([...planes, planData])
      toast.success('Plan creado correctamente')
    }
    
    setDialogoAbierto(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">Membresías y Planes</h1>
            <p className="text-muted-foreground">
              Administra los planes de membresía disponibles para tus socios
            </p>
          </div>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button onClick={handleNuevoPlan} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{planEditando ? 'Editar Plan' : 'Nuevo Plan de Membresía'}</DialogTitle>
                <DialogDescription>
                  {planEditando 
                    ? 'Modifica los detalles del plan de membresía' 
                    : 'Crea un nuevo plan de membresía para ofrecer a tus socios'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGuardarPlan} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Plan</Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      defaultValue={planEditando?.nombre} 
                      placeholder="Ej: Plan Mensual Premium"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Plan</Label>
                    <Select name="tipo" defaultValue={planEditando?.tipo || 'basico'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basico">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="corporativo">Corporativo</SelectItem>
                        <SelectItem value="promocional">Promocional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion" 
                    defaultValue={planEditando?.descripcion}
                    placeholder="Describe brevemente los beneficios del plan..."
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (COP)</Label>
                    <Input 
                      id="precio" 
                      name="precio" 
                      type="number" 
                      defaultValue={planEditando?.precio}
                      placeholder="150000"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duracion">Duración (días)</Label>
                    <Input 
                      id="duracion" 
                      name="duracion" 
                      type="number" 
                      defaultValue={planEditando?.duracionDias}
                      placeholder="30"
                      required 
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="limiteAccesos">Límite de Accesos (opcional)</Label>
                    <Input 
                      id="limiteAccesos" 
                      name="limiteAccesos" 
                      type="number" 
                      defaultValue={planEditando?.limiteAccesos}
                      placeholder="Sin límite"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horariosPermitidos">Horarios Permitidos</Label>
                    <Input 
                      id="horariosPermitidos" 
                      name="horariosPermitidos"
                      defaultValue={planEditando?.horariosPermitidos}
                      placeholder="Ej: 6:00 AM - 10:00 PM"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficios">Beneficios (uno por línea)</Label>
                  <Textarea 
                    id="beneficios" 
                    name="beneficios"
                    defaultValue={planEditando?.beneficios?.join('\n')}
                    placeholder="Acceso a máquinas&#10;Clases grupales&#10;Casillero personal"
                    rows={4}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="activo" 
                      name="activo" 
                      defaultChecked={planEditando?.activo ?? true} 
                    />
                    <Label htmlFor="activo">Plan activo</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="destacado" 
                      name="destacado" 
                      defaultChecked={planEditando?.destacado ?? false} 
                    />
                    <Label htmlFor="destacado">Destacar plan</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {planEditando ? 'Guardar Cambios' : 'Crear Plan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPlanes.totalActivos}</div>
              <p className="text-xs text-muted-foreground">de {planes.length} planes totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Socios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPlanes.sociosConMembresia}</div>
              <p className="text-xs text-muted-foreground">con membresía vigente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estadisticasPlanes.ingresosMensuales)}</div>
              <p className="text-xs text-muted-foreground">por membresías</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasa Renovación</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasPlanes.tasaRenovacion}%</div>
              <p className="text-xs text-muted-foreground">últimos 30 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar planes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as TipoPlan | 'todos')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo de plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="basico">Básico</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="corporativo">Corporativo</SelectItem>
              <SelectItem value="promocional">Promocional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Planes */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Vista Tarjetas</TabsTrigger>
            <TabsTrigger value="list">Vista Lista</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {planesFiltrados.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    !plan.activo ? 'opacity-60' : ''
                  } ${plan.destacado ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.destacado && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-0.5 text-xs font-medium rounded-bl">
                      Destacado
                    </div>
                  )}
                  <div className={`h-2 bg-gradient-to-r ${coloresPorTipo[plan.tipo]}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${coloresPorTipo[plan.tipo]} text-white`}>
                          {iconosPorTipo[plan.tipo]}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{plan.nombre}</CardTitle>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {plan.tipo}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditarPlan(plan)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicarPlan(plan)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActivo(plan.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {plan.activo ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleEliminarPlan(plan.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.descripcion}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{formatCurrency(plan.precio)}</span>
                      <span className="text-sm text-muted-foreground">
                        / {plan.duracionDias} días
                      </span>
                    </div>
                    {plan.beneficios && plan.beneficios.length > 0 && (
                      <ul className="space-y-1">
                        {plan.beneficios.slice(0, 3).map((beneficio, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                            <span className="line-clamp-1">{beneficio}</span>
                          </li>
                        ))}
                        {plan.beneficios.length > 3 && (
                          <li className="text-xs text-muted-foreground pl-5">
                            +{plan.beneficios.length - 3} beneficios más
                          </li>
                        )}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{plan.horariosPermitidos || 'Sin restricción'}</span>
                    </div>
                    <Badge variant={plan.activo ? 'default' : 'secondary'}>
                      {plan.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {planesFiltrados.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        !plan.activo ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${coloresPorTipo[plan.tipo]} text-white`}>
                          {iconosPorTipo[plan.tipo]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{plan.nombre}</h3>
                            {plan.destacado && (
                              <Badge variant="outline" className="text-xs">Destacado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(plan.precio)}</p>
                          <p className="text-xs text-muted-foreground">{plan.duracionDias} días</p>
                        </div>
                        <Badge variant={plan.activo ? 'default' : 'secondary'}>
                          {plan.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditarPlan(plan)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicarPlan(plan)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleActivo(plan.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {plan.activo ? 'Desactivar' : 'Activar'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleEliminarPlan(plan.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {planesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No se encontraron planes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Intenta ajustar los filtros o crea un nuevo plan
            </p>
            <Button onClick={handleNuevoPlan} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Crear Primer Plan
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
