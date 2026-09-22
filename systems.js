/* Yearly systems, explicit gates, hidden tendencies and continuing stories. */
(function(root){
'use strict';
const D=root.LifeData,clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a)),copy=o=>JSON.parse(JSON.stringify(o));
const pref=id=>D.PREFECTURES.find(p=>p.id===id)||D.PREFECTURES[19];
const job=s=>D.JOBS.find(j=>j.id===s.job);
const log=(s,title,text,kind='life')=>{s.history.unshift({age:s.age,title,text,kind});if(s.history.length>800)s.history.length=800;};
const innerKeys=['integrity','empathy','resilience','selfKnowledge','interview','financial','digital','academicConfidence','fatigue','workReputation','audienceQuality','reach','lossChasing','novelty'];
function plan(age,old={}){return {curriculum:old.curriculum||'balanced',subjectWeights:copy(old.subjectWeights||D.CURRICULA.balanced.weights),school:null,experience:null,admissionMethod:old.admissionMethod||'exam',alcohol:old.alcohol||'none',tobacco:old.tobacco||'none',gambling:old.gambling||'none',workstyle:old.workstyle||'office',networking:old.networking||'none',care:old.care||'routine',investmentStyle:old.investmentStyle||'balanced'};}
function init(s,o={},rand){
 const legacy=!!o.migrate;const origin=D.ORIGINS[o.origin]?o.origin:({supported:'easy',independent:'hard',standard:'medium'}[s.background]||'medium');
 s.expansion=2;s.origin=origin;
 if(!legacy&&origin==='draw'){const r=rand(s);s.background=r<.22?'supported':r<.77?'standard':'independent';s.cash=D.BACKGROUNDS[s.background].cash;}
 else if(!legacy&&D.ORIGINS[origin].background){s.background=D.ORIGINS[origin].background;s.cash=D.BACKGROUNDS[s.background].cash;}
 s.family={warmth:origin==='draw'?Math.round(25+rand(s)*70):origin==='easy'?80:origin==='hard'?55:67,pressure:origin==='draw'?Math.round(10+rand(s)*75):origin==='easy'?32:origin==='hard'?48:42};
 const p=o.prefecture==='random'?D.PREFECTURES[Math.floor(rand(s)*47)]:D.PREFECTURES.find(p=>p.id===o.prefecture)||pref(s.region==='metro'?'13':'20');
 s.birthPref=p.id;s.prefecture=p.id;s.region=p.metro?'metro':'local';s.lifeMode=o.lifeMode==='century'?'century':'natural';
 s.inner=Object.fromEntries(innerKeys.map(k=>[k,0]));Object.assign(s.inner,{integrity:50,empathy:s.trait==='warm'?62:45,resilience:40,selfKnowledge:15,interview:5,financial:legacy?Math.min(70,s.skills.business*.45):0,digital:legacy?Math.min(70,s.skills.tech*.45):0,academicConfidence:40,workReputation:40,novelty:70});
 const parentMap={japanese:'language',mathI:'math',mathII:'math',englishR:'english',englishL:'english',physics:'science',chemistry:'science',biology:'science',history:'language',geography:'language',civics:'law',information:'tech'};
 s.subjects=Object.fromEntries(Object.keys(D.SUBJECTS).map(k=>[k,legacy?s.skills[parentMap[k]]*.82:0]));
 s.school={attendance:'campus',middle:'middle_public',secondary:s.highschool==='remote'?'high_remote':'high_public',hsProgress:s.highschoolGrad?3:Math.max(0,Math.min(2,s.age-15)),hsTotal:3,ronin:false,roninYears:0};
 s.body={burden:0,condition:null,severity:0,frailty:legacy&&s.age>75?(s.age-75)*2:0,critical:0,alcoholDependence:0,tobaccoDependence:0,gamblingDependence:0};
 s.arcs={};s.storyFlags={};s.visits=0;s.account={open:legacy&&s.investments>0,attempts:0,credit:60};s.venture=null;s.experienceCounts={};s.admissionAttempts={};s.yearMemo=[];s.endCause=null;s.lastPattern='';s.patternYears=0;
 Object.assign(s.plan,plan(s.age,s.plan));
 if(!legacy){s.stats.happiness=clamp(s.stats.happiness+(s.family.warmth-65)*.12);log(s,'生まれた場所、最初の環境',`${p.name}。${D.BACKGROUNDS[s.background].name}で、家庭の関わり ${s.family.warmth}・期待の強さ ${s.family.pressure}から物語が始まった。`,'origin');}
 return s;
}
function migrate(s){if(s&&s.version===1&&!s.expansion){const oldRng=s.rng;init(s,{migrate:true,lifeMode:'century'},()=>.5);s.rng=oldRng;}return s;}
function normalize(s){if(!s.expansion)return;for(const k of innerKeys)s.inner[k]=Math.round(clamp(s.inner[k])*100)/100;for(const k of Object.keys(D.SUBJECTS))s.subjects[k]=Math.round(clamp(s.subjects[k],0,200)*100)/100;for(const k of ['burden','severity','frailty','alcoholDependence','tobaccoDependence','gamblingDependence'])s.body[k]=Math.round(clamp(s.body[k])*100)/100;s.account.credit=clamp(s.account.credit);}
function certainty(value,threshold,width=23){if(value>=threshold+width)return 1;if(value<threshold*.46)return 0;return clamp(.5+(value-threshold)/(width*2),.02,.97);}
function schoolLabel(s){if(s.age>=6&&s.age<15)return `${s.age<12?'小学校':D.SCHOOL_ROUTES.find(x=>x.id===s.school.middle)?.name||'中学校'} · ${D.CAMPUS[s.school.attendance].name}`;if(s.age>=15&&!s.highschoolGrad&&!s.education&&s.highschool!=='none')return `${D.SCHOOL_ROUTES.find(x=>x.id===s.school.secondary)?.name||'高校'} ${s.school.hsProgress}/${s.school.hsTotal}年`;if(s.school.ronin&&!s.education)return`進学への準備 · ${s.school.roninYears+1}年目`;return null;}
function schoolEligible(s,id){const r=D.SCHOOL_ROUTES.find(x=>x.id===id);if(!r)return'学び方を選んでください';if(s.finished)return'この人生は完結しています';if(r.stage==='middle'&&s.age!==11)return'11歳の年度に出願します';if(r.stage!=='middle'&&s.age<14)return'14歳の年度から';if(r.stage==='kosen'&&s.age>19)return'この代表課程は14〜19歳に出願できます';if(s.education)return'現在の課程を修了・退学してから出願できます';if(r.stage==='high'&&s.highschool!=='none'&&!s.highschoolGrad&&s.school.hsProgress>=s.school.hsTotal-1&&s.plan.allocation.study>=2)return'今年は今の高校を修了する予定です';if(s.highschoolGrad&&r.stage==='high')return'高校の修了を記録しています';if(s.plan.admission)return'大学等の進学予定と同じ年には選べません';return'';}
function schoolProbability(s,id){const r=D.SCHOOL_ROUTES.find(x=>x.id===id);if(!r)return 0;if(!r.need)return 1;const v=s.subjects;const elementary=s.learning?.arithmetic??v.mathI,junior=s.learning?.juniorMath??v.mathI;const score=r.stage==='middle'?(v.japanese+elementary)/2:r.stage==='kosen'?(junior+v.information+(s.skills.science+v.physics)/2)/3:(v.japanese+junior+v.englishR+s.skills.science+(v.history+v.geography)/2)/5;return certainty(score+s.inner.interview*.08,r.need,18);}
function subjectRequirements(u,c){const f=c.field;if(['science','tech','medicine','dentistry','pharmacy','veterinary'].includes(f)){return ['medicine','dentistry','pharmacy'].includes(f)?['mathI','mathII','englishR','chemistry','biology']:['mathI','mathII','englishR','physics','chemistry'];}if(f==='business')return['japanese','mathI','englishR','civics'];if(f==='law')return['japanese','englishR','history','civics'];return['japanese','englishR','history','geography'];}
function admissionScore(s,u,c,base){const keys=subjectRequirements(u,c);let val=keys.reduce((n,k)=>n+s.subjects[k],0)/keys.length;if(u.type!=='私立')val=val*.85+Object.values(s.subjects).reduce((a,b)=>a+b,0)/12*.15;if(['arts','sports'].includes(c.field))val=val*.4+s.skills[c.field]*.6;else val=val*.72+base*.28;val+=Math.min(8,(s.admissionAttempts[u.id]||0)*2);if(s.plan.admissionMethod==='interview')val=val*.77+s.inner.interview*.20+s.inner.selfKnowledge*.08;return val;}
function train(s,add,efficiency,amount){
 const campus=D.CAMPUS[s.school.attendance];let regular=s.age>=6&&s.age<15?1.65*campus.learning:s.age>=15&&s.highschool!=='none'&&!s.education?1.7:0;
 if(s.age>=12&&s.age<15&&s.school.middle!=='middle_public')regular*=1.13;
 if(s.age>=15&&s.school.secondary==='high_advanced')regular*=1.22;
 const ids=Object.keys(D.SUBJECTS),weights=s.plan.subjectWeights;
 for(let i=0;i<ids.length;i++){const k=ids[i];const early=s.age<6?.28:s.age<12&&['mathII','physics','chemistry','civics'].includes(k)?.6:1;let gain=(amount*2.7*weights[i]/12+regular)*early;
  if(s.plan.focus==='business'||s.plan.focus==='law')gain*=.62;
  s.subjects[k]=clamp(s.subjects[k]+gain*(1-s.subjects[k]/270),0,200);
 }
 if(s.age>=6){s.inner.digital+=s.plan.allocation.work*.45+(s.plan.ai!=='off'?.6:0);s.inner.financial+=s.plan.focus==='business'?s.plan.allocation.study*.65:0;}
 if(s.plan.curriculum==='cpa'){add(s,'law',s.plan.allocation.study*.6);}
 if(s.age>=15&&s.school.secondary==='high_technical'&&s.highschool!=='none'&&!s.highschoolGrad){add(s,'tech',2);add(s,'business',2);}
 if(s.education?.kind==='kosen'){add(s,'tech',3.3);add(s,'science',1.6);}
 const x=D.EXPERIENCES.find(x=>x.id===s.plan.experience);if(x&&!experienceEligible(s,x.id)){s.inner[x.skill]+=x.gain;if(['abroad_short','exchange','overseas_work'].includes(x.id)){add(s,'english',x.id==='abroad_short'?12:22);s.subjects.englishR=clamp(s.subjects.englishR+8,0,200);s.subjects.englishL=clamp(s.subjects.englishL+15,0,200);}if(x.id==='club'){add(s,'tech',4);add(s,'arts',4);}if(x.id==='local'){const p=pref(s.prefecture);if(p.specialty!=='community')add(s,p.specialty,4);}}
 normalize(s);
}
function experienceEligible(s,id){const x=D.EXPERIENCES.find(x=>x.id===id);if(!x)return'経験を選んでください';if(s.age<x.minAge)return`${x.minAge}歳から`;if(s.finished)return'人生は完結しています';if(s.yearExperiencePaid!==id&&s.cash+(s.age<18?(s.parents?.educationFund||0):0)<x.cost)return`準備費用 ${x.cost}万円が必要`;const key=['mentor','local'].includes(id)?'social':id==='club'?'creative':id==='counsel'?'rest':'study';if(s.plan.allocation[key]<x.needTime)return`${D.ACTIVITIES.find(a=>a.id===key).name}を${x.needTime}コマ以上に`;if(id==='overseas_work'&&(s.skills.english<45||s.education&&!s.education.paused))return'英語45以上、在学中は休学してから';if(id==='exchange'&&s.job&&!s.retired&&s.job!=='parttime')return'留学の年は仕事の休止・退職を選んでください';return'';}
function extraBudget(s){let fee=0;if(s.age>=6&&s.age<15){fee+=D.CAMPUS[s.school.attendance].fee;if(s.age>=12)fee+=D.SCHOOL_ROUTES.find(r=>r.id===s.school.middle)?.annual||0;}if(s.age>=15&&!s.highschoolGrad&&s.highschool!=='none'&&!s.education)fee+=D.SCHOOL_ROUTES.find(r=>r.id===s.school.secondary)?.annual||0;
 if(s.age>=20)for(const k of ['alcohol','tobacco','gambling'])fee+=D.LIFESTYLE[k].find(x=>x[0]===s.plan[k])?.[2]||0;
 if(s.job&&!s.retired)fee+=D.LIFESTYLE.networking.find(x=>x[0]===s.plan.networking)?.[2]||0;
 if(s.age>=6)fee+=D.LIFESTYLE.care.find(x=>x[0]===s.plan.care)?.[2]||0;
 const exp=D.EXPERIENCES.find(x=>x.id===s.plan.experience);if(exp&&!experienceEligible(s,exp.id))fee+=exp.cost;
 if(s.venture?.registered)fee+=80;return fee;
}
function salaryFactor(s){let n=1;const j=job(s);if(!j)return n;if(s.plan.experience==='overseas_work'&&!experienceEligible(s,'overseas_work'))return 0;if(s.body.condition)n*=s.plan.care==='treatment'?.82:.92;
 n*=.86+s.inner.workReputation*.0028;
 const remote=s.plan.workstyle==='remote'&&D.REMOTE_JOBS.includes(j.id);if(!remote)n*=pref(s.prefecture).opportunity;
 if(j.sector==='media')n*=.65+s.inner.audienceQuality*.006+s.inner.reach*.004;
 if(j.sector==='hospitality')n*=.75+s.inner.interview*.005+s.stats.trust*.003;
 if(j.selfEmployed)n*=.8+(s.projects.startup?.stage||0)*.23;
 return n;
}
function jobGate(s,j){if(j.english&&s.skills.english<j.english)return`英語 ${j.english}以上が必要`;if(j.selfEmployed&&s.cash<20)return'会社設立の準備費20万円が必要';if(s.age>=15&&!s.highschoolGrad&&s.highschool==='full'&&!s.education&&j.id!=='parttime'&&s.school.hsProgress<s.school.hsTotal-1)return'全日制高校の在学中はアルバイトのみ';return'';}
function jobScore(s,j){return s.skills[j.skill]+s.inner.interview*.21+s.inner.selfKnowledge*.07+Math.max(0,s.stats.connections-35)*.06-Math.max(0,s.stats.stress-65)*.13;}
function onHire(s,j){if(j.selfEmployed){s.cash-=20;if(!s.venture)s.venture={kind:'product',registered:false,years:0};s.plan.project='startup';}s.plan.workstyle='office';}
function availableArc(s,id){switch(id){case'offcampus':return s.age>=6&&s.school.attendance!=='campus';case'cpa':return s.age>=12&&s.age<=24&&(s.plan.curriculum==='cpa'||s.plan.focus==='business'&&s.skills.business>30||s.certs.cpa_short!==undefined);case'kosen':return s.education?.kind==='kosen'||s.degrees.some(d=>d.kind==='kosen');case'ronin':return s.school.ronin&&s.age>=18;case'remote':return s.job&&s.plan.workstyle!=='office';case'influencer':return s.job==='influencer';case'host':return s.job==='host';case'founder':return s.venture||s.projects.startup?.stage>=1;case'research':return s.plan.project==='research'||job(s)?.sector==='research';case'abroad':return s.visits>0;case'finance':return s.account.attempts>0||s.account.open;case'brokerage':return s.venture?.kind==='brokerage';case'crisis':return s.age>=12&&(s.stats.stress>82||s.stats.happiness<22||s.arcs.crisis?.stage===1);case'habit':return s.age>=20&&(s.body.alcoholDependence>15||s.body.tobaccoDependence>15||s.body.gamblingDependence>15);case'illness':return !!s.body.condition;default:return false;}}
function storyEvent(s,rand){if(s.age<6)return null;const active=Object.entries(D.ARCS).filter(([id,a])=>availableArc(s,id)&&(s.arcs[id]?.stage||0)<a.ids.length&&s.age>=(s.arcs[id]?.nextAge||0));if(!active.length)return null;const urgent=active.find(([id])=>id==='crisis')||active.find(([id])=>id==='illness');const selected=urgent||active[Math.floor(rand(s)*active.length)];if(!urgent&&s.age%2!==0&&s.storyFlags.lastStory===s.age-1)return null;return D.EVENTS.find(e=>e.id===selected[1].ids[s.arcs[selected[0]]?.stage||0]);}
function onChoice(s,event,choice,report){for(const[k,v]of Object.entries(choice.inner||{}))if(k in s.inner)s.inner[k]+=v;if(event.arc){s.arcs[event.arc]={stage:event.stage+1,nextAge:s.age+1};s.storyFlags.lastStory=s.age;}if(choice.tag){s.storyFlags[choice.tag]=s.age;if(choice.tag==='habit_help'){s.body.alcoholDependence-=12;s.body.tobaccoDependence-=12;s.body.gamblingDependence-=12;}if(choice.tag==='treat')s.body.severity-=8;}
 if(choice.effects?.trust>0)s.inner.integrity+=1.2;if(choice.effects?.impact>0)s.inner.empathy+=1.5;
 if(event.arc==='influencer'&&event.stage===2&&s.storyFlags.hype!==undefined){s.stats.trust-=6;report.push({kind:'life',text:'以前、検証せず紹介した広告について質問が届きました。過去の発信への説明も、いまの仕事の一部です。'});}
 if(event.arc==='research'&&event.stage===1&&s.storyFlags.research_shortcut!==undefined){s.stats.trust-=10;s.inner.workReputation-=10;report.push({kind:'fail',text:'過去の結果に再現性の問題が見つかり、説明と再実験が必要になりました。'});}
}
function afterTrain(s,report,rand,experienceReason){
 const a=s.plan.allocation,c=D.CAMPUS[s.school.attendance];if(s.age>=6&&s.age<15){s.stats.stress+=c.stress;s.stats.connections+=c.social;if(s.school.attendance!=='campus'&&a.study<2){s.inner.academicConfidence-=3;report.push({kind:'life',text:'学校外の学びでは、学ぶ時間2コマと相談相手が進学の支えになります。'});}}
 if(s.age<20){s.stats.stress+=(s.family.pressure-40)*.04;s.stats.happiness+=(s.family.warmth-60)*.025;}
 if(s.age>=15&&s.highschool!=='none'&&!s.highschoolGrad&&!s.education&&!s.studyAbroadYear){
  if(a.study>=2&&(!root.LifeNext||root.LifeNext.passingAttendance(s))){s.school.hsProgress++;if(s.school.hsProgress>=s.school.hsTotal){s.highschoolGrad=true;log(s,'高校を卒業',`${D.SCHOOL_ROUTES.find(r=>r.id===s.school.secondary)?.name||'高校'}を${s.age+1}歳で卒業。`,'education');report.push({kind:'success',text:'高校の履修を終えました。大学・専門・仕事へ、次の道を選べます。'});}}
  else {s.school.repeats++;report.push({kind:'fail',text:'出席・課題の条件を満たせず留年。修了年数は増えません。学習2コマ以上と出席を確保してください。'});}
 }
 if(s.school.ronin&&!s.education)s.school.roninYears++;
 const x=D.EXPERIENCES.find(x=>x.id===s.plan.experience);if(x){const reason=experienceReason??experienceEligible(s,x.id);if(reason)report.push({kind:'life',text:`${x.name}：${reason}。今年は見送り。`});else{s.experienceCounts[x.id]=(s.experienceCounts[x.id]||0)+1;if(['abroad_short','exchange','overseas_work'].includes(x.id)){s.visits++;s.stats.connections+=6;if(x.id==='overseas_work'){s.cash+=135;s.experience.freelance=(s.experience.freelance||0)+1;}report.push({kind:'success',text:`${x.name}を経験。${x.id==='exchange'?'今年は在籍課程の進級を休み、帰国後に続きから学びます。':x.id==='overseas_work'?'現職の給与を休み、海外就労の手取り135万円を得ました。':'ことばと新しい視点が残りました。'}`});}else{if(x.id==='counsel'){s.stats.stress-=15;s.stats.health+=4;s.stats.happiness+=3;}if(x.id==='mentor')s.stats.stress-=6;if(x.id==='club')s.stats.connections+=4;if(x.id==='local'){s.impact+=8;s.stats.connections+=5;}report.push({kind:'life',text:`${x.name}。${x.id==='interview'?'面接の技術が伸びました。人柄そのものとは別の経験です。':x.id==='moneyclass'?'金融知識が伸び、口座や事業の手続きへ近づきました。':'選んだ経験が、これからの準備になりました。'}`});}log(s,x.name,'時間を使って、新しい経験に取り組んだ。','experience');}}
 const j=job(s);if(j&&!s.retired){
  if(s.plan.workstyle!=='office'&&!D.REMOTE_JOBS.includes(j.id)){s.plan.workstyle='office';report.push({kind:'life',text:'現在の職種は現場での勤務が中心です。リモートの予定を出勤に調整しました。'});}
  if(s.plan.workstyle==='remote'){s.stats.stress-=3;s.stats.connections-=2;s.inner.fatigue-=3;if(a.social===0)s.inner.workReputation-=2;}else if(s.plan.workstyle==='hybrid'){s.stats.stress-=1.5;s.inner.fatigue-=1.5;}
  if(s.plan.networking==='lunch'){s.stats.connections+=3;s.inner.empathy+=1;}else if(s.plan.networking==='party'&&s.age>=20&&!s.nextVersion){s.stats.connections+=5;s.inner.fatigue+=2;if(s.plan.alcohol!=='none')s.body.alcoholDependence+=1.5;}
  s.inner.workReputation+=(s.inner.integrity-45)*.035+(s.stats.discipline-40)*.012;
  if(s.inner.integrity<25&&s.jobYears>=2){s.stats.trust-=5;s.inner.workReputation-=5;report.push({kind:'fail',text:'面接では伝わらなかった約束の扱いが、日々の仕事で見えてきました。説明と信頼回復が必要です。'});}
  if(j.sector==='hospitality'){s.inner.fatigue+=3;s.stats.health-=1.5;s.inner.interview+=1.3;}
  if(j.sector==='media'){s.inner.reach+=a.creative*1.3;s.inner.audienceQuality+=(s.inner.integrity-45)*.06;}
 }
 s.inner.empathy+=a.social*.3-.3;s.inner.resilience+=a.rest*.25+(s.stats.connections>40?.2:0)-.5;
 s.inner.fatigue+=a.work*1.5+a.study*.6-(a.rest*1.8+a.health*.4);s.stats.stress+=Math.max(0,s.inner.fatigue-65)*.035;
 const pattern=[s.plan.focus,s.plan.project,s.job,s.plan.experience||'',s.plan.relation].join('|');s.patternYears=pattern===s.lastPattern?s.patternYears+1:0;s.lastPattern=pattern;
 s.inner.novelty=clamp(s.inner.novelty+(s.plan.experience?8:0)-(s.patternYears>3?2:0));if(s.inner.novelty<25)s.stats.happiness-=1.2;
 if(s.age>=20){const b=s.body;
  if(!s.nextVersion){
  if(s.plan.alcohol==='social'){s.stats.happiness+=1;b.alcoholDependence+=.35;}else if(s.plan.alcohol==='frequent'){s.stats.happiness+=2;s.stats.stress-=2;s.stats.health-=3;b.alcoholDependence+=5;b.burden+=2;}else b.alcoholDependence-=4;
  if(s.plan.tobacco==='regular'){s.stats.stress-=2;s.stats.health-=3;b.tobaccoDependence+=7;b.burden+=2.5;}else{if(s.plan.tobacco==='quit'&&b.tobaccoDependence>5){s.stats.stress+=2;report.push({kind:'life',text:'禁煙の支援を受け、習慣を変える一年に。依存の傾向は少しずつ下がります。'});}b.tobaccoDependence-=s.plan.tobacco==='quit'?12:5;}
  }
  if(s.plan.gambling!=='none'){const stake=s.plan.gambling==='small'?1:12;const r=rand(s),gross=r<.63?0:r<.94?stake*1.4:stake*4;s.cash+=gross;s.stats.happiness+=1;b.gamblingDependence+=stake===1?1:6;s.inner.lossChasing+=gross<stake?2:-1;report.push({kind:gross>=stake?'life':'fail',text:`公営競技：予算${stake}万円、払戻し${gross.toFixed(1)}万円。借入や追加賭けは行わず、今年の上限で終了しました。`});}else{b.gamblingDependence-=5;s.inner.lossChasing-=2;}
  if(Math.max(b.alcoholDependence,b.tobaccoDependence,b.gamblingDependence)>65){s.stats.stress+=3;s.stats.happiness-=2;report.push({kind:'life',text:'習慣を変えにくくなっています。生活習慣の設定や相談の年テーマで、少しずつ負担を減らせます。'});}
 }
 normalize(s);
}
function yearEnd(s,report,rand){
 const r=D.SCHOOL_ROUTES.find(x=>x.id===s.plan.school);if(r){const why=schoolEligible(s,r.id);if(why)report.push({kind:'fail',text:`進路：${why}`});else if(root.LifeNext&&!root.LifeNext.payEducation(s,r.fee)){report.push({kind:'fail',text:r.name+'：受験料が不足して出願を見送った。'});}else{if(!root.LifeNext)s.cash-=r.fee;if(rand(s)<schoolProbability(s,r.id)){if(r.stage==='middle')s.school.middle=r.id;else if(r.id==='kosen'){s.highschool='none';s.school.ronin=false;s.education={kind:'kosen',name:'高等専門学校 工学系本科',field:'tech',total:5,progress:0,tuition:24,mode:'full',paused:false};if(s.job!=='parttime')s.job=null;}else{s.school.secondary=r.id;s.school.hsTotal=r.id==='high_evening'?4:3;s.highschool=['high_evening','high_remote'].includes(r.id)?'remote':'full';s.school.ronin=false;}report.push({kind:'success',text:`${r.name}へ。来年から新しい学びが始まります。`});log(s,'新しい教室へ',r.name,'education');}else{report.push({kind:'fail',text:`${r.name}には届きませんでした。地元の学校や通信制などから学びを続け、別の進学機会にも挑めます。`});s.inner.resilience+=3;}}}
 if(s.education?.kind==='college')s.school.ronin=false;
 if(s.venture){s.venture.years++;if(s.venture.registered){const gain=Math.max(0,(s.skills.business-80)*3+s.stats.trust*2-100);s.cash+=gain;report.push({kind:'life',text:`金融事業の今年の利益（運営費控除前）：${gain.toFixed(1)}万円。顧客の信頼と管理体制が事業を支えます。`});if(s.inner.integrity<25){s.venture.registered=false;s.stats.trust-=10;report.push({kind:'fail',text:'管理体制と説明に問題があり、金融事業を停止。資本の整理と管理体制の改善後に再申請できます。'});}}}
 s.account.credit+=s.debt>400?-4:s.cash>20?1:0;
 healthYear(s,report,rand);normalize(s);
}
function healthYear(s,report,rand){const b=s.body,a=s.plan.allocation;
 b.burden+=Math.max(0,s.stats.stress-60)*.025+Math.max(0,45-s.stats.health)*.03-(a.health>=2?.7:0);
 if(s.plan.care==='prevent'){b.burden-=2;s.stats.health+=1.5;}if(s.plan.care==='treatment'){b.severity-=7;s.stats.health+=3;s.stats.stress-=2;}
 const risk=clamp((s.age<35?0:.002+(s.age-35)*.0007)+b.burden*.00045,0,.12)*(s.plan.care==='prevent'?.65:1);
 if(!b.condition&&s.age>=35&&rand(s)<risk){b.condition=b.burden>45?'継続的な治療が必要な病気':'経過を見ながら治療する病気';b.severity=24;b.critical=0;report.push({kind:'life',text:'検査で病気が分かりました。生活習慣の「通院・療養」と休息で負担を調整できます。病名・経過はゲーム用の抽象表現です。'});log(s,'体調と向き合う',b.condition,'health');}
 else if(b.condition){b.severity+=3+Math.max(0,s.age-60)*.12+Math.max(0,b.burden-35)*.06-(a.rest+a.health)*.7;s.stats.health-=Math.max(1,b.severity*.045);
  if(b.severity<=0){b.condition=null;b.severity=0;b.critical=0;report.push({kind:'success',text:'治療と生活の調整が続き、病状は落ち着きました。無理のないペースを続けます。'});log(s,'病状が落ち着く','相談と生活の見直しが続いた。','health');}
 }
 if(s.age>=75)b.frailty+=1.1+(s.age-75)*.32+Math.max(0,60-s.stats.health)*.035-(a.health>=3?.3:0);
 if(b.condition&&b.severity>=80&&s.stats.health<25){b.critical++;report.push({kind:'life',text:'病状は重く、治療と日々の支えが欠かせない状態です。医療や身近な人と今後の生活を相談します。'});}else b.critical=Math.max(0,b.critical-1);
 if(s.lifeMode==='natural'&&b.critical>=3){s.finished=true;s.endCause='病気';log(s,'人生のページを閉じる',`${s.age+1}歳。病気と向き合った時間も、大切にした人や残したものも、この一冊に残った。`,'end');report.push({kind:'life',text:`${s.age+1}歳、病気により人生の幕を閉じました。これまでの選択を記録で振り返れます。`});}
 else if(s.lifeMode==='natural'&&s.age>=85&&b.frailty>=88){s.finished=true;s.endCause='老衰';log(s,'長い日々の、その先に',`${s.age+1}歳。年齢とともに体の力が静かに弱まり、人生のページを閉じた。`,'end');report.push({kind:'life',text:`${s.age+1}歳、老衰により人生の幕を閉じました。積み重ねた時間は記録に残ります。`});}
}
function investmentReturn(s,econ,rand){const style=s.plan.investmentStyle;if(style==='reserve')return .005;const swing=(rand(s)-.5)*.16;if(style==='growth')return (econ.market+swing)*1.65+.01;return econ.market+swing;}
function action(s,type){
 if(!s.expansion)return null;if(s.finished)return'人生は完結しています';
 const once=key=>s.actionsThisYear.includes(key);const done=(key,title,text)=>{s.actionsThisYear.push(key);log(s,title,text);normalize(s);return'';};
 if(type.startsWith('campus:')){const id=type.split(':')[1];if(!D.CAMPUS[id])return'学び方が見つかりません';if(s.age<6||s.age>=15)return'小中学校の期間に選べます';if(once('campus'))return'今年は学び方を変更済みです';s.school.attendance=id;return done('campus','学ぶ場所を選び直す',D.CAMPUS[id].name+'。小中学校の学籍を退学扱いにはせず、学びを続ける。');}
 if(type==='high-dropout'){if(s.age<15||s.highschoolGrad||s.education||s.highschool==='none')return'高校在学中に選べます';if(once('high-route'))return'今年は高校の学び方を変更済みです';s.highschool='none';s.plan.school=null;return done('high-route','高校を離れる','履修した分と身につけた力は残す。再入学・高認・仕事へ選び直せる。');}
 if(type==='ronin'){if(s.age<17||s.education||!(s.highschoolGrad||s.certs.highschool!==undefined))return'高校修了相当の資格を得て、在籍課程を離れてから選べます';if(once('ronin'))return'今年は設定済み';s.school.ronin=!s.school.ronin;return done('ronin','受験への時間',s.school.ronin?'年数の上限を設けず、進学への準備を続ける。':'受験だけに限らず、自分の道を考える。');}
 if(type==='account'||type==='account-assisted'){
  if(s.age<18)return'18歳から手続きできます';if(s.account.open)return'口座は開設済みです';if(once('account'))return'今年の手続きは実施済みです';
  s.account.attempts++;const assisted=type==='account-assisted';if(!assisted&&(s.inner.financial<25||s.inner.digital<20)){log(s,'証券口座の申請で立ち止まる','必要な用語や確認手順が分からなかった。金融・デジタル手続きの勉強、または相談付き開設へ。');return'金融理解25・手続き力20が必要です。「学ぶ経験」で準備するか、相談付き開設を選べます。';}
  if(assisted&&s.cash<1)return'相談付き手続きの費用1万円が必要';if(assisted){s.cash-=1;s.inner.financial+=5;s.inner.digital+=5;}s.account.open=true;return done('account','自分で理解して、口座をひらく',assisted?'分からない部分は相談し、書類と説明を確認した。':'必要な説明と本人確認を終えた。信用スコアだけで一般の現物口座を拒否する設定にはしていない。');
 }
 if(type.startsWith('venture:')){if(s.age<18)return'18歳から挑戦できます';if(once('venture'))return'今年は事業方針を変更済み';const id=type.split(':')[1],v=D.VENTURES.find(v=>v.id===id);if(!v)return'事業が見つかりません';if(s.venture?.capital)return'先に金融事業を閉じて資本を整理してください';if(s.skills.business<30)return'会計・経営30以上が必要';if(s.cash<v.cost)return`準備費用${v.cost}万円が必要`;s.cash-=v.cost;s.venture={kind:id,registered:false,years:0};s.plan.project='startup';return done('venture','事業の種をまく',v.name+'。まず小さく準備を始めた。');}
 if(type==='broker-register'){
  if(s.venture?.kind!=='brokerage')return'まず証券会社の設立計画を始めます';if(s.venture.registered)return'登録済みです';if(s.venture.capital)return'停止中の金融事業を閉じて資本を整理してから再申請できます';if(once(type))return'今年は申請済み';
  const reasons=[];if(s.cash<5100)reasons.push('現金5,100万円（運転資本5,000・準備費100）');if(s.skills.business<100||s.skills.law<80)reasons.push('会計経営100・法律80');if(s.inner.integrity<60||s.inner.workReputation<55||s.stats.trust<60)reasons.push('誠実さ60・実務信用55・人望60');if(s.inner.financial<65||s.inner.digital<45)reasons.push('金融理解65・手続き力45');if(s.account.credit<45||s.debt>400)reasons.push('家計信用45以上・生活債務400万円以下');if(s.venture.years<2)reasons.push('2年以上の準備');if(reasons.length)return'ゲーム内審査の不足：'+reasons.join('、');
  s.cash-=5100;s.venture.capital=5000;s.venture.registered=true;return done(type,'金融事業の審査を通過','管理体制・資本・説明責任を備え、営業を開始。実際の登録要件を完全には再現しないゲーム内手続き。');
 }
 if(type==='broker-close'){if(!s.venture?.capital)return'金融事業の運転資本はありません';s.cash+=s.venture.capital*.9;s.venture.capital=0;s.venture.registered=false;return done(type,'金融事業を閉じる','整理費用10%を控除し、運転資本を個人の現金へ戻した。');}
 if(type.startsWith('move:')){const id=type.split(':')[1],p=D.PREFECTURES.find(p=>p.id===id);if(!p)return'都道府県を選んでください';if(s.age<18)return'18歳から';if(s.prefecture===id)return'現在の都道府県です';if(s.home)return'持ち家を売却してから';if(once('move'))return'今年は引越済み';if(s.cash<25)return'引越費用25万円が必要';s.cash-=25;s.prefecture=id;s.region=p.metro?'metro':'local';return done('move','暮らす場所を選ぶ',p.name+'へ。生まれた場所の記録は残る。');}
 if(type==='kosen-transfer'){
  if(s.education)return'在籍課程の修了・退学後に';if(!s.degrees.some(d=>d.kind==='kosen'))return'高専本科の卒業が必要';if(s.cash<28)return'入学準備費28万円が必要';if(s.skills.tech<70||s.skills.math<50)return'技術70・数学50以上を準備';s.cash-=28;s.education={kind:'college',name:'工学系大学への編入課程（ゲーム内代表課程）',field:'tech',total:2,progress:0,tuition:54,mode:'full',paused:false};if(s.job!=='parttime')s.job=null;return done(type,'高専から大学へ','実際の編入先・年次は学校により異なる。本作では工学系の2年間の代表課程として進学。');
 }
 return null;
}
function insights(s){const level=(n,labels)=>labels[n<30?0:n<65?1:2];return[{name:'言葉と行動',text:level(s.inner.integrity,['約束と行動のずれが目立つ','約束を意識し始めている','丁寧に信頼を積んでいる'])},{name:'人へのまなざし',text:level(s.inner.empathy,['相手の事情を知る余地がある','相手の話を聞ける','違う立場にも気を配れる'])},{name:'立て直す力',text:level(s.inner.resilience,['負担を抱えやすい','支えを使って立ち直れる','自分なりの回復の仕方がある'])},{name:'見えない疲れ',text:level(s.inner.fatigue,['余白のある日々','少し疲れが積もっている','休息と負担調整が必要'])},{name:'仕事の信用',text:level(s.inner.workReputation,['説明や約束を見直したい','仕事の積み重ねが見え始める','安心して任される関係'])},{name:'習慣との距離',text:level(Math.max(s.body.alcoholDependence,s.body.tobaccoDependence,s.body.gamblingDependence),['今は自分で距離を取りやすい','少し習慣に引かれ始めている','変えるために支援が役立つ'])}];}
function validate(s){if(s.expansion!==2||!D.ORIGINS[s.origin]||!D.PREFECTURES.some(p=>p.id===s.birthPref)||!D.PREFECTURES.some(p=>p.id===s.prefecture)||!['natural','century'].includes(s.lifeMode))return false;const num=(v,min=0,max=100)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(!s.inner||innerKeys.some(k=>!num(s.inner[k]))||!s.subjects||Object.keys(D.SUBJECTS).some(k=>!num(s.subjects[k],0,200)))return false;
 if(!s.family||!num(s.family.warmth)||!num(s.family.pressure)||!s.body||!num(s.body.critical,0,100)||['burden','severity','frailty','alcoholDependence','tobaccoDependence','gamblingDependence'].some(k=>!num(s.body[k])))return false;
 if(s.body.condition!==null&&typeof s.body.condition!=='string')return false;
 if(s.school?.kosenThree!==undefined&&typeof s.school.kosenThree!=='boolean')return false;
 if(!s.school||!D.CAMPUS[s.school.attendance]||!D.SCHOOL_ROUTES.some(r=>r.stage==='middle'&&r.id===s.school.middle)||!D.SCHOOL_ROUTES.some(r=>r.stage==='high'&&r.id===s.school.secondary)||!num(s.school.hsProgress,0,4)||![3,4].includes(s.school.hsTotal)||!num(s.school.roninYears,0,101)||typeof s.school.ronin!=='boolean')return false;
 if(!s.arcs||Object.entries(s.arcs).some(([k,v])=>!D.ARCS[k]||!Number.isInteger(v.stage)||v.stage<0||v.stage>D.ARCS[k].ids.length||!num(v.nextAge,0,101)))return false;
 if(!s.account||typeof s.account.open!=='boolean'||!num(s.account.credit)||!num(s.account.attempts,0,10000))return false;
 if(!D.CURRICULA[s.plan.curriculum]||!Array.isArray(s.plan.subjectWeights)||s.plan.subjectWeights.length!==Object.keys(D.SUBJECTS).length||s.plan.subjectWeights.some(n=>!Number.isInteger(n)||n<0||n>12)||s.plan.subjectWeights.reduce((a,b)=>a+b,0)>12)return false;
 if(s.age<20&&['alcohol','tobacco','gambling'].some(k=>s.plan[k]!=='none'))return false;
 if(s.plan.school&&s.plan.admission)return false;
 if(s.plan.school&&!D.SCHOOL_ROUTES.some(r=>r.id===s.plan.school)||s.plan.experience&&!D.EXPERIENCES.some(x=>x.id===s.plan.experience))return false;
 for(const k of Object.keys(D.LIFESTYLE))if(!D.LIFESTYLE[k].some(x=>x[0]===s.plan[k]))return false;
 if(!['exam','interview'].includes(s.plan.admissionMethod)||!['reserve','balanced','growth'].includes(s.plan.investmentStyle))return false;
 if(s.venture&&(!D.VENTURES.some(v=>v.id===s.venture.kind)||typeof s.venture.registered!=='boolean'||!num(s.venture.years,0,101)||s.venture.capital!==undefined&&!num(s.venture.capital,0,1000000)))return false;
 if(!s.storyFlags||!s.experienceCounts||!s.admissionAttempts||typeof s.lastPattern!=='string'||!num(s.patternYears,0,101)||!num(s.visits,0,1500))return false;return true;
}
root.LifeSystems={init,migrate,plan,normalize,pref,certainty,schoolLabel,schoolEligible,schoolProbability,subjectRequirements,admissionScore,train,experienceEligible,extraBudget,salaryFactor,jobGate,jobScore,onHire,storyEvent,onChoice,afterTrain,yearEnd,investmentReturn,action,insights,validate};
})(typeof window!=='undefined'?window:globalThis);
