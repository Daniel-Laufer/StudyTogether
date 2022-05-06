/* eslint-disable react/jsx-boolean-value */

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './styles.css';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
};
const sliderImage = [
  {
    url: 'https://i.guim.co.uk/img/media/1f88ae6599ec098c9c0e4556c68a95f01fd314fc/0_187_4287_2572/master/4287.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=b1920bd90879b36e616bee6130b95b31',
    subject: 'MAT137 ',
    school: 'University of Toronto',
  },
  {
    url: 'https://fluencycorp.com/wp-content/uploads/2019/01/hardest-part-learning-english.jpg',
    subject: 'ENG100 ',
    school: 'University of Toronto',
  },
  {
    url: 'https://images.newscientist.com/wp-content/uploads/2019/05/15163211/quantum_gettyimages-807324710.jpg?width=1200',
    subject: 'PHY147H5',
    school: 'University of Toronto',
  },
  {
    url: 'https://images.ctfassets.net/cnu0m8re1exe/1v6Kh7bIsgVU4PA1Qi44bb/3e8e11c131620bb0080266a01a8cf36c/shutterstock_127915121.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill',
    subject: 'CHM211H5 ',
    school: 'University of Toronto',
  },
  {
    url: 'https://www.moviesonline.ca/wp-content/uploads/2021/09/Top-10-Best-Operating-Systems-for-Laptops-and-Computers-4.jpg',
    subject: 'CSC209',
    school: 'University of Toronto',
  },
];

export default function Slider() {
  return (
    <div className="parent" style={{ textAlign: 'center' }}>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {sliderImage.map(image => (
          <div className="slider">
            <img
              src={image.url}
              alt="subject"
              style={{ height: '300px', background: 'cover' }}
            />
            <p style={{ marginTop: '-3.5rem', color: 'white' }}>
              <span style={{ fontWeight: 'bold' }}>{image.subject}</span>
              <br />
              {image.school}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
