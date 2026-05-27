// WHITNEY-ISH DOUBLE FAN LINES (ambient-tuned, quantized color)
// Simplified Hydra version with ambient-friendly audio detection

// Audio analysis variables
bass = 0
mid = 0
high = 0
levelSmoothed = 0
prevLevelSmoothed = 0

// Ambient hit detection (tuned for ambient)
threshold = 0.028
rise = 0.004
cooldownMs = 260
lastHitMs = 0
levelSlew = 0.12

// Phases (two oscillators)
p1 = 0
p2 = 0

// Base speeds (will be modulated)
s1 = 0.0085
s2 = 0.0112

// Hit "kicks" (longer gestures for ambient)
speedKick = 0
spreadKick = 0

// Kick decays (slower = more "instrument")
speedKickDecay = 0.965
spreadKickDecay = 0.972

update = () => {
  // Audio analysis
  bass = a.fft[0] || 0
  mid = (a.fft[1] + a.fft[2] + a.fft[3]) / 3 || 0
  high = (a.fft[4] + a.fft[5] + a.fft[6]) / 3 || 0
  level = (bass + mid + high) / 3
  
  // Smooth amplitude for ambient stability
  levelSmoothed = levelSmoothed * (1 - levelSlew) + level * levelSlew
  
  // Ambient hit detection (onset-ish)
  let hit = (levelSmoothed > threshold) &&
            ((levelSmoothed - prevLevelSmoothed) > rise) &&
            ((Date.now() - lastHitMs) > cooldownMs)
  
  if (hit) {
    lastHitMs = Date.now()
    // Gentle but longer-lasting impulses
    speedKick = 1.0
    spreadKick = 1.0
  }
  prevLevelSmoothed = levelSmoothed
  
  // Decay kicks
  speedKick *= speedKickDecay
  spreadKick *= spreadKickDecay
  
  // Update phases with coupled evolution
  let loud = Math.min(Math.max((levelSmoothed - threshold) / 0.14, 0), 1)
  let speedMul = 1.0 + 0.9 * loud + 1.6 * speedKick
  
  p1 = (p1 + s1 * speedMul) % (Math.PI * 2)
  p2 = (p2 + s2 * speedMul + 0.0016 * Math.sin(p1 * 3.0)) % (Math.PI * 2)
}

// Quantized color function (3 bands: bass/mid/high)
quantizedHue = () => {
  if (bass > mid && bass > high) return 0.61  // blue
  else if (mid > bass && mid > high) return 0.33 // green
  else return 0.06  // orange
}

// Create fan pattern using voronoi
fan1 = voronoi(15, 0.8, 0.1)
  .rotate(() => p1)
  .scale(() => 0.5 + 0.3 * Math.sin(p1 * 0.9 + 0.2))
  .modulateRotate(osc(3, 0.1), () => 0.72 + 0.55 * spreadKick + 0.18 * levelSmoothed)
  .color(() => quantizedHue(), 0.8, 0.9)
  .brightness(() => 0.3 + 0.4 * levelSmoothed + 0.3 * speedKick)
  .scrollX(0.42)
  .scrollY(0.46)

fan2 = voronoi(15, 0.8, 0.1)
  .rotate(() => p2 + 0.39)
  .scale(() => 0.5 + 0.3 * Math.sin(p2 * 0.9 + 0.2))
  .modulateRotate(osc(3, 0.1), () => 0.72 + 0.55 * spreadKick + 0.18 * levelSmoothed)
  .color(() => (quantizedHue() + 0.39) % 1, 0.8, 0.9)
  .brightness(() => 0.3 + 0.4 * levelSmoothed + 0.3 * speedKick)
  .scrollX(0.58)
  .scrollY(0.54)

// Combine fans with subtle connection
fan1
  .add(fan2)
  .add(
    shape(2, 0.1)
      .rotate(() => p1 - p2)
      .scrollX(() => 0.5 + 0.08 * Math.cos(p1))
      .scrollY(() => 0.5 + 0.08 * Math.sin(p2))
      .color(0, 0, 1)
      .brightness(0.18)
  )
  .contrast(1.1)
  .saturate(0.9)
  .out()

speed = 0
