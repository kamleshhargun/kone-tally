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
   CUSTOM POPUP (KEYBOARD SUPPORT)
========================= */
function showAlert(msg) {
  playSuccess();

  let box = document.createElement("div");
  box.className = "popup";

  box.innerHTML = `
    <div class="popup-box">
      <h3>Kone Soft Tech says</h3>
      <p>${msg}</p>
      <button id="okBtn">OK</button>
    </div>
  `;

  document.body.appendChild(box);

  let ok = document.getElementById("okBtn");
  ok.focus();

  function close() {
    box.remove();
    document.removeEventListener("keydown", keyHandler);
  }

  ok.onclick = close;

  function keyHandler(e) {
    if (e.key === "Enter" || e.key === " ") close();
  }

  document.addEventListener("keydown", keyHandler);
}

function showConfirm(msg, callback) {
  playWarning();

  let box = document.createElement("div");
  box.className = "popup";

  box.innerHTML = `
    <div class="popup-box">
      <h3>Kone Soft Tech says</h3>
      <p>${msg}</p>
      <button id="yesBtn">Yes</button>
      <button id="noBtn">No</button>
    </div>
  `;

  document.body.appendChild(box);

  let yes = document.getElementById("yesBtn");
  let no = document.getElementById("noBtn");

  yes.focus();

  function close() {
    box.remove();
    document.removeEventListener("keydown", keyHandler);
  }

  yes.onclick = () => {
    close();
    callback();
  };

  no.onclick = close;

  function keyHandler(e) {
    if (e.key === "Enter") yes.click();
    if (e.key === "Escape") no.click();

    if (e.key === "Tab") {
      e.preventDefault();
      document.activeElement === yes ? no.focus() : yes.focus();
    }
  }

  document.addEventListener("keydown", keyHandler);
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
   LAYOUT
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

  /* DASHBOARD */
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

  /* FABRIC PAGE */
  if (page === "fabric") {
    content.innerHTML = `
      <h2>Fabric Purchase</h2>

      <div class="row">
        <input id="date" type="date">
        <input id="party" placeholder="Party Name">
        <input id="invoice" placeholder="Invoice No">
        <input value="5%" readonly>
      </div>

      <div id="fabricContainer"></div>

      <button tabindex="100" onclick="addFabricRow()">+ Add Fabric</button>
      <button tabindex="101" onclick="saveInvoice()">Save Invoice</button>

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

    setTimeout(() => {
      document.getElementById("party").focus();
      setupEnterNavigation();
    }, 100);
  }

  /* OTHER PAGES */
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
   KEYBOARD (ALT ONLY)
========================= */
function setupKeyboard() {
  const pages = ["dashboard","fabric","cutting","stitching","finished","sales","return","settings"];

  document.addEventListener("keydown", function(e) {
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
   ENTER NAVIGATION
========================= */
function setupEnterNavigation() {

  let inputs = document.querySelectorAll("#content input");

  inputs.forEach((inp, i) => {

    inp.addEventListener("keydown", function(e) {

      if (e.key === "Enter") {
        e.preventDefault();

        if (e.shiftKey) {
          if (i > 0) inputs[i - 1].focus();
        } else {
          if (i < inputs.length - 1) {
            inputs[i + 1].focus();
          } else {
            document.querySelector("[tabindex='101']").focus();
          }
        }
      }
    });
  });
}

/* =========================
   INVENTORY
========================= */
function getInventory() {
  return JSON.parse(localStorage.getItem("inventory")) || {
    fabric: 0, cutting: 0, stitching: 0, finished: 0
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
  div.className = "fabric-row";

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
    return showAlert("Duplicate Invoice!");
  }

  let fabrics = [];
  let subtotal = 0;

  document.querySelectorAll("#fabricContainer div").forEach(row => {

    let name = row.querySelector(".fName").value;
    let meter = +row.querySelector(".fMeter").value;
    let rate = +row.querySelector(".fRate").value;

    if (name && meter && rate) {
      let amount = meter * rate;
      fabrics.push({ name, meter, rate, amount });
      subtotal += amount;
    }
  });

  if (!party || !invoice || fabrics.length === 0) {
    return showAlert("Fill all fields");
  }

  let gst = subtotal * 0.05;
  let total = subtotal + gst;

  let obj = { date, party, invoice, fabrics, subtotal, gstAmount: gst, total };

  if (editIndex !== null) {
    fabricData[editIndex] = obj;
    editIndex = null;
  } else {
    fabricData.push(obj);
  }

  localStorage.setItem("fabricInvoices", JSON.stringify(fabricData));

  showAlert("Saved Successfully");

  document.getElementById("party").value = "";
  document.getElementById("invoice").value = "";
  document.getElementById("fabricContainer").innerHTML = "";
  addFabricRow();

  renderFabricTable();
}

function renderFabricTable() {

  let tb = document.getElementById("tableBody");
  if (!tb) return;

  tb.innerHTML = "";

  fabricData.forEach((d, i) => {

    let open = openDetails === i;

    tb.innerHTML += `
      <tr>
        <td>${d.date}</td>
        <td>${d.party}</td>
        <td>${d.invoice}</td>
        <td>${d.subtotal.toFixed(2)}</td>
        <td>${d.gstAmount.toFixed(2)}</td>
        <td>${d.total.toFixed(2)}</td>
        <td>
          <button onclick="editInvoice(${i})">Edit</button>
          <button onclick="deleteInvoice(${i})">Delete</button>
          <button onclick="toggleDetails(${i})">Details</button>
        </td>
      </tr>

      ${open ? `<tr><td colspan="7">
        ${d.fabrics.map(f =>
          `${f.name} | ${f.meter}m | ₹${f.rate} = ₹${f.amount}`
        ).join("<br>")}
      </td></tr>` : ""}
    `;
  });
}

function toggleDetails(i) {
  openDetails = openDetails === i ? null : i;
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
  showConfirm("Delete this invoice?", () => {
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
