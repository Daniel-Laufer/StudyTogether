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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../actions/Auth';
import greenLogo from '../assets/images/smalllogogreen.png';
import genericUser from '../assets/images/cat-pfp.jpeg';
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

  const [userProfileImage, setUserProfileImage] = useState(genericUser);

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
      .catch(err => console.log(err));
  }, [userDetails]);

  return (
    <Box bg="black" w="100%" h="50px">
      <Flex h="100%" justify="space-between" align="center">
        <Image
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', height: '40px', marginLeft: '1rem' }}
          src={greenLogo}
          alt="StudyTogether"
        />
        <Flex align="center" gap="1rem" style={{ marginLeft: '1rem' }}>
          <Text
            onClick={authToken ? () => navigate('/dashboard') : null}
            style={{
              cursor: authToken ? 'pointer' : 'default',
              fontWeight: 'bold',
              color: authToken ? 'white' : 'gray',
            }}
          >
            Dashboard
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
            <div ref={navbarUserMenuRef}>
              <Flex align="center" gap="1rem">
                <NotificationBell />
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
                  src={genericUser}
                  alt="user profile"
                />
              </Flex>
              <div
                style={{
                  position: 'absolute',
                  right: '212px',
                  top: '45px',
                }}
              >
                <Menu isOpen={isUserProfileMenuOpen}>
                  <MenuList zIndex={10}>
                    <MenuItem
                      onClick={() => navigate(`/user/${userDetails.id}`)}
                    >
                      View your profile
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/saved-groups')}>
                      Saved groups
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/cal')}>
                      Calendar
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(logout())}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
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
      </Flex>
    </Box>
  );
}

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
