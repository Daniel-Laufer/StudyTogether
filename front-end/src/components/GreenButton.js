/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Image, Box, Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import * as colors from '../utils/colors';

function GreenButton({
  text,
  width,
  height,
  onClick,
  isLoading,
  children,
  style,
}) {
  return (
    <Button
      onClick={onClick}
      {...(width ? { width } : {})}
      {...(height ? { height } : {})}
      colorScheme="green"
      bg={colors.green.dark}
      style={style}
      _hover={{ bg: colors.green.medium }}
      borderColor={colors.green.dark}
      _active={{
        bg: colors.green.light,
        transform: 'scale(0.98)',
        borderColor: colors.green.dark,
      }}
      _focus={{
        boxShadow: `0 0 1px 2px ${colors.green.dark}, 0 1px 1px rgba(0, 0, 0, .15)`,
      }}
    >
      {children}
    </Button>
  );
}

GreenButton.propTypes = {
  text: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.shape({}),
};
GreenButton.defaultProps = {
  text: 'Button',
  width: null,
  height: null,
  onClick: () => console.log('Clicked!'),
  isLoading: false,
  style: {},
};

export default GreenButton;
