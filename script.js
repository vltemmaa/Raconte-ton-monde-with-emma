// menu toggle for small screens
document.addEventListener('click', function(e){
  if(!e.target.closest) return;
});
const toggle = document.querySelectorAll('.menu-toggle');
toggle.forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const nav = document.querySelector('.main-nav');
    if(nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
});

// set active menu visual based on current file (simple)
(function setActive(){
  const page = document.body.dataset.page || '';
  const links = document.querySelectorAll('.main-nav .nav-item');
  links.forEach(a=>{
    if(a.getAttribute('href') && a.getAttribute('href').includes(page)) {
      a.classList.add('active-link');
    } else {
      a.classList.remove('active-link');
    }
  });
})();

// --- Groupe: simple client-side chat per continent (no backend, stored in memory) ---
(function chatModule(){
  const chatBox = document.getElementById('chatBox');
  const form = document.getElementById('chatForm');
  const nameInput = document.getElementById('chatName');
  const msgInput = document.getElementById('chatMsg');
  const currentCont = document.getElementById('current-continent');
  const continentBtns = document.querySelectorAll('.continent-btn');

  if(!chatBox || !form) return;

  // simple in-memory store: { continentName: [messages] }
  const store = { 'Global': [] };
  let active = 'Global';

  // seed example message
  store['Europe'] = [{name:'Ana', text:'Salut ! Quels conseils pour l\'Espagne ?', time: new Date().toLocaleTimeString()}];
  store['Afrique'] = [{name:'Sam', text:'Des idées pour visiter le Maroc ?', time: new Date().toLocaleTimeString()}];

  function render(){
    chatBox.innerHTML = '';
    const list = store[active] || [];
    list.forEach(m=>{
      const el = document.createElement('div');
      el.className = 'chat-msg';
      el.innerHTML = `<div class="meta">${m.name} • ${m.time}</div><div class="text">${escapeHtml(m.text)}</div>`;
      chatBox.appendChild(el);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]; });
  }

  // change continent when clicking buttons
  continentBtns.forEach(b=>{
    b.addEventListener('click', ()=>{
      const name = b.dataset.cont;
      if(!store[name]) store[name] = [];
      active = name;
      if(currentCont) currentCont.textContent = active;
      render();
    });
  });

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const name = (nameInput.value || 'Anonyme').trim();
    const text = (msgInput.value || '').trim();
    if(!text) return;
    const msg = { name, text, time: new Date().toLocaleTimeString() };
    store[active].push(msg);
    msgInput.value = '';
    render();
  });

  // initial render
  if(currentCont) currentCont.textContent = active;
  render();
})();

// little helper: disable links with class .disabled
document.querySelectorAll('a.disabled').forEach(a=>{ a.addEventListener('click', (e)=> e.preventDefault()); });
