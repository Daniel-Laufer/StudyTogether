import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Image,
  VStack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Alert,
  AlertIcon,
  Text,
  Box,
} from '@chakra-ui/react';
import logoblack from '../../assets/images/logoblack.png';
import * as colors from '../../utils/colors';

function ResetPassword() {
  const [firstPassword, setFirstPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [errors, setErrors] = useState({
    isSame: false,
    isFirstPassword: false,
    noTyping: true,
  });
  const [showFirstPassword, setShowFirstPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      setErrors({
        ...errors,
        isFirstPassword: firstPassword.length < 6,
        isSame: secondPassword !== firstPassword,
        noTyping: false,
      });
    } else isMounted.current = true;
  }, [firstPassword, secondPassword]);

  // Will handle API calls here
  const handleSubmit = () => {};

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Image src={logoblack} alt="StudyTogether" />{' '}
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <InputGroup size="md">
          <Input
            isInvalid={errors.isFirstPassword}
            pr="4.5rem"
            type={showFirstPassword ? 'text' : 'password'}
            placeholder="Enter password"
            onChange={e => {
              setFirstPassword(e.target.value);
            }}
            value={firstPassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              _hover={{
                boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
              }}
              _focus={{
                boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
              }}
              onClick={() => setShowFirstPassword(!showFirstPassword)}
            >
              {showFirstPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup size="md">
          <Input
            isInvalid={errors.isSame}
            pr="4.5rem"
            type={showSecondPassword ? 'text' : 'password'}
            placeholder="Enter password"
            onChange={e => {
              setSecondPassword(e.target.value);
              setErrors({
                ...errors,
                isSame: secondPassword !== firstPassword,
              });
            }}
            value={secondPassword}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              _hover={{
                boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
              }}
              _focus={{
                boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
              }}
              onClick={() => setShowSecondPassword(!showSecondPassword)}
            >
              {showSecondPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        {(errors.isSame || errors.isFirstPassword) && (
          <Alert status="error">
            <AlertIcon />
            <div>
              {errors.isSame ? (
                <Box w="100%">
                  <Text>The passwords do not match.</Text>
                </Box>
              ) : (
                ''
              )}
              {errors.isFirstPassword ? (
                <Box>
                  <Text>
                    The passwords length must be greater than 6 characters.
                  </Text>
                </Box>
              ) : (
                ''
              )}
            </div>
          </Alert>
        )}

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
          isDisabled={
            errors.isSame || errors.isFirstPassword || errors.noTyping
          }
        >
          Change Password
        </Button>
      </VStack>
    </Container>
  );
}

export default ResetPassword;
