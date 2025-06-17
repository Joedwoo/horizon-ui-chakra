import { supabase } from '../lib/supabase';

export const storageService = {
  // Nom du bucket pour le stockage utilisateur
  BUCKET_NAME: 'User_storage',

  // Créer le dossier utilisateur lors de la première connexion/inscription
  async createUserFolder(userId) {
    try {
      // Vérifier d'abord si Supabase est configuré
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        throw new Error('Variables d\'environnement Supabase non configurées');
      }

      // Créer un fichier .keep pour initialiser le dossier utilisateur
      const keepFile = new Blob([''], { type: 'text/plain' });
      const fileName = `${userId}/.keep`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, keepFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error && !error.message.includes('already exists')) {
        throw error;
      }

      console.log(`Dossier utilisateur créé: ${userId}`);
      return { success: true, path: fileName };
    } catch (error) {
      console.error('Erreur lors de la création du dossier utilisateur:', error);
      throw error;
    }
  },

  // Créer un dossier pour un patient spécifique
  async createPatientFolder(userId, patientId, patientName) {
    try {
      // Vérifier d'abord si Supabase est configuré
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        console.warn('Variables d\'environnement Supabase non configurées - stockage désactivé');
        return { success: false, error: 'Configuration manquante' };
      }

      // Nettoyer le nom du patient pour le nom de dossier
      const cleanPatientName = patientName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const keepFile = new Blob([''], { type: 'text/plain' });
      const fileName = `${userId}/patients/${patientId}_${cleanPatientName}/.keep`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, keepFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error && !error.message.includes('already exists')) {
        throw error;
      }

      console.log(`Dossier patient créé: ${fileName}`);
      return { success: true, path: fileName };
    } catch (error) {
      console.error('Erreur lors de la création du dossier patient:', error);
      throw error;
    }
  },

  // Supprimer le dossier d'un patient
  async deletePatientFolder(userId, patientId) {
    try {
      // Lister tous les fichiers du patient
      const { data: files, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${userId}/patients`, {
          search: patientId
        });

      if (listError) {
        throw listError;
      }

      // Supprimer tous les fichiers du patient
      if (files && files.length > 0) {
        const filesToDelete = files
          .filter(file => file.name.startsWith(patientId))
          .map(file => `${userId}/patients/${file.name}`);

        if (filesToDelete.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from(this.BUCKET_NAME)
            .remove(filesToDelete);

          if (deleteError) {
            throw deleteError;
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier patient:', error);
      throw error;
    }
  },

  // Vérifier si le dossier utilisateur existe
  async checkUserFolder(userId) {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(userId, {
          limit: 1
        });

      if (error) {
        return false;
      }

      return data && data.length >= 0; // Le dossier existe même s'il est vide
    } catch (error) {
      console.error('Erreur lors de la vérification du dossier:', error);
      return false;
    }
  },

  // Initialiser le stockage utilisateur (appelé lors de la connexion/inscription)
  async initializeUserStorage(userId) {
    try {
      // Vérifier d'abord si Supabase est configuré
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
        console.warn('Variables d\'environnement Supabase non configurées - stockage désactivé');
        return { success: false, error: 'Configuration manquante' };
      }

      const folderExists = await this.checkUserFolder(userId);
      
      if (!folderExists) {
        await this.createUserFolder(userId);
        console.log(`Stockage initialisé pour l'utilisateur: ${userId}`);
      } else {
        console.log(`Stockage déjà existant pour l'utilisateur: ${userId}`);
      }

      return { success: true, userId };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du stockage:', error);
      // Ne pas faire échouer l'authentification si le stockage ne fonctionne pas
      return { success: false, error: error.message };
    }
  },

  // Uploader un fichier dans le dossier d'un patient
  async uploadFileToPatient(userId, patientId, file, fileName) {
    try {
      // Trouver le dossier du patient
      const { data: folders, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${userId}/patients`, {
          search: patientId
        });

      if (listError) {
        throw listError;
      }

      // Trouver le bon dossier patient
      const patientFolder = folders?.find(folder => folder.name.startsWith(patientId));
      
      if (!patientFolder) {
        throw new Error('Dossier patient non trouvé');
      }

      const filePath = `${userId}/patients/${patientFolder.name}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      return { success: true, path: filePath, data };
    } catch (error) {
      console.error('Erreur lors de l\'upload vers le patient:', error);
      throw error;
    }
  },

  // Uploader un fichier dans le dossier utilisateur général
  async uploadFile(userId, file, fileName, folder = '') {
    try {
      const filePath = folder 
        ? `${userId}/${folder}/${fileName}`
        : `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      return { success: true, path: filePath, data };
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  },

  // Lister les fichiers du dossier utilisateur
  async listUserFiles(userId, folder = '') {
    try {
      const path = folder ? `${userId}/${folder}` : userId;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(path);

      if (error) {
        throw error;
      }

      // Filtrer le fichier .keep
      return data.filter(file => file.name !== '.keep');
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      throw error;
    }
  },

  // Lister les fichiers d'un patient spécifique
  async listPatientFiles(userId, patientId) {
    try {
      // Trouver le dossier du patient
      const { data: folders, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${userId}/patients`, {
          search: patientId
        });

      if (listError) {
        throw listError;
      }

      const patientFolder = folders?.find(folder => folder.name.startsWith(patientId));
      
      if (!patientFolder) {
        return []; // Pas de dossier = pas de fichiers
      }

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${userId}/patients/${patientFolder.name}`);

      if (error) {
        throw error;
      }

      // Filtrer le fichier .keep
      return data.filter(file => file.name !== '.keep');
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers du patient:', error);
      throw error;
    }
  },

  // Supprimer un fichier
  async deleteFile(userId, fileName, folder = '') {
    try {
      const filePath = folder 
        ? `${userId}/${folder}/${fileName}`
        : `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },

  // Obtenir l'URL publique d'un fichier
  async getFileUrl(userId, fileName, folder = '') {
    try {
      const filePath = folder 
        ? `${userId}/${folder}/${fileName}`
        : `${userId}/${fileName}`;

      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL:', error);
      throw error;
    }
  },

  // Créer un sous-dossier dans le dossier utilisateur
  async createSubFolder(userId, folderName) {
    try {
      const keepFile = new Blob([''], { type: 'text/plain' });
      const fileName = `${userId}/${folderName}/.keep`;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, keepFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error && !error.message.includes('already exists')) {
        throw error;
      }

      return { success: true, path: fileName };
    } catch (error) {
      console.error('Erreur lors de la création du sous-dossier:', error);
      throw error;
    }
  },

  // Obtenir les statistiques de stockage utilisateur
  async getUserStorageStats(userId) {
    try {
      const files = await this.listUserFiles(userId);
      let totalSize = 0;
      let fileCount = 0;

      for (const file of files) {
        if (file.metadata && file.metadata.size) {
          totalSize += file.metadata.size;
        }
        fileCount++;
      }

      return {
        fileCount,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return { fileCount: 0, totalSize: 0, totalSizeMB: '0.00' };
    }
  }
};