import React from 'react';
import Group from '../../components/group';
import Cat from '../../assets/images/cat.jpeg';

const groups = [
  {
    heading: 'CSC108 Study Group',
    restrict: 'Restrictions: UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
  {
    heading: 'CSC309 Study Group',
    restrict: 'Restrictions: UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
  {
    heading: 'CSC148 Study Group',
    restrict: 'Restrictions: UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
  {
    heading: 'CSC209 Study Group',
    restrict: 'Restrictions: UofT Students Only ',
    price: 'Free',
    imgAlt: 'cat',
    imgSrc: Cat,
  },
];

function index() {
  return (
    <div column={2} spacingX="40px" spacingY="20px">
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
    </div>
  );
}

export default index;
