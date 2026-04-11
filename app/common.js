/* =========================
   INIT APP
========================= */
window.onload = () => {
  loadLayout();
};

/* =========================
   LOAD LAYOUT
========================= */
function loadLayout(defaultPage = "dashboard") {

  let container = document.getElementById("app");

  container.innerHTML = `
  <div class="sidebar">
    <h2>ERP</h2>
    <div class="menu">
      <a data-page="dashboard">Dashboard</a>
      <a data-page="fabric">Fabric</a>
      <a data-page="cutting">Cutting</a>
      <a data-page="stitching">Stitching</a>
      <a data-page="finished">Finished</a>
      <a data-page="sales">Sales</a>
      <a data-page="return">Return</a>
      <a data-page="settings">Settings</a>
    </div>
  </div>

  <div class="main">
    <div id="content"></div>
  </div>
  `;

  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => {
      loadPage(a.getAttribute("data-page"));
    });
  });

  loadPage(defaultPage);
}

/* =========================
   LOAD PAGE
========================= */
function loadPage(page) {

  let content = document.getElementById("content");
  setActive(page);

  let inventory = getInventory();

  /* ================= DASHBOARD ================= */
  if (page === "dashboard") {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <div class="grid">
        <div class="card"><p>Fabric</p><h2>${inventory.fabric}</h2></div>
        <div class="card"><p>Cutting</p><h2>${inventory.cutting}</h2></div>
        <div class="card"><p>Stitching</p><h2>${inventory.stitching}</h2></div>
        <div class="card"><p>Finished</p><h2>${inventory.finished}</h2></div>
      </div>
    `;
  }

  /* ================= FABRIC PAGE ================= */
  if (page === "fabric") {
    content.innerHTML = `
      <h2>Fabric Purchase</h2>
      <p>👉 Fabric invoices alag page me save hote hain</p>
      <button onclick="openFabricPurchase()">Open Fabric Purchase</button>
    `;
  }

  if (page === "cutting") {
    content.innerHTML = `
      <h2>Cutting</h2>
      <input id="cutQty" type="number" placeholder="Qty">
      <button onclick="moveStock('fabric','cutting','cutQty')">Process</button>
    `;
  }

  if (page === "stitching") {
    content.innerHTML = `
      <h2>Stitching</h2>
      <input id="stQty" type="number" placeholder="Qty">
      <button onclick="moveStock('cutting','stitching','stQty')">Process</button>
    `;
  }

  if (page === "finished") {
    content.innerHTML = `
      <h2>Finished</h2>
      <input id="finQty" type="number" placeholder="Qty">
      <button onclick="moveStock('stitching','finished','finQty')">Complete</button>
    `;
  }

  if (page === "sales") {
    content.innerHTML = `
      <h2>Sales</h2>
      <input id="saleQty" type="number">
      <button onclick="sellStock()">Sell</button>
    `;
  }

  if (page === "return") {
    content.innerHTML = `
      <h2>Return</h2>
      <input id="retQty" type="number">
      <button onclick="returnStock()">Return</button>
    `;
  }

  if (page === "settings") {
    content.innerHTML = `
      <h2>Settings</h2>
      <button onclick="clearAll()">Clear Data</button>
    `;
  }
}

/* =========================
   FABRIC PURCHASE CONNECT
========================= */
function openFabricPurchase() {
  window.open("fabric.html", "_blank");
}

/* =========================
   ACTIVE MENU
========================= */
function setActive(page) {
  document.querySelectorAll(".menu a").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

/* =========================
   INVENTORY CORE
========================= */
function getInventory() {
  return getData("inventory", {
    fabric: 0,
    cutting: 0,
    stitching: 0,
    finished: 0
  });
}

function setInventory(data) {
  setData("inventory", data);
}

/* =========================
   STOCK MOVE
========================= */
function moveStock(from, to, inputId) {
  let qty = Number(document.getElementById(inputId).value);
  let inv = getInventory();

  if (inv[from] < qty) {
    alert("Not enough stock");
    return;
  }

  inv[from] -= qty;
  inv[to] += qty;

  setInventory(inv);

  alert("Moved Successfully");
  loadPage("dashboard");
}

/* =========================
   SELL / RETURN
========================= */
function sellStock() {
  let qty = Number(document.getElementById("saleQty").value);
  let inv = getInventory();

  if (inv.finished < qty) return alert("Stock not available");

  inv.finished -= qty;
  setInventory(inv);

  alert("Sale Done");
  loadPage("dashboard");
}

function returnStock() {
  let qty = Number(document.getElementById("retQty").value);
  let inv = getInventory();

  inv.finished += qty;
  setInventory(inv);

  alert("Returned");
  loadPage("dashboard");
}

/* =========================
   STORAGE
========================= */
function getData(key, def = {}) {
  return JSON.parse(localStorage.getItem(key)) || def;
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* =========================
   CLEAR ALL
========================= */
function clearAll() {
  localStorage.clear();
  alert("All Data Cleared");
  loadPage("dashboard");
}
