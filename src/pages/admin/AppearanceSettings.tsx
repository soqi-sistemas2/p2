import { useState, useEffect, ChangeEvent } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { getStoreSettings, updateStoreSettings, uploadImage } from '@/services/api';
import { StoreSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Upload } from 'lucide-react';

const AppearanceSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getStoreSettings();
        setSettings(data);
        if (data?.logo) {
          setLogoPreview(data.logo);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar configurações. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      let logoUrl = settings.logo;
      
      // Upload da logo, se houver nova imagem
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logos', 'store');
      }
      
      // Atualiza as configurações
      const updatedSettings = await updateStoreSettings({
        ...settings,
        logo: logoUrl,
      });
      
      setSettings(updatedSettings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title="Aparência">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Aparência">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Logo e Cores</CardTitle>
            <CardDescription>
              Personalize a aparência da sua loja virtual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo da Lanchonete</Label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-40 h-40 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Upload className="mx-auto h-12 w-12" />
                      <p className="text-sm">Sem logo</p>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <p className="text-xs text-gray-500">
                    Recomendação: Imagem quadrada (1:1) com no mínimo 200x200 pixels. 
                    Formatos: PNG ou JPG.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 border rounded-md" 
                    style={{ backgroundColor: settings?.primaryColor || '#111827' }}
                  ></div>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings?.primaryColor || '#111827'}
                    onChange={(e) => setSettings(prev => 
                      prev ? { ...prev, primaryColor: e.target.value } : null
                    )}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Esta cor será usada para cabeçalhos, botões e elementos principais.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 border rounded-md" 
                    style={{ backgroundColor: settings?.secondaryColor || '#1f2937' }}
                  ></div>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings?.secondaryColor || '#1f2937'}
                    onChange={(e) => setSettings(prev => 
                      prev ? { ...prev, secondaryColor: e.target.value } : null
                    )}
                    className="w-full"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Esta cor será usada para detalhes, bordas e elementos secundários.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Pré-visualização</h3>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-4 text-white"
                  style={{ backgroundColor: settings?.primaryColor || '#111827' }}
                >
                  <div className="flex items-center">
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Logo" 
                        className="h-8 w-8 mr-2 object-contain"
                      />
                    )}
                    <span className="font-bold">{settings?.name || 'Quick Bite'}</span>
                  </div>
                  <div>Menu</div>
                </div>
                
                <div className="p-4">
                  <div 
                    className="p-2 rounded-md text-white inline-block mb-4"
                    style={{ backgroundColor: settings?.primaryColor || '#111827' }}
                  >
                    Botão Primário
                  </div>
                  
                  <div 
                    className="p-2 border rounded-md inline-block ml-2 mb-4"
                    style={{ 
                      borderColor: settings?.secondaryColor || '#1f2937',
                      color: settings?.secondaryColor || '#1f2937'
                    }}
                  >
                    Botão Secundário
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppearanceSettings;
