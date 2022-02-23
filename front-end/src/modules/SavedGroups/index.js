/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Group from '../../components/Group';
import SecondGroup from '../../components/SecondGroup';
import { apiURL } from '../../utils/constants';
import CustomSpinner from '../../components/CustomSpinner';

function SavedGroups({ authToken }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.log(err);
      });
  };

  useEffect(() => {
    makeAPICall();
  }, []);

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
};

SavedGroups.defaultProps = { authToken: '' };

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(SavedGroups);
