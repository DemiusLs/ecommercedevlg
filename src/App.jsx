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

const App = () => {
  return (
    <AppProvider>
      <Router>
        <GuestLayout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/search" element={<Gallery />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WelcomePopup />
        </GuestLayout>
      </Router>
    </AppProvider>
  );
};

export default App
