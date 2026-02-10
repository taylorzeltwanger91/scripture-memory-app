import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── KJV Scripture Data (Sample passages for MVP demo) ───
const KJV_DATA = {
  "Romans": {
    1: {
      1: "Paul, a servant of Jesus Christ, called to be an apostle, separated unto the gospel of God,",
      2: "Which he had promised afore by his prophets in the holy scriptures,",
      3: "Concerning his Son Jesus Christ our Lord, which was made of the seed of David according to the flesh;",
      4: "And declared to be the Son of God with power, according to the spirit of holiness, by the resurrection from the dead:",
      5: "By whom we have received grace and apostleship, for obedience to the faith among all nations, for his name:",
      6: "Among whom are ye also the called of Jesus Christ:",
      7: "To all that be in Rome, beloved of God, called to be saints: Grace to you and peace from God our Father, and the Lord Jesus Christ.",
      8: "First, I thank my God through Jesus Christ for you all, that your faith is spoken of throughout the whole world.",
      9: "For God is my witness, whom I serve with my spirit in the gospel of his Son, that without ceasing I make mention of you always in my prayers;",
      10: "Making request, if by any means now at length I might have a prosperous journey by the will of God to come unto you.",
      16: "For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth; to the Jew first, and also to the Greek.",
    },
    8: {
      1: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
      28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      31: "What shall we then say to these things? If God be for us, who can be against us?",
      37: "Nay, in all these things we are more than conquerors through him that loved us.",
      38: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
      39: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    }
  },
  "Psalms": {
    23: {
      1: "The LORD is my shepherd; I shall not want.",
      2: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
      3: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
      4: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      5: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
      6: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
    },
    1: {
      1: "Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.",
      2: "But his delight is in the law of the LORD; and in his law doth he meditate day and night.",
      3: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
      4: "The ungodly are not so: but are like the chaff which the wind driveth away.",
      5: "Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.",
      6: "For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish.",
    },
    119: {
      105: "Thy word is a lamp unto my feet, and a light unto my path.",
      11: "Thy word have I hid in mine heart, that I might not sin against thee.",
    }
  },
  "John": {
    3: {
      16: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      17: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
    },
    1: {
      1: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      2: "The same was in the beginning with God.",
      3: "All things were made by him; and without him was not any thing made that was made.",
      4: "In him was life; and the life was the light of men.",
      5: "And the light shineth in darkness; and the darkness comprehended it not.",
      14: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
    },
    14: {
      6: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
      27: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    }
  },
  "Philippians": {
    4: {
      6: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
      7: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      8: "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.",
      13: "I can do all things through Christ which strengtheneth me.",
    }
  },
  "Proverbs": {
    3: {
      5: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
      6: "In all thy ways acknowledge him, and he shall direct thy paths.",
    }
  },
  "Isaiah": {
    40: {
      31: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    },
    41: {
      10: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    }
  },
  "Matthew": {
    6: {
      33: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      34: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.",
    },
    11: {
      28: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
      29: "Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.",
      30: "For my yoke is easy, and my burden is light.",
    },
    28: {
      19: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:",
      20: "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.",
    }
  },
  "Jeremiah": {
    29: {
      11: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    }
  },
  "Hebrews": {
    11: {
      1: "Now faith is the substance of things hoped for, the evidence of things not seen.",
      6: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
    },
    4: {
      12: "For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart.",
    }
  },
  "2 Timothy": {
    1: {
      7: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    },
    3: {
      16: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:",
      17: "That the man of God may be perfect, throughly furnished unto all good works.",
    }
  },
  "Ephesians": {
    2: {
      8: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:",
      9: "Not of works, lest any man should boast.",
      10: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
    },
    6: {
      10: "Finally, my brethren, be strong in the Lord, and in the power of his might.",
      11: "Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.",
    }
  },
  "1 Corinthians": {
    13: {
      4: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
      5: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
      6: "Rejoiceth not in iniquity, but rejoiceth in the truth;",
      7: "Beareth all things, believeth all things, hopeth all things, endureth all things.",
      13: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.",
    }
  },
  "Galatians": {
    5: {
      22: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,",
      23: "Meekness, temperance: against such there is no law.",
    }
  },
  "Joshua": {
    1: {
      9: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    }
  },
  "Genesis": {
    1: {
      1: "In the beginning God created the heaven and the earth.",
      2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
      3: "And God said, Let there be light: and there was light.",
    }
  },
  "Revelation": {
    21: {
      4: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    }
  },
};

// ─── Normalize text for comparison ───
const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s']/g, "").replace(/\s+/g, " ").trim();

// ─── KJV speech recognition synonyms ───
// Speech-to-text often modernizes archaic KJV words
const KJV_SYNONYMS = {
  thee: ["you","the"], thou: ["you"], thy: ["your","the"], thine: ["your","yours"],
  hath: ["has","have"], doth: ["does","do"], doeth: ["does"],
  shalt: ["shall","should"], wilt: ["will"], art: ["are"],
  saith: ["says","said"], cometh: ["comes","come"], goeth: ["goes"],
  maketh: ["makes","make"], giveth: ["gives","give"], taketh: ["takes"],
  loveth: ["loves"], liveth: ["lives"], knoweth: ["knows"],
  walketh: ["walks"], leadeth: ["leads"], keepeth: ["keeps"],
  seeketh: ["seeks"], passeth: ["passes"], restoreth: ["restores"],
  runneth: ["runs"], bringeth: ["brings"], anointest: ["anoint"],
  prepareth: ["prepares"], followeth: ["follows"],
  unto: ["to","onto","into"], wherefore: ["therefore","why"],
  ye: ["you","yeah","he"], yea: ["yes","yeah","yay"],
  begotten: ["begot"], whosoever: ["whoever"],
  brethren: ["brothers","brethren"], whatsoever: ["whatever","whatsoever"],
  throughly: ["thoroughly"], notwithstanding: ["nevertheless"],
  longsuffering: ["long","patience"], nay: ["no","nah"],
  lo: ["low","look"], alway: ["always"], afore: ["before"],
};

// ─── Word-level alignment engine (improved) ───
function cleanWord(w) {
  return w.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function wordsMatch(spoken, expected) {
  if (spoken === expected) return true;
  // Check KJV synonyms: expected is the KJV word, spoken might be modern
  const syns = KJV_SYNONYMS[expected];
  if (syns && syns.includes(spoken)) return true;
  // Fuzzy match for longer words (handles slight speech recognition errors)
  if (spoken.length > 2 && expected.length > 2 && levenshtein(spoken, expected) <= Math.max(1, Math.floor(expected.length / 4))) return true;
  return false;
}

function alignWords(spokenWords, expectedWords) {
  const results = [];
  let ei = 0;
  const LOOKAHEAD = 3; // how far ahead in expected words to search

  for (let si = 0; si < spokenWords.length && ei < expectedWords.length; si++) {
    const sw = cleanWord(spokenWords[si]);
    if (!sw) continue;
    const ew = cleanWord(expectedWords[ei]);

    // Direct match
    if (wordsMatch(sw, ew)) {
      results.push({ word: expectedWords[ei], matched: true, index: ei });
      ei++;
      continue;
    }

    // Look ahead in expected words — maybe speech skipped or merged a word
    let found = false;
    for (let look = 1; look <= LOOKAHEAD && ei + look < expectedWords.length; look++) {
      const ahead = cleanWord(expectedWords[ei + look]);
      if (wordsMatch(sw, ahead)) {
        // Mark skipped expected words as unmatched
        for (let skip = 0; skip < look; skip++) {
          results.push({ word: expectedWords[ei + skip], matched: false, index: ei + skip });
        }
        ei += look;
        results.push({ word: expectedWords[ei], matched: true, index: ei });
        ei++;
        found = true;
        break;
      }
    }
    if (found) continue;

    // Check if spoken word is a merge of next 2 expected words (e.g. "cannot" = "can" + "not")
    if (ei + 1 < expectedWords.length) {
      const merged = cleanWord(expectedWords[ei]) + cleanWord(expectedWords[ei + 1]);
      if (wordsMatch(sw, merged)) {
        results.push({ word: expectedWords[ei], matched: true, index: ei });
        ei++;
        results.push({ word: expectedWords[ei], matched: true, index: ei });
        ei++;
        continue;
      }
    }

    // No match — spoken word is extra, skip it
  }
  return { aligned: results, matchedUpTo: ei, total: expectedWords.length };
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
  return dp[m][n];
}

// ─── Segment verse text into memorizable phrases ───
function segmentText(text, targetLen = 14) {
  const clauses = text.split(/(?<=[,;:])\s+/);
  const segments = [];
  let current = "";
  for (const clause of clauses) {
    if (current && (current + " " + clause).split(/\s+/).length > targetLen) {
      segments.push(current.trim());
      current = clause;
    } else {
      current = current ? current + " " + clause : clause;
    }
  }
  if (current.trim()) segments.push(current.trim());
  return segments.length ? segments : [text];
}

// ─── Icons ───
const Icons = {
  Mic: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  MicOff: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  SkipFwd: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>,
  SkipBack: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Heart: ({filled}) => filled
    ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Volume: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  Repeat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

// ─── Storage helpers ───
const STORAGE_KEY = "scripture_memorize_v1";
const CHAPTER_CACHE_KEY = "scripture_chapter_cache";
const loadState = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
};
const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
};
const loadChapterCache = () => {
  try {
    const s = localStorage.getItem(CHAPTER_CACHE_KEY);
    return s ? JSON.parse(s) : {};
  } catch(e) { return {}; }
};
const saveChapterCache = (cache) => {
  try { localStorage.setItem(CHAPTER_CACHE_KEY, JSON.stringify(cache)); } catch(e) {}
};

// ─── Bible API fetch ───
const fetchChapter = async (book, chapter) => {
  const cache = loadChapterCache();
  const key = `${book}_${chapter}`;
  if (cache[key]) return cache[key];
  const query = encodeURIComponent(`${book} ${chapter}`);
  const res = await fetch(`https://bible-api.com/${query}?translation=kjv`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.verses || data.verses.length === 0) return null;
  const verses = {};
  for (const v of data.verses) {
    verses[v.verse] = v.text.trim();
  }
  cache[key] = verses;
  saveChapterCache(cache);
  return verses;
};

// ─── All books of the Bible (for full library browse) ───
const BIBLE_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians",
  "Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians",
  "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
  "1 John","2 John","3 John","Jude","Revelation",
];

const BOOK_CHAPTERS = {
  "Genesis":50,"Exodus":40,"Leviticus":27,"Numbers":36,"Deuteronomy":34,
  "Joshua":24,"Judges":21,"Ruth":4,"1 Samuel":31,"2 Samuel":24,
  "1 Kings":22,"2 Kings":25,"1 Chronicles":29,"2 Chronicles":36,
  "Ezra":10,"Nehemiah":13,"Esther":10,"Job":42,"Psalms":150,
  "Proverbs":31,"Ecclesiastes":12,"Song of Solomon":8,
  "Isaiah":66,"Jeremiah":52,"Lamentations":5,"Ezekiel":48,"Daniel":12,
  "Hosea":14,"Joel":3,"Amos":9,"Obadiah":1,"Jonah":4,"Micah":7,
  "Nahum":3,"Habakkuk":3,"Zephaniah":3,"Haggai":2,"Zechariah":14,"Malachi":4,
  "Matthew":28,"Mark":16,"Luke":24,"John":21,"Acts":28,
  "Romans":16,"1 Corinthians":16,"2 Corinthians":13,
  "Galatians":6,"Ephesians":6,"Philippians":4,"Colossians":4,
  "1 Thessalonians":5,"2 Thessalonians":3,"1 Timothy":6,"2 Timothy":4,
  "Titus":3,"Philemon":1,"Hebrews":13,"James":5,
  "1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,"3 John":1,
  "Jude":1,"Revelation":22,
};

const OT_BOOKS = BIBLE_BOOKS.slice(0, 39);
const NT_BOOKS = BIBLE_BOOKS.slice(39);

// ─── Popular passages for quick start ───
const POPULAR_PASSAGES = [
  { ref: "Psalms 23", book: "Psalms", chapter: 23, label: "The Lord is My Shepherd" },
  { ref: "John 3:16", book: "John", chapter: 3, verse: 16, label: "For God So Loved" },
  { ref: "Romans 8:28", book: "Romans", chapter: 8, verse: 28, label: "All Things Work Together" },
  { ref: "Philippians 4:13", book: "Philippians", chapter: 4, verse: 13, label: "I Can Do All Things" },
  { ref: "Proverbs 3:5-6", book: "Proverbs", chapter: 3, label: "Trust in the Lord" },
  { ref: "Isaiah 40:31", book: "Isaiah", chapter: 40, verse: 31, label: "Wings as Eagles" },
  { ref: "Jeremiah 29:11", book: "Jeremiah", chapter: 29, verse: 11, label: "Plans to Prosper You" },
  { ref: "Ephesians 2:8-9", book: "Ephesians", chapter: 2, label: "By Grace Through Faith" },
  { ref: "Hebrews 11:1", book: "Hebrews", chapter: 11, verse: 1, label: "Faith is the Substance" },
  { ref: "Matthew 11:28", book: "Matthew", chapter: 11, verse: 28, label: "Come Unto Me" },
  { ref: "Galatians 5:22-23", book: "Galatians", chapter: 5, label: "Fruit of the Spirit" },
  { ref: "John 1:1", book: "John", chapter: 1, verse: 1, label: "In the Beginning Was the Word" },
];

// ─── Featured passages for home view ───
const FEATURED_PASSAGES = [
  {
    ref: "Psalms 23", book: "Psalms", chapter: 23,
    label: "Psalm 23",
    preview: "The LORD is my shepherd; I shall not want..."
  },
  {
    ref: "John 3:16", book: "John", chapter: 3, verse: 16,
    label: "John 3:16",
    preview: "For God so loved the world, that he gave his only begotten Son..."
  },
  {
    ref: "Romans 8:28", book: "Romans", chapter: 8, verse: 28,
    label: "Romans 8",
    preview: "And we know that all things work together for good..."
  },
];

// ─── Color palette ───
const C = {
  bg: "#0f0d0a",
  bgGrad: "linear-gradient(170deg, #16120e 0%, #0f0d0a 40%, #13100c 100%)",
  card: "rgba(255,248,240,0.03)",
  cardBorder: "rgba(255,248,240,0.06)",
  accent: "#c8956c",
  accentDim: "#8a7260",
  accentGlow: "rgba(200,149,108,0.15)",
  accentBorder: "rgba(200,149,108,0.25)",
  text: "#e8e0d6",
  textDim: "#9a9088",
  textFaint: "#5c5650",
  green: "#6abf7b",
  greenBg: "rgba(106,191,123,0.1)",
  greenBorder: "rgba(106,191,123,0.2)",
  amberBg: "rgba(200,149,108,0.1)",
  amberBorder: "rgba(200,149,108,0.2)",
  red: "#dc2626",
};

// ─── Main App ───
export default function ScriptureMemorizeApp() {
  // State
  const [view, setView] = useState("home"); // home | browse | practice | progress
  const [favorites, setFavorites] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerses, setSelectedVerses] = useState([]);
  const [practiceMode, setPracticeMode] = useState("listen"); // listen | speak-with | recall | faded
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [alignmentResult, setAlignmentResult] = useState(null);
  const [coachMessage, setCoachMessage] = useState("");
  const [ttsRate, setTtsRate] = useState(0.85);
  const [showCoachPanel, setShowCoachPanel] = useState(false);
  const [sessionResumeInfo, setSessionResumeInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceVerseText, setPracticeVerseText] = useState("");
  const [practiceRef, setPracticeRef] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [browseChapterNum, setBrowseChapterNum] = useState("");
  const [continuousMode, setContinuousMode] = useState(true);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  // Refs so recognition handler always sees current values
  const expectedWordsRef = useRef([]);
  const currentSegmentRef = useRef(0);
  const practiceSegmentsRef = useRef([]);
  const continuousModeRef = useRef(true);
  const practiceRefRef = useRef("");

  // Load saved state
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.favorites) setFavorites(saved.favorites);
      if (saved.progress) setProgress(saved.progress);
      if (saved.lastSession) setSessionResumeInfo(saved.lastSession);
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    saveState({ favorites, progress, lastSession: sessionResumeInfo });
  }, [favorites, progress, sessionResumeInfo]);

  // Get all verses for a selection
  const getVersesForPractice = useCallback((book, chapter, verse = null) => {
    const chapterData = KJV_DATA[book]?.[chapter];
    if (!chapterData) return [];
    if (verse) {
      const text = chapterData[verse];
      return text ? [{ ref: `${book} ${chapter}:${verse}`, text, book, chapter, verse }] : [];
    }
    return Object.entries(chapterData)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([v, text]) => ({ ref: `${book} ${chapter}:${v}`, text, book, chapter, verse: Number(v) }));
  }, []);

  // Segments for current practice
  const practiceSegments = useMemo(() => {
    if (!practiceVerseText) return [];
    return segmentText(practiceVerseText);
  }, [practiceVerseText]);

  const currentSegmentText = practiceSegments[currentSegment] || "";
  const expectedWords = normalize(currentSegmentText).split(/\s+/).filter(Boolean);

  // Keep refs in sync
  expectedWordsRef.current = expectedWords;
  currentSegmentRef.current = currentSegment;
  practiceSegmentsRef.current = practiceSegments;
  continuousModeRef.current = continuousMode;
  practiceRefRef.current = practiceRef;

  // ─── TTS ───
  const speak = useCallback((text, rate = ttsRate) => {
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1;
    u.lang = "en-US";
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) u.voice = preferred;
    setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(u);
  }, [ttsRate]);

  const stopSpeaking = useCallback(() => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  // ─── Speech Recognition ───
  const launchRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setCoachMessage("Speech recognition is not supported in this browser. Please try Chrome.");
      return;
    }
    // Stop any prior session cleanly
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let segmentDone = false;

    recognition.onresult = (event) => {
      if (segmentDone) return;

      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSpokenText(transcript);

      // Always read from refs so we match the CURRENT segment
      const curExpected = expectedWordsRef.current;
      const spokenWords = normalize(transcript).split(/\s+/).filter(Boolean);
      const result = alignWords(spokenWords, curExpected);
      setAlignmentResult(result);

      // Segment complete?
      if (result.matchedUpTo >= result.total && result.total > 0) {
        segmentDone = true;
        const pct = Math.round((result.matchedUpTo / result.total) * 100);

        setProgress(prev => ({
          ...prev,
          [practiceRefRef.current]: {
            ...prev[practiceRefRef.current],
            segmentsCompleted: (prev[practiceRefRef.current]?.segmentsCompleted || 0) + 1,
            totalSegments: practiceSegmentsRef.current.length,
            lastPracticed: Date.now(),
            accuracy: Math.max(prev[practiceRefRef.current]?.accuracy || 0, pct),
            status: pct >= 90 ? "memorized" : pct >= 60 ? "learning" : "in_progress",
          }
        }));

        const isLast = currentSegmentRef.current >= practiceSegmentsRef.current.length - 1;

        // Kill this session so transcript resets for next segment
        try { recognition.abort(); } catch(e) {}
        recognitionRef.current = null;

        if (isLast) {
          setIsListening(false);
          setCoachMessage("You've completed the entire passage!");
        } else {
          setCurrentSegment(prev => prev + 1);
          if (continuousModeRef.current) {
            setSpokenText("");
            setAlignmentResult(null);
            setCoachMessage("");
            // Brief pause then fresh recognition for the new segment
            setTimeout(() => launchRecognition(), 250);
          } else {
            setIsListening(false);
            setCoachMessage(pct >= 90 ? "Excellent! Tap mic for next segment." : "Good work! Tap mic to continue.");
          }
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error === "aborted") return;
      if (e.error === "no-speech") {
        // Chrome fires after ~5s silence — just let onend restart
        return;
      }
      setCoachMessage("I didn't catch that. Tap the mic to try again.");
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      // Auto-restart if segment isn't done (handles Chrome's silent timeouts)
      if (!segmentDone && recognitionRef.current === recognition) {
        try { recognition.start(); } catch(e) {
          setIsListening(false);
          recognitionRef.current = null;
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setSpokenText("");
    setAlignmentResult(null);
    setCoachMessage("Go ahead \u2014 I'm listening.");
  }, []);

  const startListening = launchRecognition;

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch(e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // ─── Start practice (supports API fetch for full chapters) ───
  const startPractice = useCallback(async (book, chapter, verse = null) => {
    // Try local data first
    let verses = getVersesForPractice(book, chapter, verse);

    // If no local data or requesting full chapter, fetch from API
    if (verses.length === 0 || (!verse && Object.keys(KJV_DATA[book]?.[chapter] || {}).length < 5)) {
      setIsLoadingChapter(true);
      const fetched = await fetchChapter(book, chapter);
      setIsLoadingChapter(false);
      if (fetched) {
        if (verse) {
          const text = fetched[verse];
          verses = text ? [{ ref: `${book} ${chapter}:${verse}`, text, book, chapter, verse }] : verses;
        } else {
          verses = Object.entries(fetched)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([v, text]) => ({ ref: `${book} ${chapter}:${v}`, text, book, chapter, verse: Number(v) }));
        }
      }
    }

    if (verses.length === 0) return;

    const fullText = verses.map(v => v.text).join(" ");
    const ref = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;

    setPracticeVerseText(fullText);
    setPracticeRef(ref);
    setCurrentSegment(0);
    setSpokenText("");
    setAlignmentResult(null);
    setCoachMessage("");
    setPracticeMode("listen");
    setView("practice");

    setSessionResumeInfo({ book, chapter, verse, ref, segment: 0 });
  }, [getVersesForPractice]);

  // ─── Toggle favorite ───
  const toggleFavorite = useCallback((ref) => {
    setFavorites(prev =>
      prev.includes(ref) ? prev.filter(r => r !== ref) : [...prev, ref]
    );
  }, []);

  // Coach help
  const requestHelp = useCallback(() => {
    if (!currentSegmentText) return;
    const words = currentSegmentText.split(/\s+/);
    const matchedCount = alignmentResult?.matchedUpTo || 0;

    if (matchedCount === 0) {
      setCoachMessage(`Let's start with: "${words.slice(0, 4).join(" ")}..."`);
      speak(words.slice(0, 4).join(" "), 0.7);
    } else if (matchedCount < words.length) {
      const nextWords = words.slice(matchedCount, matchedCount + 3).join(" ");
      setCoachMessage(`You're right up to here. The next words are: "${nextWords}"`);
      speak(nextWords, 0.7);
    }
  }, [currentSegmentText, alignmentResult, speak]);

  // Next segment
  const nextSegment = useCallback(() => {
    stopListening();
    stopSpeaking();
    if (currentSegment < practiceSegments.length - 1) {
      setCurrentSegment(prev => prev + 1);
      setSpokenText("");
      setAlignmentResult(null);
      setCoachMessage("");
    } else {
      setCoachMessage("You've completed all segments! Great work.");
    }
  }, [currentSegment, practiceSegments.length, stopListening, stopSpeaking]);

  const prevSegment = useCallback(() => {
    stopListening();
    stopSpeaking();
    if (currentSegment > 0) {
      setCurrentSegment(prev => prev - 1);
      setSpokenText("");
      setAlignmentResult(null);
      setCoachMessage("");
    }
  }, [currentSegment, stopListening, stopSpeaking]);

  // Books list — full Bible
  const books = BIBLE_BOOKS;

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    for (const [book, chapters] of Object.entries(KJV_DATA)) {
      for (const [ch, verses] of Object.entries(chapters)) {
        for (const [v, text] of Object.entries(verses)) {
          if (text.toLowerCase().includes(q) || `${book} ${ch}:${v}`.toLowerCase().includes(q)) {
            results.push({ book, chapter: Number(ch), verse: Number(v), text, ref: `${book} ${ch}:${v}` });
          }
        }
      }
    }
    return results.slice(0, 20);
  }, [searchQuery]);

  // Word highlighting for practice view
  const renderHighlightedText = () => {
    if (!currentSegmentText) return null;
    const words = currentSegmentText.split(/\s+/);
    const matched = alignmentResult?.matchedUpTo || 0;

    return (
      <div style={{ fontSize: "1.5rem", lineHeight: 1.8, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.02em" }}>
        {words.map((word, i) => {
          let color = C.text;
          let opacity = 1;
          if (practiceMode === "recall" || practiceMode === "faded") {
            if (i < matched) {
              color = C.accent;
              opacity = 1;
            } else if (i === matched) {
              color = C.textDim;
              opacity = 0.7;
            } else {
              if (practiceMode === "faded" && i < Math.floor(words.length / 2)) {
                color = C.textDim;
                opacity = 0.5;
              } else {
                color = C.textFaint;
                opacity = 0.3;
              }
            }
          }
          return (
            <span key={i} style={{ color, opacity, transition: "all 0.3s ease" }} className={i === matched && (practiceMode === "recall" || practiceMode === "faded") ? "animate-pulse" : ""}>
              {word}{" "}
            </span>
          );
        })}
      </div>
    );
  };

  // ─── Inline style helpers ───
  const S = {
    page: { display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bgGrad },
    heading: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 },
    card: { background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16 },
    label: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textDim, fontWeight: 500 },
  };

  // ─── Views ───

  // HOME
  const renderHome = () => (
    <div style={S.page}>
      {/* Header */}
      <div style={{ padding: "32px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ ...S.heading, fontSize: "2rem", color: C.text, letterSpacing: "0.04em" }}>
              Scripture
            </h1>
            <p style={{ ...S.label, color: C.accentDim, marginTop: 2, fontSize: 10 }}>Memorize &middot; KJV</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,248,240,0.04)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: "pointer" }}
          >
            <Icons.Settings />
          </button>
        </div>
      </div>

      {/* Resume card */}
      {sessionResumeInfo && (
        <div style={{ margin: "0 20px 20px" }}>
          <button
            onClick={() => startPractice(sessionResumeInfo.book, sessionResumeInfo.chapter, sessionResumeInfo.verse)}
            style={{ width: "100%", padding: 16, borderRadius: 16, textAlign: "left", background: C.accentGlow, border: `1px solid ${C.accentBorder}`, cursor: "pointer", transition: "transform 0.15s" }}
          >
            <p style={{ ...S.label, color: C.accentDim, marginBottom: 4 }}>Continue where you left off</p>
            <p style={{ ...S.heading, fontSize: "1.15rem", color: C.text }}>{sessionResumeInfo.ref}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, color: C.textDim, fontSize: 13 }}>
              <Icons.Play />
              <span>Tap to resume</span>
            </div>
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textFaint }}>
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search verses or references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, background: "rgba(255,248,240,0.03)", border: `1px solid rgba(255,248,240,0.06)`, color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }}
          />
        </div>
        {searchResults.length > 0 && (
          <div style={{ marginTop: 8, background: "rgba(15,13,10,0.95)", border: `1px solid ${C.cardBorder}`, borderRadius: 12, maxHeight: 256, overflowY: "auto" }}>
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => { startPractice(r.book, r.chapter, r.verse); setSearchQuery(""); }}
                style={{ width: "100%", padding: 12, textAlign: "left", borderBottom: i < searchResults.length - 1 ? `1px solid rgba(255,248,240,0.04)` : "none", background: "transparent", border: "none", cursor: "pointer", color: C.text }}
              >
                <p style={{ color: C.accent, fontSize: 11, fontWeight: 500 }}>{r.ref}</p>
                <p style={{ color: C.textDim, fontSize: 13, marginTop: 2 }} className="line-clamp-2">{r.text}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Begin — Featured Passages */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <h2 style={{ ...S.label, marginBottom: 12 }}>Begin</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FEATURED_PASSAGES.map((fp, i) => (
            <button
              key={i}
              onClick={() => startPractice(fp.book, fp.chapter, fp.verse || null)}
              style={{ ...S.card, padding: "18px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "transform 0.15s" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...S.heading, fontSize: "1.05rem", color: C.text, marginBottom: 6 }}>{fp.label}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 13, color: C.textDim, fontStyle: "italic", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {fp.preview}
                </p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                <Icons.Play />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Passages */}
      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <h2 style={{ ...S.label, marginBottom: 12 }}>Popular Passages</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {POPULAR_PASSAGES.map((p, i) => (
            <button
              key={i}
              onClick={() => startPractice(p.book, p.chapter, p.verse || null)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", borderBottom: i < POPULAR_PASSAGES.length - 1 ? `1px solid rgba(255,248,240,0.03)` : "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: C.accentDim, fontSize: 11, width: 95, textAlign: "left", flexShrink: 0 }}>{p.ref}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: C.textDim }}>{p.label}</span>
              </div>
              <span style={{ color: C.textFaint }}><Icons.ChevronRight /></span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <h2 style={{ ...S.label, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: C.accent }}><Icons.Heart filled={true} /></span>
            Favorites
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {favorites.slice(0, 5).map((ref, i) => (
              <button
                key={i}
                onClick={() => {
                  const parts = ref.match(/(.+?)\s+(\d+):?(\d+)?/);
                  if (parts) startPractice(parts[1], Number(parts[2]), parts[3] ? Number(parts[3]) : null);
                }}
                style={{ ...S.card, width: "100%", padding: 12, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span style={{ color: C.text, fontSize: 14 }}>{ref}</span>
                <span style={{ color: C.textFaint }}><Icons.ChevronRight /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
      {renderBottomNav()}
    </div>
  );

  // BROWSE
  const renderBrowse = () => (
    <div style={S.page}>
      <div style={{ padding: "24px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {(selectedBook || selectedChapter) && (
            <button
              onClick={() => { if (selectedChapter) setSelectedChapter(null); else setSelectedBook(null); }}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,248,240,0.04)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: "pointer" }}
            >
              <Icons.ArrowLeft />
            </button>
          )}
          <h1 style={{ ...S.heading, fontSize: "1.5rem", color: C.text }}>
            {selectedChapter ? `${selectedBook} ${selectedChapter}` : selectedBook || "Library"}
          </h1>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", paddingBottom: 96 }}>
        {/* No book selected: show OT / NT sections */}
        {!selectedBook && (
          <div>
            {/* Old Testament */}
            <h3 style={{ ...S.label, color: C.accentDim, marginBottom: 8, marginTop: 4 }}>Old Testament</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginBottom: 24 }}>
              {OT_BOOKS.map(book => (
                <button
                  key={book}
                  onClick={() => setSelectedBook(book)}
                  style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; }}
                >
                  {book}
                </button>
              ))}
            </div>

            {/* New Testament */}
            <h3 style={{ ...S.label, color: C.accentDim, marginBottom: 8 }}>New Testament</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginBottom: 24 }}>
              {NT_BOOKS.map(book => (
                <button
                  key={book}
                  onClick={() => setSelectedBook(book)}
                  style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer", transition: "color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; }}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book selected, no chapter: show chapter number grid */}
        {selectedBook && !selectedChapter && (
          <div>
            <p style={{ ...S.label, color: C.textDim, marginBottom: 12 }}>
              {BOOK_CHAPTERS[selectedBook]} Chapters
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
              {Array.from({ length: BOOK_CHAPTERS[selectedBook] || 0 }, (_, i) => i + 1).map(ch => {
                const hasLocal = KJV_DATA[selectedBook]?.[ch];
                return (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    style={{
                      aspectRatio: "1", borderRadius: 10,
                      background: hasLocal ? C.accentGlow : C.card,
                      border: `1px solid ${hasLocal ? C.accentBorder : C.cardBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: hasLocal ? C.accent : C.textDim,
                      fontSize: 15, fontFamily: "'Cormorant Garamond', Georgia, serif",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chapter selected: practice button + verses */}
        {selectedBook && selectedChapter && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => startPractice(selectedBook, selectedChapter)}
              style={{ width: "100%", padding: 16, borderRadius: 14, textAlign: "center", background: C.accentGlow, border: `1px solid ${C.accentBorder}`, cursor: "pointer", transition: "transform 0.15s" }}
            >
              <p style={{ color: C.accent, fontWeight: 500, fontSize: 15 }}>Practice Full Chapter</p>
              <p style={{ color: C.textDim, fontSize: 11, marginTop: 4 }}>Fetches full chapter from KJV</p>
            </button>

            {/* Show embedded verses if available */}
            {KJV_DATA[selectedBook]?.[selectedChapter] && Object.entries(KJV_DATA[selectedBook][selectedChapter]).sort(([a],[b]) => Number(a) - Number(b)).map(([v, text]) => {
              const ref = `${selectedBook} ${selectedChapter}:${v}`;
              const isFav = favorites.includes(ref);
              const prog = progress[ref];
              return (
                <div key={v} style={{ ...S.card, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: C.accentDim, fontSize: 11, fontWeight: 500, letterSpacing: "0.05em" }}>v. {v}</span>
                        {prog?.status === "memorized" && (
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 99, background: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}` }}>Memorized</span>
                        )}
                        {prog?.status === "learning" && (
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 99, background: C.amberBg, color: C.accent, border: `1px solid ${C.amberBorder}` }}>Learning</span>
                        )}
                      </div>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: C.textDim, fontSize: 14, lineHeight: 1.6 }}>
                        {text}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => toggleFavorite(ref)}
                        style={{ background: "none", border: "none", color: isFav ? C.accent : C.textFaint, cursor: "pointer", padding: 0 }}
                      >
                        <Icons.Heart filled={isFav} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => startPractice(selectedBook, selectedChapter, Number(v))}
                    style={{ marginTop: 12, width: "100%", padding: "8px 0", borderRadius: 8, background: "rgba(255,248,240,0.03)", border: `1px solid ${C.cardBorder}`, color: C.textDim, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    <Icons.Play /> Practice
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renderBottomNav()}
    </div>
  );

  // PRACTICE
  const renderPractice = () => {
    const completionPct = practiceSegments.length > 0 ? Math.round(((currentSegment) / practiceSegments.length) * 100) : 0;
    const matchPct = alignmentResult ? Math.round((alignmentResult.matchedUpTo / alignmentResult.total) * 100) : 0;

    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "linear-gradient(170deg, #12100d 0%, #0a0908 50%, #110f0c 100%)" }}>
        {/* Top bar */}
        <div style={{ padding: "20px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => { stopListening(); stopSpeaking(); setView("home"); }}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,248,240,0.04)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: "pointer" }}
          >
            <Icons.X />
          </button>
          <div style={{ textAlign: "center" }}>
            <p style={{ ...S.label, color: C.accentDim, fontSize: 11 }}>{practiceRef}</p>
          </div>
          <button
            onClick={() => toggleFavorite(practiceRef)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: favorites.includes(practiceRef) ? C.accent : C.textFaint, cursor: "pointer" }}
          >
            <Icons.Heart filled={favorites.includes(practiceRef)} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ margin: "0 20px 16px" }}>
          <div style={{ height: 3, background: "rgba(255,248,240,0.04)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, transition: "width 0.5s ease", width: `${completionPct}%`, background: `linear-gradient(90deg, ${C.accentDim}, ${C.accent})` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ color: C.textFaint, fontSize: 10 }}>Segment {currentSegment + 1} of {practiceSegments.length}</span>
            <span style={{ color: C.textFaint, fontSize: 10 }}>{completionPct}%</span>
          </div>
        </div>

        {/* Mode selector */}
        <div style={{ margin: "0 20px 20px", display: "flex", gap: 4, padding: 4, borderRadius: 14, background: "rgba(255,248,240,0.02)" }}>
          {[
            { id: "listen", label: "Listen", icon: <Icons.Volume /> },
            { id: "speak-with", label: "Speak With", icon: <Icons.Repeat /> },
            { id: "recall", label: "Recall", icon: <Icons.Mic /> },
            { id: "faded", label: "Faded", icon: <Icons.Star /> },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                stopListening();
                stopSpeaking();
                setPracticeMode(mode.id);
                setSpokenText("");
                setAlignmentResult(null);
                setCoachMessage("");
              }}
              style={{
                flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 10, fontWeight: 500,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
                transition: "all 0.2s", border: "none",
                background: practiceMode === mode.id ? C.accentGlow : "transparent",
                color: practiceMode === mode.id ? C.accent : C.textFaint,
                ...(practiceMode === mode.id ? { border: `1px solid ${C.accentBorder}` } : { border: "1px solid transparent" }),
              }}
            >
              <span style={{ opacity: 0.7 }}>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Scripture display */}
        <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
            {renderHighlightedText()}

            {/* Match indicator */}
            {(practiceMode === "recall" || practiceMode === "faded") && alignmentResult && (
              <div style={{ marginTop: 24 }}>
                <div style={{ height: 5, background: "rgba(255,248,240,0.04)", borderRadius: 99, overflow: "hidden", maxWidth: 280, margin: "0 auto" }}>
                  <div style={{
                    height: "100%", borderRadius: 99, transition: "width 0.3s ease",
                    width: `${matchPct}%`,
                    background: matchPct >= 90 ? C.green : matchPct >= 60 ? C.accent : C.red,
                  }} />
                </div>
                <p style={{ color: C.textFaint, fontSize: 12, marginTop: 6 }}>{matchPct}% matched</p>
              </div>
            )}

            {/* Spoken text display */}
            {spokenText && (practiceMode === "recall" || practiceMode === "faded") && (
              <div style={{ marginTop: 20, padding: 12, borderRadius: 12, background: C.card, border: `1px solid ${C.cardBorder}` }}>
                <p style={{ ...S.label, marginBottom: 4 }}>What I heard</p>
                <p style={{ color: C.textDim, fontSize: 13, fontStyle: "italic" }}>{spokenText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Coach message */}
        {coachMessage && (
          <div style={{ margin: "0 20px 12px", padding: 14, borderRadius: 12, background: "rgba(255,248,240,0.02)", border: `1px solid ${C.cardBorder}` }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: C.textDim, fontSize: 14, lineHeight: 1.5, textAlign: "center" }}>
              {coachMessage}
            </p>
          </div>
        )}

        {/* Controls */}
        <div style={{ padding: "0 20px 32px" }}>
          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <button
              onClick={prevSegment}
              disabled={currentSegment === 0}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,248,240,0.04)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: currentSegment === 0 ? "default" : "pointer", opacity: currentSegment === 0 ? 0.3 : 1 }}
            >
              <Icons.SkipBack />
            </button>

            {/* Main action button */}
            {practiceMode === "listen" && (
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speak(currentSegmentText)}
                style={{
                  width: 64, height: 64, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "transform 0.15s", color: "#fff",
                  background: isSpeaking ? "linear-gradient(135deg, #7c2d12, #9a3412)" : `linear-gradient(135deg, ${C.accentDim}, ${C.accent})`,
                  boxShadow: `0 4px 20px rgba(200,149,108,0.3)`,
                }}
              >
                {isSpeaking ? <Icons.Pause /> : <Icons.Play />}
              </button>
            )}

            {practiceMode === "speak-with" && (
              <button
                onClick={() => {
                  speak(currentSegmentText, 0.7);
                  setTimeout(() => startListening(), 500);
                }}
                style={{
                  width: 64, height: 64, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "transform 0.15s", color: "#fff",
                  background: `linear-gradient(135deg, ${C.accentDim}, ${C.accent})`,
                  boxShadow: `0 4px 20px rgba(200,149,108,0.3)`,
                }}
              >
                <Icons.Volume />
              </button>
            )}

            {(practiceMode === "recall" || practiceMode === "faded") && (
              <button
                onClick={() => isListening ? stopListening() : startListening()}
                className={isListening ? "animate-pulse" : ""}
                style={{
                  width: 64, height: 64, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "transform 0.15s", color: "#fff",
                  background: isListening ? "linear-gradient(135deg, #dc2626, #ef4444)" : `linear-gradient(135deg, ${C.accentDim}, ${C.accent})`,
                  boxShadow: isListening ? "0 4px 30px rgba(220,38,38,0.4)" : `0 4px 20px rgba(200,149,108,0.3)`,
                }}
              >
                {isListening ? <Icons.MicOff /> : <Icons.Mic />}
              </button>
            )}

            <button
              onClick={nextSegment}
              disabled={currentSegment >= practiceSegments.length - 1}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,248,240,0.04)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: currentSegment >= practiceSegments.length - 1 ? "default" : "pointer", opacity: currentSegment >= practiceSegments.length - 1 ? 0.3 : 1 }}
            >
              <Icons.SkipFwd />
            </button>
          </div>

          {/* Secondary controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {[
              { label: "Help me", action: requestHelp },
              { label: "Read slowly", action: () => speak(currentSegmentText, 0.6) },
              { label: "Reset", action: () => { setSpokenText(""); setAlignmentResult(null); setCoachMessage("Let's try that segment again."); } },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,248,240,0.03)", border: `1px solid ${C.cardBorder}`, color: C.textDim, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.15s" }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Continuous mode toggle + TTS speed */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <button
              onClick={() => setContinuousMode(prev => !prev)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                background: continuousMode ? C.accentGlow : "rgba(255,248,240,0.02)",
                color: continuousMode ? C.accent : C.textFaint,
                border: `1px solid ${continuousMode ? C.accentBorder : C.cardBorder}`,
              }}
            >
              <Icons.Repeat />
              Continuous
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.textFaint, fontSize: 10, letterSpacing: "0.1em" }}>SLOW</span>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={ttsRate}
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                style={{ width: 96 }}
              />
              <span style={{ color: C.textFaint, fontSize: 10, letterSpacing: "0.1em" }}>FAST</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // PROGRESS
  const renderProgress = () => {
    const entries = Object.entries(progress).sort(([,a], [,b]) => (b.lastPracticed || 0) - (a.lastPracticed || 0));
    const memorizedCount = entries.filter(([,p]) => p.status === "memorized").length;
    const learningCount = entries.filter(([,p]) => p.status === "learning").length;
    const totalCount = entries.length;

    return (
      <div style={S.page}>
        <div style={{ padding: "24px 20px 16px" }}>
          <h1 style={{ ...S.heading, fontSize: "1.5rem", color: C.text }}>
            Your Progress
          </h1>
        </div>

        {/* Stats */}
        <div style={{ margin: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Memorized", value: memorizedCount, color: C.green },
            { label: "Learning", value: learningCount, color: C.accent },
            { label: "Total", value: totalCount, color: C.textDim },
          ].map((stat, i) => (
            <div key={i} style={{ ...S.card, padding: 12, textAlign: "center" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 300, color: stat.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {stat.value}
              </p>
              <p style={{ ...S.label, marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Entries */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", paddingBottom: 96 }}>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 64 }}>
              <div style={{ color: C.textFaint, marginBottom: 12, display: "flex", justifyContent: "center" }}>
                <Icons.Book />
              </div>
              <p style={{ color: C.textDim, fontSize: 14 }}>No passages practiced yet.</p>
              <p style={{ color: C.textFaint, fontSize: 12, marginTop: 4 }}>Choose a passage to begin your journey.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {entries.map(([ref, data]) => (
                <button
                  key={ref}
                  onClick={() => {
                    const parts = ref.match(/(.+?)\s+(\d+):?(\d+)?/);
                    if (parts) startPractice(parts[1], Number(parts[2]), parts[3] ? Number(parts[3]) : null);
                  }}
                  style={{ ...S.card, width: "100%", padding: 14, textAlign: "left", cursor: "pointer", transition: "background 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ color: C.text, fontSize: 14 }}>{ref}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 99,
                          ...(data.status === "memorized"
                            ? { background: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}` }
                            : data.status === "learning"
                            ? { background: C.amberBg, color: C.accent, border: `1px solid ${C.amberBorder}` }
                            : { background: C.card, color: C.textDim, border: `1px solid ${C.cardBorder}` }
                          ),
                        }}>
                          {data.status === "memorized" ? "Memorized" : data.status === "learning" ? "Learning" : "In Progress"}
                        </span>
                        {data.accuracy && (
                          <span style={{ color: C.textFaint, fontSize: 10 }}>{data.accuracy}% accuracy</span>
                        )}
                      </div>
                    </div>
                    <span style={{ color: C.textFaint }}><Icons.ChevronRight /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {renderBottomNav()}
      </div>
    );
  };

  // Bottom navigation
  const renderBottomNav = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}>
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(200,149,108,0.1), transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 0 20px", background: `linear-gradient(180deg, rgba(15,13,10,0.9), ${C.bg})`, backdropFilter: "blur(12px)" }}>
        {[
          { id: "home", label: "Home", icon: <Icons.Home /> },
          { id: "browse", label: "Library", icon: <Icons.Book /> },
          { id: "progress", label: "Progress", icon: <Icons.Chart /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setView(tab.id); if (tab.id === "browse") { setSelectedBook(null); setSelectedChapter(null); } }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 20px", borderRadius: 12,
              background: "none", border: "none", cursor: "pointer", transition: "color 0.2s",
              color: view === tab.id ? C.accent : C.textFaint,
            }}
          >
            {tab.icon}
            <span style={{ fontSize: 10, letterSpacing: "0.05em" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0d0a; }
        button { font-family: inherit; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,149,108,0.15); border-radius: 3px; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }

        input[type="range"] {
          -webkit-appearance: none;
          height: 3px;
          background: rgba(255,248,240,0.06);
          border-radius: 3px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #c8956c;
          cursor: pointer;
          border: 2px solid #0f0d0a;
        }

        input::placeholder { color: #5c5650; }
        input:focus { border-color: rgba(200,149,108,0.3) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", color: C.text, maxWidth: 430, margin: "0 auto" }}>
        {view === "home" && renderHome()}
        {view === "browse" && renderBrowse()}
        {view === "practice" && renderPractice()}
        {view === "progress" && renderProgress()}

        {/* Loading overlay */}
        {isLoadingChapter && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,9,8,0.85)" }}>
            <div style={{ textAlign: "center" }}>
              <div className="animate-spin" style={{ width: 40, height: 40, border: `2px solid ${C.accentDim}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: C.textDim, fontSize: 14 }}>
                Fetching chapter...
              </p>
            </div>
          </div>
        )}

        {/* Settings modal */}
        {showSettings && (
          <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(10,9,8,0.7)" }} onClick={() => setShowSettings(false)}>
            <div
              style={{ width: "100%", maxWidth: 430, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", background: "linear-gradient(170deg, #1c1917, #0f0d0a)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,248,240,0.08)", margin: "0 auto 20px" }} />

              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: "1.25rem", color: C.text, marginBottom: 20 }}>
                Settings
              </h2>

              {/* TTS Speed */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...S.label, marginBottom: 8 }}>Reading Speed</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: C.textFaint, fontSize: 10, letterSpacing: "0.1em" }}>SLOW</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={ttsRate}
                    onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: C.textFaint, fontSize: 10, letterSpacing: "0.1em" }}>FAST</span>
                  <span style={{ color: C.accent, fontSize: 12, width: 32, textAlign: "right" }}>{ttsRate.toFixed(2)}x</span>
                </div>
              </div>

              {/* Clear Progress */}
              <div style={{ marginBottom: 10 }}>
                <button
                  onClick={() => {
                    if (window.confirm("Clear all progress? This cannot be undone.")) {
                      setProgress({});
                    }
                  }}
                  style={{ ...S.card, width: "100%", padding: 14, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div>
                    <p style={{ color: C.text, fontSize: 14 }}>Clear Progress</p>
                    <p style={{ color: C.textFaint, fontSize: 11, marginTop: 2 }}>Reset all memorization progress</p>
                  </div>
                  <span style={{ color: C.textFaint, fontSize: 12 }}>{Object.keys(progress).length} entries</span>
                </button>
              </div>

              {/* Clear Favorites */}
              <div style={{ marginBottom: 10 }}>
                <button
                  onClick={() => {
                    if (window.confirm("Clear all favorites?")) {
                      setFavorites([]);
                    }
                  }}
                  style={{ ...S.card, width: "100%", padding: 14, textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div>
                    <p style={{ color: C.text, fontSize: 14 }}>Clear Favorites</p>
                    <p style={{ color: C.textFaint, fontSize: 11, marginTop: 2 }}>Remove all saved favorites</p>
                  </div>
                  <span style={{ color: C.textFaint, fontSize: 12 }}>{favorites.length} saved</span>
                </button>
              </div>

              {/* Clear Chapter Cache */}
              <div style={{ marginBottom: 20 }}>
                <button
                  onClick={() => {
                    if (window.confirm("Clear cached chapters? They will be re-fetched when needed.")) {
                      localStorage.removeItem(CHAPTER_CACHE_KEY);
                    }
                  }}
                  style={{ ...S.card, width: "100%", padding: 14, textAlign: "left", cursor: "pointer" }}
                >
                  <p style={{ color: C.text, fontSize: 14 }}>Clear Chapter Cache</p>
                  <p style={{ color: C.textFaint, fontSize: 11, marginTop: 2 }}>Remove downloaded chapters from local storage</p>
                </button>
              </div>

              {/* About */}
              <div style={{ paddingTop: 16, borderTop: `1px solid ${C.cardBorder}`, textAlign: "center" }}>
                <p style={{ color: C.textDim, fontSize: 12 }}>Scripture Memory</p>
                <p style={{ color: C.textFaint, fontSize: 10, marginTop: 2 }}>v0.2.0 &middot; KJV</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
