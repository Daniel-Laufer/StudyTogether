import {
  Container,
  Text,
  VStack,
  HStack,
  StackDivider,
  Heading,
} from '@chakra-ui/react';
import { MoonIcon, StarIcon, SunIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import useHover from '../../hooks/useHover';
import * as colors from '../../utils/colors';

function NotificationPage() {
  const [hoverRef, isHovering] = useHover();
  const [notifications, setNotifications] = useState([]);

  return (
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
        <VStack align="stretch" spacing={2} cursor="pointer" ref={hoverRef}>
          <HStack align="stretch" marginBottom="5" spacing="1rem">
            <MoonIcon
              transform={isHovering ? 'rotate(360deg)' : ''}
              transition="transform 800ms ease"
              boxSize={6}
              color={colors.blue.medium}
            />
            <Text color="gray.700">
              <b style={{ color: 'black' }}>Dan</b> has made new changes to a
              study group!
            </Text>
          </HStack>
          <br />
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Title:</b> {`CSC301 midterm`}
          </Text>
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Host:</b> {`Daniel Laufer`}
          </Text>
          <Text noOfLines="3" color="gray.500">
            <b style={{ color: 'black' }}>Description: </b>
            {`Ea quia iste ut quas autem aut tenetur nulla sit eligendi architecto
            ea minus quaerat. Qui voluptatem eveniet vel nisi beatae et harum
            illum aut odit minima. Et placeat voluptatem ut Ea quia iste ut quas
            autem aut tenetur nulla sit eligendi architecto ea minus quaerat.
            Qui voluptatem eveniet vel nisi beatae et harum illum aut odit
            minima. Et placeat voluptatem ut`}
          </Text>
        </VStack>
        <VStack align="stretch" spacing={2}>
          <HStack align="stretch" marginBottom="5" spacing="1rem">
            <SunIcon boxSize={6} color={colors.red.medium} />
            <Text color="gray.700">
              <b style={{ color: 'black' }}>Dan</b> is attending a study group!
            </Text>
          </HStack>
          <br />
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Title:</b> CSC301 midterm
          </Text>
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Host:</b> Maor Uchiha
          </Text>
          <Text noOfLines="3" color="gray.500">
            <b style={{ color: 'black' }}>Description: </b>
            Ea quia iste ut quas autem aut tenetur nulla sit eligendi architecto
            ea minus quaerat. Qui voluptatem eveniet vel nisi beatae et harum
            illum aut odit minima. Et placeat voluptatem ut Ea quia iste ut quas
            autem aut tenetur nulla sit eligendi architecto ea minus quaerat.
            Qui voluptatem eveniet vel nisi beatae et harum illum aut odit
            minima. Et placeat voluptatem ut
          </Text>
        </VStack>{' '}
        <VStack align="stretch" spacing={2}>
          <HStack align="stretch" marginBottom="5" spacing="1rem">
            <StarIcon boxSize={6} color={colors.green.dark} />
            <Text color="gray.700">
              <b style={{ color: 'black' }}>Dan</b> has hosted a new study group
            </Text>
          </HStack>
          <br />
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Title:</b> CSC301 midterm
          </Text>
          <Text noOfLines="2" color="gray.500">
            <b style={{ color: 'black' }}>Host:</b> Daniel Laufer
          </Text>
          <Text noOfLines="3" color="gray.500">
            <b style={{ color: 'black' }}>Description: </b>
            Ea quia iste ut quas autem aut tenetur nulla sit eligendi architecto
            ea minus quaerat. Qui voluptatem eveniet vel nisi beatae et harum
            illum aut odit minima. Et placeat voluptatem ut Ea quia iste ut quas
            autem aut tenetur nulla sit eligendi architecto ea minus quaerat.
            Qui voluptatem eveniet vel nisi beatae et harum illum aut odit
            minima. Et placeat voluptatem ut
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
}

export default NotificationPage;
