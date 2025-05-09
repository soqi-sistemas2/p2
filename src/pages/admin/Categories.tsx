import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { mockCategories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';
import { toast } from '@/components/ui/sonner';
import { Search, PlusCircle, Edit, Trash, ImageIcon } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      setFilteredCategories(
        categories.filter(category => 
          category.name.toLowerCase().includes(lowerQuery) ||
          (category.description && category.description.toLowerCase().includes(lowerQuery))
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  };
  
  const handleDelete = (categoryId: string) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    
    // In a real app, this would make an API call
    const remainingCategories = categories.filter(category => category.id !== categoryId);
    setCategories(remainingCategories);
    setFilteredCategories(filteredCategories.filter(category => category.id !== categoryId));
    
    toast.success(`Categoria "${categoryName}" removida com sucesso`);
  };
  
  return (
    <AdminLayout title="Categorias">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar categorias..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        {category.image ? (
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      Nenhuma categoria encontrada
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

export default Categories;
