import {
  Container,
  Image,
  VStack,
  Heading,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiURL } from '../../utils/constants';
import logoblack from '../../assets/images/logoblack.png';
import * as colors from '../../utils/colors';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // function taken from https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = e =>
    String(e)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const handleEmailChange = e => {
    setEmail(e.target.value);
    return setError(!validateEmail(email));
  };

  // the API request need to be handled here
  const handleSubmit = () => {
    const body = { email };
    axios
      .post(`${apiURL}/forgot`, body)
      .then(() => {
        navigate('/email-sent');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Image src={logoblack} alt="StudyTogether" />
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <Heading as="h2" size="2xl">
          Recover your account!
        </Heading>
        <VStack spacing="20px">
          <Text>
            Please enter your email and we will send you a link to get back into
            your account.
          </Text>
        </VStack>
        <VStack spacing="20px" align="stretch">
          <Input
            errorBorderColor="crimson"
            isInvalid={error}
            placeholder="email"
            onChange={handleEmailChange}
            value={email}
          />
        </VStack>
        <Link to="/email-sent">
          <Button
            onClick={handleSubmit}
            colorScheme="green"
            bg={colors.green.dark}
            style={{ alignSelf: 'flex-start' }}
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
            isDisabled={email === '' || error}
          >
            Send me a link
          </Button>
        </Link>
      </VStack>
    </Container>
  );
}

export default ForgotPassword;
