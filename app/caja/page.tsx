'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockProductos, mockSocios } from '@/lib/mock-data'
import { Producto, CategoriaProducto, ItemVenta, Socio } from '@/lib/types'
import { formatCurrency, getInitials } from '@/lib/helpers'
import { 
  Search, 
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  User,
  Package,
  Dumbbell,
  Apple,
  ShirtIcon,
  Droplets,
  X,
  Check,
  Printer,
  Mail,
  Clock,
  Percent,
  Calculator,
  UserSearch,
  ScanBarcode,
  Gift,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'

const iconosCategorias: Record<CategoriaProducto, React.ReactNode> = {
  suplementos: <Dumbbell className="h-4 w-4" />,
  bebidas: <Droplets className="h-4 w-4" />,
  ropa: <ShirtIcon className="h-4 w-4" />,
  accesorios: <Package className="h-4 w-4" />,
  snacks: <Apple className="h-4 w-4" />,
  servicios: <Gift className="h-4 w-4" />,
}

const metodosPago = [
  { id: 'efectivo', nombre: 'Efectivo', icono: Banknote },
  { id: 'tarjeta', nombre: 'Tarjeta', icono: CreditCard },
  { id: 'transferencia', nombre: 'Transferencia', icono: Smartphone },
  { id: 'mixto', nombre: 'Pago Mixto', icono: Calculator },
]

export default function CajaPage() {
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [busquedaSocio, setBusquedaSocio] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaProducto | 'todos'>('todos')
  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null)
  const [dialogoPago, setDialogoPago] = useState(false)
  const [dialogoSocio, setDialogoSocio] = useState(false)
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [efectivoRecibido, setEfectivoRecibido] = useState('')
  const [descuentoGlobal, setDescuentoGlobal] = useState(0)

  const productosFiltrados = useMemo(() => {
    return mockProductos.filter(producto => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
                               producto.sku?.toLowerCase().includes(busquedaProducto.toLowerCase())
      const coincideCategoria = categoriaActiva === 'todos' || producto.categoria === categoriaActiva
      return coincideBusqueda && coincideCategoria && producto.activo && producto.stock > 0
    })
  }, [busquedaProducto, categoriaActiva])

  const sociosFiltrados = useMemo(() => {
    if (!busquedaSocio) return []
    return mockSocios.filter(socio => {
      const busquedaLower = busquedaSocio.toLowerCase()
      return socio.nombre.toLowerCase().includes(busquedaLower) ||
             socio.apellido.toLowerCase().includes(busquedaLower) ||
             socio.documento.includes(busquedaSocio) ||
             socio.email.toLowerCase().includes(busquedaLower)
    }).slice(0, 5)
  }, [busquedaSocio])

  const subtotal = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.subtotal, 0)
  }, [carrito])

  const descuentoTotal = useMemo(() => {
    return subtotal * (descuentoGlobal / 100)
  }, [subtotal, descuentoGlobal])

  const total = useMemo(() => {
    return subtotal - descuentoTotal
  }, [subtotal, descuentoTotal])

  const cambio = useMemo(() => {
    const efectivo = parseFloat(efectivoRecibido) || 0
    return efectivo - total
  }, [efectivoRecibido, total])

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.productoId === producto.id)
      if (existente) {
        if (existente.cantidad >= producto.stock) {
          toast.error('No hay suficiente stock disponible')
          return prev
        }
        return prev.map(item =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precioUnitario }
            : item
        )
      }
      return [...prev, {
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precioVenta,
        descuento: 0,
        subtotal: producto.precioVenta,
      }]
    })
  }

  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(productoId)
      return
    }
    const producto = mockProductos.find(p => p.id === productoId)
    if (producto && nuevaCantidad > producto.stock) {
      toast.error('No hay suficiente stock disponible')
      return
    }
    setCarrito(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioUnitario }
          : item
      )
    )
  }

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(prev => prev.filter(item => item.productoId !== productoId))
  }

  const limpiarCarrito = () => {
    setCarrito([])
    setSocioSeleccionado(null)
    setDescuentoGlobal(0)
    setEfectivoRecibido('')
  }

  const procesarVenta = () => {
    toast.success('Venta procesada correctamente', {
      description: `Total: ${formatCurrency(total)} - ${metodoPago}`,
    })
    setDialogoPago(false)
    limpiarCarrito()
  }

  const seleccionarSocio = (socio: Socio) => {
    setSocioSeleccionado(socio)
    setBusquedaSocio('')
    setDialogoSocio(false)
    toast.success(`Socio seleccionado: ${socio.nombre} ${socio.apellido}`)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
        {/* Panel de Productos */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header con búsqueda */}
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto o escanear código..."
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <ScanBarcode className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs de categorías */}
            <Tabs value={categoriaActiva} onValueChange={(v) => setCategoriaActiva(v as CategoriaProducto | 'todos')}>
              <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
                <TabsTrigger value="todos" className="flex-1 min-w-[100px]">
                  <Package className="h-4 w-4 mr-1.5" />
                  Todos
                </TabsTrigger>
                <TabsTrigger value="suplementos" className="flex-1 min-w-[100px]">
                  <Dumbbell className="h-4 w-4 mr-1.5" />
                  Suplementos
                </TabsTrigger>
                <TabsTrigger value="bebidas" className="flex-1 min-w-[100px]">
                  <Droplets className="h-4 w-4 mr-1.5" />
                  Bebidas
                </TabsTrigger>
                <TabsTrigger value="ropa" className="flex-1 min-w-[100px]">
                  <ShirtIcon className="h-4 w-4 mr-1.5" />
                  Ropa
                </TabsTrigger>
                <TabsTrigger value="snacks" className="flex-1 min-w-[100px]">
                  <Apple className="h-4 w-4 mr-1.5" />
                  Snacks
                </TabsTrigger>
                <TabsTrigger value="accesorios" className="flex-1 min-w-[100px]">
                  <Package className="h-4 w-4 mr-1.5" />
                  Accesorios
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Grid de productos */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 pr-4">
              {productosFiltrados.map((producto) => (
                <Card
                  key={producto.id}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                      {producto.imagenUrl ? (
                        <img 
                          src={producto.imagenUrl} 
                          alt={producto.nombre}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          {iconosCategorias[producto.categoria]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="h-8 w-8 text-primary" />
                      </div>
                      {producto.stock <= 5 && (
                        <Badge className="absolute top-1 right-1 text-xs" variant="destructive">
                          Stock: {producto.stock}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                      {producto.nombre}
                    </h3>
                    <p className="text-lg font-bold text-primary mt-1">
                      {formatCurrency(producto.precioVenta)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {productosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No se encontraron productos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Panel de Carrito */}
        <Card className="w-full lg:w-[420px] flex flex-col shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Venta Actual
              </CardTitle>
              {carrito.length > 0 && (
                <Button variant="ghost" size="sm" onClick={limpiarCarrito} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            {/* Selección de socio */}
            <div className="mt-2">
              {socioSeleccionado ? (
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={socioSeleccionado.fotoUrl} />
                      <AvatarFallback>{getInitials(socioSeleccionado.nombre, socioSeleccionado.apellido)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{socioSeleccionado.nombre} {socioSeleccionado.apellido}</p>
                      <p className="text-xs text-muted-foreground">{socioSeleccionado.documento}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSocioSeleccionado(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setDialogoSocio(true)}
                >
                  <UserSearch className="h-4 w-4 mr-2" />
                  Buscar socio (opcional)
                </Button>
              )}
            </div>
          </CardHeader>

          <Separator />

          {/* Items del carrito */}
          <ScrollArea className="flex-1 px-4">
            {carrito.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">El carrito está vacío</p>
                <p className="text-sm text-muted-foreground/70">Selecciona productos para agregar</p>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                {carrito.map((item) => (
                  <div key={item.productoId} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.precioUnitario)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="w-20 text-right font-semibold">
                      {formatCurrency(item.subtotal)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive shrink-0"
                      onClick={() => eliminarDelCarrito(item.productoId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Totales y acciones */}
          {carrito.length > 0 && (
            <>
              <Separator />
              <CardFooter className="flex flex-col gap-3 pt-4">
                {/* Descuento */}
                <div className="w-full flex items-center gap-2">
                  <Label htmlFor="descuento" className="shrink-0">
                    <Tag className="h-4 w-4" />
                  </Label>
                  <Input
                    id="descuento"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Descuento %"
                    value={descuentoGlobal || ''}
                    onChange={(e) => setDescuentoGlobal(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground flex-1">
                    {descuentoGlobal > 0 && `-${formatCurrency(descuentoTotal)}`}
                  </span>
                </div>

                {/* Resumen */}
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({carrito.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {descuentoGlobal > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({descuentoGlobal}%)</span>
                      <span>-{formatCurrency(descuentoTotal)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Botones de pago */}
                <div className="w-full grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Apartar
                  </Button>
                  <Button onClick={() => setDialogoPago(true)} className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cobrar
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>

        {/* Diálogo de búsqueda de socio */}
        <Dialog open={dialogoSocio} onOpenChange={setDialogoSocio}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buscar Socio</DialogTitle>
              <DialogDescription>
                Busca por nombre, documento o correo electrónico
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar socio..."
                  value={busquedaSocio}
                  onChange={(e) => setBusquedaSocio(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {sociosFiltrados.length === 0 && busquedaSocio && (
                  <p className="text-center text-muted-foreground py-4">
                    No se encontraron socios
                  </p>
                )}
                {sociosFiltrados.map((socio) => (
                  <div
                    key={socio.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => seleccionarSocio(socio)}
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
                    <Badge variant={socio.estadoMembresia === 'activa' ? 'default' : 'secondary'}>
                      {socio.estadoMembresia}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Diálogo de pago */}
        <Dialog open={dialogoPago} onOpenChange={setDialogoPago}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Procesar Pago</DialogTitle>
              <DialogDescription>
                Total a cobrar: <span className="font-bold text-foreground">{formatCurrency(total)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Métodos de pago */}
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <div className="grid grid-cols-2 gap-2">
                  {metodosPago.map((metodo) => (
                    <Button
                      key={metodo.id}
                      variant={metodoPago === metodo.id ? 'default' : 'outline'}
                      className="h-auto py-3 flex-col gap-1"
                      onClick={() => setMetodoPago(metodo.id)}
                    >
                      <metodo.icono className="h-5 w-5" />
                      <span className="text-sm">{metodo.nombre}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campo de efectivo recibido */}
              {metodoPago === 'efectivo' && (
                <div className="space-y-2">
                  <Label htmlFor="efectivo">Efectivo recibido</Label>
                  <Input
                    id="efectivo"
                    type="number"
                    placeholder="0"
                    value={efectivoRecibido}
                    onChange={(e) => setEfectivoRecibido(e.target.value)}
                    className="text-lg font-mono"
                  />
                  {cambio >= 0 && efectivoRecibido && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">Cambio a devolver:</span>
                        <span className="text-xl font-bold text-green-600">{formatCurrency(cambio)}</span>
                      </div>
                    </div>
                  )}
                  {cambio < 0 && efectivoRecibido && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-destructive">Falta:</span>
                        <span className="text-xl font-bold text-destructive">{formatCurrency(Math.abs(cambio))}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resumen */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Artículos:</span>
                  <span>{carrito.reduce((acc, item) => acc + item.cantidad, 0)}</span>
                </div>
                {socioSeleccionado && (
                  <div className="flex justify-between text-sm">
                    <span>Socio:</span>
                    <span>{socioSeleccionado.nombre} {socioSeleccionado.apellido}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-initial">
                <Button variant="outline" onClick={() => setDialogoPago(false)} className="flex-1 sm:flex-initial">
                  Cancelar
                </Button>
                <Button 
                  onClick={procesarVenta} 
                  disabled={metodoPago === 'efectivo' && cambio < 0}
                  className="flex-1 sm:flex-initial gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirmar Pago
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
