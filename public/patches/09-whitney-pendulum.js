// John Whitney Style Audio-Reactive Pendulum Motion
// Swinging pendulum patterns with mathematical rhythms

a.setSmooth(0.8)

pendulum1 = 0
pendulum2 = 0

update = () => {
  pendulum1 += (a.fft[0] || 0) * 0.02
  pendulum2 += (a.fft[1] || 0) * 0.015
}

osc(12, 0.3, 0.7)
  .modulateRotate(
    osc(3, 0.4)
      .rotate(() => Math.sin(time * 0.3 + pendulum1) * 0.5)
  )
  .modulateScale(
    osc(2, 0.25)
      .rotate(() => Math.cos(time * 0.4 + pendulum2) * 0.3),
    () => 1.3 + Math.sin(time * 0.5 + pendulum1) * 0.4 + (a.fft[0] || 0) * 0.2
  )
  .scrollX(() => Math.sin(time * 0.2 + pendulum1) * 0.15)
  .scrollY(() => Math.cos(time * 0.3 + pendulum2) * 0.15)
  .add(
    osc(18, 0.15, 0.5)
      .rotate(() => -Math.sin(time * 0.25 + pendulum2) * 0.4)
      .modulateRotate(osc(4, 0.3), 0.2)
  )
  .mult(
    osc(6, 0.2, 0.9)
      .rotate(() => Math.sin(time * 0.6 + pendulum1 + pendulum2) * 0.2)
  )
  .color(
    () => 0.7 + Math.sin(time * 0.4 + pendulum1) * 0.2 + (a.fft[0] || 0) * 0.2,
    () => 0.5 + Math.cos(time * 0.3 + pendulum2) * 0.3 + (a.fft[1] || 0) * 0.1,
    () => 0.9 + Math.sin(time * 0.5) * 0.1 + (a.fft[2] || 0) * 0.2
  )
  .contrast(1.2)
  .saturate(1.3)
  .out()

speed = 0.25
