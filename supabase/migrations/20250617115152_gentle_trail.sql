/*
  # Création du bucket User_storage

  1. Bucket
    - Créer le bucket "User_storage" pour le stockage utilisateur
    - Configuration publique pour permettre l'accès aux fichiers

  2. Politiques de sécurité
    - Les utilisateurs peuvent seulement accéder à leur propre dossier
    - Lecture, écriture et suppression limitées au dossier utilisateur
*/

-- Créer le bucket User_storage s'il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public)
VALUES ('User_storage', 'User_storage', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre aux utilisateurs de voir leurs propres fichiers
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'User_storage' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Politique pour permettre aux utilisateurs d'uploader dans leur dossier
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'User_storage' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs fichiers
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'User_storage' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Politique pour permettre aux utilisateurs de supprimer leurs fichiers
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'User_storage' AND (storage.foldername(name))[1] = auth.uid()::text);