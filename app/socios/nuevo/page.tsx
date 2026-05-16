'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { PageHeader, SectionCard } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  ArrowRight,
  User,
  CreditCard,
  CheckCircle,
  Check,
} from 'lucide-react'
import { planesMembresia } from '@/lib/mock-data'
import { formatMoneda } from '@/lib/helpers'
import { OBJETIVOS_FISICOS, METODOS_PAGO } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const pasos = [
  { id: 1, nombre: 'Datos Personales', icono: User },
  { id: 2, nombre: 'Plan de Membresía', icono: CreditCard },
  { id: 3, nombre: 'Confirmación', icono: CheckCircle },
]

export default function NuevoSocioPage() {
  const router = useRouter()
  const [pasoActual, setPasoActual] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Datos personales
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    contactoEmergenciaNombre: '',
    contactoEmergenciaTelefono: '',
    contactoEmergenciaRelacion: '',
    objetivos: [] as string[],
    restriccionesMedicas: '',
    // Paso 2: Plan
    planId: '',
    metodoPago: 'efectivo',
  })

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleObjetivo = (objetivo: string) => {
    setFormData((prev) => ({
      ...prev,
      objetivos: prev.objetivos.includes(objetivo)
        ? prev.objetivos.filter((o) => o !== objetivo)
        : [...prev.objetivos, objetivo],
    }))
  }

  const planSeleccionado = planesMembresia.find((p) => p.id === formData.planId)

  const validarPaso1 = () => {
    return (
      formData.nombre &&
      formData.apellido &&
      formData.email &&
      formData.telefono &&
      formData.fechaNacimiento &&
      formData.genero
    )
  }

  const validarPaso2 = () => {
    return formData.planId && formData.metodoPago
  }

  const handleSiguiente = () => {
    if (pasoActual === 1 && !validarPaso1()) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }
    if (pasoActual === 2 && !validarPaso2()) {
      toast.error('Por favor selecciona un plan y método de pago')
      return
    }
    setPasoActual((prev) => Math.min(prev + 1, 3))
  }

  const handleAnterior = () => {
    setPasoActual((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simular registro
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success('Socio registrado exitosamente')
    router.push('/socios')
  }

  return (
    <DashboardLayout>
      <PageHeader
        titulo="Registrar Nuevo Socio"
        descripcion="Completa el formulario para registrar un nuevo socio"
        breadcrumbs={[
          { label: 'Socios', href: '/socios' },
          { label: 'Nuevo socio' },
        ]}
      />

      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {pasos.map((paso, index) => (
            <div key={paso.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    pasoActual >= paso.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted bg-background text-muted-foreground'
                  )}
                >
                  {pasoActual > paso.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <paso.icono className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  'mt-2 text-sm font-medium',
                  pasoActual >= paso.id ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {paso.nombre}
                </span>
              </div>
              {index < pasos.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-20 transition-colors',
                    pasoActual > paso.id ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paso 1: Datos Personales */}
      {pasoActual === 1 && (
        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard titulo="Información Básica">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={(e) => updateFormData('nombre', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={(e) => updateFormData('apellido', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="+51 999 999 999"
                  value={formData.telefono}
                  onChange={(e) => updateFormData('telefono', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => updateFormData('fechaNacimiento', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Género *</Label>
                  <Select value={formData.genero} onValueChange={(v) => updateFormData('genero', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Av. Ejemplo 123, Distrito"
                  value={formData.direccion}
                  onChange={(e) => updateFormData('direccion', e.target.value)}
                />
              </div>
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard titulo="Contacto de Emergencia">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactoNombre">Nombre del contacto</Label>
                  <Input
                    id="contactoNombre"
                    placeholder="Nombre completo"
                    value={formData.contactoEmergenciaNombre}
                    onChange={(e) => updateFormData('contactoEmergenciaNombre', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoTelefono">Teléfono</Label>
                  <Input
                    id="contactoTelefono"
                    placeholder="+51 999 999 999"
                    value={formData.contactoEmergenciaTelefono}
                    onChange={(e) => updateFormData('contactoEmergenciaTelefono', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactoRelacion">Relación</Label>
                  <Select 
                    value={formData.contactoEmergenciaRelacion} 
                    onValueChange={(v) => updateFormData('contactoEmergenciaRelacion', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="familiar">Familiar</SelectItem>
                      <SelectItem value="pareja">Pareja</SelectItem>
                      <SelectItem value="amigo">Amigo/a</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>

            <SectionCard titulo="Objetivos Físicos">
              <div className="flex flex-wrap gap-2">
                {OBJETIVOS_FISICOS.map((objetivo) => (
                  <Badge
                    key={objetivo}
                    variant={formData.objetivos.includes(objetivo) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleObjetivo(objetivo)}
                  >
                    {formData.objetivos.includes(objetivo) && (
                      <Check className="mr-1 h-3 w-3" />
                    )}
                    {objetivo}
                  </Badge>
                ))}
              </div>
            </SectionCard>

            <SectionCard titulo="Restricciones Médicas">
              <Textarea
                placeholder="Indica cualquier condición médica o restricción que debamos conocer..."
                value={formData.restriccionesMedicas}
                onChange={(e) => updateFormData('restriccionesMedicas', e.target.value)}
                rows={3}
              />
            </SectionCard>
          </div>
        </div>
      )}

      {/* Paso 2: Plan de Membresía */}
      {pasoActual === 2 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard titulo="Selecciona un Plan">
              <RadioGroup 
                value={formData.planId} 
                onValueChange={(v) => updateFormData('planId', v)}
                className="grid gap-4 sm:grid-cols-2"
              >
                {planesMembresia.filter(p => p.activo).map((plan) => (
                  <div key={plan.id}>
                    <RadioGroupItem 
                      value={plan.id} 
                      id={plan.id} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={plan.id}
                      className={cn(
                        'flex flex-col rounded-xl border-2 p-4 cursor-pointer transition-all',
                        'hover:border-primary/50',
                        formData.planId === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{plan.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{plan.duracionDias} días</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatMoneda(plan.precio)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plan.descripcion}</p>
                      <ul className="space-y-1">
                        {plan.caracteristicas.slice(0, 3).map((car, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-emerald-500" />
                            {car}
                          </li>
                        ))}
                        {plan.caracteristicas.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{plan.caracteristicas.length - 3} beneficios más
                          </li>
                        )}
                      </ul>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </SectionCard>

            <SectionCard titulo="Método de Pago" className="mt-6">
              <RadioGroup 
                value={formData.metodoPago} 
                onValueChange={(v) => updateFormData('metodoPago', v)}
                className="grid gap-4 sm:grid-cols-3"
              >
                {Object.entries(METODOS_PAGO).map(([key, value]) => (
                  <div key={key}>
                    <RadioGroupItem value={key} id={`pago-${key}`} className="peer sr-only" />
                    <Label
                      htmlFor={`pago-${key}`}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all',
                        'hover:border-primary/50',
                        formData.metodoPago === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      )}
                    >
                      {value.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </SectionCard>
          </div>

          <div>
            <SectionCard titulo="Resumen del Pedido" className="sticky top-24">
              {planSeleccionado ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium">{planSeleccionado.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duración</span>
                      <span className="font-medium">{planSeleccionado.duracionDias} días</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Método de pago</span>
                      <span className="font-medium capitalize">{formData.metodoPago}</span>
                    </div>
                  </div>
                  <div className="border-t my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatMoneda(planSeleccionado.precio)}</span>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Selecciona un plan para ver el resumen
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* Paso 3: Confirmación */}
      {pasoActual === 3 && (
        <div className="max-w-2xl mx-auto">
          <SectionCard titulo="Confirmación del Registro">
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Todo listo para registrar</h2>
                <p className="text-muted-foreground">
                  Revisa los datos antes de confirmar el registro del nuevo socio
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Datos del Socio</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nombre</dt>
                      <dd className="font-medium">{formData.nombre} {formData.apellido}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-medium">{formData.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Teléfono</dt>
                      <dd className="font-medium">{formData.telefono}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Plan Seleccionado</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plan</dt>
                      <dd className="font-medium">{planSeleccionado?.nombre}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duración</dt>
                      <dd className="font-medium">{planSeleccionado?.duracionDias} días</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Total</dt>
                      <dd className="font-bold text-primary">{formatMoneda(planSeleccionado?.precio || 0)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                <Checkbox id="terminos" />
                <Label htmlFor="terminos" className="text-sm">
                  El socio acepta los términos y condiciones del gimnasio
                </Label>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Navegación */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button variant="outline" onClick={handleAnterior} disabled={pasoActual === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        {pasoActual < 3 ? (
          <Button onClick={handleSiguiente}>
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Confirmar Registro'}
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </DashboardLayout>
  )
}
