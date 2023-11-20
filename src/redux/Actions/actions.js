/* eslint-disable no-unreachable */
import axios from "axios";
import { GET_ACCOMMODATIONS, GET_ACCOMMODATION_BY_ID, GET_SERVICES, GET_NEXT_ACCOMMODATIONS, ORDER_BY_RATING, GET_FILTERED_ACCOMMODATION, CLEAR_DETAIL, GET_COUNTRIES, GET_CITIES, GET_LOCATIONS, LOGIN_USER, LOGIN_GOOGLE, REGISTER_USER, GET_USER_DATA, LOG_OUT, SET_RESERVATION_DATA, CLEAR_DETAIL_TO_RESERVATION, UPDATE_USER_INFO, GET_RESERVATION_BY_ID, GET_ACTIVE_ACCOMMODATION, GET_ACCOMMODATION_PENDING_CONFIRMATION, GET_DISABLED_ACCOMMODATION, GET_ALL_ACCOMMODATION, GET_ACCOMMODATION_PERCENTAGE, DELETE_ACCOMMODATION, GET_ACCOMMODATION_BY_ID_A, UPDATE_ACCOMMODATION, GET_ALL_USERS, GET_USERS_ACTIVES, GET_USERS_ACTIVES_FALSE, GET_USER_BY_ID, LOGIN_USER_A, DELETE_USER, UPDATE_USER, GET_ACTIVE_REVIEWS, GET_REVIEWS_PENDING_CONFIRMATION, GET_REVIEWS_DISABLED, GET_USER_BY_ID_CHECKOUT } from "./actions-types";

const getAccommodations = () => {
  const endpoint = "/accommodation/";
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACCOMMODATIONS,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getAccommodationById = (id) => {
  const endpoint = `/accommodation/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACCOMMODATION_BY_ID,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
};

const orderByRating = (order) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: ORDER_BY_RATING,
        payload: order,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
};

const getNextAccommodations = (page) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_NEXT_ACCOMMODATIONS,
        payload: page,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
}

const getServices = () => {
  const endpoint = '/services';
  try {
    return async (dispatch) => {
      const { data } = await axios.get(endpoint);
      return dispatch({
        type: GET_SERVICES,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
};

const getFilteredAccommodation = (values) => {
  const { city, country, startDate, endDate, rooms, min, max, orderByRating } = values;
  const cityName = city !== null ? `city=${city}` : "";
  const countryName = country !== null ? `&country=${country}` : "";
  const startDateNum = startDate !== null ? `&startDate=${startDate}` : "";
  const endDateNum = endDate !== null ? `&endDate=${endDate}` : "";
  const roomsNum = rooms !== null ? `&rooms=${rooms}` : "";
  const minPrice = min && min !== null ? `&min=${min}` : "";
  const maxPrice = max && max !== null ? `&max=${max}` : "";
  const orderRating = orderByRating && orderByRating !== null ? `&orderByRating=${orderByRating}` : "";
  const endpoint = `/filtered/combinated?${cityName}${countryName}${roomsNum}${minPrice}${maxPrice}${orderRating}`;
  try {
    return async (dispatch) => {
      const { data } = await axios.get(endpoint);
      return dispatch({
        type: GET_FILTERED_ACCOMMODATION,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
}

const getLocations = () => {
  const endpoint = "/location";
  try {
    return async (dispatch) => {
      const { data } = await axios.get(endpoint);
      return dispatch({
        type: GET_LOCATIONS,
        payload: data
      })
    }
  } catch (error) {
    console.log(error.response.data.error);
  }
}

const clearDetail = () => {
  return async (dispatch) => {
    dispatch({
      type: CLEAR_DETAIL,
    });
  }
}

const clearDetailToReservation = () => {
  return async (dispatch) => {
    dispatch({
      type: CLEAR_DETAIL_TO_RESERVATION,
    });
  }
}

const getCountries = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('https://www.universal-tutorial.com/api/countries/', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJoaC5yb2JpbnNvbjk1QGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IlFrSm5hWUs4OVZfODA3eWV1SkxWQXJJZHVodWxJaThxankwZnBXenNBYno5VjBUTWZPOEpjbllTdzV4OS00Uk1rMzAifSwiZXhwIjoxNzAwMDIyMDQ1fQ.ehlsEWtEmwdf0WoVsQQAKrDtWUjtQisarYxZzROXkNI',
          'Accept': 'application/json',
        }
      })
      dispatch({
        type: GET_COUNTRIES,
        payload: response.data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getCities = (name) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`https://www.universal-tutorial.com/api/states/${name}`, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJoaC5yb2JpbnNvbjk1QGdtYWlsLmNvbSIsImFwaV90b2tlbiI6IlFrSm5hWUs4OVZfODA3eWV1SkxWQXJJZHVodWxJaThxankwZnBXenNBYno5VjBUTWZPOEpjbllTdzV4OS00Uk1rMzAifSwiZXhwIjoxNzAwMDIyMDQ1fQ.ehlsEWtEmwdf0WoVsQQAKrDtWUjtQisarYxZzROXkNI',
          'Accept': 'application/json',
        }
      })
      dispatch({
        type: GET_CITIES,
        payload: response.data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const loginUser = (userData) => {
  const endpoint = '/user/login';
  return async (dispatch) => {
    try {
      const response = await axios.post(endpoint, userData);
      dispatch({
        type: LOGIN_USER,
        payload: response.data
      })
    } catch (error) {
      throw Error(error.response.data.error);
    }
  };
};

const loginGoogle = (userData) => {
  const endpoint = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN_GOOGLE,
        payload: {
          access_token: userData?.access_token
        }
      });
      const profileUser = await axios.get(`${endpoint}${userData?.access_token}`, {
        headers: {
          Authorization: `Bearer ${userData?.access_token}`,
          Accept: 'application/json'
        }
      })
      const { email, family_name, given_name, id, picture } = await profileUser.data;
      const newUser = {
        firstName: given_name,
        lastName: family_name,
        email,
        profileImage: picture,
        googleId: id
      }
      dispatch(registerUser(newUser, userData?.access_token));
    } catch (error) {
      throw Error(error.response.data.error);
    }
  };
};

const registerUser = (userData, accessToken) => {
  const endpoint = '/user/register';
  return async (dispatch) => {
    try {
      const response = await axios.post(endpoint, userData);
      dispatch({
        type: REGISTER_USER,
        payload: { ...response.data.user, accessToken }
      })
    } catch (error) {
      if (error.response.data.userFound) {
        dispatch({
          type: REGISTER_USER,
          payload: { ...error.response.data.userFound, accessToken }
        })
      }
    }
  };
};

const getUserData = (userId) => {
  const endpoint = `/user/${userId}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_USER_DATA,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const logOut = () => {
  return async (dispatch) => {
    dispatch({
      type: LOG_OUT
    });
  };
};

const updateUserInfo = (userId, firstName, lastName) => {
  return async (dispatch) => {
    try {
      const endpoint = `/user/update/${userId}`; // Ruta en el servidor para actualizar el nombre y apellido
      const userData = { firstName: firstName, lastName: lastName };
      const response = await axios.put(endpoint, userData);

      dispatch({
        type: UPDATE_USER_INFO,
        payload: { firstName, lastName },
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const setReservationData = (data) => ({
  type: SET_RESERVATION_DATA,
  payload: data
});

const getReservationById = (id) => {
  const endpoint = `/reservation/checkout/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_RESERVATION_BY_ID,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getUserById = (id) => {
  const endpoint = `/user/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_USER_BY_ID_CHECKOUT,
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

//TODO__________________________________ ADMIN __________________________________

//Accommodations
const getActiveAccommodation_A = () => {
  const endpoint = '/accommodation'
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACTIVE_ACCOMMODATION,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getAccommodationPendingConfirmation_A = () => {
  const endpoint = '/accommodation/pending'
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACCOMMODATION_PENDING_CONFIRMATION,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getDisabledAccommodation_A = () => {
  const endpoint = '/accommodation/desactive'
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_DISABLED_ACCOMMODATION,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getAllAccommodation_A = () => {
  const endpoint = '/accommodation/all'
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ALL_ACCOMMODATION,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getAccommodationPercentage_A = () => {
  const endpoint = '/accommodation/statistics'
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACCOMMODATION_PERCENTAGE,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const deleteAccommodation_A = (id) => {
  console.log(id);
  const endpoint = `/accommodation/${id}`
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(endpoint);
      console.log(data);
      dispatch({
        type: DELETE_ACCOMMODATION,
        payload: data
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getAccommodationById_A = (id) => {
  const endpoint = `/accommodation/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACCOMMODATION_BY_ID_A,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const updateAccommodation_A = (id, formDataToSend) => {
  const endpoint = `/accommodation/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.put(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      dispatch({
        type: UPDATE_ACCOMMODATION,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

//Users
const getAllUers_A = () => {
  const endpoint = '/user';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ALL_USERS,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getUsersActives_A = () => {
  const endpoint = '/user/actives/true';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_USERS_ACTIVES,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getUsersActivesFalse_A = () => {
  const endpoint = '/user/actives/false';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_USERS_ACTIVES_FALSE,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getUserById_A = (id) => {
  const endpoint = `/user/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_USER_BY_ID,
        payload: data,
      });
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const loginUser_A = (userData) => {
  const endpoint = '/user/login';
  return async (dispatch) => {
    try {
      const { data } = await axios.post(endpoint, userData);
      dispatch({
        type: LOGIN_USER_A,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const deleteUser_A = (id) => {
  const endpoint = `/user/delete/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(endpoint);
      dispatch({
        type: DELETE_USER,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const updateUser_A = (id, dataUser) => {
  const endpoint = `/user/update/${id}`;
  return async (dispatch) => {
    try {
      const { data } = await axios.put(endpoint, dataUser);
      dispatch({
        type: UPDATE_USER,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

//Reviews
const getActiveReviews_A = () => {
  const endpoint = '/reviews';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_ACTIVE_REVIEWS,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getReviewsPendingConfirmation_A = () => {
  const endpoint = '/reviews/pending';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_REVIEWS_PENDING_CONFIRMATION,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

const getReviewsDisabled_A = () => {
  const endpoint = '/reviews/pending';
  return async (dispatch) => {
    try {
      const { data } = await axios.get(endpoint);
      dispatch({
        type: GET_REVIEWS_DISABLED,
        payload: data
      })
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
};

export {
  getAccommodations,
  getAccommodationById,
  getServices,
  getNextAccommodations,
  getFilteredAccommodation,
  getCountries,
  getLocations,
  orderByRating,
  getCities,
  clearDetail,
  clearDetailToReservation,
  loginUser,
  loginGoogle,
  getUserData,
  setReservationData,
  updateUserInfo,
  logOut,
  getReservationById,
  getUserById,
  //_____ADMIN_____
  getActiveAccommodation_A,
  getAccommodationPendingConfirmation_A,
  getDisabledAccommodation_A,
  getAllAccommodation_A,
  getAccommodationPercentage_A,
  deleteAccommodation_A,
  getAccommodationById_A,
  updateAccommodation_A,
  getAllUers_A,
  getUsersActives_A,
  getUsersActivesFalse_A,
  getUserById_A,
  loginUser_A,
  deleteUser_A,
  updateUser_A,
  getActiveReviews_A,
  getReviewsPendingConfirmation_A,
  getReviewsDisabled_A
}