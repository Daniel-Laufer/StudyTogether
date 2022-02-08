import React from 'react';
import { Box } from '@chakra-ui/react';
import Group from '../../components/group';
import Cat from '../../assets/images/cat.jpeg';
import SecondGroup from '../../components/SecondGroup';

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

function index() {
  return (
    <Box textAlign={['left', 'left', 'left']} spacingY="20px">
      {groups.map(g => (
        <Group
          heading={g.heading}
          restrict={g.restrict}
          price={g.price}
          imgAlt={g.imgAlt}
          img={g.imgSrc}
          link="cat"
        />
      ))}
      {groups.map(g => (
        <SecondGroup
          title={g.heading}
          restrict={g.restrict}
          availability={g.price}
          imgAlt={g.imgAlt}
          img={g.imgSrc}
          when={g.price}
          host={g.price}
          desc={g.desc}
          link="cat"
          size="md"
        />
      ))}
    </Box>
  );
}

export default index;
