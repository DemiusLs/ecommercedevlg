import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import GuestLayout from './layout/GuestLayout';
import Homepage from './pages/Homepage';
import Gallery from './pages/Gallery';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import WelcomePopup from './components/WelcomePopup.jsx';

<<<<<<< HEAD
const App = () => {
=======
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { AppProvider } from './context/AppContext'
import GuestLayout from "./layout/GuestLayout"



function App() {


>>>>>>> 062f2304c117a871f851c48c702fe616a5f567a8
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
