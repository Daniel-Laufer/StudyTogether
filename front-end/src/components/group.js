import React from 'react';
import styled from 'styled-components';
import { Box, Image, Flex, Spacer } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import * as colors from '../../utils/colors';

const Heading = styled.p`
  font-family: 'Inter';
  font-size: 16px;
  color: 83878a;
  font-weight: 600;
  margin: 0;
  padding-bottom: 9px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 375px;
  filter: brightness(70%);
`;

const ImageText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  width: 100%;
  transform: translate(-50%, -50%);
  font-family: 'Inter';
  font-size: 30px;
`;

function Group({ heading, img, imgAlt, restrict, price, link }) {
  return (
    <Box
      border={0}
      bg="none"
      as="button"
      w={{ base: '400px', sm: '300px', md: '300px' }}
      borderRadius="md"
      px={2}
      py={7}
      mx={8}
      my={4}
      overflow="hidden"
    >
      <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Heading>{heading}</Heading>
        <ImageContainer>
          <Image src={img} htmlHeight="375px" htmlWidth="100%" alt={imgAlt} />
          <ImageText>More Information</ImageText>
        </ImageContainer>
        <Flex>
          <Box p="4" color="red.400">
            {restrict}
          </Box>
          <Spacer />
          <Box p="4" color="green.400">
            {price}
          </Box>
        </Flex>
      </Link>
    </Box>
  );
}

Group.propTypes = {
  heading: PropTypes.string.isRequired,
  img: PropTypes.element.isRequired,
  imgAlt: PropTypes.string.isRequired,
  restrict: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Group;
