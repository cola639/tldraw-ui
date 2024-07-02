import { createSlice } from '@reduxjs/toolkit';

interface ThemeProps {
  themeType: string;
}

// initial state
const initialState: ThemeProps = {
  themeType: localStorage.getItem('data-theme') || 'light' // 默认蓝色主题
};

const theme = createSlice({
  name: 'themeReducer',
  initialState,
  reducers: {
    setTheme(state, action) {
      console.log('action payload ->', action.payload);
      localStorage.setItem('data-theme', action.payload);
      state.themeType = action.payload;
    },
    hasError(state, action) {
      state.themeType = action.payload;
    }
  }
});

export default theme.reducer;
export const { setTheme } = theme.actions;

// async actions
// export function getTemplate() {
//   return async () => {
//     try {
//       const response = await apiLogin();
//       dispatch(template.activeItem(response.value));
//     } catch (error) {
//       dispatch(template.hasError(error));
//     }
//   };
// }
