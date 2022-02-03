/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
  Select,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logoblack from '../../assets/images/logoblack.png';
import { Auth } from '../../actions';
import * as colors from '../../utils/colors';
import { userRoles } from '../../utils/constants';

function Register({ authState, dispatch }) {
  const [registrationDetails, setRegistrationDetails] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    userName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    role: false,
    userName: '',
  });
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
  const handleConfirmPasswordChange = event => {
    setRegistrationDetails({
      ...registrationDetails,
      confirmPassword: event.target.value,
    });
    if (
      event.target.value === registrationDetails.password ||
      event.target.value === ''
    )
      setErrors({ ...errors, confirmPassword: false });
    else setErrors({ ...errors, confirmPassword: true });
  };

  const handleRoleChange = event => {
    setErrors({ ...errors, password: false });
    setRegistrationDetails({
      ...registrationDetails,
      role: event.target.value,
    });
  };
  const handleUserNameChange = event => {
    setErrors({ ...errors, userName: false });
    setRegistrationDetails({
      ...registrationDetails,
      userName: event.target.value,
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
    const { email, password, role, confirmPassword, userName } =
      registrationDetails;
    const isEmailInvalid = !validateEmail(email);
    const isPasswordInvalid = password.length < 6;
    const userNameInvalid = userName.length === 0;
    const passwordConfirmDoesntMatch = password !== confirmPassword;
    const roleNotSelected = role === '';

    if (
      isEmailInvalid ||
      isPasswordInvalid ||
      userNameInvalid ||
      roleNotSelected ||
      passwordConfirmDoesntMatch
    )
      return setErrors({
        ...errors,
        email: isEmailInvalid,
        password: isPasswordInvalid,
        confirmPassword: passwordConfirmDoesntMatch,
        role: roleNotSelected,
        userName: userNameInvalid,
      });

    setForceHideAlert(false);
    return dispatch(Auth.register(registrationDetails));
  };

  // useEffect(() => {
  //   console.log(registrationDetails);
  // }, [registrationDetails]);

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
          <InputGroup size="md">
            <Input
              isInvalid={errors.confirmPassword}
              pr="4.5rem"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              onChange={handleConfirmPasswordChange}
              value={registrationDetails.confirmPassword}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Input
            errorBorderColor="crimson"
            isInvalid={errors.userName}
            placeholder="Username"
            onChange={handleUserNameChange}
            value={registrationDetails.userName}
          />
          <Select
            isInvalid={errors.role}
            placeholder="What type of user are you?"
            onChange={handleRoleChange}
          >
            {userRoles.map((key, index) => (
              <option value={key}>{key}</option>
            ))}
          </Select>
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
