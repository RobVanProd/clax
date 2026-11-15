# CLAX — Art Production Brief for Codex

You are producing new art for **CLAX: The Unsinkable**, a finished, playable 2D action platformer in this repository (`RobVanProd/clax`, the game is the single file `index.html`). The game plays well. Its weak point is presentation. The backdrops are low-resolution. Building interiors are flat walls. The ground textures show mirrored "kaleidoscope" blotches. Bosses reuse enlarged regular enemies. And the 18 rescuable witnesses, the checkpoints and the exit hatch are simple code-drawn shapes. Your job is to make the images that fix that.

**You make images only.** Do not edit `index.html` or any code. Claude (a separate agent) will optimise your masters and wire them into the game. Deliver to `art/codex/` on a branch of your own, as described in §8.

Read §1–§3 before generating anything. §4–§6 are the asset lists in priority order. §7 is the acceptance checklist every image must pass.

---

## 0. Reference pack (attach these to your image generations)

Everything is in `art/reference/`:

| Path | What it is |
|---|---|
| `characters/clax_front.png` | **The hero. The style anchor for the whole game.** Match its line weight, shading and wear. |
| `enemies/*.png` | The 9 regular enemies. All face **right**. These designs are final. |
| `backgrounds_current/*.png` | The 3 current backdrops (1024×718). Right mood and subjects, too low-res, and too busy behind gameplay. |
| `textures_current/*.png` | Current ground textures. They are mirror-tiled, and that look is exactly what must be avoided. |
| `gameplay/*.jpg` | Real frames from the game (HUD off). They show how art sits behind and around the play. |
| `scale_sheet.png` | Everything at 2× game size on the 64 px tile grid: player, enemies, bosses, witness targets, prop sizes. |

---

## 1. The game in one paragraph

Port Flounder is a harbour town built from old rescue infrastructure, partly sunk, partly afloat. The Bureau of Guaranteed Safety, run by Director Drydock, locked the public air pumps and declared the emergency "unapproved". Clax, a four-inch shrimp who failed forty-one Rescue Corps applications, steals a heavy rescue suit called *The Unsinkable* and rescues people anyway. ADA, the suit's dry safety software, logs every violation. The campaign runs through six levels: a salvage yard, a customs canal, an inflatable fortress, the Bureau's archive, a carnival's admission gates and a pressure-trench carnival run by a sentient Refund Department. Each level has three trapped witnesses to rescue and a boss.

**Tone:** 1990s cartoon physical comedy. Bold silhouettes, exaggerated poses and dry humour. Everything is worn, patched and over-engineered. Nothing is grimdark and nothing is cute-for-babies.

---

## 2. Style bible

- **Line:** confident dark ink outline (near `#172a31`, not pure black), thicker on the silhouette and thinner inside. Same weight as `clax_front.png` *at the same display size*.
- **Shading:** cel-shaded base with painterly texture on top. Chipped paint, rust streaks, scuffs and grime in crevices. Soft key light from the **upper left**, with a cool fill from the environment.
- **Materials palette:** rescue orange `#ef7b34`/`#e8923f`, aged cream `#f3db9d`/`#e6d6a4`, tarnished brass `#c39960`, oxidised teal `#29717a`/`#64e4d6`, worn purple enamel `#43204d`/`#b23a8a`, deep ink teal `#0d2936`. Hazard stripes are orange/charcoal or yellow/charcoal.
- **Shapes:** chunky and readable at small sizes. If a design does not read as a solid silhouette at 100 px tall, simplify it.
- **World logic:** objects are repurposed rescue and safety gear: lifebuoys, armbands, pressure gauges, valves, hoses, buoys, cranes, rope and warning beacons. The Bureau makes safety oppressive. The carnival makes it a product.
- **Originality:** all designs are original. Do not imitate any existing franchise's characters or look (no SpongeBob, Mario, Rayman, Cuphead or Sonic look-alikes). No real brands or logos.
- **No lettering anywhere.** No words, numbers, labels, signage text, watermarks or signatures. Image models garble text, and the game draws its own text. Where a sign, banner, ticket or stamp appears, leave it **blank** or use simple pictograms (arrow, cross, drop, star).

---

## 3. Technical rules (apply to every file)

1. **Format:** PNG, 8-bit sRGB. Characters, props and anything listed as "transparent" need a **real alpha channel**: no checkerboard, no white or black matte, no glow halo, and clean anti-aliased edges with no colour fringing.
2. **No baked ground shadows** under characters or props. The engine draws its own.
3. **Facing:** enemies, bosses and boss poses face **right**. Witnesses face the viewer in a 3/4 view, turned slightly right. Dialogue portraits face **right**, toward the text.
4. **Baseline:** for anything that stands, the lowest foot or base pixel touches the **bottom edge**, with at most 4 px of transparent margin. Margin on the other sides is 8–24 px, and nothing may be cropped by the canvas edge. Centre the canvas horizontally on the body mass, not on an extended arm, claw or weapon.
5. **Resolution:** the game is drawn at up to about 3 screen pixels per game pixel, so masters need roughly 3× the in-game size. Every spec below gives a **target** and a **minimum**. If your generator's native size is smaller, generate at its maximum and upscale with a quality upscaler that keeps line work crisp. Record `"upscaled": true` in the manifest. Never deliver below the minimum.
6. **Seamless images** (textures, horizontally tiling backdrops): make them seamless by offsetting 50% and inpainting the seam. **Do not** create seams by mirroring. **Verify** each one by tiling it 3×3 (textures) or 3×1 (backdrops) with a script and checking for visible seams or repetition. Save each check as `<name>__tiletest.jpg` next to the asset.
7. **Consistency across poses:** generate the first pose of a character, then produce every other pose **from that image** (image-to-image or edit), so design, colours, proportions and costume details match exactly. Discard any pose where a detail changes: a stripe count, a missing strap, a different hat.
8. **Naming:** lowercase `snake_case`, exactly as listed. One file per pose.

---

## 4. TIER 1 — biggest visual payoff (do these first, in this order)

### 4A. Level backdrops — 6 levels × 2 layers = 12 images

Each level gets a **far layer** and a **mid layer**. The far layer is opaque and full-bleed: sky or water, distant architecture and light. The mid layer is a transparent PNG of nearer structures in silhouette or semi-silhouette, with an open (transparent) top half or more. The engine scrolls the far layer slowly and the mid layer faster, which creates depth. Both layers must **tile horizontally** (rule 6).

- **Size:** target **4608×1536** (3:1); minimum 3072×1024. Height matters most: the game draws a backdrop 864 game px tall.
- **Composition rule, the most important one:** gameplay happens in front of these images across the whole screen, so the backdrop must **recede**. Compared with the current backdrops:
  - Values are compressed toward the level's fog colour, with no pure blacks or pure whites.
  - Contrast and saturation are clearly lower than the characters'. Atmospheric perspective: more distant means paler and closer to the fog colour.
  - **No hard horizontal ledges with lit top edges.** Players read those as walkable platforms. Use broken, rounded or diagonal shapes instead.
  - **No single giant focal object in the middle band** (the current carnival's huge clown face fights the gameplay). Put landmarks toward the upper third, or crop them by the frame.
  - The bottom ~30% is darker and murkier. Light enters from the top.
  - No characters, no creatures, no text.
- **Mid layer:** a band of shapes along the lower half (pilings, silhouettes, rigging, crowd-less structures), in a darker, slightly more saturated version of the far palette. The top 50–60% is fully transparent. It must tile horizontally.

| # | Level | Files | Subject and mood | Palette anchors |
|---|---|---|---|---|
| 1 | **Sunken Rescue Yard** (salvage yard, underwater) | `yard_far.png`, `yard_mid.png` | Sunken salvage yard at morning. Leaning harbour cranes, heaps of scrapped lifeboats, the hull of the *S.S. Caution* (an evacuation ship that never sailed), cracked glass habitat domes, hanging chains, kelp and algae, god-rays from the surface, drifting bubbles. Hopeful but grimy. | teal `#092a38`→`#29717a`, rust orange accents, sickly algae green |
| 2 | **The Duty Canal** (customs canal between the yard and the fortress) | `canal_far.png`, `canal_mid.png` | A half-submerged canal under customs control. Impounded ferries and barges chained in rows, striped customs barriers, tollbooths, riveted lock gates, stacks of confiscated pump parts. Late afternoon with warm lamp pools on murky water. Must look clearly **different from the yard**: greener-brown water and warmer light. | murky green-brown `#1f3a33`→`#5a6b4a`, lamp amber `#f2b35a`, impound yellow/charcoal stripes |
| 3 | **The Inflatable Fortress** (Bureau HQ, at the surface) | `fortress_far.png`, `fortress_mid.png` | A castle built from inflated rescue gear: armband walls, lifebuoy turrets, quilted vinyl keeps, cannons, red warning beacons, smoke stacks, a choppy sea surface, bright sky and clouds. Bureaucratic, smug, squeaky. Keep the current backdrop's idea, but calmer in the middle band. | sky `#1b3657`→`#81b2c2`, cream `#f3e2bd`, orange `#c9662c`, beacon red |
| 4 | **The Unrecorded Archive** (Bureau basement, under the keep) | `archive_far.png`, `archive_mid.png` | Endless filing stacks receding into darkness, walls of card-catalogue drawers, brass rolling ladders, pneumatic message tubes, dead letters drifting down like snow, green banker's-lamp pools, dust in the light. Silent and oppressive, faintly absurd. | dusty mauve-brown `#2c2734`→`#6a5560`, lamp green `#7fcf8a`, paper cream |
| 5 | **The Admission Gates** (the carnival entrance, in the trench) | `gates_far.png`, `gates_mid.png` | The approach to the carnival. Queue barriers and velvet-rope lines zig-zagging up into the distance, rows of turnstiles, ticket booths, a huge ornate gate arch (blank, no lettering), searchlight beams, deflated confiscated balloons, trench walls rising on both sides. Anticipation: the carnival glow is ahead, not yet around you. | indigo-teal `#16223f`→`#3b2a5a`, bulb gold `#f2c75c`, pink `#ff8fd0` |
| 6 | **Pressure Trench Carnival** (the deep trench) | `carnival_far.png`, `carnival_mid.png` | A carnival at the bottom of a pressure trench: the Big Wheel, roller-coaster track diving into the deep, striped tents, bioluminescent sea life, strings of bulbs, neon reflections. Festive but predatory. Keep the current backdrop's spirit **without** the central clown face. | deep purple `#160e32`→`#43204d`, pink `#ef95de`, gold `#f4bf59`, cyan `#8fe7ff` |

### 4B. Material textures — 6 levels × 2 = 12 images

Seamless squares, **2048×2048** target, 1024×1024 minimum. **One texture repeat covers 4×4 game tiles** (256 game px), so detail must read at that scale. Value: middle, low contrast, no strong directional light, no large features that make the repeat obvious. Verify each with a 3×3 tile test.

- **Ground fill** `<level>_ground.png`: the solid mass of floors and walls. The engine adds its own lit top edge (a hazard-stripe cap), so this is the body *below* the surface.
  - yard: rust-streaked teal-painted steel plate, rivet lines, algae in the seams.
  - canal: mossy canal stonework mixed with riveted iron, water stains.
  - fortress: quilted orange-and-cream inflatable vinyl with patches and stitched seams.
  - archive: dark varnished wood panelling mixed with bundled paper stacks.
  - gates: purple-painted boardwalk planks with brass bolts.
  - carnival: worn purple enamel metal with faded gold star stencils.
- **Interior back wall** `<level>_wall.png`: the wall *behind* the player inside buildings and boss rooms. It must be noticeably **darker and calmer** than the ground fill so walkable surfaces stand out.
  - yard: ship-hull interior plates.
  - canal: corrugated customs-shed metal with faded stripe paint.
  - fortress: padded vinyl wall.
  - archive: floor-to-ceiling pigeonholes with paper.
  - gates: striped tent fabric over wooden framing.
  - carnival: fun-house panels with dim mirror tiles.

### 4C. Bosses — 6 bosses × 3 poses = 18 images (+6 optional)

Unique designs replacing the enlarged enemy placeholders. Each boss should feel like the boss version of its level's regular enemy family. Transparent, facing right, baseline per rule 3. **Target canvas 1536 px on the long side** (minimum 1024), with the aspect close to the in-game box.

Poses:
- `<id>_idle.png`: the neutral fighting stance.
- `<id>_windup.png`: big readable anticipation just before an attack.
- `<id>_exposed.png`: dazed after an attack, guard down, the moment the player hits back.
- Optional `<id>_defeated.png`.

| id | Boss (level) | In-game box w×h | Behaviour to sell | Design direction |
|---|---|---|---|---|
| `clampright` | **Foreman Clampright** (yard). *"Certified to make things worse."* | 232×202 | charges straight across the room | A giant salvage crab foreman. Hard hat with an amber beacon, hi-vis harness, one oversized hydraulic claw striped like the yard cranes, a clipboard wedged in the small claw. Related to the Clamp Crab. |
| `slick` | **Quartermaster Slick** (canal). *"Everything here is salvage. Including you."* | 186×258 | lunges, throws stolen loot | A tall eel quartermaster in a customs greatcoat with epaulettes, a big ring of keys, a blank impound stamp, a sack of stolen pump parts. Keep the Eel Looter's red bandana and gold-ring motif so the family reads. |
| `drydock` | **Director Drydock** (fortress). *"There is a form for that explosion."* | 200×278 | hides behind a shield, fires fans of shots, sends floor shock waves | Head of the Bureau. A grander Pressure Warden diving suit: red beacon helmet, a sash of self-awarded participation medals, a rubber-stamp gavel, an **inflatable riot shield** (raised in idle, lowered in exposed). |
| `archivist` | **The Head Archivist** (archive). *"Your incident has been filed under 'never happened'."* | 214×258 | leaps onto the player and lands heavily | A Buoy Enforcer turned librarian. Card-catalogue drawers in the torso, half-moon spectacles on the helmet visor, a filing-cabinet shield, a ladder hook. Heavy and stern. Windup is a deep crouch. |
| `barker` | **The Head Barker** (gates, **flies**). *"Step right up. Stay right down."* | 226×254 | hovers, bursts stars in a ring, dive-bombs | A huge puffer fish with a straw boater, striped vest and bow tie, and an oversized megaphone. Windup is visibly **inflated**, spines out. Clearly the boss of the Puffer Barkers. |
| `refund` | **The Refund Department** (carnival). *"Your safety is our recurring revenue."* | 286×302 | charges, fires fan shots, sends floor waves | The final boss. A carnival service machine on mechanical legs: a ticket-booth body with a huge customer-service grin, a striped tent-roof "hat", ring of bulbs, cash-register drawers, receipt paper streaming out, grabber arms. Bigger and more elaborate than the Ticket Collector. |

### 4D. Witnesses — 18 characters × 2 poses = 36 images

These replace the placeholder "pods". They are townsfolk, not pickups: each needs a personality you can read at about 100 game px tall. Transparent, 3/4 view, baseline per rule 3. **Target canvas 768 px tall** (minimum 512).

Poses:
- `<name>_waiting.png`: stuck and anxious, waving for help or clutching something.
- `<name>_rescued.png`: relieved or cheering, same design.

All are sea creatures; species below are **suggestions**. Keep the cast varied in silhouette, colour and height. Adults are about 100 game px tall, kids about 78.

| Level | name | Who they are (from the game) | Suggested design |
|---|---|---|---|
| Yard | `pip` | the lamp-keeper's kid | young hermit crab using an old lantern as its shell (kid) |
| Yard | `mabel` | cook of a ship that never left | octopus cook in an apron, a ladle in several arms |
| Yard | `gus` | crane operator, stuck up top since Tuesday | old lobster in overalls and ear defenders |
| Canal | `barnaby` | ferryman, technically still on shift | sea turtle in a captain's cap and oilskin |
| Canal | `wren` | customs clerk, honest by accident | seahorse in a visor with a ledger |
| Canal | `sal` | net-mender who sees everything | elderly spider crab with knitting needles and a net |
| Fortress | `otto` | filed a complaint in person | sea otter in a raincoat, waving a blank form |
| Fortress | `nell` | queue number 4,000,112, with snacks for a decade | sea snail with a heavy snack bag and a blank number ticket |
| Fortress | `brine` | former safety inspector, promoted to prisoner | old grouper in an inspector's cap, cracked monocle |
| Archive | `percy` | junior clerk, filed one incident correctly | anxious anchovy in an oversized tie with an armful of papers |
| Archive | `margo` | night cleaner, has read every file | cuttlefish with a mop and bucket |
| Archive | `hob` | lift attendant, lift discontinued | hermit crab bellhop in a pillbox hat |
| Gates | `iris` | ticket-taker who refused to charge for air | jellyfish in a ticket-booth cap |
| Gates | `bo` | balloon seller, balloons confiscated | clownfish holding a bunch of empty balloon strings |
| Gates | `june` | too short for every ride | small goby kid on tiptoes (kid) |
| Carnival | `lulu` | grand-prize winner; the prize was a bill | starfish holding a long blank receipt |
| Carnival | `fitz` | ride operator who pulled the stop lever | lanternfish mechanic with a lever handle |
| Carnival | `tilly` | Dot's gran; went for the raffle | elderly green nudibranch with a shawl and handbag (same species as Dot, §4E) |

### 4E. Dialogue portraits — 14 images

Bust portraits, from the chest up, transparent, facing right, **1024×1024** target (minimum 768). They show in the story dialogue box at about 130×143 px, so expressions must be big and clear.

| File | Character | Notes |
|---|---|---|
| `clax_smug.png`, `clax_alarmed.png`, `clax_determined.png`, `clax_sheepish.png` | **Clax** | Do **not** redesign: the same shrimp in the same brass-and-glass dome helmet as `clax_front.png`. Only the face and the angle of the helmet change. |
| `ada_neutral.png`, `ada_unimpressed.png` | **ADA**, the suit's safety software | Currently shown with an enemy sprite, which is confusing. **Proposed design:** a round brass instrument dial set into a suit panel. Its glass shows a simple glowing teal face of two dot eyes and a flat line mouth. Unimpressed means one "eyebrow" line raised. Clinical and dry. |
| `dot_neutral.png`, `dot_worried.png` | **Dot**, harbour courier | Has no art at all yet. **Proposed design:** a young green nudibranch (game colour `#9fd38a`) in a courier cap with a mail satchel. Practical, warm and quick. |
| `drydock_smug.png`, `drydock_flustered.png` | **Director Drydock** | Head and shoulders of the 4C design. |
| `refund_grin.png` | **The Refund Department** | The service-grin face of the 4C design. |
| `slick.png`, `archivist.png`, `barker.png` | the other bosses | Head and shoulders of their 4C designs. |

---

## 5. TIER 2 — replace the code-drawn props, then enemy poses

### 5A. Props (transparent, baseline per rule 3, no text)

Sizes are in-game size; deliver at about 4×. "States" means separate files.

| File(s) | In-game size | Description |
|---|---|---|
| `checkpoint_off.png`, `checkpoint_on.png` | 64×190 | An "air station": a lifebuoy on a brass post with a valve and a pressure gauge. Off is unlit, weathered orange. On has a teal-lit buoy and steam wisps. The game draws the word "AIR". |
| `exit_locked.png`, `exit_open.png` | 96×180 | A heavy rescue-hatch door in a riveted frame. Locked is shut with a chained wheel. Open is swung open with green light and bubbles spilling out. |
| `crate.png` | 48×48 | A salvage crate with rope handles and a hazard band. |
| `spring_rest.png`, `spring_fired.png` | 62×45 | A brass spring pad. Fired is compressed and recoiling. |
| `launcher.png` | 62×45 | A red angled launch spring (it throws the player sideways). |
| `vent.png` | 54×17 | A floor steam grate. The steam is drawn by the game. |
| `hook_ring.png` | 50 diameter | A crane grab-ring with a short chain stub on top (players swing from it). |
| `hook_trolley.png` | 40×22 | A trolley block for moving hooks. |
| `pickup_tag.png`, `pickup_air.png`, `pickup_hull.png` | 20×28, 22×39, 28×28 | A brass rescue tag, a teal air canister, a cream hull-patch kit with a green cross. Read at small size. |
| `platform_move_l.png`, `platform_move_m.png`, `platform_move_r.png` | 26 tall | Moving platform as 3 slices. The middle slice must tile horizontally. Teal-grey with the cream/orange top edge used by all walkable surfaces. |
| `platform_crumble_l/m/r.png`, `platform_crumble_m_cracked.png` | 26 tall | Crumbling platform: pink-grey brittle plate, visibly cracked. |
| `gondola.png` | 166×110 incl. hanger | A Big Wheel gondola: a purple-and-cream cabin with a hanger bar. |
| `sign_blank.png` | 140×160 | A weathered sign board on a post, **blank face**. |
| `banner_blank_l/m/r.png` | 36 tall | A cloth banner in 3 slices with a tileable middle, blank. |
| `lamp_post.png`, `lamp_hanging.png` | 36×190, 32×70 | A harbour lamp and a hanging cage lamp. The glow is drawn by the game. |
| `window_fortress.png`, `window_archive.png`, `window_carnival.png` | 76×124 | Arched windows with glowing panes. |
| `porthole.png` | 60×60 | A brass porthole. |
| `tent.png` | about 390×440 | A striped carnival tent. |
| `crane.png` | about 300×800 | A background harbour crane silhouette. |

### 5B. Arena centrepieces — 6 images

A large transparent set piece hung on the back wall of each boss room. It sits behind the action, so keep it darker and calmer than the characters. About **3072×1280**.

| File | Boss room |
|---|---|
| `arena_pumphouse.png` | Clampright: a giant pump machine with the coupler socket |
| `arena_lock.png` | Slick: lock-gate machinery and big valve wheels |
| `arena_office.png` | Drydock: a wall of trophies and awards, a huge desk, a filing wall |
| `arena_readingroom.png` | Archivist: a tall bookcase arch with green lamps |
| `arena_gate.png` | Barker: the inside of the admission arch, with turnstiles |
| `arena_refund.png` | Refund Department: a service counter with ticket windows and dispensers, all blank |

### 5C. Enemy poses — the existing 9 enemies

The extra poses must match the reference sprite **exactly** (rule 7). Generate them **from** the reference sprite.

| Enemy | File(s) |
|---|---|
| crab | `crab_walk_b.png` (legs in the alternate step), `crab_hurt.png` |
| buoy | `buoy_fire.png`, `buoy_hurt.png` |
| turret | `turret_fire.png` (barrel recoiled), `turret_hurt.png` |
| eel | `eel_lunge.png`, `eel_hurt.png` |
| warden | `warden_walk_b.png`, `warden_hurt.png` |
| torpedo | `torpedo_windup.png` (reared back), `torpedo_charge.png` (streamlined), `torpedo_hurt.png` |
| guard | `guard_shield_down.png` (the exposed state matters for gameplay), `guard_hurt.png` |
| puffer | `puffer_inflated.png` (about to shout), `puffer_hurt.png` |
| carnival | `carnival_walk_b.png`, `carnival_hurt.png` |

Same canvas size and baseline as the reference.

### 5D. Title key art — 1 image

`title_keyart.png`: **3840×2160**. Clax, **exactly as designed**, in a heroic but slightly over-confident pose in front of Port Flounder, with hints of all six levels in the distance. The **left 40% stays calm and dark** because the game's logo and menu sit there. No text.

---

## 6. TIER 3 — only if Tiers 1–2 are done and consistent

- **Clax rig repaint.** The player is animated from 10 cut-out parts sliced from `clax_front.png`: upper arm, pincer, jaw, head/dome, hand, torso, two leg shafts, two boots. The slices leave hard edges where parts overlap. Repaint each part as its own transparent PNG at 2× the reference resolution, **identical design**, with the hidden overlap areas completed, plus a full assembled reference. Attempt this only if your tool can hold the design exactly. If it drifts, skip it and say so.
- **VFX sprites** (transparent, 512²): bubble, spark, dust puff, a snap-wave crescent, a burst ring, the star projectile and the bolt projectile.

---

## 7. Acceptance checklist (Claude will reject failures)

- [ ] Correct filename, folder, size ≥ minimum, PNG sRGB, and a real alpha channel wherever it is required.
- [ ] Matches the §2 style at display size: outline weight, light from the upper left, worn materials.
- [ ] **Zero lettering**, zero watermarks or signatures.
- [ ] Facing and baseline rules (§3.3–3.4). Nothing cropped by the canvas edge.
- [ ] Backdrops: recede behind gameplay (compressed values, lower saturation, no lit horizontal ledges, no central focal object), tile horizontally, tile test included.
- [ ] Textures: seamless with no mirroring, a 3×3 tile test included, the repeat not obvious.
- [ ] Multi-pose sets: identical design across poses. Existing designs (Clax, the 9 enemies) unchanged.
- [ ] Original designs, no franchise look-alikes.

---

## 8. Delivery

- Work on a new branch, e.g. `codex/art-pass-1`, and open a PR. **Do not touch `index.html` or any code.**
- Folder layout:
  ```
  art/codex/
    backgrounds/   yard_far.png, yard_mid.png, ...
    textures/      yard_ground.png, yard_wall.png, ...   (+ *__tiletest.jpg)
    bosses/        clampright_idle.png, ...
    witnesses/     pip_waiting.png, pip_rescued.png, ...
    portraits/     clax_smug.png, ada_neutral.png, ...
    props/  arenas/  enemies/  keyart/  rig/  vfx/
    contact_sheets/ one JPG per folder showing every image at a glance
    manifest.json
  ```
- `manifest.json` has one entry per file:
  ```json
  { "file": "bosses/clampright_idle.png", "size": [1536, 1338], "alpha": true,
    "upscaled": false, "seamless": null, "notes": "" }
  ```
  `seamless` is `true` or `false` for textures and backdrops and `null` otherwise. Use `notes` for anything that did not meet spec, rather than hiding it.
- **Work in batches and open one PR per batch**, so problems surface early:
  1. Backdrops 4A.
  2. Textures 4B.
  3. Bosses 4C.
  4. Witnesses 4D and portraits 4E.
  5. Props 5A and arenas 5B.
  6. Enemy poses 5C and key art 5D.
  7. Tier 3.
- If something in this brief is impossible with your tools (for example, true 3:1 output), do the closest thing, say exactly what you did in `notes`, and keep going.
