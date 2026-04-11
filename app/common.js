/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  let savedPage = localStorage.getItem("activePage") || "dashboard";
  loadLayout(savedPage);
  setupKeyboard();
});

/* =========================
   LAYOUT
========================= */
function loadLayout(defaultPage) {

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
    a.onclick = () => loadPage(a.dataset.page);
  });

  loadPage(defaultPage);
}

/* =========================
   PAGE ROUTER
========================= */
function loadPage(page) {

  localStorage.setItem("activePage", page);
  setActive(page);

  let content = document.getElementById("content");

  /* ================= DASHBOARD ================= */
  if (page === "dashboard") {
    let inv = getInventory();
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

  /* ================= FABRIC ================= */
  if (page === "fabric") {

    content.innerHTML = `
      <h2>Fabric Purchase</h2>

      <div class="row">
        <input id="date" type="date">
        <input id="party" placeholder="Party Name">
        <input id="invoice" placeholder="Invoice No">
      </div>

      <div id="fabricContainer"></div>

      <button onclick="addFabricRow()">+ Add Fabric</button>
      <button onclick="saveInvoice()">Save Invoice</button>

      <hr>

      <table>
        <thead>
          <tr>
            <th>Date</th><th>Party</th><th>Invoice</th>
            <th>Subtotal</th><th>GST</th><th>Total</th><th>Action</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    `;

    document.getElementById("date").value =
      new Date().toISOString().split("T")[0];

    addFabricRow();
    renderFabricTable();

    setTimeout(() => document.getElementById("party").focus(), 100);
  }

  /* ================= CUTTING ================= */
  if (page === "cutting") {

    content.innerHTML = `
      <h2>Cutting</h2>

      <input id="cutDate" type="date">

      <div id="cuttingContainer"></div>

      <button onclick="addCuttingRow()">+ Add Row</button>
      <button onclick="saveCutting()">Save Cutting</button>

      <hr>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total PCS</th>
            <th>Total Meter</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="cuttingTable"></tbody>
      </table>
    `;

    document.getElementById("cutDate").value =
      new Date().toISOString().split("T")[0];

    addCuttingRow();
    renderCuttingTable();
  }

  /* ================= OTHER ================= */
  if (page === "settings") {
    content.innerHTML = `<button onclick="clearAll()">Clear Data</button>`;
  }
}

/* =========================
   KEYBOARD SHORTCUT
========================= */
function setupKeyboard() {

  const pages = [
    "dashboard","fabric","cutting",
    "stitching","finished","sales",
    "return","settings"
  ];

  document.addEventListener("keydown", e => {

    if (e.altKey) {
      let i = parseInt(e.key) - 1;
      if (pages[i]) {
        e.preventDefault();
        loadPage(pages[i]);
      }
    }
  });
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

/* =========================
   FABRIC MODULE
========================= */
let fabricData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let editIndex = null;
let openDetails = null;

function addFabricRow(name="", meter="", rate="") {

  let div = document.createElement("div");

  div.innerHTML = `
    <input class="fName" placeholder="Fabric" value="${name}">
    <input class="fMeter" type="number" placeholder="Meter" value="${meter}">
    <input class="fRate" type="number" placeholder="Rate" value="${rate}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  document.getElementById("fabricContainer").appendChild(div);
}

function saveInvoice() {

  let date = document.getElementById("date").value;
  let party = document.getElementById("party").value;
  let invoice = document.getElementById("invoice").value;

  if (fabricData.find(f => f.invoice === invoice && editIndex === null)) {
    return alert("Duplicate Invoice!");
  }

  let subtotal = 0;
  let fabrics = [];

  document.querySelectorAll("#fabricContainer div").forEach(r => {

    let n = r.querySelector(".fName").value;
    let m = +r.querySelector(".fMeter").value;
    let r1 = +r.querySelector(".fRate").value;

    if (n && m && r1) {
      let amt = m * r1;
      subtotal += amt;
      fabrics.push({ n, m, r1, amt });
    }
  });

  if (!party || !invoice || fabrics.length === 0) {
    return alert("Fill all fields");
  }

  let gst = subtotal * 0.05;
  let total = subtotal + gst;

  let obj = { date, party, invoice, subtotal, gst, total, fabrics };

  if (editIndex !== null) {
    fabricData[editIndex] = obj;
    editIndex = null;
  } else {
    fabricData.push(obj);
  }

  localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));

  clearFabricForm();
  renderFabricTable();
}

function clearFabricForm() {
  document.getElementById("party").value = "";
  document.getElementById("invoice").value = "";
  document.getElementById("fabricContainer").innerHTML = "";
  addFabricRow();
}

function renderFabricTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  fabricData.forEach((inv, i) => {

    let open = openDetails === i;

    tbody.innerHTML += `
      <tr>
        <td>${inv.date}</td>
        <td>${inv.party}</td>
        <td>${inv.invoice}</td>
        <td>${inv.subtotal}</td>
        <td>${inv.gst}</td>
        <td>${inv.total}</td>
        <td>
          <button onclick="editInvoice(${i})">Edit</button>
          <button onclick="deleteInvoice(${i})">Delete</button>
          <button onclick="toggleDetails(${i})">Details</button>
        </td>
      </tr>

      ${open ? `
      <tr>
        <td colspan="7">
          ${inv.fabrics.map(f =>
            `${f.n} | ${f.m}m x ₹${f.r1} = ₹${f.amt} + GST = ₹${(f.amt*1.05).toFixed(2)}`
          ).join("<br>")}
        </td>
      </tr>
      ` : ""}
    `;
  });
}

function toggleDetails(i) {
  openDetails = (openDetails === i) ? null : i;
  renderFabricTable();
}

function editInvoice(i) {
  let inv = fabricData[i];
  editIndex = i;

  document.getElementById("date").value = inv.date;
  document.getElementById("party").value = inv.party;
  document.getElementById("invoice").value = inv.invoice;

  document.getElementById("fabricContainer").innerHTML = "";

  inv.fabrics.forEach(f =>
    addFabricRow(f.n, f.m, f.r1)
  );
}

function deleteInvoice(i) {
  if (confirm("Delete?")) {
    fabricData.splice(i, 1);
    localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));
    renderFabricTable();
  }
}

/* =========================
   CUTTING MODULE
========================= */
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];

function getStock() {

  let stock = {};

  fabricData.forEach(inv=>{
    inv.fabrics.forEach(f=>{
      if(!stock[f.n]) stock[f.n]=0;
      stock[f.n]+=f.m;
    });
  });

  cuttingData.forEach(c=>{
    c.rows.forEach(r=>{
      if(stock[r.fabric]) stock[r.fabric]-=r.meter;
    });
  });

  return stock;
}

function addCuttingRow() {

  let stock = getStock();

  let div = document.createElement("div");

  div.innerHTML = `
    <select class="fabric">
      ${Object.keys(stock).map(f =>
        `<option value="${f}">${f} (Stock: ${stock[f]})</option>`
      )}
    </select>

    <input class="sku" placeholder="SKU">
    <input class="qty" type="number" placeholder="Qty">

    <div>
      ${["S","M","L","XL"].map(s => `
        <label>
          <input type="checkbox" class="size" value="${s}">
          ${s}
        </label>
      `).join("")}
    </div>

    <input class="meter" type="number" placeholder="Meter Used">

    <button onclick="this.parentElement.remove()">Remove</button>
  `;

  document.getElementById("cuttingContainer").appendChild(div);
}

function saveCutting() {

  let date = document.getElementById("cutDate").value;

  let rows = [];
  let totalPcs = 0;
  let totalMeter = 0;

  document.querySelectorAll("#cuttingContainer div").forEach(r=>{

    let fabric = r.querySelector(".fabric").value;
    let sku = r.querySelector(".sku").value;
    let qty = +r.querySelector(".qty").value;
    let meter = +r.querySelector(".meter").value;

    let sizes = [];
    r.querySelectorAll(".size:checked").forEach(c=>sizes.push(c.value));

    if(fabric && sku && qty && sizes.length){
      let pcs = qty * sizes.length;
      totalPcs += pcs;
      totalMeter += meter;

      rows.push({ fabric, sku, qty, sizes, pcs, meter });
    }
  });

  if(!date || rows.length===0){
    return alert("Fill all fields");
  }

  cuttingData.push({ date, rows, totalPcs, totalMeter });

  localStorage.setItem("cuttingData", JSON.stringify(cuttingData));

  alert("Process Done");

  renderCuttingTable();
}

function renderCuttingTable(){

  let tb = document.getElementById("cuttingTable");
  if (!tb) return;

  tb.innerHTML = "";

  cuttingData.forEach((c,i)=>{

    tb.innerHTML += `
    <tr onclick="toggleCutting(${i})">
      <td>${c.date}</td>
      <td>${c.totalPcs}</td>
      <td>${c.totalMeter}</td>
      <td>
        <button onclick="event.stopPropagation(); deleteCutting(${i})">Delete</button>
      </td>
    </tr>

    <tr id="cut-${i}" style="display:none">
      <td colspan="4">
        ${c.rows.map(r =>
          `${r.fabric} | SKU:${r.sku} | PCS:${r.pcs} | Meter:${r.meter}`
        ).join("<br>")}
      </td>
    </tr>
    `;
  });
}

function toggleCutting(i){
  let r = document.getElementById("cut-"+i);
  r.style.display = r.style.display==="none"?"table-row":"none";
}

function deleteCutting(i){
  if(confirm("Delete?")){
    cuttingData.splice(i,1);
    localStorage.setItem("cuttingData", JSON.stringify(cuttingData));
    renderCuttingTable();
  }
}

/* =========================
   CLEAR ALL
========================= */
function clearAll() {
  localStorage.clear();
  alert("Cleared");
  location.reload();
}
