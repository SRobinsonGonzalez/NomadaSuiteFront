import Cards from "../../components/CardsContainer/CardsContainer";
import SecundaryFilters from '../../components/SecundaryFilters/SecundaryFilters';
import banner from '../../assets/image/banner.png';
import { FloatButton } from 'antd';

const Home = () => {

  return (
    <div>
      <img style={{width:"100%"}} src={banner}/>
      <SecundaryFilters />
      <Cards></Cards>
      <>
        <FloatButton.Group shape="circle"> 
          <FloatButton.BackTop visibilityHeight={5} />
        </FloatButton.Group>
      </>
    </div>
  )
};

export default Home;