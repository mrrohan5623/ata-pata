import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderConfirmationPage } from './pages/customer/OrderConfirmationPage';
import { TrackOrderPage } from './pages/customer/TrackOrderPage';
import { CustomerAccountPage } from './pages/customer/CustomerAccountPage';
import { PolicyPages } from './pages/customer/PolicyPages';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Product, Order } from './types';

const AppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const { addToCart, setIsCartOpen } = useShop();

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shopCategory, setShopCategory] = useState<string | undefined>(undefined);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | undefined>(undefined);
  const [accountTab, setAccountTab] = useState<string | undefined>(undefined);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct]);

  const handleNavigate = (page: string, param?: string) => {
    if (page === 'shop') {
      setShopCategory(param);
    }
    if (page === 'account' && param) {
      setAccountTab(param);
    }
    if (page === 'track-order' && param) {
      setTrackingOrderNumber(param);
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleDirectCheckout = (product: Product, quantity: number, size: string) => {
    addToCart(product, quantity, size);
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentPage('order-confirmation');
  };

  const handleTrackOrderFromConfirmation = (orderNum: string) => {
    setTrackingOrderNumber(orderNum);
    setCurrentPage('track-order');
  };

  // Render Admin Dashboard full screen
  if (currentPage === 'admin-dashboard' && isAdmin) {
    return <AdminDashboard onViewStore={() => setCurrentPage('home')} />;
  }

  // Render Admin Login
  if (currentPage === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-[#f4f2ee] flex flex-col justify-between">
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
        <main className="flex-1">
          <AdminLoginPage
            onSuccess={() => setCurrentPage('admin-dashboard')}
            onBackToStore={() => setCurrentPage('home')}
          />
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f2ee] flex flex-col justify-between">
      {/* Universal Top Navigation */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={shopCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentPage('shop')}
            onDirectCheckout={handleDirectCheckout}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBack={() => setCurrentPage('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            onTrackOrder={handleTrackOrderFromConfirmation}
            onContinueShopping={() => setCurrentPage('shop')}
          />
        )}

        {currentPage === 'track-order' && (
          <TrackOrderPage
            initialOrderNumber={trackingOrderNumber}
            onExplore={() => setCurrentPage('shop')}
          />
        )}

        {(currentPage === 'account' || currentPage === 'login') && (
          <CustomerAccountPage
            initialTab={accountTab}
            onSelectProduct={handleSelectProduct}
            onTrackOrder={(ordNum) => {
              setTrackingOrderNumber(ordNum);
              setCurrentPage('track-order');
            }}
            onExplore={() => setCurrentPage('shop')}
          />
        )}

        {/* Policy Pages */}
        {currentPage === 'policy-delivery' && (
          <PolicyPages type="delivery" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'policy-returns' && (
          <PolicyPages type="returns" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'policy-privacy' && (
          <PolicyPages type="privacy" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'policy-terms' && (
          <PolicyPages type="terms" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'faq' && (
          <PolicyPages type="faq" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'contact' && (
          <PolicyPages type="contact" onBack={() => setCurrentPage('home')} />
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onCheckout={() => setCurrentPage('checkout')}
        onExplore={() => setCurrentPage('shop')}
      />

      {/* Global Live Search Dialog */}
      <SearchModal onSelectProduct={handleSelectProduct} />

      {/* Floating Pakistani WhatsApp Concierge */}
      <WhatsAppButton />

      {/* Universal Luxury Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
}
