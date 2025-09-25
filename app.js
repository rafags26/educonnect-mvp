/* ------------------ util + storage ------------------ */
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const store = {
  get: (k, fallback) => JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k)
};
const KEYS = {
  users: 'ec_users',
  current: 'ec_currentUser',
  mentorias: 'ec_mentorias',
  enrolls: 'ec_enrolls',
  groups: 'ec_groups',
  materials: 'ec_materials'
};

/* ------------------ seed inicial ------------------ */
(function seed(){
  if(!store.get(KEYS.mentorias, null)){
    store.set(KEYS.mentorias, [
      {id:1,titulo:'HTML e CSS do zero', mentor:'Ana Costa', data:'28/09 10h', vagas:4},
      {id:2,titulo:'Introdução ao JavaScript', mentor:'João Silva', data:'29/09 19h', vagas:3},
      {id:3,titulo:'Produtividade com SCRUM', mentor:'Maria Lima', data:'30/09 16h', vagas:2},
      {id:4,titulo:'Como crescer na Internet', mentor:'Rafa Gomes', data:'27/09 14h', vagas:5}
    ]);
  }
  if(!store.get(KEYS.groups, null)){
    store.set(KEYS.groups, [
      {id:1, nome:'Front-end Iniciante', membros:[]},
      {id:2, nome:'JS Avançado', membros:[]}
    ]);
  }
  if(!store.get(KEYS.materials, null)){
    store.set(KEYS.materials, [
      {id:1, titulo:'Guia HTML5', link:'https://developer.mozilla.org/pt-BR/docs/Web/HTML', tags:['html']},
      {id:2, titulo:'CSS Tricks', link:'https://css-tricks.com/', tags:['css','ui']}
    ]);
  }
  if(!store.get(KEYS.users, null)){ store.set(KEYS.users, []); }
  if(!store.get(KEYS.enrolls, null)){ store.set(KEYS.enrolls, []); }
})();

/* ------------------ estado ------------------ */
const state = {
  get user(){ return store.get(KEYS.current, null); },
  set user(u){ u?store.set(KEYS.current, u):store.del(KEYS.current); }
};

/* ------------------ navegação por abas ------------------ */
$$('.tablink').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    $$('.tablink').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    $$('.tab').forEach(t=>t.classList.remove('visible'));
    $('#'+a.dataset.tab).classList.add('visible');
  });
});

/* ------------------ auth (login/cadastro) ------------------ */
const whoami = $('#whoami');
const btnAuth = $('#btnAuth');
const dlgAuth = $('#dlgAuth');
$('#authConfirmar').addEventListener('click', (e)=>{
  e.preventDefault();
  const nome = $('#authNome').value.trim();
  const email = $('#authEmail').value.trim().toLowerCase();
  const tipo = $('#authTipo').value;
  if(!email){ alert('Informe um e-mail.'); return; }
  const users = store.get(KEYS.users, []);
  let u = users.find(x=>x.email===email);
  if(!u){
    // novo cadastro
    u = {id:Date.now(), nome: nome||email.split('@')[0], email, tipo};
    users.push(u); store.set(KEYS.users, users);
  }else{
    // atualiza nome/tipo se vierem
    if(nome) u.nome = nome;
    u.tipo = tipo || u.tipo;
    store.set(KEYS.users, users);
  }
  state.user = u;
  renderAuth();
  dlgAuth.close();
});

btnAuth.addEventListener('click', ()=>{
  if(state.user){ // já logado -> abrir perfil
    $('.tablink[data-tab="tab-perfil"]').click();
  }else{
    $('#authNome').value = '';
    $('#authEmail').value = '';
    $('#authTipo').value = 'aluno';
    dlgAuth.showModal();
  }
});

function renderAuth(){
  if(state.user){
    whoami.textContent = `Olá, ${state.user.nome} (${state.user.tipo})`;
    btnAuth.textContent = 'Perfil';
    // preencher formulário de perfil
    $('#perfilNome').value = state.user.nome || '';
    $('#perfilEmail').value = state.user.email || '';
    $('#perfilTipo').value = state.user.tipo || 'aluno';
  }else{
    whoami.textContent = 'Você não está autenticado';
    btnAuth.textContent = 'Entrar';
  }
}
renderAuth();

/* Perfil: salvar e sair */
$('#btnSalvarPerfil').addEventListener('click', ()=>{
  const nome = $('#perfilNome').value.trim();
  const email = $('#perfilEmail').value.trim().toLowerCase();
  const tipo = $('#perfilTipo').value;
  if(!email){ alert('Informe e-mail.'); return; }
  const users = store.get(KEYS.users, []);
  // verificar e-mail único
  const duplicado = users.find(u=>u.email===email && u.id!==state.user?.id);
  if(duplicado){ alert('E-mail já cadastrado.'); return; }
  // atualizar ou criar
  let u = users.find(u=>u.id===state.user?.id) || {id:Date.now()};
  u.nome = nome || email.split('@')[0];
  u.email = email;
  u.tipo = tipo;
  if(!users.find(x=>x.id===u.id)) users.push(u);
  store.set(KEYS.users, users);
  state.user = u;
  renderAuth();
  alert('Perfil salvo!');
});

$('#btnSair').addEventListener('click', ()=>{
  state.user = null;
  renderAuth();
  alert('Você saiu.');
});

/* ------------------ mentorias ------------------ */
function getMentorias(){ return store.get(KEYS.mentorias, []); }
function setMentorias(v){ store.set(KEYS.mentorias, v); }
function getEnrolls(){ return store.get(KEYS.enrolls, []); }
function setEnrolls(v){ store.set(KEYS.enrolls, v); }

function renderMentorias(lista){
  const grid = $('#mentoriasGrid');
  grid.innerHTML = '';
  lista.forEach(m=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">
        <h3>${m.titulo}</h3>
        <span class="badge">${m.vagas>0? `${m.vagas} vaga(s)` : 'Esgotado'}</span>
      </div>
      <p class="meta"><strong>Mentor:</strong> ${m.mentor} • <strong>Data:</strong> ${m.data}</p>
      <div class="row gap mt">
        <button class="btn" ${m.vagas<=0?'disabled':''} data-id="${m.id}">Agendar</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // listeners
  $$('#mentoriasGrid .btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(!state.user){ alert('Entre para agendar.'); return; }
      const id = Number(btn.dataset.id);
      const mentorias = getMentorias();
      const m = mentorias.find(x=>x.id===id);
      if(!m || m.vagas<=0){ alert('Sem vagas.'); return; }
      const enrolls = getEnrolls();
      const jaInscrito = enrolls.find(e=> e.userId===state.user.id && e.mentoriaId===id);
      if(jaInscrito){ alert('Você já está inscrito nesta mentoria.'); return; }
      // registra e reduz vaga
      enrolls.push({userId:state.user.id, mentoriaId:id});
      setEnrolls(enrolls);
      m.vagas--; setMentorias(mentorias);
      renderMentorias(getMentorias());
      renderMinhasMentorias();
      alert('Inscrição confirmada!');
    });
  });
}

function renderMinhasMentorias(){
  const box = $('#minhasMentorias');
  box.innerHTML = '';
  if(!state.user){ box.innerHTML = '<p class="muted">Entre para ver suas inscrições.</p>'; return; }
  const mentorias = getMentorias();
  const enrolls = getEnrolls().filter(e=>e.userId===state.user.id);
  if(enrolls.length===0){ box.innerHTML = '<p class="muted">Nenhuma inscrição ainda.</p>'; return; }
  enrolls.forEach(e=>{
    const m = mentorias.find(x=>x.id===e.mentoriaId);
    if(!m) return;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title"><h3>${m.titulo}</h3></div>
      <p class="meta"><strong>Mentor:</strong> ${m.mentor} • <strong>Data:</strong> ${m.data}</p>
      <div class="row gap mt">
        <button class="btn ghost danger" data-id="${m.id}">Cancelar</button>
      </div>
    `;
    box.appendChild(card);
  });
  $$('#minhasMentorias .danger').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.dataset.id);
      const enrolls = getEnrolls().filter(e=> !(e.userId===state.user.id && e.mentoriaId===id));
      setEnrolls(enrolls);
      // devolve vaga
      const mentorias = getMentorias();
      const m = mentorias.find(x=>x.id===id); if(m) { m.vagas++; setMentorias(mentorias); }
      renderMentorias(getMentorias());
      renderMinhasMentorias();
    });
  });
}

// filtro mentorias
$('#btnFiltrarMentoria').addEventListener('click', ()=>{
  const termo = $('#buscaMentoria').value.toLowerCase();
  const base = getMentorias();
  const lista = base.filter(m => m.titulo.toLowerCase().includes(termo) || m.mentor.toLowerCase().includes(termo));
  renderMentorias(lista);
});
$('#btnLimparFiltroMentoria').addEventListener('click', ()=>{
  $('#buscaMentoria').value = '';
  renderMentorias(getMentorias());
});

/* ------------------ grupos ------------------ */
function getGrupos(){ return store.get(KEYS.groups, []); }
function setGrupos(v){ store.set(KEYS.groups, v); }

function renderGrupos(){
  const grid = $('#gruposGrid'); grid.innerHTML='';
  const grupos = getGrupos();
  grupos.forEach(g=>{
    const isMember = !!state.user && g.membros.includes(state.user.id);
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="title">
        <h3>${g.nome}</h3>
        <span class="badge">${g.membros.length} membro(s)</span>
      </div>
      <div class="row gap mt">
        <button class="btn ${isMember?'ghost danger':''}" data-id="${g.id}">
          ${isMember?'Sair do grupo':'Entrar no grupo'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
  // listeners entrar/sair
  $$('#gruposGrid .btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(!state.user){ alert('Entre para participar de grupos.'); return; }
      const id = Number(b.dataset.id);
      const grupos = getGrupos();
      const g = grupos.find(x=>x.id===id);
      if(!g) return;
      const idx = g.membros.indexOf(state.user.id);
      if(idx>=0) g.membros.splice(idx,1); else g.membros.push(state.user.id);
      setGrupos(grupos); renderGrupos();
    });
  });
}

$('#btnCriarGrupo').addEventListener('click', ()=>{
  const nome = $('#novoGrupoNome').value.trim();
  if(!nome) { alert('Dê um nome ao grupo.'); return; }
  const grupos = getGrupos();
  grupos.push({id:Date.now(), nome, membros: state.user? [state.user.id]:[]});
  setGrupos(grupos);
  $('#novoGrupoNome').value='';
  renderGrupos();
});

/* ------------------ materiais ------------------ */
function getMateriais(){ return store.get(KEYS.materials, []); }
function setMateriais(v){ store.set(KEYS.materials, v); }

function renderMateriais(lista=getMateriais()){
  const grid = $('#materiaisGrid'); grid.innerHTML='';
  if(lista.length===0){ grid.innerHTML = '<p class="muted">Nenhum material.</p>'; return; }
  lista.forEach(m=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="title"><h3>${m.titulo}</h3></div>
      <p class="meta"><a href="${m.link}" target="_blank">${m.link}</a></p>
      <div class="row gap mt">${m.tags.map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
    `;
    grid.appendChild(card);
  });
}

$('#btnAdicionarMaterial').addEventListener('click', ()=>{
  if(!state.user){ alert('Entre para adicionar materiais.'); return; }
  const titulo = $('#materialTitulo').value.trim();
  const link = $('#materialLink').value.trim();
  const tags = $('#materialTags').value.split(',').map(t=>t.trim()).filter(Boolean);
  if(!titulo || !link){ alert('Preencha título e link.'); return; }
  const materiais = getMateriais();
  materiais.push({id:Date.now(), titulo, link, tags});
  setMateriais(materiais);
  $('#materialTitulo').value=''; $('#materialLink').value=''; $('#materialTags').value='';
  renderMateriais();
});

$('#btnFiltrarMaterial').addEventListener('click', ()=>{
  const termo = $('#filtroMaterial').value.toLowerCase();
  const base = getMateriais();
  const lista = base.filter(m =>
    m.titulo.toLowerCase().includes(termo) ||
    m.link.toLowerCase().includes(termo) ||
    m.tags.some(t=>t.toLowerCase().includes(termo))
  );
  renderMateriais(lista);
});
$('#btnLimparFiltroMaterial').addEventListener('click', ()=>{
  $('#filtroMaterial').value=''; renderMateriais();
});

/* ------------------ inicialização ------------------ */
function init(){
  renderMentorias(getMentorias());
  renderMinhasMentorias();
  renderGrupos();
  renderMateriais();
}
init();
