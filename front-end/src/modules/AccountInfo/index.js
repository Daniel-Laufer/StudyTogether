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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import Cat from '../../assets/images/cat.jpeg';
import GreenButton from '../../components/GreenButton';
import SecondGroup from '../../components/SecondGroup';
import * as colors from '../../utils/colors';

const groups = [
  {
    heading: 'CSC108 Study Group',
    restrict: 'UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
    size: 'lg',
  },
  {
    heading: 'CSC309 Study Group',
    restrict: 'UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
  {
    heading: 'CSC148 Study Group',
    restrict: 'UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
  {
    heading: 'CSC209 Study Group',
    restrict: 'UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
    desc: 'dhue gyf geufh uirgey bfui rbfgy sfbyrgfsn gygrhuis dghfuihr frfhurgdn fvfhruighdk frhgr frhugndlkf rehgdrn fv',
  },
];

function AccountInfo() {
  const [userInfo, setUserInfo] = useState({
    name: 'Geralt Stanislav',
    desc: "I am a first year student at UTM who's majoring in CS, and trying to find like-minded people",
    role: 'Student',
    imgSrc: Cat,
    contactInfo:
      'You can reach me on Instagram, Snapchat, or email. I usually respond on the same day. IG: geralt.stan, Email: geralt.s@mail.utoronto.ca',
    interests:
      'I like playing the Witcher 3 on my PS4 whever I catch a break from my school-work, and watching Naruto. I also like working on side-projects pertaining to AI.',
    courses: [
      { id: 'asdfasdfasdf', text: 'CSC301' },
      { id: 'asdfasdfasdf', text: 'CSC302' },
    ],
  });

  const handleDelete = i => {
    setUserInfo({
      ...userInfo,
      courses: [...userInfo.courses.filter((tag, index) => index !== i)],
    });
  };

  const handleAddition = c => {
    setUserInfo({
      ...userInfo,
      courses: [...userInfo.courses, c],
    });
  };

  const [edit, setEdit] = useState(false);

  return (
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
          <VStack w="full" alignItems="flex-start" justifyItems="left">
            {edit ? (
              <VStack w="full" justifyContent="center">
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    Image URL:
                  </Text>
                  <Input
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        imgSrc: e.target.value,
                      })
                    }
                    value={userInfo.imgSrc}
                    placeholder="Image URL"
                  />
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }} w="full">
                  <Text justifySelf="flex-start" as="b" mr={1}>
                    Name:
                  </Text>
                  <Input
                    maxW="200px"
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        name: e.target.value,
                      })
                    }
                    value={userInfo.name}
                    placeholder="Name"
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
                  value={userInfo.desc}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      desc: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Contact Info:
                </Text>
                <Textarea
                  value={userInfo.contactInfo}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      contactInfo: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Interests:
                </Text>
                <Textarea
                  value={userInfo.interests}
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      interests: e.target.value,
                    })
                  }
                  size="md"
                />
                <Text alignSelf="flex-start" as="b" mr={1}>
                  Courses I&apos;m taking:
                </Text>
                <ReactTags
                  tags={userInfo.courses}
                  // delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  inputFieldPosition="bottom"
                  autocomplete
                />
                <GreenButton
                  width="200px"
                  style={{ fontSize: '20px' }}
                  onClick={() => setEdit(false)}
                >
                  Save
                </GreenButton>
              </VStack>
            ) : (
              <VStack>
                <Image
                  src={userInfo.imgSrc}
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
                  {userInfo.name} ({userInfo.role})
                </Text>
                <Text color={colors.grey.dark}>{userInfo.desc}</Text>
                <GreenButton
                  width="200px"
                  style={{ fontSize: '20px' }}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </GreenButton>
                <Text
                  color={colors.grey.dark}
                  as="b"
                  alignSelf="flex-start"
                  fontSize={18}
                >
                  Contact Info
                </Text>
                <Text color={colors.grey.dark}>{userInfo.contactInfo}</Text>
                <Text
                  color={colors.grey.dark}
                  as="b"
                  alignSelf="flex-start"
                  fontSize={18}
                >
                  Interests
                </Text>
                <Text color={colors.grey.dark}>{userInfo.interests}</Text>
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
                    {userInfo.courses.length !== 0 &&
                      userInfo.courses.map(c => (
                        <ListItem ml={2}>{c.text}</ListItem>
                      ))}
                  </UnorderedList>
                </Box>
              </VStack>
            )}
          </VStack>
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
              Study groups you are part of.
            </Text>
            {groups.map(g => (
              <SecondGroup
                heading={g.heading}
                restrict={g.restrict}
                price={g.price}
                imgAlt={g.imgAlt}
                img={g.imgSrc}
                link="cat"
              />
            ))}
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}

export default AccountInfo;
