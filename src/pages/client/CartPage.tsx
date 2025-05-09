
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ClientLayout from '@/components/layouts/ClientLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, addObservation } = useCart();
  const navigate = useNavigate();
  const [itemObservations, setItemObservations] = useState<Record<string, string>>({});
  
  const handleQuantityChange = (id: string, change: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      if (window.confirm('Deseja remover este item do carrinho?')) {
        removeItem(id);
      }
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleObservationChange = (id: string, observation: string) => {
    setItemObservations(prev => ({ ...prev, [id]: observation }));
  };
  
  const handleSaveObservation = (id: string) => {
    const observation = itemObservations[id] || '';
    addObservation(id, observation);
    toast.success('Observação salva!');
  };
  
  if (totalItems === 0) {
    return (
      <ClientLayout title="Carrinho">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Adicione alguns produtos ao seu carrinho para continuar.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Menu
            </Button>
          </Link>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout title="Carrinho">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Itens do Carrinho</h2>
            </div>
            
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex items-start">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    )}
                    
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="font-medium">
                          {(item.price * item.quantity).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        {item.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })} cada
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-3">
                        <Textarea
                          placeholder="Alguma observação? (Ex: sem cebola, sem tomate)"
                          className="text-sm"
                          rows={2}
                          value={itemObservations[item.id] || item.observations || ''}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          onBlur={() => handleSaveObservation(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Continuar comprando
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>
                  {totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>
                  {totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6"
              onClick={() => navigate('/checkout')}
            >
              Finalizar Pedido <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CartPage;
