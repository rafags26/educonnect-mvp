const seed = [
  {id:1,titulo:"Lógica de Programação",mentor:"Ana",inicio:"2025-09-30 18:00",fim:"19:00",vagas:10},
  {id:2,titulo:"HTML & CSS do Zero",mentor:"Bruno",inicio:"2025-10-01 19:00",fim:"20:30",vagas:5},
  {id:3,titulo:"JS para Iniciantes",mentor:"Carla",inicio:"2025-10-02 20:00",fim:"21:00",vagas:2}
];

const key = 'educonnect_mentorias_v1';
const inscritosKey = 'educonnect_inscricoes_v1';

function load(){
  if(!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
  if(!localStorage.getItem(inscritosKey)) localStorage.setItem(inscritosKey, JSON.stringify([]));
  return JSON.parse(localStorage.getItem(key));
}

function save(list){ localStorage.setItem(key, JSON.stringify(list)); }
function getInscricoes(){ return JSON.parse(localStorage.getItem(inscritosKey)); }
function saveInscricoes(arr){ localStorage.setItem(inscritosKey, JSON.stringify(arr)); }

function render(list){
  const $lista = document.querySelector('#lista');
  $lista.innerHTML = '';
  list.forEach(m => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <h3>${m.titulo}</h3>
      <div class="meta">Mentor: ${m.mentor} • ${m.inicio}–${m.fim}</div>
      <div class="meta">Vagas: <b>${m.vagas}</b></div>
      <button class="btn" data-id="${m.id}">Agendar</button>
    `;
    $lista.appendChild(el);
  });
}

function agendar(id){
  const list = load();
  const idx = list.findIndex(x => x.id === id);
  if(idx < 0) return alert('Mentoria não encontrada');
  if(list[idx].vagas <= 0) return alert('Sem vagas disponíveis');
  const me = 'aluna@teste.com';
  const inscricoes = getInscricoes();
  if(inscricoes.some(i => i.mentoria_id === id && i.email === me)){
    return alert('Você já está inscrita nesta mentoria');
  }
  list[idx].vagas -= 1;
  save(list);
  inscricoes.push({mentoria_id:id,email:me,data:new Date().toISOString()});
  saveInscricoes(inscricoes);
  render(list);
  alert('Inscrição confirmada!');
}

function main(){
  const data = load();
  render(data);
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-id]');
    if(btn){ agendar(Number(btn.dataset.id)); }
  });
  document.querySelector('#filtrar').addEventListener('click', ()=>{
    const q = document.querySelector('#q').value.toLowerCase().trim();
    const base = load();
    const filtered = !q ? base : base.filter(m =>
      m.titulo.toLowerCase().includes(q) || m.mentor.toLowerCase().includes(q)
    );
    render(filtered);
  });
}

main();