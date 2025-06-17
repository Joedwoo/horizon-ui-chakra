import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../services/storageService';

export const useUserStorage = () => {
  const { user } = useAuth();
  const [storageStats, setStorageStats] = useState({
    fileCount: 0,
    totalSize: 0,
    totalSizeMB: '0.00'
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les données de stockage
  const loadStorageData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [stats, userFiles] = await Promise.all([
        storageService.getUserStorageStats(user.id),
        storageService.listUserFiles(user.id)
      ]);
      
      setStorageStats(stats);
      setFiles(userFiles);
    } catch (error) {
      console.error('Erreur lors du chargement des données de stockage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Uploader un fichier
  const uploadFile = async (file, folder = '') => {
    if (!user || !file) return { success: false, error: 'Paramètres manquants' };

    try {
      const result = await storageService.uploadFile(user.id, file, file.name, folder);
      await loadStorageData(); // Recharger les données
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Supprimer un fichier
  const deleteFile = async (fileName, folder = '') => {
    if (!user || !fileName) return { success: false, error: 'Paramètres manquants' };

    try {
      const result = await storageService.deleteFile(user.id, fileName, folder);
      await loadStorageData(); // Recharger les données
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Obtenir l'URL d'un fichier
  const getFileUrl = async (fileName, folder = '') => {
    if (!user || !fileName) return null;

    try {
      return await storageService.getFileUrl(user.id, fileName, folder);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL:', error);
      return null;
    }
  };

  // Créer un sous-dossier
  const createFolder = async (folderName) => {
    if (!user || !folderName) return { success: false, error: 'Paramètres manquants' };

    try {
      const result = await storageService.createSubFolder(user.id, folderName);
      await loadStorageData(); // Recharger les données
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Charger les données au montage et quand l'utilisateur change
  useEffect(() => {
    loadStorageData();
  }, [user]);

  return {
    storageStats,
    files,
    loading,
    uploadFile,
    deleteFile,
    getFileUrl,
    createFolder,
    refreshData: loadStorageData
  };
};