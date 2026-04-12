// ================= DATA =================
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let returnData = JSON.parse(localStorage.getItem("returnData")) || [];

let editIndex = null;


// ================= ADD ROW =================
function addReturnRow(data = {}) {

  let div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <select class="item">
      ${Object.keys(inventory).map(k => `
        <option value="${k}" ${data.item === k ? "selected" : ""}>
          ${k} (Stock: ${inventory[k] || 0})
        </option>
      `).join("")}
    </select>

    <input type="number" class="qty" placeholder="Qty" value="${data.qty || ""}">

    <button onclick="this.parentElement.remove()" class="delete-btn">X</button>
  `;

  document.getElementById("productContainer")?.appendChild(div);
}


// ================= SAVE =================
function saveReturn() {

  let date = document.getElementById("date").value;
  let order = document.getElementById("order").value;

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

  // EDIT case → pehle old reverse karo
  if (editIndex !== null) {
    let old = returnData[editIndex];
    old.items.forEach(it => {
      inventory[it.item] -= it.qty;
    });
  }

  // stock add back
  items.forEach(it => {
    inventory[it.item] = (inventory[it.item] || 0) + it.qty;
  });

  let obj = { date, order, items, total };

  if (editIndex !== null) {
    returnData[editIndex] = obj;
    editIndex = null;
  } else {
    returnData.push(obj);
  }

  localStorage.setItem("returnData", JSON.stringify(returnData));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderReturnTable();
  clearReturnForm();
}


// ================= TABLE =================
function renderReturnTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  returnData.forEach((r, i) => {

    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.order}</td>
        <td>${r.total}</td>
        <td>
          <button class="edit-btn" onclick="editReturn(${i})">Edit</button>
          <button class="delete-btn" onclick="deleteReturn(${i})">Delete</button>
          <button onclick="toggleReturn(${i})">Details</button>
        </td>
      </tr>

      <tr id="return-${i}" style="display:none">
        <td colspan="4">
          ${r.items.map(it => `${it.item} → ${it.qty}`).join("<br>")}
        </td>
      </tr>
    `;
  });
}


// ================= TOGGLE =================
function toggleReturn(i) {
  let row = document.getElementById("return-" + i);
  if (row) {
    row.style.display =
      row.style.display === "none" ? "table-row" : "none";
  }
}


// ================= EDIT =================
function editReturn(i) {

  let r = returnData[i];
  editIndex = i;

  document.getElementById("date").value = r.date;
  document.getElementById("order").value = r.order;

  document.getElementById("productContainer").innerHTML = "";

  r.items.forEach(it => addReturnRow(it));
}


// ================= DELETE =================
function deleteReturn(i) {

  if (confirm("Delete this return?")) {

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


// ================= CLEAR =================
function clearReturnForm() {

  document.getElementById("date").value = "";
  document.getElementById("order").value = "";
  document.getElementById("productContainer").innerHTML = "";

  addReturnRow();
}


// ================= INIT =================
function initReturn() {
  addReturnRow();
  renderReturnTable();
}
