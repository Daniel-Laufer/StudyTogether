/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  theme,
  Heading,
  Center,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import axios from 'axios';
import groupOnBooks from '../../assets/images/grouponbooks.jpeg';

function LandingPage() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/')
      .then(res => {
        setNames([...names, 'daniel']);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Heading>Study Together</Heading>
        <Center>
          <img src={groupOnBooks} alt="cat" />
        </Center>
        Users retrieved from the back-end (which are stored in a database)
        <Center>
          <UnorderedList>
            {names.map((name, i) => (
              <ListItem key={i}>{name}</ListItem>
            ))}
          </UnorderedList>
        </Center>
      </Box>
    </ChakraProvider>
  );
}

export default LandingPage;
