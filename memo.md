# シンプルメモアプリ

## 開発ステップ

### ステップ1: プロジェクト作成
```bash
npx create-react-app memo-app
cd memo-app
npm install firebase react-router-dom tailwindcss
```

### ステップ2: Firebase設定
1. Firebaseコンソールでプロジェクト作成
2. Webアプリ登録
3. 設定情報を`src/firebase.js`に保存

### ステップ3: 基本機能実装
- メモ一覧表示
- メモ作成フォーム
- メモ編集・削除機能

### ステップ4: Firebase連携
- Firestoreとの接続
- リアルタイム同期

### ステップ5: 認証機能
- ログイン/登録画面
- ユーザー別メモ管理

### ステップ6: デプロイ
```bash
npm run build
firebase deploy
```