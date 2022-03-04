import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Image,
  Flex,
  Spacer,
  Tag,
  HStack,
  VStack,
} from '@chakra-ui/react';
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
  status,
}) {
  return (
    <VStack
      border={0}
      as="button"
      w={{ base: '400px', sm: '300px', md: '350px' }}
      px={2}
      py={2}
      overflow="hidden"
      justifyContent="space-between"
      alignItems="start"
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
      onClick={() => onClickFunc()}
    >
      <Box
        sx={{
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 600,
          margin: 0,
          textAlign: 'left',
        }}
      >
        {heading}
      </Box>
      <HStack mb={2}>
        {status.cancelled ? (
          <Tag colorScheme="red" m={0}>
            Cancelled
          </Tag>
        ) : null}
        {status.reschedule ? (
          <Tag colorScheme="yellow" m={0}>
            Rescheduled
          </Tag>
        ) : null}
        {status.full ? (
          <Tag colorScheme="green" m={0}>
            Full
          </Tag>
        ) : null}
      </HStack>
      <ImageContainer>
        <Image src={img} htmlWidth="334px" htmlHeight="223px" alt={imgAlt} />
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
    </VStack>
  );
}

Group.propTypes = {
  heading: PropTypes.string.isRequired,
  img: PropTypes.element.isRequired,
  imgAlt: PropTypes.string.isRequired,
  restrict: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  status: {
    reschedule: PropTypes.boolean,
    cancelled: PropTypes.boolean,
    full: PropTypes.boolean,
  },
  onClickFunc: PropTypes.func,
  selected: PropTypes.bool,
};

Group.defaultProps = {
  status: {
    reschedule: false,
    cancelled: false,
    full: false,
  },
  onClickFunc: () => null,
  selected: false,
};

export default Group;
