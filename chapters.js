/* People, setbacks and second chances. These are fictional yearly game models. */
(function(root){
'use strict';
const D=root.LifeData,X=root.LifeSystems,clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
D.EDITION='3.0';
D.SOCIAL_FOCUS=[
 ['steady','いつもの関係を育てる','人との時間1以上。友人との絆を少しずつ育てる。',0,1],
 ['boundaries','安心できる距離をつくる','休息1以上。無理な関係から距離を置き、負担を減らす。',0,1],
 ['support','支援者とつながる','人との時間1以上。学校・職場・地域で相談と支援を続ける。',0,1],
 ['repair','自分の言動と向き合う','人との時間2以上。相手の距離を尊重し、行動を変えていく。',0,2],
 ['caregiving','家族の支援を分担する','介護の物語の開始後。人との時間2以上・年20万円。',20,2],
 ['mentor','経験を次の人へ渡す','18歳から・人との時間2以上。後輩や地域の人を支える。',0,2]
];
D.EXPERIENCES.push(
 {id:'scholarship_plan',name:'給付奨学金の応募準備',minAge:16,cost:0,needTime:2,skill:'digital',gain:9,desc:'学ぶ2コマ。学修計画と書類を整える。給付の物語への入口。'},
 {id:'internship',name:'短期の職場体験',minAge:16,cost:2,needTime:2,skill:'workReputation',gain:8,desc:'学ぶ2コマ。現場の一日を知り、面接で話せる経験をつくる。'},
 {id:'reskill',name:'別の仕事のために学び直す',minAge:20,cost:12,needTime:2,skill:'selfKnowledge',gain:9,desc:'学ぶ2コマ。ITの基礎と面接を準備し、転職・再就職につなぐ。'},
 {id:'sideproject',name:'小さな副業を試す',minAge:18,cost:8,needTime:2,skill:'digital',gain:8,desc:'学ぶ2コマ。試作品を公開。利益は保証されず、作った経験と技術が残る。'},
 {id:'firstaid',name:'防災・応急手当を学ぶ',minAge:12,cost:1,needTime:1,skill:'resilience',gain:8,desc:'学ぶ1コマ。災害時の備えと、助けを呼ぶ手順をゲーム内で学ぶ。'},
 {id:'careplan',name:'家族の支援計画を相談する',minAge:35,cost:1,needTime:1,skill:'empathy',gain:8,desc:'学ぶ1コマ。家族の負担を一人で抱えず、使える支援を整理する。'},
 {id:'civic',name:'地域の困りごとを調べる',minAge:16,cost:0,needTime:1,skill:'empathy',gain:7,desc:'学ぶ1コマ。暮らしの課題を知り、地域の企画へつなげる。'},
 {id:'clubproject',name:'大会・発表会を企画する',minAge:12,cost:2,needTime:2,skill:'workReputation',gain:7,desc:'学ぶ2コマ。競技でも音楽でも。仲間と役割を分けて完成させる。'}
);
D.SOURCES.push({title:'文部科学省 いじめの問題に対する施策',url:'https://www.mext.go.jp/a_menu/shotou/seitoshidou/1302904.htm',note:'安心の確保、相談、学校外も含む支援を参照。物語と数値は架空のモデル。'});
const C=(label,detail,effects={},inner={},social={},tag='')=>({label,detail,effects,inner,social,tag});
const arcs={};
function arc(id,name,range,hard,stages){
 arcs[id]={min:range[0],max:range[1],hard};D.ARCS[id]={name,ids:[]};
 stages.forEach(([title,text,choices],stage)=>{const eid='arc_'+id+'_'+stage;D.ARCS[id].ids.push(eid);D.EVENTS.push({id:eid,min:0,max:100,arc:id,stage,title,text,choices,chapter:true,difficult:hard});});
}
arc('classroom','安心できる教室へ',[7,17],true,[
 ['自分だけ、声が届かない','仲間外れや、嫌だと伝えても続くからかい。あなたの人柄が原因なのではない。安心できる場所を探したい。',[
 C('信頼できる大人に相談する','一人で解決する役目を背負わない',{stress:-6},{resilience:4},{strain:12,safety:-8,support:12},'class_help'),
 C('教室から距離を置く','別室や自宅で学ぶことも選べる',{stress:-4},{selfKnowledge:5},{strain:10,safety:-5,support:5},'class_distance'),
 C('まだ話せないので、まず休む','言葉になるまで、急がなくていい',{health:3},{},{strain:18,safety:-10},'class_rest')]],
 ['次の朝を、どう迎える','問題が一度の相談で終わるとは限らない。学ぶことと、安全に過ごすことの両方を考え直す。',[
 C('支援者と具体的な予定を決める','登校だけを唯一の目標にしない',{stress:-8},{resilience:6},{safety:20,support:15,strain:-12},'class_plan'),
 C('別の学びの場所を見学する','環境を変える準備',{language:4},{selfKnowledge:6},{safety:15,belonging:8,strain:-10},'class_newplace'),
 C('安心できる友人と短い時間を過ごす','話す内容は自分で選ぶ',{happiness:5,connections:3},{},{belonging:12,strain:-8})]],
 ['前より、息がしやすい場所','すべて忘れる必要はない。今いる場所と、頼れる相手が少しずつ増えてきた。',[
 C('学びたいことから再開する','取り戻す速さを自分で決める',{language:5},{academicConfidence:8},{safety:15,strain:-12}),
 C('困っている人に支援先を伝える','自分の負担も大切にする',{impact:8},{empathy:6},{supportActs:1,belonging:10}),
 C('穏やかな時間を長く持つ','回復も人生の一部',{happiness:6,health:4},{resilience:7},{strain:-15})]]
]);
arc('bystander','その場にいた自分',[9,19],true,[
 ['笑っていいのか、分からなかった','誰かへのからかいで周りが笑っている。黙っていれば、自分は目立たずに済むかもしれない。',[
 C('安全を確かめ、支援者に知らせる','直接対立することだけが助け方ではない',{trust:4},{empathy:7},{supportActs:1,support:5},'witness_help'),
 C('その場を離れ、後から相手に声をかける','無理をせず孤立を減らす',{connections:2},{empathy:4},{supportActs:1},'witness_later'),
 C('周囲に合わせて、からかいに加わる','その場の同調と、後に残る不信',{connections:3,trust:-8},{integrity:-12,empathy:-8},{harm:24},'joined_bullying')]],
 ['あの日のことを、聞かれた','誰がどう感じたか、外からは分からなかった。自分もその場にいたという事実は残っている。',[
 C('自分がしたことを正確に話す','説明と再発防止を始める',{trust:2},{integrity:7},{harm:-6,repair:6},'witness_honest'),
 C('相手の望む距離を尊重する','話し合いを一方的に強いない',{connections:1},{empathy:6},{harm:-4,repair:4}),
 C('大したことではないと片づける','説明を避けると問題が長引く',{trust:-6},{integrity:-8},{harm:12},'witness_dismiss')]],
 ['同じ空気が、また流れた','別の場所でも、誰かを笑いものにする空気に出会った。前に考えたことを、今の行動にできるだろうか。',[
 C('加わらず、必要な支援につなぐ','一度だけでなく行動を変える',{trust:5,impact:6},{integrity:7},{harm:-8,repair:8,supportActs:1}),
 C('場を離れた相手の様子を気にかける','本人が望む範囲で関わる',{connections:4},{empathy:6},{harm:-6,repair:6}),
 C('また同調してしまう','繰り返す言動が信用に残る',{trust:-12},{integrity:-12},{harm:20})]]
]);
arc('repair','許しを急がない',[9,100],false,[
 ['「謝ったから」で終わらない','自分の言動で傷ついた人がいる。謝罪を受け取るかどうかも、会うかどうかも、相手が決めることだ。',[
 C('したことを整理し、責任を認める','言い訳より、具体的な行動へ',{stress:2},{integrity:8},{harm:-8,repair:8}),
 C('相談相手と再発防止を考える','一人の決意だけに頼らない',{connections:2},{selfKnowledge:7},{harm:-7,repair:7,support:6}),
 C('早く許してほしいと迫る','相手の負担をさらに増やす',{trust:-7},{empathy:-7},{harm:10})]],
 ['見られていない日の行動','評判を戻すためだけでなく、ふだんの振る舞いを変え続けられるだろうか。',[
 C('人の境界を守る練習を続ける','小さな行動の積み重ね',{trust:4},{empathy:8},{harm:-10,repair:10}),
 C('困ったときに相談する約束をつくる','同じ場面で別の選択をする',{trust:3},{resilience:6},{harm:-8,repair:8,support:5}),
 C('形だけ取り繕って過ごす','時間がたつだけでは変わらない',{},{integrity:-5},{harm:5})]],
 ['戻らない関係と、これからの関係','前と同じ関係になるとは限らない。それでも、これから誰かとどう関わるかは選び続けられる。',[
 C('距離を尊重して、行動を続ける','相手の許しを成果の条件にしない',{trust:5},{integrity:8},{harm:-12,repair:12}),
 C('自分の経験を、支援の学びにする','自分を正当化せず、理解を深める',{impact:8},{empathy:7},{harm:-10,repair:10,supportActs:1}),
 C('相談と振り返りを生活に残す','一度きりの反省で終わらせない',{stress:-4},{selfKnowledge:7},{harm:-10,repair:10})]]
]);
arc('club_life','放課後に作ったもの',[10,24],false,[
 ['才能が違う仲間たち','運動でも音楽でも、同じ目標に違う得意を持ち寄る。自分は何を担当しよう。',[
 C('得意な役割を引き受ける','技を磨く',{arts:6,sports:4},{selfKnowledge:5},{belonging:7}),C('苦手な役割にも挑戦する','できない時間を引き受ける',{discipline:5},{resilience:7},{belonging:5}),C('全員が参加できる段取りを考える','目立たない役割も必要',{business:4,connections:4},{empathy:7},{supportActs:1,belonging:9})]],
 ['受験前、最後の発表会','勉強の予定と発表会が重なる。どちらも大切だから、時間の使い方を話し合いたい。',[
 C('役割を絞って最後まで参加','忙しさと達成感',{stress:4,arts:7},{workReputation:4},{belonging:8}),C('事情を伝えて学業を優先','仲間に引き継ぐ',{discipline:6},{integrity:4},{belonging:2}),C('学習と練習を仲間と調整','計画を共有する',{language:4,connections:4},{interview:5},{belonging:5})]],
 ['写真に残らなかった仕事','舞台の裏で支えた人にも、完成した日の記憶がある。',[
 C('仲間の働きを言葉にする','感謝が次の関係をつくる',{trust:5},{empathy:6},{belonging:10}),C('次の世代へ記録を残す','ノウハウを渡す',{impact:10,tech:4},{},{mentored:1}),C('次は違う分野を試す','ひとつの得意で終わらない',{arts:5,happiness:4},{novelty:12},{})]]
]);
arc('friendship','連絡先の、その先',[12,80],false,[
 ['友人とは、別々の道へ','同じ時間割がなくなり、話すきっかけも減った。忙しいだけで、嫌いになったわけではない。',[
 C('短い近況を送ってみる','返事の速さを義務にしない',{connections:4},{empathy:4},{belonging:8},'friend_contact'),C('会えるときの予定をひとつ作る','時間を確保する',{happiness:4},{},{belonging:10},'friend_contact'),C('今いる場所で新しい関係を育てる','古い縁を失敗扱いにしない',{connections:5},{selfKnowledge:5},{belonging:5})]],
 ['比べたくないのに、比べてしまう','友人の進学や仕事の話を聞いた。自分の生活にも、大切にしてきたものがあるはずだ。',[
 C('自分の基準を書き直す','人の予定で自分を測らない',{stress:-6},{selfKnowledge:9},{strain:-5}),C('成功だけでなく困りごとも聞く','一面だけで判断しない',{connections:4},{empathy:7},{belonging:7}),C('少し距離を置き、落ち着いて戻る','関係を切る前に休む',{health:3},{resilience:5},{strain:-6})]],
 ['久しぶりでも、話せる人','昔と同じではなくても、今の二人だからできる話がある。',[
 C('今の相手を知り直す','昔の役割に閉じ込めない',{happiness:6,connections:5},{empathy:5},{belonging:12}),C('一緒に新しい趣味を始める','共通の時間をつくる',{arts:5,happiness:4},{novelty:10},{belonging:8}),C('会えない年にも気にかける','ゆるやかに続く関係',{trust:4},{},{belonging:8,support:5})]]
]);
arc('parttime_life','初めての働く場所',[16,30],false,[
 ['初めての給料明細','働いた時間と、手元に残る金額。お金を得ることが生活の予定に結びついてきた。',[
 C('収支を記録する','使えるお金を知る',{business:5},{financial:9},{reskill:2}),C('先輩に仕事のコツを聞く','現場で学ぶ',{connections:3},{workReputation:7},{}),C('学業と両立できる時間を決める','働きすぎを防ぐ',{stress:-5},{selfKnowledge:6},{strain:-3})]],
 ['頼まれたシフト、試験の前日','頼まれることは嬉しい。でも、引き受け続けると大切な予定が崩れてしまう。',[
 C('予定を伝え、別の日を提案する','断り方も仕事の技術',{language:4},{interview:6},{boundaries:1}),C('一度引き受け、次から上限を決める','今回の負担を次の判断へ',{cash:3,stress:5},{selfKnowledge:5},{}),C('休める体制を相談する','個人の善意だけに頼らない',{trust:3},{empathy:5},{support:6})]],
 ['新人に教える立場へ','できなかったころの自分を思い出す。教えると、自分の理解も確かになる。',[
 C('理由まで説明する','経験を言葉にする',{language:6,impact:6},{},{mentored:1}),C('手順を短いメモにする','迷わず使える形へ',{tech:5},{workReputation:6},{}),C('質問しやすい雰囲気をつくる','安心して失敗できる場所',{trust:4},{empathy:7},{supportActs:1})]]
]);
arc('scholarship_life','学びを続ける費用',[16,40],false,[
 ['行きたい場所と、払える金額','学費だけでなく住まいや生活費もある。支援の条件を調べ、無理のない計画をつくりたい。',[
 C('給付枠に応募する書類を整える','準備水準でゲーム内給付を判定',{language:3},{digital:6},{},'grant_apply'),C('働ける課程を含めて考える','時間と費用の折り合い',{business:5},{financial:7},{}),C('家族・学校の窓口と計画を確認','一人で見落としを抱えない',{stress:-4},{},{support:8})]],
 ['支援を受けた一年の記録','学ぶ環境を手に入れたあと、何に取り組むかは自分で決めていく。',[
 C('学んだことを短い報告にまとめる','目的と進捗を振り返る',{language:5},{selfKnowledge:6},{}),C('次に応募する人へ経験を伝える','手続きの壁を少し下げる',{impact:8},{empathy:5},{supportActs:1}),C('来年の費用も見直す','一度の支援だけに頼らない',{business:5},{financial:8},{})]]
]);
arc('workplace','安心して働く条件',[20,65],true,[
 ['仕事の話を越えた言葉','強い叱責や、断りにくい扱いが続いている。能力を磨くことと、傷つく扱いに耐えることは別だ。',[
 C('安全な相談先へつながる','状況を整理し、調整を考える',{stress:-4},{},{strain:10,support:12},'work_help'),C('距離と連絡の境界を決める','一人で対立を解決しようとしない',{stress:-3},{selfKnowledge:5},{strain:10,boundaries:1}),C('休む・働く場所を変える準備','収入を含めて次の選択を考える',{health:3},{resilience:5},{strain:8,reskill:6})]],
 ['調整のあとにも、仕事は続く','相談しただけで全てが変わるとは限らない。働き方の調整と、別の職場という選択を並べてみる。',[
 C('支援者と経過を確認する','一度で相談を終えない',{stress:-7},{},{strain:-12,support:10}),C('別の職種の準備を始める','経験を次に使う',{tech:5},{interview:7},{reskill:10}),C('負担の少ない仕事の範囲を相談','続けるために狭める',{health:5},{selfKnowledge:6},{strain:-10,boundaries:1})]],
 ['後輩が、言いにくそうにしている','自分が経験したからこそ、聞き方を選べる。助ける側も一人で背負わない。',[
 C('本人の希望を聞き、支援につなぐ','話を勝手に広めない',{trust:4,impact:9},{empathy:6},{supportActs:1}),C('安心して働ける仕組みを提案','個人の我慢に頼らない',{business:5,impact:8},{integrity:5},{supportActs:1}),C('相談を専門の担当者と分担','自分の余裕も守る',{stress:-4},{selfKnowledge:5},{strain:-8})]]
]);
arc('layoff','仕事が変わる年',[24,64],true,[
 ['部門の縮小が告げられた','景気や会社の判断で、同じ仕事を続けられなくなった。あなたの価値がなくなったという意味ではない。',[
 C('引継ぎを整え、再就職の準備','今年末に離職。生活費と次の応募を整理',{business:4},{workReputation:3},{reskill:6},'job_loss'),C('次の技能に集中する','今年末に離職。学び直しへ',{tech:7},{selfKnowledge:6},{reskill:10},'job_loss'),C('一度休み、支援を使って考える','今年末に離職。回復してから選ぶ',{health:5,stress:-6},{},{support:8},'job_loss')]],
 ['肩書きのない自己紹介','これまでの仕事の名前を離れ、自分ができることを言葉にしている。',[
 C('経験を具体的な成果へ言い換える','応募と面接の準備',{language:5},{interview:12},{reskill:5}),C('小さな仕事で新しい技能を使う','急に元の収入を求めない',{business:5,tech:4},{},{reskill:9}),C('生活費を見直し、期限を決めて休む','焦りを計画に変える',{stress:-8},{financial:7},{strain:-6})]],
 ['次の働き方の条件','収入、安定、時間、やりがい。同じ条件を全部満たす仕事は、簡単には見つからない。',[
 C('譲れない条件を二つに絞る','選ぶ基準をつくる',{discipline:5},{selfKnowledge:9},{}),C('人に相談して視野を広げる','知らなかった仕事を知る',{connections:5},{interview:5},{support:5}),C('小さく働きながら挑戦を続ける','一度の選択で人生を固定しない',{business:5},{resilience:7},{reskill:5})]]
]);
arc('caregiving_life','家族を支える時間',[38,75],true,[
 ['家族の日常に、助けが必要になった','通院や家事の支援が増えてきた。自分の仕事や暮らしも続いていく。',[
 C('家族と支援者で分担を考える','必要なことを一緒に整理',{stress:3},{empathy:5},{careNeed:35,support:8},'care_shared'),C('利用できる支援を相談する','一人で全てを担わない',{business:3},{digital:5},{careNeed:30,support:10},'care_shared'),C('ひとまず自分が多く引き受ける','思いはあっても負担が残る',{stress:8},{},{careNeed:48,strain:10},'care_alone')]],
 ['自分の予定が、後回しになる','支える人にも休息が必要だ。続けられる形へ、もう一度分担を見直す。',[
 C('交代できる日を具体的に決める','休める予定も先に確保',{stress:-7},{selfKnowledge:6},{careNeed:-12,strain:-8,support:6}),C('仕事の時間を調整する相談','生活費と時間を並べて考える',{language:4},{interview:5},{careNeed:-10}),C('外の支援を増やす','費用15万円と負担の軽減',{cash:-15,health:5},{},{careNeed:-20,strain:-12})]],
 ['支えることと、一緒に過ごすこと','段取りに追われる日にも、ただ一緒に話す時間がほしい。',[
 C('用事のない時間を少し持つ','役割だけではない関係',{happiness:6},{empathy:6},{careNeed:-6}),C('長く続く支援体制を整える','先の不安を分担する',{stress:-6},{},{careNeed:-15,support:8}),C('自分の学びや仕事も続ける','両方の生活を大切にする',{discipline:5},{resilience:6},{careNeed:-8,boundaries:1})]]
]);
arc('familytalk','暮らしを話し合う',[22,70],false,[
 ['忙しさの、見えない分担','家事や連絡、誰かの予定を覚えること。目に見える仕事だけが負担とは限らない。',[
 C('していることを一緒に書き出す','負担の見え方をそろえる',{trust:3},{empathy:7},{belonging:6},'family_talk'),C('今週だけでも役割を入れ替える','経験して初めて分かること',{stress:2},{selfKnowledge:5},{belonging:7},'family_talk'),C('自分の方が大変だと言い切る','話が閉じてしまう',{trust:-4},{empathy:-6},{strain:6},'family_dismiss')]],
 ['それぞれの、ほしい時間','一緒にいる時間と、一人で戻れる時間。どちらも関係を続けるために必要かもしれない。',[
 C('一人の時間も予定に入れる','自分と相手の余裕を守る',{happiness:4,stress:-5},{},{belonging:8,boundaries:1}),C('小さな約束から守っていく','説明より日々の行動',{trust:5},{integrity:5},{belonging:8}),C('第三者の助けを借りて話す','二人だけで行き詰まらない',{stress:-5},{},{support:6,belonging:6})]],
 ['前と違う、家族の形','仕事や年齢が変われば、ちょうどよい分担も変わる。一度決めた形を選び直してもいい。',[
 C('これからの希望を聞き直す','変わった考えを知る',{happiness:5},{empathy:7},{belonging:10}),C('次の半年の予定だけ決める','遠い未来を固定しない',{stress:-5},{selfKnowledge:6},{}),C('別々の時間と交流を両立する','関係の形を広げる',{connections:4},{},{belonging:8})]]
]);
arc('loss','大切な人のいない季節',[55,90],true,[
 ['もう会えない人のこと','長くお世話になった年長の知人が亡くなった。悲しみの形も、落ち着くまでの時間も、人によって違う。',[
 C('思い出を誰かと話す','言葉にしたい分だけでいい',{happiness:-4},{},{grief:18,support:6}),C('予定を少し減らして過ごす','今すぐ元気になる必要はない',{happiness:-4,health:3},{},{grief:20,strain:-3}),C('手紙や写真を静かに整理する','残されたものとの時間',{happiness:-3,arts:3},{},{grief:16})]],
 ['ふと、思い出す日','前に進むことと、忘れることは同じではない。今の暮らしの中にも、その人から受け取ったものがある。',[
 C('教わったことを誰かへ渡す','受け取ったものが続いていく',{impact:10},{empathy:6},{grief:-10,mentored:1}),C('小さな楽しみを再開する','悲しみと楽しみが同時にあってもいい',{happiness:5},{resilience:6},{grief:-10}),C('思い出す時間を自分のペースで持つ','回復の速さを比べない',{stress:-5},{selfKnowledge:5},{grief:-8})]]
]);
arc('scam','うまい話の、向こう側',[18,85],true,[
 ['急いで決めて、と言われた','知人から、条件のよすぎる副業や投資の話。今日中に返事がほしいという。',[
 C('その場では決めず、調べる','急かされる判断から距離を置く',{business:4},{financial:10},{},'scam_checked'),C('信頼できる相手に相談する','一人で確かめる限界を補う',{connections:2},{digital:7},{support:5},'scam_checked'),C('詳しく確かめず、お金を渡す','ゲーム内30万円を失う',{cash:-30,stress:8},{},{strain:8},'scam_loss')]],
 ['話の説明が、食い違っている','確認すると、聞いていた条件と違うことが分かった。知っている人からの話でも、確かめる必要がある。',[
 C('これ以上の支払いを止めて相談','失った分を急いで取り返そうとしない',{stress:-3},{financial:8},{strain:-5},'scam_stop'),C('経緯と書類を整理する','相談で伝えられる状態へ',{tech:4},{digital:8},{strain:-3}),C('周囲へ、確認できた事実だけ伝える','噂を増やさず共有する',{trust:3},{integrity:5},{supportActs:1})]],
 ['次の話を、聞く前に','分からないと立ち止まれることも、金融の力だ。',[
 C('日々の家計と投資を分け直す','暮らしを守る基準',{business:4},{financial:10},{}),C('身近な人と注意点を共有する','経験を孤立に変えない',{impact:8},{empathy:5},{supportActs:1}),C('自分に合う上限を決める','一度の失敗で可能性を閉じない',{discipline:5},{selfKnowledge:7},{strain:-6})]]
]);
arc('disaster','いつもの街を、もう一度',[18,78],true,[
 ['暮らしが、一時止まる日','災害で交通や生活が乱れた。今は安全を確かめ、できることを順番に考える。',[
 C('安全と連絡先を確保する','まず暮らしの土台から',{cash:-10,stress:5},{},{disruption:24,support:5},'disaster_safe'),C('家族や近所と必要な支援を共有','一人で動ける範囲を超えない',{cash:-10,stress:5},{empathy:4},{disruption:22,support:8},'disaster_safe'),C('予定を止め、避難先で休む','何もしない時間も必要',{cash:-8,stress:4},{},{disruption:26,strain:5})]],
 ['戻るまでの、生活の段取り','片づけ、連絡、仕事。ひとつずつ、いつもの暮らしにつなぎ直している。',[
 C('支援窓口で生活の見通しを立てる','手続きと優先順位',{business:4},{digital:6},{disruption:-14,support:5}),C('仕事や学校へ予定を相談する','元どおりを急がない',{stress:-5},{interview:4},{disruption:-12}),C('必要なものだけ買い直す','費用20万円で生活を整える',{cash:-20},{financial:4},{disruption:-20})]],
 ['普段の備えに、変わった経験','誰かに助けられた記憶が、次の準備を少し具体的にした。',[
 C('連絡と備蓄の計画を見直す','小さく続ける備え',{discipline:5},{resilience:6},{disruption:-10}),C('地域の訓練に参加する','知らなかった人と顔を合わせる',{impact:10,connections:5},{},{disruption:-8,supportActs:1}),C('体と気持ちの疲れを休める','復旧の後にも回復が必要',{health:5,stress:-8},{},{disruption:-8,strain:-8})]]
]);
arc('secondact','これからの、初めて',[50,95],false,[
 ['予定表に、空白ができた','仕事や家庭の役割が変わった。何者かである前に、やってみたいことは何だろう。',[
 C('新しい分野を学ぶ','年齢で学びを閉じない',{science:6},{academicConfidence:8},{reskill:5}),C('趣味を人と分かち合う','成果を急がない楽しみ',{arts:6,connections:4},{novelty:10},{belonging:7}),C('何もしない日を味わう','余白を持つ練習',{happiness:5,stress:-6},{selfKnowledge:7},{})]],
 ['若い人から、教わること','今までの経験を渡すだけでなく、初めて聞く考えもある。',[
 C('分からないことを質問する','立場より好奇心',{tech:6},{digital:7},{}),C('経験と新しい視点を持ち寄る','一方通行にしない',{impact:10},{empathy:7},{mentored:1}),C('一緒に小さな企画を始める','完成より会うきっかけ',{arts:5,connections:4},{novelty:8},{belonging:8})]],
 ['残したいものを、選ぶ','お金だけでも、立派な業績だけでもない。自分が大切にしたものを、どう残そう。',[
 C('暮らしの知恵を記録する','誰かが使える形へ',{language:5,impact:15},{},{mentored:1}),C('身近な人へ感謝を伝える','今伝えられる言葉',{happiness:5,trust:4},{empathy:5},{belonging:10}),C('次の小さな挑戦を決める','終わりだけを見つめない',{discipline:4},{resilience:7},{reskill:4})]]
]);

const measures=['safety','belonging','strain','support','harm','repair','careNeed','grief','disruption','reskill'];
const counts=['supportActs','mentored','boundaries','jobLosses','grants'];
function init(s){
 if(s.chaptersVersion===undefined){s.chaptersVersion=1;s.social={safety:70,belonging:40,strain:0,support:20,harm:0,repair:0,careNeed:0,grief:0,disruption:0,reskill:0,supportActs:0,mentored:0,boundaries:0,jobLosses:0,grants:0,friends:[]};}
 if(s.plan.socialFocus===undefined)s.plan.socialFocus='steady';
 if(s.settings.difficultStories===undefined)s.settings.difficultStories=true;
 return s;
}
function focusReason(s,id=s.plan.socialFocus){const f=D.SOCIAL_FOCUS.find(f=>f[0]===id);if(!f)return'関わり方を選んでください';if(s.age<6)return'6歳から選べます';if(id==='mentor'&&s.age<18)return'18歳から選べます';if(id==='caregiving'&&(!s.social.careNeed||s.age<35))return'家族の支援が必要になってから選べます';const key=id==='boundaries'?'rest':'social';if(s.plan.allocation[key]<f[4])return`${key==='rest'?'休息':'人との時間'}${f[4]}コマ以上が必要`;if(s.cash<f[3])return`現金${f[3]}万円が必要`;return'';}
function chance(s,id){let n=2166136261;for(const c of s.seed+id){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return (n>>>0)/4294967296;}
function eligible(s,id){
 const a=arcs[id],progress=s.arcs[id]?.stage||0;if(!a||progress>=D.ARCS[id].ids.length||s.age<(s.arcs[id]?.nextAge||0))return false;
 if(a.hard&&!s.settings.difficultStories)return false;
 if(progress>0)return true;if(s.age<a.min||s.age>a.max)return false;
 if(a.hard&&chance(s,id)>({classroom:.45,bystander:.7,workplace:.55,layoff:.65,caregiving_life:.8,loss:.8,scam:.65,disaster:.35}[id]??1))return false;
 const inSchool=s.age<15?s.school.attendance==='campus':s.age<18?s.highschool!=='none':!!s.education;
 switch(id){case'classroom':return inSchool&&s.social.harm<1;case'bystander':return inSchool;
 case'repair':return s.social.harm>0;case'club_life':return s.plan.allocation.creative>=2||s.experienceCounts.club>0||s.experienceCounts.clubproject>0;
 case'friendship':return s.social.friends.length>0;case'parttime_life':return s.job==='parttime'||s.experienceCounts.internship>0;
 case'scholarship_life':return s.experienceCounts.scholarship_plan>0||s.education&&s.background!=='supported'&&s.cash<200;
 case'workplace':return !!s.job&&!s.retired&&s.jobYears>=2;
 case'layoff':return !!s.job&&!s.retired&&s.job!=='parttime'&&!D.JOBS.find(j=>j.id===s.job)?.selfEmployed&&['recession','shock'].includes(s.economy)&&s.jobYears>=2;
 case'caregiving_life':return s.age>=38;case'familytalk':return !!s.partner||s.children.length>0;
 case'loss':return s.age>=55;case'scam':return s.account.open||s.venture||s.experienceCounts.sideproject>0;
 case'disaster':return s.age>=18;case'secondact':return s.age>=65||s.retired;default:return false;}
}
function chooseStory(s,rand,previous){
 if(s.age<6)return previous;
 if(previous&&['crisis','illness'].includes(previous.arc))return previous;
 const candidates=Object.keys(arcs).filter(id=>eligible(s,id));if(!candidates.length)return previous;
 if(!previous&&!candidates.some(id=>s.arcs[id]?.stage>0)&&rand(s)>.6)return null;
 let id=candidates.find(id=>id==='repair'&&s.social.harm>=20);
 if(!id){const continuing=candidates.filter(id=>(s.arcs[id]?.stage||0)>0);if(previous&&rand(s)<.52)return previous;const pool=continuing.length&&rand(s)<.65?continuing:candidates;id=pool[Math.floor(rand(s)*pool.length)];}
 return D.EVENTS.find(e=>e.id===D.ARCS[id].ids[s.arcs[id]?.stage||0]);
}
function normalize(s){if(!s.social)return;for(const k of measures)s.social[k]=Math.round(clamp(s.social[k])*100)/100;for(const k of counts)s.social[k]=Math.round(clamp(s.social[k],0,1000));s.social.friends.forEach(f=>f.bond=Math.round(clamp(f.bond)*100)/100);}
function onChoice(s,e,c,report){
 if(!s.social)return;for(const[k,v]of Object.entries(c.social||{}))if(measures.includes(k)||counts.includes(k))s.social[k]+=v;
 if(e.arc==='classroom'&&e.stage===0)report.push({kind:'life',text:'被害に遭ったことで誠実さや人望が下がることはありません。安心と支援の状態を記録しました。'});
 if(e.arc==='bystander'&&e.stage===1&&s.storyFlags.joined_bullying!==undefined){s.stats.trust-=4;report.push({kind:'life',text:'以前からかいに加わったことが、相手との距離と周囲の信用に残っています。許しを求める前に、行動を変える時間が必要です。'});}
 if(c.tag==='job_loss'){s.social.pendingJob={id:s.job,years:s.jobYears};s.social.jobLosses++;}
 if(c.tag==='grant_apply'){
  const prepared=s.inner.digital+s.stats.discipline+s.plan.allocation.study*5;
  if(prepared>=100&&s.social.grants===0){s.cash+=30;s.social.grants++;report.push({kind:'success',text:'学修計画と書類が整い、ゲーム内の一回限りの給付30万円を受けました。実際の制度の受給判定ではありません。'});}
  else report.push({kind:'life',text:'今回は給付に届かず。書類・学習計画を整える経験が残りました。'});
 }
 if(c.tag==='family_talk'&&s.partner)s.partner.bond+=6;
 if(c.tag==='family_dismiss'&&s.partner)s.partner.bond-=9;
 if(c.tag==='friend_contact')s.social.friends.forEach(f=>f.bond+=8);
 if(c.tag==='disaster_safe'&&s.experienceCounts.firstaid){s.social.disruption-=8;report.push({kind:'life',text:'以前の防災の学びが、必要な連絡と生活の立て直しに役立ちました。'});}
 normalize(s);
}
function narrative(s,e){
 if(!e?.chapter)return e;let extra='';
 if(e.arc==='friendship'&&e.stage===0&&s.social.friends[0])extra=s.social.friends[0].name+'から、短い近況の連絡が届いた。';
 if(e.arc==='classroom'&&e.stage===1){extra=s.storyFlags.class_help!==undefined?'相談した相手と、続けて様子を確認する予定ができた。':s.storyFlags.class_distance!==undefined?'教室から離れた時間に、少し息をつけるようになった。':'まだ話しづらい。話せるまで待ってくれる相手を探している。';}
 if(e.arc==='bystander'&&e.stage===1)extra=s.storyFlags.joined_bullying!==undefined?'自分が加わったことも、説明する必要がある。':'あの場で助けを求めたり、後から声をかけたことを覚えている。';
 if(e.arc==='caregiving_life'&&e.stage===1)extra=s.storyFlags.care_alone!==undefined?'多くを引き受けた分、自分の疲れもたまっている。':'最初に分担した予定にも、見直しが必要になった。';
 if(e.arc==='scam'&&e.stage===1)extra=s.storyFlags.scam_loss!==undefined?'すでに渡したお金は戻っていない。損失の大きさと、あなた自身の価値は別の話だ。':'前に立ち止まって確認したため、送金はしていない。';
 if(e.arc==='layoff'&&e.stage===1)extra=s.job?'新しい仕事も含めて、これからの働き方を考えている。':'現在は次の仕事を探している。仕事タブから応募できる。';
 return extra?{...e,text:extra+' '+e.text}:e;
}
function addFriend(s,id,label){
 if(s.social.friends.some(f=>f.id===id))return;const names=['ひなた','あおい','なつき','いおり','みずき','りつ','つむぎ','かえで'];const hash=[...s.seed].reduce((n,c)=>n+c.codePointAt(0),0);const i=(hash+{childhood:0,club:2,work:5}[id])%names.length;
 s.social.friends.push({id,name:names[i],label,bond:35,since:s.age,lastContact:s.age});
}
function yearEnd(s,report,focusAtStart){
 const p=s.social,a=s.plan.allocation;if(s.age>=6)addFriend(s,'childhood','子どものころからの友人');
 if(s.age>=12&&(s.experienceCounts.club||s.arcs.club_life))addFriend(s,'club','好きなことを通じた仲間');
 if(s.age>=20&&s.job)addFriend(s,'work','仕事を通じた友人');
 if(s.age>=6&&!(focusAtStart??focusReason(s))){
  switch(s.plan.socialFocus){case'steady':p.belonging+=2;break;case'boundaries':p.strain-=7;p.safety+=4;p.boundaries++;break;
  case'support':p.support+=5;p.strain-=6;p.safety+=4;break;
  case'repair':if(p.harm>0){const delta=Math.min(6,p.harm);p.harm-=delta;p.repair+=delta;s.inner.integrity+=2;s.inner.empathy+=2;report.push({kind:'life',text:'相手に許しを迫らず、言動を変える時間を続けました。過去の行動への課題が少し小さくなりました。'});}break;
  case'caregiving':p.careNeed-=8;p.strain-=4;s.impact+=3;break;
  case'mentor':p.mentored++;s.impact+=4;s.inner.empathy+=1;break;
  }
 }
 for(const f of p.friends){const contact=a.social>=1;f.bond+=contact?Math.min(1.8,a.social*.55):-.9;if(contact)f.lastContact=s.age;}
 if(s.age>=6){p.belonging+=a.social*.4-.8;p.support-=.4;}
 if(s.school.attendance!=='campus'&&s.age<15&&a.rest>=1){p.safety+=2;p.strain-=2;}
 p.strain-=a.rest*(.6+p.safety/125)+p.support*.018;
 if(s.age>=6)s.stats.happiness+=(p.belonging-40)*.012;
 if(p.strain>25){s.stats.stress+=(p.strain-25)*.07;s.stats.happiness-=Math.min(2,(p.strain-25)*.035);}
 if(p.harm>0){s.stats.trust-=Math.min(3,p.harm*.055);s.inner.workReputation-=Math.min(2,p.harm*.035);}
 if(p.careNeed>0){s.stats.stress+=p.careNeed*.035;p.careNeed-=.5;}
 if(p.grief>0){s.stats.happiness-=Math.min(1.5,p.grief*.04);p.grief-=a.rest*.6+p.support*.018;}
 if(p.disruption>0){s.stats.stress+=p.disruption*.04;p.disruption-=2+p.support*.025;}
 if(p.pendingJob){if(s.job===p.pendingJob.id&&s.jobYears>p.pendingJob.years){s.job=null;s.jobYears=0;s.retired=false;report.push({kind:'life',text:'今年の仕事を終えて離職しました。来年の給与はなくなります。仕事タブから再応募・別の職種を選べます。'});}delete p.pendingJob;}
 normalize(s);
}
function validate(s){const p=s.social;if(s.chaptersVersion!==1||!p||typeof s.settings.difficultStories!=='boolean'||!D.SOCIAL_FOCUS.some(f=>f[0]===s.plan.socialFocus))return false;
 if(measures.some(k=>!Number.isFinite(p[k])||p[k]<0||p[k]>100)||counts.some(k=>!Number.isInteger(p[k])||p[k]<0||p[k]>1000))return false;
 if(!Array.isArray(p.friends)||p.friends.length>3||new Set(p.friends.map(f=>f.id)).size!==p.friends.length)return false;
 return p.friends.every(f=>['childhood','club','work'].includes(f.id)&&typeof f.name==='string'&&f.name.length<=16&&typeof f.label==='string'&&f.label.length<60&&Number.isFinite(f.bond)&&f.bond>=0&&f.bond<=100&&Number.isInteger(f.since)&&f.since>=0&&f.since<=100&&Number.isInteger(f.lastContact)&&f.lastContact>=0&&f.lastContact<=100);
}
function summary(s){
 const E=root.LifeEngine,sc=E.score(s),total=Math.round(sc.total*10),rank=total>=900?'S':total>=800?'A':total>=650?'B':total>=450?'C':'D';
 const axes=[['wealth','資産',450],['wellbeing','幸福・健康',250],['relation','大切な関係',150],['contribution','社会への貢献',150]].map(([key,name,max])=>({key,name,max,value:sc[key],points:Math.round(sc[key]*max/100)}));
 let rounding=Math.round(sc.raw*10)-axes.reduce((n,a)=>n+a.points,0);for(let i=0;rounding!==0&&i<10;i++){const a=axes[i%axes.length],delta=Math.sign(rounding);if(a.points+delta>=0&&a.points+delta<=a.max){a.points+=delta;rounding-=delta;}}
 const highlights=[];const push=(label,value)=>highlights.push({label,value});
 push('残した純資産',E.netWorth(s));push('学んだ試験・級',Object.keys(s.certs).length);push('社会への貢献',Math.round(s.impact));push('海外で得た経験',s.visits);
 const tags=[];if(s.projects.research?.stage>=4)tags.push('世界につながる発見');if(s.projects.startup?.stage>=3)tags.push('事業を育てた');if(s.projects.creative?.stage>=3)tags.push('作品を残した');if(s.social.mentored>=5)tags.push('経験を次の人へ');if(s.social.supportActs>=3)tags.push('困った人に手を差し伸べた');if(s.social.repair>=20&&s.social.harm<5)tags.push('自分の言動を変え続けた');if(s.degrees.some(d=>d.age>=35))tags.push('大人からの学び直し');if(s.social.friends.some(f=>f.bond>=70&&s.age-f.since>=20))tags.push('長く続く友情');if(s.visits>=3)tags.push('世界を知る旅');if(!tags.length)tags.push(s.stats.happiness>=60?'自分の暮らしを育てた':'選びながら歩いた');
 const turning=s.history.filter(v=>['education','career','relationship','origin','project','chapter'].includes(v.kind)).slice(0,5).reverse();
 return {total,rank,axes,raw:Math.round(sc.raw*10),trustFactor:.65+.35*s.stats.trust/100,highlights,tags:tags.slice(0,6),turning,title:s.social.harm>=30?'残したものと、残された約束':E.ending(s).title,unresolved:s.social.harm>=10,age:s.age,name:s.name,ending:s.endCause||'100歳の区切り'};
}
const base={init:X.init,migrate:X.migrate,plan:X.plan,normalize:X.normalize,storyEvent:X.storyEvent,onChoice:X.onChoice,yearEnd:X.yearEnd,afterTrain:X.afterTrain,jobScore:X.jobScore,extraBudget:X.extraBudget,validate:X.validate};
X.init=(s,o,r)=>init(base.init(s,o,r));X.migrate=s=>{const v=base.migrate(s);return v&&v.version===1&&v.expansion===2?init(v):v;};
X.plan=(age,old)=>({...base.plan(age,old),socialFocus:old?.socialFocus||'steady'});
X.normalize=s=>{base.normalize(s);normalize(s);};X.storyEvent=(s,r)=>chooseStory(s,r,base.storyEvent(s,r));
X.onChoice=(s,e,c,report)=>{base.onChoice(s,e,c,report);onChoice(s,e,c,report);};
X.afterTrain=(s,report,r,reason)=>{base.afterTrain(s,report,r,reason);if(reason)return;const p=s.social;
 if(s.plan.experience==='reskill'){p.reskill+=6;s.inner.interview+=4;s.skills.tech+=4;}
 if(s.plan.experience==='sideproject'){s.skills.tech+=4;s.skills.business+=3;}
 if(s.plan.experience==='careplan'){p.careNeed-=10;p.support+=6;}
 if(s.plan.experience==='civic')s.impact+=6;
 normalize(s);
};
X.yearEnd=(s,report,r,focusAtStart)=>{yearEnd(s,report,focusAtStart);base.yearEnd(s,report,r);};
X.extraBudget=s=>base.extraBudget(s)+(s.age>=6&&!focusReason(s)?D.SOCIAL_FOCUS.find(f=>f[0]===s.plan.socialFocus)[3]:0);
X.jobScore=(s,j)=>base.jobScore(s,j)+Math.min(5,(s.social?.reskill||0)*.06);
X.validate=s=>base.validate(s)&&validate(s);
root.LifeChapters={arcs,init,eligible,focusReason,narrative,summary,validate};
})(typeof window!=='undefined'?window:globalThis);
