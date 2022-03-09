import React from 'react';
import { Box, Image, Tooltip } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function GroupMembers({ userInfo }) {
  return (
    <Link to={`/user/${userInfo.id}`}>
      <Tooltip label={userInfo.name}>
        <Box>
          <Image
            src={userInfo.imgSrc}
            borderRadius="full"
            boxSize="60px"
            alignSelf="center"
          />
        </Box>
      </Tooltip>
    </Link>
  );
}

GroupMembers.propTypes = {
  userInfo: {
    id: PropTypes.string,
    name: PropTypes.string,
    imgSrc: PropTypes.string,
  },
};

GroupMembers.defaultProps = {
  userInfo: {
    imgSrc: '',
    name: '',
    id: '',
  },
};

export default GroupMembers;
