
import { useState, useEffect } from 'react';
import ClientLayout from '@/components/layouts/ClientLayout';
import ProductCard from '@/components/client/ProductCard';
import { Category, Product } from '@/types';
import { getCategories, getProducts, getProductsByCategory } from '@/services/api';
import { toast } from '@/components/ui/sonner';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carregar categorias
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        
        if (fetchedCategories.length > 0) {
          setActiveCategory(fetchedCategories[0].id);
          
          // Carregar produtos da primeira categoria
          const fetchedProducts = await getProductsByCategory(fetchedCategories[0].id);
          setProducts(fetchedProducts);
        } else {
          // Se não houver categorias, carrega todos os produtos
          const allProducts = await getProducts();
          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar o cardápio. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCategoryChange = async (categoryId: string) => {
    setActiveCategory(categoryId);
    setLoading(true);
    
    try {
      const fetchedProducts = await getProductsByCategory(categoryId);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos da categoria:', error);
      toast.error('Erro ao carregar produtos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout title="Cardápio">
      {/* Categorias */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2 whitespace-nowrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter(product => product.available).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.filter(product => product.available).length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Não há produtos disponíveis nesta categoria.
          </p>
        </div>
      )}
    </ClientLayout>
  );
};

export default MenuPage;
