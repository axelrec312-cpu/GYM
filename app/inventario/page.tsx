'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '@/components/layouts/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { mockProductos } from '@/lib/mock-data'
import { Producto, CategoriaProducto } from '@/lib/types'
import { formatCurrency } from '@/lib/helpers'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Archive,
  Eye
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

const estadisticasInventario = {
  totalProductos: 156,
  valorTotal: 45670000,
  stockBajo: 12,
  sinStock: 3,
}

export default function InventarioPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaProducto | 'todos'>('todos')
  const [filtroStock, setFiltroStock] = useState<'todos' | 'bajo' | 'sin'>('todos')
  const [productos, setProductos] = useState<Producto[]>(mockProductos)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)

  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                               producto.sku?.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = filtroCategoria === 'todos' || producto.categoria === filtroCategoria
      let coincideStock = true
      if (filtroStock === 'bajo') coincideStock = producto.stock <= (producto.stockMinimo || 5) && producto.stock > 0
      if (filtroStock === 'sin') coincideStock = producto.stock === 0
      return coincideBusqueda && coincideCategoria && coincideStock
    })
  }, [productos, busqueda, filtroCategoria, filtroStock])

  const handleNuevoProducto = () => {
    setProductoEditando(null)
    setDialogoAbierto(true)
  }

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditando(producto)
    setDialogoAbierto(true)
  }

  const handleEliminarProducto = (productoId: string) => {
    setProductos(productos.filter(p => p.id !== productoId))
    toast.success('Producto eliminado correctamente')
  }

  const handleGuardarProducto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const productoData: Producto = {
      id: productoEditando?.id || `prod-${Date.now()}`,
      sku: formData.get('sku') as string,
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      categoria: formData.get('categoria') as CategoriaProducto,
      precioCompra: parseFloat(formData.get('precioCompra') as string),
      precioVenta: parseFloat(formData.get('precioVenta') as string),
      stock: parseInt(formData.get('stock') as string),
      stockMinimo: parseInt(formData.get('stockMinimo') as string) || 5,
      unidad: formData.get('unidad') as string || 'unidad',
      activo: formData.get('activo') === 'on',
    }

    if (productoEditando) {
      setProductos(productos.map(p => p.id === productoEditando.id ? productoData : p))
      toast.success('Producto actualizado correctamente')
    } else {
      setProductos([...productos, productoData])
      toast.success('Producto creado correctamente')
    }
    
    setDialogoAbierto(false)
  }

  const getStockBadge = (producto: Producto) => {
    if (producto.stock === 0) {
      return <Badge variant="destructive">Sin stock</Badge>
    }
    if (producto.stock <= (producto.stockMinimo || 5)) {
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Stock bajo</Badge>
    }
    return <Badge variant="outline" className="border-green-500 text-green-500">En stock</Badge>
  }

  const margenGanancia = (producto: Producto) => {
    return ((producto.precioVenta - producto.precioCompra) / producto.precioCompra * 100).toFixed(1)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
            <p className="text-muted-foreground">
              Gestiona el stock de productos y suplementos del gimnasio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
              <DialogTrigger asChild>
                <Button onClick={handleNuevoProducto} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                  <DialogDescription>
                    {productoEditando 
                      ? 'Modifica los detalles del producto' 
                      : 'Agrega un nuevo producto al inventario'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGuardarProducto} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU / Código</Label>
                      <Input 
                        id="sku" 
                        name="sku" 
                        defaultValue={productoEditando?.sku} 
                        placeholder="PRD-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select name="categoria" defaultValue={productoEditando?.categoria || 'suplementos'}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suplementos">Suplementos</SelectItem>
                          <SelectItem value="bebidas">Bebidas</SelectItem>
                          <SelectItem value="ropa">Ropa</SelectItem>
                          <SelectItem value="accesorios">Accesorios</SelectItem>
                          <SelectItem value="snacks">Snacks</SelectItem>
                          <SelectItem value="servicios">Servicios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto</Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      defaultValue={productoEditando?.nombre} 
                      placeholder="Proteína Whey 2kg"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea 
                      id="descripcion" 
                      name="descripcion" 
                      defaultValue={productoEditando?.descripcion}
                      placeholder="Descripción del producto..."
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="precioCompra">Precio de Compra (COP)</Label>
                      <Input 
                        id="precioCompra" 
                        name="precioCompra" 
                        type="number" 
                        defaultValue={productoEditando?.precioCompra}
                        placeholder="80000"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precioVenta">Precio de Venta (COP)</Label>
                      <Input 
                        id="precioVenta" 
                        name="precioVenta" 
                        type="number" 
                        defaultValue={productoEditando?.precioVenta}
                        placeholder="120000"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Actual</Label>
                      <Input 
                        id="stock" 
                        name="stock" 
                        type="number" 
                        defaultValue={productoEditando?.stock || 0}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                      <Input 
                        id="stockMinimo" 
                        name="stockMinimo" 
                        type="number" 
                        defaultValue={productoEditando?.stockMinimo || 5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unidad">Unidad</Label>
                      <Select name="unidad" defaultValue={productoEditando?.unidad || 'unidad'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unidad">Unidad</SelectItem>
                          <SelectItem value="kg">Kilogramo</SelectItem>
                          <SelectItem value="litro">Litro</SelectItem>
                          <SelectItem value="caja">Caja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch 
                      id="activo" 
                      name="activo" 
                      defaultChecked={productoEditando?.activo ?? true} 
                    />
                    <Label htmlFor="activo">Producto activo</Label>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticasInventario.totalProductos}</div>
              <p className="text-xs text-muted-foreground">productos registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estadisticasInventario.valorTotal)}</div>
              <p className="text-xs text-muted-foreground">en stock actual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{estadisticasInventario.stockBajo}</div>
              <p className="text-xs text-muted-foreground">productos por agotar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{estadisticasInventario.sinStock}</div>
              <p className="text-xs text-muted-foreground">productos agotados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroCategoria} onValueChange={(v) => setFiltroCategoria(v as CategoriaProducto | 'todos')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las categorías</SelectItem>
              <SelectItem value="suplementos">Suplementos</SelectItem>
              <SelectItem value="bebidas">Bebidas</SelectItem>
              <SelectItem value="ropa">Ropa</SelectItem>
              <SelectItem value="accesorios">Accesorios</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroStock} onValueChange={(v) => setFiltroStock(v as 'todos' | 'bajo' | 'sin')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado de stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo el stock</SelectItem>
              <SelectItem value="bajo">Stock bajo</SelectItem>
              <SelectItem value="sin">Sin stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla de productos */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">P. Compra</TableHead>
                  <TableHead className="text-right">P. Venta</TableHead>
                  <TableHead className="text-right">Margen</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosFiltrados.map((producto) => (
                  <TableRow key={producto.id} className={!producto.activo ? 'opacity-50' : ''}>
                    <TableCell className="font-mono text-sm">{producto.sku || '-'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{producto.nombre}</p>
                        {producto.descripcion && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{producto.descripcion}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {producto.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(producto.precioCompra)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(producto.precioVenta)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600">{margenGanancia(producto)}%</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-mono ${producto.stock <= (producto.stockMinimo || 5) ? 'text-amber-500' : ''} ${producto.stock === 0 ? 'text-destructive' : ''}`}>
                        {producto.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStockBadge(producto)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditarProducto(producto)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver historial
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Ajustar stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleEliminarProducto(producto.id)}
                            className="text-destructive"
                          >
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

            {productosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No se encontraron productos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Intenta ajustar los filtros o agrega un nuevo producto
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
