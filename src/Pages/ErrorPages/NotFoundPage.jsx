import React from "react";
import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-box">
        <h1 className="notfound-code animate-pulse">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-message">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button className="notfound-button animate-bounce" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
