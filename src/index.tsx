import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'store';
import App from 'views/App';
import './styles//override.scss';
import './styles/global.scss';

console.log('value', import.meta.env.MODE, import.meta.env.VITE_APP_TITLE);

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
