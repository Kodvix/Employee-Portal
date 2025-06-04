


import React, { useState, useEffect } from "react";
import styles from "./EMSLoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logos/kodvix-logo.png";
import { validateLogin } from "../../utils/validation";
import { useAuth } from "../../context/AuthContext"; // Import the auth context
import axios from "axios";

const EMSLoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated, userRole } = useAuth(); // Use auth context

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("EMPLOYEE");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole.toUpperCase() === "ADMIN") {
        navigate("/Admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setUserType((prev) => [...prev, value]);
    } else {
      setUserType((prev) => prev.filter((type) => type !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setEmailError("");
    setPasswordError("");
    setRoleError("");
    setLoginError("");

    const errors = validateLogin(email, password);
    setEmailError(errors.email || "");
    setPasswordError(errors.password || "");

    if (userType.length !== 1) {
      setRoleError("Please select exactly one role.");
      return;
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      const selectedRole = userType[0].toUpperCase();
      const result = await authLogin(email, password, selectedRole);

      if (result.success) {
        console.log("Login successful");
        console.log("Role:", result.role);
        console.log("Employee ID:", result.employeeId); // Will be null for admin
        
        // Navigate based on role
        if (result.role === "ADMIN") {
          console.log("Redirecting to Admin Dashboard - Employee ID is null for admin");
          navigate("/Admin-dashboard");
        } else {
          console.log("Redirecting to Employee Dashboard - Employee ID:", result.employeeId);
          navigate("/employee-dashboard");
        }
      } else {
        setLoginError(result.error);
      }
      
    } catch (error) {
      console.error("Unexpected login error:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    try {
      setIsLoading(true);
      const response = await axios.post('http://192.168.1.10/:8080/api/auth/register', {
        email: registerEmail,
        password: registerPassword,
        role: registerRole
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration successful:', response.data);
      setRegisterSuccess(`${registerRole} registered successfully`);
      
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterRole("EMPLOYEE");
      
      setTimeout(() => {
        setIsRegistering(false);
        setRegisterSuccess("");
      }, 2000);

    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response) {
        setRegisterError(error.response.data.message || "Registration failed. Please try again.");
      } else if (error.request) {
        setRegisterError("No response from server. Please try again later.");
      } else {
        setRegisterError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <img src={logo} alt="KodVix Logo" className={styles.logo} />
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Welcome to Kodvix Suit</h1>
          <p className={styles.subtitle}>Employee Management System</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>{isRegistering ? "Register" : "Sign In"}</h2>
          
          {isRegistering ? (
            <>
              {registerError && <div className={styles.errorBanner}>{registerError}</div>}
              {registerSuccess && <div className={styles.successBanner}>{registerSuccess}</div>}
              <form className={styles.form} onSubmit={handleRegister}>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Role</label>
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    required
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </button>

                <div className={styles.switchForm}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className={styles.switchButton}
                    onClick={() => setIsRegistering(false)}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {loginError && <div className={styles.errorBanner}>{loginError}</div>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {emailError && <p className={styles.error}>{emailError}</p>}
                </div>

                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {passwordError && <p className={styles.error}>{passwordError}</p>}
                </div>

                <div>
                  <label>Select Role</label>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="userType"
                        value="employee"
                        checked={userType.includes("employee")}
                        onChange={handleCheckboxChange}
                      />
                      Employee
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="userType"
                        value="admin"
                        checked={userType.includes("admin")}
                        onChange={handleCheckboxChange}
                      />
                      Admin
                    </label>
                  </div>
                  {roleError && <p className={styles.error}>{roleError}</p>}
                </div>

                <div className={styles.forgotPassword}>
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
{/* 
                <div className={styles.switchForm}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className={styles.switchButton}
                    onClick={() => setIsRegistering(true)}
                  >
                    Register
                  </button>
                </div> */}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMSLoginPage;