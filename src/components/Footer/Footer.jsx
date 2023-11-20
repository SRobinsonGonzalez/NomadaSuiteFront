import { Flex } from 'antd';
import FooterStyles from './Footer.module.css';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaSquareInstagram } from 'react-icons/fa6';
import { FaSquareTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className={FooterStyles.footer}>
      <p className={FooterStyles.copyright}>© 2023 NómadaSuite, Inc.</p>
      <Flex align={"center"}>
        <p className={FooterStyles.language}>Español</p>
        <p className={FooterStyles.currency}>$ USD</p>
        <div className={FooterStyles.socialMedia}>
          <FaSquareFacebook />
          <FaSquareInstagram/>
          <FaSquareTwitter/>
        </div>
      </Flex>
    </div>
  )
}

export default Footer;