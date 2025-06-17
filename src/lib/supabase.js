import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl);
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Définie' : 'Non définie');
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env');
}

// Vérification que les valeurs ne sont pas des placeholders
if (supabaseUrl.includes('votre-projet-id') || supabaseAnonKey.includes('votre-vraie-cle')) {
  throw new Error('Veuillez remplacer les valeurs placeholder dans votre fichier .env par vos vraies clés Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types pour les tables
export const TABLES = {
  PATIENTS: 'patients'
};

// Fonction utilitaire pour vérifier la connexion
export const testSupabaseConnection = async () => {
  try {
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