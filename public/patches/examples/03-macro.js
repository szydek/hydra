3// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// ee_2 . MULTIVERSE . time and feedback with video texture
// e_e // @eerie_ear

s0.initVideo("/videos/texture2.mp4")

fade = 1

a.setBins(4)
a.setSmooth(0.85)
a.setCutoff(0.06)

orbRot = 0
orbPush = 0

pat = () =>
  solid()
    .layer(
      solid().diff(
        osc((time / 16) * 1, (time / 1000) * 0.2)
          .rotate(() => orbRot)
          .mult(
            osc((time / 8) * 1, (time / 1006) * 0.2)
              .rotate(() => 1.57 + orbRot * 0.7)
          )
          .modulate(shape(106, 1, 0.05).rotate(() => orbRot * 0.35))
          .mult(shape(106, 1, 0.05).rotate(() => -orbRot * 0.25))
      )
    )
    .modulateScale(
      osc(2, 0.125).rotate(() => orbRot * 0.2),
      () => 0.125 + orbPush * 0.08
    )

solid()
  .layer(
    solid(1, 1, 1)
      .mult(
        pat().diff(
          src(o0)
            .scale(0.2)
            .mult(solid(), [0.7, 0.6, 0.4, 0.6])
            .kaleid(1.01)
            .saturate(0.3)
        )
      )
      .layer(
        solid(1, 1, 1)
          .mask(
            noise(2, 0.05)
              .invert()
              .posterize(8, 4)
              .luma(0.25)
              .thresh(0.5)
              .modulateRotate(
                osc(1, 0.5),
                () => 0.08 + orbPush * 0.35
              )
              .rotate(() => orbRot * 0.15)
          )
          .mult(
            gradient(0.5)
              .kaleid(1)
              .mult(
                src(s0)
                  .saturate(() => 1.1 + (a.fft[0] || 0) * 2)
              )
              .contrast(1.6)
              .mult(solid(), 0.45)
          )
      )
  )
  .brightness(() => -1 + fade + (a.fft[0] || 0) * 0.1)
  .out()

speed = 0.5

update = () => {
  let bass = a.fft[0] || 0
  let mids = a.fft[1] || 0

  orbPush = bass * 0.8 + mids * 0.4

  // audio gently “turns” the orbs
  orbRot += 0.001 + orbPush * 0.02

  // audio-reactive video speed
  s0.speed = 0.7 + bass * 0.6
}
