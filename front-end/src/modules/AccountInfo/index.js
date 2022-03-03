/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
import {
  Container,
  VStack,
  Image,
  Text,
  Input,
  Grid,
  GridItem,
  Box,
  Select,
  Textarea,
  ListItem,
  UnorderedList,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import CustomSpinner from '../../components/CustomSpinner';
import { apiURL } from '../../utils/constants';
import Cat from '../../assets/images/cat.jpeg';
import GreenButton from '../../components/GreenButton';
import DetailedGroup from '../../components/DetailedGroup';
import { logout } from '../../actions/Auth';
import * as colors from '../../utils/colors';

function AccountInfo({ authToken, userDetails, dispatch }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState({
    groups: false,
    user: false,
  });
  const [dataUpdated, setDataUpdated] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: 'Geralt',
    lastName: 'Stan',
    profileAboutMe:
      "I am a first year student at UTM who's majoring in CS, and trying to find like-minded people",
    role: 'Student',
    profileImage: Cat,
    profileContactInfo:
      'You can reach me on Instagram, Snapchat, or email. I usually respond on the same day. IG: geralt.stan, Email: geralt.s@mail.utoronto.ca',
    profileInterests:
      'I like playing the Witcher 3 on my PS4 whever I catch a break from my school-work, and watching Naruto. I also like working on side-projects pertaining to AI.',
    profileCourses: [
      { id: '0', text: 'CSC301' },
      { id: '1', text: 'CSC302' },
    ],
  });
  const [oldUserInfo, setOldUserInfo] = useState({});
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (authToken === null) setTimeout(() => navigate('/login'), 3000);
  }, [authToken]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };
    axios
      .get(`${apiURL}/users/profile/${id}`, config)
      .then(res => {
        setOldUserInfo({
          ...res.data,
          profileCourses: res.data.profileCourses.map((c, index) => {
            const i = index.toString();
            return { id: i, text: c };
          }),
        });
        setUserInfo({
          ...res.data,
          profileCourses: res.data.profileCourses.map((c, index) => {
            const i = index.toString();
            return { id: i, text: c };
          }),
        });
        setLoading({
          ...loading,
          user: false,
        });
      })
      .catch(err => {
        setLoading({
          ...loading,
          user: false,
        });
        console.log(err);
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
    axios
      .get(`${apiURL}/studygroups/registered`, config)
      .then(res => {
        setGroups(res.data);
        setLoading({
          ...loading,
          groups: false,
        });
      })
      .catch(err => {
        setLoading({
          ...loading,
          groups: false,
        });
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
      });
  }, []);

  const handleDelete = i => {
    setUserInfo({
      ...userInfo,
      profileCourses: [
        ...userInfo.profileCourses.filter((tag, index) => index !== i),
      ],
    });
  };

  const handleAddition = c => {
    console.log(c);
    setUserInfo({
      ...userInfo,
      profileCourses: [...userInfo.profileCourses, c],
    });
  };

  const saveUserInfo = () => {
    if (JSON.stringify(userInfo) === JSON.stringify(oldUserInfo)) return;
    const config = {
      headers: { Authorization: `JWT ${authToken}` },
    };

    const body = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      profileAboutMe: userInfo.profileAboutMe,
      role: userInfo.role,
      profileImage: userInfo.profileImage,
      profileContactInfo: userInfo.profileContactInfo,
      profileInterests: userInfo.profileInterests,
      profileCourses: userInfo.profileCourses.reduce((acc, curr) => {
        acc.push(curr.text);
        return acc;
      }, []),
    };
    // setLoading(true);
    axios
      .patch(`${apiURL}/users/profile`, body, config)
      .then(() => {
        setDataUpdated(true);
        setInterval(() => {
          setDataUpdated(false);
        }, 3000);
      })
      .catch(err => {
        console.log(err);
        setErrorOccured(true);
        if (err.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        }
        setUserInfo(oldUserInfo);
        setInterval(() => {
          setErrorOccured(false);
        }, 3000);
      });
  };

  const [edit, setEdit] = useState(false);

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

  return !loading.groups && !loading.user ? (
    <Container maxW="container.lg" style={{ marginTop: '2rem' }}>
      <Grid templateColumns="repeat(2, 1fr)" gap={12}>
        <GridItem
          colSpan={[12, 12, 1]}
          style={{
            boxShadow: `2px 2px 2px 2px ${colors.grey.light}`,
            borderColor: 'colors.grey.medium',
            borderWidth: '1px',
          }}
          borderRadius="lg"
          p={8}
          mb={4}
          w={['100%', '100%', '300px']}
        >
          <VStack w="100%" alignItems="flex-start" justifyItems="left">
            {edit ? (
              <VStack w="100%" justifyContent="center">
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    Image URL:
                  </Text>
                  <Input
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        profileImage: e.target.value,
                      })
                    }
                    value={userInfo.profileImage}
                    placeholder="Image URL"
                  />
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    First Name:
                  </Text>
                  <Input
                    maxW="200px"
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        firstName: e.target.value,
                      })
                    }
                    value={userInfo.firstName}
                    placeholder="First Name"
                  />
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    Last Name:
                  </Text>
                  <Input
                    maxW="200px"
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        lastName: e.target.value,
                      })
                    }
                    value={userInfo.lastName}
                    placeholder="Last Name"
                  />
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    Role:
                  </Text>
                  <Select
                    width="175px"
                    maxW="200px"
                    defaultValue={userInfo.role}
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="Student">Student</option>
                    <option value="TA">TA</option>
                    <option value="Teacher">Teacher</option>
                  </Select>
                </Box>
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Description:
                </Text>
                <Textarea
                  value={userInfo.profileAboutMe}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      profileAboutMe: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Contact Info:
                </Text>
                <Textarea
                  value={userInfo.profileContactInfo}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      profileContactInfo: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Interests:
                </Text>
                <Textarea
                  value={userInfo.profileInterests}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      profileInterests: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Courses I&apos;m taking:
                </Text>
                <ReactTags
                  tags={userInfo.profileCourses}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  inputFieldPosition="bottom"
                  autocomplete
                />
                <GreenButton
                  width="200px"
                  style={{ fontSize: '20px' }}
                  onClick={() => {
                    setEdit(false);
                    saveUserInfo();
                  }}
                >
                  Save
                </GreenButton>
              </VStack>
            ) : (
              <VStack w="100%">
                <Image
                  src={userInfo.profileImage}
                  borderRadius="full"
                  boxSize="200px"
                  alignSelf="center"
                />
                <Text
                  fontSize={18}
                  as="b"
                  alignSelf="flex-start"
                  color={colors.grey.dark}
                >
                  {userInfo.firstName} {userInfo.lastName} ({userInfo.role})
                </Text>
                <Text color={colors.grey.dark}>{userInfo.profileAboutMe}</Text>
                {userDetails && id === userDetails.id ? (
                  <GreenButton
                    width="200px"
                    style={{ fontSize: '20px' }}
                    onClick={() => setEdit(true)}
                    alignSelf="center"
                  >
                    Edit
                  </GreenButton>
                ) : null}
                {userInfo.profileContactInfo ? (
                  <Box w="100%">
                    <Text
                      color={colors.grey.dark}
                      as="b"
                      alignSelf="flex-start"
                      fontSize={18}
                    >
                      Contact Info
                    </Text>
                    <Text color={colors.grey.dark}>
                      {userInfo.profileContactInfo}
                    </Text>
                  </Box>
                ) : null}
                {userInfo.profileInterests ? (
                  <Box w="100%">
                    <Text
                      color={colors.grey.dark}
                      as="b"
                      alignSelf="flex-start"
                      fontSize={18}
                    >
                      Interests
                    </Text>
                    <Text color={colors.grey.dark}>
                      {userInfo.profileInterests}
                    </Text>
                  </Box>
                ) : null}
                {userInfo.profileCourses &&
                userInfo.profileCourses.length !== 0 ? (
                  <Box w="100%">
                    <Text
                      color={colors.grey.dark}
                      as="b"
                      alignSelf="flex-start"
                      fontSize={18}
                    >
                      Courses I&apos;m taking
                    </Text>
                    <Box alignContent="flex-start" w="full">
                      <Text>I&apos;m enrolled in:</Text>
                      <UnorderedList>
                        {userInfo.profileCourses.map(c => (
                          <ListItem ml={2}>{c.text}</ListItem>
                        ))}
                      </UnorderedList>
                    </Box>
                  </Box>
                ) : null}
              </VStack>
            )}
          </VStack>
          {dataUpdated ? (
            <Alert
              style={{
                width: '100%',
              }}
              status="success"
              mt={5}
            >
              <AlertIcon />
              <AlertDescription>User information is updated!</AlertDescription>
            </Alert>
          ) : null}
          {errorOccured ? (
            <Alert
              style={{
                width: '100%',
              }}
              status="error"
              mt={5}
            >
              <AlertIcon />
              <AlertDescription>
                User information could not be updated. Please try agian!
              </AlertDescription>
            </Alert>
          ) : null}
        </GridItem>
        <GridItem
          colStart={[1, 1, 2]}
          colEnd={12}
          colSpan={[12, 12, 10]}
          rowSpan={2}
          style={{
            boxShadow: `3px 3px 3px 3px ${colors.grey.light}`,
            borderColor: 'colors.grey.medium',
            borderWidth: '1px',
          }}
          borderRadius="lg"
          p={8}
          mb={4}
        >
          <VStack w="full" alignItems="flex-start">
            <Text fontSize={[10, 25, 30]} as="b" color={colors.grey.dark}>
              {groups.length === 0
                ? 'You are part of no study groups.'
                : 'Study groups you are part of.'}
            </Text>
            {groups.length > 0
              ? groups.map(g => (
                  <DetailedGroup
                    key={g}
                    title={g.title}
                    restrict="UofT students"
                    availability={`${g.maxAttendees - g.curAttendees} / ${
                      g.maxAttendees
                    }`}
                    imgAlt="Study group image"
                    img={g.imageUrl}
                    when={g.time}
                    host={g.hostFirstName + g.hostLastName}
                    desc={g.description}
                    link={`${g._id}`}
                  />
                ))
              : null}
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  ) : (
    <CustomSpinner />
  );
}

AccountInfo.propTypes = {
  authToken: PropTypes.string,
  userDetails: {
    id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  },
  dispatch: PropTypes.func.isRequired,
};

AccountInfo.defaultProps = {
  authToken: '',
  userDetails: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
  },
};

export default connect(state => ({
  // eslint-disable-next-line no-undef
  authToken: state.Auth.authToken || localStorage.getItem('authToken'),
  userDetails:
    (Object.keys(state.Auth.userDetails).length === 0
      ? null
      : state.Auth.userDetails) ||
    JSON.parse(localStorage.getItem('userDetails')),
}))(AccountInfo);
