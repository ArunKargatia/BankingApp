import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(sessionStorage.getItem('token') || null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = sessionStorage.getItem("darkMode");
        if (savedMode === "true") {
          setIsDarkMode(true);
          document.body.classList.add("dark");
        }
      }, []);
    
      const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
          const newMode = !prevMode;
          if (newMode) {
            document.body.classList.add("dark");
            sessionStorage.setItem("darkMode", "true");
          } else {
            document.body.classList.remove("dark");
            sessionStorage.setItem("darkMode", "false");
          }
          return newMode;
        });
      };

    useEffect(() => {
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false)
        }
    }, [token])

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (token && isTokenExpired(token)) {
                logout(); 
            }
        };

        const interval = setInterval(checkTokenExpiration, 60 * 1000); 
        return () => clearInterval(interval); 
    }, [token]);

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now(); 
        } catch (error) {
            console.error("Invalid token:", error);
            return true; 
        }
    };

    const getCustomerIdFromToken = () => {
        if (!token) {
            console.log("Token is missing");
            return null;
        }
        try {
            const decoded = jwtDecode(token);
            return decoded.customerId || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const login = (newToken) => {
        setToken(newToken);
        sessionStorage.setItem('token', newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token'); 
        setIsAuthenticated(false);
    };


    return (
        <AuthContext.Provider 
            value={{
                token, 
                isAuthenticated, 
                login, 
                logout, 
                getCustomerIdFromToken,
                isDarkMode,
                toggleDarkMode,
                }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}