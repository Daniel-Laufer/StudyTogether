import React from 'react';
import styled from 'styled-components';
import { Box, Image, Flex, Spacer } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as colors from '../utils/colors';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  filter: brightness(70%);
`;

function Group({ heading, img, imgAlt, restrict, price, link }) {
  return (
    <Box
      border={0}
      bg="none"
      as="button"
      w={{ base: '400px', sm: '300px', md: '350px' }}
      borderRadius="md"
      px={2}
      py={4}
      overflow="hidden"
    >
      <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box
          sx={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 600,
            margin: 0,
            paddingBottom: '9px',
            textAlign: 'left',
          }}
        >
          {heading}
        </Box>
        <ImageContainer>
          <Image src={img} htmlWidth="100%" alt={imgAlt} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              textAlign: 'center',
              width: '100%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'Inter',
              fontSize: '30px',
              filter: 'brightness(70%)',
              color: colors.white,
            }}
          >
            More Information
          </Box>
        </ImageContainer>
        <Flex>
          <Box color={colors.grey.dark}>{restrict}</Box>
          <Spacer />
          <Box color={colors.grey.dark}>{price}</Box>
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
