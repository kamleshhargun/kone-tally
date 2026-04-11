/* =========================
   SOUND SYSTEM
========================= */
const warningSound = new Audio("sounds/warning.mp3");
const successSound = new Audio("sounds/success.mp3");

function playWarning() {
  warningSound.currentTime = 0;
  warningSound.play();
}

function playSuccess() {
  successSound.currentTime = 0;
  successSound.play();
}

/* =========================
   CUSTOM POPUP
========================= */
function showAlert(msg) {
  playSuccess();

  let box = document.createElement("div");
  box.className = "popup";

  box.innerHTML = `
    <div class="popup-box">
      <h3>Kone Soft Tech says</h3>
      <p>${msg}</p>
      <button onclick="this.closest('.popup').remove()">OK</button>
    </div>
  `;

  document.body.appendChild(box);
}

function showConfirm(msg, callback) {
  playWarning();

  let box = document.createElement("div");
  box.className = "popup";

  box.innerHTML = `
    <div class="popup-box">
      <h3>Kone Soft Tech says</h3>
      <p>${msg}</p>
      <button onclick="confirmYes()">Yes</button>
      <button onclick="this.closest('.popup').remove()">No</button>
    </div>
  `;

  document.body.appendChild(box);

  window.confirmYes = function () {
    box.remove();
    callback();
  };
}

/* =========================
   INIT APP
========================= */
document.addEventListener("DOMContentLoaded", () => {

  let savedPage = localStorage.getItem("activePage") || "dashboard";
  loadLayout(savedPage);

  setupKeyboard();
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
    a.addEventListener("click", () => {
      loadPage(a.dataset.page);
    });
  });

  loadPage(defaultPage);
}

/* =========================
   PAGE ROUTER
========================= */
function loadPage(page) {

  localStorage.setItem("activePage", page);

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

  /* FABRIC */
  if (page === "fabric") {
    content.innerHTML = `
      <h2>Fabric Purchase</h2>

      <div class="row">
        <input id="date" type="date">
        <input id="party" placeholder="Party Name">
        <input id="invoice" placeholder="Invoice No">
        <input value="5" readonly>
      </div>

      <div id="fabricContainer"></div>

      <button onclick="addFabricRow()">+ Add Fabric</button>
      <button onclick="saveInvoice()">Save Invoice</button>

      <hr>

      <table>
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

    setTimeout(() => {
      document.getElementById("party").focus();
      setupFormEnterNavigation(); // 🔥 important
    }, 100);
  }

  /* OTHER PAGES SAME */
  if (page === "cutting") {
    content.innerHTML = `<h2>Cutting</h2><input id="cutQty"><button onclick="moveStock('fabric','cutting','cutQty')">Process</button>`;
  }

  if (page === "stitching") {
    content.innerHTML = `<h2>Stitching</h2><input id="stQty"><button onclick="moveStock('cutting','stitching','stQty')">Process</button>`;
  }

  if (page === "finished") {
    content.innerHTML = `<h2>Finished</h2><input id="finQty"><button onclick="moveStock('stitching','finished','finQty')">Complete</button>`;
  }

  if (page === "sales") {
    content.innerHTML = `<h2>Sales</h2><input id="saleQty"><button onclick="sellStock()">Sell</button>`;
  }

  if (page === "return") {
    content.innerHTML = `<h2>Return</h2><input id="retQty"><button onclick="returnStock()">Return</button>`;
  }

  if (page === "settings") {
    content.innerHTML = `<h2>Settings</h2><button onclick="clearAll()">Clear Data</button>`;
  }
}

/* =========================
   KEYBOARD SYSTEM
========================= */
function setupKeyboard() {

  const pages = ["dashboard","fabric","cutting","stitching","finished","sales","return","settings"];

  document.addEventListener("keydown", function(e) {

    if (e.altKey) {
      let index = parseInt(e.key) - 1;
      if (pages[index]) {
        e.preventDefault();
        loadPage(pages[index]);
      }
    }

    // ❌ IMPORTANT FIX: TAB only for page switch when NOT inside input
    if (e.key === "Tab" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();

      let current = localStorage.getItem("activePage") || "dashboard";
      let i = pages.indexOf(current);
      let next = pages[(i + 1) % pages.length];

      loadPage(next);
    }
  });
}

/* =========================
   ENTER NAVIGATION (NEW)
========================= */
function setupFormEnterNavigation() {

  const inputs = document.querySelectorAll("#content input");

  inputs.forEach((input, index) => {

    input.addEventListener("keydown", function(e) {

      if (e.key === "Enter") {
        e.preventDefault();

        if (e.shiftKey) {
          if (index > 0) inputs[index - 1].focus();
        } else {
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
          } else {
            saveInvoice();
          }
        }
      }
    });
  });
}

/* =========================
   INVENTORY (same)
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
  `;

  document.getElementById("fabricContainer").appendChild(div);
}

function saveInvoice() {

  let date = document.getElementById("date").value;
  let party = document.getElementById("party").value;
  let invoice = document.getElementById("invoice").value;

  if (fabricData.find(f => f.invoice === invoice && editIndex === null)) {
    return showAlert("Duplicate Invoice!");
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
    return showAlert("Fill all fields");
  }

  let gstAmount = subtotal * 0.05;
  let total = subtotal + gstAmount;

  let obj = { date, party, invoice, fabrics, subtotal, gstAmount, total };

  if (editIndex !== null) {
    fabricData[editIndex] = obj;
    editIndex = null;
  } else {
    fabricData.push(obj);
  }

  localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));

  showAlert("Saved Successfully");

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
        <td>${inv.subtotal.toFixed(2)}</td>
        <td>${inv.gstAmount.toFixed(2)}</td>
        <td>${inv.total.toFixed(2)}</td>
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
            `${f.name} | ${f.meter}m | ₹${f.rate} = ₹${f.amount}`
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

  inv.fabrics.forEach(f => addFabricRow(f.name, f.meter, f.rate));
}

function deleteInvoice(i) {
  showConfirm("Delete?", () => {
    fabricData.splice(i, 1);
    localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));
    renderFabricTable();
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
   CLEAR ALL
========================= */
function clearAll() {
  showConfirm("Clear all data?", () => {
    localStorage.clear();
    location.reload();
  });
}
