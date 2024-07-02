import { useThemeWatcher } from 'hooks/useThemeWatcher';
import Locales from 'locales';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routes from 'routes';
import VConsole from 'vconsole';

function App() {
  useThemeWatcher();
  useEffect(() => {
    import.meta.env.VITE_VCONSOLE === 'open' && new VConsole();
    return () => {};
  }, []);

  return (
    <Locales>
      <ToastContainer />
      <Routes />
    </Locales>
  );
}

export default App;
