
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { AppProvider } from './context/AppContext'
import GuestLayout from "./layout/GuestLayout"



function App() {


  return (
    <AppProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
