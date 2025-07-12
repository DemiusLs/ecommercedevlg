import axios from 'axios';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
    products: [],
    cart: [],
    searchQuery: '',
    searchResults: [],
    isLoading: false,
    error: null,
    viewMode: 'grid', // 'grid' or 'list'
    sortBy: 'newest',
    showWelcomePopup: true,
    discount: null
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        case 'ADD_TO_CART':
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            }
            return { ...state, cart: [...state.cart, action.payload] };
        case 'UPDATE_CART_ITEM':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload)
            };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        case 'HIDE_WELCOME_POPUP':
            return { ...state, showWelcomePopup: false };
        case 'SET_DISCOUNT':
            return { ...state, discount: action.payload };
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Check if user has visited before
    useEffect(() => {
        const fetchProducts = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                const response = await axios.get('http://localhost:3000/api/prints');

                if (response.data && Array.isArray(response.data.data)) {
                    dispatch({ type: 'SET_PRODUCTS', payload: response.data.data });
                } else {
                    dispatch({ type: 'SET_ERROR', payload: 'Formato dei dati non valido' });
                }
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: 'Errore nel caricamento dei prodotti' });
            }

        };

        fetchProducts();

        const hasVisited = localStorage.getItem('boolshop_visited');
        if (hasVisited) {
            dispatch({ type: 'HIDE_WELCOME_POPUP' });
        }
    }, []);


    const value = {
        ...state,
        dispatch
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};