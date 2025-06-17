import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { storageService } from '../services/storageService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      // Initialiser le stockage si l'utilisateur est connecté
      if (session?.user) {
        try {
          await storageService.initializeUserStorage(session.user.id);
        } catch (error) {
          console.error('Erreur lors de l\'initialisation du stockage:', error);
        }
      }
      
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Initialiser le stockage lors de la connexion ou inscription
        if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
          try {
            await storageService.initializeUserStorage(session.user.id);
            console.log('Stockage utilisateur initialisé avec succès');
          } catch (error) {
            console.error('Erreur lors de l\'initialisation du stockage:', error);
          }
        }
        
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Fonction de connexion
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Fonction d'inscription
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  // Fonction de déconnexion
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};