export function fadeToBlack(duration, callback) {
  const overlay = document.getElementById('fade-overlay')
  if (!overlay) { callback(); return }

  overlay.style.transition = `opacity ${duration / 1000}s ease`
  overlay.style.opacity = '1'
  overlay.style.pointerEvents = 'auto'

  setTimeout(() => {
    callback()
    const el = document.getElementById('fade-overlay')
    if (!el) return
    el.style.transition = `opacity ${duration / 1000}s ease`
    el.style.opacity = '0'
    el.style.pointerEvents = 'none'
  }, duration)
}
