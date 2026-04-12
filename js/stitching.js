/* =========================
   STITCHING MODULE
========================= */

// ===== DATA =====
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];

let editIndex = null;


/* =========================
   READY STOCK (FROM CUTTING)
========================= */
function getReadyStock() {

  let stock = {};

  // Cutting → add
  cuttingData.forEach(c => {
    c.skuData.forEach(s => {
      s.sizes.forEach(size => {
        let key = s.sku + " - " + size;

        if (!stock[key]) stock[key] = 0;

        stock[key] += s.qty;
      });
    });
  });

  // Stitching → minus
  stitchingData.forEach(st => {
    st.entries.forEach(e => {
      if (stock[e.item]) {
        stock[e.item] -= e.qty;
      }
    });
  });

  return stock;
}


/* =========================
   ADD ROW
========================= */
function addStitchRow(data = {}) {

  let stock = getReadyStock();

  let div = document.createElement("div");
  div.className = "row";

  div.innerHTML = `
    <select class="item">
      ${Object.keys(stock).map(k => `
        <option value="${k}" ${data.item === k ? "selected" : ""}>
          ${k} (Pending: ${stock[k]})
        </option>
      `).join("")}
    </select>

    <input type="number" class="qty" placeholder="Qty" value="${data.qty || ""}">

    <button onclick="this.parentElement.remove()" class="delete-btn">Remove</button>
  `;

  document.getElementById("entryContainer")?.appendChild(div);
}


/* =========================
   SAVE DATA
========================= */
function saveStitching() {

  let date = document.getElementById("date").value;
  let labour = document.getElementById("labour").value;

  let entries = [];
  let total = 0;

  document.querySelectorAll("#entryContainer .row").forEach(r => {

    let item = r.querySelector(".item").value;
    let qty = parseInt(r.querySelector(".qty").value);

    if (item && qty) {
      entries.push({ item, qty });
      total += qty;
    }
  });

  if (!date || !labour || entries.length === 0) {
    alert("Fill all fields");
    return;
  }

  let obj = { date, labour, entries, total };

  if (editIndex !== null) {
    stitchingData[editIndex] = obj;
    editIndex = null;
  } else {
    stitchingData.push(obj);
  }

  localStorage.setItem("stitchingData", JSON.stringify(stitchingData));

  renderStitchTable();
  clearStitchForm();
}


/* =========================
   TABLE RENDER
========================= */
function renderStitchTable() {

  let tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  stitchingData.forEach((s, i) => {

    let row = `
      <tr onclick="toggleStitch(${i})">
        <td>${s.date}</td>
        <td>${s.labour}</td>
        <td>${s.total}</td>
        <td>
          <button onclick="event.stopPropagation(); editStitch(${i})">Edit</button>
          <button onclick="event.stopPropagation(); deleteStitch(${i})">Delete</button>
        </td>
      </tr>
    `;

    let drawer = `
      <tr id="stitch-${i}" style="display:none">
        <td colspan="4">
          ${s.entries.map(e => `${e.item} → ${e.qty}`).join("<br>")}
        </td>
      </tr>
    `;

    tbody.innerHTML += row + drawer;
  });
}


/* =========================
   TOGGLE DETAILS
========================= */
function toggleStitch(i) {

  let row = document.getElementById("stitch-" + i);

  if (!row) return;

  row.style.display =
    row.style.display === "none" ? "table-row" : "none";
}


/* =========================
   EDIT
========================= */
function editStitch(i) {

  let s = stitchingData[i];
  editIndex = i;

  document.getElementById("date").value = s.date;
  document.getElementById("labour").value = s.labour;

  document.getElementById("entryContainer").innerHTML = "";

  s.entries.forEach(e => {
    addStitchRow(e);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================
   DELETE
========================= */
function deleteStitch(i) {

  if (confirm("Delete?")) {

    stitchingData.splice(i, 1);

    localStorage.setItem("stitchingData", JSON.stringify(stitchingData));

    renderStitchTable();
  }
}


/* =========================
   CLEAR FORM
========================= */
function clearStitchForm() {

  document.getElementById("date").value = "";
  document.getElementById("labour").value = "";

  document.getElementById("entryContainer").innerHTML = "";

  addStitchRow();
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("entryContainer")) {
    addStitchRow();
    renderStitchTable();
  }

});
