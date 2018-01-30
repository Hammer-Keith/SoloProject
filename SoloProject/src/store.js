import {createStore, applyMiddleware} from "redux";
import promiseMiddleware from "redux-promise-middleware";

import user from "./ducks/user";

const store = createStore(user, applyMiddleware(promiseMiddleware()));
export default store;