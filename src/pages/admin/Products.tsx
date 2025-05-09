import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Product, Category } from '@/types';
import { toast } from '@/components/ui/sonner';
import { Search, PlusCircle, Edit, Trash } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories] = useState<Category[]>(mockCategories);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  };
  
  const handleAvailabilityToggle = (productId: string, newAvailability: boolean) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, available: newAvailability } 
        : product
    );
    
    setProducts(updatedProducts);
    setFilteredProducts(
      filteredProducts.map(product => 
        product.id === productId 
          ? { ...product, available: newAvailability } 
          : product
      )
    );
    
    const productName = products.find(p => p.id === productId)?.name;
    toast.success(`${productName} ${newAvailability ? 'disponibilizado' : 'indisponibilizado'} com sucesso`);
  };
  
  const handleDelete = (productId: string) => {
    const productName = products.find(p => p.id === productId)?.name;
    
    // In a real app, this would make an API call
    const remainingProducts = products.filter(product => product.id !== productId);
    setProducts(remainingProducts);
    setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
    
    toast.success(`Produto "${productName}" removido com sucesso`);
  };
  
  const getCategoryName = (categoryId: string) => {
    return categories.find(category => category.id === categoryId)?.name || 'Sem categoria';
  };
  
  return (
    <AdminLayout title="Produtos">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                      <TableCell>
                        {product.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.available}
                          onCheckedChange={(checked) => handleAvailabilityToggle(product.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;
