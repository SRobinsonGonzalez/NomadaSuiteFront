import { Route, Routes } from 'react-router-dom';
import { NavLink } from 'react-router-dom/dist';
import AccommodationDetail from './views/Detail/AccommodationDetail/AccommodationDetail';
import Accommodation from './views/Register/Accommodation/Accommodation';
import Cancellation from './views/Register/Reservations/Cancellation/Cancellation.jsx';
import Checkout from './views/Register/Reservations/Checkout/Checkout.jsx';
import Header from './components/Header/Header.jsx';
import Home from './views/Home/Home';
import Footer from './components/Footer/Footer.jsx';
import Reservation from './views/Register/Reservations/Reservation/Reservation.jsx';
import AccountPage from './views/UserPanel/AccountPage.jsx';
import './App.css'
import Admin from './views/Admin/Admin.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserData } from './redux/Actions/actions.js';


function App() {
  const dispatch = useDispatch();
  const userLoggedInfo = useSelector((state) => state.userLogged);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (Object.keys(userLoggedInfo).length === 0 && userId) {
      dispatch(getUserData(userId));
    }
  }, [userLoggedInfo]);

  const isAdmin = userLoggedInfo.isAdmin;

  return (
    <div>
      <Header />
      <nav>
        <ul>
          <li><NavLink to="/"></NavLink></li>
          <li><NavLink to="/detail/:id"></NavLink></li>
          <li><NavLink to="/register-accommodation"></NavLink></li>
          <li><NavLink to="/reservation"></NavLink></li>
          <li><NavLink to="/cancellation"></NavLink></li>
          <li><NavLink to="/reservation/:checkoutId"></NavLink></li>
          <li><NavLink to="/account/:tab"></NavLink></li>
          {isAdmin && <li><NavLink to="/admin"></NavLink></li>}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<AccommodationDetail />} />
        <Route path="/register-accommodation" element={<Accommodation />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/reservation/:checkoutId" element={<Checkout />} />
        <Route path="/account/:tab" element={<AccountPage />} />
        {isAdmin && <Route path="/admin" element={<Admin />} />}
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
