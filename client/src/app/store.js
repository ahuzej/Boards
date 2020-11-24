import { combineReducers, createStore, getDefaultMiddleware, applyMiddleware } from "@reduxjs/toolkit";
import projectsReducer from '../reducers/projectsReducer';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from '../reducers/authReducer';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, combineReducers({auth: authReducer, projects: projectsReducer}));

  export default (() => {
    let store = createStore(persistedReducer, applyMiddleware(...getDefaultMiddleware()));
    let persistor = persistStore(store);

    return { store, persistor };
});