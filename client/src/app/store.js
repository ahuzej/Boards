import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { user } from "../slices/userSlice";
import { boards } from "../slices/boardsSlice";
import { threads } from "../slices/threadsSlice";
import { comments } from "../slices/commentsSlice";
import { users } from "../slices/usersSlice";
import { loadFromStorage, saveToStorage } from "./localStorage";
import { throttle } from 'lodash';

const initialState = loadFromStorage();

const appReducer = combineReducers({ 
  user: user.reducer, 
  boards: boards.reducer, 
  threads: threads.reducer, 
  comments: comments.reducer,
  users: users.reducer 
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }

  return appReducer(state, action);
}

const store = configureStore(
  {
    reducer: rootReducer, 
    preloadedState: initialState, 
    devTools: true
  }
);
store.subscribe(throttle(() => {
  saveToStorage(store.getState());
}, 1000));

export default store;