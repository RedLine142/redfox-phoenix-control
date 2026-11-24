(function () {
  'use strict';
  var VERSION = '0.6.0';
  var ROOT_ID = 'rf-phoenix-control';
  var STYLE_ID = 'rf-phoenix-control-style';

  if (window.RedFoxPhoenixControl && window.RedFoxPhoenixControl.version === VERSION) return;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function clean(node) {
    return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function readTask(item, index) {
    var link = item.querySelector('a[href]');
    var raw = clean(item);
    var match = raw.match(/(\d+)\s*\/\s*(\d+)/);
    var found = match ? Number(match[1]) : 0;
    var total = match ? Number(match[2]) : 0;
    var title = clean(item.querySelector('strong')) || ('Сектор ' + (index + 1));
    var href = link ? link.getAttribute('href') : '#';
    return {
      index: index,
      title: title,
      href: href,
      found: found,
      total: total,
      percent: total ? Math.max(0, Math.min(100, found / total * 100)) : 0,
      done: total > 0 && found >= total
    };
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `#${ROOT_ID}{--bg:#080d0b;--panel:#111a16;--line:#304136;--text:#e5eee6;--muted:#91a294;--green:#a7c18c;--red:#e34b45;color:var(--text);font-family:Arial,Helvetica,sans-serif;max-width:1240px;margin:0 auto;padding:14px;box-sizing:border-box}
#${ROOT_ID} *{box-sizing:border-box}
#${ROOT_ID} .shell{background:radial-gradient(ellipse at 50% -20%,#26392c,#101a14 48%,#080d0b 100%);border:1px solid #314237;border-radius:14px;overflow:hidden;box-shadow:0 18px 55px rgba(0,0,0,.38)}
#${ROOT_ID} .top{padding:20px 22px 16px;background:linear-gradient(110deg,#18271d,#0a110d);border-bottom:1px solid var(--line);position:relative}
#${ROOT_ID} .top:after{content:"";position:absolute;right:22px;top:20px;width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 12px var(--red);animation:rfPulse 1.8s infinite}
#${ROOT_ID} .kicker{font-size:10px;letter-spacing:3px;color:#a2b5a4;text-transform:uppercase}
#${ROOT_ID} .title{font-size:clamp(23px,4vw,38px);font-weight:800;letter-spacing:2px;margin:7px 0 4px;color:#edf4ec}
#${ROOT_ID} .subtitle{font-size:11px;letter-spacing:1.8px;color:#8ea392;text-transform:uppercase}
#${ROOT_ID} .meta{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}
#${ROOT_ID} .chip{border:1px solid #34483a;background:rgba(8,15,10,.55);padding:7px 10px;border-radius:4px;font-size:10px;letter-spacing:1px;color:#b8c9b8;text-transform:uppercase}
#${ROOT_ID} .chip strong{color:#edf4ec}
#${ROOT_ID} .timer{margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;border:1px solid #4a3b2b;background:linear-gradient(90deg,rgba(65,43,25,.38),rgba(16,24,18,.7));border-radius:6px}
#${ROOT_ID} .timer-label{font-size:10px;letter-spacing:1.7px;color:#d0b88d;text-transform:uppercase}
#${ROOT_ID} .time-left{font-size:clamp(22px,4vw,31px);font-weight:800;letter-spacing:2px;color:#f1d49a;font-variant-numeric:tabular-nums}
#${ROOT_ID} .clock{font-size:11px;color:#91a393;font-variant-numeric:tabular-nums}
#${ROOT_ID} .body{padding:18px}
#${ROOT_ID} .section-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px}
#${ROOT_ID} .section-title{font-size:12px;font-weight:800;letter-spacing:2px;color:#dce8dc;text-transform:uppercase}
#${ROOT_ID} .section-note{font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase}
#${ROOT_ID} .map{border:1px solid #34483a;border-radius:8px;padding:18px;background:linear-gradient(rgba(8,15,11,.88),rgba(8,15,11,.94)),repeating-linear-gradient(0deg,transparent 0 24px,rgba(120,155,120,.08) 25px),repeating-linear-gradient(90deg,transparent 0 24px,rgba(120,155,120,.08) 25px);overflow:hidden}
#${ROOT_ID} .map-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
#${ROOT_ID} .node{min-height:92px;display:flex;flex-direction:column;justify-content:space-between;text-decoration:none!important;color:var(--text)!important;padding:11px 9px;border:1px solid #405344;background:linear-gradient(145deg,#1a2a20,#101a14);border-radius:5px;transition:.18s;min-width:0}
#${ROOT_ID} .node:hover{transform:translateY(-2px);border-color:#a3bd8b;background:#203526}
#${ROOT_ID} .node.done{border-color:#718f66;background:linear-gradient(145deg,#263b27,#142218)}
#${ROOT_ID} .node-id{font-size:10px;color:#a5b99d;letter-spacing:2px}
#${ROOT_ID} .node-name{font-size:11px;font-weight:800;line-height:1.25;text-transform:uppercase;overflow-wrap:anywhere;margin:7px 0}
#${ROOT_ID} .node-foot{display:flex;justify-content:space-between;gap:5px;font-size:10px;color:#aab9aa;font-variant-numeric:tabular-nums}
#${ROOT_ID} .bar{height:3px;background:#344439;border-radius:5px;overflow:hidden;margin-top:7px}
#${ROOT_ID} .bar span{display:block;height:100%;background:#9bb77f}
#${ROOT_ID} .caption{display:flex;justify-content:space-between;gap:10px;margin-top:14px;color:#819486;font-size:9px;letter-spacing:1.5px;text-transform:uppercase}
#${ROOT_ID} .list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:18px}
#${ROOT_ID} .task{display:flex;align-items:center;gap:12px;min-width:0;padding:12px;border:1px solid #29392e;background:rgba(18,29,22,.88);border-radius:5px;text-decoration:none!important;color:var(--text)!important}
#${ROOT_ID} .task:hover{border-color:#839c70;background:#1b2b20}
#${ROOT_ID} .num{flex:0 0 30px;height:30px;display:grid;place-items:center;border:1px solid #405342;color:#a9bf9e;font-size:10px;font-weight:800}
#${ROOT_ID} .task-main{min-width:0;flex:1}
#${ROOT_ID} .task-name{font-size:11px;font-weight:800;text-transform:uppercase;line-height:1.35;overflow-wrap:anywhere}
#${ROOT_ID} .task-meta{display:flex;align-items:center;gap:8px;margin-top:7px;font-size:10px;color:#9aab9c}
#${ROOT_ID} .task-bar{height:3px;background:#344439;border-radius:5px;overflow:hidden;flex:1;max-width:130px}
#${ROOT_ID} .task-bar span{display:block;height:100%;background:#9bb77f}
#${ROOT_ID} .status{font-size:9px;letter-spacing:1px;color:#a6b89e;text-transform:uppercase;white-space:nowrap}
#${ROOT_ID} .status.done{color:#c0d9a7}
#${ROOT_ID} .footer{padding:12px 18px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#718477;font-size:9px;letter-spacing:1.5px;text-transform:uppercase}
@keyframes rfPulse{0%,100%{opacity:1;box-shadow:0 0 5px var(--red)}50%{opacity:.45;box-shadow:0 0 16px var(--red)}}
@media(max-width:760px){#${ROOT_ID}{padding:8px}#${ROOT_ID} .body{padding:12px}#${ROOT_ID} .map-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#${ROOT_ID} .node{min-height:82px}#${ROOT_ID} .list{grid-template-columns:1fr}#${ROOT_ID} .timer{align-items:flex-start;flex-direction:column}}
`;
    style.textContent += `
#${ROOT_ID} .map{position:relative;padding:0;background:#070b09;overflow:visible;line-height:0}
#${ROOT_ID} .map-image{display:block;width:100%;height:auto;border-radius:7px}
#${ROOT_ID} .map-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#${ROOT_ID} .map-grid{display:none!important}
#${ROOT_ID} .sector-hit{cursor:pointer;outline:none}
#${ROOT_ID} .sector-hit polygon{fill:rgba(255,255,255,0);stroke:var(--sector);stroke-width:3;stroke-opacity:.10;vector-effect:non-scaling-stroke;transition:fill .16s,stroke-opacity .16s,stroke-width .16s;pointer-events:all}
#${ROOT_ID} .sector-hit:hover polygon,#${ROOT_ID} .sector-hit:focus polygon{fill:var(--sector-fill);stroke-opacity:1;stroke-width:5;filter:drop-shadow(0 0 7px var(--sector))}
#${ROOT_ID} .sector-hit:focus-visible polygon{stroke-width:7}
#${ROOT_ID} .map-tooltip{position:absolute;z-index:5;display:none;width:190px;max-width:calc(100% - 16px);padding:9px 11px;background:rgba(7,13,10,.72);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border:1px solid var(--tip-color,#91b77b);border-radius:5px;box-shadow:0 7px 20px rgba(0,0,0,.42);color:#eaf2e8;line-height:1.3;pointer-events:none;transform:none}
#${ROOT_ID} .map-tooltip.show{display:block}
#${ROOT_ID} .map-tooltip{transform:none;max-width:calc(100% - 16px)}

#${ROOT_ID} .tip-title{font-size:11px;font-weight:800;letter-spacing:.45px;text-transform:uppercase;margin-bottom:6px;line-height:1.25}
#${ROOT_ID} .tip-stats{display:flex;justify-content:space-between;gap:8px;font-size:10px;color:#d2ded3}
#${ROOT_ID} .tip-bar{height:3px;background:rgba(90,110,95,.55);margin-top:6px;border-radius:4px;overflow:hidden}
#${ROOT_ID} .tip-bar span{display:block;height:100%;background:var(--tip-color,#a7c18c)}

#${ROOT_ID} .list{display:none!important}
@media(max-width:760px){#${ROOT_ID} .map-tooltip{width:min(220px,calc(100% - 12px));padding:10px}}
`;
    document.head.appendChild(style);
  }

  function makeNode(task) {
    var a = document.createElement('a');
    a.className = 'node' + (task.done ? ' done' : '');
    a.href = task.href;
    a.innerHTML = '<span class="node-id"></span><span class="node-name"></span><span><span class="node-foot"><span class="node-count"></span><span class="node-state"></span></span><span class="bar"><span></span></span></span>';
    a.querySelector('.node-id').textContent = 'SECTOR ' + String(task.index + 1).padStart(2, '0');
    a.querySelector('.node-name').textContent = task.title;
    a.querySelector('.node-count').textContent = task.found + ' / ' + task.total;
    a.querySelector('.node-state').textContent = task.done ? 'COMPLETE' : task.found ? 'ACTIVE' : 'STANDBY';
    a.querySelector('.bar span').style.width = task.percent + '%';
    return a;
  }

  function makeListItem(task) {
    var a = document.createElement('a');
    a.className = 'task';
    a.href = task.href;
    a.innerHTML = '<span class="num"></span><span class="task-main"><span class="task-name"></span><span class="task-meta"><span class="task-count"></span><span class="task-bar"><span></span></span></span></span><span class="status"></span>';
    a.querySelector('.num').textContent = String(task.index + 1).padStart(2, '0');
    a.querySelector('.task-name').textContent = task.title;
    a.querySelector('.task-count').textContent = task.found + '/' + task.total;
    a.querySelector('.task-bar span').style.width = task.percent + '%';
    var status = a.querySelector('.status');
    status.textContent = task.done ? 'ГОТОВО' : task.found ? 'В РАБОТЕ' : 'НЕ НАЧАТО';
    if (task.done) status.classList.add('done');
    return a;
  }

  function build() {
    if (document.getElementById(ROOT_ID)) return;
    var container = document.querySelector('.container');
    if (!container) return;
    var originalItems = Array.prototype.slice.call(container.querySelectorAll(':scope > .item'));
    if (!originalItems.length) return;

    var team = clean(container.querySelector('.team_name')).replace(/^Команда:\s*/i, '');
    var gameTitle = clean(container.querySelector('h1')) || 'ОБЪЕКТ ФЕНИКС';
    var sectorOrder = [
      'ВНЕШНИЙ ПЕРИМЕТР',
      'АДМИНИСТРАТИВНЫЙ СЕКТОР',
      'НАУЧНЫЙ СЕКТОР',
      'ТЕХНИЧЕСКИЙ СЕКТОР',
      'ЗОНА КАТАСТРОФЫ',
      'СЕКРЕТНЫЙ УРОВЕНЬ',
      'ФИНАЛ'
    ];
    var tasks = originalItems.map(readTask);
    tasks.sort(function (a, b) {
      var ai = sectorOrder.indexOf(a.title.toLocaleUpperCase('ru-RU'));
      var bi = sectorOrder.indexOf(b.title.toLocaleUpperCase('ru-RU'));
      if (ai < 0) ai = sectorOrder.length + a.index;
      if (bi < 0) bi = sectorOrder.length + b.index;
      return ai - bi;
    });
    tasks.forEach(function (task, index) { task.index = index; });
    var doneCount = tasks.filter(function (t) { return t.done; }).length;
    var foundCount = tasks.reduce(function (sum, t) { return sum + t.found; }, 0);
    var codeCount = tasks.reduce(function (sum, t) { return sum + t.total; }, 0);

    installStyles();
    var root = document.createElement('section');
    root.id = ROOT_ID;
    root.innerHTML = '<div class="shell"><header class="top"><div class="kicker">RESTRICTED AREA // PHOENIX PROJECT</div><div class="title">PHOENIX // CONTROL</div><div class="subtitle">Центр оперативного управления секретным объектом</div><div class="meta"><span class="chip">ОПЕРАЦИЯ: <strong class="game"></strong></span><span class="chip">ГРУППА: <strong class="team"></strong></span><span class="chip">СЕКТОРОВ: <strong class="total"></strong></span></div><div class="timer"><div><div class="timer-label">Время до завершения операции</div><div class="time-left" id="rf-time-left">ЗАГРУЗКА...</div></div><div class="clock">ЛОКАЛЬНОЕ ВРЕМЯ <span id="rf-clock">--:--:--</span></div></div></header><main class="body"><div class="section-head"><div class="section-title">Схема комплекса</div><div class="section-note">Выберите сектор для входа</div></div><div class="map"><img class="map-image" src="https://kemerovo.redfoxkrsk.ru/static/up/images/9a2a9922-885d-4b5e-9553-3b08d8aae779.png" alt="Тактическая схема комплекса ФЕНИКС"><svg class="map-svg" viewBox="0 0 1672 941" preserveAspectRatio="none" role="group" aria-label="Интерактивная карта секторов"><g class="sector-layer"></g></svg><div class="map-tooltip" role="status"><div class="tip-title"></div><div class="tip-stats"><span>ПРОГРЕСС</span><strong class="tip-percent"></strong></div><div class="tip-bar"><span></span></div></div></div><div class="caption"><span>PHOENIX FACILITY // FLOOR PLAN</span><span class="map-count"></span></div></main><footer class="footer"><span>PHOENIX SYSTEM // INTERNAL USE ONLY</span><span class="summary"></span></footer></div>';

    root.querySelector('.game').textContent = gameTitle;
    root.querySelector('.team').textContent = team || 'ОПЕРАТИВНАЯ ГРУППА';
    root.querySelector('.total').textContent = tasks.length;
    root.querySelector('.map-count').textContent = tasks.length + ' ЗОН';
    root.querySelector('.summary').textContent = doneCount + '/' + tasks.length + ' СЕКТОРОВ ЗАВЕРШЕНО • ' + foundCount + '/' + codeCount + ' КОДОВ';

    var layer = root.querySelector('.sector-layer');
    var tooltip = root.querySelector('.map-tooltip');
    var tipTitle = tooltip.querySelector('.tip-title');
    var tipPercent = tooltip.querySelector('.tip-percent');
    var tipBar = tooltip.querySelector('.tip-bar span');
    var mapBox = root.querySelector('.map');
    var shapes = [
      {color:'#ff3434',fill:'rgba(255,45,45,.28)',points:'92,205 124,170 214,126 269,181 272,319 329,365 329,653 258,711 192,685 128,622 112,500 92,468 92,264'},
      {color:'#ffb52e',fill:'rgba(255,181,46,.25)',points:'273,154 331,119 680,116 704,151 702,286 667,321 602,321 564,365 334,365 274,320 271,185'},
      {color:'#35c9ff',fill:'rgba(53,201,255,.24)',points:'816,118 1197,118 1265,155 1323,195 1323,324 1284,345 907,345 815,270'},
      {color:'#b5ef36',fill:'rgba(181,239,54,.23)',points:'412,414 560,414 613,445 696,482 700,676 676,713 322,713 283,671 283,518 330,464 412,454'},
      {color:'#ff3434',fill:'rgba(255,45,45,.28)',points:'908,425 1094,425 1198,483 1198,583 1145,610 1072,610 1000,713 835,713 790,672 790,516'},
      {color:'#c56bff',fill:'rgba(197,107,255,.25)',points:'1007,645 1060,644 1091,615 1256,615 1314,647 1375,673 1375,792 1324,816 1035,816 1000,781 1000,670'},
      {color:'#ffb52e',fill:'rgba(255,181,46,.25)',points:'1375,495 1428,464 1528,464 1584,516 1584,681 1538,729 1420,729 1364,681 1364,545'}
    ];
    function showTip(task, shape, anchor, bounds) {
      tipTitle.textContent = task.title;
      tipPercent.textContent = Math.round(task.percent) + '%';
      tipBar.style.width = task.percent + '%';
      tooltip.style.setProperty('--tip-color', shape.color);
      tooltip.classList.add('show');
      tooltip.style.left = '0px';
      tooltip.style.top = '0px';

      var mapRect = mapBox.getBoundingClientRect();
      var tipRect = tooltip.getBoundingClientRect();
      var scaleX = mapRect.width / 1672;
      var scaleY = mapRect.height / 941;
      var leftEdge = bounds.minX * scaleX;
      var rightEdge = bounds.maxX * scaleX;
      var anchorY = anchor.y * scaleY;
      var gap = 12;
      var margin = 8;

      var left;
      if (mapRect.width - rightEdge >= tipRect.width + gap + margin) {
        left = rightEdge + gap;
      } else if (leftEdge >= tipRect.width + gap + margin) {
        left = leftEdge - tipRect.width - gap;
      } else {
        left = Math.max(margin, Math.min(mapRect.width - tipRect.width - margin, anchor.x * scaleX - tipRect.width / 2));
      }

      var top = anchorY - tipRect.height / 2;
      top = Math.max(margin, Math.min(mapRect.height - tipRect.height - margin, top));

      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      tooltip.style.transform = 'none';
    }
    function hideTip() { tooltip.classList.remove('show'); }
    tasks.forEach(function (task, index) {
      var shape = shapes[index];
      if (!shape) return;
      var ns = 'http://www.w3.org/2000/svg';
      var link = document.createElementNS(ns, 'a');
      link.setAttribute('class', 'sector-hit');
      link.setAttribute('href', task.href);
      link.setAttribute('aria-label', task.title + '. Прогресс ' + task.found + ' из ' + task.total + '. Нажмите для входа.');
      link.style.setProperty('--sector', shape.color);
      link.style.setProperty('--sector-fill', shape.fill);
      var polygon = document.createElementNS(ns, 'polygon');
      polygon.setAttribute('points', shape.points);
      link.appendChild(polygon);
      var coords = shape.points.split(' ').map(function (pair) { return pair.split(',').map(Number); });
      var bounds = coords.reduce(function (box, p) {
        box.minX = Math.min(box.minX, p[0]);
        box.maxX = Math.max(box.maxX, p[0]);
        box.minY = Math.min(box.minY, p[1]);
        box.maxY = Math.max(box.maxY, p[1]);
        return box;
      }, {minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});
      var anchor = {
        x: (bounds.minX + bounds.maxX) / 2,
        y: (bounds.minY + bounds.maxY) / 2
      };
      link.addEventListener('mouseenter', function () { showTip(task, shape, anchor, bounds); });
      link.addEventListener('focus', function () { showTip(task, shape, anchor, bounds); });
      link.addEventListener('mouseleave', hideTip);
      link.addEventListener('blur', hideTip);
      link.addEventListener('touchstart', function () { showTip(task, shape, anchor, bounds); }, {passive:true});
      layer.appendChild(link);
    });

    container.parentNode.insertBefore(root, container);
    container.style.display = 'none';

    var timerBlock = document.querySelector('.time');
    if (timerBlock) {
      var timeLeft = timerBlock.querySelector('#time_left');
      var clock = timerBlock.querySelector('#timer');
      if (timeLeft) {
        var timeTarget = root.querySelector('#rf-time-left');
        timeTarget.textContent = clean(timeLeft) || '—';
        new MutationObserver(function () { timeTarget.textContent = clean(timeLeft) || '—'; }).observe(timeLeft, { childList: true, characterData: true, subtree: true });
      }
      if (clock) {
        var clockTarget = root.querySelector('#rf-clock');
        clockTarget.textContent = clean(clock) || '--:--:--';
        new MutationObserver(function () { clockTarget.textContent = clean(clock) || '--:--:--'; }).observe(clock, { childList: true, characterData: true, subtree: true });
      }
      timerBlock.style.display = 'none';
    }
    var locations = document.querySelector('.locations');
    if (locations) locations.style.display = 'none';

    window.RedFoxPhoenixControl = { version: VERSION, tasks: tasks };
  }

  ready(build);
})();