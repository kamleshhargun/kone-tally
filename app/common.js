
/* =========================
   INIT APP
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadLayout("dashboard");
});

/* =========================
   LOAD LAYOUT
========================= */
function loadLayout(defaultPage = "dashboard") {

  document.getElementById("app").innerHTML = `
  <div class="sidebar">
    <h2>KONE ERP</h2>

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
    a.addEventListener("click", () => loadPage(a.dataset.page));
  });

  loadPage(defaultPage);
}

/* =========================
   PAGE ROUTER
========================= */
function loadPage(page) {

  let content = document.getElementById("content");
  setActive(page);

  let inv = getInventory();

  /* DASHBOARD */
  if (page === "dashboard") {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <div class="grid">
        <div class="card">Fabric <h2>${inv.fabric}</h2></div>
        <div class="card">Cutting <h2>${inv.cutting}</h2></div>
        <div class="card">Stitching <h2>${inv.stitching}</h2></div>
        <div class="card">Finished <h2>${inv.finished}</h2></div>
      </div>
    `;
  }

  /* =========================
     FABRIC PAGE (FINAL CLEAN)
  ========================= */
  if (page === "fabric") {

    content.innerHTML = `
      <h2>Fabric Purchase</h2>

      <div class="row">
        <input id="date" type="date">
        <input id="party" placeholder="Party Name">
        <input id="invoice" placeholder="Invoice No">
        <input id="gst" value="5" readonly>
      </div>

      <div id="fabricContainer"></div>

      <button onclick="addFabricRow()">+ Add Fabric</button>
      <button onclick="saveInvoice()">Save Invoice</button>

      <hr>

      <h3>Saved Invoices</h3>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Party</th>
            <th>Invoice</th>
            <th>Subtotal</th>
            <th>GST</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody id="tableBody"></tbody>
      </table>
    `;

    document.getElementById("date").value =
      new Date().toISOString().split("T")[0];

    addFabricRow();
    renderFabricTable();
  }

  /* OTHER PAGES */
  if (page === "cutting") content.innerHTML = `<h2>Cutting</h2><input id="cutQty"><button onclick="moveStock('fabric','cutting','cutQty')">Process</button>`;
  if (page === "stitching") content.innerHTML = `<h2>Stitching</h2><input id="stQty"><button onclick="moveStock('cutting','stitching','stQty')">Process</button>`;
  if (page === "finished") content.innerHTML = `<h2>Finished</h2><input id="finQty"><button onclick="moveStock('stitching','finished','finQty')">Complete</button>`;
  if (page === "sales") content.innerHTML = `<h2>Sales</h2><input id="saleQty"><button onclick="sellStock()">Sell</button>`;
  if (page === "return") content.innerHTML = `<h2>Return</h2><input id="retQty"><button onclick="returnStock()">Return</button>`;
  if (page === "settings") content.innerHTML = `<h2>Settings</h2><button onclick="clearAll()">Clear Data</button>`;
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
   INVENTORY
========================= */
function getInventory() {
  return JSON.parse(localStorage.getItem("inventory")) || {
    fabric: 0,
    cutting: 0,
    stitching: 0,
    finished: 0
  };
}

function setInventory(data) {
  localStorage.setItem("inventory", JSON.stringify(data));
}

/* =========================
   STOCK MOVE
========================= */
function moveStock(from, to, id) {
  let qty = Number(document.getElementById(id).value);
  let inv = getInventory();

  if (inv[from] < qty) return alert("Not enough stock");

  inv[from] -= qty;
  inv[to] += qty;

  setInventory(inv);

  alert("Moved");
  loadPage("dashboard");
}

/* =========================
   SALES
========================= */
function sellStock() {
  let qty = Number(document.getElementById("saleQty").value);
  let inv = getInventory();

  if (inv.finished < qty) return alert("Not enough stock");

  inv.finished -= qty;
  setInventory(inv);

  alert("Sold");
  loadPage("dashboard");
}

/* =========================
   RETURN
========================= */
function returnStock() {
  let qty = Number(document.getElementById("retQty").value);
  let inv = getInventory();

  inv.finished += qty;
  setInventory(inv);

  alert("Returned");
  loadPage("dashboard");
}

/* =========================
   FABRIC MODULE (FINAL ADVANCED)
========================= */

let fabricData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let editIndex = null;
let openDetails = null;

/* ROW */
function addFabricRow(name = "", meter = "", rate = "") {
  let div = document.createElement("div");

  div.innerHTML = `
    <input class="fName" placeholder="Fabric" value="${name}">
    <input class="fMeter" type="number" placeholder="Meter" value="${meter}">
    <input class="fRate" type="number" placeholder="Rate" value="${rate}">
  `;

  document.getElementById("fabricContainer").appendChild(div);
}

/* SAVE INVOICE (NO DUPLICATE CHECK) */
function saveInvoice() {

  let date = document.getElementById("date").value;
  let party = document.getElementById("party").value;
  let invoice = document.getElementById("invoice").value;
  let gst = 5;

  // ❗ DUPLICATE CHECK
  let duplicate = fabricData.find(f => f.invoice === invoice && editIndex === null);
  if (duplicate) {
    return alert("Invoice already exists!");
  }

  let fabrics = [];
  let subtotal = 0;

  document.querySelectorAll("#fabricContainer div").forEach(row => {

    let name = row.querySelector(".fName").value;
    let meter = Number(row.querySelector(".fMeter").value);
    let rate = Number(row.querySelector(".fRate").value);

    if (name && meter && rate) {
      let amount = meter * rate;
      fabrics.push({ name, meter, rate, amount });
      subtotal += amount;
    }
  });

  if (!party || !invoice || fabrics.length === 0) {
    return alert("Fill all fields");
  }

  let gstAmount = subtotal * gst / 100;
  let total = subtotal + gstAmount;

  let obj = { date, party, invoice, fabrics, subtotal, gstAmount, total };

  if (editIndex !== null) {
    fabricData[editIndex] = obj;
    editIndex = null;
  } else {
    fabricData.push(obj);
  }

  localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));

  alert("Saved");

  clearFabricForm();   // ✔ RESET FORM
  renderFabricTable();
}

/* RESET FORM AFTER SAVE */
function clearFabricForm() {
  document.getElementById("party").value = "";
  document.getElementById("invoice").value = "";
  document.getElementById("fabricContainer").innerHTML = "";
  addFabricRow();
}

/* TABLE RENDER WITH DETAILS TOGGLE */
function renderFabricTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  fabricData.forEach((inv, i) => {

    let isOpen = openDetails === i;

    tbody.innerHTML += `
      <tr>
        <td>${inv.date}</td>
        <td>${inv.party}</td>
        <td>${inv.invoice}</td>
        <td>${inv.subtotal.toFixed(2)}</td>
        <td>${inv.gstAmount.toFixed(2)}</td>
        <td>${inv.total.toFixed(2)}</td>

        <td>
          <button onclick="editInvoice(${i})">Edit</button>
          <button onclick="deleteInvoice(${i})">Delete</button>
          <button onclick="toggleDetails(${i})">Details</button>
        </td>
      </tr>

      ${isOpen ? `
      <tr>
        <td colspan="7">
          ${inv.fabrics.map(f => `
            <div>
              ${f.name} | ${f.meter}m | ₹${f.rate} = ₹${f.amount}
            </div>
          `).join("")}
        </td>
      </tr>
      ` : ""}
    `;
  });
}

/* TOGGLE DETAILS */
function toggleDetails(i) {
  openDetails = (openDetails === i) ? null : i;
  renderFabricTable();
}

/* EDIT */
function editInvoice(i) {
  let inv = fabricData[i];
  editIndex = i;

  document.getElementById("date").value = inv.date;
  document.getElementById("party").value = inv.party;
  document.getElementById("invoice").value = inv.invoice;

  document.getElementById("fabricContainer").innerHTML = "";

  inv.fabrics.forEach(f => addFabricRow(f.name, f.meter, f.rate));
}

/* DELETE */
function deleteInvoice(i) {

  if (confirm("Delete?")) {
    fabricData.splice(i, 1);
    localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));
    renderFabricTable();
  }
}

/* =========================
   CLEAR ALL
========================= */
function clearAll() {
  localStorage.clear();
  alert("Cleared");
  loadPage("dashboard");
}
