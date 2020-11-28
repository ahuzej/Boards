import { combineReducers, createStore, getDefaultMiddleware, applyMiddleware } from "@reduxjs/toolkit";
import projectsReducer from '../reducers/projectsReducer';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from '../reducers/authReducer';
import storage from 'redux-persist/lib/storage';
import { user } from "../slices/userSlice";
import { boards } from "../slices/boardsSlice";
import { threads } from "../slices/threadsSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const appReducer = combineReducers({ user: user.reducer, boards: boards.reducer, threads: threads.reducer });

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }

  return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default (() => {
  let store = createStore(persistedReducer, applyMiddleware(...getDefaultMiddleware()));
  let persistor = persistStore(store);

  return { store, persistor };
});