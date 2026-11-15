#!/usr/bin/env node
/* Placement audit: every grounded prop/enemy must stand exactly on a walkable surface, nothing may sit inside
   solid terrain, and fliers must have clear water through their whole patrol envelope.  Exit code 1 on any finding.
   Usage: node tools/audit.js [--quiet] */
const { P, DB } = require('./load')(), TS = P.TS, quiet = process.argv.includes('--quiet');
const n = DB.stages ? DB.stages.length : 3; let bad = 0;
for (let i = 0; i < n; i++) {
  const L = DB.make(i), out = [], cr = (x, y) => `c${(x / TS).toFixed(1)} r${(y / TS).toFixed(1)}`;
  const moverTop = (x, y) => L.movers.some(q => x >= q.x - 4 && x <= q.x + q.w + 4 && Math.abs(q.y - y) < 2);
  const onSurface = (x, y) => !!P.probe(L, x, y - 1.5, y + 1.5, true) || moverTop(x, y);
  const gap = (x, y) => { const g = P.groundBelow(L, x, y - 1.5, 4000); return g === null ? 'no ground below' : `floats ${Math.round(g - y)}px above ground`; };
  const grounded = (kind, o, halfW = 0) => {
    if (P.pointSolid(L, o.x, o.y - 6)) return out.push(`${kind} BURIED at ${cr(o.x, o.y)}`);
    if (!onSurface(o.x, o.y)) return out.push(`${kind} FLOATING at ${cr(o.x, o.y)} (${gap(o.x, o.y)})`);
    if (halfW) for (const s of [-1, 1]) if (!onSurface(o.x + s * halfW, o.y) && !P.pointSolid(L, o.x + s * halfW, o.y - 6)) out.push(`${kind} OVERHANGS edge at ${cr(o.x, o.y)}`);
  };
  for (const e of L.enemies) {
    const k = `enemy:${e.type}`;
    if (['fly', 'charge', 'puffer'].includes(e.kind)) {
      const ax = e.kind === 'fly' ? 70 : e.kind === 'puffer' ? 80 : 0, ay = e.kind === 'fly' ? 35 : e.kind === 'puffer' ? 42 : 12;
      if (P.boxSolid(L, e.x - ax - e.w * .3, e.y - ay - e.h * .9, e.x + ax + e.w * .3, e.y + ay - 2)) out.push(`${k} flier envelope INTERSECTS TERRAIN at ${cr(e.x, e.y)}`);
    } else {
      grounded(k, e, e.kind === 'turret' ? e.w * .3 : 0);
      if (P.boxSolid(L, e.x - e.w * .3, e.y - e.h * .8, e.x + e.w * .3, e.y - 40)) out.push(`${k} body IN TERRAIN at ${cr(e.x, e.y)}`);
    }
  }
  for (const c of L.checkpoints) grounded('checkpoint', c, 20);
  for (const c of L.npcs) grounded(`npc:${c.name}`, c, 20);
  for (const c of L.signs) grounded('sign', c);
  for (const c of L.crates) grounded('crate', c, 18);
  for (const c of L.springs) grounded('spring', c, 24);
  for (const c of L.vents) grounded('vent', c, 20);
  for (const d of L.deco) if (['flag', 'crane', 'tent', 'buoy'].includes(d.t) || d.t === 'lamp' && !d.hang) grounded(`deco:${d.t}`, d);
  for (const d of L.deco) if (d.t === 'lamp' && d.hang && !P.pointSolid(L, d.x, d.y - 6) && !L.deco.some(q => q.t === 'pipe' && d.x >= q.x && d.x <= q.x + q.w * TS && Math.abs(d.y - q.y) < 20)) out.push(`deco:hanging lamp NOT UNDER A CEILING OR PIPE at ${cr(d.x, d.y)}`);
  for (const it of L.pickups) if (P.pointSolid(L, it.x, it.y)) out.push(`pickup:${it.kind} IN TERRAIN at ${cr(it.x, it.y)}`);
  for (const it of L.pickups) if (it.kind !== 'tag' && !onSurface(it.x, it.y + 56)) out.push(`pickup:${it.kind} FLOATING at ${cr(it.x, it.y)} (${gap(it.x, it.y + 56)})`);
  grounded('start', L.start); grounded('exit', L.exit, 40); if (L.boss) grounded('boss', L.boss.fly ? { x: L.boss.x, y: L.exit.y } : L.boss);
  bad += out.length;
  console.log(`[${i + 1}] ${L.name || L.biome.name}: ${out.length ? out.length + ' placement finding(s)' : 'clean'}`);
  if (!quiet) for (const s of out) console.log('     ' + s);
}
console.log(bad ? `FAIL: ${bad} finding(s)` : 'PASS: all placements grounded'); process.exit(bad ? 1 : 0);
