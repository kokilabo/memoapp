import React, { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

function MemoList({ 
  memos, 
  onEdit, 
  onDelete, 
  isSidebar = false, 
  isSelectionMode = false, 
  selectedMemos = [], 
  onToggleSelect,
  onMemoClick,
  menuOpenMemoId,
  onToggleMenu
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
    }
  };
  return (
    <>
    <div className={isSidebar
      ? "flex flex-col space-y-2"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    }>
      {memos.map((memo) => (
        <div 
          key={memo.id} 
          className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm group ${
            isSidebar ? 'p-3' : 'p-6'
          } hover:shadow-md transition-all cursor-pointer relative`}
          onClick={(e) => {
            if (isSelectionMode && onToggleSelect) {
              onToggleSelect(memo.id);
            } else {
              // サイドバーの場合はonEditを、メインエリアの場合はonMemoClickを使用
              if (isSidebar) {
                onEdit(memo);
              } else if (onMemoClick) {
                onMemoClick(memo);
              }
            }
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 max-w-[80%]">
              {isSelectionMode && (
                <div 
                  className={`w-5 h-5 rounded border ${
                    selectedMemos.includes(memo.id) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  } flex items-center justify-center transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect && onToggleSelect(memo.id);
                  }}
                >
                  {selectedMemos.includes(memo.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              )}
              <h3 className={`font-bold ${isSidebar ? 'text-base' : 'text-xl'} text-gray-800 truncate`}>
                {memo.title}
              </h3>
            </div>
            {!isSelectionMode && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMenu && onToggleMenu(memo.id, e);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                {menuOpenMemoId === memo.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(memo);
                        onToggleMenu && onToggleMenu(memo.id, e);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      名前を変更
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(memo);
                        setIsDeleteModalOpen(true);
                        onToggleMenu && onToggleMenu(memo.id, e);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      削除
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className={`text-gray-600 ${isSidebar ? 'text-sm' : 'text-base'} leading-relaxed truncate`}>
            {isSidebar ? memo.content.substring(0, 50) : memo.content}
          </p>
        </div>
      ))}
    </div>
    <DeleteConfirmModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleDelete}
      title="メモを削除"
      message="このメモを削除してもよろしいですか？"
    />
    </>
  );
}

export default MemoList;