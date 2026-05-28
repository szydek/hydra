// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//CNDSD
//http://malitzincortes.net/
//crazy squares

fade = 1
a.setSmooth(0.8)

// Seed the feedback buffer so it starts visible
shape(4, 0.3).out(o0)

shape(4, () => 0.15 + a.fft[2] * 0.3, 1)
  .mult(osc(1, 1).modulate(osc(5).rotate(() => 1.4 + a.fft[0] * 2, () => 0.5 + a.fft[1]), 3))
  .color(() => 1 + a.fft[0] * 3, () => 2 + a.fft[2] * 2, () => 4 + a.fft[4] * 2)
  .saturate(() => 0.2 + a.fft[1] * 2)
  .luma(() => 1.0 - a.fft[0] * 0.3, 0.05)
  .scale(() => 0.6 + a.fft[0] * 0.5)
  .diff(o0)
  .out(o0)
