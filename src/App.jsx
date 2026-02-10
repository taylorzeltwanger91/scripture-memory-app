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
    setCoachMessage("Go ahead — I'm listening.");
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
      setCoachMessage(`Let's start with: "${words.slice(0, 4).join(" ")}…"`);
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
      <div className="text-2xl leading-relaxed font-serif tracking-wide" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        {words.map((word, i) => {
          let cls = "transition-all duration-300 ";
          if (practiceMode === "recall" || practiceMode === "faded") {
            if (i < matched) {
              cls += "text-amber-300 opacity-100";
            } else if (i === matched) {
              cls += "text-stone-300 opacity-70 animate-pulse";
            } else {
              if (practiceMode === "faded" && i < Math.floor(words.length / 2)) {
                cls += "text-stone-400 opacity-50";
              } else {
                cls += "text-stone-600 opacity-30";
              }
            }
          } else {
            cls += "text-stone-200";
          }
          return (
            <span key={i} className={cls}>
              {word}{" "}
            </span>
          );
        })}
      </div>
    );
  };

  // ─── Views ───

  // HOME
  const renderHome = () => (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(165deg, #1a1410 0%, #0d0b09 40%, #151210 100%)" }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-stone-100" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Scripture
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase text-amber-600/80 mt-0.5 font-medium">Memorize · KJV</p>
          </div>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors">
            <Icons.Settings />
          </button>
        </div>
      </div>

      {/* Resume card */}
      {sessionResumeInfo && (
        <div className="mx-5 mb-5">
          <button
            onClick={() => startPractice(sessionResumeInfo.book, sessionResumeInfo.chapter, sessionResumeInfo.verse)}
            className="w-full p-4 rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #92400e20, #78350f30)", border: "1px solid #92400e30" }}
          >
            <p className="text-amber-500/70 text-xs tracking-[0.2em] uppercase mb-1">Continue where you left off</p>
            <p className="text-stone-100 text-lg" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {sessionResumeInfo.ref}
            </p>
            <div className="flex items-center gap-2 mt-2 text-stone-400 text-sm">
              <Icons.Play />
              <span>Tap to resume</span>
            </div>
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mx-5 mb-5">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Search verses or references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-800/40 border border-stone-700/30 text-stone-200 placeholder-stone-500 outline-none focus:border-amber-700/50 transition-colors text-sm"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 bg-stone-900/90 border border-stone-700/30 rounded-xl max-h-64 overflow-y-auto">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => { startPractice(r.book, r.chapter, r.verse); setSearchQuery(""); }}
                className="w-full p-3 text-left border-b border-stone-800/50 last:border-0 hover:bg-stone-800/40 transition-colors"
              >
                <p className="text-amber-500/80 text-xs font-medium">{r.ref}</p>
                <p className="text-stone-300 text-sm mt-0.5 line-clamp-2">{r.text}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Start */}
      <div className="px-5 mb-4">
        <h2 className="text-sm tracking-[0.2em] uppercase text-stone-500 mb-3 font-medium">Popular Passages</h2>
        <div className="space-y-1">
          {POPULAR_PASSAGES.map((p, i) => (
            <button
              key={i}
              onClick={() => startPractice(p.book, p.chapter, p.verse || null)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-stone-800/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-600/50 text-xs w-24 text-left shrink-0">{p.ref}</span>
                <span className="text-stone-300 text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {p.label}
                </span>
              </div>
              <span className="text-stone-600 group-hover:text-stone-400 transition-colors"><Icons.ChevronRight /></span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="px-5 mb-4">
          <h2 className="text-sm tracking-[0.2em] uppercase text-stone-500 mb-3 font-medium flex items-center gap-2">
            <span className="text-amber-600"><Icons.Heart filled={true}/></span>
            Favorites
          </h2>
          <div className="space-y-2">
            {favorites.slice(0, 5).map((ref, i) => (
              <button
                key={i}
                onClick={() => {
                  const parts = ref.match(/(.+?)\s+(\d+):?(\d+)?/);
                  if (parts) startPractice(parts[1], Number(parts[2]), parts[3] ? Number(parts[3]) : null);
                }}
                className="w-full p-3 rounded-xl bg-stone-800/30 border border-stone-700/20 text-left hover:bg-stone-800/50 transition-colors flex items-center justify-between"
              >
                <span className="text-stone-200 text-sm">{ref}</span>
                <Icons.ChevronRight />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      {renderBottomNav()}
    </div>
  );

  // BROWSE
  const renderBrowse = () => (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(165deg, #1a1410 0%, #0d0b09 40%, #151210 100%)" }}>
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-3">
          {(selectedBook || selectedChapter) && (
            <button
              onClick={() => { if (selectedChapter) setSelectedChapter(null); else setSelectedBook(null); }}
              className="w-9 h-9 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
            >
              <Icons.ArrowLeft />
            </button>
          )}
          <h1 className="text-2xl font-light text-stone-100" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {selectedChapter ? `${selectedBook} ${selectedChapter}` : selectedBook || "Library"}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {!selectedBook && (
          <div className="space-y-1.5">
            {books.map(book => (
              <button
                key={book}
                onClick={() => setSelectedBook(book)}
                className="w-full p-3.5 rounded-xl bg-stone-800/20 border border-stone-700/15 text-left hover:bg-stone-800/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/20 flex items-center justify-center text-amber-600/60">
                    <Icons.Book />
                  </div>
                  <span className="text-stone-200">{book}</span>
                </div>
                <span className="text-stone-600 group-hover:text-stone-400 transition-colors"><Icons.ChevronRight /></span>
              </button>
            ))}
          </div>
        )}

        {selectedBook && !selectedChapter && (
          <div>
            {/* Chapter number input */}
            <div className="mb-5">
              <p className="text-stone-400 text-xs tracking-[0.15em] uppercase mb-2">Enter chapter number</p>
              <form onSubmit={(e) => { e.preventDefault(); const n = parseInt(browseChapterNum); if (n > 0) { setSelectedChapter(n); setBrowseChapterNum(""); } }} className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  value={browseChapterNum}
                  onChange={(e) => setBrowseChapterNum(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-stone-800/40 border border-stone-700/30 text-stone-200 placeholder-stone-500 outline-none focus:border-amber-700/50 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #92400e, #b45309)", color: "#fff" }}
                >
                  Go
                </button>
              </form>
            </div>

            {/* Quick-access: embedded chapters */}
            {KJV_DATA[selectedBook] && (
              <>
                <p className="text-stone-400 text-xs tracking-[0.15em] uppercase mb-2">Saved locally</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {Object.keys(KJV_DATA[selectedBook]).sort((a,b) => Number(a) - Number(b)).map(ch => (
                    <button
                      key={ch}
                      onClick={() => setSelectedChapter(Number(ch))}
                      className="aspect-square rounded-xl bg-stone-800/30 border border-stone-700/20 flex items-center justify-center text-stone-300 text-lg hover:bg-amber-900/20 hover:border-amber-800/30 hover:text-amber-400 transition-all"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {selectedBook && selectedChapter && (
          <div className="space-y-3">
            <button
              onClick={() => startPractice(selectedBook, selectedChapter)}
              className="w-full p-4 rounded-xl text-center transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #92400e25, #78350f35)", border: "1px solid #92400e30" }}
            >
              <p className="text-amber-400 font-medium">Practice Entire Chapter</p>
              <p className="text-stone-400 text-xs mt-1">Fetches full chapter from KJV</p>
            </button>

            {/* Show embedded verses if available */}
            {KJV_DATA[selectedBook]?.[selectedChapter] && Object.entries(KJV_DATA[selectedBook][selectedChapter]).sort(([a],[b]) => Number(a) - Number(b)).map(([v, text]) => {
              const ref = `${selectedBook} ${selectedChapter}:${v}`;
              const isFav = favorites.includes(ref);
              const prog = progress[ref];
              return (
                <div key={v} className="p-4 rounded-xl bg-stone-800/20 border border-stone-700/15">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-amber-600/70 text-xs font-medium tracking-wide">v. {v}</span>
                        {prog?.status === "memorized" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">Memorized</span>
                        )}
                        {prog?.status === "learning" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800/30">Learning</span>
                        )}
                      </div>
                      <p className="text-stone-300 text-sm leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        {text}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <button onClick={() => toggleFavorite(ref)} className={`${isFav ? "text-amber-500" : "text-stone-600"} hover:text-amber-400 transition-colors`}>
                        <Icons.Heart filled={isFav} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => startPractice(selectedBook, selectedChapter, Number(v))}
                    className="mt-3 w-full py-2 rounded-lg bg-stone-700/30 text-stone-300 text-sm hover:bg-stone-700/50 transition-colors flex items-center justify-center gap-2"
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
      <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(165deg, #12100d 0%, #0a0908 50%, #110f0c 100%)" }}>
        {/* Top bar */}
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <button
            onClick={() => { stopListening(); stopSpeaking(); setView("home"); }}
            className="w-9 h-9 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-400 hover:text-stone-200 transition-colors"
          >
            <Icons.X />
          </button>
          <div className="text-center">
            <p className="text-amber-600/80 text-xs tracking-[0.15em] uppercase font-medium">{practiceRef}</p>
          </div>
          <button
            onClick={() => toggleFavorite(practiceRef)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${favorites.includes(practiceRef) ? "text-amber-500" : "text-stone-500 hover:text-stone-300"}`}
          >
            <Icons.Heart filled={favorites.includes(practiceRef)} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mx-5 mb-4">
          <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completionPct}%`,
                background: "linear-gradient(90deg, #b45309, #d97706)"
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-stone-500 text-[10px]">Segment {currentSegment + 1} of {practiceSegments.length}</span>
            <span className="text-stone-500 text-[10px]">{completionPct}%</span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mx-5 mb-5 flex gap-1.5 p-1 rounded-xl bg-stone-800/30">
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
              className={`flex-1 py-2 px-1.5 rounded-lg text-[11px] font-medium transition-all flex flex-col items-center gap-1 ${
                practiceMode === mode.id
                  ? "bg-amber-900/40 text-amber-400 border border-amber-800/30"
                  : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <span className="opacity-70">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Scripture display */}
        <div className="flex-1 px-5 flex flex-col items-center justify-center">
          <div className="max-w-lg w-full text-center">
            {renderHighlightedText()}
            
            {/* Match indicator */}
            {(practiceMode === "recall" || practiceMode === "faded") && alignmentResult && (
              <div className="mt-6">
                <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${matchPct}%`,
                      background: matchPct >= 90 ? "#16a34a" : matchPct >= 60 ? "#d97706" : "#dc2626"
                    }}
                  />
                </div>
                <p className="text-stone-500 text-xs mt-1.5">{matchPct}% matched</p>
              </div>
            )}

            {/* Spoken text display */}
            {spokenText && (practiceMode === "recall" || practiceMode === "faded") && (
              <div className="mt-5 p-3 rounded-xl bg-stone-800/20 border border-stone-700/15">
                <p className="text-stone-400 text-xs tracking-wider uppercase mb-1">What I heard</p>
                <p className="text-stone-300 text-sm italic">{spokenText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Coach message */}
        {coachMessage && (
          <div className="mx-5 mb-3 p-3.5 rounded-xl" style={{ background: "linear-gradient(135deg, #1c1917, #1a1510)", border: "1px solid #292524" }}>
            <p className="text-stone-300 text-sm leading-relaxed text-center" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {coachMessage}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="px-5 pb-8">
          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={prevSegment}
              disabled={currentSegment === 0}
              className="w-10 h-10 rounded-full bg-stone-800/40 flex items-center justify-center text-stone-400 hover:text-stone-200 disabled:opacity-30 transition-all"
            >
              <Icons.SkipBack />
            </button>

            {/* Main action button */}
            {practiceMode === "listen" && (
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speak(currentSegmentText)}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{
                  background: isSpeaking
                    ? "linear-gradient(135deg, #7c2d12, #9a3412)"
                    : "linear-gradient(135deg, #92400e, #b45309)",
                  boxShadow: "0 4px 20px rgba(180, 83, 9, 0.3)"
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
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #92400e, #b45309)",
                  boxShadow: "0 4px 20px rgba(180, 83, 9, 0.3)"
                }}
              >
                <Icons.Volume />
              </button>
            )}

            {(practiceMode === "recall" || practiceMode === "faded") && (
              <button
                onClick={() => isListening ? stopListening() : startListening()}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                  isListening ? "animate-pulse" : ""
                }`}
                style={{
                  background: isListening
                    ? "linear-gradient(135deg, #dc2626, #ef4444)"
                    : "linear-gradient(135deg, #92400e, #b45309)",
                  boxShadow: isListening
                    ? "0 4px 30px rgba(220, 38, 38, 0.4)"
                    : "0 4px 20px rgba(180, 83, 9, 0.3)"
                }}
              >
                {isListening ? <Icons.MicOff /> : <Icons.Mic />}
              </button>
            )}

            <button
              onClick={nextSegment}
              disabled={currentSegment >= practiceSegments.length - 1}
              className="w-10 h-10 rounded-full bg-stone-800/40 flex items-center justify-center text-stone-400 hover:text-stone-200 disabled:opacity-30 transition-all"
            >
              <Icons.SkipFwd />
            </button>
          </div>

          {/* Secondary controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={requestHelp}
              className="px-4 py-2 rounded-lg bg-stone-800/30 text-stone-400 text-xs tracking-wider hover:text-stone-200 hover:bg-stone-800/50 transition-all uppercase"
            >
              Help me
            </button>
            <button
              onClick={() => speak(currentSegmentText, 0.6)}
              className="px-4 py-2 rounded-lg bg-stone-800/30 text-stone-400 text-xs tracking-wider hover:text-stone-200 hover:bg-stone-800/50 transition-all uppercase"
            >
              Read slowly
            </button>
            <button
              onClick={() => {
                setSpokenText("");
                setAlignmentResult(null);
                setCoachMessage("Let's try that segment again.");
              }}
              className="px-4 py-2 rounded-lg bg-stone-800/30 text-stone-400 text-xs tracking-wider hover:text-stone-200 hover:bg-stone-800/50 transition-all uppercase"
            >
              Reset
            </button>
          </div>

          {/* Continuous mode toggle + TTS speed */}
          <div className="mt-4 flex items-center justify-center gap-5">
            <button
              onClick={() => setContinuousMode(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-wider uppercase transition-all ${
                continuousMode
                  ? "bg-amber-900/30 text-amber-400 border border-amber-800/30"
                  : "bg-stone-800/30 text-stone-500 border border-stone-700/20"
              }`}
            >
              <Icons.Repeat />
              Continuous
            </button>
            <div className="flex items-center gap-2">
              <span className="text-stone-500 text-[10px] tracking-wider">SLOW</span>
              <input
                type="range"
                min="0.5"
                max="1.2"
                step="0.05"
                value={ttsRate}
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-stone-500 text-[10px] tracking-wider">FAST</span>
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
      <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(165deg, #1a1410 0%, #0d0b09 40%, #151210 100%)" }}>
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-2xl font-light text-stone-100" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Your Progress
          </h1>
        </div>

        {/* Stats */}
        <div className="mx-5 mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Memorized", value: memorizedCount, color: "#16a34a" },
            { label: "Learning", value: learningCount, color: "#d97706" },
            { label: "Total", value: totalCount, color: "#a8a29e" },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-stone-800/20 border border-stone-700/15 text-center">
              <p className="text-2xl font-light" style={{ color: stat.color, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-stone-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto px-5 pb-24">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-stone-600 mb-3">
                <Icons.Book />
              </div>
              <p className="text-stone-400 text-sm">No passages practiced yet.</p>
              <p className="text-stone-500 text-xs mt-1">Choose a passage to begin your journey.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(([ref, data]) => (
                <button
                  key={ref}
                  onClick={() => {
                    const parts = ref.match(/(.+?)\s+(\d+):?(\d+)?/);
                    if (parts) startPractice(parts[1], Number(parts[2]), parts[3] ? Number(parts[3]) : null);
                  }}
                  className="w-full p-3.5 rounded-xl bg-stone-800/20 border border-stone-700/15 text-left hover:bg-stone-800/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-stone-200 text-sm">{ref}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                          data.status === "memorized"
                            ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/30"
                            : data.status === "learning"
                            ? "bg-amber-900/30 text-amber-400 border-amber-800/30"
                            : "bg-stone-800/30 text-stone-400 border-stone-700/30"
                        }`}>
                          {data.status === "memorized" ? "Memorized" : data.status === "learning" ? "Learning" : "In Progress"}
                        </span>
                        {data.accuracy && (
                          <span className="text-stone-500 text-[10px]">{data.accuracy}% accuracy</span>
                        )}
                      </div>
                    </div>
                    <Icons.ChevronRight />
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #44403c40, transparent)" }} />
      <div className="flex items-center justify-around py-2 pb-5" style={{ background: "linear-gradient(180deg, #1a1410e0, #0d0b09)" }}>
        {[
          { id: "home", label: "Home", icon: <Icons.Home /> },
          { id: "browse", label: "Library", icon: <Icons.Book /> },
          { id: "progress", label: "Progress", icon: <Icons.Chart /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setView(tab.id); if (tab.id === "browse") { setSelectedBook(null); setSelectedChapter(null); } }}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${
              view === tab.id ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] tracking-wider">{tab.label}</span>
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #44403c40; border-radius: 4px; }
        
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
          height: 4px;
          background: #292524;
          border-radius: 4px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #b45309;
          cursor: pointer;
        }
      `}</style>
      
      <div className="min-h-screen text-stone-200" style={{ maxWidth: "430px", margin: "0 auto" }}>
        {view === "home" && renderHome()}
        {view === "browse" && renderBrowse()}
        {view === "practice" && renderPractice()}
        {view === "progress" && renderProgress()}

        {/* Loading overlay */}
        {isLoadingChapter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(10,9,8,0.85)" }}>
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-stone-300 text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Fetching chapter...
              </p>
            </div>
          </div>
        )}

        {/* Settings modal */}
        {showSettings && (
          <div className="fixed inset-0 z-[90] flex items-end justify-center" style={{ background: "rgba(10,9,8,0.7)" }} onClick={() => setShowSettings(false)}>
            <div
              className="w-full rounded-t-2xl p-5 pb-8"
              style={{ maxWidth: "430px", background: "linear-gradient(165deg, #1c1917, #0d0b09)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-stone-700 mx-auto mb-5" />

              <h2 className="text-xl font-light text-stone-100 mb-5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Settings
              </h2>

              {/* TTS Speed */}
              <div className="mb-5">
                <p className="text-stone-400 text-xs tracking-[0.15em] uppercase mb-2">Reading Speed</p>
                <div className="flex items-center gap-3">
                  <span className="text-stone-500 text-[10px] tracking-wider">SLOW</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.05"
                    value={ttsRate}
                    onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-stone-500 text-[10px] tracking-wider">FAST</span>
                  <span className="text-amber-500 text-xs w-8 text-right">{ttsRate.toFixed(2)}x</span>
                </div>
              </div>

              {/* Clear Progress */}
              <div className="mb-3">
                <button
                  onClick={() => {
                    if (window.confirm("Clear all progress? This cannot be undone.")) {
                      setProgress({});
                    }
                  }}
                  className="w-full p-3.5 rounded-xl bg-stone-800/30 border border-stone-700/20 text-left hover:bg-stone-800/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-stone-200 text-sm">Clear Progress</p>
                    <p className="text-stone-500 text-xs mt-0.5">Reset all memorization progress</p>
                  </div>
                  <span className="text-stone-500 text-xs">{Object.keys(progress).length} entries</span>
                </button>
              </div>

              {/* Clear Favorites */}
              <div className="mb-3">
                <button
                  onClick={() => {
                    if (window.confirm("Clear all favorites?")) {
                      setFavorites([]);
                    }
                  }}
                  className="w-full p-3.5 rounded-xl bg-stone-800/30 border border-stone-700/20 text-left hover:bg-stone-800/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-stone-200 text-sm">Clear Favorites</p>
                    <p className="text-stone-500 text-xs mt-0.5">Remove all saved favorites</p>
                  </div>
                  <span className="text-stone-500 text-xs">{favorites.length} saved</span>
                </button>
              </div>

              {/* Clear Chapter Cache */}
              <div className="mb-5">
                <button
                  onClick={() => {
                    if (window.confirm("Clear cached chapters? They will be re-fetched when needed.")) {
                      localStorage.removeItem(CHAPTER_CACHE_KEY);
                    }
                  }}
                  className="w-full p-3.5 rounded-xl bg-stone-800/30 border border-stone-700/20 text-left hover:bg-stone-800/50 transition-colors"
                >
                  <p className="text-stone-200 text-sm">Clear Chapter Cache</p>
                  <p className="text-stone-500 text-xs mt-0.5">Remove downloaded chapters from local storage</p>
                </button>
              </div>

              {/* About */}
              <div className="pt-4 border-t border-stone-800/50 text-center">
                <p className="text-stone-400 text-xs">Scripture Memory</p>
                <p className="text-stone-500 text-[10px] mt-0.5">v0.1.0 · KJV</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
