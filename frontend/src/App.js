import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import SellerSignup from './components/Auth/SellerSignup';
import UserSignup from './components/Auth/UserSignup';
import Login from './components/Auth/Login';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import SellerDashboard from './components/Seller/SellerDashboard';
import OrderConfirmation from './components/Checkout/OrderConfirmation';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Home />
              </>
            } />
            <Route path="/seller/signup" element={<SellerSignup />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/admin" element={<SellerDashboard />} />
            <Route path="/admin/*" element={<SellerDashboard />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;