/* 《特别的人》：预先合成的器乐音频与简谱音符共用同一时间轴。
 * 手机直接播放 AAC 音频，不必等待整曲 Web Audio 合成。
 */
const SpecialPerson = (() => {
  const score = SpecialPersonScore;
  const media = new window.Audio('audio/special-person.m4a');
  media.preload = 'none';
  const button = $('#specialPersonBtn');
  let current = 0, replayLimit = score.length, replayInfo = null, starting = false;
  let lastPosition = 0;
  function position() { return Math.min(media.currentTime, replayLimit, score.length); }
  function point(e) {
    const phase = e.time / score.length * Math.PI * 10;
    const r = .18 + .16 * Math.sin(e.time / score.length * Math.PI);
    return { x: .5 + r * Math.cos(phase) + .07 * Math.sin(e.midi * .4),
             y: .5 + r * Math.sin(phase) * .85 + .06 * Math.cos(e.midi * .5) };
  }
  function draw(e) {
    const p = point(e), step = clamp(Math.round((e.midi - 40) / 3), 0, 14);
    Painter.bloom(p, step);
    if(e.voice === 'melody' && e.bar % 4 === 0) Painter.burst(p, step);
    S.notes++;
  }
  function shareInfo() {
    const to = $('#fTo').value.trim() || '你', msg = $('#fMsg').value.trim() || '愿你快乐', from = $('#fFrom').value.trim() || '我';
    const hash = ['special1', lastPosition.toFixed(2), to, msg, from].map(encodeURIComponent).join(',');
    return { to, msg, from, notes: S.notes, secs: S.secs, url: location.href.split('#')[0] + '#' + hash };
  }
  function complete(end = position()) {
    if(S.mode !== 'specialsong') return;
    lastPosition = end; media.pause(); Painter.lift();
    S.mode = 'done'; S.secs = Math.round(end);
    $('#hud').hidden = true; $('#songPause').hidden = true; $('#songPaintAll').hidden = true;
    if(replayInfo) {
      showCard({ ...replayInfo, notes: S.notes, secs: S.secs, url: location.href });
      document.querySelectorAll('.again').forEach(b => b.textContent = '我也来弹一首');
      cardDownload.hidden = false;
    } else {
      $('#form').hidden = false;
      $('#form h2').textContent = '《特别的人》已绘成一幅画';
      $('#formStat').textContent = `B 大调 · 72 BPM · ${S.secs} 秒 · ${S.notes} 个音符`;
      $('#fMsg').value = '把《特别的人》弹成一幅画，送给特别的你。';
      $('#makeCard').onclick = () => { showCard(shareInfo()); cardDownload.hidden = false; };
    }
  }
  function downloadAudio() {
    const a = document.createElement('a');
    a.href = 'audio/special-person.m4a'; a.download = '特别的人_简谱器乐版_72BPM.m4a'; a.click();
  }
  async function start(limit = score.length, info = null) {
    if(starting || S.mode === 'specialsong') return;
    starting = true; button.disabled = true; button.textContent = '正在准备《特别的人》…';
    replayLimit = clamp(limit, 0, score.length); replayInfo = info;
    try {
      media.currentTime = 0;
      // play 在点击事件中立即调用，以满足手机浏览器的用户交互要求。
      await media.play();
      current = 0; lastPosition = 0;
      Painter.lift(); Painter.parts = []; Painter.rings = [];
      actx.clearRect(0, 0, innerWidth, innerHeight); fitView(innerWidth / innerHeight);
      S.mode = 'specialsong'; S.notes = 0; S.secs = 0;
      $('#start').hidden = true; $('#env').hidden = true; $('#card').hidden = true; $('#form').hidden = true; $('#hud').hidden = false;
      $('#songPause').hidden = false; $('#songPause').textContent = '暂停';
      $('#songPause').onclick = async () => {
        if(!media.paused) { media.pause(); $('#songPause').textContent = '继续'; }
        else {
          try { await media.play(); $('#songPause').textContent = '暂停'; }
          catch(e) { toast('请再次轻触继续播放'); }
        }
      };
      $('#songPaintAll').hidden = false;
      $('#songPaintAll').onclick = () => {
        while(current < score.events.length) draw(score.events[current++]);
        complete(score.length);
      };
      $('#songDownload').hidden = false; $('#songDownload').textContent = '保存《特别的人》音频'; $('#songDownload').onclick = downloadAudio;
      $('#tip').textContent = '《特别的人》 · 简谱器乐版 · B 大调 · 72 BPM · 旋律正在绘成光的轨迹';
    } catch(e) {
      media.pause(); toast('音乐未能启动，请检查网络后再次轻触播放'); throw e;
    } finally {
      starting = false; button.disabled = false; button.textContent = '《特别的人》';
    }
  }
  const cardDownload = document.createElement('button');
  cardDownload.id = 'cardSpecialDownload'; cardDownload.hidden = true;
  cardDownload.textContent = '保存《特别的人》音频'; cardDownload.onclick = downloadAudio;
  $('#card .btns').append(cardDownload);
  const previousFinish = finish;
  finish = () => S.mode === 'specialsong' ? complete() : previousFinish();
  button.onclick = () => start().catch(() => {});
  media.addEventListener('ended', () => complete(score.length));
  media.addEventListener('error', () => {
    if(S.mode === 'specialsong') toast('音频加载失败，请检查网络并重新打开网页');
  });
  function tick() {
    if(S.mode === 'specialsong') {
      const t = position();
      while(current < score.events.length && score.events[current].time <= t) draw(score.events[current++]);
      if(!media.paused) {
        const p = point({ time: t, midi: 69 });
        Painter.stroke(p, clamp(Math.round(7 + 4 * Math.sin(t)), 0, 14), true); Painter.drawCursor(p, 8, true, 0);
      }
      const index = Math.min(score.barCount - 1, Math.floor(t / (4 * score.beat)));
      $('#stat').textContent = `《特别的人》 ${Math.floor(t)} / ${Math.ceil(score.length)}s · 谱面第 ${score.order[index]} 小节`;
      if(replayLimit < score.length && media.currentTime >= replayLimit) complete(replayLimit);
    }
    requestAnimationFrame(tick);
  }
  const parts = location.hash.slice(1).split(',').map(s => { try { return decodeURIComponent(s); } catch { return ''; } });
  if(parts[0] === 'special1' && parts.length === 5) {
    const value = Number(parts[1]), limit = Number.isFinite(value) ? clamp(value, 0, score.length) : score.length;
    const info = { to: parts[2], msg: parts[3], from: parts[4] };
    $('#start').hidden = true; $('#env').hidden = false;
    $('#envTitle').textContent = '致 ' + info.to;
    $('#envDesc').textContent = info.from + ' 为你送来一首《特别的人》与一幅光的画。';
    $('#openBtn').onclick = () => openSharedSong(() => start(limit, info));
  }
  requestAnimationFrame(tick);
  return { score, start, get active() { return S.mode === 'specialsong' && !media.paused; } };
})();
