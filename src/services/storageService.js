import { supabase } from '../lib/supabase';

export const storageService = {
  // Nom du bucket pour le stockage utilisateur
  BUCKET_NAME: 'User_storage',

  // Créer le dossier utilisateur lors de la première connexion/inscription
  async createUserFolder(userId) {
    try {
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
      throw error;
    }
  },

  // Uploader un fichier dans le dossier utilisateur
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