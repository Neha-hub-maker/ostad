// Deterministic rules. Used by the browser (instant result) and by api/analyze.js (warning floor).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Rules = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var D = '0-9\u09E6-\u09EF';
  var NAMES = ['cannot_tell', 'some_warning', 'strong_warning'];

  // Hide long digit runs (phones, NID, accounts) and codes right after OTP/PIN words.
  function mask(t) {
    return String(t)
      .replace(new RegExp('(otp|pin|cvv|code|কোড|পিন|ওটিপি)([^' + D + ']{0,12})([' + D + ']{4,8})', 'gi'), '$1$2••••')
      .replace(new RegExp('[' + D + ']{8,}', 'g'), '••••');
  }

  var CRED = /otp|pin\b|cvv|cvc|password|passcode|ওটিপি|পিন|পাসওয়ার্ড|সিভিভি|কোড/i;
  var SHARE = /share|send|give|tell|provide|reveal|reply|dite|janan|pathan|bolun|\bden\b|\bdin\b|দিন|দিতে|জানান|জানাতে|বলুন|পাঠান|পাঠাতে|শেয়ার|লিখুন/i;
  // A sentence that warns people NOT to do something is not itself a request.
  var NEG = /(never|not|don'?t|dont)\s+(ever\s+)?(to\s+)?(share|give|tell|send|disclose|provide|reveal|click|install|download)|(শেয়ার|দেবেন|দিবেন|বলবেন|জানাবেন|পাঠাবেন|প্রকাশ|ক্লিক|ইনস্টল|ডাউনলোড)\s*(করবেন\s*)?না|(share|diben|deben|bolben|janaben|korben)\s*(korben\s*)?na\b|kokhono|কখনো|কখনও/i;
  var WARN = /beware|careful|caution|avoid|fake|fraud|scam|phishing|সতর্ক|সাবধান|প্রতারণ|প্রতারক|জাল|এড়িয়ে/i;
  var URLRE = /https?:\/\/|www\.|bit\.ly|tinyurl|\b[a-z0-9-]+\.(?:xyz|top|click|link|info|online|site|live|icu|cc)\b/i;
  var REWARD = /cashback|bonus|lottery|prize|reward|gift|winner|ক্যাশব্যাক|বোনাস|লটারি|পুরস্কার|উপহার|জিতেছেন|বিজয়ী/i;
  var FEE = /fee|charge|advance|processing|ফি|চার্জ|অগ্রিম|প্রসেসিং/i;
  var BLOCK = /block|suspend|clos|deactivat|terminat|lock|বন্ধ|ব্লক|স্থগিত|বাতিল/i;

  function span(s, re) { var m = re.exec(s); return m ? [m.index, m.index + m[0].length] : null; }

  // [id, severity (1 some, 2 strong), test(sentence, wholeText) -> [start,end] | falsy]
  var RULES = [
    ['disclose_code', 2, function (s) { var a = span(s, CRED), b = span(s, SHARE); return a && b && [Math.min(a[0], b[0]), Math.max(a[1], b[1])]; }],
    ['advance_fee', 2, function (s, w) {
      return /pay|send|deposit|transfer|পাঠান|জমা|পরিশোধ|দিন/i.test(s) && FEE.test(s) &&
        /loan|job|visa|prize|reward|bonus|cashback|lottery|parcel|customs|লোন|ঋণ|চাকরি|ভিসা|পুরস্কার|বোনাস|ক্যাশব্যাক|লটারি/i.test(w) && span(s, FEE);
    }],
    ['remote_access', 2, function (s) { return span(s, /anydesk|teamviewer|quicksupport|rustdesk|screen ?share|রিমোট|স্ক্রিন শেয়ার/i); }],
    ['app_install', 1, function (s) { return /install|download|ইনস্টল|ডাউনলোড/i.test(s) && span(s, /\.?apk\b/i); }],
    ['reward_lure', 1, function (s) {
      return REWARD.test(s) && /click|link|http|call|whatsapp|claim|apply|ক্লিক|লিংক|কল|হোয়াটসঅ্যাপ|ক্লেইম|আবেদন|জানান|পাঠান/i.test(s) && span(s, REWARD);
    }],
    ['urgent_threat', 1, function (s) {
      return /(?:within|in)\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)|immediately|right now|urgent|ekhoni|ekhuni|akhoni|এখনই|এক্ষুনি|জরুরি|[০-৯0-9]+\s*(?:ঘণ্টা|ঘন্টা|মিনিট)/i.test(s) && span(s, BLOCK);
    }],
    ['link_pressure', 1, function (s) {
      return URLRE.test(s) && /verify|update|login|log in|confirm|kyc|claim|click|ভেরিফাই|আপডেট|লগইন|কনফার্ম|কেওয়াইসি|ক্লিক/i.test(s) && span(s, URLRE);
    }]
  ];

  function analyze(text) {
    var hits = [], floor = 0, warn = false, re = /[^.!?।\n]+[.!?।]?/g, m;
    while ((m = re.exec(text))) {
      var s = m[0];
      if (NEG.test(s) || WARN.test(s)) { warn = true; continue; }
      for (var i = 0; i < RULES.length; i++) {
        var r = RULES[i][2](s, text);
        if (r) { hits.push({ id: RULES[i][0], sev: RULES[i][1], start: m.index + r[0], end: m.index + r[1] }); floor = Math.max(floor, RULES[i][1]); }
      }
    }
    return { floor: floor, hits: hits, warnText: warn && !hits.length };
  }

  var TEXT = {
    disclose_code: { bn: 'গোপন কোড (OTP/পিন/পাসওয়ার্ড) চাওয়া হচ্ছে। এটি কাউকে দেওয়া যায় না।', en: 'It asks for a secret code (OTP/PIN/password). It must never be shared.' },
    advance_fee: { bn: 'আগে টাকা (ফি/চার্জ) চাওয়া হচ্ছে। লোন, চাকরি বা পুরস্কারে অগ্রিম টাকা চাওয়া প্রতারণার সাধারণ লক্ষণ।', en: 'It asks for money up front. Advance fees for loans, jobs or prizes are a common scam sign.' },
    remote_access: { bn: 'আপনার ফোন দূর থেকে নিয়ন্ত্রণ করার অ্যাপ ব্যবহার করতে বলা হচ্ছে।', en: 'It asks you to use an app that lets someone control your phone remotely.' },
    app_install: { bn: 'লিংক থেকে APK ফাইল ইনস্টল করতে বলা হচ্ছে।', en: 'It asks you to install an APK file.' },
    reward_lure: { bn: 'বোনাস বা পুরস্কারের লোভ দেখিয়ে কিছু করতে বলা হচ্ছে।', en: 'It uses a bonus or prize to push you into acting.' },
    urgent_threat: { bn: 'তাড়াহুড়ো করানো হচ্ছে এবং অ্যাকাউন্ট বন্ধের ভয় দেখানো হচ্ছে।', en: 'It pressures you with urgency and a threat to block or close your account.' },
    link_pressure: { bn: 'লিংকে গিয়ে যাচাই, আপডেট বা লগইন করতে বলা হচ্ছে।', en: 'It asks you to verify, update or log in through a link.' }
  };

  return { mask: mask, analyze: analyze, NAMES: NAMES, TEXT: TEXT };
});
