import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { mockOrders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order, OrderStatus } from '@/types';
import { toast } from '@/components/ui/sonner';
import { Search, Filter } from 'lucide-react';

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusMap: Record<OrderStatus, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    pending: { label: 'Pendente', variant: 'outline' },
    preparing: { label: 'Preparando', variant: 'secondary' },
    ready: { label: 'Pronto', variant: 'default' },
    delivered: { label: 'Entregue', variant: 'default' },
    cancelled: { label: 'Cancelado', variant: 'destructive' }
  };
  
  const { label, variant } = statusMap[status];
  
  return (
    <Badge variant={variant}>{label}</Badge>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleStatusChange = (status: OrderStatus | 'all') => {
    setStatusFilter(status);
    filterOrders(searchQuery, status);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterOrders(query, statusFilter);
  };
  
  const filterOrders = (query: string, status: OrderStatus | 'all') => {
    let filtered = orders;
    
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.orderNumber.toLowerCase().includes(lowerQuery) ||
          order.customerName.toLowerCase().includes(lowerQuery) ||
          order.customerPhone.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredOrders(filtered);
  };
  
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    // In a real app, this would make an API call
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            updatedAt: new Date().toISOString()
          } 
        : order
    );
    
    setOrders(updatedOrders);
    setFilteredOrders(
      filteredOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              updatedAt: new Date().toISOString()
            } 
          : order
      )
    );
    
    toast.success(`Pedido #${orders.find(o => o.id === orderId)?.orderNumber} atualizado para ${
      newStatus === 'pending' ? 'Pendente' :
      newStatus === 'preparing' ? 'Preparando' :
      newStatus === 'ready' ? 'Pronto' :
      newStatus === 'delivered' ? 'Entregue' : 'Cancelado'
    }`);
  };
  
  return (
    <AdminLayout title="Pedidos">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por número, cliente ou telefone..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={statusFilter}
              onValueChange={(value) => handleStatusChange(value as OrderStatus | 'all')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="ready">Pronto</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerPhone}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {order.totalPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Alterar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="preparing">Preparando</SelectItem>
                          <SelectItem value="ready">Pronto</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
