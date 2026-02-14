// Gestión simple de borradores en localStorage
(function(){ const KEY='cs-drafts-v1';
  window.StorageCS = {
    list(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]') }catch(e){return[]} },
    save(name, dataURL){
      const id = Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)
      const item = { id, name: name||('Dibujo '+new Date().toLocaleString()), dataURL, created: Date.now() }
      const arr = this.list()
      arr.unshift(item)
      localStorage.setItem(KEY, JSON.stringify(arr.slice(0,50)))
      return id
    },
    get(id){ return this.list().find(x=>x.id===id) || null },
    remove(id){ const arr = this.list().filter(x=>x.id!==id); localStorage.setItem(KEY, JSON.stringify(arr)) }
  }
})();