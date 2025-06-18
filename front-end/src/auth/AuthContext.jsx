// auth/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_KEYS } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  };

  // Login function
  const login = (token, userData) => {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    setUser(null);
  };

  // Check auth state on initial load
  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    if (token) {
      // You might want to validate the token here
      setUser({}); // Set some basic user data if needed
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


// // AuthContext.js
// import React, { createContext, useContext, useState } from 'react';
// import Swal from 'sweetalert2';
// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [error, setError] = useState(null);

//     const login = (username, password, role) => {
//         if (username === 'admin' && password === 'pwd') {
//             localStorage.setItem('role', role);
//             return true
//         }
//         else if (username === 'agnt' && password === 'pwd') {
//             localStorage.setItem('role', role);
//             return true
//         }
//         else {
//             return false
//         }
//     }




//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('accessToken');
//         localStorage.clear();
//     };


//     return (
//         <AuthContext.Provider value={{ user, login, logout, error }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);
