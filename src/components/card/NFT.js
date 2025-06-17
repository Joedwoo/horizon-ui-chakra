// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";

export default function NFT(props) {
  const { image, name, author, download, status = "success" } = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");

  // Configuration des statuts avec icônes et couleurs (sans warning/attention)
  const statusConfig = {
    success: {
      icon: MdCheckCircle,
      color: "green.500",
      bgColor: "green.50",
      borderColor: "green.200",
      label: "Vérifié",
      colorScheme: "green"
    },
    error: {
      icon: MdError,
      color: "red.500",
      bgColor: "red.50",
      borderColor: "red.200",
      label: "Erreur",
      colorScheme: "red"
    },
    info: {
      icon: MdInfo,
      color: "blue.500",
      bgColor: "blue.50",
      borderColor: "blue.200",
      label: "Info",
      colorScheme: "blue"
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.success;

  return (
    <Card p='20px'>
      <Flex direction={{ base: "column" }} justify='center'>
        <Box mb={{ base: "20px", "2xl": "20px" }} position='relative'>
          <Image
            src={image}
            w={{ base: "100%", "3xl": "100%" }}
            h={{ base: "100%", "3xl": "100%" }}
            borderRadius='20px'
          />
          <Button
            position='absolute'
            bg='white'
            _hover={{ bg: "whiteAlpha.900" }}
            _active={{ bg: "white" }}
            _focus={{ bg: "white" }}
            p='0px !important'
            top='14px'
            right='14px'
            borderRadius='50%'
            minW='36px'
            h='36px'
            onClick={() => {
              setLike(!like);
            }}>
            <Icon
              transition='0.2s linear'
              w='20px'
              h='20px'
              as={like ? IoHeart : IoHeartOutline}
              color='brand.500'
            />
          </Button>
        </Box>
        <Flex flexDirection='column' justify='space-between' h='100%'>
          <Flex
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mb='auto'>
            <Flex direction='column'>
              <Text
                color={textColor}
                fontSize={{
                  base: "xl",
                  md: "lg",
                  lg: "lg",
                  xl: "lg",
                  "2xl": "md",
                  "3xl": "lg",
                }}
                mb='5px'
                fontWeight='bold'
                me='14px'>
                {name}
              </Text>
              <Text
                color='secondaryGray.600'
                fontSize={{
                  base: "sm",
                }}
                fontWeight='400'
                me='14px'>
                {author}
              </Text>
            </Flex>
          </Flex>
          <Flex
            align='start'
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt='25px'>
            
            {/* Badge de statut avec icône */}
            <Flex 
              align="center" 
              justify="center"
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}
            >
              <Badge
                colorScheme={currentStatus.colorScheme}
                variant="subtle"
                fontSize="sm"
                borderRadius="full"
                px="3"
                py="1"
                display="flex"
                alignItems="center"
                gap="1"
              >
                <Icon 
                  as={currentStatus.icon} 
                  w="14px" 
                  h="14px"
                />
                {currentStatus.label}
              </Badge>
            </Flex>

            <Link
              href={download}
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}>
              <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'>
                Place Bid
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}