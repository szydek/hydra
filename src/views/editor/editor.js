/* eslint-disable no-eval */

import CodeMirror from 'codemirror-minified/lib/codemirror'
import 'codemirror-minified/mode/javascript/javascript'
import 'codemirror-minified/addon/hint/javascript-hint'
import 'codemirror-minified/addon/hint/show-hint'
import 'codemirror-minified/addon/selection/mark-selection'
import 'codemirror-minified/addon/comment/comment'

import EventEmitter from 'nanobus'
import keymaps from './keymaps.js'
import Mutator from './randomizer/Mutator.js'
import beautify from 'js-beautify'

var isShowing = true


export default class Editor extends EventEmitter {
  constructor(parent) {
    super()
    console.log("*** Editor class created");
    var self = this

    // var container = document.createElement('div')
    // container.setAttribute('id', 'editor-container')
    // var el = document.createElement('TEXTAREA')
    // document.body.appendChild(container)
    // container.appendChild(el)

    this.mutator = new Mutator(this);
    
    this.patches = {}
    this.currentPatch = null
    this.initPatchLoader()
    setTimeout(() => this.setupAudioMeter(), 1000)

    const extraKeys = {}
    // const evalCode = (code) => {

    // }
    Object.entries(keymaps).forEach(([key, e]) => extraKeys[key] = () => {
      if(e == 'editor: eval block') {
        this.emit('repl: eval', this.getCurrentBlock().text)
      } else if (e == 'editor: eval line') {
        this.emit('repl: eval', this.getLine())
      // } else if (e == 'editor: eval all') {
      //   const code = this.cm.getValue()
      //   this.flashCode()
      //   this.emit('repl: eval', code)
      //   this.emit('gallery: save to URL', code)
      } else if (e == 'editor:toggleComment') {
        this.cm.toggleComment()
      // } else if (e == 'gallery:saveToURL') {
        this.emit(e, this)
      } else if (e === 'editor:formatCode') {
        this.formatCode()
      } else if (e == 'gallery:saveToURL') {
        this.emit('editor: save to URL', this.cm.getValue())
      } else {
        this.emit(e, this)
      }
    })

    const opts = {
      theme: 'tomorrow-night-eighties',
      value: 'hello',
      mode: { name: 'javascript', globalVars: true },
      lineWrapping: true,
      styleSelectedText: true,
      extraKeys: extraKeys
    }

    this.cm = CodeMirror.fromTextArea(parent, opts)
    window.cm = this.cm
    this.cm.refresh()

    // this.show()
    // // // TO DO: add show code param
    // let searchParams = new URLSearchParams(window.location.search)
    // let showCode = searchParams.get('show-code')

    // if (showCode === "false") {
    //   this.hide()
    // }
  }

  clear() {
    this.cm.setValue('\n \n // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter')
  }

  setValue(val) {
    this.cm.setValue(val)
  }

  getValue() {
    return this.cm.getValue()
  }

  formatCode() {
    const formatted = beautify(this.cm.getValue(), { indent_size: 2, "break_chained_methods": true, "indent_with_tabs": true})
    this.cm.setValue(formatted)
  }

  addCodeToTop(code = '') {
    const current = this.cm.getValue()
    const updated = `
${code}

${current}
`
    this.cm.setValue(updated)
  }

  // hide() {
  //   console.log('hiding')
  //   var l = document.getElementsByClassName('CodeMirror')[0]
  //   var m = document.getElementById('modal-header')
  //   l.style.opacity = 0
  //   m.style.opacity = 0
  //   this.isShowing = false
  // }

  // show() {
  //   var l = document.getElementsByClassName('CodeMirror')[0]
  //   var m = document.getElementById('modal-header')
  //   l.style.opacity= 1
  //   m.style.opacity = 1
  //   l.style.pointerEvents = 'all'
  //   this.isShowing = true
  // }

  toggle() {
    if (this.isShowing) {
      this.hide()
    } else {
      this.show()
    }
  }

  getLine() {
    var c = this.cm.getCursor()
    var s = this.cm.getLine(c.line)
    //  this.cm.markText({line: c.line, ch:0}, {line: c.line+1, ch:0}, {className: 'styled-background'})
    this.flashCode({ line: c.line, ch: 0 }, { line: c.line + 1, ch: 0 })
    return s
  }

  flashCode(start, end) {
    if (!start) start = { line: this.cm.firstLine(), ch: 0 }
    if (!end) end = { line: this.cm.lastLine() + 1, ch: 0 }
    var marker = this.cm.markText(start, end, { className: 'styled-background' })
    setTimeout(() => marker.clear(), 300)
  }


  getCurrentBlock() { // thanks to graham wakefield + gibber
    var editor = this.cm
    var pos = editor.getCursor()
    var startline = pos.line
    var endline = pos.line
    while (startline > 0 && editor.getLine(startline) !== '') {
      startline--
    }
    while (endline < editor.lineCount() && editor.getLine(endline) !== '') {
      endline++
    }
    var pos1 = {
      line: startline,
      ch: 0
    }
    var pos2 = {
      line: endline,
      ch: 0
    }
    var str = editor.getRange(pos1, pos2)

    this.flashCode(pos1, pos2)

    return {
      start: pos1,
      end: pos2,
      text: str
    }
  }

  initPatchLoader() {
    this.loadPatchList()
    
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        const patchNumber = parseInt(e.key)
        this.loadPatch(patchNumber)
      }
      
      const noModifiers = !e.ctrlKey && !e.metaKey && !e.altKey
      const editorFocused = this.cm && this.cm.hasFocus()

      if (noModifiers && !editorFocused && e.key === 'a') {
        e.preventDefault()
        console.log('a pressed, audioMeter:', this.audioMeter, 'display:', this.audioMeter && this.audioMeter.style.display)
        if (this.audioMeter) {
          this.audioMeter.style.display = this.audioMeter.style.display === 'none' ? 'block' : 'none'
        }
      }
      
      if (noModifiers && !editorFocused && e.key === 'c') {
        e.preventDefault()
        const editorContainer = document.getElementById('editor-container')
        if (editorContainer) {
          if (editorContainer.style.opacity === '0') {
            editorContainer.style.opacity = '1'
            editorContainer.style.pointerEvents = 'all'
          } else {
            editorContainer.style.opacity = '0'
            editorContainer.style.pointerEvents = 'none'
          }
        }
      }
    })
  }

  async loadPatchList() {
    const patchFiles = [
      { number: 0, file: '00-mono-voronoi.js' },
      { number: 1, file: '01-opening.js' },
      { number: 2, file: '02-geometric.js' },
      { number: 3, file: '03-macro.js' },
      { number: 4, file: '04-video.js' },
      { number: 5, file: '05-whitney-spirals.js' },
      { number: 6, file: '06-whitney-harmonic.js' },
      { number: 7, file: '07-whitney-lattice.js' },
      { number: 8, file: '08-whitney-dots.js' },
      { number: 9, file: '09-whitney-pendulum.js' }
    ]

    for (const patch of patchFiles) {
      try {
        const response = await fetch(`/patches/${patch.file}`)
        const code = await response.text()
        this.patches[patch.number] = { filename: patch.file, code: code }
      } catch (error) {
        console.error(`Failed to load patch ${patch.file}:`, error)
      }
    }
    
    console.log('Loaded patches:', Object.keys(this.patches))
    const params = new URLSearchParams(window.location.search)
    if (!params.has('sketch_id') && !params.has('code')) {
      this.loadPatch(1)
    }
  }

  evalCode(code) {
    try {
      hush()
      fade = 1
      new Function(code)()
    } catch(e) {
      console.error('Patch eval error:', e)
    }
  }

  loadPatch(patchNumber) {
    if (this.patches[patchNumber]) {
      const patch = this.patches[patchNumber]
      console.log(`Loading patch ${patchNumber}: ${patch.filename}`)
      this.setValue(patch.code)
      this.evalCode(patch.code)
      this.flashCode()
      this.currentPatch = patchNumber
    } else {
      console.log(`Patch ${patchNumber} not found`)
    }
  }

  setupAudioMeter() {
    const existingMeters = document.querySelectorAll('[data-audio-meter]')
    existingMeters.forEach(meter => meter.remove())
    
    this.audioMeter = document.createElement('div')
    this.audioMeter.setAttribute('data-audio-meter', 'true')
    this.audioMeter.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 200px;
      height: 60px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid rgba(0, 255, 0, 0.5);
      border-radius: 4px;
      padding: 8px;
      z-index: 99999;
      font-family: monospace;
      font-size: 10px;
      color: #0f0;
      pointer-events: none;
      user-select: none;
      display: none;
    `
    
    this.audioBars = []
    for (let i = 0; i < 8; i++) {
      const bar = document.createElement('div')
      bar.style.cssText = `
        display: inline-block;
        width: 20px;
        height: 40px;
        background: linear-gradient(to top, #0f0, #ff0, #f00);
        margin: 0 2px;
        vertical-align: bottom;
        transition: height 0.1s ease;
      `
      bar.style.height = '2px'
      this.audioMeter.appendChild(bar)
      this.audioBars.push(bar)
    }
    
    document.body.appendChild(this.audioMeter)
    setInterval(() => this.updateAudioMeter(), 100)
  }
  
  updateAudioMeter() {
    try {
      let fft = []
      let hasAudio = false
      
      if (window.a && window.a.fft) {
        fft = window.a.fft
        hasAudio = true
      }
      
      for (let i = 0; i < 8; i++) {
        let value = 0.02
        if (hasAudio && fft.length > i) {
          value = Math.max(0, Math.min(1, fft[i] * 3))
        }
        if (this.audioBars[i]) {
          this.audioBars[i].style.height = Math.max(2, value * 40) + 'px'
        }
      }
    } catch (e) {}
  }

}

