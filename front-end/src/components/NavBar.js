/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuItem,
  Portal,
  MenuList,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Center,
  Alert,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styled from 'styled-components';
import { logout } from '../actions/Auth';
import greenLogo from '../assets/images/smalllogogreen.png';
import genericUser from '../assets/images/defuser.jpeg';
import GreenButton from './GreenButton';
import * as colors from '../utils/colors';
import useOutsideAlerter from '../hooks/useOutsideAlerter';
import NotificationBell from './NotificationBell';
import { apiURL } from '../utils/constants';

function NavBar({ authToken, dispatch, userDetails }) {
  const navigate = useNavigate();
  const [isUserProfileMenuOpen, setIsUserProfileMenuOpen] = useState(false);

  // source: https://stackoverflow.com/a/42234988
  const navbarUserMenuRef = useRef(null);
  useOutsideAlerter(navbarUserMenuRef, () => setIsUserProfileMenuOpen(false));
  // end source

  const [userProfileImage, setUserProfileImage] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notSeen, setNotSeen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(async () => {
    // getNotifications();

    if (!isConnected) {
      const skt = io(apiURL, {
        extraHeaders: {
          userid: userDetails.id,
        },
      });
      setIsConnected(skt.connected);
      skt.on('invite-user', (message, groupID) => {
        const url = `/groups/${groupID}`;
        setNotifications([{ message, url }, ...notifications]);
        setNotSeen(true);
      });
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

  useEffect(() => {
    if (!userDetails) return;

    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .get(`${apiURL}/users/profile/${userDetails.id}`, config)
      .then(res => {
        setUserProfileImage(res.data.profileImage);
      })
      .catch(err => {
        setUserProfileImage(genericUser);
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  }, [userDetails]);

  return (
    <Box
      bg="black"
      w="100%"
      h="50px"
      style={{ overflow: 'hidden' }}
      // style={{ overflowX: 'hidden', position: 'relative' }}
    >
      <Popover>
        <Flex h="100%" justify="space-between" align="center">
          <Image
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', height: '40px', marginLeft: '1rem' }}
            src={greenLogo}
            alt="StudyTogether"
          />
          <Flex align="center" gap="1rem" style={{ marginLeft: '1rem' }}>
            <Text
              onClick={authToken ? () => navigate('/groups') : null}
              style={{
                cursor: authToken ? 'pointer' : 'default',
                fontWeight: 'bold',
                color: authToken ? 'white' : 'gray',
              }}
            >
              Groups
            </Text>
            <Text
              onClick={authToken ? () => navigate('/groups/create') : null}
              style={{
                cursor: authToken ? 'pointer' : 'default',
                fontWeight: 'bold',
                color: authToken ? 'white' : 'gray',
              }}
            >
              Create a group
            </Text>

            <Text
              onClick={() => navigate('/about')}
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              color={colors.white}
            >
              About
            </Text>
          </Flex>

          <Flex
            align="center"
            gap="1rem"
            style={{
              marginLeft: 'auto',
              marginRight: '1rem',
              position: 'relative',
            }}
          >
            {authToken !== null ? (
              <div>
                <Flex align="center" gap="1rem">
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
                  {userProfileImage ? (
                    <img
                      onClick={() => {
                        setIsUserProfileMenuOpen(!isUserProfileMenuOpen);
                      }}
                      style={{
                        display: 'block',
                        height: '35px',
                        width: '35px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: 'green solid 0.5px',
                      }}
                      src={userProfileImage}
                      alt="user profile"
                    />
                  ) : (
                    <Spinner />
                  )}
                </Flex>
              </div>
            ) : (
              <>
                <GreenButton onClick={() => navigate('/login')}>
                  Login
                </GreenButton>
                <GreenButton onClick={() => navigate('/register')}>
                  Register
                </GreenButton>
              </>
            )}
          </Flex>

          <PopoverContent style={{ left: '68vw', top: '45px' }}>
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

          <div
            ref={navbarUserMenuRef}
            style={{
              position: 'absolute',
              right: '225px',
              top: '45px',
            }}
          >
            <Menu isOpen={isUserProfileMenuOpen}>
              <MenuList zIndex={10}>
                <MenuItem onClick={() => navigate(`/user/${userDetails.id}`)}>
                  View your profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/saved-groups')}>
                  Saved groups
                </MenuItem>
                <MenuItem onClick={() => navigate('/group-history')}>
                  Group history
                </MenuItem>
                <MenuItem onClick={() => navigate('/cal')}>Calendar</MenuItem>
                <MenuItem onClick={() => navigate('/user/notifications')}>
                  Notifications
                </MenuItem>
                <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Flex>
      </Popover>
    </Box>
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

NavBar.propTypes = {
  authState: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  authToken: PropTypes.string.isRequired,
  userDetails: {
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }.isRequired,
  dispatch: PropTypes.func.isRequired,
};

NavBar.defaultProps = {};

export default connect(state => ({
  authState: state.Auth,
  // eslint-disable-next-line no-undef
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
  userDetails:
    (Object.keys(state.Auth.userDetails).length === 0
      ? null
      : state.Auth.userDetails) ||
    JSON.parse(localStorage.getItem('userDetails')),
}))(NavBar);
