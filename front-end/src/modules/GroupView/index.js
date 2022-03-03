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
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
import DetailedGroup from '../../components/DetailedGroup';

function GroupView({
  authToken,
  dispatch,
  studyGroupsEndPoint,
  headerContent,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const location = useLocation();
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return !loading ? (
    <Box style={{ width: '60%', margin: 'auto', marginTop: '2rem' }}>
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
          link={`${group._id}`}
          size="lg"
        />
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
};

GroupView.defaultProps = {
  authToken: '',
  studyGroupsEndPoint: 'studygroups',
  headerContent: 'Additonal Study Group Information',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(GroupView);
