/* =========================
   CUTTING MODULE
========================= */

// ===== DATA =====
let purchaseData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];

let editIndex = null;


/* =========================
   STOCK CALCULATION
========================= */
function getStock() {
  let stock = {};

  // Purchase add
  purchaseData.forEach(inv => {
    inv.fabrics.forEach(f => {
      if (!stock[f.name]) stock[f.name] = 0;
      stock[f.name] += f.meter;
    });
  });

  // Cutting minus
  cuttingData.forEach(c => {
    if (stock[c.fabric]) {
      stock[c.fabric] -= c.meterUsed;
    }
  });

  return stock;
}


/* =========================
   LOAD FABRIC DROPDOWN
========================= */
function loadFabric() {
  let stock = getStock();
  let select = document.getElementById("fabricSelect");

  if (!select) return;

  select.innerHTML = "";

  for (let f in stock) {
    select.innerHTML += `
      <option value="${f}">
        ${f} (Stock: ${stock[f]})
      </option>
    `;
  }
}


/* =========================
   ADD SKU ROW
========================= */
function addSkuRow(data = {}) {

  let div = document.createElement("div");
  div.className = "sku-row";

  div.innerHTML = `
    <input type="text" class="sku" placeholder="SKU" value="${data.sku || ""}">
    
    <input type="number" class="qty" placeholder="Qty per size" value="${data.qty || ""}">

    <div class="size-box">
      ${["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"].map(s => `
        <label>
          <input type="checkbox" class="size" value="${s}" ${(data.sizes || []).includes(s) ? "checked" : ""}>
          ${s}
        </label>
      `).join("")}
    </div>

    <button onclick="this.parentElement.remove()" class="delete-btn">Remove</button>
  `;

  document.getElementById("skuContainer")?.appendChild(div);
}


/* =========================
   SAVE CUTTING
========================= */
function saveCutting() {

  let fabric = document.getElementById("fabricSelect").value;
  let date = document.getElementById("date").value;
  let meterUsed = parseFloat(document.getElementById("meter").value);

  let skuData = [];
  let totalPcs = 0;

  document.querySelectorAll(".sku-row").forEach(row => {

    let sku = row.querySelector(".sku").value;
    let qty = parseInt(row.querySelector(".qty").value);

    let sizes = [];
    row.querySelectorAll(".size:checked").forEach(cb => {
      sizes.push(cb.value);
    });

    if (sku && qty && sizes.length) {
      let pcs = qty * sizes.length;
      totalPcs += pcs;

      skuData.push({ sku, qty, sizes, pcs });
    }
  });

  if (!fabric || !date || !meterUsed || skuData.length === 0) {
    alert("Fill all fields");
    return;
  }

  let obj = {
    fabric,
    date,
    meterUsed,
    skuData,
    totalPcs
  };

  if (editIndex !== null) {
    cuttingData[editIndex] = obj;
    editIndex = null;
  } else {
    cuttingData.push(obj);
  }

  localStorage.setItem("cuttingData", JSON.stringify(cuttingData));

  renderCuttingTable();
  clearCuttingForm();
  loadFabric();
}


/* =========================
   TABLE RENDER
========================= */
function renderCuttingTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  cuttingData.forEach((c, i) => {

    let row = `
      <tr onclick="toggleCutting(${i})">
        <td>${c.fabric}</td>
        <td>${c.date}</td>
        <td>${c.totalPcs}</td>
        <td>${c.meterUsed}</td>
        <td>
          <button onclick="event.stopPropagation(); editCutting(${i})">Edit</button>
          <button onclick="event.stopPropagation(); deleteCutting(${i})">Delete</button>
        </td>
      </tr>
    `;

    let drawer = `
      <tr id="cut-${i}" style="display:none">
        <td colspan="5">
          ${c.skuData.map(s => `
            SKU: ${s.sku} | Sizes: ${s.sizes.join(",")} | Qty: ${s.qty} | PCS: ${s.pcs}
          `).join("<br>")}
        </td>
      </tr>
    `;

    tbody.innerHTML += row + drawer;
  });
}


/* =========================
   TOGGLE DETAILS
========================= */
function toggleCutting(i) {
  let row = document.getElementById("cut-" + i);
  if (!row) return;

  row.style.display =
    row.style.display === "none" ? "table-row" : "none";
}


/* =========================
   EDIT
========================= */
function editCutting(i) {

  let c = cuttingData[i];
  editIndex = i;

  document.getElementById("fabricSelect").value = c.fabric;
  document.getElementById("date").value = c.date;
  document.getElementById("meter").value = c.meterUsed;

  document.getElementById("skuContainer").innerHTML = "";

  c.skuData.forEach(s => {
    addSkuRow(s);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================
   DELETE
========================= */
function deleteCutting(i) {

  if (confirm("Delete?")) {

    cuttingData.splice(i, 1);

    localStorage.setItem("cuttingData", JSON.stringify(cuttingData));

    renderCuttingTable();
    loadFabric();
  }
}


/* =========================
   CLEAR FORM
========================= */
function clearCuttingForm() {

  document.getElementById("date").value = "";
  document.getElementById("meter").value = "";
  document.getElementById("skuContainer").innerHTML = "";

  addSkuRow();
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("skuContainer")) {
    addSkuRow();
    renderCuttingTable();
    loadFabric();
  }

});
