# Hydra Performance Setup

Live-coding visual synthesizer with audio-reactive patches and keyboard controls.

## Keyboard Controls

| Key | Action |
|-----|--------|
| `0`–`9` | Load patch by number |
| `a` | Toggle audio meter (bottom-right) |
| `c` | Toggle code editor visibility |
| `Ctrl+Shift+Enter` | Evaluate current block |
| `Ctrl+Enter` | Evaluate current line |
| `Ctrl+Shift+H` | Toggle all UI |

> `a` and `c` only fire when the code editor is **not focused** and no modifier keys are held, so `Cmd+C` copy still works normally.

---

## Patches

Patches live in `public/patches/` as generic slot files `p0.js`–`p9.js`. They are plain Hydra JavaScript files loaded and executed via `new Function(code)()`.

| Key | File | Notes |
|-----|------|-------|
| `0` | `public/patches/p0.js` | edit to replace |
| `1` | `public/patches/p1.js` | auto-loads on startup |
| `2` | `public/patches/p2.js` | |
| `3` | `public/patches/p3.js` | |
| `4` | `public/patches/p4.js` | |
| `5` | `public/patches/p5.js` | |
| `6` | `public/patches/p6.js` | |
| `7` | `public/patches/p7.js` | |
| `8` | `public/patches/p8.js` | |
| `9` | `public/patches/p9.js` | |

Example/reference patches are in `public/patches/examples/` — copy any of them over a slot file to use.

### Swapping a Slot

Just overwrite the slot file:
```bash
cp public/patches/examples/00-mono-voronoi.js public/patches/p0.js
```

### Adding a New Patch

1. Write your Hydra code in any file under `public/patches/`
2. Copy it to a slot: `cp mypatch.js public/patches/p3.js`
3. Press `3` to load it live — no code changes needed

### Patch Template

```js
// My patch description

a.setSmooth(0.8)

fade = 1  // required if you use fade in brightness

update = () => {
  // runs every frame — use for audio-reactive variables
  // a.fft[0] = bass, a.fft[2] = mids, a.fft[5] = highs
}

osc(10, 0.1)
  .color(() => 1 + a.fft[0] * 2, 0.5, 1)
  .out(o0)

speed = 0.5
```

### Important Notes

- **`fade = 1`** — set this if your patch uses `fade` in a `.brightness()` call, otherwise `hush()` will clear it and the screen goes black
- **`update = () => {}`** — Hydra calls this every frame; use it for accumulating audio values
- **`a.fft[0-7]`** — FFT frequency bins (0=bass → 7=highs)
- **`a.setSmooth(0.8)`** — smooths FFT values, prevents jitter; range 0–1
- **`hush()`** is called automatically before each patch load to clear previous outputs

---

## TODO

- **Patch sets** — support named sets of patches selectable via `?set=name` URL param. Each set would be a JSON manifest in `public/patches/sets/` mapping slots 0-9 to any files in the library. Example: `?set=ambient` loads `sets/ambient.json`.

---

## URL Parameters

| Parameter | Effect |
|-----------|--------|
| `?sketch_id=name` | Load a sketch from the Hydra gallery |
| `?code=...` | Load code directly from URL |

When either param is present, patch 1 will **not** auto-load on startup.

---

## Dev Server

```bash
npm install
./node_modules/.bin/vite . --host
# → http://localhost:5173
```

---

## Project Structure

```
hydra/
├── public/
│   └── patches/
│       ├── p0.js … p9.js     # Active slots — edit these
│       └── examples/          # Reference library
├── src/
│   └── views/
│       └── editor/
│           └── editor.js      # Patch loader, audio meter, keyboard controls
└── PERFORMANCE.md             # This file
```
