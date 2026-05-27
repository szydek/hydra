// Beat-reactive colored squares
// Creates squares that respond to audio with different colors

fade = 1
a.setSmooth(0.8)

// Simple beat-reactive squares
solid(0, 0, 0)
.layer(
  shape(4, 0.5, 0.01)
    .color(1, 0, 0)  // Red square
    .scale(() => (a.fft[0] || 0) * 2 + 0.2)
    .rotate(() => time * 0.2)
    .scroll(-0.3, 0)
    .mult(() => Math.min(1, (a.fft[0] || 0) * 3))
)
.layer(
  shape(4, 0.5, 0.01)
    .color(0, 1, 0)  // Green square
    .scale(() => (a.fft[1] || 0) * 2 + 0.2)
    .rotate(() => time * 0.15)
    .scroll(0.3, 0)
    .mult(() => Math.min(1, (a.fft[1] || 0) * 3))
)
.layer(
  shape(4, 0.5, 0.01)
    .color(0, 0, 1)  // Blue square
    .scale(() => (a.fft[2] || 0) * 2 + 0.2)
    .rotate(() => time * 0.1)
    .scroll(0, -0.3)
    .mult(() => Math.min(1, (a.fft[2] || 0) * 3))
)
.layer(
  shape(4, 0.5, 0.01)
    .color(1, 1, 0)  // Yellow square
    .scale(() => (a.fft[3] || 0) * 2 + 0.2)
    .rotate(() => time * 0.25)
    .scroll(0, 0.3)
    .mult(() => Math.min(1, (a.fft[3] || 0) * 3))
)
.add(src(o0).scale(0.96).rotate(0.01), 0.7)
.brightness(() => -1 + fade + (a.fft[0] || 0) * 0.2)
.contrast(1.1)
.out()
