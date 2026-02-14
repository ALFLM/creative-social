// simple gallery of local drafts using StorageCS
document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('grid')
  const empty = document.getElementById('empty')

  function render(){
    const arr = StorageCS.list()
    grid.innerHTML = ''
    if(!arr || arr.length===0){
      empty.textContent = 'No hay creaciones guardadas localmente.'
      return
    } else empty.textContent = ''

    arr.forEach(item=>{
      const card = document.createElement('div'); card.className='card'
      const img = document.createElement('img'); img.className='thumb'; img.src = item.dataURL
      const title = document.createElement('div'); title.style.fontSize='13px'; title.style.color='#222'; title.textContent = item.name
      const meta = document.createElement('div'); meta.className='row'
      const left = document.createElement('div'); left.style.fontSize='12px'; left.style.color='#666'; left.textContent = new Date(item.created).toLocaleString()
      const right = document.createElement('div')

      const btnEdit = document.createElement('button'); btnEdit.textContent='Editar'
      btnEdit.addEventListener('click', ()=>{
        localStorage.setItem('cs-load-id', item.id)
        window.location.href = '/editor.html'
      })

      const btnDL = document.createElement('button'); btnDL.textContent='Descargar'
      btnDL.addEventListener('click', ()=>{
        const a = document.createElement('a'); a.href = item.dataURL; a.download = (item.name||'creative')+'.png'; a.click()
      })

      const btnDel = document.createElement('button'); btnDel.textContent='Eliminar'
      btnDel.addEventListener('click', ()=>{
        if(!confirm('Eliminar este borrador?')) return
        StorageCS.remove(item.id)
        render()
      })

      // placeholder publish button
      const btnPub = document.createElement('button'); btnPub.textContent='Publicar'
      btnPub.addEventListener('click', ()=>{
        alert('Función publicar pendiente de integrar con Supabase. Más adelante puedo automatizar esto.')
      })

      right.appendChild(btnEdit)
      right.appendChild(btnDL)
      right.appendChild(btnPub)
      right.appendChild(btnDel)

      card.appendChild(img)
      card.appendChild(title)
      card.appendChild(meta)
      meta.appendChild(left)
      meta.appendChild(right)
      grid.appendChild(card)
    })
  }

  render()
})