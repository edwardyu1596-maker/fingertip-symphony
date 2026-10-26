/* 《画沙》：据用户提供的 EveryonePiano 两页简谱手工录入。
 * 33 小节，4/4，四分音符 = 66，1=F → 第21小节1=D → 第29小节1=F。
 * 数字后 ' 升八度，, 降八度；# 临时升号；_:时值 延长前音；0 休止。
 * 这是合成器器乐编配，截图细小连线按可辨识节奏整理，并非原唱录音。
 */
const Huasha = (() => {
  const beat = 60 / 66;
  const melody = [
    '0:4', '0:4', '0:4',
    "0:1 0:1 0:.5 0:.25 3':.25 2':.25 1':.25 7:.25 3:.25",
    "1':1.5 2':.5 7:1.5 1':.5",
    "6:2 0:.5 0:.25 3:.25 7:.25 1':.25 2':.25 7:.25",
    "1':1.5 3':.5 7:1.5 5:.5", '6:2 5:2',
    "0:.5 1':.5 7:.25 1':.5 7:.25 _:.5 5:.5 3:.5 5:.5",
    '4:.5 6:.5 #5:.25 6:.25 7:.25 7:.25 _:.25 6:.25 0:.5 0:1',
    "0:.5 1':.5 7:.25 1':.5 7:.25 _:.5 5:.5 3:.5 5:.5",
    "4:.5 3':.5 2':.25 1':.25 7:.25 7:.25 _:.25 6:.25 0:.5 5:.25 6:.5 1':.25",
    "0:.5 1':.5 7:.25 1':.5 7:.25 _:.5 5:.5 3:.5 5:.5",
    '4:.5 6:.5 #5:.25 6:.25 7:.25 7:.25 _:.25 6:.25 0:.5 0:1',
    "0:.5 1':.5 7:.25 1':.5 7:.25 _:.5 5:.5 3:.5 5:.5",
    "4:.5 3':.5 2':.25 1':.25 7:.25 7:.25 _:.25 6:.25 0:.5 6:.25 7:.25 1':.25 6:.25",
    "4':2 0:1 7:.5 1':.25 2':.25",
    "5':.5 4':.25 3':.25 0:1 0:1 0:.5 7:.25 1':.25",
    "2':.5 2':.25 2':.25 2':.75 2':.5 1':.25 7:.75 1':.75",
    "3':2 0:1 2':.25 #1':.25 7:.25 6:.25",
    "1':.25 2':.25 3':.5 3':.5 2':.25 4':.25 3':.75 5:.25 4':.25 3':.25 2':.25 1':.25",
    "1':.25 2':.25 3':.5 3':.25 2':.25 2':.25 3':.25 2':.25 1':.75 0:.25 1':.25 1':.25 1':.25",
    "5:.5 5:.25 5:.25 _:.25 4:.25 4:.25 #6:.25 5:1 0:.25 1':.25 1':.25 2':.25",
    "#2':.25 1':.25 1':.25 1':.25 _:.25 #2':.5 3':.25 2':.75 3':.25 4':.25 3':.25 2':.25 1':.25",
    "1':.25 2':.25 3':.5 3':.5 2':.25 4':.25 3':.75 5:.25 4':.25 3':.25 2':.25 1':.25",
    "1':.25 2':.25 3':.5 3':.25 2':.25 2':.25 3':.25 2':.25 1':.75 0:.25 1':.25 1':.25 1':.25",
    "5':.5 5':.25 5':.25 _:.25 4':.5 #6':.25 5':.5 5':.25 5':.25 _:.25 4':.5 7:.25",
    "1':.5 1':.25 1':.25 _:.5 2':.5 7:2",
    "1':.25 2':.25 3':.25 1':.25 _:.25 2':.25 3':.25 1':.25 7:.25 7:.25 2':.25 7:.25 _:.25 7:.25 2':.25 7:.25",
    '6:.25 1\':.25 5:.25 6:.25 _:.25 1\':.25 5:.25 6:.25 _:.25 1\':.25 5:.25 6:.25 7:.25 1\':.25 7:.25 5:.25',
    "1':.25 2':.25 3':.25 1':.25 _:.25 2':.25 3':.25 1':.25 7:.25 7:.25 2':.25 7:.25 _:.25 7:.25 2':.25 7:.25",
    '6:.25 1\':.25 5:.25 6:.25 _:.25 1\':.25 5:.25 6:.25 _:.25 1\':.25 5:.25 6:.25 7:.25 1\':.25 7:.25 5:.25',
    '7,:2 0:2'
  ];
  // 每个字符串是一拍的十六分音符；跨拍的灰色音符按延音处理。
  const A = '6,, 3, 5, 1 _ 5, 3, 5, 3, 2, 5, 7, 0:1';
  const At = '6,, 3, 5, 1 _ 5, 3, 5, 3, 2, 5, 7, _:1';
  const B = '4,, 2, 5, 1 _ 5, 2, 5, 5, 2, 5, 1 0:.5 7,:.25 0:.25';
  const Bt = '4,, 2, 5, 1 _ 5, 2, 5, 5, 2, 5, 1 _:.5 7,:.25 0:.25';
  const C = '4,, 2, 6, 1 3, 2, #5, 7, 6,, 3, 6, 1 _ 7,:.5 6,,:.25';
  const Ct = '4,, 2, 6, 1 3, 2, #5, 7, 6,, 3, 6, 1 _:.5 0:.5';
  const bass = [A,B,A,B,At,Bt,At,Bt,At,C,At,Ct,At,C,At,Ct,
    '2,, 6,, 1, 4, _ 1, 6,, 1, 2,, 7,, 2, 4, _ 2, 7,, 2,',
    '1,, 5,, 7,, 3, _ 7,, 5,, 7,, 4,, 1, 3, 6, _ 3, 1, 3,',
    '7,,, 4,, 6,, 2, _ 6,, 4,, 6,, 7,,, 4,, 6,, 2, _ 6,, 4,, 6,,',
    '3,, 7,, 2, #5, _ 2, 7,, 2, 3,, #5, 6, 7, #1 2 3 5',
    '1,, 5,, 1, 3, _ 1, 5,, 1, 1,, 5,, 1, 3, 7,,, 5,, 7,, 2,',
    '6,, 3, 6, 1 _ 6, 3, 6, 6,, 3, 6, 1 5,, 3, 5, 7,',
    '4,, 1, 4, #5, _ 4, 1, 4, 4,, 1, 4, 5, _ 4, 1, 4,',
    '5,, 2, 4, 5, _ 4, 2, 4, 5,, 2, 4, 7, _ 5, 4, 3,',
    '1,, 5,, 1, 3, _ 1, 5,, 1, 1,, 5,, 1, 3, 7,,, 5,, 7,, 2,',
    '6,, 3, 6, 1 _ 6, 3, 6, 6,, 3, 6, 1 5,, 3, 5, 7,',
    '4,, 1, 4, #5, _ 4, 1, 4, 4,, 1, 4, 5, _ 4, 1, 4,',
    '5,, 2, 4, 5, _ 4, 2, 4, 5,, 2, 4, 7, _ 0:.75',
    '6,, 3, 5, 6, _ 6, 5, 3, 3,, 7,, 2, 5, _ 3, 5, 2,',
    '4,, 1, 3, 4, _ 1, 4, 6, 4,, 1, 3, 4, 5,, 2, 5, 7,',
    '6,, 3, 5, 6, _ 6, 5, 3, 3,, 7,, 2, 5, _ 3, 5, 2,',
    '4,, 1, 3, 4, _ 1, 4, 6, 4,, 1, 3, 4, 5,, 2, 5, 7,',
    '6,,:2 0:2'
  ];
  // 副歌第25—28小节的右手下方和声音。
  const harmony = {
    24:'5:.25 5:.25 5:.5 5:.5 5:.25 5:.25 5:.75 5:.25 5:.25 5:.25 5:.25 5:.25',
    25:'5:.25 5:.25 5:.5 5:.25 5:.25 5:.25 5:.25 5:.25 5:.75 0:.25 3:.25 4:.25 5:.25',
    26:'#5:.5 5:.25 5:.25 _:.25 5:.5 5:.25 5:.5 5:.25 5:.25 _:.25 4:.5 4:.25',
    27:'5:.5 5:.25 5:.25 _:.5 5:.5 5:2'
  };
  function midi(note, key) {
    const m = /^(#?)([1-7])([',]*)$/.exec(note);
    if (!m) throw new Error('无法识别音符：' + note);
    const oct = [...m[3]].reduce((s,c)=>s+(c==="'"?12:-12),0);
    return key + [0,2,4,5,7,9,11][+m[2]-1] + (m[1]?1:0) + oct;
  }
  function parse(line, bar, voice) {
    let pos = 0, prev = null;
    const out = [], key = bar >= 20 && bar < 28 ? 62 : 65;
    for (const token of line.split(/\s+/)) {
      const [n,d] = token.split(':'), dur = d === undefined ? .25 : +d;
      if (n === '_') { if (!prev) throw new Error('无前音的延音'); prev.beats += dur; }
      else if (n !== '0') {
        prev = {midi:midi(n,key), time:(bar*4+pos)*beat, beats:dur, voice, bar}; out.push(prev);
      } else prev = null;
      pos += dur;
    }
    if (Math.abs(pos-4) > .001) throw new Error(`第${bar+1}小节 ${voice} 共${pos}拍`);
    return out;
  }
  const events = melody.flatMap((s,i)=>parse(s,i,'melody'))
    .concat(bass.flatMap((s,i)=>parse(s,i,'bass')))
    .concat(Object.entries(harmony).flatMap(([i,s])=>parse(s,+i,'harmony')));
  events.push(...[65,69,74].map((midi,i)=>({midi,time:128*beat+i*.045,beats:2,voice:'harmony',bar:32})));
  events.sort((a,b)=>a.time-b.time);
  const length = 132 * beat, duration = length + 3;
  let buffer, rendering, ctx, source, started = 0, elapsed = 0, current = 0, active = false;
  let replayLimit = length;
  const button = $('#huashaBtn'), pause = $('#songPause'), download = $('#songDownload');
  function piano(context, out, e) {
    const t=e.time, hold=e.beats*beat, f=440*2**((e.midi-69)/12);
    const env=context.createGain(), p=context.createStereoPanner();
    const volume=e.voice==='melody'?.24:e.voice==='bass'?.105:.075;
    const tail=Math.max(.38,Math.min(1.6,hold*.75));
    env.gain.setValueAtTime(.00001,t);
    env.gain.exponentialRampToValueAtTime(volume,t+.006);
    env.gain.exponentialRampToValueAtTime(volume*.36,t+Math.max(.035,hold*.7));
    env.gain.exponentialRampToValueAtTime(.00001,t+hold+tail);
    p.pan.value=e.voice==='bass'?-.25:.16; env.connect(p); p.connect(out);
    [[1,1],[2,.23],[3,.075]].forEach(([mul,gain])=>{
      const o=context.createOscillator(), g=context.createGain();
      o.type='sine'; o.frequency.value=f*mul; g.gain.value=gain;
      o.connect(g); g.connect(env); o.start(t); o.stop(t+hold+tail+.02);
    });
  }
  async function render() {
    if(buffer) return buffer;
    if(rendering) return rendering;
    rendering=(async()=>{
      const off=new OfflineAudioContext(2,Math.ceil(duration*22050),22050);
      const master=off.createGain(); master.gain.value=.8;
      const comp=off.createDynamicsCompressor(); master.connect(comp); comp.connect(off.destination);
      const echo=off.createDelay(1), wet=off.createGain(); echo.delayTime.value=.22; wet.gain.value=.16;
      master.connect(echo); echo.connect(wet); wet.connect(comp);
      events.forEach(e=>piano(off,master,e));
      buffer=await off.startRendering(); return buffer;
    })();
    try {return await rendering;} finally {rendering=null;}
  }
  function stopSource() { if(source) {source.onended=null; source.stop(); source.disconnect(); source=null;} }
  function play() {
    source=ctx.createBufferSource(); source.buffer=buffer; source.connect(ctx.destination);
    started=ctx.currentTime-elapsed; active=true;
    source.onended=()=>{ if(active) complete(); };
    source.start(0,elapsed); pause.textContent='暂停';
  }
  async function start(limit=length) {
    if(S.mode==='song') return;
    button.disabled=true; button.textContent='正在合成《画沙》…';
    try {
      ctx ||= new (window.AudioContext||window.webkitAudioContext)();
      await unlockAudio(ctx); await render();
      stopSource(); elapsed=0; current=0; replayLimit=limit;
      Painter.lift(); Painter.parts=[]; Painter.rings=[];
      actx.clearRect(0,0,innerWidth,innerHeight); fitView(innerWidth/innerHeight);
      S.mode='song'; S.notes=0; S.secs=0;
      $('#start').hidden=true; $('#env').hidden=true; $('#card').hidden=true; $('#form').hidden=true; $('#hud').hidden=false;
      pause.hidden=false; download.hidden=false; $('#songPaintAll').hidden=false;
      $('#tip').textContent='《画沙》 · 简谱器乐版 · 66 BPM · F → D → F · 音符正在绘成光的轨迹';
      play();
    } catch(e) {console.error(e);toast('播放失败：'+e.message);throw e;}
    finally {button.disabled=false;button.textContent='《画沙》';}
  }
  function position() { return active?Math.min(ctx.currentTime-started,duration):elapsed; }
  function point(e) {
    const phase=e.time/length*Math.PI*8, r=.17+.17*Math.sin(e.time/length*Math.PI);
    return {x:.5+r*Math.cos(phase)+.08*Math.sin(e.midi*.4),y:.5+r*Math.sin(phase)*.85+.07*Math.cos(e.midi*.5)};
  }
  function drawEvent(e) {
    const p=point(e), step=clamp(Math.round((e.midi-43)/3),0,14);
    Painter.bloom(p,step);
    if(e.voice==='melody' && e.bar%4===0) Painter.burst(p,step);
    S.notes++;
  }
  function tick() {
    if(S.mode==='song') {
      const t=position();
      while(current<events.length && events[current].time<=Math.min(t,replayLimit)) drawEvent(events[current++]);
      if(active) {
        const q={time:t,midi:69}, p=point(q);
        Painter.stroke(p,clamp(Math.round(7+4*Math.sin(t)),0,14),true); Painter.drawCursor(p,8,true,0);
        if(t>=Math.min(duration,replayLimit+3)) complete();
      }
      const bar=Math.min(33,Math.floor(t/beat/4)+1);
      $('#stat').textContent=`《画沙》 ${Math.floor(t)} / ${Math.ceil(length)}s · ${bar}/33 小节 · ${bar>=21&&bar<=28?'D':'F'}调`;
    }
    requestAnimationFrame(tick);
  }
  function complete() {
    elapsed=Math.min(position(),replayLimit,length); active=false; stopSource();
    S.mode='done'; S.secs=Math.round(elapsed); Painter.lift(); pause.hidden=true; $('#songPaintAll').hidden=true;
    $('#hud').hidden=true; $('#form').hidden=false;
    $('#form h2').textContent='《画沙》已绘成一幅画';
    $('#formStat').textContent=`简谱器乐演奏 · ${S.secs} 秒 · ${S.notes} 个音符`;
    $('#fMsg').value='把《画沙》弹成一幅画，送给你。';
    $('#makeCard').onclick=()=>{
      const to=$('#fTo').value.trim()||'你',msg=$('#fMsg').value.trim()||'愿你快乐',from=$('#fFrom').value.trim()||'我';
      const hash=['huasha1',elapsed.toFixed(2),to,msg,from].map(encodeURIComponent).join(',');
      showCard({to,msg,from,notes:S.notes,secs:S.secs,url:location.href.split('#')[0]+'#'+hash});
    };
  }
  $('#songPaintAll').onclick=()=>{
    // 补画其余音符，不必等待两分钟；音频始终可以单独下载。
    active=false; stopSource();
    while(current<events.length) drawEvent(events[current++]);
    elapsed=length; replayLimit=length; complete();
  };
  button.onclick=()=>start().catch(()=>{});
  pause.onclick=async()=>{
    if(active) {elapsed=position();active=false;stopSource();pause.textContent='继续';}
    else {await ctx.resume();play();}
  };
  const originalFinish=finish;
  finish=()=>S.mode==='song'?complete():originalFinish();
  download.onclick=async()=>{
    download.disabled=true; download.textContent='正在导出…';
    try {
      const b=await render(), frames=b.length, data=new DataView(new ArrayBuffer(44+frames*4));
      const str=(p,s)=>[...s].forEach((c,i)=>data.setUint8(p+i,c.charCodeAt(0)));
      str(0,'RIFF');data.setUint32(4,36+frames*4,true);str(8,'WAVE');str(12,'fmt ');
      data.setUint32(16,16,true);data.setUint16(20,1,true);data.setUint16(22,2,true);
      data.setUint32(24,b.sampleRate,true);data.setUint32(28,b.sampleRate*4,true);
      data.setUint16(32,4,true);data.setUint16(34,16,true);str(36,'data');data.setUint32(40,frames*4,true);
      const l=b.getChannelData(0),r=b.getChannelData(1);
      for(let i=0;i<frames;i++) for(let ch=0;ch<2;ch++) {
        const v=clamp(ch?r[i]:l[i],-1,1);data.setInt16(44+i*4+ch*2,v*(v<0?32768:32767),true);
      }
      const url=URL.createObjectURL(new Blob([data],{type:'audio/wav'})),a=document.createElement('a');
      a.href=url;a.download='画沙_简谱器乐版_66BPM.wav';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
      toast('《画沙》WAV 已导出');
    } catch(e) {toast('导出失败：'+e.message);}
    finally {download.disabled=false;download.textContent='保存《画沙》音频';}
  };
  // 同一个下载按钮在演奏和贺卡页面都可使用。
  const cardDownload=download.cloneNode(true);cardDownload.id='cardSongDownload';cardDownload.hidden=true;
  $('#card .btns').append(cardDownload);cardDownload.onclick=()=>download.click();
  new MutationObserver(()=>cardDownload.hidden=!buffer).observe($('#card'),{attributes:true,attributeFilter:['hidden']});
  $('#doneBtn').onclick=()=>finish();
  const parts=location.hash.slice(1).split(',').map(s=>{try{return decodeURIComponent(s);}catch{return '';}});
  if(parts[0]==='huasha1' && parts.length===5) {
    const limit=clamp(+parts[1]||length,0,length);
    $('#start').hidden=true;$('#env').hidden=false;
    $('#envTitle').textContent='致 '+parts[2];$('#envDesc').textContent=parts[4]+' 为你送来一首《画沙》与一幅光的画。';
    $('#openBtn').onclick=()=>openSharedSong(async()=>{await start(limit);$('#fTo').value=parts[2];$('#fFrom').value=parts[4];$('#fMsg').value=parts[3];});
  }
  requestAnimationFrame(tick);
  return {events,length,duration,start,render,get buffer(){return buffer;},get active(){return active;}};
})();
