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

Patches live in `public/patches/`. They are plain Hydra JavaScript files loaded and executed via `new Function(code)()`.

| # | File | Description |
|---|------|-------------|
| 0 | `00-mono-voronoi.js` | Monochrome voronoi, bass-reactive colorama |
| 1 | `01-opening.js` | Bass-reactive geometric grid |
| 2 | `02-geometric.js` | Audio-reactive shape patterns |
| 3 | `03-macro.js` | Video texture with audio-reactive speed |
| 4 | `04-video.js` | Dimension-building voronoi |
| 5 | `05-whitney-spirals.js` | Canvas 2D fan lines, quantized color |
| 6 | `06-whitney-harmonic.js` | Harmonic motion patterns |
| 7 | `07-whitney-lattice.js` | Lattice geometry |
| 8 | `08-whitney-dots.js` | Crazy squares feedback loop |
| 9 | `09-whitney-pendulum.js` | Pendulum motion |

### Adding a New Patch

1. Create a new file in `public/patches/`, e.g. `public/patches/10-mypatch.js`
2. Write standard Hydra code ending with `.out(o0)`
3. Register it in `src/views/editor/editor.js` inside `loadPatchList()`:

```js
{ number: 10, file: '10-myatch.js' },
```

4. Press `0` (or your assigned number) to load it live

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
│   └── patches/          # Patch files served statically
│       ├── 00-mono-voronoi.js
│       ├── 01-opening.js
│       └── ...
├── src/
│   └── views/
│       └── editor/
│           └── editor.js  # Patch loader, audio meter, keyboard controls
└── PERFORMANCE.md         # This file
```
