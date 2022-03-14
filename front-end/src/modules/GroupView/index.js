/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  FormControl,
  AlertDescription,
  Text,
  HStack,
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
  const [loading, setLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [successOccured, setSuccessOccured] = useState(false);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const getGroupOwnerCallbackA = (hostId, config) => {
    console.log(`===> ${hostId}`);
    if (hostId) {
      setLoading(true);
      axios
        .get(`${apiURL}/users/profile/${hostId}`, config)
        .then(res => {
          setLoading(false);
          setGroupOwner(res.data);
          // console.log(`======> ${res}`);
          // console.log(`======> ${res.data.firstName}, ${groupOwner.firstName}`);
        })
        .catch(err => {
          setLoading(false);
          // TODO: error checking
          if (err.response.status === 401) {
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
      .catch(err => {
        setLoading(false);
        // TODO: error checking
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });

    // console.log(group.hostId);

    // setGroupOwner(res.data);
    // axios
    //   .get(`${apiURL}/users/profile/${res.data.hostId}`, config)
    //   .then(res => {
    //     setLoading(false);
    //     console.log(res.data);
    //     // setGroupOwner(res.data);
    //     // console.log(groupOwner.firstName);
    //   })
    //   .catch(err => {
    //     setLoading(false);
    //     if (err.response.status === 401) {
    //       dispatch(logout());
    //       navigate('/login');
    //     }
    //   });
  };

  // on component mount, retrieve all the saved study groups
  useEffect(() => {
    getSelectedStudyGroup(getGroupOwnerCallbackA);
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
          console.log('error 400');
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
          desc={group.description}
          size="lg"
        />

        <Box width="full">
          <Box style={{ marginTop: '1rem' }}>
            {group &&
            group.attendees &&
            group.attendees.filter(g => g.id === userDetails.id).length ===
              0 ? (
              <GreenButton
                colorScheme="teal"
                size="md"
                width="45%"
                isDisabled={group.maxAttendees === group.curAttendees}
                onClick={handleRegister}
              >
                Register
              </GreenButton>
            ) : (
              <GreenButton
                style={{ backgroundColor: '#EE3625' }}
                size="md"
                width="45%"
                onClick={handleCancel}
              >
                Leave
              </GreenButton>
            )}
            {errorOccured ? (
              <Alert
                style={{
                  width: '45%',
                }}
                status="error"
                mt={5}
              >
                <AlertIcon />
                <AlertDescription>
                  Could not perform the operation successfully. Please reload!
                </AlertDescription>
              </Alert>
            ) : null}
            {successOccured ? (
              <Alert
                style={{
                  width: '45%',
                }}
                status="success"
                mt={5}
              >
                <AlertIcon />
                <AlertDescription>
                  The operation was successful!
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
