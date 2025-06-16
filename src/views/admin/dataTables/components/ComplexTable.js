/* eslint-disable */

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
  Avatar,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import CreatePatientModal from './CreatePatientModal';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import * as React from 'react';
// Assets - Utilisation des icônes conformes à l'app avec tailles plus grandes
import { MdOutlineEdit, MdOutlineDelete } from 'react-icons/md';

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [data, setData] = React.useState(() => [...tableData]);
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset'
  );

  const handlePatientCreate = (newPatient) => {
    setData(prev => [...prev, newPatient]);
  };

  const handleEdit = (patient) => {
    console.log('Éditer patient:', patient);
    // Logique d'édition à implémenter
  };

  const handleDelete = (patientIndex) => {
    setData(prev => prev.filter((_, index) => index !== patientIndex));
  };

  // Fonction pour générer des initiales
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Fonction pour générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name) => {
    const colors = ['brand.500', 'blue.500', 'green.500', 'purple.500', 'orange.500', 'pink.500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const columns = [
    columnHelper.accessor('firstName', {
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
        const lastName = info.row.original.lastName;
        const fullName = `${firstName} ${lastName}`;
        
        return (
          <Flex align="center" py="2">
            <Avatar
              size="sm"
              name={fullName}
              bg={getAvatarColor(fullName)}
              color="white"
              fontWeight="bold"
              me="12px"
            />
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
    columnHelper.accessor('birthDate', {
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
        <Box>
          <Text color={textColor} fontSize="sm" fontWeight="600">
            {info.getValue()}
          </Text>
          <Badge
            colorScheme="blue"
            variant="subtle"
            fontSize="xs"
            borderRadius="full"
            px="2"
          >
            {(() => {
              const birthDate = new Date(info.getValue().split('/').reverse().join('-'));
              const today = new Date();
              const age = today.getFullYear() - birthDate.getFullYear();
              return `${age} ans`;
            })()}
          </Badge>
        </Box>
      ),
    }),
    columnHelper.accessor('createdDate', {
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
          const createdDate = new Date(info.getValue().split('/').reverse().join('-'));
          const today = new Date();
          const diffTime = Math.abs(today - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        };

        return (
          <Box>
            <Text color={textColor} fontSize="sm" fontWeight="600">
              {info.getValue()}
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
          </Box>
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
        <HStack spacing="3">
          <Tooltip label="Éditer le patient" hasArrow>
            <IconButton
              aria-label="Éditer"
              icon={<MdOutlineEdit size="22px" />}
              size="md"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleEdit(info.row.original)}
              _hover={{ bg: 'blue.50', transform: 'scale(1.05)' }}
              _active={{ transform: 'scale(0.95)' }}
              borderRadius="10px"
              transition="all 0.2s"
              w="40px"
              h="40px"
            />
          </Tooltip>
          <Tooltip label="Supprimer le patient" hasArrow>
            <IconButton
              aria-label="Supprimer"
              icon={<MdOutlineDelete size="22px" />}
              size="md"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleDelete(info.row.index)}
              _hover={{ bg: 'red.50', transform: 'scale(1.05)' }}
              _active={{ transform: 'scale(0.95)' }}
              borderRadius="10px"
              transition="all 0.2s"
              w="40px"
              h="40px"
            />
          </Tooltip>
        </HStack>
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

      {/* Barre de recherche - Identique à celle du header */}
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
                      pe="10px"
                      borderColor={borderColor}
                      cursor={header.column.getCanSort() ? "pointer" : "default"}
                      onClick={header.column.getToggleSortingHandler()}
                      _hover={header.column.getCanSort() ? { bg: hoverBg } : {}}
                      transition="all 0.2s"
                      py="20px"
                    >
                      <Flex
                        justifyContent="space-between"
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

      {/* Footer avec pagination (optionnel) */}
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