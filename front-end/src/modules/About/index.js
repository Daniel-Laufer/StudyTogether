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
  VStack,
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

function About({ dispatch }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <Fade cascade duration={500}>
        <SectionOneContainer id="landing-page-section-1">
          <Text
            fontSize="6xl"
            fontWeight={700}
            align="center"
            style={{ paddingTop: '100px' }}
          >
            Our Team
          </Text>
          <Flex
            align="flex-end"
            justify="center"
            style={{ height: '300px', margin: 'auto' }}
            wrap="wrap"
            gap="40px"
          >
            <VStack>
              <Image
                borderRadius="full"
                boxSize="150px"
                src="https://avatars.githubusercontent.com/u/29133464?v=4"
                alt="Daniel Laufer"
              />
              <Text>Daniel Laufer</Text>
            </VStack>
            <VStack>
              <Image
                borderRadius="full"
                boxSize="150px"
                src="https://assets.teenvogue.com/photos/586fb5d4f77a0c673d72629f/1:1/w_2417,h_2417,c_limit/GettyImages-165443495.jpg"
                alt="John Lewczuk"
              />
              <Text>John Lewczuk</Text>
            </VStack>
            <VStack>
              <Image
                borderRadius="full"
                boxSize="150px"
                src="https://media-exp1.licdn.com/dms/image/C4D03AQGlnQ0xsPLXBg/profile-displayphoto-shrink_100_100/0/1643164904718?e=1652918400&v=beta&t=fhxdP76fHucgSlYGRZqbBsjah2G0xpawaUwK9VnSCUI"
                alt="Maor Gornic"
              />
              <Text>Maor Gornic</Text>
            </VStack>
            <VStack>
              <Image
                borderRadius="full"
                boxSize="150px"
                src="https://media-exp1.licdn.com/dms/image/C5603AQHPzgYLzpZWJA/profile-displayphoto-shrink_100_100/0/1592123486055?e=1652918400&v=beta&t=JRaqAS4iuVnnjPsSd2sl8x-tdAiHpHg44CPn4b_sT8k"
                alt="Milind Vishnoi"
              />
              <Text>Milind Vishnoi</Text>
            </VStack>
            <VStack>
              <Image
                borderRadius="full"
                boxSize="150px"
                src="https://media-exp1.licdn.com/dms/image/C4E03AQFHPJVs7AYAtA/profile-displayphoto-shrink_100_100/0/1601600989553?e=1652918400&v=beta&t=pc39TlIejLYSNStqhV1HTHxA84HIRKOjpulKnFRvRjI"
                alt="Mohamed Issa"
              />
              <Text>Mohamed Issa</Text>
            </VStack>
          </Flex>
        </SectionOneContainer>
      </Fade>
      <div
        style={{
          position: 'absolute',
          bottom: '0px',
          width: '100%',
          height: '100px',
        }}
      >
        <CustomFooter style={{ position: 'relative' }}>
          <Image
            src={studyTogetherFullLogo}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              height: '40px',
            }}
          />
        </CustomFooter>
      </div>
    </div>
  );
}

const SectionOneContainer = styled.section`
  width: 100%;
`;

const CustomFooter = styled.section`
  background-color: ${colors.black};
  height: 100px;
  width: 100%;
`;

export default connect(state => ({
  user: state.Example.name,
}))(About);
