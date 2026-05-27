// John Whitney Style Audio-Reactive Dot Matrix
// Mathematical dot patterns with rhythmic motion

a.setSmooth(0.8)

dotPhase = 0

update = () => {
  dotPhase += (a.fft[0] || 0) * 0.03
}

shape(2, 0.05)
  .repeat(16, 12)
  .rotate(() => time * 0.04 + dotPhase)
  .modulateScale(
    osc(5, 0.2)
      .rotate(() => -time * 0.08 + dotPhase * 0.5),
    () => 1.8 + Math.sin(time * 0.6 + dotPhase) * 0.4 + (a.fft[0] || 0) * 0.3
  )
  .scrollX(() => Math.sin(time * 0.3 + dotPhase) * 0.1)
  .scrollY(() => Math.cos(time * 0.4 + dotPhase * 0.7) * 0.1)
  .add(
    shape(2, 0.03)
      .repeat(20, 15)
      .rotate(() => -time * 0.03 - dotPhase * 0.3)
      .color(0.9, 0.6, 0.3)
  )
  .color(
    () => 0.8 + Math.sin(time * 0.5 + dotPhase) * 0.2 + (a.fft[1] || 0) * 0.2,
    () => 0.4 + Math.cos(time * 0.3) * 0.3,
    () => 0.7 + Math.sin(time * 0.4 + dotPhase * 0.5) * 0.2 + (a.fft[2] || 0) * 0.1
  )
  .contrast(1.4)
  .saturate(1.2)
  .out()

speed = 0.45
