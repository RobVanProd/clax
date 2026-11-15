#!/usr/bin/env node
/* Runtime grounding soak (needs Playwright + Chromium): runs the real game headless, parks Clax beside every enemy on
   both sides for 10 s each, and samples that walkers stay on a surface and fliers stay out of terrain while they patrol,
   chase, charge and shoot.  Usage: node tools/soak.js [path/to/index.html] */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1280, height: 720 } }); pg.on('pageerror', e => console.log('PAGEERROR', e.message));
  await pg.goto('file://' + (process.argv[2] || require('path').join(__dirname, '..', 'index.html')) + '?test'); await pg.waitForFunction('window.CLAX_READY');
  const n = await pg.evaluate(() => (CLAX_DEBUG.DB.stages || [0, 0, 0]).length); let total = 0;
  for (let lv = 0; lv < n; lv++) {
    const r = await pg.evaluate(lv => { const D = CLAX_DEBUG, G = D.G, P = D.P; D.silence(); D.start(lv); D.pauseSimulation(true); const L = G.level, bad = []; let checked = 0;
      L.enemies.forEach((e, idx) => { const fl = ['fly', 'charge', 'puffer'].includes(e.kind); let worst = null;
        for (const side of [-1, 1]) for (let i = 0; i < 1200; i++) { const p = G.player; p.invincible = 1; p.hp = 6; p.x = p.px = e.originX + side * 200; p.y = p.py = e.originY + (fl ? 80 : 0); p.vx = p.vy = 0; p.grounded = true; G.bullets.length = 0; G.deathTimer = 0; G.hitstop = 0; D.tick(1 / 120);
          if (i % 6) continue; checked++;
          if (fl) { if (P.pointSolid(L, e.x, e.y - e.h * .5) || P.pointSolid(L, e.x, e.y - 4) || P.pointSolid(L, e.x, e.y - e.h * .9)) worst = 'flier inside terrain'; }
          else if (P.pointSolid(L, e.x, e.y - 6)) worst = 'walker buried'; else if (!P.probe(L, e.x, e.y - 1.5, e.y + 1.5, true)) worst = 'walker off the ground'; }
        if (worst) bad.push(`${e.type}#${idx} ${worst} near c${(e.x / 64).toFixed(1)} r${(e.y / 64).toFixed(1)}`); });
      return { name: L.name || L.biome.name, enemies: L.enemies.length, checked, bad }; }, lv);
    total += r.bad.length; console.log(`[${lv + 1}] ${r.name}: ${r.enemies} enemies, ${r.checked} samples, ${r.bad.length} runtime finding(s)`); r.bad.forEach(s => console.log('     ' + s));
  }
  console.log(total ? 'FAIL' : 'PASS'); await b.close(); })();
