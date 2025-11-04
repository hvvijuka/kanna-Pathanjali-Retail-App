
// -----------------------------
// File: src/context/AuthContext.js
// -----------------------------
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    // small demo: load from sessionStorage if any
    try { return JSON.parse(sessionStorage.getItem('pr_user')) || null; } catch(e){ return null }
  });

  const login = (payload) => {
    setUser(payload);
    sessionStorage.setItem('pr_user', JSON.stringify(payload));
  };
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('pr_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}