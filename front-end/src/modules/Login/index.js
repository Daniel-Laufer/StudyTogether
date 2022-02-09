import React, { useEffect, useState } from 'react';
import {
  Heading,
  Input,
  VStack,
  Container,
  Checkbox,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  CloseButton,
  Text,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Auth } from '../../actions';
import * as colors from '../../utils/colors';
import GreenButton from '../../components/GreenButton';

function Login({ authState, dispatch }) {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
    rememberUser: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [forceHideAlert, setForceHideAlert] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = event => {
    setErrors({ ...errors, email: false });
    setLoginDetails({ ...loginDetails, email: event.target.value });
  };
  const handlePasswordChange = event => {
    setErrors({ ...errors, password: false });
    setLoginDetails({ ...loginDetails, password: event.target.value });
  };

  // function taken from https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = email =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const handleSubmit = () => {
    const { email, password } = loginDetails;
    const isEmailInvalid = !validateEmail(email);
    const isPasswordInvalid = password.length < 6;
    if (isEmailInvalid || isPasswordInvalid)
      return setErrors({
        ...errors,
        email: isEmailInvalid,
        password: isPasswordInvalid,
      });

    setForceHideAlert(false);
    return dispatch(Auth.login(loginDetails));
  };

  useEffect(() => {
    if (authState.authToken !== '') navigate('/');
  }, [authState.authToken]);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <Heading as="h2" size="2xl">
          Login
        </Heading>
        <VStack spacing="20px" align="stretch">
          <Input
            errorBorderColor="crimson"
            isInvalid={errors.email}
            placeholder="email"
            onChange={handleEmailChange}
            value={loginDetails.email}
          />
          <InputGroup size="md">
            <Input
              isInvalid={errors.password}
              pr="4.5rem"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              onChange={handlePasswordChange}
              value={loginDetails.password}
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: '20px',
            }}
          >
            <Flex>
              <Checkbox
                colorScheme="gray"
                onChange={() =>
                  setLoginDetails({
                    ...loginDetails,
                    rememberUser: !loginDetails.rememberUser,
                  })
                }
                isChecked={loginDetails.rememberUser}
              >
                Remember Me
              </Checkbox>
              <Spacer />
              <Link to="/forgot-password">
                <Text color="blue" as="u">
                  Forgot password
                </Text>
              </Link>
            </Flex>
            <GreenButton
              style={{ alignSelf: 'flex-start' }}
              isLoading={authState.loading || false}
              onClick={handleSubmit}
            >
              Login
            </GreenButton>

            {!forceHideAlert && authState.error && (
              <Alert status="error">
                <AlertIcon />
                There was an error logging in ({authState.error}).
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setForceHideAlert(true)}
                />
              </Alert>
            )}
          </div>
        </VStack>
      </VStack>
    </Container>
  );
}

Login.propTypes = {
  authState: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
    authToken: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

Login.defaultProps = {};

export default connect(state => ({
  authState: state.Auth,
}))(Login);
