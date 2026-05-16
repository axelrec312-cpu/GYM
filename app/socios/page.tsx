'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { PageHeader, SectionCard, StatusBadge, EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CreditCard,
  Snowflake,
  Trash2,
  Download,
  Users,
  Mail,
  Phone,
} from 'lucide-react'
import { socios } from '@/lib/mock-data'
import { formatFecha, formatTiempoRelativo, obtenerIniciales, getColorEstadoMembresia } from '@/lib/helpers'
import { ESTADOS_MEMBRESIA } from '@/lib/constants'
import type { EstadoMembresia } from '@/lib/types'

export default function SociosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')

  const sociosFiltrados = socios.filter((socio) => {
    const coincideBusqueda = 
      socio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      socio.codigo.toLowerCase().includes(busqueda.toLowerCase())
    
    const coincideEstado = filtroEstado === 'todos' || socio.estado === filtroEstado
    
    return coincideBusqueda && coincideEstado
  })

  const estadisticas = {
    total: socios.length,
    activos: socios.filter((s) => s.estado === 'activo').length,
    vencidos: socios.filter((s) => s.estado === 'vencido').length,
    congelados: socios.filter((s) => s.estado === 'congelado').length,
  }

  return (
    <DashboardLayout>
      <PageHeader
        titulo="Socios"
        descripcion="Gestiona todos los socios del gimnasio"
        acciones={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button asChild>
              <Link href="/socios/nuevo">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo socio
              </Link>
            </Button>
          </div>
        }
      />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{estadisticas.total}</p>
              <p className="text-sm text-muted-foreground">Total socios</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{estadisticas.activos}</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Users className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{estadisticas.vencidos}</p>
              <p className="text-sm text-muted-foreground">Vencidos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Snowflake className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{estadisticas.congelados}</p>
              <p className="text-sm text-muted-foreground">Congelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
                <SelectItem value="congelado">Congelados</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de socios */}
        {sociosFiltrados.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socio</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Última visita</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sociosFiltrados.map((socio) => (
                  <TableRow key={socio.id} className="group">
                    <TableCell>
                      <Link href={`/socios/${socio.id}`} className="flex items-center gap-3 hover:opacity-80">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={socio.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {obtenerIniciales(socio.nombre, socio.apellido)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{socio.nombre} {socio.apellido}</p>
                          <p className="text-sm text-muted-foreground">
                            Desde {formatFecha(socio.fechaRegistro, 'MMM yyyy')}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {socio.codigo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground truncate max-w-[150px]">
                            {socio.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{socio.telefono}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Plan Premium</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {socio.ultimaVisita 
                          ? formatTiempoRelativo(socio.ultimaVisita) 
                          : 'Sin visitas'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={socio.estado as keyof typeof ESTADOS_MEMBRESIA}>
                        {ESTADOS_MEMBRESIA[socio.estado as keyof typeof ESTADOS_MEMBRESIA]?.label || socio.estado}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/socios/${socio.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver perfil
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Renovar membresía
                          </DropdownMenuItem>
                          {socio.estado === 'activo' && (
                            <DropdownMenuItem>
                              <Snowflake className="mr-2 h-4 w-4" />
                              Congelar
                            </DropdownMenuItem>
                          )}
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
          </div>
        ) : (
          <EmptyState
            icono={Users}
            titulo="No se encontraron socios"
            descripcion="Intenta ajustar los filtros de búsqueda o registra un nuevo socio."
            accion={
              <Button asChild>
                <Link href="/socios/nuevo">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrar socio
                </Link>
              </Button>
            }
          />
        )}

        {/* Paginación */}
        {sociosFiltrados.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {sociosFiltrados.length} de {socios.length} socios
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  )
}
