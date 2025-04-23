import React, { useState, useEffect } from 'react';

function MemoForm({ memo, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (memo) {
      setTitle(memo.title || '');
      setContent(memo.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [memo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, id: memo?.id });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="border-b border-gray-200/80 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">
            {memo ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-500">{memo ? '編集中' : '新規メモ'}</span>
        </div>
        <div className="flex items-center gap-2">
          {memo && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100/80 transition-colors"
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {memo ? '更新' : '保存'}
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 space-y-6">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300"
          required
          placeholder="無題"
        />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[calc(100vh-16rem)] text-base text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 resize-none"
          required
          placeholder="メモを書く..."
        />
      </div>
    </form>
  );
}

export default MemoForm;