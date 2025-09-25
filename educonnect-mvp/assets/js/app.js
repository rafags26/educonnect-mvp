// Dados mock de mentorias
let mentorias = JSON.parse(localStorage.getItem("mentorias")) || [
  { id: 1, titulo: "Como crescer na Internet", mentor: "Rafa Gomes", vagas: 5, data: "27/09 14h" },
  { id: 2, titulo: "HTML e CSS do zero", mentor: "João Silva", vagas: 3, data: "28/09 10h" },
  { id: 3, titulo: "Introdução a JavaScript", mentor: "Maria Souza", vagas: 4, data: "29/09 19h" },
  { id: 4, titulo: "Produtividade com SCRUM", mentor: "Ana Costa", vagas: 2, data: "30/09 16h" }
];

// Salvar no localStorage
function salvarMentorias() {
  localStorage.setItem("mentorias", JSON.stringify(mentorias));
}

// Renderizar cards
function renderizarMentorias(lista) {
  const grid = document.getElementById("mentorias-grid");
  grid.innerHTML = "";

  lista.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${m.titulo}</h3>
      <p><strong>Mentor:</strong> ${m.mentor}</p>
      <p><strong>Data:</strong> ${m.data}</p>
      <p><strong>Vagas:</strong> ${m.vagas}</p>
      <button onclick="agendar(${m.id})" ${m.vagas <= 0 ? "disabled" : ""}>
        ${m.vagas > 0 ? "Agendar" : "Esgotado"}
      </button>
    `;
    grid.appendChild(card);
  });
}

// Agendar vaga
function agendar(id) {
  const mentoria = mentorias.find((m) => m.id === id);
  if (mentoria && mentoria.vagas > 0) {
    mentoria.vagas--;
    salvarMentorias();
    renderizarMentorias(mentorias);
  }
}

// Filtro de busca
document.getElementById("btn-filtrar").addEventListener("click", () => {
  const termo = document.getElementById("campo-busca").value.toLowerCase();
  const filtradas = mentorias.filter(
    (m) =>
      m.titulo.toLowerCase().includes(termo) ||
      m.mentor.toLowerCase().includes(termo)
  );
  renderizarMentorias(filtradas);
});

// Render inicial
renderizarMentorias(mentorias);
