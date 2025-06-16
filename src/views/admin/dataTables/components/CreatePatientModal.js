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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import CardHorizon from "components/card/CardHorizon";

const CreatePatientModal = ({ onPatientCreate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "brand.400");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.birthDate) {
      const newPatient = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        createdDate: new Date().toLocaleDateString('fr-FR')
      };
      onPatientCreate(newPatient);
      setFormData({
        firstName: "",
        lastName: "",
        birthDate: "",
      });
      onClose();
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        bg={brandColor}
        color="white"
        _hover={{ bg: "brand.600" }}
        _active={{ bg: "brand.700" }}
        borderRadius="xl"
        px="5"
        py="3"
        fontSize="base"
        fontWeight="medium"
        transition="all 0.2s"
      >
        Créer un patient
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent mx="auto" my="auto" maxW="450px">
          <ModalBody p="0">
            <CardHorizon extra="px-[30px] pt-[35px] pb-[40px] max-w-[450px] flex flex-col">
              <Text
                color={textColor}
                fontSize="2xl"
                fontWeight="bold"
                mb="20px"
              >
                Créer un nouveau patient
              </Text>
              
              <VStack spacing="20px" align="stretch">
                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Prénom <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Entrez le prénom"
                    variant="auth"
                    isRequired
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Nom <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Entrez le nom de famille"
                    variant="auth"
                    isRequired
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Date de naissance <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    variant="auth"
                    isRequired
                  />
                </FormControl>

                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  La date de création sera automatiquement ajoutée lors de la création du patient.
                </Text>
              </VStack>

              <HStack spacing="2" mt="30px">
                <Button
                  onClick={onClose}
                  variant="outline"
                  borderColor="red.500"
                  color="red.500"
                  _hover={{ bg: "red.50" }}
                  _active={{ bg: "red.100" }}
                  borderRadius="xl"
                  px="5"
                  py="3"
                  fontSize="base"
                  fontWeight="medium"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  bg="gray.100"
                  color="navy.700"
                  _hover={{ bg: "gray.200" }}
                  _active={{ bg: "gray.300" }}
                  borderRadius="xl"
                  px="5"
                  py="3"
                  fontSize="base"
                  fontWeight="medium"
                  isDisabled={!formData.firstName || !formData.lastName || !formData.birthDate}
                >
                  Créer le patient
                </Button>
              </HStack>
            </CardHorizon>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePatientModal;