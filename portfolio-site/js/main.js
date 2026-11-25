/* Settings
   FORM_ENDPOINT: paste a Formspree form URL here to receive contact messages by email
   (see README.md). Leave it empty to open the visitor's email app instead. */
var FORM_ENDPOINT='';


(function(){
  var views=document.querySelectorAll('[data-view]'),links=document.querySelectorAll('nav a');
  var routed=false,swapT=0;
  function route(){
    var h=(location.hash||'#home').slice(1),found=null,prev=null;
    views.forEach(function(v){if(v.dataset.view===h)found=v});
    if(!found){found=views[0];h='home'}
    views.forEach(function(v){if(!v.hidden&&v!==found)prev=v});
    var cur=['ridersafe','apparel-303','kainsaan'].indexOf(h)>-1?'work':h;
    links.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','page')});
    document.title=(found.dataset.title==='Home'?'':found.dataset.title+' – ')+'Clarence Matthew Yabut';
    var order=['home','work','creative','about','certifications','recommendations','contact'],nx=order[(order.indexOf(cur)+1)%order.length],nl=document.getElementById('next');
    nl.href='#'+nx;nl.textContent=nx==='home'?'Back to the start':'Next: '+document.querySelector('[data-view="'+nx+'"]').dataset.title;
    document.documentElement.setAttribute('data-page',h);
    function show(){views.forEach(function(v){v.hidden=v!==found;v.classList.remove('leaving')});window.scrollTo(0,0);var t=found.querySelector('h1');if(t&&routed)t.focus({preventScroll:true});routed=true;var nmEl=document.querySelector('h1.name');if(nmEl&&nmEl._measure&&found.dataset.view==='home')requestAnimationFrame(nmEl._measure)}
    clearTimeout(swapT);
    if(prev&&routed&&!still){prev.classList.add('leaving');swapT=setTimeout(show,170)}else show();
  }
  window.addEventListener('hashchange',route);

  document.querySelectorAll('header,main,article,h1,h2,h3,footer,nav').forEach(function(el){el.setAttribute('data-tag','<'+el.tagName.toLowerCase()+'>')});
  var ib=document.getElementById('inspect');
  var itags=document.createElement('div');itags.id='itags';document.body.appendChild(itags);var itimer=0;
  function drawTags(){itags.textContent='';if(!document.body.classList.contains('inspect'))return;document.querySelectorAll('[data-tag]').forEach(function(el){var r=el.getBoundingClientRect();if(!r.width||!r.height||el.closest('[hidden]'))return;var t=document.createElement('div');t.className='itag';t.textContent=el.dataset.tag;t.style.left=(r.left+scrollX)+'px';t.style.top=(r.top+scrollY)+'px';itags.appendChild(t)})}
  ib.addEventListener('click',function(){var on=document.body.classList.toggle('inspect');ib.setAttribute('aria-pressed',String(on));ib.textContent=on?'Hide page structure':'Show page structure';clearInterval(itimer);drawTags();if(on)itimer=setInterval(drawTags,500)});

  /* Background eyes: faint, behind content, never intercept clicks */
  var layer=document.getElementById('eyes'),eyes=[],still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  [[5,16,56],[96,10,44],[4,58,48],[96,48,60],[3,90,42],[95,86,52],[98,62,34],[2,76,44],[97,30,38],[2.5,32,34]].forEach(function(p){
    var e=document.createElement('div');e.className='eye';e.style.cssText='left:'+p[0]+'%;top:'+p[1]+'%;--s:'+p[2]+'px';e.dataset.d=p.join();
    var pu=document.createElement('div');pu.className='pupil';e.appendChild(pu);layer.appendChild(e);eyes.push([e,pu]);
  });
  var mx=null,my=null,eraf=0;
  function look(){eraf=0;if(mx===null)return;eyes.forEach(function(x){
    var r=x[0].getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=mx-cx,dy=my-cy,d=Math.hypot(dx,dy)||1,m=Math.min(r.width*.2,d);
    x[1].style.transform='translate('+(dx/d*m)+'px,'+(dy/d*m)+'px)';
  })}
  if(!still){
    function aimEyes(e){mx=e.clientX;my=e.clientY;if(!eraf)eraf=requestAnimationFrame(look)}
    addEventListener('pointermove',aimEyes,{passive:true});addEventListener('pointerdown',aimEyes,{passive:true});
    setInterval(function(){var x=eyes[Math.floor(Math.random()*eyes.length)][0];x.classList.add('blink');setTimeout(function(){x.classList.remove('blink')},140)},2600);
  }
  var eb=document.getElementById('eyeBtn');
  function setEyes(on){document.body.classList.toggle('no-eyes',!on);eb.setAttribute('aria-pressed',String(on));eb.textContent=on?'Eyes on':'Eyes off';try{localStorage.setItem('eyes',on?'1':'0')}catch(e){}}
  try{if(localStorage.getItem('eyes')==='0')setEyes(false)}catch(e){}
  eb.addEventListener('click',function(){setEyes(document.body.classList.contains('no-eyes'))});

  /* RiderSafe safety-button demo */
  var sos=document.getElementById('sos'),sw=document.getElementById('sw'),msg=document.getElementById('msg');
  [['Red','#d92d20'],['Blue','#2748ff'],['Green','#1b8a4b'],['Amber','#a85f00']].forEach(function(c,i){
    var b=document.createElement('button');b.type='button';b.style.background=c[1];b.setAttribute('aria-label',c[0]);b.setAttribute('aria-pressed',String(i===0));
    b.addEventListener('click',function(){sos.style.setProperty('--sos',c[1]);sw.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true')});
    sw.appendChild(b);
  });
  document.getElementById('size').addEventListener('input',function(e){sos.style.setProperty('--size',e.target.value+'px')});
  document.getElementById('txt').addEventListener('input',function(e){sos.textContent=e.target.value||'SOS'});
  sos.addEventListener('click',function(){
    sos.classList.remove('sent');void sos.offsetWidth;sos.classList.add('sent');
    msg.textContent='Check-in sent at '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'. Your contact can see you’re safe.';
  });
  var ck=document.getElementById('clock');
  var ck2=document.getElementById('clock2');
  function clockTick(){try{var t=new Date().toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit',timeZone:'Asia/Manila'});ck.textContent=t;if(ck2)ck2.textContent=t;skyUpdate()}catch(e){}}
  clockTick();setInterval(clockTick,30000);

  /* Filters for skills and certifications */
  var cg=['creative','it','creative','creative','creative','web','web','creative','it'];
  document.querySelectorAll('.cert li').forEach(function(li,i){li.dataset.g=cg[i]});
  document.querySelectorAll('.filters').forEach(function(f){
    var scope=f.parentNode;
    f.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      f.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
      scope.querySelectorAll('[data-g]').forEach(function(i){i.hidden=b.dataset.f!=='all'&&i.dataset.g!==b.dataset.f});
    });
  });

  /* Copy email */
  var cp=document.getElementById('copy'),cd=document.getElementById('copied');
  cp.addEventListener('click',function(){
    var fail=function(){cd.textContent='Select the address above to copy it.'};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText('cmf.yabut@gmail.com').then(function(){cd.textContent='Copied';setTimeout(function(){cd.textContent=''},2000)},fail)}else{fail()}
  });
  /* Fade items in as they scroll into view */
  if('IntersectionObserver' in window&&!still){
    document.documentElement.classList.add('js');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll('.project,.cert li,.quote,.big-links li,.cols>div,.glance>div').forEach(function(el,i){
      el.classList.add('rv');el.style.transitionDelay=(i%4)*70+'ms';
      el.addEventListener('transitionend',function(){el.style.transitionDelay=''},{once:true});
      io.observe(el);
    });
    io.observe(document.querySelector('.cert'));
  }
  /* Theme: light by default, dark on request */
  function setTheme(d){document.documentElement.setAttribute('data-theme',d?'dark':'light');document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.textContent=d?'Light mode':'Dark mode'});try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}}
  var wasDark=false;try{wasDark=localStorage.getItem('theme')==='dark'}catch(e){}
  setTheme(wasDark);
  function themeSwitch(btn){
    var next=document.documentElement.getAttribute('data-theme')!=='dark';
    if(!document.startViewTransition||still){setTheme(next);return}
    var r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    document.documentElement.classList.add('vt');
    var t=document.startViewTransition(function(){setTheme(next)});
    t.ready.then(function(){document.documentElement.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:620,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'})}).catch(function(){});
    t.finished.then(function(){document.documentElement.classList.remove('vt')},function(){document.documentElement.classList.remove('vt')})
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){themeSwitch(b)})});

  /* Image viewer */
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),opener=null;
  function closeLb(){lb.hidden=true;if(opener)opener.focus()}
  document.querySelectorAll('.zoom').forEach(function(z){z.addEventListener('click',function(){var im=z.querySelector('img');opener=z;lbi.src=im.src;lbi.alt=im.alt;lb.hidden=false;document.getElementById('lbx').focus()})});
  lb.addEventListener('click',closeLb);
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb()});

  /* Landing: a short opening screen, then an optional quick game */
  var ov=document.getElementById('game'),cv=document.getElementById('gcv'),cx=cv.getContext('2d'),wrapEl=document.querySelector('.wrap'),
      hud=document.getElementById('ghud'),gmsg=document.getElementById('gmsg'),gst=document.getElementById('gstart'),glive=document.getElementById('glive'),
      gpage=document.getElementById('gpage'),gblocks=gpage.querySelectorAll('.b'),
      intro=document.getElementById('intro'),gpanel=document.getElementById('gpanel'),ihint=document.getElementById('ihint'),
      STAGES=[
        {n:'HTML',s:'Close the tags.',tok:['</div>','</p>','</a>','</li>','</ul>','</span>','</h1>'],code:['<!doctype html>','<header class="top">','<nav aria-label="Main">','<main id="main">','<section class="hero">','<h1>Clarence Yabut</h1>','<article class="project">','<footer>']},
        {n:'CSS',s:'Watch the sway.',tok:['}','};',';','%}','px}'],code:['.hero { display: grid; }','a { text-underline-offset: .2em; }','@media (max-width: 640px) {','  header.top { position: static; }',':root { --accent: #2748ff; }','.card:hover { transform: none; }','h1 { text-wrap: balance; }','.strip { overflow-x: auto; }']},
        {n:'JavaScript',s:'Squash the bugs.',tok:['});','];','})','};','();'],code:['const app = express();','await connectDB();','app.get("/restaurants", list);','db.restaurants.find({});','if (rating >= 4.5) show(card);','route(location.hash);','fetch("/api/trash");','export default App;']},
        {n:'Deploy',s:'Ship it.',tok:['</html>'],code:['git add .','git commit -m "ship it"','git push origin main','render: building...','render: deploy live','status: 200 OK','npm run build','Your service is live']}],
      GOAL=10,gW=0,gH=0,px=0,pvx=0,items=[],parts=[],lives=3,score=0,hits=0,losses=0,sp=0,last=0,run=false,raf=0,keys={},slow=0,shake=0,flash=0,finaleOut=false,phase='idle',countT=0,endT=0,bgY=0,t0=0,stage=0,bannerT=0,shield=false;
  var musicStart=null,musicUnlock=null;
  function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  function fit(){var d=window.devicePixelRatio||1;gW=Math.max(260,Math.min(ov.clientWidth-32,640));gH=Math.max(240,Math.min(innerHeight*.45,380));cv.style.width=gW+'px';cv.style.height=gH+'px';cv.width=gW*d;cv.height=gH*d;cx.setTransform(d,0,0,d,0,0)}
  var best=0;try{best=parseFloat(localStorage.getItem('best'))||0}catch(e){}
  function stageOf(s){return s<3?0:s<6?1:s<9?2:3}
  function hudUp(){
    hud.textContent='Compiled '+score+' of '+GOAL+'. Lives: '+'●'.repeat(Math.max(0,lives))+'○'.repeat(Math.max(0,3-lives))+(shield?'. Shield ready':'')+(slow>0?'. Coffee boost':'')+(best?'. Best time: '+best.toFixed(1)+'s':'');
    gblocks.forEach(function(b,i){if(i<score){if(!b.classList.contains('on')){b.classList.add('on');if(!still){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}}}else b.classList.remove('on','pop')})
  }
  function enter(won){run=false;phase='idle';cancelAnimationFrame(raf);try{sessionStorage.setItem('played','1')}catch(e){}wrapEl.inert=false;document.body.classList.remove('gaming');ov.classList.add('out');setTimeout(function(){ov.hidden=true},500);route();if(won===true&&musicStart)setTimeout(musicStart,350)}
  function hintUpdate(){var p=document.getElementById('player');ihint.hidden=!p||p.hidden}
  function openIntro(){ov.classList.add('intro-on');intro.hidden=false;gpanel.hidden=true;ov.setAttribute('aria-labelledby','ititle');wrapEl.inert=true;document.body.classList.add('gaming');hintUpdate();setTimeout(hintUpdate,700);setTimeout(hintUpdate,1900);setTimeout(function(){var b=document.getElementById('iplay');if(b&&!ov.hidden)b.focus({preventScroll:true})},80)}
  function openGame(){ov.classList.remove('intro-on');intro.hidden=true;gpanel.hidden=false;ov.setAttribute('aria-labelledby','gtitle');beginRun()}
  function drawBug(x,y,body){
    /* eyes use fixed colors so they stay visible in every theme */
    cx.strokeStyle=body;cx.lineWidth=2;
    for(var i=-1;i<=1;i++){cx.beginPath();cx.moveTo(x-8,y+i*5);cx.lineTo(x-15,y+i*5+3);cx.moveTo(x+8,y+i*5);cx.lineTo(x+15,y+i*5+3);cx.stroke()}
    cx.fillStyle=body;cx.beginPath();cx.ellipse(x,y,11,9,0,0,6.283);cx.fill();
    cx.fillStyle='#fff';[-4,4].forEach(function(o){cx.beginPath();cx.arc(x+o,y-2,3.2,0,6.283);cx.fill()});
    cx.fillStyle='#0f1b33';[-4,4].forEach(function(o){cx.beginPath();cx.arc(x+o,y-1.5,1.5,0,6.283);cx.fill()});
  }
  function drawCup(x,y,ink,gold,mut){
    cx.strokeStyle=ink;cx.lineWidth=2;cx.fillStyle=gold;cx.beginPath();if(cx.roundRect)cx.roundRect(x-9,y-8,16,15,3);else cx.rect(x-9,y-8,16,15);cx.fill();cx.stroke();
    cx.beginPath();cx.arc(x+8,y,5,-1.2,1.2);cx.stroke();
    cx.strokeStyle=mut;cx.lineWidth=1.5;cx.beginPath();cx.moveTo(x-4,y-11);cx.quadraticCurveTo(x-7,y-15,x-4,y-19);cx.moveTo(x+2,y-11);cx.quadraticCurveTo(x+5,y-15,x+2,y-19);cx.stroke();
  }
  function drawShield(x,y,acc,paper){
    cx.fillStyle=paper;cx.strokeStyle=acc;cx.lineWidth=2.5;cx.beginPath();cx.moveTo(x,y-12);cx.lineTo(x+10,y-8);cx.lineTo(x+9,y+3);cx.quadraticCurveTo(x+7,y+10,x,y+14);cx.quadraticCurveTo(x-7,y+10,x-9,y+3);cx.lineTo(x-10,y-8);cx.closePath();cx.fill();cx.stroke();
    cx.beginPath();cx.moveTo(x-4,y);cx.lineTo(x-1,y+4);cx.lineTo(x+5,y-4);cx.stroke();
  }
  function burst(x,y,c,n,big){if(still)return;for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(big?120:70)+Math.random()*(big?220:130);parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,life:.5+Math.random()*.4,t:0,c:Array.isArray(c)?c[i%c.length]:c,s:3+Math.random()*3})}}
  function catchIt(it,acc,bad,sun){
    var evil=it.k==='bug'||it.k==='zig'||it.k==='conf';
    if(evil){
      if(shield){shield=false;burst(it.x,it.y,acc,12);glive.textContent='Shield blocked a bug.'}
      else{lives--;hits++;shake=still?0:.3;flash=(still||lives<=0)?0:.22;burst(it.x,it.y,bad,12);if(lives>0)glive.textContent='Bug hit. '+lives+(lives===1?' life':' lives')+' left.'}
    }else if(it.k==='cup'){slow=4;burst(it.x,it.y,[sun,acc],10);glive.textContent='Coffee boost: everything falls slower.'}
    else if(it.k==='shield'){shield=true;burst(it.x,it.y,acc,10);glive.textContent='Shield ready: it blocks the next bug.'}
    else{
      score++;burst(it.x,it.y,it.k==='final'?[acc,sun,bad,css('--ok')]:acc,it.k==='final'?34:8,it.k==='final');
      var ns=stageOf(score);if(ns!==stage&&score<GOAL){stage=ns;bannerT=1.7;glive.textContent='Stage '+(ns+1)+': '+STAGES[ns].n+'. '+STAGES[ns].s}
    }
    hudUp()
  }
  function beginRun(){
    fit();items=[];parts=[];lives=3;score=0;hits=0;sp=0;slow=0;shake=0;flash=0;finaleOut=false;pvx=0;px=gW/2;stage=0;bannerT=0;shield=false;phase='count';countT=2.1;endT=0;
    gpage.classList.remove('done');hudUp();gmsg.textContent='Build the page: catch the closing tags, dodge the bugs.';gst.hidden=true;glive.textContent='Get ready.';
    run=true;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(gTick)
  }
  function gTick(t){
    if(!run)return;
    var dt=Math.min(.05,(t-last)/1000);last=t;
    var ink=css('--ink'),acc=css('--accent'),bad=css('--sos'),paper=css('--paper'),mut=css('--muted'),sun=css('--sun'),onacc=css('--on-accent'),py=gH-38,mono='ui-monospace,Menlo,Consolas,monospace',disp=css('--display');
    var ox=px;if(keys.ArrowLeft||keys.a)px-=460*dt;if(keys.ArrowRight||keys.d)px+=460*dt;px=Math.max(40,Math.min(gW-40,px));
    pvx+=((px-ox)/Math.max(dt,.001)-pvx)*.25;
    if(phase==='count'){countT-=dt;if(countT<=0){phase='play';t0=performance.now();sp=.2;bannerT=1.7;glive.textContent='Go. Stage 1: HTML. Close the tags.'}}
    if(phase==='play'){
      slow=Math.max(0,slow-dt);sp-=dt;
      if(sp<=0){
        var st=stage,o={y:-18,v:(90+Math.random()*50)*(1+st*.14),amp:0,ph:Math.random()*6.283},r=Math.random(),bugP=Math.max(.08,[.12,.2,.28,.7][st]-losses*.04);
        o.x=o.bx=26+Math.random()*(gW-52);
        sp=[1,.88,.74,.85][st]*(.85+Math.random()*.35);
        if(score>=GOAL-1){if(!finaleOut){o.k='final';o.s='</html>';o.v=75;finaleOut=true}else o.k='bug'}
        else if(r<bugP){var q=Math.random();if(st>=2&&q<.3){o.k='conf';o.v*=1.05}else if(st>=1&&q<.6){o.k='zig';o.amp=34}else o.k='bug'}
        else if(st>=1&&r<bugP+.05&&slow<=0)o.k='cup';
        else if(st>=1&&r<bugP+.1&&!shield)o.k='shield';
        else{var tk=STAGES[st].tok;o.k='tag';o.s=tk[Math.floor(Math.random()*tk.length)];o.amp=[0,18,22,0][st]}
        items.push(o)
      }
    }
    cx.save();
    if(shake>0){shake-=dt;var m=shake*28;cx.translate((Math.random()-.5)*m,(Math.random()-.5)*m)}
    cx.clearRect(-10,-10,gW+20,gH+20);
    var CODE=STAGES[stage].code;
    if(!still)bgY=(bgY+16*dt)%(20*CODE.length);
    cx.globalAlpha=.11;cx.fillStyle=mut;cx.font='12px '+mono;cx.textAlign='left';
    var rows=Math.ceil(gH/20)+1;for(var q2=0;q2<rows;q2++){cx.fillText(CODE[q2%CODE.length],14,(((q2*20-bgY)%(rows*20))+rows*20)%(rows*20)-6)}
    cx.globalAlpha=1;
    var mv=phase==='play'?dt*(slow>0?.55:1):0;
    items=items.filter(function(it){
      it.y+=it.v*mv;
      if(it.amp)it.x=Math.max(22,Math.min(gW-22,it.bx+Math.sin(it.y*.045+it.ph)*it.amp));
      if(phase==='play'&&it.y>py-8&&it.y<py+26&&Math.abs(it.x-px)<(it.k==='final'?54:44)){catchIt(it,acc,bad,sun);return false}
      if(it.y>gH+28){if(it.k==='final')finaleOut=false;return false}
      if(it.k==='bug'||it.k==='zig')drawBug(it.x,it.y,bad);
      else if(it.k==='conf'){cx.fillStyle=bad;cx.globalAlpha=.16;cx.beginPath();if(cx.roundRect)cx.roundRect(it.x-26,it.y-14,52,22,6);else cx.rect(it.x-26,it.y-14,52,22);cx.fill();cx.globalAlpha=1;cx.font='800 15px '+mono;cx.textAlign='center';cx.fillText('<<<<',it.x,it.y+2)}
      else if(it.k==='cup')drawCup(it.x,it.y,ink,sun,mut);
      else if(it.k==='shield')drawShield(it.x,it.y,acc,paper);
      else if(it.k==='final'){var w=74*(1+.06*Math.sin(t/180));cx.fillStyle=acc;cx.beginPath();if(cx.roundRect)cx.roundRect(it.x-w/2,it.y-15,w,24,8);else cx.rect(it.x-w/2,it.y-15,w,24);cx.fill();cx.fillStyle=onacc;cx.font='700 15px '+mono;cx.textAlign='center';cx.fillText(it.s,it.x,it.y+2)}
      else{cx.fillStyle=acc;cx.font='700 18px '+mono;cx.textAlign='center';cx.fillText(it.s,it.x,it.y)}
      return true
    });
    if(shield){cx.strokeStyle=acc;cx.globalAlpha=.55+.2*Math.sin(t/220);cx.lineWidth=2;cx.beginPath();cx.ellipse(px,py+13,52,23,0,0,6.283);cx.stroke();cx.globalAlpha=1}
    cx.save();cx.translate(px,py+13);cx.rotate(Math.max(-.2,Math.min(.2,pvx*.0004)));
    cx.shadowColor=acc;cx.shadowBlur=slow>0?16:8;cx.fillStyle=paper;cx.strokeStyle=slow>0?acc:ink;cx.lineWidth=2;cx.beginPath();if(cx.roundRect)cx.roundRect(-38,-13,76,26,6);else cx.rect(-38,-13,76,26);cx.fill();cx.shadowBlur=0;cx.stroke();
    cx.fillStyle=ink;cx.font='700 18px '+mono;cx.textAlign='center';cx.fillText('{ }',0,6);cx.restore();
    parts=parts.filter(function(p){p.t+=dt;if(p.t>p.life)return false;p.vy+=420*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;cx.globalAlpha=1-p.t/p.life;cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.s,p.s);return true});
    cx.globalAlpha=1;
    if(flash>0){cx.fillStyle=bad;cx.globalAlpha=Math.min(.2,flash);cx.fillRect(-10,-10,gW+20,gH+20);cx.globalAlpha=1;flash-=dt}
    if(bannerT>0&&phase==='play'){bannerT-=dt;var al=Math.max(0,Math.min(1,bannerT/.5,(1.7-bannerT)/.2));cx.globalAlpha=al*.92;cx.textAlign='center';cx.fillStyle=acc;cx.font='800 38px '+disp;cx.fillText(STAGES[stage].n,gW/2,gH*.32);cx.fillStyle=ink;cx.font='500 15px '+disp;cx.fillText(STAGES[stage].s,gW/2,gH*.32+26);cx.globalAlpha=1}
    if(phase==='count'){var lab=countT>1.55?'3':countT>1?'2':countT>.45?'1':'GO';cx.fillStyle=acc;cx.globalAlpha=.9;cx.font='800 72px '+disp;cx.textAlign='center';cx.fillText(lab,gW/2,gH/2+22);cx.globalAlpha=1}
    cx.restore();
    if(phase==='play'){
      if(score>=GOAL){
        phase='won';endT=2.1;items=[];found('game');gpage.classList.add('done');
        var secs=(performance.now()-t0)/1000,nb=!best||secs<best;if(nb){best=secs;try{localStorage.setItem('best',String(secs))}catch(e){}}
        hudUp();gmsg.textContent='Build succeeded in '+secs.toFixed(1)+' seconds. '+(hits===0?'A clean build.':'Passed with '+hits+' bug'+(hits>1?'s':'')+'.')+(nb?' New best!':'')+' The page is live.';glive.textContent=gmsg.textContent;wink()
      }else if(lives<=0){
        phase='lost';run=false;losses++;gmsg.textContent='Build failed: too many bugs. Bugs have eyes, so watch for them.';glive.textContent='Build failed.';gst.hidden=false;gst.focus();return
      }
    }
    if(phase==='won'){endT-=dt;if(endT<=0){run=false;enter(true);return}}
    raf=requestAnimationFrame(gTick)
  }
  cv.addEventListener('pointermove',function(e){px=e.clientX-cv.getBoundingClientRect().left});
  cv.addEventListener('pointerdown',function(e){px=e.clientX-cv.getBoundingClientRect().left});
  addEventListener('keydown',function(e){
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k==='Escape'&&document.body.classList.contains('gaming')&&!ov.hidden){e.preventDefault();enter(false);return}
    if(run&&(k==='ArrowLeft'||k==='ArrowRight'||k==='a'||k==='d')){keys[k]=true;if(k.length>1)e.preventDefault()}
  });
  addEventListener('keyup',function(e){var k=e.key.length===1?e.key.toLowerCase():e.key;keys[k]=false});
  document.getElementById('iplay').addEventListener('click',function(){if(musicUnlock)musicUnlock();openGame()});
  document.getElementById('ienter').addEventListener('click',function(){enter(false)});
  gst.addEventListener('click',function(){if(musicUnlock)musicUnlock();beginRun()});
  document.getElementById('gskip').addEventListener('click',function(){enter(false)});
  hudUp();
  var skipG=false;try{skipG=sessionStorage.getItem('played')==='1'}catch(e){}
  if(location.hash&&location.hash!=='#home')skipG=true;
  if(skipG){ov.hidden=true}else{addEventListener('resize',function(){if(!run&&!gpanel.hidden)fit()});openIntro()}
  /* Eyes wink when something is sent or won */
  function wink(){if(still)return;eyes.forEach(function(x){x[0].classList.add('blink')});setTimeout(function(){eyes.forEach(function(x){x[0].classList.remove('blink')})},220)}

  /* Scroll progress */
  var prog=document.getElementById('prog'),pr=0;
  addEventListener('scroll',function(){if(pr)return;pr=requestAnimationFrame(function(){pr=0;var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'})},{passive:true});

  /* Contact form: composes an email in the visitor's mail app */
  var cf=document.getElementById('cform'),cmm=document.getElementById('cm'),ccn=document.getElementById('ccount'),cst=document.getElementById('cstatus'),ccp=document.getElementById('ccopy'),lastMsg='';
  cmm.addEventListener('input',function(){ccn.textContent=cmm.value.length+' / 800'});
  if(FORM_ENDPOINT)cf.querySelector('button[type=submit]').textContent='Send message';
  cf.addEventListener('submit',function(e){
    e.preventDefault();
    var n=document.getElementById('cn'),m=document.getElementById('ce'),bad=false;
    [n,m,cmm].forEach(function(f){var v=f.value.trim(),ok=v&&(f!==m||/^\S+@\S+\.\S+$/.test(v));f.setAttribute('aria-invalid',String(!ok));if(!ok)bad=true});
    if(bad){cst.textContent='Please add your name, a valid email, and a message.';return}
    var subj=document.getElementById('ct').value+' - '+n.value.trim();
    var body='Hi Clarence,\n\n'+cmm.value.trim()+'\n\nFrom: '+n.value.trim()+' ('+m.value.trim()+')';
    lastMsg='To: cmf.yabut@gmail.com\nSubject: '+subj+'\n\n'+body;
    function viaEmail(){
      var a=document.createElement('a');a.href='mailto:cmf.yabut@gmail.com?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);document.body.appendChild(a);a.click();a.remove();
      cst.textContent='Your email app should open with the message filled in. If nothing happens, copy the message and send it to cmf.yabut@gmail.com.';
      ccp.hidden=false;wink();
    }
    if(FORM_ENDPOINT){
      cst.textContent='Sending...';
      fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name:n.value.trim(),email:m.value.trim(),topic:document.getElementById('ct').value,message:cmm.value.trim()})})
        .then(function(r){if(!r.ok)throw new Error('failed');cst.textContent='Thanks, your message was sent. I will reply to '+m.value.trim()+'.';cf.reset();ccn.textContent='0 / 800';wink()})
        .catch(function(){cst.textContent='That did not go through, so I am opening your email app instead.';viaEmail()});
    }else viaEmail();
  });
  ccp.addEventListener('click',function(){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(lastMsg).then(function(){cst.textContent='Message copied.'},function(){cst.textContent='Select the text in the box and copy it.'})}else{cst.textContent='Select the text in the box and copy it.'}
  });
  /* Hero dot grid brightens around the cursor */
  var hero=document.querySelector('.hero'),hx=0,hy=0,hq=0;
  if(hero&&!still)addEventListener('pointermove',function(e){hx=e.clientX;hy=e.clientY;if(hq)return;hq=requestAnimationFrame(function(){hq=0;var r=hero.getBoundingClientRect(),gx=hx-r.left,gy=hy-r.top,gl=hero.querySelector('.glow');if(!gl)return;var inside=gx>-120&&gx<r.width+120&&gy>-120&&gy<r.height+120;gl.classList.toggle('on',inside);if(inside){gl.style.transform='translate3d('+(gx-180)+'px,'+(gy-180)+'px,0)';gl.style.backgroundPosition=(180-gx)+'px '+(180-gy)+'px'}})},{passive:true});
  /* Skip link */
  document.getElementById('skip').addEventListener('click',function(){document.getElementById('main').focus()});

  /* Screenshot strips on the Work page */
  document.querySelectorAll('[data-strip]').forEach(function(b){b.addEventListener('click',function(){var s=b.closest('.strip-wrap').querySelector('.strip');s.scrollBy({left:Number(b.dataset.strip)*s.clientWidth*.8,behavior:still?'auto':'smooth'})})});

  /* Touch devices: three small eyes peek in from the edges, glance where you tap, and look up or down as you scroll */
  var mob=matchMedia('(pointer:coarse),(max-width:700px)');
  document.querySelectorAll('.heye').forEach(function(e){eyes.push([e,e.querySelector('.pupil')])});
  function layoutEyes(){eyes.forEach(function(x){var e=x[0];if(!e.dataset.d)return;if(mob.matches){e.style.display='none'}else{var d=e.dataset.d.split(','),ex=parseFloat(d[0])/100*innerWidth,er=parseFloat(d[2])/2,cl=Math.max(24,(innerWidth-1024)/2+24),cr=innerWidth-cl,clash=ex+er>cl-8&&ex-er<cr+8;e.style.display=clash?'none':'';e.style.left=d[0]+'%';e.style.top=d[1]+'%';e.style.setProperty('--s',d[2]+'px')}})}
  layoutEyes();if(mob.addEventListener)mob.addEventListener('change',layoutEyes);var leT=0;addEventListener('resize',function(){clearTimeout(leT);leT=setTimeout(layoutEyes,120)});
  var lastY=scrollY,sIdle=0;
  if(!still)addEventListener('scroll',function(){if(!mob.matches)return;var y=scrollY;mx=innerWidth/2;my=y>lastY?innerHeight*1.4:-innerHeight*.4;lastY=y;if(!eraf)eraf=requestAnimationFrame(look);clearTimeout(sIdle);sIdle=setTimeout(function(){eyes.forEach(function(x){x[1].style.transform=''})},1400)},{passive:true});

  /* Cursor ring (computers only) */
  var ring=document.getElementById('ring');
  if(ring&&!still&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    var rgx=0,rgy=0,rgtx=0,rgty=0,rgq=0;
    var rgtick=function(){rgx+=(rgtx-rgx)*.22;rgy+=(rgty-rgy)*.22;ring.style.transform='translate('+rgx+'px,'+rgy+'px)';rgq=(Math.abs(rgtx-rgx)+Math.abs(rgty-rgy)>.4)?requestAnimationFrame(rgtick):0};
    addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;rgtx=e.clientX;rgty=e.clientY;ring.classList.add('on');ring.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,button,select,textarea,input,summary,.zoom,[tabindex="0"]')));if(!rgq)rgq=requestAnimationFrame(rgtick)},{passive:true});
    document.documentElement.addEventListener('mouseleave',function(){ring.classList.remove('on')});
  }
  /* Sticky header shadow line */
  var hd=document.querySelector('header.top');
  addEventListener('scroll',function(){hd.classList.toggle('scrolled',scrollY>8)},{passive:true});

  /* Visitor accent color */
  function setAccent(a){document.documentElement.setAttribute('data-accent',a);document.querySelectorAll('.accsw').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.accent===a))});try{localStorage.setItem('accent',a)}catch(e){}}
  var sa='blue';try{sa=localStorage.getItem('accent')||'blue'}catch(e){}
  setAccent(sa);
  document.querySelectorAll('.accsw').forEach(function(b){b.addEventListener('click',function(){setAccent(b.dataset.accent)})});
  /* Music player: plays the MP3s listed in assets/audio/playlist.json */
  var pl=document.getElementById('player'),au=document.getElementById('paudio'),pp=document.getElementById('pp'),pn=document.getElementById('pnext'),pt=document.getElementById('ptitle'),pv=document.getElementById('pvol'),pbars=pl.querySelectorAll('.pbars i'),pbwrap=pl.querySelector('.pbars'),pprev=document.getElementById('pprev'),seek=document.getElementById('pseek'),tcur=document.getElementById('ptime'),tdur=document.getElementById('pdur'),pmute=document.getElementById('pmute');
  function toTrack(t){if(typeof t==='string')t={file:t};var f=t.file||t.src||'';return{title:t.title||f.replace(/^.*\//,'').replace(/\.[a-z0-9]+$/i,'').replace(/[-_]+/g,' ').trim()||'Track',src:/^(data:|https?:|\/)/.test(f)?f:'assets/audio/'+f}}
  function initPlayer(list){
    list=(list||[]).map(toTrack);if(!list.length)return;
    pl.hidden=false;if(pl._restore)pl._restore();pn.hidden=pprev.hidden=list.length<2;if(list.length===1)au.loop=true;
    var idx=0,vol=.6,bad=0,ctx=null,an=null,data=null,useAn=false,fq=0,userMuted=false,probing=false,unlocked=false;
    try{var v=parseFloat(localStorage.getItem('pvol'));if(!isNaN(v))vol=v;idx=parseInt(localStorage.getItem('ptrack'),10)||0}catch(e){}
    if(idx>=list.length)idx=0;au.volume=vol;pv.value=vol;pbwrap.classList.add('css');
    function fmt(s){if(!isFinite(s)||s<0)return'0:00';s=Math.floor(s);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
    function load(i,go){idx=(i+list.length)%list.length;au.src=list[idx].src;pt.textContent=list[idx].title;seek.disabled=true;seek.value=0;tcur.textContent='0:00';tdur.textContent='0:00';try{localStorage.setItem('ptrack',idx)}catch(e){}if(go){var p=au.play();if(p&&p.catch)p.catch(function(){})}}
    function sameOrigin(){try{return new URL(au.src,location.href).origin===location.origin}catch(e){return false}}
    function ensureCtx(){
      if(ctx){if(ctx.state==='suspended')ctx.resume();return}
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC||!/^https?:$/.test(location.protocol)||!sameOrigin())return;
      try{ctx=new AC();var s=ctx.createMediaElementSource(au);an=ctx.createAnalyser();an.fftSize=512;an.smoothingTimeConstant=.6;s.connect(an);an.connect(ctx.destination);data=new Uint8Array(an.frequencyBinCount);makeBands();useAn=true;pbwrap.classList.remove('css')}catch(e){ctx=null;useAn=false}
    }
    var edges=[50,220,650,1800,4500,11000],bands=[],lvl=[0,0,0,0,0],hist=[[],[],[],[],[]],peak=[.1,.1,.1,.1,.1];
    function makeBands(){var nyq=ctx.sampleRate/2,n=an.frequencyBinCount;bands=[];for(var i=0;i<5;i++){var a=Math.max(1,Math.round(edges[i]/nyq*n)),b=Math.max(a+1,Math.round(edges[i+1]/nyq*n));bands.push([a,b])}}
    function frame(){
      fq=0;if(au.paused)return;
      if(useAn){
        an.getByteFrequencyData(data);
        for(var i=0;i<5;i++){
          var s=0,mx=0,r=bands[i];for(var k=r[0];k<r[1];k++){s+=data[k];if(data[k]>mx)mx=data[k]}
          var raw=(s/(r[1]-r[0])*.5+mx*.5)/255;peak[i]=Math.max(raw,peak[i]*.992);var v=Math.min(1,Math.pow(raw/Math.max(peak[i],.06),1.6));
          lvl[i]+=(v-lvl[i])*(v>lvl[i]?.6:.14);
          hist[i].push(lvl[i]);if(hist[i].length>12)hist[i].shift();
          var back=i*2,h=hist[i],val=h.length>back?h[h.length-1-back]:lvl[i];
          var amb=.15*(1+Math.sin(performance.now()/(330+i*140)+i*1.9));pbars[i].style.transform='scaleY('+(.2+Math.min(1,val*.75+amb)*.8)+')';
        }
        pl.style.setProperty('--lv',((lvl[0]+lvl[1]+lvl[2]+lvl[3]+lvl[4])/5).toFixed(2));
      }
      fq=requestAnimationFrame(frame)}
    function setBars(on){
      if(still){pbars.forEach(function(b,i){b.style.transform=on?'scaleY('+[.45,.8,.55,.9,.5][i]+')':''});return}
      if(!on){pbars.forEach(function(b){b.style.transform=''});pl.style.removeProperty('--lv');return}
      if(useAn&&!fq)fq=requestAnimationFrame(frame)
    }
    pp.addEventListener('click',function(){if(au.paused){ensureCtx();var p=au.play();if(p&&p.catch)p.catch(function(){})}else au.pause()});
    pn.addEventListener('click',function(){ensureCtx();load(idx+1,true)});
    pv.addEventListener('input',function(){au.volume=Number(pv.value);try{localStorage.setItem('pvol',pv.value)}catch(e){}});
    au.addEventListener('playing',function(){if(probing)return;bad=0;pl.classList.add('playing');pp.setAttribute('aria-label','Pause music');setBars(true);if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:list[idx].title,artist:'Clarence Yabut'})}catch(e){}}});
    au.addEventListener('pause',function(){if(probing){probing=false;return}pl.classList.remove('playing');pp.setAttribute('aria-label','Play music');setBars(false)});
    var seeking=false;
    au.addEventListener('loadedmetadata',function(){tdur.textContent=fmt(au.duration);seek.disabled=!isFinite(au.duration)});
    au.addEventListener('timeupdate',function(){if(isFinite(au.duration)&&au.duration>0){if(!seeking)seek.value=au.currentTime/au.duration*1000;tdur.textContent=fmt(au.duration)}if(!seeking)tcur.textContent=fmt(au.currentTime)});
    seek.addEventListener('input',function(){seeking=true;if(isFinite(au.duration))tcur.textContent=fmt(seek.value/1000*au.duration)});
    seek.addEventListener('change',function(){if(isFinite(au.duration))au.currentTime=seek.value/1000*au.duration;seeking=false});
    pprev.addEventListener('click',function(){ensureCtx();if(au.currentTime>3)au.currentTime=0;else load(idx-1,true)});
    pmute.addEventListener('click',function(){au.muted=!au.muted;userMuted=au.muted;pmute.setAttribute('aria-pressed',String(au.muted));pmute.setAttribute('aria-label',au.muted?'Unmute':'Mute')});
    au.addEventListener('ended',function(){load(idx+1,true)});
    au.addEventListener('error',function(){bad++;if(bad>=list.length){pt.textContent='Audio unavailable';pp.disabled=true;pn.hidden=true;return}load(idx+1,true)});
    if('mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',function(){pp.click()});navigator.mediaSession.setActionHandler('pause',function(){au.pause()});if(list.length>1){navigator.mediaSession.setActionHandler('nexttrack',function(){pn.click()})}}catch(e){}}
    musicUnlock=function(){
      if(unlocked||pl.hidden||!au.paused)return;unlocked=true;probing=true;au.muted=true;
      var p=au.play();
      if(p&&p.then)p.then(function(){au.pause();au.currentTime=0;au.muted=userMuted}).catch(function(){probing=false;unlocked=false;au.muted=userMuted})
    };
    musicStart=function(){
      if(pl.hidden||!au.paused||pp.disabled)return;
      ensureCtx();var target=Number(pv.value);au.muted=userMuted;au.volume=0;
      var p=au.play();
      var fade=function(){var t0=performance.now();(function f(n){var k=Math.max(0,Math.min(1,(n-t0)/1800));try{au.volume=Math.max(0,Math.min(1,target*k))}catch(x){}if(k<1&&!au.paused)requestAnimationFrame(f);else{try{au.volume=Math.max(0,Math.min(1,target))}catch(x){}}})(t0)};
      if(p&&p.then)p.then(fade).catch(function(){au.volume=target;pl.classList.add('nudge');toast('Press play for music');setTimeout(function(){pl.classList.remove('nudge')},3200)});else fade()
    };
    load(idx,false);
  }
  /* The player pill can be dragged (or moved with the arrow keys); its spot is remembered */
  (function(){
    var KEY='ppos',M=8,drag=null,samples=[],driftRaf=0,grip=document.getElementById('pgrip');
    function clampPos(x,y){var w=pl.offsetWidth,hh=pl.offsetHeight;return[Math.min(Math.max(M,x),Math.max(M,innerWidth-w-M)),Math.min(Math.max(M,y),Math.max(M,innerHeight-hh-M))]}
    function place(x,y,save){var c=clampPos(x,y);pl.style.left=c[0]+'px';pl.style.top=c[1]+'px';pl.style.bottom='auto';pl.dataset.moved='1';if(save){try{localStorage.setItem(KEY,JSON.stringify([c[0]/innerWidth,c[1]/innerHeight]))}catch(e){}}}
    function restore(){var v=null;try{v=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(v&&v.length===2)place(v[0]*innerWidth,v[1]*innerHeight,false)}
    function reset(){pl.style.left=pl.style.top=pl.style.bottom='';delete pl.dataset.moved;try{localStorage.removeItem(KEY)}catch(e){}}
    pl._restore=restore;
    var ptog=document.getElementById('ptoggle');
    function setExp(on,anim){pl.classList.toggle('exp',on);ptog.setAttribute('aria-expanded',String(on));ptog.setAttribute('aria-label',on?'Collapse player':'Expand player');try{localStorage.setItem('pexp',on?'1':'0')}catch(e){}if(anim){pl.classList.remove('pop');void pl.offsetWidth;pl.classList.add('pop')}requestAnimationFrame(function(){if(pl.dataset.moved){var r=pl.getBoundingClientRect();place(r.left,r.top,true)}})}
    pl._setExp=setExp;
    ptog.addEventListener('click',function(){setExp(!pl.classList.contains('exp'),true)});
    try{if(localStorage.getItem('pexp')==='1')setExp(true,false)}catch(e){}
    pl.addEventListener('pointerdown',function(e){if(e.button>0||e.target.closest('button:not(#pgrip),input'))return;cancelAnimationFrame(driftRaf);samples=[];var r=pl.getBoundingClientRect();drag={dx:e.clientX-r.left,dy:e.clientY-r.top,id:e.pointerId};try{pl.setPointerCapture(e.pointerId)}catch(x){}pl.classList.add('dragging');e.preventDefault()});
    pl.addEventListener('pointermove',function(e){if(drag&&e.pointerId===drag.id){place(e.clientX-drag.dx,e.clientY-drag.dy,false);samples.push({t:e.timeStamp,x:e.clientX,y:e.clientY});while(samples.length&&e.timeStamp-samples[0].t>90)samples.shift()}});
    function drift(vx,vy){cancelAnimationFrame(driftRaf);var last=performance.now();var step=function(now){var dt=Math.min(32,now-last);last=now;var r=pl.getBoundingClientRect(),x=r.left+vx*dt,y=r.top+vy*dt,c=clampPos(x,y);if(c[0]!==x)vx*=-.35;if(c[1]!==y)vy*=-.35;place(x,y,false);var f=Math.exp(-dt/170);vx*=f;vy*=f;if(Math.hypot(vx,vy)>.02)driftRaf=requestAnimationFrame(step);else{var q=pl.getBoundingClientRect();place(q.left,q.top,true)}};driftRaf=requestAnimationFrame(step)}
    function end(e){if(!drag)return;var r=pl.getBoundingClientRect();place(r.left,r.top,true);drag=null;pl.classList.remove('dragging');var n=samples.length;
      if(!still&&n>1&&e&&e.timeStamp-samples[n-1].t<80){var a=samples[0],b=samples[n-1],dt=b.t-a.t;if(dt>12){var vx=(b.x-a.x)/dt,vy=(b.y-a.y)/dt,sp=Math.hypot(vx,vy);if(sp>.12){var k=Math.min(1,1.6/sp);drift(vx*k,vy*k)}}}
      samples=[]}
    pl.addEventListener('pointerup',end);pl.addEventListener('pointercancel',end);
    grip.addEventListener('keydown',function(e){var step=e.shiftKey?60:20,r=pl.getBoundingClientRect(),x=r.left,y=r.top,k=e.key;if(k==='ArrowLeft')x-=step;else if(k==='ArrowRight')x+=step;else if(k==='ArrowUp')y-=step;else if(k==='ArrowDown')y+=step;else if(k==='Home'){e.preventDefault();reset();return}else return;e.preventDefault();place(x,y,true)});
    grip.addEventListener('dblclick',reset);
    addEventListener('resize',function(){if(pl.dataset.moved){var r=pl.getBoundingClientRect();place(r.left,r.top,false)}});
    pl.addEventListener('transitionend',function(e){if(e.target.classList&&e.target.classList.contains('pvol')&&pl.dataset.moved){var r=pl.getBoundingClientRect();place(r.left,r.top,false)}});
  })();

  if(window.__PLAYLIST__)initPlayer(window.__PLAYLIST__);
  else if(window.fetch)fetch('assets/audio/playlist.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():{tracks:[]}}).then(function(d){initPlayer(d.tracks||d)}).catch(function(){});
  /* Work page: smooth open and close for the Screenshots toggle */
  document.querySelectorAll('.shots-d').forEach(function(d){
    var sum=d.querySelector('summary'),body=d.querySelector('.strip-wrap'),anim=null;
    function preload(){body.querySelectorAll('img').forEach(function(i){i.loading='eager'})}
    sum.addEventListener('pointerenter',preload);sum.addEventListener('focus',preload);
    sum.addEventListener('click',function(e){
      e.preventDefault();preload();
      if(still){d.open=!d.open;return}
      var want=d.classList.contains('closing')?true:!d.open,cur=anim?body.getBoundingClientRect().height:null;
      if(anim){anim.cancel();anim=null;body.style.overflow='';d.classList.remove('closing')}
      var ease='cubic-bezier(.2,.8,.2,1)';
      if(want){
        d.open=true;var full=body.offsetHeight;body.style.overflow='hidden';
        anim=body.animate({height:[(cur===null?0:cur)+'px',full+'px'],marginTop:[cur===null?'0px':'.6rem','.6rem'],opacity:[cur===null?0:1,1]},{duration:380,easing:ease});
        anim.onfinish=function(){body.style.overflow='';anim=null}
      }else{
        var from=cur===null?body.offsetHeight:cur;body.style.overflow='hidden';d.classList.add('closing');
        anim=body.animate({height:[from+'px','0px'],marginTop:['.6rem','0px'],opacity:[1,0]},{duration:260,easing:'cubic-bezier(.4,0,.6,1)'});
        anim.onfinish=function(){d.open=false;body.style.overflow='';d.classList.remove('closing');anim=null}
      }
    })
  });

  /* ---------- Toast ---------- */
  var toastEl=document.getElementById('toast'),toastT=0;
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){toastEl.classList.remove('show')},2600)}

  /* ---------- Hero name reacts to the cursor ---------- */
  var nm=document.querySelector('h1.name'),nameChars=[];
  if(nm){
    nm.setAttribute('aria-label',nm.textContent.replace(/\s+/g,' ').trim());
    (function wrap(node){[].slice.call(node.childNodes).forEach(function(c){if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split('').forEach(function(ch){if(/\s/.test(ch)){f.appendChild(document.createTextNode(ch));return}var s=document.createElement('span');s.className='ch';s.setAttribute('aria-hidden','true');s.textContent=ch;s._k=0;f.appendChild(s);nameChars.push(s)});node.replaceChild(f,c)}else if(c.nodeType===1)wrap(c)})})(nm);
    var nameCenters=[],nxp=-9999,nyp=-9999,nq=0,nrT=0;
    function measureName(){
      nameChars.forEach(function(s){s.style.width=''});
      var rs=nameChars.map(function(s){return s.getBoundingClientRect()}),sx=scrollX,sy=scrollY;
      nameCenters=rs.map(function(r){return r.width?[r.left+sx+r.width/2,r.top+sy+r.height/2]:null});
      nameChars.forEach(function(s,i){if(rs[i].width)s.style.width=rs[i].width+'px'})
    }
    nm._measure=measureName;
    if(!still&&matchMedia('(hover:hover) and (pointer:fine)').matches){
      var nameTick=function(){
        nq=0;var busy=false;
        for(var i=0;i<nameChars.length;i++){var s=nameChars[i],c=nameCenters[i];if(!c)continue;var d=Math.hypot(nxp-c[0],nyp-c[1]),k=Math.max(0,1-d/210);k*=k;s._k+=(k-s._k)*.2;if(Math.abs(k-s._k)>.004)busy=true;var st=Math.round(s._k*8);if(st!==s._st){s._st=st;s.style.setProperty('--w',700+st*10);s.style.setProperty('--wd',94+st*.6)}}
        if(busy)nq=requestAnimationFrame(nameTick)
      };
      addEventListener('pointermove',function(e){if(e.pointerType==='touch'||!nameCenters.length)return;nxp=e.clientX+scrollX;nyp=e.clientY+scrollY;if(!nq)nq=requestAnimationFrame(nameTick)},{passive:true});
    }
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(measureName);
    addEventListener('resize',function(){clearTimeout(nrT);nrT=setTimeout(measureName,150)});
  }

  /* ---------- About: terminal view ---------- */
  (function(){
    var btn=document.getElementById('termBtn'),bio=document.getElementById('bio'),term=document.getElementById('term'),out=document.getElementById('termOut'),T=0;
    if(!btn)return;
    var LINES=[['cmd','whoami'],['out','clarence-yabut'],['cmd','cat about.txt'],['out','Third-year BSIT Web Development student at Holy Angel University.'],['out','Builds projects with HTML, CSS, JavaScript, PHP, and databases.'],['out','Also designs in Figma and creates content.'],['cmd','ls skills/'],['out','html  css  javascript  php  java  python  mysql  mongodb  figma  canva'],['cmd','cat languages.txt'],['out','english (fluent)  filipino (fluent)  kapampangan (native)'],['cmd','cat status.txt'],['out','open to work: entry-level, part-time, freelance, remote']];
    function run(){
      clearTimeout(T);out.textContent='';var li=0,ci=0,el=null;
      function line(kind){var d=document.createElement('div');d.className='tl-'+kind;if(kind==='cmd'){var p=document.createElement('span');p.className='prompt';p.textContent='$ ';d.appendChild(p)}var t=document.createElement('span');d.appendChild(t);out.appendChild(d);return t}
      function step(){
        if(li>=LINES.length){var c=document.createElement('div');c.innerHTML='<span class="prompt">$ </span><span class="caret"></span>';out.appendChild(c);return}
        var L=LINES[li];if(ci===0)el=line(L[0]);
        if(still||L[0]==='out'){el.textContent=L[1];li++;ci=0;T=setTimeout(step,still?0:110);return}
        el.textContent=L[1].slice(0,++ci);
        if(ci>=L[1].length){li++;ci=0;T=setTimeout(step,280)}else T=setTimeout(step,40)
      }
      step()
    }
    btn.addEventListener('click',function(){
      var on=btn.getAttribute('aria-pressed')!=='true';
      btn.setAttribute('aria-pressed',String(on));btn.querySelector('.tl').textContent=on?'Normal view':'Terminal view';
      term.hidden=!on;bio.classList.toggle('sr',on);
      if(on){run();found('terminal')}else clearTimeout(T)
    });
  })();

  /* ---------- Desk pet ---------- */
  var pet=document.getElementById('pet'),petReact=function(){};
  if(pet){
    var pw=pet.querySelector('.pw'),bub=pet.querySelector('.bubble'),pFoot=document.querySelector('footer'),px2=60,pdir=1,pstate='walk',pwait=0,pspeed=34,pboost=0,plast=0,pRaf=0,pBubT=0,pClicks=0;
    [].slice.call(pet.querySelectorAll('.peye')).forEach(function(e,i){eyes.push([e,pet.querySelectorAll('.ppup')[i]])});
    var JOKES=['ouch!','not a bug, a feature','works on my machine','have you tried turning it off and on again?','it was like that when I got here','I only eat semicolons','404: nap not found','ship it!'];
    function say(t,ms){bub.textContent=t;bub.classList.add('show');clearTimeout(pBubT);pBubT=setTimeout(function(){bub.classList.remove('show')},ms||1900)}
    function put(){pet.style.transform='translateX('+px2+'px)';pet.classList.toggle('flip',pdir<0)}
    petReact=function(msg){
      pClicks++;if(pClicks===7)found('bug');say(msg||(pClicks%7===0?'okay okay, I\'ll behave':JOKES[Math.floor(Math.random()*JOKES.length)]));
      pw.classList.remove('hop');void pw.offsetWidth;pw.classList.add('hop');
      if(!still){pstate='run';pboost=1.1;pdir=Math.random()<.5?-1:1}
    };
    pet.addEventListener('click',function(){petReact()});
    function petTick(t){
      pRaf=0;var dt=Math.min(.05,(t-plast)/1000||.016);plast=t;
      var max=pFoot.clientWidth-44;
      if(pboost>0){pboost-=dt;if(pboost<=0){pstate='walk'}}
      if(pstate==='pause'){pwait-=dt;if(pwait<=0){pstate='walk';if(Math.random()<.5)pdir*=-1}}
      else{
        var sp=pstate==='run'?150:pspeed;px2+=pdir*sp*dt;
        if(px2<40){px2=40;pdir=1}else if(px2>max){px2=max;pdir=-1}
        if(pstate==='walk'&&Math.random()<dt*.35){pstate='pause';pwait=1+Math.random()*2.2}
      }
      pet.classList.toggle('walking',pstate!=='pause');put();pRaf=requestAnimationFrame(petTick)
    }
    put();
    if(!still&&'IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){plast=performance.now();if(!pRaf)pRaf=requestAnimationFrame(petTick)}else{cancelAnimationFrame(pRaf);pRaf=0}})}).observe(pFoot)
    }
  }

  /* ---------- Hidden code: type "debug" or use the Konami code ---------- */
  var kbuf='',kon=[],KON='ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  function debugMode(){
    eyes.forEach(function(x){x[0].classList.add('blink')});setTimeout(function(){eyes.forEach(function(x){x[0].classList.remove('blink')})},260);
    toast(found('debug',true)?'Debug mode on. Secret found ('+secretsGet().length+' of 5).':'Debug mode on. All bugs squashed (one is still in the footer).');
    petReact('hey!');
    if(!still){var S=['</>','{ }','();','=>','[]','//','&&','404'];for(var i=0;i<16;i++){(function(){var s=document.createElement('span');s.className='glyph';s.textContent=S[Math.floor(Math.random()*S.length)];s.style.left=(Math.random()*96)+'vw';s.style.setProperty('--dx',(Math.random()*90-45)+'px');s.style.animationDelay=(Math.random()*.9)+'s';s.style.fontSize=(.9+Math.random()*1.1)+'rem';document.body.appendChild(s);setTimeout(function(){s.remove()},3800)})()}}
  }
  addEventListener('keydown',function(e){
    var t=e.target;if(t&&(/^(input|textarea|select)$/i.test(t.tagName)||t.isContentEditable))return;
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    if(e.key.length===1){kbuf=(kbuf+k).slice(-5);if(kbuf==='debug'){kbuf='';debugMode()}}
    kon.push(k);kon=kon.slice(-10);if(kon.join()===KON){kon=[];debugMode()}
  });

  /* ---------- Quick jump (Ctrl or Cmd + K) ---------- */
  (function(){
    var ov=document.getElementById('cmdk'),inp=document.getElementById('cmdq'),list=document.getElementById('cmdl'),kb=document.getElementById('kbtn'),shown=[],sel=0,opener=null;
    function go(h){return function(){location.hash=h}}
    function click(s){return function(){var el=document.querySelector(s);if(el)el.click()}}
    function open(u){return function(){window.open(u,'_blank','noopener')}}
    function cmds(){
      var dark=document.documentElement.getAttribute('data-theme')==='dark',noEyes=document.body.classList.contains('no-eyes'),insp=document.body.classList.contains('inspect'),L=[];
      [['Home','#home'],['Work','#work'],['Creative','#creative'],['About','#about'],['Certifications','#certifications'],['Recommendations','#recommendations'],['Contact','#contact']].forEach(function(p){L.push(['Pages',p[0],'',go(p[1])])});
      [['RiderSafe','#ridersafe','rider safety motorcycle'],['303 Apparel','#apparel-303','store clothing ecommerce'],['KainSaan','#kainsaan','restaurant finder mongodb']].forEach(function(p){L.push(['Projects',p[0]+' case study',p[2],go(p[1])])});
      L.push(['Actions',dark?'Switch to light mode':'Switch to dark mode','theme',click('header [data-theme-toggle]')]);
      [['blue','Blue'],['teal','Teal'],['orange','Orange'],['pink','Pink']].forEach(function(a){L.push(['Actions','Accent color: '+a[1],'color accent theme',click('.accsw[data-accent="'+a[0]+'"]')])});
      L.push(['Actions',noEyes?'Turn background eyes on':'Turn background eyes off','eyes',click('#eyeBtn')]);
      L.push(['Actions',insp?'Hide page structure':'Show page structure','inspect structure',click('#inspect')]);
      if(!pl.hidden){L.push(['Actions','Play or pause music','music audio song',click('#pp')]);L.push(['Actions',pl.classList.contains('exp')?'Shrink music player':'Expand music player','music player',click('#ptoggle')])}
      L.push(['Actions','Open the About terminal view','about whoami bio terminal',function(){location.hash='#about';setTimeout(function(){var b=document.getElementById('termBtn');if(b&&b.getAttribute('aria-pressed')!=='true')b.click()},450)}]);
      L.push(['Actions','Show keyboard shortcuts','help keys keyboard',function(){setTimeout(openKeys,30)}]);
      L.push(['Actions','Copy email address','email contact',function(){if(navigator.clipboard)navigator.clipboard.writeText('cmf.yabut@gmail.com').then(function(){toast('Email copied')},function(){toast('Could not copy. It is cmf.yabut@gmail.com')})}]);
      if(document.querySelector('a.dl'))L.push(['Actions','Download resume','cv pdf',click('a.dl')]);
      L.push(['Links','Open GitHub','code repositories',open('https://github.com/cm-f-yabut11')]);
      L.push(['Links','Open LinkedIn','profile',open('https://www.linkedin.com/in/clarence-yabut-7a6819312/')]);
      L.push(['Actions','Play the landing game again','game bugs',function(){try{sessionStorage.removeItem('played')}catch(e){}location.hash='#home';location.reload()}]);
      return L
    }
    function render(){
      var q=inp.value.trim().toLowerCase().split(/\s+/).filter(Boolean),all=cmds();
      shown=all.filter(function(c){var s=(c[1]+' '+c[2]+' '+c[0]).toLowerCase();return q.every(function(t){return s.indexOf(t)>-1})});
      list.textContent='';
      if(!shown.length){var n=document.createElement('li');n.className='none';n.textContent='No matches';list.appendChild(n);inp.removeAttribute('aria-activedescendant');return}
      if(sel>=shown.length)sel=0;var last='';
      shown.forEach(function(c,i){
        if(!q.length&&c[0]!==last){var g=document.createElement('li');g.className='grp';g.setAttribute('role','presentation');g.textContent=c[0];list.appendChild(g);last=c[0]}
        var li=document.createElement('li');li.id='cmd-'+i;li.setAttribute('role','option');li.setAttribute('aria-selected',String(i===sel));li.innerHTML='<span></span><small></small>';li.firstChild.textContent=c[1];li.lastChild.textContent=q.length?c[0]:'';
        li.addEventListener('click',function(){run(i)});li.addEventListener('mousemove',function(){if(sel!==i){sel=i;mark()}});list.appendChild(li)
      });
      inp.setAttribute('aria-activedescendant','cmd-'+sel)
    }
    function mark(){[].slice.call(list.querySelectorAll('[role="option"]')).forEach(function(li,i){li.setAttribute('aria-selected',String(i===sel))});inp.setAttribute('aria-activedescendant','cmd-'+sel);var a=document.getElementById('cmd-'+sel);if(a&&a.scrollIntoView)a.scrollIntoView({block:'nearest'})}
    function close(){ov.hidden=true;if(!document.body.classList.contains('gaming'))wrapEl.inert=false;if(opener&&opener.focus)opener.focus();found('jump')}
    function run(i){var c=shown[i];close();if(c)setTimeout(c[3],30)}
    function openIt(){if(document.body.classList.contains('gaming')||!ov.hidden)return;opener=document.activeElement;inp.value='';sel=0;ov.hidden=false;wrapEl.inert=true;render();inp.focus()}
    inp.addEventListener('input',function(){sel=0;render()});
    inp.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(shown.length-1,sel+1);mark()}
      else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);mark()}
      else if(e.key==='Enter'){e.preventDefault();run(sel)}
      else if(e.key==='Escape'){e.preventDefault();close()}
      else if(e.key==='Tab'){e.preventDefault()}
    });
    ov.addEventListener('mousedown',function(e){if(e.target===ov)close()});
    kb.addEventListener('click',openIt);
    addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();ov.hidden?openIt():close()}});
  })();

  /* ---------- Hero sky tint follows Philippine time ---------- */
  var skyEl=document.querySelector('.hero .skyglow'),phaseEl=document.getElementById('phase');
  var SKY=[[0,[60,70,160,.26]],[5,[70,80,170,.22]],[6,[255,150,100,.34]],[8,[255,205,150,.28]],[11,[150,205,255,.26]],[15,[150,205,255,.22]],[17,[255,185,90,.34]],[18.5,[240,120,150,.30]],[20,[130,100,200,.28]],[22,[60,70,160,.26]],[24,[60,70,160,.26]]];
  function manilaHours(){try{var hh=0,mm=0;new Intl.DateTimeFormat('en-GB',{hour:'numeric',minute:'numeric',hourCycle:'h23',timeZone:'Asia/Manila'}).formatToParts(new Date()).forEach(function(x){if(x.type==='hour')hh=+x.value;if(x.type==='minute')mm=+x.value});return hh+mm/60}catch(e){return null}}
  function skyUpdate(){
    var t=manilaHours();if(t===null||!skyEl)return;
    var a=SKY[0],b=SKY[1];for(var i=0;i<SKY.length-1;i++){if(t>=SKY[i][0]&&t<=SKY[i+1][0]){a=SKY[i];b=SKY[i+1];break}}
    var f=(t-a[0])/((b[0]-a[0])||1),c=a[1].map(function(v,j){return v+(b[1][j]-v)*f}),col='rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+',';
    skyEl.style.background='radial-gradient(ellipse 55% 85% at 82% 8%,'+col+c[3].toFixed(3)+') 0%,'+col+(c[3]*.4).toFixed(3)+') 42%,transparent 78%),radial-gradient(ellipse 40% 60% at 4% 92%,'+col+(c[3]*.35).toFixed(3)+') 0%,transparent 70%)';
    var n=(t<5||t>=21)?'night':t<7?'dawn':t<12?'morning':t<16.5?'afternoon':t<18.5?'golden hour':'evening';
    if(phaseEl)phaseEl.textContent=' ('+n+')'
  }
  skyUpdate();

  /* ---------- Secrets (counted quietly in the shortcuts sheet) ---------- */
  var SECRETS={debug:'Hidden code',jump:'Quick jump',bug:'Bug whisperer',game:'Compiled the portfolio',terminal:'Terminal view'},SKEYS=['debug','jump','bug','game','terminal'],secretMem=null;
  function secretsGet(){if(secretMem)return secretMem;var l=[];try{l=JSON.parse(localStorage.getItem('secrets'))||[]}catch(e){}return(secretMem=l)}
  function renderSecrets(){var l=secretsGet(),n=document.getElementById('sc-n');if(n)n.textContent=l.length;var dots=document.querySelectorAll('#sc-dots i');SKEYS.forEach(function(k,i){var on=l.indexOf(k)>-1;dots[i].classList.toggle('on',on);if(on)dots[i].setAttribute('title',SECRETS[k]);else dots[i].removeAttribute('title')})}
  function glyphBurst(){if(still)return;var S=['</>','{ }','();','=>','[]','//','&&','404'];for(var i=0;i<16;i++){(function(){var s=document.createElement('span');s.className='glyph';s.textContent=S[Math.floor(Math.random()*S.length)];s.style.left=(Math.random()*96)+'vw';s.style.setProperty('--dx',(Math.random()*90-45)+'px');s.style.animationDelay=(Math.random()*.9)+'s';s.style.fontSize=(.9+Math.random()*1.1)+'rem';document.body.appendChild(s);setTimeout(function(){s.remove()},3800)})()}}
  function found(id,quiet){
    var l=secretsGet();if(l.indexOf(id)>-1)return false;
    l.push(id);try{localStorage.setItem('secrets',JSON.stringify(l))}catch(e){}
    renderSecrets();
    if(!quiet)toast('Secret found: '+SECRETS[id]+' ('+l.length+' of 5)');
    if(l.length===SKEYS.length)setTimeout(function(){toast('All 5 secrets found. You are a secret keeper.');glyphBurst()},quiet?0:2800);
    return true
  }
  renderSecrets();

  /* ---------- Keyboard shortcuts sheet (press ?) ---------- */
  var keysEl=document.getElementById('keys'),keysOpener=null;
  function closeKeys(){keysEl.hidden=true;if(!document.body.classList.contains('gaming'))wrapEl.inert=false;if(keysOpener&&keysOpener.focus)keysOpener.focus()}
  function openKeys(){if(document.body.classList.contains('gaming')||!keysEl.hidden)return;var q=document.getElementById('cmdk');if(q&&!q.hidden)return;keysOpener=document.activeElement;renderSecrets();keysEl.hidden=false;wrapEl.inert=true;document.getElementById('keys-x').focus()}
  document.getElementById('keys-x').addEventListener('click',closeKeys);
  document.getElementById('khelp').addEventListener('click',openKeys);
  keysEl.addEventListener('mousedown',function(e){if(e.target===keysEl)closeKeys()});
  keysEl.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();closeKeys()}else if(e.key==='Tab'){e.preventDefault()}});
  addEventListener('keydown',function(e){if(e.key!=='?'||e.ctrlKey||e.metaKey||e.altKey)return;var t=e.target;if(t&&(/^(input|textarea|select)$/i.test(t.tagName)||t.isContentEditable))return;e.preventDefault();openKeys()});

  route();
})();
