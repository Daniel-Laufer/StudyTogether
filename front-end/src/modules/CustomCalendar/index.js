/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css.map';
import { Container, Alert, AlertIcon, Box } from '@chakra-ui/react';

const localizer = momentLocalizer(moment);
const COLORS = [
  '#105E97',
  '#4DE351',
  '#62A501',
  '#77176A',
  '#E3449C',
  '#DE49E0',
];

const events = [
  {
    id: '622d549b244da0cde08c9e02',
    title: 'All Day Event very long title',
    start: new Date(2022, 2, 1),
    end: new Date(2022, 2, 2),
  },
  {
    id: '622d549b244da0cde08c9e08',
    title: 'All Day long title',
    start: new Date(2022, 2, 1),
    end: new Date(2022, 2, 2),
  },
  {
    id: '622d549b244da0cde08c9e04',
    title: 'All Day Event',
    start: new Date(2022, 2, 1),
    end: new Date(2022, 2, 2),
  },
  {
    id: '622ea79fc6cac53e555e5871',
    title: 'DTS STARTS',
    start: new Date(2022, 2, 13, 13, 0, 0),
    end: new Date(2022, 2, 20, 16, 0, 0),
  },
];

const assignColors = e => {
  e.hexColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  return e;
};

const eventStyleGetter = (event, start, end, isSelected) => {
  const fontColor =
    event.hexColor === '#77176A' || event.hexColor === '#105E97'
      ? 'white'
      : 'black';
  const style = {
    backgroundColor: event.hexColor,
    color: fontColor,
  };
  return {
    style,
  };
};

function CustomCalendar({ authToken }) {
  const navigate = useNavigate();
  const allViews = Object.keys(Views).map(k => Views[k]);
  const [state, setState] = useState([]);

  useEffect(() => {
    if (authToken === null) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [authToken]);

  useEffect(() => {
    setState(events.map(e => assignColors(e)));
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

  return (
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
  );
}

CustomCalendar.propTypes = {
  authToken: PropTypes.string,
};

CustomCalendar.defaultProps = {
  authToken: '',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(CustomCalendar);
