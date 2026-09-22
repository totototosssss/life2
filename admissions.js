/* Admission forecasts are a game model. Published border facts keep their provenance. */
(function(root){
'use strict';
const D=root.LifeData,U=root.UNIVERSITIES,raw=root.ADMISSION_DATA;
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)),copy=v=>JSON.parse(JSON.stringify(v));
const norm=t=>String(t||'').normalize('NFKC').replace(/学部|学院|学群|学域|学科|課程|専攻|コース|[\s・－ー（）()\-]/g,'').replace(/学$/,'');
const byUni=new Map();
raw.rows.forEach((v,i)=>{const r={id:'r'+i,university:v[0],faculty:v[1],department:v[2],round:v[3],deviation:v[4],commonBorder:v[5],pattern:v[6],subjectCount:v[7],source:v[8],page:v[9],bf:v[10]};if(!byUni.has(r.university))byUni.set(r.university,[]);byUni.get(r.university).push(r);});
const legacyTokyo=copy(U.find(u=>u.name==='東京大学').courses);
U.find(u=>u.name==='東京大学').courses=['文科一類','文科二類','文科三類','理科一類','理科二類','理科三類'].map((faculty,i)=>({faculty,department:'教養学部から進学選択',field:['law','business','humanities','tech','science','medicine'][i],years:i===5?6:4,night:false,entryGroup:true}));
const overseas=[
 ['mit','マサチューセッツ工科大学','米国',78,620,'https://mitadmissions.org/apply/firstyear/international/'],
 ['stanford','スタンフォード大学','米国',79,650,'https://admission.stanford.edu/apply//international/index.html'],
 ['caltech','カリフォルニア工科大学','米国',79,650,'https://www.admissions.caltech.edu/apply/first-year-applicants/international-applicants'],
 ['oxford','オックスフォード大学','英国',76,500,'https://www.ox.ac.uk/admissions/undergraduate'],
 ['cambridge','ケンブリッジ大学','英国',76,520,'https://www.undergraduate.study.cam.ac.uk/international-students'],
 ['toronto','トロント大学','カナダ',66,430,'https://future.utoronto.ca/apply/'],
 ['nus','シンガポール国立大学','シンガポール',72,360,'https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/admission-requirements'],
 ['ucl','ユニバーシティ・カレッジ・ロンドン','英国',70,480,'https://www.ucl.ac.uk/prospective-students/undergraduate/']
];
for(const [id,name,pref,difficulty,cost,source] of overseas)U.push({id:'overseas_'+id,name,pref,type:'海外',foreign:true,difficulty,cost,source,courses:[{faculty:'Computer Science',department:'計算機科学',field:'tech',years:pref==='英国'?3:4,night:false},{faculty:'Mathematics',department:'数学',field:'science',years:pref==='英国'?3:4,night:false},...(id==='caltech'?[]:[{faculty:'Economics',department:'経済学',field:'business',years:pref==='英国'?3:4,night:false}])]});
function facultyMatch(a,b){a=norm(a);b=norm(b);return a===b||a.length>=4&&b.startsWith(a)||b.length>=4&&a.startsWith(b);}
const cache=new Map();
function routes(u,c){
 const key=u.id+'|'+c.faculty+'|'+c.department;if(cache.has(key))return cache.get(key);
 if(u.foreign)return[{id:'foreign',round:'海外',deviation:null,commonBorder:null,faculty:c.faculty,department:c.department,foreign:true,model:true,source:u.source}];
 let list=(byUni.get(u.id)||[]).filter(r=>facultyMatch(r.faculty,c.faculty));
 if(c.entryGroup)list=(byUni.get(u.id)||[]).filter(r=>r.faculty===c.faculty);
 const dep=norm(c.department),scored=list.map(r=>{const d=norm(r.department).replace(/共テ.*|共通テスト.*|前期.*|後期.*|一般.*|全学.*|[123456]科目.*/,'');return {r,score:d&&(d===dep||d.length>=Math.max(2,dep.length*.65)&&dep.includes(d)||dep.length>=2&&d.startsWith(dep))?Math.min(d.length,dep.length):0};});const best=Math.max(0,...scored.map(x=>x.score)),matches=scored.filter(x=>best&&x.score===best).map(x=>x.r);
 if(matches.length)list=matches;
 // Ambiguous faculty-level rows are labelled reference rows, never asserted to be an exact department match.
 list=list.map(r=>({...r,reference:!c.entryGroup&&!matches.length&&!!r.department}));
 if(!list.length){const f={medicine:67.5,dentistry:52.5,pharmacy:50,veterinary:60,nursing:47.5,healthcare:45,tech:47.5,science:50,law:50,business:47.5,humanities:47.5,education:47.5,arts:45,sports:42.5,social:45}[c.field]||45;
  list=[{id:'model',faculty:c.faculty,department:c.department,round:u.type==='私立'?'私立一般':'前期',deviation:f+(u.type==='国立'?5:u.type==='公立'?2.5:0),commonBorder:u.type==='私立'?null:55+(f-45),model:true,pattern:'科目モデル',subjectCount:'モデル'}];
 }
 cache.set(key,list);return list;
}
function route(u,c,id){return routes(u,c).find(r=>r.id===id)||routes(u,c)[0];}
function sciences(s,c){const chosen=s.plan.sciencePair||'physics,chemistry';return chosen.split(',').filter(k=>['physics','chemistry','biology'].includes(k)).slice(0,2);}
function subjectSet(s,u,c,r){
 const science=['science','tech','medicine','dentistry','pharmacy','veterinary','nursing','healthcare'].includes(c.field),math3=['science','tech','medicine','dentistry','pharmacy','veterinary'].includes(c.field);
 let individual=science?['englishR','mathI','mathII',...(math3?['mathIII']:[]),...sciences(s,c)]:['japanese','englishR',s.plan.socialSubject||'history'];
 if(c.field==='business'&&s.plan.humanitiesMath)individual=['englishR','japanese','mathI','mathII'];
 if(['東京大学','京都大学'].includes(u.name)&&science)individual.push('japanese');
 const social=s.plan.socialSubject||'history',second=s.plan.socialSecond||'geography';
 const count=Number(r.subjectCount);if(Number.isInteger(count)&&count>=1&&count<=4){const math=['mathI','mathII',...(math3?['mathIII']:[])];if(science){individual=count===1?math:count===2?[...math,'englishR']:count===3?[...math,'englishR',sciences(s,c)[0]]:[...math,'englishR',...sciences(s,c)];}else if(count===1)individual=['englishR'];else if(count===2)individual=['englishR',social];}
 let common=['japanese','mathI','mathII','englishR','englishL','information',...(science?sciences(s,c):['scienceBasic']),social,...(science?[]:[second])],weights=null,commonWeights=null,source=null,label='分野・公表科目数・選択科目から作るゲーム内セット';
 if(u.type==='私立'&&r.commonBorder!==null){common=[...individual];commonWeights=Object.fromEntries(common.map(k=>[k,1]));}
 if(u.name==='慶應義塾大学'&&norm(c.faculty)==='経済'){const modeA=r.department.includes('A方式');individual=modeA?['englishR','mathI','mathII']:['englishR','history'];weights=modeA?{englishR:2,mathI:1,mathII:1}:{englishR:1,history:1};source='https://www.keio.ac.jp/files/b1aeda5e13c81c000aee968d50795dcf3c4cdb7ca8701378aa904b907f44cffd';label='2027年度公式科目変更を反映（英語・数学または歴史）';}
 if(u.name==='早稲田大学'&&norm(c.faculty)==='政治経済'&&r.department.includes('併用')){common=['japanese','mathI','englishR','englishL',social];commonWeights={japanese:1,mathI:1,englishR:.5,englishL:.5,[social]:1};individual=['japanese','englishR'];source='https://www.waseda.jp/fpse/pse/assets/uploads/2025/02/900a838a51c30f1230c5d42bbf2e7270.pdf';label='2027年度一般選抜：国語・英語・数ⅠA必須、選択1科目。総合問題は国語・英語でモデル化';}
 if(u.name==='東京大学'&&!science)individual=['japanese','englishR','mathI','mathII',social,second];
 return {individual:[...new Set(individual)],common,science,math3,label,weights,commonWeights,source,pattern:r.pattern||'海外の書類・語学・筆記'};
}
function subjectPercent(s,k){let v=s.subjects[k]||0;if(k==='mathIII')v=Math.min(v,(s.subjects.mathII||0)*1.25);if(k==='higherMath')v=Math.min(v,(s.subjects.mathIII||0)*1.25);return clamp(v*.70,0,99);}
function commonScores(s,profile=s.plan.commonTrack||'science'){const values=Object.fromEntries(Object.keys(D.SUBJECTS).map(k=>[k,Math.round(subjectPercent(s,k)*10)/10]));const science=(s.plan.sciencePair||'physics,chemistry').split(',');values.scienceBasic=Math.round((values[science[0]]+values[science[1]])/2);const social=s.plan.socialSubject||'history',second=s.plan.socialSecond||'geography';const total=values.japanese*2+values.mathI+values.mathII+values.englishR+values.englishL+values.information+(profile==='humanities'?values.scienceBasic+(values[social]||0)+(values[second]||0):(values[science[0]]||0)+(values[science[1]]||0)+(values[social]||0));return {values,total:Math.round(total),max:1000,profile};}
function estimate(s,u,c,id,forecast=true){
 const n=forecast?root.LifeEngine.projected(s):s,r=route(u,c,id),sets=subjectSet(n,u,c,r),pct=commonScores(n,sets.science?'science':'humanities'),selected=sets.individual.map(k=>n.subjects[k]||0),weight=k=>sets.weights?.[k]??1,mean=sets.individual.reduce((sum,k)=>sum+(n.subjects[k]||0)*weight(k),0)/sets.individual.reduce((sum,k)=>sum+weight(k),0);
 const deviation=25+mean*.35-Math.max(0,n.stats.stress-45)*.035,ct=sets.commonWeights?sets.common.reduce((sum,k)=>sum+(pct.values[k]||0)*sets.commonWeights[k],0)/Object.values(sets.commonWeights).reduce((a,b)=>a+b,0):pct.total/10;
 let z=0,p=0;
 if(u.foreign){const eng=Math.min(subjectPercent(n,'englishR'),subjectPercent(n,'englishL'));const portfolio=Math.min(8,(n.competition?.rating||0)/800+(n.music?.skill||0)/60+(n.impact||0)/250);z=(deviation+portfolio-u.difficulty)/2.8;p=1/(1+Math.exp(-z));if(eng<72)p*=Math.pow(eng/72,6);}
 else{const zi=r.deviation===null?null:(deviation-r.deviation)/2.4,zc=r.commonBorder===null?null:(ct-r.commonBorder)/3;
  z=zi===null?(zc??(deviation-35)/4):zc===null?zi:zi*.65+zc*.35;
  p=1/(1+Math.exp(-z));if(zc!==null)p=Math.min(p,1/(1+Math.exp(-zc*.8)));
  if(r.bf)p=Math.min(.99,.50+(deviation-30)*.025);
 }
 const least=Math.min(...selected);if(least<25)p*=Math.pow(Math.max(0,least)/25,3);
 if(sets.math3&&(n.subjects.mathIII||0)<30)p*=Math.pow((n.subjects.mathIII||0)/30,2);
 p=clamp(p,0,.995);if(p<.0001)p=0;
 return {probability:p,rank:p>=.8?'A':p>=.65?'B':p>=.5?'C':p>=.2?'D':'E',deviation:Math.round(deviation*10)/10,common:Math.round(ct*10)/10,route:r,subjects:sets};
}
function applicationCost(u){return u.foreign?2.5:u.type==='私立'?3.5:1.7;}
function add(s,ap){const E=root.LifeEngine,u=E.universityById(ap.university),c=u?.courses[ap.course];if(!u||!c)return'学部・学科を選んでください';const why=E.universityEligibility(s,u,c,ap.mode);if(why)return why;const r=route(u,c,ap.route);const list=s.plan.applications;
 if(list.some(v=>v.university===u.id&&v.course===ap.course&&v.route===r.id))return'同じ方式は登録済みです';
 if(list.length>=7)return'1年の出願は7方式までです';
 const sameRound=list.filter(v=>{const uu=E.universityById(v.university);return route(uu,uu.courses[v.course],v.route).round===r.round;});
 if(['前期','後期','中期'].includes(r.round)&&sameRound.length)return`${r.round}は1校までです。今の出願を外してから選んでください`;
 if(u.type==='私立'&&list.filter(v=>E.universityById(v.university).type==='私立').length>=3)return'私立は3方式までです';
 if(u.foreign&&list.filter(v=>E.universityById(v.university).foreign).length>=2)return'海外は2方式までです';
 if(s.plan.admission&&s.plan.admission.kind!=='college')return'大学院等への進学予定を外してから選んでください';
 list.push({...ap,route:r.id,mode:ap.mode||'full'});s.plan.school=null;s.plan.admission=null;return'';
}
function settle(s,report,rand){const E=root.LifeEngine,list=s.plan.applications;if(!list.length)return;
 const approved=list.map(ap=>{const u=E.universityById(ap.university),c=u?.courses[ap.course];return{ap,u,c,why:u&&c?E.universityEligibility(s,u,c,ap.mode,false):'出願先が見つかりません'};}).filter(v=>{if(v.why)report.push({kind:'fail',text:`${v.u?.name||'出願'}：${v.why}`});return !v.why;});
 if(!approved.length)return;const cost=approved.reduce((n,v)=>n+applicationCost(v.u),0);if(!root.LifeNext.payEducation(s,cost)){report.push({kind:'fail',text:`検定料${cost.toFixed(1)}万円を用意できず、出願を取り消した。`});return;}
 const commonDraw=rand(s),wins=[];s.admissions.results=[];let publicAccepted=false;const order=v=>({前期:1,中期:2,後期:3}[route(v.u,v.c,v.ap.route).round]||0),ordered=[...approved].sort((a,b)=>order(a)-order(b));
 for(const v of ordered){const {u,c,ap}=v,est=estimate(s,u,c,ap.route,false);if(publicAccepted&&['中期','後期'].includes(est.route.round)){s.admissions.results.push({university:u.id,course:ap.course,route:ap.route,name:u.name+' '+c.faculty,round:est.route.round,passed:false,skipped:true,probability:est.probability});report.push({kind:'life',text:u.name+'［'+est.route.round+'］：前の日程で入学手続済みのため合格対象外。'});continue;}const independent=rand(s),draw=(est.route.round==='共テ')?commonDraw:independent;
  const pass=draw<est.probability;s.admissionAttempts[u.id]=(s.admissionAttempts[u.id]||0)+1;const record={university:u.id,course:ap.course,route:ap.route,name:u.name+' '+c.faculty,round:est.route.round,passed:pass,probability:est.probability};s.admissions.results.push(record);
  report.push({kind:pass?'success':'fail',text:`${u.name} ${c.faculty}［${est.route.round}］：${pass?'合格':'不合格'}（直前見込み${formatProbability(est.probability)}）。`});if(pass){const position=list.indexOf(ap),laterPreferred=approved.some(w=>order(w)>order(v)&&list.indexOf(w.ap)<position),betterOffer=wins.some(w=>list.indexOf(w.ap)<position);if(order(v)&&laterPreferred&&!betterOffer){record.declined=true;report.push({kind:'life',text:u.name+'の手続きは辞退。上位に置いた後の日程へ進む。合格の保証はない。'});}else{wins.push(v);if(order(v)&&!betterOffer)publicAccepted=true;}}
 }
 s.admissions.common={age:s.age,...commonScores(s)};
 if(!wins.length){s.school.ronin=true;s.stats.stress+=5;return;}
 // List order is an explicit enrollment preference. Only one seat is accepted; other offers are declined.
 wins.sort((a,b)=>list.indexOf(a.ap)-list.indexOf(b.ap));const selected=wins[0],{u,c,ap}=selected,fees=E.tuition(u,c,ap.mode);if(!root.LifeNext.payEducation(s,fees.entry)){report.push({kind:'fail',text:`${u.name}の入学金${fees.entry}万円が不足。合格は記録したが入学手続きは完了しなかった。`});return;}
 s.education={kind:'college',name:u.name+' '+c.faculty,university:u.id,department:c.department,field:c.field,total:c.years,progress:0,tuition:fees.annual,mode:ap.mode,paused:false,foreign:!!u.foreign};s.school.ronin=false;
 if(ap.mode==='full'&&s.job!=='parttime')s.job=null;s.retired=false;
 if(u.foreign){s.visits++;s.stats.connections+=3;}else{const destination=D.PREFECTURES.find(p=>p.name===u.pref||p.name.slice(0,-1)===u.pref);if(destination&&destination.id!==s.prefecture&&ap.mode==='full'){s.cash-=25;s.prefecture=destination.id;s.region=destination.metro?'metro':'local';}}
 s.history.unshift({age:s.age,title:'入学先を決定',text:`${u.name} ${c.faculty}。併願の優先順位に従って手続きした。`,kind:'education'});report.push({kind:'success',text:`第${list.indexOf(ap)+1}志望相当の合格先、${u.name}に入学。${wins.length>1?'他の合格先は辞退した。':''}`});
}
function formatProbability(p){return p===0?'0%':p<.001?'0.1%未満':(p*100).toFixed(p<.1?1:0)+'%';}
function sourceURL(r){return r.model?null:'https://www.keinet.ne.jp/exam/ranking/2027/'+r.source+'.pdf#page='+r.page;}
function mock(s){if(s.finished||s.age<15)return'共通テスト型の模試は高校段階から受けられます';const year=s.admissions.mocks.filter(v=>v.age===s.age);if(year.length>=3)return'今年の模試は3回受験済みです';if(s.plan.allocation.study<1)return'学ぶ時間を1コマ以上にしてください';if(!root.LifeNext.payEducation(s,.6))return'受験料6,000円が必要です';
 const base=commonScores(s),i=year.length;let h=2166136261;for(const c of s.seed+s.age+'mock'+i){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}const offset=((h>>>0)%61-30)/10;
 const values=Object.fromEntries(Object.entries(base.values).map(([k,v])=>[k,Math.round(clamp(v+offset)*10)/10]));const targets=s.plan.applications.map(ap=>{const u=root.LifeEngine.universityById(ap.university),c=u.courses[ap.course],v=estimate(s,u,c,ap.route,false);return{name:u.name+' '+c.faculty,p:v.probability,rank:v.rank};});
 s.admissions.mocks.push({age:s.age,period:s.period,number:i+1,values,total:Math.round(clamp(base.total+offset*10,0,1000)),targets});s.admissions.mocks=s.admissions.mocks.slice(-60);s.inner.academicConfidence=clamp(s.inner.academicConfidence+1);return'';
}
root.LifeAdmissions={routes,route,subjectSet,estimate,commonScores,subjectPercent,add,settle,mock,applicationCost,sourceURL,formatProbability,legacyTokyo,coverage:{rows:raw.rows.length,universities:byUni.size},overseas};
})(typeof window!=='undefined'?window:globalThis);
