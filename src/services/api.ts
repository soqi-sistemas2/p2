
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Order, OrderItem, StoreSettings, PaymentMethod } from "@/types";

// Funções para categorias
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image
  }));
};

// Funções para produtos
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    categoryId: item.category_id,
    available: item.available,
    featured: item.featured || false
  }));
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('available', true)
    .order('name');
  
  if (error) throw error;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    categoryId: item.category_id,
    available: item.available,
    featured: item.featured || false
  }));
};

// Funções para pedidos
export const createOrder = async (order: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order> => {
  // Mapeia os campos do frontend para o formato esperado pelo banco
  const orderData = {
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    total_price: order.totalPrice,
    status: order.status,
    observations: order.observations,
    payment_method: order.paymentMethod
  };
  
  // Primeiro insere o pedido
  const { data: orderResult, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (orderError) throw orderError;
  
  // Depois insere os itens do pedido
  const orderItems = items.map(item => ({
    order_id: orderResult.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
    observations: item.observations
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) throw itemsError;
  
  // Retorna o pedido no formato esperado pelo frontend
  return {
    id: orderResult.id,
    orderNumber: orderResult.order_number,
    customerName: orderResult.customer_name,
    customerPhone: orderResult.customer_phone,
    totalPrice: orderResult.total_price,
    status: orderResult.status as Order['status'],
    observations: orderResult.observations,
    paymentMethod: orderResult.payment_method,
    items: [],
    createdAt: orderResult.created_at,
    updatedAt: orderResult.updated_at
  };
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('order_number', orderNumber)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return {
    id: data.id,
    orderNumber: data.order_number,
    customerName: data.customer_name,
    customerPhone: data.customer_phone,
    totalPrice: data.total_price,
    status: data.status as Order['status'],
    observations: data.observations,
    paymentMethod: data.payment_method,
    items: (data.items || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: item.price,
      observations: item.observations
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Funções para configurações da loja
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    openingHours: {
      open: data.opening_time,
      close: data.closing_time,
      days: data.open_days || []
    },
    whatsappEnabled: data.whatsapp_enabled,
    whatsappNumber: data.whatsapp_number,
    paymentMethods: (data.payment_methods || []) as PaymentMethod[],
    notificationEmail: data.notification_email,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color
  };
};

// Funções para administração
export const getAdminOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return (data || []).map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    totalPrice: order.total_price,
    status: order.status as Order['status'],
    observations: order.observations,
    paymentMethod: order.payment_method,
    items: (order.items || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: item.price,
      observations: item.observations
    })),
    createdAt: order.created_at,
    updatedAt: order.updated_at
  }));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  
  if (error) throw error;
};

// Novas funções para atualizar as configurações da loja
export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
  // Mapeia os campos do frontend para o formato esperado pelo banco
  const settingsData = {
    name: settings.name,
    logo: settings.logo,
    opening_time: settings.openingHours?.open,
    closing_time: settings.openingHours?.close,
    open_days: settings.openingHours?.days,
    whatsapp_enabled: settings.whatsappEnabled,
    whatsapp_number: settings.whatsappNumber,
    payment_methods: settings.paymentMethods,
    notification_email: settings.notificationEmail,
    primary_color: settings.primaryColor,
    secondary_color: settings.secondaryColor
  };
  
  const { data, error } = await supabase
    .from('store_settings')
    .update(settingsData)
    .eq('id', settings.id || '')
    .select()
    .single();
  
  if (error) throw error;
  
  // Mapeia os campos do banco para o formato esperado pelo frontend
  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    openingHours: {
      open: data.opening_time,
      close: data.closing_time,
      days: data.open_days || []
    },
    whatsappEnabled: data.whatsapp_enabled,
    whatsappNumber: data.whatsapp_number,
    paymentMethods: (data.payment_methods || []) as PaymentMethod[],
    notificationEmail: data.notification_email,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color
  };
};

// Função para fazer upload de imagem
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError, data } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
};
