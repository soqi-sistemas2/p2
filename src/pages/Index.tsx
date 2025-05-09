
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/layouts/ClientLayout';
import { getStoreSettings } from '@/services/api';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Carregar configurações da loja
    const loadSettings = async () => {
      try {
        await getStoreSettings();
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        // Redirecionar para a página de menu em vez de ficar em loop
        navigate('/menu');
      }
    };
    
    loadSettings();
  }, [navigate]);
  
  return (
    <ClientLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Quick Bite</h1>
          <p className="text-xl text-gray-600">Carregando...</p>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Index;
