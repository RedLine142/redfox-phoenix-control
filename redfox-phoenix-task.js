(function () {
  'use strict';

  var VERSION = '1.0.1';
  var ROOT_ID = 'rf-phoenix-task';
  var STYLE_ID = 'rf-phoenix-task-style';

  if (window.RedFoxPhoenixTask && window.RedFoxPhoenixTask.version === VERSION) return;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function textOf(node) {
    return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID}{
  --bg:#080d0b;--panel:#111a16;--panel2:#17231b;--line:#304136;
  --text:#e5eee6;--muted:#91a294;--green:#a7c18c;--amber:#d7b77d;
  --red:#e34b45;color:var(--text);font-family:Arial,Helvetica,sans-serif;
  max-width:1120px;width:calc(100% - 24px);margin:18px auto 36px;
  box-sizing:border-box
}
#${ROOT_ID} *{box-sizing:border-box}
#${ROOT_ID} .rf-shell{
  overflow:hidden;border:1px solid #314237;border-radius:13px;
  background:radial-gradient(ellipse at 50% -20%,#26392c,#101a14 48%,#080d0b 100%);
  box-shadow:0 18px 55px rgba(0,0,0,.38)
}
#${ROOT_ID} .rf-banner{
  position:relative;padding:19px 22px 16px;
  background:linear-gradient(110deg,#18271d,#0a110d);
  border-bottom:1px solid var(--line)
}
#${ROOT_ID} .rf-banner:after{
  content:"";position:absolute;right:22px;top:22px;width:7px;height:7px;
  border-radius:50%;background:var(--red);box-shadow:0 0 12px var(--red);
  animation:rfTaskPulse 1.8s infinite
}
#${ROOT_ID} .rf-kicker{font-size:10px;letter-spacing:3px;color:#a2b5a4;text-transform:uppercase}
#${ROOT_ID} .rf-banner-title{font-size:clamp(19px,3vw,27px);font-weight:800;letter-spacing:2px;margin:7px 0 3px;color:#edf4ec}
#${ROOT_ID} .rf-banner-sub{font-size:10px;letter-spacing:1.7px;color:#8ea392;text-transform:uppercase}
#${ROOT_ID} .rf-banner-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}
#${ROOT_ID} .rf-chip{border:1px solid #34483a;background:rgba(8,15,10,.55);padding:6px 9px;border-radius:4px;font-size:9px;letter-spacing:1px;color:#b8c9b8;text-transform:uppercase}
#${ROOT_ID} .fixed-top{position:relative!important;top:auto!important;z-index:2;background:#0c140f;border-bottom:1px solid #304136;padding:12px 16px}
#${ROOT_ID} .fixed-top>.wrapper{max-width:none!important;width:100%!important;margin:0!important;padding:0!important}
#${ROOT_ID} form.enter{margin:0!important}
#${ROOT_ID} .non-fixed-input{display:flex;gap:9px;align-items:stretch}
#${ROOT_ID} form.enter input[type=text]{
  min-width:0;flex:1;height:43px;padding:0 13px;border:1px solid #405344;
  border-radius:4px;background:#080f0b;color:#edf4ec;font-size:14px;outline:none
}
#${ROOT_ID} form.enter input[type=text]:focus{border-color:#a7c18c;box-shadow:0 0 0 2px rgba(167,193,140,.12)}
#${ROOT_ID} form.enter button{
  min-width:112px;border:1px solid #718b63;border-radius:4px;padding:0 17px;
  background:linear-gradient(180deg,#344b35,#203326);color:#f0f5ec;
  font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer
}
#${ROOT_ID} form.enter button:hover{filter:brightness(1.15)}
#${ROOT_ID} .container-location{
  display:block!important;width:100%!important;max-width:none!important;
  margin:0!important;padding:0 20px 20px!important;background:transparent!important;
  color:var(--text)!important;border:0!important;box-shadow:none!important
}
#${ROOT_ID} .container-location>.header{display:none}
#${ROOT_ID} h1{
  display:flex;align-items:center;gap:10px;margin:0 -20px 17px!important;
  padding:16px 20px;border-bottom:1px solid #304136;
  background:rgba(10,17,12,.72);color:#edf4ec!important;
  font-size:clamp(16px,2.4vw,21px)!important;letter-spacing:1.5px!important;
  line-height:1.35!important;text-transform:uppercase
}
#${ROOT_ID} h1 a{display:grid;place-items:center;width:30px;height:30px;flex:0 0 30px;border:1px solid #405342;border-radius:4px;color:#a9bf9e!important}
#${ROOT_ID} h1 a:hover{border-color:#a7c18c;background:#1b2b20}
#${ROOT_ID} h1 .separator{color:#66796a}
#${ROOT_ID} h1 strong{color:#edf4ec!important;font-weight:800}
#${ROOT_ID} .tabcontent{display:none;margin:0 0 14px;padding:20px;border:1px solid #304136;border-radius:7px;background:rgba(13,22,16,.9);color:var(--text)}
#${ROOT_ID} .tabcontent.active{display:block}
#${ROOT_ID} .tabcontent.task{line-height:1.68;font-size:14px}
#${ROOT_ID} .task_text{color:#dce7dc;overflow-wrap:anywhere}
#${ROOT_ID} .task_text>br{display:none}
#${ROOT_ID} .task_text p{margin:0 0 12px}
#${ROOT_ID} .task_text p strong{color:#c7d9b8;letter-spacing:.35px}
#${ROOT_ID} .task_text hr{border:0;border-top:1px solid #405344;margin:18px 0}
#${ROOT_ID} .task_text blockquote{margin:14px 0;padding:13px 16px;border-left:3px solid #a7c18c;background:#17231b;color:#bdcbbb}
#${ROOT_ID} .task_text blockquote br{display:none}
#${ROOT_ID} .task_text blockquote p{margin:0 0 7px}
#${ROOT_ID} .tabcontent.found-codes>p,
#${ROOT_ID} .tabcontent.location-codes>p{color:#bdcbbb}
#${ROOT_ID} .tabcontent.location-codes p.codes_class{margin:0}
#${ROOT_ID} .tabcontent.location-codes strong{color:#dce8dc}
#${ROOT_ID} .tabcontent.hints ul.hints{list-style:none;margin:0;padding:0;display:grid;gap:10px}
#${ROOT_ID} .tabcontent.hints li{padding:13px 15px;border:1px solid #34483a;border-radius:5px;background:#121e16}
#${ROOT_ID} .tabcontent.hints li p{margin:0 0 5px;color:#c4d2c3;line-height:1.55}
#${ROOT_ID} .tabcontent.hints li p:first-child{color:#d8e6d1;font-size:11px;letter-spacing:1.3px;text-transform:uppercase}
#${ROOT_ID} .tabs{margin:0!important;padding:0 14px 14px!important;background:#0b120d!important;border-top:1px solid #304136}
#${ROOT_ID} .tabs>.wrapper{display:flex;gap:7px;max-width:none!important;width:100%!important;margin:0!important;padding:10px 0 0!important;flex-wrap:wrap}
#${ROOT_ID} .tabs .tab{
  flex:1 1 130px;min-width:0;padding:12px 10px!important;margin:0!important;
  border:1px solid #34483a!important;border-radius:4px!important;
  background:#111b14!important;color:#91a294!important;text-align:center;
  font-size:10px!important;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer
}
#${ROOT_ID} .tabs .tab.active{border-color:#81996f!important;background:#233528!important;color:#e5eee6!important;box-shadow:inset 0 -2px #a7c18c}
#${ROOT_ID} .rf-footer{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:11px 18px;border-top:1px solid #304136;color:#718477;font-size:9px;letter-spacing:1.4px;text-transform:uppercase}
@keyframes rfTaskPulse{0%,100%{opacity:1;box-shadow:0 0 5px #e34b45}50%{opacity:.45;box-shadow:0 0 16px #e34b45}}
@media(max-width:620px){
  #${ROOT_ID}{width:calc(100% - 12px);margin:8px auto 22px}
  #${ROOT_ID} .rf-banner{padding:16px 15px}
  #${ROOT_ID} .container-location{padding:0 12px 14px!important}
  #${ROOT_ID} h1{margin:0 -12px 12px!important;padding:13px 12px}
  #${ROOT_ID} .tabcontent{padding:14px}
  #${ROOT_ID} .fixed-top{
    position:relative!important;display:block!important;height:auto!important;
    min-height:0!important;margin:0 0 12px!important;padding:12px 10px!important;
    overflow:visible!important;clear:both!important
  }
  #${ROOT_ID} .fixed-top .wrapper,
  #${ROOT_ID} form.enter,
  #${ROOT_ID} .non-fixed-input{
    position:static!important;display:block!important;width:100%!important;
    height:auto!important;min-height:0!important;margin:0!important;
    padding:0!important;overflow:visible!important;transform:none!important
  }
  #${ROOT_ID} form.enter input[type=text]{
    display:block!important;position:static!important;width:100%!important;
    max-width:none!important;height:42px!important;margin:0 0 10px!important
  }
  #${ROOT_ID} form.enter button{
    display:block!important;position:static!important;inset:auto!important;
    float:none!important;width:100%!important;min-width:0!important;
    height:42px!important;margin:0!important;transform:none!important
  }
  #${ROOT_ID} .tabs{padding:0 8px 9px!important}
  #${ROOT_ID} .tabs>.wrapper{gap:5px}
  #${ROOT_ID} .tabs .tab{flex:1 1 calc(50% - 5px);padding:11px 6px!important;font-size:9px!important}
  #${ROOT_ID} .rf-footer{padding:10px 13px}
}
`;
    document.head.appendChild(style);
  }

  function build() {
    if (document.getElementById(ROOT_ID)) return;

    var container = document.querySelector('.container.container-location');
    var formBar = document.querySelector('.fixed-top');
    var tabs = document.querySelector('.tabs');
    if (!container || !tabs) return;

    installStyles();

    var root = document.createElement('section');
    root.id = ROOT_ID;
    root.innerHTML =
      '<div class="rf-shell">' +
        '<header class="rf-banner">' +
          '<div class="rf-kicker">RESTRICTED AREA // PHOENIX PROJECT</div>' +
          '<div class="rf-banner-title">PHOENIX // FIELD OPERATIONS</div>' +
          '<div class="rf-banner-sub">Оперативный терминал доступа к материалам объекта</div>' +
          '<div class="rf-banner-meta">' +
            '<span class="rf-chip">РЕЖИМ: <strong>СЕКРЕТНО</strong></span>' +
            '<span class="rf-chip">КАНАЛ: <strong>ОПЕРАТИВНАЯ ГРУППА</strong></span>' +
            '<span class="rf-chip">ДОСТУП: <strong>ОГРАНИЧЕН</strong></span>' +
          '</div>' +
        '</header>' +
        '<div class="rf-content"></div>' +
        '<footer class="rf-footer"><span>PHOENIX SYSTEM // FIELD TERMINAL</span><span>INTERNAL USE ONLY</span></footer>' +
      '</div>';

    var content = root.querySelector('.rf-content');
    var anchor = formBar || container;
    anchor.parentNode.insertBefore(root, anchor);

    if (formBar) content.appendChild(formBar);
    content.appendChild(container);
    content.appendChild(tabs);

    var title = textOf(container.querySelector('h1 strong')) || 'СЕКТОР ОБЪЕКТА';
    var bannerTitle = root.querySelector('.rf-banner-title');
    bannerTitle.textContent = 'PHOENIX // ' + title;

    var codeCount = textOf(container.querySelector('.location-codes')) || 'ДАННЫЕ УРОВНЯ';
    var codeChip = document.createElement('span');
    codeChip.className = 'rf-chip';
    codeChip.textContent = codeCount.replace(/\s+/g, ' ').slice(0, 90);
    root.querySelector('.rf-banner-meta').appendChild(codeChip);

    window.RedFoxPhoenixTask = {
      version: VERSION,
      title: title,
      root: root
    };
  }

  ready(build);
})();