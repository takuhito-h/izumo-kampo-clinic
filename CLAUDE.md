# izumo-kampo-clinic

出雲漢方クリニック公式サイト（izumo-kampo.clinic / WordPress）の**リデザイン版**を Astro で構築した静的サイト。
HTML構造は本番テーマの出力をそのまま使い、**CSSのみ刷新**する方針。

## コマンド

- `npm run dev` — 開発サーバ（Astro、src を即時反映）
- `npm run build` — 静的ビルド（出力先 `dist/`）
- `npm run preview` — ビルド済み `dist/` をローカル配信（http://localhost:4321）
- `npm run serve` — `build` → `preview` を一括実行（ビルド後の確認用）
- `npm run format` — Prettier 整形（`.astro` / `.js` / `astro.config.mjs`）

ビルド設定: `output: "static"`, `build.format: "file"`, `trailingSlash: "never"` → URL は `/clinic.html` のような形式（トップは `/` = `index.html`）。

### ビルド後にローカルで確認する

ビルド時に `postbuild`（`scripts/relativize.mjs`）が走り、`dist/` 内の HTML の絶対パス（`/clinic.html`・`/wp-content/...`・`/` など）を**各ファイルの階層に応じた相対パス**（root は `./`、`blog/` 配下は `../`）へ自動変換する。

そのため確認方法は2通り、どちらでも崩れない:

- **ファイル直開き**: `dist/index.html` や `dist/blog/01.html` をブラウザで開く（file://）
- **ローカルサーバ**: `npm run serve`（ビルド＋ http://localhost:4321 配信）/ `npm run build && npm run preview`

※ ソース（`src/`・コンポーネント）側のリンクは**絶対パス（`/clinic.html` 等）のまま**にしておくこと。相対化は postbuild が出力に対してのみ行う。

## ディレクトリ構成

- `src/pages/*.astro` — 各ページ。`PageLayout` に `title` / `wrapperClass` / `active` を渡し、固有の `#main`（とTOPは `slot="hero"` の `#images`）を**素のHTMLマークアップ**で記述。ブログは `src/pages/blog/`（`/blog.html`, `/blog/01.html` …）。
- `src/layouts/PageLayout.astro` — 共通レイアウト。BaseLayout＋共通チャンク（ヘッダー/ナビ/サイド/フッター/ドロワー）を組み立てる。
- `src/layouts/BaseLayout.astro` — `<head>`。全CSSを**ローカルパス**で読み込み。
- `src/components/` — 共通チャンク（`SiteHeader` `GlobalNav` `SideMenu` `SiteFooter` `Drawer` `MobileFooter` `MobileMenuButton` `ReserveBand`）。ナビ項目は `navItems.js`。`GlobalNav`/`Drawer` は `active`（現在ページのナビhref）で current 表示。

## スタイルの編集ルール（重要）

- **デザイン調整は `public/style-pc.css`（PC基準）と `public/style-sp.css`（モバイル上書き: ≤980 / ≤560）のみで行う。**
- `public/css-php.css` ・ `public/wp-content/**` ・ `public/wp-includes/**` は**本番WordPress由来CSSをダウンロードしたもの（編集禁止・vendored）**。本番の読み込みを再現するためのもので、調整は style-pc/sp.css 側で上書きする。
- 読み込み順は BaseLayout 内で「本番CSS群 → style-pc/sp → 本番テーマCSS(wce-style)」。`style-pc.css` の冒頭にパレット（`--green:#677A4D` / `--green-d:#415E40` 等）を定義。

## JavaScript

`BaseLayout.astro` で本番WordPressと同じJSを読み込む（完全再現方針）。全て `is:inline`、同一オリジンJSは `public/` にDL済み・ローカルパス参照、jQuery等のCDNは `https:` 明示。

- 読み込む: jQuery 3.4.1 / js.cookie / base.js・add0.js / droppy / backstretch / sidr / lightbox一式 / nivoSlider / calendar系、および本番のインライン初期化（droppy・navdrop・nivoSlider init・count-per-day・instagram・typekit 等）。
- **除外**: GTM / gtag（GA4）= localhostから本番GAへ送信されるため。schema(ld+json) = ページ固有メタデータのため。
- ヒーローは本番 nivoSlider が初期化（CSSフォールバックではなく実スライダーが回る）。
- **モバイルドロワーは `public/add.js`（リデザイン独自）を併用**。本番 sidr.js は `.mobile_menu` の `href` を source にパネル生成する設計で、移行済みの既存 `#sidr` では機能しないため、ドロワー開閉は add.js が担う（sidr.js 自体は読み込み済み）。`add.js` はリデザイン独自JS（ドロワー制御＋ページトップボタン＋ナビのスクロール追従）を集約したファイル。
- `admin-ajax.php`（count-per-day / instagram）はローカルにバックエンドが無く404/CORSで失敗するが無害。

## 資産のローカル化

- CSS・画像（`public/wp-content/uploads/**` 等）は本番からDL済みで**本番ドメインに依存しない**。本番はホットリンク保護があるため、画像参照はローカルパス（`/wp-content/...`）に統一する。
- 本番から新規ページ/画像を取り込む際も同様に `public/` へミラーし、`https://izumo-kampo.clinic/wp-content|wp-includes/` → `/wp-content|wp-includes/` に書き換える。
