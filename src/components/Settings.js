import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Settings({ onClose }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentUser } = useAuth();
  // TODO: アカウント削除処理を実装
  const handleDeleteAccount = () => {
    if (window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      console.log('アカウント削除処理を実装');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            設定
          </h3>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div 
            className={`flex items-center justify-between p-3 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } rounded-lg cursor-pointer`}
            onClick={toggleDarkMode}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>ダークモード</span>
            </div>
            <div className={`w-11 h-6 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-gray-200'} relative`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>

          {currentUser ? (
            <>
              <button
                onClick={() => console.log('ログアウト処理を実装')}
                className={`w-full text-left p-3 ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                } rounded-lg flex items-center gap-3`}
              >
                <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>ログアウト</span>
              </button>

              <button
                onClick={handleDeleteAccount}
                className={`w-full text-left p-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} rounded-lg flex items-center gap-3 ${
                  isDarkMode ? 'text-red-400' : 'text-red-500'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>アカウント削除</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => console.log('ログアウト処理を実装')}
              className={`w-full text-left p-3 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
              } rounded-lg flex items-center gap-3`}
            >
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>ログイン</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;