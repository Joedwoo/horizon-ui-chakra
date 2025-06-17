import { supabase, TABLES } from '../lib/supabase';
import { storageService } from './storageService';

export const patientService = {
  // Récupérer tous les patients de l'utilisateur connecté
  async getPatients() {
    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Créer un nouveau patient
  async createPatient(patientData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .insert([
        {
          user_id: user.id,
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          birth_date: patientData.birthDate,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Créer automatiquement le dossier de stockage pour ce patient
    try {
      await storageService.createPatientFolder(user.id, data.id, `${data.first_name}_${data.last_name}`);
      console.log(`Dossier créé pour le patient: ${data.first_name} ${data.last_name}`);
    } catch (storageError) {
      console.warn('Erreur lors de la création du dossier patient:', storageError.message);
      // Ne pas faire échouer la création du patient si le stockage ne fonctionne pas
    }

    return data;
  },

  // Mettre à jour un patient
  async updatePatient(patientId, patientData) {
    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .update({
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        birth_date: patientData.birthDate,
      })
      .eq('id', patientId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Supprimer un patient
  async deletePatient(patientId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Supprimer d'abord le dossier de stockage du patient
    try {
      await storageService.deletePatientFolder(user.id, patientId);
      console.log(`Dossier supprimé pour le patient: ${patientId}`);
    } catch (storageError) {
      console.warn('Erreur lors de la suppression du dossier patient:', storageError.message);
    }

    const { error } = await supabase
      .from(TABLES.PATIENTS)
      .delete()
      .eq('id', patientId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  // Rechercher des patients
  async searchPatients(searchTerm) {
    const { data, error } = await supabase
      .from(TABLES.PATIENTS)
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};