
import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOrders, mockProducts } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Helper to group orders by date
const groupOrdersByDate = (days: number) => {
  const result: { date: string; total: number }[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOrders = mockOrders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === dateStr;
    });
    
    const dayTotal = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    result.push({
      date: new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      total: dayTotal
    });
  }
  
  return result;
};

// Helper to get top selling products
const getTopSellingProducts = (limit: number) => {
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  
  mockOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId].revenue += item.price * item.quantity;
    });
  });
  
  return Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

// Helper to analyze orders by status
const getOrdersByStatus = () => {
  const statusCounts: Record<string, number> = {
    pending: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0
  };
  
  mockOrders.forEach(order => {
    statusCounts[order.status]++;
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status === 'pending' ? 'Pendente' :
          status === 'preparing' ? 'Preparando' :
          status === 'ready' ? 'Pronto' :
          status === 'delivered' ? 'Entregue' : 'Cancelado',
    value: count
  }));
};

const Reports = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');
  
  // Generate data based on time range
  const salesData = (() => {
    switch (timeRange) {
      case '7d': 
        return groupOrdersByDate(7);
      case '30d': 
        return groupOrdersByDate(30);
      default: 
        return groupOrdersByDate(7);
    }
  })();
  
  const topProducts = getTopSellingProducts(5);
  const ordersByStatus = getOrdersByStatus();
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <AdminLayout title="Relatórios">
      <Tabs defaultValue="sales">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Relatório de Vendas</CardTitle>
                  <CardDescription>
                    Visão geral das vendas por período
                  </CardDescription>
                </div>
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      tickFormatter={(value) => 
                        `R$${value.toLocaleString('pt-BR')}`
                      }
                    />
                    <Tooltip 
                      formatter={(value) => 
                        [`R$${Number(value).toLocaleString('pt-BR')}`, 'Venda Total']
                      }
                    />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-500">Total de Vendas</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {salesData.reduce((sum, day) => sum + day.total, 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </h3>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-500">Média Diária</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {(salesData.reduce((sum, day) => sum + day.total, 0) / salesData.length).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </h3>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-500">Total de Pedidos</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockOrders.length}
                    </h3>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>
                Os produtos mais populares no seu cardápio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top 5 Produtos</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-gray-500">
                        <th className="text-left pb-2">Produto</th>
                        <th className="text-right pb-2">Qtd. Vendida</th>
                        <th className="text-right pb-2">Receita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">{product.name}</td>
                          <td className="py-3 text-right">{product.quantity}</td>
                          <td className="py-3 text-right">
                            {product.revenue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Distribuição de Vendas</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topProducts}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name }) => name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quantity"
                        >
                          {topProducts.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `${value} unidades`,
                            props.payload.name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Pedidos</CardTitle>
              <CardDescription>
                Distribuição de pedidos por status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} pedidos`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Detalhamento por Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {ordersByStatus.map((status) => (
                    <Card key={status.name}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-gray-500">{status.name}</p>
                        <h3 className="text-2xl font-bold mt-1">{status.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((status.value / mockOrders.length) * 100)}% do total
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Reports;
