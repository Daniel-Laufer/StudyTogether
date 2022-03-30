/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
import {
  Container,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Tab,
  Box,
  Image,
  Text,
  Button,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import CustomSpinner from '../../components/CustomSpinner';
import { apiURL } from '../../utils/constants';

function Following({ authToken }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState({
    following: true,
    followers: true,
  });

  useEffect(() => {
    if (authToken === null) setTimeout(() => navigate('/login'), 3000);
  }, [authToken]);

  useEffect(() => {
    if (authToken === null) setTimeout(() => navigate('/login'), 3000);
  }, [authToken]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .get(`${apiURL}/users/profile/${id}/followers`, config)
      .then(res => {
        setLoading({ ...loading, followers: false });
        setFollowers(res.data.followers);
      })
      .catch(e => {
        setLoading({
          ...loading,
          following: false,
        });
        console.log(e);
      });
    axios
      .get(`${apiURL}/users/profile/${id}/following`, config)
      .then(res => {
        setLoading({ ...loading, following: false });
        setFollowing(res.data.following);
      })
      .catch(e => {
        setLoading({
          ...loading,
          followers: false,
        });
        console.log(e);
      });
  }, []);

  const handleUnfollow = userId => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .patch(`${apiURL}/users/profile/unfollow/${userId}`, {}, config)
      .then(() => {
        setFollowing(following.filter(user => user._id !== userId));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const profiles = (userId, name, role, image, isFollowing) => (
    <Box width="full" alignItems="center" display="flex" mt={4}>
      <Box
        as="button"
        display="flex"
        width="full"
        onClick={() => navigate(`/user/${userId}`)}
      >
        <Image borderRadius="full" boxSize="60px" src={image} />
        <VStack
          ml={4}
          height="60px"
          alignItems="start"
          justify="center"
          spacing={0}
        >
          <Text as="b">{name}</Text>
          <Text>{role}</Text>
        </VStack>
      </Box>
      {isFollowing ? (
        <Button onClick={() => handleUnfollow(userId)}>Unfollow</Button>
      ) : null}
    </Box>
  );

  if (authToken === null) {
    return (
      <Container maxW="container.lg">
        <Alert status="warning">
          <AlertIcon />
          You need to be logged in to view your saved study groups. Redirecting
          you to the login page now...
        </Alert>
      </Container>
    );
  }

  return loading.followers || loading.following ? (
    <Container>
      <Box mt={3}>
        <Tabs isFitted>
          <TabList>
            <Tab>Followers</Tab>
            <Tab>Following</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {followers.length > 0 ? (
                followers.map(user =>
                  profiles(
                    user._id,
                    user.firstName + ' ' + user.lastName,
                    user.role,
                    user.profileImage,
                    false
                  )
                )
              ) : (
                <Box>
                  <Text>No followers!</Text>
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              {following.length > 0 ? (
                following.map(user =>
                  profiles(
                    user._id,
                    user.firstName + ' ' + user.lastName,
                    user.role,
                    user.profileImage,
                    true
                  )
                )
              ) : (
                <Box>
                  <Text>Not following anyone yet!</Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  ) : (
    <CustomSpinner />
  );
}

Following.propTypes = {
  authToken: PropTypes.string,
};

Following.defaultProps = {
  authToken: '',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(Following);
