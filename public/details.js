const API_URL = "http://localhost:3000/filmes";

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

async function fetchItem(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (response.status === 404) throw new Error("Filme não encontrado.");
  if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
  return await response.json();
}

function renderDetails(item) {
  document.title = `${item.titulo} | Catálogo de Filmes`;

  const container = document.getElementById("movie-details");
  container.innerHTML = "";

  const img = document.createElement("img");
  img.src = item.imagem;
  img.alt = item.titulo;
  img.classList.add("details-poster");
  img.onerror = () => { img.src = "https://via.placeholder.com/300x450?text=Sem+Poster"; };

  const info = document.createElement("div");
  info.classList.add("details-info");

  const title = document.createElement("h2");
  title.textContent = item.titulo;

  const meta = document.createElement("div");
  meta.classList.add("details-meta");
  meta.innerHTML = `
    <span class="movie-category">${item.categoria}</span>
    <span>${item.ano}</span>
    <span>${item.duracao}</span>
    <span class="movie-price">R$ ${item.preco.toFixed(2)}</span>
    <span> ${item.nota}</span>
  `;

  const director = document.createElement("p");
  director.innerHTML = `<strong>Direção:</strong> ${item.diretor}`;

  const overview = document.createElement("p");
  overview.classList.add("details-overview");
  overview.textContent = item.descricaoCompleta;

  const tagsTitle = document.createElement("p");
  tagsTitle.innerHTML = "<strong>Tags:</strong>";

  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-container");
  item.tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.classList.add("tag-chip");
    chip.textContent = tag;
    tagsContainer.appendChild(chip);
  });

  if (item.destaque) {
    const badge = document.createElement("span");
    badge.classList.add("badge-destaque");
    badge.textContent = " Em destaque";
    info.appendChild(badge);
  }

  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(director);
  info.appendChild(overview);
  info.appendChild(tagsTitle);
  info.appendChild(tagsContainer);

  container.appendChild(img);
  container.appendChild(info);
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showMessage("Nenhum filme selecionado. Volte ao catálogo e escolha um filme.");
    return;
  }

  showMessage("Carregando detalhes...");

  try {
    const item = await fetchItem(id);
    showMessage("");
    renderDetails(item);
  } catch (error) {
    showMessage(error.message || "Erro ao carregar os detalhes do filme.");
    console.error(error);
  }
}

init();