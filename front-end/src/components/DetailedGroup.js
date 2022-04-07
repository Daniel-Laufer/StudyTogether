import { Box, Stack, VStack, Text, Image, Tag, Flex } from '@chakra-ui/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as colors from '../utils/colors';
import GreenButton from './GreenButton';

const diffSize = size =>
  size === 'lg'
    ? {
        stackSize: '100%',
        vstackSpacing: '1.5rem',
        fontSize: '20px',
        noOfLines: '',
        imgMr: ['0', '0', '20px'],
        imgH: 300,
        imgW: 400,
        imgAlign: ['center', 'center', 'left'],
      }
    : {
        stackSize: { base: '300px', md: '400px' },
        vstackSpacing: '6px',
        fontSize: '12px',
        noOfLines: '1',
        imgH: 150,
        ImgW: 300,
        imgMr: '',
        imgAlign: ['center', 'center', 'left'],
      };

function CustomText(fontSize, noOfLines, title, text, isLink) {
  return (
    <Text
      fontWeight="bold"
      color={colors.grey.dark}
      fontSize={fontSize}
      mt="0px"
      maxWidth="500px"
      noOfLines={noOfLines}
    >
      {`${title} `}
      <Text
        as="span"
        fontWeight="normal"
        wordBreak="break-word"
        style={
          isLink
            ? {
                color: colors.green.medium,
                textDecoration: 'underline',
              }
            : {
                color: colors.grey.dark,
              }
        }
      >
        {text}
      </Text>
    </Text>
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
  hostId,
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
    vstackSpacing,
    fontSize,
    noOfLines,
    imgMr,
    imgAlign,
    imgH,
    imgW,
  } = diffSize(size);

  const groupView = (
    <Stack
      w={stackSize}
      direction={{ base: 'column', md: 'row' }}
      align="left"
      spacing={4}
      wrap
    >
      <VStack>
        <Image
          marginLeft={5}
          paddingTop="5%"
          paddingBottom="5%"
          src={img}
          sx={{
            height: imgH,
            width: imgW,
          }}
          alt={imgAlt}
          borderRadius="lg"
          mr={imgMr}
          alignSelf={imgAlign}
        />
        <Flex justify="flex-start" gap="5px">
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
        </Flex>
      </VStack>

      <VStack justifyContent="center" spacing={vstackSpacing} align="left">
        {title && CustomText(fontSize, noOfLines, `Title: ${title}`, false)}
        {CustomText(
          fontSize,
          noOfLines,
          'Availability:',
          `${availability}`,
          false
        )}
        {CustomText(fontSize, noOfLines, 'When:', `${when}`, false)}
        {CustomText(
          fontSize,
          noOfLines,
          'Duration:',
          `${durationHours} hour(s) ${durationMins} min(s)`,
          false
        )}
        <Link to={`/user/${hostId}`}>
          {CustomText(fontSize, noOfLines, 'Hosted by:', `${host}`, true)}
        </Link>
        {CustomText(fontSize, noOfLines, 'Description:', `${desc}`, false)}
        {CustomText(fontSize, noOfLines, 'Tags:', `${restrict}`, false)}
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
  hostId: PropTypes.string.isRequired,
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
