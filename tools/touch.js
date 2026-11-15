#!/usr/bin/env node
/* Phone layout check (needs Playwright + Chromium): emulates three touch phones, asserts every visible control is
   finger-sized and on screen, drives the pad and dialogue with real touch events, and confirms desktop is unchanged. */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  for (const [name, vw, vh] of [['wide phone landscape', 884, 330], ['16:9 phone landscape', 740, 416], ['phone portrait', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), pg = await ctx.newPage(); let errs = 0; pg.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
    await pg.goto('file://' + require('path').join(__dirname, '..', 'index.html') + '?test'); await pg.waitForFunction('window.CLAX_READY'); console.log('== ' + name, vw + 'x' + vh);
    const small = async (label, min) => { const bad = await pg.evaluate(min => [...document.querySelectorAll('button,.stage-card,label.setting-row,select')].filter(e => e.offsetParent !== null).map(e => { const r = e.getBoundingClientRect(); return [e.id || e.dataset.action || e.className, Math.round(r.width), Math.round(r.height), r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1]; }).filter(x => x[1] < min || x[2] < min || !x[3]), min); ok(bad.length === 0, `${label}: every visible control >= ${min}px and on screen` + (bad.length ? ' -> ' + JSON.stringify(bad) : '')); };
    const min = name.includes('portrait') ? 22 : 26;
    await small('title', min);
    await pg.tap('#open-settings'); await small('settings', min); await pg.tap('#settings-screen .button.primary');
    await pg.tap('#choose-stage'); await small('stage select', min); await pg.tap('#stage-screen [data-back]');
    await pg.evaluate(() => CLAX_DEBUG.silence()); await pg.tap('#start'); await small('dialogue', min);
    const i0 = await pg.evaluate(() => CLAX_DEBUG.G.dialogue.index); await pg.touchscreen.tap(vw * .5, vh * .3); const i1 = await pg.evaluate(() => CLAX_DEBUG.G.dialogue.index); ok(i1 === i0 + 1, 'tap on empty screen advances dialogue ' + i0 + '->' + i1);
    await pg.tap('#dialogue-next'); const i2 = await pg.evaluate(() => CLAX_DEBUG.G.dialogue.index); ok(i2 === i1 + 1, 'NEXT button advances exactly one line');
    await pg.tap('#dialogue-skip'); ok(await pg.evaluate(() => CLAX_DEBUG.G.mode) === 'play', 'skip enters play'); await small('play', min);
    // overlap check between touch buttons
    const ov = await pg.evaluate(() => { const bs = [...document.querySelectorAll('.touch-button')].map(e => { const r = e.getBoundingClientRect(); return [e.dataset.action, r.left + r.width / 2, r.top + r.height / 2, r.width / 2]; }), out = []; for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) if (Math.hypot(bs[i][1] - bs[j][1], bs[i][2] - bs[j][2]) < bs[i][3] + bs[j][3]) out.push(bs[i][0] + '/' + bs[j][0]); return out; }); ok(ov.length === 0, 'touch buttons do not overlap ' + ov.join(' '));
    // real touch on the pad drives the player
    await pg.evaluate(() => { CLAX_DEBUG.pauseSimulation(false); }); const x0 = await pg.evaluate(() => CLAX_DEBUG.G.player.x);
    const r = await pg.evaluate(() => { const q = document.querySelector('.touch-right').getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; });
    const cdp = await ctx.newCDPSession(pg); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r[0], y: r[1], id: 1 }] }); await pg.waitForTimeout(700);
    const held = await pg.evaluate(() => CLAX_DEBUG.getHeld()); const j = await pg.evaluate(() => { const q = document.querySelector('.touch-jump').getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: r[0], y: r[1], id: 1 }, { x: j[0], y: j[1], id: 2 }] }); await pg.waitForTimeout(150); const both = await pg.evaluate(() => [CLAX_DEBUG.getHeld(), CLAX_DEBUG.G.player.grounded]);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pg.waitForTimeout(100);
    const x1 = await pg.evaluate(() => CLAX_DEBUG.G.player.x), after = await pg.evaluate(() => CLAX_DEBUG.getHeld());
    ok(held.includes('right') && x1 > x0 + 100, `holding the right pad moves Clax (${Math.round(x0)} -> ${Math.round(x1)})`); ok(both[0].includes('right') && both[0].includes('jump') && !both[1], 'move + jump together: airborne'); ok(after.length === 0, 'release clears held state');
    await pg.tap('#pause-button'); ok(await pg.evaluate(() => CLAX_DEBUG.G.mode) === 'pause', 'pause button reachable by tap'); await small('pause', min);
    await pg.screenshot({ path: require('os').tmpdir() + '/clax_' + name.replace(/\W+/g, '_') + '_pause.png' }); await pg.tap('#resume'); await pg.evaluate(() => { CLAX_DEBUG.pauseSimulation(true); CLAX_DEBUG.G.chapterTimer = 0; CLAX_DEBUG.G.radioQueue.push(['ADA', 'Overhead ring detected. The claw is rated for lifting wreckage.']); CLAX_DEBUG.advance(.3, []); }); await pg.screenshot({ path: require('os').tmpdir() + '/clax_' + name.replace(/\W+/g, '_') + '_play.png' });
    ok(errs === 0, 'no page errors'); await ctx.close(); }
  // desktop must be untouched
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } }); await pg.goto('file://' + require('path').join(__dirname, '..', 'index.html') + '?test'); await pg.waitForFunction('window.CLAX_READY');
  const d = await pg.evaluate(() => ({ compact: document.querySelector('#interface').classList.contains('touch-ui'), start: document.querySelector('#start').getBoundingClientRect().height, pad: getComputedStyle(document.querySelector('#touch')).display, next: document.querySelector('#dialogue-next').textContent })); ok(!d.compact && d.start === 56 && d.pad === 'none' && d.next.startsWith('NEXT'), 'desktop 1280x720 layout unchanged ' + JSON.stringify(d));
  console.log(fails ? `FAIL (${fails})` : 'ALL PASS'); await b.close(); })();
