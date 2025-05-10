import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    
    toast.success(`${product.name} adicionado ao carrinho`);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  if (!product.available) {
    return null;
  }

  return (
    <Card className="overflow-hidden h-full">
      {product.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <span className="font-medium text-primary">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <Button 
          onClick={handleAddToCart} 
          disabled={isAdding}
          size="sm"
          className="w-full"
        >
          <Plus className="mr-1 h-4 w-4" /> Adicionar
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
