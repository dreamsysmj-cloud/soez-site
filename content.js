/* SOEZ 홈페이지 콘텐츠 표시 (2026-10-05)
 * 관리센터 «🖼 홈페이지» 창에서 고친 사진·영상 목록(content/{제품}.js)을 읽어 페이지에 그린다.
 * 영상 항목 = {"yt": 유튜브 영상ID} → 유튜브 재생창(youtube-nocookie). 내 PC(file://)에서 열면 유튜브가 막으므로 썸네일+링크로 대신 보여 줌.
 * 사용: <div data-soez-gallery="modern" data-color="#7C3AED"> (JS 가 안 될 때 보일 기존 내용) </div>
 *       <script src="content/modern.js"></script> <script src="content.js" defer></script>
 * 이 파일은 손으로 고칠 일이 없다 — 내용은 관리센터에서 관리.
 */
(function () {
  var DATA = window.SOEZ_CONTENT || {};

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  // 크게 보기 (사진을 누르면 화면 가득)
  var box = null;
  function zoom(src, cap) {
    if (!box) {
      box = el('div', { style: 'position:fixed;inset:0;z-index:2000;background:rgba(15,27,58,.92);display:none;' +
        'align-items:center;justify-content:center;flex-direction:column;padding:20px;cursor:zoom-out;' });
      box.appendChild(el('img', { style: 'max-width:100%;max-height:86vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5);' }));
      box.appendChild(el('p', { style: 'color:#fff;font-size:1rem;font-weight:600;margin-top:14px;text-align:center;' }));
      box.addEventListener('click', function () { box.style.display = 'none'; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box) box.style.display = 'none'; });
      document.body.appendChild(box);
    }
    box.firstChild.src = src;
    box.lastChild.textContent = cap || '';
    box.style.display = 'flex';
  }

  function gallery(host) {
    var key = host.getAttribute('data-soez-gallery');
    var items = ((DATA[key] || {}).gallery || []).filter(function (x) { return x && (x.img || x.yt); });
    if (!items.length) return;                       // 데이터가 없으면 기존 내용 그대로 둔다
    var color = host.getAttribute('data-color') || '#2563EB';
    host.innerHTML = '';

    var css = el('style');
    css.textContent =
      '.sg-tabs{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:22px;}' +
      '.sg-tab{background:#fff;border:1px solid #CBD5E1;border-radius:999px;padding:9px 18px;font-size:.92rem;' +
      '  font-weight:700;color:#111827;cursor:pointer;font-family:inherit;}' +
      '.sg-tab:hover{border-color:' + color + ';color:' + color + ';}' +
      '.sg-tab.on{background:' + color + ';border-color:' + color + ';color:#fff;}' +
      '.sg-frame{background:#0F1B3A;border-radius:14px;padding:10px;box-shadow:0 20px 50px -20px rgba(15,27,58,.4);}' +
      '.sg-frame img{max-width:100%;max-height:600px;width:auto;border-radius:8px;display:block;margin:0 auto;cursor:zoom-in;}' +
      '.sg-cap{text-align:center;font-size:1rem;color:#111827;margin-top:14px;line-height:1.6;}' +
      '.sg-hint{text-align:center;font-size:.85rem;color:#111827;margin-top:4px;}' +
      '.sg-video{position:relative;width:100%;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000;}' +
      '.sg-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;}' +
      '.sg-video a{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;' +
      '  color:#fff;font-weight:700;text-decoration:none;background:center/cover no-repeat;}' +
      '.sg-video a span{background:rgba(220,38,38,.92);padding:12px 22px;border-radius:12px;font-size:1.05rem;}';
    host.appendChild(css);

    var tabs = el('div', { 'class': 'sg-tabs', role: 'tablist' });
    var wrap = el('div', { style: 'max-width:980px;margin:0 auto;' });
    var frame = el('div', { 'class': 'sg-frame' });
    var img = el('img', { alt: '' });
    var video = el('div', { 'class': 'sg-video' });
    var cap = el('p', { 'class': 'sg-cap' });
    var hint = el('p', { 'class': 'sg-hint' }, '🔍 사진을 누르면 크게 볼 수 있습니다');
    frame.appendChild(img);
    frame.appendChild(video);
    wrap.appendChild(frame);
    wrap.appendChild(cap);
    wrap.appendChild(hint);

    function showVideo(id, title) {
      video.innerHTML = '';                          // 탭을 바꾸면 이전 영상은 멈춘다(새로 만듦)
      if (location.protocol === 'file:') {           // 내 PC 미리보기: 유튜브가 재생을 막음 → 썸네일 + 링크
        var a = el('a', { href: 'https://youtu.be/' + id, target: '_blank', rel: 'noopener',
          style: "background-image:url('https://i.ytimg.com/vi/" + id + "/hqdefault.jpg')" });
        a.appendChild(el('span', null, '▶ 유튜브에서 보기 (홈페이지에 올리면 여기서 바로 재생)'));
        video.appendChild(a);
        return;
      }
      video.appendChild(el('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&playsinline=1',
        title: title || '사용 영상', loading: 'lazy', allowfullscreen: '',
        allow: 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen',
        referrerpolicy: 'strict-origin-when-cross-origin' }));
    }

    function show(i) {
      var it = items[i];
      var isVideo = !!it.yt;
      img.style.display = isVideo ? 'none' : '';
      video.style.display = isVideo ? '' : 'none';
      hint.style.display = isVideo ? 'none' : '';
      if (isVideo) { showVideo(it.yt, it.title); img.removeAttribute('src'); }
      else { video.innerHTML = ''; img.src = it.img; }
      img.alt = it.title || '';
      cap.textContent = it.desc ? (it.title ? it.title + ' — ' : '') + it.desc : (it.title || '');
      [].forEach.call(tabs.children, function (b, j) {
        b.classList.toggle('on', j === i);
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
    }
    items.forEach(function (it, i) {
      var b = el('button', { type: 'button', 'class': 'sg-tab', role: 'tab' }, it.title || ('화면 ' + (i + 1)));
      b.addEventListener('click', function () { show(i); });
      tabs.appendChild(b);
    });
    img.addEventListener('click', function () { if (img.src) zoom(img.src, cap.textContent); });

    if (items.length > 1) host.appendChild(tabs);
    host.appendChild(wrap);
    show(0);
  }

  [].forEach.call(document.querySelectorAll('[data-soez-gallery]'), gallery);
})();
