/* =========================
   GLOBAL DATA (ONLY ONCE)
========================= */

let fabricData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];
let finishedData = JSON.parse(localStorage.getItem("finishedData")) || [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
let returnData = JSON.parse(localStorage.getItem("returnData")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

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
  content.innerHTML = ""; // 🔥 IMPORTANT RESET

  /* ================= DASHBOARD ================= */
  if (page === "dashboard") {

    // ===== CALC =====
    let purchaseTotal = fabricData.length;

    let cuttingTotal = cuttingData.reduce((a,b)=>a+(b.totalPcs || 0),0);

    let stitchingTotal = stitchingData.reduce((a,b)=>a+(b.total || 0),0);

    let salesTotal = salesData.reduce((a,b)=>a+(b.total || 0),0);

    let inventoryTotal = 0;
    for(let k in inventory){
      inventoryTotal += inventory[k];
    }

    // ===== UI =====
    content.innerHTML = `
      <h2>Dashboard</h2>

      <div class="grid">
        <div class="card">Purchase <h2 id="purchase"></h2></div>
        <div class="card">Cutting <h2 id="cutting"></h2></div>
        <div class="card">Stitching <h2 id="stitching"></h2></div>
        <div class="card">Sales <h2 id="sales"></h2></div>
        <div class="card">Inventory <h2 id="inventory"></h2></div>
      </div>

      <hr>

      <h3>Stock Details</h3>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody id="stockTable"></tbody>
      </table>
    `;

    // ===== SET VALUES =====
    document.getElementById("purchase").innerText = purchaseTotal;
    document.getElementById("cutting").innerText = cuttingTotal;
    document.getElementById("stitching").innerText = stitchingTotal;
    document.getElementById("sales").innerText = salesTotal;
    document.getElementById("inventory").innerText = inventoryTotal;

    // ===== STOCK TABLE =====
    let tbody = document.getElementById("stockTable");
    tbody.innerHTML = ""; // 🔥 reset

    for(let k in inventory){
      tbody.innerHTML += `
        <tr>
          <td>${k}</td>
          <td>${inventory[k]}</td>
        </tr>
      `;
    }
  }


  /* ================= FABRIC ================= */
else if (page === "fabric") {

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
}

/* ================= CUTTING ================= */
else if (page === "cutting") {

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

/* ================= STITCHING ================= */
else if (page === "stitching") {

  content.innerHTML = `
    <h2>Stitching</h2>

    <div class="row">
      <input id="stDate" type="date">
      <input id="labour" placeholder="Labour Name">
    </div>

    <div id="entryContainer"></div>

    <button onclick="addStitchRow()">+ Add Row</button>
    <button onclick="saveStitching()">Save Stitching</button>

    <hr>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Labour</th>
          <th>Total Qty</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="stitchTable"></tbody>
    </table>
  `;

  document.getElementById("stDate").value =
    new Date().toISOString().split("T")[0];

  addStitchRow();
  renderStitchTable();
}

/* ===== GLOBAL DATA (NO DUPLICATE DECLARE) ===== */
let stitchEditIndex = null;

/* ===== GET READY STOCK ===== */
function getReadyStock() {

  let stock = {};

  cuttingData.forEach(c=>{
    c.rows.forEach(r=>{
      r.sizes.forEach(size=>{
        let key = r.sku + " - " + size;
        stock[key] = (stock[key] || 0) + r.qty;
      });
    });
  });

  stitchingData.forEach(st=>{
    st.entries.forEach(e=>{
      if(stock[e.item]) stock[e.item] -= e.qty;
    });
  });

  return stock;
}

/* ===== ADD STITCH ROW ===== */
function addStitchRow(data={}) {

  let stock = getReadyStock();
  let div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <select class="item">
      ${Object.keys(stock).map(k=>`
        <option value="${k}" ${data.item===k?"selected":""}>
          ${k} (Pending: ${stock[k]})
        </option>
      `).join("")}
    </select>

    <input type="number" class="qty" value="${data.qty||""}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  document.getElementById("entryContainer")?.appendChild(div);
}

/* ===== SAVE STITCHING ===== */
function saveStitching() {

  let date = document.getElementById("stDate").value;
  let labour = document.getElementById("labour").value;

  let entries = [];
  let total = 0;

  document.querySelectorAll("#entryContainer .row").forEach(r=>{
    let item = r.querySelector(".item").value;
    let qty = parseInt(r.querySelector(".qty").value);

    if(item && qty){
      entries.push({ item, qty });
      total += qty;
    }
  });

  if(!date || !labour || entries.length === 0){
    return alert("Fill all fields");
  }

  let obj = { date, labour, entries, total };

  if(stitchEditIndex !== null){
    stitchingData[stitchEditIndex] = obj;
    stitchEditIndex = null;
  } else {
    stitchingData.push(obj);
  }

  localStorage.setItem("stitchingData", JSON.stringify(stitchingData));

  renderStitchTable();
  clearStitchForm();
}

/* ===== STITCH TABLE ===== */
function renderStitchTable(){

  let tbody = document.getElementById("stitchTable");
  if(!tbody) return;

  tbody.innerHTML = "";

  stitchingData.forEach((s,i)=>{
    tbody.innerHTML += `
      <tr>
        <td>${s.date}</td>
        <td>${s.labour}</td>
        <td>${s.total}</td>
        <td>
          <button onclick="editStitch(${i})">Edit</button>
          <button onclick="deleteStitch(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ===== CLEAR ===== */
function clearStitchForm(){
  document.getElementById("labour").value = "";
  document.getElementById("entryContainer").innerHTML = "";
  addStitchRow();
}

/* ================= FINISHED ================= */
else if (page === "finished") {

  content.innerHTML = `
    <h2>Finished</h2>

    <div class="row">
      <input id="finDate" type="date">
      <select id="labourSelect" onchange="loadPending()"></select>
    </div>

    <div id="entryContainer"></div>

    <button onclick="saveFinished()">Save Finished</button>

    <hr>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Labour</th>
          <th>Total Qty</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="finishedTable"></tbody>
    </table>
  `;

  document.getElementById("finDate").value =
    new Date().toISOString().split("T")[0];

  loadLabours();
  renderFinishedTable();
}
/* ===== FINISHED DATA ===== */
let finishedEditIndex = null;

/* ===== LOAD LABOURS ===== */
function loadLabours() {

  let select = document.getElementById("labourSelect");
  if (!select) return;

  let labours = [...new Set(stitchingData.map(s => s.labour))];

  select.innerHTML = "";

  labours.forEach(l => {
    select.innerHTML += `<option value="${l}">${l}</option>`;
  });

  loadPending();
}

/* ===== PENDING ===== */
function getPending(labour) {

  let stock = {};

  stitchingData.forEach(s=>{
    if(s.labour === labour){
      s.entries.forEach(e=>{
        stock[e.item] = (stock[e.item] || 0) + e.qty;
      });
    }
  });

  finishedData.forEach(f=>{
    if(f.labour === labour){
      f.entries.forEach(e=>{
        if(stock[e.item]) stock[e.item] -= e.qty;
      });
    }
  });

  return stock;
}

/* ===== LOAD UI ===== */
function loadPending() {

  let labour = document.getElementById("labourSelect").value;
  let stock = getPending(labour);

  let container = document.getElementById("entryContainer");
  if(!container) return;

  container.innerHTML = "";

  for (let item in stock) {
    if (stock[item] > 0) {
      container.innerHTML += `
        <div class="row">
          <input type="checkbox" class="check">
          ${item} (Pending: ${stock[item]})
          <input type="number" class="qty" value="${stock[item]}">
          <input type="hidden" class="item" value="${item}">
        </div>
      `;
    }
  }
}

 /* ================= SALES ================= */
else if (page === "sales") {

  content.innerHTML = `
    <h2>Sales</h2>

    <div class="row">
      <input id="saleDate" type="date">
      <input id="order" placeholder="Order No">
      <input id="tracking" placeholder="Tracking ID">
    </div>

    <div id="productContainer"></div>

    <button onclick="addSaleRow()">+ Add Product</button>
    <button onclick="saveSale()">Save Sale</button>

    <hr>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Order</th>
          <th>Tracking</th>
          <th>Total Qty</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="saleTable"></tbody>
    </table>
  `;

  document.getElementById("saleDate").value =
    new Date().toISOString().split("T")[0];

  addSaleRow();
  renderSaleTable();
}

/* ===== DATA ===== */
let saleEditIndex = null;

/* ===== ADD ROW ===== */
function addSaleRow(data = {}) {

  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  let div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <select class="item">
      ${Object.keys(inventory).map(k => `
        <option value="${k}" ${data.item === k ? "selected" : ""}>
          ${k} (Stock: ${inventory[k]})
        </option>
      `).join("")}
    </select>

    <input type="number" class="qty" value="${data.qty || ""}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  document.getElementById("productContainer")?.appendChild(div);
}

/* ===== SAVE ===== */
function saveSale() {

  let date = document.getElementById("saleDate").value;
  let order = document.getElementById("order").value;
  let tracking = document.getElementById("tracking").value;

  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  let items = [];
  let total = 0;
  let error = false;

  document.querySelectorAll("#productContainer .row").forEach(r => {

    let item = r.querySelector(".item").value;
    let qty = parseInt(r.querySelector(".qty").value);

    if (item && qty) {

      if (!inventory[item] || inventory[item] < qty) {
        alert("Stock not available: " + item);
        error = true;
        return;
      }

      items.push({ item, qty });
      total += qty;
    }
  });

  if (error) return;

  if (!date || !order || items.length === 0) {
    return alert("Fill all fields");
  }

  // EDIT case → stock restore first
  if (saleEditIndex !== null) {
    let old = salesData[saleEditIndex];
    old.items.forEach(it => {
      inventory[it.item] += it.qty;
    });
  }

  // now minus stock
  items.forEach(it => {
    inventory[it.item] -= it.qty;
  });

  let obj = { date, order, tracking, items, total };

  if (saleEditIndex !== null) {
    salesData[saleEditIndex] = obj;
    saleEditIndex = null;
  } else {
    salesData.push(obj);
  }

  localStorage.setItem("salesData", JSON.stringify(salesData));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderSaleTable();
  clearSaleForm();
}

/* ===== TABLE ===== */
function renderSaleTable() {

  let tbody = document.getElementById("saleTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  salesData.forEach((s, i) => {

    tbody.innerHTML += `
      <tr>
        <td>${s.date}</td>
        <td>${s.order}</td>
        <td>${s.tracking}</td>
        <td>${s.total}</td>
        <td>
          <button onclick="editSale(${i})">Edit</button>
          <button onclick="deleteSale(${i})">Delete</button>
          <button onclick="toggleSale(${i})">Details</button>
        </td>
      </tr>

      <tr id="sale-${i}" style="display:none">
        <td colspan="5">
          ${s.items.map(it => `${it.item} → ${it.qty}`).join("<br>")}
        </td>
      </tr>
    `;
  });
}

/* ===== TOGGLE ===== */
function toggleSale(i) {
  let row = document.getElementById("sale-" + i);
  if (row) {
    row.style.display = row.style.display === "none" ? "table-row" : "none";
  }
}

/* ===== EDIT ===== */
function editSale(i) {

  let s = salesData[i];
  saleEditIndex = i;

  document.getElementById("saleDate").value = s.date;
  document.getElementById("order").value = s.order;
  document.getElementById("tracking").value = s.tracking;

  document.getElementById("productContainer").innerHTML = "";

  s.items.forEach(it => addSaleRow(it));
}

/* ===== DELETE ===== */
function deleteSale(i) {

  if (confirm("Delete this sale?")) {

    let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

    // restore stock
    salesData[i].items.forEach(it => {
      inventory[it.item] += it.qty;
    });

    salesData.splice(i, 1);

    localStorage.setItem("salesData", JSON.stringify(salesData));
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderSaleTable();
  }
}

/* ===== CLEAR ===== */
function clearSaleForm() {

  document.getElementById("order").value = "";
  document.getElementById("tracking").value = "";
  document.getElementById("productContainer").innerHTML = "";

  addSaleRow();
}

/* ================= RETURN ================= */
else if (page === "return") {

  content.innerHTML = `
    <h2>Return</h2>

    <div class="row">
      <input id="retDate" type="date">
      <input id="retOrder" placeholder="Order No">
    </div>

    <div id="productContainer"></div>

    <button onclick="addReturnRow()">+ Add Product</button>
    <button onclick="saveReturn()">Save Return</button>

    <hr>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Order</th>
          <th>Total Items</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="returnTable"></tbody>
    </table>
  `;

  document.getElementById("retDate").value =
    new Date().toISOString().split("T")[0];

  addReturnRow();
  renderReturnTable();
}

/* ===== DATA ===== */
let returnEditIndex = null;

/* ===== ADD ROW ===== */
function addReturnRow(data = {}) {

  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  let div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <select class="item">
      ${Object.keys(inventory).map(k => `
        <option value="${k}" ${data.item === k ? "selected" : ""}>
          ${k} (Stock: ${inventory[k]})
        </option>
      `).join("")}
    </select>

    <input type="number" class="qty" value="${data.qty || ""}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  document.getElementById("productContainer")?.appendChild(div);
}

/* ===== SAVE ===== */
function saveReturn() {

  let date = document.getElementById("retDate").value;
  let order = document.getElementById("retOrder").value;

  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  let items = [];
  let total = 0;

  document.querySelectorAll("#productContainer .row").forEach(r => {

    let item = r.querySelector(".item").value;
    let qty = parseInt(r.querySelector(".qty").value);

    if (item && qty) {
      items.push({ item, qty });
      total += qty;
    }
  });

  if (!date || items.length === 0) {
    return alert("Fill all fields");
  }

  // EDIT → reverse old
  if (returnEditIndex !== null) {
    let old = returnData[returnEditIndex];
    old.items.forEach(it => {
      inventory[it.item] -= it.qty;
    });
  }

  // add stock back
  items.forEach(it => {
    inventory[it.item] = (inventory[it.item] || 0) + it.qty;
  });

  let obj = { date, order, items, total };

  if (returnEditIndex !== null) {
    returnData[returnEditIndex] = obj;
    returnEditIndex = null;
  } else {
    returnData.push(obj);
  }

  localStorage.setItem("returnData", JSON.stringify(returnData));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderReturnTable();
  clearReturnForm();
}

/* ===== TABLE ===== */
function renderReturnTable() {

  let tbody = document.getElementById("returnTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  returnData.forEach((r, i) => {

    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.order}</td>
        <td>${r.total}</td>
        <td>
          <button onclick="editReturn(${i})">Edit</button>
          <button onclick="deleteReturn(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ===== DELETE ===== */
function deleteReturn(i) {

  if (confirm("Delete this return?")) {

    let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

    // reverse stock
    returnData[i].items.forEach(it => {
      inventory[it.item] -= it.qty;
    });

    returnData.splice(i, 1);

    localStorage.setItem("returnData", JSON.stringify(returnData));
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderReturnTable();
  }
}

/* ===== CLEAR ===== */
function clearReturnForm() {

  document.getElementById("retOrder").value = "";
  document.getElementById("productContainer").innerHTML = "";

  addReturnRow();
}
  
   /* ================= OTHER ================= */
else if (page === "settings") {
  content.innerHTML = `<button onclick="clearAll()">Clear Data</button>`;
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
  return JSON.parse(localStorage.getItem("inventory")) || {};
}

/* =========================
   FABRIC MODULE
========================= */
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
            `${f.n} | ${f.m}m x ₹${f.r1} = ₹${f.amt}`
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
      ).join("")}
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
  if(confirm("Are you sure? All data will be deleted!")){
    localStorage.clear();
    location.reload();
  }
}
