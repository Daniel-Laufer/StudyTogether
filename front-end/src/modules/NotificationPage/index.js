import {
  Container,
  Box,
  Text,
  VStack,
  StackDivider,
  Stack,
} from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';
import React from 'react';
import * as colors from '../../utils/colors';

function NotificationPage() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        padding={2}
        border="1px solid gray"
        borderRadius="5px"
        align="stretch"
      >
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>

        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
            <Text isTruncated noOfLines={[1, 2, 3]}>
              Ea quia iste ut quas autem aut tenetur nulla sit eligendi
              architecto ea minus quaerat. Qui voluptatem eveniet vel nisi
              beatae et harum illum aut odit minima. Et placeat voluptatem ut
              sapiente labore ex internos perspiciatis non veritatis nostrum? Et
              voluptatem dicta eos Quis earum At porro mollitia et incidunt
              veritatis praesentium adipisci sit voluptas odit.{' '}
            </Text>
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
        <Stack direction="row" spacing="1rem" padding="0.1rem">
          <MoonIcon color={colors.green.dark} style={{ margin: '4px 0 0 0' }} />
          <Box h="40px" color="gray.500" borderRadius={5}>
            <b style={{ color: 'black' }}>Dan</b> made new changes to a study
            group.
          </Box>
        </Stack>
      </VStack>
    </Container>
  );
}

export default NotificationPage;
