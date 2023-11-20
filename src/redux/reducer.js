/* eslint-disable no-case-declarations */

import { GET_ACCOMMODATIONS, GET_ACCOMMODATION_BY_ID, GET_FILTERED_ACCOMMODATION, GET_NEXT_ACCOMMODATIONS, GET_SERVICES, ORDER_BY_RATING, CLEAR_DETAIL, GET_COUNTRIES, GET_CITIES, GET_LOCATIONS, LOGIN_USER, LOGIN_GOOGLE, REGISTER_USER, GET_USER_DATA, LOG_OUT, SET_RESERVATION_DATA, CLEAR_DETAIL_TO_RESERVATION, UPDATE_USER_INFO, GET_RESERVATION_BY_ID, GET_ACTIVE_ACCOMMODATION, GET_ACCOMMODATION_PENDING_CONFIRMATION, GET_DISABLED_ACCOMMODATION, GET_ALL_ACCOMMODATION, GET_ACCOMMODATION_PERCENTAGE, DELETE_ACCOMMODATION, GET_ACCOMMODATION_BY_ID_A, UPDATE_ACCOMMODATION, GET_ALL_USERS, GET_USERS_ACTIVES, GET_USERS_ACTIVES_FALSE, GET_USER_BY_ID, LOGIN_USER_A, DELETE_USER, UPDATE_USER, GET_ACTIVE_REVIEWS, GET_REVIEWS_PENDING_CONFIRMATION, GET_REVIEWS_DISABLED, GET_USER_BY_ID_CHECKOUT } from "./Actions/actions-types";

let initialState = {
  accommodations: [],
  allAccommodations: [],
  accommodationById: {},
  accommodationToReservation: {},
  accommodationsFiltered: [],
  itemsPerPage: 12,
  services: [],
  countries: [],
  cities: [],
  locations: [],
  idUserLogged: "",
  userLogged: {},
  userGoogle: {},
  reservationById: {},
  reservationData: {},
  userById: {},
  activeAccommodation_A: [],
  accommodationPendingConfirmation_A: [],
  disabledAccommodation_A: [],
  allAccommodations_A: [],
  accommodationPercentage_A: {},
  deleteAccommodation_A: {},
  accommodationById_A: {},
  updateAccommodation_A: {},
  allUsers_A: {},
  usersActives_A: {},
  usersActivesFalse_A: {},
  userById_A: {},
  userLogged_A: {},
  userDeleted_A: {},
  updatedUser_A: {},
  activeReviews_A: {},
  reviewsPendingConfirmation_A: {},
  reviewsDisabled_A: {}
};

const rootReducer = (state = initialState, { type, payload }) => {
  const ITEMS_PER_PAGE = state.itemsPerPage;

  switch (type) {
    case GET_ACCOMMODATIONS:
      return {
        ...state,
        accommodations: [...payload].splice(0, ITEMS_PER_PAGE),
        allAccommodations: payload,
        accommodationsFiltered: payload
      }

    case GET_ACCOMMODATION_BY_ID:
      return {
        ...state,
        accommodationById: payload,
        accommodationToReservation: payload
      }

    case ORDER_BY_RATING:
      let filteredByOrder = [];
      if (payload === "asc") {
        filteredByOrder = [...state.accommodationsFiltered].sort((a, b) => {
          if (Number(a.rating) < Number(b.rating)) return -1;
          if (Number(a.rating) > Number(b.rating)) return 1;
          return 0;
        });
      } else if (payload === "desc") {
        filteredByOrder = [...state.accommodationsFiltered].sort((a, b) => {
          if (a.rating < b.rating) return 1;
          if (a.rating > b.rating) return -1;
          return 0;
        });
      }
      else {
        return {
          ...state,
          accommodations: [...state.accommodations]
        }
      }

      return {
        ...state,
        accommodationsFiltered: filteredByOrder,
        accommodations: [...filteredByOrder].splice(0, ITEMS_PER_PAGE)
      }

    case GET_NEXT_ACCOMMODATIONS:
      return {
        ...state,
        accommodations: [...state.accommodationsFiltered].splice(payload * ITEMS_PER_PAGE, ITEMS_PER_PAGE),
      }

    case GET_SERVICES:
      return {
        ...state,
        services: payload
      }

    case GET_FILTERED_ACCOMMODATION:
      return {
        ...state,
        accommodationsFiltered: payload,
        accommodations: payload,
      }

    case GET_LOCATIONS:
      const newLocations = [];
      payload.forEach((location) => {
        newLocations.push({ value: location });
      })
      return {
        ...state,
        locations: newLocations
      }

    case CLEAR_DETAIL:
      return {
        ...state,
        accommodationById: {},
      }

    case CLEAR_DETAIL_TO_RESERVATION:
      return {
        ...state,
        // accommodationToReservation: {},
      }

    case GET_COUNTRIES:
      return {
        ...state,
        countries: payload
      }

    case GET_CITIES:
      return {
        ...state,
        cities: payload
      }

    case LOGIN_USER:
      localStorage.setItem("accessToken", payload.accessToken)
      localStorage.setItem("userId", payload.user._id)
      return {
        ...state,
        userLogged: payload.user
      }

    case LOGIN_GOOGLE:
      return {
        ...state,
        userGoogle: payload
      }

    case REGISTER_USER:
      localStorage.setItem("accessToken", payload.accessToken)
      localStorage.setItem("userId", payload._id)
      return {
        ...state,
        userLogged: payload,
      }

    case GET_USER_DATA:
      return {
        ...state,
        userLogged: payload,
      }

    case LOG_OUT:
      localStorage.clear();
      return {
        ...state,
        idUserLogged: "",
        userLogged: {},
        userGoogle: {}
      }

    case SET_RESERVATION_DATA:
      return {
        ...state,
        reservationData: payload
      }

    case UPDATE_USER_INFO:
      return {
        ...state,
        userLogged: {
          ...state.userLogged,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
      };

    case GET_RESERVATION_BY_ID:
      return {
        ...state,
        reservationById: payload
      }

    case GET_USER_BY_ID_CHECKOUT:
      return {
        ...state,
        userById: payload
      }

    //TODO__________________________________ ADMIN __________________________________

    case GET_ACTIVE_ACCOMMODATION:
      return {
        ...state,
        activeAccommodation_A: payload
      }

    case GET_ACCOMMODATION_PENDING_CONFIRMATION:
      return {
        ...state,
        accommodationPendingConfirmation_A: payload
      }

    case GET_DISABLED_ACCOMMODATION:
      return {
        ...state,
        disabledAccommodation_A: payload
      }

    case GET_ALL_ACCOMMODATION:
      return {
        ...state,
        allAccommodations_A: payload
      }

    case GET_ACCOMMODATION_PERCENTAGE:
      return {
        ...state,
        accommodationPercentage_A: payload
      }

    case DELETE_ACCOMMODATION:
      return {
        ...state,
        deleteAccommodation_A: payload
      }

    case GET_ACCOMMODATION_BY_ID_A:
      return {
        ...state,
        accommodationById_A: payload
      }

    case UPDATE_ACCOMMODATION:
      return {
        ...state,
        updateAccommodation_A: payload
      }

    case GET_ALL_USERS:
      return {
        ...state,
        allUsers_A: payload
      }

    case GET_USERS_ACTIVES:
      return {
        ...state,
        usersActives_A: payload
      }

    case GET_USERS_ACTIVES_FALSE:
      return {
        ...state,
        usersActivesFalse_A: payload
      }

    case GET_USER_BY_ID:
      return {
        ...state,
        userById_A: payload
      }

    case LOGIN_USER_A:
      return {
        ...state,
        userLogged_A: payload
      }

    case DELETE_USER:
      return {
        ...state,
        userDeleted_A: payload
      }

    case UPDATE_USER:
      return {
        ...state,
        updatedUser_A: payload
      }

    case GET_ACTIVE_REVIEWS:
      return {
        ...state,
        activeReviews_A: payload
      }

    case GET_REVIEWS_PENDING_CONFIRMATION:
      return {
        ...state,
        reviewsPendingConfirmation_A: payload
      }

    case GET_REVIEWS_DISABLED:
      return {
        ...state,
        reviewsDisabled_A: payload
      }

    default:
      return {
        ...state,
      };
  }
};

export default rootReducer;