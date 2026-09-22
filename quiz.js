/* Small, optional skill checks. Generated variants, one graded attempt per year. */
(function(root){
'use strict';
function rng(seed){let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6D2B79F5;let t=Math.imul(h^h>>>15,h|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const facts=[
 ['歴史','日本国憲法が施行された年は？','1947年',['1945年','1946年','1952年'],'日本国憲法は1946年公布、1947年5月3日施行。'],
 ['歴史','日本で最初の本格的な政党内閣を組織したのは？','原敬',['伊藤博文','吉田茂','犬養毅'],'1918年に原敬内閣が成立した。'],
 ['歴史','大政奉還を行った人物は？','徳川慶喜',['徳川家康','徳川家光','徳川吉宗'],'1867年、15代将軍の徳川慶喜が政権を返上した。'],
 ['歴史','江戸幕府の享保の改革を行ったのは？','徳川吉宗',['松平定信','水野忠邦','田沼意次'],'吉宗の享保、定信の寛政、忠邦の天保。'],
 ['歴史','フランス革命が始まった年は？','1789年',['1688年','1776年','1848年'],'1789年にバスティーユ牢獄襲撃などが起きた。'],
 ['歴史','アメリカ独立宣言が出された年は？','1776年',['1789年','1815年','1861年'],'独立宣言は1776年7月4日。'],
 ['歴史','ルネサンス期の「最後の晩餐」の作者は？','レオナルド・ダ・ヴィンチ',['ミケランジェロ','ラファエロ','ボッティチェリ'],'ミラノの修道院に描かれた壁画。'],
 ['歴史','ペストの流行がヨーロッパで大きく広がったのは？','14世紀',['9世紀','11世紀','18世紀'],'黒死病は14世紀半ばに大流行した。'],
 ['地理','緯度0度を表す線は？','赤道',['本初子午線','日付変更線','北回帰線'],'赤道は南北の緯度の基準。'],
 ['地理','偏西風が主に吹く向きは？','西から東',['東から西','北から南','南から北'],'中緯度で上空を中心に吹く西風。'],
 ['地理','雨温図で年中高温・年中多雨なのは？','熱帯雨林気候',['地中海性気候','ツンドラ気候','砂漠気候'],'熱帯雨林気候では明瞭な乾季がない。'],
 ['地理','プレートの沈み込み帯で多い現象は？','地震と火山活動',['日食','潮の満ち引き','季節風だけ'],'海溝や火山帯、地震の分布と関係する。'],
 ['公民','国の唯一の立法機関は？','国会',['内閣','最高裁判所','会計検査院'],'憲法41条が国会を唯一の立法機関と定める。'],
 ['公民','日本の裁判所が持つ、法律の合憲性を判断する権限は？','違憲審査権',['解散権','拒否権','予算提出権'],'司法が法令等の憲法適合性を審査する。'],
 ['公民','価格が上がると一般に需要量はどうなる？（他の条件一定）','減る',['必ず増える','必ず不変','必ずゼロになる'],'通常の需要曲線は右下がり。例外的な財もある。'],
 ['公民','景気後退時の財政政策の例は？','政府支出を増やす',['政府支出を減らす','必ず通貨を廃止する','すべての輸入を止める'],'需要不足を補う方向の財政支出。'],
 ['英語','He has lived here ( ) 2020.','since',['for','during','until'],'開始時点にはsince。期間の長さにはfor。'],
 ['英語','If I ( ) you, I would ask.','were',['am','be','will be'],'現在の事実に反する仮定の表現。'],
 ['英語','She is interested ( ) astronomy.','in',['at','on','for'],'be interested in ... で「…に興味がある」。'],
 ['英語','This book was ( ) by many students.','read',['reads','reading','to reading'],'受動態はbe＋過去分詞。readの過去分詞も綴りはread。'],
 ['情報','整列済みの配列に対する二分探索の計算量は？','O(log n)',['O(n²)','O(n!)','O(2ⁿ)'],'探索範囲を繰り返し半分にする。'],
 ['情報','先に入れた要素から取り出す構造は？','キュー',['スタック','再帰','ハッシュ関数'],'キューはFIFO、スタックはLIFO。'],
 ['情報','パスワード保存に適した基本方針は？','ソルト付きの適切なハッシュ化',['平文のまま保存','全員共通の固定文字列','利用者名と同じ値'],'平文を残さず、用途に適したパスワードハッシュを使う。'],
 ['情報','同じ計算結果を保存して重複計算を避ける方法は？','メモ化',['暗号化','整列','ポーリング'],'再帰や動的計画法で用いられる。']
];
function generate(s){const r=rng(s.seed+'quiz'+s.age),n=(a,b)=>a+Math.floor(r()*(b-a+1));let prompt,answer,wrong,explanation,key='mathI',tag='数Ⅰ・A';
 const type=s.plan.quizSubject||'math';
 if(type!=='math'){const cat={social:['歴史','地理','公民'],english:['英語'],coding:['情報']}[type]||['歴史'];const candidates=facts.map((v,i)=>({v,i})).filter(o=>cat.includes(o.v[0])&&!(s.quiz.recent||[]).includes(o.i));const pool=candidates.length?candidates:facts.map((v,i)=>({v,i})).filter(o=>cat.includes(o.v[0]));const {v,i}=pool[n(0,pool.length-1)];[tag,prompt,answer,wrong,explanation]=v;key={歴史:'history',地理:'geography',公民:'civics',英語:'englishR',情報:'information'}[tag];const choices=shuffle([answer,...wrong],r);return{id:'fact-'+i,factIndex:i,prompt,choices,correct:choices.indexOf(answer),explanation,key,tag};}
 const a=n(2,s.age<12?9:25),b=n(2,s.age<12?9:19),which=n(0,5),track=root.LifeNext.mathTrack(s);
 if(['mathIII','higherMath'].includes(track)||s.age>=17&&(s.subjects.mathIII||0)>10){key='mathIII';tag='数Ⅲ';
  if(which===0){prompt=`y = ${b}e^(${a}x) の x = 0 における微分係数は？`;answer=a*b;wrong=[a,b,a+b];explanation=`y′ = ${a*b}e^(${a}x)。x=0を代入して${a*b}。`;}
  else if(which===1){prompt=`∫₀^ln(${b}) ${a}eˣ dx の値は？`;answer=a*(b-1);wrong=[a*b,a+b,b-1];explanation=`原始関数は${a}eˣ。${a}×(${b}−1) = ${a*(b-1)}。`;}
  else if(which===2){prompt=`lim(x→0) ${b} sin(${a}x) / x の値は？`;answer=a*b;wrong=[a,b,0];explanation=`sin(${a}x)/(${a}x)→1なので、極限値は${a}×${b} = ${a*b}。`;}
  else if(which===3){prompt=`y = ${b} ln(${a}x + 1) の x=0 における微分係数は？`;answer=a*b;wrong=[a,b,0];explanation=`y′ = ${a*b}/(${a}x+1)。x=0で${a*b}。`;}
  else if(which===4){prompt=`y = ${a} sin(${b}x) の x=0 における微分係数は？`;answer=a*b;wrong=[a,-a*b,0];explanation=`y′ = ${a*b} cos(${b}x)。cos 0 = 1。`;}
  else{prompt=`∫₀^(π/2) (${a} cos x + ${b} sin x) dx の値は？`;answer=a+b;wrong=[a-b,a*b,0];explanation=`[${a} sin x − ${b} cos x]₀^(π/2) = ${a} + ${b} = ${a+b}。`;}
 }else if(s.age<12&&['age','arithmetic'].includes(s.plan.mathTrack)){tag='算数';key='arithmetic';if(which<3){prompt=`${a}人に${b}個ずつ配る。全部で何個？`;answer=a*b;wrong=[a+b,a*b+a,a*b-b];explanation=`人数×1人分 = ${a}×${b} = ${a*b}。`;}else{prompt=`1辺${a}cmの正方形の周の長さは？`;answer=a*4;wrong=[a*a,a*2,a*3];explanation=`辺は4本なので${a}×4 = ${a*4}cm。`;}}
 else if(which<2){prompt=`(x − ${a})² + ${b} の最小値は？`;answer=b;wrong=[a,a+b,-b];explanation=`二乗は0以上。x=${a}で最小値${b}。`;}
 else if(which<4){const count=a+3;prompt=`${count}人から2人を選ぶ組合せは何通り？`;answer=count*(count-1)/2;wrong=[count*(count-1),count*count,2*count];explanation=`順序を区別しないので${count}×${count-1}÷2 = ${answer}。`;}
 else{prompt=`2x + ${a} = ${a+2*b}。xの値は？`;answer=b;wrong=[a+b,a+2*b,b+1];explanation=`両辺から${a}を引いて2で割る。x=${b}。`;}
 answer=String(answer);wrong=wrong.map(String).filter(x=>x!==answer);let i=1;while(new Set(wrong).size<3){wrong.push(String(Number(answer)+i*3));i++;}const choices=shuffle([answer,...[...new Set(wrong)].slice(0,3)],r);
 return{id:`generated-${s.age}-${a}-${b}-${which}`,prompt,choices,correct:choices.indexOf(answer),explanation,key,tag};
}
function get(s){if(!s.quiz.question)s.quiz.question=generate(s);return s.quiz.question;}
function answer(s,choice){if(s.finished||s.quiz.attempted)return{error:'今年の採点は終了しています'};const q=get(s);if(!Number.isInteger(choice)||choice<0||choice>=4)return{error:'選択肢を選んでください'};s.quiz.attempted=true;s.quiz.choice=choice;s.quiz.correct=choice===q.correct;s.quiz.recent=[...(s.quiz.recent||[]),q.factIndex].filter(Number.isInteger).slice(-12);if(s.quiz.correct){const target=q.key in s.learning?s.learning:s.subjects;target[q.key]=Math.min(200,target[q.key]+.8);}return{correct:s.quiz.correct,explanation:q.explanation};}
root.LifeQuiz={generate,get,answer,facts};
})(typeof window!=='undefined'?window:globalThis);
