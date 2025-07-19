# AI先輩 (AI Senpai)

率直なコミュニケーションをサポートするリモートワーク向けAIサービス

![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.12.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC)

## 概要

AI先輩は、リモートワークの増加により部下が上司に正直な状況を報告しづらくなっている問題を解決するサービスです。部下は率直な愚痴や不満をAI先輩に伝え、AI先輩がそれをオブラートに包んで建設的な形で上司に伝える仕組みを提供します。

### 主要機能

- 🤖 **AI先輩チャット**: OpenAI APIを活用した自然言語処理
- 💬 **メッセージ変換**: 愚痴を建設的なフィードバックに自動変換
- 👥 **ロールベース管理**: 部下/上司/管理者の権限制御
- 🎭 **アバター選択**: うさぎ、猫、イケメン、ギャルから選択可能
- 🔐 **認証システム**: NextAuth.jsによる安全なログイン
- 📊 **チーム管理**: 組織・チーム単位でのグループ管理

## 技術スタック

### フロントエンド

- **Next.js 15** - App Routerを使用したモダンなReactフレームワーク
- **TypeScript** - 型安全性とコード品質の向上
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **NextAuth.js** - 認証システム

### バックエンド

- **Next.js API Routes** - サーバーレスAPIエンドポイント
- **Prisma** - タイプセーフなORM
- **PostgreSQL** - メインデータベース
- **bcryptjs** - パスワードハッシュ化

### AI・外部サービス

- **OpenAI API** - AI処理とメッセージ変換
- **Vercel AI SDK** - AIとのインテグレーション

### 開発ツール

- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット
- **TypeScript** - 静的型チェック

## データベース設計

### ユーザーモデル

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(SUBORDINATE)
  teamId    String?
  team      Team?    @relation(fields: [teamId], references: [id])
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  SUBORDINATE  // 部下
  SUPERVISOR   // 上司
  ADMIN        // 管理者
}
```

### メッセージモデル

```prisma
model Message {
  id                 String   @id @default(cuid())
  content            String          // 元のメッセージ
  transformedContent String?         // AI変換後のメッセージ
  userId             String
  user               User     @relation(fields: [userId], references: [id])
  avatar             Avatar          // 選択されたアバター
  sentiment          String?         // 感情分析結果
  isRead             Boolean  @default(false)
  createdAt          DateTime @default(now())
}

enum Avatar {
  RABBIT    // うさぎ
  CAT       // 猫
  HANDSOME  // イケメン
  GAL       // ギャル
}
```

## プロジェクト構造

```
paisen/
├── app/                    # Next.js App Router
│   ├── api/               # APIエンドポイント
│   │   └── auth/          # 認証API
│   ├── chat/              # チャット画面
│   ├── dashboard/         # ダッシュボード
│   ├── login/             # ログイン画面
│   └── register/          # 新規登録画面
├── components/            # Reactコンポーネント
│   ├── chat-interface.tsx # チャットUI
│   ├── avatar-selector.tsx# アバター選択
│   └── providers.tsx      # プロバイダー設定
├── prisma/
│   └── schema.prisma      # データベーススキーマ
├── types/
│   └── next-auth.d.ts     # NextAuth型定義
└── middleware.ts          # 認証ミドルウェア
```

## セットアップ

### 前提条件

- Node.js 18.0.0以上
- PostgreSQLデータベース
- OpenAI APIキー

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd paisen
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数を設定

```bash
cp .env.example .env
```

`.env`ファイルに以下を設定：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/paisen"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

4. データベースセットアップ

```bash
npx prisma generate
npx prisma db push
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 利用可能なスクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintでコードチェック
- `npm run format` - Prettierでコードフォーマット
- `npm run format:check` - フォーマットが必要なファイルをチェック

## 機能詳細

### 認証システム

- NextAuth.jsによる安全なログイン/ログアウト
- ロールベースのアクセス制御
- JWTトークンによるセッション管理

### チャット機能

- リアルタイムチャットインターフェース
- アバター選択によるパーソナライゼーション
- メッセージ履歴の保存と表示

### AI変換機能

- OpenAI APIを使用した自然言語処理
- 感情分析と建設的な表現への変換
- 部下の立場に寄り添うAI先輩の性格設定

### チーム管理

- 組織・チーム単位でのユーザー管理
- 上司・部下の関係性管理
- データの適切な分離

## 開発ガイドライン

### コードスタイル

- Prettierで自動フォーマット（保存時実行）
- ESLintルールに従った品質管理
- TypeScriptによる型安全性の確保

### コミット規則

- 機能追加: `feat: 新機能の説明`
- バグ修正: `fix: 修正内容の説明`
- ドキュメント: `docs: ドキュメント更新`
- スタイル: `style: コードスタイル変更`

## セキュリティ

- パスワードのbcryptハッシュ化
- JWTトークンによる認証
- ロールベースアクセス制御
- 環境変数による機密情報管理
- HTTPS通信の強制

## ライセンス

ISC License

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

問題や質問がある場合は、Issuesページで報告してください。

---

リモートワークでも本音を伝えられる、AI先輩サービスをお楽しみください！ 🤖✨
