import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';



const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [searchParams] = useSearchParams();
    const initialViewMode = searchParams.get('view') || 'grid';
    const initialSortBy = searchParams.get('sort') || 'newest';
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showWelcomePopup, setShowWelcomePopup] = useState(true);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [viewMode, setViewMode] = useState(initialViewMode);

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
            const existing = prevCart.find(item => item.slug === product.slug);

            const existingQuantity = existing ? existing.quantity : 0;
            const totalRequested = existingQuantity + product.quantity;

            if (totalRequested > product.stock) {
                alert(`Hai superato la quantità disponibile per "${product.name}". Disponibili: ${product.stock}`);
                return prevCart;
            } else {
                // Show success feedback
                alert(`${product.name} aggiunto al carrello!`)
            }

            if (existing) {
                return prevCart.map(item =>
                    item.slug === product.slug
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );

            }
            return [...prevCart, product];
        });
    };

    const removeFromCart = (productSlug) => {
        setCart(prevCart => prevCart.filter(item => item.slug !== productSlug));
    };

    const clearCart = () => {
        setCart([]);
    };

    const value = {
        products,
        setProducts,
        cart,
        setCart,
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