/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Center,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import axios from 'axios';
import groupOnBooks from '../../assets/images/grouponbooks.jpeg';
import { apiURL } from '../../utils/constants';

function LandingPage() {
  const [users, setUsers] = useState([]);

  // we won't be making API calls directly in components in the future,
  // instead we will be doing so in the redux action creators
  // but we'll just do this for now to demo the three tier architecture
  useEffect(() => {
    axios
      .get(`${apiURL}/users`)
      .then(res => {
        setUsers([...users, ...res.data]);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    console.log("Updated 'users' state: \n", users);
  }, [users]);

  return (
    <Box textAlign="center" fontSize="xl">
      <Heading>Study Together</Heading>
      <Center>
        <img src={groupOnBooks} alt="cat" />
      </Center>
      <Heading as="h8" size="md">
        Users retrieved from the StudyTogether MongoDB Database:
      </Heading>
      <Center>
        <UnorderedList>
          {users.map((user, i) => (
            <ListItem key={i}>
              First name: {user.firstName}, Last name: {user.lastName}, email:{' '}
              {user.email}
            </ListItem>
          ))}
        </UnorderedList>
      </Center>
    </Box>
  );
}

export default LandingPage;
