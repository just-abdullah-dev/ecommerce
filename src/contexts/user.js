"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  
  // Load persisted data from localStorage on initial render
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData !== "undefined") {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const setUser = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const deleteUser = () => {
    setUserData(null);
    localStorage.removeItem("userData");
  };

  const getUserData = () => userData;

  return (
    <UserContext.Provider
      value={{
        user: userData,
        setUser,
        deleteUser,
        getUserData,
      }}
    >
      {children} 
    </UserContext.Provider>
  );
}

// Hook for accessing UserContext
export default function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must  must be used within a UserProvider");
  }
  return context;
}
