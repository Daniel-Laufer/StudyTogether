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

function LandingPage({ dispatch }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(Example.exampleAction('daniel2'));
  }, []);

  // source: https://github.com/Daniel-Laufer/portfolio_website/blob/main/src/components/sections/intro.js
  const scrollPosition = useGetScrollPosition();
  const scrollToSection = sectionId => {
    scroller.scrollTo(sectionId, {
      duration: 1000,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <>
      <Fade left cascade duration={1000}>
        <SectionOneContainer id="landing-page-section-1">
          <Box>
            <Text fontSize="6xl" fontWeight={700}>
              Study Together
            </Text>
            <Text fontSize="4xl" color={colors.green.dark} fontWeight={700}>
              studying with others has never been so easy!
            </Text>
            <Button
              colorScheme="blackAlpha"
              style={{ backgroundColor: colors.black, marginTop: '1rem' }}
              onClick={() => scrollToSection('landing-page-section-2')}
            >
              Learn more
            </Button>
          </Box>
          <Box>
            <Image
              src={groupStudying}
              style={{ borderRadius: '55px', height: '270px' }}
            />
          </Box>
        </SectionOneContainer>
      </Fade>

      <SectionTwoContainer id="landing-page-section-2">
        <Box>
          <Image
            src={groupStudyingOutdoors}
            style={{ borderRadius: '55px', height: '370px' }}
          />
        </Box>
        <Box style={{ width: '50%' }}>
          <Text fontSize="5xl" fontWeight={700} style={{ color: colors.black }}>
            Form study groups at your university
          </Text>
          <Text fontSize="3xl" fontWeight={700}>
            Studying with others is an effective way of preparing for
            assessments, however it can be challenging to find others to study
            with at times. That’s where <em>StudyTogether</em> comes to the
            rescue! StudyTogether makes it easy to find others to study with at
            your university.
          </Text>
        </Box>
      </SectionTwoContainer>

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
    </>
  );
}

const SectionOneContainer = styled.section`
  padding: 4rem;
  padding-top: 8rem;
  background-color: ${colors.white};
  display: flex;
  flex-wrap: no-wrap;
  gap: 2rem;
  justify-content: center;
  height: 80vh;

  @media (max-width: 1240px) {
    flex-wrap: wrap;
  }
`;

const SectionTwoContainer = styled.section`
  padding: 4rem;
  padding-top: 8rem;
  background-color: ${colors.white};
  display: flex;
  flex-wrap: no-wrap;
  gap: 4rem;
  justify-content: center;
  height: 90vh;
  background-color: ${colors.green.dark};

  @media (max-width: 1240px) {
    flex-wrap: wrap;
  }
`;
const CustomFooter = styled.section`
  background-color: ${colors.black};
  height: 100px;
`;

export default connect(state => ({
  user: state.Example.name,
}))(LandingPage);
