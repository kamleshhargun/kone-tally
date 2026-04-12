// ================= DATA =================
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let salesData = JSON.parse(localStorage.getItem("salesData")) || [];

let editIndex = null;


// ================= ADD ROW =================
function addSaleRow(data = {}) {

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

    <input type="number" class="qty" placeholder="Qty" value="${data.qty || ""}">

    <button onclick="this.parentElement.remove()" class="delete-btn">X</button>
  `;

  document.getElementById("productContainer")?.appendChild(div);
}


// ================= SAVE =================
function saveSale() {

  let date = document.getElementById("date").value;
  let order = document.getElementById("order").value;
  let tracking = document.getElementById("tracking").value;

  let items = [];
  let total = 0;

  // ⚠️ important: first validation, then stock minus
  document.querySelectorAll("#productContainer .row").forEach(r => {

    let item = r.querySelector(".item").value;
    let qty = parseInt(r.querySelector(".qty").value);

    if (item && qty) {

      // check stock
      if (!inventory[item] || inventory[item] < qty) {
        alert("Stock not available: " + item);
        throw new Error("Stock error"); // stop execution
      }

      items.push({ item, qty });
      total += qty;
    }
  });

  if (!date || !order || items.length === 0) {
    return alert("Fill all fields");
  }

  // EDIT case → pehle old stock wapas add karo
  if (editIndex !== null) {
    let old = salesData[editIndex];
    old.items.forEach(it => {
      inventory[it.item] += it.qty;
    });
  }

  // ab new stock minus karo
  items.forEach(it => {
    inventory[it.item] -= it.qty;
  });

  let obj = { date, order, tracking, items, total };

  if (editIndex !== null) {
    salesData[editIndex] = obj;
    editIndex = null;
  } else {
    salesData.push(obj);
  }

  localStorage.setItem("salesData", JSON.stringify(salesData));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderSaleTable();
  clearSaleForm();
}


// ================= TABLE =================
function renderSaleTable() {

  let tbody = document.getElementById("tableBody");
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
          <button class="edit-btn" onclick="editSale(${i})">Edit</button>
          <button class="delete-btn" onclick="deleteSale(${i})">Delete</button>
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


// ================= TOGGLE =================
function toggleSale(i) {
  let row = document.getElementById("sale-" + i);
  if (row) {
    row.style.display =
      row.style.display === "none" ? "table-row" : "none";
  }
}


// ================= EDIT =================
function editSale(i) {

  let s = salesData[i];
  editIndex = i;

  document.getElementById("date").value = s.date;
  document.getElementById("order").value = s.order;
  document.getElementById("tracking").value = s.tracking;

  document.getElementById("productContainer").innerHTML = "";

  s.items.forEach(it => addSaleRow(it));
}


// ================= DELETE =================
function deleteSale(i) {

  if (confirm("Delete this sale?")) {

    // stock wapas add
    salesData[i].items.forEach(it => {
      inventory[it.item] += it.qty;
    });

    salesData.splice(i, 1);

    localStorage.setItem("salesData", JSON.stringify(salesData));
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderSaleTable();
  }
}


// ================= CLEAR =================
function clearSaleForm() {

  document.getElementById("date").value = "";
  document.getElementById("order").value = "";
  document.getElementById("tracking").value = "";
  document.getElementById("productContainer").innerHTML = "";

  addSaleRow();
}


// ================= INIT =================
function initSales() {
  addSaleRow();
  renderSaleTable();
}
