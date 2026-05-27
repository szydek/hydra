// Video playback with audio-reactive pulsating effect
s0.initVideo("/videos/texture2.mp4")

// Initialize audio (will prompt for microphone access)
a.setSmooth(0.9)

// Initialize fade
fade = 1

update = () => {
  // Use bass for pulsating, fallback to sine wave if no audio
  let pulse = (a.fft && a.fft[0]) ? a.fft[0] * 0.5 : Math.sin(time * 2) * 0.5 + 0.5
  
  // Audio-reactive speed control
  s0.speed = 0.7 + pulse * 0.6
}

src(s0)
  .modulateScale(noise(2, 0.1), () => (a.fft && a.fft[0]) ? a.fft[0] * 0.03 : 0.02)
  .contrast(1.05 + ((a.fft && a.fft[0]) ? a.fft[0] * 0.2 : Math.sin(time * 2) * 0.1))
  .brightness(() => -1 + fade)
  .out()
