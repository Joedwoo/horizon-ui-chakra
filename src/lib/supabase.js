import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl);
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Définie' : 'Non définie');
  
  // Créer un client factice pour éviter les erreurs
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null })
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
      update: () => ({ data: null, error: { message: 'Supabase non configuré' } }),
      delete: () => ({ error: { message: 'Supabase non configuré' } })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
  
  console.warn('⚠️ Supabase non configuré - utilisation du mode démo');
} else {
  // Vérification que les valeurs ne sont pas des placeholders
  if (supabaseUrl.includes('votre-projet-id') || 
      supabaseAnonKey.includes('votre-vraie-cle') ||
      supabaseUrl.includes('placeholder') ||
      supabaseAnonKey.includes('placeholder')) {
    
    console.warn('⚠️ Détection de valeurs placeholder dans la configuration Supabase');
    
    // Créer un client factice
    export const supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase invalide' } }),
        signUp: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase invalide' } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase invalide' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase invalide' } }),
        delete: () => Promise.resolve({ error: { message: 'Configuration Supabase invalide' } })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase invalide' } }),
          list: () => Promise.resolve({ data: [], error: null }),
          remove: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    };
  } else {
    // Configuration normale
    export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
}

// Types pour les tables
export const TABLES = {
  PATIENTS: 'patients'
};

// Fonction utilitaire pour vérifier la connexion
export const testSupabaseConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.includes('placeholder') || 
        supabaseAnonKey.includes('placeholder')) {
      console.log('Supabase non configuré - mode démo actif');
      return false;
    }
    
    const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      return false;
    }
    console.log('Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.error('Erreur de test de connexion:', error);
    return false;
  }
};