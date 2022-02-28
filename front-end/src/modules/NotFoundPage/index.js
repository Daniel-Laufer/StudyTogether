/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Center,
  UnorderedList,
  ListItem,
  Container,
  Flex,
  Text,
  Image,
  Button,
} from '@chakra-ui/react';
import { connect } from 'react-redux';
import axios from 'axios';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import Fade from 'react-reveal/Fade';
import groupStudying from '../../assets/images/landing-page-group-studying.jpeg';
import groupStudyingOutdoors from '../../assets/images/outdoor-group.jpeg';
import studyTogetherFullLogo from '../../assets/images/logolight.png';
import { apiURL } from '../../utils/constants';
import { Example } from '../../actions';
import * as colors from '../../utils/colors';
import useGetScrollPosition from '../../hooks/useGetScrollPosition';

function NotFoundPage({ dispatch }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Text
        fontSize="6xl"
        fontWeight={700}
        style={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Page not found
      </Text>
    </div>
  );
}

export default connect(state => ({
  user: state.Example.name,
}))(NotFoundPage);
