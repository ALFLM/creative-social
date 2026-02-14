document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d', { alpha:true })
  const colorEl = document.getElementById('color')
  const sizeEl = document.getElementById('size')
  const toolEl = document.getElementById('tool')
  const undoBtn = document.getElementById('undo')
  const clearBtn = document.getElementById('clear')
  const exportBtn = document.getElementById('export')
  const saveDraftBtn = document.getElementById('saveDraft')
  const saveDownloadBtn = document.getElementById('saveDownload')
  const draftsSel = document.getElementById('drafts')
  const loadDraftBtn = document.getElementById('loadDraft')
  const deleteDraftBtn = document.getElementById('deleteDraft')
  const draftName = document.getElementById('draftName')

  let drawing=false, lastX=0, lastY=0, undoStack=[]
  const MAX_UNDO=20

  function fitCanvas(){
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    // keep current content
    const img = new Image()
    img.src = canvas.toDataURL()
    canvas.width = Math.max(1, Math.floor(rect.width * ratio))
    canvas.height = Math.max(1, Math.floor((rect.height) * ratio))
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.scale(ratio, ratio)
    img.onload = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
      ctx.drawImage(img, 0, 0, rect.width, rect.height)
    }
  }

  function pushUndo(){
    try{
      undoStack.push(canvas.toDataURL())
      if(undoStack.length>MAX_UNDO) undoStack.shift()
    }catch(e){}
  }

  function setStyle(){
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = parseInt(sizeEl.value,10)
    ctx.strokeStyle = colorEl.value
  }

  function start(x,y){
    drawing=true
    lastX=x; lastY=y
    pushUndo()
    ctx.beginPath()
    ctx.moveTo(x,y)
  }

  function drawLine(x,y){
    if(!drawing) return
    if(toolEl.value === 'eraser'){
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    }else{
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = colorEl.value
    }
    ctx.lineWidth = parseInt(sizeEl.value,10)
    ctx.lineTo(x,y)
    ctx.stroke()
    lastX = x; lastY = y
  }

  function stop(){
    if(drawing){ ctx.closePath(); drawing=false }
  }

  function getPos(e){
    const rect = canvas.getBoundingClientRect()
    if(e.touches && e.touches[0]) e = e.touches[0]
    return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) }
  }

  // Mouse
  canvas.addEventListener('mousedown', (e)=>{ setStyle(); const p=getPos(e); start(p.x,p.y) })
  window.addEventListener('mousemove', (e)=>{ if(!drawing) return; const p=getPos(e); drawLine(p.x,p.y) })
  window.addEventListener('mouseup', ()=>stop())

  // Touch
  canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); setStyle(); const p=getPos(e); start(p.x,p.y) }, {passive:false})
  canvas.addEventListener('touchmove', (e)=>{ e.preventDefault(); const p=getPos(e); drawLine(p.x,p.y) }, {passive:false})
  canvas.addEventListener('touchend', ()=>stop())

  // Buttons
  undoBtn.addEventListener('click', ()=>{
    const last = undoStack.pop()
    if(!last) return
    const img = new Image()
    img.onload = ()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(img,0,0,canvas.width/canvas.style.width.replace('px','')*parseFloat(getComputedStyle(canvas).width),canvas.height) }
    img.src = last
    // Note: drawing scaled image in older browsers may be off; acceptable for MVP
  })

  clearBtn.addEventListener('click', ()=>{
    pushUndo()
    ctx.clearRect(0,0,canvas.width,canvas.height)
  })

  exportBtn.addEventListener('click', ()=>{
    const link = document.createElement('a')
    link.download = (draftName.value||'creative') + '.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  })

  function refreshDrafts(){
    const arr = StorageCS.list()
    draftsSel.innerHTML = ''
    arr.forEach(d=>{
      const opt = document.createElement('option')
      opt.value = d.id
      opt.textContent = `${d.name} — ${new Date(d.created).toLocaleString()}`
      draftsSel.appendChild(opt)
    })
    if(arr.length===0){
      const opt = document.createElement('option'); opt.textContent='(sin borradores)'; opt.disabled=true; draftsSel.appendChild(opt)
    }
  }

  saveDraftBtn.addEventListener('click', ()=>{
    const id = StorageCS.save(draftName.value, canvas.toDataURL())
    draftName.value = ''
    refreshDrafts()
    alert('Borrador guardado')
  })

  saveDownloadBtn.addEventListener('click', ()=>{
    StorageCS.save(draftName.value, canvas.toDataURL())
    exportBtn.click()
    draftName.value = ''
    refreshDrafts()
  })

  loadDraftBtn.addEventListener('click', ()=>{
    const id = draftsSel.value
    if(!id) return
    const item = StorageCS.get(id)
    if(!item) return alert('No encontrado')
    const img = new Image()
    img.onload = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
      // Draw while keeping aspect to fit canvas
      ctx.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio||1), canvas.height / (window.devicePixelRatio||1))
    }
    img.src = item.dataURL
  })

  deleteDraftBtn.addEventListener('click', ()=>{
    const id = draftsSel.value
    if(!id) return
    StorageCS.remove(id)
    refreshDrafts()
  })

  // init
  function init(){
    fitCanvas()
    ctx.fillStyle = '#fff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    refreshDrafts()
  }

  window.addEventListener('resize', ()=>{ // preserve content by re-drawing snapshot
    const data = canvas.toDataURL()
    fitCanvas()
    const img = new Image()
    img.onload = ()=>{ ctx.drawImage(img,0,0,canvas.width/(window.devicePixelRatio||1),canvas.height/(window.devicePixelRatio||1)) }
    img.src = data
  })

  init()
})