import React, { useState, useEffect } from 'react';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import MemoList from './components/MemoList';
import MemoForm from './components/MemoForm';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [memos, setMemos] = useState([]);
  const [currentMemo, setCurrentMemo] = useState({});
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMemos, setSelectedMemos] = useState([]);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : false;
  });

  // 選択モードを終了する際のクリーンアップ
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedMemos([]);
    }
  }, [isSelectionMode]);

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "memos"));
      const memoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemos(memoList);
    } catch (error) {
      console.error("Error fetching memos: ", error);
    }
  };

  const handleSubmit = async (memo) => {
    try {
      // 空のメモは保存しない
      if (!memo.title.trim() && !memo.content.trim()) {
        return;
      }
      
      let newMemoRef;
      if (memo.id) {
        // 更新
        const memoRef = doc(db, "memos", memo.id);
        await updateDoc(memoRef, {
          title: memo.title,
          content: memo.content,
          updatedAt: new Date()
        });
      } else {
        // 新規作成
        newMemoRef = await addDoc(collection(db, "memos"), {
          title: memo.title,
          content: memo.content,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // 新規作成の場合は、作成されたIDをセットして編集モードに移行
        if (newMemoRef) {
          setCurrentMemo({
            id: newMemoRef.id,
            title: memo.title,
            content: memo.content,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      // 保存後に必ずメモを再取得して最新状態にする
      await fetchMemos();
    } catch (error) {
      console.error("Error saving memo: ", error);
    }
  };

  const handleEdit = (memo) => {
    setCurrentMemo(memo);
    // メモを選択したらサイドバーを閉じる
    setIsSidebarOpen(false);
    localStorage.setItem('sidebarOpen', 'false');
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "memos", id));
      fetchMemos();
    } catch (error) {
      console.error("Error deleting memo: ", error);
    }
  };

  const handleCancel = () => {
    setCurrentMemo(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => {
      const newState = !prevState;
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  const handleDeleteAll = () => {
    setIsDeleteAllModalOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const batch = writeBatch(db);
      memos.forEach((memo) => {
        const docRef = doc(db, "memos", memo.id);
        batch.delete(docRef);
      });
      await batch.commit();
      fetchMemos();
    } catch (error) {
      console.error("Error deleting all memos: ", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-[90rem] mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-lg transition-colors"
                  title={isSidebarOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-medium text-gray-800">Simple note</h1>
              </div>
              <button
                onClick={() => setCurrentMemo({})}
                className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                title="新規メモ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          memos={memos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={toggleSidebar}
          isSelectionMode={isSelectionMode}
          setIsSelectionMode={setIsSelectionMode}
          selectedMemos={selectedMemos}
          setSelectedMemos={setSelectedMemos}
        />

        <div className="max-w-[90rem] mx-auto">
          <div className={`${currentMemo !== null ? 'block' : 'hidden'}`}>
            <MemoForm
              memo={currentMemo}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
          <div className={`${currentMemo === null ? 'block p-8' : 'hidden'}`}>
            <MemoList
              memos={memos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isSelectionMode={isSelectionMode}
              selectedMemos={selectedMemos}
              onToggleSelect={(memoId) => {
                setSelectedMemos(prev =>
                  prev.includes(memoId)
                    ? prev.filter(id => id !== memoId)
                    : [...prev, memoId]
                );
              }}
              onMemoClick={handleEdit}
            />
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={handleConfirmDeleteAll}
        title="すべてのメモを削除"
        message="すべてのメモを削除してもよろしいですか？この操作は取り消せません。"
      />
    </>
  );
}

export default App;
