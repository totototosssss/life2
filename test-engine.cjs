const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=fs.existsSync(path.join(__dirname,'index.html'))?__dirname:path.join(__dirname,'..'),assets=fs.existsSync(path.join(root,'dist/index.html'))?path.join(root,'dist'):root;
const qa=fs.existsSync(path.join(root,'tools'))?path.join(root,'qa'):root;
global.window=global;for(const name of ['universities','data','world','systems','chapters','admission-data','admissions','quiz','next','engine'])require(path.join(assets,name+'.js')); 
const D=LifeData,E=LifeEngine;let checks=0;const ok=(p,msg)=>{assert.ok(p,msg);checks++};const eq=(a,b,msg)=>{assert.deepEqual(a,b,msg);checks++};
function tick(s){s.plan.event??=0;const r=E.advance(s);ok(!r.error,r.error);ok(E.validateState(s),'A saved state should round-trip after every year');ok(Number.isFinite(E.score(s).total),'Score must be finite');return r;}
function ready(age=25){const s=E.newGame({seed:'gate-tests',lifeMode:'century'});s.account.open=true;Object.keys(s.subjects).forEach(k=>s.subjects[k]=170);s.age=age;s.cash=3000;s.highschoolGrad=true;Object.keys(s.skills).forEach(k=>s.skills[k]=170);s.stats.discipline=80;s.stats.health=90;s.stats.happiness=80;return s;}
// Money and save invariants.
{const s=ready();const w=E.netWorth(s);eq(E.invest(s,500),'');eq(E.netWorth(s),w,'Reallocation must not create wealth');eq(E.invest(s,-100),'');eq(E.netWorth(s),w);ok(!!E.invest(s,1e9));ok(!!E.invest(s,NaN));eq(E.buy(s,'laptop'),'');const c=s.cash;ok(!!E.buy(s,'laptop'),'No double buy');eq(s.cash,c);eq(E.sell(s,'laptop'),'');ok(s.cash<c+13,'Reselling must not create profit');ok(!!E.buy(s,'laptop'),'No buy/sell same-year farming');eq(E.buy(s,'trip'),'');ok(!!E.buy(s,'trip'),'Experience limited per year');const exported=JSON.stringify(s);ok(E.validateState(JSON.parse(exported)));ok(!E.validateState({}));let bad=JSON.parse(exported);bad.stats.health=NaN;ok(!E.validateState(bad));bad=JSON.parse(exported);bad.plan.allocation.study=-3;ok(!E.validateState(bad));}
// Public rules and professional gates.
{let s=ready(8);ok(!E.examEligibility(s,D.EXAMS.find(e=>e.id==='cpa_short')),'No exam age restriction for CPA');ok(!!E.examEligibility(s,D.EXAMS.find(e=>e.id==='bar')));s.age=25;s.certs.prebar=24;ok(!E.examEligibility(s,D.EXAMS.find(e=>e.id==='bar')));s.age=30;ok(!!E.examEligibility(s,D.EXAMS.find(e=>e.id==='bar')),'Prebar route expires');s.age=25;s.certs.cpa=24;ok(!!E.action(s,'cpa'),'CPA pass is not registration');s.experience.audit=3;eq(E.action(s,'cpa'),'');ok(s.licenses.includes('cpa'));ok(!!E.action(s,'cpa'),'Cannot register repeatedly');s.certs.takken=24;eq(E.action(s,'takken'),'');s.degrees=[{kind:'college',field:'pharmacy',total:4,name:'4年制薬科学',age:24}];ok(!!E.examEligibility(s,D.EXAMS.find(e=>e.id==='pharmacist')),'Four-year pharmacy is not a pharmacist qualification');s.degrees[0].total=6;ok(!E.examEligibility(s,D.EXAMS.find(e=>e.id==='pharmacist')));}
// Graduation, conditional job offers, student return, and time cannot be exploited.
{const s=ready(21);s.education={kind:'college',name:'工学課程',field:'tech',progress:3,total:4,tuition:54,mode:'full',paused:false};ok(!E.jobEligibility(s,D.JOBS.find(j=>j.id==='engineer')),'Final-year applications are allowed');s.plan.allocation={study:0,work:0,health:4,social:4,creative:0,rest:4};s.stats.discipline=10;s.plan.job='engineer';tick(s);ok(s.education,'No graduation without study');eq(s.job,null,'No full-time employment before graduation');s.plan.allocation={study:4,work:0,health:2,social:2,creative:2,rest:2};tick(s);ok(!s.education);ok(E.hasDegree(s,'tech'));}
{const s=ready(23);s.education={kind:'college',name:'医学科',field:'medicine',progress:5,total:6,tuition:54,mode:'full',paused:false};ok(!E.examEligibility(s,D.EXAMS.find(e=>e.id==='medicine'),true),'Final-year medical exam can be planned');s.plan.exams=['medicine'];s.plan.job='resident';tick(s);ok(!s.education);if(s.certs.medicine!==undefined){ok(s.job==='resident','Conditional resident offer follows a passed final-year exam');}else eq(s.job,null);}
{const s=ready();s.plan.allocation.study=11;ok(!!E.advance(s).error,'Allocation must total 12');}
{const s=ready();s.job='office';const w=E.netWorth(s);eq(E.action(s,'house'),'');ok(E.netWorth(s)<w,'House financing cannot create assets from nothing');eq(E.action(s,'sellhouse'),'');ok(E.netWorth(s)<w);}
// Official-data consistency.
ok(UNIVERSITIES.length>=800);ok(UNIVERSITY_META.withCourses>=770);ok(UNIVERSITIES.find(u=>u.name==='東京科学大学'));ok(UNIVERSITIES.find(u=>u.name==='放送大学').courses.length>0);ok(UNIVERSITIES.find(u=>u.name==='東京科学大学').courses.find(c=>c.faculty==='工学院').field==='tech');
for(const u of UNIVERSITIES)for(const c of u.courses){ok(!!D.FIELDS[c.field]);ok([3,4,6].includes(c.years));}
const alloc=a=>Object.fromEntries(D.ACTIVITIES.map((x,i)=>[x.id,a[i]]));
const results=[];
function run(strategy,seed){let s=E.newGame({seed:'life-'+seed,lifeMode:'century',background:seed%3===0?'independent':seed%3===1?'standard':'supported',trait:strategy==='creative'?'expressive':'curious'});let reached={};
 const field={research:'science',medical:'medicine',law:'law',cpa:'business',creative:'arts',ordinary:'social'}[strategy];
 const courseUni=UNIVERSITIES.find(u=>u.name===(strategy==='medical'?'新潟大学':strategy==='research'?'信州大学':strategy==='creative'?'東京藝術大学':'神奈川大学'))||UNIVERSITIES.find(u=>u.type==='国立'&&u.courses.some(c=>c.field===field));
 const ci=courseUni.courses.findIndex(c=>c.field===field);
 for(let year=0;year<100;year++){
  s.plan.event=0;
  if(s.age>=12){const curriculum=strategy==='medical'?'medicine':strategy==='research'?'sciences':strategy==='law'?'humanities':strategy==='cpa'?'cpa':'balanced';s.plan.curriculum=curriculum;if(s.age>=18&&['research','medical'].includes(strategy)){const tracks=['mathI','mathII','mathIII'];s.plan.mathTrack=tracks.find(k=>s.subjects[k]<130)||'mathIII';}s.plan.subjectWeights=[...D.CURRICULA[curriculum].weights];}
  s.plan.allocation=alloc(s.age<18?[6,0,2,1,1,2]:[4,1,2,1,2,2]);
  if(s.age<12)s.plan.focus='balanced';else s.plan.focus=strategy==='medical'?(s.skills.science<110?'science':'balanced'):strategy==='law'?'law':strategy==='cpa'?(s.skills.business<155?'business':'law'):strategy==='research'?'science':strategy==='creative'?'arts':'business';
  if(s.stats.stress>60||s.stats.health<55)s.plan.allocation=alloc([2,0,4,1,1,4]);
  if(s.age>=70)s.plan.allocation=alloc([1,0,4,2,2,3]);
  for(const id of ['librarypass','books','desk','laptop','bed','sportsgear']){const i=D.ITEMS.find(i=>i.id===id);if(!E.itemEligibility(s,i)&&s.cash>i.price+12)E.buy(s,id);}
  if(s.age>=18&&s.inner.digital>=20)s.plan.ai='verify';
  if(strategy!=='cpa'&&strategy!=='law'&&strategy!=='ordinary'&&s.age>=17&&!s.education&&!E.hasDegree(s)&&ci>=0&&!E.universityEligibility(s,courseUni,courseUni.courses[ci])&&s.age<40){LifeAdmissions.add(s,{university:courseUni.id,course:ci,mode:'full'});}
  if(strategy==='research'){
   if(!E.gradEligibility(s,'master')&&!E.hasGraduate(s,'master')&&s.education?.kind!=='master')s.plan.admission={kind:'master',field:'science',mode:'full'};
   if(E.hasGraduate(s,'master')&&!E.hasGraduate(s,'phd')&&!E.gradEligibility(s,'phd'))s.plan.admission={kind:'phd',field:'science',mode:'full'};
   if(s.skills.science>=40){s.plan.project='research';if(s.age>28&&s.stats.health>65)s.plan.allocation=alloc([3,0,2,1,4,2]);}
  }
  if(strategy==='creative'&&s.skills.arts>=25)s.plan.project='creative';
  const desired={cpa:['boki3','boki2','cpa_short','cpa'],law:['gyosei','prebar','bar'],medical:['medicine'],research:['suken9','fe','eiken5'],ordinary:['boki3','takken'],creative:['eiken5']}[strategy];
  for(const id of desired){const e=D.EXAMS.find(x=>x.id===id);if(!E.examEligibility(s,e,true)&&E.examProbability(s,e)>.6&&s.plan.exams.length<2)s.plan.exams.push(id);}
  if(s.certs.cpa!==undefined&&(s.experience.audit||0)>=3&&!s.licenses.includes('cpa'))E.action(s,'cpa');
  let desiredJobs={cpa:['cpa_job','audit','office','parttime'],law:['lawyer','legal_trainee','office','parttime'],medical:['doctor','resident','parttime'],research:['professor','researcher','technician','parttime'],creative:['creator','parttime'],ordinary:['office','sales','parttime']}[strategy];
  for(const id of desiredJobs){const j=D.JOBS.find(x=>x.id===id);if(!E.jobEligibility(s,j)&&E.jobProbability(s,j)>.6){if(s.job!==id)s.plan.job=id;break;}}
  if(s.age>=24&&s.age<65){s.plan.relation=!s.partner?'meet':!s.partner.married&&s.partner.bond>=65?'marry':s.children.length<2&&s.partner.married&&s.cash>200&&s.age<42?'child':'date';}
  if(s.age>=18&&s.cash>500&&!s.account.open)E.action(s,'account-assisted');
  if(s.age>=18&&s.cash>500)E.invest(s,(s.cash-350)*.3);
  if(s.debt>800&&s.cash<5&&!s.education&&E.annualBudget(s).net<0)E.action(s,'rebuild');
  tick(s);
  if(E.hasDegree(s)&&!reached.graduate)reached.graduate=s.age;if(s.licenses.includes('doctor')&&!reached.doctor)reached.doctor=s.age;if(s.licenses.includes('lawyer')&&!reached.lawyer)reached.lawyer=s.age;if(s.licenses.includes('cpa')&&!reached.cpa)reached.cpa=s.age;
  if(s.age===18)reached.at18={...s.skills};
 }
 ok(s.finished);eq(s.age,100);const x={strategy,seed,wealth:E.netWorth(s),score:E.score(s).total,health:s.stats.health,degrees:s.degrees.map(x=>x.kind),licenses:s.licenses,projects:s.projects,certs:Object.keys(s.certs).length,reached};results.push(x);return s;
}
for(const strategy of ['ordinary','research','medical','law','cpa','creative'])for(let seed=0;seed<12;seed++)run(strategy,seed);
for(const kind of ['doctor','lawyer','cpa'])ok(results.some(r=>r.licenses.includes(kind)),kind+' career must be reachable from infancy');
ok(results.some(r=>r.degrees.includes('phd')),'PhD reachable');ok(results.some(r=>r.projects.research?.stage===4),'Scientific breakthrough reachable');
// Reproducibility: identical seed and plan yield identical outcomes and saves.
{let a=E.newGame({seed:'repeatable'}),b=E.newGame({seed:'repeatable'});for(let i=0;i<25;i++){a.plan.event=b.plan.event=0;E.advance(a);E.advance(b);}eq(a,b);}
fs.mkdirSync(qa,{recursive:true});fs.writeFileSync(path.join(qa,'simulation-results.json'),JSON.stringify({checks,lifeRuns:results.length,years:results.length*100,results},null,2));
console.log(JSON.stringify({passed:true,checks,lifeRuns:results.length,years:results.length*100,strategies:[...new Set(results.map(r=>r.strategy))].map(strategy=>{const a=results.filter(r=>r.strategy===strategy);return{strategy,scoreRange:[Math.min(...a.map(r=>r.score)),Math.max(...a.map(r=>r.score))],graduates:a.filter(r=>r.degrees.includes('college')).length,licenses:[...new Set(a.flatMap(r=>r.licenses))],maxResearchStage:Math.max(...a.map(r=>r.projects.research?.stage||0))}})},null,2));
