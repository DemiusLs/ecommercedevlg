import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Alert from '../components/Alert';



const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
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
    const [compareList, setCompareList] = useState([]);

    // variabili useState per componente ALERT
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');


    //chiamata axios per prendere le stampe
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
    //useeffect per settare il local storage
    useEffect(() => {
        fetchProducts();
        const visited = localStorage.getItem('boolshop_visited');
        if (visited) {
            setShowWelcomePopup(false);
        }
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    //useffect all'attivazione del cambio dello stato della wishlist
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);


    //funzione componente ALERT
    const showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };


    //funzione di aggiunta al carrello
    const addToCart = (product) => {
        console.log(product)
        setCart(prevCart => {
            const existing = prevCart.find(item => item.slug === product.slug);

            const existingQuantity = existing ? existing.quantity : 0;
            const totalRequested = existingQuantity + product.quantity;

            if (totalRequested > product.stock) {
                if (totalRequested > product.stock) {
                    showAlert(`Hai superato la quantità disponibile per "${product.name}". Disponibili: ${product.stock}`, `error`);
                    return prevCart;
                }
            } else {
                // Show success feedback
                showAlert(`${product.name} aggiunto al carrello!`, 'success');
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


    //funzione di rimozione dal carrello
    const removeFromCart = (productSlug) => {
        setCart(prevCart => prevCart.filter(item => item.slug !== productSlug));
    };


    //funzione di cancellazione carrello
    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    //funzione di cambio stato del cuoricino wishlist
    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.slug === product.slug);
            if (exists) {
                return prev.filter(item => item.slug !== product.slug);
            } else {
                return [...prev, product];
            }
        });
    };


    //funzione di controllo se prodotto già interno alla wishlist
    const isInWishlist = (product) => {
        if (!product) return false; // protezione se product è null/undefined
        return wishlist.some(item => item.slug === product.slug);
    };


    //funzione di aggiunta alla wishlist
    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (!prev.find(item => item.slug === product.slug)) {
                return [...prev, product];
            }
            return prev; // se già presente, non aggiunge
        });
    };


    //funzione di rimozione della wishlist
    const removeFromWishlist = (productSlug) => {
        setWishlist(prev => prev.filter(item => item.slug !== productSlug));
    };


    //funzione di una completa rimozione della wishlist
    const clearWishlist = () => {
        setWishlist([]);
        localStorage.removeItem('wishlist'); // opzionale: se la salvi su localStorage
    };


    //funzioni per il confronto prodotti, fatte solamente per esercizio ma non per funzionalità poichè non possiamo confrontare due prodotti d'arte
    // aggiungi prodotto a confronto
    const addToCompare = (product) => {
        setCompareList((prev) => {
            if (prev.find(p => p.slug === product.slug)) {
                showAlert(`${product.name} è già presente nella lista di confronto.`, `error`);
                return prev;
            }
            if (prev.length >= 3) {
                showAlert("Puoi confrontare al massimo 3 prodotti.", `error`);
                return prev;
            }
            showAlert(`${product.name} aggiunto alla lista di confronto.`);
            return [...prev, product];
        });
    };


    // rimuovi prodotto da confronto
    const removeFromCompare = (slug) => {
        setCompareList(prev => prev.filter(p => p.slug !== slug));
    };

    const showPopup = (message, type = 'success') => {
        setPopup({ message, type });
    };

    const value = {
        products,
        setProducts,
        cart,
        setCart,
        isLoading,
        error,
        showWelcomePopup,
        showAlert,
        sortBy,
        viewMode,
        addToCart,
        removeFromCart,
        clearCart,
        setSortBy,
        setViewMode,
        hideWelcomePopup: () => setShowWelcomePopup(false),
        wishlist,
        toggleWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearWishlist,
        showPopup,
    };

    return (
        <AppContext.Provider value={value}>
            {children}

            {/* ALERT GLOBALE */}
            <Alert
                message={alertMessage}
                visible={alertVisible}
                type={alertType}
                onClose={() => setAlertVisible(false)}
            />
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