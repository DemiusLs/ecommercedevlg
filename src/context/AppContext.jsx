import React, { createContext, useContext, useReducer, useEffect } from 'react';


export const AppProvider = ({ children }) => {

    const value = []


    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};