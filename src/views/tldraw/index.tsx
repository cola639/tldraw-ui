import { joinByUUID } from 'apis/tldraw';
import useDynamicCSS from 'hooks/useDynamicCSS';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tldraw, track, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { paramToObj } from 'utils';
import TldrawStyle from './tldrawStyle';
import { useYjsStore } from './useYjsStore';

// const HOST_URL = import.meta.env.MODE === 'development' ? 'ws://148.135.43.239:1235' : 'ws://148.135.43.239:1235';

const HOST_URL = 'ws://148.135.43.239:1235';
export const usePermissionAndStore = (roomId) => {
  const [store, setStore] = useState(undefined);
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();
  const storeInstance = useYjsStore({
    roomId,
    hostUrl: HOST_URL
  });

  useEffect(() => {
    const checkPermission = async () => {
      try {
        await joinByUUID(roomId);
        setHasPermission(true);
      } catch (error) {
        setTimeout(() => {
          navigate('/');
        }, 2 * 1000);
      }
    };

    checkPermission();
  }, [roomId]);

  useEffect(() => {
    // 加载完成 设置store
    if (hasPermission && storeInstance.status !== 'loading') {
      setStore(storeInstance);
    }
  }, [storeInstance]);

  return store;
};

export default function YjsExample() {
  const { roomId } = paramToObj();
  const store = usePermissionAndStore(roomId);

  return (
    <div className="tldraw__editor">
      <TldrawStyle />
      <Tldraw
        autoFocus
        store={store}
        components={{
          SharePanel: NameEditor
        }}
      />
    </div>
  );
}

const NameEditor = track(() => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/');
  };

  const editor = useEditor();

  const { color, name } = editor.user.getUserPreferences();
  useDynamicCSS('/normalize.css', true);
  // useEffect(() => {
  //   // 获取并移除 normalize.css 的 link 元素
  //   const linkElement = document.querySelector('link[href*="normalize.css"]');
  //   console.log('🚀 >> useEffect >> linkElement:', linkElement);
  //   if (linkElement) {
  //     linkElement.parentNode.removeChild(linkElement);
  //   }

  //   return () => {
  //     // 返回清理函数，用于恢复 normalize.css
  //     const newLinkElement = document.createElement('link');
  //     newLinkElement.rel = 'stylesheet';
  //     newLinkElement.href = '/normalize.css';
  //     document.head.appendChild(newLinkElement);
  //   };
  // }, []);

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <button className="mr10" onClick={handleBackHome}>
        GoBack
      </button>

      <input
        type="color"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value
          });
        }}
      />
      <input
        value={name}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            name: e.currentTarget.value
          });
        }}
      />
    </div>
  );
});
