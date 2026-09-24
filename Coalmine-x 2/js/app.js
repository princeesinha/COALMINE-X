const $=i=>document.getElementById(i),C=$('c'),g=C.getContext('2d'),h=$('k').getContext('2d'),sp=$('sp').getContext('2d');
const RY=230,TW=30,V=55,TANK=10,BX=400,VX=400,VW=110;
const EV=[{x:250,t:'s',len:1.5,l:2},{x:345,t:'s',len:1.8,l:2.5},{x:455,t:'b',len:6.2}];
const STEPS=['Scan & seal cracks','Deploy sensor node','Exit mine','Borehole foaming','Monitor'];
let S,mob=false;
const L=(a,b)=>mob?b:a;
function init(){S={rx:60,mode:'idle',tank:TANK,comm:1,cur:null,tm:0,parts:[],node:0,simD:0,blast:0,pen:0,hist:[],ang:0,clock:0,lt:0,lg:[],
bore:0,bt:0,depth:0,fill:0,sealed:0,sd:0,stp:-9,maxx:60,pend:0,nb:0,cd:0,ccr:[],sub:0,subT:0,bw:0,
ev:EV.map(e=>({...e,seen:0,done:0,j:[0,1,2,3,4].map(()=>Math.random()*10-5)}))};
lg('Rover ready on the surface. Press Start rover.');ui()}
function lg(m){S.lg.unshift('['+S.clock.toFixed(0)+'s] '+m);S.lg=S.lg.slice(0,9);$('log').innerHTML=S.lg.join('<br>')}
function vib(){return .4+Math.random()*.25+(S.blast>0?(5*S.blast/3+Math.random())*(S.sealed?.4:1):0)}
function nCr(){return S.ev.filter(e=>e.seen).length}
function doCut(){if(S.mode=='fwd'||S.mode=='act'){S.comm=0;S.mode='ret';S.pend=0;const k=nCr();lg('⚠ Connection LOST! Rover keeps only what it scanned ('+Math.round((S.maxx-60)*.6)+' m mapped, '+k+' crack'+(k==1?'':'s')+' logged) and reverses out on its own.')}}
function addCracks(n){for(let i=0;i<n;i++){const x=570+Math.random()*120,y=320+Math.random()*80,a=Math.random()*3.14,pts=[];for(let k=0;k<6;k++)pts.push([x+Math.cos(a)*k*10+Math.random()*6,y+Math.sin(a)*k*10+Math.random()*6]);S.ccr.push(pts)}}
function step(dt){S.clock+=dt;S.ang+=dt*3;S.maxx=Math.max(S.maxx,S.rx);if(S.bw>0)S.bw+=dt;if(S.sub&&S.bw>1.6)S.subT=Math.min(1,S.subT+dt/2);if(S.pend&&S.mode=='fwd'&&S.rx>=190)doCut();S.blast=Math.max(0,S.blast-dt);
if(S.mode=='fwd'){S.rx+=V*dt;const e=S.ev.find(e=>!e.done);
 if(!e.seen&&e.x-S.rx<110){e.seen=1;lg('LiDAR: '+(e.t=='s'?'small':'LARGE')+' crack detected (~'+e.len+' m)')}
 if(e.x-S.rx<=26){S.mode='act';S.cur=e;S.tm=0;lg(e.t=='s'?'Rover stopped – PU foaming started':'High-risk crack (5 m+) – deploying sensor node')}}
else if(S.mode=='act'){const e=S.cur,d=e.t=='s'?3:4;S.tm+=dt;
 if(e.t=='s'){for(let i=0;i<3;i++)S.parts.push({x:S.rx+22,y:RY+Math.random()*16-8,vx:60+Math.random()*50,vy:Math.random()*30-15,l:.5});S.tank=Math.max(0,S.tank-e.l*dt/3)}
 if(S.tm>=d){e.done=1;if(e.t=='s'){S.mode='fwd';lg('Crack sealed ('+e.l+' L PU foam used, '+S.tank.toFixed(1)+' L left). Moving ahead')}
 else{S.node=1;S.mode='ret';lg('Sensor node active – streaming to substation. Safe borehole point marked. Rover reversing out.')}}}
else if(S.mode=='ret'){S.rx-=V*dt;if(S.rx<=60){S.rx=60;S.mode='done';const lost=!S.comm;S.comm=1;const k=nCr();lg('Rover back on the surface.'+(S.node?' Ready for borehole foaming.':lost?' Link restored – partial scan uploaded ('+Math.round((S.maxx-60)*.6)+' m mapped, '+k+' crack'+(k==1?'':'s')+' logged). Risky zone not fully surveyed – a second run is needed.':''))}}
if(S.bore==1){S.bt+=dt;S.depth=Math.min(1,S.bt/4);if(S.bt>=4){S.bore=2;S.bt=0;lg('Drill reached the void. PU foam injection from the surface unit started.')}}
else if(S.bore==2){S.bt+=dt;S.fill=Math.min(1,S.bt/8);if(S.bt>=8){S.bore=3;S.sealed=1;S.sd=S.simD;lg('Void filled with PU foam – risky zone stabilised. Sensors keep monitoring.')}}
S.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt});S.parts=S.parts.filter(p=>p.l>0);
if(S.node){S.simD+=dt*.4;if(S.clock-S.lt>.2){S.lt=S.clock;S.hist.push(vib());if(S.hist.length>60)S.hist.shift()}}}
function ui(){const M={idle:'Idle',fwd:'Scanning ahead',act:S.cur&&S.cur.t=='b'?'Deploying node':'PU foaming',ret:S.comm?'Reversing out':'Autonomous return',done:'Mission complete'};
$('m').textContent=M[S.mode];$('cm').textContent=S.comm?'OK':'LOST ⚠';$('cm').style.color=S.comm?'':'#ef4444';
$('ps').textContent=Math.max(0,Math.round((S.rx-60)*.6))+' m';$('ls').textContent=S.mode=='idle'||S.mode=='done'?'Standby':'Scanning';
$('tk').textContent=S.tank.toFixed(1)+' / '+TANK+' L';$('tf').style.width=S.tank/TANK*100+'%';
$('dc').textContent=Math.round((S.maxx-60)*.6)+' m / '+nCr()+' crack'+(nCr()==1?'':'s');
$('zb').textContent=S.nb;$('zs').textContent=S.sub?'SUBSIDED':S.cd>=70?'Critical – cracks widening':S.cd>0?'Cracks appearing':'Stable';$('zs').style.color=S.sub||S.cd>=70?'#ef4444':S.cd>0?'#f59e0b':'#22c55e';
$('zd').textContent=S.cd+'%';$('zc').textContent=S.ccr.length;$('zr').textContent=S.sub?'BLOCKED':'Open';$('zr').style.color=S.sub?'#ef4444':'';$('bh').disabled=false;$('go').disabled=S.mode!='idle';
$('bs').textContent=['Standby','Drilling…','Injecting PU foam…','Void sealed ✓'][S.bore]||'';if(S.bore==0)$('bs').textContent=S.node&&S.mode=='done'?'Ready':'Waiting for node data';
$('bd').textContent=(S.depth*60).toFixed(0)+' / 60 m';$('bi').textContent=(S.fill*400).toFixed(0)+' / 400 L';$('bf').textContent=(S.fill*100).toFixed(0)+'%';$('br').textContent='~'+(S.fill*75).toFixed(0)+'%';
const cur=S.mode=='idle'?-1:(S.mode=='fwd'||(S.mode=='act'&&S.cur.t=='s'))?0:S.mode=='act'?1:S.bore==0?2:S.bore<3?3:4;
if(cur!=S.stp){S.stp=cur;$('steps').innerHTML=STEPS.map((s,i)=>'<span class="st '+(i<cur?'ok':i==cur?'on':'')+'">'+(i<cur?'✓ ':(i+1)+'. ')+s+'</span>').join('')}
if(S.node){const d=S.simD,n=()=>Math.random()-.5,base=Math.max(.5,12-d*.9-S.pen);
 const eta=S.sealed?Math.max(.5,45-(d-S.sd)*.4-S.pen*.5):base+S.fill*(45-base);
 $('eta').textContent='~'+eta.toFixed(1)+' days';const ok=S.sealed&&eta>20;
 $('st').textContent=ok?'Stabilised – keep monitoring':eta>7?'Monitoring':eta>3?'Warning':'DANGER – alert';$('st').style.color=ok||eta>7?'#22c55e':eta>3?'#f59e0b':'#ef4444';
 $('sr').textContent=(140+d*6+n()*3).toFixed(0)+' µε / '+(.1+d*.012).toFixed(2)+'°';$('cv').textContent=(2+d*.6).toFixed(1)+' mm / '+(.3+n()*.05).toFixed(2)+'%';
 $('vb').textContent=S.hist.length?S.hist[S.hist.length-1].toFixed(2):'—';$('cf').textContent=d.toFixed(1)+' days / '+Math.min(98,35+d*12).toFixed(0)+'%';
 sp.fillStyle='#0f1a1f';sp.fillRect(0,0,300,50);sp.strokeStyle='#4fd1c5';sp.beginPath();S.hist.forEach((v,i)=>{const X=i*5,Y=48-Math.min(v,7)*6;i?sp.lineTo(X,Y):sp.moveTo(X,Y)});sp.stroke()}
else{$('eta').textContent='—';$('st').textContent='Node not deployed';$('st').style.color='';['sr','cv','vb','cf'].forEach(k=>$(k).textContent='—');sp.fillStyle='#0f1a1f';sp.fillRect(0,0,300,50)}}
function txt(G,t,x,y,c,s,b){if(!t)return;G.fillStyle=c||'#cbb89a';G.font=(b?'bold ':'')+(s||13)*(mob?1.55:1)+'px system-ui,sans-serif';G.fillText(t,x,y)}
function zone(x,y,w,hh,c,a,b){g.fillStyle=c+'22';g.strokeStyle=c;g.lineWidth=1.5;g.fillRect(x,y,w,hh);g.strokeRect(x,y,w,hh);txt(g,L(a,b),x+8,y+(mob?28:17),c,13,mob)}
function draw(){g.clearRect(0,0,900,440);g.fillStyle='#1c1611';g.fillRect(0,0,900,440);
g.fillStyle='#24402f';g.fillRect(0,0,110,440);txt(g,'SURFACE',22,428,'#9fd3a8',12,mob);
g.fillStyle='#4b5563';g.fillRect(15,25,80,45);g.fillStyle='#22d3ee';g.fillRect(22,32,22,14);txt(g,L('Substation',''),22,84,'#9fd3a8');
zone(120,100,400,260,'#22c55e','ZONE A – work completed (rover here)','ZONE A');zone(545,30,170,150,'#f59e0b','ZONE B – active work','ZONE B');zone(545,280,170,150,S.subT>.3?'#ef4444':S.cd>0?'#f97316':'#f59e0b',S.subT>.3?'ZONE C – SUBSIDED':'ZONE C – active work','ZONE C');zone(740,110,140,220,'#9ca3af','ZONE D – closed','ZONE D');
if(S.blast>0){g.fillStyle='rgba(255,120,0,'+(.4*S.blast/3)+')';g.fillRect(545,30,170,150);txt(g,'BLAST',600,120,'#fff',14,1)}
g.fillStyle='#2b241c';g.fillRect(110,RY-TW,410,TW*2);if(S.maxx>110){g.fillStyle='rgba(34,211,238,.10)';g.fillRect(110,RY-TW,Math.min(S.maxx,520)-110,TW*2)}if((!S.comm||(S.mode=='done'&&!S.node))&&S.maxx<480)txt(g,L('not scanned ▶','?'),S.maxx+12,RY+4,'#f59e0b');g.fillStyle='#211b15';g.fillRect(520,RY-TW,360,TW*2);g.fillRect(620,180,20,50);g.fillRect(620,260,20,50);
g.fillStyle='#0b0805';g.fillRect(104,RY-TW-4,8,TW*2+8);txt(g,L('Entrance',''),114,RY+TW+16);
if(S.bw>0&&S.bw<2.5){g.strokeStyle='rgba(255,140,0,'+(1-S.bw/2.5)+')';g.lineWidth=3;g.beginPath();g.arc(630,105,S.bw*110,.3,Math.PI-.3);g.stroke()}
g.strokeStyle='#ef4444';g.lineWidth=1.5+S.cd/35;S.ccr.forEach(c=>{g.beginPath();c.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke()});
if(S.subT>0){const t=S.subT;g.fillStyle='rgba(15,8,4,'+.75*t+')';g.beginPath();g.ellipse(630,360,80*t,58*t,0,0,7);g.fill();g.strokeStyle='#ef4444';g.lineWidth=2;for(let i=1;i<4;i++){g.beginPath();g.ellipse(630,360,(80+i*8)*t,(58+i*6)*t,0,0,7);g.stroke()}
 if(t>.5){g.lineWidth=4;g.beginPath();g.moveTo(620,262);g.lineTo(640,282);g.moveTo(640,262);g.lineTo(620,282);g.stroke();txt(g,L('Road blocked',''),648,276,'#ef4444',12,1)}txt(g,L('SUBSIDENCE','SUNK'),575,364,'#fff',14,1)}
S.ev.forEach(e=>{if(e.done&&e.t=='s'){g.fillStyle='#f5d76e';g.beginPath();g.ellipse(e.x,RY,9,TW,0,0,7);g.fill();g.fillStyle='#d4a72c';for(let i=0;i<6;i++){g.beginPath();g.arc(e.x-5+i*2,RY-20+i*8,2.5,0,7);g.fill()}}
else{g.strokeStyle=e.seen?'#ef4444':'#3a322a';g.lineWidth=e.t=='b'?4:2.5;g.beginPath();e.j.forEach((j,i)=>{const X=e.x+j,Y=RY-TW+i*TW/2;i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke()}
if(e.seen)txt(g,(e.t=='s'?'':'⚠ ')+e.len+' m'+(e.done&&e.t=='s'?L(' ✓ sealed',' ✓'):''),e.x-24,RY-TW-8,e.t=='b'?'#ef4444':'#f59e0b',13,mob)});
if(S.node){g.fillStyle=S.sealed?'rgba(245,215,110,.35)':'rgba(239,68,68,.18)';g.fillRect(415,RY-TW,90,TW*2);txt(g,S.sealed?L('SEALED – PU foam','SEALED'):L('RISKY ZONE','RISK'),418,RY+TW+18,S.sealed?'#f5d76e':'#ef4444',13,mob);
g.strokeStyle='#22d3ee';g.setLineDash([5,5]);g.lineDashOffset=-S.clock*20;g.lineWidth=1.2;g.beginPath();g.moveTo(482,RY+16);g.lineTo(55,72);g.stroke();g.setLineDash([]);
const pu=6+3*Math.sin(S.clock*5);g.fillStyle='#22d3ee';g.beginPath();g.arc(482,RY+16,5,0,7);g.fill();g.strokeStyle='rgba(34,211,238,.5)';g.beginPath();g.arc(482,RY+16,pu+4,0,7);g.stroke();txt(g,L('Sensor node',''),446,RY+46,'#22d3ee');
const by=178;g.lineWidth=2;if(S.bore==0){g.strokeStyle='#22c55e';g.setLineDash([4,3]);g.beginPath();g.arc(BX-5,by,10,0,7);g.stroke();g.setLineDash([]);txt(g,L('Safe borehole point','SAFE'),BX-40,by-16,'#22c55e',12,mob)}
else{g.fillStyle='#f97316';g.fillRect(BX-14,by-10,18,18);g.strokeStyle='#fff';g.beginPath();g.moveTo(BX-10,by-6);g.lineTo(BX-2,by+4);g.moveTo(BX-2,by-6);g.lineTo(BX-10,by+4);g.stroke();
 if(S.bore>=2){g.fillStyle='rgba(245,215,110,.45)';g.beginPath();g.arc(BX-5,by,10+S.fill*40,0,7);g.fill()}txt(g,L(['','Drilling…','Injecting foam','Borehole sealed'][S.bore],''),BX-44,by-16,'#f5d76e')}}
const rx=S.rx,act=S.mode!='idle'&&S.mode!='done';
if(rx>110&&act){g.fillStyle='rgba(120,255,120,.10)';g.beginPath();g.moveTo(rx+20,RY);g.lineTo(rx+110,RY-TW);g.lineTo(rx+110,RY+TW);g.fill();
for(let a=-1.3;a<=1.3;a+=.11){const b=a+Math.sin(S.ang)*.1,s=Math.abs(Math.sin(b))||.01,d=Math.min(TW/s,95),X=rx+Math.cos(b)*d,Y=RY-8+Math.sin(b)*d;g.strokeStyle='rgba(34,211,238,.13)';g.beginPath();g.moveTo(rx,RY-8);g.lineTo(X,Y);g.stroke();g.fillStyle='#22d3ee';g.fillRect(X-1,Y-1,2,2)}}
g.fillStyle='#111';[-12,12].forEach(o=>{g.fillRect(rx+o-6,RY+8,12,7);g.fillRect(rx+o-6,RY-15,12,7)});
g.fillStyle='#e5e7eb';g.fillRect(rx-20,RY-9,40,18);g.fillStyle='#2563eb';g.fillRect(rx-28,RY-8,10,16);g.fillStyle='#93c5fd';g.fillRect(rx-28,RY-8+16*(1-S.tank/TANK),10,16*S.tank/TANK);
g.fillStyle='#22d3ee';g.beginPath();g.arc(rx,RY-1,5,0,7);g.fill();g.fillStyle='#a3e635';g.fillRect(rx+18,RY-5,5,10);g.fillStyle='#f97316';g.fillRect(rx+22,RY-1,7,3);
txt(g,'UGV',rx-11,RY-20,'#fff',12,mob);if(rx<110)txt(g,L('LiDAR ↑  Camera →  PU tank ←',''),rx-40,RY+30);
S.parts.forEach(p=>{g.fillStyle='rgba(245,215,110,'+Math.min(1,p.l*2)+')';g.beginPath();g.arc(p.x,p.y,3,0,7);g.fill()});
if(!S.comm){const w=mob?250:340;g.fillStyle='rgba(239,68,68,.92)';g.fillRect(450-w/2,8,w,mob?36:26);txt(g,L('⚠ CONNECTION LOST – AUTONOMOUS RETURN','⚠ LINK LOST – RETURNING'),450-w/2+10,mob?33:26,'#fff',13,1)}}
function drawSec(){h.clearRect(0,0,900,230);h.fillStyle='#1b2b3a';h.fillRect(0,0,900,70);h.fillStyle='#2b2118';h.fillRect(0,70,900,160);
h.strokeStyle='#3a2d22';h.lineWidth=1;[100,130,160,220].forEach(y=>{h.beginPath();h.moveTo(0,y);h.lineTo(900,y);h.stroke()});
h.fillStyle='#3f7a4f';h.fillRect(0,66,900,5);txt(h,L('Surface',''),8,50,'#9fd3a8');
h.strokeStyle='#0d0a07';h.lineWidth=34;h.beginPath();h.moveTo(62,70);h.lineTo(110,190);h.stroke();h.fillStyle='#0d0a07';h.fillRect(110,170,410,40);h.fillStyle='#15110d';h.fillRect(520,170,360,40);
txt(h,L('Mine tunnel (Zone A)',''),150,226,'#8a7a66');
const b=S.ev[2];if(b.seen||S.node){h.fillStyle='rgba(239,68,68,.14)';h.fillRect(VX,105,VW,105);h.strokeStyle='#ef4444';h.lineWidth=1.5;h.setLineDash([5,4]);h.strokeRect(VX,105,VW,105);h.setLineDash([]);txt(h,L('Fracture zone / void',''),VX+6,100,'#ef4444')}
if(S.fill>0){const fh=S.fill*105;h.fillStyle='rgba(245,215,110,.92)';h.fillRect(VX,210-fh,VW,fh);h.fillStyle='#d4a72c';for(let i=0;i<24;i++){h.beginPath();h.arc(VX+8+(i*37)%96,210-((i*23)%100)*S.fill,2.5,0,7);h.fill()}}
S.ev.forEach(e=>{if(e.done&&e.t=='s'){h.fillStyle='#f5d76e';h.fillRect(e.x-7,150,14,60)}else{const n=e.t=='b'?21:5.5;h.strokeStyle=e.seen?'#ef4444':'#3a322a';h.lineWidth=e.t=='b'?4:2.5;h.beginPath();e.j.forEach((j,i)=>{i?h.lineTo(e.x+j,170-i*n):h.moveTo(e.x+j,170)});h.stroke()}});
if(S.node){h.fillStyle='#22d3ee';h.beginPath();h.arc(482,200,5,0,7);h.fill();txt(h,L('Sensor node',''),450,190,'#22d3ee')
 const dy=70+S.depth*80;h.fillStyle=S.bore?'#f59e0b':'#4b5563';h.fillRect(BX-14,48,28,18);h.strokeStyle=h.fillStyle;h.lineWidth=2;h.beginPath();h.moveTo(BX-8,48);h.lineTo(BX,28);h.lineTo(BX+8,48);h.stroke();
 if(S.bore){h.strokeStyle='#050403';h.lineWidth=6;h.beginPath();h.moveTo(BX,70);h.lineTo(BX,dy);h.stroke();h.strokeStyle='#e5e7eb';h.lineWidth=2;h.beginPath();h.moveTo(BX,66);h.lineTo(BX,dy);h.stroke();
  if(S.bore>1){h.fillStyle='#f5d76e';h.beginPath();h.arc(BX,150,5+S.fill*6,0,7);h.fill()}}
 txt(h,L('Borehole (≈60 m)',S.bore?'':'BH'),BX-58,22,'#f59e0b')}
const rx=S.rx,y=rx<110?66+(rx-60)/50*124:190;h.fillStyle='#e5e7eb';h.fillRect(rx-15,y-9,30,15);h.fillStyle='#2563eb';h.fillRect(rx-21,y-8,7,13);h.fillStyle='#22d3ee';h.beginPath();h.arc(rx,y-9,3.5,0,7);h.fill();
txt(h,L('CROSS-SECTION',''),8,18,'#cbb89a',12,1)}
$('go').onclick=()=>{if(S.mode=='idle'){S.mode='fwd';lg('Rover entered Zone A – LiDAR + night-vision scan ON')}};
$('cut').onclick=()=>{if(S.mode=='fwd'||S.mode=='act')doCut();else if(S.mode=='idle'){S.mode='fwd';S.pend=1;lg('Rover entered Zone A – scanning. Link will drop once it is inside the mine.')}else lg('Rover is not inside the mine right now. Press Reset, then Connection lost during a run.')};
$('bl').onclick=()=>{S.blast=3;S.bw=.01;S.nb++;if(S.node)S.pen+=1.5;const eta=S.node?' Zone A ETA reduced.':'';
 if(S.sub){lg('Blast in Zone B – Zone C has already subsided.'+eta);return}
 S.cd=Math.min(100,S.cd+35);
 if(S.cd>=100){S.sub=1;lg('Blast in Zone B – shock wave hits Zone C: SUBSIDENCE! Main road link blocked, anyone inside would be trapped.'+eta)}
 else{addCracks(2);lg('Blast in Zone B – shock wave reaches Zone C: 2 new cracks, damage '+S.cd+'%.'+(S.cd>=70?' Zone C is critical – one more blast may collapse it.':'')+eta)}};
$('bh').onclick=()=>{
  if(S.bore!==0){lg('Borehole sequence is already running or has been completed.');return}
  if(!S.node){lg('Borehole + PU foaming: waiting for the rover to deploy the sensor node.');return}
  if(S.mode!=='done'){lg('Borehole + PU foaming: rover must return to the surface first.');return}
  S.bore=1;S.bt=0;
  lg('Drill rig set up at the safe point. Drilling borehole toward the void…');
};
$('rs').onclick=init;
init();
let pt=performance.now();(function f(t){const dt=Math.min(.05,(t-pt)/1000);pt=t;mob=C.clientWidth<620;step(dt);ui();draw();drawSec();requestAnimationFrame(f)})(pt);