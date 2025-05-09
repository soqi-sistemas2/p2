
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";

// Páginas do Cliente
import Index from "@/pages/Index";
import MenuPage from "@/pages/client/MenuPage";
import CartPage from "@/pages/client/CartPage";
import CheckoutPage from "@/pages/client/CheckoutPage";
import OrderStatusPage from "@/pages/client/OrderStatusPage";

// Páginas do Admin
import Login from "@/pages/admin/Login";
import ForgotPassword from "@/pages/admin/ForgotPassword";
import ResetPassword from "@/pages/admin/ResetPassword";
import Dashboard from "@/pages/admin/Dashboard";
import Orders from "@/pages/admin/Orders";
import Products from "@/pages/admin/Products";
import Categories from "@/pages/admin/Categories";
import Reports from "@/pages/admin/Reports";
import Settings from "@/pages/admin/Settings";
import AppearanceSettings from "@/pages/admin/AppearanceSettings";
import NotFound from "@/pages/NotFound";

import "./App.css";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rotas do Cliente */}
            <Route path="/" element={<Index />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-status/:orderNumber" element={<OrderStatusPage />} />

            {/* Rotas do Admin */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/appearance" element={<AppearanceSettings />} />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </CartProvider>
    </>
  );
}

export default App;
