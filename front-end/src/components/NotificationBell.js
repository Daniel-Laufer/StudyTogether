import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [notifications, setNotifications] = useState([]);
  const [notSeen, setNotSeen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      console.log('socket re-connecting');
      const skt = io(apiURL, {
        extraHeaders: {
          userid: userDetails.id,
        },
      });
      setIsConnected(skt.connected);
      skt.on('group-change', (message, groupID) => {
        const url = `/groups/${groupID}`;
        setNotifications([{ message, url }, ...notifications]);
        setNotSeen(true);
      });
      skt.on('followed-user-update', (message, followedUserID) => {
        const url = `/user/${followedUserID}`;
        setNotifications([{ message, url }, ...notifications]);
        setNotSeen(true);
      });
      skt.on('disconnect', () => {
        console.log('socket disconnected');
        setIsConnected(skt.connected);
      });
    }

    console.log('Login_req', userDetails.id);
  }, [isConnected]);
  return (
    <Popover>
      <PopoverTrigger>
        <BellIcon
          w={6}
          h={6}
          color={notSeen ? 'red' : 'white'}
          style={{ cursor: 'pointer' }}
          onClick={() => setNotSeen(false)}
        />
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
                style={{
                  margin: '5px 0 5px 0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  console.log(value.url);
                  navigate(value.url);
                }}
              >
                {value.message}
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
