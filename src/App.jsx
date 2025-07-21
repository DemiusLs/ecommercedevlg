import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import GuestLayout from './layout/GuestLayout/GuestLayout.jsx';
import Homepage from './pages/Homepage';
import Gallery from './pages/Gallery';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound/NotFound.jsx';
import WelcomePopup from './components/WelcomePopup.jsx';
import WishlistPage from './pages/WishlistPage';
import Compare from './pages/Compare';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


function App() {



  return (
    
      <AppProvider>
        <GuestLayout>
              <Elements stripe={stripePromise}>
          <Routes>
          
            <Route path="/" element={<Homepage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/search" element={<Gallery />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
             
          </Routes>
         </Elements>
          <WelcomePopup />
        </GuestLayout>
      </AppProvider>    
  );
};

export default App
