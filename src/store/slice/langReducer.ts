import { createSlice } from '@reduxjs/toolkit';

interface LangProps {
  language: string;
}

// initial state
const initialState: LangProps = {
  language: localStorage.getItem('lang') || window.navigator.language || 'en' // 默认蓝色主题
};

const langReducer = createSlice({
  name: 'langReducer',
  initialState,
  reducers: {
    setLang(state, action) {
      console.log('action payload ->', action.payload);
      localStorage.setItem('lang', action.payload);
      state.language = action.payload;
    },
    hasError(state, action) {
      state.language = action.payload;
    }
  }
});

export default langReducer.reducer;
export const { setLang } = langReducer.actions;

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
