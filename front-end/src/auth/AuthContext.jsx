// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import Swal from 'sweetalert2';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const login = async (username, password) => {

        try {
            if (username === 'admin' && password === 'pwd') {
                const data = {
                    username: 'admin',
                    role: 'admin',
                    token: 'dummy-token-1234'
                };
                setUser(data);
                localStorage.setItem('token', data.token);
                setError(null);
                return true; // Login successful
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid credentials',
                });
                return false; // Login failed
            }
        } catch (err) {

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials',
            });
            return false;
        }
    };



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
