import React, { useState } from 'react';
import MemoList from './MemoList';
import DeleteConfirmModal from './DeleteConfirmModal';

function Sidebar({ isOpen, memos, onEdit, onDelete, onToggle, isSelectionMode, setIsSelectionMode, selectedMemos, setSelectedMemos }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuOpenMemoId, setMenuOpenMemoId] = useState(null);
  
  const toggleMenu = (memoId) => {
    setMenuOpenMemoId(menuOpenMemoId === memoId ? null : memoId);
  };
  
  const handleDeleteSelected = () => {
    if (selectedMemos.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      // 選択されたメモを削除する処理
      for (const memoId of selectedMemos) {
        await onDelete(memoId);
      }
      setIsDeleteModalOpen(false);
      setIsSelectionMode(false);
    } catch (error) {
      console.error("Error deleting selected memos: ", error);
    }
  };
  
  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-sm z-20 transition-all duration-300 ${
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full"
        } overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">
              メモ一覧
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSelectionMode(!isSelectionMode)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title={isSelectionMode ? "選択を完了" : "選択モード"}
              >
                {isSelectionMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </button>
              {isSelectionMode && (
                <button
                  onClick={handleDeleteSelected}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="選択したメモを削除"
                  disabled={selectedMemos.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={onToggle}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="サイドバーを閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-180px)] pr-2 -mr-2">
            <MemoList
              memos={memos}
              onEdit={onEdit}
              onDelete={onDelete}
              isSidebar={true}
              isSelectionMode={isSelectionMode}
              selectedMemos={selectedMemos}
              onToggleSelect={(memoId) => {
                setSelectedMemos(prev => 
                  prev.includes(memoId) 
                    ? prev.filter(id => id !== memoId)
                    : [...prev, memoId]
                );
              }}
              menuOpenMemoId={menuOpenMemoId}
              onToggleMenu={toggleMenu}
            />
          </div>
        </div>
      </div>
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="メモを削除"
        message={`選択した${selectedMemos.length}個のメモを削除してもよろしいですか？`}
      />
    </div>
  );
}

export default Sidebar;
