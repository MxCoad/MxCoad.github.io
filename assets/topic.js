/* GCSE topic revision pages — shared behaviour.
   A page defines window.TOPIC before loading this file:
     window.TOPIC = {
       key: 'gcse-1-2-progress',          // localStorage key
       questions: [ { id, marks, text, points: [...], guide, levels?: [[band, text], ...] } ]
     };
   and contains:
     <div id="topic-progress"></div>  <nav id="topic-toc"></nav>
     <section class="topic" id="...">  (one per revision section; gets an "I've revised this" button)
     <section class="topic no-progress" id="exam"> … <div id="questions"></div></section>
   Also exposes TopicKit.sorter() for "sort these into groups" activities. */
(function () {
  'use strict';
  var T = window.TOPIC || {};
  var KEY = T.key || 'gcse-topic-progress';
  var QUESTIONS = T.questions || [];

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  var state = load();
  state.done = state.done || {};
  state.answers = state.answers || {};
  state.marks = state.marks || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var sections = Array.prototype.slice.call(document.querySelectorAll('main section.topic'));
  var tracked = sections.filter(function (s) { return !s.classList.contains('no-progress'); });
  var SECTIONS = tracked.map(function (s) { return s.id; });
  var TOTAL = QUESTIONS.reduce(function (t, q) { return t + q.marks; }, 0);

  // ---------- Progress panel ----------
  var prog = document.getElementById('topic-progress');
  if (prog) {
    prog.className = 'progress';
    prog.setAttribute('aria-label', 'Your progress');
    prog.innerHTML =
      '<div><div class="meter-label">Sections revised <span id="sec-count"></span></div><div class="meter" aria-hidden="true"><div id="sec-meter"></div></div></div>' +
      (TOTAL ? '<div><div class="meter-label">Exam questions <span id="mark-count"></span></div><div class="meter" aria-hidden="true"><div id="mark-meter"></div></div></div>' : '') +
      '<p class="progress-note">Your progress and answers are saved in this browser only. <button type="button" class="linkbtn" id="reset-all">Clear my progress</button></p>';
  }

  // ---------- Contents ----------
  var toc = document.getElementById('topic-toc');
  if (toc) {
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Contents');
    toc.appendChild(el('h2', null, 'Contents'));
    var ol = el('ol');
    var n = 0;
    sections.forEach(function (s) {
      var h = s.querySelector('h2');
      var li = el('li');
      var a = el('a');
      a.href = '#' + s.id;
      if (!s.classList.contains('no-progress')) {
        n++;
        var t = el('span', 'tick', '✓');
        t.setAttribute('aria-hidden', 'true');
        t.setAttribute('data-tick', s.id);
        a.appendChild(t);
        a.appendChild(document.createTextNode(n + '. ' + (h ? h.textContent : s.id)));
      } else {
        a.appendChild(document.createTextNode(h ? h.textContent : s.id));
      }
      li.appendChild(a);
      ol.appendChild(li);
    });
    toc.appendChild(ol);
  }

  // ---------- "I've revised this" buttons ----------
  tracked.forEach(function (s) {
    var row = el('div', 'done-row');
    var b = el('button', 'done-btn');
    b.type = 'button';
    b.setAttribute('data-done', s.id);
    b.setAttribute('aria-pressed', 'false');
    var t = el('span', 'tick', '✓');
    t.setAttribute('aria-hidden', 'true');
    b.append(t, document.createTextNode("I've revised this section"));
    b.addEventListener('click', function () { state.done[s.id] = !state.done[s.id]; save(); updateProgress(); });
    row.appendChild(b);
    s.appendChild(row);
  });

  // ---------- Exam questions ----------
  function scoreOf(q) {
    var m = state.marks[q.id];
    if (!m) return 0;
    if (q.levels) return Math.min(q.marks, +m.level || 0);
    return Math.min(q.marks, (m.ticks || []).filter(Boolean).length);
  }
  var qbox = document.getElementById('questions');
  if (qbox) {
    QUESTIONS.forEach(function (q, i) {
      var div = el('div', 'q');
      var head = el('div', 'q-head');
      head.append(el('span', 'q-num', String(i + 1)), el('p', 'q-text', q.text), el('span', 'q-marks', '[' + q.marks + ' mark' + (q.marks > 1 ? 's' : '') + ']'));
      div.appendChild(head);
      if (q.code) { var pre = el('pre'); pre.appendChild(el('code', null, q.code)); div.appendChild(pre); }
      var lab = el('label', 'sr', 'Your answer to question ' + (i + 1));
      lab.htmlFor = q.id + '-a';
      var ta = el('textarea');
      ta.id = q.id + '-a';
      ta.placeholder = 'Write your answer here…';
      ta.value = state.answers[q.id] || '';
      ta.addEventListener('input', function () { state.answers[q.id] = ta.value; save(); });
      var btn = el('button', 'btn', 'Show mark scheme');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', q.id + '-ms');
      var ms = el('div', 'ms');
      ms.id = q.id + '-ms';
      ms.hidden = true;
      ms.appendChild(el('h4', null, 'Mark scheme — tick the points you made'));
      var pts = el('div', 'pts');
      var saved = state.marks[q.id] || {};
      q.points.forEach(function (p, j) {
        var l = el('label', 'pt');
        var cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!(saved.ticks && saved.ticks[j]);
        cb.addEventListener('change', record);
        l.append(cb, el('span', null, p));
        pts.appendChild(l);
      });
      ms.appendChild(pts);
      var sel = null;
      if (q.levels) {
        var dl = el('dl', 'levels');
        q.levels.forEach(function (lv) { dl.append(el('dt', null, lv[0]), el('dd', null, lv[1])); });
        ms.appendChild(dl);
        var sl = el('label', null, 'My mark: ');
        sel = el('select');
        sel.id = q.id + '-lvl';
        for (var k = 0; k <= q.marks; k++) { var o = el('option', null, String(k)); o.value = String(k); sel.appendChild(o); }
        if (saved.level != null) sel.value = String(saved.level);
        sel.addEventListener('change', record);
        sl.appendChild(sel);
        ms.appendChild(sl);
      }
      if (q.guide) ms.appendChild(el('p', 'guide', q.guide));
      var score = el('p', 'score-line');
      score.setAttribute('aria-live', 'polite');
      ms.appendChild(score);
      btn.addEventListener('click', function () {
        var open = ms.hidden;
        ms.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Hide mark scheme' : 'Show mark scheme';
      });
      div.append(lab, ta, btn, ms);
      qbox.appendChild(div);
      function record() {
        var entry = { ticks: Array.prototype.map.call(pts.querySelectorAll('input'), function (c) { return c.checked; }) };
        if (sel) entry.level = +sel.value;
        state.marks[q.id] = entry;
        save();
        showScore();
        updateProgress();
      }
      function showScore() { score.textContent = state.marks[q.id] ? 'You scored ' + scoreOf(q) + ' out of ' + q.marks + '.' : ''; }
      showScore();
    });
  }

  function updateProgress() {
    var n = SECTIONS.filter(function (s) { return state.done[s]; }).length;
    var sc = document.getElementById('sec-count');
    if (sc) {
      sc.textContent = n + ' of ' + SECTIONS.length;
      document.getElementById('sec-meter').style.width = (SECTIONS.length ? n / SECTIONS.length * 100 : 0) + '%';
    }
    var mc = document.getElementById('mark-count');
    if (mc) {
      var marks = QUESTIONS.reduce(function (t, q) { return t + scoreOf(q); }, 0);
      mc.textContent = marks + ' of ' + TOTAL + ' marks';
      document.getElementById('mark-meter').style.width = (marks / TOTAL * 100) + '%';
    }
    SECTIONS.forEach(function (s) {
      var on = !!state.done[s];
      document.querySelectorAll('[data-tick="' + s + '"]').forEach(function (t) { t.classList.toggle('on', on); });
      var b = document.querySelector('[data-done="' + s + '"]');
      if (b) { b.setAttribute('aria-pressed', String(on)); b.querySelector('.tick').classList.toggle('on', on); }
    });
  }
  updateProgress();

  var reset = document.getElementById('reset-all');
  if (reset) reset.addEventListener('click', function () {
    if (!confirm('Clear your ticks, answers and marks for this topic?')) return;
    state = { done: {}, answers: {}, marks: {} };
    save();
    location.reload();
  });

  // ---------- Shared activity: sort items into groups ----------
  // TopicKit.sorter(container, ['Group A', 'Group B'], [{ text, answer: 'Group A', why }])
  window.TopicKit = {
    sorter: function (container, groups, items) {
      var scoreP = el('p', 'explain');
      scoreP.setAttribute('aria-live', 'polite');
      var right = 0, answered = 0;
      function updateScore() { scoreP.textContent = answered ? right + ' of ' + answered + ' right first time' + (answered === items.length ? ' — all done!' : '') : 'Choose an answer for each one.'; }
      items.forEach(function (it, i) {
        var row = el('div', 'sorter-item');
        var txt = el('span', 'sorter-text', it.text);
        txt.id = container.id + '-i' + i;
        var opts = el('div', 'sorter-opts');
        opts.setAttribute('role', 'group');
        opts.setAttribute('aria-labelledby', txt.id);
        var why = el('p', 'sorter-why');
        why.hidden = true;
        var first = true;
        groups.forEach(function (g) {
          var b = el('button', null, g);
          b.type = 'button';
          b.addEventListener('click', function () {
            var ok = g === it.answer;
            opts.querySelectorAll('button').forEach(function (x) { x.classList.remove('right', 'wrong'); });
            b.classList.add(ok ? 'right' : 'wrong');
            why.hidden = false;
            why.textContent = (ok ? '✓ Correct. ' : '✗ Not quite — try again. ') + (ok && it.why ? it.why : '');
            if (first) { first = false; answered++; if (ok) right++; updateScore(); }
          });
          opts.appendChild(b);
        });
        row.append(txt, opts, why);
        container.appendChild(row);
      });
      updateScore();
      container.appendChild(scoreP);
    }
  };
})();
