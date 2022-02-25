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
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// import SecondGroup from '../../components/SecondGroup';
import Group from '../../components/Group';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
import DetailedGroup from '../../components/DetailedGroup';

function SavedGroups({
  authToken,
  dispatch,
  studyGroupsEndPoint,
  headerContent,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [viewDetailedGroupCards, setViewDetailedGroupCards] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  const getSavedStudyGroups = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .get(`${apiURL}/${studyGroupsEndPoint}`, config)
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

  // on component mount, retrieve all the saved study groups
  useEffect(() => {
    getSavedStudyGroups();
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
      <Flex justify="space-between" wrap="wrap">
        <Heading as="h2" size="2xl">
          {headerContent}
        </Heading>
        <FormControl
          style={{ width: 'auto' }}
          display="flex"
          alignItems="center"
        >
          <FormLabel htmlFor="email-alerts" mb="0">
            More study group details
          </FormLabel>
          <Switch
            id="email-alerts"
            isChecked={viewDetailedGroupCards}
            onChange={() => setViewDetailedGroupCards(!viewDetailedGroupCards)}
          />
        </FormControl>
      </Flex>

      <Flex
        style={{
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: '',
        }}
      >
        {groups.map(g =>
          !viewDetailedGroupCards ? (
            <Group
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
          ) : (
            <DetailedGroup
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
          )
        )}
      </Flex>
    </Box>
  ) : (
    <CustomSpinner />
  );
}

SavedGroups.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  studyGroupsEndPoint: PropTypes.string,
  headerContent: PropTypes.string,
};

SavedGroups.defaultProps = {
  authToken: '',
  studyGroupsEndPoint: 'studygroups',
  headerContent: 'Study groups happening near you',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(SavedGroups);
