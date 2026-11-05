// history.js - Local-only client-side storage for scam checks
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HistoryStore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'sm_history_v1';
  var MAX_ENTRIES = 100;

  function showStorageNotice(msg) {
    if (typeof document === 'undefined') return;
    var existing = document.getElementById('history-storage-toast');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'history-storage-toast';
      existing.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#b3261e;color:#fff;padding:12px 20px;border-radius:8px;font-size:0.92rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.25);';
      document.body.appendChild(existing);
    }
    existing.textContent = msg;
    existing.style.display = 'block';
    setTimeout(function () {
      if (existing) existing.style.display = 'none';
    }, 4500);
  }

  function getLang() {
    try {
      return localStorage.getItem('lang') || 'bn';
    } catch (e) {
      return 'bn';
    }
  }

  function list() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      var lang = getLang();
      showStorageNotice(lang === 'en' ? 'Local storage is unavailable or disabled in your browser.' : 'আপনার ব্রাউজারে লোকাল স্টোরেজ অনুপলব্ধ বা নিষ্ক্রিয়।');
      return [];
    }
  }

  function save(entry) {
    if (!entry) return null;
    try {
      var current = list();
      // Ensure text is masked and capped at 1500 chars
      var maskedText = entry.text || '';
      if (typeof Rules !== 'undefined' && Rules.mask) {
        maskedText = Rules.mask(maskedText);
      }
      maskedText = String(maskedText).slice(0, 1500);

      var newEntry = {
        id: entry.id || ('sm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
        timestamp: entry.timestamp || new Date().toISOString(),
        verdict: entry.verdict || 'cannot_tell',
        mode: entry.mode || 'rules',
        text: maskedText,
        hits: Array.isArray(entry.hits) ? entry.hits : [],
        reasons: Array.isArray(entry.reasons) ? entry.reasons : [],
        language: entry.language || getLang()
      };

      // Add to beginning of array (newest first)
      current.unshift(newEntry);

      // Keep maximum 100 entries, dropping the oldest
      if (current.length > MAX_ENTRIES) {
        current = current.slice(0, MAX_ENTRIES);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

      // Dispatch event so other components can update
      var evt = new CustomEvent('historystoragechange', { detail: { count: current.length } });
      document.dispatchEvent(evt);
      window.dispatchEvent(evt);

      return newEntry;
    } catch (e) {
      var lang = getLang();
      showStorageNotice(lang === 'en' ? 'Could not save check (storage is restricted or full).' : 'চেকটি সেভ করা যায়নি (স্টোরেজ পূর্ণ বা সীমাবদ্ধ)।');
      return null;
    }
  }

  function remove(id) {
    try {
      var current = list();
      var filtered = current.filter(function (item) { return item.id !== id; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      var evt = new CustomEvent('historystoragechange', { detail: { count: filtered.length } });
      document.dispatchEvent(evt);
      window.dispatchEvent(evt);
      return true;
    } catch (e) {
      var lang = getLang();
      showStorageNotice(lang === 'en' ? 'Could not remove entry from storage.' : 'এন্ট্রি মুছে ফেলা সম্ভব হয়নি।');
      return false;
    }
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      var evt = new CustomEvent('historystoragechange', { detail: { count: 0 } });
      document.dispatchEvent(evt);
      window.dispatchEvent(evt);
      return true;
    } catch (e) {
      var lang = getLang();
      showStorageNotice(lang === 'en' ? 'Could not clear history.' : 'হিস্ট্রি মুছে ফেলা যায়নি।');
      return false;
    }
  }

  function exportJson(triggerDownload) {
    var data = list();
    var jsonString = JSON.stringify(data, null, 2);
    if (triggerDownload !== false && typeof document !== 'undefined') {
      try {
        var blob = new Blob([jsonString], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'scam-checks-history-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        // Fallback
      }
    }
    return jsonString;
  }

  return {
    save: save,
    list: list,
    remove: remove,
    clear: clear,
    exportJson: exportJson
  };
});
