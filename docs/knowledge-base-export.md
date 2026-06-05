# Dialed — Knowledge Base Export

> **Purpose of this document**
> This is a self-contained, portable export of the entire domain knowledge that
> powers **Dialed**, an AI-assisted mountain-bike suspension setup calculator.
> It is written to be **pasted directly into a Claude chat** (or any LLM) so you
> can brainstorm and develop product ideas, refine the tuning logic, validate the
> physics, and expand the databases — **without needing access to the codebase**.
>
> Everything below is derived from the live app source:
> - Component & bike data: `src/constants.ts`
> - Tuning engine: `src/utils.ts`
> - Data shapes: `src/types.ts`
> - Image identification: `src/services/geminiService.ts`
>
> _Generated for branch `claude/app-knowledge-base-export-Ci4ok`. If the source data
> changes, regenerate this file so the export stays in sync._

---

## 1. How to use this export with Claude

Paste this whole document into a Claude chat, then ask for what you need. Some
starting prompts are listed in [Section 8](#8-seed-prompts-for-developing-ideas).
The most useful framing for Claude:

> "You are a mountain-bike suspension tuning expert and a product strategist.
> The following is the complete knowledge base behind my suspension calculator
> app. Help me [improve the accuracy of the air-pressure model / add a new fork /
> design a feedback-driven tuning loop / etc.]."

---

## 2. App overview

**Dialed** takes a rider's inputs and returns a recommended suspension baseline
("a starting point on the trail") for their specific fork and shock.

**Rider/bike inputs**
- Rider weight (kg)
- Bike type: `muscle` (analog) or `ebike`
- Bike category + model (drives stock fork/shock suggestions)
- Front fork model, rear shock model
- Ride style / discipline: `XC`, `Trail`, `Enduro`, `Bike Park`, `Downhill`
- Terrain (captured in the form; not yet used by the math — see gaps)

**Outputs** (per component)
- Recommended sag %
- Air pressure (PSI) **or** coil spring rate + preload
- Per-adjuster click counts for rebound and compression (LSR/HSR/LSC/HSC)
- Lever positions (e.g. Open / Medium / Firm) where applicable

**Personalization layer** — `UserPreferences`
- `pressureModifier` (default `1.0`; `>1.0` stiffer, `<1.0` softer)
- `reboundModifier` (default `0`; `+` faster/less damping, `-` slower/more damping)

**AI image ID** — users can photograph a fork/shock; Gemini returns
`{ manufacturer, model, type }` to auto-select the component.

---

## 3. The tuning engine (plain-language spec)

This is the exact logic from `calculateSettings()` in `src/utils.ts`, expressed
in plain language so it can be reasoned about and critiqued independently of code.

### 3.1 Inputs
`weight` (kg), `rideType`, `componentName`, `componentType` (`fork`|`shock`),
`preferences` (`pressureModifier`, `reboundModifier`), `bikeType` (`muscle`|`ebike`).

If the component name isn't found in the database, it returns empty settings.

### 3.2 E-bike multiplier
- `eBikeMultiplier = 1.18` for e-bikes, else `1.0`.
  (E-bikes are heavier, so air pressure is scaled up 18%.)

### 3.3 Recommended sag (by ride style)
| Ride style | Recommended sag |
|---|---|
| XC | 20–22% |
| Trail | 25–28% |
| Enduro | 30–32% |
| Bike Park | 28–30% (firmer for big-landing support) |
| Downhill | 33–35% |
| _fallback_ | 25–30% |

### 3.4 Spring: air vs coil
A component is treated as **coil** if it has a `Spring Preload` adjustment.

**Air pressure (PSI)** — only if not coil:
```
baseMultiplier = 1.05 (fork) | 2.7 (shock)
rideTypeMultiplier:
  XC = 1.15   (+15% pressure for pedaling efficiency)
  Trail = 1.00 (baseline)
  Enduro = 0.92 (−8% for compliance/traction)
  Bike Park = 1.04 (+4% for bottom-out support)
  Downhill = 0.86 (−14% for max traction)
PSI = round( weight × baseMultiplier × rideTypeMultiplier
             × pressureModifier × eBikeMultiplier )
```

**Coil** — if `Spring Preload` exists:
```
baseRate = weight × 5.5 (fork) | 6.8 (shock)
Spring Rate = round(baseRate / 50) × 50   // rounded to nearest 50
Spring Preload = "1–2 turns"
```

### 3.5 Damping offsets
```
reboundOffset      = (ebike ? 2 : 0) + reboundModifier
compressionOffset  = (ebike ? −2 : 0)
```

### 3.6 Per-adjuster logic
For each adjustment on the component (skipping `Air Pressure`,
`Spring Preload`, `Spring Rate`):

- **Lever-type** adjusters → set to `"Open"`.
- **Knob-type** adjusters with a range → `maxClicks` parsed from the range string
  (e.g. `"16 clicks"` → 16; default 12 if unparseable). All click counts are
  expressed as **clicks _out_ from fully closed**, then clamped to `[1, maxClicks−1]`.

  **Rebound knobs** (key contains "Rebound"):
  ```
  riderFactor = clamp((weight − 50) / (120 − 50), 0, 1)   // 0 at ≤50kg, 1 at ≥120kg
  baseClicksOut = round(maxClicks − riderFactor × (maxClicks × 0.7))
  finalClicks = baseClicksOut + reboundOffset
  if High-Speed Rebound: finalClicks += 2
  ```
  → Heavier riders get fewer clicks out (more rebound damping / slower rebound).

  **Compression knobs** (key contains "Compression"):
  ```
  riderFactor = clamp((weight − 50) / (120 − 50), 0, 1)
  baseClicksOut = round(maxClicks / 2)
  baseClicksOut −= round(riderFactor × 4)            // heavier → fewer clicks out
  if rideType in {Bike Park, Downhill}: baseClicksOut −= 2   // more compression support
  if rideType == XC: baseClicksOut += 2                      // more open/supple
  finalClicks = baseClicksOut − compressionOffset    // ebike compressionOffset = −2 ⇒ +2 clicks
  if High-Speed Compression: finalClicks += 1
  ```

> **Note on the e-bike compression interaction:** `compressionOffset` is `−2` for
> e-bikes, and the formula subtracts it (`finalClicks − compressionOffset`), so
> e-bikes actually end up with **+2 clicks out** (less compression damping) — worth
> sanity-checking against intent. Flagged in [Section 7](#7-known-gaps--open-questions).

---

## 4. Data model (TypeScript shapes)

```ts
interface Adjustment {
  location: string;       // where it physically is on the component
  tool?: string;          // tool required (e.g. "Fox shock pump")
  range?: string;         // e.g. "16 clicks", "50-120 PSI", "3 positions"
  setting?: string;       // e.g. "clicks from closed", "Position"
  baseline?: number | string;
  type?: 'knob' | 'lever' | 'spacer';
  positions?: string[];   // for levers, e.g. ["Open","Medium","Firm"]
}

interface SuspensionComponent {
  model: string;
  series: string;
  damper: string;
  airSpring?: string;
  spring?: string;        // present (coil) instead of airSpring
  travel?: string[];      // mm options
  capabilities: { lsc: boolean; hsc: boolean; lsr: boolean; hsr: boolean };
  adjustments: Record<string, Adjustment>;
}

interface BikeSpec { fork: string; shock: string; travel: string }
```

Capability flags: **LSC** low-speed compression, **HSC** high-speed compression,
**LSR** low-speed rebound, **HSR** high-speed rebound.

---

## 5. Suspension component database

### 5.1 Forks

| Key | Model | Series | Damper | Spring | Travel (mm) | LSC | HSC | LSR | HSR |
|---|---|---|---|---|---|:--:|:--:|:--:|:--:|
| Fox 34 Factory GRIP2 | Fox 34 | Factory | GRIP2 | FLOAT EVOL (air) | 120/130/140 | ✓ | ✓ | ✓ | ✓ |
| Fox 34 Factory FIT4 | Fox 34 | Factory | FIT4 | FLOAT EVOL (air) | 120/130/140 | ✓ | ✗ | ✓ | ✗ |
| Fox 36 Factory GRIP X2 | Fox 36 | Factory | GRIP X2 | FLOAT NA2 (air) | 140–180 | ✓ | ✓ | ✓ | ✓ |
| Fox 36 Factory GRIP2 | Fox 36 | Factory | GRIP2 | FLOAT EVOL (air) | 140–180 | ✓ | ✓ | ✓ | ✓ |
| Fox 36 Factory FIT4 | Fox 36 | Factory | FIT4 | FLOAT EVOL (air) | 140/150/160 | ✓ | ✗ | ✓ | ✗ |
| Fox 36 Performance Elite GRIP2 | Fox 36 | Performance Elite | GRIP2 | FLOAT EVOL (air) | 140–170 | ✓ | ✓ | ✓ | ✓ |
| Fox 36 Performance GRIP | Fox 36 | Performance | GRIP | FLOAT EVOL (air) | 140/150/160 | ✗ | ✗ | ✓ | ✗ |
| Fox 38 Factory GRIP X2 | Fox 38 | Factory | GRIP X2 | FLOAT NA2 (air) | 160/170/180 | ✓ | ✓ | ✓ | ✓ |
| Fox 38 Factory GRIP2 | Fox 38 | Factory | GRIP2 | FLOAT NA2 (air) | 160/170/180 | ✓ | ✓ | ✓ | ✓ |
| Fox 38 Performance Elite GRIP2 | Fox 38 | Performance Elite | GRIP2 | FLOAT EVOL (air) | 160/170/180 | ✓ | ✓ | ✓ | ✓ |
| Fox 40 Factory GRIP X2 | Fox 40 | Factory | GRIP X2 | Coil | 180/190/203 | ✓ | ✓ | ✓ | ✓ |
| Fox 40 Factory GRIP2 | Fox 40 | Factory | GRIP2 | Coil | 203 | ✓ | ✓ | ✓ | ✓ |
| RockShox Pike Ultimate RC2 | RockShox Pike | Ultimate | Charger 3 RC2 | DebonAir+ (air) | 130–160 | ✓ | ✓ | ✓ | ✗ |
| RockShox Pike Ultimate RC | RockShox Pike | Ultimate | Charger 3 RC | DebonAir+ (air) | 130–160 | ✓ | ✗ | ✓ | ✗ |
| RockShox Pike Select+ RC | RockShox Pike | Select+ | Charger 2.1 RC | DebonAir (air) | 130–160 | ✓ | ✗ | ✓ | ✗ |
| RockShox Lyrik Ultimate RC2 | RockShox Lyrik | Ultimate | Charger 3 RC2 | DebonAir+ (air) | 160/170/180 | ✓ | ✓ | ✓ | ✗ |
| RockShox Lyrik Ultimate RC | RockShox Lyrik | Ultimate | Charger 3 RC | DebonAir+ (air) | 160/170/180 | ✓ | ✗ | ✓ | ✗ |
| RockShox Lyrik Select+ RC | RockShox Lyrik | Select+ | Charger 2.1 RC | DebonAir (air) | 160/170/180 | ✓ | ✗ | ✓ | ✗ |
| RockShox ZEB Ultimate RC2 | RockShox ZEB | Ultimate | Charger 3 RC2 | DebonAir+ (air) | 170/180/190 | ✓ | ✓ | ✓ | ✗ |
| Öhlins RXF36 M.2 | Öhlins RXF36 | Standard | TTX18 | Twin-tube air | 160/170/180 | ✓ | ✓ | ✓ | ✗ |

**Fork adjuster detail** (location · range · baseline clicks-from-closed):

- **Fox 34 Factory GRIP2** — Air: Top cap left leg (blue cap), Fox pump, 50–120 PSI · LSR: red inner knob, 16 clicks, base 8 · HSR: red outer ring, 8 clicks, base 4 · LSC: blue inner knob, 16 clicks, base 8 · HSC: blue outer ring, 8 clicks, base 4.
- **Fox 34 Factory FIT4** — Air: 50–120 PSI · LSR: red knob, 14 clicks, base 7 · Open Mode Adjust: black inner dial, 22 clicks, base 11 · Compression Mode lever: Open/Medium/Firm (base Open).
- **Fox 36 Factory GRIP X2** — Air: 50–140 PSI · LSR 16 (8) · HSR 8 (4) · LSC 22 (11) · HSC 12 (2).
- **Fox 36 Factory GRIP2** — Air: 50–140 PSI · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **Fox 36 Factory FIT4** — Air: 50–140 PSI · LSR 14 (7) · Open Mode Adjust 22 (11) · Compression Mode lever Open/Medium/Firm.
- **Fox 36 Performance Elite GRIP2** — Air: 50–140 PSI · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **Fox 36 Performance GRIP** — Air: 50–140 PSI · LSR 10 (5) · Compression Mode lever Open/Medium/Firm.
- **Fox 38 Factory GRIP X2** — Air: 60–150 PSI · LSR 16 (8) · HSR 8 (4) · LSC 22 (11) · HSC 12 (2).
- **Fox 38 Factory GRIP2** — Air: 60–150 PSI · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **Fox 38 Performance Elite GRIP2** — Air: 60–150 PSI · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **Fox 40 Factory GRIP X2** — Coil, Spring Preload (blue dial, top left leg, by hand) · LSR 16 (8) · HSR 8 (4) · LSC 22 (11) · HSC 12 (2).
- **Fox 40 Factory GRIP2** — Coil, Spring Preload · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **RockShox Pike Ultimate RC2** — Air: 50–140 PSI · LSR 18 (9) · LSC small silver dial 18 (9) · HSC large dial 5 (2).
- **RockShox Pike Ultimate RC** — Air: 50–140 PSI · LSR 18 (9) · LSC lever Open/Pedal/Firm.
- **RockShox Pike Select+ RC** — Air: 50–140 PSI · LSR 15 (8) · LSC lever Open/Pedal/Firm.
- **RockShox Lyrik Ultimate RC2** — Air: 60–150 PSI · LSR 18 (9) · LSC 18 (9) · HSC 5 (2).
- **RockShox Lyrik Ultimate RC** — Air: 60–150 PSI · LSR 18 (9) · LSC lever Open/Pedal/Firm.
- **RockShox Lyrik Select+ RC** — Air: 60–150 PSI · LSR 15 (8) · LSC lever Open/Pedal/Firm.
- **RockShox ZEB Ultimate RC2** — Air: 60–150 PSI · LSR 18 (9) · LSC 18 (9) · HSC 5 (2).
- **Öhlins RXF36 M.2** — Air: 60–150 PSI (main) · Ramp-Up Chamber 150–250 PSI · LSR gold knob 16 (8) · LSC blue knob 16 (8) · HSC black lever 3 (1).

### 5.2 Shocks

| Key | Model | Series | Damper | Spring | LSC | HSC | LSR | HSR |
|---|---|---|---|---|:--:|:--:|:--:|:--:|
| Fox Float X Factory 2-Pos | Fox Float X | Factory | 2-Position | FLOAT + spacers | ✓ | ✗ | ✓ | ✗ |
| Fox Float X Performance Elite 2-Pos | Fox Float X | Performance Elite | 2-Position | FLOAT EVOL | ✓ | ✗ | ✓ | ✗ |
| Fox Float X2 Factory | Fox Float X2 | Factory | Twin-tube | Dual air chambers | ✓ | ✓ | ✓ | ✓ |
| Fox DHX2 Factory | Fox DHX2 | Factory | Twin-tube | Coil | ✓ | ✓ | ✓ | ✓ |
| Fox DPX2 Factory | Fox DPX2 | Factory | Twin-tube | FLOAT EVOL | ✓ | ✗ | ✓ | ✗ |
| Fox Float DPS Factory 3-Pos | Fox Float DPS | Factory | 3-Position | EVOL | ✓ | ✗ | ✓ | ✗ |
| Fox Float GENIE | Fox Float GENIE | Specialized | 2-Position Custom | FLOAT | ✗ | ✗ | ✓ | ✗ |
| RockShox Super Deluxe Ultimate 2-Pos | RockShox Super Deluxe Ultimate | Ultimate | RC2T | DebonAir+ + spacers | ✓ | ✗ | ✓ | ✗ |
| RockShox Super Deluxe Ultimate+ LSC Knob | RockShox Super Deluxe Ultimate | Ultimate+ | RC2T | DebonAir+ + spacers | ✓ | ✓ | ✓ | ✗ |
| RockShox Super Deluxe Ultimate Coil | RockShox Super Deluxe Ultimate Coil | Ultimate | RC2T | Coil | ✓ | ✓ | ✓ | ✗ |
| Öhlins TTX Air | Öhlins TTX Air | Standard | TTX Air | TTX Air | ✓ | ✓ | ✓ | ✗ |
| Öhlins TTX22m | Öhlins TTX22m | Standard | TTX22m | Coil | ✓ | ✓ | ✓ | ✗ |

**Shock adjuster detail:**

- **Fox Float X Factory 2-Pos** — Air: Schrader on body eyelet, 100–350 PSI · LSR 16 (8) · LSC 10 (5) · Compression Mode lever Open/Firm.
- **Fox Float X Performance Elite 2-Pos** — Air: 100–350 PSI · LSR 12 (6) · LSC 10 (5) · Compression Mode lever Open/Firm.
- **Fox Float X2 Factory** — Air: reservoir valve, 100–300 PSI · LSR inner 3mm hex 16 (8) · HSR outer 6mm hex 8 (4) · LSC inner 3mm hex 16 (8) · HSC outer 6mm hex 8 (4).
- **Fox DHX2 Factory** — Coil, Spring Preload collar · LSR 16 (8) · HSR 8 (4) · LSC 16 (8) · HSC 8 (4).
- **Fox DPX2 Factory** — Air: main can, 100–350 PSI · LSR 14 (7) · Open Mode Adjust 10 (5) · Compression Mode lever Open/Medium/Firm.
- **Fox Float DPS Factory 3-Pos** — Air: 100–300 PSI · LSR 12 (6) · Open Mode Adjust 3 settings (1/2/3) · Compression Mode lever Open/Medium/Firm.
- **Fox Float GENIE** — Air: 100–350 PSI · LSR 12 (6) · Compression Mode lever Open/Climb.
- **RockShox Super Deluxe Ultimate 2-Pos** — Air: 100–350 PSI · LSR 15 (8) · LSC small dial 5 (2) · Compression Mode lever Open/Threshold.
- **RockShox Super Deluxe Ultimate+ LSC Knob** — Air: 100–350 PSI · LSR 15 (8) · LSC 5 (3) · HSC 5 (2).
- **RockShox Super Deluxe Ultimate Coil** — Coil, Spring Preload collar · LSR 15 (8) · LSC 5 (3) · HSC 5 (2).
- **Öhlins TTX Air** — Air: 100–350 PSI · LSR gold knob 20 (10) · LSC blue knob 16 (8) · HSC black lever Open/Pedal/Lock.
- **Öhlins TTX22m** — Coil, Spring Preload (spanner) · LSR 20 (10) · LSC 16 (8) · HSC 3 (1).

---

## 6. Bike & e-bike databases (stock spec suggestions)

These map a bike model to its stock fork, shock, and front/rear travel. They
drive the "suggest my components" feature.

### 6.1 Analog (muscle) bikes

**Trail**
| Bike | Fork | Shock | Travel |
|---|---|---|---|
| Santa Cruz Tallboy | Fox 34 Factory GRIP2 | Fox Float DPS Factory 3-Pos | 130/120mm |
| Santa Cruz 5010 | Fox 36 Factory GRIP2 | Fox Float DPS Factory 3-Pos | 140/130mm |
| Santa Cruz Hightower | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/145mm |
| Santa Cruz Bronson | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 160/150mm |
| Trek Top Fuel | RockShox Pike Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 130/120mm |
| Trek Fuel EX | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/140mm |
| YT Izzo | RockShox Pike Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 140/130mm |
| YT Jeffsy | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/145mm |
| Radon Skeen Trail | RockShox Pike Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 140/120mm |
| Radon Slide Trail | RockShox Pike Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 140/140mm |
| Specialized Stumpjumper 15 | Fox 36 Factory GRIP2 | Fox Float GENIE | 150/145mm |
| Yeti SB140 | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/140mm |
| Ibis Ripmo V3 | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 160/147mm |
| Whyte T-160 | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 160/160mm |
| Revel Rascal | Fox 36 Factory GRIP2 | Fox Float DPS Factory 3-Pos | 150/140mm |
| Ari Delano Peak | Fox 36 Factory GRIP2 | Fox Float DPS Factory 3-Pos | 150/135mm |

**Enduro**
| Bike | Fork | Shock | Travel |
|---|---|---|---|
| Santa Cruz Megatower | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/165mm |
| Santa Cruz Nomad | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/170mm |
| Trek Slash | RockShox ZEB Ultimate RC2 | RockShox Super Deluxe Ultimate 2-Pos | 170/170mm |
| YT Capra | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 180/170mm |
| Radon Swoop | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 170/170mm |
| Radon JAB 29 | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 170/170mm |
| Radon JAB MX | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 170/170mm |
| Yeti SB160 | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/160mm |
| Pivot Firebird | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 180/170mm |
| Rocky Mountain Altitude | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/160mm |
| Canyon Strive | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/170mm |
| Specialized Enduro | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 180/170mm |
| Transition Spire | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/170mm |
| Orbea Rallon | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/160mm |

**Bike Park / Downhill**
| Bike | Fork | Shock | Travel |
|---|---|---|---|
| Santa Cruz V10 | Fox 40 Factory GRIP2 | Fox DHX2 Factory | 215/215mm |
| Trek Session | Fox 40 Factory GRIP2 | Fox Float X2 Factory | 200/200mm |
| YT Tues | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 200/200mm |
| Yeti SB165 | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 180/165mm |
| Specialized Demo | Fox 40 Factory GRIP2 | Fox Float X2 Factory | 200/200mm |

### 6.2 E-bikes

**Trail**
| Bike | Fork | Shock | Travel |
|---|---|---|---|
| Santa Cruz Heckler | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/140mm |
| Trek Fuel EXe | Fox 36 Factory GRIP2 | Fox Float X Factory 2-Pos | 150/140mm |
| Radon Render | RockShox Pike Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 150/140mm |

**Enduro**
| Bike | Fork | Shock | Travel |
|---|---|---|---|
| Santa Cruz Bullit | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/160mm |
| Trek Rail | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 160/150mm |
| YT Decoy | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate 2-Pos | 170/165mm |
| YT Decoy MX | Fox 38 Factory GRIP2 | Fox Float X2 Factory | 170/165mm |
| Radon Swoop Hybrid | RockShox Lyrik Ultimate RC | RockShox Super Deluxe Ultimate Coil | 170/165mm |

---

## 7. Known gaps & open questions

Candidate areas to discuss/improve with Claude:

1. **Terrain input is collected but unused.** The form captures `terrain` but
   `calculateSettings()` never reads it. Should it modify pressure/damping?
2. **E-bike compression sign.** `compressionOffset = −2` is *subtracted*, so
   e-bikes get *more* clicks out (less compression). Verify this matches intent
   vs. the rebound side (which correctly adds 2 clicks of damping).
3. **Volume spacers / tokens** are not modeled despite being central to
   bottom-out resistance. Several springs mention spacers but there's no output.
4. **Air pressure is linear in weight only.** No rider gear, riding-position,
   bike leverage ratio, or fork-vs-shock travel consideration.
5. **Coil spring rate** uses a flat `weight × k` with no leverage-ratio or
   stroke input, and ignores ride style entirely.
6. **Öhlins ramp-up chamber, FIT4 "Open Mode Adjust", DPS positions** have no
   recommended outputs — they fall through the knob/lever branches.
7. **No confidence / range output.** A min–max bracket per setting might be more
   honest than a single number for a "starting point."
8. **Feedback loop unused for tuning.** `SavedSetup` stores `rating` and
   `feedback` (`Too Soft`/`Too Hard`/`Too Fast`/`Too Slow`) but nothing feeds it
   back into recommendations. Strong candidate for an adaptive layer.
9. **Database coverage.** Limited brands (mostly Fox/RockShox/Öhlins; no Marzocchi,
   DVO, EXT, Cane Creek, Manitou) and a small bike list.
10. **Units.** Weight assumed in kg; PSI/coil constants are tuned for that. No
    lb/kg toggle in the math.

---

## 8. Seed prompts for developing ideas

Copy any of these into the chat after pasting this document:

- "Critique the air-pressure model in §3.4 against real-world Fox/RockShox setup
  charts. Where is it likely to be off, and how would you recalibrate the
  `baseMultiplier` and ride-style multipliers?"
- "Design a closed-loop tuning feature that uses the saved `feedback` values
  (Too Soft/Hard/Fast/Slow) to nudge the next recommendation. Give me the
  adjustment rules and a data model."
- "Propose how to incorporate **volume spacers/tokens** as both an input and an
  output, per component family."
- "Add **leverage ratio** and **rear travel** to the coil spring-rate calc.
  What formula should replace `weight × 6.8`?"
- "Audit the e-bike compression offset in §3.6 — is the sign correct? Show the
  resulting clicks for a 90 kg rider on a Fox 38 GRIP2 (LSC range 16) for both
  bike types."
- "Suggest 10 forks/shocks and 15 bikes to add to the databases, with realistic
  adjuster ranges and baselines in the same schema as §4."
- "Turn the per-setting single numbers into honest min–max brackets. What's a
  principled way to derive the bracket width per adjuster?"
- "Design a 'why these settings?' explanation layer that narrates the reasoning
  to the rider in plain language."
