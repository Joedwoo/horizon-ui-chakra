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
  Select,
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
    name: "",
    status: "Approved",
    date: "",
    progress: 0,
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
    if (formData.name && formData.date) {
      const newPatient = {
        name: formData.name,
        status: formData.status,
        date: formData.date,
        progress: parseInt(formData.progress)
      };
      onPatientCreate(newPatient);
      setFormData({
        name: "",
        status: "Approved",
        date: "",
        progress: 0,
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
                    Nom du patient
                  </FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Entrez le nom du patient"
                    variant="auth"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Statut
                  </FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    variant="auth"
                  >
                    <option value="Approved">Approuvé</option>
                    <option value="Disable">Désactivé</option>
                    <option value="Error">Erreur</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Date
                  </FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    variant="auth"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor} fontSize="sm" fontWeight="500">
                    Progression (%)
                  </FormLabel>
                  <Input
                    name="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleInputChange}
                    placeholder="0-100"
                    variant="auth"
                  />
                </FormControl>
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