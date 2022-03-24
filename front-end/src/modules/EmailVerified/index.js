import { Container, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiURL } from '../../utils/constants';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function EmailVerified() {
  const query = useQuery();
  const id = query.get('id');
  const token = query.get('token');
  let verified = false;

  useEffect(() => {
    const body = { id, token };
    axios.post(`${apiURL}`, body).then(res => {
      if (res.status === 200) {
        verified = true;
      }
    });
  }, []);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        {verified ? (
          <Text>Your email has been verified.</Text>
        ) : (
          <Text>
            Your email has not been verified, please resend the verification
            email and try again.
          </Text>
        )}
      </VStack>
    </Container>
  );
}

export default EmailVerified;
