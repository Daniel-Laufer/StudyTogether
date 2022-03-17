/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, forwardRef } from 'react';
import { Image, Box, Flex, Button, Text, Heading } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import * as colors from '../utils/colors';
import GreenButton from './GreenButton';

function MarkerInfoWindow({ group }) {
  const navigate = useNavigate();
  const { endDateTime, startDateTime, title, description } = group.metaData;

  return (
    <div style={{ width: '150px' }}>
      <Flex direction="column" gap="5px">
        <Heading as="h2" size="m">
          {title}
        </Heading>
        <Text>{`${moment(startDateTime).format('HH:mm')}-${moment(
          endDateTime
        ).format('HH:mm')}`}</Text>
        <Text>{moment(startDateTime).format('YYYY/MM/DD')}</Text>
        <Text>
          {description.substring(0, 36) +
            (description.length > 36 ? '...' : '')}
        </Text>

        <GreenButton onClick={() => navigate(`/groups/${group._id}`)}>
          View More
        </GreenButton>
      </Flex>
    </div>
  );
}

MarkerInfoWindow.propTypes = {
  group: PropTypes.shape().isRequired,
};
MarkerInfoWindow.defaultProps = {};

export default MarkerInfoWindow;
