import { combineReducers } from '@reduxjs/toolkit';
import langReducer from './langReducer';
import themeReducer from './themeReducer';
import userReducer from './userReducer';

// combine reducers
const reducer = combineReducers({
  theme: themeReducer,
  lang: langReducer,
  user: userReducer
});

export default reducer;
