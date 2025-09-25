const mentorias = [
  { titulo: "Como crescer na internet", mentor: "Rafa", vagas: 5 },
  { titulo: "Produtividade com TDAH", mentor: "Ana", vagas: 3 },
  { titulo: "Introdução a HTML e CSS", mentor: "Carlos", vagas: 4 }
];

function renderizarMentorias(lista) {
  const ul = document.getElementById("listaMentorias");
  ul.innerHTML = "";
  lista.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.titulo} — Mentor: ${m.mentor} — Vagas: ${m.vagas}`;
    ul.appendChild(li);
  });
}

function filtrarMentorias() {
  const filtro = document.getElementById("filtro").value.toLowerCase();
  const filtradas = mentorias.filter(m => m.titulo.toLowerCase().includes(filtro) || m.mentor.toLowerCase().includes(filtro));
  renderizarMentorias(filtradas);
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarMentorias(mentorias);
});