import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Pour le développement local, on peut utiliser des valeurs par défaut
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseAnonKey === 'your-anon-key-here') {
  console.warn('⚠️ Variables d\'environnement Supabase non configurées. Utilisation de valeurs par défaut pour le développement.');
  
  // Créer un client mock pour le développement
  export const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null } })
    },
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase non configuré' } })
      }),
      or: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      })
    })
  };
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Types pour TypeScript (optionnel mais recommandé)
export const TABLES = {
  PATIENTS: 'patients'
};