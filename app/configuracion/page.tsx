'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Globe, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  CreditCard, 
  Users, 
  Clock, 
  Save,
  Upload,
  Printer,
  Smartphone,
  Database,
  Key,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

export default function ConfiguracionPage() {
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = () => {
    setGuardando(true)
    setTimeout(() => {
      setGuardando(false)
      toast.success('Configuración guardada correctamente')
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Administra las preferencias y ajustes del sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="horarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="pagos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagos</span>
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="integraciones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 border">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Integraciones</span>
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Gimnasio</CardTitle>
                <CardDescription>Datos básicos de tu negocio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombreGimnasio">Nombre del Gimnasio</Label>
                    <Input id="nombreGimnasio" defaultValue="GymPro Fitness Center" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nit">NIT / Identificación Fiscal</Label>
                    <Input id="nit" defaultValue="900.123.456-7" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" defaultValue="Calle 100 #15-20, Bogotá, Colombia" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" defaultValue="+57 (1) 234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="info@gympro.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sitioWeb">Sitio Web</Label>
                    <Input id="sitioWeb" defaultValue="www.gympro.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo del Gimnasio</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Subir Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGuardar} disabled={guardando} className="gap-2">
                  <Save className="h-4 w-4" />
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferencias Regionales</CardTitle>
                <CardDescription>Zona horaria, moneda e idioma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Zona Horaria</Label>
                    <Select defaultValue="america-bogota">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-bogota">América/Bogotá (UTC-5)</SelectItem>
                        <SelectItem value="america-lima">América/Lima (UTC-5)</SelectItem>
                        <SelectItem value="america-mexico">América/México (UTC-6)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Moneda</Label>
                    <Select defaultValue="cop">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cop">Peso Colombiano (COP)</SelectItem>
                        <SelectItem value="usd">Dólar (USD)</SelectItem>
                        <SelectItem value="mxn">Peso Mexicano (MXN)</SelectItem>
                        <SelectItem value="pen">Sol Peruano (PEN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Horarios */}
          <TabsContent value="horarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Operación</CardTitle>
                <CardDescription>Define los horarios de atención del gimnasio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia, index) => (
                  <div key={dia} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked={index < 6} />
                      <span className="font-medium w-24">{dia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue={index < 6 ? '06:00' : '08:00'}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['05:00', '06:00', '07:00', '08:00', '09:00', '10:00'].map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">a</span>
                      <Select defaultValue={index < 5 ? '22:00' : index === 5 ? '18:00' : '14:00'}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['14:00', '16:00', '18:00', '20:00', '21:00', '22:00', '23:00'].map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={handleGuardar} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Horarios
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Días Festivos</CardTitle>
                <CardDescription>Configura los días en que el gimnasio permanecerá cerrado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">1 de Enero - Año Nuevo</Badge>
                  <Badge variant="outline">1 de Mayo - Día del Trabajo</Badge>
                  <Badge variant="outline">20 de Julio - Independencia</Badge>
                  <Badge variant="outline">25 de Diciembre - Navidad</Badge>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Agregar festivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificaciones */}
          <TabsContent value="notificaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones por Email</CardTitle>
                <CardDescription>Configura los correos automáticos del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bienvenida a nuevos socios</Label>
                    <p className="text-sm text-muted-foreground">Enviar email de bienvenida al registrar un socio</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorio de vencimiento</Label>
                    <p className="text-sm text-muted-foreground">Notificar 5 días antes del vencimiento de membresía</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Confirmación de pago</Label>
                    <p className="text-sm text-muted-foreground">Enviar recibo al procesar un pago</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorio de clases</Label>
                    <p className="text-sm text-muted-foreground">Notificar 1 hora antes de una clase reservada</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cumpleaños de socios</Label>
                    <p className="text-sm text-muted-foreground">Enviar felicitación en el cumpleaños</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificaciones Push / SMS</CardTitle>
                <CardDescription>Alertas en tiempo real para la app móvil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">Activar para la aplicación móvil</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>SMS de emergencia</Label>
                      <p className="text-sm text-muted-foreground">Solo para alertas críticas</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pagos */}
          <TabsContent value="pagos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Configura los métodos de pago aceptados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Tarjeta de Crédito/Débito</Label>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Transferencia Bancaria</Label>
                      <p className="text-sm text-muted-foreground">PSE y transferencias directas</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Nequi / Daviplata</Label>
                      <p className="text-sm text-muted-foreground">Billeteras digitales</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Facturación Electrónica</CardTitle>
                <CardDescription>Configuración para emisión de facturas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Resolución DIAN</Label>
                    <Input defaultValue="18764000001234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Prefijo de Factura</Label>
                    <Input defaultValue="FV" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Facturación automática</Label>
                    <p className="text-sm text-muted-foreground">Generar factura al procesar cada venta</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Configurar Impresora
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Seguridad */}
          <TabsContent value="seguridad" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Roles y Permisos</CardTitle>
                <CardDescription>Gestiona los niveles de acceso del personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { rol: 'Administrador', desc: 'Acceso total al sistema', color: 'bg-red-500/20 text-red-600' },
                    { rol: 'Gerente', desc: 'Reportes, finanzas y personal', color: 'bg-amber-500/20 text-amber-600' },
                    { rol: 'Recepcionista', desc: 'Socios, accesos y ventas', color: 'bg-blue-500/20 text-blue-600' },
                    { rol: 'Instructor', desc: 'Solo agenda y clases', color: 'bg-green-500/20 text-green-600' },
                  ].map((item) => (
                    <div key={item.rol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={item.color}>{item.rol}</Badge>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Políticas de Seguridad</CardTitle>
                <CardDescription>Configura las reglas de acceso al sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Autenticación de dos factores</Label>
                      <p className="text-sm text-muted-foreground">Requerir código SMS o app</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Caducidad de contraseñas</Label>
                      <p className="text-sm text-muted-foreground">Forzar cambio cada 90 días</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <Label>Bloqueo por intentos fallidos</Label>
                      <p className="text-sm text-muted-foreground">Bloquear después de 5 intentos</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Copias de Seguridad</CardTitle>
                <CardDescription>Estado de los backups automáticos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-green-600">Último backup exitoso</p>
                    <p className="text-sm text-muted-foreground">Hoy a las 03:00 AM - 2.4 GB</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup automático diario</Label>
                    <p className="text-sm text-muted-foreground">Ejecutar cada día a las 3:00 AM</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="gap-2">
                  <Database className="h-4 w-4" />
                  Backup Manual
                </Button>
                <Button variant="outline" className="gap-2">
                  Restaurar Backup
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Integraciones */}
          <TabsContent value="integraciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integraciones Disponibles</CardTitle>
                <CardDescription>Conecta con servicios externos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { nombre: 'WhatsApp Business', desc: 'Envía mensajes automáticos', conectado: true },
                  { nombre: 'Google Calendar', desc: 'Sincroniza agenda de clases', conectado: true },
                  { nombre: 'Mailchimp', desc: 'Campañas de email marketing', conectado: false },
                  { nombre: 'Stripe', desc: 'Procesamiento de pagos online', conectado: false },
                  { nombre: 'Control de Acceso', desc: 'Torniquetes y lectores biométricos', conectado: true },
                ].map((integracion) => (
                  <div key={integracion.nombre} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${integracion.conectado ? 'bg-green-500' : 'bg-muted'}`} />
                      <div>
                        <p className="font-medium">{integracion.nombre}</p>
                        <p className="text-sm text-muted-foreground">{integracion.desc}</p>
                      </div>
                    </div>
                    <Button variant={integracion.conectado ? 'outline' : 'default'} size="sm">
                      {integracion.conectado ? 'Configurar' : 'Conectar'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API del Sistema</CardTitle>
                <CardDescription>Credenciales para integraciones personalizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="sk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                    <Button variant="outline">Copiar</Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Mantén esta clave en secreto. No la compartas públicamente.</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="gap-2">
                  Regenerar API Key
                </Button>
                <Button variant="outline" className="gap-2">
                  Ver Documentación
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
