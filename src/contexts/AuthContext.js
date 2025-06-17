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
      try {
        console.log('🔍 Vérification de la session...');
        
        // Vérifier si Supabase est configuré
        if (!process.env.REACT_APP_SUPABASE_URL || 
            !process.env.REACT_APP_SUPABASE_ANON_KEY ||
            process.env.REACT_APP_SUPABASE_URL.includes('placeholder') ||
            process.env.REACT_APP_SUPABASE_ANON_KEY.includes('placeholder')) {
          console.warn('⚠️ Supabase non configuré - mode démo');
          setUser(null);
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          setUser(null);
        } else {
          console.log('Session récupérée:', session ? 'Utilisateur connecté' : 'Pas de session');
          setUser(session?.user ?? null);
          
          // Initialiser le stockage si l'utilisateur est connecté
          if (session?.user) {
            try {
              await storageService.initializeUserStorage(session.user.id);
            } catch (error) {
              console.warn('Stockage non disponible:', error.message);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        setUser(null);
      } finally {
        console.log('✅ Initialisation de l\'authentification terminée');
        setLoading(false);
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Changement d\'état d\'authentification:', event);
        setUser(session?.user ?? null);
        
        // Initialiser le stockage lors de la connexion ou inscription
        if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
          try {
            await storageService.initializeUserStorage(session.user.id);
            console.log('Stockage utilisateur initialisé avec succès');
          } catch (error) {
            console.warn('Erreur lors de l\'initialisation du stockage:', error.message);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Nettoyage de l\'abonnement auth');
      subscription?.unsubscribe();
    };
  }, []);

  // Fonction de connexion
  const signIn = async (email, password) => {
    console.log('🔐 Tentative de connexion pour:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erreur de connexion:', error);
    } else {
      console.log('✅ Connexion réussie');
    }
    
    return { data, error };
  };

  // Fonction d'inscription
  const signUp = async (email, password) => {
    console.log('📝 Tentative d\'inscription pour:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Erreur d\'inscription:', error);
    } else {
      console.log('✅ Inscription réussie');
    }
    
    return { data, error };
  };

  // Fonction de déconnexion
  const signOut = async () => {
    console.log('🚪 Déconnexion...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur de déconnexion:', error);
    } else {
      console.log('✅ Déconnexion réussie');
    }
    
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