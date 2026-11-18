/* Settings
   FORM_ENDPOINT: paste a Formspree form URL here to receive contact messages by email
   (see README.md). Leave it empty to open the visitor's email app instead. */
var FORM_ENDPOINT='';


(function(){
  var views=document.querySelectorAll('[data-view]'),links=document.querySelectorAll('nav a');
  var routed=false;
  function route(){
    var h=(location.hash||'#home').slice(1),found=false;
    views.forEach(function(v){var on=v.dataset.view===h;v.hidden=!on;if(on)found=v})
    if(!found){found=views[0];found.hidden=false;h='home'}
    var cur=['ridersafe','apparel-303','kainsaan'].indexOf(h)>-1?'work':h;
    links.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','page')});
    document.title=(found.dataset.title==='Home'?'':found.dataset.title+' – ')+'Clarence Matthew Yabut';
    var order=['home','work','about','certifications','recommendations','contact'],nx=order[(order.indexOf(cur)+1)%order.length],nl=document.getElementById('next');
    nl.href='#'+nx;nl.textContent=nx==='home'?'Back to the start':'Next: '+document.querySelector('[data-view="'+nx+'"]').dataset.title;
    window.scrollTo(0,0);
    var t=found.querySelector('h1');if(t&&routed)t.focus({preventScroll:true});routed=true;
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
  function clockTick(){try{var t=new Date().toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit',timeZone:'Asia/Manila'});ck.textContent=t;if(ck2)ck2.textContent=t}catch(e){}}
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
  document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){setTheme(document.documentElement.getAttribute('data-theme')!=='dark')})});

  /* Image viewer */
  var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),opener=null;
  function closeLb(){lb.hidden=true;if(opener)opener.focus()}
  document.querySelectorAll('.zoom').forEach(function(z){z.addEventListener('click',function(){var im=z.querySelector('img');opener=z;lbi.src=im.src;lbi.alt=im.alt;lb.hidden=false;document.getElementById('lbx').focus()})});
  lb.addEventListener('click',closeLb);
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb()});

  /* Landing game: catch closing tags, dodge bugs */
  var ov=document.getElementById('game'),cv=document.getElementById('gcv'),cx=cv.getContext('2d'),wrapEl=document.querySelector('.wrap'),
      hud=document.getElementById('ghud'),gmsg=document.getElementById('gmsg'),gst=document.getElementById('gstart'),
      TOK=['</div>','</p>',';','}',')','</a>','</li>'],GOAL=10,gW=0,gH=0,px=0,items=[],fx=[],lives=3,score=0,sp=0,last=0,run=false,raf=0,keys={};
  function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  function fit(){var d=window.devicePixelRatio||1;gW=Math.max(260,Math.min(ov.clientWidth-32,640));gH=Math.max(240,Math.min(innerHeight*.45,380));cv.style.width=gW+'px';cv.style.height=gH+'px';cv.width=gW*d;cv.height=gH*d;cx.setTransform(d,0,0,d,0,0)}
  var best=0,t0=0;try{best=parseFloat(localStorage.getItem('best'))||0}catch(e){}
  function hudUp(){hud.textContent='Built '+score+' of '+GOAL+'. Lives: '+'●'.repeat(lives)+'○'.repeat(3-lives)+(best?'. Best time: '+best.toFixed(1)+'s':'')}
  function enter(){run=false;cancelAnimationFrame(raf);try{sessionStorage.setItem('played','1')}catch(e){}wrapEl.inert=false;document.body.classList.remove('gaming');ov.classList.add('out');setTimeout(function(){ov.hidden=true},500);route()}
  function drawBug(x,y,body,white,dark){
    cx.strokeStyle=body;cx.lineWidth=2;
    for(var i=-1;i<=1;i++){cx.beginPath();cx.moveTo(x-8,y+i*5);cx.lineTo(x-15,y+i*5+3);cx.moveTo(x+8,y+i*5);cx.lineTo(x+15,y+i*5+3);cx.stroke()}
    cx.fillStyle=body;cx.beginPath();cx.ellipse(x,y,11,9,0,0,6.283);cx.fill();
    cx.fillStyle=white;[-4,4].forEach(function(o){cx.beginPath();cx.arc(x+o,y-2,3.2,0,6.283);cx.fill()});
    cx.fillStyle=dark;[-4,4].forEach(function(o){cx.beginPath();cx.arc(x+o,y-1.5,1.5,0,6.283);cx.fill()});
  }
  function start(){fit();items=[];fx=[];lives=3;score=0;sp=0;px=gW/2;hudUp();gmsg.textContent='Catch the closing tags. Dodge the bugs.';gst.hidden=true;run=true;last=t0=performance.now();raf=requestAnimationFrame(tick)}
  function tick(t){
    if(!run)return;
    var dt=Math.min(.05,(t-last)/1000);last=t;
    if(keys.ArrowLeft)px-=440*dt;if(keys.ArrowRight)px+=440*dt;
    px=Math.max(40,Math.min(gW-40,px));
    sp-=dt;if(sp<=0){sp=.7+Math.random()*.45;items.push({x:24+Math.random()*(gW-48),y:-16,v:(95+Math.random()*55)*(1+score*.04),bug:Math.random()<.3,s:TOK[Math.floor(Math.random()*TOK.length)]})}
    var ink=css('--ink'),acc=css('--accent'),bad=css('--sos'),eye=css('--eye'),py=gH-38;
    cx.clearRect(0,0,gW,gH);
    cx.font='700 18px ui-monospace,Menlo,Consolas,monospace';cx.textAlign='center';
    items=items.filter(function(it){
      it.y+=it.v*dt;
      if(it.y>py-6&&it.y<py+26&&Math.abs(it.x-px)<44){if(it.bug)lives--;else score++;fx.push({x:it.x,y:it.y,t:0,bug:it.bug});hudUp();return false}
      if(it.y>gH+24)return false;
      if(it.bug)drawBug(it.x,it.y,bad,eye,ink);else{cx.fillStyle=acc;cx.fillText(it.s,it.x,it.y)}
      return true;
    });
    cx.fillStyle=css('--paper');cx.strokeStyle=ink;cx.lineWidth=2;cx.beginPath();
    if(cx.roundRect)cx.roundRect(px-38,py,76,26,6);else cx.rect(px-38,py,76,26);
    cx.fill();cx.stroke();cx.fillStyle=ink;cx.fillText('{ }',px,py+19);
    fx=fx.filter(function(f){f.t+=dt;if(f.t>.3)return false;cx.globalAlpha=1-f.t/.3;cx.strokeStyle=f.bug?bad:acc;cx.lineWidth=2;cx.beginPath();cx.arc(f.x,f.y,8+f.t*90,0,6.283);cx.stroke();cx.globalAlpha=1;return true});
    if(score>=GOAL){run=false;var secs=(performance.now()-t0)/1000,nb=!best||secs<best;if(nb){best=secs;try{localStorage.setItem('best',String(secs))}catch(e){}}hudUp();gmsg.textContent='Build succeeded in '+secs.toFixed(1)+' seconds.'+(nb?' New best!':'')+' Opening the portfolio.';wink();setTimeout(enter,1500);return}
    if(lives<=0){run=false;gmsg.textContent='Build failed: too many bugs.';gst.textContent='Try again';gst.hidden=false;return}
    raf=requestAnimationFrame(tick);
  }
  cv.addEventListener('pointermove',function(e){px=e.clientX-cv.getBoundingClientRect().left});
  cv.addEventListener('pointerdown',function(e){px=e.clientX-cv.getBoundingClientRect().left});
  addEventListener('keydown',function(e){if(run&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){keys[e.key]=true;e.preventDefault()}});
  addEventListener('keyup',function(e){keys[e.key]=false});
  gst.addEventListener('click',start);
  document.getElementById('gskip').addEventListener('click',enter);
  hudUp();
  var skipG=false;try{skipG=sessionStorage.getItem('played')==='1'}catch(e){}
  if(location.hash&&location.hash!=='#home')skipG=true;
  if(skipG){ov.hidden=true}else{wrapEl.inert=true;document.body.classList.add('gaming');fit();gst.focus();addEventListener('resize',function(){if(!run)fit()})}
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
  if(hero&&!still)addEventListener('pointermove',function(e){hx=e.clientX;hy=e.clientY;if(hq)return;hq=requestAnimationFrame(function(){hq=0;var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',(hx-r.left)+'px');hero.style.setProperty('--my',(hy-r.top)+'px')})},{passive:true});
  /* Skip link */
  document.getElementById('skip').addEventListener('click',function(){document.getElementById('main').focus()});

  /* Screenshot strips on the Work page */
  document.querySelectorAll('[data-strip]').forEach(function(b){b.addEventListener('click',function(){var s=b.closest('.strip-wrap').querySelector('.strip');s.scrollBy({left:Number(b.dataset.strip)*s.clientWidth*.8,behavior:still?'auto':'smooth'})})});

  /* Touch devices: three small eyes peek in from the edges, glance where you tap, and look up or down as you scroll */
  var mob=matchMedia('(pointer:coarse),(max-width:700px)'),MOB=[[0,28,34],[100,52,38],[0,78,32]];
  function layoutEyes(){eyes.forEach(function(x,i){var e=x[0],d=e.dataset.d.split(',');if(mob.matches){if(i<3){e.style.display='';e.style.left=MOB[i][0]+'%';e.style.top=MOB[i][1]+'%';e.style.setProperty('--s',MOB[i][2]+'px')}else e.style.display='none'}else{e.style.display='';e.style.left=d[0]+'%';e.style.top=d[1]+'%';e.style.setProperty('--s',d[2]+'px')}})}
  layoutEyes();if(mob.addEventListener)mob.addEventListener('change',layoutEyes);
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
  route();
})();
