import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Badge,
  HStack,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import CreatePatientModal from './CreatePatientModal';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import * as React from 'react';
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';
import { patientService } from '../../../services/patientService';

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );

  // Charger les patients au montage du composant
  React.useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patients = await patientService.getPatients();
      setData(patients);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les patients",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientCreate = async (newPatientData) => {
    try {
      const patient = await patientService.createPatient(newPatientData);
      setData(prev => [patient, ...prev]);
      
      toast({
        title: "Patient créé avec succès",
        description: `${patient.first_name} ${patient.last_name} a été ajouté à la liste des patients.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le patient",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleEdit = (patient) => {
    console.log('Éditer patient:', patient);
    // TODO: Implémenter la modal d'édition
  };

  const handleDelete = async (patient) => {
    try {
      await patientService.deletePatient(patient.id);
      setData(prev => prev.filter(p => p.id !== patient.id));
      
      toast({
        title: "Patient supprimé",
        description: `${patient.first_name} ${patient.last_name} a été supprimé.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le patient",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  // Fonction pour générer des initiales
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour calculer l'âge
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const columns = [
    columnHelper.accessor('first_name', {
      id: 'patient',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Patient
        </Text>
      ),
      cell: (info) => {
        const firstName = info.getValue();
        const lastName = info.row.original.last_name;
        const fullName = `${firstName} ${lastName}`;
        
        return (
          <Flex align="center" py="2" justify="flex-start">
            <Box
              w="40px"
              h="40px"
              borderRadius="50%"
              bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              me="12px"
              color="white"
              fontWeight="bold"
              fontSize="sm"
              boxShadow="0 4px 12px rgba(67, 24, 255, 0.15)"
            >
              {getInitials(firstName, lastName)}
            </Box>
            <Box>
              <Text color={textColor} fontSize="sm" fontWeight="700">
                {fullName}
              </Text>
              <Text color={textColorSecondary} fontSize="xs">
                Patient #{info.row.index + 1}
              </Text>
            </Box>
          </Flex>
        );
      },
    }),
    columnHelper.accessor('birth_date', {
      id: 'birthDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Date de naissance
        </Text>
      ),
      cell: (info) => (
        <Flex direction="column" align="center" justify="center">
          <Text color={textColor} fontSize="sm" fontWeight="600" mb="1">
            {formatDate(info.getValue())}
          </Text>
          <Badge
            colorScheme="blue"
            variant="subtle"
            fontSize="xs"
            borderRadius="full"
            px="2"
          >
            {calculateAge(info.getValue())} ans
          </Badge>
        </Flex>
      ),
    }),
    columnHelper.accessor('created_at', {
      id: 'createdDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Date de création
        </Text>
      ),
      cell: (info) => {
        const isRecent = () => {
          const createdDate = new Date(info.getValue());
          const today = new Date();
          const diffTime = Math.abs(today - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        };

        return (
          <Flex direction="column" align="center" justify="center">
            <Text color={textColor} fontSize="sm" fontWeight="600" mb="1">
              {formatDate(info.getValue())}
            </Text>
            {isRecent() && (
              <Badge
                colorScheme="green"
                variant="subtle"
                fontSize="xs"
                borderRadius="full"
                px="2"
              >
                Nouveau
              </Badge>
            )}
          </Flex>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Actions
        </Text>
      ),
      cell: (info) => (
        <Flex justify="center" align="center">
          <HStack spacing="4">
            <Tooltip label="Éditer le patient" hasArrow>
              <Box
                as="button"
                onClick={() => handleEdit(info.row.original)}
                _hover={{ 
                  transform: 'scale(1.1)',
                  filter: 'brightness(1.1)'
                }}
                _active={{ transform: 'scale(0.95)' }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <MdOutlineEdit 
                  size="24px" 
                  style={{
                    background: 'linear-gradient(135deg, #4299E1 0%, #3182CE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(66, 153, 225, 0.3))'
                  }}
                />
              </Box>
            </Tooltip>
            <Tooltip label="Supprimer le patient" hasArrow>
              <Box
                as="button"
                onClick={() => handleDelete(info.row.original)}
                _hover={{ 
                  transform: 'scale(1.1)',
                  filter: 'brightness(1.1)'
                }}
                _active={{ transform: 'scale(0.95)' }}
                transition="all 0.2s"
                cursor="pointer"
              >
                <MdOutlineDelete 
                  size="24px" 
                  style={{
                    background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 4px rgba(245, 101, 101, 0.3))'
                  }}
                />
              </Box>
            </Tooltip>
          </HStack>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  if (loading) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        boxShadow={cardShadow}
      >
        <Flex px="25px" py="20px" justifyContent="center" align="center">
          <Text color={textColorSecondary}>Chargement des patients...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
      boxShadow={cardShadow}
    >
      {/* Header avec titre et actions */}
      <Flex px="25px" py="20px" justifyContent="space-between" align="center" borderBottom="1px solid" borderColor={borderColor}>
        <Box>
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
            mb="4px"
          >
            Gestion des Patients
          </Text>
          <Text color={textColorSecondary} fontSize="sm">
            {data.length} patient{data.length > 1 ? 's' : ''} enregistré{data.length > 1 ? 's' : ''}
          </Text>
        </Box>
        <CreatePatientModal onPatientCreate={handlePatientCreate} />
      </Flex>

      {/* Barre de recherche */}
      <Flex px="25px" py="15px" align="center" borderBottom="1px solid" borderColor={borderColor}>
        <SearchBar
          placeholder="Rechercher un patient..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          w={{ base: "100%", md: "300px" }}
          borderRadius="30px"
        />
      </Flex>

      {/* Tableau */}
      <Box>
        <Table variant="simple" color="gray.500">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      px="20px"
                      borderColor={borderColor}
                      cursor={header.column.getCanSort() ? "pointer" : "default"}
                      onClick={header.column.getToggleSortingHandler()}
                      _hover={header.column.getCanSort() ? { bg: hoverBg } : {}}
                      transition="all 0.2s"
                      py="20px"
                      textAlign="center"
                    >
                      <Flex
                        justifyContent="center"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <Tr 
                  key={row.id}
                  _hover={{ bg: hoverBg }}
                  transition="all 0.2s"
                  borderBottom={index === table.getRowModel().rows.length - 1 ? "none" : "1px solid"}
                  borderColor={borderColor}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td
                        key={cell.id}
                        fontSize={{ sm: '14px' }}
                        minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                        borderColor="transparent"
                        py="20px"
                        px="20px"
                        textAlign={cell.column.id === 'patient' ? 'left' : 'center'}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        {/* Message si aucun résultat */}
        {table.getRowModel().rows.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py="40px"
            px="20px"
          >
            <Text color={textColorSecondary} fontSize="lg" fontWeight="600" mb="2">
              Aucun patient trouvé
            </Text>
            <Text color={textColorSecondary} fontSize="sm" textAlign="center">
              {globalFilter 
                ? "Essayez de modifier votre recherche ou créez un nouveau patient."
                : "Commencez par créer votre premier patient."
              }
            </Text>
          </Flex>
        )}
      </Box>

      {/* Footer avec pagination */}
      {data.length > 0 && (
        <Flex px="25px" py="15px" justify="space-between" align="center" borderTop="1px solid" borderColor={borderColor}>
          <Text color={textColorSecondary} fontSize="sm">
            Affichage de {table.getRowModel().rows.length} patient{table.getRowModel().rows.length > 1 ? 's' : ''}
          </Text>
          <HStack spacing="2">
            <Text color={textColorSecondary} fontSize="xs">
              Total : {data.length} patient{data.length > 1 ? 's' : ''}
            </Text>
          </HStack>
        </Flex>
      )}
    </Card>
  );
}