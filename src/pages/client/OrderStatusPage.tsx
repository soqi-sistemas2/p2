
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ClientLayout from '@/components/layouts/ClientLayout';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types';
import { Check } from 'lucide-react';

const orderStatusMap: Record<OrderStatus, { label: string, color: string }> = {
  'pending': { label: 'Pedido Recebido', color: 'bg-blue-500' },
  'preparing': { label: 'Preparando', color: 'bg-yellow-500' },
  'ready': { label: 'Pronto para Entrega', color: 'bg-green-500' },
  'delivered': { label: 'Entregue', color: 'bg-green-700' },
  'cancelled': { label: 'Cancelado', color: 'bg-red-500' }
};

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar se temos os dados do pedido no state da navegação
  const orderFromState = location.state as { 
    orderNumber: string;
    customerName: string;
    customerPhone: string;
  } | undefined;
  
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Simular busca do pedido na API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (orderFromState) {
          // Criar um pedido novo com os dados do checkout
          const newOrder: Order = {
            id: Math.random().toString(36).substring(7),
            orderNumber: orderFromState.orderNumber,
            customerName: orderFromState.customerName,
            customerPhone: orderFromState.customerPhone,
            items: [], // Não temos os itens pois o carrinho foi limpo
            totalPrice: 0, // Não temos o preço pois o carrinho foi limpo
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setOrder(newOrder);
        } else {
          // Buscar um pedido existente
          const foundOrder = mockOrders.find(o => o.orderNumber === orderId);
          setOrder(foundOrder || null);
        }
      } catch (error) {
        console.error('Erro ao buscar status do pedido:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderStatus();
  }, [orderId, orderFromState]);
  
  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ClientLayout>
    );
  }
  
  if (!order) {
    return (
      <ClientLayout title="Pedido não encontrado">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-6">
            Não conseguimos encontrar o pedido com o número {orderId}.
            Verifique se o número está correto ou entre em contato conosco.
          </p>
          <Link to="/">
            <Button>Voltar para o Menu</Button>
          </Link>
        </div>
      </ClientLayout>
    );
  }
  
  const currentStatus = order.status;
  const statusInfo = orderStatusMap[currentStatus];
  
  // Definir as etapas do pedido
  const orderSteps: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered'];
  const currentStepIndex = orderSteps.indexOf(currentStatus);
  
  return (
    <ClientLayout title={`Pedido #${order.orderNumber}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Status do pedido */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Status do Pedido</h2>
          
          <div className={`inline-block px-4 py-2 rounded-full ${statusInfo.color} text-white font-medium`}>
            {statusInfo.label}
          </div>
          
          {currentStatus === 'cancelled' && (
            <p className="mt-2 text-red-500">
              O pedido foi cancelado. Entre em contato para mais informações.
            </p>
          )}
        </div>
        
        {/* Timeline */}
        {currentStatus !== 'cancelled' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {orderSteps.map((step, index) => (
                <div 
                  key={step}
                  className="flex flex-col items-center w-full"
                >
                  <div 
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      index <= currentStepIndex 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index <= currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center">{orderStatusMap[step].label}</span>
                </div>
              ))}
            </div>
            
            <div className="relative flex justify-between items-center">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 transform -translate-y-1/2 z-0"></div>
              
              <div 
                className="absolute left-0 h-1 bg-primary top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500"
                style={{ 
                  width: `${Math.max(0, (currentStepIndex / (orderSteps.length - 1)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Informações do cliente */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Nome:</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500">WhatsApp:</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
          </div>
        </div>
        
        {/* Detalhes do pedido (quando disponíveis) */}
        {order.items && order.items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-medium">{item.productName}</span>
                    <div className="text-sm text-gray-500">
                      {item.quantity} x {item.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </div>
                    {item.observations && (
                      <div className="text-sm text-gray-500 italic">
                        Obs: {item.observations}
                      </div>
                    )}
                  </div>
                  <div className="font-medium">
                    {(item.price * item.quantity).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  {order.totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {order.observations && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Observações</h3>
            <p className="text-gray-700">{order.observations}</p>
          </div>
        )}
        
        {/* Instruções */}
        <div className="bg-blue-50 p-4 rounded-md text-blue-700">
          <h3 className="font-semibold mb-2">Instruções</h3>
          <p className="text-sm">
            Você receberá atualizações sobre o status do seu pedido pelo WhatsApp.
            Guarde o número do seu pedido: <strong>#{order.orderNumber}</strong> para consultas futuras.
          </p>
        </div>
        
        {/* Botões de ação */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="secondary">Fazer Outro Pedido</Button>
          </Link>
          
          <a href={`https://wa.me/5511999998888?text=Olá! Gostaria de saber sobre o status do meu pedido #${order.orderNumber}`} target="_blank" rel="noopener noreferrer">
            <Button>Falar via WhatsApp</Button>
          </a>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderStatusPage;
