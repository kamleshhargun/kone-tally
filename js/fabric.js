// ================= FABRIC MODULE =================

// ===== DATA =====
let data = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let editIndex = null;

// ===== PAGE LOAD =====
function loadFabricPage(){

  let content = document.getElementById("content");

  content.innerHTML = `
    <h2>Fabric Purchase</h2>

    <div class="row">
      <input id="party" placeholder="Party Name">
      <input id="invoice" placeholder="Invoice No">
      <input id="date" type="date">
      <input id="gst" type="number" placeholder="GST %">
    </div>

    <div id="fabricContainer"></div>

    <button onclick="addFabricRow()">+ Add Fabric</button>
    <button onclick="saveInvoice()">Save Invoice</button>

    <hr>

    <h3>Invoices</h3>

    <table>
      <thead>
        <tr>
          <th>Party</th>
          <th>Invoice</th>
          <th>Date</th>
          <th>Subtotal</th>
          <th>GST</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody id="tableBody"></tbody>
    </table>

    <h3>Grand Total: ₹ <span id="grandTotal">0</span></h3>
  `;

  // default date
  document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

  addFabricRow();
  renderTable();
}

// ===== ADD ROW =====
function addFabricRow(name="", meter="", rate="") {

  let div = document.createElement("div");
  div.className = "fabric-row";

  div.innerHTML = `
    <input type="text" class="fabricName" placeholder="Fabric" value="${name}">
    <input type="number" class="meter" placeholder="Meter" value="${meter}">
    <input type="number" class="rate" placeholder="Rate" value="${rate}">
    <button onclick="this.parentElement.remove()">X</button>
  `;

  document.getElementById("fabricContainer").appendChild(div);
}

// ===== SAVE =====
function saveInvoice() {

  let party = document.getElementById("party").value;
  let invoice = document.getElementById("invoice").value;
  let date = document.getElementById("date").value;
  let gst = parseFloat(document.getElementById("gst").value) || 0;

  let fabrics = [];
  let subtotal = 0;

  document.querySelectorAll(".fabric-row").forEach(row => {

    let name = row.querySelector(".fabricName").value;
    let meter = parseFloat(row.querySelector(".meter").value);
    let rate = parseFloat(row.querySelector(".rate").value);

    if (name && meter && rate) {
      let amount = meter * rate;
      subtotal += amount;
      fabrics.push({ name, meter, rate, amount });
    }
  });

  if (!party || !invoice || fabrics.length === 0) {
    alert("Fill required fields");
    return;
  }

  let gstAmount = subtotal * gst / 100;
  let total = subtotal + gstAmount;

  let obj = { party, invoice, date, gst, fabrics, subtotal, gstAmount, total };

  if (editIndex !== null) {
    data[editIndex] = obj;
    editIndex = null;
  } else {
    data.push(obj);
  }

  localStorage.setItem("fabricInvoices", JSON.stringify(data));

  renderTable();
  clearForm();
}

// ===== RENDER =====
function renderTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  let grandTotal = 0;

  data.forEach((inv, i) => {

    grandTotal += inv.total;

    let row = `
      <tr onclick="toggleDrawer(${i})">
        <td>${inv.party}</td>
        <td>${inv.invoice}</td>
        <td>${inv.date}</td>
        <td>${inv.subtotal}</td>
        <td>${inv.gst}%</td>
        <td>${inv.total}</td>
        <td>
          <button onclick="event.stopPropagation(); editInvoice(${i})">Edit</button>
          <button onclick="event.stopPropagation(); deleteInvoice(${i})">Delete</button>
        </td>
      </tr>
    `;

    let drawer = `
      <tr class="drawer" id="drawer-${i}" style="display:none">
        <td colspan="7">
          <table width="100%">
            <tr>
              <th>Fabric</th>
              <th>Meter</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
            ${inv.fabrics.map(f => `
              <tr>
                <td>${f.name}</td>
                <td>${f.meter}</td>
                <td>${f.rate}</td>
                <td>${f.amount}</td>
              </tr>
            `).join("")}
          </table>
          <br>
          Subtotal: ₹ ${inv.subtotal} | GST: ₹ ${inv.gstAmount} | Total: ₹ ${inv.total}
        </td>
      </tr>
    `;

    tbody.innerHTML += row + drawer;
  });

  document.getElementById("grandTotal").innerText = grandTotal;
}

// ===== TOGGLE =====
function toggleDrawer(i) {
  let row = document.getElementById("drawer-" + i);
  if (row) {
    row.style.display = row.style.display === "table-row" ? "none" : "table-row";
  }
}

// ===== EDIT =====
function editInvoice(i) {

  let inv = data[i];
  editIndex = i;

  document.getElementById("party").value = inv.party;
  document.getElementById("invoice").value = inv.invoice;
  document.getElementById("date").value = inv.date;
  document.getElementById("gst").value = inv.gst;

  document.getElementById("fabricContainer").innerHTML = "";

  inv.fabrics.forEach(f => {
    addFabricRow(f.name, f.meter, f.rate);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== DELETE =====
function deleteInvoice(i) {

  if (confirm("Delete invoice?")) {

    data.splice(i, 1);
    localStorage.setItem("fabricInvoices", JSON.stringify(data));

    renderTable();
  }
}

// ===== CLEAR =====
function clearForm() {

  document.getElementById("party").value = "";
  document.getElementById("invoice").value = "";
  document.getElementById("date").value = "";
  document.getElementById("gst").value = "";

  document.getElementById("fabricContainer").innerHTML = "";

  addFabricRow();
}
