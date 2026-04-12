/* =========================
   FINISHED MODULE
========================= */

// ===== DATA =====
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];
let finishedData = JSON.parse(localStorage.getItem("finishedData")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

let editIndex = null;


/* =========================
   LOAD LABOURS
========================= */
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


/* =========================
   GET PENDING STOCK
========================= */
function getPending(labour) {

  let stock = {};

  // Stitching → add
  stitchingData.forEach(s => {
    if (s.labour === labour) {
      s.entries.forEach(e => {
        if (!stock[e.item]) stock[e.item] = 0;
        stock[e.item] += e.qty;
      });
    }
  });

  // Finished → minus
  finishedData.forEach(f => {
    if (f.labour === labour) {
      f.entries.forEach(e => {
        if (stock[e.item]) stock[e.item] -= e.qty;
      });
    }
  });

  return stock;
}


/* =========================
   LOAD PENDING UI
========================= */
function loadPending() {

  let labour = document.getElementById("labourSelect").value;
  let stock = getPending(labour);

  let container = document.getElementById("entryContainer");
  if (!container) return;

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


/* =========================
   SAVE FINISHED
========================= */
function saveFinished() {

  let date = document.getElementById("date").value;
  let labour = document.getElementById("labourSelect").value;

  let entries = [];
  let total = 0;

  document.querySelectorAll("#entryContainer .row").forEach(r => {

    let checked = r.querySelector(".check").checked;
    let qty = parseInt(r.querySelector(".qty").value);
    let item = r.querySelector(".item").value;

    if (checked && qty) {

      entries.push({ item, qty });
      total += qty;

      // Inventory add
      if (!inventory[item]) inventory[item] = 0;
      inventory[item] += qty;
    }
  });

  if (!date || entries.length === 0) {
    alert("Select items");
    return;
  }

  let obj = { date, labour, entries, total };

  // EDIT case → reverse old inventory first
  if (editIndex !== null) {
    let old = finishedData[editIndex];

    old.entries.forEach(e => {
      if (inventory[e.item]) {
        inventory[e.item] -= e.qty;
      }
    });

    finishedData[editIndex] = obj;
    editIndex = null;

  } else {
    finishedData.push(obj);
  }

  localStorage.setItem("finishedData", JSON.stringify(finishedData));
  localStorage.setItem("inventory", JSON.stringify(inventory));

  renderFinishedTable();
  loadPending();
}


/* =========================
   TABLE RENDER
========================= */
function renderFinishedTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  finishedData.forEach((f, i) => {

    let row = `
      <tr onclick="toggleFinished(${i})">
        <td>${f.date}</td>
        <td>${f.labour}</td>
        <td>${f.total}</td>
        <td>
          <button onclick="event.stopPropagation(); editFinished(${i})">Edit</button>
          <button onclick="event.stopPropagation(); deleteFinished(${i})">Delete</button>
        </td>
      </tr>
    `;

    let drawer = `
      <tr id="fin-${i}" style="display:none">
        <td colspan="4">
          ${f.entries.map(e => `${e.item} → ${e.qty}`).join("<br>")}
        </td>
      </tr>
    `;

    tbody.innerHTML += row + drawer;
  });
}


/* =========================
   TOGGLE
========================= */
function toggleFinished(i) {

  let row = document.getElementById("fin-" + i);

  if (!row) return;

  row.style.display =
    row.style.display === "none" ? "table-row" : "none";
}


/* =========================
   EDIT
========================= */
function editFinished(i) {

  let f = finishedData[i];
  editIndex = i;

  document.getElementById("date").value = f.date;
  document.getElementById("labourSelect").value = f.labour;

  loadPending();

  // Wait for UI render
  setTimeout(() => {

    document.querySelectorAll("#entryContainer .row").forEach(r => {

      let item = r.querySelector(".item").value;

      f.entries.forEach(e => {

        if (e.item === item) {
          r.querySelector(".check").checked = true;
          r.querySelector(".qty").value = e.qty;
        }

      });

    });

  }, 200);
}


/* =========================
   DELETE
========================= */
function deleteFinished(i) {

  if (confirm("Delete?")) {

    let old = finishedData[i];

    // Reverse inventory
    old.entries.forEach(e => {
      if (inventory[e.item]) {
        inventory[e.item] -= e.qty;
      }
    });

    finishedData.splice(i, 1);

    localStorage.setItem("finishedData", JSON.stringify(finishedData));
    localStorage.setItem("inventory", JSON.stringify(inventory));

    renderFinishedTable();
    loadPending();
  }
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("labourSelect")) {
    loadLabours();
    renderFinishedTable();
  }

});
