/* ============================================================
   SECRET MESSAGE SIMULATOR — SCRIPT.JS
   ============================================================ */

'use strict';

/* ── Web Audio Context (lazy init) ── */
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a synthesized blip/click sound.
 * @param {'type'|'seal'|'pop'|'clear'} kind
 */
function playSound(kind) {
  try {
    const ctx = getAudioCtx();

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (kind) {
      case 'type': {
        // Short mechanical click
        osc.type = 'square';
        osc.frequency.setValueAtTime(520 + Math.random() * 180, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.055);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }
      case 'seal': {
        // Rising fanfare chord
        [0, 0.08, 0.16].forEach((offset, i) => {
          const o2   = ctx.createOscillator();
          const g2   = ctx.createGain();
          const freq = [440, 554, 659][i];
          o2.connect(g2);
          g2.connect(ctx.destination);
          o2.type = 'triangle';
          o2.frequency.setValueAtTime(freq, now + offset);
          o2.frequency.exponentialRampToValueAtTime(freq * 1.4, now + offset + 0.18);
          g2.gain.setValueAtTime(0.14, now + offset);
          g2.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.35);
          o2.start(now + offset);
          o2.stop(now + offset + 0.36);
        });
        break;
      }
      case 'pop': {
        // Bouncy pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }
      case 'clear': {
        // Descending sweep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
    }
  } catch (e) {
    // Silently fail if audio is unavailable
  }
}

/* ── DOM References ── */
const messageField   = document.getElementById('messageField');
const toField        = document.getElementById('toField');
const fromField      = document.getElementById('fromField');
const charCount      = document.getElementById('charCount');
const speechText     = document.getElementById('speechText');
const moodBadge      = document.getElementById('moodBadge');
const expressionLabel= document.getElementById('expressionLabel');
const chibiContainer = document.getElementById('chibiContainer');
const sealBtn        = document.getElementById('sealBtn');
const clearBtn       = document.getElementById('clearBtn');
const composeForm    = document.getElementById('composeForm');
const sealedCard     = document.getElementById('sealedCard');
const writeAnotherBtn= document.getElementById('writeAnotherBtn');
const envelopeWrap   = document.getElementById('envelopeWrap');
const envFlap        = document.getElementById('envFlap');
const envHeart       = document.getElementById('envHeart');
const summaryCard    = document.getElementById('summaryCard');
const sumTo          = document.getElementById('sumTo');
const sumFrom        = document.getElementById('sumFrom');
const sumMsg         = document.getElementById('sumMsg');
const sumMood        = document.getElementById('sumMood');

/* ── SVG Face Elements ── */
const faceEls = {
  // Eyes (default)
  leftEyeWhite:       document.querySelector('#leftEye ellipse:nth-child(1)'),
  leftEyePupil:       document.querySelector('#leftEye ellipse:nth-child(2)'),
  leftEyeShine:       document.querySelector('#leftEye ellipse:nth-child(3)'),
  rightEyeWhite:      document.querySelector('#rightEye ellipse:nth-child(1)'),
  rightEyePupil:      document.querySelector('#rightEye ellipse:nth-child(2)'),
  rightEyeShine:      document.querySelector('#rightEye ellipse:nth-child(3)'),
  // Expression overlays
  leftEyeHappy:       document.getElementById('leftEyeHappy'),
  rightEyeHappy:      document.getElementById('rightEyeHappy'),
  leftEyeHeart:       document.getElementById('leftEyeHeart'),
  rightEyeHeart:      document.getElementById('rightEyeHeart'),
  leftEyeShocked:     document.getElementById('leftEyeShocked'),
  leftEyeShockedPupil:document.getElementById('leftEyeShockedPupil'),
  rightEyeShocked:    document.getElementById('rightEyeShocked'),
  rightEyeShockedPupil:document.getElementById('rightEyeShockedPupil'),
  leftBrowAngry:      document.getElementById('leftBrowAngry'),
  rightBrowAngry:     document.getElementById('rightBrowAngry'),
  leftBrowThink:      document.getElementById('leftBrowThink'),
  rightBrowThink:     document.getElementById('rightBrowThink'),
  // Mouth
  mouthHappy:         document.getElementById('mouthHappy'),
  mouthSad:           document.getElementById('mouthSad'),
  mouthShocked:       document.getElementById('mouthShocked'),
  mouthAngry:         document.getElementById('mouthAngry'),
  mouthThink:         document.getElementById('mouthThink'),
  // Extras
  blushLeft:          document.getElementById('blushLeft'),
  blushRight:         document.getElementById('blushRight'),
  tearsGroup:         document.getElementById('tearsGroup'),
  thinkBubble:        document.getElementById('thinkBubble'),
};

/* ── Expression Definitions ── */
const EXPRESSIONS = {
  happy: {
    label: '✨ HAPPY ✨',
    badge: '😊 HAPPY',
    badgeClass: '',
    speech: [
      'Hehe~ so happy!',
      'Writing with love!',
      'Yay! Sending it~',
      'This is fun!',
    ],
    face: {
      leftEyeHeart: 0, rightEyeHeart: 0,
      leftEyeShocked: 0, leftEyeShockedPupil: 0,
      rightEyeShocked: 0, rightEyeShockedPupil: 0,
      leftBrowAngry: 0, rightBrowAngry: 0,
      leftBrowThink: 0, rightBrowThink: 0,
      mouthHappy: 1, mouthSad: 0, mouthShocked: 0, mouthAngry: 0, mouthThink: 0,
      blushLeft: 0, blushRight: 0,
      tearsGroup: 0, thinkBubble: 0,
      leftEyeHappy: 0, rightEyeHappy: 0,
      // default eyes visible
      leftEyeWhite: 1, leftEyePupil: 1, leftEyeShine: 1,
      rightEyeWhite: 1, rightEyePupil: 1, rightEyeShine: 1,
    },
  },
  love: {
    label: '💖 IN LOVE 💖',
    badge: '💖 IN LOVE',
    badgeClass: 'mood-love',
    speech: [
      'My heart is fluttering!',
      'Love love love~!',
      'You make me blush!',
      'Eek! So romantic!',
    ],
    face: {
      leftEyeHeart: 1, rightEyeHeart: 1,
      leftEyeShocked: 0, leftEyeShockedPupil: 0,
      rightEyeShocked: 0, rightEyeShockedPupil: 0,
      leftBrowAngry: 0, rightBrowAngry: 0,
      leftBrowThink: 0, rightBrowThink: 0,
      mouthHappy: 1, mouthSad: 0, mouthShocked: 0, mouthAngry: 0, mouthThink: 0,
      blushLeft: 1, blushRight: 1,
      tearsGroup: 0, thinkBubble: 0,
      leftEyeHappy: 0, rightEyeHappy: 0,
      leftEyeWhite: 1, leftEyePupil: 0, leftEyeShine: 0,
      rightEyeWhite: 1, rightEyePupil: 0, rightEyeShine: 0,
    },
  },
  sad: {
    label: '😢 FEELING SAD 😢',
    badge: '😢 SAD',
    badgeClass: 'mood-sad',
    speech: [
      'Don\'t go... please.',
      'My heart aches...',
      'I\'ll miss you so much.',
      'Please don\'t cry...',
    ],
    face: {
      leftEyeHeart: 0, rightEyeHeart: 0,
      leftEyeShocked: 0, leftEyeShockedPupil: 0,
      rightEyeShocked: 0, rightEyeShockedPupil: 0,
      leftBrowAngry: 0, rightBrowAngry: 0,
      leftBrowThink: 0, rightBrowThink: 0,
      mouthHappy: 0, mouthSad: 1, mouthShocked: 0, mouthAngry: 0, mouthThink: 0,
      blushLeft: 0, blushRight: 0,
      tearsGroup: 1, thinkBubble: 0,
      leftEyeHappy: 0, rightEyeHappy: 0,
      leftEyeWhite: 1, leftEyePupil: 1, leftEyeShine: 1,
      rightEyeWhite: 1, rightEyePupil: 1, rightEyeShine: 1,
    },
  },
  shocked: {
    label: '😲 SHOCKED!! 😲',
    badge: '😲 SHOCKED!',
    badgeClass: 'mood-shocked',
    speech: [
      'W-WHAT?! No way!!',
      'OMG OMG OMG!!',
      'I can\'t believe it!',
      'This is impossible!',
    ],
    face: {
      leftEyeHeart: 0, rightEyeHeart: 0,
      leftEyeShocked: 1, leftEyeShockedPupil: 1,
      rightEyeShocked: 1, rightEyeShockedPupil: 1,
      leftBrowAngry: 0, rightBrowAngry: 0,
      leftBrowThink: 0, rightBrowThink: 0,
      mouthHappy: 0, mouthSad: 0, mouthShocked: 1, mouthAngry: 0, mouthThink: 0,
      blushLeft: 0, blushRight: 0,
      tearsGroup: 0, thinkBubble: 0,
      leftEyeHappy: 0, rightEyeHappy: 0,
      leftEyeWhite: 0, leftEyePupil: 0, leftEyeShine: 0,
      rightEyeWhite: 0, rightEyePupil: 0, rightEyeShine: 0,
    },
  },
  angry: {
    label: '😤 ANGRY!! 😤',
    badge: '😤 ANGRY!',
    badgeClass: 'mood-angry',
    speech: [
      'GRRRR! So annoying!',
      'I\'m not happy right now!',
      'Ugh!! Seriously?!',
      'That makes me so mad!',
    ],
    face: {
      leftEyeHeart: 0, rightEyeHeart: 0,
      leftEyeShocked: 0, leftEyeShockedPupil: 0,
      rightEyeShocked: 0, rightEyeShockedPupil: 0,
      leftBrowAngry: 1, rightBrowAngry: 1,
      leftBrowThink: 0, rightBrowThink: 0,
      mouthHappy: 0, mouthSad: 0, mouthShocked: 0, mouthAngry: 1, mouthThink: 0,
      blushLeft: 1, blushRight: 1,
      tearsGroup: 0, thinkBubble: 0,
      leftEyeHappy: 0, rightEyeHappy: 0,
      leftEyeWhite: 1, leftEyePupil: 1, leftEyeShine: 1,
      rightEyeWhite: 1, rightEyePupil: 1, rightEyeShine: 1,
    },
  },
  thinking: {
    label: '🤔 THINKING... 🤔',
    badge: '🤔 THINKING',
    badgeClass: 'mood-thinking',
    speech: [
      'Hmm... let me think...',
      'Maybe... perhaps...',
      'I\'m pondering this~',
      'Hmmmm...',
    ],
    face: {
      leftEyeHeart: 0, rightEyeHeart: 0,
      leftEyeShocked: 0, leftEyeShockedPupil: 0,
      rightEyeShocked: 0, rightEyeShockedPupil: 0,
      leftBrowAngry: 0, rightBrowAngry: 0,
      leftBrowThink: 1, rightBrowThink: 1,
      mouthHappy: 0, mouthSad: 0, mouthShocked: 0, mouthAngry: 0, mouthThink: 1,
      blushLeft: 0, blushRight: 0,
      tearsGroup: 0, thinkBubble: 1,
      leftEyeHappy: 0, rightEyeHappy: 0,
      leftEyeWhite: 1, leftEyePupil: 1, leftEyeShine: 1,
      rightEyeWhite: 1, rightEyePupil: 1, rightEyeShine: 1,
    },
  },
};

/* ── Keyword → Expression map ── */
const KEYWORD_MAP = [
  { pattern: /\b(love|cute|marry|hug|kiss|adore|darling|sweetheart)\b/i, expr: 'love' },
  { pattern: /\b(miss you|sad|goodbye|cry|tears|lonely|farewell|crying)\b/i, expr: 'sad' },
  { pattern: /\b(wow|omg|oh my god|impossible|unbelievable|no way|shocking)\b/i, expr: 'shocked' },
  { pattern: /\b(hate|annoying|stupid|awful|terrible|worst|rage|angry|mad)\b/i, expr: 'angry' },
  { pattern: /\b(think|maybe|perhaps|ponder|wonder|hmm|consider|possibly)\b/i, expr: 'thinking' },
];

/* ── State ── */
let currentExpression = 'happy';
let typingTimeout     = null;
let lastTypedTime     = 0;
let speechPhraseIndex = 0;
let sealAnimRunning   = false;

/* ── Apply expression to SVG ── */
function applyExpression(name) {
  if (name === currentExpression) return;
  currentExpression = name;

  const expr  = EXPRESSIONS[name];
  const faceOp = expr.face;

  // Apply opacity values
  Object.entries(faceOp).forEach(([elKey, val]) => {
    const el = faceEls[elKey];
    if (el) el.style.opacity = val;
  });

  // CSS state class on container
  const states = ['happy','love','sad','shocked','angry','thinking'];
  chibiContainer.classList.remove(...states.map(s => `state-${s}`));
  chibiContainer.classList.add(`state-${name}`);

  // Expression label
  expressionLabel.textContent = expr.label;
  expressionLabel.className = `expression-label state-${name}`;

  // Mood badge
  moodBadge.textContent = expr.badge;
  moodBadge.className = `mood-badge ${expr.badgeClass}`;
}

/* ── Random speech phrase ── */
function getSpeechPhrase(name) {
  const phrases = EXPRESSIONS[name].speech;
  speechPhraseIndex = (speechPhraseIndex + 1) % phrases.length;
  return phrases[speechPhraseIndex];
}

/* ── Update speech bubble ── */
function updateSpeech(text) {
  if (text.trim().length === 0) {
    speechText.textContent = 'Type a message...';
    return;
  }
  // Show last 28 chars of typed text or an expression phrase
  if (text.length < 6) {
    speechText.textContent = text;
  } else {
    speechText.textContent = getSpeechPhrase(currentExpression);
  }
}

/* ── Detect mood from text ── */
function detectMood(text) {
  for (const { pattern, expr } of KEYWORD_MAP) {
    if (pattern.test(text)) return expr;
  }
  return 'happy';
}

/* ── Trigger typing bounce ── */
let bounceTO = null;
function triggerBounce() {
  chibiContainer.classList.remove('typing');
  void chibiContainer.offsetWidth; // reflow
  chibiContainer.classList.add('typing');
  clearTimeout(bounceTO);
  bounceTO = setTimeout(() => chibiContainer.classList.remove('typing'), 400);
}

/* ── Main typing handler ── */
messageField.addEventListener('input', () => {
  const text = messageField.value;
  charCount.textContent = text.length;

  // Play type sound (throttled)
  const now = Date.now();
  if (now - lastTypedTime > 80) {
    playSound('type');
    lastTypedTime = now;
  }

  // Bounce
  triggerBounce();

  // Detect mood
  const mood = detectMood(text);
  applyExpression(mood);

  // Update speech
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => updateSpeech(text), 200);
});

/* ── Also react to To/From fields ── */
[toField, fromField].forEach(field => {
  field.addEventListener('input', () => {
    const now = Date.now();
    if (now - lastTypedTime > 80) {
      playSound('type');
      lastTypedTime = now;
    }
  });
});

/* ── CLEAR BUTTON ── */
clearBtn.addEventListener('click', () => {
  playSound('clear');
  messageField.value = '';
  toField.value      = '';
  fromField.value    = '';
  charCount.textContent = '0';
  speechText.textContent = 'Type a message...';
  applyExpression('happy');
});

/* ── SEAL BUTTON ── */
sealBtn.addEventListener('click', () => {
  if (sealAnimRunning) return;

  const to   = toField.value.trim()      || 'Secret Admirer';
  const from = fromField.value.trim()    || 'Mystery Sender';
  const msg  = messageField.value.trim() || '( No message written... )';
  const mood = currentExpression;

  playSound('seal');
  sealAnimRunning = true;

  // Populate summary
  sumTo.textContent   = to;
  sumFrom.textContent = from;
  sumMsg.textContent  = msg;
  sumMood.textContent = `Mood: ${EXPRESSIONS[mood].badge}`;

  // Hide compose, show sealed
  composeForm.style.display = 'none';
  sealedCard.style.display  = 'flex';

  // Reset envelope state
  envelopeWrap.classList.remove('animate');
  envFlap.classList.remove('open');
  envHeart.classList.remove('sealed');
  summaryCard.style.opacity   = '0';
  summaryCard.style.transform = 'translateY(20px)';

  // Step 1: Envelope appears
  requestAnimationFrame(() => {
    envelopeWrap.classList.add('animate');
  });

  // Step 2: Flap opens briefly
  setTimeout(() => {
    envFlap.classList.add('open');
    playSound('pop');
  }, 500);

  // Step 3: Flap closes (sealed)
  setTimeout(() => {
    envFlap.classList.remove('open');
  }, 1100);

  // Step 4: Heart sticker pops on
  setTimeout(() => {
    envHeart.classList.add('sealed');
    playSound('pop');
  }, 1500);

  // Step 5: Summary card slides in
  setTimeout(() => {
    summaryCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    summaryCard.style.opacity    = '1';
    summaryCard.style.transform  = 'translateY(0)';
    sealAnimRunning = false;

    // Chibi reacts
    applyExpression('love');
    speechText.textContent = 'Your secret is sealed! 💌';
  }, 1900);
});

/* ── WRITE ANOTHER BUTTON ── */
writeAnotherBtn.addEventListener('click', () => {
  playSound('pop');

  // Reset
  sealedCard.style.display  = 'none';
  composeForm.style.display = 'flex';
  messageField.value = '';
  toField.value      = '';
  fromField.value    = '';
  charCount.textContent  = '0';
  speechText.textContent = 'Type a message...';
  applyExpression('happy');
  sealAnimRunning = false;
});

/* ── Window control buttons (cosmetic) ── */
document.querySelector('.wbtn-min').addEventListener('click', () => playSound('pop'));
document.querySelector('.wbtn-max').addEventListener('click', () => playSound('pop'));
document.querySelector('.wbtn-close').addEventListener('click', () => {
  playSound('clear');
  // Playful shake
  const win = document.querySelector('.retro-window');
  win.style.transition = 'transform 0.1s';
  let i = 0;
  const shake = setInterval(() => {
    win.style.transform = i % 2 === 0 ? 'translateX(-6px)' : 'translateX(6px)';
    i++;
    if (i > 7) { clearInterval(shake); win.style.transform = ''; }
  }, 60);
});

/* ── Init ── */
applyExpression('happy');
