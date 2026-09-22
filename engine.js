(function(root){
'use strict';
const D=root.LifeData,X=root.LifeSystems,N=root.LifeNext,A=root.LifeAdmissions;
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const round=v=>Math.round(v*100)/100;
const sum=a=>a.reduce((x,y)=>x+y,0);
const copy=o=>JSON.parse(JSON.stringify(o));
const find=(list,id)=>list.find(x=>x.id===id);
function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0||1;}
function random(s){let a=s.rng+=0x6D2B79F5;a=Math.imul(a^a>>>15,a|1);a^=a+Math.imul(a^a>>>7,a|61);s.rng=s.rng>>>0;return((a^a>>>14)>>>0)/4294967296;}
function addLog(s,title,text='',kind='life'){s.history.unshift({age:s.age,title,text,kind});if(s.history.length>800)s.history.length=800;}
function defaultPlan(age,previous){return {allocation:previous?.allocation?copy(previous.allocation):age<6?{study:2,work:1,health:2,social:3,creative:2,rest:2}:{study:4,work:1,health:2,social:2,creative:1,rest:2},focus:previous?.focus||'balanced',ai:previous?.ai||'off',project:previous?.project||'none',exams:[],admission:null,job:null,event:null,relation:'none',funding:true,...X.plan(age,previous)};}
function phase(age){return age<6?'幼年期':age<12?'小学生':age<15?'中学生':age<18?'青年期':age<30?'ひろがる世界':age<45?'自分の歩幅':age<65?'実りの季節':age<80?'新しい自由':'重ねる日々';}
function netWorth(s){return round(s.cash+s.investments+(s.home?.value||0)+(s.venture?.capital||0)-s.debt-(s.home?.loan||0));}
function itemBonus(s,key){return D.ITEMS.reduce((n,i)=>{const owned=s.items.find(o=>o.id===i.id);return n+(owned&&(!i.maxAge||s.age<=i.maxAge)?(i[key]||0):0);},0);}
function hasDegree(s,field){return s.degrees.some(d=>d.kind==='college'&&(!field||d.field===field));}
function hasGraduate(s,kind){return s.degrees.some(d=>d.kind===kind);}
function finishingCourse(s){return s.education&&!s.education.paused&&s.education.progress>=s.education.total-1&&!(s.plan.experience==='exchange'&&!X.experienceEligible(s,'exchange'));}
function educationName(s){if(s.expansion&&!s.education&&X.schoolLabel(s))return X.schoolLabel(s);if(s.education)return s.education.name+(s.education.paused?'（休学）':'');if(s.age<6)return '未就学・家庭での遊びと生活';if(s.age<12)return'小学校';if(s.age<15)return'中学校';if(s.age<18&&s.highschool!=='none')return s.highschool==='remote'?'通信制高校':'高校';return s.degrees.length?s.degrees[s.degrees.length-1].name+' 修了':s.highschoolGrad?'高校卒業':s.certs.highschool!==undefined?'高卒認定合格':'学校には在籍していない';}
function newGame(options={}){
 const background=D.BACKGROUNDS[options.background]?options.background:'standard';const trait=D.TRAITS[options.trait]?options.trait:'curious';const seed=String(options.seed||Math.floor(Math.random()*1e8)).slice(0,40);
 const s={version:D.VERSION,name:String(options.name||'こはる').trim().slice(0,16)||'こはる',seed,rng:hash(seed),age:0,background,trait,region:options.region==='metro'?'metro':'local',stats:{health:85,happiness:75,stress:8,trust:35,connections:15,discipline:22},skills:Object.fromEntries(Object.keys(D.SKILLS).map(k=>[k,0])),cash:D.BACKGROUNDS[background].cash,investments:0,debt:0,home:null,items:[],certs:{},licenses:[],examAttempts:{},highschool:'full',highschoolGrad:false,education:null,degrees:[],job:null,jobYears:0,experience:{},retired:false,pensionYears:0,partner:null,children:[],care:0,impact:0,projects:{},royalties:0,plan:defaultPlan(0),eventId:null,seenEvents:[],economy:'normal',marketReturn:0,history:[],ledger:null,wealthHistory:[],achievements:[],purchasesThisYear:[],actionsThisYear:[],finished:false,report:null,studentAid:true,settings:{sound:false,reducedMotion:false},statsTotal:{health:0,happiness:0,trust:0,connections:0,years:0},totals:{income:0,spending:0,tax:0,peakWealth:0},highestEducation:0};
 X.init(s,options,random);addLog(s,'はじまりの日',`${s.name}の人生が、ここから始まる。`);prepareYear(s);s.wealthHistory.push({age:0,wealth:netWorth(s)});return s;
}
function eventCondition(s,e){return !e.condition||(e.condition==='partner'&&s.partner)||(e.condition==='children'&&s.children.some(c=>c.age<18))||(e.condition==='employed'&&s.job)||e.condition===s.plan.project;}
function prepareYear(s){
 N.academicYear(s);
 const candidates=D.EVENTS.filter(e=>!e.arc&&e.min<=s.age&&e.max>=s.age&&eventCondition(s,e));const fixed=candidates.find(e=>e.min===e.max&&e.min===s.age);
 let pool=candidates.filter(e=>!s.seenEvents.includes(e.id));if(!pool.length)pool=candidates.filter(e=>!s.seenEvents.slice(-5).includes(e.id));if(!pool.length)pool=candidates;
 const story=X.storyEvent(s,random);const selected=(story?.arc==='crisis'?story:null)||fixed||story||pool[Math.floor(random(s)*pool.length)];s.eventId=selected?.id||'freeafternoon';s.plan.event=null;
 const r=random(s);s.economy=r<.42?'normal':r<.60?'recovery':r<.73?'boom':r<.87?'recession':r<.92?'shock':'culture';
 // Asset returns are not exposed in advance. A saved year has a fixed hidden seed.
 s.purchasesThisYear=[];s.actionsThisYear=[];
}
function getEvent(s){return s.pacing==='term'&&s.period<2?N.termEvent(s):root.LifeChapters.narrative(s,find(D.EVENTS,s.eventId));}
function totalTime(s){return sum(Object.values(s.plan.allocation));}
function skillAdd(s,key,value){if(!(key in s.skills))return;s.skills[key]=clamp(s.skills[key]+value*(1-s.skills[key]/300),0,200);}
function train(s){
 const a=s.plan.allocation,t=D.TRAITS[s.trait];const tooYoung=s.age<3?.5:s.age<6?.72:1;
 let efficiency=(1+itemBonus(s,'study'))*(t.study||1)*D.BACKGROUNDS[s.background].learning*(s.stats.health<35?.68:1)*(s.stats.stress>75?.68:1);
 if(s.age>=6&&s.age<15)efficiency*=D.CAMPUS[s.school.attendance].learning;
 efficiency*=s.autoActive?.9:1;const ai=s.age>=16&&(s.age>=18||s.parents.aiConsent)?s.plan.ai:'off';if(ai==='verify')efficiency*=1.16;if(ai==='paid')efficiency*=1.27;if(ai==='delegate')efficiency*=.83;
 let amount=Math.max(0,a.study-(s.plan.drivingPractice?2:0))*2.5*efficiency*tooYoung;
 if(s.plan.focus==='balanced')for(const k of ['language','math','english'])skillAdd(s,k,amount*.43);
 else skillAdd(s,s.plan.focus,amount);
 if(s.age>=6&&s.age<18&&(s.age>=15?s.highschool!=='none':s.school.attendance!=='home')){for(const k of ['language','math','english'])skillAdd(s,k,s.age<12?1.6:2);skillAdd(s,'science',1.2);}
 if(s.age>=6&&s.age<16)skillAdd(s,'tech',a.work*1.5);
 if(s.age<6){skillAdd(s,'language',1.2);skillAdd(s,'math',.7);skillAdd(s,'tech',a.work*.8);}
 if(s.education&&!s.education.paused){const f=D.FIELDS[s.education.field]||D.FIELDS.social;skillAdd(s,f.skill,5.5);skillAdd(s,f.second,2.2);}
 const job=find(D.JOBS,s.job);if(job&&!s.retired){skillAdd(s,job.skill,1.8+a.work*.5);skillAdd(s,'business',.5);}
 skillAdd(s,'sports',a.health*1.9);skillAdd(s,'arts',a.creative*1.5*(t.creative||1)*(1+itemBonus(s,'creative')));
 const p=find(D.PROJECTS,s.plan.project);if(p&&p.id!=='none'&&s.skills[p.skill]>=p.need)skillAdd(s,p.skill,a.creative*.7);
 if(ai!=='off')skillAdd(s,'tech',ai==='delegate'?.3:1.5);
 s.stats.discipline=clamp(s.stats.discipline+a.study*.35+a.work*.2-1.2);X.train(s,skillAdd,efficiency,amount);
}
function projected(s){const n=copy(s);N.trainingFraction(n,train,s.pacing==='term'?(3-s.period)/3:1);return n;}
function examEligibility(s,e,allowPlanned=false){
 if(!e)return '試験が見つかりません';if(e.id==='driver')return '教習所の学科・技能と本免試験を「免許・移動」で進めてください';if(s.certs[e.id]!==undefined){if(e.id==='prebar'&&s.age-s.certs[e.id]>=5){}else if(e.id==='cpa_short'&&s.age-s.certs[e.id]>=3){}else return'取得済み';}
 if(s.age<(e.minAge||0))return`${e.minAge}歳から（ゲーム内の実施時点）`;
 if(e.degree&&!hasDegree(s,e.degree)&&!(allowPlanned&&s.education?.kind==='college'&&s.education.field===e.degree&&finishingCourse(s)))return`${D.FIELDS[e.degree].name}課程の卒業が必要`;
 if(e.sixYears&&!s.degrees.some(d=>d.field===e.degree&&d.total>=6)&&!(allowPlanned&&s.education?.field===e.degree&&s.education.total>=6&&finishingCourse(s)))return '6年制課程の卒業が必要';
 if(e.requires&&s.certs[e.requires]===undefined&&!(allowPlanned&&e.id==='cpa'&&s.plan.exams.includes(e.requires)))return`${find(D.EXAMS,e.requires)?.name}の合格が必要`;
 if(e.id==='cpa'&&s.certs.cpa_short!==undefined&&s.age-s.certs.cpa_short>2)return'短答免除期間が終了。短答式を再受験';
 if(e.id==='bar'){
  const pre=s.certs.prebar!==undefined&&s.age-s.certs.prebar>=1&&s.age-s.certs.prebar<=5;
  const law=s.degrees.some(d=>d.kind==='lawschool'&&s.age-d.age>=0&&s.age-d.age<5);
  if(!pre&&!law)return'予備試験合格の翌年から5年、または法科大学院修了後5年以内';
 }
 return '';
}
function examProbability(s,e,forecast=true){
 if(examEligibility(s,e,forecast))return 0;const n=forecast?projected(s):s;
 let level=N.examLevel(n,e,n.skills[e.skill]);if(e.second)level=.86*level+.14*n.skills[e.second];
 const prepBonus=1+itemBonus(s,'exam');level*=prepBonus;
 if(level<e.threshold*.52)return 0;
 const value=level+(n.stats.discipline-45)*.1-Math.max(0,n.stats.stress-40)*.14+Math.min(8,(s.examAttempts[e.id]||0)*1.5);
 return X.certainty(value,e.threshold);
}
const elite=['東京大学','京都大学'];const selective=['東京科学大学','一橋大学','大阪大学','東北大学','名古屋大学','九州大学','北海道大学','早稲田大学','慶應義塾大学'];
function universityThreshold(u,c){const r=A.route(u,c);return r.deviation??r.commonBorder??u.difficulty;}
function tuition(u,c,mode='full'){if(u.foreign)return{annual:u.cost,entry:30};if(u.name==='放送大学')return{annual:18,entry:2.4};const publicSchool=u.type!=='私立';let annual=publicSchool?54:c.field==='medicine'?370:['dentistry','veterinary'].includes(c.field)?240:c.field==='pharmacy'?190:['tech','science','arts','nursing','healthcare'].includes(c.field)?145:100;return{annual:mode==='night'?annual*.63:annual,entry:publicSchool?28:26};}
function universityEligibility(s,u,c,mode='full',allowExpected=true){
 if(s.age<17)return'17歳の年度から出願できます';if(s.education)return'在学中です。卒業・退学後に出願できます';if(!c)return'学部・学科を選んでください';
 if(!(s.highschoolGrad||s.school.kosenThree||s.degrees.some(d=>d.kind==='kosen')||s.certs.highschool!==undefined||(allowExpected&&s.plan.allocation.study>=2&&N.passingAttendance(s)&&s.age>=17&&s.highschool!=='none'&&s.school.hsProgress>=s.school.hsTotal-1&&!(s.plan.experience==='exchange'&&!X.experienceEligible(s,'exchange')))))return'高校卒業または高卒認定が必要';
 if(mode==='night'&&!c.night&&u.name!=='放送大学')return'この課程には夜間定員の収録がありません';return'';
}
function admissionProbability(s,u,c,forecast=true){return A.estimate(s,u,c,s.plan.applications.find(v=>v.university===u.id&&u.courses[v.course]===c)?.route,forecast).probability;}
function jobEligibility(s,j,forNextYear=true,allowPlanned=true){
 if(!j)return'仕事が見つかりません';const extraGate=X.jobGate(s,j);if(extraGate)return extraGate;const age=s.age+(forNextYear?1:0);if(age<j.minAge)return`${j.minAge}歳から`;
 if(j.cert&&s.certs[j.cert]===undefined&&!(allowPlanned&&s.plan.exams.includes(j.cert)))return`${find(D.EXAMS,j.cert)?.name||j.cert}に合格する必要があります`;
 if(j.license&&!s.licenses.includes(j.license))return'実務・研修・登録の完了が必要';
 const finishing=allowPlanned&&finishingCourse(s);
 if(j.phd&&!hasGraduate(s,'phd')&&!(finishing&&s.education.kind==='phd'))return'博士号が必要';if(j.master&&!hasGraduate(s,'master')&&!hasGraduate(s,'phd')&&!(finishing&&['master','phd'].includes(s.education.kind)))return'修士以上が必要';if(j.degree&&!hasDegree(s)&&!(finishing&&s.education.kind==='college'))return'大学卒業が必要';if(j.impact&&s.impact<j.impact)return`研究・社会貢献 ${j.impact}以上が必要`;
 if(s.education&&!s.education.paused&&s.education.mode==='full'&&!finishing&&j.id!=='parttime')return'全日制の在学中はアルバイトのみ';return'';
}
function jobProbability(s,j,forecast=true){if(jobEligibility(s,j,true,forecast))return 0;const n=forecast?projected(s):s;if(n.skills[j.skill]<j.need*.6)return 0;if(j.id==='parttime')return 1;if(j.selfEmployed)return n.skills[j.skill]>=j.need?1:0;return X.certainty(X.jobScore(n,j),j.need+12,24);}
function salary(s){const j=find(D.JOBS,s.job);if(!j||s.retired||s.age<j.minAge)return 0;const a=s.plan.allocation;let val=j.base*(1+Math.min(s.experience[j.sector]||0,30)*.023+Math.max(0,s.skills[j.skill]-j.need)*.0025)*(j.id==='parttime'?(.45+a.work*.15):(1+a.work*.022));
 val*=find(D.ECONOMIES,s.economy).salary*(1+itemBonus(s,'work'));
 if(['sales','estate','freelance','creative'].includes(j.sector))val*=.78+s.stats.trust*.002+s.stats.connections*.0015;
 if(s.plan.ai==='verify')val*=1.07;if(s.plan.ai==='paid')val*=1.14;if(s.plan.ai==='delegate')val*=1.18;
 if(s.region==='local'&&s.items.some(x=>x.id==='car'))val*=1.06;
 if(s.licenses.includes('takken')&&j.sector==='estate')val+=35;
 if(s.stats.health<35)val*=.7;if(s.age>=70&&!['research','legal','audit','creative','rural','freelance'].includes(j.sector))val*=.74;
 if(j.sector==='sports')val*=clamp(s.stats.health/80,.35,1.15)*(s.age>38?.6:1);
 return round(val*X.salaryFactor(s));
}
function annualBudget(s){
 const earned=salary(s),pension=s.age>=65?85+Math.min(s.pensionYears,40)*2.1:0;
 const support=s.age<18?N.allowance(s):s.education&&s.age<27?D.BACKGROUNDS[s.background].college:0;
 const partnership=s.partner&&s.partner.married?Math.max(0,s.partner.income-(s.children.some(c=>c.age<3)?50:0)):0;
 const businessIncome=(s.projects.startup?.stage||0)*35*(.6+s.skills.business/120)+(s.projects.creative?.stage||0)*8;
 const royalty=s.royalties;const gross=earned+pension+partnership+businessIncome+royalty;
 const tax=earned*(earned>1500?.32:earned>800?.25:earned>450?.21:.16)+partnership*.17+businessIncome*.18+royalty*.18;
 const base=s.age<18?0:(s.region==='metro'?133:103)*X.pref(s.prefecture).cost;
 const rent=s.age<18?0:s.home?12:(s.region==='metro'?88:50)*X.pref(s.prefecture).cost;
 const family=s.partner&&s.partner.married?70:0;
 const childcare=sum(s.children.filter(c=>c.age<22).map(c=>c.age<6?28:c.age<15?35:c.age<18?46:65));
 const fees=s.education?(s.education.paused?10:s.education.tuition):0;
 const upkeep=sum(s.items.map(o=>find(D.ITEMS,o.id)?.upkeep||0));const ai=s.age>=16&&s.plan.ai==='paid'?3.6:0;
 const project=find(D.PROJECTS,s.plan.project);const projectCost=project&&s.plan.allocation.creative>0&&s.age>=12&&s.skills[project.skill]>=project.need?project.cost:0;
 const debtPayment=s.age>=22?Math.min(s.debt,Math.max(12,s.debt*.08)):0;
 const debtInterest=s.debt*.02;const mortgage=s.home?Math.min(s.home.loan,s.home.payment):0;const mortgageInterest=s.home?s.home.loan*.018:0;
 const extra=X.extraBudget(s);const expenses=extra+base+rent+family+childcare+fees+upkeep+ai+projectCost+debtPayment+debtInterest+mortgage+mortgageInterest;
 return N.familyBudget(s,{salary:earned,pension,support,partner:partnership,business:businessIncome,royalty,gross,tax,base,rent,family,childcare,tuition:fees,upkeep,ai,projectCost,debtPayment,debtInterest,mortgage,mortgageInterest,income:gross+support,extra,expenses,net:round(gross+support-tax-expenses)});
}
function effects(s,e,report=[]){if(s.age<18&&e?.cash<0&&!N.payEducation(s,-e.cash)){report.push({kind:'fail',text:'予定した購入・活動の費用が足りず、今回は見送った。'});return;}for(const[k,v]of Object.entries(e||{})){if(k in s.stats)s.stats[k]=clamp(s.stats[k]+v);else if(k in s.skills)skillAdd(s,k,v);else if(k==='cash'&&!(s.age<18&&v<0))s.cash+=v;else if(k==='impact')s.impact+=v;else if(k==='bond'&&s.partner)s.partner.bond=clamp(s.partner.bond+v);else if(k==='childBond')s.children.forEach(c=>{if(c.age<22)c.bond=clamp(c.bond+v)});else if(k==='care')s.care+=v;else if(k==='progress'){const p=s.plan.project;if(p!=='none'){s.projects[p]??={progress:0,stage:0};s.projects[p].progress+=v;}}else if(k==='highschool')s.highschool=v;} }
function relationEligibility(s,type){if(type==='none'||type==='friends'||type==='community')return'';if(s.age<18)return'18歳から選べます';if(type==='meet'&&s.partner)return'すでにパートナーがいます';if(['date','marry','separate'].includes(type)&&!s.partner)return'パートナーとの出会いが必要';if(type==='marry'&&s.partner?.married)return'結婚しています';if(type==='marry'&&s.partner?.bond<65)return'パートナーとの絆65以上が必要';if(type==='child'&&(s.age<22||s.age>50))return'ゲームでは22〜50歳に家族を迎えられます';if(type==='child'&&s.children.length>=4)return'このゲームでは養育する子どもは4人まで';if(type==='child'&&s.cash<25)return'準備費用として現金25万円が必要';return'';}
function processRelations(s,report){
 const r=s.plan.relation;if(relationEligibility(s,r)){report.push({kind:'fail',text:'人間関係の計画は、条件を満たせず見送りました。'});return;}
 if(r==='meet'){
  const chance=clamp(.28+s.plan.allocation.social*.08+s.stats.connections*.002,.1,.92);
  if(random(s)<chance){const names=['はる','あおい','ゆう','りつ','なつ','いおり','みずき','ひなた'];s.partner={name:names[Math.floor(random(s)*names.length)],bond:48,married:false,years:0,income:150+Math.round(random(s)*180)};report.push({kind:'success',text:`${s.partner.name}と出会い、少しずつ関係が始まりました。`});addLog(s,'新しい出会い',`${s.partner.name}との物語が始まった。`,'relationship');}else report.push({kind:'life',text:'出会いの場で交流しました。恋愛以外のつながりも増えました。'});s.stats.connections+=4;s.cash-=3;
 }else if(r==='date'&&s.partner){s.partner.bond+=12;s.stats.happiness+=4;s.cash-=6;report.push({kind:'life',text:'パートナーと、丁寧に向き合う時間を過ごしました。'});}
 else if(r==='marry'&&s.partner){const chance=clamp(.4+s.partner.bond*.005,0,.95);if(random(s)<chance){s.partner.married=true;s.partner.bond+=10;s.cash-=35;s.stats.happiness+=10;report.push({kind:'success',text:`${s.partner.name}と、お互いの意思で結婚しました。来年から家計を一緒にします。`});addLog(s,'ふたりの約束',`${s.partner.name}と結婚。`,'relationship');}else{s.partner.bond-=3;report.push({kind:'life',text:'今は結婚を急がず、話し合いを続けることにしました。'});}}
 else if(r==='child'){s.cash-=25;if(random(s)<.68){const names=['ひかり','そら','ふたば','こよみ'];s.children.push({name:names[s.children.length],age:-1,bond:65,care:0});s.stats.happiness+=8;report.push({kind:'success',text:'新しい家族を迎えました。養育の時間と費用も始まります。'});addLog(s,'家族が増えた','小さな人生を、一緒に育てていく。','relationship');}else report.push({kind:'life',text:'家族を迎える準備を進めました。今年はご縁や条件が整わず、引き続き考えていきます。'});}
 else if(r==='friends'){s.stats.connections+=7;s.stats.happiness+=4;s.cash-=s.age>=18?3:0;}
 else if(r==='community'){s.impact+=7;s.stats.trust+=4;s.stats.connections+=4;}
 else if(r==='separate'){s.partner=null;s.stats.stress+=6;s.stats.happiness-=3;s.cash-=10;report.push({kind:'life',text:'話し合いを経て、別々の暮らしへ。子どもとの関係は続きます。'});addLog(s,'新しい距離','関係を見直し、別の暮らしを選んだ。','relationship');}
}
function progressProjects(s,report){const p=find(D.PROJECTS,s.plan.project);if(!p||p.id==='none'||s.age<12)return;if(s.skills[p.skill]<p.need)return;
 const a={...s.plan.allocation,creative:Math.max(0,s.plan.allocation.creative-(s.plan.codePractice||0)-(s.plan.musicPractice||0)-(s.plan.experience==='club'?1:0))};const st=s.projects[p.id]??={progress:0,stage:0};let rate=(.7+s.skills[p.skill]/130)*(1+itemBonus(s,'creative'))*(D.TRAITS[s.trait].creative||1);
 if(p.id==='research')rate*=hasGraduate(s,'phd')?1.6:hasGraduate(s,'master')?1.28:1;
 if(p.id==='research'&&find(D.JOBS,s.job)?.sector==='research')rate*=1.35;
 if(s.plan.ai==='verify'||s.plan.ai==='paid')rate*=1.12;
 const gain=a.creative*1.25*rate*(s.stats.health<35?.55:1)*(s.stats.stress>80?.5:1)*(.75+random(s)*.5);
 st.progress+=gain;
 if(p.id==='startup'&&a.creative>0&&random(s)<.1){st.progress=Math.max(0,st.progress-7);s.cash-=12;report.push({kind:'fail',text:'事業の売上が伸び悩み、改善に12万円かかりました。'});}
 if(p.id==='research'&&st.stage>=2&&s.skills.science<115){st.progress=Math.min(st.progress,p.milestones[2]-1);}
 while(st.stage<4&&st.progress>=p.milestones[st.stage]){
  const tier=++st.stage;
  const labels={research:['はじめての研究成果','再現性のある発見と特許','実用につながる大発明','広い分野を変える科学的成果'],startup:['はじめての顧客','事業の黒字化','持続的な事業成長','社会に根づいた企業'],creative:['作品を公開','作品が受賞','多くの人に届く代表作','時代を越えて残る作品'],community:['活動の輪が生まれた','地域の居場所が定着','次の世代につながる仕組み','広く活用される社会的な活動'],sports:['地域大会で入賞','全国大会で活躍','国際大会の舞台へ','競技史に残る実績']};
  let impact=tier*tier*(p.id==='research'?20:p.id==='community'?16:9);s.impact+=impact;s.stats.trust+=3+tier;s.stats.happiness+=5;
  if(p.id==='research'){s.cash+=tier*15;s.royalties+=tier*4;}if(p.id==='startup')s.cash+=tier*tier*30;if(p.id==='creative'){s.cash+=tier*30;s.royalties+=tier*5;}if(p.id==='sports')s.cash+=tier*40;
  const title=labels[p.id][tier-1];report.push({kind:'success',text:`${title}。社会への貢献 +${impact}。`});addLog(s,title,`${p.name}で第${tier}段階へ。`,'achievement');
 }
}
function universityById(id){return (root.UNIVERSITIES||[]).find(u=>u.id===id);}
function gradEligibility(s,kind){const finishing=finishingCourse(s);
 if(s.education&&!finishing)return'在籍課程の最終年度から申請できます';
 const bachelor=hasDegree(s)||(finishing&&s.education.kind==='college');const master=hasGraduate(s,'master')||(finishing&&s.education.kind==='master');
 if(!bachelor)return'大学卒業が必要';if(kind==='phd'&&!master&&!s.degrees.some(d=>d.kind==='college'&&d.total===6))return'修士修了、または6年制課程修了が必要';return'';
}
function processEducation(s,report,stage='all'){
 if(stage!=='admission'&&s.education&&!s.education.paused&&!s.studyAbroadYear){const e=s.education;
  if(s.plan.allocation.study>=2&&N.passingAttendance(s)){e.progress++;if(e.kind==='kosen'&&e.progress>=3)s.school.kosenThree=true;report.push({kind:'life',text:`${e.name}：${e.progress}/${e.total}年を修了。`});}
  else {s.stats.stress+=6;report.push({kind:'fail',text:'学習時間が足りず、進級を見送りました。学ぶ時間を2コマ以上にすると安定します。'});}
  if(e.progress>=e.total){const d={...e,age:s.age+1};s.degrees.push(d);s.education=null;s.highestEducation=Math.max(s.highestEducation,{vocational:1,college:2,master:3,lawschool:3,phd:4}[e.kind]||1);s.stats.happiness+=7;s.stats.trust+=5;skillAdd(s,D.FIELDS[e.field].skill,9);report.push({kind:'success',text:`${e.name}を修了しました。`});addLog(s,`${e.name} 修了`,`${s.age+1}歳に卒業。`,'education');
   if(e.field==='education'&&e.kind==='college')report.push({kind:'life',text:'教職課程の履修を記録しました。「仕事」から教員免許・採用の手続へ進めます。'});
  }
 }
 if(stage==='progress')return;
 if(s.plan.applications.length){A.settle(s,report,random);return;}
 const ap=s.plan.admission;if(!ap)return;
 if(ap.kind==='college'){const u=universityById(ap.university),c=u?.courses[ap.course];if(u&&c){s.plan.applications=[{university:u.id,course:ap.course,mode:ap.mode||'full',route:A.route(u,c).id}];s.plan.admission=null;A.settle(s,report,random);}return;}
 if(['master','phd','lawschool','vocational'].includes(ap.kind)){
  if(ap.kind!=='vocational'&&gradEligibility(s,ap.kind)){report.push({kind:'fail',text:'大学院の入学条件がまだ揃っていません。'});return;}
  if(s.education)return;if(s.age<17)return;
  const last=s.degrees.filter(d=>d.kind==='college').slice(-1)[0];const field=ap.kind==='lawschool'?'law':ap.field||last?.field||'tech';
  const defs={master:['大学院 修士課程',2,54],phd:['大学院 博士課程',last?.total===6?4:3,54],lawschool:['法科大学院',last?.field==='law'?2:3,90],vocational:['専門職の学び直し課程',2,85]};const[name,total,fee]=defs[ap.kind];
  s.cash-=ap.kind==='vocational'?10:28;s.education={kind:ap.kind,name,field,total,progress:0,tuition:fee,mode:ap.mode||'full',paused:false};if(s.education.mode==='full'&&s.job!=='parttime')s.job=null;
  report.push({kind:'success',text:`${name}で${total}年間の学びを始めます。`});addLog(s,'新しい学び',name,'education');
 }
}
function handleExperience(s,report){const j=find(D.JOBS,s.job);if(!j||s.retired)return;s.experience[j.sector]=(s.experience[j.sector]||0)+1;s.jobYears++;if(s.age>=20)s.pensionYears++;
 if(j.id==='audit'&&s.experience.audit>=3&&!s.licenses.includes('cpa'))report.push({kind:'success',text:'公認会計士登録に必要な業務補助3年を達成。「仕事」で実務補習・修了考査・登録手続に進めます。'});
 if(j.id==='legal_trainee'&&!s.licenses.includes('lawyer')){s.licenses.push('lawyer');report.push({kind:'success',text:'司法修習と修了試験を終え、法曹資格を得ました。弁護士に応募できます。'});addLog(s,'法曹資格を取得','司法修習を修了。','career');}
 if(j.id==='resident'&&(s.experience.medical||0)>=2&&!s.licenses.includes('doctor')){s.licenses.push('doctor');report.push({kind:'success',text:'2年の初期臨床研修を修了しました。医師の求人に応募できます。'});addLog(s,'初期臨床研修を修了','','career');}
 if(j.id==='dentist_trainee'&&!s.licenses.includes('dentist')){s.licenses.push('dentist');report.push({kind:'success',text:'1年の歯科臨床研修を修了しました。'});}
 if(['care','medical','education','public','social','legal'].includes(j.sector))s.impact+=j.sector==='medical'?4:2.8;
}
function score(s){const years=s.statsTotal.years||1;const avgH=s.statsTotal.years?s.statsTotal.happiness/years:s.stats.happiness;const avgHealth=s.statsTotal.years?s.statsTotal.health/years:s.stats.health;
 const wealth=clamp(Math.log10(Math.max(0,netWorth(s))+1)/5*100);
 const wellbeing=clamp(avgH*.62+avgHealth*.38);const bonds=s.partner?s.partner.bond:0;const childAvg=s.children.length?sum(s.children.map(c=>c.bond))/s.children.length:0;
 const relation=clamp(s.stats.trust*.5+Math.max(s.stats.connections,bonds,childAvg,...(s.social?.friends||[]).map(f=>f.bond))*.5);
 const contribution=clamp(Math.log10(1+s.impact)/3.1*100);
 const raw=wealth*.45+wellbeing*.25+relation*.15+contribution*.15;
 const trustFactor=.65+.35*s.stats.trust/100;
 return{total:round(raw*trustFactor),wealth:round(wealth),wellbeing:round(wellbeing),relation:round(relation),contribution:round(contribution),trustFactor:round(trustFactor),raw:round(raw)};
}
function unlock(s){const w=netWorth(s);const tests={firstyear:s.age>=1,graduate:hasDegree(s),master:hasGraduate(s,'master'),phd:hasGraduate(s,'phd'),cert5:Object.keys(s.certs).length>=5,cert15:Object.keys(s.certs).length>=15,million:w>=100,tenmillion:w>=1000,hundredmillion:w>=10000,friendship:s.stats.trust>=85,partner:s.partner?.married,parent:s.children.length>0,goodparent:s.children.some(c=>c.age>=18&&c.bond>=80),breakthrough:s.projects.research?.stage>=4,founder:s.projects.startup?.stage>=3,masterpiece:s.projects.creative?.stage>=3,community:s.impact>=300,comeback:s.degrees.some(d=>d.kind==='college'&&d.age>=35),healthy:s.age>=70&&s.stats.health>=80,century:s.age>=100,lawyer:s.licenses.includes('lawyer'),cpa:s.licenses.includes('cpa'),doctor:s.licenses.includes('doctor'),balance:['health','happiness','trust'].every(k=>s.stats[k]>=80)};const fresh=[];for(const [id,pass]of Object.entries(tests))if(pass&&!s.achievements.includes(id)){s.achievements.push(id);fresh.push(id);}return fresh;}
function normalize(s){X.normalize(s);for(const k of Object.keys(s.stats))s.stats[k]=round(clamp(s.stats[k]));for(const k of Object.keys(s.skills))s.skills[k]=round(clamp(s.skills[k],0,200));s.cash=round(s.cash);s.debt=round(Math.max(0,s.debt));s.investments=round(Math.max(0,s.investments));s.impact=round(Math.max(0,s.impact));if(s.partner)s.partner.bond=clamp(s.partner.bond);s.children.forEach(c=>c.bond=clamp(c.bond));}
function advance(s){
 if(s.finished)return{error:'この人生は完結しています。'};const preparationError=N.planError(s);if(preparationError)return{error:preparationError};if(s.age<20&&['alcohol','tobacco','gambling'].some(k=>s.plan[k]!=='none'))return{error:'お酒・タバコ・公営競技は20歳からです。'};if(s.plan.subjectWeights.reduce((a,b)=>a+b,0)!==12)return{error:'教科の学習枠を12枠すべて配分してください。'};if(totalTime(s)!==12)return{error:'12コマの時間をすべて配分してください。'};const event=getEvent(s);if(!Number.isInteger(s.plan.event)||!event.choices[s.plan.event])return{error:'今年のできごとで、ひとつ選んでください。'};
 const dt=s.pacing==='term'?1/3:1,finalPeriod=s.pacing!=='term'||s.period===2,periodName=N.periodTitle(s),chosenAllocation=copy(s.plan.allocation);
 const before={age:s.age,cash:s.cash,wealth:netWorth(s),stats:copy(s.stats),skills:copy(s.skills)};const report=[];if(s.period===0){s.yearStats.startingWealth=netWorth(s);s.yearStats.before=copy(before);}s.termPlans.push({allocation:copy(s.plan.allocation),experience:s.plan.experience,project:s.plan.project,attendance:s.plan.attendance});const socialFocusReason=root.LifeChapters.focusReason(s);const experienceReason=s.plan.experience?X.experienceEligible(s,s.plan.experience):'';s.studyAbroadYear=s.plan.experience==='exchange'&&!experienceReason;const budget=N.periodBudget(s,annualBudget(s));
 N.trainingFraction(s,train,dt);s.cash+=budget.net;if(s.period===0&&s.plan.experience&&!experienceReason)s.yearExperiencePaid=s.plan.experience;s.parents.educationFund-=budget.parentContribution||0;s.debt-=budget.debtPayment;if(s.home){s.home.loan=Math.max(0,s.home.loan-budget.mortgage);s.home.value*=Math.pow(.996,dt);}
 s.totals.income+=budget.income;s.totals.spending+=budget.expenses;s.totals.tax+=budget.tax;
 let a=s.plan.allocation;
 s.stats.stress+=dt*(a.study*1.5+a.work*2+(s.job&&!s.retired?5:0)+(s.education?3:0)-a.rest*4.4-a.health*1.25);
 s.stats.health+=dt*(a.health*2.2+a.rest*.85-3.7-(s.age>=55?(s.age-50)*.12:0)-Math.max(0,s.stats.stress-55)*.15);
 s.stats.happiness+=dt*(a.rest*.8+a.social*.85+a.creative*.4-4.4-Math.max(0,s.stats.stress-65)*.12);
 s.stats.connections+=(a.social*1.4-2.5)*dt;s.stats.trust+=(a.social*.65-.55)*dt;
 for(const k of ['health','happy','stress']){const target=k==='happy'?'happiness':k;s.stats[target]+=itemBonus(s,k)*dt;}
 if(s.plan.ai==='delegate'&&s.age>=16&&random(s)<1-Math.pow(.8,dt)){s.stats.trust-=10;s.cash-=s.job?10:0;report.push({kind:'fail',text:'確認せず使ったAIの出力に誤り。訂正と信頼回復が必要になりました。'});}
 N.perPeriod(s,report,random,dt);if(s.finished){N.coverDeficit(s,report);normalize(s);const all=[...s.termReports.flat(),...report];N.finishYear(s);s.report={age:s.age,nextAge:s.age,periodLabel:periodName,entries:all,before,achievements:[],wealthDelta:round(netWorth(s)-before.wealth),income:round(budget.income),spending:round(budget.expenses)};return{report:s.report};}s.yearStats.income+=budget.income;s.yearStats.spending+=budget.expenses+budget.tax;
 if(!finalPeriod){const choice=event.choices[s.plan.event];effects(s,choice.effects,report);report.push({kind:'life',text:event.title+' — '+choice.label});N.coverDeficit(s,report);normalize(s);s.period++;s.plan.event=null;s.termReports.push(report);s.report={age:s.age,nextAge:s.age,periodLabel:periodName,entries:report,before,achievements:[],wealthDelta:round(netWorth(s)-before.wealth),income:round(budget.income),spending:round(budget.expenses+budget.tax)};return{report:s.report};}
 if(s.pacing==='term'){s.plan.allocation=N.averagedAllocation(s);a=s.plan.allocation;}
 X.afterTrain(s,report,random,experienceReason);const choice=event.choices[s.plan.event];effects(s,choice.effects,report);X.onChoice(s,event,choice,report);report.push({kind:'life',text:`${event.title} — ${choice.label}。`});s.seenEvents.push(event.id);addLog(s,event.title,choice.label,event.chapter?'chapter':'event');
 processEducation(s,report,'progress');
 for(const id of s.plan.exams){const e=find(D.EXAMS,id);const reason=examEligibility(s,e);if(reason){report.push({kind:'fail',text:`${e.name}：${reason}。受験は見送り。`});continue;}
  if(!N.payEducation(s,e.fee)){report.push({kind:'fail',text:e.name+'：受験料を用意できず、受験を見送った。'});continue;}s.examAttempts[id]=(s.examAttempts[id]||0)+1;s.stats.stress+=3;const chance=examProbability(s,e,false);
  if(random(s)<chance){s.certs[id]=s.age;s.stats.happiness+=5;s.stats.trust+=Math.min(e.impact||1,5)*.4;s.impact+=(e.impact||1)*.3;report.push({kind:'success',text:`${e.name}に合格しました！`});addLog(s,e.name+' 合格',`${s.age}歳で取得。`,'exam');}
  else {skillAdd(s,e.skill,1.8);s.stats.happiness-=2;report.push({kind:'fail',text:`${e.name}は不合格。受験経験が次の学びになります。`});}
 }
 handleExperience(s,report);progressProjects(s,report);processRelations(s,report);
 if(s.partner){s.partner.years++;s.partner.bond+=a.social*1.65-4.3-Math.max(0,s.stats.stress-70)*.05;s.stats.happiness+=(s.partner.bond-50)*.04;
  if(s.partner.bond<15){report.push({kind:'fail',text:'パートナーとの関係が危うくなっています。対話する時間が必要です。'});}
  if(s.partner.bond<=0){addLog(s,'それぞれの道へ','すれ違いが重なり、関係を終えた。','relationship');s.partner=null;s.stats.happiness-=12;report.push({kind:'fail',text:'すれ違いが重なり、パートナーと別々の道を歩むことになりました。'});}
 }
 for(const child of s.children){child.age++;if(child.age<=21){const delta=a.social*2-4-(s.children.filter(c=>c.age<18).length>2?1:0);child.bond+=delta;child.care+=Math.max(0,a.social-1);s.stats.stress+=child.age<6?3:1;}
  if(child.age===18){const contribution=Math.max(0,child.bond-35)*.55;s.impact+=contribution;report.push({kind:'success',text:`${child.name}が18歳に。支えてきた関係が、次の世代へつながりました。`});addLog(s,`${child.name}が成人`,'関係の積み重ねが人生に残った。','relationship');}
 }
 processEducation(s,report,'admission');
 if(s.plan.job){const j=find(D.JOBS,s.plan.job);const reason=jobEligibility(s,j,true,false);if(reason)report.push({kind:'fail',text:`${j?.name||'仕事'}：${reason}`});else if(random(s)<jobProbability(s,j,false)){s.job=j.id;s.jobYears=0;s.retired=false;X.onHire(s,j);report.push({kind:'success',text:`${j.name}に採用されました。来年から新しい仕事です。`});addLog(s,j.name+'として働く','新しい仕事への一歩。','career');}else report.push({kind:'fail',text:`${j.name}の採用には届きませんでした。経験や技術を積んで再挑戦できます。`});}
 X.yearEnd(s,report,random,socialFocusReason);
 if(s.investments>0){const econ=find(D.ECONOMIES,s.economy);const ret=X.investmentReturn(s,econ,random);const profit=s.investments*ret;const afterTax=profit>0?profit*.8:profit;s.investments+=afterTax;s.marketReturn=ret;s.cash=round(s.cash);report.push({kind:profit>=0?'success':'fail',text:`分散運用：今年の値動き ${(ret*100).toFixed(1)}%。${profit>=0?'利益へのゲーム内税20%控除後':'評価損'} ${Math.abs(afterTax).toFixed(1)}万円。`});}else s.marketReturn=0;
 const removed=[];s.items=s.items.filter(o=>{const i=find(D.ITEMS,o.id);if(i&&s.age+1-o.bought>=i.life){removed.push(i.name);return false;}return true;});if(removed.length)report.push({kind:'life',text:`${removed.join('・')}の利用期間が終了しました。必要なら買い直せます。`});
 if(s.cash<0){const gap=-s.cash;
  if(s.education&&s.plan.funding&&s.debt+gap<=1200){s.debt+=gap;s.cash=0;report.push({kind:'life',text:`教育・生活の不足分${gap.toFixed(1)}万円を奨学金（ゲーム内年利2%）で補いました。`});}
  else if(s.investments>=gap){s.investments-=gap;s.cash=0;report.push({kind:'life',text:`生活費の不足分${gap.toFixed(1)}万円を運用資産から取り崩しました。`});}
  else {const sale=s.investments;s.investments=0;s.debt+=gap-sale;s.cash=0;s.stats.stress+=10;s.stats.happiness-=4;report.push({kind:'fail',text:`家計が${(gap-sale).toFixed(1)}万円不足。生活債務になりました。収支を見直すか再建支援を利用できます。`});}
 }
 if(s.stats.health<20){s.stats.stress-=8;s.stats.health+=4;s.cash=Math.max(0,s.cash-5);report.push({kind:'fail',text:'体調を崩しました。支援を受けて休養。来年は運動・休息を増やす必要があります。'});}
 s.plan.allocation=chosenAllocation;normalize(s);s.age++;
 for(const k of ['health','happiness','trust','connections'])s.statsTotal[k]+=s.stats[k];s.statsTotal.years++;
 s.totals.peakWealth=Math.max(s.totals.peakWealth,netWorth(s));s.ledger={...budget,event:choice.label,actualCashChange:round(s.cash-before.cash)};s.wealthHistory.push({age:s.age,wealth:netWorth(s)});
 const fresh=unlock(s);if(!s.finished&&s.age>=100){s.finished=true;addLog(s,'百年の一冊','選んできたすべてが、あなたの物語。','end');}
 const yearIncome=s.yearStats.income,yearSpending=s.yearStats.spending,yearBefore=s.yearStats.before||before;report.unshift(...s.termReports.flat());const oldPlan=s.plan;N.finishYear(s);s.plan=defaultPlan(s.age,oldPlan);s.plan.funding=oldPlan.funding;if(s.age>=6)s.plan.allocation=copy(oldPlan.allocation);if(!s.finished)prepareYear(s);
 s.report={age:before.age,nextAge:s.age,entries:report,before:yearBefore,achievements:fresh,wealthDelta:round(netWorth(s)-yearBefore.wealth),income:round(yearIncome),spending:round(yearSpending)};
 return {report:s.report};
}
function itemEligibility(s,i){if(!i)return'品物が見つかりません';if(s.finished)return'人生は完結しています';if(s.age<(i.minAge||0))return`${i.minAge}歳から`;if(i.maxAge&&s.age>i.maxAge)return'対象年齢を過ぎています';if(i.cert&&s.certs[i.cert]===undefined)return'普通自動車免許が必要';if(s.items.some(x=>x.id===i.id))return'利用中';if(s.purchasesThisYear.includes(i.id))return'今年は購入・利用済み';const extra=N.itemGate(s,i);if(extra)return extra;if(!N.canAffordItem(s,i))return N.parentPays(s,i)?'親の教育予算が不足しています':'お小遣い・現金が不足しています';return'';}
function buy(s,id){const i=find(D.ITEMS,id),err=itemEligibility(s,i);if(err)return err;const parentFunded=N.payItem(s,i);s.purchasesThisYear.push(id);
 if(i.kind==='experience'){if(i.skill)skillAdd(s,i.skill,i.gain);for(const k of ['health','happy','stress','connections','trust','impact'])if(i[k])effects(s,{[k==='happy'?'happiness':k]:i[k]});}
 else s.items.push({id,bought:s.age,parentFunded});normalize(s);addLog(s,i.name,i.kind==='experience'?'経験にお金と時間を使った。':'暮らしに加わった道具。','purchase');unlock(s);return'';}
function sell(s,id){const pos=s.items.findIndex(x=>x.id===id);if(pos<0)return'所持していません';const i=find(D.ITEMS,id);if(i.kind==='care')return'家族として迎えた相手は売却できません';const owned=s.items[pos];const value=i.kind==='subscription'?0:round(i.price*.55*Math.max(.1,1-(s.age-owned.bought)/i.life));if(owned.parentFunded&&s.age<18)s.parents.educationFund=Math.min(100,s.parents.educationFund+value);else s.cash+=value;s.items.splice(pos,1);return'';}
function invest(s,amount){if(s.finished)return'人生は完結しています';if(s.age<18)return'18歳から運用できます';if(!s.account.open)return'証券口座を開設してください';amount=round(Number(amount));if(!Number.isFinite(amount)||amount===0)return'金額を入力してください';if(amount>0&&s.cash<amount)return'現金が不足しています';if(amount<0&&s.investments<-amount)return'運用資産が不足しています';s.cash-=amount;s.investments+=amount;normalize(s);return'';}
function repay(s,amount){amount=Number(amount);if(!Number.isFinite(amount)||amount<=0||amount>s.cash||amount>s.debt)return'返済額を確認してください';s.cash-=amount;s.debt-=amount;normalize(s);return'';}
function action(s,type){const extra=X.action(s,type);if(extra!==null){normalize(s);return extra;}if(s.finished)return'人生は完結しています';if(s.actionsThisYear.includes(type))return'今年は実施済みです';
 if(type==='takken'){if(s.certs.takken===undefined)return'宅建試験合格が必要';if(s.licenses.includes('takken'))return'登録済み';if(s.age<18)return'ゲームでは成人後の登録を扱います';if(s.cash<8)return'講習・登録用の現金8万円が必要';s.cash-=8;s.licenses.push('takken');addLog(s,'宅建登録','実務講習と登録・取引士証の手続を完了。','career');}
 else if(type==='cpa'){if(s.certs.cpa===undefined||(s.experience.audit||0)<3)return'会計士試験合格と業務補助3年が必要';if(s.licenses.includes('cpa'))return'登録済み';if(s.cash<15)return'修了考査・登録用の現金15万円が必要';s.cash-=15;s.licenses.push('cpa');addLog(s,'公認会計士登録','業務補助・実務補習・修了考査を経て登録。','career');}
 else if(type==='teacher'){if(!hasDegree(s,'education'))return'ゲームでは教育系大学卒業の経路を扱います';if(s.licenses.includes('teacher'))return'手続済み';if(s.cash<5)return'現金5万円が必要';s.cash-=5;s.licenses.push('teacher');addLog(s,'教員免許の手続','教職課程を修了し免許の手続へ。採用は別途応募。','career');}
 else if(type==='retire'){if(s.age<18)return'成人後に選択できます';s.retired=!s.retired;}
 else if(type==='quit'){s.job=null;s.jobYears=0;}
 else if(type==='pause'){if(!s.education)return'在籍していません';s.education.paused=!s.education.paused;}
 else if(type==='dropout'){if(!s.education)return'在籍していません';addLog(s,'学び方を選び直す',s.education.name+'を退学。','education');s.education=null;}
 else if(type==='relocate'){if(s.age<18)return'18歳から選べます';if(s.home)return'持ち家の売却後に引っ越せます';if(s.cash<25)return'引越費用25万円が必要';s.cash-=25;s.region=s.region==='metro'?'local':'metro';s.prefecture=s.region==='metro'?'13':'20';}
 else if(type==='house'){
  if(s.age<20)return'20歳から購入できます';if(s.home)return'すでに持ち家があります';const price=s.region==='metro'?4500:2400;const down=price*.2;
  if(s.cash<down+price*.05)return`頭金・諸費用 ${Math.round(down+price*.05)}万円が必要`;if(annualBudget(s).salary+annualBudget(s).partner<price*.09)return'ローンを支える就業収入が不足しています';s.cash-=down+price*.05;s.home={value:price,loan:price-down,payment:(price-down)/30};addLog(s,'家を持つ',`購入価格${price}万円。30年返済のゲーム内ローン。`,'purchase');
 }else if(type==='sellhouse'){if(!s.home)return'持ち家がありません';s.cash+=s.home.value*.94-s.home.loan;if(s.cash<0){s.debt-=s.cash;s.cash=0;}s.home=null;}
 else if(type==='rebuild'){if(s.debt<400)return'債務400万円以上で再建支援を利用できます';if(s.age<18)return'18歳から';if(s.actionsThisYear.includes('rebuild'))return'実施済み';s.investments=0;s.cash=15;if(s.home)s.home=null;if(s.venture){s.venture.capital=0;s.venture.registered=false;}s.debt=Math.min(s.debt*.3,350);s.stats.trust-=12;s.stats.stress-=20;addLog(s,'家計を立て直す','資産の整理と債務調整。ここから再出発。','finance');}
 else return'操作を確認してください';s.actionsThisYear.push(type);normalize(s);unlock(s);return'';
}
function ending(s){const sc=score(s);if(s.projects.research?.stage>=4)return{title:'世界に残した、小さな光',text:'あなたが問い続けたことが、世界の見え方を変えました。資産だけでは測れない成果と、そこまでを支えた日々がこの一冊に残っています。'};
 if(netWorth(s)>=20000&&s.stats.trust>=65)return{title:'豊かさを、誰かの未来へ',text:'積み上げた資産と信頼。選べる自由を手に入れた先に、誰かを支える力も育っていました。'};
 if(s.projects.startup?.stage>=3)return{title:'なかった仕事を、つくった人生',text:'小さな試みを重ね、暮らしや社会に根づく仕事へ。成功だけでなく、試し直した日々もあなたの財産です。'};
 if(s.projects.creative?.stage>=3)return{title:'心に残るものを、つくる',text:'あなたの作品に出会い、気持ちが変わった人がいる。表現を続けた時間が、世の中に静かに残りました。'};
 if(sc.relation>=78)return{title:'あなたがいて、よかった',text:'人と過ごし、人を支え、ときには支えられた人生。大切にした関係が、何より確かな財産になりました。'};
 if(sc.wellbeing>=78)return{title:'自分の歩幅で、満ちた日々',text:'急ぐ日も、休む日も、自分で選びました。小さな幸福を重ねてきた時間が、一冊の人生になりました。'};
 if(s.impact>=300)return{title:'次の人へ、手渡したもの',text:'知識、仕事、やさしさ。形は違っても、あなたが手渡したものが誰かの生活を少し変えました。'};
 return{title:'何度でも、選び直した人生',text:'うまくいく年も、思い通りにならない年もありました。それでも選び続けたすべての一年が、あなただけの物語です。'};
}
function validateState(v){
 if(!v||!X.validate(v)||v.version!==D.VERSION||typeof v.name!=='string'||v.name.length>32||!Number.isInteger(v.age)||v.age<0||v.age>100)return false;
 if(!D.BACKGROUNDS[v.background]||!D.TRAITS[v.trait]||!['metro','local'].includes(v.region))return false;
 for(const key of ['cash','debt','investments','impact','rng','jobYears','pensionYears','royalties'])if(!Number.isFinite(v[key])||Math.abs(v[key])>1e12)return false;
 if(!v.stats||!v.skills||Object.keys(v.stats).some(k=>!['health','happiness','stress','trust','connections','discipline'].includes(k)))return false;
 for(const k of ['health','happiness','stress','trust','connections','discipline'])if(!Number.isFinite(v.stats[k])||v.stats[k]<0||v.stats[k]>100)return false;
 for(const k of Object.keys(D.SKILLS))if(!Number.isFinite(v.skills[k])||v.skills[k]<0||v.skills[k]>200)return false;
 if(!v.plan||!v.plan.allocation||!['balanced',...Object.keys(D.SKILLS)].includes(v.plan.focus)||!['off','verify','paid','delegate'].includes(v.plan.ai)||!find(D.PROJECTS,v.plan.project))return false;
 for(const a of D.ACTIVITIES)if(!Number.isInteger(v.plan.allocation[a.id])||v.plan.allocation[a.id]<0||v.plan.allocation[a.id]>12)return false;
 if(totalTime(v)>12||!Array.isArray(v.plan.exams)||v.plan.exams.length>2||v.plan.exams.some(id=>!find(D.EXAMS,id)))return false;
 if(v.plan.event!==null&&(!Number.isInteger(v.plan.event)||v.plan.event<0||v.plan.event>2))return false;
 if(!find(D.EVENTS,v.eventId)||!find(D.ECONOMIES,v.economy))return false;
 for(const key of ['history','items','degrees','children','licenses','achievements','seenEvents','wealthHistory','purchasesThisYear','actionsThisYear'])if(!Array.isArray(v[key])||v[key].length>1500)return false;
 if(v.items.some(i=>!find(D.ITEMS,i.id)||!Number.isFinite(i.bought)))return false;
 if(!v.certs||!v.experience||!v.projects||!v.examAttempts||!v.statsTotal||!v.totals||!v.settings)return false;
 const numericTree=(o,depth=0)=>{if(depth>18)return false;if(typeof o==='number')return Number.isFinite(o)&&Math.abs(o)<1e12;if(o&&typeof o==='object')return Object.keys(o).every(k=>!['__proto__','constructor','prototype'].includes(k)&&numericTree(o[k],depth+1));return typeof o==='string'?o.length<6000:true;};
 if(!numericTree(v))return false;
 if(v.education&&(!D.FIELDS[v.education.field]||!Number.isFinite(v.education.total)||v.education.total<1||v.education.total>8||!Number.isFinite(v.education.progress)))return false;
 if(v.partner&&(typeof v.partner.name!=='string'||!Number.isFinite(v.partner.bond)||!Number.isFinite(v.partner.income)))return false;
 if(v.children.some(c=>typeof c.name!=='string'||!Number.isFinite(c.age)||!Number.isFinite(c.bond)))return false;

 if(v.plan.job&&!find(D.JOBS,v.plan.job))return false;
 if(!['none','friends','community','meet','date','marry','child','separate'].includes(v.plan.relation))return false;
 if(!['full','remote','none'].includes(v.highschool)||typeof v.highschoolGrad!=='boolean'||typeof v.finished!=='boolean'||typeof v.retired!=='boolean')return false;
 if(typeof v.settings.sound!=='boolean'||typeof v.settings.reducedMotion!=='boolean'||typeof v.plan.funding!=='boolean')return false;
 const num=(x,a=0,b=1e12)=>Number.isFinite(x)&&x>=a&&x<=b;
 if(v.cash<0||v.debt<0||v.investments<0||!num(v.care))return false;
 if(Object.entries(v.certs).some(([id,age])=>!find(D.EXAMS,id)||!num(age,0,100)))return false;
 if(Object.entries(v.experience).some(([id,n])=>!D.JOBS.some(j=>j.sector===id)||!num(n,0,101)))return false;
 if(Object.entries(v.projects).some(([id,p])=>!find(D.PROJECTS,id)||!p||!num(p.progress)||!Number.isInteger(p.stage)||p.stage<0||p.stage>4))return false;
 if(v.licenses.some(id=>!['cpa','takken','teacher','lawyer','doctor','dentist'].includes(id)))return false;
 if(v.achievements.some(id=>!find(D.ACHIEVEMENTS,id))||v.seenEvents.some(id=>!find(D.EVENTS,id)))return false;
 if(v.purchasesThisYear.some(id=>!find(D.ITEMS,id)))return false;
 if(v.history.some(e=>!e||!num(e.age,0,100)||typeof e.title!=='string'||typeof e.text!=='string'))return false;
 if(v.wealthHistory.some(e=>!e||!num(e.age,0,100)||!Number.isFinite(e.wealth)))return false;
 if(['health','happiness','trust','connections','years'].some(k=>!num(v.statsTotal[k])))return false;
 if(['income','spending','tax','peakWealth'].some(k=>!num(v.totals[k])))return false;
 const eduOK=d=>d&&['college','master','phd','lawschool','vocational','kosen'].includes(d.kind)&&D.FIELDS[d.field]&&typeof d.name==='string'&&num(d.total,1,8)&&num(d.progress,0,8)&&num(d.tuition,0,1000)&&['full','night','parttime'].includes(d.mode)&&typeof d.paused==='boolean';
 if(v.education&&!eduOK(v.education)||v.degrees.some(d=>!eduOK(d)||!num(d.age,0,100)))return false;
 const admission=v.plan.admission;
 if(admission){if(!['college','master','phd','lawschool','vocational'].includes(admission.kind))return false;if(admission.kind==='college'){const u=universityById(admission.university);if(!u||!Number.isInteger(admission.course)||!u.courses[admission.course]||!['full','night'].includes(admission.mode))return false;}else if(!D.FIELDS[admission.field]||!['full','parttime'].includes(admission.mode))return false;}
 if(v.goal){const u=universityById(v.goal.university);if(!u||!u.courses[v.goal.course])return false;}
 if(v.job&&!find(D.JOBS,v.job))return false;
 if(v.home&&['value','loan','payment'].some(k=>!Number.isFinite(v.home[k])||v.home[k]<0))return false;
 return true;
}
root.LifeEngine={chapters:root.LifeChapters,lifeSummary:root.LifeChapters.summary,next:N,admissions:A,quiz:root.LifeQuiz,migrate:X.migrate,systems:X,newGame,advance,score,ending,phase,educationName,netWorth,annualBudget,salary,examEligibility,examProbability,universityEligibility,universityThreshold,admissionProbability,tuition,universityById,jobEligibility,jobProbability,gradEligibility,relationEligibility,itemEligibility,buy,sell,invest,repay,action,getEvent,totalTime,projected,unlock,validateState,copy,random,clamp,round,hasDegree,hasGraduate,itemBonus};
})(typeof window!=='undefined'?window:globalThis);
