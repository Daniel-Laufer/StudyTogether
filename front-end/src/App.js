import React from 'react';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import cat from './assets/images/cat.jpeg';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        Study Together
        <img src={cat} alt="cat" />
      </Box>
    </ChakraProvider>
  );
}

export default App;
