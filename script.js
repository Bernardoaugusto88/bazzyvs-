
// Bazyyvs - JavaScript funcional (front-end demonstrativo)
// Os recursos de IA abaixo são simulações locais. Para IA real, login real,
// pagamentos, banco de dados e anúncios persistentes, será necessário um back-end/API.

const products = [
  {id:1, name:"iPhone 15 Pro", category:"eletronicos", price:6600, oldPrice:7200, badge:"HOT", badgeClass:"hot", desc:"256GB, titânio, seminovo, excelente estado.", img:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800"},
  {id:2, name:"PlayStation 5", category:"eletronicos", price:3200, oldPrice:3499, badge:"NOVO", badgeClass:"new", desc:"Console completo, com controle e acessórios.", img:"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800"},
  {id:3, name:"Bike Aro 29", category:"veiculos", price:2100, oldPrice:2400, badge:"TREND", badgeClass:"trend", desc:"Mountain bike aro 29, revisada e pronta para uso.", img:"https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=800"},
  {id:4, name:"Notebook Gamer", category:"eletronicos", price:5500, oldPrice:5900, badge:"HOT", badgeClass:"hot", desc:"Notebook para jogos e trabalho pesado.", img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800"},
  {id:5, name:"Relógio Smart", category:"eletronicos", price:850, oldPrice:999, badge:"NOVO", badgeClass:"new", desc:"Smartwatch com monitoramento e GPS.", img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"},
  {id:6, name:"Jaqueta Premium", category:"moda", price:390, oldPrice:499, badge:"TREND", badgeClass:"trend", desc:"Jaqueta moderna, pouco usada e bem conservada.", img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800"}
];

let currentFilter = "all";
let selectedHave = "PlayStation 5";
let selectedWant = "";
let countdownTarget = Date.now() + 7 * 24 * 60 * 60 * 1000;

function money(v) {
  return Number(v).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--gray)">
      Nenhum produto encontrado. Tente outra busca ou categoria.
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product-card" data-category="${p.category}">
      ${p.badge ? `<span class="product-badge ${p.badgeClass}">${p.badge}</span>` : ""}
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-content">
        <div class="product-tags"><span class="tag">${p.category}</span></div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">${money(p.price)} <span class="price-original">${money(p.oldPrice)}</span></div>
        <div class="price-suggestion">✓ Preço sugerido pela análise do Bazzy IA</div>
        <div class="product-actions">
          <button class="btn btn-sm" onclick="buyProduct(${p.id})">Ver produto</button>
          <button class="btn-outline btn-sm" onclick="offerTrade(${p.id})">Trocar</button>
        </div>
      </div>
    </article>
  `).join("");
}

function applyFilters() {
  const term = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  let list = products.filter(p => {
    const text = `${p.name} ${p.category} ${p.desc}`.toLowerCase();
    const matchesTerm = !term || text.includes(term);
    const matchesFilter = currentFilter === "all" ||
      (currentFilter === "leilao" && p.id <= 2) ||
      (currentFilter === "troca" && p.id !== 5) ||
      p.category === currentFilter;
    return matchesTerm && matchesFilter;
  });
  renderProducts(list);
}

function performSearch() {
  applyFilters();
  showNotification("Busca realizada.", "info");
}

function handleSearch(event) {
  if (event.key === "Enter") performSearch();
  else applyFilters();
}

function setFilter(el, filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-chip").forEach(x => x.classList.remove("active"));
  el.classList.add("active");
  applyFilters();
}

function buyProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  openModal("product", p);
}

function offerTrade(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById("tradeWant").value = p.name;
  document.getElementById("trade")?.scrollIntoView({behavior:"smooth"});
  showNotification(`${p.name} selecionado para uma possível troca.`, "info");
}

function placeBid() {
  openModal("bid");
}

function updateCountdown() {
  const diff = Math.max(0, countdownTarget - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  };
  set("cdDays", days);
  set("cdHours", hours);
  set("cdMinutes", minutes);
  set("cdSeconds", seconds);
}
setInterval(updateCountdown, 1000);

function output(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html;
  el.classList.add("has-content");
}

function generateDescription() {
  const name = document.getElementById("descProductName")?.value.trim();
  const category = document.getElementById("descCategory")?.value;
  const details = document.getElementById("descDetails")?.value.trim();
  if (!name || !category) return showNotification("Informe o produto e a categoria.", "warning");
  output("descOutput",
    `<strong>${name}</strong><br>Produto ${category} em excelente oportunidade. ${details || "Detalhes informados pelo vendedor serão apresentados aqui."} 
     Ideal para quem busca qualidade e bom custo-benefício. Consulte condições, entrega e disponibilidade antes da compra.`);
}

function suggestPrice() {
  const name = document.getElementById("priceProduct")?.value.trim();
  const condition = document.getElementById("priceCondition")?.value;
  const original = Number(document.getElementById("priceOriginal")?.value);
  if (!name || !condition || !original) return showNotification("Preencha produto, condição e preço original.", "warning");
  const factor = {novo:0.92, seminovo:0.78, usado:0.65, antigo:0.55}[condition] || 0.75;
  const suggested = original * factor;
  output("priceOutput", `<strong>Faixa sugerida para ${name}:</strong><br>
    ${money(suggested * 0.95)} a ${money(suggested * 1.05)}<br>
    <span style="font-size:12px">Estimativa demonstrativa baseada na condição informada. O preço real depende do mercado.</span>`);
}

function findTradeMatch() {
  const have = document.getElementById("tradeHave")?.value.trim();
  const want = document.getElementById("tradeWant")?.value.trim();
  if (!have || !want) return showNotification("Informe o que você tem e o que procura.", "warning");
  output("tradeOutput", `<strong>Match encontrado!</strong><br>
    Encontramos possíveis combinações para trocar <strong>${have}</strong> por <strong>${want}</strong>.
    O próximo passo seria comparar valores, estado do item, localização e condições da troca.`);
}

function showAnalytics() {
  const category = document.getElementById("analyticsCategory")?.value;
  if (!category) return showNotification("Escolha uma categoria.", "warning");
  const data = {
    eletronicos:["Alta demanda","+32%","Boa oportunidade para anúncios entre 18h e 21h."],
    veiculos:["Demanda estável","+14%","Itens bem conservados tendem a receber mais contatos."],
    moda:["Demanda em alta","+21%","Fotos boas e descrição detalhada ajudam na conversão."],
    imoveis:["Mercado estável","+8%","Localização e documentação são fatores decisivos."]
  }[category] || ["Estável","+10%","Analise concorrentes antes de publicar."];
  output("analyticsOutput", `<strong>${data[0]}</strong><br>Variação estimada: <strong style="color:var(--success)">${data[1]}</strong><br>${data[2]}`);
}

function generateNegotiationResponse() {
  const product = document.getElementById("negoProduct")?.value.trim();
  const price = Number(document.getElementById("negoPrice")?.value);
  const msg = document.getElementById("negoBuyerMsg")?.value.trim();
  if (!product || !price || !msg) return showNotification("Preencha os três campos da negociação.", "warning");
  output("negoOutput", `Sugestão: “Olá! Obrigado pelo interesse no ${product}. Consigo avaliar uma pequena redução para fechar hoje. 
    Meu melhor valor seria ${money(price * 0.95)}. Se estiver de acordo, podemos combinar a entrega.”`);
}

function optimizeTitle() {
  const title = document.getElementById("titleInput")?.value.trim();
  const platform = document.getElementById("titlePlatform")?.value;
  if (!title) return showNotification("Digite o título atual.", "warning");
  const improved = title
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  output("titleOutput", `<strong>Título sugerido para ${platform}:</strong><br>${improved} • Excelente Estado • Oportunidade`);
}

function selectTradeItem(el, type) {
  const parent = el.parentElement;
  parent.querySelectorAll(".trade-item").forEach(x => x.classList.remove("selected"));
  el.classList.add("selected");
  const name = el.querySelector("h4")?.textContent || "";
  if (type === "have") selectedHave = name;
  else selectedWant = name;

  if (selectedHave && selectedWant) {
    const result = document.getElementById("tradeResult");
    const text = document.getElementById("tradeResultText");
    if (result && text) {
      result.classList.add("show");
      text.textContent = `A análise demonstrativa considera ${selectedHave} por ${selectedWant} uma combinação que merece negociação. Compare os valores antes de aceitar.`;
    }
  }
}

function toggleChatbot() {
  document.getElementById("chatbotWindow")?.classList.toggle("open");
}

function sendQuickReply(text) {
  const input = document.getElementById("chatInput");
  if (input) input.value = text;
  sendChatMessage();
}

function handleChatKey(event) {
  if (event.key === "Enter") sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const body = document.getElementById("chatbotBody");
  if (!input || !body) return;
  const text = input.value.trim();
  if (!text) return;

  const user = document.createElement("div");
  user.className = "chat-message user";
  user.textContent = text;
  body.appendChild(user);
  input.value = "";

  const lower = text.toLowerCase();
  let reply = "Posso ajudar com preço, vendas, trocas, títulos, descrições e tendências do marketplace.";
  if (lower.includes("preço") || lower.includes("vale")) reply = "Para estimar um preço, use a ferramenta Precificador Inteligente e informe produto, condição e preço original.";
  else if (lower.includes("vender")) reply = "Para vender mais, use fotos claras, título objetivo, descrição completa e um preço competitivo.";
  else if (lower.includes("troca")) reply = "Na troca, compare o valor dos dois itens, estado de conservação e condições de entrega.";
  else if (lower.includes("negoci")) reply = "Evite aceitar a primeira oferta. Defina seu menor valor e faça uma contraproposta educada.";
  else if (lower.includes("alta") || lower.includes("tend")) reply = "Eletrônicos aparecem como uma das categorias de maior demanda neste protótipo.";

  setTimeout(() => {
    const bot = document.createElement("div");
    bot.className = "chat-message bot";
    bot.textContent = reply;
    body.appendChild(bot);
    body.scrollTop = body.scrollHeight;
  }, 350);
}

function openModal(type, data) {
  const overlay = document.getElementById("modalOverlay");
  const content = document.getElementById("modalContent");
  if (!overlay || !content) return;

  if (type === "login") {
    content.innerHTML = `<h2>Entrar no Bazyyvs</h2><p>Acesso demonstrativo do protótipo.</p>
      <input id="loginEmail" type="email" placeholder="Seu e-mail">
      <input id="loginPassword" type="password" placeholder="Senha">
      <button class="btn" style="width:100%" onclick="doLogin()">Entrar</button>`;
  } else if (type === "register") {
    content.innerHTML = `<h2>Criar conta</h2><p>Crie um perfil local para testar o protótipo.</p>
      <input id="regName" placeholder="Nome completo">
      <input id="regEmail" type="email" placeholder="E-mail">
      <input id="regPassword" type="password" placeholder="Senha">
      <button class="btn" style="width:100%" onclick="doRegister()">Criar conta</button>`;
  } else if (type === "product" && data) {
    content.innerHTML = `<h2>${data.name}</h2><p>${data.desc}</p>
      <p style="font-size:30px;color:var(--primary);font-weight:700">${money(data.price)}</p>
      <button class="btn" style="width:100%" onclick="showNotification('Interesse registrado no protótipo.','success');closeModal()">Tenho interesse</button>`;
  } else if (type === "bid") {
    content.innerHTML = `<h2>Dar lance</h2><p>Este leilão é demonstrativo. Informe seu lance para simular uma proposta.</p>
      <input id="bidValue" type="number" min="1" placeholder="Seu lance em R$">
      <button class="btn" style="width:100%" onclick="submitBid()">Enviar lance</button>`;
  }
  overlay.classList.add("open");
}

function doLogin() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const pass = document.getElementById("loginPassword")?.value;
  if (!email || !pass) return showNotification("Informe e-mail e senha.", "warning");
  localStorage.setItem("bazyyvsUser", email);
  closeModal();
  showNotification(`Bem-vindo, ${email}!`, "success");
}

function doRegister() {
  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const pass = document.getElementById("regPassword")?.value;
  if (!name || !email || !pass) return showNotification("Preencha todos os campos.", "warning");
  localStorage.setItem("bazyyvsUser", JSON.stringify({name,email}));
  closeModal();
  showNotification(`Conta de ${name} criada no protótipo.`, "success");
}

function submitBid() {
  const value = Number(document.getElementById("bidValue")?.value);
  if (!value || value <= 0) return showNotification("Digite um valor válido.", "warning");
  closeModal();
  showNotification(`Lance de ${money(value)} registrado no protótipo.`, "success");
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById("modalOverlay")?.classList.remove("open");
}

function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer");
  if (!container) return;
  const item = document.createElement("div");
  item.className = `notification ${type}`;
  item.innerHTML = `<div class="notif-icon">${type === "success" ? "✓" : type === "warning" ? "!" : "i"}</div>
    <div class="notif-content"><h4>${type === "success" ? "Sucesso" : type === "warning" ? "Atenção" : "Bazyyvs"}</h4><p>${message}</p></div>`;
  container.appendChild(item);
  setTimeout(() => item.remove(), 3500);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCountdown();

  document.querySelectorAll(".plan .btn, .plan .btn-outline").forEach(btn => {
    btn.addEventListener("click", () => {
      openModal("register");
    });
  });

  document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelectorAll(".sidebar a").forEach(x => x.classList.remove("active"));
      link.classList.add("active");
      showNotification(`${link.textContent.trim()} selecionado.`, "info");
    });
  });
});
