# schema.org 点検結果

点検日：2026-10-13。対象：作業ツリーの src/pages 全37ページと npm run build 後のHTML。既存の未コミット変更を含む現状を点検。ページコードは変更していない。

## 追加変更（2026-10-13）

ユーザーの指定により、ブログ記事01〜10のJSON-LDを削除。ブログ一覧の構造化データは維持。現在は27ページにJSON-LDがあり、ブログ記事10ページにはない。検証スクリプトもブログ記事のソース・生成HTMLにJSON-LDがないことを確認するよう変更。

## 修正完了（2026-10-13）

以下の監査記録は修正前の状態です。指摘事項に対して次の変更を実施しました。

- 全37ページにJSON-LDを実装。ブログ記事10ページに本文の見出し・公開日と院長を著者とするBlogPosting、WebPage、BreadcrumbList、WebSite、MedicalClinic、Personを追加。
- 医院・鍼灸院の対応言語をContactPointに移動。医院の対応言語は日本語・英語に統一。
- 医院のopeningHoursSpecificationは対面診療のみとし、オンライン診療をService.hoursAvailableとService.availableChannelで別に記述。予約制で空き枠の確認が必要な旨をdescriptionに保持。
- onlineのMedicalTherapy.providerと、YouTube視聴ページを指定していた動画contentUrlを削除。embedUrlを保持。
- 美容鍼のprimaryImageOfPageを本文と同じ2026/09の画像URLに修正。
- 鍼灸院の型に適用できないaudienceと標準語彙の裏付けがないpublicTransportationAccessを削除。本文の対象者・アクセス案内は維持。
- 鍼灸関連2ページに参照先のWebSite / MedicalClinic / Personを追加し、美容鍼ページには鍼灸院の実体も追加。online・鍼灸関連2ページにパンくずを追加。
- schemaのベタ書きと本番の絶対URLを維持。既存のFAQ・料金・動画日時は変更しない。本文に画像がないブログ記事には記事画像を創作していない。

検証：npm run build 成功。node scripts/check-schema.mjs 成功（全37ページ）。構文、ページ内@idの解決、IDの重複、修正したプロパティの適用先、診療時間の分離、パンくず、ブログ公開日・見出し、ImageObjectのローカル資産、生成HTMLのhead内JSON-LDとソースの一致を確認。

本番のHTTP取得可否、Google Rich Results Test / Schema.org Validatorへの投入、Search Consoleでの検証は未実施。

## 検証結果（修正前）

- 27ページにJSON-LDがあり、10ページ（ブログ記事01〜10）は未実装。
- ソースと生成HTMLの全JSON-LDで JSON.parse 相当の構文検証が成功。ビルド成功。headへの出力を確認。
- 共通の医院名、住所、院長の氏名・役職・資格はサイトの記述と整合。MedicalClinic / Person / MedicalWebPage等の主要な型の選択は妥当。
- 記述済みパンくずは位置が連番で絶対URLを使用。ブログ・鍼灸等の不足は下記。
- FAQの質問・回答は本文と照合。要約・語句の差はあるが、比較で検出された差をそのまま誤情報とは判定していない。
- Google Rich Results Test / Schema.org Validatorへの投入、本番URLのHTTPステータス・クロール可否、Search Console、動画の公開日時・尺の実データ確認は未実施。構文が正しいこととリッチリザルトの適格性は別。

## 優先して修正する項目

### 1. availableLanguage の適用先（共通25ページ＋提携鍼灸院）

MedicalClinic / Organization および HealthAndBeautyBusiness / LocalBusiness に availableLanguage を直接設定している。公式の適用先は ContactPoint、Course、LodgingBusiness、ServiceChannel、TouristAttraction。医院の contactPoint（ContactPoint）に移す等の修正が必要。英語対応自体は q_and_a 本文に根拠がある。online の医院だけ日本語のみで、他24ページの日本語・英語と異なる。

根拠：[availableLanguage](https://schema.org/availableLanguage)

### 2. オンライン動画の contentUrl（online.astro:173,195）

2動画ともYouTubeの視聴ページを指定している。Googleでは動画ファイルの実体のURLを要求しており、視聴ページURLは適切でない。直接動画ファイルを提供しない場合は contentUrl を省き、既存の embedUrl を使用する。name / thumbnailUrl / uploadDate は記述済みで、日付とdurationの形式も正常。公開日時・尺・サムネイル取得可否は別途実データの確認が必要。

根拠：[Google VideoObject](https://developers.google.com/search/docs/appearance/structured-data/video)

### 3. 美容鍼の画像URL（partnership-shinkyu-biyou.astro:29）

primaryImageOfPage は /wp-content/uploads/2026/10/biyoubari-main.jpg、本文は /wp-content/uploads/2026/09/biyoubari-main.jpg。10月版のファイルは public 内に存在しない。本文と同じ9月版に合わせる。本番の10月版が404かどうかは未確認。

### 4. オンライン外来の MedicalTherapy.provider（online.astro:112,121,130,139）

MedicalTherapy に provider は定義されていない。医院から availableService で結ぶ関係は正しいので、内側の provider を削除するか、外来サービスの表現を Service 等で別途設計する。単純に availableService の値を Service に置換するのは不適切（期待型は MedicalProcedure / MedicalTest / MedicalTherapy）。

根拠：[MedicalTherapy](https://schema.org/MedicalTherapy)、[provider](https://schema.org/provider)

### 5. 鍼灸院の追加プロパティ（partnership-shinkyu.astro:137,154）

audience は HealthAndBeautyBusiness / LocalBusiness の定義にない。対象者の記述は提供する Service に移す等の修正を推奨。publicTransportationAccess は公式型ページのプロパティ一覧に見当たらず、標準語彙としての裏付けが取れないため削除または description / additionalProperty 等で表現する。

根拠：[HealthAndBeautyBusiness](https://schema.org/HealthAndBeautyBusiness)

## 意味・実装方針の見直し

### 診療時間（医院を記述している25ページ）

対面午前：火〜金9:00–12:00、午後：月〜木14:00–17:00はtime本文の表と一致。オンライン：毎日8:30–18:00も表の△と対応するが、本文では予約枠次第・時間外診療もあると説明され、土日休診も明記される。

これらをすべて同じ MedicalClinic.openingHoursSpecification に入れると、物理的な医院も毎日8:30–18:00営業と解釈され得る。nameで「オンライン診療」と区別するだけでは、検索サービスが区別する保証はない。医院の営業時間を対面診療に限定し、オンライン受付は Service.availableChannel から ServiceChannel を参照する形等を検討して別に表す。正式な運用時間は院内確認が必要。

根拠：[openingHoursSpecification](https://schema.org/openingHoursSpecification)

### ページ内で未定義の @id（鍼灸関連2ページ）

- partnership-shinkyu：WebSite.publisher / 鍼灸院.parentOrganization が #organization を参照するが、医院ノードがない。
- partnership-shinkyu-biyou：#website と partnership-shinkyu#shinkyuin の実体がない。

別ページへの @id 参照そのものはJSON-LDの構文エラーではない。ただし CLAUDE.md の「1ページで完結させる」「別ページの @id だけを参照する書き方はしない」に不一致。参照先ノードを同じ @graph に含める。

### パンくずの不足

online、partnership-shinkyu、partnership-shinkyu-biyou は本文にパンくずがあるが BreadcrumbList がない。ブログ記事10ページも未実装。追加は改善事項でありJSON構文エラーではない。

### ブログ記事10ページ

BlogPosting と BreadcrumbList を追加する余地がある。見出し・本文の公開日・著者・記事URLを使い、WebSite / 医院 / Personもページ内で定義する。画像や更新日は実際の情報がある場合のみ記述する。Blog一覧のBlogノードだけでは個別記事の構造化データにならない。

### FAQと料金等

kampo_diet（4問）、kampo_tea（2問）、q_and_a（17問）、partnership-shinkyu（6問）、partnership-shinkyu-biyou（4問）、zesshin-lab（8問）にQuestion / acceptedAnswerがある。本文との照合で重大な意味の不一致は確認していない。q_and_aは本文の全質問を網羅していないが、部分的なマークアップ自体を構文エラーとはしない。

美容鍼のOffer 7,000 / 6,000 / 12,000 / 11,000円は本文と一致。舌診ラボの料金1,500円・毎週月曜20:30–21:00・主催者は本文と一致。提携鍼灸院の通常診療FAQの保険不可とブログ01の訪問鍼灸の保険対応は対象サービスが異なる可能性があり、医院の運用確認なしに矛盾と断定しない。

2026年5月7日からGoogle検索のFAQリッチリザルトは終了し、6月にドキュメントも削除された。FAQPageはschema.orgの意味付けとして残せるが、GoogleのFAQ表示獲得を目的に追加する必要はない。

根拠：[Google Search更新履歴](https://developers.google.com/search/updates)

## 全ページ一覧

「共通」は availableLanguage 適用先と営業時間の表現の見直し。要確認は構文エラーを意味しない。

| ソース | ページ型／追加型 | 判定・確認事項 |
|---|---|---|
| `allergy-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `blog/01.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/02.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/03.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/04.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/05.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/06.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/07.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/08.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/09.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/10.astro` | なし | 未実装：BlogPosting・パンくずを検討 |
| `blog/index.astro` | CollectionPage / Blog | 共通項目の見直し |
| `clinic.astro` | AboutPage | 共通項目の見直し |
| `dizziness-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `doctor.astro` | ProfilePage | 共通項目の見直し。ProfilePage.mainEntityのPerson参照あり、氏名・役職等整合 |
| `female-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `gastrointestinal-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `headache-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `index.astro` | MedicalWebPage | 共通項目の見直し |
| `kampo.astro` | MedicalWebPage | 共通項目の見直し |
| `kampo_diet.astro` | MedicalWebPage, FAQPage | 共通項目の見直し。FAQの主旨は本文と整合 |
| `kampo_tea.astro` | MedicalWebPage, FAQPage | 共通項目の見直し。FAQの主旨は本文と整合 |
| `menopause-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `online.astro` | MedicalWebPage / VideoObject / VideoObject | 共通項目の見直し、動画contentUrl・MedicalTherapy.provider修正、パンくず追加、対応言語統一 |
| `outpatient-cancer-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `pain-and-numbness-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `partnership-shinkyu-biyou.astro` | WebPage, FAQPage / Service | 画像URL修正、参照先WebSite・鍼灸院ノード・パンくず追加 |
| `partnership-shinkyu.astro` | WebPage, FAQPage / HealthAndBeautyBusiness, LocalBusiness | availableLanguage・audience等修正、参照先医院ノード・パンくず追加 |
| `pediatric-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `q_and_a.astro` | WebPage, FAQPage | 共通項目の見直し。FAQの主旨は本文と整合 |
| `reserve.astro` | WebPage | 共通項目の見直し |
| `school-refusal-adolescent-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `skin-problem-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `sleep-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `time.astro` | WebPage | 共通項目の見直し |
| `weather-related-illness-outpatient-clinic.astro` | MedicalWebPage | 共通項目の見直し |
| `zesshin-lab.astro` | WebPage, FAQPage / Course | 共通項目の見直し。講座料金・曜日・時間・主催者は本文と一致 |
