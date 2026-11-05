(function () {
  var $ = function (id) { return document.getElementById(id); };
  var lang = (function () {
    try { return localStorage.getItem('lang') || 'bn'; } catch (e) { return 'bn'; }
  })(), last = null, busy = false, expBtns = [], exBtns = [];
  var EX = [
    'অভিনন্দন! আপনি ৫,০০০ টাকা বোনাস জিতেছেন। বোনাস পেতে এখনই আপনার বিকাশ পিন ও OTP কোড আমাদের জানান, নয়তো ২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট বন্ধ হয়ে যাবে।',
    'Dear Customer, never share your OTP, PIN or CVV with anyone, including bank staff. Beware of fake cashback links and unknown loan apps.',
    'Congratulations! Your BDT 50,000 loan is approved. Pay a BDT 2,500 processing fee to release it today: bkash 01712345678.'
  ];
  var T = {
    bn: {
      title: 'স্ক্যাম মেসেজ এক্সপ্লেইনার', tag: 'সন্দেহজনক মেসেজ পেস্ট করুন। বুঝুন কেন ঝুঁকিপূর্ণ এবং এখন কী করবেন।',
      lbl: 'সন্দেহজনক মেসেজ', ph: 'এখানে মেসেজটি পেস্ট করুন…', check: 'যাচাই করুন', ex: 'উদাহরণ:',
      exl: ['বোনাস ও OTP', 'আসল সতর্কবার্তা', 'লোনের ফি'], busy: 'বিশ্লেষণ চলছে…',
      v: { strong_warning: '▲ শক্ত সতর্কতা', some_warning: '● কিছু সতর্কতা', cannot_tell: '? লেখা দেখে বোঝা যাচ্ছে না' },
      sum: {
        strong_warning: 'এই মেসেজে গুরুতর প্রতারণার লক্ষণ আছে। কিছু করার আগে নিজে অফিশিয়াল অ্যাপ বা কার্ডের পেছনের নম্বর দিয়ে যাচাই করুন।',
        some_warning: 'কিছু সতর্কতার লক্ষণ আছে। মেসেজের লিংক বা নম্বরে নয়, নিজে অফিশিয়াল চ্যানেলে যাচাই করুন।',
        cannot_tell: 'শুধু লেখা দেখে বলা যাচ্ছে না। আসল ব্যাংকও সতর্কবার্তা পাঠায়। কিছু করার আগে অফিশিয়াল অ্যাপে যাচাই করুন।'
      },
      why: 'কেন সতর্কতা?', noWhy: 'স্পষ্ট কোনো সতর্কতার লক্ষণ পাওয়া যায়নি, কিন্তু এর মানে এটি নিরাপদ নয়, এমনও নয়—প্রেরক যাচাই করা যায়নি।',
      warnNote: 'মেসেজটি একটি নিরাপত্তা-সতর্কবার্তার মতো দেখাচ্ছে। তবে লেখা দেখে প্রেরক আসল কি না বলা যায় না।',
      now: 'এখনই করুন: কোড, পিন বা টাকা দেবেন না। লিংক খুলবেন না। নিজে অফিশিয়াল অ্যাপ খুলে যাচাই করুন।',
      nowC: 'এখনই করুন: মেসেজের লিংক বা নম্বর ব্যবহার না করে অফিশিয়াল অ্যাপ বা কার্ডের পেছনের নম্বরে যাচাই করুন।',
      banner: 'এই টুল প্রেরককে যাচাই করতে পারে না এবং কখনো “নিরাপদ” বলে না।',
      acted: 'আগেই কিছু করে ফেলেছেন?',
      expl: ['শুধু লিংকে ক্লিক করেছি', 'তথ্য/পাসওয়ার্ড দিয়েছি', 'OTP/পিন বলেছি', 'অ্যাপ ইনস্টল করেছি', 'টাকা পাঠিয়েছি'],
      steps: [
        'পেজ বন্ধ করুন। কিছু লিখবেন না, কিছু ডাউনলোড বা ইনস্টল করবেন না। কিছু ডাউনলোড হয়েছে কি না নিশ্চিত না হলে বিশ্বস্ত কাউকে দিয়ে ফোনটি দেখিয়ে নিন।',
        'এখনই অফিশিয়াল অ্যাপ বা কার্ডের পেছনের নম্বর দিয়ে আপনার ব্যাংক/MFS-কে জানান (মেসেজের নম্বর নয়)। যে পাসওয়ার্ড দিয়েছেন এবং যেখানে একই পাসওয়ার্ড ব্যবহার করেছেন, সব বদলান।',
        'এখনই অফিশিয়াল অ্যাপ বা কার্ডের পেছনের নম্বর দিয়ে আপনার প্রোভাইডারকে জানান। পিন ও পাসওয়ার্ড বদলান। আর কোনো কোড কাউকে দেবেন না, কল ব্যাক করলেও না।',
        'ওই ফোনে ব্যাংকিং/MFS অ্যাপ ব্যবহার বন্ধ রাখুন। পারলে অ্যাপটি মুছে ফেলুন এবং অন্য বিশ্বস্ত ফোন থেকে প্রোভাইডারকে জানান। ফোনটি কোনো বিশ্বস্ত ব্যক্তিকে দিয়ে পরীক্ষা করান।',
        'আর কোনো টাকা পাঠাবেন না, “টাকা ফেরত পেতে ফি” হলেও না। যে মাধ্যমে টাকা পাঠিয়েছেন তাদের অফিশিয়াল চ্যানেলে এখনই জানান এবং কী ব্যবস্থা সম্ভব জিজ্ঞেস করুন। স্ক্রিনশট ও লেনদেনের তথ্য রেখে দিন। টাকা ফেরত পাওয়ার নিশ্চয়তা নেই।'
      ],
      modeAI: 'নিয়ম + AI বিশ্লেষণ', aiOff: 'AI বিশ্লেষণ এখন পাওয়া যাচ্ছে না; শুধু নিয়ম-ভিত্তিক ফলাফল দেখানো হচ্ছে।',
      rate: 'AI এখন ব্যস্ত; শুধু নিয়ম-ভিত্তিক ফলাফল দেখানো হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।', masked: 'বড় সংখ্যা ও কোড ঢেকে দেওয়া হয়েছে।',
      priv: 'ঢেকে-দেওয়া টেক্সট বিশ্লেষণের জন্য একটি AI সেবায় (Groq) যায়। মেসেজ আমরা সংরক্ষণ করি না। তবু পাসওয়ার্ড, পিন বা OTP পেস্ট করবেন না।'
    },
    en: {
      title: 'Scam Message Explainer', tag: 'Paste a suspicious message. See why it is risky and what to do next.',
      lbl: 'Suspicious message', ph: 'Paste the message here…', check: 'Check message', ex: 'Try an example:',
      exl: ['Bonus + OTP', 'Genuine warning', 'Loan fee'], busy: 'Analyzing…',
      v: { strong_warning: '▲ Strong warning', some_warning: '● Some warning', cannot_tell: '? Cannot tell from the text' },
      sum: {
        strong_warning: 'This message has serious scam warning signs. Verify through your official app or the number on the back of your card before doing anything.',
        some_warning: 'There are some warning signs. Verify through an official channel yourself, not through the message’s link or number.',
        cannot_tell: 'The text alone is not enough to tell. Real banks also send warnings. Verify in your official app before acting.'
      },
      why: 'Why this warning?', noWhy: 'No clear warning sign was found, but that does not mean the message is safe. The sender could not be verified.',
      warnNote: 'This reads like a security warning. The text alone cannot show whether the sender is genuine.',
      now: 'Do now: do not share codes or PINs, do not send money, do not open the link. Open your official app yourself to check.',
      nowC: 'Do now: do not use the message’s link or number. Check in your official app or call the number on the back of your card.',
      banner: 'This tool cannot verify the sender and never says a message is “safe”.',
      acted: 'Already acted?',
      expl: ['I only clicked the link', 'I entered details/password', 'I shared an OTP/PIN', 'I installed an app', 'I sent money'],
      steps: [
        'Close the page. Do not type anything or download or install anything. If you are unsure whether something was downloaded, ask someone you trust to check your phone.',
        'Contact your bank/MFS now through the official app or the number on your card (not the number in the message). Change the password you entered and any place you reuse it.',
        'Contact your provider now through the official app or the number on your card. Change your PIN and passwords. Do not share any more codes, even if they call back.',
        'Stop using banking/MFS apps on that phone. Remove the app if you can, and contact your provider from another trusted phone. Ask someone you trust to check the device.',
        'Do not send any more money, even a “fee to get your money back”. Tell the provider you paid through, via its official channel, right away and ask what options exist. Keep screenshots and transaction details. Recovery is not guaranteed.'
      ],
      modeAI: 'Rules + AI analysis', aiOff: 'AI analysis is unavailable right now. Showing the rule-based result only.',
      rate: 'AI is busy. Showing the rule-based result only. Please try again shortly.', masked: 'Long numbers and codes were hidden.',
      priv: 'Masked text is sent to an AI service (Groq) for analysis. We do not store messages. Still, never paste passwords, PINs or OTPs.'
    }
  };

  function li(ul, txt) { var e = document.createElement('li'); e.textContent = txt; ul.appendChild(e); }

  function ranges(d) {
    var r = (d.hits || []).map(function (h) { return [h.start, h.end]; });
    (d.reasons || []).forEach(function (x) { var i = d.text.indexOf(x.phrase); if (i >= 0) r.push([i, i + x.phrase.length]); });
    r.sort(function (a, b) { return a[0] - b[0]; });
    var out = [];
    r.forEach(function (x) { var l = out[out.length - 1]; if (l && x[0] < l[1]) l[1] = Math.max(l[1], x[1]); else out.push(x.slice()); });
    return out;
  }

  function render(d) {
    last = d;
    var t = T[lang], v = d.verdict;
    $('result').hidden = false; $('result').className = 'res ' + v;
    $('vlabel').textContent = t.v[v];
    $('summary').textContent = d.summary || t.sum[v];
    $('banner').textContent = t.banner;
    var n = d.note === 'busy' ? t.rate : d.note ? t.aiOff : d.mode === 'ai' ? t.modeAI : '';
    $('modeline').textContent = ((d.masked ? t.masked + ' ' : '') + n).trim();
    var shown = $('shown'), p = 0;
    shown.textContent = '';
    ranges(d).forEach(function (r) {
      shown.appendChild(document.createTextNode(d.text.slice(p, r[0])));
      var m = document.createElement('mark'); m.textContent = d.text.slice(r[0], r[1]); shown.appendChild(m); p = r[1];
    });
    shown.appendChild(document.createTextNode(d.text.slice(p)));
    var ul = $('why'), seen = {};
    ul.textContent = '';
    (d.hits || []).forEach(function (h) { if (!seen[h.id]) { seen[h.id] = 1; li(ul, Rules.TEXT[h.id][lang]); } });
    (d.reasons || []).forEach(function (x) { li(ul, '“' + x.phrase + '” — ' + x.why); });
    if (d.warnText) li(ul, t.warnNote);
    if (!ul.children.length) li(ul, t.noWhy);
    $('now').textContent = v === 'cannot_tell' ? t.nowC : t.now;
  }

  function check() {
    if (busy) return;
    var raw = $('msg').value.trim();
    if (raw.length < 5) return;
    var text = Rules.mask(raw).slice(0, 1500), a = Rules.analyze(text);
    var base = { text: text, verdict: Rules.NAMES[a.floor], mode: 'rules', hits: a.hits, reasons: [], warnText: a.warnText, masked: text !== raw };
    busy = true; $('go').disabled = true; $('status').textContent = T[lang].busy;
    render(base);
    fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, lang: lang }) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { d.text = text; d.masked = base.masked; d.warnText = a.warnText && d.verdict === 'cannot_tell'; render(d); })
      .catch(function () { base.note = 'ai_failed'; render(base); })
      .then(function () { busy = false; $('go').disabled = false; $('status').textContent = ''; });
  }

  function applyLang() {
    var t = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(function (e) { e.textContent = t[e.getAttribute('data-t')]; });
    $('msg').placeholder = t.ph;
    document.querySelectorAll('[data-l]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === lang ? 'true' : 'false'); });
    exBtns.forEach(function (b, i) { b.textContent = t.exl[i]; });
    expBtns.forEach(function (b, i) { b.textContent = t.expl[i]; });
    $('steps').hidden = true;
    expBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    if (last) check();
  }

  EX.forEach(function (txt) {
    var b = document.createElement('button'); b.type = 'button';
    b.onclick = function () { $('msg').value = txt; check(); };
    $('exs').appendChild(b); exBtns.push(b);
  });
  for (var i = 0; i < 5; i++) (function (i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
    b.onclick = function () {
      expBtns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      $('steps').textContent = T[lang].steps[i]; $('steps').hidden = false;
    };
    $('exp').appendChild(b); expBtns.push(b);
  })(i);
  function updateLang(newL) {
    if (!newL || newL === lang) return;
    lang = newL;
    try { localStorage.setItem('lang', lang); } catch (e) {}
    applyLang();
    var evt = new CustomEvent('langchange', { detail: { lang: lang } });
    document.dispatchEvent(evt);
    window.dispatchEvent(evt);
  }
  document.querySelectorAll('[data-l]').forEach(function (b) { b.onclick = function () { updateLang(b.getAttribute('data-l')); }; });
  function onLangChange(e) {
    var l = (e && e.detail && e.detail.lang) || (function () {
      try { return localStorage.getItem('lang') || 'bn'; } catch (err) { return 'bn'; }
    })();
    if (l && l !== lang) {
      lang = l;
      applyLang();
    }
  }
  document.addEventListener('langchange', onLangChange);
  window.addEventListener('langchange', onLangChange);
  $('go').onclick = check;
  var s = $('sticker');
  s.onerror = function () { var x = document.createElement('span'); x.className = 'stk'; x.textContent = 'Built For Ostad Presents YUNet AIgnite Buildathon 2026'; s.replaceWith(x); };
  applyLang();
})();
