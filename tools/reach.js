#!/usr/bin/env node
/* Reachability: breadth-first search over REAL physics (CLAX_PHYS.stepPlayer at 120 Hz) with a small set of
   0.1 s input macros.  Anything it reports reached was reached by an actual input sequence; "not reached" only
   means this search did not find a route (enemies, bullets and vents are not simulated; spikes count as walls
   of death, which is stricter than the game).  Exit code 1 if an exit, checkpoint or witness is not reached.
   Usage: node tools/reach.js [levelNumber ...] [--max=N] */
const { P, DB } = require('./load')(), K = P.K, TS = P.TS, STEP = 1 / 120, TICKS = 12;
const args = process.argv.slice(2), MAX = +(args.find(a => a.startsWith('--max=')) || '--max=6000000').slice(6);
const count = DB.stages ? DB.stages.length : 3, which = args.filter(a => /^\d+$/.test(a)).map(a => a - 1);
const ACTIONS = [];
for (const x of [-1, 0, 1]) { ACTIONS.push({ x }); ACTIONS.push({ x, press: 1, hold: 1 }); ACTIONS.push({ x, hold: 1 }); }
ACTIONS.push({ x: 1, dash: 1, hold: 1 }, { x: -1, dash: 1, hold: 1 }, { x: 0, snap: 1 }, { x: 0, down: 1, press: 1 });
let fail = false;
for (let li = 0; li < count; li++) {
  if (which.length && !which.includes(li)) continue;
  const L = DB.make(li), crumbles = L.movers.filter(q => q.kind === 'crumble'), timed = [...L.movers.filter(q => q.kind !== 'crumble'), ...L.hooks.filter(h => h.ax || h.ay)];
  const goals = [];
  L.checkpoints.forEach((c, i) => goals.push({ kind: 'checkpoint', name: '#' + (i + 1), x: c.x, y: c.y, rx: 46, ry: 70 }));
  L.npcs.forEach(n => goals.push({ kind: 'witness', name: n.name, x: n.x, y: n.y, rx: 58, ry: 95 }));
  L.pickups.forEach(it => goals.push({ kind: it.kind === 'tag' ? 'tag' : 'item', name: it.kind, x: it.x, y: it.y + 60, r: 72 }));
  goals.push({ kind: 'exit', name: 'exit', x: L.exit.x, y: L.exit.y, rx: 60, ry: 80, ground: true });
  if (L.boss) goals.push({ kind: 'arena', name: 'boss gate', x: L.boss.gate + 200, y: L.boss.y, rx: 140, ry: 400 });
  const bucket = new Map(), bk = (x, y) => (Math.floor(x / 256) << 12) | Math.floor((y + 512) / 256);
  for (const g of goals) for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const k = bk(g.x + dx * 256, g.y + dy * 256); if (!bucket.has(k)) bucket.set(k, []); bucket.get(k).push(g); }
  const check = p => { const a = bucket.get(bk(p.x, p.y)); if (!a) return; for (const g of a) { if (g.hit) continue; if (g.r ? Math.hypot(g.x - p.x, g.y - p.y) < g.r : Math.abs(p.x - g.x) < g.rx && Math.abs(p.y - g.y) < g.ry && (!g.ground || p.grounded)) g.hit = true; } };
  const start = Object.assign(P.makePlayer(L.start.x, L.start.y), { dashCool: 0, sinceAttack: 5 });
  const nearTimed = p => { for (const q of timed) if (Math.abs((q.baseX ?? q.cx ?? q.x) - p.x) < 700 && Math.abs((q.baseY ?? q.cy ?? q.y) - p.y) < 700) return true; return false; };
  /* state key packed into one number (< 2^53): 40px cells, coarse velocity, movement flags, and a clock phase only where the clock matters */
  const NX = Math.ceil(L.width / 40) + 2, NY = Math.ceil((L.height + 600) / 40) + 2;
  const key = n => { const p = n.p; let k = Math.floor(p.x / 40); k = k * NY + Math.floor((p.y + 300) / 40); k = k * 5 + Math.max(-2, Math.min(2, Math.round(p.vx / 330))) + 2; k = k * 4 + Math.max(-1, Math.min(2, Math.round(p.vy / 520))) + 1;
    k = k * 2 + (p.grounded ? 1 : 0); k = k * 3 + p.jumps; k = k * 2 + (p.swing ? 1 : 0); k = k * 2 + (p.airDash ? 1 : 0); k = k * 2 + (p.pressure < 24 ? 0 : 1);
    k = k * 13 + (nearTimed(p) ? 1 + Math.floor(n.t * 2) % 12 : 0); let cr = 0; for (const c of n.cs) if (c[0] > 0 || c[1] > 0) { cr = 1 + Math.floor(n.t * 3) % 9; break; } return k * 10 + cr; };
  const seen = new Set(), queue = [{ p: start, t: 0, cs: crumbles.map(() => [0, 0]) }]; seen.add(key(queue[0])); let head = 0, maxX = start.x;
  const T0 = Date.now(); while (head < queue.length && queue.length < MAX) { if (process.env.PROG && head % 20000 === 0) console.error(head, queue.length, ((Date.now() - T0) / 1000).toFixed(1) + "s", "c" + (maxX / TS).toFixed(0));
    const n = queue[head]; queue[head++] = null;
    for (const a of ACTIONS) {
      const p = { ...n.p, swing: n.p.swing ? { ...n.p.swing } : null }; let t = n.t, dead = false;
      crumbles.forEach((q, i) => { q.timer = n.cs[i][0]; q.absent = n.cs[i][1]; }); P.stepMovers(L, t, 0);
      if (a.down && !(p.grounded && (p.oneWay || p.support))) continue;
      if (a.press) p.jumpBuffer = K.buffer;
      if (a.dash) { if (p.dashCool > 0 || p.pressure < 24 || (!p.grounded && p.airDash) || p.swing || p.crouch) continue; p.pressure -= 24; p.sinceAttack = 0; p.dashTime = K.dashTime; p.dashDir = p.wall ? -p.wall : a.x; p.facing = p.dashDir; p.dashCool = .56; if (!p.grounded) p.airDash = true; p.vx = p.dashDir * K.dash; p.vy = 0; p.wall = 0; }
      if (a.snap) { if (p.grounded || p.swing) continue; const h = P.nearestHook(L, p); if (!h) continue; P.latch(p, h); }
      const inp = { x: a.x, down: !!a.down, jumpHeld: !!a.hold };
      for (let i = 0; i < TICKS; i++) {
        t += STEP; P.stepMovers(L, t, STEP); p.dashCool = Math.max(0, p.dashCool - STEP); p.sinceAttack += STEP; if (p.floating) p.sinceAttack = 0; if (p.sinceAttack > .35) p.pressure = Math.min(100, p.pressure + STEP * 28);
        P.stepPlayer(p, inp, L, STEP); p.x = Math.max(30, Math.min(L.width - 30, p.x));
        if (p.y > L.height + 220 || P.hazard(L, p)) { dead = true; break; }
        check(p);
      }
      if (dead) continue;
      const m = { p, t, cs: crumbles.map(q => [q.timer, q.absent]) }, k = key(m); if (seen.has(k)) continue; seen.add(k); queue.push(m); if (p.x > maxX) maxX = p.x;
    }
  }
  const sum = kind => { const a = goals.filter(g => g.kind === kind); return [a.filter(g => g.hit).length, a.length, a.filter(g => !g.hit)]; };
  const miss = g => `${g.name}@c${(g.x / TS).toFixed(1)},r${(g.y / TS).toFixed(1)}`, line = [];
  for (const kind of ['exit', 'arena', 'checkpoint', 'witness', 'item', 'tag']) { const [h, n, m] = sum(kind); line.push(`${kind} ${h}/${n}` + (m.length && kind !== 'tag' ? ` (MISSING ${m.map(miss).join(' ')})` : '')); if (h < n && ['exit', 'checkpoint', 'witness', 'arena'].includes(kind)) fail = true; }
  console.log(`[${li + 1}] ${L.name || L.biome.name}: ${line.join(' | ')}  — ${queue.length} states${queue.length >= MAX ? ' (CAP HIT)' : ''}, furthest c${(maxX / TS).toFixed(0)}/${L.cols}`);
  const mt = sum('tag')[2]; if (mt.length) console.log('     tags not reached: ' + mt.slice(0, 12).map(miss).join(' ') + (mt.length > 12 ? ` …+${mt.length - 12}` : ''));
}
process.exit(fail ? 1 : 0);
