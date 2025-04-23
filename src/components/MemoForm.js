import React, { useState, useEffect, useRef } from 'react';

function MemoForm({ memo, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lastSavedTitle, setLastSavedTitle] = useState('');
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const saveTimeoutRef = useRef(null);
  const initialRenderRef = useRef(true);

  // 空のメモを削除する関数
  const checkAndDeleteEmptyMemo = () => {
    if (memo?.id && title.trim() === '' && content.trim() === '') {
      onSubmit({ id: memo.id, title: '', content: '' });
      
      setTitle('');
      setContent('');
      setLastSavedTitle('');
      setLastSavedContent('');
    }
  };

  // メモデータの初期化
  useEffect(() => {
    if (memo) {
      setTitle(memo.title || '');
      setContent(memo.content || '');
      setLastSavedTitle(memo.title || '');
      setLastSavedContent(memo.content || '');
    } else {
      setTitle('');
      setContent('');
      setLastSavedTitle('');
      setLastSavedContent('');
    }
    
    initialRenderRef.current = true;
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [memo]);

  // 自動保存の処理
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    if (!isTyping) {
      return;
    }
    
    // 空のメモの処理
    if (title.trim() === '' && content.trim() === '') {
      if (memo?.id) {
        checkAndDeleteEmptyMemo();
      }
      return;
    }
    
    // 変更があった場合のみ保存
    if (title !== lastSavedTitle || content !== lastSavedContent) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        onSubmit({ title, content, id: memo?.id });
        setLastSavedTitle(title);
        setLastSavedContent(content);
      }, 1000);
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, memo?.id, onSubmit, isTyping, lastSavedTitle, lastSavedContent]);

  // フォーカスを失ったときの処理
  const handleBlur = () => {
    if (title.trim() === '' && content.trim() === '') {
      checkAndDeleteEmptyMemo();
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsTyping(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsTyping(true);
  };

  // タイトル入力でEnterキーが押されたときの処理
  const handleTitleKeyDown = (e) => {
    // IMEの変換中は処理しない
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      
      setTimeout(() => {
        document.getElementById('content').focus();
      }, 10);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="border-b border-gray-200/80 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">
            {memo?.id ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-500">{memo?.id ? '編集中' : '新規メモ'}</span>
        </div>
      </div>
      <div className="flex-1 p-8 space-y-6">
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleTitleKeyDown}
          className="w-full text-3xl font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300"
          placeholder="無題"
        />
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          className="w-full h-full min-h-[calc(100vh-20rem)] text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-300"
          placeholder="ここに内容を入力..."
        />
      </div>
    </div>
  );
}

export default MemoForm;
