
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import ClientLayout from '@/components/layouts/ClientLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { useForm } from 'react-hook-form';
import { mockOrders } from '@/data/mockData';

interface CheckoutFormData {
  name: string;
  phone: string;
  observations: string;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'pix';
}

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      name: '',
      phone: '',
      observations: '',
      paymentMethod: 'pix'
    }
  });
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulando envio do pedido
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar número de pedido
      const orderNumber = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Limpar carrinho
      clearCart();
      
      // Redirecionar para página de confirmação
      navigate(`/order/${orderNumber}`, { 
        state: { 
          orderNumber,
          customerName: data.name,
          customerPhone: data.phone
        } 
      });
      
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ClientLayout title="Finalizar Pedido">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Dados para Entrega</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome completo"
                    {...register('name', { required: 'Nome é obrigatório' })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    placeholder="DDD + número (ex: 11999998888)"
                    {...register('phone', { 
                      required: 'WhatsApp é obrigatório',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Digite um número de WhatsApp válido (apenas números)'
                      }
                    })}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="observations">Observações Gerais</Label>
                  <Textarea
                    id="observations"
                    placeholder="Alguma observação adicional sobre seu pedido?"
                    {...register('observations')}
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Método de Pagamento</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <input
                      type="radio"
                      id="payment-pix"
                      value="pix"
                      {...register('paymentMethod', { required: true })}
                      className="mb-2"
                    />
                    <Label htmlFor="payment-pix">PIX</Label>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <input
                      type="radio"
                      id="payment-credit"
                      value="credit"
                      {...register('paymentMethod', { required: true })}
                      className="mb-2"
                    />
                    <Label htmlFor="payment-credit">Crédito</Label>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <input
                      type="radio"
                      id="payment-debit"
                      value="debit"
                      {...register('paymentMethod', { required: true })}
                      className="mb-2"
                    />
                    <Label htmlFor="payment-debit">Débito</Label>
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <input
                      type="radio"
                      id="payment-cash"
                      value="cash"
                      {...register('paymentMethod', { required: true })}
                      className="mb-2"
                    />
                    <Label htmlFor="payment-cash">Dinheiro</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⚪</span> 
                      Processando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            
            <ul className="mb-4 divide-y">
              {items.map(item => (
                <li key={item.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-500">
                      {item.quantity} x {item.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </div>
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
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  {totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CheckoutPage;
