
import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreSettings } from '@/types';
import { toast } from '@/components/ui/sonner';

// Mock initial settings
const initialSettings: StoreSettings = {
  name: 'Quick Bite',
  logo: undefined,
  openingHours: {
    open: '11:00',
    close: '23:00',
    days: [0, 1, 2, 3, 4, 5, 6], // 0 = Sunday, 6 = Saturday
  },
  whatsappEnabled: true,
  whatsappNumber: '5511999998888',
  paymentMethods: ['cash', 'credit', 'debit', 'pix'],
  notificationEmail: 'contato@quickbite.com'
};

const Settings = () => {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  
  const weekDays = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
  ];
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePaymentMethodChange = (method: 'cash' | 'credit' | 'debit' | 'pix', checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        paymentMethods: [...settings.paymentMethods, method]
      });
    } else {
      setSettings({
        ...settings,
        paymentMethods: settings.paymentMethods.filter(m => m !== method)
      });
    }
  };
  
  const handleDayChange = (day: number, checked: boolean) => {
    if (checked) {
      setSettings({
        ...settings,
        openingHours: {
          ...settings.openingHours,
          days: [...settings.openingHours.days, day].sort()
        }
      });
    } else {
      setSettings({
        ...settings,
        openingHours: {
          ...settings.openingHours,
          days: settings.openingHours.days.filter(d => d !== day)
        }
      });
    }
  };
  
  return (
    <AdminLayout title="Configurações">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua lanchonete.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nome da Lanchonete</Label>
                <Input
                  id="store-name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Digite o nome da sua lanchonete"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Dias de Funcionamento</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={settings.openingHours.days.includes(day.value)}
                        onCheckedChange={(checked) => 
                          handleDayChange(day.value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`day-${day.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening-time">Horário de Abertura</Label>
                  <Input
                    id="opening-time"
                    type="time"
                    value={settings.openingHours.open}
                    onChange={(e) => setSettings({
                      ...settings,
                      openingHours: {
                        ...settings.openingHours,
                        open: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="closing-time">Horário de Fechamento</Label>
                  <Input
                    id="closing-time"
                    type="time"
                    value={settings.openingHours.close}
                    onChange={(e) => setSettings({
                      ...settings,
                      openingHours: {
                        ...settings.openingHours,
                        close: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de WhatsApp</CardTitle>
              <CardDescription>
                Configure a integração com WhatsApp para receber pedidos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.whatsappEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, whatsappEnabled: checked })}
                  id="whatsapp-enabled"
                />
                <Label htmlFor="whatsapp-enabled">Ativar integração com WhatsApp</Label>
              </div>
              
              {settings.whatsappEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-2 rounded-l-md border">+</span>
                    <Input
                      id="whatsapp-number"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="5511999998888"
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Formato: código do país + código de área + número (ex: 5511999998888)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Configure os métodos de pagamento aceitos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-cash"
                    checked={settings.paymentMethods.includes('cash')}
                    onCheckedChange={(checked) => 
                      handlePaymentMethodChange('cash', checked as boolean)
                    }
                  />
                  <label
                    htmlFor="payment-cash"
                    className="text-sm font-medium leading-none"
                  >
                    Dinheiro
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-credit"
                    checked={settings.paymentMethods.includes('credit')}
                    onCheckedChange={(checked) => 
                      handlePaymentMethodChange('credit', checked as boolean)
                    }
                  />
                  <label
                    htmlFor="payment-credit"
                    className="text-sm font-medium leading-none"
                  >
                    Cartão de Crédito
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-debit"
                    checked={settings.paymentMethods.includes('debit')}
                    onCheckedChange={(checked) => 
                      handlePaymentMethodChange('debit', checked as boolean)
                    }
                  />
                  <label
                    htmlFor="payment-debit"
                    className="text-sm font-medium leading-none"
                  >
                    Cartão de Débito
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payment-pix"
                    checked={settings.paymentMethods.includes('pix')}
                    onCheckedChange={(checked) => 
                      handlePaymentMethodChange('pix', checked as boolean)
                    }
                  />
                  <label
                    htmlFor="payment-pix"
                    className="text-sm font-medium leading-none"
                  >
                    PIX
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure as notificações por e-mail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-email">E-mail para Notificações</Label>
                <Input
                  id="notification-email"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                  placeholder="seuemail@exemplo.com"
                />
                <p className="text-xs text-gray-500">
                  Este e-mail receberá notificações de novos pedidos e outras atualizações importantes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
