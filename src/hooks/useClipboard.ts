import { useRef, useState } from 'react';
import { Bounce, toast } from 'react-toastify';

function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [isCopied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copy = async (text) => {
    if ('clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('🦄 Copy Success!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce
        });
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast('Copy Failed!');
      }
    } else {
      toast('Copy Failed!');
      console.error('Clipboard API not supported');
    }
  };

  return [isCopied, copy];
}

export default useClipboard;
