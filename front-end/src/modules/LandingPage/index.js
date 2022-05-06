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
  Stack,
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
import sucessImage from '../../assets/images/success.jpeg';
import { apiURL } from '../../utils/constants';
import { Example } from '../../actions';
import * as colors from '../../utils/colors';
import useGetScrollPosition from '../../hooks/useGetScrollPosition';
import Slider from '../Slider';

function LandingPage({ dispatch }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <SectionOneContainer id="landing-page-section-1">
        <Fade left duration={500}>
          <Box>
            <Text fontSize="6xl" fontWeight={700}>
              StudyTogether
            </Text>
            <Text fontSize="4xl" color={colors.green.dark} fontWeight={700}>
              Studying with others has never been so easy!
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
        </Fade>
        <div className="custom-shape-divider-bottom-1651779793">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            />
          </svg>
        </div>
      </SectionOneContainer>

      <SectionTwoContainer id="landing-page-section-2">
        <Fade>
          <Image
            src={groupStudyingOutdoors}
            style={{
              borderRadius: '55px',
              height: '420px',
              minWidth: '550px',
            }}
          />
        </Fade>
        <Box
          id="form-study-groups-text-container"
          style={{
            width: '50%',
            minWidth: '450px',
            backgroundColor: 'white',
            height: '420px',
            borderRadius: '55px',
            padding: '2rem',
          }}
        >
          <Text
            fontSize="3xl"
            fontWeight={700}
            style={{
              color: colors.black,
              fontWeight: '900',
              fontSize: '45px',
            }}
          >
            Form study groups at your university
          </Text>

          <Text fontSize="2xl" fontWeight={700}>
            Studying with others is an effective way of preparing for
            assessments, however it can be challenging to find others to study
            with at times. That’s where{' '}
            <span style={{ color: colors.green.dark, fontWeight: '900' }}>
              StudyTogether
            </span>{' '}
            comes to the rescue!{' '}
            <span style={{ color: colors.green.dark, fontWeight: '900' }}>
              StudyTogether
            </span>{' '}
            makes it easy to find others to study with at your university.
          </Text>
        </Box>
      </SectionTwoContainer>

      <SectionThreeContainer>
        <Stack style={{ marginTop: '2rem' }}>
          <div className="custom-shape-divider-top-1651780203">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="shape-fill"
              />
            </svg>
          </div>

          <h1
            style={{
              fontWeight: '900',
              fontSize: '45px',
              color: 'black',
              marginTop: '1.5rem',
            }}
          >
            Topics students have studied in the past
          </h1>
          <Slider />
        </Stack>
      </SectionThreeContainer>

      <SectionFourContainer>
        <div className="custom-shape-divider-top-1651780402">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            />
          </svg>
        </div>
        <Fade left>
          <Flex direction="column" gap="2rem" style={{ width: '80%' }}>
            <h1
              style={{
                fontWeight: '900',
                fontSize: '45px',
                color: 'white',
              }}
            >
              Share your struggle with other students and achieve success
              <span style={{ color: colors.green.dark }}> together!</span> 💯
            </h1>
            <Box>
              <Image
                src={sucessImage}
                style={{
                  borderRadius: '55px',
                  height: '420px',
                  minWidth: '550px',
                  alignSelf: 'center',
                }}
              />
            </Box>
          </Flex>
        </Fade>
      </SectionFourContainer>

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
  height: 90vh;
  position: relative;

  .custom-shape-divider-bottom-1651779793 {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
  }

  .custom-shape-divider-bottom-1651779793 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 63px;
  }

  .custom-shape-divider-bottom-1651779793 .shape-fill {
    fill: #25c870;
  }

  @media (max-width: 1240px) {
    flex-wrap: wrap;
    height: auto;
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

  @media (max-width: 1281px) {
    flex-wrap: wrap;
    height: auto;

    & {
      #form-study-groups-text-container {
        width: 80% !important;
        height: auto !important;
      }
    }
  }
`;

const SectionThreeContainer = styled.section`
  padding: 4rem;
  position: relative;
  background-color: ${colors.white};
  gap: 4rem;
  height: 90vh;

  .custom-shape-divider-top-1651780203 {
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  .custom-shape-divider-top-1651780203 svg {
    position: relative;
    display: block;
    width: calc(121% + 1.3px);
    height: 67px;
    transform: rotateY(180deg);
  }

  .custom-shape-divider-top-1651780203 .shape-fill {
    fill: #25c870;
  }
`;

const SectionFourContainer = styled.section`
  padding: 4rem;
  position: relative;
  padding-top: 8rem;
  background-color: ${colors.black};
  display: flex;
  flex-wrap: no-wrap;
  gap: 4rem;
  justify-content: center;
  height: 90vh;

  .custom-shape-divider-top-1651780402 {
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: rotate(180deg);
  }

  .custom-shape-divider-top-1651780402 svg {
    position: relative;
    display: block;
    width: calc(147% + 1.3px);
    height: 49px;
    transform: rotateY(180deg);
  }

  .custom-shape-divider-top-1651780402 .shape-fill {
    fill: #ffffff;
  }
`;

const CustomFooter = styled.section`
  background-color: ${colors.black};
  height: 100px;
`;

export default connect(state => ({
  user: state.Example.name,
}))(LandingPage);
