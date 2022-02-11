import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Group from '../../components/Group';
import SecondGroup from '../../components/SecondGroup';
import { apiURL } from '../../utils/constants';

function Groups({ authToken }) {
  const [groups, setGroups] = useState([]);

  const makeAPICall = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .get(`${apiURL}/studygroups`, config)
      .then(res => {
        setGroups(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    makeAPICall();
  }, []);

  return (
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
  );
}

Groups.propTypes = {
  authToken: PropTypes.string,
};

Groups.defaultProps = { authToken: '' };

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(Groups);
