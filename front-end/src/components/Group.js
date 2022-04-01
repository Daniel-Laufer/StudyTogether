import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
import GreenButton from './GreenButton';

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
  link,
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
          fontSize: '16px',
          fontWeight: 'bold',
          margin: 0,
          textAlign: 'left',
        }}
      >
        {heading}
      </Box>
      <HStack mb={2} style={{ height: '25px' }}>
        {status.cancelled ? (
          <Tag colorScheme={colors.statusColors.cancelled} m={0}>
            Cancelled
          </Tag>
        ) : null}
        {status.reschedule ? (
          <Tag colorScheme={colors.statusColors.rescheduled} m={0}>
            Rescheduled
          </Tag>
        ) : null}
        {status.full ? (
          <Tag colorScheme={colors.statusColors.full} m={0}>
            Full
          </Tag>
        ) : null}
      </HStack>
      <ImageContainer style={{ height: '230px' }}>
        <Image src={img} htmlWidth="334px" htmlHeight="223px" alt={imgAlt} />
      </ImageContainer>
      <Flex>
        <Box color={colors.grey.dark}>{restrict}</Box>
        <Spacer />
        <Box color={colors.grey.dark}>{price}</Box>
      </Flex>
      <Link to={link}>
        <GreenButton>View More</GreenButton>
      </Link>
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
  link: PropTypes.string,
};

Group.defaultProps = {
  status: {
    reschedule: false,
    cancelled: false,
    full: false,
  },
  onClickFunc: () => null,
  selected: false,
  link: '',
};

export default Group;
