import { Container, Image, VStack, Heading } from '@chakra-ui/react';
import React from 'react';
import logoblack from '../../assets/images/logoblack.png';
import * as colors from '../../utils/colors';

function index() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Image src={logoblack} alt="StudyTogether" />
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <Heading as="h2" size="2xl">
          Recover your account!
        </Heading>
        <VStack spacing="20px">
          Please enter your email and we'll send you a link to get back into
          your account.
        </VStack>
        <VStack spacing="20px" align="stretch">
          <Input
            errorBorderColor="crimson"
            isInvalid={errors.email}
            placeholder="email"
            onChange={handleEmailChange}
            value={loginDetails.email}
          />
        </VStack>
        <Button
          onClick={handleSubmit}
          colorScheme="green"
          bg={colors.green.dark}
          style={{ alignSelf: 'flex-start' }}
          // isLoading
          // spinner={<BeatLoader size={8} color="white" />}
          _hover={{ bg: colors.green.medium }}
          borderColor={colors.green.dark}
          _active={{
            bg: colors.green.light,
            transform: 'scale(0.98)',
            borderColor: colors.green.dark,
          }}
          _focus={{
            boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
          }}
          isLoading={authState.loading || false}
        >
          Send me a
        </Button>
      </VStack>
    </Container>
  );
}

export default index;
