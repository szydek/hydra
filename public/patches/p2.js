// Bass-reactive geometric pattern
// Creates complex geometric shapes that respond to bass frequencies

fade = 1
a.setSmooth(0.8)

bass = 0

update = () => {
  bass += a.fft[0] * 0.012
}

shape(4,0.35)
  .repeat(8,6)
  .rotate(() => bass*0.02)
  .scrollX(() => bass*0.008)
  .scrollY(() => Math.sin(bass)*0.01)

  .modulateRotate(
    osc(3,0.1),
    () => 0.02 + a.fft[0]*0.08
  )

  .color(
    () => 0.05 + a.fft[0] * 0.8,
    () => 0.2 + a.fft[2] * 0.7,
    () => 0.6 + a.fft[4] * 0.5
  )

  .blend(
    shape(4,0.2)
      .repeat(5,4)
      .rotate(() => -bass*0.015)
      .color(
        () => 0.1 + a.fft[1] * 0.9,
        () => 0.3 - a.fft[3] * 0.3,
        () => 0.7 - a.fft[0] * 0.4
      ),
    0.35
  )

  .brightness(() => -1 + fade + 0.04 + a.fft[0]*0.12)
  .contrast(1.15)
  .out()

speed=0.25
