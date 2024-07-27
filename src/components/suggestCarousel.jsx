import React from 'react';
import { Carousel, Card } from 'antd';
import Book from './cpoBook'; 
import { StarOutlined } from '@ant-design/icons';

const BookCarousel = ({ books }) => {
  console.log('recommend',books)
return(
  <Carousel autoplay style={{marginLeft: 10}}>
    {books.map(book => (
      <div key={book._id} >
        <Book
          image={book.image}
          title={book.title}
          author={book.authors}
          price={book.price}
          _id={book._id}
          discount={book.discountPercent}
        />
      </div>
    ))}
  </Carousel>

);
}
export default BookCarousel;
