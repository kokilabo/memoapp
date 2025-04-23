import React, { useState } from 'react';
import MemoList from './MemoList';
import DeleteConfirmModal from './DeleteConfirmModal';

function Sidebar({ isOpen, memos, onEdit, onDelete, onToggle }) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMemos, setSelectedMemos] = useState([]);
  const [menuOpenMemoId, setMenuOpenMemoId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteSelected = () => {
    if (selectedMemos.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    selectedMemos.forEach(id => onDelete(id));
    setSelectedMemos([]);
    setIsSelectionMode(false);
  };

  const toggleMenu = (memoId, e) => {
    e.stopPropagation();
    setMenuOpenMemoId(menuOpenMemoId === memoId ? null : memoId);
  };

  return (
    <div className="fixed left-0 top-0 h-full flex z-50">
      {/* サイドバー本体 */}
      <div 
        className={`h-full bg-white/95 backdrop-blur-md border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-4 w-72">
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

      {/* トグルボタン */}
      <button
        onClick={onToggle}
        className="h-12 w-8 mt-6 flex items-center justify-center bg-white/95 backdrop-blur-md border border-gray-200 shadow-sm rounded-r-xl hover:bg-gray-50 transition-colors shrink-0"
      >
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>
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