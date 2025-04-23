import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { setCurrentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('認証処理開始:', isSignUp ? 'アカウント作成' : 'ログイン');
      
      if (isSignUp) {
        console.log('アカウント作成試行中...');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        navigate('/');
      } else {
        console.log('ログイン試行中...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        navigate('/');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      
      // エラーコードが存在する場合は適切なメッセージを表示
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            setError('ユーザーが見つかりません');
            break;
          case 'auth/wrong-password':
            setError('パスワードが間違っています');
            break;
          case 'auth/email-already-in-use':
            setError('このメールアドレスは既に使用されています');
            break;
          case 'auth/invalid-email':
            setError('メールアドレスの形式が正しくありません');
            break;
          case 'auth/weak-password':
            setError('パスワードは6文字以上である必要があります');
            break;
          case 'auth/operation-not-allowed':
            setError('この認証方法は現在利用できません');
            console.error('Firebase Authentication が有効になっていない可能性があります');
            break;
          case 'auth/network-request-failed':
            setError('ネットワークエラーが発生しました。インターネット接続を確認してください');
            break;
          default:
            setError(`認証エラーが発生しました: ${error.message}`);
            break;
        }
      } else {
        // エラーコードがない場合はエラーメッセージをそのまま表示
        setError(`エラーが発生しました: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className={`px-8 py-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' 
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                } border focus:ring-blue-500 focus:ring-opacity-50 focus:ring-2 focus:outline-none transition-colors`}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                パスワード
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full px-3 py-2 pr-10 rounded-md ${
                    isDarkMode
                      ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                  } border focus:ring-blue-500 focus:ring-opacity-50 focus:ring-2 focus:outline-none transition-colors`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2" role="alert">
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button
                    onClick={() => setError('')}
                    className="text-red-700 hover:text-red-900 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              {isSignUp ? 'ログインする' : 'アカウントを作成する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;