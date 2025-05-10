import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tag, 
  Settings, 
  BarChart2,
  LogOut,
  Menu,
  X,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { getStoreSettings } from '@/services/api';
import { StoreSettings } from '@/types';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Categorias', href: '/admin/categories', icon: Tag },
    { name: 'Relatórios', href: '/admin/reports', icon: BarChart2 },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
    { name: 'Aparência', href: '/admin/appearance', icon: Palette },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getStoreSettings();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações da loja:', error);
      }
    };

    loadSettings();
  }, []);
  
  const handleLogout = () => {
    // Simulação de logout
    toast.success('Logout realizado com sucesso!');
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transition-transform transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ backgroundColor: settings?.primaryColor || '#111827' }}
          >
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
              <div className="text-xl text-white font-bold flex items-center">
                {settings?.logo ? (
                  <img 
                    src={settings.logo} 
                    alt={settings.name} 
                    className="h-8 mr-2" 
                  />
                ) : null}
                {settings?.name || 'Quick Bite'}
              </div>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile navigation */}
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 ${
                      location.pathname === item.href
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="absolute bottom-4 w-full px-4">
              <Button 
                variant="outline" 
                className="w-full text-white border-white hover:bg-gray-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div 
          className="flex flex-col h-full bg-gray-800"
          style={{ backgroundColor: settings?.primaryColor || '#111827' }}
        >
          <div className="flex items-center h-16 px-4 bg-gray-900">
            <div className="text-xl text-white font-bold flex items-center">
              {settings?.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.name} 
                  className="h-8 mr-2" 
                />
              ) : null}
              {settings?.name || 'Quick Bite'}
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full text-white border-white hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            
            <div className="flex items-center">
              <div className="hidden lg:block">
                <span className="text-sm text-gray-500">Administrador</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
