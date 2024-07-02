import { createSlice } from '@reduxjs/toolkit';
import { loginApi, logoutApi } from 'apis/user';
import { getToken, removeToken, setToken } from 'utils/auth';
import { dispatch } from '../index';

interface UserProps {
  token?: string;
  roles?: string[];
  permissions?: string[];
}

const initialState: UserProps = {
  token: getToken(),
  roles: [],
  permissions: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      // 更新用户token的逻辑
      state.token = action.payload;
      setToken(action.payload);
    },
    logout(state) {
      // 清空用户token的逻辑
      state.token = undefined;
      removeToken();
    }
  }
});

/**
 * async actions
 */
export function loginUser(data) {
  return new Promise<void>((resolve, reject) => {
    loginApi(data)
      .then((res) => {
        console.log('🚀 >> .then >> res:', res);
        const { token } = res as any;
        dispatch(setUser(token));
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function logoutUser() {
  return new Promise<void>((resolve, reject) => {
    logoutApi()
      .then(() => {
        dispatch(logout());
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default userSlice.reducer;
export const { setUser, logout } = userSlice.actions;
