const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=fs.existsSync(path.join(__dirname,'index.html'))?__dirname:path.join(__dirname,'..'),assets=fs.existsSync(path.join(root,'dist/index.html'))?path.join(root,'dist'):root;
const qa=fs.existsSync(path.join(root,'tools'))?path.join(root,'qa'):root;
global.window=global;for(const n of ['universities','data','world','systems','chapters','admission-data','admissions','quiz','next','engine'])require(path.join(assets,n+'.js'));
const D=LifeData,E=LifeEngine,X=LifeSystems,C=LifeChapters;let checks=0,years=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.deepEqual(a,b,m);checks++;};
function at(age,seed='chapters'){const s=E.newGame({seed,origin:'medium',lifeMode:'century'});s.age=age;s.cash=1000;s.highschoolGrad=age>=18;s.school.hsProgress=age>=18?3:Math.max(0,age-15);s.plan.allocation={study:4,work:1,health:2,social:2,creative:1,rest:2};s.stats.discipline=70;return s;}
function tick(s,id,choice=0){if(id)s.eventId=id;s.plan.event=choice;const r=E.advance(s);ok(!r.error,r.error);ok(E.validateState(s),'Invalid save after '+id);years++;return r;}
// Every authored choice can run, serialize and leave the score within its bounds.
for(const id of Object.keys(C.arcs))for(const eid of D.ARCS[id].ids)for(let choice=0;choice<3;choice++){
 const age=Math.max(C.arcs[id].min,12),s=at(age);s.job=age>=20?'engineer':null;s.jobYears=5;for(const k of Object.keys(s.skills))s.skills[k]=100;
 tick(s,eid,choice);const save=E.migrate(JSON.parse(JSON.stringify(s)));ok(E.validateState(save));const score=E.lifeSummary(s);ok(score.total>=0&&score.total<=1000);eq(score.axes.reduce((n,a)=>n+a.points,0),score.raw);
}
// Being bullied does not carry a character/trust penalty. Recovery is not forced forgiveness.
for(const e of D.EVENTS.filter(e=>e.arc==='classroom'))for(const choice of e.choices){ok((choice.effects.trust||0)>=0);ok((choice.inner.integrity||0)>=0);const s=at(12),before=[s.stats.trust,s.inner.integrity];X.onChoice(s,e,choice,[]);eq([s.stats.trust,s.inner.integrity],before);}
{const s=at(12);tick(s,'arc_bystander_0',2);ok(s.social.harm>0);ok(s.storyFlags.joined_bullying!==undefined);const text=C.narrative(s,D.EVENTS.find(e=>e.id==='arc_bystander_1')).text;ok(text.includes('自分が加わった'));const before=s.social.harm;s.plan.socialFocus='repair';tick(s,'arc_repair_0',0);ok(s.social.harm<before);ok(s.social.repair>0);ok(!s.social.forgiven,'Repair must not claim the other person forgives');}
{const a=at(12),b=E.copy(a);a.storyFlags.class_help=12;b.storyFlags.class_rest=12;const e=D.EVENTS.find(e=>e.id==='arc_classroom_1');ok(C.narrative(a,e).text!==C.narrative(b,e).text);}
// A salary is received for the current working year, then an actual loss ends the job.
{const s=at(35);s.job='engineer';s.jobYears=4;const r=tick(s,'arc_layoff_0');eq(s.job,null);eq(s.social.jobLosses,1);ok(r.report.income>0);eq(E.salary(s),0);}
// A newly secured job in the same occupation is not accidentally discarded.
{const s=at(35);s.job='engineer';s.jobYears=4;s.skills.tech=200;s.inner.interview=100;s.stats.stress=0;s.plan.job='engineer';tick(s,'arc_layoff_0');eq(s.job,'engineer');eq(s.jobYears,0);}
// Care costs and effects use readiness before the annual bill, not remaining cash afterward.
{const s=at(50);s.cash=20;s.social.careNeed=40;s.plan.socialFocus='caregiving';const b=E.copy(s);b.plan.socialFocus='steady';eq(E.annualBudget(s).extra-E.annualBudget(b).extra,20);tick(s,'freeafternoon');tick(b,'freeafternoon');ok(s.social.careNeed<b.social.careNeed);}
// An unaffordable repeated experience must not grant its extra effects.
{const s=at(30);s.experienceCounts.reskill=1;s.cash=0;s.plan.experience='reskill';const b=E.copy(s);b.plan.experience=null;tick(s,'freeafternoon');tick(b,'freeafternoon');eq(s.social.reskill,b.social.reskill);eq(s.inner.interview,b.inner.interview);}
{const s=at(19);s.inner.digital=80;s.plan.allocation.study=4;const r=tick(s,'arc_scholarship_life_0');eq(s.social.grants,1);ok(r.report.entries.some(e=>e.text.includes('給付30万円')));const n=s.social.grants;tick(s,'arc_scholarship_life_0');eq(s.social.grants,n);}
// Difficult stories are optional and not universal across seeds, prefectures or hardship modes.
{const offered=new Set();for(let i=0;i<60;i++){const s=at(12,'seed-'+i);offered.add(C.eligible(s,'classroom'));s.settings.difficultStories=false;for(const [id,a]of Object.entries(C.arcs))if(a.hard)ok(!C.eligible(s,id));}eq(offered.size,2);}
// Safety changes recovery; belonging changes wellbeing; retraining helps an eligible application.
{const a=at(30),b=E.copy(a);a.social.strain=b.social.strain=40;a.social.safety=90;b.social.safety=10;tick(a,'freeafternoon');tick(b,'freeafternoon');ok(a.social.strain<b.social.strain);}
{const a=at(30),b=E.copy(a);a.social.belonging=90;b.social.belonging=10;tick(a,'freeafternoon');tick(b,'freeafternoon');ok(a.stats.happiness>b.stats.happiness);}
{const a=at(30),b=E.copy(a),j=D.JOBS.find(j=>j.id==='office');a.skills.business=b.skills.business=35;a.social.reskill=80;b.social.reskill=0;ok(E.jobProbability(a,j)>E.jobProbability(b,j));}
{const a=at(30),b=E.copy(a);a.social.friends=[{id:'childhood',name:'あおい',label:'友人',bond:95,since:6,lastContact:29}];ok(E.score(a).relation>E.score(b).relation);}
// Migration is deterministic, idempotent and preserves earlier random state and decisions.
{const s=at(42),old=E.copy(s);delete old.chaptersVersion;delete old.social;delete old.plan.socialFocus;delete old.settings.difficultStories;const rng=old.rng;const migrated=E.migrate(old);ok(E.validateState(migrated));eq(migrated.rng,rng);eq(E.migrate(E.copy(migrated)),migrated);const bad=E.copy(migrated);bad.social.harm=-1;ok(!E.validateState(bad));}
// Score rounding is exact at displayed component totals; no marriage/child-count bonus.
{const s=at(70);for(let i=0;i<100;i++){s.cash=i*i*10;s.stats.trust=i;s.statsTotal={years:70,health:5000,happiness:4500,trust:4000,connections:4000};s.impact=i*15;const sc=E.lifeSummary(s);eq(sc.axes.reduce((n,a)=>n+a.points,0),sc.raw);eq(sc.total,Math.round(E.score(s).total*10));}}
// New systems remain viable over complete lives and leave varied story paths.
const results=[];for(let i=0;i<20;i++){const s=E.newGame({seed:'chapter-life-'+i,origin:['easy','medium','hard','draw'][i%4],lifeMode:i%2?'natural':'century'});while(!s.finished){s.plan.event=i%3;if(s.age>=6)s.plan.socialFocus=s.social.harm>0?'repair':i%3===0?'support':'steady';if(s.age>=20&&i%4===0)s.plan.experience='reskill';if(s.age>=18&&!s.job){const j=D.JOBS.find(j=>j.id==='office');if(!E.jobEligibility(s,j))s.plan.job=j.id;}tick(s);ok(s.age<=100);}
 const r=E.lifeSummary(s);results.push({seed:i,age:s.age,score:r.total,rank:r.rank,end:s.endCause,arcs:Object.keys(s.arcs),harm:s.social.harm,repair:s.social.repair,friends:s.social.friends.length});}
fs.mkdirSync(qa,{recursive:true});fs.writeFileSync(path.join(qa,'chapters-results.json'),JSON.stringify({checks,years,lifeRuns:results.length,results},null,2));console.log(JSON.stringify({passed:true,checks,years,lifeRuns:results.length}));
