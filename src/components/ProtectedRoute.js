import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Flex, Spinner, Text, Alert, AlertIcon, Button } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        direction="column"
        bg="gray.50"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
          mb="4"
        />
        <Text color="gray.500" fontSize="lg" mb="2">
          Chargement...
        </Text>
        <Text color="gray.400" fontSize="sm" textAlign="center" maxW="400px">
          Vérification de votre session d'authentification
        </Text>
      </Flex>
    );
  }

  // Vérifier si Supabase est configuré
  if (!process.env.REACT_APP_SUPABASE_URL || 
      !process.env.REACT_APP_SUPABASE_ANON_KEY ||
      process.env.REACT_APP_SUPABASE_URL.includes('placeholder') ||
      process.env.REACT_APP_SUPABASE_ANON_KEY.includes('placeholder')) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        direction="column"
        bg="gray.50"
        p="8"
      >
        <Alert status="warning" borderRadius="lg" maxW="500px" mb="6">
          <AlertIcon />
          <div>
            <Text fontWeight="bold" mb="2">Configuration Supabase requise</Text>
            <Text fontSize="sm">
              Veuillez configurer vos clés Supabase dans le fichier .env pour utiliser l'authentification.
            </Text>
          </div>
        </Alert>
        <Button
          colorScheme="blue"
          onClick={() => window.location.reload()}
        >
          Recharger la page
        </Button>
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;