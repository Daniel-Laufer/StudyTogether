/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable arrow-body-style */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-template */

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css.map';
import { Container, Alert, AlertIcon, Box } from '@chakra-ui/react';
import CustomSpinner from '../../components/CustomSpinner';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';

const localizer = momentLocalizer(moment);

const assignColors = e => {
  e.hexColor = stringToColour(e.title);
  return e;
};

// Code from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
const stringToColour = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

// Code from https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
function wcHexIsLight(color) {
  const hex = color.replace('#', '');
  const cr = parseInt(hex.substr(0, 2), 16);
  const cg = parseInt(hex.substr(2, 2), 16);
  const cb = parseInt(hex.substr(4, 2), 16);
  const brightness = (cr * 299 + cg * 587 + cb * 114) / 1000;
  return brightness > 155;
}

const eventStyleGetter = (event, start, end, isSelected) => {
  const color = wcHexIsLight(event.hexColor) ? 'black' : 'white';
  const style = {
    backgroundColor: event.hexColor,
    color,
  };
  return {
    style,
  };
};

function CustomCalendar({ authToken, dispatch }) {
  const navigate = useNavigate();
  const allViews = Object.keys(Views).map(k => Views[k]);
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .get(`${apiURL}/studygroups/registered`, config)
      .then(res => {
        const data = res.data.map(event => {
          return {
            id: event._id,
            title: event.title,
            start: new Date(event.startDateTime),
            end: new Date(event.endDateTime),
          };
        });
        setState(data.map(e => assignColors(e)));
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
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
    <Container maxW="container.lg">
      <Calendar
        localizer={localizer}
        step={60}
        timeslots={8}
        views={allViews}
        showMultiDayTimes
        defaultDate={new Date()}
        events={state}
        onSelectEvent={event => {
          navigate(`/groups/${event.id}`);
        }}
        popup
        style={{ height: 500, marginTop: '2rem' }}
        eventPropGetter={eventStyleGetter}
      />
    </Container>
  ) : (
    <CustomSpinner />
  );
}

CustomCalendar.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

CustomCalendar.defaultProps = {
  authToken: '',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(CustomCalendar);
