// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const login = (username, password, role) => {
        if (username === 'admin' && password === 'pwd') {
            localStorage.setItem('role', role);
            return true
        }
        else if (username === 'agnt' && password === 'pwd') {
            localStorage.setItem('role', role);
            return true
        }
        else {
            return false
        }
    }




    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
