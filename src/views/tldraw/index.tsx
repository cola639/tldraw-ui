import { joinByUUIDApi } from 'apis/tldraw';
import Button from 'components/button';
import useDynamicCSS from 'hooks/useDynamicCSS';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tldraw, track, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { paramToObj } from 'utils';
import TldrawStyle from './tldrawStyle';
import { useYjsStore } from './useYjsStore';

export default function YjsExample() {
  useDynamicCSS('/normalize.css', true);
  const HOST_URL = 'ws://148.135.43.239:1235';
  const { roomId } = paramToObj();
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();
  const store = useYjsStore({
    roomId,
    hostUrl: HOST_URL
  });
  useEffect(() => {
    const checkPermission = async () => {
      try {
        await joinByUUIDApi(roomId);
        setHasPermission(true);
      } catch (error) {
        setTimeout(() => {
          navigate('/');
        }, 2 * 1000);
      }
    };

    checkPermission();
  }, [roomId]);

  if (!hasPermission) {
    return <div>Loading...</div>;
  } else {
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
}

const NameEditor = track(() => {
  const editor = useEditor();
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/');
  };

  const { color, name } = editor.user.getUserPreferences();

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <Button className="ml5 mr10" onClick={handleBackHome}>
        {'< GoBack'}
      </Button>

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
