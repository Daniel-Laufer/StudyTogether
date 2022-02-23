import {
  Container,
  VStack,
  Image,
  Text,
  Input,
  Button,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Cat from '../../assets/images/cat.jpeg';
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
    snap: 'geralt.of.rivia',
    ig: 'geralt.stan',
    email: 'geralt.s@mail.utoronto.ca',
    interests:
      'I like playing the Witcher 3 on my PS4 whever I catch a break from my school-work, and watching Naruto. I also like working on side-projects pertaining to AI.',
    courses: ['CSC108', 'MAT102', 'PHL247', 'MAT135'],
  });

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
            <Image
              src={Cat}
              borderRadius="full"
              boxSize="200px"
              alignSelf="center"
            />
            {edit ? (
              <VStack>
                <Input
                  onChange={e =>
                    setUserInfo({
                      ...userInfo,
                      name: e.target.value,
                    })
                  }
                  value={userInfo.name}
                  placeholder="Name"
                />
                <Box>
                  <Button
                    width="200px"
                    fontSize="20px"
                    backgroundColor={colors.grey.dark}
                    color={colors.white}
                    onClick={() => setEdit(false)}
                  >
                    Save
                  </Button>
                </Box>
              </VStack>
            ) : (
              <VStack>
                <Text
                  fontSize={18}
                  as="b"
                  alignSelf="flex-start"
                  color={colors.grey.dark}
                >
                  {userInfo.name} ({userInfo.role})
                </Text>
                <Text color={colors.grey.dark}>{userInfo.desc}</Text>
                <Button
                  width="200px"
                  fontSize="20px"
                  backgroundColor={colors.grey.dark}
                  color={colors.white}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
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
