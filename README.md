# AcadeMina (Next.js 版 / legacy migration)

このリポジトリは、既存の静的HTML/CSS/JS（legacy）を **Next.js(App Router) + TypeScript** に移植したものです。
まずは **デザインを崩さずに全ページを Next.js で表示できる状態** を作っています（機能の本実装は次フェーズ）。

## 1. ローカルで起動（VSCode）
1) Node.js v18+ を入れる  
2) 依存関係をインストール
```bash
npm install
```
3) 開発サーバ起動
```bash
npm run dev
```
4) ブラウザで `http://localhost:3000` を開く

## 2. GitHub運用（最小フロー）
```bash
git status
git add .
git commit -m "your message"
git push origin main
```

## 3. ルーティング対応（.html 互換）
既存のリンク（`/about.html` など）を壊さないため、`next.config.js` で `.html → 新URL` にリダイレクトしています。

例：
- `/index.html` → `/`
- `/exam-store.html` → `/exam-store`

## 4. legacy資産の置き場所
- `public/common.js` : 既存の共通JS（ヘッダー挿入、カートバッジ等）
- `public/cms-config.js` : 既存CMS連携JS
- `public/news-data.js` : 既存のお知らせデータ
- `public/scripts/*` : もともと各HTMLに書かれていた inline script をファイル化

※ `store-data.js / exam-data.js / labs-data.js` は未添付だったため **仮データ** を入れています。あとから置換してください。

## 5. 次のフェーズ（Aの次）
- 画面は維持しつつ、`Clerk / Stripe / Prisma(Postgres) / R2` に置き換え
- データ取得を `fetch()` + API Routes / Server Actions に寄せる
