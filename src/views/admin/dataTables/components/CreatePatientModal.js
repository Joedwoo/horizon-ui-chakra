import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Icon,
  Flex,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { MdAdd, MdPerson } from "react-icons/md";

const CreatePatientModal = ({ onPatientCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });
  const [loading, setLoading] = React.useState(false);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");
  const bgColor = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (formData.firstName && formData.lastName && formData.birthDate) {
      setLoading(true);
      try {
        await onPatientCreate({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate
        });
        
        // Réinitialiser le formulaire
        setFormData({
          firstName: "",
          lastName: "",
          birthDate: "",
        });
        onClose();
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de créer le patient",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
    });
    onClose();
  };

  return (
    <>
      <Button
        onClick={onOpen}
        bg={brandColor}
        color="white"
        _hover={{ bg: "brand.600", transform: "translateY(-2px)" }}
        _active={{ bg: "brand.700", transform: "translateY(0px)" }}
        borderRadius="xl"
        px="6"
        py="3"
        fontSize="sm"
        fontWeight="600"
        transition="all 0.2s"
        leftIcon={<Icon as={MdAdd} w="20px" h="20px" />}
        boxShadow="0 4px 12px rgba(67, 24, 255, 0.15)"
      >
        Nouveau Patient
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          mx="auto" 
          my="auto" 
          maxW="500px"
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          border="1px solid"
          borderColor={borderColor}
        >
          <ModalBody p="0">
            <Box p="8">
              {/* Header avec icône */}
              <Flex align="center" mb="6">
                <Flex
                  align="center"
                  justify="center"
                  w="14"
                  h="14"
                  bg={`${brandColor}15`}
                  borderRadius="xl"
                  me="4"
                >
                  <Icon as={MdPerson} w="8" h="8" color={brandColor} />
                </Flex>
                <Box>
                  <Text
                    color={textColor}
                    fontSize="xl"
                    fontWeight="700"
                    lineHeight="1.2"
                  >
                    Nouveau Patient
                  </Text>
                  <Text
                    color="gray.500"
                    fontSize="sm"
                    mt="1"
                  >
                    Ajoutez un nouveau patient à votre base de données
                  </Text>
                </Box>
              </Flex>
              
              <VStack spacing="5" align="stretch">
                <HStack spacing="4">
                  <FormControl>
                    <FormLabel 
                      color={textColor} 
                      fontSize="sm" 
                      fontWeight="600"
                      mb="2"
                    >
                      Prénom <Text as="span" color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Ex: Jean"
                      variant="filled"
                      bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                      border="1px solid"
                      borderColor="transparent"
                      _hover={{ borderColor: brandColor }}
                      _focus={{ 
                        borderColor: brandColor,
                        bg: useColorModeValue('white', 'whiteAlpha.100'),
                        boxShadow: `0 0 0 1px ${brandColor}`
                      }}
                      isRequired
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel 
                      color={textColor} 
                      fontSize="sm" 
                      fontWeight="600"
                      mb="2"
                    >
                      Nom <Text as="span" color="red.500">*</Text>
                    </FormLabel>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ex: Dupont"
                      variant="filled"
                      bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                      border="1px solid"
                      borderColor="transparent"
                      _hover={{ borderColor: brandColor }}
                      _focus={{ 
                        borderColor: brandColor,
                        bg: useColorModeValue('white', 'whiteAlpha.100'),
                        boxShadow: `0 0 0 1px ${brandColor}`
                      }}
                      isRequired
                      size="lg"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel 
                    color={textColor} 
                    fontSize="sm" 
                    fontWeight="600"
                    mb="2"
                  >
                    Date de naissance <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    variant="filled"
                    bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                    border="1px solid"
                    borderColor="transparent"
                    _hover={{ borderColor: brandColor }}
                    _focus={{ 
                      borderColor: brandColor,
                      bg: useColorModeValue('white', 'whiteAlpha.100'),
                      boxShadow: `0 0 0 1px ${brandColor}`
                    }}
                    isRequired
                    size="lg"
                  />
                </FormControl>

                <Box 
                  bg={useColorModeValue('blue.50', 'blue.900')} 
                  p="4" 
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.700')}
                >
                  <Text fontSize="sm" color={useColorModeValue('blue.700', 'blue.200')} fontWeight="500">
                    💡 Information
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue('blue.600', 'blue.300')} mt="1">
                    La date de création sera automatiquement ajoutée lors de la création du patient.
                  </Text>
                </Box>
              </VStack>

              <HStack spacing="3" mt="8" justify="flex-end">
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  color="gray.500"
                  _hover={{ bg: "gray.100", color: "gray.700" }}
                  borderRadius="lg"
                  px="6"
                  py="2"
                  fontSize="sm"
                  fontWeight="600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText="Création..."
                  bg={brandColor}
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  _active={{ bg: "brand.700" }}
                  borderRadius="lg"
                  px="6"
                  py="2"
                  fontSize="sm"
                  fontWeight="600"
                  isDisabled={!formData.firstName || !formData.lastName || !formData.birthDate}
                  boxShadow="0 4px 12px rgba(67, 24, 255, 0.15)"
                >
                  Créer le patient
                </Button>
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePatientModal;