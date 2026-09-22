/* Expanded life routes. Regional and numeric differences are fictional game balance. */
(function(root){
'use strict';
const D=root.LifeData;
D.EDITION='2.0';
D.ORIGINS={easy:{name:'イージー',desc:'資金・相談相手に余裕。進学や再挑戦を支えやすい。',background:'supported'},medium:{name:'ミディアム',desc:'時間と家計をやりくりしながら道をつくる。',background:'standard'},hard:{name:'ハード',desc:'家計の余裕は小さめ。支援と学び方の工夫が大切。',background:'independent'},draw:{name:'親ガチャ',desc:'資金・関わり方・期待の強さを別々に抽選。結果は開始時に公開。'}};
const names='北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県'.split(' ');
const hubs=['埼玉県','千葉県','東京都','神奈川県','愛知県','京都府','大阪府','兵庫県','福岡県'];
const science=['北海道','宮城県','茨城県','富山県','石川県','福井県','長野県','滋賀県','京都府','広島県','熊本県'];
const tech=['栃木県','群馬県','神奈川県','岐阜県','静岡県','愛知県','三重県','大阪府','山口県'];
D.PREFECTURES=names.map((name,i)=>({id:String(i+1).padStart(2,'0'),name,metro:hubs.includes(name),cost:name==='東京都'?1.12:name==='神奈川県'||name==='大阪府'?1.05:hubs.includes(name)?1:.94,opportunity:name==='東京都'?1.12:hubs.includes(name)?1.06:1,specialty:science.includes(name)?'science':tech.includes(name)?'tech':['沖縄県','長崎県','福岡県','兵庫県','千葉県'].includes(name)?'english':['新潟県','岡山県','奈良県','香川県','徳島県'].includes(name)?'arts':'community',travel:['北海道','沖縄県'].includes(name)?20:hubs.includes(name)?8:12}));
D.SUBJECTS={japanese:'国語',mathI:'数学Ⅰ・A',mathII:'数学Ⅱ・B・C',englishR:'英語リーディング',englishL:'英語リスニング',physics:'物理',chemistry:'化学',biology:'生物',history:'歴史',geography:'地理',civics:'公民',information:'情報'};
D.CURRICULA={balanced:{name:'基礎を広く',weights:[2,2,0,2,1,1,1,0,1,1,0,1]},humanities:{name:'文系受験',weights:[3,1,0,3,1,0,0,0,2,1,1,0]},sciences:{name:'理系受験',weights:[1,2,2,2,1,2,1,0,0,0,0,1]},medicine:{name:'医歯薬・生命科学',weights:[1,2,2,2,1,0,2,2,0,0,0,0]},social:{name:'社会・情報を深める',weights:[1,1,0,2,1,0,0,0,1,2,2,2]},cpa:{name:'高校生から会計士',weights:[1,3,0,1,1,0,0,0,0,0,3,3],focus:'business'},custom:{name:'自分で12枠を配分',weights:[1,1,1,1,1,1,1,1,1,1,1,1]}};
D.CAMPUS={campus:{name:'学校へ通う',desc:'授業と同級生との関係を育てる。',fee:0,learning:1,stress:1,social:1},home:{name:'通学をやめ、自宅で学ぶ',desc:'通学の負担を減らす。学習計画と外のつながりが必要。',fee:0,learning:.62,stress:-2,social:-1},support:{name:'校内外の支援教室',desc:'支援者と、自分のペースを組み直す。',fee:0,learning:.9,stress:-3,social:.5},free:{name:'フリースクール',desc:'別の居場所で学ぶ。年間18万円のゲーム設定。',fee:18,learning:.95,stress:-2,social:1}};
D.SCHOOL_ROUTES=[
{id:'middle_public',name:'地域の公立中学校',stage:'middle',age:11,need:0,fee:0,annual:0,desc:'地域の友人と進学。学力による選抜なし。'},
{id:'middle_private',name:'私立中学校を受験',stage:'middle',age:11,need:37,fee:3,annual:42,desc:'中学受験。国語・算数が中心。通学や学費と交換に学びの環境が広がる。'},
{id:'middle_advanced',name:'公立中高一貫を受検',stage:'middle',age:11,need:45,fee:1,annual:3,desc:'適性検査と説明する力。中学段階の学習が高校への準備にもつながる。'},
{id:'high_public',name:'公立高校・普通科',stage:'high',age:14,need:30,fee:1,annual:8,desc:'5教科を広く準備する。卒業後は大学・仕事・資格の道へ。'},
{id:'high_advanced',name:'進学を重視する高校',stage:'high',age:14,need:63,fee:3,annual:30,desc:'受験への環境は整うが、期待と勉強の負担も増える。'},
{id:'high_private',name:'私立高校・普通科',stage:'high',age:14,need:42,fee:3,annual:42,desc:'学費と教育環境を比べて選ぶ。奨学支援は別途利用。'},
{id:'high_technical',name:'工業・商業系高校',stage:'high',age:14,need:26,fee:1,annual:8,desc:'技術と会計を学ぶ。就職にも大学進学にも挑戦できる。'},
{id:'high_evening',name:'定時制高校',stage:'high',age:14,need:0,fee:1,annual:6,desc:'仕事や生活と合わせて4年間。年齢の上限は設けない。'},
{id:'high_remote',name:'通信制高校',stage:'high',age:14,need:0,fee:1,annual:12,desc:'自分の場所で学ぶ。3年の履修を積む。中退後の再入学にも。'},
{id:'kosen',name:'高等専門学校・工学系',stage:'kosen',age:14,need:55,fee:2,annual:24,desc:'5年一貫の実験とものづくり。卒業後は技術職や大学編入へ。'}
];
D.JOBS.push(
{id:'influencer',name:'インフルエンサー・配信者',sector:'media',base:220,skill:'arts',need:42,minAge:18,desc:'視聴者の信頼と継続する制作が収益の土台。炎上や広告案件の選び方も物語に。'},
{id:'host',name:'ホスト・接客の専門職',sector:'hospitality',base:340,skill:'language',need:42,minAge:20,desc:'会話・境界線・常連との信頼。夜の勤務と健康の両立。飲酒は必須ではない。'},
{id:'founder',name:'自分の会社を経営',sector:'entrepreneur',base:180,skill:'business',need:40,minAge:18,selfEmployed:true,desc:'小さく起業。顧客・試作品・運転資金を育てる。会社設立費用20万円。'},
{id:'broker_employee',name:'証券会社の企画・管理',sector:'finance',base:490,skill:'business',need:75,minAge:18,desc:'金融知識と手続きの正確さ。顧客との長い信頼が実務評価になる。'},
{id:'lab_support',name:'実験・研究支援技術者',sector:'research',base:340,skill:'tech',need:52,minAge:20,desc:'高専等で培った技術を実験へ。博士以外から研究を支える経路。'},
{id:'global_engineer',name:'海外チームのエンジニア',sector:'tech',base:630,skill:'tech',need:92,minAge:18,english:65,desc:'英語と技術、異文化で働いた経験。リモートにも対応。'}
);
D.REMOTE_JOBS=['office','engineer','freelance','writer','creator','researcher','professor','broker_employee','global_engineer','influencer','founder'];
D.LIFESTYLE={alcohol:[['none','飲まない',0],['social','節度を決めて楽しむ',6],['frequent','頻繁に飲む',30]],tobacco:[['none','吸わない',0],['regular','喫煙する',22],['quit','禁煙に取り組む',3]],gambling:[['none','参加しない',0],['small','公営競技を年1万円の範囲で',1],['high','公営競技に年12万円を使う',12]],workstyle:[['office','出勤中心',0],['hybrid','出勤とリモートを併用',0],['remote','リモート中心',0]],networking:[['none','業務外の付き合いは控えめ',0],['lunch','ランチ・ノンアル交流',3],['party','飲み会にも参加する',8]],care:[['routine','日々の生活を整える',0],['prevent','健診と早めの相談',4],['treatment','通院・療養を優先',8]]};
D.VENTURES=[{id:'product',name:'小さな製品・サービス',cost:20,desc:'まず顧客を探す。制作力・顧客信頼・改善の積み重ね。'},{id:'consulting',name:'会計・ITなどの相談事業',cost:12,desc:'自分の技能をサービスに。約束を守る力が継続契約につながる。'},{id:'brokerage',name:'証券会社の設立を目指す',cost:100,desc:'事業計画・資本・管理体制・登録を段階的に準備。ゲーム内で営業開始前に審査。'}];
D.EXPERIENCES=[
{id:'interview',name:'面接の練習',minAge:12,cost:0,needTime:1,skill:'interview',gain:12,desc:'学ぶ時間1コマ以上。話の整理と模擬面接。誠実さとは別に伸びる。'},
{id:'moneyclass',name:'金融・手続きの勉強',minAge:12,cost:0,needTime:1,skill:'financial',gain:15,desc:'口座開設や家計の用語を学ぶ。分からないままの申請を減らす。'},
{id:'digital',name:'書類・デジタル手続きを練習',minAge:10,cost:0,needTime:1,skill:'digital',gain:15,desc:'本人確認・入力・確認の習慣。得意不得意を固定しない。'},
{id:'mentor',name:'先輩や支援者に相談',minAge:8,cost:0,needTime:1,skill:'resilience',gain:9,desc:'人との時間1コマ以上。手順を整理し、次の一歩を考える。'},
{id:'club',name:'部活・コンテストに挑戦',minAge:10,cost:2,needTime:1,skill:'selfKnowledge',gain:8,desc:'創作1コマ以上。表現・ものづくりと仲間への理解。'},
{id:'local',name:'生まれた地域の活動に参加',minAge:8,cost:0,needTime:1,skill:'empathy',gain:8,desc:'人との時間1コマ以上。地域の特色を知り、つながりを育てる。'},
{id:'abroad_short',name:'短期の海外経験',minAge:15,cost:95,needTime:1,skill:'selfKnowledge',gain:10,desc:'英語と異文化への適応。初めての経験が次の物語をひらく。'},
{id:'exchange',name:'1年間の留学',minAge:15,cost:180,needTime:2,skill:'selfKnowledge',gain:16,desc:'在学課程は今年の進級を休止。年末に帰国し、英語と経験を持ち帰る。'},
{id:'overseas_work',name:'海外で働く一年',minAge:18,cost:75,needTime:2,skill:'selfKnowledge',gain:14,desc:'英語45以上・在学中は休学が必要。現職を休み、新しい職場で経験する。'},
{id:'counsel',name:'相談して生活を立て直す',minAge:6,cost:0,needTime:1,skill:'resilience',gain:12,desc:'休息1コマ以上。気持ちを言葉にし、支援と休養を組み合わせる。'}
];
D.SOURCES.push(
{title:'文部科学省 大学入学資格',url:'https://www.mext.go.jp/a_menu/koutou/shikaku/07111314.htm',note:'高専3年修了、高卒認定などの入学資格。年度単位で18歳からの入学として集約。'},
{title:'文部科学省 高等専門学校の制度',url:'https://www.mext.go.jp/a_menu/koutou/kousen/index.htm',note:'本科5年、卒業後の大学編入・専攻科。ゲームでは工学系の代表課程。'},
{title:'文部科学省 不登校支援について',url:'https://www.mext.go.jp/content/20231120-mxt_jidou02-000032767_01.pdf',note:'小中学校を退学扱いにせず、多様な学び・相談先への経路として実装。'},
{title:'政府広報 成年年齢と20歳の制限',url:'https://www.gov-online.go.jp/article/201808/entry-7947.html',note:'飲酒・喫煙・公営競技はゲームでも20歳以上。'},
{title:'金融庁 第一種金融商品取引業の監督指針',url:'https://www.fsa.go.jp/common/law/guide/kinyushohin/04b.html',note:'金融事業は知識や資金だけで自動開業しない。登録・管理体制を架空の審査へ集約。'}
);
D.ARCS={};
function arc(id,name,stages){D.ARCS[id]={name,ids:[]};stages.forEach((a,i)=>{const eid='arc_'+id+'_'+i;D.ARCS[id].ids.push(eid);D.EVENTS.push({id:eid,min:0,max:100,arc:id,stage:i,title:a[0],text:a[1],choices:a[2].map(c=>({label:c[0],detail:c[1],effects:c[2]||{},inner:c[3]||{},tag:c[4]||''}))});});}
arc('offcampus','別の教室で',[
['朝、玄関で足が止まった','通わない日が続く。学校へ戻ることだけが、今すぐの答えではない。',[['安心できる支援者と話す','気持ちと学び方を整理',{stress:-9,connections:3},{resilience:8,empathy:2}],['家で小さな課題から始める','自分のペースをつくる',{language:4,discipline:4},{selfKnowledge:6}],['別の居場所を見に行く','外とのつながりを取り戻す',{happiness:5,connections:5},{resilience:5}]]],
['ノートを見せられる相手','続けた学びを、ひとりの大人が読んでくれた。「ここ、面白いね」その言葉が残る。',[['作品を一緒に発表する','自分の力を外へ',{arts:6,trust:3},{selfKnowledge:7}],['基礎を学び直す計画をつくる','次の進学につなぐ',{language:5,math:5},{academicConfidence:8}],['いまの居場所を大切にする','急がず関係を育てる',{happiness:6,connections:4},{empathy:6}]]],
['違う道で、つながった','同じ教室にいなかった時間も、消えなかった。いまなら、自分の経験を話せそうだ。',[['後輩の話を聞く','経験を誰かの支えに',{impact:15,trust:5},{empathy:8}],['進路の相談へ一歩進む','資格や再入学へ',{discipline:5},{academicConfidence:10}],['これまでを文章にする','足跡を自分の言葉で',{arts:6,happiness:5},{selfKnowledge:8}]]]
]);
arc('cpa','制服と会計の本',[
['放課後、分厚い会計の本','友達は部活の話をしている。あなたの机には、まだ読めない言葉だらけの問題集。',[['簿記から順に積み上げる','会計の基礎を固める',{business:7,discipline:3},{academicConfidence:5}],['勉強仲間を探す','長い挑戦を支える関係',{business:4,connections:6},{resilience:6}],['まず合格までの計画を引く','費用と時間を見えるようにする',{business:3},{financial:8,selfKnowledge:5}]]],
['模試の点数より、残った問い','解ける問題は増えた。でも、できない分野もはっきり見えてきた。',[['苦手な論点を解き直す','会計を深める',{business:9,stress:3},{academicConfidence:6}],['法律も並行して学ぶ','論文式の土台へ',{law:8},{selfKnowledge:4}],['休みの日をつくる','長く走れる計画へ',{health:5,stress:-10},{resilience:8}]]],
['合格の、その先の仕事','専門家の話を聞く。試験は入口で、他人のお金や説明を預かる責任が待っている。',[['監査の現場を学ぶ','試験と実務をつなぐ',{business:8,trust:3},{integrity:8}],['学業との両立を見直す','進路をひとつに絞らない',{discipline:5,happiness:3},{selfKnowledge:8}],['後輩に勉強を教える','知識を説明する練習',{language:6,impact:8},{empathy:6}]]]
]);
arc('kosen','動かなかったロボット',[
['テスト走行、まっすぐ進まない','図面どおりに組んだのに曲がってしまう。仲間も、それぞれ違う原因を疑っている。',[['測定し直す','観察と再現性',{tech:7,science:4},{integrity:4}],['仲間と設計を見直す','協働で原因を探る',{tech:5,connections:5},{empathy:6}],['まず小さい機構で試す','失敗を切り分ける',{math:6,tech:4},{resilience:6}]]],
['大会まで、あと少し','全員の意見を通すことはできない。どんな完成形を選ぼう。',[['安定して動く設計へ','確実さを優先',{tech:8,trust:4},{integrity:5}],['新しい仕組みに挑む','独創性と負担',{science:8,stress:5},{selfKnowledge:7}],['役割を整理する','チームで完成させる',{business:5,connections:6},{empathy:8}]]],
['作ったものを、どこへ届ける','企業見学と大学の研究室。実験室の外にも、いくつもの道が見える。',[['研究室の話を聞く','大学編入への視野',{science:8},{academicConfidence:8}],['企業の技術者と話す','仕事の実像を知る',{tech:8},{interview:8}],['地域の困りごとへ応用','ものづくりを生活へ',{impact:18,trust:4},{empathy:8}]]]
]);
arc('ronin','もう一度の春',[
['桜の季節、別の時間割','進学した友人から連絡が来た。今年も受験に向かう自分を、どう支えよう。',[['去年の答案から計画をつくる','失敗を準備に変える',{discipline:6},{academicConfidence:9}],['働きながら勉強する段取り','家計と時間を調整',{business:5},{financial:8}],['相談できる仲間を探す','孤立を減らす',{stress:-8,connections:5},{resilience:8}]]],
['続ける理由を、自分の言葉で','何年目かより、これから何を学びたいか。志望校の名前の奥を考える。',[['研究や授業を調べ直す','目的を具体的に',{science:5,language:5},{selfKnowledge:10}],['併願と別の学び方も考える','挑戦を続ける選択肢',{stress:-5},{resilience:8,financial:5}],['学んだことを誰かに教える','積み重ねを社会へ',{impact:10,language:6},{empathy:7}]]]
]);
arc('remote','画面の向こうの同僚',[
['通勤しない朝','移動は減った。けれど、雑談で分かっていたことが画面には映らない。',[['文章で進捗を共有する','仕事の見通しを伝える',{language:5,trust:3},{workReputation:7}],['短い相談の時間をつくる','距離があっても関係を育てる',{connections:6},{empathy:6}],['集中時間を先に決める','境目のない仕事を整える',{stress:-6},{selfKnowledge:7}]]],
['研究室にいない日の実験','データ解析は家でできる。でも装置の調整は現場の仲間が支えている。',[['現場と解析の役割を分ける','研究にも協働が必要',{science:6,trust:4},{empathy:7}],['出勤日を合わせて話す','言葉にならない知識を交換',{connections:6,tech:4},{workReputation:5}],['手順とデータを公開する','再現性のある研究へ',{impact:12,science:5},{integrity:8}]]],
['離れて働く、続けて働く','いつでも返事をする人ではなく、約束を守る人でいたい。',[['連絡する時間の境界を決める','疲れをためない',{health:5,stress:-7},{selfKnowledge:8}],['後輩の相談窓口になる','距離を越えた支え',{impact:10,connections:5},{empathy:8}],['成果を読みやすく残す','見えにくい仕事を共有',{language:6,trust:5},{workReputation:8}]]]
]);
arc('influencer','見てくれる人がいる',[
['初めての常連コメント','再生数より先に、毎回見に来る名前を覚えた。',[['役立つ内容を丁寧に作る','少しずつ信用を育てる',{arts:7,trust:3},{audienceQuality:10}],['流行の企画を試す','届く範囲を広げる',{arts:5},{reach:12}],['視聴者の話を聞く','関係の濃さを育てる',{connections:6},{empathy:6,audienceQuality:7}]]],
['条件のいい広告案件','報酬は魅力的。でも自分で確かめていない商品の言葉を、そのまま読んでいいだろうか。',[['調べてから引き受ける','費用と手間をかけて検証',{cash:12,stress:3},{integrity:8,audienceQuality:8}],['条件を優先してすぐ投稿','短期収入と後の信頼を交換',{cash:30,trust:-5},{integrity:-12,audienceQuality:-9},'hype'],['今回は見送る','境界線を伝える',{trust:4},{integrity:6}]]],
['昨日の投稿が、広がっている','注目は増えた。過去に選んだ言葉も、新しい視聴者に読まれている。',[['誤りを確認して訂正する','長く見てもらえる関係へ',{trust:7,language:5},{integrity:7,audienceQuality:8}],['制作のチームをつくる','ひとりで抱え込まない',{cash:-15,connections:6},{workReputation:8}],['少し休んで方向を考える','数字以外の軸を戻す',{stress:-12},{selfKnowledge:10}]]]
]);
arc('host','名前を覚える仕事',[
['初めての常連客','盛り上げるだけでなく、安心して話せる場所を求めている人もいる。',[['相手の話を丁寧に聞く','会話と信頼',{language:7,trust:4},{empathy:9}],['営業の伝え方を練習する','接客の技術',{business:6},{interview:10}],['自分の勤務と休みを守る','長く働く土台',{health:6,stress:-4},{selfKnowledge:7}]]],
['売上目標の圧力','高い目標を前に、無理な支払いを勧める声がある。店の方針と自分の境界が問われる。',[['予算を尊重して断る','短期の売上より継続する信用',{trust:6,cash:-5},{integrity:10,empathy:5}],['強く売り込む','今の収入、後に残る不信',{cash:20,trust:-10},{integrity:-15,workReputation:-8},'pressure'],['店や働き方を見直す','ほかの接客への道も',{stress:-7,connections:3},{selfKnowledge:10}]]],
['仕事の外で残ったもの','接客で身についた言葉、常連との信頼、疲れた体。次の働き方を考え始めた。',[['新人を育てる','経験をチームへ',{impact:12,trust:5},{empathy:8}],['健全な運営を学ぶ','起業にもつながる経験',{business:9},{integrity:6}],['暮らしの時間を取り戻す','健康と人との時間',{health:7,happiness:5},{selfKnowledge:8}]]]
]);
arc('founder','最初の顧客',[
['買ってもらえない試作品','自分には便利でも、使う人の困りごとは少し違っていた。',[['利用者に聞き直す','改善の方向が見える',{business:8,connections:3},{empathy:7}],['小さな仕様で作り直す','支出を絞って試す',{tech:6},{resilience:8}],['伝え方を変える','売る言葉を磨く',{language:6},{interview:7}]]],
['売上と、口座の残高','注文は来る。でも入金より先に支払いがある。成長にも現金が必要だ。',[['入出金の予定を整える','資金繰りの理解',{business:8},{financial:12}],['範囲を絞って確実に納める','信用を積む',{trust:6},{integrity:8}],['一気に広告を出す','費用を負担して認知を広げる',{cash:-35,connections:7},{reach:8}]]],
['一緒に働きたい、と言われた','ひとりの仕事が、誰かの生活を支える仕事に変わっていく。',[['働く条件を丁寧に決める','チームの土台',{business:6,trust:6},{integrity:8,empathy:6}],['仕組みを先に整える','無理を人で埋めない',{tech:7},{workReputation:8}],['小さい規模を保つ','自由と成長を選び直す',{happiness:6,stress:-7},{selfKnowledge:9}]]]
]);
arc('research','問いを、手放さない',[
['再現しない実験','一度だけきれいに出た結果。発表を急ぐ気持ちと、確かめたい気持ちがぶつかる。',[['条件を記録して再実験','再現性を積む',{science:8},{integrity:9}],['他の研究者に相談','異なる視点を借りる',{science:5,connections:6},{empathy:6}],['都合のよい結果だけを使う','短期の進捗と研究への信用',{progress:12,trust:-6},{integrity:-16},'research_shortcut']]],
['研究費の申請書','研究を続けるには、価値を専門外の人にも説明する必要がある。',[['社会とのつながりを説明','伝える技術',{language:7,impact:10},{interview:7}],['共同研究を提案','チームの知識をつなぐ',{connections:7,science:5},{workReputation:8}],['小規模な実験を積む','限られた予算で問いを進める',{science:8},{resilience:8}]]],
['若い研究者の質問','昔の自分なら聞けなかったことを、後輩が聞いている。',[['分からないことも一緒に調べる','誠実な研究室へ',{science:6,impact:14},{integrity:8,empathy:8}],['研究ノートを共有','知識を再利用できる形へ',{tech:6,impact:12},{workReputation:9}],['自分の時間も守る','研究を続ける余裕',{stress:-10},{selfKnowledge:8}]]]
]);
arc('abroad','知らない言葉の街で',[
['注文ひとつ、うまく伝わらない','教科書で覚えた英語と、目の前の会話は違う。小さな失敗から暮らしが始まる。',[['もう一度、言い直す','ことばを使う勇気',{english:8},{resilience:7}],['現地の友人に教わる','暮らしを一緒に知る',{english:5,connections:7},{empathy:8}],['気づいた違いを記録','観察から理解へ',{language:5},{selfKnowledge:10}]]],
['当たり前が、ひとつではない','話し方も、授業も、働き方も違う。合わせることと、自分をなくすことは同じだろうか。',[['違いを質問してみる','背景まで理解する',{english:7},{empathy:9}],['自分の考えを伝える練習','発表と面接にもつながる',{language:5},{interview:10}],['休む場所を確保する','慣れない暮らしの回復',{health:5,stress:-8},{resilience:7}]]],
['帰ってきた街、変わった視点','同じ景色が少し違って見える。海外で得たものを、どこへつなげよう。',[['海外チームの仕事を調べる','仕事の選択肢へ',{tech:5,business:5},{interview:8}],['地域の人と経験を分かち合う','違いをつなぐ役割',{impact:16,connections:5},{empathy:8}],['次の学びに活かす','語学と専門を組み合わせる',{english:8,science:4},{academicConfidence:8}]]]
]);
arc('finance','口座をひらく、その前に',[
['同意欄の前で止まった','意味の分からない言葉が並ぶ。分からないのは能力の結論ではなく、まだ学んでいない手順だった。',[['用語をひとつずつ調べる','理解して判断する',{business:4},{financial:15}],['入力と本人確認を練習する','手続きの準備',{tech:4},{digital:15}],['相談して一緒に確認','支えを借りる',{connections:3},{financial:8,digital:8}]]],
['下がった数字を見た夜','値動きが気になって何度も画面を開く。日々の生活費と、運用してよいお金の線を引き直す。',[['生活費を別に確保する','損失を追わない',{stress:-6},{financial:10,lossChasing:-10}],['長い計画を見直す','自分が耐えられる幅を知る',{discipline:5},{selfKnowledge:8}],['しばらく新規投資を休む','判断の余裕を戻す',{happiness:4},{resilience:7}]]]
]);
arc('brokerage','信用を預かる会社へ',[
['会社名より先に、管理体制','金融事業の計画には、商品を売る人だけでなく、止める役割を持つ人も必要だった。',[['管理と法令の知識を学ぶ','審査の準備',{law:9,business:5},{integrity:8}],['経験者とチームをつくる','必要な人材を揃える',{cash:-25,connections:8},{workReputation:10}],['資本計画を見直す','余裕資金と継続費用',{business:7},{financial:12}]]],
['登録前の確認事項','顧客保護、書類、運営の仕組み。資金があるだけでは、営業を始められない。',[['不備をひとつずつ直す','時間をかけて通る道',{law:8},{digital:10,integrity:8}],['事業の範囲を絞る','無理なく管理できる規模',{business:8},{selfKnowledge:8}],['顧客説明を練習','売る前に理解を支える',{language:7},{empathy:9}]]],
['最初に守る約束','利益を急ぐ案件と、顧客に説明できる案件。その違いを判断するのは会社の文化だった。',[['説明できる商品だけ扱う','長期の信頼',{trust:8},{integrity:10}],['管理担当の意見を聞く','止める仕組みを機能させる',{trust:6,law:5},{empathy:8}],['短期収益を優先する','利益と後の信用リスク',{cash:80,trust:-12},{integrity:-18},'pressure']]]
]);
arc('crisis','今日はひとりで抱えない',[
['何も選べないように感じる日','疲れと不安が重なり、明日のことが見えなくなった。今は大きな決断を急がず、今日を支える方法を選ぼう。',[['信頼できる相手に今の状態を話す','ひとりで抱えない',{stress:-18,connections:4},{resilience:12}],['専門家や相談先につながる','支援を使って負担を分ける',{health:8,stress:-15},{resilience:12}],['予定を減らして安全に休む','休むことから立て直す',{health:10,stress:-12},{selfKnowledge:8}]]],
['少しだけ、先の予定','すべてが解決したわけではない。それでも、一緒に考える相手と、小さな予定ができた。',[['できたことをひとつ書く','回復を急がない',{happiness:7},{resilience:8}],['続けられる支援を相談','支えの仕組みを残す',{stress:-10},{selfKnowledge:8}],['短い散歩を誰かと','暮らしの時間を取り戻す',{health:5,connections:4},{empathy:6}]]]
]);
arc('habit','楽しみとの距離',[
['気分転換のはずだった','飲む量、吸う回数、使う金額。昨日と同じつもりでも、少しずつ増えている気がする。',[['今の量と費用を記録する','変化に気づく',{business:4},{selfKnowledge:10,lossChasing:-8}],['支援者に相談する','減らす方法を一緒に考える',{stress:-7},{resilience:8},'habit_help'],['予定と予算の上限を決める','後から足さない習慣',{discipline:5},{financial:8,lossChasing:-8}]]],
['誘われた日の返事','断ると関係がなくなるだろうか。伝えてみると、別の楽しみを提案してくれる人もいた。',[['飲まない交流に誘う','関係と健康を両方守る',{connections:6,health:5},{selfKnowledge:7}],['一緒に別の趣味を始める','楽しみの選択肢を増やす',{arts:6,happiness:5},{resilience:7}],['自分のペースを説明する','境界線を言葉にする',{language:5,trust:4},{interview:6}]]]
]);
arc('illness','体から届いた便り',[
['いつもの疲れと、違う','体調の変化を自覚した。検査と相談で、生活をどう変えるかが少し具体的になった。',[['通院の予定を生活の中心に置く','治療と休養を優先',{health:8,stress:-5},{resilience:6},'treat'],['職場や学校に調整を相談','負担を一人で背負わない',{connections:3,stress:-8},{selfKnowledge:7},'treat'],['家計と支援を一緒に確認','生活を続ける計画',{business:4},{financial:8},'treat']]],
['体調に合わせた、一日の形','できなくなったことだけでなく、続けられることも探している。',[['無理のない働き方へ','回復と収入の折り合い',{health:6,stress:-7},{selfKnowledge:8},'treat'],['大切な人との時間を確保','一緒に過ごす意味',{happiness:7,connections:5},{empathy:7}],['経験を記録して残す','小さな発見を誰かへ',{impact:10,language:5},{resilience:7}]]]
]);
// The former fixed high-school event could overwrite a technical-school or dropout choice.
const old=D.EVENTS.find(e=>e.id==='highschoolchoice');if(old){old.title='学び方を、見直してみる';old.text='今の学び方は、自分の暮らしに合っているだろうか。進路タブでいつでも選び直せる。';old.choices=[{label:'目標までの計画を整理する',detail:'学ぶ理由を確かめる',effects:{discipline:5}},{label:'友人や先生に相談する',detail:'支えを増やす',effects:{connections:5,stress:-3}},{label:'別の学び方も調べる',detail:'通信・定時制・高認の道も',effects:{language:4,happiness:3}}];}
})(typeof window!=='undefined'?window:globalThis);
