// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    // On initial load, check local storage for existing session
    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            setAuth({ user: JSON.parse(user), token });
        }
    }, []);

    const login = (userData, token) => {
        setAuth({ user: userData, token });
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setAuth({});
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };
    
    // Function to refresh user info (e.g., after plan upgrade)
    const refreshUser = (updatedData) => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...updatedData };
        setAuth(prev => ({ ...prev, user: updatedUser }));
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;