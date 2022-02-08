/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Heading,
  Input,
  VStack,
  Box,
  Alert,
  AlertIcon,
  CloseButton,
  Select,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Text,
  Textarea,
  Image,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input/input';

import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../actions';
import * as colors from '../../utils/colors';
import { apiURL, userRoles } from '../../utils/constants';
import GoogleMap from '../../components/Map';
import GreenButton from '../../components/GreenButton';
import axios from 'axios';

function GroupCreator({ authState, dispatch }) {
  const [state, setState] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    phone: '',
    image:
      'https://image.freepik.com/free-vector/study-group-illustration-with-students-study-together-after-class-as-concept-this-illustration-can-be-use-website-landing-page-web-app-banner_9829-25.jpg',
    currAttendees: 1,
    maxAttendees: 2,
    description: '',
    tags: [],
  });
  const [errors, setErrors] = useState({
    title: false,
    password: false,
    date: false,
    phone: false,
    image: false,
    currAttendees: false,
    maxAttendees: false,
    description: false,
    tags: false,
  });
  const [forceHideAlert, setForceHideAlert] = useState(false);

  const handleChange = event => {
    const { value, name } = event.target;
    const newState = state;

    switch (name) {
      case 'title':
        newState[name] = value;
        break;
      case 'image':
        newState[name] = value;
        break;
      case 'currAttendees':
        newState[name] = value;
        break;
      case 'maxAttendees':
        newState[name] = value;
        break;
      case 'description':
        newState[name] = value;
        break;
      case 'phone':
        newState[name] = value;
        break;
      default:
        console.log('Name does not exist.');
    }
    setState({ ...state, newState });
  };

  // code taken from here https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  const validatePhoneNumber = phone => {
    const regexEx = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return !!String(phone).toLowerCase().match(regexEx);
  };

  const handleSubmit = () => {
    const groupTitleInvalid = state.title.length < 4;
    const phoneInvalid = !validatePhoneNumber(state.phone);
    const imageUrlInvalid =
      state.image.substring(state.image.lastIndexOf('.')) !== '.jpg';

    const descriptionInvalid = state.description.split(' ').length < 5;

    if (
      [
        groupTitleInvalid,
        phoneInvalid,
        imageUrlInvalid,
        descriptionInvalid,
      ].some(boolean => boolean)
    )
      setErrors({
        ...errors,
        title: groupTitleInvalid,
        phone: phoneInvalid,
        image: imageUrlInvalid,
        description: descriptionInvalid,
      });
    else {
      // axios.post(`${apiURL}/users/login`, {
      //   title: state.title,
      //   time: time.st,
      //   phone: { type: String, required: true },
      //   imageUrl: { type: String, required: true },
      //   curAttendees: { type: Number, min: 0, default: 0, required: true },
      //   maxAttendees: { type: Number, min: 2, required: true },
      //   hostId: { type: mongoose.Types.ObjectId, required: true },
      //   description: { type: String, required: true },
      //   tags: { type: [String], required: true },
      // });
    }
  };

  useEffect(() => {
    console.log(validatePhoneNumber(state.phone));
    console.log(state);
    console.log(errors);
  }, [state, errors]);

  return (
    <div style={{ height: '49vh' }}>
      <Box style={{ marginTop: '2rem', padding: '0 2rem' }}>
        <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
          <Heading as="h2" size="2xl">
            Create a Group
          </Heading>
          <Flex justify="center" width="100%">
            <Image src={state.image} alt="Group image" height="300px" />
          </Flex>

          <VStack spacing="20px" align="stretch">
            <Input
              name="title"
              autoComplete="off"
              errorBorderColor="crimson"
              isInvalid={errors.email}
              placeholder="Group Name"
              onChange={handleChange}
              value={state.title}
            />
            <Input
              name="image"
              autoComplete="off"
              errorBorderColor="crimson"
              isInvalid={errors.image}
              placeholder="Group Image URL"
              onChange={handleChange}
              value={state.image}
            />
            <HStack>
              <span style={{ marginRight: '1rem' }}>Host Phone number:</span>
              <PhoneInput
                style={{ border: 'inherit' }}
                country="US"
                placeholder="905-142-9344"
                value={state.phone}
                onChange={value =>
                  handleChange({ target: { value, name: 'phone' } })
                }
              />
            </HStack>
            <HStack>
              <span style={{ marginRight: '1rem' }}>
                Curent number of ateendees{' '}
              </span>
              <NumberInput name="currAttendees" value={state.currAttendees}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    onClick={() =>
                      setState({
                        ...state,
                        currAttendees: Math.min(state.currAttendees + 1, 100),
                      })
                    }
                  />
                  <NumberDecrementStepper
                    onClick={() =>
                      setState({
                        ...state,
                        currAttendees: Math.max(state.currAttendees - 1, 1),
                      })
                    }
                  />
                </NumberInputStepper>
              </NumberInput>
            </HStack>

            <HStack>
              <span style={{ marginRight: '1rem' }}>
                Maximum number of ateendees{' '}
              </span>
              <NumberInput name="maxAttendees" value={state.maxAttendees}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    onClick={() =>
                      setState({
                        ...state,
                        maxAttendees: Math.min(state.maxAttendees + 1, 100),
                      })
                    }
                  />
                  <NumberDecrementStepper
                    onClick={() =>
                      setState({
                        ...state,
                        maxAttendees: Math.max(state.maxAttendees - 1, 2),
                      })
                    }
                  />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <HStack gap="1rem">
              <span style={{ width: '80px' }}>Date </span>

              <DatePicker
                name="startDate"
                style={{
                  border: '1px solid black !important',
                  width: 'auto',
                }}
                selected={state.startDate}
                onChange={startDate => setState({ ...state, startDate })}
              />
            </HStack>

            <Flex gap="1rem">
              <span style={{ width: '80px' }}>Start time </span>
              <TimePicker
                name="startTime"
                maxDetail="minute"
                hourPlaceholder="09"
                minutePlaceholder="00"
                value=""
              />
            </Flex>
            <Flex gap="1rem">
              <span style={{ width: '80px' }}>End time </span>
              <TimePicker
                name="endTime"
                maxDetail="minute"
                hourPlaceholder="11"
                minutePlaceholder="00"
                value="22:15:00"
              />
            </Flex>
            <>
              <Text mb="8px">Description</Text>
              <Textarea
                name="description"
                value={state.description}
                onChange={handleChange}
                placeholder="We will be..."
                size="sm"
              />
            </>
          </VStack>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: '20px',
            }}
          >
            <GreenButton
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
              Create Group
            </GreenButton>
            {!forceHideAlert && authState.error && (
              <Alert status="error">
                <AlertIcon />
                There was an error during the registration process (
                {authState.error}).
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
      </Box>
      {/* <Box
        style={{
          marginTop: '2rem',
        }}
      >
        <GoogleMap style={{ width: 'calc(100% - 4rem)', height: '100%' }} />
      </Box> */}
    </div>
  );
}

GroupCreator.propTypes = {
  authState: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
    authToken: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

GroupCreator.defaultProps = {};

export default connect(state => ({
  authState: state.Auth,
}))(GroupCreator);