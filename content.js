/* SOEZ 홈페이지 콘텐츠 표시 (2026-10-05)
 * 관리센터 «🖼 홈페이지» 창에서 고친 사진 목록(content/{제품}.js)을 읽어 페이지에 그린다.
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
    var items = ((DATA[key] || {}).gallery || []).filter(function (x) { return x && x.img; });
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
      '.sg-hint{text-align:center;font-size:.85rem;color:#111827;margin-top:4px;}';
    host.appendChild(css);

    var tabs = el('div', { 'class': 'sg-tabs', role: 'tablist' });
    var wrap = el('div', { style: 'max-width:980px;margin:0 auto;' });
    var frame = el('div', { 'class': 'sg-frame' });
    var img = el('img', { alt: '' });
    var cap = el('p', { 'class': 'sg-cap' });
    frame.appendChild(img);
    wrap.appendChild(frame);
    wrap.appendChild(cap);
    wrap.appendChild(el('p', { 'class': 'sg-hint' }, '🔍 사진을 누르면 크게 볼 수 있습니다'));

    function show(i) {
      var it = items[i];
      img.src = it.img;
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
    img.addEventListener('click', function () { zoom(img.src, cap.textContent); });

    if (items.length > 1) host.appendChild(tabs);
    host.appendChild(wrap);
    show(0);
  }

  [].forEach.call(document.querySelectorAll('[data-soez-gallery]'), gallery);
})();
