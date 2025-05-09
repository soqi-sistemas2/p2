import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Tag, ArrowRight, AlertTriangle } from 'lucide-react';
import { mockOrders, mockProducts, mockCategories } from '@/data/mockData';

// Um componente simples para mostrar estatísticas
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  color?: string;
}

const StatCard = ({ title, value, icon: Icon, description, color = 'text-primary' }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Lista de pedidos recentes para o dashboard
const RecentOrdersList = () => {
  // Pega apenas os 5 pedidos mais recentes
  const recentOrders = [...mockOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pedidos Recentes</CardTitle>
        <Link to="/admin/orders">
          <Button variant="outline" size="sm">
            Ver Todos <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium text-gray-500">#</th>
                <th className="pb-2 text-left font-medium text-gray-500">Cliente</th>
                <th className="pb-2 text-left font-medium text-gray-500">Status</th>
                <th className="pb-2 text-left font-medium text-gray-500">Total</th>
                <th className="pb-2 text-left font-medium text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3">{order.orderNumber}</td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'pending'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'preparing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'pending' && 'Pendente'}
                      {order.status === 'preparing' && 'Preparando'}
                      {order.status === 'ready' && 'Pronto'}
                      {order.status === 'delivered' && 'Entregue'}
                      {order.status === 'cancelled' && 'Cancelado'}
                    </span>
                  </td>
                  <td className="py-3">
                    {order.totalPrice.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Alertas e notificações para o dashboard
const AlertsList = () => {
  const alerts = [
    {
      id: 1,
      message: 'Sistema de notificação via WhatsApp precisa ser configurado',
      type: 'warning'
    },
    {
      id: 2,
      message: 'Você tem 2 novos pedidos aguardando confirmação',
      type: 'info'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3 rounded-md flex items-start ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    revenue: 0
  });
  
  useEffect(() => {
    // Simulando carregamento de dados
    const loadDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pendingOrders = mockOrders.filter(order => 
        order.status === 'pending' || order.status === 'preparing'
      ).length;
      
      const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      setStats({
        totalOrders: mockOrders.length,
        pendingOrders,
        totalProducts: mockProducts.length,
        totalCategories: mockCategories.length,
        revenue: totalRevenue
      });
      
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description="Todos os tempos"
        />
        
        <StatCard
          title="Pedidos Pendentes"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          color="text-yellow-600"
          description="Aguardando processamento"
        />
        
        <StatCard
          title="Produtos"
          value={stats.totalProducts}
          icon={Package}
          color="text-blue-600"
        />
        
        <StatCard
          title="Categorias"
          value={stats.totalCategories}
          icon={Tag}
          color="text-green-600"
        />
      </div>
      
      <div className="mt-6">
        <StatCard
          title="Faturamento Total"
          value={stats.revenue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
          icon={ShoppingCart}
          color="text-green-600"
          description="Todos os tempos"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <RecentOrdersList />
        <AlertsList />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
