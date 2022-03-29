/* eslint-disable no-undef */
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
  Center,
  Text,
  Image,
  VStack,
} from '@chakra-ui/react';
import styled from 'styled-components';
import { BellIcon } from '@chakra-ui/icons';
import { io } from 'socket.io-client';
import { apiURL } from '../utils/constants';
import GreenButton from './GreenButton';

function NotificationBell({ userDetails }) {
  const [notifications, setNotifications] = useState([]);
  const [notSeen, setNotSeen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  // const getNotifications = () => {
  //   const config = {
  //     headers: { Authorization: `JWT ${authToken}` },
  //   };
  //   axios
  //     .get(`${apiURL}/users/notifications`, config)
  //     .then(res => {
  //       // console.log(res.data);
  //       setNotifications([
  //         ...res.data.map(value => ({
  //           message: value.preview,
  //           url: value.groupId ?? value.followedUserID,
  //         })),
  //         ...notifications,
  //       ]); // res.data is an array of objects
  //       console.log(notifications);
  //     })
  //     .catch(err => {
  //       if (err.response && err.response.status === 401) {
  //         dispatch(logout());
  //         navigate('/login');
  //       }
  //     });
  // };

  useEffect(async () => {
    // getNotifications();

    if (!isConnected) {
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
        setIsConnected(skt.connected);
      });
    }
  }, [isConnected]);
  return (
    <Popover>
      <PopoverTrigger>
        <CustomBellContainer notSeen={notSeen}>
          <div className="bell-red-circle" />
          <BellIcon
            w={6}
            h={6}
            style={{ cursor: 'pointer', color: 'white' }}
            onClick={() => setNotSeen(false)}
          />
        </CustomBellContainer>
      </PopoverTrigger>
      <PopoverContent style={{ right: '230px', top: '40px' }}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Your Notifications!</PopoverHeader>
        <PopoverBody>
          {notifications.length === 0 ? (
            <Center>
              <VStack>
                <Text fontSize="2xl" color="gray.500" margin={5}>
                  Nothing new to see
                </Text>
                <Image
                  boxSize="240px"
                  objectFit="cover"
                  src="https://i.postimg.cc/jSYcRR2X/image-psd.png"
                />
              </VStack>
            </Center>
          ) : (
            notifications.map((value, index) => (
              <>
                <Alert
                  id={index}
                  style={{
                    margin: '5px 0 5px 0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate(value.url);
                  }}
                >
                  {value.message}
                </Alert>
                <Divider />
              </>
            ))
          )}
          <Divider marginBottom={5} />
          <Center>
            <GreenButton onClick={() => navigate('/user/notifications')}>
              View more
            </GreenButton>
          </Center>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const CustomBellContainer = styled(({ className, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div className={className} {...rest}>
    {children}
  </div>
))`
  position: relative;
  & {
    .bell-red-circle {
      width: 10px;
      display: ${props => (props.notSeen ? 'block' : 'none')};
      height: 10px;
      border-radius: 50%;
      background-color: red;
      position: absolute;
      right: 1px;
      top: 3px;
    }
  }
`;

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
