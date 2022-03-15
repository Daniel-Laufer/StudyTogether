import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Divider,
  Alert,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { io } from 'socket.io-client';
import { apiURL } from '../utils/constants';

function NotificationBell({ userDetails }) {
  const [notifications, setNotifications] = useState([
    'Dan Laufer is hosting a new study group!',
    'Study group "CSC301 midterm" has new changes!',
  ]);

  useEffect(() => {
    const socket = io(apiURL, {
      extraHeaders: {
        userid: userDetails.id,
      },
    });
    socket.on('group-change', () => {
      setNotifications(['New notifications', ...notifications]);
    });

    console.log('Login_req', userDetails.id);
    console.log('yo');
  });
  return (
    <Popover>
      <PopoverTrigger>
        <BellIcon w={6} h={6} color="white" style={{ cursor: 'pointer' }} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Your Notifications!</PopoverHeader>
        <PopoverBody>
          {notifications.map((value, index) => (
            <>
              <Alert
                id={index}
                style={{ margin: '5px 0 5px 0', borderRadius: '10px' }}
                onClick={() => setNotifications([])}
              >
                {value}
              </Alert>
              <Divider />
            </>
          ))}
          {/* <Alert style={{ margin: '5px 0 5px 0', borderRadius: '10px' }}>
            Study group &apos;CSC301 midterm&apos; has new changes!
          </Alert> */}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
NotificationBell.propTypes = {
  userDetails: {
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  },
};
NotificationBell.defaultProps = {
  userDetails: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
  },
};

export default connect(state => ({
  // eslint-disable-next-line no-undef
  userDetails:
    (Object.keys(state.Auth.userDetails).length === 0
      ? null
      : state.Auth.userDetails) ||
    JSON.parse(localStorage.getItem('userDetails')),
}))(NotificationBell);
