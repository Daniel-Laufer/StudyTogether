import React from 'react';
import styled from 'styled-components';
import { Box, Image, Flex, Spacer } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import * as colors from '../utils/colors';

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  filter: brightness(70%);
`;

function Group({
  heading,
  img,
  imgAlt,
  restrict,
  price,
  onClickFunc,
  selected,
}) {
  return (
    <Box
      border={0}
      as="button"
      w={{ base: '400px', sm: '300px', md: '350px' }}
      px={2}
      py={4}
      overflow="hidden"
      style={
        selected
          ? {
              border: `2px solid ${colors.green.dark}`,
              borderRadius: 'var(--chakra-radii-md)',
              backgroundColor: 'var(--chakra-colors-gray-100)',
            }
          : {
              border: '1px solid var(--chakra-colors-gray-200)',
              borderRadius: 'var(--chakra-radii-md)',
            }
      }
    >
      <Box onClick={() => onClickFunc()}>
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
        </ImageContainer>
        <Flex>
          <Box color={colors.grey.dark}>{restrict}</Box>
          <Spacer />
          <Box color={colors.grey.dark}>{price}</Box>
        </Flex>
      </Box>
    </Box>
  );
}

Group.propTypes = {
  heading: PropTypes.string.isRequired,
  img: PropTypes.element.isRequired,
  imgAlt: PropTypes.string.isRequired,
  restrict: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onClickFunc: PropTypes.func,
  selected: PropTypes.bool,
};

Group.defaultProps = {
  onClickFunc: () => null,
  selected: false,
};

export default Group;
