import { Box, Stack, VStack, Text, Image, Tag, HStack } from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as colors from '../utils/colors';
import GreenButton from './GreenButton';

const diffSize = size =>
  size === 'lg'
    ? {
        stackSize: '100%',
        imgWidth: ['300px', '350px', '400px'],
        vstackSpacing: '1.5rem',
        fontSize: '20px',
        noOfLines: '',
        imgMr: ['0', '0', '20px'],
        imgAlign: ['center', 'center', 'left'],
      }
    : {
        stackSize: { base: '300px', md: '400px' },
        imgWidth: '150px',
        vstackSpacing: '6px',
        fontSize: '12px',
        noOfLines: '1',
        imgMr: '',
        imgAlign: ['center', 'center', 'left'],
      };

function CustomText(fontSize, noOfLines, titles, text) {
  return (
    <HStack>
      <Text
        fontWeight="bold"
        color={colors.grey.dark}
        fontSize={fontSize}
        mt="0px"
        noOfLines={noOfLines}
      >
        {titles}
      </Text>
      <Text
        fontWeight="normal"
        color={colors.grey.dark}
        fontSize={fontSize}
        mt="0px"
        noOfLines={noOfLines}
      >
        {text}
      </Text>
    </HStack>
  );
}

function DetailedGroup({
  title,
  restrict,
  availability,
  when,
  durationHours,
  durationMins,
  host,
  desc,
  img,
  imgAlt,
  onClickFunc,
  link,
  size,
  selected,
  status,
}) {
  const {
    stackSize,
    imgWidth,
    vstackSpacing,
    fontSize,
    noOfLines,
    imgMr,
    imgAlign,
  } = diffSize(size);

  const groupView = (
    <Stack
      w={stackSize}
      direction={{ base: 'column', md: 'row' }}
      align="left"
      wrap
    >
      <Image
        src={img}
        width={imgWidth}
        alt={imgAlt}
        borderRadius="lg"
        mr={imgMr}
        alignSelf={imgAlign}
      />
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
      <VStack justifyContent="center" spacing={vstackSpacing} align="left">
        {title && CustomText(fontSize, noOfLines, `Title: ${title}`)}
        {CustomText(fontSize, noOfLines, 'Restriction:', `${restrict}`)}
        {CustomText(fontSize, noOfLines, 'Availability:', `${availability}`)}
        {CustomText(fontSize, noOfLines, 'When:', `${when}`)}
        {/* need to subtract dates and format them */}
        {CustomText(
          fontSize,
          noOfLines,
          'Duration:',
          `${durationHours} hour(s) ${durationMins} min(s)`
        )}
        {CustomText(fontSize, noOfLines, 'Hosted by:', `${host}`)}
        {CustomText(fontSize, noOfLines, 'Description:', `${desc}`)}
      </VStack>
    </Stack>
  );

  return (
    <Box
      p={2}
      overflow="hidden"
      bg="none"
      border={0}
      textAlign="left"
      w={stackSize}
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
      {size === 'md' ? (
        <Stack>
          {groupView}
          <Link to={link}>
            <GreenButton>View More</GreenButton>
          </Link>
        </Stack>
      ) : (
        <Stack>{groupView}</Stack>
      )}
    </Box>
  );
}

DetailedGroup.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.element.isRequired,
  imgAlt: PropTypes.string.isRequired,
  restrict: PropTypes.string.isRequired,
  availability: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  when: PropTypes.string.isRequired,
  durationHours: PropTypes.string.isRequired,
  durationMins: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  size: 'md' || 'lg',
  onClickFunc: PropTypes.func,
  selected: PropTypes.bool,
  status: {
    reschedule: PropTypes.boolean,
    cancelled: PropTypes.boolean,
    full: PropTypes.boolean,
  },
  link: PropTypes.string,
};

DetailedGroup.defaultProps = {
  size: 'md',
  onClickFunc: () => null,
  selected: false,
  status: {
    reschedule: false,
    cancelled: false,
    full: false,
  },
  link: '',
};

export default DetailedGroup;
