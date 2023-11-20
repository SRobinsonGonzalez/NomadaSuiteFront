import { useEffect, useState } from 'react';
import CardBox from '../CardBox/CardBox';
import CardsStyles from './CardsContainer.module.css';
import { getAccommodations, getNextAccommodations } from '../../redux/Actions/actions';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Divider, Skeleton, Flex } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

const CardsContainer = () => {
  const dispatch = useDispatch();
  const accommodations = useSelector((state) => state.accommodations);
  const accommodationsFiltered = useSelector((state) => state.accommodationsFiltered);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    dispatch(getNextAccommodations(page));
    setLoading(false);
    setPage(page + 1);
  };

  useEffect(() => {
    dispatch(getAccommodations())
    loadMoreData();
  }, []);

  useEffect(() => {
    setData([...data, ...accommodations]);
  }, [accommodations]);

  useEffect(() => {
    setData(accommodations);
    setPage(1)
  }, [accommodationsFiltered]);

  return (
    <div className={CardsStyles.cardsContainer}>
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length === 0 || data.length < accommodationsFiltered.length}
        loader={<Flex>
          <Skeleton paragraph={{ rows: 4 }} active/>
          <Skeleton paragraph={{ rows: 4 }} active/>
          <Skeleton paragraph={{ rows: 4 }} active/>
          <Skeleton paragraph={{ rows: 4 }} active/>
          <Skeleton paragraph={{ rows: 4 }} active/>
          <Skeleton paragraph={{ rows: 4 }} active/>
        </Flex>}
        endMessage={<Divider plain>Fin de los resultados</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <div className={CardsStyles.noScroll}>
          <Row gutter={24} align={'stretch'}>
            {data.length &&
              data?.map((accommodation, index) => {
                return (
                  <CardBox
                    key={index} 
                    id={accommodation?._id}
                    photos={accommodation?.photos}
                    name={accommodation?.name}
                    rating={accommodation?.rating}
                    price={accommodation?.price}
                    location={`${accommodation?.idLocation?.city}, ${accommodation?.idLocation?.country}`}
                  />
                )
              })
            }
          </Row>
        </div>
      </InfiniteScroll>
    </div>
  )
};

export default CardsContainer;