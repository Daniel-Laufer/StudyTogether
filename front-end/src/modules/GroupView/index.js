/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  Box,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  AlertDescription,
  Text,
  Button,
  Modal,
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiURL } from '../../utils/constants';
import * as colors from '../../utils/colors';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
import DetailedGroup from '../../components/DetailedGroup';
import GreenButton from '../../components/GreenButton';
import GroupMembers from '../../components/GroupMembers';

function GroupView({ authToken, dispatch, studyGroupsEndPoint, userDetails }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [group, setGroup] = useState({});
  const [groupOwner, setGroupOwner] = useState({});
  const [groupOwnerId, setGroupOwnerId] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setformLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [userDneError, setUserDneError] = useState(false);
  const [userInvSuccess, setUserInvSuccess] = useState(false);
  const [userAlrInvError, setUserAlrInvError] = useState(false);
  const [successOccured, setSuccessOccured] = useState(false);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const groupOwnerCallback = (hostId, config) => {
    if (hostId) {
      setLoading(true);
      axios
        .get(`${apiURL}/users/profile/${hostId}`, config)
        .then(res => {
          setLoading(false);
          setGroupOwner(res.data);
          setGroupOwnerId(hostId);
        })
        .catch(err => {
          setLoading(false);
          if (err.response.status === 400) {
            dispatch(logout());
            navigate('/login');
          } else if (err.response.status === 401) {
            dispatch(logout());
            navigate('/login');
          }
        });
    }
  };

  const getSelectedStudyGroup = getGroupOwnerCallback => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .get(`${apiURL}/${studyGroupsEndPoint}/${id}`, config)
      .then(res => {
        setLoading(false);
        setGroup(res.data);
        getGroupOwnerCallback(res.data.hostId, config);
      })
      .catch(() => {
        setLoading(false);
        navigate('/notfound');
        setTimeout(() => {
          navigate('/groups');
        }, 1000);
      });
  };

  function sendInviteViaEmail(userEmail) {
    return new Promise((resolve, reject) => {
      const config = {
        headers: { Authorization: `JWT ${authToken}` },
      };
      // setLoading(true);
      axios
        .post(
          `${apiURL}/${studyGroupsEndPoint}/${id}/invite`,
          { email: userEmail },
          config
        )
        .then(() => {
          resolve();
        })
        .catch(err => {
          if (err.response.status === 401) {
            dispatch(logout());
            navigate('/login');
          }

          reject(err.response.status);
        });
    });
  }

  // on component mount, retrieve all the saved study groups
  useEffect(() => {
    getSelectedStudyGroup(groupOwnerCallback);
  }, [location.pathname]);

  if (authToken === null) {
    return (
      <Alert status="warning">
        <AlertIcon />
        You need to be logged in to view your saved study groups. Redirecting
        you to the login page now...
      </Alert>
    );
  }

  const handleRegister = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .post(`${apiURL}/${studyGroupsEndPoint}/attend/${id}`, {}, config)
      .then(res => {
        setGroup(res.data);
        setSuccessOccured(true);
        setLoading(false);
        setInterval(() => {
          setSuccessOccured(false);
        }, 4000);
      })
      .catch(err => {
        setLoading(false);
        setErrorOccured(true);
        if (err.response.status === 400) {
          console.log('Error 400');
        } else if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
        setInterval(() => {
          setErrorOccured(false);
        }, 4000);
      });
  };

  const handleCancel = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .patch(`${apiURL}/${studyGroupsEndPoint}/leave/${id}`, {}, config)
      .then(res => {
        setGroup(res.data);
        setSuccessOccured(true);
        setLoading(false);
        setInterval(() => {
          setSuccessOccured(false);
        }, 4000);
      })
      .catch(err => {
        setLoading(false);
        setErrorOccured(true);
        if (err.response.status === 400) {
          // pass
        } else if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
        setInterval(() => {
          setErrorOccured(false);
        }, 4000);
      });
  };

  const dateDiffHours = moment(group.endDateTime).diff(
    moment(group.startDateTime),
    'hours'
  );

  const dateDiffMins = moment(group.endDateTime)
    .subtract(dateDiffHours, 'hours')
    .diff(moment(group.startDateTime), 'minutes');

  const { isOpen, onOpen, onClose } = useDisclosure();

  // function taken from https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript
  const validateEmail = email =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  const validateName = value => {
    let error;
    if (!validateEmail(value)) {
      error = 'Email is not valid';
    }
    return error;
  };

  return !loading ? (
    <Box
      style={{
        width: '60%',
        margin: 'auto',
        marginTop: '2rem',
        marginBottom: '2rem',
      }}
    >
      <Flex justify="space-between" wrap="wrap" gap="1rem">
        <Heading as="h2" size="2xl">
          {group.title}
        </Heading>
        <FormControl
          style={{ width: 'auto' }}
          display="flex"
          alignItems="center"
        />
      </Flex>

      <Flex
        style={{
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: '',
        }}
      >
        <DetailedGroup
          restrict={group.tags}
          availability={`${group.maxAttendees - group.curAttendees} / ${
            group.maxAttendees
          }`}
          imgAlt="Study group image"
          img={group.imageUrl}
          when={moment(group.startDateTime).format(
            'dddd, MMM DD, yyyy HH:mm a'
          )}
          durationHours={dateDiffHours}
          durationMins={dateDiffMins}
          host={`${groupOwner.firstName} ${groupOwner.lastName}`}
          hostId={groupOwnerId}
          desc={group.description}
          size="lg"
        />

        <Box width="full">
          <Box style={{ marginTop: '1rem' }}>
            {group && group.hostId === userDetails.id ? (
              <Stack>
                <GreenButton
                  style={{ backgroundColor: colors.blue.medium }}
                  size="md"
                  width="50%"
                  maxWidth="380px"
                  onClick={() => navigate(`/groups/edit/${id}`)}
                >
                  Edit
                </GreenButton>

                <GreenButton
                  size="md"
                  width="50%"
                  maxWidth="380px"
                  onClick={onOpen}
                >
                  Invite User
                </GreenButton>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>User to invite</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {/* Used this link as a reference https://chakra-ui.com/docs/components/form/form-control */}
                      <Formik
                        initialValues={{ email: '' }}
                        onSubmit={(values, { resetForm }) => {
                          setformLoading(true);
                          sendInviteViaEmail(values.email)
                            .then(() => {
                              setUserInvSuccess(true);
                              setInterval(() => {
                                setUserInvSuccess(false);
                              }, 6000);
                              setformLoading(false);
                              setTimeout(() => {
                                onClose();
                                setUserInvSuccess(false);
                              }, 1000);
                            })
                            .catch(err => {
                              if (err === 409) {
                                setUserAlrInvError(true);
                                setInterval(() => {
                                  setUserAlrInvError(false);
                                }, 6000);
                              } else {
                                setUserDneError(true);
                                setInterval(() => {
                                  setUserDneError(false);
                                }, 6000);
                                resetForm({ email: '' });
                              }
                              setformLoading(false);
                            });
                        }}
                      >
                        <Form>
                          <Field name="email" validate={validateName}>
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.email && form.touched.email
                                }
                              >
                                <FormLabel htmlFor="email">
                                  Email Address
                                </FormLabel>
                                <Input
                                  {...field}
                                  id="email"
                                  placeholder="Enter here"
                                />
                                <FormErrorMessage>
                                  {form.errors.email}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Flex
                            justify="right"
                            wrap="wrap"
                            style={{
                              marginTop:
                                userDneError ||
                                userAlrInvError ||
                                userInvSuccess
                                  ? '1em'
                                  : 0,
                            }}
                          >
                            {userInvSuccess && (
                              <Alert status="success">
                                <AlertIcon />
                                User was successfully invited!
                              </Alert>
                            )}

                            {userAlrInvError && (
                              <Alert status="error">
                                <AlertIcon />
                                User with this email was already invited!
                              </Alert>
                            )}
                            {userDneError && (
                              <Alert status="error">
                                <AlertIcon />A user with this email was not
                                found!
                              </Alert>
                            )}

                            <Button
                              style={{
                                backgroundColor: colors.blue.medium,
                              }}
                              mt={4}
                              colorScheme="teal"
                              isLoading={formLoading}
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Flex>
                        </Form>
                      </Formik>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Stack>
            ) : group &&
              group.attendees &&
              group.attendees.filter(g => g.id === userDetails.id).length ===
                0 ? (
              <GreenButton
                colorScheme="teal"
                size="md"
                width="50%"
                maxWidth="400px"
                isDisabled={group.maxAttendees === group.curAttendees}
                onClick={handleRegister}
              >
                Register
              </GreenButton>
            ) : (
              <GreenButton
                style={{ backgroundColor: '#EE3625' }}
                size="md"
                width="50%"
                maxWidth="400px"
                onClick={handleCancel}
              >
                Leave
              </GreenButton>
            )}
            {errorOccured ? (
              <Alert
                style={{
                  width: '50%',
                  maxWidth: '400px',
                  minWidth: '200px',
                }}
                status="error"
                mt={5}
              >
                <AlertIcon />
                <AlertDescription>
                  Could not perform this operation successfully. Please reload!
                </AlertDescription>
              </Alert>
            ) : null}
            {successOccured ? (
              <Alert
                style={{
                  width: '50%',
                  maxWidth: '400px',
                  minWidth: '200px',
                }}
                status="success"
                mt={5}
              >
                <AlertIcon />
                <AlertDescription>
                  This operation was successful!
                </AlertDescription>
              </Alert>
            ) : null}
          </Box>
        </Box>

        {group.attendees && group.attendees.length > 0 ? (
          <Box width="full">
            <Text as="b" color={colors.grey.dark} fontSize="20px" mt="0px">
              Members
            </Text>
            <HStack>
              {group.attendees &&
                group.attendees.map(u => <GroupMembers userInfo={u} />)}
            </HStack>
          </Box>
        ) : null}
      </Flex>
    </Box>
  ) : (
    <CustomSpinner />
  );
}

GroupView.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  studyGroupsEndPoint: PropTypes.string,
  userDetails: {
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  },
};

GroupView.defaultProps = {
  authToken: '',
  studyGroupsEndPoint: 'studygroups',
  userDetails: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
  },
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
  userDetails:
    (Object.keys(state.Auth.userDetails).length === 0
      ? null
      : state.Auth.userDetails) ||
    JSON.parse(localStorage.getItem('userDetails')),
}))(GroupView);
