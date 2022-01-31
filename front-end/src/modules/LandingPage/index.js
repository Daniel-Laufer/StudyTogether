/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
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
import { connect } from 'react-redux';
import axios from 'axios';
import groupOnBooks from '../../assets/images/grouponbooks.jpeg';
import { apiURL } from '../../utils/constants';
import { Example } from '../../actions';

function LandingPage({ dispatch }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(Example.exampleAction('daniel2'));
  }, []);

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

export default connect(state => ({
  user: state.Example.name,
}))(LandingPage);
