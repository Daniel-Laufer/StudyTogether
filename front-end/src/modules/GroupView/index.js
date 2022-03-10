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
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
import DetailedGroup from '../../components/DetailedGroup';
import GreenButton from '../../components/GreenButton';
import GroupMembers from '../../components/GroupMembers';
import * as colors from '../../utils/colors';

function GroupView({
  authToken,
  dispatch,
  studyGroupsEndPoint,
  headerContent,
  userDetails,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [successOccured, setSuccessOccured] = useState(false);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const getSelectedStudyGroup = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .get(`${apiURL}/${studyGroupsEndPoint}/${id}`, config)
      .then(res => {
        setLoading(false);
        setGroup(res.data);
      })
      .catch(err => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  };

  // on component mount, retrieve all the saved study groups
  useEffect(() => {
    getSelectedStudyGroup();
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
        }, 3000);
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
        }, 3000);
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
        }, 3000);
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
        }, 3000);
      });
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
          {headerContent}
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
          title={group.title}
          restrict={group.tags}
          availability={`${group.maxAttendees - group.curAttendees} / ${
            group.maxAttendees
          }`}
          imgAlt="Study group image"
          img={group.imageUrl}
          when={group.time}
          host={`${group.hostFirstName} ${group.hostLastName}`}
          desc={group.description}
          size="lg"
        />
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
        <Box style={{ marginTop: '1rem' }}>
          {group &&
          group.attendees &&
          group.attendees.filter(g => g.id === userDetails.id).length === 0 ? (
            <GreenButton
              colorScheme="teal"
              size="md"
              width="400px"
              isDisabled={group.maxAttendees === group.curAttendees}
              onClick={handleRegister}
            >
              Register
            </GreenButton>
          ) : (
            <GreenButton
              style={{ backgroundColor: '#EE3625' }}
              size="md"
              width="400px"
              onClick={handleCancel}
            >
              Leave
            </GreenButton>
          )}
          {errorOccured ? (
            <Alert
              style={{
                width: '100%',
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
                width: '100%',
              }}
              status="success"
              mt={5}
            >
              <AlertIcon />
              <AlertDescription>The operation was successful!</AlertDescription>
            </Alert>
          ) : null}
        </Box>
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
  headerContent: PropTypes.string,
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
  headerContent: 'Additonal Study Group Information',
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
