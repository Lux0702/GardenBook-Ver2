import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import thumbnail1 from "../assets/images/1585041135608-Việt Anh-Hoàng Tử Bé.jpg";
import thumbnail2 from "../assets/images/dacnhantam-03-1-jpg.png";
import thumbnail3 from "../assets/images/Trich-dan-nha-gia-kim.jpg";
import { useNavigate } from 'react-router-dom';

const BannerBar = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Carousel autoPlay={true} interval={5000} infiniteLoop={true} showStatus={false} showThumbs={false}>
      <div onClick={() => handleClick('/book-detail/657cdf4bd852a32093bab4d0')}>
        <img
          src={thumbnail1}
          alt="Thumbnail 1"
          style={{ height: '500px', width: '100%', objectFit: 'fill', cursor: 'pointer', pointerEvents: 'auto', borderRadius: '10px' }}
          loading='lazy'
        />
      </div>
      <div onClick={() => handleClick('/book-detail/657ce1e8d852a32093bab7b0')}>
        <img
          src={thumbnail2}
          alt="Thumbnail 2"
          style={{ height: '500px', width: '100%', objectFit: 'fill', cursor: 'pointer', pointerEvents: 'auto', borderRadius: '10px' }}
          loading='lazy'
        />
      </div>
      <div onClick={() => handleClick('/book-detail/657cf398d852a32093bab7d4')}>
        <img
          src={thumbnail3}
          alt="Thumbnail 3"
          style={{ height: '500px', width: '100%', objectFit: 'fill', cursor: 'pointer', pointerEvents: 'auto', borderRadius: '10px' }}
          loading='lazy'
        />
      </div>
    </Carousel>
  );
};

export default BannerBar;