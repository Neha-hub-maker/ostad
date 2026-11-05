(function () {
  'use strict';

  function getSavedLang() {
    try {
      return localStorage.getItem('lang') || 'bn';
    } catch (e) {
      return 'bn';
    }
  }

  function setSavedLang(lang) {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
  }

  var currentLang = getSavedLang();

  var navItems = [
    { href: 'index.html', bn: 'হোম', en: 'Home', match: ['/', '/index.html', 'index.html'] },
    { href: 'check.html', bn: 'মেসেজ যাচাই', en: 'Check', match: ['/check.html', 'check.html'] },
    { href: 'dashboard.html', bn: 'ড্যাশবোর্ড', en: 'Dashboard', match: ['/dashboard.html', 'dashboard.html'] },
    { href: 'history.html', bn: 'হিস্ট্রি', en: 'History', match: ['/history.html', 'history.html'] },
    { href: 'recover.html', bn: 'টাকা ও অ্যাকাউন্ট রক্ষা', en: 'Recover', match: ['/recover.html', 'recover.html'] },
    { href: 'learn.html', bn: 'সচেতনতা গাইড', en: 'Learn', match: ['/learn.html', 'learn.html'] },
    { href: 'about.html', bn: 'আমাদের সম্পর্কে', en: 'About', match: ['/about.html', 'about.html'] }
  ];

  function getActiveHref() {
    var path = window.location.pathname.toLowerCase();
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    for (var i = 0; i < navItems.length; i++) {
      var item = navItems[i];
      for (var j = 0; j < item.match.length; j++) {
        if (file === item.match[j] || path.endsWith(item.match[j])) {
          return item.href;
        }
      }
    }
    return 'index.html';
  }

  function renderHeader() {
    var headerEl = document.getElementById('site-header');
    if (!headerEl) {
      headerEl = document.createElement('header');
      headerEl.id = 'site-header';
      headerEl.className = 'site-header';
      document.body.insertBefore(headerEl, document.body.firstChild);
    } else {
      headerEl.className = 'site-header';
    }

    var activeHref = getActiveHref();

    var navLinksHtml = navItems.map(function (item) {
      var isActive = item.href === activeHref;
      var activeClass = isActive ? ' class="nav-link active" aria-current="page"' : ' class="nav-link"';
      return '<a href="' + item.href + '"' + activeClass + ' data-bn="' + item.bn + '" data-en="' + item.en + '">' +
        (currentLang === 'en' ? item.en : item.bn) +
        '</a>';
    }).join('');

    headerEl.innerHTML =
      '<div class="header-inner container">' +
        '<div class="brand-wrap">' +
          '<a href="index.html" class="brand" aria-label="Scam Explainer Home">' +
            '<img id="sticker" src="assets/sticker.png" height="56" alt="Built For Ostad Presents YUNet AIgnite Buildathon 2026">' +
          '</a>' +
        '</div>' +
        '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-label="Toggle navigation menu">' +
          '<span class="nav-toggle-icon"></span>' +
        '</button>' +
        '<nav id="site-nav" class="site-nav" aria-label="Main Navigation">' +
          navLinksHtml +
        '</nav>' +
        '<div class="header-actions">' +
          '<div class="lang-switcher" role="group" aria-label="Language selection">' +
            '<button type="button" data-l="bn" aria-pressed="' + (currentLang === 'bn' ? 'true' : 'false') + '">বাংলা</button>' +
            '<button type="button" data-l="en" aria-pressed="' + (currentLang === 'en' ? 'true' : 'false') + '">English</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var sticker = document.getElementById('sticker');
    if (sticker) {
      sticker.onerror = function () {
        var x = document.createElement('span');
        x.className = 'stk';
        x.textContent = 'Built For Ostad Presents YUNet AIgnite Buildathon 2026';
        sticker.replaceWith(x);
      };
    }

    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      toggle.onclick = function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        nav.classList.toggle('nav-open', !expanded);
      };
    }
  }

  function renderFooter() {
    var footerEl = document.getElementById('site-footer');
    if (!footerEl) {
      footerEl = document.createElement('footer');
      footerEl.id = 'site-footer';
      footerEl.className = 'site-footer';
      document.body.appendChild(footerEl);
    } else {
      footerEl.className = 'site-footer';
    }

    footerEl.innerHTML =
      '<div class="footer-inner container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col brand-col">' +
            '<div class="footer-brand-title" data-bn="স্ক্যাম মেসেজ এক্সপ্লেইনার" data-en="Scam Message Explainer">' +
              (currentLang === 'en' ? 'Scam Message Explainer' : 'স্ক্যাম মেসেজ এক্সপ্লেইনার') +
            '</div>' +
            '<p class="footer-desc" data-bn="বাংলাদেশি সাধারণ মোবাইল ব্যবহারকারীদের জন্য নিরপেক্ষ, নিরাপদ ও প্রাইভেসি-সুরক্ষিত প্রতারণামূলক বার্তা বিশ্লেষণ টুল।" data-en="Unbiased, safe, and privacy-first suspicious message explainer built for everyday Bangladeshi mobile users.">' +
              (currentLang === 'en' ? 'Unbiased, safe, and privacy-first suspicious message explainer built for everyday Bangladeshi mobile users.' : 'বাংলাদেশি সাধারণ মোবাইল ব্যবহারকারীদের জন্য নিরপেক্ষ, নিরাপদ ও প্রাইভেসি-সুরক্ষিত প্রতারণামূলক বার্তা বিশ্লেষণ টুল।') +
            '</p>' +
            '<div class="footer-disclaimer" data-bn="গুরুত্বপূর্ণ: এই টুল প্রেরকের সত্যতা যাচাই করতে পারে না এবং কোনো মেসেজকে কখনোই “নিরাপদ” বা “আসল” বলে না। সন্দেহ হলে সর্বদা অফিসিয়াল চ্যানেলে যোগাযোগ করুন।" data-en="Important: This tool cannot verify sender identity and never labels any message as &quot;safe&quot; or &quot;genuine&quot;. When in doubt, always contact official channels directly.">' +
              (currentLang === 'en' ? 'Important: This tool cannot verify sender identity and never labels any message as "safe" or "genuine". When in doubt, always contact official channels directly.' : 'গুরুত্বপূর্ণ: এই টুল প্রেরকের সত্যতা যাচাই করতে পারে না এবং কোনো মেসেজকে কখনোই “নিরাপদ” বা “আসল” বলে না। সন্দেহ হলে সর্বদা অফিসিয়াল চ্যানেলে যোগাযোগ করুন।') +
            '</div>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-bn="প্রয়োজনীয় লিংক" data-en="Quick Links">' + (currentLang === 'en' ? 'Quick Links' : 'প্রয়োজনীয় লিংক') + '</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="index.html" data-bn="হোম" data-en="Home">' + (currentLang === 'en' ? 'Home' : 'হোম') + '</a></li>' +
              '<li><a href="check.html" data-bn="মেসেজ যাচাই করুন" data-en="Check a Message">' + (currentLang === 'en' ? 'Check a Message' : 'মেসেজ যাচাই করুন') + '</a></li>' +
              '<li><a href="dashboard.html" data-bn="ড্যাশবোর্ড" data-en="Dashboard">' + (currentLang === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড') + '</a></li>' +
              '<li><a href="history.html" data-bn="সংরক্ষিত হিস্ট্রি" data-en="History">' + (currentLang === 'en' ? 'History' : 'সংরক্ষিত হিস্ট্রি') + '</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-bn="সহায়তা ও নিরাপত্তা" data-en="Help & Safety">' + (currentLang === 'en' ? 'Help & Safety' : 'সহায়তা ও নিরাপত্তা') + '</h4>' +
            '<ul class="footer-links">' +
              '<li><a href="recover.html" data-bn="টাকা বা তথ্য দিলে করণীয়" data-en="Recovery Steps">' + (currentLang === 'en' ? 'Recovery Steps' : 'টাকা বা তথ্য দিলে করণীয়') + '</a></li>' +
              '<li><a href="learn.html" data-bn="স্ক্যামের ধরন ও শিক্ষা" data-en="Scam Patterns & Guide">' + (currentLang === 'en' ? 'Scam Patterns & Guide' : 'স্ক্যামের ধরন ও শিক্ষা') + '</a></li>' +
              '<li><a href="about.html" data-bn="উদ্দেশ্য ও প্রাইভেসি" data-en="About & Privacy">' + (currentLang === 'en' ? 'About & Privacy' : 'উদ্দেশ্য ও প্রাইভেসি') + '</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div class="footer-bottom-text" data-bn="আমাদের সার্ভারে কোনো তথ্য সংরক্ষণ করা হয় না। বিশ্লেষণের জন্য মাস্কড (ঢেকে দেওয়া) টেক্সট একটি AI সেবায় পাঠানো হয়। আপনি \'সংরক্ষণ\' নির্বাচন করলে চেকটি কেবল এই ডিভাইসেই সংরক্ষিত থাকবে এবং আপনি যেকোনো সময় এটি মুছে ফেলতে পারবেন।" data-en="Nothing is stored on our servers. Masked text is sent to an AI service for analysis. If you choose Save, the check is stored only on this device and you can delete it any time.">' +
            (currentLang === 'en' ? 'Nothing is stored on our servers. Masked text is sent to an AI service for analysis. If you choose Save, the check is stored only on this device and you can delete it any time.' : 'আমাদের সার্ভারে কোনো তথ্য সংরক্ষণ করা হয় না। বিশ্লেষণের জন্য মাস্কড (ঢেকে দেওয়া) টেক্সট একটি AI সেবায় পাঠানো হয়। আপনি \'সংরক্ষণ\' নির্বাচন করলে চেকটি কেবল এই ডিভাইসেই সংরক্ষিত থাকবে এবং আপনি যেকোনো সময় এটি মুছে ফেলতে পারবেন।') +
          '</div>' +
          '<div class="footer-bottom-copy">' +
            '<span>Built by Neha for the Ostad YUNet AIgnite Buildathon 2026</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function applyLanguage(lang) {
    currentLang = lang;
    setSavedLang(lang);
    document.documentElement.lang = lang;

    // Update text for elements with data-bn and data-en
    document.querySelectorAll('[data-bn]').forEach(function (el) {
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-bn');
      if (val !== null && val !== '') {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update html content if data-bn-html and data-en-html exist
    document.querySelectorAll('[data-bn-html]').forEach(function (el) {
      var val = lang === 'en' ? el.getAttribute('data-en-html') : el.getAttribute('data-bn-html');
      if (val !== null && val !== '') {
        el.innerHTML = val;
      }
    });

    // Update aria-pressed on all language buttons
    document.querySelectorAll('[data-l]').forEach(function (btn) {
      var btnLang = btn.getAttribute('data-l');
      btn.setAttribute('aria-pressed', btnLang === lang ? 'true' : 'false');
    });

    // Dispatch custom langchange event across document and window
    var evt = new CustomEvent('langchange', { detail: { lang: lang } });
    document.dispatchEvent(evt);
    window.dispatchEvent(evt);
  }

  function setupLangButtons() {
    document.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.hasAttribute('data-l')) {
        var newLang = target.getAttribute('data-l');
        if (newLang && newLang !== currentLang) {
          applyLanguage(newLang);
        }
      }
    });

    // Listen to external langchange event
    window.addEventListener('storage', function (e) {
      if (e.key === 'lang' && e.newValue && e.newValue !== currentLang) {
        applyLanguage(e.newValue);
      }
    });
  }

  var initialized = false;
  function init() {
    if (initialized) return;
    initialized = true;
    renderHeader();
    renderFooter();
    setupLangButtons();
    applyLanguage(currentLang);
  }

  if (document.getElementById('site-header') || document.body) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global helpers
  window.SiteLanguage = {
    get: function () { return currentLang; },
    set: function (lang) { applyLanguage(lang); }
  };
})();
