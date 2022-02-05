/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Image, Box, Flex, Button, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import greenLogo from '../assets/images/smalllogogreen.png';
import GreenButton from './GreenButton';
import * as colors from '../utils/colors';

function NavBar() {
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (authState.authToken !== '') navigate('/');
  //   }, [authState.authToken]);

  return (
    <Box bg="black" w="100%" h="50px">
      <Flex h="100%" justify="space-between">
        <Image
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          src={greenLogo}
          alt="StudyTogether"
        />
        <Flex align="center" gap="1rem" style={{ marginLeft: '1rem' }}>
          <Text
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
            color={colors.white}
          >
            Dashboard
          </Text>
          <Text
            onClick={() => navigate('/groups/create')}
            style={{ cursor: 'pointer' }}
            color={colors.white}
          >
            Create a group
          </Text>
        </Flex>
        <Flex
          align="center"
          gap="1rem"
          style={{ marginLeft: 'auto', marginRight: '1rem' }}
        >
          <GreenButton onClick={() => navigate('/login')}>Login</GreenButton>
          <GreenButton onClick={() => navigate('/register')}>
            Register
          </GreenButton>
        </Flex>
      </Flex>
    </Box>
  );
}

NavBar.propTypes = {
  authState: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
    authToken: PropTypes.string,
  }).isRequired,
  //   dispatch: PropTypes.func.isRequired,
};

NavBar.defaultProps = {};

export default connect(state => ({
  authState: state.Auth,
}))(NavBar);
