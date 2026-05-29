// WITNEY-ISH DOUBLE FAN LINES — Hydra refactor

// Cancel any previous rAF loop from a prior load of this patch
if (typeof fanGeneration === 'undefined') fanGeneration = 0
fanGeneration++
const myGeneration = fanGeneration

a.setBins(6)
a.setSmooth(0.88)

// ---------- canvas layer ----------
fanCanvas = document.createElement('canvas')
fanCanvas.width = 1280
fanCanvas.height = 720
fanCtx = fanCanvas.getContext('2d')

s0.init({ src: fanCanvas })

// ---------- helpers ----------
lerp = (a, b, t) => a + (b - a) * t
clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

lerpHue = (h0, h1, amt) => {
  let dh = ((h1 - h0 + 540) % 360) - 180
  return (h0 + dh * amt + 360) % 360
}

quantizedHue = (band) => {
  if (band < 0.33) return 220   // bass: blue
  if (band < 0.66) return 120   // mids: green
  return 20                     // highs: orange
}

// ---------- state ----------
p1 = Math.random() * Math.PI * 2
p2 = Math.random() * Math.PI * 2

hue1 = 210
hue2 = 20

levelSmoothed = 0
prevLevelSmoothed = 0
loudSmoothed = 0
speedMulSmoothed = 1

speedKick = 0
spreadKick = 0
lastHit = 0

a1s = { x: fanCanvas.width * 0.42, y: fanCanvas.height * 0.46 }
a2s = { x: fanCanvas.width * 0.58, y: fanCanvas.height * 0.54 }

lastTime = performance.now()

// ---------- tuning ----------
threshold = 0.045
rise = 0.006
cooldownMs = 260

levelSlew = 0.12
loudSlew = 0.09
speedMulSlew = 0.17
anchorSlew = 0.18

speedKickDecay = 0.965
spreadKickDecay = 0.972

N = 30
fadeAlpha = 0.055

// ---------- drawing ----------
drawFan = (anchor, dir, spread, len, hue, satScale) => {
  fanCtx.lineWidth = 1.05 + 0.55 * (0.5 + 0.5 * Math.sin(dir * 1.7))
  fanCtx.lineCap = "round"

  for (let i = 0; i < N; i++) {
    let u = (i / (N - 1)) * 2 - 1
    let ang = dir + u * spread

    let x2 = anchor.x + Math.cos(ang) * len
    let y2 = anchor.y + Math.sin(ang) * len

    let bri = 62 + 38 * (1 - Math.abs(u))
    let sat = (60 + 40 * (1 - Math.abs(u))) * satScale

    fanCtx.strokeStyle = `hsla(${hue}, ${sat}%, ${bri}%, 0.65)`
    fanCtx.beginPath()
    fanCtx.moveTo(anchor.x, anchor.y)
    fanCtx.lineTo(x2, y2)
    fanCtx.stroke()
  }
}

updateFans = () => {
  if (fanGeneration !== myGeneration) return
  let now = performance.now()
  let dt = clamp((now - lastTime) / 16.6667, 0.5, 1.8)
  lastTime = now

  // persistence fade
  fanCtx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`
  fanCtx.fillRect(0, 0, fanCanvas.width, fanCanvas.height)

  let bass = a.fft[0] || 0
  let mid = a.fft[2] || 0
  let high = a.fft[5] || 0

  let level = bass * 0.55 + mid * 0.30 + high * 0.15
  levelSmoothed = lerp(levelSmoothed, level, levelSlew)

  let maxBand = Math.max(bass, mid, high)
  let band01 = bass === maxBand ? 0.15 : mid === maxBand ? 0.5 : 0.9
  let hueTarget = quantizedHue(Math.pow(band01, 0.65))

  hue1 = lerpHue(hue1, hueTarget, 0.08)
  hue2 = lerpHue(hue2, (hueTarget + 140) % 360, 0.08)

  let hit =
    levelSmoothed > threshold &&
    levelSmoothed - prevLevelSmoothed > rise &&
    now - lastHit > cooldownMs

  if (hit) {
    lastHit = now
    speedKick = Math.min(1, speedKick + 0.45)
    spreadKick = Math.min(1, spreadKick + 0.45)
  }

  prevLevelSmoothed = levelSmoothed

  speedKick *= speedKickDecay
  spreadKick *= spreadKickDecay

  let loudRaw = clamp((levelSmoothed - threshold) / 0.14, 0, 1)
  loudSmoothed = lerp(loudSmoothed, loudRaw, loudSlew)

  let speedMulTarget = Math.min(0.01 + 3.0 * loudSmoothed + 2.0 * speedKick, 4.0)
  speedMulSmoothed = lerp(speedMulSmoothed, speedMulTarget, speedMulSlew)

  let dp1 = clamp(0.01 * speedMulSmoothed * dt, -0.08, 0.08)
  let dp2 = clamp(0.013 * speedMulSmoothed * dt, -0.08, 0.08)

  p1 = (p1 + dp1) % (Math.PI * 2)
  p2 = (p2 + dp2 + 0.0016 * Math.sin(p1 * 3) * dt) % (Math.PI * 2)

  let w = fanCanvas.width
  let h = fanCanvas.height

  let a1 = {
    x: w * 0.42 + 120 * Math.cos(p1) + 40 * Math.cos(p2 * 3),
    y: h * 0.46 + 90 * Math.sin(p1 * 1.3) - 30 * Math.sin(p2 * 2)
  }

  let a2 = {
    x: w * 0.58 + 120 * Math.cos(p2 * 1.1 + 0.8) - 35 * Math.cos(p1 * 2.7),
    y: h * 0.54 + 90 * Math.sin(p2 * 1.4 - 0.5) + 25 * Math.sin(p1 * 2.2)
  }

  a1s.x = lerp(a1s.x, a1.x, anchorSlew)
  a1s.y = lerp(a1s.y, a1.y, anchorSlew)
  a2s.x = lerp(a2s.x, a2.x, anchorSlew)
  a2s.y = lerp(a2s.y, a2.y, anchorSlew)

  let len1 = 340 * (0.78 + 0.38 * Math.sin(p1 * 0.9 + 0.2))
  let len2 = 360 * (0.78 + 0.38 * Math.sin(p2 * 1.1 - 0.4))

  let spread1 = (Math.PI / 180) * 70 * (0.72 + 0.55 * spreadKick + 0.18 * loudSmoothed)
  let spread2 = (Math.PI / 180) * 78 * (0.72 + 0.55 * spreadKick + 0.18 * loudSmoothed)

  let dir1 = p1 + 0.65 * Math.sin(p2 * 2)
  let dir2 = p2 - 0.65 * Math.sin(p1 * 2)

  drawFan(a1s, dir1, spread1, len1, hue1, 0.92)
  drawFan(a2s, dir2, spread2, len2, hue2, 0.78)

  fanCtx.strokeStyle = "rgba(255,255,255,0.18)"
  fanCtx.lineWidth = 1
  fanCtx.beginPath()
  fanCtx.moveTo(a1s.x, a1s.y)
  fanCtx.lineTo(a2s.x, a2s.y)
  fanCtx.stroke()

  requestAnimationFrame(updateFans)
}

updateFans()

// ---------- Hydra output ----------
src(s0)
  .contrast(1.05)
  .brightness(-0.03)
  .modulateScale(osc(3, 0.02, 0), () => 0.01 + a.fft[0] * 0.03)
  .out(o0)
  