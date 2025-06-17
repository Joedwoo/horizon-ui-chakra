import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Progress,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  useToast,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useAuth } from '../../contexts/AuthContext';
import { storageService } from '../../services/storageService';
import { 
  MdCloudUpload, 
  MdFolder, 
  MdInsertDriveFile, 
  MdDelete,
  MdDownload,
  MdAdd
} from 'react-icons/md';

const UserStorageCard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [storageStats, setStorageStats] = useState({
    fileCount: 0,
    totalSize: 0,
    totalSizeMB: '0.00'
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.50');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Charger les statistiques et fichiers
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
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de stockage",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, [user]);

  // Upload de fichier
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      await storageService.uploadFile(user.id, file, file.name);
      
      toast({
        title: "Fichier uploadé",
        description: `${file.name} a été ajouté à votre stockage`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Recharger les données
      await loadStorageData();
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  // Supprimer un fichier
  const handleDeleteFile = async (fileName) => {
    if (!user) return;

    try {
      await storageService.deleteFile(user.id, fileName);
      
      toast({
        title: "Fichier supprimé",
        description: `${fileName} a été supprimé`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      await loadStorageData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le fichier",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Télécharger un fichier
  const handleDownloadFile = async (fileName) => {
    if (!user) return;

    try {
      const url = await storageService.getFileUrl(user.id, fileName);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const maxStorage = 100; // 100 MB max par utilisateur
  const usedPercentage = (parseFloat(storageStats.totalSizeMB) / maxStorage) * 100;

  return (
    <>
      <Card mb={{ base: "0px", lg: "20px" }} align='center' p="20px">
        <Flex w='100%' justify="space-between" align="center" mb="20px">
          <Text color={textColorPrimary} fontWeight='bold' fontSize='xl'>
            Mon Stockage
          </Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpen}
            leftIcon={<Icon as={MdFolder} />}
          >
            Gérer
          </Button>
        </Flex>

        <Flex
          direction="column"
          align="center"
          justify="center"
          bg={bgColor}
          borderRadius="xl"
          p="20px"
          w="100%"
          mb="20px"
        >
          <Icon as={MdCloudUpload} color={brandColor} h='40px' w='40px' mb="10px" />
          <Text color={textColorPrimary} fontWeight='bold' fontSize='lg' mb="5px">
            Espace de stockage
          </Text>
          <Text color={textColorSecondary} fontSize='sm' textAlign="center" mb="15px">
            Gérez vos fichiers personnels en toute sécurité
          </Text>
          
          <HStack spacing="4" mb="15px">
            <Badge colorScheme="blue" variant="subtle">
              {storageStats.fileCount} fichier{storageStats.fileCount > 1 ? 's' : ''}
            </Badge>
            <Badge colorScheme="green" variant="subtle">
              {storageStats.totalSizeMB} MB utilisés
            </Badge>
          </HStack>
        </Flex>

        <Box w='100%'>
          <Flex w='100%' justify='space-between' mb='10px'>
            <Text color={textColorSecondary} fontSize='sm'>
              {storageStats.totalSizeMB} MB
            </Text>
            <Text color={textColorSecondary} fontSize='sm'>
              {maxStorage} MB
            </Text>
          </Flex>
          <Progress
            value={usedPercentage}
            colorScheme={usedPercentage > 80 ? 'red' : usedPercentage > 60 ? 'orange' : 'brand'}
            size="lg"
            borderRadius="full"
            bg={useColorModeValue('gray.200', 'whiteAlpha.200')}
          />
          <Text 
            color={textColorSecondary} 
            fontSize='xs' 
            textAlign="center" 
            mt="5px"
          >
            {usedPercentage.toFixed(1)}% utilisé
          </Text>
        </Box>

        {/* Upload rapide */}
        <Box w="100%" mt="20px">
          <Input
            type="file"
            onChange={handleFileUpload}
            display="none"
            id="file-upload"
            accept="*/*"
          />
          <Button
            as="label"
            htmlFor="file-upload"
            w="100%"
            variant="outline"
            borderColor={brandColor}
            color={brandColor}
            _hover={{ bg: `${brandColor}15` }}
            leftIcon={<Icon as={MdAdd} />}
            isLoading={uploading}
            loadingText="Upload..."
            cursor="pointer"
          >
            Ajouter un fichier
          </Button>
        </Box>
      </Card>

      {/* Modal de gestion des fichiers */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={MdFolder} mr="2" color={brandColor} />
              Gestionnaire de fichiers
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            {loading ? (
              <Flex justify="center" py="40px">
                <Text color={textColorSecondary}>Chargement...</Text>
              </Flex>
            ) : files.length === 0 ? (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                py="40px"
                bg={bgColor}
                borderRadius="lg"
                border="2px dashed"
                borderColor={borderColor}
              >
                <Icon as={MdCloudUpload} color={textColorSecondary} h='40px' w='40px' mb="10px" />
                <Text color={textColorSecondary} textAlign="center">
                  Aucun fichier dans votre stockage
                </Text>
                <Text color={textColorSecondary} fontSize="sm" textAlign="center" mt="5px">
                  Utilisez le bouton "Ajouter un fichier" pour commencer
                </Text>
              </Flex>
            ) : (
              <List spacing="3">
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    p="3"
                    bg={bgColor}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center">
                        <Icon as={MdInsertDriveFile} color={brandColor} mr="3" />
                        <Box>
                          <Text color={textColorPrimary} fontWeight="500" fontSize="sm">
                            {file.name}
                          </Text>
                          <Text color={textColorSecondary} fontSize="xs">
                            {file.metadata?.size ? 
                              `${(file.metadata.size / 1024).toFixed(1)} KB` : 
                              'Taille inconnue'
                            }
                          </Text>
                        </Box>
                      </Flex>
                      <HStack spacing="1">
                        <Tooltip label="Télécharger">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            icon={<Icon as={MdDownload} />}
                            onClick={() => handleDownloadFile(file.name)}
                          />
                        </Tooltip>
                        <Tooltip label="Supprimer">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            icon={<Icon as={MdDelete} />}
                            onClick={() => handleDeleteFile(file.name)}
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserStorageCard;