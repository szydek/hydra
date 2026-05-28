// John Whitney Style Audio-Reactive Lattice Patterns
// Geometric lattice structures with mathematical precision

a.setSmooth(0.8)

latticePhase = 0

update = () => {
  latticePhase += (a.fft[0] || 0) * 0.025
}

shape(4, 0.1)
  .repeat(12, 8)
  .rotate(() => time * 0.05 + latticePhase * 0.5)
  .modulateRotate(
    osc(6, 0.2)
      .rotate(() => -time * 0.1 + latticePhase),
    () => 0.3 + (a.fft[0] || 0) * 0.2
  )
  .modulateScale(
    osc(4, 0.15)
      .rotate(() => time * 0.08),
    () => 1.5 + Math.sin(time * 0.4 + latticePhase) * 0.5 + (a.fft[1] || 0) * 0.3
  )
  .add(
    shape(3, 0.08)
      .repeat(8, 6)
      .rotate(() => -time * 0.06 - latticePhase * 0.3)
      .color(0.8, 0.4, 0.9)
  )
  .color(
    () => 0.6 + Math.sin(time * 0.3 + latticePhase) * 0.3 + (a.fft[0] || 0) * 0.2,
    () => 0.3 + Math.cos(time * 0.5) * 0.2,
    () => 0.8 + Math.sin(time * 0.2) * 0.1 + (a.fft[2] || 0) * 0.2
  )
  .contrast(1.3)
  .saturate(1.1)
  .out()

speed = 0.35
