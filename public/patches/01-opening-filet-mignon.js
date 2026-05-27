// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// filet mignon
// AFALFL
// instagram/a_f_alfl

fade = 1
a.setSmooth(0.8)

osc(50, -0.0009, 0.08)
	.diff(osc(20, 0.00008)
		.rotate(Math.PI / 0.00003))
	.modulateScale(noise(1.5, 0.18)
		.modulateScale(osc(13)
			.rotate(() => Math.sin(time / 40) + (a.fft[0] || 0) * 0.5)), 3)
	.color(() => 11 + (a.fft[0] || 0) * 5, 0.5, 0.4, 0.9, 0.261, 0.011, 5, 22, 0.5, -1)
	.contrast(1.4)
	.add(src(o0)
		.modulate(o0, .04), .6, .9)
	.invert()
	.brightness(0.0003, 2)
	.contrast(0.5, 2, 0.1, 2)
	.color(() => 4 + (a.fft[1] || 0) * 3, -2, 0.1)
	.modulateScale(osc(2), -0.2, 2, 1, 0.3)
	.posterize(200)
	.rotate(0.3, 0.1, 0.005, 0.0005)
	.color(() => 22 + (a.fft[2] || 0) * 4, -2, 0.5, 0.5, 0.0001, 0.1, 0.2, 8)
	.contrast(0.18, 0.3, 0.1, 0.2, 0.03, 1)
	.brightness(() => 0.0001 - 1 + fade + (a.fft[0] || 0) * 0.2)
	.out();
