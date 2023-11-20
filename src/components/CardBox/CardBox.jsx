import CardStyles from './CardBox.module.css';
import { NavLink } from 'react-router-dom';
import { Card, Col, Carousel, Flex } from 'antd';
import { AiFillStar } from 'react-icons/ai';

const CardBox = ({ id, name, photos, rating, price, location }) => {
  
  return (
    <Col xs={24} sm={8} xl={6} xxl={4} className={CardStyles.columnCard}>
      <div className={CardStyles.card}>
        <NavLink to={`/detail/${id}`}>
          <Card bordered={false}>
            <Carousel arrows>
              {photos?.map((photo, index) => {
                return (
                  <div key={index} className={CardStyles.carouselContainer}>
                    <img src={photo}/>
                  </div>
                )
              })}
            </Carousel>
            <div className={CardStyles.cardDescription}>
              <div className={CardStyles.topDesc}>
                <Flex gap="middle" justify={'space-between'} align="flex-start">
                  <h2 className={CardStyles.cardTitle}>{name}</h2>
                  <Flex gap="3px" align="center">
                  {rating && <><AiFillStar/> {rating}</>}
                  </Flex>
                </Flex>
                <p className={CardStyles.location}>{location}</p>
              </div>
              <div className={CardStyles.price}><span>${price}</span> / mes</div>
            </div>
          </Card>
        </NavLink>
      </div>
    </Col>
  )
};

export default CardBox;