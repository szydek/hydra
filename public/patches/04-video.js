fade = 1

lastBass = 0
impulse = 0
step = 0

shiftHold = 0.5
scaleHold = 1
rotateHold = 0
dimensionHold = 1

update = () => {
  let bass = a.fft[0] || 0

  if (bass > lastBass + 0.015 && bass > 0.04) {
    impulse = 1
    step += 1

shiftHold += 0.013 + Math.random() * 0.01
scaleHold = 1 + Math.sin(step * 0.37) * 0.18
rotateHold += 0.17 + Math.random() * 0.06
dimensionHold = 3 + Math.sin(step * 0.21) * 3 + Math.random() * 2
  } else {
    impulse *= 0.85
  }

  lastBass = bass
}

voronoi(2,0.3,0.2)
  .shift(() => shiftHold)
  .modulatePixelate(voronoi(4,0.2), 32, 2)
  .scale(() => scaleHold)
  .diff(voronoi(3).shift(() => 0.6 + impulse * 0.04))
  .diff(osc(2,0,1.1).rotate(() => rotateHold + impulse * 0.08))
  .blend(
    voronoi(() => dimensionHold, 0.2, 0.1)
      .rotate(() => rotateHold)
      .scale(() => scaleHold)
      .brightness(-0.35),
    0.35
  )
  .mult(
    osc(1,0)
      .rotate(() => -rotateHold * 0.5)
      .brightness(-0.15)
  )
  .brightness(() => -0.18 + impulse * 0.12)
  .contrast(1.08)
  .saturate(1.05)
  .out()

speed = 0
