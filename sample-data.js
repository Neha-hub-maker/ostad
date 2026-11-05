// sample-data.js - Fictional sample data for testing and demonstrations
// Note: In-memory only. Must NEVER be written to localStorage.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SampleData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var now = Date.now();
  var day = 24 * 60 * 60 * 1000;

  var SAMPLES = [
    {
      id: 'sample_01',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 0.2 * day).toISOString(),
      verdict: 'strong_warning',
      mode: 'rules',
      text: 'জরুরি নোটিশ: আপনার কাল্পনিক পে অ্যাকাউন্ট ২৪ ঘণ্টার মধ্যে বন্ধ হবে। চালু রাখতে এখনই পিন ও OTP কোড •••• পাঠান।',
      hits: [
        { id: 'disclose_code', sev: 2, start: 70, end: 94 },
        { id: 'urgent_threat', sev: 1, start: 43, end: 67 }
      ],
      reasons: [
        { phrase: 'পিন ও OTP কোড', why: 'গোপন ভেরিফিকেশন পিন চাওয়া হয়েছে' },
        { phrase: '২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট বন্ধ', why: 'ভীতি সঞ্চার করে তাড়াহুড়ো সৃষ্টি' }
      ],
      language: 'bn'
    },
    {
      id: 'sample_02',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 1.1 * day).toISOString(),
      verdict: 'strong_warning',
      mode: 'rules',
      text: 'অভিনন্দন! ডেমো লটারিতে ১,০০,০০০ টাকা জিতেছেন। পুরস্কারের টাকা ছাড় করাতে প্রসেসিং ফি হিসেবে ২,০০০ টাকা পাঠান।',
      hits: [
        { id: 'advance_fee', sev: 2, start: 62, end: 104 },
        { id: 'reward_lure', sev: 1, start: 0, end: 38 }
      ],
      reasons: [
        { phrase: 'প্রসেসিং ফি হিসেবে ২,০০০ টাকা পাঠান', why: 'পুরস্কারের নামে অগ্রিম ফি দাবি' },
        { phrase: 'লটারিতে জিতেছেন', why: 'অবাস্তব পুরস্কারের প্রলোভন' }
      ],
      language: 'bn'
    },
    {
      id: 'sample_03',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 2.5 * day).toISOString(),
      verdict: 'some_warning',
      mode: 'rules',
      text: 'Dear customer, your DemoPay profile verification is pending. Please click https://demopay-kyc.xyz to update and verify immediately.',
      hits: [
        { id: 'link_pressure', sev: 1, start: 67, end: 98 }
      ],
      reasons: [
        { phrase: 'https://demopay-kyc.xyz', why: 'Unverified external link demanding profile update' }
      ],
      language: 'en'
    },
    {
      id: 'sample_04',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 4.2 * day).toISOString(),
      verdict: 'strong_warning',
      mode: 'rules',
      text: 'গ্রাহক সেবা কেন্দ্র: আপনার কাল্পনিক ওয়ালেটের ত্রুটি ঠিক করতে ফোনে AnyDesk অ্যাপ ইনস্টল করুন এবং স্ক্রিন শেয়ার চালু করুন।',
      hits: [
        { id: 'remote_access', sev: 2, start: 58, end: 85 }
      ],
      reasons: [
        { phrase: 'AnyDesk অ্যাপ ইনস্টল', why: 'ফোন রিমোটলি নিয়ন্ত্রণ করার সফটওয়্যার ব্যবহারের নির্দেশ' }
      ],
      language: 'bn'
    },
    {
      id: 'sample_05',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 6.8 * day).toISOString(),
      verdict: 'some_warning',
      mode: 'rules',
      text: 'এক্সক্লুসিভ ক্যাশব্যাক অফার পেতে আমাদের নতুন অ্যাপ সংস্করণ ডাউনলোড ও ইনস্টল করুন: http://xyz-reward.click/app.apk',
      hits: [
        { id: 'app_install', sev: 1, start: 60, end: 98 },
        { id: 'reward_lure', sev: 1, start: 0, end: 32 }
      ],
      reasons: [
        { phrase: 'app.apk', why: 'অফিসিয়াল অ্যাপ স্টোরের বাইরে অচেনা APK ফাইল ডাউনলোডের প্ররোচনা' }
      ],
      language: 'bn'
    },
    {
      id: 'sample_06',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 8.3 * day).toISOString(),
      verdict: 'cannot_tell',
      mode: 'rules',
      text: 'নিরাপত্তা সতর্কবার্তা: কখনোই আপনার পিন, পাসওয়ার্ড বা ওটিপি কোড কাউকে বলবেন না। ব্যাংক বা ওয়ালেট কর্তৃপক্ষ কখনো পাসওয়ার্ড জানতে চায় না।',
      hits: [],
      reasons: [],
      warnText: true,
      language: 'bn'
    },
    {
      id: 'sample_07',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 11.2 * day).toISOString(),
      verdict: 'strong_warning',
      mode: 'rules',
      text: 'Congratulations! Your Fictional Bank loan of BDT 50,000 is approved. Transfer advance processing fee BDT 1,500 and give verification code to release funds.',
      hits: [
        { id: 'advance_fee', sev: 2, start: 68, end: 110 },
        { id: 'disclose_code', sev: 2, start: 115, end: 148 }
      ],
      reasons: [
        { phrase: 'Transfer advance processing fee', why: 'Upfront fee requested for loan disbursement' },
        { phrase: 'give verification code', why: 'Requesting secret verification code' }
      ],
      language: 'en'
    },
    {
      id: 'sample_08',
      sampleLabel: 'Sample data (fictional) / নমুনা ডেটা (কাল্পনিক)',
      isSample: true,
      timestamp: new Date(now - 13.5 * day).toISOString(),
      verdict: 'cannot_tell',
      mode: 'rules',
      text: 'আপনার অ্যাকাউন্ট ব্যালেন্স হালনাগাদ করা হয়েছে। সাম্প্রতিক লেনদেন দেখতে অফিশিয়াল মোবাইল অ্যাপ্লিকেশন লগইন করুন।',
      hits: [],
      reasons: [],
      language: 'bn'
    }
  ];

  return SAMPLES;
});
