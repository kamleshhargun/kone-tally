// ================= DASHBOARD =================
function loadDashboard() {

  let content = document.getElementById("content");

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

  // ===== DATA =====
  let purchase = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
  let cutting = JSON.parse(localStorage.getItem("cuttingData")) || [];
  let stitching = JSON.parse(localStorage.getItem("stitchingData")) || [];
  let sales = JSON.parse(localStorage.getItem("salesData")) || [];
  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  // ===== CALC =====
  let purchaseTotal = purchase.length;
  let cuttingTotal = cutting.reduce((a,b)=>a+(b.totalPcs||0),0);
  let stitchingTotal = stitching.reduce((a,b)=>a+(b.total||0),0);
  let salesTotal = sales.reduce((a,b)=>a+(b.total||0),0);

  let inventoryTotal = 0;
  for(let k in inventory){
    inventoryTotal += inventory[k];
  }

  // ===== SHOW =====
  document.getElementById("purchase").innerText = purchaseTotal;
  document.getElementById("cutting").innerText = cuttingTotal;
  document.getElementById("stitching").innerText = stitchingTotal;
  document.getElementById("sales").innerText = salesTotal;
  document.getElementById("inventory").innerText = inventoryTotal;

  // ===== STOCK TABLE =====
  let tbody = document.getElementById("stockTable");
  tbody.innerHTML = "";

  for(let k in inventory){
    tbody.innerHTML += `
      <tr>
        <td>${k}</td>
        <td>${inventory[k]}</td>
      </tr>
    `;
  }
}
function loadPage
