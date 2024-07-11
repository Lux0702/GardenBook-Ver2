import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import thumbnail1 from "../assets/images/thumbnail1.png";
import thumbnail2 from "../assets/images/thumbnail2.png";

class DemoCarousel extends React.Component {
    render() {
        return (
            <Carousel autoPlay={true} interval={5000} infiniteLoop={true} showStatus={false} showThumbs={false}>
                <div>
                    <img src={thumbnail1} alt="Thumbnail 1" />
                </div>
                <div>
                    <img src={thumbnail2} alt="Thumbnail 2" />
                </div>
                <div>
                    <img src={thumbnail1} alt="Thumbnail 1" />
                </div>
            </Carousel>
        );
    }
}

export default DemoCarousel;
