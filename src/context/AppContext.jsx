import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showWelcomePopup, setShowWelcomePopup] = useState(true);
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState("grid");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/prints`);
            if (res.data.data) {
                setProducts(res.data.data);
            } else {
                setError('Dati non validi');
            }
        } catch {
            setError('Errore nel caricamento');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {


        fetchProducts();

        const visited = localStorage.getItem('boolshop_visited');
        if (visited) {
            setShowWelcomePopup(false);
        }
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            }
            return [...prevCart, product];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const value = {
        products,
        setProducts,
        cart,
        isLoading,
        error,
        showWelcomePopup,
        sortBy,
        viewMode,
        addToCart,
        removeFromCart,
        clearCart,
        setSortBy,
        setViewMode,
        hideWelcomePopup: () => setShowWelcomePopup(false),
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext deve essere usato dentro un AppProvider');
    }
    return context;
};