/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";

// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/marketplace/components/Banner";
import NFT from "components/card/NFT";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Flex
        direction='column'
        w='100%'
        mb='20px'>
        <Banner />
        <Flex direction='column'>
          <Flex
            mt='45px'
            mb='20px'
            justifyContent='space-between'
            direction={{ base: "column", md: "row" }}
            align={{ base: "start", md: "center" }}>
            <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
              Trending NFTs
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap='20px' mb='20px'>
            <NFT
              name='Abstract Colors'
              author='15 Jan 2024'
              image={Nft1}
              status='success'
              download='#'
            />
            <NFT
              name='ETH AI Brain'
              author='22 Dec 2023'
              image={Nft2}
              status='error'
              download='#'
            />
            <NFT
              name='Mesh Gradients '
              author='08 Mar 2024'
              image={Nft3}
              status='warning'
              download='#'
            />
            <NFT
              name='Swipe Circles'
              author='03 Feb 2024'
              image={Nft4}
              status='info'
              download='#'
            />
            <NFT
              name='Colorful Heaven'
              author='28 Nov 2023'
              image={Nft5}
              status='success'
              download='#'
            />
            <NFT
              name='3D Cubes Art'
              author='12 Jan 2024'
              image={Nft6}
              status='warning'
              download='#'
            />
          </SimpleGrid>
        </Flex>
      </Flex>
      {/* Delete Product */}
    </Box>
  );
}