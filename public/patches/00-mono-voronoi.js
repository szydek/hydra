// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Monochrome Memoar - Audio Reactive Version
// by Rangga Purnama Aji
// https://ranggapurnamaaji1.wixsite.com/portfolio

fade = 1
a.setSmooth(0.9)

voronoi(50,1)
  .luma(0.5)
  .add(
    shape(1,1)
      .luma(1)
  )
  .modulate(
    osc(-1000,-1)
      .modulate(
        osc().luma()
      )
  )
  .blend(o0)
  .blend(o0)
  .blend(o0)
  .blend(o0)
  .colorama(() => 0.01 + a.fft[0] * 0.15 + a.fft[1] * 0.08)
  .saturate(() => 0.25 + a.fft[2] * 0.8)
  .brightness(() => -0.04 - a.fft[0] * 0.05)
  .out()

speed = 0.25
