// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io

a.setSmooth(0.85)

osc(() => 4 + a.fft[0] * 12, 0.1, () => 0.8 + a.fft[2] * 2)
  .color(() => 1.04 + a.fft[0] * 2, () => a.fft[2] * 1.5, () => -1.1 + a.fft[4] * 2)
  .rotate(() => 0.30 + a.fft[1] * 0.5, () => 0.1 + a.fft[0] * 0.3)
  .pixelate(2, 20)
  .modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time) + a.fft[0] * 2)
  .out(o0)