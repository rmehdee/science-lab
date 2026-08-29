/* Science Lab content.
   Every topic maps to a Florida NGSSS science benchmark and holds a pool of
   questions, so a child practising the same standard twice does not meet the
   same item. A generator returns: { q, a, choices[], why, sub?, visual? }   */

const R = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

/* A pool item is { q, a, w:[wrong...], why, sub?, vis? }. This turns one into
   a question, shuffling the choices and keeping the picture if there is one. */
function fromPool(pool) {
  const it = pick(pool);
  const choices = shuffle([it.a, ...it.w]).slice(0, 4);
  if (!choices.includes(it.a)) choices[0] = it.a;
  return { q: it.q, a: it.a, choices: shuffle(choices), why: it.why, sub: it.sub, visual: it.vis ? it.vis() : undefined };
}

/* ---------------------------------------------------- pictures for kids */
function svgWrap(inner, w, h, maxW) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${maxW || w}px;height:auto" role="img" aria-hidden="true">${inner}</svg>`;
}
const PHONE_W = 258;
function sf(vbw, px) { return Math.max(px, Math.round(px * vbw / PHONE_W)); }

/* A flowering plant with its four major parts, SC.1.L.14.2 and SC.3.L.14.1. */
function svgPlant(labels) {
  const w = 250, h = 220;
  let out = `<line x1="125" y1="70" x2="125" y2="160" stroke="#12885A" stroke-width="7" stroke-linecap="round"/>`;
  out += `<path d="M125 105 q-38 -22 -52 4 q34 20 52 -4Z" fill="#3FBF8F" stroke="#12885A" stroke-width="2.5"/>`;
  out += `<path d="M125 130 q38 -22 52 4 q-34 20 -52 -4Z" fill="#3FBF8F" stroke="#12885A" stroke-width="2.5"/>`;
  for (let i = -2; i <= 2; i++) {
    const a = i * 0.45;
    out += `<line x1="125" y1="160" x2="${125 + Math.sin(a) * 46}" y2="${160 + 42 * Math.cos(a) * 0.9}" stroke="#8B5E34" stroke-width="4" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    out += `<ellipse cx="${125 + Math.cos(a) * 20}" cy="${58 + Math.sin(a) * 20}" rx="11" ry="11" fill="#FF6FB0" stroke="#C6274B" stroke-width="2"/>`;
  }
  out += `<circle cx="125" cy="58" r="9" fill="#FFB020" stroke="#A9803A" stroke-width="2"/>`;
  if (labels) {
    const L = (x, y, t) => `<text x="${x}" y="${y}" font-size="${sf(w, 13)}" font-weight="800" fill="#17203A">${t}</text>`;
    out += L(158, 44, 'flower') + L(186, 118, 'leaf') + L(142, 150, 'stem') + L(140, 205, 'roots');
  }
  return svgWrap(out, w, h, 260);
}

/* A food chain: sun to producer to consumers, SC.4.L.17.3. */
function svgFoodChain(items) {
  const boxW = 78, gap = 26, h = 96;
  const w = items.length * boxW + (items.length - 1) * gap + 16;
  let out = '';
  items.forEach((it, i) => {
    const x = 8 + i * (boxW + gap);
    out += `<rect x="${x}" y="20" width="${boxW}" height="52" rx="10" fill="#EEF3FF" stroke="#2563EB" stroke-width="2.5"/>`;
    out += `<text x="${x + boxW / 2}" y="46" font-size="${sf(w, 20)}" text-anchor="middle">${it.icon}</text>`;
    out += `<text x="${x + boxW / 2}" y="64" font-size="${sf(w, 10)}" font-weight="800" fill="#17203A" text-anchor="middle">${it.name}</text>`;
    if (i < items.length - 1) {
      const ax = x + boxW + 4;
      out += `<line x1="${ax}" y1="46" x2="${ax + gap - 8}" y2="46" stroke="#C6274B" stroke-width="3"/>`;
      out += `<path d="M${ax + gap - 8} 46 l-7 -5 v10 z" fill="#C6274B"/>`;
    }
  });
  return svgWrap(out, w, h, 420);
}

/* Solid, liquid and gas as particle diagrams, SC.2.P.8.2 and SC.5.P.8.1. */
function svgStates(which) {
  const w = 150, h = 150;
  const box = `<rect x="18" y="18" width="114" height="114" rx="8" fill="#F7F9FF" stroke="#17203A" stroke-width="3"/>`;
  let dots = '';
  if (which === 'solid') {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
      dots += `<circle cx="${36 + c * 26}" cy="${36 + r * 26}" r="9" fill="#2563EB"/>`;
  } else if (which === 'liquid') {
    const pts = [[40, 92], [64, 100], [88, 92], [112, 100], [48, 116], [76, 118], [104, 114], [58, 74], [92, 76]];
    dots = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#2563EB"/>`).join('');
  } else {
    const pts = [[36, 40], [92, 32], [120, 60], [44, 84], [80, 70], [110, 108], [56, 118], [96, 104], [28, 112]];
    dots = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#2563EB"/>`).join('');
  }
  return svgWrap(box + dots, w, h, 170);
}

/* The water cycle as a labelled loop, SC.5.E.7.1. */
function svgWaterCycle(highlight) {
  const w = 320, h = 190;
  const on = (k) => highlight === k ? '#C6274B' : '#2563EB';
  let out = `<circle cx="44" cy="34" r="18" fill="#FFB020" stroke="#A9803A" stroke-width="2"/>`;
  out += `<ellipse cx="196" cy="44" rx="52" ry="24" fill="#DCE7FF" stroke="${on('condensation')}" stroke-width="3"/>`;
  out += `<rect x="0" y="148" width="${w}" height="42" fill="#CDEAFB" stroke="${on('collection')}" stroke-width="3"/>`;
  out += `<path d="M96 140 q6 -50 44 -74" fill="none" stroke="${on('evaporation')}" stroke-width="4" stroke-dasharray="8 6"/>`;
  out += `<path d="M140 66 l-4 -12 l12 3 z" fill="${on('evaporation')}"/>`;
  for (let i = 0; i < 5; i++) out += `<line x1="${168 + i * 16}" y1="70" x2="${162 + i * 16}" y2="${104}" stroke="${on('precipitation')}" stroke-width="3.5" stroke-linecap="round"/>`;
  const L = (x, y, t, k) => `<text x="${x}" y="${y}" font-size="${sf(w, 11)}" font-weight="800" fill="${on(k)}" text-anchor="middle">${t}</text>`;
  out += L(74, 118, 'evaporation', 'evaporation') + L(196, 40, 'condensation', 'condensation')
       + L(212, 124, 'precipitation', 'precipitation') + L(52, 176, 'collection', 'collection');
  return svgWrap(out, w, h, 360);
}

/* The eight phases of the Moon, or one of them, SC.4.E.5.4. */
function svgMoon(phase) {
  const w = 130, h = 130, cx = 65, cy = 65, r = 48;
  let lit = '';
  if (phase === 'new') lit = '';
  else if (phase === 'full') lit = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FCF2E1"/>`;
  else if (phase === 'first quarter') lit = `<path d="M${cx} ${cy - r} a${r} ${r} 0 0 1 0 ${r * 2} z" fill="#FCF2E1"/>`;
  else if (phase === 'last quarter') lit = `<path d="M${cx} ${cy - r} a${r} ${r} 0 0 0 0 ${r * 2} z" fill="#FCF2E1"/>`;
  else if (phase === 'crescent') lit = `<path d="M${cx} ${cy - r} a${r} ${r} 0 0 1 0 ${r * 2} a${r * 0.85} ${r} 0 0 0 0 ${-r * 2} z" fill="#FCF2E1"/>`;
  else lit = `<path d="M${cx} ${cy - r} a${r} ${r} 0 0 1 0 ${r * 2} a${r * 0.5} ${r} 0 0 1 0 ${-r * 2} z" fill="#FCF2E1"/>`;
  return svgWrap(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2A2350" stroke="#17203A" stroke-width="3"/>${lit}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#17203A" stroke-width="3"/>`, w, h, 150);
}

/* A magnet attracting or repelling, SC.2.P.13.2. */
function svgMagnet(mode) {
  const w = 260, h = 110;
  const bar = (x, flip) => `<rect x="${x}" y="34" width="46" height="34" fill="${flip ? '#2563EB' : '#C6274B'}"/>`
    + `<rect x="${x + 46}" y="34" width="46" height="34" fill="${flip ? '#C6274B' : '#2563EB'}"/>`
    + `<rect x="${x}" y="34" width="92" height="34" fill="none" stroke="#17203A" stroke-width="2.5"/>`
    + `<text x="${x + 23}" y="57" font-size="${sf(w, 15)}" font-weight="800" fill="#fff" text-anchor="middle">${flip ? 'S' : 'N'}</text>`
    + `<text x="${x + 69}" y="57" font-size="${sf(w, 15)}" font-weight="800" fill="#fff" text-anchor="middle">${flip ? 'N' : 'S'}</text>`;
  let out = bar(14, false) + bar(154, mode === 'repel');
  const ar = (x1, x2) => `<line x1="${x1}" y1="88" x2="${x2}" y2="88" stroke="#12885A" stroke-width="3"/><path d="M${x2} 88 l${x2 > x1 ? -8 : 8} -5 v10 z" fill="#12885A"/>`;
  out += mode === 'repel' ? ar(112, 78) + ar(148, 182) : ar(112, 146) + ar(148, 114);
  return svgWrap(out, w, h, 300);
}

/* A butterfly or bean life cycle as four stages, SC.2.L.16.1. */
function svgCycle(stages) {
  const n = stages.length, box = 62, gap = 24;
  const w = n * box + (n - 1) * gap + 16, h = 132;
  let out = '';
  stages.forEach((s, i) => {
    const x = 8 + i * (box + gap);
    out += `<circle cx="${x + box / 2}" cy="40" r="26" fill="#EEF3FF" stroke="#2563EB" stroke-width="2.5"/>`;
    out += `<text x="${x + box / 2}" y="49" font-size="${sf(w, 21)}" text-anchor="middle">${s.icon}</text>`;
    out += `<text x="${x + box / 2}" y="82" font-size="${sf(w, 11)}" font-weight="800" fill="#17203A" text-anchor="middle">${s.name}</text>`;
    if (i < n - 1) {
      const ax = x + box + 2;
      out += `<line x1="${ax}" y1="40" x2="${ax + gap - 6}" y2="40" stroke="#C6274B" stroke-width="3"/>`;
      out += `<path d="M${ax + gap - 6} 40 l-7 -5 v10 z" fill="#C6274B"/>`;
    }
  });
  // the loop back to the start, so it reads as a cycle rather than a line
  const x0 = 8 + box / 2, x1 = 8 + (n - 1) * (box + gap) + box / 2;
  out += `<path d="M${x1} 96 q0 24 ${-(x1 - x0) / 2} 24 q${-(x1 - x0) / 2} 0 ${-(x1 - x0) / 2} -24" fill="none" stroke="#12885A" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  out += `<path d="M${x0} 96 l-5 8 h10 z" fill="#12885A"/>`;
  return svgWrap(out, w, h, 400);
}

/* A simple thermometer, reused from the maths game for SC.2.P.8.5. */
function svgThermo(temp, lo, hi) {
  const w = 110, h = 168, x = 34, top = 12, len = 118;
  const f = Math.max(0, Math.min(1, (temp - lo) / (hi - lo)));
  let out = `<rect x="${x}" y="${top}" width="16" height="${len}" fill="#EEF3FF" stroke="#17203A" stroke-width="2.5" rx="8"/>`;
  out += `<rect x="${x + 3}" y="${top + len * (1 - f)}" width="10" height="${len * f}" fill="#C6274B"/>`;
  out += `<circle cx="${x + 8}" cy="${top + len + 12}" r="13" fill="#C6274B" stroke="#17203A" stroke-width="2.5"/>`;
  for (let i = 0; i <= 4; i++) {
    const y = top + len - (i / 4) * len;
    out += `<line x1="${x + 16}" y1="${y}" x2="${x + 26}" y2="${y}" stroke="#17203A" stroke-width="2"/>`;
    out += `<text x="${x + 30}" y="${y + 4}" font-size="${sf(w, 11)}" font-weight="700" fill="#5A6683">${Math.round(lo + (hi - lo) * i / 4)}°</text>`;
  }
  return svgWrap(out, w, h, 130);
}

/* ---------------------------------------------------------------- grade 1 */
const G1 = [
  { id: 's1-stars', t: 'Stars in the sky', b: 'SC.1.E.5.1', gen: () => fromPool([
    { q: 'How many stars are in the night sky?', a: 'Too many to count easily', w: ['Exactly one hundred', 'About ten', 'None at all'], why: 'There are far more stars than anyone can easily count, and they are not spread out evenly.' },
    { q: 'Are the stars spread out evenly across the sky?', a: 'No, some parts have more', w: ['Yes, perfectly evenly', 'They are all in one spot', 'There is only one star'], why: 'Stars gather in patches and patterns, so some parts of the sky have many more than others.' },
    { q: 'Why can you see stars at night but not in the daytime?', a: 'The Sun is too bright', w: ['The stars go away', 'The stars turn off', 'Clouds hide them'], why: 'The stars are still there in the day. Sunlight is so bright it hides them.' },
  ]) },
  { id: 's1-gravity', t: 'Gravity pulls things down', b: 'SC.1.E.5.2', gen: () => fromPool([
    { q: 'You drop a ball. Which way does it go?', a: 'Down toward the ground', w: ['Up toward the sky', 'Sideways', 'It stays still'], why: 'Earth’s gravity pulls objects toward the ground, even when nothing is touching them.' },
    { q: 'What makes a leaf fall from a tree to the ground?', a: 'Gravity', w: ['Magnets', 'Sunlight', 'Sound'], why: 'Gravity is the pull from Earth that brings the leaf down.' },
    { q: 'Does gravity need to touch an object to pull it?', a: 'No', w: ['Yes, always', 'Only in water', 'Only at night'], why: 'Gravity works across a distance, so it pulls without touching.' },
  ]) },
  { id: 's1-magnifiers', t: 'Magnifiers', b: 'SC.1.E.5.3', gen: () => fromPool([
    { q: 'What does a magnifying glass do?', a: 'Makes small things look bigger', w: ['Makes things colder', 'Makes things heavier', 'Makes things move'], why: 'A magnifier bends light so small details look larger and easier to see.' },
    { q: 'Which tool would help you see the tiny hairs on a leaf?', a: 'A magnifying glass', w: ['A ruler', 'A scale', 'A thermometer'], why: 'A magnifier makes small things appear bigger, so you can see details your eyes would miss.' },
  ]) },
  { id: 's1-sun', t: 'The Sun helps and harms', b: 'SC.1.E.5.4', gen: () => fromPool([
    { q: 'Which is a helpful thing the Sun does?', a: 'Gives us light and warmth', w: ['Gives us sunburn', 'Makes the ground crack', 'Dries up ponds'], why: 'The Sun lights our days and warms the Earth, which plants and animals need.' },
    { q: 'Which is a harmful thing the Sun can do?', a: 'Burn your skin', w: ['Help plants grow', 'Light up the day', 'Warm the water'], why: 'Too much sunlight burns skin, which is why we wear sunscreen and hats.' },
    { q: 'Why should you never look straight at the Sun?', a: 'It can hurt your eyes', w: ['It is too small', 'It is too far away', 'It is too cold'], why: 'The Sun is so bright that looking at it directly can damage your eyes.' },
  ]) },
  { id: 's1-surface', t: 'What is on Earth’s surface', b: 'SC.1.E.6.1', gen: () => fromPool([
    { q: 'Which of these is found on Earth’s surface?', a: 'Rocks', w: ['Stars', 'The Moon', 'Clouds only'], why: 'Water, rocks, soil and living things are all found on the surface of the Earth.' },
    { q: 'Which one is NOT found on Earth’s surface?', a: 'Stars', w: ['Soil', 'Water', 'Living things'], why: 'Stars are far out in space. Water, rocks, soil and living things are here on Earth.' },
  ]) },
  { id: 's1-water', t: 'Water and staying safe', b: 'SC.1.E.6.2', gen: () => fromPool([
    { q: 'Why do living things need water?', a: 'To stay alive and healthy', w: ['To stay warm at night', 'To see in the dark', 'To make sound'], why: 'Every living thing, including you, needs water to survive.' },
    { q: 'What is the safest way to be near deep water?', a: 'With a grown-up watching', w: ['Alone', 'At night', 'With your eyes closed'], why: 'Water can be dangerous, so an adult should always be watching.' },
  ]) },
  { id: 's1-fastslow', t: 'Fast changes and slow changes', b: 'SC.1.E.6.3', gen: () => fromPool([
    { q: 'Which change happens fast?', a: 'A balloon popping', w: ['A mountain wearing down', 'A tree growing tall', 'A rock turning to sand'], why: 'Some changes happen in a second, while others take years or even longer.' },
    { q: 'Which change happens slowly?', a: 'A tree growing tall', w: ['A glass breaking', 'A light turning on', 'A door slamming'], why: 'A tree takes many years to grow, so that change is slow.' },
  ]) },
  { id: 's1-senses', t: 'Using your five senses', b: 'SC.1.L.14.1', gen: () => fromPool([
    { q: 'Which sense would you use to find out if a flower smells sweet?', a: 'Smell', w: ['Hearing', 'Taste', 'Touch'], why: 'Your nose senses smells, so smell is the right tool for this question.' },
    { q: 'Which sense tells you a rock is rough?', a: 'Touch', w: ['Sight only', 'Hearing', 'Smell'], why: 'Touch tells you about texture, like rough or smooth.' },
    { q: 'How many senses do people use to observe the world?', a: 'Five', w: ['Two', 'Three', 'Ten'], why: 'Sight, hearing, smell, taste and touch make five senses.' },
  ]) },
  { id: 's1-plantparts', t: 'Parts of a plant', b: 'SC.1.L.14.2', gen: () => fromPool([
    { q: 'Which plant part takes in water from the soil?', a: 'Roots', w: ['Flower', 'Leaf', 'Stem'], why: 'Roots reach into the soil and soak up water for the plant.', vis: () => svgPlant(true) },
    { q: 'Which plant part holds the plant up?', a: 'Stem', w: ['Roots', 'Flower', 'Leaf'], why: 'The stem supports the plant and carries water up to the leaves.', vis: () => svgPlant(true) },
    { q: 'Which plant part makes seeds?', a: 'Flower', w: ['Roots', 'Stem', 'Leaf'], why: 'Flowers make seeds so new plants can grow.', vis: () => svgPlant(true) },
    { q: 'Which plant part catches sunlight?', a: 'Leaf', w: ['Roots', 'Stem', 'Seed'], why: 'Leaves are wide and flat so they catch as much sunlight as possible.', vis: () => svgPlant(true) },
  ]) },
  { id: 's1-living', t: 'Living and nonliving', b: 'SC.1.L.14.3', gen: () => fromPool([
    { q: 'Which one is living?', a: 'A tree', w: ['A rock', 'A spoon', 'A cloud'], why: 'Living things grow, need food and water, and can make more of their own kind.' },
    { q: 'Which one is NOT living?', a: 'A rock', w: ['A cat', 'A bean plant', 'A bird'], why: 'A rock does not grow, eat or reproduce, so it is nonliving.' },
    { q: 'What do all living things need?', a: 'Food, water and air', w: ['Toys', 'Batteries', 'Wheels'], why: 'Every living thing needs food, water, air and space to live.' },
  ]) },
  { id: 's1-parents', t: 'Young ones look like parents', b: 'SC.1.L.16.1', gen: () => fromPool([
    { q: 'A puppy grows up to look most like which animal?', a: 'A dog', w: ['A cat', 'A bird', 'A fish'], why: 'Young animals closely resemble their parents.' },
    { q: 'Do all kittens in one litter look exactly the same?', a: 'No, there are small differences', w: ['Yes, identical', 'They look like puppies', 'They have no fur'], why: 'Young ones look like their parents, but there are still small variations between them.' },
    { q: 'Seeds from one sunflower are planted. How will the new plants look?', a: 'Like sunflowers, but not identical to each other', w: ['Exactly identical to each other', 'Like roses', 'Like grass'], why: 'Plants resemble their parents too, and small variations still exist between individuals.' },
    { q: 'An acorn falls from an oak tree. What will grow from it?', a: 'An oak tree', w: ['A pine tree', 'A rose bush', 'A palm tree'], why: 'Offspring closely resemble their parents, so an acorn grows into an oak.' },
  ]) },
  { id: 's1-needs', t: 'What living things need', b: 'SC.1.L.17.1', gen: () => fromPool([
    { q: 'Which of these do all plants and animals need?', a: 'Air, water, food and space', w: ['Only sunlight', 'Only water', 'Nothing at all'], why: 'Every living thing needs air, water, food and space to survive.' },
    { q: 'A plant is put in a dark closet with no water. What will happen?', a: 'It will not survive', w: ['It will grow faster', 'It will turn into an animal', 'Nothing will change'], why: 'Without light and water the plant cannot make food, so it cannot live.' },
  ]) },
  { id: 's1-questions', t: 'Asking science questions', b: 'SC.1.N.1.1', gen: () => fromPool([
    { q: 'You want to know which paper airplane flies farthest. What should you do?', a: 'Fly them and measure', w: ['Guess and stop', 'Ask a friend to decide', 'Pick your favourite colour'], why: 'Scientists test their questions by investigating, not by guessing.' },
    { q: 'What is the best first step when you wonder about something in nature?', a: 'Ask a question you can test', w: ['Write the answer down', 'Forget about it', 'Change the subject'], why: 'Science starts with a question you can actually investigate.' },
  ]) },
  { id: 's1-observe', t: 'Careful observing', b: 'SC.1.N.1.2', gen: () => fromPool([
    { q: 'Which is the better observation of a shell?', a: 'Small, white, rough, curved', w: ['Nice', 'Pretty', 'My favourite'], why: 'A good observation describes what you can see, hear, feel or measure, not how you feel about it.' },
    { q: 'Which of these can you observe with your eyes?', a: 'Colour and shape', w: ['How it tastes', 'How it smells', 'How loud it is'], why: 'Eyes observe colour, shape, size and motion. Other senses do the rest.' },
  ]) },
  { id: 's1-records', t: 'Keeping records', b: 'SC.1.N.1.3', gen: () => fromPool([
    { q: 'Why do scientists write down what they see?', a: 'So they remember it exactly', w: ['To use up paper', 'To keep it secret', 'So they can guess later'], why: 'Records keep the evidence safe, so nothing depends on memory.' },
    { q: 'Which is a good way to record how a plant grows?', a: 'Draw and measure it each week', w: ['Try to remember it', 'Only look once', 'Ask a friend'], why: 'Drawings, notes and measurements made regularly make a reliable record.' },
  ]) },
  { id: 's1-motion', t: 'Ways things move', b: 'SC.1.P.12.1', gen: () => fromPool([
    { q: 'A swing goes forward, then back, then forward again. What kind of motion is that?', a: 'Back and forth', w: ['Straight line', 'Round and round', 'Zigzag'], why: 'Motion that repeats forward then back is called back-and-forth motion.' },
    { q: 'A merry-go-round spins. What kind of motion is that?', a: 'Round and round', w: ['Zigzag', 'Back and forth', 'Straight line'], why: 'Spinning in a circle is round-and-round, or circular, motion.' },
    { q: 'A snake moves side to side as it goes. What kind of motion is that?', a: 'Zigzag', w: ['Straight line', 'Round and round', 'Back and forth'], why: 'Changing direction side to side while moving forward is zigzag motion.' },
  ]) },
  { id: 's1-pushpull', t: 'Pushes and pulls', b: 'SC.1.P.13.1', gen: () => fromPool([
    { q: 'What do you need to do to make a still ball start moving?', a: 'Push it or pull it', w: ['Look at it', 'Talk to it', 'Wait for it'], why: 'A push or a pull is a force, and a force is what changes an object’s motion.' },
    { q: 'Opening a drawer is an example of what?', a: 'A pull', w: ['A push', 'A spin only', 'No force'], why: 'You pull the drawer toward you, so it is a pull.' },
    { q: 'Kicking a football is an example of what?', a: 'A push', w: ['A pull', 'No force', 'A magnet'], why: 'Your foot pushes the ball, which makes it move.' },
  ]) },
  { id: 's1-sort', t: 'Sorting by properties', b: 'SC.1.P.8.1', gen: () => fromPool([
    { q: 'You sort blocks into a red pile and a blue pile. What property did you use?', a: 'Colour', w: ['Weight', 'Texture', 'Temperature'], why: 'Sorting by red and blue means you used colour as the property.' },
    { q: 'Which property means how heavy something is?', a: 'Weight', w: ['Colour', 'Shape', 'Texture'], why: 'Weight tells you how heavy or light an object is.' },
    { q: 'Rough and smooth describe which property?', a: 'Texture', w: ['Colour', 'Weight', 'Temperature'], why: 'Texture is how a surface feels when you touch it.' },
  ]) },
];

/* ---------------------------------------------------------------- grade 2 */
const G2 = [
  { id: 's2-rocks', t: 'Earth is made of rocks', b: 'SC.2.E.6.1', gen: () => fromPool([
    { q: 'What is most of Earth made of?', a: 'Rock', w: ['Wood', 'Plastic', 'Cloth'], why: 'Earth is made up of rock, which comes in many sizes and shapes.' },
    { q: 'Are all rocks the same size and shape?', a: 'No, they vary a lot', w: ['Yes, all identical', 'All are round', 'All are tiny'], why: 'Rocks range from huge boulders to tiny grains of sand.' },
  ]) },
  { id: 's2-soil', t: 'How soil forms', b: 'SC.2.E.6.2', gen: () => fromPool([
    { q: 'What is soil mostly made from?', a: 'Tiny bits of rock and dead plant and animal parts', w: ['Only water', 'Only sand', 'Melted plastic'], why: 'Rock breaks into small pieces and mixes with decayed plant and animal material to form soil.' },
    { q: 'What breaks big rocks into smaller pieces over time?', a: 'Wind and water', w: ['Sunlight only', 'Sound', 'Magnets'], why: 'Wind, water and ice slowly wear rock down into smaller and smaller pieces.' },
  ]) },
  { id: 's2-soiltypes', t: 'Types of soil', b: 'SC.2.E.6.3', gen: () => fromPool([
    { q: 'Which soil has the biggest particles and lets water drain fastest?', a: 'Sand', w: ['Clay', 'Humus', 'Silt'], why: 'Sand grains are large with big gaps, so water runs straight through.' },
    { q: 'Which soil holds water the longest?', a: 'Clay', w: ['Sand', 'Gravel', 'Pebbles'], why: 'Clay particles are tiny and pack tightly, so water is held rather than draining away.' },
    { q: 'Which property helps you tell soils apart?', a: 'Colour and texture', w: ['Loudness', 'Smell only', 'Brightness'], why: 'Soils are classified by colour, texture, how much water they hold and how well plants grow in them.' },
  ]) },
  { id: 's2-patterns', t: 'Patterns in nature', b: 'SC.2.E.7.1', gen: () => fromPool([
    { q: 'Which pattern repeats every year?', a: 'The four seasons', w: ['A rainbow appearing', 'A bird flying past', 'A leaf falling'], why: 'Spring, summer, autumn and winter repeat in the same order every year.' },
    { q: 'Which pattern repeats every day?', a: 'Day and night', w: ['The seasons', 'A year passing', 'A storm'], why: 'Earth spins once a day, so day and night repeat daily.' },
    { q: 'In Florida, which season is usually the hottest?', a: 'Summer', w: ['Winter', 'Autumn', 'Spring'], why: 'Weather patterns repeat, and summer brings the highest temperatures.' },
  ]) },
  { id: 's2-sunwarms', t: 'The Sun warms the Earth', b: 'SC.2.E.7.2', gen: () => fromPool([
    { q: 'What warms the land, water and air?', a: 'Energy from the Sun', w: ['Energy from the Moon', 'Energy from stars at night', 'Wind alone'], why: 'The Sun’s energy heats the land, the water and the air around us.' },
    { q: 'Why is the sand at the beach hotter in the afternoon than at sunrise?', a: 'The Sun has been heating it', w: ['The sand grew', 'The water cooled it', 'The wind stopped'], why: 'The longer the Sun shines on the sand, the more it warms.' },
  ]) },
  { id: 's2-evaporate', t: 'Water disappearing', b: 'SC.2.E.7.3', gen: () => fromPool([
    { q: 'A cup of water is left open on a sunny windowsill for a week. What happens?', a: 'The water level goes down', w: ['The water level rises', 'Nothing changes', 'The water turns to ice'], why: 'The water evaporates into the air, so the level drops.' },
    { q: 'Why does water in a closed jar stay at the same level?', a: 'The water cannot escape', w: ['Water never evaporates', 'The lid makes more water', 'The jar is cold'], why: 'The lid traps the water vapour, so it condenses and returns instead of escaping.' },
    { q: 'What is it called when liquid water turns into a gas and goes into the air?', a: 'Evaporation', w: ['Freezing', 'Melting', 'Raining'], why: 'Evaporation is liquid water changing into water vapour.' },
  ]) },
  { id: 's2-air', t: 'Air and wind', b: 'SC.2.E.7.4', gen: () => fromPool([
    { q: 'What is wind?', a: 'Moving air', w: ['Falling water', 'Spinning rock', 'Bright light'], why: 'Air is all around us, and wind is simply air that is moving.' },
    { q: 'How can you tell air is there even though you cannot see it?', a: 'It moves leaves and flags', w: ['You can taste it', 'It is bright', 'It is loud'], why: 'You see the effects of air when it pushes things around.' },
  ]) },
  { id: 's2-severe', t: 'Getting ready for severe weather', b: 'SC.2.E.7.5', gen: () => fromPool([
    { q: 'You hear thunder outside. What is the safest thing to do?', a: 'Go indoors', w: ['Stand under a tall tree', 'Keep swimming', 'Stay in an open field'], why: 'Lightning is dangerous, and a building is the safest place during a storm.' },
    { q: 'Why do Florida families make a hurricane plan before storm season?', a: 'So everyone knows what to do', w: ['To make the storm smaller', 'To stop the rain', 'To predict the future'], why: 'Preparing ahead means nobody has to work it out during an emergency.' },
  ]) },
  { id: 's2-body', t: 'Parts of the human body', b: 'SC.2.L.14.1', gen: () => fromPool([
    { q: 'Which body part pumps blood around your body?', a: 'Heart', w: ['Brain', 'Lungs', 'Stomach'], why: 'The heart pumps blood to every part of the body.' },
    { q: 'Which body part takes in air when you breathe?', a: 'Lungs', w: ['Stomach', 'Heart', 'Muscles'], why: 'Lungs fill with air so your body can take in oxygen.' },
    { q: 'Which body part helps you think and remember?', a: 'Brain', w: ['Heart', 'Skeleton', 'Stomach'], why: 'The brain controls your thinking, your senses and your movements.' },
    { q: 'Which body part gives your body its shape and protects your organs?', a: 'Skeleton', w: ['Lungs', 'Stomach', 'Skin only'], why: 'Bones form the skeleton, which supports the body and shields the organs inside.' },
    { q: 'Which body part breaks down the food you eat?', a: 'Stomach', w: ['Lungs', 'Brain', 'Skeleton'], why: 'The stomach digests food so the body can use it.' },
  ]) },
  { id: 's2-lifecycle', t: 'Life cycles', b: 'SC.2.L.16.1', gen: () => fromPool([
    { q: 'What comes right after the egg in a butterfly’s life cycle?', a: 'Caterpillar', w: ['Adult butterfly', 'Chrysalis', 'Seed'], why: 'A butterfly goes egg, caterpillar, chrysalis, then adult.',
      vis: () => svgCycle([{ icon: '🥚', name: 'egg' }, { icon: '🐛', name: 'caterpillar' }, { icon: '🛡️', name: 'chrysalis' }, { icon: '🦋', name: 'butterfly' }]) },
    { q: 'What is the last stage of a butterfly’s life cycle?', a: 'Adult butterfly', w: ['Egg', 'Caterpillar', 'Chrysalis'], why: 'The adult butterfly is the final stage, and it lays eggs to begin the cycle again.',
      vis: () => svgCycle([{ icon: '🥚', name: 'egg' }, { icon: '🐛', name: 'caterpillar' }, { icon: '🛡️', name: 'chrysalis' }, { icon: '🦋', name: 'butterfly' }]) },
    { q: 'What does a bean seed grow into first?', a: 'A seedling', w: ['A flower', 'A bean pod', 'Another seed'], why: 'A seed sprouts into a seedling, which grows into a plant that flowers and makes new seeds.',
      vis: () => svgCycle([{ icon: '🫘', name: 'seed' }, { icon: '🌱', name: 'seedling' }, { icon: '🌿', name: 'plant' }, { icon: '🌸', name: 'flower' }]) },
  ]) },
  { id: 's2-needs2', t: 'Needs of living things', b: 'SC.2.L.17.1', gen: () => fromPool([
    { q: 'What do a fish, a fern and a person all need?', a: 'Water', w: ['Shoes', 'Sunglasses', 'A house'], why: 'All living things share basic needs: air, water, food and space.' },
    { q: 'How is what a plant needs different from what an animal needs?', a: 'Plants make their own food', w: ['Plants need no water', 'Plants need no air', 'Plants need no space'], why: 'Both need air, water and space, but plants make their own food from sunlight while animals must eat.' },
  ]) },
  { id: 's2-habitats', t: 'Living things and habitats', b: 'SC.2.L.17.2', gen: () => fromPool([
    { q: 'Why can a polar bear not live in a Florida swamp?', a: 'The swamp does not meet its needs', w: ['It is too small', 'It cannot swim', 'It has no fur'], why: 'Living things are found all over Earth, but each survives only where its needs are met.' },
    { q: 'What is a habitat?', a: 'The place where a living thing gets what it needs', w: ['A kind of food', 'A type of weather', 'A group of animals'], why: 'A habitat provides the food, water, shelter and space an organism needs.' },
    { q: 'Which animal is best suited to living in the ocean?', a: 'A dolphin', w: ['A squirrel', 'A camel', 'An earthworm'], why: 'A dolphin has the body and abilities to get everything it needs in ocean water.' },
  ]) },
  { id: 's2-invest', t: 'Investigating in teams', b: 'SC.2.N.1.1', gen: () => fromPool([
    { q: 'Two groups in your class investigate the same thing and get different answers. What is the best next step?', a: 'Compare how each group did it', w: ['Pick the group with more people', 'Take the higher number', 'Start a completely new topic'], why: 'Groups investigate together and compare, so a difference is something to explain, not to ignore.' },
    { q: 'Your team wants to find out which paper towel soaks up the most water. What should you do first?', a: 'Agree on how you will measure it', w: ['Vote on a favourite brand', 'Pick the prettiest packet', 'Guess and write it down'], why: 'Teams investigate together, and they agree how to measure before they start so everyone works the same way.' },
  ]) },
  { id: 's2-compare', t: 'Comparing observations', b: 'SC.2.N.1.2', gen: () => fromPool([
    { q: 'Two teams measure the same plant with the same ruler and get different answers. What should they do?', a: 'Measure again carefully', w: ['Pick the bigger number', 'Pick the smaller number', 'Stop the experiment'], why: 'When results disagree, scientists check their work and measure again.' },
    { q: 'Why do different groups use the same tools in an experiment?', a: 'So results can be compared fairly', w: ['So it takes longer', 'So results differ', 'So it is harder'], why: 'Using the same tools means any difference in results comes from what is being tested, not the equipment.' },
  ]) },
  { id: 's2-repeat', t: 'Repeating an investigation', b: 'SC.2.N.1.4', gen: () => fromPool([
    { q: 'If you do the same experiment the same way again, what should happen?', a: 'You should get similar results', w: ['You should get opposite results', 'Nothing should happen', 'Results should be random'], why: 'A well-run investigation gives similar results each time it is repeated.' },
    { q: 'Why do scientists repeat their experiments?', a: 'To check the results are reliable', w: ['To waste time', 'To change the answer', 'To use more materials'], why: 'Repeating shows whether a result was real or just a one-off.' },
  ]) },
  { id: 's2-inference', t: 'Observation or inference', b: 'SC.2.N.1.5', gen: () => fromPool([
    { q: 'Which of these is an observation?', a: 'The ground is wet', w: ['It rained last night', 'Someone spilled water', 'A storm is coming'], why: 'An observation is what you sense directly. Saying why the ground is wet is an inference.' },
    { q: 'Which of these is an inference?', a: 'The plant died from lack of water', w: ['The plant is brown', 'The soil is dry', 'The leaves are drooping'], why: 'An inference is an explanation you work out. The brown leaves and dry soil are what you observed.' },
    { q: 'You see paw prints in the mud. Saying "a dog walked here" is what?', a: 'An inference', w: ['An observation', 'A measurement', 'A guess with no evidence'], why: 'The prints are the observation. Concluding what made them is an inference.' },
    { q: 'An empirical observation is something you sense. Which list is right?', a: 'See, hear, feel, smell or taste', w: ['Think, guess, hope or wish', 'Read, write, draw or sing', 'Remember, imagine or dream'], why: 'Empirical means gathered by the senses. What you think about it afterwards is an inference, not an observation.' },
  ]) },
  { id: 's2-scientists', t: 'How scientists work', b: 'SC.2.N.1.6', gen: () => fromPool([
    { q: 'Do scientists usually work alone or with others?', a: 'Both, often in teams', w: ['Always completely alone', 'Never with anyone', 'Only with machines'], why: 'Scientists work alone and in groups, and they share findings so others can check them.' },
    { q: 'What do scientists do when they find a new problem?', a: 'Look for new ways to solve it', w: ['Ignore it', 'Keep it secret', 'Give up'], why: 'Science is always investigating new ways to solve problems.' },
  ]) },
  { id: 's2-energyuse', t: 'How we use energy', b: 'SC.2.P.10.1', gen: () => fromPool([
    { q: 'What do people use to cook food, warm homes and power machines?', a: 'Energy', w: ['Soil', 'Rocks', 'Wind only'], why: 'People use electricity and other forms of energy for cooking, heating, cooling and running machines.' },
    { q: 'Which of these runs on electricity?', a: 'A refrigerator', w: ['A wooden chair', 'A paper book', 'A rock'], why: 'A refrigerator uses electrical energy to keep food cold.' },
  ]) },
  { id: 's2-forces', t: 'Pushes and pulls change motion', b: 'SC.2.P.13.1', gen: () => fromPool([
    { q: 'You push a toy car gently, then hard. Which push makes it go farther?', a: 'The hard push', w: ['The gentle push', 'They go the same', 'Neither moves it'], why: 'A bigger force makes a bigger change in motion.' },
    { q: 'What happens to a rolling ball when you push it from the side?', a: 'It changes direction', w: ['It stops instantly', 'It gets heavier', 'Nothing changes'], why: 'A force can change the speed or the direction of a moving object.' },
  ]) },
  { id: 's2-magnets', t: 'Magnets', b: 'SC.2.P.13.2', gen: () => fromPool([
    { q: 'Can a magnet move a paperclip without touching it?', a: 'Yes', w: ['No, never', 'Only if it is hot', 'Only in water'], why: 'Magnets pull on some metals across a small distance, with no contact needed.', vis: () => svgMagnet('attract') },
    { q: 'Two magnets are pushed together and they push apart. What happened?', a: 'Like poles were facing', w: ['They were both broken', 'They were too cold', 'They were not magnets'], why: 'Two north poles or two south poles repel each other. Opposite poles attract.', vis: () => svgMagnet('repel') },
    { q: 'Which object would a magnet attract?', a: 'A steel nail', w: ['A plastic straw', 'A wooden block', 'A glass marble'], why: 'Magnets attract certain metals such as iron and steel, not plastic, wood or glass.' },
  ]) },
  { id: 's2-gravity2', t: 'Things fall unless held up', b: 'SC.2.P.13.3', gen: () => fromPool([
    { q: 'You let go of a book. What happens?', a: 'It falls to the ground', w: ['It floats', 'It rises', 'It stays put'], why: 'Objects are pulled toward the ground unless something holds them up.' },
    { q: 'Why does a book on a table not fall?', a: 'The table holds it up', w: ['Gravity stopped', 'It is too light', 'It is magnetic'], why: 'Gravity still pulls down, but the table pushes up and holds the book.' },
  ]) },
  { id: 's2-biggerforce', t: 'Bigger force, bigger change', b: 'SC.2.P.13.4', gen: () => fromPool([
    { q: 'Two identical balls are kicked, one softly and one hard. Which travels farther?', a: 'The one kicked hard', w: ['The one kicked softly', 'They tie', 'Neither moves'], why: 'The greater the force, the greater the change in motion.' },
    { q: 'How can you make a wagon speed up more quickly?', a: 'Pull it harder', w: ['Pull it more gently', 'Let go of it', 'Add more weight'], why: 'A larger force produces a larger change in the object’s motion.' },
  ]) },
  { id: 's2-properties', t: 'Measuring properties', b: 'SC.2.P.8.1', gen: () => fromPool([
    { q: 'Which tool measures how heavy an object is?', a: 'A balance or scale', w: ['A ruler', 'A thermometer', 'A clock'], why: 'A balance or scale measures weight. A ruler measures length.' },
    { q: 'Which property describes how a surface feels?', a: 'Texture', w: ['Colour', 'Weight', 'Temperature'], why: 'Texture is whether something is rough, smooth, bumpy or slippery.' },
    { q: 'You drop a cork and a stone into water. What property are you testing?', a: 'Whether they sink or float', w: ['Their colour', 'Their temperature', 'Their smell'], why: 'Sinking or floating in water is one of the properties you can observe about an object.' },
    { q: 'You hold a magnet near a paperclip and a plastic button. What property are you testing?', a: 'Whether a magnet attracts them', w: ['Their weight', 'Their texture', 'Their shape'], why: 'Attraction to a magnet is a property you can observe and use to sort objects.' },
  ]) },
  { id: 's2-states', t: 'Solid, liquid and gas', b: 'SC.2.P.8.2', gen: () => fromPool([
    { q: 'Which state of matter is a rock?', a: 'Solid', w: ['Liquid', 'Gas', 'None of these'], why: 'A rock keeps its own shape, so it is a solid.', vis: () => svgStates('solid') },
    { q: 'Which state of matter is milk?', a: 'Liquid', w: ['Solid', 'Gas', 'None of these'], why: 'Milk flows and takes the shape of its container, so it is a liquid.', vis: () => svgStates('liquid') },
    { q: 'Which state of matter is the air in a balloon?', a: 'Gas', w: ['Solid', 'Liquid', 'None of these'], why: 'Air spreads out to fill whatever holds it, so it is a gas.', vis: () => svgStates('gas') },
  ]) },
  { id: 's2-shape', t: 'Shape and containers', b: 'SC.2.P.8.3', gen: () => fromPool([
    { q: 'You pour juice from a tall glass into a wide bowl. What happens to its shape?', a: 'It takes the shape of the bowl', w: ['It keeps the glass shape', 'It becomes solid', 'It disappears'], why: 'Liquids take the shape of their container. Solids keep their own shape.' },
    { q: 'Which one keeps its own shape no matter where you put it?', a: 'A solid', w: ['A liquid', 'A gas', 'Both liquid and gas'], why: 'Solids have a definite shape. Liquids and gases take the shape of the container.' },
  ]) },
  { id: 's2-waterstates', t: 'Water as solid, liquid and gas', b: 'SC.2.P.8.4', gen: () => fromPool([
    { q: 'What is solid water called?', a: 'Ice', w: ['Steam', 'Rain', 'Fog'], why: 'When water freezes it becomes ice, the solid state of water.' },
    { q: 'What happens to ice when it warms up?', a: 'It melts into liquid water', w: ['It turns to rock', 'It disappears forever', 'It gets colder'], why: 'Adding heat makes ice melt into liquid water.' },
    { q: 'Water vapour in the air is which state of matter?', a: 'Gas', w: ['Solid', 'Liquid', 'None of these'], why: 'Water vapour is the gas state of water.' },
  ]) },
  { id: 's2-temp', t: 'Comparing temperatures day by day', b: 'SC.2.P.8.5', gen() {
      const t = R(1, 4) * 20;
      const mode = pick(['read', 'compare', 'sametime']);
      if (mode === 'read') return { q: 'What temperature does this thermometer show?', a: t + '°',
        choices: shuffle([t + '°', (t + 20) + '°', Math.max(0, t - 20) + '°', (t + 10) + '°']).slice(0, 4),
        why: `The red line stops at the ${t} degree mark.`, visual: svgThermo(t, 0, 100) };
      if (mode === 'compare') {
        const mon = R(3, 8) * 10, tue = mon + pick([-20, -10, 10, 20]);
        return { q: `Monday was ${mon}° and Tuesday was ${tue}°. What changed?`,
          a: tue > mon ? `It got ${tue - mon}° warmer` : `It got ${mon - tue}° cooler`,
          choices: shuffle([tue > mon ? `It got ${tue - mon}° warmer` : `It got ${mon - tue}° cooler`,
            tue > mon ? `It got ${tue - mon}° cooler` : `It got ${mon - tue}° warmer`,
            'Nothing changed', `It got ${Math.abs(tue - mon) + 10}° warmer`]),
          why: `${Math.max(mon, tue)} − ${Math.min(mon, tue)} = ${Math.abs(tue - mon)} degrees ${tue > mon ? 'warmer' : 'cooler'} than the day before.` };
      }
      return { q: 'Why should you take the temperature at the same time every day?', a: 'So the days can be compared fairly',
        choices: shuffle(['So the days can be compared fairly', 'So the thermometer does not break', 'So it is always warm', 'So you do not forget']),
        why: 'Air is warmer at noon than at dawn. Measuring at the same time each day means any difference you see is a real change in the weather.' };
    } },
  { id: 's2-volume', t: 'Comparing volume', b: 'SC.2.P.8.6', gen: () => fromPool([
    { q: 'You pour the same water into a tall thin glass and a short wide glass. Is the amount the same?', a: 'Yes, the amount is the same', w: ['No, the tall one has more', 'No, the wide one has more', 'The water changed'], why: 'The shape of the container changes how it looks, but the amount of water stays the same.' },
    { q: 'Which tool measures how much liquid you have?', a: 'A measuring cup', w: ['A ruler', 'A scale', 'A thermometer'], why: 'A measuring cup marked with units tells you the volume of a liquid.' },
  ]) },
  { id: 's2-change', t: 'Changing materials', b: 'SC.2.P.9.1', gen: () => fromPool([
    { q: 'You tear paper into small pieces. Is it still paper?', a: 'Yes', w: ['No, it becomes plastic', 'No, it becomes water', 'It stops being matter'], why: 'Changing the shape or size of a material does not change what it is made of.' },
    { q: 'Do all materials change the same way when heated?', a: 'No, they respond differently', w: ['Yes, all identical', 'None of them change', 'They all burn'], why: 'Chocolate melts, water boils and clay hardens. Different materials respond differently.' },
  ]) },
];

/* ---------------------------------------------------------------- grade 3 */
const G3 = [
  { id: 's3-stars', t: 'Stars are different', b: 'SC.3.E.5.1', gen: () => fromPool([
    { q: 'Why do most stars look like tiny points of light?', a: 'They are extremely far away', w: ['They are truly tiny', 'They are behind clouds', 'They are burning out'], why: 'Every star except the Sun is so far from Earth that even a huge one looks like a point of light.' },
    { q: 'Two stars look equally bright from Earth. What could be true?', a: 'One is bigger but farther away', w: ['They must be identical', 'They must be the same distance', 'Neither gives off light'], why: 'Brightness as seen from Earth depends on both the star’s size and its distance.' },
    { q: 'Are all stars the same size?', a: 'No, they vary a great deal', w: ['Yes, all identical', 'All are smaller than the Sun', 'All are the same as Earth'], why: 'Stars come in many sizes and brightnesses.' },
  ]) },
  { id: 's3-sunstar', t: 'The Sun is a star that emits energy', b: 'SC.3.E.5.2', gen: () => fromPool([
    { q: 'What makes the Sun a star rather than a planet?', a: 'It gives off its own energy', w: ['It is very round', 'It is very large', 'It moves across the sky'], why: 'Stars emit their own energy. Planets do not; they only reflect light from a star.' },
    { q: 'How is the Sun different from the Moon?', a: 'The Sun makes its own light; the Moon reflects it', w: ['The Moon is hotter', 'The Moon is a star too', 'The Sun reflects light from the Moon'], why: 'The Sun emits light. The Moon only shines because sunlight bounces off it.' },
    { q: 'Sunlight reaches Earth across empty space. What is actually travelling to us?', a: 'Energy from the Sun', w: ['Air pushed from the Sun', 'Pieces of the Sun', 'Sound waves'], why: 'The Sun emits energy, some of it as light, and that energy crosses space to reach us.' },
  ]) },
  { id: 's3-closest', t: 'Why the Sun looks so big', b: 'SC.3.E.5.3', gen: () => fromPool([
    { q: 'Why does the Sun look bigger and brighter than other stars?', a: 'It is the closest star to Earth', w: ['It is the biggest star', 'It is the hottest star', 'It is the only star'], why: 'Many stars are larger than the Sun, but the Sun is by far the nearest, so it looks large and bright.' },
    { q: 'If the Sun were moved much farther away, how would it look?', a: 'Like a small point of light', w: ['Exactly the same', 'Even bigger', 'It would vanish'], why: 'Distance makes stars look smaller and dimmer, so a distant Sun would look like any other star.' },
  ]) },
  { id: 's3-overcome', t: 'Overcoming gravity', b: 'SC.3.E.5.4', gen: () => fromPool([
    { q: 'You throw a ball straight up. Why does it come back down?', a: 'Gravity pulls it back', w: ['It runs out of air', 'It gets tired', 'The wind pushes it'], why: 'Your throw overcomes gravity briefly, then gravity pulls the ball back to Earth.' },
    { q: 'What must a rocket do to leave the ground?', a: 'Push with more force than gravity pulls', w: ['Turn off gravity', 'Become weightless', 'Wait for night'], why: 'Gravity is a force that can be overcome by applying a greater force.' },
    { q: 'A magnet lifts a paperclip off a table. What did the magnet overcome?', a: 'Gravity', w: ['Sound', 'Light', 'Heat'], why: 'The magnetic force was stronger than the pull of gravity on the paperclip.' },
  ]) },
  { id: 's3-telescope', t: 'Telescopes show more stars', b: 'SC.3.E.5.5', gen: () => fromPool([
    { q: 'What happens when you look at the night sky through a telescope?', a: 'You see far more stars', w: ['You see fewer stars', 'You see the same number', 'The stars disappear'], why: 'A telescope gathers more light, so it reveals dramatically more stars than the unaided eye can see.' },
    { q: 'Why can a telescope show stars your eyes cannot?', a: 'It collects much more light', w: ['It moves closer to them', 'It makes stars brighter', 'It creates new stars'], why: 'The wide lens or mirror gathers light your eye alone would miss.' },
  ]) },
  { id: 's3-radiant', t: 'The Sun heats objects', b: 'SC.3.E.6.1', gen: () => fromPool([
    { q: 'A metal slide sits in the Sun all morning. How does it feel at noon?', a: 'Hot', w: ['Cold', 'Frozen', 'Exactly the same as dawn'], why: 'Radiant energy from the Sun heats objects it shines on.' },
    { q: 'What happens to that slide after the Sun goes down?', a: 'It slowly loses heat and cools', w: ['It gets hotter', 'It stays hot all night', 'It turns to liquid'], why: 'With no Sun to add energy, the object loses heat to its surroundings.' },
    { q: 'Which surface heats up fastest in sunlight?', a: 'A dark one', w: ['A white one', 'A shiny mirror', 'A clear one'], why: 'Dark surfaces absorb more radiant energy, so they warm faster.' },
  ]) },
  { id: 's3-plantstruct', t: 'What plant structures do', b: 'SC.3.L.14.1', gen: () => fromPool([
    { q: 'Every leaf is stripped from a plant. Which job can it no longer do?', a: 'Make its own food', w: ['Take in water', 'Stand upright', 'Grow roots'], why: 'Leaves are where food production happens, so losing them stops the plant feeding itself.', vis: () => svgPlant(true) },
    { q: 'Water moves from the soil to the leaves. Which route does it take?', a: 'Roots, then stem, then leaves', w: ['Leaves, then stem, then roots', 'Flower, then roots', 'Stem, then roots, then flower'], why: 'Roots absorb the water, the stem transports it upward, and it arrives at the leaves.', vis: () => svgPlant(true) },
    { q: 'A plant’s stem is crushed. Why do its leaves wilt soon after?', a: 'Water can no longer reach them', w: ['The leaves lost their colour', 'The roots stopped growing', 'The flower closed'], why: 'The stem is the transport route. Block it and water cannot get from the roots to the leaves.', vis: () => svgPlant(true) },
    { q: 'Which job does a flower do that a leaf cannot?', a: 'Make seeds for new plants', w: ['Make food from sunlight', 'Take in water', 'Hold the plant up'], why: 'Reproduction is the flower’s role. Food production is the leaf’s.', vis: () => svgPlant(true) },
    { q: 'Plants growing in deep shade often have unusually wide leaves. Why would that help?', a: 'More surface to catch scarce light', w: ['To hold more water', 'To anchor the plant', 'To attract more insects'], why: 'Leaves make food from light, so a bigger leaf catches more of it where light is short.', vis: () => svgPlant(true) },
  ]) },
  { id: 's3-stimuli', t: 'How plants respond', b: 'SC.3.L.14.2', gen: () => fromPool([
    { q: 'A plant on a windowsill leans toward the glass. Why?', a: 'Stems grow toward light', w: ['It is falling over', 'The glass pulls it', 'It wants to be cold'], why: 'Plants respond to light by growing toward it, which helps the leaves catch more sunlight.' },
    { q: 'Which way do roots grow?', a: 'Downward, with gravity', w: ['Upward, toward light', 'Sideways only', 'In circles'], why: 'Roots respond to gravity by growing downward, where water and nutrients are.' },
    { q: 'A seed is planted upside down. What happens to the root?', a: 'It turns and grows downward', w: ['It grows upward', 'It stops growing', 'It becomes a stem'], why: 'Roots sense gravity and turn to grow downward no matter how the seed was planted.' },
  ]) },
  { id: 's3-animalgroups', t: 'Classifying animals', b: 'SC.3.L.15.1', gen: () => fromPool([
    { q: 'Which group do animals with feathers belong to?', a: 'Birds', w: ['Mammals', 'Reptiles', 'Fish'], why: 'Feathers are the feature that defines birds.' },
    { q: 'Which group has hair or fur and feeds milk to its young?', a: 'Mammals', w: ['Birds', 'Amphibians', 'Fish'], why: 'Mammals have hair or fur, and mothers produce milk for their young.' },
    { q: 'A frog begins life in water with gills, then grows lungs and legs. Which group?', a: 'Amphibians', w: ['Reptiles', 'Fish', 'Mammals'], why: 'Amphibians usually start life in water and change form as they grow.' },
    { q: 'What is an animal with a backbone called?', a: 'A vertebrate', w: ['An invertebrate', 'An arthropod', 'A mollusc'], why: 'Vertebrates have backbones. Invertebrates, such as insects and worms, do not.' },
    { q: 'An insect has six legs, three body parts and a hard outer covering. Which group?', a: 'Arthropods', w: ['Mammals', 'Reptiles', 'Amphibians'], why: 'Arthropods have jointed legs and a hard exoskeleton instead of a backbone.' },
  ]) },
  { id: 's3-plantgroups', t: 'Classifying plants', b: 'SC.3.L.15.2', gen: () => fromPool([
    { q: 'Ferns and mosses reproduce using what?', a: 'Spores', w: ['Seeds', 'Flowers', 'Fruit'], why: 'Nonflowering plants such as ferns and mosses reproduce with spores rather than seeds.' },
    { q: 'Which group does an apple tree belong to?', a: 'Flowering, seed-producing plants', w: ['Spore-producing plants', 'Mosses', 'Nonliving things'], why: 'An apple tree flowers and makes seeds inside its fruit.' },
    { q: 'What is the main way scientists separate plants into major groups?', a: 'How they reproduce', w: ['Their colour', 'How tall they are', 'Where they are sold'], why: 'Plants are grouped by whether they make seeds or spores, and whether they flower.' },
  ]) },
  { id: 's3-seasons', t: 'Responding to the seasons', b: 'SC.3.L.17.1', gen: () => fromPool([
    { q: 'Why do some birds fly south in autumn?', a: 'To find food and warmth', w: ['To get lost', 'To become fish', 'To sleep in water'], why: 'Migration is a response to changing seasons, when food gets scarce and it turns cold.' },
    { q: 'What do many trees do as autumn arrives?', a: 'Drop their leaves', w: ['Grow new flowers', 'Turn into bushes', 'Pull up their roots'], why: 'Losing leaves helps a tree save water and energy through the cold months.' },
    { q: 'What is it called when an animal sleeps deeply through the cold season?', a: 'Hibernation', w: ['Migration', 'Evaporation', 'Germination'], why: 'Hibernating animals slow their bodies down to survive when food is hard to find.' },
  ]) },
  { id: 's3-photosynth', t: 'Plants make their own food', b: 'SC.3.L.17.2', gen: () => fromPool([
    { q: 'What three things do plants use to make their own food?', a: 'Sunlight, air and water', w: ['Soil, rocks and sand', 'Meat, air and water', 'Sound, heat and soil'], why: 'Plants use energy from the Sun along with air and water to produce their food.' },
    { q: 'Why are plants called producers?', a: 'They make their own food', w: ['They eat other plants', 'They eat animals', 'They do not need energy'], why: 'Producers make their own food rather than eating other living things.' },
    { q: 'A plant is kept in complete darkness but watered daily. What happens?', a: 'It cannot make food and will die', w: ['It grows faster', 'It stays perfectly healthy', 'It turns into a fungus'], why: 'Without light, a plant cannot make food, no matter how much water it gets.' },
  ]) },
  { id: 's3-invest3', t: 'Running an investigation', b: 'SC.3.N.1.1', gen: () => fromPool([
    { q: 'You test whether plants grow taller in sunlight. What should be the ONLY difference between your two plants?', a: 'How much light they get', w: ['The amount of water', 'The size of the pot', 'The type of seed'], why: 'A fair test changes one thing at a time so you know what caused the result.' },
    { q: 'What is the purpose of a scientific investigation?', a: 'To answer a question with evidence', w: ['To prove you were right', 'To make a nice drawing', 'To finish quickly'], why: 'Investigations gather evidence to answer a question, whatever the answer turns out to be.' },
  ]) },
  { id: 's3-differences', t: 'When results disagree', b: 'SC.3.N.1.2', gen: () => fromPool([
    { q: 'Two teams use the same thermometer and get different readings. What is the best next step?', a: 'Look for a reason for the difference', w: ['Pick the number you like', 'Average them and stop', 'Ignore both'], why: 'Scientists compare results across groups and seek reasons to explain any differences.' },
    { q: 'Which could explain why two groups got different measurements?', a: 'They read the tool differently', w: ['Science is random', 'Tools never work', 'Measuring is impossible'], why: 'Differences usually come from how the measurement was taken, so it is worth checking.' },
  ]) },
  { id: 's3-records3', t: 'Charts and graphs', b: 'SC.3.N.1.3', gen: () => fromPool([
    { q: 'You measure one plant’s height every day for two weeks. Which record shows the change over time best?', a: 'A line graph', w: ['A single photograph', 'A list of colours', 'A drawing of the pot'], why: 'A line graph shows how one measurement rises or falls across time.' },
    { q: 'You count how many children chose each of four lunches. Which record compares them best?', a: 'A bar graph', w: ['A line graph over time', 'A written paragraph', 'A single tally mark'], why: 'Bar graphs compare separate categories side by side.' },
    { q: 'Your notebook says only "the plant looked bigger". Why is that a weak record?', a: 'There is no measurement to compare', w: ['It is too short to read', 'Plants cannot be measured', 'It should have been spoken'], why: 'A record needs numbers or details someone else could check, not an impression.' },
    { q: 'Two students record the same experiment. Whose record is more useful?', sub: 'A: "day 3, 12 cm, two new leaves"   B: "day 3, growing nicely"', a: 'A', w: ['B', 'They are equally useful', 'Neither is useful'], why: 'A gives measurements that can be compared and checked. B gives an opinion.' },
  ]) },
  { id: 's3-communicate', t: 'Scientists communicate', b: 'SC.3.N.1.4', gen: () => fromPool([
    { q: 'Why do scientists share their findings with other scientists?', a: 'So others can check and build on them', w: ['To show off', 'To keep them secret', 'Because it is required by law'], why: 'Communication lets others verify results and continue the work.' },
    { q: 'What could happen if a scientist never shared their results?', a: 'Nobody could check or use the work', w: ['The results would be stronger', 'Science would go faster', 'Nothing would change'], why: 'Science depends on sharing so findings can be tested by others.' },
  ]) },
  { id: 's3-checking', t: 'Scientists check each other', b: 'SC.3.N.1.5', gen: () => fromPool([
    { q: 'Another scientist disagrees with your explanation. What should happen?', a: 'Look at the evidence together', w: ['The louder one wins', 'The older one wins', 'Stop doing science'], why: 'Scientists question, discuss and check each other’s evidence and explanations.' },
    { q: 'Why is it useful for scientists to question each other?', a: 'Mistakes get found and fixed', w: ['It slows everyone down', 'It makes science secret', 'It proves nothing'], why: 'Checking each other’s work is how errors are caught.' },
  ]) },
  { id: 's3-infer', t: 'Inferring from observations', b: 'SC.3.N.1.6', gen: () => fromPool([
    { q: 'You see wet ground and puddles in the morning. What is a reasonable inference?', a: 'It rained overnight', w: ['The ground is always wet', 'Someone painted it', 'It will rain tomorrow'], why: 'An inference is an explanation based on what you observed.' },
    { q: 'What is the difference between an observation and an inference?', a: 'An observation is what you sense; an inference explains it', w: ['They are the same', 'An inference is always wrong', 'An observation is a guess'], why: 'You observe directly and infer by reasoning from those observations.' },
  ]) },
  { id: 's3-evidence', t: 'Empirical evidence', b: 'SC.3.N.1.7', gen: () => fromPool([
    { q: 'What is empirical evidence?', a: 'Observations and measurements', w: ['A strong opinion', 'A popular belief', 'A good guess'], why: 'Empirical evidence is information gathered by observing or measuring, used to check explanations.' },
    { q: 'Which statement is supported by empirical evidence?', a: 'This plant grew 4 cm in a week', w: ['This plant is the nicest', 'Plants like music', 'Green is the best colour'], why: 'A measurement is evidence. Preferences are not.' },
  ]) },
  { id: 's3-words', t: 'Science words are precise', b: 'SC.3.N.3.1', gen: () => fromPool([
    { q: 'In everyday talk "energy" might mean feeling lively. What does it mean in science?', a: 'The ability to cause motion or change', w: ['Being excited', 'Running fast', 'Eating well'], why: 'Science words often have a narrower, more exact meaning than the everyday word.' },
    { q: 'Why do scientists use words carefully?', a: 'So everyone means the same thing', w: ['To sound clever', 'To confuse people', 'To make writing longer'], why: 'Precise words prevent misunderstanding between scientists.' },
  ]) },
  { id: 's3-models', t: 'Scientists use models', b: 'SC.3.N.3.2', gen: () => fromPool([
    { q: 'Why do scientists build models, like a globe of the Earth?', a: 'To help understand and explain things', w: ['To replace the real thing', 'Because it is easier than science', 'To hide information'], why: 'Models make things easier to study when they are too big, too small or too slow to observe directly.' },
    { q: 'Which of these is a scientific model?', a: 'A diagram of the water cycle', w: ['A photograph of a friend', 'A shopping list', 'A song'], why: 'A model represents how something works so it can be studied and explained.' },
  ]) },
  { id: 's3-modellimits', t: 'Models are not perfect', b: 'SC.3.N.3.3', gen: () => fromPool([
    { q: 'A model of the solar system shows planets close together. Why is that not exactly right?', a: 'Real distances are far larger', w: ['Planets do not exist', 'The model is useless', 'Planets are not round'], why: 'All models are approximations, so they never account for every detail.' },
    { q: 'What should you remember about every scientific model?', a: 'It is an approximation, not perfect', w: ['It is always exactly right', 'It replaces observation', 'It cannot be improved'], why: 'Models simplify reality, so they do not explain every observation.' },
  ]) },
  { id: 's3-energyforms', t: 'Forms of energy', b: 'SC.3.P.10.1', gen: () => fromPool([
    { q: 'A lamp is switched on. Which forms of energy does it give off?', a: 'Light and heat', w: ['Sound and motion only', 'Electrical only', 'None'], why: 'Light, heat, sound, electrical and mechanical are all basic forms of energy.' },
    { q: 'A drum being hit produces mostly which form of energy?', a: 'Sound', w: ['Light', 'Electrical', 'Chemical'], why: 'The vibrating drum skin makes sound energy.' },
    { q: 'What form of energy travels through wires to power a television?', a: 'Electrical', w: ['Sound', 'Light', 'Mechanical'], why: 'Electrical energy flows through wires to run appliances.' },
  ]) },
  { id: 's3-energychange', t: 'Energy causes change', b: 'SC.3.P.10.2', gen: () => fromPool([
    { q: 'What can energy do?', a: 'Cause motion or create change', w: ['Only make light', 'Only make sound', 'Nothing at all'], why: 'Energy is what makes things move or change.' },
    { q: 'Wind turns a windmill. What does this show?', a: 'Energy can cause motion', w: ['Wind has no energy', 'Windmills make wind', 'Motion creates air'], why: 'The moving air carries energy that makes the blades turn.' },
  ]) },
  { id: 's3-lightline', t: 'Light travels in straight lines', b: 'SC.3.P.10.3', gen: () => fromPool([
    { q: 'How does light travel until it hits something?', a: 'In a straight line', w: ['In circles', 'In a zigzag', 'It curves down'], why: 'Light moves in straight lines until it strikes an object or passes into a different material.' },
    { q: 'Why does an object make a sharp shadow?', a: 'Light travels straight and is blocked', w: ['Light bends around it', 'Shadows are made of dark rays', 'The object gives off darkness'], why: 'Because light travels straight, the object blocks it and leaves a shadow shaped like itself.' },
  ]) },
  { id: 's3-lightbehave', t: 'Reflected, refracted, absorbed', b: 'SC.3.P.10.4', gen: () => fromPool([
    { q: 'Light bounces off a mirror. What is that called?', a: 'Reflection', w: ['Refraction', 'Absorption', 'Evaporation'], why: 'Reflection is light bouncing off a surface.' },
    { q: 'A straw in a glass of water looks bent. What is happening to the light?', a: 'Refraction', w: ['Reflection', 'Absorption', 'Condensation'], why: 'Light bends as it passes from water into air, which is refraction.' },
    { q: 'A black shirt in sunlight gets hot. What happened to the light?', a: 'It was absorbed', w: ['It was reflected', 'It was refracted', 'It disappeared'], why: 'Dark surfaces absorb light energy, which turns into heat.' },
  ]) },
  { id: 's3-lightheat', t: 'Light and heat together', b: 'SC.3.P.11.1', gen: () => fromPool([
    { q: 'What do a candle flame, a light bulb and the Sun have in common?', a: 'They give off light and heat', w: ['They are all cold', 'They give off only light', 'They give off only sound'], why: 'Things that produce light very often produce heat as well.' },
    { q: 'You hold your hand near a lit bulb. What do you notice?', a: 'It feels warm', w: ['It feels cold', 'It feels wet', 'Nothing at all'], why: 'The bulb gives off heat along with its light.' },
  ]) },
  { id: 's3-friction', t: 'Rubbing makes heat', b: 'SC.3.P.11.2', gen: () => fromPool([
    { q: 'You rub your hands together quickly. What do you feel?', a: 'They get warmer', w: ['They get colder', 'They get wetter', 'Nothing changes'], why: 'Heat is produced when one object rubs against another.' },
    { q: 'Why do bicycle brakes get hot when you stop?', a: 'The pads rub against the wheel', w: ['The wheel is electric', 'The brakes are sunlit', 'Air heats them'], why: 'Rubbing surfaces produce heat, which is why brakes warm up.' },
  ]) },
  { id: 's3-temp3', t: 'Comparing temperatures', b: 'SC.3.P.8.1', gen() {
      const a = R(1, 4) * 20, b = R(1, 4) * 20;
      if (a === b) return this.gen();
      return { q: 'The thermometer shows one sample. Which reading is it?', a: a + '°',
        choices: shuffle([a + '°', (a + 20) + '°', Math.max(0, a - 20) + '°', (a + 10) + '°']).slice(0, 4),
        why: `The liquid stops at the ${a} degree mark. Comparing temperatures means reading each one carefully first.`,
        visual: svgThermo(a, 0, 100) };
    } },
  { id: 's3-massvol', t: 'Mass and volume', b: 'SC.3.P.8.2', gen: () => fromPool([
    { q: 'Which tool measures the mass of a solid?', a: 'A balance', w: ['A ruler', 'A thermometer', 'A stopwatch'], why: 'A balance compares mass. A ruler measures length and a thermometer measures temperature.' },
    { q: 'Two blocks are exactly the same size, but one feels much heavier. What is different about them?', a: 'Their mass', w: ['Their volume', 'Their shape', 'Their temperature'], why: 'Same size means same volume. The heavier block simply has more mass packed into it.' },
    { q: 'What does volume tell you?', a: 'How much space something takes up', w: ['How heavy it is', 'How hot it is', 'What colour it is'], why: 'Volume is the amount of space an object or liquid occupies.' },
  ]) },
  { id: 's3-materials', t: 'Comparing materials', b: 'SC.3.P.8.3', gen: () => fromPool([
    { q: 'Which property tells you how hard it is to scratch a material?', a: 'Hardness', w: ['Colour', 'Shape', 'Size'], why: 'Hardness describes how well a material resists being scratched or dented.' },
    { q: 'You compare a sponge and a brick. Which property differs most?', a: 'Hardness', w: ['Colour only', 'Both are equally hard', 'Neither has properties'], why: 'A brick is hard and a sponge is soft, so hardness is the clearest difference.' },
  ]) },
  { id: 's3-waterchange', t: 'Water changing state', b: 'SC.3.P.9.1', gen: () => fromPool([
    { q: 'Ice is warmed until it becomes liquid water. What is that change called?', a: 'Melting', w: ['Freezing', 'Evaporation', 'Condensation'], why: 'Adding heat turns a solid into a liquid, which is melting.' },
    { q: 'Liquid water is cooled until it becomes ice. What is that called?', a: 'Freezing', w: ['Melting', 'Boiling', 'Evaporation'], why: 'Removing heat turns a liquid into a solid, which is freezing.' },
    { q: 'Water in a kettle turns into steam. What is that called?', a: 'Evaporation', w: ['Freezing', 'Melting', 'Condensation'], why: 'Heating a liquid enough turns it into a gas, which is evaporation.' },
    { q: 'Water droplets form on the outside of a cold glass. What is that called?', a: 'Condensation', w: ['Evaporation', 'Melting', 'Freezing'], why: 'Water vapour in the air cools on the glass and turns back into liquid, which is condensation.' },
  ]) },
];

/* ---------------------------------------------------------------- grade 4 */
const G4 = [
  { id: 's4-starpatterns', t: 'Star patterns', b: 'SC.4.E.5.1', gen: () => fromPool([
    { q: 'Why do the stars appear to move across the sky each night?', a: 'Earth is rotating', w: ['The stars orbit Earth', 'The stars are falling', 'The Sun pushes them'], why: 'The patterns stay fixed. Earth’s rotation makes them appear to shift.' },
    { q: 'Do the shapes of constellations change from night to night?', a: 'No, the patterns stay the same', w: ['Yes, they rearrange', 'They vanish nightly', 'They swap places'], why: 'Star patterns hold their shape; only their position in our sky appears to change.' },
    { q: 'Why do you see different constellations in summer than in winter?', a: 'Earth revolves around the Sun', w: ['Stars are created seasonally', 'The Moon blocks them', 'They move to other galaxies'], why: 'As Earth orbits the Sun, the night side faces different parts of space during the year.' },
  ]) },
  { id: 's4-moonphases', t: 'Phases of the Moon', b: 'SC.4.E.5.2', gen: () => fromPool([
    { q: 'About how long does it take the Moon to go through all its phases?', a: 'About a month', w: ['About a day', 'About a week', 'About a year'], why: 'The Moon cycles through its phases in roughly 29 and a half days.', vis: () => svgMoon('full') },
    { q: 'Which phase shows a fully lit circle?', a: 'Full Moon', w: ['New Moon', 'First quarter', 'Crescent'], why: 'At full Moon the whole face we see is lit by the Sun.', vis: () => svgMoon('full') },
    { q: 'Which phase is it when we cannot see the Moon lit at all?', a: 'New Moon', w: ['Full Moon', 'Last quarter', 'Gibbous'], why: 'At new Moon the lit side faces away from Earth, so it looks dark.', vis: () => svgMoon('new') },
    { q: 'What is this phase, where exactly half the face is lit?', a: 'Quarter Moon', w: ['Full Moon', 'New Moon', 'Crescent'], why: 'A quarter Moon shows half the visible face lit, a quarter of the way through the cycle.', vis: () => svgMoon('first quarter') },
    { q: 'Why does the Moon appear to change shape?', a: 'We see different amounts of its lit half', w: ['The Moon really changes shape', 'Clouds cover parts', 'Earth’s shadow does it nightly'], why: 'Half the Moon is always lit. As it orbits, we see different amounts of that lit half.', vis: () => svgMoon('crescent') },
  ]) },
  { id: 's4-revolve', t: 'Rotation and revolution', b: 'SC.4.E.5.3', gen: () => fromPool([
    { q: 'How long does Earth take to rotate once on its axis?', a: '24 hours', w: ['One year', 'One month', 'One week'], why: 'Earth spins once on its axis every 24 hours, which gives us day and night.' },
    { q: 'How long does Earth take to revolve once around the Sun?', a: 'One year', w: ['24 hours', 'One month', 'One week'], why: 'One full orbit around the Sun takes a year.' },
    { q: 'What is the difference between rotation and revolution?', a: 'Rotation is spinning; revolution is orbiting', w: ['They mean the same', 'Rotation is orbiting the Sun', 'Revolution takes one day'], why: 'Earth rotates on its own axis daily and revolves around the Sun yearly.' },
  ]) },
  { id: 's4-daynight', t: 'Day, night and apparent movement', b: 'SC.4.E.5.4', gen: () => fromPool([
    { q: 'What causes day and night?', a: 'Earth rotating on its axis', w: ['Earth orbiting the Sun', 'The Sun turning off', 'The Moon blocking the Sun'], why: 'As Earth spins, the side facing the Sun has day and the other side has night.' },
    { q: 'Why does the Sun appear to move from east to west?', a: 'Earth rotates toward the east', w: ['The Sun orbits Earth', 'The Sun really moves west', 'Clouds carry it'], why: 'The Sun’s apparent motion is caused by Earth’s rotation, not by the Sun moving.' },
    { q: 'Do the Sun, Moon and stars all appear to move across the sky for the same reason?', a: 'Yes, Earth’s rotation', w: ['No, each has its own cause', 'Only the Sun does', 'They are actually still in our sky'], why: 'Earth’s rotation makes all of them appear to travel across the sky.' },
  ]) },
  { id: 's4-space', t: 'Space research in Florida', b: 'SC.4.E.5.5', gen: () => fromPool([
    { q: 'Which Florida site is famous for launching rockets?', a: 'Kennedy Space Center', w: ['Everglades National Park', 'Lake Okeechobee', 'Key West'], why: 'Kennedy Space Center on Florida’s coast has launched crewed and uncrewed missions for decades.' },
    { q: 'How has space research affected Florida?', a: 'It created jobs and drew visitors', w: ['It had no effect', 'It stopped tourism', 'It removed all industry'], why: 'The space programme brought employment, science industry and tourism to the state.' },
  ]) },
  { id: 's4-rocktypes', t: 'Three kinds of rock', b: 'SC.4.E.6.1', gen: () => fromPool([
    { q: 'Which rock type forms when molten rock cools and hardens?', a: 'Igneous', w: ['Sedimentary', 'Metamorphic', 'Mineral'], why: 'Igneous rock forms from cooled magma or lava.' },
    { q: 'Which rock type forms from pieces of other rocks and fossils pressed together?', a: 'Sedimentary', w: ['Igneous', 'Metamorphic', 'Molten'], why: 'Sedimentary rock is built from layers of sediment and fossilised material.' },
    { q: 'Which rock type forms when existing rock is changed by heat and pressure?', a: 'Metamorphic', w: ['Igneous', 'Sedimentary', 'Volcanic'], why: 'Metamorphic rock is older rock transformed by intense heat and pressure.' },
    { q: 'In which rock type would you most likely find a fossil?', a: 'Sedimentary', w: ['Igneous', 'Metamorphic', 'None of them'], why: 'Sediment settles gently in layers and can bury remains, preserving them as fossils.' },
  ]) },
  { id: 's4-minerals', t: 'Mineral properties', b: 'SC.4.E.6.2', gen: () => fromPool([
    { q: 'What does a mineral’s "streak" mean?', a: 'The colour of its powder', w: ['How shiny it is', 'How heavy it is', 'Its outside colour'], why: 'Streak is the colour left when a mineral is rubbed on a tile, and it is often more reliable than surface colour.' },
    { q: 'What does "luster" describe?', a: 'How light reflects off it', w: ['How hard it is', 'Its weight', 'Its smell'], why: 'Luster describes whether a mineral looks metallic, glassy, dull or pearly.' },
    { q: 'A mineral scratches glass but a knife cannot scratch it. What property is being tested?', a: 'Hardness', w: ['Streak', 'Luster', 'Cleavage'], why: 'Hardness is tested by seeing what will scratch what.' },
    { q: 'What is cleavage in a mineral?', a: 'How it breaks along flat surfaces', w: ['Its colour', 'Its weight', 'How it smells'], why: 'Cleavage is the tendency to split along smooth, flat planes.' },
    { q: 'What is a rock actually made of?', a: 'One or more minerals', w: ['Only soil', 'Only water', 'Only fossils'], why: 'Minerals are the building blocks. A rock is a mixture of one or more of them.' },
    { q: 'Quartz, feldspar and mica are examples of what?', a: 'Minerals that form rocks', w: ['Types of soil', 'Kinds of fossil', 'Forms of energy'], why: 'These are common earth-forming minerals, and granite is made of all three.' },
  ]) },
  { id: 's4-resources', t: 'Renewable and nonrenewable', b: 'SC.4.E.6.3', gen: () => fromPool([
    { q: 'Which resource is renewable?', a: 'Sunlight', w: ['Coal', 'Oil', 'Natural gas'], why: 'Renewable resources are replaced naturally within a human lifetime. Sunlight and wind are renewable.' },
    { q: 'Which resource is nonrenewable?', a: 'Oil', w: ['Wind', 'Sunlight', 'Moving water'], why: 'Oil takes millions of years to form, so once used it is effectively gone.' },
    { q: 'Why does it matter whether a resource is renewable?', a: 'Nonrenewable ones can run out', w: ['Renewable ones are free', 'Nonrenewable ones are cleaner', 'It does not matter'], why: 'Nonrenewable resources cannot be replaced quickly, so they must be used carefully.' },
  ]) },
  { id: 's4-weathering', t: 'Weathering and erosion', b: 'SC.4.E.6.4', gen: () => fromPool([
    { q: 'What is physical weathering?', a: 'Rock breaking into smaller pieces', w: ['Rock changing into a new substance', 'Rock melting into lava', 'Rock growing larger'], why: 'Physical weathering breaks rock apart without changing what it is made of.' },
    { q: 'Water freezes in a crack and splits the rock. Which process is this?', a: 'Physical weathering', w: ['Chemical weathering', 'Erosion', 'Deposition'], why: 'Ice expanding in a crack breaks the rock mechanically, so it is physical weathering.' },
    { q: 'What is the main difference between weathering and erosion?', a: 'Weathering breaks rock; erosion moves it', w: ['They are the same', 'Erosion breaks rock', 'Weathering only happens in water'], why: 'Weathering breaks material down in place. Erosion carries the pieces away.' },
    { q: 'What causes chemical weathering?', a: 'Substances reacting with the rock', w: ['Wind blowing sand', 'Ice cracking rock', 'Plant roots pushing'], why: 'Chemical weathering changes the rock into a new substance, for example acid rain dissolving limestone.' },
  ]) },
  { id: 's4-tools', t: 'Tools extend our senses', b: 'SC.4.E.6.5', gen: () => fromPool([
    { q: 'Which tool helps scientists see very small things?', a: 'A microscope', w: ['A telescope', 'A thermometer', 'A balance'], why: 'Microscopes magnify tiny objects far beyond what the eye can see.' },
    { q: 'Which tool helps scientists see very distant things?', a: 'A telescope', w: ['A microscope', 'A scale', 'A ruler'], why: 'Telescopes gather light from far away so distant objects can be studied.' },
    { q: 'Why do scientists use tools instead of only their senses?', a: 'Tools extend what we can observe', w: ['Senses are never useful', 'Tools are always faster', 'Tools remove the need to think'], why: 'Technology lets us observe things too small, too far or too faint for our senses alone.' },
  ]) },
  { id: 's4-flresources', t: 'Florida’s resources', b: 'SC.4.E.6.6', gen: () => fromPool([
    { q: 'Which resource is Florida especially known for mining?', a: 'Phosphate', w: ['Gold', 'Coal', 'Iron ore'], why: 'Florida is a major source of phosphate, which is used in fertiliser.' },
    { q: 'Which rock, common in Florida, is used in building and cement?', a: 'Limestone', w: ['Granite', 'Marble', 'Obsidian'], why: 'Florida sits on limestone, which is quarried for construction.' },
    { q: 'Which renewable energy resource is plentiful in sunny Florida?', a: 'Solar energy', w: ['Coal', 'Oil', 'Phosphate'], why: 'Florida’s abundant sunshine makes solar energy a valuable renewable resource.' },
  ]) },
  { id: 's4-pollination', t: 'How flowering plants reproduce', b: 'SC.4.L.16.1', gen: () => fromPool([
    { q: 'What is pollination?', a: 'Moving pollen from one flower part to another', w: ['A seed sprouting', 'A root growing down', 'A leaf making food'], why: 'Pollination transfers pollen, which must happen before seeds can form.' },
    { q: 'What often carries pollen between flowers?', a: 'Bees and other animals', w: ['Rocks', 'Soil', 'Fish'], why: 'Insects, birds and wind move pollen from flower to flower.' },
    { q: 'What is seed dispersal?', a: 'Seeds being spread away from the parent plant', w: ['Seeds forming inside a flower', 'A seed starting to grow', 'Pollen landing on a flower'], why: 'Dispersal by wind, water or animals moves seeds so new plants are not crowded.' },
    { q: 'What is germination?', a: 'A seed beginning to grow', w: ['A flower opening', 'Pollen being carried', 'A leaf falling'], why: 'Germination is the moment a seed sprouts and starts to grow into a plant.' },
  ]) },
  { id: 's4-inherited', t: 'Inherited or environmental', b: 'SC.4.L.16.2', gen: () => fromPool([
    { q: 'A plant of the same kind grows shorter in poor soil. Is height only inherited?', a: 'No, the environment affects it too', w: ['Yes, only inherited', 'Height is never inherited', 'Soil has no effect'], why: 'Characteristics are inherited, but the environment can change how they turn out.' },
    { q: 'Which trait is inherited?', a: 'Eye colour', w: ['A scar', 'A haircut', 'A learned language'], why: 'Inherited traits are passed from parents. Scars and haircuts come from the environment.' },
    { q: 'Two puppies from the same litter grow to different sizes. What could explain it?', a: 'Differences in food and care', w: ['They have different parents', 'Size is never inherited', 'One is not a dog'], why: 'Inherited traits set a range, and environment such as diet affects the result.' },
  ]) },
  { id: 's4-behavior', t: 'Inherited and learned behaviour', b: 'SC.4.L.16.3', gen: () => fromPool([
    { q: 'A spider spins a web without being taught. What kind of behaviour is that?', a: 'Inherited', w: ['Learned', 'Taught by parents', 'Random'], why: 'Instinctive behaviours are inherited and appear without any training.' },
    { q: 'A dog sits when told to sit. What kind of behaviour is that?', a: 'Learned', w: ['Inherited', 'Instinct', 'Automatic'], why: 'The dog learned this behaviour through training and practice.' },
    { q: 'A newly hatched sea turtle heads straight for the ocean with no parent present. What kind of behaviour is that?', a: 'Inherited', w: ['Learned', 'Taught by other turtles', 'Copied from birds'], why: 'It has had no chance to learn or be taught, so the behaviour must be inherited.' },
  ]) },
  { id: 's4-metamorphosis', t: 'Complete and incomplete metamorphosis', b: 'SC.4.L.16.4', gen: () => fromPool([
    { q: 'A butterfly goes egg, larva, pupa, adult. What is that called?', a: 'Complete metamorphosis', w: ['Incomplete metamorphosis', 'No metamorphosis', 'Germination'], why: 'Complete metamorphosis has four very different stages, including a pupa.',
      vis: () => svgCycle([{ icon: '🥚', name: 'egg' }, { icon: '🐛', name: 'larva' }, { icon: '🛡️', name: 'pupa' }, { icon: '🦋', name: 'adult' }]) },
    { q: 'A grasshopper goes egg, nymph, adult, with the nymph looking like a small adult. What is that?', a: 'Incomplete metamorphosis', w: ['Complete metamorphosis', 'Pollination', 'Hibernation'], why: 'Incomplete metamorphosis has three stages and no pupa, and the young resemble the adult.',
      vis: () => svgCycle([{ icon: '🥚', name: 'egg' }, { icon: '🦗', name: 'nymph' }, { icon: '🦗', name: 'adult' }]) },
    { q: 'Which stage does complete metamorphosis have that incomplete does not?', a: 'Pupa', w: ['Egg', 'Adult', 'Nymph'], why: 'The pupa stage, where the body is completely rebuilt, only occurs in complete metamorphosis.' },
    { q: 'A Florida lubber grasshopper hatches looking like a small wingless adult. Which life cycle is that?', a: 'Incomplete metamorphosis', w: ['Complete metamorphosis', 'Germination', 'Pollination'], why: 'Florida lubbers go egg, nymph, adult. The young already resemble the adult, so there is no pupa stage.' },
    { q: 'A Florida orange tree makes flowers, then fruit with seeds inside. A pine makes seeds in cones with no flowers. What separates them?', a: 'Whether they flower', w: ['Whether they have seeds', 'Whether they have roots', 'Whether they need sunlight'], why: 'Both are seed-bearing plants. The orange is flowering; the pine is a nonflowering seed plant.' },
  ]) },
  { id: 's4-flseasons', t: 'Florida seasons compared', b: 'SC.4.L.17.1', gen: () => fromPool([
    { q: 'How do Florida winters compare with winters in the northern United States?', a: 'Milder, with far less snow', w: ['Colder and snowier', 'Exactly the same', 'Hotter than summer'], why: 'Florida’s southern position keeps winters mild, so plants and animals respond differently than they do further north.' },
    { q: 'Why do fewer Florida trees drop all their leaves in autumn?', a: 'The winters are mild', w: ['They have no leaves', 'They are not really trees', 'Florida has no autumn'], why: 'Losing leaves protects trees from hard freezes, which Florida rarely gets.' },
    { q: 'Florida’s seasons are often described as which two?', a: 'Wet and dry', w: ['Snowy and icy', 'Spring and autumn only', 'Hot and freezing'], why: 'Florida’s year is shaped mainly by a wet season and a dry season rather than four sharply different ones.' },
  ]) },
  { id: 's4-consumers', t: 'Animals must eat', b: 'SC.4.L.17.2', gen: () => fromPool([
    { q: 'Why must animals eat, while plants do not?', a: 'Animals cannot make their own food', w: ['Animals are bigger', 'Animals need no energy', 'Plants eat soil'], why: 'Plants produce their own food; animals must consume other living things to get energy.' },
    { q: 'When a rabbit eats grass, what is passed to the rabbit?', a: 'Energy', w: ['Sunlight itself', 'Soil', 'Air'], why: 'The energy stored in the plant transfers to the animal that eats it.' },
    { q: 'What is an animal that eats only plants called?', a: 'A herbivore', w: ['A carnivore', 'A producer', 'A decomposer'], why: 'Herbivores eat plants, carnivores eat animals, and omnivores eat both.' },
  ]) },
  { id: 's4-foodchain', t: 'Food chains', b: 'SC.4.L.17.3', gen: () => fromPool([
    { q: 'Where does the energy in every food chain begin?', a: 'The Sun', w: ['The soil', 'The consumers', 'The water'], why: 'Producers capture energy from the Sun, and it passes along the chain from there.',
      vis: () => svgFoodChain([{ icon: '☀️', name: 'Sun' }, { icon: '🌿', name: 'algae' }, { icon: '🦐', name: 'shrimp' }, { icon: '🐟', name: 'perch' }]) },
    { q: 'In this chain, which one is the producer?', a: 'Algae', w: ['Shrimp', 'Perch', 'Kingfisher'], why: 'The producer makes its own food from sunlight. Everything after it is a consumer.',
      vis: () => svgFoodChain([{ icon: '☀️', name: 'Sun' }, { icon: '🌿', name: 'algae' }, { icon: '🦐', name: 'shrimp' }, { icon: '🐟', name: 'perch' }]) },
    { q: 'Which way does energy flow along a food chain?', a: 'From producers to consumers', w: ['From consumers to producers', 'In both directions', 'It does not flow'], why: 'The arrows in a food chain show energy moving from the one being eaten to the one eating.',
      vis: () => svgFoodChain([{ icon: '🌱', name: 'grass' }, { icon: '🐇', name: 'rabbit' }, { icon: '🦊', name: 'fox' }]) },
    { q: 'If all the grass in this chain died, what would happen to the rabbits?', a: 'They would lose their food source', w: ['They would grow faster', 'Nothing would change', 'They would become producers'], why: 'Every consumer depends on the producers below it in the chain.',
      vis: () => svgFoodChain([{ icon: '🌱', name: 'grass' }, { icon: '🐇', name: 'rabbit' }, { icon: '🦊', name: 'fox' }]) },
  ]) },
  { id: 's4-impact', t: 'Impacts on the environment', b: 'SC.4.L.17.4', gen: () => fromPool([
    { q: 'Which human action helps the environment?', a: 'Planting trees', w: ['Dumping waste in a river', 'Cutting down a forest', 'Leaving litter on a beach'], why: 'People can affect the environment in harmful and helpful ways.' },
    { q: 'How can beavers change their environment?', a: 'They build dams that create ponds', w: ['They cannot change it', 'They dry up rivers', 'They plant forests'], why: 'Animals as well as humans can reshape an environment.' },
    { q: 'Why does litter in the ocean harm animals?', a: 'Animals can eat or get tangled in it', w: ['It feeds them', 'It has no effect', 'It makes water cleaner'], why: 'Waste can injure or kill animals that mistake it for food or become trapped.' },
  ]) },
  { id: 's4-multitools', t: 'Comparing results across groups', b: 'SC.4.N.1.2', gen: () => fromPool([
    { q: 'Two groups measure the same rock with different tools and disagree. What should they do?', a: 'Look for reasons for the difference', w: ['Pick the answer they prefer', 'Assume one group cheated', 'Abandon the investigation'], why: 'Scientists compare results and seek explanations when they differ.' },
    { q: 'Why might two tools give slightly different measurements?', a: 'They have different precision', w: ['Measuring is impossible', 'One tool is magic', 'Numbers are random'], why: 'Tools vary in how finely they measure, which can explain small differences.' },
  ]) },
  { id: 's4-method', t: 'Science is not one fixed method', b: 'SC.4.N.1.3', gen: () => fromPool([
    { q: 'Is there exactly one "scientific method" every scientist must follow?', a: 'No, but all science uses evidence', w: ['Yes, always the same five steps', 'No, and evidence is optional', 'Yes, and it never changes'], why: 'Science does not follow one rigid recipe, but it always relies on observation and evidence.' },
    { q: 'What do all scientific investigations have in common?', a: 'They use evidence and reasoning', w: ['They use the same equipment', 'They take the same time', 'They start with the same question'], why: 'Methods vary widely, but evidence and careful reasoning are always present.' },
  ]) },
  { id: 's4-cite', t: 'Answers need evidence', b: 'SC.4.N.1.4', gen: () => fromPool([
    { q: 'Which answer is best supported?', a: 'The plant grew 5 cm because I measured it weekly', w: ['The plant grew a lot, I think', 'Plants always grow fast', 'It looked taller, probably'], why: 'A good scientific answer cites the evidence behind it.' },
    { q: 'A classmate claims sound travels faster in water. What should you ask for?', a: 'Evidence from an investigation', w: ['Their opinion', 'A louder voice', 'A vote'], why: 'Claims in science need supporting evidence.' },
  ]) },
  { id: 's4-classmates', t: 'Comparing investigations', b: 'SC.4.N.1.5', gen: () => fromPool([
    { q: 'Why compare your method with a classmate’s?', a: 'Differences in method can explain different results', w: ['To see who is faster', 'To copy their answer', 'To avoid doing the work'], why: 'Comparing methods reveals why results differ and improves future investigations.' },
    { q: 'Your result differs from a classmate’s. What is the best response?', a: 'Compare methods to find why', w: ['Assume you are right', 'Assume they are right', 'Change your data'], why: 'Comparing procedures finds the source of the difference honestly.' },
  ]) },
  { id: 's4-records4', t: 'Observations versus inferences', b: 'SC.4.N.1.6', gen: () => fromPool([
    { q: 'Which record entry is an observation?', a: 'The leaf is 8 cm long and yellow', w: ['The leaf is dying', 'The plant is unhappy', 'The plant needs more sun'], why: 'Observations record what you sense or measure. The rest are inferences.' },
    { q: 'Why should records separate observations from inferences?', a: 'So others can judge the evidence', w: ['To make the record longer', 'It does not matter', 'To hide mistakes'], why: 'Keeping them distinct lets anyone see what was actually observed and what was interpreted.' },
  ]) },
  { id: 's4-basedon', t: 'Explanations rest on evidence', b: 'SC.4.N.1.7', gen: () => fromPool([
    { q: 'What do scientists base their explanations on?', a: 'Evidence', w: ['Popular opinion', 'Tradition', 'Who is most senior'], why: 'Scientific explanations must be supported by evidence.' },
    { q: 'New evidence contradicts an accepted explanation. What should scientists do?', a: 'Re-examine and possibly change the explanation', w: ['Ignore the evidence', 'Hide the evidence', 'Keep the old idea regardless'], why: 'Explanations follow the evidence, so they change when better evidence appears.' },
  ]) },
  { id: 's4-creativity', t: 'Creativity in science', b: 'SC.4.N.1.8', gen: () => fromPool([
    { q: 'Is creativity part of science?', a: 'Yes, especially in designing experiments', w: ['No, science is only rules', 'Only in art', 'Only for famous scientists'], why: 'Designing a good experiment takes imagination as well as care.' },
    { q: 'Where does creativity help a scientist most?', a: 'Thinking up ways to test an idea', w: ['Copying results', 'Ignoring data', 'Skipping steps'], why: 'Inventing a clever test is a creative act.' },
  ]) },
  { id: 's4-natural', t: 'What science studies', b: 'SC.4.N.2.1', gen: () => fromPool([
    { q: 'What does science study?', a: 'The natural world', w: ['Everything imaginable', 'Only opinions', 'Only history'], why: 'Science focuses solely on the natural world, using observation and evidence.' },
    { q: 'Why can science not answer "which painting is the most beautiful?"', a: 'Beauty is not part of the natural world you can measure', w: ['Nobody has tried yet', 'Paintings are too small', 'Only art teachers may answer it'], why: 'Science focuses solely on the natural world. Questions of taste and value sit outside it.' },
  ]) },
  { id: 's4-modeltypes', t: 'Kinds of models', b: 'SC.4.N.3.1', gen: () => fromPool([
    { q: 'A scientist pictures how a molecule fits together in her head, without drawing it. Is that a model?', a: 'Yes, a mental model', w: ['No, models must be physical', 'No, models must be drawn', 'Only if she writes it down'], why: 'Models can be three dimensional, two dimensional, a computer model, or an explanation held in your mind.' },
    { q: 'A globe representing Earth is which kind of model?', a: 'Three dimensional', w: ['Two dimensional', 'A computer model', 'A mental model'], why: 'A globe is a physical, three-dimensional model.' },
    { q: 'A labelled drawing of the water cycle is which kind of model?', a: 'Two dimensional', w: ['Three dimensional', 'A computer model', 'A physical build'], why: 'A flat diagram is a two-dimensional model.' },
  ]) },
  { id: 's4-energyforms4', t: 'Forms of energy', b: 'SC.4.P.10.1', gen: () => fromPool([
    { q: 'A moving bicycle has which form of energy?', a: 'Energy of motion', w: ['Sound only', 'Light only', 'No energy'], why: 'Anything moving has energy of motion, also called mechanical or kinetic energy.' },
    { q: 'Which forms of energy does a campfire release?', a: 'Light and heat', w: ['Electrical and sound', 'Only sound', 'Only motion'], why: 'A fire gives off both light and heat energy.' },
    { q: 'A guitar string is plucked. Which form of energy do you hear?', a: 'Sound', w: ['Light', 'Electrical', 'Heat'], why: 'The vibrating string produces sound energy.' },
  ]) },
  { id: 's4-energycause', t: 'Energy causes change', b: 'SC.4.P.10.2', gen: () => fromPool([
    { q: 'A toaster turns electrical energy into what?', a: 'Heat', w: ['Sound', 'Motion', 'Magnetism'], why: 'Energy can change form, and a toaster converts electrical energy into heat.' },
    { q: 'What evidence shows energy is being transferred to a pot of water on a stove?', a: 'The water gets hotter', w: ['The pot changes colour', 'The pot gets lighter', 'Nothing changes'], why: 'A temperature change is evidence that energy moved into the water.' },
  ]) },
  { id: 's4-sound', t: 'Sound and pitch', b: 'SC.4.P.10.3', gen: () => fromPool([
    { q: 'What produces sound?', a: 'Vibrating objects', w: ['Still objects', 'Cold objects', 'Bright objects'], why: 'Sound is made when an object vibrates and those vibrations travel through the air.' },
    { q: 'A string vibrates very fast. What is the pitch like?', a: 'High', w: ['Low', 'Silent', 'Unchanged'], why: 'Faster vibration means higher pitch. Slower vibration means lower pitch.' },
    { q: 'How do you make a guitar string produce a lower note?', a: 'Make it vibrate more slowly', w: ['Make it vibrate faster', 'Make it brighter', 'Make it warmer'], why: 'Pitch depends on vibration speed, so slower vibration gives a lower note.' },
    { q: 'Two drums are hit equally hard. The bigger one sounds lower. Why?', a: 'Its surface vibrates more slowly', w: ['It is louder', 'It is heavier only', 'It absorbs light'], why: 'Larger surfaces vibrate more slowly, producing a lower pitch.' },
  ]) },
  { id: 's4-windwater', t: 'Moving air and water as energy', b: 'SC.4.P.10.4', gen: () => fromPool([
    { q: 'How does a windmill produce useful energy?', a: 'Moving air turns its blades', w: ['It burns coal', 'It uses sunlight only', 'It creates wind'], why: 'Moving air and moving water carry energy that can be used to move things.' },
    { q: 'What did old water wheels use to do work?', a: 'Moving water in a river', w: ['Still water in a pond', 'Steam only', 'Electricity'], why: 'A river’s moving water pushed the wheel, turning machinery.' },
  ]) },
  { id: 's4-heatflow', t: 'Heat flows hot to cold', b: 'SC.4.P.11.1', gen: () => fromPool([
    { q: 'You put an ice cube in warm water. Which way does heat flow?', a: 'From the water to the ice', w: ['From the ice to the water', 'Both ways equally', 'No heat flows'], why: 'Heat always flows from the hotter object to the colder one.' },
    { q: 'A spoon is left in hot soup. What happens to the spoon?', a: 'It warms up', w: ['It cools down', 'It stays the same', 'It freezes'], why: 'Heat flows from the hot soup into the cooler spoon, raising its temperature.' },
    { q: 'Why does a cold drink warm up on a hot day?', a: 'Heat flows from the warm air into it', w: ['Cold escapes from it', 'It makes its own heat', 'The Sun freezes it'], why: 'Heat moves from the warmer surroundings into the cooler drink.' },
  ]) },
  { id: 's4-conductors', t: 'Conductors and insulators', b: 'SC.4.P.11.2', gen: () => fromPool([
    { q: 'Which material conducts heat well?', a: 'Metal', w: ['Wood', 'Plastic', 'Cloth'], why: 'Metals conduct heat well, which is why pans are metal and handles are not.' },
    { q: 'Which material is a poor conductor of heat?', a: 'Wood', w: ['Copper', 'Aluminium', 'Steel'], why: 'Wood, plastic and cloth are poor conductors, so they make good insulators.' },
    { q: 'Why are oven mitts made of thick cloth?', a: 'Cloth conducts heat poorly', w: ['Cloth conducts heat well', 'Cloth makes things cold', 'Cloth reflects all heat'], why: 'A poor conductor slows heat reaching your hand.' },
  ]) },
  { id: 's4-position', t: 'Motion changes position', b: 'SC.4.P.12.1', gen: () => fromPool([
    { q: 'What always happens to an object in motion?', a: 'Its position changes', w: ['Its colour changes', 'Its mass changes', 'It gets warmer'], why: 'Motion means changing position, and direction may change too.' },
    { q: 'A car drives around a bend. What has changed?', a: 'Its position and its direction', w: ['Only its colour', 'Only its mass', 'Nothing'], why: 'An object in motion always changes position and may also change direction.' },
  ]) },
  { id: 's4-speed', t: 'Speed', b: 'SC.4.P.12.2', gen() {
      const d = R(2, 12) * 10, t = pick([2, 4, 5, 10]);
      const s = d / t;
      return { q: `A runner travels ${d} metres in ${t} seconds. What is the speed?`, a: s + ' m/s',
        choices: shuffle([s + ' m/s', (d * t) + ' m/s', (d + t) + ' m/s', (s + 1) + ' m/s']).slice(0, 4),
        why: `Speed is distance divided by time: ${d} ÷ ${t} = ${s} metres per second.` };
    } },
  { id: 's4-physprops', t: 'Measuring physical properties', b: 'SC.4.P.8.1', gen: () => fromPool([
    { q: 'Which property tells you how much matter is in an object?', a: 'Mass', w: ['Colour', 'Shape', 'Texture'], why: 'Mass measures the amount of matter, and it is found with a balance.' },
    { q: 'Which property could you measure with a graduated cylinder?', a: 'Volume', w: ['Hardness', 'Colour', 'Texture'], why: 'A graduated cylinder measures the volume of a liquid.' },
    { q: 'Which of these is NOT a physical property you can measure?', a: 'How pretty it is', w: ['Mass', 'Volume', 'Temperature'], why: 'Physical properties can be observed or measured. Beauty is an opinion.' },
  ]) },
  { id: 's4-wateruses', t: 'Water in each state', b: 'SC.4.P.8.2', gen: () => fromPool([
    { q: 'Which use depends on water being a solid?', a: 'Keeping a drink cold with ice', w: ['Drinking it', 'Steaming vegetables', 'Watering plants'], why: 'Ice, the solid state, keeps things cold.' },
    { q: 'Which use depends on water being a gas?', a: 'Steaming vegetables', w: ['Ice skating', 'Making ice cubes', 'Building a snowman'], why: 'Steam is the gaseous state of water and carries heat to the food.' },
    { q: 'What property of liquid water lets it be piped into homes?', a: 'It flows and takes the shape of the pipe', w: ['It keeps its own shape', 'It expands forever', 'It is always frozen'], why: 'Liquids flow and take the shape of their container, so they can be piped.' },
  ]) },
  { id: 's4-conservemass', t: 'Conservation of mass', b: 'SC.4.P.8.3', gen: () => fromPool([
    { q: 'You break a 100 gram clay ball into pieces. What is the total mass of all the pieces?', a: '100 grams', w: ['Less than 100 grams', 'More than 100 grams', 'Zero grams'], why: 'The mass of a whole object equals the sum of the masses of its parts.' },
    { q: 'You dissolve 5 grams of salt into 95 grams of water. What is the total mass?', a: '100 grams', w: ['95 grams', '5 grams', 'Less than 95 grams'], why: 'The salt is still there, dissolved, so the total mass does not change.' },
    { q: 'What does the Law of Conservation of Mass say?', a: 'Mass is not lost when an object changes form', w: ['Mass disappears when broken', 'Mass doubles when split', 'Mass depends on shape'], why: 'Mass stays the same even when an object is broken apart or changes state.' },
  ]) },
  { id: 's4-magnets4', t: 'Magnets attract and repel', b: 'SC.4.P.8.4', gen: () => fromPool([
    { q: 'Two north poles are brought together. What happens?', a: 'They push apart', w: ['They pull together', 'Nothing happens', 'They stick permanently'], why: 'Like poles repel each other. Opposite poles attract.', vis: () => svgMagnet('repel') },
    { q: 'A north pole and a south pole are brought together. What happens?', a: 'They pull together', w: ['They push apart', 'They melt', 'Nothing happens'], why: 'Opposite poles attract.', vis: () => svgMagnet('attract') },
    { q: 'Which material will a magnet attract?', a: 'Iron', w: ['Copper', 'Plastic', 'Glass'], why: 'Magnets attract magnetic materials such as iron, nickel and steel.' },
  ]) },
  { id: 's4-newmaterials', t: 'Changes that make new materials', b: 'SC.4.P.9.1', gen: () => fromPool([
    { q: 'An iron nail is left outside and turns orange and flaky. What happened?', a: 'It rusted into a new material', w: ['It only changed shape', 'It melted', 'It got wet only'], why: 'Rusting is a change that produces a new material with different characteristics.' },
    { q: 'Which change produces a NEW material?', a: 'Burning wood into ash', w: ['Cutting paper', 'Melting ice', 'Crushing a can'], why: 'Burning changes the substance itself. Cutting, melting and crushing only change form.' },
    { q: 'A fallen log slowly decays into soil. Is this a new material?', a: 'Yes', w: ['No, it is still wood', 'No, it only changed shape', 'No, nothing changed'], why: 'Decay breaks the wood down into different substances.' },
  ]) },
];

/* ---------------------------------------------------------------- grade 5 */
const G5 = [
  { id: 's5-galaxy', t: 'Galaxies', b: 'SC.5.E.5.1', gen: () => fromPool([
    { q: 'What is our home galaxy called?', a: 'The Milky Way', w: ['Andromeda', 'The Solar System', 'Orion'], why: 'Earth and the Sun sit inside the Milky Way galaxy.' },
    { q: 'What is a galaxy made of?', a: 'Gas, dust and many stars', w: ['Only one star', 'Only planets', 'Only empty space'], why: 'A galaxy is a huge collection of gas, dust and stars, along with anything orbiting those stars.' },
    { q: 'Which is larger, the Solar System or the Milky Way galaxy?', a: 'The Milky Way galaxy', w: ['The Solar System', 'They are the same', 'Neither has a size'], why: 'The Solar System is one star and its objects. The galaxy holds hundreds of billions of stars.' },
  ]) },
  { id: 's5-planets', t: 'Inner and outer planets', b: 'SC.5.E.5.2', gen: () => fromPool([
    { q: 'What are the inner planets mostly made of?', a: 'Rock and metal', w: ['Gas', 'Ice only', 'Liquid water'], why: 'Mercury, Venus, Earth and Mars are small, dense and rocky.' },
    { q: 'What are the outer planets mostly made of?', a: 'Gas', w: ['Rock', 'Metal', 'Sand'], why: 'Jupiter, Saturn, Uranus and Neptune are large gas giants.' },
    { q: 'What do all planets have in common?', a: 'They orbit the Sun and are roughly round', w: ['They all have rings', 'They all have life', 'They are all the same size'], why: 'Every planet orbits the Sun, is shaped by its own gravity, and has cleared its orbital path.' },
    { q: 'Which is larger, an inner planet or an outer planet?', a: 'Outer planets are much larger', w: ['Inner planets are larger', 'They are identical', 'Size does not vary'], why: 'The gas giants are far larger than the rocky inner planets.' },
  ]) },
  { id: 's5-solarsystem', t: 'Objects in the Solar System', b: 'SC.5.E.5.3', gen: () => fromPool([
    { q: 'What is Earth’s position from the Sun?', a: 'Third', w: ['First', 'Second', 'Fourth'], why: 'The order is Mercury, Venus, Earth, Mars, so Earth is third from the Sun.' },
    { q: 'What is an asteroid?', a: 'A rocky object orbiting the Sun', w: ['A star', 'A moon of Earth', 'A ball of gas'], why: 'Asteroids are rocky bodies, most of them in a belt between Mars and Jupiter.' },
    { q: 'Why does a comet grow a bright tail as it approaches the Sun?', a: 'Its ice heats up and streams away', w: ['It catches fire', 'It collides with planets', 'It starts spinning faster'], why: 'A comet is ice and dust. Near the Sun the ice turns to gas and trails behind it as a tail.' },
    { q: 'What is a moon?', a: 'An object that orbits a planet', w: ['An object that orbits the Sun directly', 'A small star', 'A type of comet'], why: 'Moons orbit planets, while planets orbit the Sun.' },
  ]) },
  { id: 's5-watercycle', t: 'The water cycle', b: 'SC.5.E.7.1', gen: () => fromPool([
    { q: 'Which part of the water cycle turns liquid water into vapour?', a: 'Evaporation', w: ['Condensation', 'Precipitation', 'Collection'], why: 'The Sun’s heat evaporates water from oceans, lakes and land into the air.', vis: () => svgWaterCycle('evaporation') },
    { q: 'Which part of the water cycle forms clouds?', a: 'Condensation', w: ['Evaporation', 'Precipitation', 'Collection'], why: 'Rising water vapour cools and condenses into tiny droplets, forming clouds.', vis: () => svgWaterCycle('condensation') },
    { q: 'Which part of the water cycle brings water back to Earth?', a: 'Precipitation', w: ['Evaporation', 'Condensation', 'Collection'], why: 'Rain, snow, sleet and hail are all precipitation.', vis: () => svgWaterCycle('precipitation') },
    { q: 'In the water cycle, can water change state?', a: 'Yes, between solid, liquid and gas', w: ['No, it stays liquid', 'Only from solid to liquid', 'Only once'], why: 'Water moves back and forth between solid, liquid and gas throughout the cycle.', vis: () => svgWaterCycle('collection') },
  ]) },
  { id: 's5-ocean', t: 'The ocean and the water cycle', b: 'SC.5.E.7.2', gen: () => fromPool([
    { q: 'Where does most evaporation on Earth happen?', a: 'From the ocean', w: ['From lakes', 'From rivers', 'From puddles'], why: 'The ocean holds most of Earth’s water, so it is the largest source of evaporation.' },
    { q: 'How is the ocean connected to lakes and rivers?', a: 'Through the water cycle', w: ['They are not connected', 'Only by canals', 'Only by rain in one place'], why: 'Evaporation, condensation and precipitation link every water reservoir on Earth.' },
  ]) },
  { id: 's5-weatherfactors', t: 'What makes the weather', b: 'SC.5.E.7.3', gen: () => fromPool([
    { q: 'Which instrument measures air pressure?', a: 'A barometer', w: ['A thermometer', 'An anemometer', 'A rain gauge'], why: 'A barometer measures barometric pressure, one of the factors that determines weather.' },
    { q: 'Which instrument measures wind speed?', a: 'An anemometer', w: ['A barometer', 'A thermometer', 'A rain gauge'], why: 'An anemometer spins in the wind and measures how fast it blows.' },
    { q: 'What does humidity measure?', a: 'How much water vapour is in the air', w: ['How hot the air is', 'How fast the wind blows', 'How heavy the air is'], why: 'Humidity is the amount of water vapour the air is holding.' },
    { q: 'Which of these is NOT used to describe the weather?', a: 'The soil type', w: ['Air temperature', 'Wind direction', 'Precipitation'], why: 'Weather is described by temperature, pressure, humidity, wind and precipitation.' },
  ]) },
  { id: 's5-precip', t: 'Forms of precipitation', b: 'SC.5.E.7.4', gen: () => fromPool([
    { q: 'Which form of precipitation is frozen raindrops?', a: 'Sleet', w: ['Snow', 'Hail', 'Fog'], why: 'Sleet is rain that freezes into small ice pellets as it falls through cold air.' },
    { q: 'Which precipitation forms as ice crystals in clouds?', a: 'Snow', w: ['Sleet', 'Hail', 'Rain'], why: 'Snow forms when water vapour freezes directly into ice crystals.' },
    { q: 'Which precipitation forms in layers inside a thunderstorm?', a: 'Hail', w: ['Rain', 'Snow', 'Sleet'], why: 'Hailstones are carried up and down in a storm, gaining icy layers each time.' },
    { q: 'Which type of precipitation is most common in Florida?', a: 'Rain', w: ['Snow', 'Sleet', 'Hail'], why: 'Florida’s warm climate means precipitation almost always falls as rain.' },
  ]) },
  { id: 's5-environments', t: 'Weather differs between places', b: 'SC.5.E.7.5', gen: () => fromPool([
    { q: 'Why is it usually cooler in a forest than in an open field on a hot day?', a: 'Trees provide shade', w: ['Forests make their own cold', 'Fields have no air', 'Trees block the wind only'], why: 'Different environments have different temperatures and humidity, partly because of shade and plant cover.' },
    { q: 'Which place is likely to be most humid?', a: 'A swamp', w: ['A desert', 'A mountain top', 'A paved car park'], why: 'Standing water and plants put more water vapour into the air.' },
  ]) },
  { id: 's5-climate', t: 'Climate zones', b: 'SC.5.E.7.6', gen: () => fromPool([
    { q: 'What happens to temperature as you move away from the equator?', a: 'It generally gets cooler', w: ['It gets hotter', 'It stays identical', 'It becomes random'], why: 'Latitude affects climate: places near the equator get more direct sunlight and are warmer.' },
    { q: 'What happens to temperature as you climb a tall mountain?', a: 'It gets colder', w: ['It gets warmer', 'It stays the same', 'It doubles'], why: 'Higher elevation means colder air, which is why tall mountains have snow even near the equator.' },
    { q: 'Why do coastal areas often have milder temperatures than inland areas?', a: 'The ocean heats and cools slowly', w: ['The ocean makes wind stop', 'Coasts are always higher', 'Coasts get no sunlight'], why: 'Large bodies of water change temperature slowly, which moderates nearby land.' },
    { q: 'What is the difference between weather and climate?', a: 'Weather is now; climate is the long-term pattern', w: ['They are the same', 'Climate is today only', 'Weather lasts for centuries'], why: 'Weather describes conditions right now. Climate is the average pattern over many years.' },
  ]) },
  { id: 's5-prepare', t: 'Preparing for natural disasters', b: 'SC.5.E.7.7', gen: () => fromPool([
    { q: 'Why should a family make a disaster plan before hurricane season?', a: 'So everyone knows what to do in an emergency', w: ['To prevent the hurricane', 'To predict the exact path', 'It is not useful'], why: 'A plan made in advance means nobody has to decide under pressure.' },
    { q: 'What belongs in an emergency supply kit?', a: 'Water, food, a torch and a radio', w: ['Only snacks', 'Only toys', 'Only money'], why: 'A kit should cover basic needs and communication for several days.' },
  ]) },
  { id: 's5-organs', t: 'Human organs', b: 'SC.5.L.14.1', gen: () => fromPool([
    { q: 'Which two organs work together so that oxygen reaches every part of the body?', a: 'The lungs and the heart', w: ['The stomach and the liver', 'The brain and the skin', 'The kidneys and the lungs'], why: 'The lungs take oxygen into the blood and the heart pumps that blood around the body.' },
    { q: 'Which organ exchanges oxygen and carbon dioxide?', a: 'Lungs', w: ['Heart', 'Kidneys', 'Pancreas'], why: 'Lungs take in oxygen and release carbon dioxide.' },
    { q: 'Which organ is the largest organ of the human body?', a: 'Skin', w: ['Brain', 'Liver', 'Heart'], why: 'Skin covers the whole body, protects it and helps control temperature.' },
    { q: 'Which organ filters waste from the blood?', a: 'Kidneys', w: ['Lungs', 'Brain', 'Stomach'], why: 'The kidneys remove waste and extra water, making urine.' },
    { q: 'Which organ controls the body and processes information?', a: 'Brain', w: ['Heart', 'Liver', 'Stomach'], why: 'The brain runs the nervous system, controlling thought, senses and movement.' },
    { q: 'Which organ absorbs most nutrients from digested food?', a: 'Small intestine', w: ['Lungs', 'Heart', 'Skin'], why: 'The small intestine absorbs nutrients into the bloodstream.' },
  ]) },
  { id: 's5-structures', t: 'Comparing plant and animal structures', b: 'SC.5.L.14.2', gen: () => fromPool([
    { q: 'Which plant structure does a similar job to an animal’s mouth and stomach?', a: 'Leaves, which produce food', w: ['Roots', 'Bark', 'Petals'], why: 'Animals take in food; leaves make it. Both are how the organism gets its energy.' },
    { q: 'Which plant part is most like an animal’s skeleton, holding it upright?', a: 'Stem', w: ['Flower', 'Seed', 'Leaf'], why: 'The stem supports the plant, much as a skeleton supports an animal.' },
    { q: 'What do roots and an animal’s digestive system have in common?', a: 'Both take in what the organism needs', w: ['Both make seeds', 'Both pump blood', 'Both make light'], why: 'Roots absorb water and nutrients; the digestive system absorbs nutrients from food.' },
  ]) },
  { id: 's5-variation', t: 'Variation and survival', b: 'SC.5.L.15.1', gen: () => fromPool([
    { q: 'A drought comes. Which plants are most likely to survive?', a: 'Those that need less water', w: ['Those that need the most water', 'All equally', 'The tallest ones'], why: 'When the environment changes, individuals with helpful differences are more likely to survive and reproduce.' },
    { q: 'Why do differences between individuals matter when the environment changes?', a: 'Some individuals will cope better', w: ['Differences never matter', 'All individuals are identical', 'Change never happens'], why: 'Variation means some individuals happen to be better suited to the new conditions.' },
    { q: 'Beetles on dark bark are eaten by birds. Which beetles survive best?', a: 'Dark beetles that blend in', w: ['Bright red beetles', 'The largest beetles', 'The loudest beetles'], why: 'Camouflage makes those individuals harder to find, so more survive to reproduce.' },
  ]) },
  { id: 's5-adaptations', t: 'Adaptations', b: 'SC.5.L.17.1', gen: () => fromPool([
    { q: 'How does a cactus survive in the desert?', a: 'It stores water in a thick stem', w: ['It drinks daily rain', 'It has huge flat leaves', 'It lives underwater'], why: 'Desert plants have adaptations that store water and reduce loss.' },
    { q: 'Why do polar bears have thick fur and fat?', a: 'To keep warm in the cold', w: ['To swim faster only', 'To hide from the Sun', 'To catch fish with'], why: 'These adaptations conserve body heat in a freezing environment.' },
    { q: 'What is camouflage?', a: 'Colouring that helps an animal blend in', w: ['A loud warning call', 'A thick shell', 'A long migration'], why: 'Camouflage helps an animal avoid being seen by predators or prey.' },
    { q: 'A duck has webbed feet. What is this an adaptation for?', a: 'Swimming', w: ['Digging', 'Climbing trees', 'Flying faster'], why: 'Webbed feet push more water, which helps the duck swim.' },
    { q: 'Why do many desert animals come out only at night?', a: 'To avoid the daytime heat', w: ['They cannot see in daylight', 'Food only grows at night', 'They are afraid of colour'], why: 'Being active at night is a behavioural adaptation that avoids extreme heat and water loss.' },
  ]) },
  { id: 's5-experiment', t: 'Experiments and other investigations', b: 'SC.5.N.1.2', gen: () => fromPool([
    { q: 'What makes an investigation an experiment?', a: 'A variable is deliberately changed and tested', w: ['It uses a microscope', 'It takes a long time', 'It happens outdoors'], why: 'An experiment tests a variable. Observing without changing anything is a different kind of investigation.' },
    { q: 'Counting birds at a feeder for a month is which kind of investigation?', a: 'A systematic observation, not an experiment', w: ['An experiment', 'Not science at all', 'A control group'], why: 'Nothing is being deliberately changed, so it is an observational study.' },
  ]) },
  { id: 's5-trials', t: 'Repeated trials', b: 'SC.5.N.1.3', gen: () => fromPool([
    { q: 'Why do scientists repeat an experiment several times?', a: 'To check the result is reliable', w: ['To use more materials', 'To take longer', 'To get a different answer'], why: 'Repeated trials show whether a result is consistent or was a one-off.' },
    { q: 'A student tests a paper aeroplane once and it flies far. What should they do next?', a: 'Fly it several more times', w: ['Publish the result', 'Assume it always flies far', 'Change the design first'], why: 'One trial is not enough evidence. Repeating reveals the typical result.' },
  ]) },
  { id: 's5-control', t: 'The control group', b: 'SC.5.N.1.4', gen: () => fromPool([
    { q: 'You test whether fertiliser helps plants grow. What is the control group?', a: 'Plants grown with no fertiliser', w: ['Plants with double fertiliser', 'Plants in the dark', 'Plants with no water'], why: 'The control is treated identically except for the one variable being tested.' },
    { q: 'Why does an experiment need a control group?', a: 'To compare against and see what the variable did', w: ['To make it longer', 'To use more plants', 'It is optional'], why: 'Without a control there is nothing to compare with, so you cannot tell what caused any change.' },
    { q: 'In a fair test, how many variables should you change at once?', a: 'One', w: ['Two', 'As many as possible', 'None'], why: 'Changing one variable at a time is the only way to know what caused the result.' },
  ]) },
  { id: 's5-realmethod', t: 'Real science is messy', b: 'SC.5.N.1.5', gen: () => fromPool([
    { q: 'Does real scientific work always follow the steps of "the scientific method" in order?', a: 'No, it often does not', w: ['Yes, always exactly', 'Yes, or it is not science', 'Only in textbooks is it messy'], why: 'Authentic investigation frequently loops back, changes direction and does not follow a fixed order.' },
    { q: 'A scientist’s experiment fails and they redesign it. Is that still science?', a: 'Yes, that is normal science', w: ['No, they failed', 'Only if it works first time', 'No, they must start over'], why: 'Revising after unexpected results is a normal and valuable part of science.' },
  ]) },
  { id: 's5-opinion', t: 'Opinion versus verified observation', b: 'SC.5.N.1.6', gen: () => fromPool([
    { q: 'Which statement is a verified observation?', a: 'The liquid boiled at 100 degrees Celsius', w: ['Boiling is exciting', 'This is the best experiment', 'Water is the nicest liquid'], why: 'A verified observation can be measured and checked. The others are personal opinions.' },
    { q: 'Which statement is a personal interpretation?', a: 'This plant looks healthiest', w: ['This plant is 32 cm tall', 'This plant has 14 leaves', 'This plant weighs 40 g'], why: '"Healthiest" is a judgement. The others are measurements anyone could verify.' },
  ]) },
  { id: 's5-testable', t: 'Science must be testable', b: 'SC.5.N.2.1', gen: () => fromPool([
    { q: 'What must every scientific explanation be linked to?', a: 'Evidence that can be tested', w: ['A famous name', 'A popular vote', 'A personal belief'], why: 'Science is grounded in empirical observations that are testable, and explanations must connect to that evidence.' },
    { q: 'Which question is testable by science?', a: 'Does salt water freeze at a lower temperature than fresh water?', w: ['Is winter the best season?', 'Which colour is prettiest?', 'Is snow nicer than rain?'], why: 'A testable question can be answered by observation and measurement.' },
  ]) },
  { id: 's5-replicate', t: 'Evidence should be repeatable', b: 'SC.5.N.2.2', gen: () => fromPool([
    { q: 'Another scientist repeats your experiment and gets a very different result. What does this suggest?', a: 'The original result needs re-checking', w: ['They must be wrong', 'You must be wrong', 'Science does not work'], why: 'Evidence from investigations should be replicable, so a mismatch means something needs examining.' },
    { q: 'Why does it matter that other scientists can repeat an investigation?', a: 'It confirms the evidence is trustworthy', w: ['It wastes their time', 'It proves the first was lying', 'It is only tradition'], why: 'Replication is how the scientific community checks that a result is real.' },
  ]) },
  { id: 's5-energyforms5', t: 'Forms of energy', b: 'SC.5.P.10.1', gen: () => fromPool([
    { q: 'What form of energy is stored in food and batteries?', a: 'Chemical', w: ['Sound', 'Light', 'Mechanical'], why: 'Chemical energy is stored in substances and released by reactions.' },
    { q: 'A wind-up toy running across the floor mainly shows which form of energy?', a: 'Mechanical', w: ['Chemical', 'Electrical', 'Light'], why: 'Mechanical energy is the energy of movement and position.' },
    { q: 'Which form of energy travels to your ears from a drum?', a: 'Sound', w: ['Light', 'Chemical', 'Electrical'], why: 'Vibrations travel through the air as sound energy.' },
  ]) },
  { id: 's5-energycause5', t: 'Energy causes change', b: 'SC.5.P.10.2', gen: () => fromPool([
    { q: 'A battery-powered fan spins. Which energy change happened?', a: 'Chemical to electrical to mechanical', w: ['Light to sound', 'Sound to chemical', 'No change occurred'], why: 'Chemical energy in the battery becomes electrical energy, which becomes motion.' },
    { q: 'What evidence tells you energy was transferred to an object?', a: 'It moved or changed', w: ['It stayed exactly the same', 'It disappeared', 'It changed colour only'], why: 'Energy is what causes motion or change, so motion or change is the evidence.' },
  ]) },
  { id: 's5-static', t: 'Static electricity', b: 'SC.5.P.10.3', gen: () => fromPool([
    { q: 'You rub a balloon on your hair and it sticks to a wall. Why?', a: 'The charged balloon attracts the uncharged wall', w: ['The balloon is sticky', 'The wall is magnetic', 'The balloon got heavier'], why: 'An electrically charged object can attract an uncharged one.' },
    { q: 'Two balloons are both rubbed on hair, then brought together. What happens?', a: 'They push apart', w: ['They pull together', 'They pop', 'Nothing happens'], why: 'Objects with the same charge repel each other.' },
    { q: 'What happens between objects with opposite charges?', a: 'They attract', w: ['They repel', 'They stay neutral', 'They lose charge instantly'], why: 'Opposite charges attract; like charges repel.' },
  ]) },
  { id: 's5-transform', t: 'Transforming electrical energy', b: 'SC.5.P.10.4', gen: () => fromPool([
    { q: 'A lamp transforms electrical energy mainly into what?', a: 'Light and heat', w: ['Sound and motion', 'Chemical energy', 'Nothing'], why: 'Electrical energy can be transformed into heat, light, sound and motion.' },
    { q: 'A radio transforms electrical energy into what?', a: 'Sound', w: ['Chemical energy', 'Only heat', 'Nothing'], why: 'A radio converts electrical energy into sound energy.' },
    { q: 'An electric fan transforms electrical energy into what?', a: 'Energy of motion', w: ['Chemical energy', 'Light only', 'Sound only'], why: 'The motor turns electrical energy into mechanical energy, moving the blades.' },
  ]) },
  { id: 's5-circuit', t: 'Closed circuits', b: 'SC.5.P.11.1', gen: () => fromPool([
    { q: 'What does electricity need in order to flow?', a: 'A complete, closed loop', w: ['A broken wire', 'An open switch', 'A single wire end'], why: 'Current only flows around a closed circuit, a complete loop from the source and back.' },
    { q: 'A bulb goes out when a switch is opened. Why?', a: 'The circuit is no longer complete', w: ['The bulb ran out of light', 'The battery vanished', 'The wire melted'], why: 'Opening the switch breaks the loop, so current stops flowing.' },
    { q: 'What is an open circuit?', a: 'A circuit with a gap, so no current flows', w: ['A circuit that works', 'A circuit with two batteries', 'A circuit made of metal'], why: 'A gap anywhere in the loop stops the flow of electricity.' },
  ]) },
  { id: 's5-conductors5', t: 'Electrical conductors and insulators', b: 'SC.5.P.11.2', gen: () => fromPool([
    { q: 'Which material conducts electricity?', a: 'Copper', w: ['Rubber', 'Glass', 'Wood'], why: 'Metals such as copper conduct electricity, which is why wires are made of them.' },
    { q: 'Which material is an electrical insulator?', a: 'Rubber', w: ['Copper', 'Silver', 'Aluminium'], why: 'Rubber, plastic, glass and wood do not let current flow easily.' },
    { q: 'Why are electrical wires wrapped in plastic?', a: 'Plastic is an insulator and keeps people safe', w: ['Plastic conducts better', 'It makes the wire heavier', 'For colour only'], why: 'The insulating cover stops current escaping to anything that touches the wire.' },
  ]) },
  { id: 's5-forces5', t: 'Familiar forces', b: 'SC.5.P.13.1', gen: () => fromPool([
    { q: 'What force pulls a dropped ball to the ground?', a: 'Gravity', w: ['Magnetism', 'Friction', 'Electricity'], why: 'Gravity acts on falling objects, pulling them toward Earth.' },
    { q: 'What force slows a book sliding across a table?', a: 'Friction', w: ['Gravity', 'Magnetism', 'Static charge'], why: 'Friction acts between surfaces that rub together, opposing the motion.' },
    { q: 'Which of these is a contact force?', a: 'A push on a door', w: ['Gravity', 'Magnetism', 'Static attraction'], why: 'A push or pull requires touching. Gravity and magnetism act at a distance.' },
  ]) },
  { id: 's5-moreforce', t: 'More force, more change', b: 'SC.5.P.13.2', gen: () => fromPool([
    { q: 'Two identical carts are pushed, one gently and one hard. Which speeds up more?', a: 'The one pushed hard', w: ['The one pushed gently', 'They speed up the same', 'Neither moves'], why: 'The greater the force applied, the greater the change in motion.' },
    { q: 'How could you make a ball roll farther without changing the ball?', a: 'Push it with more force', w: ['Push it with less force', 'Do not push it', 'Make it heavier'], why: 'A larger force produces a larger change in motion.' },
  ]) },
  { id: 's5-mass', t: 'More mass, less effect', b: 'SC.5.P.13.3', gen: () => fromPool([
    { q: 'The same push is given to a bowling ball and a tennis ball. Which speeds up more?', a: 'The tennis ball', w: ['The bowling ball', 'They speed up equally', 'Neither moves'], why: 'The more mass an object has, the less effect a given force has on its motion.' },
    { q: 'Why is an empty shopping trolley easier to start moving than a full one?', a: 'It has less mass', w: ['It has more mass', 'It has no wheels', 'Gravity is weaker'], why: 'Less mass means the same push produces a bigger change in motion.' },
  ]) },
  { id: 's5-balanced', t: 'Balanced forces', b: 'SC.5.P.13.4', gen: () => fromPool([
    { q: 'You push hard on a wall but it does not move. Why?', a: 'An opposing force balances your push', w: ['You applied no force', 'Walls have no mass', 'Gravity switched off'], why: 'When a force is applied but nothing moves, another force is acting in the opposite direction.' },
    { q: 'In a tug of war neither team moves. What does this tell you?', a: 'The forces are balanced', w: ['Nobody is pulling', 'One side is much stronger', 'The rope is broken'], why: 'Equal and opposite forces cancel out, so there is no change in motion.' },
    { q: 'A book rests on a table. Which forces act on it?', a: 'Gravity down and the table pushing up', w: ['Only gravity', 'Only the table', 'No forces at all'], why: 'The two forces balance, which is why the book stays still.' },
  ]) },
  { id: 's5-statesprops', t: 'Properties of solids, liquids and gases', b: 'SC.5.P.8.1', gen: () => fromPool([
    { q: 'Which state has a definite shape AND a definite volume?', a: 'Solid', w: ['Liquid', 'Gas', 'None of them'], why: 'Solids keep both their shape and their volume.', vis: () => svgStates('solid') },
    { q: 'Which state has a definite volume but takes the shape of its container?', a: 'Liquid', w: ['Solid', 'Gas', 'None of them'], why: 'Liquids keep their volume but flow into the shape of whatever holds them.', vis: () => svgStates('liquid') },
    { q: 'Which state spreads out to fill its whole container?', a: 'Gas', w: ['Solid', 'Liquid', 'None of them'], why: 'Gas particles spread apart to fill all the available space.', vis: () => svgStates('gas') },
    { q: 'Do gases have mass?', a: 'Yes', w: ['No, they are weightless', 'Only when cold', 'Only in a balloon'], why: 'All matter, including gas, has mass and takes up space.' },
  ]) },
  { id: 's5-dissolve', t: 'What dissolves in water', b: 'SC.5.P.8.2', gen: () => fromPool([
    { q: 'Which of these dissolves in water?', a: 'Salt', w: ['Sand', 'Pepper', 'Small pebbles'], why: 'Salt and sugar dissolve in water. Sand and pepper do not.' },
    { q: 'What speeds up how quickly sugar dissolves in water?', a: 'Stirring and warmer water', w: ['Colder water', 'Larger crystals', 'Leaving it still'], why: 'Heat, stirring and smaller pieces all make a substance dissolve faster.' },
    { q: 'You stir sand into water and it settles at the bottom. Did it dissolve?', a: 'No', w: ['Yes', 'Only partly', 'It became a gas'], why: 'A dissolved substance spreads through the liquid and does not settle out.' },
    { q: 'Which change would make sugar dissolve MORE SLOWLY?', a: 'Using ice-cold water', w: ['Stirring harder', 'Heating the water', 'Crushing the sugar first'], why: 'Cold water, still water and larger lumps all slow dissolving down. Heat, stirring and smaller pieces speed it up.' },
  ]) },
  { id: 's5-separate', t: 'Separating mixtures', b: 'SC.5.P.8.3', gen: () => fromPool([
    { q: 'How could you separate iron filings from sand?', a: 'Use a magnet', w: ['Add water', 'Heat the mixture', 'Wait for it to settle'], why: 'Mixtures of solids can be separated using observable properties, and iron is magnetic.' },
    { q: 'How could you separate large marbles from fine sand?', a: 'Use a sieve', w: ['Use a magnet', 'Add salt', 'Freeze it'], why: 'A sieve separates by particle size.' },
    { q: 'How could you get salt back from salt water?', a: 'Let the water evaporate', w: ['Use a magnet', 'Use a sieve', 'Add more water'], why: 'Evaporating the water leaves the dissolved salt behind.' },
  ]) },
  { id: 's5-atoms', t: 'Atomic theory', b: 'SC.5.P.8.4', gen: () => fromPool([
    { q: 'What is all matter made of?', a: 'Tiny parts too small to see', w: ['Only what we can see', 'Solid blocks with no parts', 'Nothing at all'], why: 'Atomic theory says all matter is composed of parts far too small to be seen without magnification.' },
    { q: 'Why can you not see an atom with an ordinary microscope?', a: 'Atoms are far too small', w: ['Atoms are invisible by choice', 'Atoms do not exist', 'Atoms are too bright'], why: 'Atoms are smaller than the wavelength of visible light, so ordinary microscopes cannot show them.' },
    { q: 'A sugar cube dissolves and seems to vanish. What actually happened?', a: 'Its tiny parts spread through the water', w: ['It stopped existing', 'It turned into water', 'It became energy'], why: 'The sugar broke into particles too small to see, but it is still there, which is why the water tastes sweet.' },
  ]) },
  { id: 's5-tempchange', t: 'Temperature affects change', b: 'SC.5.P.9.1', gen: () => fromPool([
    { q: 'Which change is caused by raising the temperature?', a: 'Butter melting', w: ['Water freezing', 'Juice turning to ice', 'Steam condensing'], why: 'Many physical and chemical changes are affected by temperature. Heat melts solids.' },
    { q: 'Why does bread dough rise faster in a warm room?', a: 'Warmth speeds up the change', w: ['Warmth slows it down', 'Temperature has no effect', 'Cold is required'], why: 'Higher temperatures generally speed up chemical changes.' },
    { q: 'Food is kept in a fridge to slow spoiling. Why does this work?', a: 'Cold slows the changes down', w: ['Cold stops all change forever', 'Cold adds nutrients', 'Cold removes bacteria completely'], why: 'Lower temperature slows the chemical changes that spoil food.' },
  ]) },
];

const GRADES = { 1: G1, 2: G2, 3: G3, 4: G4, 5: G5 };

/* ------------------------------------------------------------ the climb
   Levels follow the NGSSS Big Ideas themselves, so clearing a grade means
   every benchmark in that grade has been practised. The last level of each
   grade mixes everything.                                              */

const LEVELS = {
  1: [
    { n: 1, name: 'Sky and Sun', topics: ['s1-stars', 's1-gravity', 's1-magnifiers', 's1-sun'] },
    { n: 2, name: 'Our Earth', topics: ['s1-surface', 's1-water', 's1-fastslow'] },
    { n: 3, name: 'Living Things', topics: ['s1-senses', 's1-plantparts', 's1-living'] },
    { n: 4, name: 'Parents and Needs', topics: ['s1-parents', 's1-needs'] },
    { n: 5, name: 'Think Like a Scientist', topics: ['s1-questions', 's1-observe', 's1-records'] },
    { n: 6, name: 'Motion, Pushes and Pulls', topics: ['s1-motion', 's1-pushpull'] },
    { n: 7, name: 'Sorting Objects', topics: ['s1-sort'] },
    { n: 8, name: 'Champion Round', topics: '*', boss: true },
  ],
  2: [
    { n: 1, name: 'Rocks and Soil', topics: ['s2-rocks', 's2-soil', 's2-soiltypes'] },
    { n: 2, name: 'Weather and Water', topics: ['s2-patterns', 's2-sunwarms', 's2-evaporate', 's2-air', 's2-severe'] },
    { n: 3, name: 'Bodies and Life Cycles', topics: ['s2-body', 's2-lifecycle'] },
    { n: 4, name: 'Needs and Habitats', topics: ['s2-needs2', 's2-habitats'] },
    { n: 5, name: 'Think Like a Scientist', topics: ['s2-invest', 's2-compare', 's2-repeat', 's2-inference', 's2-scientists'] },
    { n: 6, name: 'Forces and Magnets', topics: ['s2-forces', 's2-magnets', 's2-gravity2', 's2-biggerforce'] },
    { n: 7, name: 'Matter', topics: ['s2-properties', 's2-states', 's2-shape', 's2-waterstates', 's2-temp', 's2-volume'] },
    { n: 8, name: 'Energy and Change', topics: ['s2-energyuse', 's2-change'] },
    { n: 9, name: 'Champion Round', topics: '*', boss: true },
  ],
  3: [
    { n: 1, name: 'Stars and the Sun', topics: ['s3-stars', 's3-sunstar', 's3-closest', 's3-overcome', 's3-telescope'] },
    { n: 2, name: 'The Sun Heats Earth', topics: ['s3-radiant'] },
    { n: 3, name: 'Plants', topics: ['s3-plantstruct', 's3-stimuli', 's3-photosynth'] },
    { n: 4, name: 'Classifying Living Things', topics: ['s3-animalgroups', 's3-plantgroups', 's3-seasons'] },
    { n: 5, name: 'Think Like a Scientist', topics: ['s3-invest3', 's3-differences', 's3-records3', 's3-communicate', 's3-checking', 's3-infer', 's3-evidence'] },
    { n: 6, name: 'Science Words and Models', topics: ['s3-words', 's3-models', 's3-modellimits'] },
    { n: 7, name: 'Energy and Light', topics: ['s3-energyforms', 's3-energychange', 's3-lightline', 's3-lightbehave'] },
    { n: 8, name: 'Heat', topics: ['s3-lightheat', 's3-friction'] },
    { n: 9, name: 'Matter and Water', topics: ['s3-temp3', 's3-massvol', 's3-materials', 's3-waterchange'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
  4: [
    { n: 1, name: 'Earth in Space', topics: ['s4-starpatterns', 's4-moonphases', 's4-revolve', 's4-daynight', 's4-space'] },
    { n: 2, name: 'Rocks and Minerals', topics: ['s4-rocktypes', 's4-minerals'] },
    { n: 3, name: 'Resources and Weathering', topics: ['s4-resources', 's4-weathering', 's4-tools', 's4-flresources'] },
    { n: 4, name: 'Reproduction and Heredity', topics: ['s4-pollination', 's4-inherited', 's4-behavior', 's4-metamorphosis'] },
    { n: 5, name: 'Energy Through Living Things', topics: ['s4-flseasons', 's4-consumers', 's4-foodchain', 's4-impact'] },
    { n: 6, name: 'Think Like a Scientist', topics: ['s4-multitools', 's4-method', 's4-cite', 's4-classmates', 's4-records4', 's4-basedon', 's4-creativity'] },
    { n: 7, name: 'What Science Is', topics: ['s4-natural', 's4-modeltypes'] },
    { n: 8, name: 'Energy and Sound', topics: ['s4-energyforms4', 's4-energycause', 's4-sound', 's4-windwater'] },
    { n: 9, name: 'Heat and Motion', topics: ['s4-heatflow', 's4-conductors', 's4-position', 's4-speed'] },
    { n: 10, name: 'Matter and Magnets', topics: ['s4-physprops', 's4-wateruses', 's4-conservemass', 's4-magnets4', 's4-newmaterials'] },
    { n: 11, name: 'Champion Round', topics: '*', boss: true },
  ],
  5: [
    { n: 1, name: 'Galaxies and Planets', topics: ['s5-galaxy', 's5-planets', 's5-solarsystem'] },
    { n: 2, name: 'The Water Cycle', topics: ['s5-watercycle', 's5-ocean'] },
    { n: 3, name: 'Weather and Climate', topics: ['s5-weatherfactors', 's5-precip', 's5-environments', 's5-climate', 's5-prepare'] },
    { n: 4, name: 'Bodies and Structures', topics: ['s5-organs', 's5-structures'] },
    { n: 5, name: 'Survival and Adaptation', topics: ['s5-variation', 's5-adaptations'] },
    { n: 6, name: 'How Experiments Work', topics: ['s5-experiment', 's5-trials', 's5-control', 's5-realmethod', 's5-opinion'] },
    { n: 7, name: 'Evidence and Testing', topics: ['s5-testable', 's5-replicate'] },
    { n: 8, name: 'Energy and Electricity', topics: ['s5-energyforms5', 's5-energycause5', 's5-static', 's5-transform'] },
    { n: 9, name: 'Circuits', topics: ['s5-circuit', 's5-conductors5'] },
    { n: 10, name: 'Forces and Motion', topics: ['s5-forces5', 's5-moreforce', 's5-mass', 's5-balanced'] },
    { n: 11, name: 'Matter', topics: ['s5-statesprops', 's5-dissolve', 's5-separate', 's5-atoms', 's5-tempchange'] },
    { n: 12, name: 'Champion Round', topics: '*', boss: true },
  ],
};

function topicsFor(grade, L) {
  const all = GRADES[grade];
  if (L.topics === '*') return all;
  return all.filter(t => L.topics.includes(t.id));
}

/* ------------------------------------------------------------- how to
   One card per topic: how to think about this standard, not the answer to
   the question on screen. The benchmark's own idea, in a child's words. */

const HOW = {
  's4-starpatterns': { steps: ['Star patterns keep their shape.', 'Earth’s rotation makes them appear to shift nightly.', 'Earth’s orbit changes which ones we see across the year.'], eg: 'Winter and summer show different constellations.' },
  's4-moonphases': { steps: ['Half the Moon is always lit by the Sun.', 'We see different amounts of that lit half as it orbits.', 'The full cycle takes about a month.'], eg: 'At full Moon the whole visible face is lit.' },
  's4-revolve': { steps: ['Rotation is spinning on its own axis, once a day.', 'Revolution is orbiting the Sun, once a year.', 'Do not swap the two words.'], eg: 'Earth rotates in 24 hours and revolves in 365 days.' },
  's4-daynight': { steps: ['Earth’s rotation causes day and night.', 'It also makes the Sun, Moon and stars appear to move.', 'They are not really crossing our sky; we are turning.'], eg: 'The Sun appears to move west because Earth turns east.' },
  's4-space': { steps: ['Florida is a centre of space launches.', 'Kennedy Space Center is on the east coast.', 'Space work brought jobs, industry and tourism.'], eg: 'Rockets have launched from Florida for decades.' },
  's4-rocktypes': { steps: ['Igneous forms from cooled molten rock.', 'Sedimentary forms from pressed layers and fossils.', 'Metamorphic forms from rock changed by heat and pressure.'], eg: 'Fossils are found in sedimentary rock.' },
  's4-minerals': { steps: ['Hardness is what scratches what.', 'Streak is the colour of the powder.', 'Luster is how it reflects light; cleavage is how it breaks.'], eg: 'Streak is more reliable than surface colour.' },
  's4-resources': { steps: ['Renewable resources are replaced quickly by nature.', 'Nonrenewable ones take millions of years.', 'Sun and wind renew; oil and coal do not.'], eg: 'Once oil is burned it is effectively gone.' },
  's4-weathering': { steps: ['Physical weathering breaks rock without changing it.', 'Chemical weathering makes a new substance.', 'Erosion carries the pieces away.'], eg: 'Ice cracking rock is physical; acid dissolving limestone is chemical.' },
  's4-tools': { steps: ['Microscopes reveal the very small.', 'Telescopes reveal the very distant.', 'Tools extend our senses beyond their limits.'], eg: 'A microscope shows cells your eyes cannot.' },
  's4-flresources': { steps: ['Florida has phosphate, limestone, oil, silicon and water.', 'Sun and wind are its renewable resources.', 'Limestone underlies much of the state.'], eg: 'Florida phosphate is mined for fertiliser.' },
  's4-pollination': { steps: ['Pollination moves pollen between flower parts.', 'Fertilisation then makes seeds.', 'Dispersal spreads seeds; germination starts growth.'], eg: 'Bees carry pollen from flower to flower.' },
  's4-inherited': { steps: ['Traits are inherited from parents.', 'The environment can still change how they turn out.', 'Both matter together.'], eg: 'The same plant grows shorter in poor soil.' },
  's4-behavior': { steps: ['Inherited behaviour appears without teaching.', 'Learned behaviour comes from experience or training.', 'Ask whether it had to be taught.'], eg: 'A spider spins a web instinctively; a dog learns to sit.' },
  's4-metamorphosis': { steps: ['Complete has four stages including a pupa.', 'Incomplete has three, and the young resemble the adult.', 'Look for the pupa to tell them apart.'], eg: 'Butterflies are complete; grasshoppers are incomplete.' },
  's4-flseasons': { steps: ['Florida winters are mild with little snow.', 'Its year is more wet season and dry season.', 'Compare to colder northern regions.'], eg: 'Fewer Florida trees drop all their leaves in autumn.' },
  's4-consumers': { steps: ['Plants make their own food; animals cannot.', 'Animals eat to get energy.', 'Eating transfers stored energy along.'], eg: 'A rabbit gets energy by eating grass.' },
  's4-foodchain': { steps: ['Energy starts at the Sun.', 'Producers capture it; consumers eat to get it.', 'Arrows point the way energy travels.'], eg: 'Sun to algae to shrimp to fish.' },
  's4-impact': { steps: ['People and animals both change environments.', 'Some changes help, some harm.', 'Look for the effect on living things.'], eg: 'Planting trees helps; dumping waste harms.' },
  's4-multitools': { steps: ['Different tools have different precision.', 'Compare methods when results differ.', 'Look for a reason rather than picking a favourite.'], eg: 'A finer ruler gives a more exact length.' },
  's4-method': { steps: ['There is no single fixed scientific method.', 'Real investigations loop and change direction.', 'But all of them use evidence.'], eg: 'Methods vary; evidence and reasoning do not.' },
  's4-cite': { steps: ['Back an answer with evidence.', 'Say what you observed or measured.', 'A claim without evidence is just an opinion.'], eg: '"It grew 5 cm, I measured weekly" is well supported.' },
  's4-classmates': { steps: ['Compare your method with others.', 'Different methods explain different results.', 'Never change your data to match.'], eg: 'Comparing procedures finds the real source of a difference.' },
  's4-records4': { steps: ['Write what you observed separately from what you concluded.', 'Observations are measurements and descriptions.', 'Inferences are explanations.'], eg: '"8 cm and yellow" is observed. "It is dying" is inferred.' },
  's4-basedon': { steps: ['Explanations must rest on evidence.', 'New evidence can change an explanation.', 'Authority and popularity are not evidence.'], eg: 'When evidence contradicts an idea, the idea is revisited.' },
  's4-creativity': { steps: ['Designing a good experiment takes imagination.', 'There is often more than one way to test an idea.', 'Creativity is part of science, not opposed to it.'], eg: 'Inventing a clever test is a creative act.' },
  's4-natural': { steps: ['Science studies the natural world.', 'Testable questions belong to science.', 'Matters of taste and opinion do not.'], eg: '"How fast does ice melt in salt water?" is a science question.' },
  's4-modeltypes': { steps: ['Models can be 3D, 2D, mental or computer based.', 'All of them represent something real.', 'The kind depends on what is easiest to work with.'], eg: 'A globe is 3D; a water cycle diagram is 2D.' },
  's4-energyforms4': { steps: ['Light, heat, sound, electrical and motion are forms of energy.', 'Anything moving has energy of motion.', 'One event can involve several forms.'], eg: 'A campfire gives off light and heat.' },
  's4-energycause': { steps: ['Energy can change from one form to another.', 'Motion or a temperature change is the evidence.', 'Follow the energy through the device.'], eg: 'A toaster turns electrical energy into heat.' },
  's4-sound': { steps: ['Sound comes from vibrating objects.', 'Faster vibration means higher pitch.', 'Slower vibration means lower pitch.'], eg: 'A big drum vibrates slowly and sounds low.' },
  's4-windwater': { steps: ['Moving air and moving water carry energy.', 'That energy can be used to move things.', 'Windmills and water wheels both do this.'], eg: 'Wind turns turbine blades to do work.' },
  's4-heatflow': { steps: ['Heat always flows from hotter to colder.', 'Cold does not flow; heat does.', 'The flow continues until temperatures match.'], eg: 'Heat moves from warm water into an ice cube.' },
  's4-conductors': { steps: ['Conductors let heat pass easily; metals do.', 'Insulators resist heat; wood, plastic and cloth do.', 'Handles are made of insulators for a reason.'], eg: 'Oven mitts are cloth because cloth conducts heat poorly.' },
  's4-position': { steps: ['Motion means the position changes.', 'The direction may change too.', 'Both are worth checking.'], eg: 'A car rounding a bend changes position and direction.' },
  's4-speed': { steps: ['Speed is distance divided by time.', 'Keep the units together, such as metres per second.', 'Same distance in less time means faster.'], eg: '60 metres in 5 seconds is 12 metres per second.' },
  's4-physprops': { steps: ['Mass is amount of matter, found with a balance.', 'Volume is space taken up.', 'Properties can be measured; opinions cannot.'], eg: 'A graduated cylinder measures volume.' },
  's4-wateruses': { steps: ['Solid water is ice, for cooling.', 'Liquid water flows, so it can be piped.', 'Gaseous water is steam, which carries heat.'], eg: 'Steaming vegetables uses water as a gas.' },
  's4-conservemass': { steps: ['Breaking or dissolving does not destroy matter.', 'The parts still add up to the whole.', 'Add every piece back together.'], eg: '5 g of salt in 95 g of water still totals 100 g.' },
  's4-magnets4': { steps: ['Opposite poles attract; like poles repel.', 'Magnets attract iron, nickel and steel.', 'They do not attract plastic, wood or glass.'], eg: 'Two north poles pushed together spring apart.' },
  's4-newmaterials': { steps: ['Some changes make a genuinely new material.', 'Rusting, burning and decaying do.', 'Cutting, melting and crushing do not.'], eg: 'A rusted nail is a new substance; a cut paper is still paper.' },
  's5-galaxy': { steps: ['A galaxy is gas, dust and many stars.', 'Ours is the Milky Way.', 'A galaxy is far larger than a solar system.'], eg: 'The Milky Way holds hundreds of billions of stars.' },
  's5-planets': { steps: ['Inner planets are small, rocky and dense.', 'Outer planets are large and gaseous.', 'All planets orbit the Sun and are roughly round.'], eg: 'Earth is rocky; Jupiter is a gas giant.' },
  's5-solarsystem': { steps: ['Planets orbit the Sun; moons orbit planets.', 'Asteroids are rocky, comets are icy.', 'Earth is third from the Sun.'], eg: 'Mercury, Venus, Earth, Mars is the inner order.' },
  's5-watercycle': { steps: ['Evaporation turns liquid into vapour.', 'Condensation forms clouds.', 'Precipitation falls, and collection gathers it.'], eg: 'Rain, snow, sleet and hail are all precipitation.' },
  's5-ocean': { steps: ['The ocean holds most of Earth’s water.', 'Most evaporation happens there.', 'The cycle connects every water reservoir.'], eg: 'Ocean water can fall as rain far inland.' },
  's5-weatherfactors': { steps: ['Weather is temperature, pressure, humidity, wind and precipitation.', 'Each has its own instrument.', 'Barometer for pressure, anemometer for wind speed.'], eg: 'Humidity is how much water vapour the air holds.' },
  's5-precip': { steps: ['Rain is liquid; snow forms as ice crystals.', 'Sleet is frozen raindrops.', 'Hail grows in layers inside storms.'], eg: 'Florida’s warmth means precipitation is nearly always rain.' },
  's5-environments': { steps: ['Different places have different temperature and humidity.', 'Shade, plants and water change local conditions.', 'Compare the surroundings, not just the sky.'], eg: 'A forest is cooler than an open field on a hot day.' },
  's5-climate': { steps: ['Latitude, elevation and nearby water shape climate.', 'Farther from the equator is generally cooler.', 'Higher up is colder; coasts are milder.'], eg: 'Weather is today; climate is the long-term pattern.' },
  's5-prepare': { steps: ['A plan made early avoids decisions under pressure.', 'A kit covers water, food, light and communication.', 'Everyone should know the plan.'], eg: 'Florida families plan before hurricane season starts.' },
  's5-organs': { steps: ['Each organ has a specific job.', 'Heart pumps, lungs exchange gases, kidneys filter.', 'Skin is the largest organ.'], eg: 'The small intestine absorbs nutrients into the blood.' },
  's5-structures': { steps: ['Plants and animals solve the same problems differently.', 'Match the job, not the appearance.', 'Support, intake and reproduction all have parallels.'], eg: 'A stem supports a plant much as a skeleton supports an animal.' },
  's5-variation': { steps: ['Individuals in a species differ from each other.', 'When the environment changes, some differences help.', 'Those individuals survive and reproduce more.'], eg: 'In a drought, plants needing less water survive.' },
  's5-adaptations': { steps: ['An adaptation helps survival in a particular place.', 'It can be a body feature or a behaviour.', 'Match the adaptation to the environment’s challenge.'], eg: 'A cactus stores water; a polar bear keeps heat in.' },
  's5-experiment': { steps: ['An experiment deliberately changes a variable.', 'An observation study changes nothing.', 'Both are science, but they are different.'], eg: 'Counting birds monthly is observation, not an experiment.' },
  's5-trials': { steps: ['One trial is not enough evidence.', 'Repeat to see whether the result is consistent.', 'Repeated trials reveal the typical outcome.'], eg: 'Fly the paper plane several times, not once.' },
  's5-control': { steps: ['The control gets no treatment.', 'Everything else is kept identical.', 'It is what you compare the results against.'], eg: 'To test fertiliser, the control plants get none.' },
  's5-realmethod': { steps: ['Real investigations rarely follow fixed steps in order.', 'Scientists loop back and redesign.', 'Unexpected results are normal and useful.'], eg: 'Redesigning after a failed experiment is still science.' },
  's5-opinion': { steps: ['A verified observation can be measured and checked.', 'A personal interpretation is a judgement.', 'Ask whether anyone else could confirm it.'], eg: '"32 cm tall" is verified; "looks healthiest" is opinion.' },
  's5-testable': { steps: ['Science rests on testable observations.', 'Explanations must link to evidence.', 'Untestable questions fall outside science.'], eg: '"Does salt water freeze lower?" can be tested.' },
  's5-replicate': { steps: ['Other scientists should be able to repeat the work.', 'Matching results build confidence.', 'A mismatch means something needs checking.'], eg: 'Replication is how the community verifies a result.' },
  's5-energyforms5': { steps: ['Forms include light, heat, sound, electrical, chemical and mechanical.', 'Chemical energy is stored in food and batteries.', 'Mechanical energy is movement and position.'], eg: 'A battery stores chemical energy.' },
  's5-energycause5': { steps: ['Energy changes form as it moves through a device.', 'Motion or change is the evidence of transfer.', 'Trace the chain from source to effect.'], eg: 'Battery chemical to electrical to fan motion.' },
  's5-static': { steps: ['A charged object attracts an uncharged one.', 'Like charges repel each other.', 'Opposite charges attract.'], eg: 'A rubbed balloon sticks to a wall.' },
  's5-transform': { steps: ['Electrical energy can become heat, light, sound or motion.', 'Identify what the device produces.', 'That names the transformation.'], eg: 'A fan turns electrical energy into motion.' },
  's5-circuit': { steps: ['Current flows only around a complete loop.', 'A gap anywhere stops the flow.', 'An open switch makes a gap on purpose.'], eg: 'Opening a switch turns the bulb off.' },
  's5-conductors5': { steps: ['Conductors let current flow; metals do.', 'Insulators block it; rubber, plastic and glass do.', 'Wires are metal inside and plastic outside.'], eg: 'Copper conducts; the rubber coating protects you.' },
  's5-forces5': { steps: ['Gravity pulls objects toward Earth.', 'Friction opposes sliding motion.', 'A push or pull needs contact; gravity does not.'], eg: 'Friction slows a book sliding across a table.' },
  's5-moreforce': { steps: ['A greater force means a greater change in motion.', 'Compare forces on identical objects.', 'Same object, bigger push, bigger effect.'], eg: 'A hard push accelerates a cart more than a gentle one.' },
  's5-mass': { steps: ['More mass means less effect from the same force.', 'Compare masses when the force is equal.', 'Lighter objects change motion more easily.'], eg: 'The same push moves a tennis ball more than a bowling ball.' },
  's5-balanced': { steps: ['If nothing moves, forces are balanced.', 'An opposing force cancels the one you apply.', 'Balanced forces mean no change in motion.'], eg: 'A book on a table: gravity down, table pushing up.' },
  's5-statesprops': { steps: ['Solids keep shape and volume.', 'Liquids keep volume but take the container’s shape.', 'Gases fill all available space.'], eg: 'All three have mass, gases included.' },
  's5-dissolve': { steps: ['Some substances dissolve in water; some do not.', 'Salt and sugar dissolve; sand and pepper do not.', 'Heat, stirring and smaller pieces speed it up.'], eg: 'Dissolved substances do not settle out.' },
  's5-separate': { steps: ['Separate mixtures using an observable property.', 'Magnetism for iron, size for a sieve.', 'Evaporation recovers a dissolved solid.'], eg: 'A magnet pulls iron filings out of sand.' },
  's5-atoms': { steps: ['All matter is made of parts too small to see.', 'They still exist when you cannot see them.', 'Dissolving spreads them out; it does not destroy them.'], eg: 'Dissolved sugar is still there, which is why water tastes sweet.' },
  's5-tempchange': { steps: ['Temperature affects how fast changes happen.', 'Warmer usually speeds a change up.', 'Colder usually slows it down.'], eg: 'A fridge slows the changes that spoil food.' },
  's1-stars': { steps: ['Stars are far away, so they look like tiny points.', 'There are far too many to count.', 'They are grouped in patches, not spread evenly.'], eg: 'The Sun is a star too. It looks huge only because it is so close.' },
  's1-gravity': { steps: ['Gravity is Earth pulling things toward it.', 'It works without touching anything.', 'That is why dropped things fall down, not up.'], eg: 'A ball, a leaf and a raindrop all fall down for the same reason.' },
  's1-magnifiers': { steps: ['A magnifier bends light to make things look bigger.', 'It does not change the object, only how it looks.', 'Use one when details are too small to see.'], eg: 'A magnifier reveals the tiny veins on a leaf.' },
  's1-sun': { steps: ['The Sun gives light and warmth, which we need.', 'Too much sunlight burns skin and hurts eyes.', 'The same thing can be helpful and harmful.'], eg: 'Sunlight grows our food but also gives sunburn.' },
  's1-surface': { steps: ['Earth’s surface has water, rocks, soil and living things.', 'Stars and the Moon are in space, not on Earth.', 'Ask: could you touch it standing outside?'], eg: 'Soil is on Earth. A star is not.' },
  's1-water': { steps: ['Every living thing needs water to stay alive.', 'Water can also be dangerous.', 'Always have an adult nearby around deep water.'], eg: 'People, plants and pets all need water every day.' },
  's1-fastslow': { steps: ['Some changes finish in a second.', 'Others take months or years.', 'Ask how long you would have to watch to see it.'], eg: 'A popping balloon is fast. A growing tree is slow.' },
  's1-senses': { steps: ['The five senses are sight, hearing, smell, taste and touch.', 'Each one tells you something different.', 'Pick the sense that matches the question.'], eg: 'Use touch for rough or smooth, smell for a scent.' },
  's1-plantparts': { steps: ['Roots take in water and hold the plant down.', 'The stem holds it up and carries water.', 'Leaves catch sunlight and flowers make seeds.'], eg: 'Water goes roots, then stem, then leaves.' },
  's1-living': { steps: ['Living things grow, need food and water, and make more of their kind.', 'Nonliving things do none of that.', 'Check all three before deciding.'], eg: 'A tree is living. A rock never grows or eats.' },
  's1-parents': { steps: ['Young living things look like their parents.', 'They are not exactly identical.', 'Small differences are normal.'], eg: 'Kittens look like cats, but each one differs a little.' },
  's1-needs': { steps: ['All plants and animals need air, water, food and space.', 'Take one away and the living thing struggles.', 'Humans need the same four things.'], eg: 'A plant in a dark cupboard with no water will die.' },
  's1-questions': { steps: ['A science question is one you can test.', 'Try it out instead of guessing.', 'Watch carefully and record what happens.'], eg: 'To find which plane flies farthest, fly them and measure.' },
  's1-observe': { steps: ['Describe what you actually sense.', 'Use number, shape, texture, size, weight, colour and motion.', 'Leave out whether you like it.'], eg: '"Small, white and rough" beats "pretty".' },
  's1-records': { steps: ['Write or draw what you see as you see it.', 'Records do not fade like memory.', 'Anyone can check a record later.'], eg: 'Draw and measure the plant each week.' },
  's1-motion': { steps: ['Straight line goes one way without turning.', 'Back and forth repeats forward then backward.', 'Round and round circles, zigzag turns side to side.'], eg: 'A swing goes back and forth. A merry-go-round goes round and round.' },
  's1-pushpull': { steps: ['A push moves something away from you.', 'A pull brings it toward you.', 'Both are forces, and a force changes motion.'], eg: 'Kicking a ball is a push. Opening a drawer is a pull.' },
  's1-sort': { steps: ['A property is something you can observe about an object.', 'Size, shape, colour, temperature, weight and texture are properties.', 'Sorting means grouping by one property at a time.'], eg: 'Putting all the red blocks together sorts by colour.' },
  's2-rocks': { steps: ['Earth is made mostly of rock.', 'Rocks come in every size and shape.', 'Sand is just very small pieces of rock.'], eg: 'A boulder and a grain of sand are both rock.' },
  's2-soil': { steps: ['Wind, water and ice break rock into tiny pieces.', 'Dead plants and animals rot and mix in.', 'Together they make soil.'], eg: 'Soil is broken rock plus decayed plant and animal material.' },
  's2-soiltypes': { steps: ['Sand has big particles, so water drains fast.', 'Clay has tiny particles, so it holds water.', 'Colour, texture and water-holding tell soils apart.'], eg: 'Water runs straight through sand but sits in clay.' },
  's2-patterns': { steps: ['A pattern is something that repeats.', 'Day and night repeat every day.', 'The four seasons repeat every year.'], eg: 'Summer follows spring every single year.' },
  's2-sunwarms': { steps: ['The Sun’s energy heats land, water and air.', 'The longer the Sun shines, the warmer things get.', 'Take the Sun away and things cool down.'], eg: 'Beach sand is hotter at noon than at sunrise.' },
  's2-evaporate': { steps: ['Open water escapes into the air as vapour.', 'That is called evaporation.', 'A lid traps the vapour so the level stays put.'], eg: 'An open cup empties over a week; a closed jar does not.' },
  's2-air': { steps: ['Air is all around us even though we cannot see it.', 'Moving air is wind.', 'You see air by what it moves.'], eg: 'A flag flapping shows the air is moving.' },
  's2-severe': { steps: ['Severe weather can be dangerous.', 'Go indoors during lightning.', 'Make a plan before storm season, not during it.'], eg: 'Hearing thunder means it is time to go inside.' },
  's2-body': { steps: ['Each body part has one main job.', 'Heart pumps blood, lungs take in air, brain thinks.', 'Stomach digests food and the skeleton supports you.'], eg: 'Your lungs fill with air so your body gets oxygen.' },
  's2-lifecycle': { steps: ['A life cycle is the stages from start to adult.', 'Butterflies go egg, caterpillar, chrysalis, adult.', 'Plants go seed, seedling, plant, flower.'], eg: 'The caterpillar comes right after the egg.' },
  's2-needs2': { steps: ['All living things need air, water, food and space.', 'Plants make their own food; animals must eat.', 'That is the main difference.'], eg: 'A fish, a fern and a person all need water.' },
  's2-habitats': { steps: ['A habitat gives a living thing what it needs.', 'Living things survive only where their needs are met.', 'That is why different animals live in different places.'], eg: 'A polar bear cannot survive in a Florida swamp.' },
  's2-invest': { steps: ['A good science question can be tested.', 'Opinions and favourites cannot be tested.', 'Ask something you could observe or measure.'], eg: '"Do seeds sprout faster in warm soil?" is testable.' },
  's2-compare': { steps: ['Different groups should use the same tools.', 'That way any difference comes from the thing being tested.', 'If results disagree, measure again carefully.'], eg: 'Two teams with the same ruler should get the same length.' },
  's2-repeat': { steps: ['Do the same experiment the same way again.', 'You should get similar results.', 'Repeating shows a result was not a fluke.'], eg: 'If a result only happens once, it may not be real.' },
  's2-inference': { steps: ['An observation is what you sense right now.', 'An inference is your explanation of it.', 'Ask: did I see this, or work it out?'], eg: '"The ground is wet" is observed. "It rained" is inferred.' },
  's2-scientists': { steps: ['Scientists work alone and in teams.', 'They share findings so others can check them.', 'They keep looking for new ways to solve problems.'], eg: 'Sharing results lets other scientists test them.' },
  's2-energyuse': { steps: ['People use energy to cook, heat, cool and power machines.', 'Electricity is one common form.', 'Look for what plugs in or burns fuel.'], eg: 'A refrigerator uses electrical energy to stay cold.' },
  's2-forces': { steps: ['A push or pull changes how something moves.', 'A bigger force makes a bigger change.', 'Force can change speed or direction.'], eg: 'A hard push sends a toy car farther than a gentle one.' },
  's2-magnets': { steps: ['Magnets pull on certain metals without touching.', 'Opposite poles attract, like poles push apart.', 'Plastic, wood and glass are not magnetic.'], eg: 'A magnet lifts a steel paperclip but not a plastic straw.' },
  's2-gravity2': { steps: ['Things fall unless something holds them up.', 'Gravity never switches off.', 'A table holds a book by pushing up.'], eg: 'Let go of a book and it drops.' },
  's2-biggerforce': { steps: ['A greater force makes a greater change in motion.', 'Same object, bigger push, bigger effect.', 'Compare the forces, not the objects.'], eg: 'A hard kick sends the ball farther than a soft one.' },
  's2-properties': { steps: ['Properties are what you can observe or measure.', 'A scale measures weight, a ruler measures length.', 'Texture is how a surface feels.'], eg: 'Rough and smooth describe texture.' },
  's2-states': { steps: ['A solid keeps its own shape.', 'A liquid flows and fills the bottom of its container.', 'A gas spreads out to fill all the space.'], eg: 'Rock is solid, milk is liquid, air is gas.' },
  's2-shape': { steps: ['Solids hold their shape wherever you put them.', 'Liquids and gases take the container’s shape.', 'The amount does not change, only the shape.'], eg: 'Juice poured into a bowl becomes bowl-shaped.' },
  's2-waterstates': { steps: ['Ice is solid water, water is liquid, vapour is gas.', 'Adding heat melts ice and evaporates water.', 'Removing heat freezes it again.'], eg: 'Ice on a warm day melts into liquid water.' },
  's2-temp': { steps: ['Find the top of the coloured line.', 'Read the number on the scale beside it.', 'Keep the degree sign on your answer.'], eg: 'A line stopping at the 40 mark reads 40 degrees.' },
  's2-volume': { steps: ['Volume is how much space something takes up.', 'A measuring cup shows volume.', 'The same amount looks different in different containers.'], eg: 'The same juice in a tall glass and a wide bowl is the same amount.' },
  's2-change': { steps: ['Changing shape or size does not change what it is.', 'Torn paper is still paper.', 'Different materials react differently to the same treatment.'], eg: 'Heat melts chocolate but hardens clay.' },
  's3-stars': { steps: ['Stars vary in size and brightness.', 'They look like points because they are so far away.', 'Brightness from Earth depends on size AND distance.'], eg: 'A huge distant star can look dimmer than a small close one.' },
  's3-sunstar': { steps: ['The Sun is a star, not a planet.', 'It gives off energy, including light and heat.', 'That energy reaches Earth.'], eg: 'Sunlight is energy emitted by our nearest star.' },
  's3-closest': { steps: ['The Sun looks big and bright because it is closest.', 'Other stars are much farther away.', 'Distance, not size, explains the difference.'], eg: 'Move the Sun far away and it would look like any star.' },
  's3-overcome': { steps: ['Gravity pulls everything toward Earth.', 'A bigger force can overcome it, briefly or fully.', 'When that force stops, gravity wins again.'], eg: 'A thrown ball rises, then gravity brings it back.' },
  's3-telescope': { steps: ['A telescope gathers far more light than your eye.', 'That reveals stars too faint to see unaided.', 'More light collected means more stars visible.'], eg: 'Through a telescope you see dramatically more stars.' },
  's3-radiant': { steps: ['Radiant energy from the Sun heats objects it shines on.', 'Dark surfaces absorb more and heat faster.', 'With no Sun, objects lose heat and cool.'], eg: 'A metal slide is hot at noon and cool after dark.' },
  's3-plantstruct': { steps: ['Roots absorb water and anchor the plant.', 'The stem supports and transports.', 'Leaves make food and flowers reproduce.'], eg: 'Leaves use sunlight to produce the plant’s food.' },
  's3-stimuli': { steps: ['Plants respond to light, gravity and heat.', 'Stems grow toward light.', 'Roots grow downward with gravity.'], eg: 'A windowsill plant leans toward the glass.' },
  's3-animalgroups': { steps: ['Look for the key feature of each group.', 'Feathers mean bird, fur and milk mean mammal.', 'Backbone means vertebrate; no backbone means invertebrate.'], eg: 'An insect has six legs and no backbone, so it is an arthropod.' },
  's3-plantgroups': { steps: ['Plants are grouped by how they reproduce.', 'Some make seeds, often inside flowers or fruit.', 'Ferns and mosses make spores instead.'], eg: 'An apple tree makes seeds. A fern makes spores.' },
  's3-seasons': { steps: ['Living things respond to the seasons changing.', 'Some migrate, some hibernate, some drop leaves.', 'Each response helps survive a harder season.'], eg: 'Birds fly south to find food and warmth.' },
  's3-photosynth': { steps: ['Plants use sunlight, air and water to make food.', 'That makes them producers.', 'No light means no food, no matter how much water.'], eg: 'A plant in the dark cannot make food and dies.' },
  's3-invest3': { steps: ['Change only one thing at a time.', 'Keep everything else the same.', 'Then you know what caused the result.'], eg: 'To test light, give both plants the same water and soil.' },
  's3-differences': { steps: ['Compare results across groups.', 'When they differ, look for the reason.', 'Usually it is how the measurement was taken.'], eg: 'Two teams read a thermometer slightly differently.' },
  's3-records3': { steps: ['Record as you observe, not afterwards.', 'Charts, graphs and drawings all work.', 'A record can be checked; memory cannot.'], eg: 'A weekly height chart shows growth clearly.' },
  's3-communicate': { steps: ['Scientists share what they find.', 'Sharing lets others check the work.', 'It also lets others build on it.'], eg: 'Unshared results cannot be verified by anyone.' },
  's3-checking': { steps: ['Scientists question each other’s evidence.', 'Disagreements are settled by looking at evidence.', 'Checking is how mistakes get found.'], eg: 'Two scientists disagree, so they examine the data together.' },
  's3-infer': { steps: ['Observe first, then explain.', 'An inference is reasoning from what you observed.', 'Different inferences can fit the same observation.'], eg: 'Wet ground observed; "it rained" inferred.' },
  's3-evidence': { steps: ['Empirical evidence is observations and measurements.', 'It is used to check explanations.', 'Opinions are not evidence.'], eg: '"This plant grew 4 cm" is evidence. "It is the nicest" is not.' },
  's3-words': { steps: ['Science words often mean something exact.', 'The everyday meaning can be looser.', 'Use the science meaning in science.'], eg: 'Everyday "energy" means lively. In science it means the ability to cause change.' },
  's3-models': { steps: ['A model represents how something works.', 'Models help when things are too big, small or slow to observe.', 'They are tools for understanding and explaining.'], eg: 'A globe models the Earth.' },
  's3-modellimits': { steps: ['Every model is an approximation.', 'Models leave things out to stay simple.', 'No model explains every observation.'], eg: 'Solar system models never show the real distances.' },
  's3-energyforms': { steps: ['Basic forms are light, heat, sound, electrical and mechanical.', 'One object can give off several at once.', 'Name what you can see, hear or feel.'], eg: 'A lamp gives off both light and heat.' },
  's3-energychange': { steps: ['Energy causes motion or change.', 'If something moved or changed, energy was involved.', 'That is the test to apply.'], eg: 'Wind energy turns a windmill.' },
  's3-lightline': { steps: ['Light travels in straight lines.', 'It keeps going until it hits something.', 'That is why shadows are sharp and shaped like the object.'], eg: 'A blocked straight beam leaves a shadow behind the object.' },
  's3-lightbehave': { steps: ['Reflected means bounced off.', 'Refracted means bent when entering a new material.', 'Absorbed means taken in, often becoming heat.'], eg: 'A mirror reflects, water bends, a black shirt absorbs.' },
  's3-lightheat': { steps: ['Things that give off light usually give off heat.', 'Check by holding a hand nearby, safely.', 'The Sun, a flame and a bulb all do both.'], eg: 'A lit bulb feels warm as well as looking bright.' },
  's3-friction': { steps: ['Rubbing two things together produces heat.', 'More rubbing means more heat.', 'That is why brakes get hot.'], eg: 'Rub your hands together and they warm up.' },
  's3-temp3': { steps: ['Read the top of the coloured line.', 'Match it to the number on the scale.', 'Compare two readings by subtracting.'], eg: 'A line at 60 with another at 40 is 20 degrees warmer.' },
  's3-massvol': { steps: ['Mass is how much matter; use a balance.', 'Volume is how much space; use a graduated cylinder.', 'They are different properties.'], eg: 'A balance gives mass in grams.' },
  's3-materials': { steps: ['Compare by size, shape, colour, texture and hardness.', 'Hardness is resistance to scratching.', 'Pick the property that differs most.'], eg: 'A brick is hard; a sponge is soft.' },
  's3-waterchange': { steps: ['Adding heat: melting, then evaporating.', 'Removing heat: condensing, then freezing.', 'Name the direction of the heat first.'], eg: 'Droplets on a cold glass are condensation.' },
};
