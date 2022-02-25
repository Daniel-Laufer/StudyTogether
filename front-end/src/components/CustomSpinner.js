/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/Auth';
import greenLogo from '../assets/images/smalllogogreen.png';
import genericUser from '../assets/images/cat-pfp.jpeg';
import GreenButton from './GreenButton';
import * as colors from '../utils/colors';

function CustomSpinner({ style, spinnerChakraSize }) {
  const defaultStyles = {
    height: '100vh',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  return (
    <div style={{ ...style, ...defaultStyles }}>
      <Spinner size={spinnerChakraSize} />
    </div>
  );
}

CustomSpinner.propTypes = {
  style: PropTypes.shape({}),
  spinnerChakraSize: PropTypes.string,
};

CustomSpinner.defaultProps = { style: {}, spinnerChakraSize: 'xl' };

export default connect(state => ({
  style: PropTypes.shape({}),
}))(CustomSpinner);
