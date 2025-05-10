import { Product, Category, Order } from '../types';

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Hambúrgueres",
    description: "Deliciosos hambúrgueres artesanais"
  },
  {
    id: "2",
    name: "Bebidas",
    description: "Refrigerantes, sucos e bebidas"
  },
  {
    id: "3",
    name: "Porções",
    description: "Porções para compartilhar"
  },
  {
    id: "4",
    name: "Sobremesas",
    description: "Doces para finalizar sua refeição"
  }
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "X-Tudo",
    description: "Hambúrguer com queijo, bacon, ovo, alface, tomate e maionese",
    price: 22.90,
    image: "https://source.unsplash.com/random/300x200/?burger",
    categoryId: "1",
    available: true,
    featured: true
  },
  {
    id: "2",
    name: "X-Salada",
    description: "Hambúrguer com queijo, alface, tomate e maionese",
    price: 18.90,
    image: "https://source.unsplash.com/random/300x200/?burger-salad",
    categoryId: "1",
    available: true
  },
  {
    id: "3",
    name: "Coca-Cola 350ml",
    description: "Refrigerante Coca-Cola Lata 350ml",
    price: 5.90,
    image: "https://source.unsplash.com/random/300x200/?coke",
    categoryId: "2",
    available: true
  },
  {
    id: "4",
    name: "Batata Frita",
    description: "Porção de batata frita crocante",
    price: 12.90,
    image: "https://source.unsplash.com/random/300x200/?fries",
    categoryId: "3",
    available: true,
    featured: true
  },
  {
    id: "5",
    name: "Pudim",
    description: "Pudim de leite condensado",
    price: 8.90,
    image: "https://source.unsplash.com/random/300x200/?pudding",
    categoryId: "4",
    available: true
  }
];

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD001",
    customerName: "João Silva",
    customerPhone: "5511999998888",
    items: [
      {
        id: "item1",
        productId: "1",
        productName: "X-Tudo",
        quantity: 1,
        price: 22.90
      },
      {
        id: "item2",
        productId: "3",
        productName: "Coca-Cola 350ml",
        quantity: 1,
        price: 5.90
      }
    ],
    totalPrice: 28.80,
    status: "preparing",
    observations: "Sem cebola, por favor",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: "2",
    orderNumber: "ORD002",
    customerName: "Maria Oliveira",
    customerPhone: "5511988887777",
    items: [
      {
        id: "item3",
        productId: "2",
        productName: "X-Salada",
        quantity: 2,
        price: 18.90
      }
    ],
    totalPrice: 37.80,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  }
];

export const storeSettings = {
  name: "Quick Bite",
  logo: "https://source.unsplash.com/random/100x100/?logo",
  openingHours: {
    open: "11:00",
    close: "23:00",
    days: [1, 2, 3, 4, 5, 6, 0], // Segunda-domingo
  },
  whatsappEnabled: true,
  whatsappNumber: "5511999998888",
  paymentMethods: ["cash", "credit", "debit", "pix"],
  notificationEmail: "contato@quickbite.com"
};
