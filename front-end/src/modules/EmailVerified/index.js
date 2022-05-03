import { Container, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiURL } from '../../utils/constants';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function EmailVerified() {
  const [verified, setVerified] = useState({
    verified: false,
  });
  const query = useQuery();
  const id = query.get('id');
  const token = query.get('token');

  useEffect(() => {
    const body = { id, token };
    axios.post(`${apiURL}/users/verify`, body).then(res => {
      setVerified({ ...verified, verified: res.data.verified !== 'false' });
    });
  }, []);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <VStack style={{ marginTop: '1rem' }} spacing="20px" align="stretch">
        {verified.verified ? (
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
