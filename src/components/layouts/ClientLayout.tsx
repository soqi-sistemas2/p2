import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { getStoreSettings } from '@/services/api';
import { StoreSettings } from '@/types';

interface ClientLayoutProps {
  children: ReactNode;
  title?: string;
}

const ClientLayout = ({ children, title }: ClientLayoutProps) => {
  const { totalItems } = useCart();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getStoreSettings();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações da loja:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Definir cores dinâmicas com base nas configurações
  useEffect(() => {
    if (settings?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }
    if (settings?.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    }
  }, [settings]);
  
  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        "--primary-bg": settings?.primaryColor || "#111827",
        "--secondary-bg": settings?.secondaryColor || "#1f2937"
      } as React.CSSProperties}
    >
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            {settings?.logo ? (
              <img 
                src={settings.logo} 
                alt={settings.name} 
                className="h-10 mr-2" 
              />
            ) : (
              <span className="text-xl font-bold" style={{ color: settings?.primaryColor || "#111827" }}>
                {settings?.name || "Quick Bite"}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {title && (
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
        )}
        {children}
      </main>
      
      <footer 
        className="py-8 text-white"
        style={{ backgroundColor: settings?.primaryColor || "#111827" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">{settings?.name || "Quick Bite"}</h3>
              <p className="text-gray-300">Lanches deliciosos para você</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Horário de Funcionamento</h4>
              <p className="text-gray-300">
                {settings?.openingHours ? (
                  `${settings.openingHours.open} - ${settings.openingHours.close}`
                ) : (
                  "Segunda a Domingo: 11:00 - 23:00"
                )}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Contato</h4>
              {settings?.whatsappEnabled && settings?.whatsappNumber ? (
                <p className="text-gray-300">WhatsApp: {settings.whatsappNumber}</p>
              ) : (
                <p className="text-gray-300">WhatsApp: (11) 99999-8888</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {settings?.name || "Quick Bite"}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
