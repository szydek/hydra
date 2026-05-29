// Bass-reactive grid pattern
// Creates a dynamic grid that responds to bass frequencies

bass = 0

update = ()=>{
  bass += a.fft[0]*0.01
}

fade = 1

shape(4, () => 0.03 + a.fft[0] * 0.05)
  .repeat(
    () => 12 + Math.sin(bass)*4,
    () => 12 + Math.sin(bass*0.7)*4
  )
  .rotate(() => time*0.03 + bass*0.03)
  .scrollX(() => Math.sin(time*0.2)*0.2)
  .scrollY(() => Math.cos(time*0.15)*0.2)
  .color(0.2,0.6,0.9)
  .brightness(() => -1 + fade - 0.6 + a.fft[0]*0.8 + a.fft[2]*0.4)
  .out()

speed=.3