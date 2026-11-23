(function () {
  'use strict';

  var VERSION = '1.0.0';
  var ROOT_ID = 'rf-phoenix-recovery-terminal';
  var STYLE_ID = 'rf-phoenix-recovery-style';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{--bg:#09110d;--panel:#111d16;--line:#3b5141;--text:#e4eee4;--muted:#9aab9b;--green:#a9c78e;--red:#e05b50;max-width:760px;margin:24px auto;padding:18px;border:1px solid #405846;border-radius:9px;background:linear-gradient(145deg,#14231a,#080e0b);color:var(--text);font:14px/1.5 Arial,Helvetica,sans-serif;box-sizing:border-box;box-shadow:0 12px 35px rgba(0,0,0,.28)}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} .rf-rt-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding-bottom:13px;border-bottom:1px solid var(--line)}
      #${ROOT_ID} .rf-rt-label{font-size:10px;letter-spacing:2px;color:#a9c78e;text-transform:uppercase}
      #${ROOT_ID} .rf-rt-status{font-size:10px;letter-spacing:1px;color:#e4bd78;text-align:right}
      #${ROOT_ID} h3{margin:12px 0 5px;font-size:18px;letter-spacing:1px;color:#f0f5ed}
      #${ROOT_ID} .rf-rt-intro{margin:0 0 16px;color:#aebdaf;font-size:13px}
      #${ROOT_ID} .rf-rt-list{display:grid;gap:9px}
      #${ROOT_ID} .rf-rt-row{display:grid;grid-template-columns:42px 1fr 38px 38px;gap:9px;align-items:center;padding:10px;border:1px solid #354a3a;border-radius:5px;background:rgba(5,12,8,.7)}
      #${ROOT_ID} .rf-rt-index{display:grid;place-items:center;width:30px;height:30px;border:1px solid #405846;border-radius:4px;color:#a9c78e;font-weight:bold;font-size:12px}
      #${ROOT_ID} .rf-rt-event{min-width:0}
      #${ROOT_ID} .rf-rt-time{display:block;color:#edf4e9;font-size:17px;font-weight:800;letter-spacing:1px}
      #${ROOT_ID} .rf-rt-desc{display:block;color:#9eaf9f;font-size:12px}
      #${ROOT_ID} button{border:1px solid #506a53;border-radius:4px;background:#1b2d20;color:#eaf2e7;min-height:36px;font-size:17px;cursor:pointer}
      #${ROOT_ID} button:disabled{opacity:.28;cursor:default}
      #${ROOT_ID} .rf-rt-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}
      #${ROOT_ID} .rf-rt-check{padding:11px 18px;background:linear-gradient(#3c593d,#263d2b);border-color:#78966d;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase}
      #${ROOT_ID} .rf-rt-reset{padding:11px 14px;font-size:11px;letter-spacing:1px;text-transform:uppercase}
      #${ROOT_ID} .rf-rt-message{min-height:22px;margin:13px 0 0;color:#e2bd79;font-size:12px}
      #${ROOT_ID} .rf-rt-result{display:none;margin-top:14px;padding:14px;border:1px solid #78966d;border-radius:5px;background:#14251a}
      #${ROOT_ID} .rf-rt-result.is-visible{display:block;animation:rfRtReveal .45s ease both}
      #${ROOT_ID} .rf-rt-result strong{display:block;color:#b8d99c;font-size:11px;letter-spacing:1.5px}
      #${ROOT_ID} .rf-rt-code{display:block;margin-top:7px;color:#f1f7ed;font-size:clamp(22px,5vw,31px);font-weight:900;letter-spacing:3px;overflow-wrap:anywhere}
      #${ROOT_ID} .rf-rt-note{margin:7px 0 0;color:#a8b9a8;font-size:11px}
      #${ROOT_ID} .rf-rt-row.is-locked{opacity:.55}
      @keyframes rfRtReveal{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:520px){#${ROOT_ID}{margin:18px 0;padding:13px}#${ROOT_ID} .rf-rt-row{grid-template-columns:32px minmax(0,1fr) 34px 34px;gap:6px;padding:8px}#${ROOT_ID} .rf-rt-time{font-size:16px}#${ROOT_ID} .rf-rt-desc{font-size:11px}#${ROOT_ID} .rf-rt-index{width:27px;height:27px}#${ROOT_ID} button{min-height:35px}}
    `;
    document.head.appendChild(style);
  }

  function findSpoiler() {
    return document.querySelector('.spoiler');
  }

  function init() {
    if (document.getElementById(ROOT_ID)) return;
    var spoiler = findSpoiler();
    if (!spoiler) return;

    addStyles();

    var root = document.createElement('section');
    root.id = ROOT_ID;
    root.setAttribute('aria-label', 'Терминал восстановления контрольного поста');
    root.innerHTML =
      '<div class="rf-rt-head"><span class="rf-rt-label">PHOENIX // CONTROL POST</span><span class="rf-rt-status" data-status>СИСТЕМА ОЖИДАЕТ ВВОДА</span></div>' +
      '<h3>ВОССТАНОВЛЕНИЕ ЖУРНАЛА СОБЫТИЙ</h3>' +
      '<p class="rf-rt-intro">Записи повреждены и отображаются не по порядку. Восстановите хронологию: перемещайте события кнопками вверх и вниз.</p>' +
      '<div class="rf-rt-list" data-list></div>' +
      '<div class="rf-rt-actions"><button type="button" class="rf-rt-check" data-check>Проверить последовательность</button><button type="button" class="rf-rt-reset" data-reset>Сбросить</button></div>' +
      '<p class="rf-rt-message" data-message aria-live="polite">Ожидание последовательности событий…</p>' +
      '<div class="rf-rt-result" data-result><strong>КОНТРОЛЬНЫЙ ПОСТ ВОССТАНОВЛЕН</strong><span class="rf-rt-code">020302110217</span><p class="rf-rt-note">Код перенесён в поле отправки задания. Нажмите штатную кнопку «Отправить».</p></div>';

    var list = root.querySelector('[data-list]');
    var message = root.querySelector('[data-message]');
    var status = root.querySelector('[data-status]');
    var result = root.querySelector('[data-result]');
    var check = root.querySelector('[data-check]');
    var reset = root.querySelector('[data-reset]');
    var initial = [
      { id: 'lost', time: '02:17', desc: 'Полная потеря связи с объектом' },
      { id: 'cameras', time: '02:03', desc: 'Отключение камер наружного наблюдения' },
      { id: 'engineer', time: '02:11', desc: 'Сообщение инженера о нештатной активности' }
    ];
    var events = initial.slice();
    var solved = false;

    function render() {
      list.innerHTML = '';
      events.forEach(function (event, index) {
        var row = document.createElement('div');
        row.className = 'rf-rt-row' + (solved ? ' is-locked' : '');
        row.innerHTML =
          '<span class="rf-rt-index">' + String(index + 1).padStart(2, '0') + '</span>' +
          '<span class="rf-rt-event"><strong class="rf-rt-time"></strong><span class="rf-rt-desc"></span></span>' +
          '<button type="button" data-up aria-label="Переместить вверх">↑</button>' +
          '<button type="button" data-down aria-label="Переместить вниз">↓</button>';
        row.querySelector('.rf-rt-time').textContent = event.time;
        row.querySelector('.rf-rt-desc').textContent = event.desc;
        var up = row.querySelector('[data-up]');
        var down = row.querySelector('[data-down]');
        up.disabled = solved || index === 0;
        down.disabled = solved || index === events.length - 1;
        up.addEventListener('click', function () { move(index, -1); });
        down.addEventListener('click', function () { move(index, 1); });
        list.appendChild(row);
      });
    }

    function move(index, delta) {
      if (solved) return;
      var target = index + delta;
      if (target < 0 || target >= events.length) return;
      var temp = events[index];
      events[index] = events[target];
      events[target] = temp;
      message.textContent = 'Порядок изменён. Продолжайте восстановление журнала.';
      render();
    }

    function resetTerminal() {
      solved = false;
      events = initial.slice();
      result.classList.remove('is-visible');
      status.textContent = 'СИСТЕМА ОЖИДАЕТ ВВОДА';
      status.style.color = '#e2bd79';
      message.textContent = 'Последовательность сброшена. Попробуйте снова.';
      check.disabled = false;
      render();
    }

    check.addEventListener('click', function () {
      if (solved) return;
      var correct = events.map(function (event) { return event.id; }).join(',');
      if (correct !== 'cameras,engineer,lost') {
        status.textContent = 'ОШИБКА ХРОНОЛОГИИ';
        status.style.color = '#e05b50';
        message.textContent = 'Последовательность неверна. Проверьте временные отметки и попробуйте ещё раз.';
        return;
      }

      solved = true;
      status.textContent = 'СИСТЕМА ВОССТАНОВЛЕНА';
      status.style.color = '#b8d99c';
      message.textContent = 'Хронология подтверждена. Формируется код контрольного поста…';
      render();

      window.setTimeout(function () {
        result.classList.add('is-visible');
        var input = document.querySelector('form.enter input[name="code"]');
        if (input) {
          input.value = '020302110217';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          message.textContent = 'Код перенесён в штатную форму. Отправьте его для завершения этапа.';
        } else {
          message.textContent = 'Код восстановлен. Введите его вручную в поле отправки задания.';
        }
        check.disabled = true;
      }, 850);
    });

    reset.addEventListener('click', resetTerminal);
    spoiler.appendChild(root);
    render();
  }

  ready(init);
})();