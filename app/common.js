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

  // MENU CLICK EVENT
  document.querySelectorAll(".menu a").forEach(a => {
    a.addEventListener("click", () => {
      let page = a.getAttribute("data-page");
      loadPage(page);
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

  let inventory = getData("inventory", {
    fabric: 0,
    cutting: 0,
    stitching: 0,
    finished: 0
  });

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

  /* ================= FABRIC ================= */
  if (page === "fabric") {
    content.innerHTML = `
      <h2>Fabric Entry</h2>
      <input id="fabQty" type="number" placeholder="Enter Fabric Qty">
      <button onclick="addFabric()">Add</button>
    `;
  }

  /* ================= CUTTING ================= */
  if (page === "cutting") {
    content.innerHTML = `
      <h2>Cutting</h2>
      <input id="cutQty" type="number" placeholder="Qty">
      <button onclick="moveStock('fabric','cutting','cutQty')">Process</button>
    `;
  }

  /* ================= STITCHING ================= */
  if (page === "stitching") {
    content.innerHTML = `
      <h2>Stitching</h2>
      <input id="stQty" type="number" placeholder="Qty">
      <button onclick="moveStock('cutting','stitching','stQty')">Process</button>
    `;
  }

  /* ================= FINISHED ================= */
  if (page === "finished") {
    content.innerHTML = `
      <h2>Finished</h2>
      <input id="finQty" type="number" placeholder="Qty">
      <button onclick="moveStock('stitching','finished','finQty')">Complete</button>
    `;
  }

  /* ================= SALES ================= */
  if (page === "sales") {
    content.innerHTML = `
      <h2>Sales</h2>
      <input id="saleQty" type="number" placeholder="Sell Qty">
      <button onclick="sellStock()">Sell</button>
    `;
  }

  /* ================= RETURN ================= */
  if (page === "return") {
    content.innerHTML = `
      <h2>Return</h2>
      <input id="retQty" type="number" placeholder="Return Qty">
      <button onclick="returnStock()">Return</button>
    `;
  }

  /* ================= SETTINGS ================= */
  if (page === "settings") {
    content.innerHTML = `
      <h2>Settings</h2>
      <button onclick="clearAll()">Clear Data</button>
    `;
  }
}

/* =========================
   ACTIVE MENU
========================= */
function setActive(page) {
  document.querySelectorAll(".menu a").forEach(a => {
    a.classList.remove("active");

    if (a.getAttribute("data-page") === page) {
      a.classList.add("active");
    }
  });
}

/* =========================
   CORE FUNCTIONS
========================= */

function addFabric() {
  let qty = Number(document.getElementById("fabQty").value);
  let inv = getInventory();

  inv.fabric += qty;
  setInventory(inv);

  alert("Fabric Added");
  loadPage("dashboard");
}

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

function sellStock() {
  let qty = Number(document.getElementById("saleQty").value);
  let inv = getInventory();

  if (inv.finished < qty) {
    alert("Stock not available");
    return;
  }

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
   STORAGE SYSTEM
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

function getData(key, def = {}) {
  return JSON.parse(localStorage.getItem(key)) || def;
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function clearAll() {
  localStorage.clear();
  alert("All Data Cleared");
  loadPage("dashboard");
}
