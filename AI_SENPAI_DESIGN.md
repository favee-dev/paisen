# AI先輩サービス設計書

## 概要
リモートワークの増加により、部下が上司に正直な状況を報告・連絡しづらくなっている問題を解決するため、AI先輩サービスを提供する。部下は率直な愚痴や不満をAI先輩に伝え、AI先輩がそれをオブラートに包んで建設的な形で上司に伝える。

## ユーザーペルソナ

### 部下（主要ユーザー）
- AI先輩にチャットUIでテキストメッセージを送信
- 率直な愚痴、不満、相談を気軽に投稿できる
- アバター選択により親しみやすさを演出

### 上司（閲覧ユーザー）
- AI先輩から変換された建設的なフィードバックを受け取る
- 部下の本音を理解しながら、関係性を保つことができる

## 機能要件

### 1. 認証機能
- Next Authを使用した認証システム
- 部下/上司の役割管理
- 組織・チーム単位でのグループ管理

### 2. チャットUI機能
- リアルタイムチャットインターフェース
- メッセージ履歴の表示
- タイピングインジケーター

### 3. AI先輩機能
- OpenAI APIを使用した自然言語処理
- プロンプトエンジニアリング：
  - 親和的で建設的な応答
  - 部下の立場に寄り添う姿勢
  - ネガティブな内容を建設的に変換
- アバター選択（うさぎ、猫、イケメン、ギャル）

### 4. メッセージ変換機能
- 部下の愚痴を建設的なフィードバックに変換
- 感情分析と適切な表現への変換
- 上司向けサマリー生成

### 5. データ管理
- 全ての会話履歴をDBに保存
- プライバシーとセキュリティの確保
- 分析用データの蓄積

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript** - 型安全性の確保
- **Tailwind CSS** - UIスタイリング
- **Vercel AI SDK** - AIとのインテグレーション
- **React Hook Form** - フォーム管理
- **Framer Motion** - アニメーション

### バックエンド
- **Next.js API Routes** - APIエンドポイント
- **Prisma** - ORM
- **PostgreSQL** - データベース（Vercel Postgres推奨）
- **OpenAI API** - AI処理

### 認証・セキュリティ
- **NextAuth.js** - 認証システム
- **JWT** - セッショントークン管理

### 開発ツール
- **Prettier** - コードフォーマット
- **ESLint** - コード品質管理
- **Vercel** - ホスティング・デプロイ

## データモデル

### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(SUBORDINATE)
  teamId    String?
  team      Team?    @relation(fields: [teamId], references: [id])
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  SUBORDINATE
  SUPERVISOR
  ADMIN
}
```

### Message
```prisma
model Message {
  id               String   @id @default(cuid())
  content          String
  transformedContent String?
  userId           String
  user             User     @relation(fields: [userId], references: [id])
  avatar           Avatar
  sentiment        String?
  isRead           Boolean  @default(false)
  createdAt        DateTime @default(now())
}

enum Avatar {
  RABBIT
  CAT
  HANDSOME
  GAL
}
```

### Team
```prisma
model Team {
  id        String   @id @default(cuid())
  name      String
  users     User[]
  createdAt DateTime @default(now())
}
```

## システムアーキテクチャ

```
┌─────────────────┐     ┌─────────────────┐
│   部下クライアント  │     │   上司クライアント  │
│   (Next.js)      │     │   (Next.js)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────┴──────┐
              │  Next.js    │
              │  API Routes │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────┴────┐ ┌────┴────┐ ┌───┴────┐
    │ NextAuth│ │ OpenAI  │ │ Prisma │
    │         │ │   API   │ │   ORM  │
    └─────────┘ └─────────┘ └────┬───┘
                                  │
                            ┌─────┴─────┐
                            │PostgreSQL │
                            └───────────┘
```

## セキュリティ考慮事項

1. **データ暗号化**
   - 通信時: HTTPS必須
   - 保存時: データベース暗号化

2. **アクセス制御**
   - ロールベースアクセス制御（RBAC）
   - チーム単位でのデータ分離

3. **プライバシー保護**
   - 個人を特定できる情報の匿名化オプション
   - データ保持期間の設定

4. **監査ログ**
   - 全てのアクセスログの記録
   - 不正アクセスの検知

## 開発フェーズ

### Phase 1: MVP開発（2-3週間）
1. 基本的な認証システム
2. シンプルなチャットUI
3. OpenAI APIとの基本連携
4. メッセージ保存機能

### Phase 2: 機能拡張（3-4週間）
1. アバター選択機能
2. メッセージ変換機能の高度化
3. 上司向けダッシュボード
4. チーム管理機能

### Phase 3: 品質向上（2-3週間）
1. UI/UXの改善
2. パフォーマンス最適化
3. セキュリティ強化
4. 分析機能の追加

## 今後の拡張可能性

1. **モバイルアプリ対応**
   - React Native版の開発
   - プッシュ通知機能

2. **AI機能の高度化**
   - 感情分析の精度向上
   - カスタムAIモデルの導入
   - 多言語対応

3. **分析機能**
   - チームの健康度スコア
   - トレンド分析
   - 改善提案の自動生成

4. **他システム連携**
   - Slack/Teams連携
   - HR管理システム連携
   - カレンダー連携

## 成功指標（KPI）

1. **利用率**
   - 月間アクティブユーザー数
   - メッセージ投稿頻度

2. **効果測定**
   - 上司・部下間のコミュニケーション改善度
   - 問題の早期発見率
   - 職場満足度の向上

3. **技術指標**
   - レスポンス時間
   - システム稼働率
   - エラー率