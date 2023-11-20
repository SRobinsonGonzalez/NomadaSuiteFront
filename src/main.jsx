import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.baseURL = 'https://nomada-suite.onrender.com/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="42412178778-18cr5vtsbkqbmmcb0bh5o27v9bq561kg.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>,
  </Provider>
);