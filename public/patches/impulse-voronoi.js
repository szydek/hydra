// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Audio-impulse triggered voronoi patterns
// Generates new patterns on beat impulses

bass = 0
fade = 1
lastBass = 0
impulse = 0

update = () => {
  lastBass = bass
  bass = a.fft[0] || 0
  
  // Detect impulse (sudden increase in bass)
  if (bass > lastBass + 0.1) {
    impulse = 1.0
  } else {
    impulse *= 0.95  // Decay impulse
  }
}

voronoi(2,0.3,0.2)
  .shift(() => 0.5 + impulse * 0.3)
  .modulatePixelate(voronoi(4,0.2), 32, 2)
  .scale(() => 1 + impulse * 0.2)
  .diff(voronoi(3).shift(() => 0.6 + impulse * 0.1))
  .diff(osc(2,0.15,1.1).rotate(() => impulse * 0.5))
  .brightness(() => 0.06 + impulse * 0.8 - 1 + fade)
  .contrast(1.2)
  .saturate(1.2)
  .out()

speed = 0.3
