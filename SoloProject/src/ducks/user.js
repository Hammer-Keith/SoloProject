import axios from "axios";

const RETRIEVE_USER = "RETRIEVE_USER";
const NEW_USER = "NEW_USER";

export function retrieveUser() {
  return {
    type: RETRIEVE_USER,
    payload: axios
      .get("/api/me")
      .then(response => response.data)
      .catch(console.log)
  };
}
export function newBTS() {
  return {
    type: NEW_USER,
    payload: axios
      .get("/api/new")
      .then(response => response.data)
      .catch(console.log)
  };
}


const initialState = {
  user: {},
  isLoading: false,
  didError: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case `${RETRIEVE_USER}_PENDING`:
      return Object.assign({}, state, { isLoading: true });

    case `${RETRIEVE_USER}_FULFILLED`:
      return Object.assign({}, state, {
        isLoading: false,
        user: action.payload

      });

    case `${RETRIEVE_USER}_REJECTED`:
      return Object.assign({}, state, {
        isLoading: false,
        didError: true
      });


      case `${NEW_USER}_PENDING`:
    return Object.assign({}, state, { isLoading: true });

    case `${NEW_USER}_FULFILLED`:
      return Object.assign({}, state, {
        isLoading: false,
        user: action.payload

      });



    default:
      return state;
  }
}
