"use client";

import { useState, useEffect } from "react";



export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem("darkTheme");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkTheme", String(newDarkMode));
  };

  return (
    <header className="navbar">
      <div className="navbar-content">
        <img src="/images/Logo.png" alt="Logo" className="logo" />
        <h1 className="uni-name">The University of Abdullah (TUA)</h1>
         <h1 className="uni-nameS">TUA</h1>
       
      </div>
      <div className="navbar-actions" style={{ display: "flex", gap: "10px" }}>
       
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
