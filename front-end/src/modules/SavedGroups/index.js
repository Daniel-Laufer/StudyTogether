/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Group from '../../components/Group';
import SecondGroup from '../../components/SecondGroup';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';

function SavedGroups({ authToken, dispatch }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const makeAPICall = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .get(`${apiURL}/studygroups`, config)
      .then(res => {
        setLoading(false);
        setGroups(res.data);
      })
      .catch(err => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  };

  useEffect(() => {
    makeAPICall();
  }, []);

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
    <Box textAlign={['left', 'left', 'left']} spacingY="20px">
      {groups.map(g => (
        <Group
          heading={g.title}
          restrict={g.restrict}
          price={g.price}
          imgAlt="Study group image"
          img={g.imageUrl}
          link={g._id}
        />
      ))}
      {groups.map(g => (
        <SecondGroup
          title={g.title}
          restrict="UofT students"
          availability={`${g.maxAttendees - g.curAttendees} / ${
            g.maxAttendees
          }`}
          imgAlt="Study group image"
          img={g.imageUrl}
          when={g.time}
          host={g.hostFirstName + g.hostLastName}
          desc={g.description}
          link={`${g._id}`}
          size="md"
        />
      ))}
    </Box>
  ) : (
    <CustomSpinner />
  );
}

SavedGroups.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

SavedGroups.defaultProps = { authToken: '' };

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(SavedGroups);
