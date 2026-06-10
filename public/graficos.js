const API_URL = "http://localhost:3000/filmes";

async function fetchItems() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.status}`);
  return await response.json();
}

function contarPorCategoria(filmes) {
  const contagem = {};
  filmes.forEach((filme) => {
    const cat = filme.categoria;
    if (!cat) return;
    if (cat in contagem) {
      contagem[cat] = contagem[cat] + 1;
    } else {
      contagem[cat] = 1;
    }
  });
  return contagem;
}

function notaMediaPorCategoria(filmes) {
  const soma = {};
  const qtd = {};
  filmes.forEach((filme) => {
    const cat = filme.categoria;
    if (!cat || filme.nota == null) return;
    if (cat in soma) {
      soma[cat] = soma[cat] + filme.nota;
      qtd[cat] = qtd[cat] + 1;
    } else {
      soma[cat] = filme.nota;
      qtd[cat] = 1;
    }
  });
  const media = {};
  for (const cat in soma) {
    media[cat] = Number((soma[cat] / qtd[cat]).toFixed(2));
  }
  return media;
}

function contarPorAno(filmes) {
  const contagem = {};
  filmes.forEach((filme) => {
    const ano = filme.ano;
    if (!ano) return;
    if (ano in contagem) {
      contagem[ano] = contagem[ano] + 1;
    } else {
      contagem[ano] = 1;
    }
  });
  return contagem;
}

const CORES = [
  "#e50914", "#f5c518", "#4caf50", "#2196f3",
  "#9c27b0", "#ff9800", "#00bcd4", "#e91e63",
];

const COR_TEXTO = "#e0e0e0";
const COR_GRID = "#333";

function graficoPizza(canvasId, dados) {
  const labels = Object.keys(dados);
  const valores = Object.values(dados);
  new Chart(document.getElementById(canvasId), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{ data: valores, backgroundColor: CORES, borderColor: "#1f1f1f", borderWidth: 2 }],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: COR_TEXTO } } },
    },
  });
}

function graficoBarras(canvasId, dados, rotulo) {
  const labels = Object.keys(dados);
  const valores = Object.values(dados);
  new Chart(document.getElementById(canvasId), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ label: rotulo, data: valores, backgroundColor: "#e50914" }],
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: COR_TEXTO } } },
      scales: {
        x: { ticks: { color: "#aaa" }, grid: { color: COR_GRID } },
        y: { beginAtZero: true, ticks: { color: "#aaa" }, grid: { color: COR_GRID } },
      },
    },
  });
}

function showMessage(text) {
  document.getElementById("message").textContent = text;
}

async function init() {
  showMessage("Carregando dados...");
  try {
    const filmes = await fetchItems();
    showMessage("");
    graficoPizza("chart-categoria", contarPorCategoria(filmes));
    graficoBarras("chart-nota", notaMediaPorCategoria(filmes), "Nota média");
    graficoBarras("chart-ano", contarPorAno(filmes), "Qtd. de filmes");
  } catch (error) {
    showMessage("Erro ao carregar dados. O JSON Server está rodando?");
    console.error(error);
  }
}

init();