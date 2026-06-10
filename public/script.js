const API_URL = "http://localhost:3000/filmes";

async function fetchItems() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.status}`);
  return await response.json();
}

function createCard(item) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = item.imagem;
  img.alt = item.titulo;
  img.loading = "lazy";
  img.onerror = () => { img.src = "https://via.placeholder.com/300x450?text=Sem+Poster"; };
  card.appendChild(img);

  const info = document.createElement("div");
  info.classList.add("movie-info");

  const title = document.createElement("p");
  title.classList.add("movie-title");
  title.textContent = item.titulo;

  const meta = document.createElement("div");
  meta.classList.add("movie-meta");

  const category = document.createElement("span");
  category.classList.add("movie-category");
  category.textContent = item.categoria;

  const price = document.createElement("span");
  price.classList.add("movie-price");
  price.textContent = `R$ ${item.preco.toFixed(2)}`;

  meta.appendChild(category);
  meta.appendChild(price);

  const desc = document.createElement("p");
  desc.classList.add("movie-desc");
  desc.textContent = item.descricaoCurta;

  const btn = document.createElement("a");
  btn.classList.add("btn-details");
  btn.href = `details.html?id=${item.id}`;
  btn.textContent = "Ver detalhes";

  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(desc);
  info.appendChild(btn);
  card.appendChild(info);

  return card;
}

function renderCards(items) {
  const container = document.getElementById("movie-list");
  container.innerHTML = "";

  if (!items || items.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");
  items.forEach((item) => container.appendChild(createCard(item)));
}

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

async function init() {
  showMessage("Carregando filmes...");
  try {
    const items = await fetchItems();
    renderCards(items);
  } catch (error) {
    showMessage("Erro ao carregar filmes. O JSON Server está rodando?");
    console.error(error);
  }
}

init();