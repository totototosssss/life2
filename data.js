/* 人生ノート: published entrance borders are attributed separately; simulation balance is fictional. */
(function(root){
'use strict';
const SKILLS={language:'国語・漢字',math:'数学',english:'英語',science:'科学',tech:'IT・技術',business:'会計・経営',law:'法律',arts:'創作',sports:'運動'};
const FIELDS={
 humanities:{name:'人文・語学',skill:'language',second:'english',years:4,base:48},social:{name:'社会・総合',skill:'language',second:'business',years:4,base:45},
 business:{name:'経済・経営',skill:'business',second:'math',years:4,base:50},law:{name:'法学',skill:'law',second:'language',years:4,base:55},
 tech:{name:'工学・情報',skill:'tech',second:'math',years:4,base:54},science:{name:'理学・農学',skill:'science',second:'math',years:4,base:54},
 medicine:{name:'医学',skill:'science',second:'math',years:6,base:95},dentistry:{name:'歯学',skill:'science',second:'tech',years:6,base:65},
 veterinary:{name:'獣医学',skill:'science',second:'math',years:6,base:80},pharmacy:{name:'薬学',skill:'science',second:'math',years:6,base:63},
 nursing:{name:'看護',skill:'science',second:'language',years:4,base:50},healthcare:{name:'保健・福祉',skill:'science',second:'language',years:4,base:47},
 education:{name:'教育',skill:'language',second:'math',years:4,base:48},arts:{name:'芸術',skill:'arts',second:'language',years:4,base:50},sports:{name:'体育',skill:'sports',second:'language',years:4,base:45}
};
const ACTIVITIES=[
{id:'study',name:'学ぶ',baby:'ことば・数あそび',icon:'book',desc:'学力・資格の準備',babyDesc:'好奇心と学びの土台'},
{id:'work',name:'仕事に力を注ぐ',baby:'やってみる',icon:'briefcase',desc:'収入・実務経験',babyDesc:'手を動かして試す'},
{id:'health',name:'体を整える',baby:'からだを動かす',icon:'heart',desc:'健康・ストレス回復',babyDesc:'健康と運動の基礎'},
{id:'social',name:'人と過ごす',baby:'いっしょにあそぶ',icon:'users',desc:'絆・人望・つながり',babyDesc:'安心感と人との関わり'},
{id:'creative',name:'好きなことを磨く',baby:'つくる・感じる',icon:'sparkles',desc:'創作・研究・挑戦',babyDesc:'表現とひらめき'},
{id:'rest',name:'ゆっくり休む',baby:'よく眠る',icon:'moon',desc:'幸福・疲れの回復',babyDesc:'成長に大切な休息'}
];
const BACKGROUNDS={standard:{name:'ふつうの暮らし',desc:'支援と挑戦のバランス',cash:12,support:25,college:65,learning:1},supported:{name:'ゆとりのある家',desc:'教育の選択肢が広い',cash:50,support:70,college:150,learning:1.03},independent:{name:'工夫する暮らし',desc:'限られた予算で道を開く',cash:3,support:9,college:18,learning:1}};
const TRAITS={curious:{name:'好奇心',desc:'学ぶ・研究が少し得意',study:1.1,creative:1.03},warm:{name:'思いやり',desc:'絆と人望が育ちやすい',social:1.2,study:1},steady:{name:'こつこつ',desc:'実務と積み重ねに強い',work:1.12,study:1.02},expressive:{name:'表現力',desc:'創作と発信が得意',creative:1.18,study:1}};
const SOURCES=[
{title:'河合塾 Kei-Net 入試難易予想ランキング表（2027年度）',url:'https://www.keinet.ne.jp/exam/ranking/',note:'2026年9月7日公表の方式別ボーダー。14資料・753校・22,280行。合格率50%の目安であり、ゲーム内の判定率とは別。'},
{title:'早稲田大学 政治経済学部 2027年度入試の変更',url:'https://www.waseda.jp/fpse/pse/assets/uploads/2025/02/900a838a51c30f1230c5d42bbf2e7270.pdf',note:'共通テストの必須科目と選択科目を参照。独自の総合問題は国語・英語の能力に集約。'},
{title:'慶應義塾大学 経済学部 2027年度一般選抜の変更',url:'https://www.keio.ac.jp/files/b1aeda5e13c81c000aee968d50795dcf3c4cdb7ca8701378aa904b907f44cffd',note:'A方式の英語・数学、B方式の英語・歴史を区別。日本史・世界史は歴史能力へ集約。'},
{title:'IATA 2025年航空安全報告',url:'https://www.iata.org/en/pressroom/2026-releases/2026-03-09-01/',note:'5年平均の事故率等を参照。個人の死亡確率を示す資料ではなく、ゲームでは近似値として使用。'},
{title:'茨城県警 2026年4月からの受験年齢変更',url:'https://www.pref.ibaraki.jp/kenkei/a03_license/exam/documents/shiryo20260401.pdf',note:'普通免許の受験年齢17歳6か月、免許交付18歳を区別。教習時間・手続きは期間モデルへ集約。'},
{title:'AtCoder レーティングのしくみ',url:'https://info.atcoder.jp/overview/contest/rating',note:'レーティングの色区分を参照。算出式と世界大会は本作独自で、実在大会の招待条件ではありません。'},
{title:'日本数学検定協会 数学検定1級',url:'https://www.su-gaku.net/suken/examination/summary/1q/',note:'大学程度の解析・線形代数等を参照。数Ⅰ・Aだけでは合格できない能力判定。'},
{title:'文部科学省 学校コード（2026年5月暫定版）',url:'https://www.mext.go.jp/b_menu/toukei/mext_01087.html',note:'大学名・設置区分・所在都道府県。廃止コードを除外。'},
{title:'文部科学省 令和7年度 全国大学一覧',url:'https://www.mext.go.jp/a_menu/koutou/ichiran/mext_00050.html',note:'学部・学科・修業年限・夜間定員を抽出。入学定員ゼロの行を除外。'},
{title:'英検 準2級プラス',url:'https://www.eiken.or.jp/eiken/2025newgrade/index.html',note:'2025年度導入の準2級プラスを含む級構成。'},
{title:'日本漢字能力検定協会',url:'https://www.kanken.or.jp/kanken/outline/degree/',note:'10級から1級までの級構成。'},
{title:'日本数学検定協会 検定概要',url:'https://www.su-gaku.net/suken/examination/',note:'実用数学技能検定の級構成。'},
{title:'金融庁 公認会計士試験Q&A',url:'https://www.fsa.go.jp/cpaaob/kouninkaikeishi-shiken/qanda/index.html',note:'年齢・学歴による受験制限なし。短答・論文の段階を実装。'},
{title:'金融庁 公認会計士の資格取得Q&A',url:'https://www.fsa.go.jp/ordinary/kouninkaikeisi/index.html',note:'試験合格、3年以上の業務補助等、実務補習・登録を区別。'},
{title:'不動産適正取引推進機構 宅建登録',url:'https://www.retio.or.jp/exam/entry_flow/',note:'試験合格と登録を区別。2年の実務または登録実務講習。'},
{title:'法務省 司法試験予備試験Q&A',url:'https://www.moj.go.jp/jinji/shihoushiken/jinji07_00210.html',note:'予備試験から司法試験への経路。'},
{title:'法務省 司法試験Q&A',url:'https://www.moj.go.jp/jinji/shihoushiken/shiken_shinshihou_shikenqa',note:'予備試験・法科大学院ルートと受験期間。ゲームでは法科大学院修了後の経路を採用。'},
{title:'最高裁判所 司法修習',url:'https://www.courts.go.jp/saikosai/sihokensyujo/sihosyusyu/index.html',note:'司法試験合格後の修習と修了を区別。'},
{title:'GitHub Pages 公開設定',url:'https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site',note:'静的ファイルをリポジトリのルートから公開。'},
{title:'Super kawaiii / Newtone',url:'https://store.line.me/stickershop/product/21342240/en',note:'キャラクター画像 © Newtone。公式ゲームではありません。'}
];
const EXAMS=[];
function grades(prefix,category,levels,skill,thresholds,fees){levels.forEach((level,i)=>EXAMS.push({id:prefix+i,name:category+' '+level,category,skill,threshold:thresholds[i],fee:fees?fees[i]:.3+i*.08,minAge:0,note:'下位級の合格は必須ではありません。表示の合格率・費用はゲーム設定。',impact:Math.max(1,i-2),rank:i}));}
grades('eiken','英検',['5級','4級','3級','準2級','準2級プラス','2級','準1級','1級'],'english',[15,25,39,55,64,76,110,150],[.41,.47,.69,.79,.87,.91,1.05,1.25]);
grades('kanken','漢検',['10級','9級','8級','7級','6級','5級','4級','3級','準2級','2級','準1級','1級'],'language',[7,12,18,24,30,36,44,54,65,80,126,167]);
grades('suken','数検',['11級','10級','9級','8級','7級','6級','5級','4級','3級','準2級','2級','準1級','1級'],'math',[6,10,15,21,28,36,45,56,68,82,100,128,166]);
EXAMS.push(
{id:'boki3',name:'日商簿記 3級',category:'会計・不動産',skill:'business',threshold:30,fee:.33,impact:2},
{id:'boki2',name:'日商簿記 2級',category:'会計・不動産',skill:'business',threshold:62,fee:.55,impact:4},
{id:'boki1',name:'日商簿記 1級',category:'会計・不動産',skill:'business',threshold:109,fee:.88,impact:8},
{id:'fp3',name:'FP技能検定 3級',category:'会計・不動産',skill:'business',threshold:36,fee:.8,impact:2},
{id:'fp2',name:'FP技能検定 2級',category:'会計・不動産',skill:'business',threshold:67,fee:1.2,requires:'fp3',note:'ゲームでは3級合格からの受検ルートを採用。',impact:5},
{id:'cpa_short',name:'公認会計士 短答式',category:'会計・不動産',skill:'business',threshold:114,second:'law',fee:1.95,impact:8,note:'受験に年齢・学歴制限なし。次に論文式へ。短答免除期間は年単位で2年に集約。'},
{id:'cpa',name:'公認会計士 論文式',category:'会計・不動産',skill:'business',threshold:138,second:'law',fee:1.95,requires:'cpa_short',impact:14,note:'短答合格後。職業としての公認会計士登録には業務補助3年と実務補習・修了考査が必要。'},
{id:'takken',name:'宅地建物取引士試験',category:'会計・不動産',skill:'law',threshold:65,fee:.82,impact:5,note:'試験合格後、実務経験2年または登録実務講習を経て登録。'},
{id:'it_passport',name:'ITパスポート',category:'IT・技術',skill:'tech',threshold:28,fee:.75,impact:2},
{id:'fe',name:'基本情報技術者',category:'IT・技術',skill:'tech',threshold:63,fee:.75,impact:5},
{id:'ap',name:'応用情報技術者',category:'IT・技術',skill:'tech',threshold:100,fee:.75,impact:8},
{id:'security',name:'情報処理安全確保支援士試験',category:'IT・技術',skill:'tech',threshold:133,fee:.75,impact:11,note:'ここでは試験合格を記録。登録資格の自動付与はしません。'},
{id:'gyosei',name:'行政書士試験',category:'法律',skill:'law',threshold:90,fee:1.04,impact:7},
{id:'shoshi',name:'司法書士試験',category:'法律',skill:'law',threshold:145,fee:.8,impact:12,note:'試験合格を記録。司法試験とは別資格。'},
{id:'prebar',name:'司法試験予備試験',category:'法律',skill:'law',threshold:143,second:'language',fee:1.75,impact:13,note:'年齢・学歴制限なし。短答・論文・口述を年間の一連の試験として集約。'},
{id:'bar',name:'司法試験',category:'法律',skill:'law',threshold:158,second:'language',fee:2.8,impact:18,note:'予備試験合格または法科大学院修了後、5年の受験期間を年単位で実装。合格後に司法修習へ。'},
{id:'medicine',name:'医師国家試験',category:'医療・教育',skill:'science',threshold:125,second:'language',fee:1.53,degree:'medicine',impact:16,note:'医学科6年を修了した経路を実装。合格後、初期臨床研修2年。'},
{id:'dentist',name:'歯科医師国家試験',category:'医療・教育',skill:'science',threshold:115,fee:1.89,degree:'dentistry',impact:12,note:'歯学6年修了。ゲームでは合格後1年の臨床研修。'},
{id:'pharmacist',name:'薬剤師国家試験',category:'医療・教育',skill:'science',threshold:114,fee:.68,degree:'pharmacy',sixYears:true,impact:11,note:'6年制薬学課程の修了が必要。4年制薬科学課程では受験できません。'},
{id:'nurse',name:'看護師国家試験',category:'医療・教育',skill:'science',threshold:88,fee:.54,degree:'nursing',impact:10,note:'ゲームでは看護系大学修了の経路を採用。'},
{id:'driver',name:'普通自動車免許',category:'生活・学び直し',skill:'tech',threshold:24,fee:30,minAge:18,impact:1,note:'教習と試験をまとめたゲーム内費用。'},
{id:'highschool',name:'高等学校卒業程度認定',category:'生活・学び直し',skill:'language',threshold:41,second:'math',fee:.85,minAge:16,impact:4,note:'16歳から受検。大学入学は18歳以上で扱います。高認は高校卒業の学歴とは別です。'}
);
const JOBS=[
{id:'parttime',name:'アルバイト',sector:'service',base:160,skill:'language',need:0,minAge:16,desc:'時間の自由度が高い。進学準備や学び直しと両立。'},
{id:'office',name:'事務・総合職',sector:'office',base:330,skill:'business',need:28,minAge:18,desc:'着実な昇給。AIの使い方が生産性を左右する。'},
{id:'sales',name:'営業・企画',sector:'sales',base:350,skill:'business',need:35,minAge:18,desc:'人望とつながりが収入に結びつく。'},
{id:'engineer',name:'ソフトウェアエンジニア',sector:'tech',base:440,skill:'tech',need:66,minAge:18,desc:'学歴より実力。技術とAIの検証力が大切。'},
{id:'data',name:'データ・AI研究開発',sector:'tech',base:560,skill:'tech',need:110,minAge:20,degree:true,desc:'数理と情報の専門性を生かす。'},
{id:'technician',name:'製造・技術職',sector:'craft',base:350,skill:'tech',need:38,minAge:18,desc:'経験を積むと熟練技術者への道が開く。'},
{id:'researcher',name:'研究者',sector:'research',base:450,skill:'science',need:88,minAge:22,master:true,desc:'修士以上。研究時間と資金を成果につなげる。'},
{id:'professor',name:'大学教員',sector:'research',base:650,skill:'science',need:128,minAge:26,phd:true,impact:60,desc:'博士号と研究実績が必要。教育にも貢献。'},
{id:'audit',name:'監査法人・業務補助',sector:'audit',base:510,skill:'business',need:92,minAge:18,cert:'cpa',desc:'業務補助を積み、公認会計士登録を目指す。'},
{id:'cpa_job',name:'公認会計士',sector:'audit',base:740,skill:'business',need:110,minAge:21,license:'cpa',desc:'登録済み。監査や財務支援で信頼を積む。'},
{id:'legal_trainee',name:'司法修習生',sector:'legal',base:190,skill:'law',need:100,minAge:18,cert:'bar',desc:'1年の修習と修了試験を経て法曹資格へ。'},
{id:'lawyer',name:'弁護士',sector:'legal',base:740,skill:'law',need:125,minAge:19,license:'lawyer',desc:'人望が案件に影響。公益活動も選べる。'},
{id:'resident',name:'初期臨床研修医',sector:'medical',base:440,skill:'science',need:90,minAge:24,cert:'medicine',desc:'2年の研修で臨床経験を積む。'},
{id:'doctor',name:'医師',sector:'medical',base:930,skill:'science',need:110,minAge:26,license:'doctor',desc:'収入は高いが負担も大きい。休息を確保。'},
{id:'dentist_trainee',name:'歯科臨床研修',sector:'dental',base:290,skill:'science',need:80,minAge:24,cert:'dentist',desc:'1年の臨床研修を行う。'},
{id:'dentist_job',name:'歯科医師',sector:'dental',base:620,skill:'science',need:95,minAge:25,license:'dentist',desc:'技術と患者との信頼を育てる。'},
{id:'pharmacist_job',name:'薬剤師',sector:'medical',base:520,skill:'science',need:85,minAge:24,cert:'pharmacist',desc:'医薬品の専門性で地域を支える。'},
{id:'nurse_job',name:'看護師',sector:'care',base:420,skill:'science',need:66,minAge:22,cert:'nurse',desc:'社会への貢献と身体のケアを両立。'},
{id:'realestate',name:'不動産営業',sector:'estate',base:370,skill:'business',need:38,minAge:18,desc:'宅建登録で専門手当。景気の影響がある。'},
{id:'teacher',name:'学校教員',sector:'education',base:430,skill:'language',need:65,minAge:22,license:'teacher',desc:'教育課程と採用選考を経て子どもたちを支える。'},
{id:'public',name:'自治体職員',sector:'public',base:390,skill:'language',need:61,minAge:18,desc:'採用選考はゲーム内の学力・人望で判定。'},
{id:'creator',name:'デザイナー・クリエイター',sector:'creative',base:330,skill:'arts',need:65,minAge:18,desc:'実績で収入が伸びる。変動は大きめ。'},
{id:'writer',name:'作家・編集',sector:'creative',base:310,skill:'language',need:82,minAge:18,desc:'創作活動の成果が仕事にも還元される。'},
{id:'chef',name:'料理人',sector:'craft',base:300,skill:'arts',need:32,minAge:18,desc:'修業と経験を重ねて独立も目指せる。'},
{id:'farmer',name:'農業・地域事業',sector:'rural',base:310,skill:'science',need:38,minAge:18,desc:'地方では生活費を抑えやすい。天候の影響も。'},
{id:'nonprofit',name:'NPO・社会事業',sector:'social',base:290,skill:'language',need:38,minAge:18,desc:'地域と人のための仕事。貢献が積み重なる。'},
{id:'athlete',name:'プロスポーツ',sector:'sports',base:380,skill:'sports',need:108,minAge:18,desc:'高い身体能力と成果が必要。健康による変動が大きい。'},
{id:'freelance',name:'フリーランス',sector:'freelance',base:320,skill:'tech',need:52,minAge:18,desc:'働く量を調整できる。収入と時間を自分で設計。'}
];
const ITEMS=[
{id:'books',name:'小さな本棚',kind:'learning',price:2,upkeep:0,minAge:0,study:.05,life:14,desc:'絵本から参考書まで。学習効率 +5%。',icon:'book'},
{id:'blocks',name:'積み木と知育セット',kind:'learning',price:1.5,minAge:0,maxAge:7,study:.06,life:7,desc:'幼い時期の学び +6%。成長すると卒業。',icon:'puzzle'},
{id:'instrument',name:'楽器',kind:'creative',price:8,upkeep:1,creative:.12,life:15,desc:'創作の成長 +12%。手入れに年1万円。',icon:'music'},
{id:'bike',name:'自転車',kind:'health',price:5,upkeep:.5,minAge:6,health:1.3,life:10,desc:'健康 +1.3/年。維持費は少なめ。',icon:'activity'},
{id:'laptop',name:'学習用パソコン',kind:'learning',price:13,upkeep:0,minAge:8,study:.08,work:.04,life:6,desc:'学習 +8%、仕事 +4%。6年で買い替え。',icon:'laptop'},
{id:'desk',name:'集中できる机と椅子',kind:'learning',price:9,minAge:6,study:.06,stress:-.5,life:18,desc:'学習 +6%。体への負担も小さくなる。',icon:'book'},
{id:'workstation',name:'高性能ワークステーション',kind:'work',price:42,upkeep:1,minAge:16,work:.14,creative:.1,life:6,desc:'仕事 +14%、創作 +10%。高価で買い替えも必要。',icon:'monitor'},
{id:'camera',name:'カメラ',kind:'creative',price:16,upkeep:1,creative:.1,minAge:12,life:10,desc:'創作 +10%。写真のある思い出が増える。',icon:'camera'},
{id:'sportsgear',name:'運動用品',kind:'health',price:4,upkeep:1,health:1.8,life:6,desc:'健康 +1.8/年。運動を日常に。',icon:'activity'},
{id:'bed',name:'よく眠れる寝具',kind:'health',price:12,upkeep:0,health:1.5,stress:-2,life:12,desc:'健康 +1.5、ストレス −2/年。',icon:'moon'},
{id:'console',name:'ゲーム機',kind:'hobby',price:6,upkeep:1.5,happy:2,stress:-1,minAge:6,life:8,desc:'幸福 +2/年。ソフトなどに年1.5万円。',icon:'gamepad'},
{id:'librarypass',name:'図書館・読書習慣',kind:'subscription',price:0,upkeep:0,study:.03,life:100,desc:'無料。学習効率 +3%。地域の本を大切に。',icon:'book'},
{id:'gym',name:'ジム会員',kind:'subscription',price:1,upkeep:8.4,health:3,minAge:18,life:100,desc:'健康 +3/年。年会費8.4万円。いつでも解約。',icon:'activity'},
{id:'tutor',name:'塾・個別指導',kind:'subscription',price:3,upkeep:36,study:.2,minAge:6,maxAge:25,life:100,desc:'学習 +20%。年間36万円の継続費用。',icon:'graduation'},
{id:'professional',name:'資格予備校',kind:'subscription',price:5,upkeep:42,exam:.17,minAge:15,life:100,desc:'試験準備 +17%。自習時間の確保も必要。',icon:'award'},
{id:'cleaner',name:'家事代行',kind:'subscription',price:1,upkeep:24,stress:-4,minAge:18,life:100,desc:'ストレス −4/年。時間をお金で支える。',icon:'home'},
{id:'pet',name:'小さな家族との暮らし',kind:'care',price:5,upkeep:12,happy:3,stress:-1,minAge:18,life:14,desc:'幸福 +3/年。14年間の世話と費用を引き受ける。',icon:'heart'},
{id:'car',name:'実用的な車',kind:'transport',price:170,upkeep:28,happy:1,minAge:18,cert:'driver',life:13,desc:'地方では仕事収入 +6%。維持費・減価がある。',icon:'car'},
{id:'luxurycar',name:'憧れの車',kind:'transport',price:900,upkeep:70,happy:4,minAge:18,cert:'driver',life:15,desc:'幸福 +4/年。資産形成とは大きなトレードオフ。',icon:'car'},
{id:'trip',name:'旅に出る',kind:'experience',price:18,happy:8,stress:-12,connections:3,repeat:true,desc:'今年1回。思い出と視野を広げる。',icon:'plane'},
{id:'abroad',name:'短期留学',kind:'experience',price:95,minAge:15,skill:'english',gain:12,connections:6,repeat:true,desc:'英語 +12、人脈 +6。費用は95万円。',icon:'globe'},
{id:'checkup',name:'健康診断と生活改善',kind:'experience',price:4,minAge:18,health:8,repeat:true,desc:'今年1回。健康 +8。忙しい年の立て直しに。',icon:'heart'},
{id:'donation',name:'地域・研究への寄付',kind:'experience',price:30,impact:12,trust:2,repeat:true,desc:'今年1回。社会への貢献 +12、人望 +2。',icon:'gift'}
];
const PROJECTS=[
{id:'none',name:'今は決めない',icon:'moon',cost:0,skill:'arts',need:0,desc:'好きなことを自由に。創作力と幸福が育つ。'},
{id:'research',name:'科学・発明',icon:'flask',cost:12,skill:'science',need:40,desc:'論文 → 特許 → 大発明。研究職や博士課程で進みやすい。',milestones:[45,120,250,430]},
{id:'startup',name:'小さな事業を育てる',icon:'rocket',cost:20,skill:'business',need:38,desc:'試作品 → 顧客獲得 → 成長。赤字や事業縮小の可能性も。',milestones:[35,90,180,320]},
{id:'creative',name:'作品を世に出す',icon:'palette',cost:5,skill:'arts',need:25,desc:'発表 → 受賞 → 代表作。作品の収益と文化への貢献。',milestones:[30,80,160,290]},
{id:'community',name:'地域と次の世代',icon:'users',cost:3,skill:'language',need:15,desc:'小さな活動から地域の仕組みへ。人と社会に残す仕事。',milestones:[30,75,145,250]},
{id:'sports',name:'競技に挑む',icon:'trophy',cost:8,skill:'sports',need:35,desc:'地方大会 → 全国 → 世界。健康と練習の両立が重要。',milestones:[35,90,180,320]}
];
const ECONOMIES=[{id:'normal',name:'おだやかな景気',desc:'大きな追い風も向かい風もない一年。',salary:1,market:.035},
{id:'boom',name:'技術革新の追い風',desc:'新しい技術が仕事や事業の機会を広げている。',salary:1.06,market:.13},
{id:'recession',name:'景気の足踏み',desc:'企業も家計も慎重に。生活の余裕を大切に。',salary:.93,market:-.14},
{id:'recovery',name:'ゆるやかな回復',desc:'地域や企業に少しずつ活気が戻っている。',salary:1.025,market:.075},
{id:'shock',name:'市場が大きく揺れる年',desc:'収入・運用とも変動が大きい。余裕資金が支えになる。',salary:.9,market:-.27},
{id:'culture',name:'文化と交流の広がり',desc:'作品やコミュニティに新しいつながりが生まれている。',salary:1.02,market:.045}];
const EV=[];
function ev(id,min,max,title,text,choices,condition){EV.push({id,min,max,title,text,choices:choices.map(c=>({label:c[0],detail:c[1],effects:c[2]})),condition});}
ev('hello',0,0,'はじめまして、世界。','小さな手が、あなたの指をぎゅっと握った。どんな一年にしよう。',[
['たくさん声をかける','安心感とことばの土台',{happiness:5,trust:2,language:3}],['よく眠れる環境を整える','成長を支える休息',{health:5,stress:-5}],['音や色にふれてみる','感性と好奇心',{arts:3,science:2}]]);
ev('firstwords',1,2,'はじめての「できた」','何度も失敗したあと、小さな成功。大人の反応をじっと見ている。',[
['一緒に喜ぶ','自己肯定感が育つ',{happiness:5,trust:2}],['次の遊びを用意','学びを広げる',{math:3,arts:2,cash:-1}],['好きなだけ繰り返す','集中する楽しさ',{discipline:3,language:2}]]);
ev('park',1,5,'公園で出会った友だち','同じ遊具が気になる子がいる。少し近づいてみようか。',[
['一緒に遊んでみる','人とのやりとりを覚える',{connections:5,happiness:3}],['順番を待つ','思いやりが育つ',{trust:4,discipline:2}],['自分の遊びを見つける','自由な発想を大切に',{arts:4,happiness:2}]]);
ev('rain',2,7,'雨の日の大冒険','今日は外に出られない。窓の向こうの世界が、少し不思議に見える。',[
['家にあるもので工作','工夫してつくる',{arts:4,tech:2}],['雨のしくみを調べる','疑問を大切に',{science:4,language:1}],['絵本を読んでのんびり','穏やかな時間',{language:3,stress:-4}]]);
ev('lesson',3,8,'はじめての習い事','音楽、運動、数の遊び。気になることを試せる日が来た。',[
['音楽を体験','体験費用 2万円',{cash:-2,arts:5}],['スポーツを体験','体験費用 2万円',{cash:-2,sports:5,health:2}],['家で数遊び','無料でも工夫できる',{math:4,discipline:1}]]);
ev('question',3,10,'「どうして？」が止まらない','空はなぜ青いのだろう。答えを聞いても、また疑問が生まれる。',[
['一緒に調べる','科学と言葉が育つ',{science:4,language:2}],['実験して確かめる','材料費 1万円',{cash:-1,tech:4,science:3}],['物語をつくってみる','想像することも大切',{arts:5,happiness:2}]]);
ev('elementary',6,6,'ランドセルの向こう側','新しい教室、新しい名前。今日から少し広い世界で暮らす。',[
['まず友だちをつくる','安心できる居場所',{connections:7,happiness:3}],['図書室を探検する','物語への入口',{language:6}],['外で思いきり遊ぶ','体と心を育てる',{sports:5,health:3}]]);
ev('friendmistake',6,14,'友だちとけんかした','言いすぎたかもしれない。明日も同じ教室で会う。',[
['自分の言葉で謝る','勇気と信頼',{trust:5,stress:2}],['落ち着いて話を聞く','関係を修復',{connections:4,trust:3}],['いったん距離を置く','今は心を休ませる',{stress:-5,connections:-1}]]);
ev('library',7,17,'借りた本の、その先','何となく手に取った一冊が、予想以上に面白かった。',[
['関連する本も読む','言葉と集中力',{language:5,discipline:2}],['内容を人に話す','知識を共有',{connections:4,language:2}],['自分でも試す','知識を行動へ',{tech:4,science:2}]]);
ev('allowance',7,14,'おこづかいの使い道','少しずつためたお金で、欲しかったものが買えそうだ。',[
['欲しかったものを買う','費用 1万円',{cash:-1,happiness:6}],['次の目標までためる','家計を考える',{business:4,discipline:2}],['友だちと楽しむ','費用 1万円',{cash:-1,connections:4,happiness:3}]]);
ev('sciencefair',8,16,'自由研究のテーマ','提出するためだけにするか、それとも少し本気になってみるか。',[
['気になる謎を追う','時間と集中力を使う',{science:7,stress:4}],['観察を毎日続ける','積み重ねの力',{science:4,discipline:4}],['わかりやすい展示にする','伝える力',{arts:4,language:3}]]);
ev('club',10,17,'夢中になれる場所','放課後の活動で、自分の出番が見つかりそう。',[
['運動部に挑戦','練習と仲間',{sports:7,connections:2,stress:3}],['文化・科学の活動','知識と創作',{science:4,arts:4}],['自分のペースで活動','心に余白',{happiness:4,stress:-5}]]);
ev('middleschool',12,12,'少し大人の制服','できることも、比べてしまうことも増える時期。何を大切にしたい？',[
['自分の得意を伸ばす','学習の習慣',{discipline:5,math:3}],['友だちとの時間','新しい関係',{connections:7,happiness:3}],['知らない分野に触れる','視野を広げる',{science:3,arts:3,english:3}]]);
ev('internet',10,19,'画面の向こうの世界','便利なサービスや楽しそうな投稿。どう使っていこう。',[
['学びと創作に使う','道具を知る',{tech:5,arts:2}],['交流しつつ時間を決める','つながりと自律',{connections:4,discipline:3}],['しばらく画面を閉じる','休息と運動',{health:3,stress:-5}]]);
ev('highschoolchoice',15,15,'次の3年間を選ぶ','学校の形はひとつではない。学び方と生活を考えてみよう。',[
['全日制高校へ','基本の進学ルート',{highschool:'full',connections:3}],['通信制高校へ','自分のペースで学ぶ',{highschool:'remote',stress:-3}],['高校以外の道を考える','大学には高認などの準備が必要',{highschool:'none',discipline:3}]]);
ev('studycomparison',13,22,'隣の人の成績','友だちの合格報告を見て、少し焦ってしまった。',[
['自分の計画を見直す','無理なく継続',{discipline:5,stress:-3}],['しばらく勉強に集中','伸びるが負荷もある',{math:5,english:4,stress:8}],['直接勉強法を聞く','人から学ぶ',{connections:3,language:3,math:3}]]);
ev('examsetback',15,35,'うまく解けなかった模試','努力したつもりでも、苦手は残っていた。次はどうする？',[
['間違いを丁寧に分析','基礎を積み直す',{discipline:5,math:4}],['別の学び方を試す','学習の道具を知る',{tech:4,language:3}],['一度休んで気持ちを戻す','休息も計画の一部',{stress:-10,happiness:3}]]);
ev('scholarship',17,24,'学びを支える制度','給付型の支援に挑戦する機会。準備には少し手間がかかる。',[
['書類を整えて応募','支援金 18万円・準備の負荷',{cash:18,stress:5,discipline:2}],['地域の活動と両立','支援金 8万円',{cash:8,impact:3,connections:2}],['今の学習に集中','申請より自分のペース',{language:4,stress:-2}]]);
ev('turning18',18,18,'自分で選ぶ、ということ','進学も、仕事も、立ち止まる時間も。少しずつ自分の選択になる。',[
['未来のために学ぶ','学習への意思',{discipline:5,english:3}],['社会に出てみる','仕事への視点',{business:5,connections:3}],['いろいろな人に会う','一本道ではないと知る',{connections:6,happiness:3}]]);
ev('mentor',18,55,'ひとつ先を歩く人','経験のある人が、あなたの話をじっくり聞いてくれた。',[
['率直に相談する','人脈と心の余裕',{connections:7,stress:-4}],['成果を見せて意見をもらう','仕事と学びのヒント',{business:4,tech:3}],['自分も誰かを手伝う','支え合いをつなぐ',{trust:5,impact:4}]]);
ev('friendtrip',18,45,'友人から旅の誘い','大人になると、全員の予定が合う日は少ない。',[
['一緒に行く','費用 12万円',{cash:-12,happiness:8,connections:5,stress:-6}],['日帰りで参加','費用 3万円',{cash:-3,happiness:4,connections:3}],['今回は見送る','時間を次の準備に',{discipline:3,connections:-1}]]);
ev('joboffer',20,55,'魅力的な副業の話','仕事の外でも、あなたの得意を使ってほしいという依頼。',[
['余裕のある範囲で引き受ける','収入 15万円',{cash:15,business:3,stress:5}],['大きな仕事に挑戦する','収入 35万円・負担増',{cash:35,business:5,stress:13,health:-3}],['今の生活を優先する','休息を確保',{stress:-7,happiness:2}]]);
ev('aiethics',16,70,'AIの答え、どこまで信じる？','便利な答えがすぐに出た。でも、ひとつだけ気になる根拠がある。',[
['一次資料で確かめる','技術と信頼が育つ',{tech:5,trust:3,discipline:2}],['人と一緒に確認する','時間と協力',{connections:4,tech:3}],['今回は使わず自分で解く','考える力を残す',{language:4,math:3}]]);
ev('volunteer',14,90,'近所で、できること','小さな手助けを必要としている人がいる。',[
['定期的に手伝う','社会への貢献と関係',{impact:8,trust:4,stress:3}],['得意なことだけ協力','無理のない支援',{impact:4,trust:3}],['必要な情報を届ける','小さなつながり',{impact:2,connections:3}]]);
ev('healthwarning',23,90,'少し、疲れているみたい','以前なら平気だった予定が、今日は重く感じる。',[
['予定を減らして休む','健康と回復',{health:7,stress:-13}],['専門家に相談する','費用 4万円',{cash:-4,health:10,stress:-7}],['生活の習慣を見直す','小さな改善を続ける',{health:5,discipline:3}]]);
ev('promotion',25,58,'任せたい仕事がある','少し大きな責任が回ってきた。成長の機会でもある。',[
['責任を引き受ける','評価と一時収入 22万円',{cash:22,business:5,trust:3,stress:9}],['協力して取り組む','チームの力',{connections:5,trust:4,business:2}],['今の仕事を深める','専門性を高める',{tech:5,discipline:3}]],'employed');
ev('weddinginvite',24,60,'大切な人のお祝い','友だちから、人生の節目に立ち会ってほしいと連絡が来た。',[
['足を運んで祝う','費用 5万円',{cash:-5,connections:6,happiness:4}],['心を込めた贈り物','費用 2万円',{cash:-2,connections:4,trust:2}],['手紙で気持ちを伝える','言葉を大切に',{language:2,connections:3}]]);
ev('researchdoubt',22,80,'思い通りに進まない研究','一見失敗したデータに、何かが隠れている気もする。',[
['仮説から見直す','研究の前進 +9',{progress:9,science:4,stress:4}],['共同研究者に相談','研究の前進 +5',{progress:5,connections:4,stress:-2}],['再現性を確認する','信頼できる一歩',{science:3,trust:5,progress:4}]],'research');
ev('startupoffer',20,72,'事業を広げるチャンス','注文が増えた。設備や人への投資で、次に進めるかもしれない。',[
['小さく試して広げる','投資 15万円・事業前進 +12',{cash:-15,progress:12,business:4}],['顧客の声を先に聞く','事業前進 +7',{progress:7,connections:4}],['今の品質を磨く','信頼を守る',{trust:5,business:3,progress:4}]],'startup');
ev('creativecritique',15,85,'届いた感想','初めて知らない人から、自分の作品についての言葉が届いた。',[
['次の作品に生かす','創作の前進 +8',{progress:8,arts:4}],['応援してくれた人に返事','つながりを育てる',{connections:5,happiness:4}],['自分の表現を掘り下げる','技術を深める',{arts:7,discipline:2}]],'creative');
ev('housing',25,70,'どこで暮らしていこう','街の便利さ、部屋の広さ、近くにいる人。全部は選べない。',[
['家計を見直して考える','お金の知識',{business:5,discipline:3}],['今の街の人と交流','居場所を育てる',{connections:5,happiness:4}],['小さく模様替えする','費用 5万円',{cash:-5,happiness:7,stress:-4}]]);
ev('familytime',22,85,'何でもない日の約束','同じテーブルで食事をする。ただそれだけの時間が、最近少ない。',[
['予定を空ける','絆と幸福',{bond:8,happiness:5,stress:-4}],['一緒に小さな旅行','費用 9万円',{cash:-9,bond:12,happiness:6}],['気持ちを言葉にする','丁寧に向き合う',{bond:5,trust:3}]],'partner');
ev('childquestion',24,80,'子どもの「やってみたい」','うまくできるかよりも、まず自分で試したいようだ。',[
['隣で見守る','信頼と子どもの成長',{childBond:8,care:5,happiness:4}],['道具をそろえる','費用 8万円',{cash:-8,childBond:6,care:8}],['一緒に考える','対話する時間',{childBond:9,care:5,trust:2}]],'children');
ev('parentcare',40,72,'家族の暮らしが変わる','身近な人の生活に、少し支えが必要になってきた。',[
['自分の時間を割く','関係を守る・負荷増',{trust:5,connections:3,stress:8,impact:6}],['支援サービスを使う','費用 18万円',{cash:-18,stress:-2,impact:5}],['周囲と分担を相談','協力の仕組みをつくる',{connections:5,trust:4,business:2}]]);
ev('relearn',30,80,'もう一度、学びたい','以前は選ばなかった分野が、いま気になっている。',[
['公開講座を受ける','費用 4万円',{cash:-4,science:5,language:3}],['独学で始める','自分のペースで',{tech:4,discipline:3}],['学ぶ仲間を探す','続けるためのつながり',{connections:5,english:3}]]);
ev('careerchange',28,65,'この先も、同じ働き方？','仕事に慣れたからこそ、別の可能性も見えてきた。',[
['今の専門を磨く','技術と実務',{tech:5,business:4}],['別の分野の人に会う','選択肢を広げる',{connections:7,english:2}],['暮らしの優先順位を見直す','心の余裕',{happiness:5,stress:-7}]]);
ev('marketnoise',18,90,'「必ず儲かる」という話','周囲で話題の投資。よく見ると、根拠は曖昧だった。',[
['仕組みを調べる','金融知識と判断力',{business:5,discipline:3}],['距離を置いて日常へ','落ち着いた生活',{stress:-5,happiness:2}],['友人と情報を確認','情報を共有',{connections:3,trust:3,business:2}]]);
ev('windfall',18,85,'忘れていた小さな入金','以前の仕事や払い戻しで、思いがけないお金が入った。',[
['そのまま残しておく','現金 +12万円',{cash:12}],['自分と大切な人に使う','現金 +3万円・幸福',{cash:3,happiness:6,connections:3}],['一部を役立ててもらう','現金 +6万円・貢献',{cash:6,impact:6,trust:2}]]);
ev('repair',20,95,'暮らしの道具が故障','毎日使っているものが動かなくなった。どうしよう。',[
['修理して長く使う','費用 5万円',{cash:-5,tech:4}],['使い方に合うものへ','費用 12万円',{cash:-12,happiness:5}],['しばらく工夫して暮らす','費用をかけずに対応',{tech:3,discipline:3,stress:3}]]);
ev('frienddistance',25,85,'遠くに住む友だち','すぐには会えなくても、関係は続けられるだろうか。',[
['定期的に話す約束','関係を育てる',{connections:6,happiness:3}],['会いに行く','費用 10万円',{cash:-10,connections:8,stress:-5}],['短い便りを送る','無理なくつながる',{connections:4,language:2}]]);
ev('quietpride',35,100,'前より上手になったこと','若いころは難しかったことが、今は自然にできる。',[
['誰かに教えてみる','経験を渡す',{impact:6,trust:4}],['もう少し極める','専門性を磨く',{discipline:4,tech:4}],['自分をねぎらう','積み重ねを喜ぶ',{happiness:7,stress:-5}]]);
ev('midlife',40,40,'人生の折り返し、ではなく','まだ選べることは多い。これまでの延長にも、別の方向にも。',[
['新しい目標を持つ','挑戦する気持ち',{discipline:6,happiness:4}],['大切な関係を育てる','絆を深める',{connections:7,bond:5}],['体と生活を整える','長い目で健康へ',{health:8,stress:-8}]]);
ev('youngcolleague',35,70,'若い仲間の提案','自分にはなかった視点。経験だけでは思いつかないこともある。',[
['一緒に試してみる','技術と関係',{tech:5,connections:4}],['経験から助言する','次の世代に貢献',{trust:5,impact:5}],['まず話をよく聞く','人望を育てる',{trust:5,connections:3}]]);
ev('reunion',30,80,'久しぶりの同窓会','みんな違う人生を歩いてきた。比べるより、聞きたい話がある。',[
['参加して近況を話す','費用 3万円',{cash:-3,connections:7,happiness:4}],['親しい人とだけ会う','費用 1万円',{cash:-1,connections:5,stress:-4}],['手紙で近況を伝える','静かなつながり',{connections:3,language:2}]]);
ev('meaning',45,95,'何を残したいだろう','仕事や資産だけでなく、ふとそんなことを考えた。',[
['知識を記録する','未来の誰かへ',{impact:9,language:3}],['大切な人と話す','関係を深める',{bond:6,connections:4,happiness:4}],['今まで通り丁寧に暮らす','日々を大切に',{happiness:6,trust:3}]]);
ev('retirement',65,65,'働き方を選び直す年','区切りをつける人も、続ける人もいる。自分の暮らしには何が合う？',[
['働くペースを整える','経験を生かし続ける',{stress:-6,discipline:2}],['地域や趣味に時間を使う','新しい役割',{impact:7,connections:4}],['まずゆっくり休む','心身を回復',{health:7,happiness:5,stress:-10}]]);
ev('latebeginning',60,98,'今から始める楽しみ','「この歳から」ではなく、「この歳だから」楽しめることもある。',[
['新しい表現に挑む','創作と幸福',{arts:6,happiness:4}],['仲間と学び直す','学びと交流',{language:4,connections:5}],['体を動かす趣味へ','健康を維持',{health:6,sports:3}]]);
ev('communitygarden',55,95,'近所の小さな企画','空いた場所で、みんなが集まれることをしようという話。',[
['企画の中心になる','責任と貢献',{impact:10,connections:6,stress:4}],['得意な部分だけ手伝う','無理のない役割',{impact:6,trust:4}],['参加者として楽しむ','居場所と幸福',{happiness:5,connections:4}]]);
ev('memorybox',60,100,'古い箱の中の一枚','写真や手紙を見ていると、忘れていた気持ちが戻ってきた。',[
['人生の記録をまとめる','文化と記憶を残す',{impact:7,arts:3,happiness:4}],['大切な人と眺める','絆と幸福',{bond:6,connections:3,happiness:5}],['静かに思い出す','心を休ませる',{happiness:6,stress:-8}]]);
ev('gratitude',68,100,'ありがとう、と言われた日','何気ないことだったのに、誰かの支えになっていたようだ。',[
['できる範囲で続ける','積み重なる貢献',{impact:8,trust:4}],['自分も感謝を伝える','関係を育てる',{connections:5,bond:4}],['今日の幸せを味わう','幸福と回復',{happiness:8,stress:-4}]]);
ev('pace',70,100,'ちょうどいい歩幅','速く進むだけが、前に進むことではないのかもしれない。',[
['無理のない運動を続ける','健康を守る',{health:8,stress:-4}],['気の合う人と過ごす','穏やかな幸福',{connections:5,happiness:5}],['好きなことに集中する','表現の深まり',{arts:5,happiness:4}]]);
ev('ninety',90,90,'九十年分の景色','できなかったことも、思いがけずできたことも。全部がこの一冊にある。',[
['次の世代に話をする','経験を残す',{impact:16,trust:5}],['いまそばにいる人と祝う','関係と幸福',{happiness:12,bond:8,connections:5}],['まだ新しいことを始める','人生は続いている',{arts:8,science:5,happiness:6}]]);
// Additional everyday dilemmas have wide age ranges and are selected without repeats until exhausted.
[
['deadline','締切が重なった','やりたいことが、同じ時期に集まってしまった。',['優先順位を決める','discipline',5],['協力をお願いする','connections',5],['ひとつ手放す','stress',-9]],
['goodmeal','少し丁寧な食事','いつもより時間をかけて、自分のために食事をつくる。',['料理を工夫する','arts',5],['誰かと一緒に食べる','connections',5],['栄養と睡眠を整える','health',6]],
['freeafternoon','ぽっかり空いた午後','予定がひとつなくなった。何に使おう。',['積んでいた本を開く','language',5],['散歩に出かける','health',5],['何もしない時間を楽しむ','happiness',6]],
['newneighbor','新しいご近所さん','よく顔を合わせる人が増えた。暮らしの輪が少し広がる。',['挨拶から始める','connections',5],['地域の情報を教える','trust',5],['程よい距離を保つ','stress',-5]],
['tinyfailure','小さな失敗のあとで','思った通りにはいかなかった。でも、まだ次がある。',['失敗を記録する','discipline',5],['相談して笑い合う','connections',5],['気分を切り替える','happiness',5]],
['bilingual','外国語で話す機会','言葉がつまっても、伝えたい気持ちはある。',['ゆっくり話してみる','english',6],['翻訳道具を工夫する','tech',4],['相手の話をよく聞く','connections',5]],
['publiclecture','偶然見つけた公開講座','知らない世界への入口が、近くにあった。',['科学の話を聞く','science',6],['社会の話を聞く','law',5],['芸術の話を聞く','arts',5]],
['kindness','困っている人を見かけた','大げさでなくても、できることはある。',['自分にできる手助け','trust',5],['適切な窓口を一緒に探す','impact',6],['話を聞く','connections',5]],
['organize','部屋を片づける日','ものが減ると、気持ちの中にも少し余白ができる。',['使うものを選び直す','discipline',5],['思い出を整理する','happiness',5],['環境を整えて休む','stress',-8]],
['news','気になるニュース','社会の変化は、自分の人生ともどこかでつながっている。',['数字を確かめる','math',5],['背景を調べる','law',5],['周囲の人と考える','connections',5]],
['musicday','心に残った一曲','帰り道に聞いた音楽が、ずっと頭の中で流れている。',['自分でも表現する','arts',6],['誰かと共有する','connections',5],['静かに味わう','happiness',6]],
['repairhabit','自分で直せるかな','小さな不便を、工夫で変えられるかもしれない。',['仕組みを調べる','tech',6],['人に教わる','connections',5],['使い方を見直す','business',4]],
['gratitudeletter','届いた便り','久しぶりの名前が、画面に、あるいは封筒にあった。',['丁寧に返事を書く','language',4],['近いうちに話す約束','connections',6],['嬉しさを味わう','happiness',6]],
['timeoff','頑張らない日の計画','予定を入れないことにも、少し勇気がいる。',['たっぷり眠る','health',6],['気軽な趣味を楽しむ','happiness',6],['ゆっくり歩く','stress',-9]],
['teachsomeone','教えてほしい、と頼まれた','自分には当たり前のことが、誰かには新鮮らしい。',['丁寧に説明する','impact',7],['一緒にやってみる','trust',5],['わかりやすい資料を作る','language',5]],
['unexpectedart','いつもと違う道','少し遠回りした先で、面白いものを見つけた。',['よく観察する','science',4],['記録して表現する','arts',5],['ただ楽しむ','happiness',6]],
['choicevalues','欲しいものが変わってきた','昔の自分なら選ばなかったことに、いま心が動く。',['価値観を書き出す','discipline',5],['人と話してみる','connections',5],['小さく試す','happiness',5]],
['fairness','ちょっと不公平な場面','その場をやり過ごすか、何かできるか考えるか。',['落ち着いて意見を言う','trust',6],['困っている人を支える','impact',7],['状況をよく調べる','law',5]],
['learningtool','道具の使い方を変える','同じ作業でも、工夫すれば少し楽になるかもしれない。',['手順を整理する','business',5],['新しい機能を試す','tech',5],['人のやり方を聞く','connections',4]],
['smallcelebration','何でもない日のお祝い','特別な理由がなくても、今日は少し楽しくしたい。',['大切な人と過ごす','connections',5],['自分の好きなことをする','happiness',7],['誰かをねぎらう','trust',5]]
].forEach((x,i)=>ev(x[0],i%4===0?8:18,100,x[1],x[2],x.slice(3).map(c=>[c[0],`${SKILLS[c[1]]||{health:'健康',happiness:'幸福',stress:'ストレス',connections:'つながり',discipline:'継続力',trust:'人望',impact:'貢献'}[c[1]]} ${c[2]>0?'+':''}${c[2]}`,{[c[1]]:c[2]}])));
const ACHIEVEMENTS=[
['firstyear','最初の1ページ','1歳を迎える','book'],['graduate','自分で開いた扉','大学を卒業','graduation'],['master','学びを深めて','修士号を取得','graduation'],['phd','問いを究める','博士号を取得','flask'],
['cert5','学びのコレクション','資格・検定を5つ取得','award'],['cert15','学びに終わりなし','資格・検定を15取得','award'],['million','100万円の余白','純資産100万円','wallet'],['tenmillion','1,000万円への道','純資産1,000万円','wallet'],['hundredmillion','億を築く','純資産1億円','wallet'],
['friendship','大切にされる人','人望85以上','users'],['partner','ふたりの約束','パートナーと結婚','heart'],['parent','次の世代へ','家族を迎える','heart'],['goodparent','見守った日々','子どもの絆80以上で成人','users'],
['breakthrough','世界を少し変えた','科学プロジェクト第4段階','flask'],['founder','ゼロからつくる','事業プロジェクト第3段階','rocket'],['masterpiece','誰かの心に残る','創作プロジェクト第3段階','palette'],['community','街の灯り','貢献300以上','globe'],
['comeback','何度でも始める','35歳以降に大学卒業','sparkles'],['healthy','元気な70歳','70歳以上・健康80以上','heart'],['century','百年の一冊','100歳を迎える','book'],['lawyer','法で人を支える','法曹資格を取得','scale'],['cpa','信頼の専門家','公認会計士登録','award'],['doctor','命を支える仕事','医師の初期研修修了','heart'],['balance','満ち足りた日々','幸福・健康・人望すべて80以上','sparkles']
].map(([id,name,desc,icon])=>({id,name,desc,icon}));
root.LifeData={SKILLS,FIELDS,ACTIVITIES,BACKGROUNDS,TRAITS,SOURCES,EXAMS,JOBS,ITEMS,PROJECTS,ECONOMIES,EVENTS:EV,ACHIEVEMENTS,VERSION:1};
})(typeof window!=='undefined'?window:globalThis);
