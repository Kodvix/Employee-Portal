// src/utils/validation.js

// Email regex for basic validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation function
export const validateLogin = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = 'Enter your email';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Enter your password';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors; // Return an object with potential error messages
};
