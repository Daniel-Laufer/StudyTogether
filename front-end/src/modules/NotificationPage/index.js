import {
  Container,
  Text,
  VStack,
  HStack,
  StackDivider,
  Heading,
  Center,
  Image,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, StarIcon } from '@chakra-ui/icons';
// import { MoonIcon, StarIcon, SunIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiURL } from '../../utils/constants';
import { logout } from '../../actions/Auth';
import CustomSpinner from '../../components/CustomSpinner';
// import useHover from '../../hooks/useHover';
import * as colors from '../../utils/colors';

function NotificationPage({ authToken, dispatch }) {
  // const [hoverRef, isHovering] = useHover();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const getKeyword = string => {
    const regExp = /\[([^)]+)\]/;
    const matches = regExp.exec(string);
    // matches[1] contains the value between the parenthese
    return matches[1];
  };
  const getNotifications = () => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    setLoading(true);
    axios
      .get(`${apiURL}/users/notifications`, config)
      .then(res => {
        setLoading(false);
        console.log(res.data);
        setNotifications(res.data); // res.data is an array of objects
      })
      .catch(err => {
        setLoading(false);
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);

  return loading ? (
    <CustomSpinner />
  ) : (
    <Container maxW="container.md">
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={6}
        padding={10}
        borderLeft="1px solid gray"
        borderRight="1px solid gray"
        borderColor="gray.500"
        align="stretch"
        minHeight="100vh"
      >
        <Heading as="h3" size="lg">
          Notifications
        </Heading>
        {notifications.length > 0 ? (
          notifications.map(value => (
            <VStack
              key={value._id}
              align="stretch"
              spacing={2}
              cursor="pointer"
              onClick={() =>
                navigate(
                  value.groupId
                    ? `/groups/${value.groupId}`
                    : `/user/${value.followedUserID}`
                )
              }
            >
              <HStack align="stretch" marginBottom="" spacing="1rem">
                {value.type === 'attend' && (
                  <MoonIcon boxSize={6} color={colors.blue.medium} />
                )}
                {value.type === 'edit' && (
                  <SunIcon boxSize={6} color={colors.red.medium} />
                )}{' '}
                {value.type === 'host' && (
                  <StarIcon boxSize={6} color={colors.green.dark} />
                )}
                <Text color="gray.700">
                  <b style={{ color: 'black' }}>{getKeyword(value.summary)}</b>
                  {value.summary.replace(/\[(.+?)\]/g, ' ')}
                </Text>
              </HStack>
              <br />
              <Text noOfLines="2" color="gray.500">
                <b style={{ color: 'black' }}>Title:</b> {value.groupTitle}
              </Text>
              <Text noOfLines="2" color="gray.500">
                <b style={{ color: 'black' }}>Host:</b> {value.groupHost}
              </Text>
              <Text noOfLines="3" color="gray.500">
                <b style={{ color: 'black' }}>Description: </b>{' '}
                {value.groupDescription}
              </Text>
            </VStack>
          ))
        ) : (
          <Center>
            <VStack>
              <Text fontSize="2xl" color="gray.500" margin={5}>
                Nothing to see here
              </Text>
              <Image
                boxSize="350px"
                objectFit="cover"
                src="https://i.postimg.cc/jSYcRR2X/image-psd.png"
              />
            </VStack>
          </Center>
        )}
      </VStack>
    </Container>
  );
}

NotificationPage.propTypes = {
  authToken: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

NotificationPage.defaultProps = {
  authToken: '',
};

export default connect(state => ({
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
}))(NotificationPage);
