/* SOEZ 공용 모바일 메뉴 (2026-10-05)
 * 모든 공개 페이지 맨 아래 <script src="nav.js" defer></script> 로 포함.
 * 화면이 좁으면(900px 이하) 메뉴를 접고 ☰ 버튼을 보여 준다. 누르면 세로 메뉴가 펼쳐진다.
 * 메뉴 항목 자체는 각 페이지 HTML 의 .nav-links 를 그대로 쓴다(검색엔진이 읽을 수 있게).
 */
(function () {
  var links = document.querySelector('.nav .nav-links') || document.querySelector('header nav');

  var css = [
    '.soez-toggle{display:none;align-items:center;justify-content:center;width:46px;height:46px;margin-left:auto;',
    '  border:1px solid #CBD5E1;border-radius:10px;background:#fff;color:#0F1B3A;font-size:1.5rem;line-height:1;cursor:pointer;flex-shrink:0;}',
    '.soez-toggle:focus-visible{outline:3px solid #2563EB;outline-offset:2px;}',
    '@media (max-width:900px){',
    '  .soez-head{position:relative;}',
    '  .soez-toggle{display:flex;}',
    '  .soez-links{display:none !important;}',
    '  body.soez-nav-open .soez-links{display:flex !important;flex-direction:column;align-items:stretch;gap:0 !important;',
    '    position:absolute;top:100%;left:0;right:0;z-index:1000;background:#fff;padding:6px 16px 16px;',
    '    box-shadow:0 12px 24px rgba(15,27,58,.18);border-top:1px solid #E5E7EB;list-style:none;margin:0;}',
    '  body.soez-nav-open .soez-links li{display:block !important;margin:0;}',
    '  body.soez-nav-open .soez-links a{display:block;padding:15px 6px;font-size:1.08rem;font-weight:700;color:#111827;',
    '    border-bottom:1px solid #EEF2F7;text-align:left;white-space:nowrap;}',
    '  body.soez-nav-open .soez-links a.nav-cta{margin-top:12px;border:none;border-radius:10px;text-align:center;',
    '    background:#2563EB;color:#fff !important;padding:15px;}',
    '  body.soez-nav-open .soez-links a.active{color:#2563EB;}',
    '  .nav-logo div, .nav-logo span{white-space:nowrap;}',
    '}',
    '@media (max-width:380px){ .nav-logo span{display:none !important;} }',
    /* 다운로드 페이지(header nav) 의 구매 신청도 다른 페이지처럼 버튼 모양 */
    'header nav.soez-links a.nav-cta{background:#2563EB;color:#fff !important;padding:7px 14px;border-radius:8px;font-weight:700;}',
    /* 휴대폰에서 화면이 옆으로 넘치던 것 (2026-10-05):
       소개 페이지들의 «칸 수 고정» 묶음(inline grid-template-columns)은 한 줄씩, 넓은 표는 옆으로 밀어 보기 */
    '@media (max-width:760px){',
    '  [style*="grid-template-columns"]{grid-template-columns:1fr !important;}',
    '  table{display:block;max-width:100%;overflow-x:auto;}',
    '  td,th{overflow-wrap:anywhere;}',
    '}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);   // 화면 규칙은 메뉴가 없는 페이지(약관 등)에도 항상 적용

  if (!links) return;
  links.classList.add('soez-links');
  var bar = links.closest('.nav-inner') || links.parentElement;
  var head = links.closest('.nav') || links.closest('header') || bar;
  head.classList.add('soez-head');
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'soez-toggle';
  btn.setAttribute('aria-label', '메뉴 열기');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';
  bar.appendChild(btn);

  function setOpen(open) {
    document.body.classList.toggle('soez-nav-open', open);
    btn.textContent = open ? '✕' : '☰';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!document.body.classList.contains('soez-nav-open'));
  });
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('soez-nav-open') && !head.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
})();
