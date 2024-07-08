import { DotLoading, Mask } from 'antd-mobile';
import { joinByUUIDApi, uploadCaptureApi } from 'apis/tldraw';
import Button from 'components/button';
import useDynamicCSS from 'hooks/useDynamicCSS';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor, Tldraw, exportToBlob, track, useEditor, useExportAs, useUiEvents } from 'tldraw';
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
  const [visible, setVisible] = useState(false);
  const trackEvent = useUiEvents();
  const editor = useEditor();
  const exportAs = useExportAs();
  const navigate = useNavigate();
  const handleBackHome = () => {
    capture();
  };
  function getExportName(editor: Editor, defaultName: string) {
    const selectedShapes = editor.getSelectedShapes();
    // When we don't have any shapes selected, we want to use the document name
    if (selectedShapes.length === 0) {
      return editor.getDocumentSettings().name || defaultName;
    }
    return undefined;
  }
  const capture = async () => {
    try {
      setVisible(true);
      const { roomId } = paramToObj();
      let ids = editor.getSelectedShapeIds();
      if (ids.length === 0) ids = Array.from(editor.getCurrentPageShapeIds().values());
      if (ids.length === 0) return navigate('/');

      const blob = await exportToBlob({ editor, ids, format: 'png' });
      const file = new File([blob], name, { type: blob.type });
      let formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', roomId);
      await uploadCaptureApi(formData);
      navigate('/');
    } catch (error) {
    } finally {
      setVisible(false);
    }
  };

  const { color, name } = editor.user.getUserPreferences();

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <Button className="ml5 mr10" onClick={handleBackHome}>
        {'< Back'}
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

      <Mask visible={visible} opacity="thick">
        <div style={{ fontSize: 30, textAlign: 'center' }}>
          <DotLoading color="#60a9f4" />
        </div>
      </Mask>
    </div>
  );
});
