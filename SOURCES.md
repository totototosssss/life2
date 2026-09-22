# 出典とデータの範囲

対象：人生ノート 4.0。確認日：2026年9月22日。大学・基本資格の既存データは9月21日取得。公開された事実と、ゲームの数式・省略した制度を区別しています。

## 参照した公式ページ

- [文部科学省 学校コード（2026年5月暫定版）](https://www.mext.go.jp/b_menu/toukei/mext_01087.html)：大学名・設置区分・所在都道府県。廃止コードを除外。
- [文部科学省 令和7年度 全国大学一覧](https://www.mext.go.jp/a_menu/koutou/ichiran/mext_00050.html)：学部・学科・修業年限・夜間定員を抽出。入学定員ゼロの行を除外。
- [英検 準2級プラス](https://www.eiken.or.jp/eiken/2025newgrade/index.html)：2025年度導入の準2級プラスを含む級構成。
- [日本漢字能力検定協会](https://www.kanken.or.jp/kanken/outline/degree/)：10級から1級までの級構成。
- [日本数学検定協会 検定概要](https://www.su-gaku.net/suken/examination/)：実用数学技能検定の級構成。
- [金融庁 公認会計士試験Q&A](https://www.fsa.go.jp/cpaaob/kouninkaikeishi-shiken/qanda/index.html)：年齢・学歴による受験制限なし。短答・論文の段階を実装。
- [金融庁 公認会計士の資格取得Q&A](https://www.fsa.go.jp/ordinary/kouninkaikeisi/index.html)：試験合格、3年以上の業務補助等、実務補習・登録を区別。
- [不動産適正取引推進機構 宅建登録](https://www.retio.or.jp/exam/entry_flow/)：試験合格と登録を区別。2年の実務または登録実務講習。
- [法務省 司法試験予備試験Q&A](https://www.moj.go.jp/jinji/shihoushiken/jinji07_00210.html)：予備試験から司法試験への経路。
- [法務省 司法試験Q&A](https://www.moj.go.jp/jinji/shihoushiken/shiken_shinshihou_shikenqa)：予備試験・法科大学院ルートと受験期間。ゲームでは法科大学院修了後の経路を採用。
- [最高裁判所 司法修習](https://www.courts.go.jp/saikosai/sihokensyujo/sihosyusyu/index.html)：司法試験合格後の修習と修了を区別。
- [GitHub Pages 公開設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)：静的ファイルをリポジトリのルートから公開。
- [Super kawaiii / Newtone](https://store.line.me/stickershop/product/21342240/en)：キャラクター画像 © Newtone。公式ゲームではありません。
- [文部科学省 大学入学資格](https://www.mext.go.jp/a_menu/koutou/shikaku/07111314.htm)：高専3年修了、高卒認定などの入学資格。年度単位で18歳からの入学として集約。
- [文部科学省 高等専門学校の制度](https://www.mext.go.jp/a_menu/koutou/kousen/index.htm)：本科5年、卒業後の大学編入・専攻科。ゲームでは工学系の代表課程。
- [文部科学省 不登校支援について](https://www.mext.go.jp/content/20231120-mxt_jidou02-000032767_01.pdf)：小中学校を退学扱いにせず、多様な学び・相談先への経路として実装。
- [政府広報 成年年齢と20歳の制限](https://www.gov-online.go.jp/article/201808/entry-7947.html)：飲酒・喫煙・公営競技はゲームでも20歳以上。
- [金融庁 第一種金融商品取引業の監督指針](https://www.fsa.go.jp/common/law/guide/kinyushohin/04b.html)：金融事業は知識や資金だけで自動開業しない。登録・管理体制を架空の審査へ集約。

## 大学カタログの作り方

2026年5月1日時点の学校コード暫定版から、大学区分に属し廃止コードがない825校を抽出しました。国立85・公立104・私立636校です。この数は新入生募集を行う学校数と同じではありません。

[取得した学校コードCSV](https://www.mext.go.jp/content/20260825-mxt_chousa01-000011635_6.csv) と2025年度全国大学一覧のExcelを学校コードで結合し、学部・学科等の定員のある行を取り込みました。短期大学のファイルは除外。重複を除いた学部・学科等の選択肢は5,240件で、778校に入学先があります。

学科名のセルに複数の課程がまとめられている場合もあるため、5,240は厳密な個別学科数ではありません。学部のない大学院大学、新設校、募集終了校、資料の対応行がない学校など47校は検索対象のみにしています。現在の募集を自動追跡する仕組みはありません。

学問分野は名称からゲーム用の分類へ対応付けています。4.0では以下の公開ボーダーを学部・学科・方式に対応付けました。学費、能力から点数への換算、合格確率はゲーム設定です。夜間・通信は資料の夜間定員や放送大学の扱いを基にした代表モデルで、各大学に任意の通信課程があるとは扱いません。

### 入学先データを付けず掲載している47校

- 政策研究大学院大学
- 総合研究大学院大学
- 北陸先端科学技術大学院大学
- 奈良先端科学技術大学院大学
- 東北公益文科大学
- 東京都立産業技術大学院大学
- 情報科学芸術大学院大学
- 静岡社会健康医学大学院大学
- 大阪市立大学
- 大阪府立大学
- 教育テック大学院大学
- 上野学園大学
- ルーテル学院大学
- 国際仏教学大学院大学
- 学習院女子大学
- 大学院大学至善館
- 東京通信大学
- 恵泉女学園大学
- ＬＥＣ東京リーガルマインド大学院大学
- ビジネス・ブレークスルー大学
- グロービス経営大学院大学
- 文化ファッション大学院大学
- 大原大学院大学
- ハリウッド大学院大学
- ＳＢＩ大学院大学
- 事業構想大学院大学
- 社会構想大学院大学
- 東京経営大学
- 星槎大学
- 八洲学園大学
- 情報セキュリティ大学院大学
- ＺＥＮ大学
- 国際大学
- 開志創造⼤学
- 高岡法科大学
- 桐朋学園大学院大学
- コー・イノベーション大学
- 光産業創成大学院大学
- 京都情報大学院大学
- 大阪医療大学
- 神戸海星女子学院大学
- 神戸情報大学院大学
- サイバー大学
- 福岡国際音楽大学
- 西日本看護医療大学
- 武雄アジア大学
- 沖縄科学技術大学院大学

## 現実の数値ではないもの

都道府県の費用・機会、家庭の傾向、収入、税・社会保険・年金、債務支援、合格・採用確率、投資のリターン、病気・治療・寿命、幸福の評価、金融事業の審査はゲーム独自のモデルです。法律・医療・投資や進学の手続き案内としては利用できません。

会計士などの資格は試験と登録を分けていますが、申請書類、実際の日程、免除要件、研修内容のすべては再現していません。留学・海外就労のビザや国別制度、高専・高校の個別校一覧も含みません。

## キャラクター

Super kawaiii（© Newtone）の16表情をユーザー指定の素材として使用しています。作者とLINEの公式ゲームではありません。画像の著作権・利用条件は作者・配布元に帰属し、ゲームコードとは別です。公開・再配布は素材の許諾・利用条件に従ってください。

取得元の個別URLは asset_sources.json に記録しています。画像の外部ホットリンクを使わず、ゲーム中の通信先を増やさない形で同梱しました。年齢別に新たな画像を描き足したものではありません。

## 3.0で追加した学校・社会生活

[文部科学省「いじめの問題に対する施策」](https://www.mext.go.jp/a_menu/shotou/seitoshidou/1302904.htm) を参照しました（2026年9月22日確認）。安全の確保、相談、組織での支援という考え方を物語に反映しています。被害に遭うことを人格の減点にしない扱いと、同調・加害後の行動変化はゲーム設計です。

給付奨学金、失職、介護、詐欺、災害などの追加場面の金額・効果・発生条件はすべて架空の年次モデルです。実在の制度の申請条件や個別の法的な結論を示すものではありません。


## 4.0の入試ボーダー

[河合塾 Kei-Net「入試難易予想ランキング表」](https://www.keinet.ne.jp/exam/ranking/) の2027年度「方式別ランク」、2026年9月7日公表の国公立7分野・私立7分野の計14PDFを参照しました。ここでいうボーダーは合格可能性50%の目安です。偏差値・共通テスト得点率と本作の合格予測を同じ数値として扱いません。

22,280行を753大学へ結び付け、元PDFの識別子とページ番号を各行に保持しています。`admission-data.js` が数値スナップショット、`coverage.json` が対応件数です。資料URLは `https://www.keinet.ne.jp/exam/ranking/2027/h_dai_k01.pdf` から `h_dai_k07.pdf`、私立は `h_dai_s01.pdf` から `h_dai_s07.pdf`。原本PDFは配布していません。

この件数は学科数ではなく、日程・科目型などを含む行数です。科目型の「1科目」等も保持しますが、全募集要項の詳細科目・配点・出願資格を網羅したデータではありません。正確に照合できた方式、同じ学部内の参考値、未収録のゲーム設定を画面で区別します。募集開始・停止を自動追跡しません。対応できなかった153行の名称は、YIC学院・いわて富士・ノートル清心女・新潟科学・札幌芸術・東京純心看護・武庫川・活水・開智です。別大学へ推測で付け替えていません。

### 科目と出願順序

- [慶應義塾大学 経済学部 2027年度一般選抜の変更](https://www.keio.ac.jp/files/b1aeda5e13c81c000aee968d50795dcf3c4cdb7ca8701378aa904b907f44cffd)：A方式の英語・数学、B方式の英語・歴史を区別。歴史は日本史・世界史を一つの能力へ集約しています。
- [早稲田大学 政治経済学部 2027年度入試変更](https://www.waseda.jp/fpse/pse/assets/uploads/2025/02/900a838a51c30f1230c5d42bbf2e7270.pdf)：共通テストの国語・数学ⅠA・英語と選択科目を反映。総合問題の独自形式は国語・英語の能力へ集約しています。
- 他の科目構成は分野、公開された科目数、プレイヤーが選んだ理科・社会を用いる代表モデルです。全大学の正式な入試科目・配点を調査し終えたものではありません。国公立の前期・中期・後期と私立を併願できますが、実際の試験日衝突・入学金納付期限・地域枠等は集約しています。

### 海外大学

[MIT](https://mitadmissions.org/apply/firstyear/international/)、[Stanford](https://admission.stanford.edu/apply//international/index.html)、[Caltech](https://www.admissions.caltech.edu/apply/first-year-applicants/international-applicants)、[Oxford](https://www.ox.ac.uk/admissions/undergraduate/international-students)、[Cambridge](https://www.undergraduate.study.cam.ac.uk/international-students)、[Toronto](https://future.utoronto.ca/applying)、[NUS](https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/admission-requirements)、[UCL](https://www.ucl.ac.uk/study/prospective-students/undergraduate) の公式入学案内を参照しました。

8大学の代表分野を選択できます。難度・費用・英語力・活動実績の評価は独自モデルです。海外大学に日本の公表偏差値があるような表示はしません。資格換算、標準化試験、書類、奨学金、国籍・既卒資格・ビザの個別条件は完全再現していません。

## 4.0の生活・技能

- [茨城県警・2026年4月の受験年齢変更](https://www.pref.ibaraki.jp/kenkei/a03_license/exam/documents/shiryo20260401.pdf)：普通免許の受験年齢17歳6か月と交付18歳を区別。
- [手稲自動車学校・教習時間の説明](https://keishin-g.com/teine/column_20260613_9233.html)：AT車の学科26・技能31時限を段階的な蓄積へ対応。学科試験、仮免許、路上教習、交付を期間単位へ集約し、9か月の教習期限等の全手続きを再現するものではありません。
- [数学検定1級の範囲](https://www.su-gaku.net/suken/examination/summary/1q/)：大学程度の解析・線形代数など。基礎数学、数Ⅲ、大学数学を独立して評価します。
- [文部科学省・高校の卒業要件](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo1/002/gijiroku/04040902/003.htm)、[高等学校卒業程度認定試験](https://www.mext.go.jp/a_menu/koutou/shiken/index.htm)：ゲームでは各校の単位認定を出席・学習・進級の年次判定へ集約。高認は高校卒業歴と別に記録します。
- [AtCoder・レーティング](https://info.atcoder.jp/overview/contest/rating)：色区分を参照。計算式は独自です。LIFE CODE WORLD FINALは架空の大会で、AtCoderの招待や実在の世界大会出場を保証するものではありません。
- 商品名の参照例：[Nintendo Switch 2 / マリオカート ワールド](https://www.nintendo.com/jp/games/switch2/aaaaa/index.html)、[CASIO EX-word XD-SX4920](https://www.casio.com/jp/exword/product.XD-SX4920BK/)、[Yamaha P-145](https://jp.yamaha.com/products/musical_instruments/pianos/p_series/p-145/index.html)。購入額、維持費、能力効果、売却額はゲーム内価格です。現実の最新実売価格ではありません。

## 航空事故とイベント確率

[IATA 2025年航空安全報告（2026年3月公表）](https://www.iata.org/en/pressroom/2026-releases/2026-03-09-01/) の5年平均として、全事故率1.27件／100万便、致命的事故は約560万便に1件、fatality risk 0.12／100万便を参照しました。

fatality riskは集計指標で、旅行者一人の死亡確率ではありません。ゲームでは1往復を2便として、1便につき0.12／100万を死亡イベント、残りを非致命的事故へ当てる近似を採用しています。航空会社、地域、機材、搭乗人数を推計した個人リスクではありません。単独の旅行頻度の設定に適用し、留学テーマ等の全移動と連動するものではありません。珍しい事件を見せる目的で倍率を引き上げていません。

病気・寿命・対人イベント・飲酒喫煙の影響など、すべての出来事に実測確率があるわけではありません。これらはゲーム用モデルです。好調なプレイヤーへ追加の不運を割り当てる調整は設けていません。

## 配布データ

配布ZIPの全ファイルは同じ階層です。外部ライブラリやAPI接続は不要です。データを更新する場合は元資料の年度・対応範囲・表示区分も更新してください。PDFやExcelの取得・抽出用の開発スクリプトと元資料は配布ZIPに含めていません。
