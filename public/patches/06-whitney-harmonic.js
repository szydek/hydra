// John Whitney Style Audio-Reactive Harmonic Motion
// Multiple oscillators creating complex harmonic patterns

a.setSmooth(0.8)

harmonic1 = 0
harmonic2 = 0

update = () => {
  harmonic1 += (a.fft[0] || 0) * 0.015
  harmonic2 += (a.fft[1] || 0) * 0.01
}

osc(15, 0.2, 0.6)
  .modulateRotate(
    osc(4, 0.3)
      .rotate(() => time * 0.2 + harmonic1)
  )
  .modulateScale(
    osc(3, 0.25)
      .rotate(() => -time * 0.15 + harmonic2),
    () => 1.2 + Math.sin(time * 0.6) * 0.3 + (a.fft[0] || 0) * 0.2
  )
  .add(
    osc(25, 0.1, 0.4)
      .rotate(() => time * 0.25 - harmonic1 * 0.7)
      .modulateRotate(osc(2, 0.4), 0.3)
  )
  .mult(
    osc(8, 0.3, 0.8)
      .rotate(() => -time * 0.1 + harmonic2)
  )
  .color(
    () => 0.9 + Math.sin(time * 0.4 + harmonic1) * 0.1,
    () => 0.5 + Math.cos(time * 0.3 + harmonic2) * 0.3,
    () => 0.7 + Math.sin(time * 0.5) * 0.2 + (a.fft[2] || 0) * 0.2
  )
  .contrast(1.1)
  .saturate(1.2)
  .out()

speed = 0.3
