// Hydra Native Fade System
// Add this to your main patch or load it first

// Initialize fade variables
let fade = 1
let isTransitioning = false

// Create fade mixer
src(o0)
  .mult(solid(() => fade, () => fade, () => fade))
  .out(o1)

// Set final output
src(o1).out()

// Fade function
function fadeTo(target, ms = 700) {
  return new Promise(resolve => {
    const start = fade
    const startTime = performance.now()

    function step(now) {
      const t = Math.min((now - startTime) / ms, 1)
      fade = start + (target - start) * t

      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }

    requestAnimationFrame(step)
  })
}

// Patch loading function
async function loadPatch(file) {
  if (isTransitioning) return
  isTransitioning = true
  
  try {
    await fadeTo(0, 600)
    
    const response = await fetch(file)
    const code = await response.text()
    
    // Clear previous outputs
    solid().out(o0)
    
    // Execute new patch
    new Function(code)()
    
    console.log("Loaded:", file)
    
    await fadeTo(1, 900)
  } catch(err) {
    console.error("Patch load error:", err)
    fade = 1 // Ensure we don't get stuck in black
  } finally {
    isTransitioning = false
  }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.repeat) return
  
  if (e.key==="1") loadPatch("patches/01-opening.js")
  if (e.key==="2") loadPatch("patches/02-geometric.js")
  if (e.key==="3") loadPatch("patches/03-macro.js")
  if (e.key==="4") loadPatch("patches/04-video.js")
  if (e.key==="5") loadPatch("patches/05-ending.js")
})

// Load initial patch
loadPatch("patches/01-opening.js")
