# CLAX — The Unsinkable

Single-file HTML5 action platformer. `index.html` is the whole game (art embedded) and is what GitHub Pages serves.

Six expeditions across three districts:

| # | Expedition | District art | Boss |
|---|---|---|---|
| 1 | Sunken Rescue Yard | yard | Foreman Clampright |
| 2 | The Duty Canal | yard | Quartermaster Slick |
| 3 | The Inflatable Fortress | fortress | Director Drydock |
| 4 | The Unrecorded Archive | fortress | The Head Archivist |
| 5 | The Admission Gates | carnival | The Head Barker |
| 6 | Pressure Trench Carnival | carnival | The Refund Department |

## Checks

The physics and level data inside `index.html` are pure (no DOM), so the tools load them straight from the built file.

```
node tools/audit.js        # static placement: every grounded prop/enemy stands on a surface, nothing is inside terrain
node tools/reach.js [n…]   # reachability: BFS over the real 120 Hz physics; exit, checkpoints, witnesses, items, tags
node tools/soak.js         # runtime: headless game, every enemy watched for 20 s (needs Playwright + Chromium)
```

`audit.js` runs in well under a second and should gate every level edit. `reach.js` takes a few minutes per level.
What each one does **not** prove is stated in its header comment — in particular `reach.js` ignores enemies,
projectiles and vents, so it shows a route exists, not that the route is fair.

## Level authoring notes

* Anything that stands on the ground (`E` walkers, `cp`, `npc`, `sign`, `crate`, `spring`, `vent`, `item`, `start`, and the
  `flag` / `lamp` / `crane` / `tent` / `buoy` decos) is resolved in `builder.done()`, after all terrain exists. The row you
  pass is only where the downward search starts, so placement order relative to `R`/`C`/`T` no longer matters.
* Fliers (`buoy`, `torpedo`, `puffer`) use the row literally. Leave room for their patrol envelope; `audit.js` checks it.
* Campaign order, names and stage-select copy live in the `stages` table next to `make()`.
