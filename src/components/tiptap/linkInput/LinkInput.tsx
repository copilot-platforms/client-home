import {
  FC,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Editor } from '@tiptap/react';

import { ArrowForward, CloseRounded } from '@mui/icons-material';
import { Dialog } from '@mui/material';

import { TiptapEditorUtils } from '@/utils/tiptapEditorUtils';
import { useAppState } from '@/hooks/useAppState';

interface ILinkInput {
  editor: Editor;
}

const LinkInput: FC<ILinkInput> = ({ editor }) => {
  const [url, setUrl] = useState('');

  const appState = useAppState();

  const urlInputRef = useRef<HTMLInputElement>(null);

  const tiptapEditorUtils = new TiptapEditorUtils(editor);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    tiptapEditorUtils.insertLink(url);
    appState?.toggleShowLinkInput(false);
    setUrl('');
  };

  const handleKeyDown = (event: SyntheticEvent<HTMLDivElement>) => {
    //@ts-expect-error event should contain code
    if (event.code === 'Escape') {
      event.preventDefault();
      appState?.toggleShowLinkInput(false);
    }
  };

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [urlInputRef.current]);

  return (
    <Dialog
      open={appState?.appState.showLinkInput as boolean}
      onKeyDown={handleKeyDown}
    >
      <div className='p-2' tabIndex={0}>
        <div className='flex items-center justify-between pb-2'>
          <p>Enter URL</p>
          <CloseRounded
            fontSize='small'
            onClick={() => {
              appState?.toggleShowLinkInput(false);
            }}
            className='cursor-pointer'
          />
        </div>
        <form onSubmit={handleSubmit} className='flex items-center'>
          <input
            ref={urlInputRef}
            type='text'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className='outline-none border border-slate-300 p-0.5'
          />
          <ArrowForward
            fontSize='small'
            onClick={handleSubmit}
            className='cursor-pointer'
          />
        </form>
      </div>
    </Dialog>
  );
};

export default LinkInput;
