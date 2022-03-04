/* eslint-disable no-unused-vars */
/* eslint-disable no-unneeded-ternary */
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
  FormLabel,
  Switch,
  Text,
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { scroller } from 'react-scroll';
import Group from '../../components/Group';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
import DetailedGroup from '../../components/DetailedGroup';
import Map from '../../components/Map';

function Groups({
  authToken,
  dispatch,
  studyGroupsEndPoint,
  headerContent,
  noGroupsFoundText,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentlySelectedGroup, setCurrentlySelectedGroup] = useState(null);
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
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  };

  const formatGroupDataForMapDisplay = () => {
    if (!groups) return [];
    return groups.reduce((acc, curr) => {
      if (curr.location && 'lat' in curr.location && 'lng' in curr.location)
        acc.push({ ...curr.location, id: curr._id, metaData: { ...curr } });
      return acc;
    }, []);
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

  const getLocationOfGroupId = targetGroupId => {
    if (!groups || !targetGroupId) return undefined;

    const foundGroup = groups.find(
      group =>
        group._id === targetGroupId &&
        group.location &&
        'lat' in group.location &&
        'lng' in group.location
    );

    if (!foundGroup) return undefined;

    return foundGroup.location;
  };

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

      <Box
        style={{
          marginTop: '1rem',
          border: '1px solid var(--chakra-colors-gray-200)',
          borderRadius: 'var(--chakra-radii-md)',
          padding: '0.5rem',
          height: '40vh',
          overflowY: 'scroll',
        }}
      >
        <Heading size="sm">Results</Heading>

        <Flex
          style={{
            marginTop: '2rem',
            flexWrap: 'wrap',
            justifyContent: '',
          }}
          gap="0.5rem"
        >
          {groups.length > 0 ? (
            groups.map(g =>
              !viewDetailedGroupCards ? (
                <Group
                  id={`group-${g._id}`}
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
                  onClickFunc={() => setCurrentlySelectedGroup(g._id)}
                  size="md"
                  selected={currentlySelectedGroup === g._id}
                />
              ) : (
                <DetailedGroup
                  id={`group-${g._id}`}
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
                  onClickFunc={() => setCurrentlySelectedGroup(g._id)}
                  size="md"
                  selected={currentlySelectedGroup === g._id}
                />
              )
            )
          ) : (
            <Text> {noGroupsFoundText} </Text>
          )}
        </Flex>
      </Box>

      <Box
        style={{
          marginTop: '1rem',
          border: '1px solid var(--chakra-colors-gray-200)',
          borderRadius: 'var(--chakra-radii-md)',
          padding: '0.5rem',
          height: '40vh',
          overflowY: 'scroll',
        }}
      >
        <Heading size="sm">Locations</Heading>
        <Box
          style={{
            margin: 'auto',
          }}
        >
          <Map
            disableAddingNewMarkers
            markers={formatGroupDataForMapDisplay()}
            initialCenter={getLocationOfGroupId(currentlySelectedGroup)}
            initialZoom={18}
            markerOnClickFunc={groupId => {
              setCurrentlySelectedGroup(groupId);
            }}
            currentlySelectedGroup={getLocationOfGroupId(
              currentlySelectedGroup
            )}
          />
        </Box>
      </Box>
    </Box>
  ) : (
    <CustomSpinner />
  );
}

Groups.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  studyGroupsEndPoint: PropTypes.string,
  headerContent: PropTypes.string,
  noGroupsFoundText: PropTypes.string,
};

Groups.defaultProps = {
  authToken: '',
  studyGroupsEndPoint: 'studygroups',
  headerContent: 'Study groups happening near you',
  noGroupsFoundText: 'No study groups found.',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(Groups);
