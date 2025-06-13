


import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Set up axios interceptor to add token to all requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          logout();
          navigate("/");
          // You could use a toast notification here instead of an alert
          alert("Your session has expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Check token on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("userRole");
      const user = localStorage.getItem("user");
      const empId = localStorage.getItem("employeeId");

      if (token) {
        try {
          // Verify token expiration
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds

          if (Date.now() >= expirationTime) {
            // Token expired
            logout();
          } else {
            // Token valid
            setIsAuthenticated(true);
            setUserRole(role);
            // Handle employeeId properly - null for admin, number for employee
            setEmployeeId(empId && empId !== "null" ? parseInt(empId) : null);
            setCurrentUser(user ? JSON.parse(user) : null);

            // Set up token expiration monitor
            const timeUntilExpiration = expirationTime - Date.now();
            setupTokenExpirationMonitor(timeUntilExpiration);
          }
        } catch (error) {
          console.error("Error checking token:", error);
          logout();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const setupTokenExpirationMonitor = (timeUntilExpiration) => {
    setTimeout(() => {
      alert("Your session has expired. Please login again.");
      logout();
      navigate("/");
    }, timeUntilExpiration);
  };

  const login = async (email, password, selectedRole) => {
    try {
      const response = await axios.post(
        "http://192.168.1.19:8080/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, role, empId } = response.data;

      // Check if selected role matches API role
      const apiRole = role.toUpperCase();
      selectedRole = selectedRole.toUpperCase();

      // Handle role matching - Admin role from API might be "Admin" or "ADMIN"
      const normalizedApiRole = apiRole === "ADMIN" || role === "Admin" ? "ADMIN" : "EMPLOYEE";

      if ((selectedRole === "ADMIN" && normalizedApiRole === "ADMIN") ||
          (selectedRole === "EMPLOYEE" && normalizedApiRole === "EMPLOYEE")) {
        
        // Create user object with proper employee ID handling
        const userData = {
          email,
          role: normalizedApiRole,
          employeeId: empId // This will be null for admin, number for employee
        };

        // Store user info in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", normalizedApiRole);
        // Handle null employeeId properly in localStorage
        localStorage.setItem("employeeId", empId !== null ? empId.toString() : "null");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update state
        setCurrentUser(userData);
        setUserRole(normalizedApiRole);
        setEmployeeId(empId); // This will be null for admin, number for employee
        setIsAuthenticated(true);

        // Setup token expiration
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = payload.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();
        setupTokenExpirationMonitor(timeUntilExpiration);

        console.log(`Login successful - Role: ${normalizedApiRole}, Employee ID: ${empId}`);
        
        return { success: true, role: normalizedApiRole, employeeId: empId };
      } else {
        return { 
          success: false, 
          error: `Access denied. Your account does not have ${selectedRole.toLowerCase()} privileges.` 
        };
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data.message || "Invalid credentials. Please try again.";
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setUserRole(null);
    setEmployeeId(null);
    setIsAuthenticated(false);
  };

  // Helper function to check if current user is admin
  const isAdmin = () => {
    return userRole === "ADMIN";
  };

  // Helper function to check if current user is employee
  const isEmployee = () => {
    return userRole === "EMPLOYEE";
  };

  // Helper function to get current employee ID (will return null for admin)
  const getCurrentEmployeeId = () => {
    return employeeId;
  };

  const value = {
    currentUser,
    userRole,
    employeeId,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    isEmployee,
    getCurrentEmployeeId,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;