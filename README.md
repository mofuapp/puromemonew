# プロメモ - 画像＋プロンプト管理 PWA

みんなで共有できる、画像＋AIプロンプト管理アプリです。

## セットアップ手順

### 1. Supabase プロジェクト作成

1. [supabase.com](https://supabase.com) でアカウント作成・ログイン
2. 「New project」でプロジェクトを作成
3. 「SQL Editor」を開いて `supabase-setup.sql` の内容を貼り付けて実行

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を開いて、Supabase の「Project Settings > API」から以下をコピー：

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. 依存関係インストール & 起動

```bash
npm install
npm run dev
```

### 4. スマホでアクセス（同一ネットワーク）

```bash
# ローカルIPを確認
ifconfig | grep "inet 192"

# vite.config.ts に server.host を追加してから
npm run dev
# → http://192.168.x.x:5173 をスマホのブラウザで開く
```

### 5. PWA としてホーム画面に追加

- **iPhone**: Safari で開く → 共有ボタン → 「ホーム画面に追加」
- **Android**: Chrome で開く → メニュー → 「アプリをインストール」

## デプロイ（共有用）

### Vercel（無料・おすすめ）

```bash
npm install -g vercel
vercel --prod
```

Vercel の環境変数に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定する。

デプロイ後のURLをみんなに共有するだけで使えます！

## 機能

- 画像 + 日本語プロンプト + 英語プロンプト + メモを登録
- グリッド表示・全文検索
- ワンタップでプロンプトをクリップボードにコピー
- 編集・削除
- PWA対応（ホーム画面に追加してアプリっぽく使える）
