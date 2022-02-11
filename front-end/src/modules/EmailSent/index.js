import { Container, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import logoblack from '../../assets/images/logoblack.png';

function EmailSent() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Image src={logoblack} alt="StudyTogether" />
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <Text>
          If you have an account on StudyTogether, you will receive an email
          from us very soon.
        </Text>
      </VStack>
    </Container>
  );
}

export default EmailSent;
