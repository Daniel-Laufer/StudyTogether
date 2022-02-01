import React, { useState } from 'react';
import {
  Heading,
  Input,
  VStack,
  Image,
  Container,
  Checkbox,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logoblack from '../../assets/images/logoblack.png';
import { Auth } from '../../actions';
import * as colors from '../../utils/colors';

function Register({ authState, dispatch }) {
  const [registrationDetails, setRegistrationDetails] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [forceHideAlert, setForceHideAlert] = useState(false);

  const handleEmailChange = event => {
    setErrors({ ...errors, email: false });
    setRegistrationDetails({
      ...registrationDetails,
      email: event.target.value,
    });
  };
  const handlePasswordChange = event => {
    setErrors({ ...errors, password: false });
    setRegistrationDetails({
      ...registrationDetails,
      password: event.target.value,
    });
  };

  // function taken from https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = email =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const handleSubmit = () => {
    const { email, password } = registrationDetails;
    const isEmailInvalid = !validateEmail(email);
    const isPasswordInvalid = password.length < 6;
    if (isEmailInvalid || isPasswordInvalid)
      return setErrors({
        ...errors,
        email: isEmailInvalid,
        password: isPasswordInvalid,
      });

    setForceHideAlert(false);
    return dispatch(Auth.login(registrationDetails));
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Image src={logoblack} alt="StudyTogether" />
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        <Heading as="h2" size="2xl">
          Register
        </Heading>
        <VStack spacing="20px" align="stretch">
          <Input
            errorBorderColor="crimson"
            isInvalid={errors.email}
            placeholder="email"
            onChange={handleEmailChange}
            value={registrationDetails.email}
          />
          <InputGroup size="md">
            <Input
              isInvalid={errors.password}
              pr="4.5rem"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              onChange={handlePasswordChange}
              value={registrationDetails.password}
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
            <Checkbox colorScheme="gray">Remember Me</Checkbox>
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
              Register
            </Button>
            {!forceHideAlert && authState.error && (
              <Alert status="error">
                <AlertIcon />
                There was an error logging in.
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

Register.propTypes = {
  authState: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

Register.defaultProps = {};

export default connect(state => ({
  authState: state.Auth,
}))(Register);
