/* =========================
   FULL ERP SINGLE FILE SYSTEM
========================= */

function loadLayout(defaultPage = "dashboard") {

  document.getElementById("app").innerHTML = `
    <div class="sidebar">
      <h2>ERP</h2>
      <div class="menu">
        <a onclick="loadPage('dashboard')">Dashboard</a>
        <a onclick="loadPage('fabric')">Fabric</a>
        <a onclick="loadPage('cutting')">Cutting</a>
        <a onclick="loadPage('stitching')">Stitching</a>
        <a onclick="loadPage('finished')">Finished</a>
        <a onclick="loadPage('sales')">Sales</a>
        <a onclick="loadPage('return')">Return</a>
        <a onclick="loadPage('settings')">Settings</a>
      </div>
    </div>

    <div class="main">
      <div id="content"></div>
    </div>
  `;

  loadPage(defaultPage);
}

/* =========================
   STORAGE
========================= */
function getData(k,d){return JSON.parse(localStorage.getItem(k))||d;}
function setData(k,d){localStorage.setItem(k,JSON.stringify(d));}

/* =========================
   ACTIVE MENU
========================= */
function setActive(page){
  document.querySelectorAll(".menu a").forEach(a=>{
    a.classList.remove("active");
    if(a.innerText.toLowerCase()===page) a.classList.add("active");
  });
}

/* =========================
   PAGE ROUTER
========================= */
function loadPage(page){

  let c = document.getElementById("content");
  setActive(page);

  /* ===== DASHBOARD ===== */
  if(page==="dashboard"){
    let inv=getData("inventory",{});
    let total=Object.values(inv).reduce((a,b)=>a+b,0);

    c.innerHTML=`
      <h2>Dashboard</h2>
      <div class="grid">
        <div class="card"><p>Inventory</p><h2>${total}</h2></div>
      </div>

      <table>
      <tr><th>Item</th><th>Stock</th></tr>
      ${Object.keys(inv).map(k=>`<tr><td>${k}</td><td>${inv[k]}</td></tr>`).join("")}
      </table>
    `;
  }

  /* ===== FABRIC ===== */
  if(page==="fabric"){
    c.innerHTML=`
      <h2>Fabric Purchase</h2>

      <input id="party" placeholder="Party">
      <input id="invoice" placeholder="Invoice">
      <input type="date" id="date">

      <div id="fabBox"></div>

      <button onclick="addFabric()">+ Add Fabric</button>
      <button onclick="saveFabric()">Save</button>

      <table>
        <tr><th>Party</th><th>Total</th></tr>
        <tbody id="fabTable"></tbody>
      </table>
    `;
    renderFabric();
  }

  /* ===== CUTTING ===== */
  if(page==="cutting"){
    c.innerHTML=`
      <h2>Cutting</h2>

      <input type="date" id="date">
      <button onclick="addCut()">+ Add</button>
      <div id="cutBox"></div>
      <button onclick="saveCut()">Save</button>

      <table><tbody id="cutTable"></tbody></table>
    `;
    renderCut();
  }

  /* ===== STITCHING ===== */
  if(page==="stitching"){
    c.innerHTML=`
      <h2>Stitching</h2>

      <input id="labour" placeholder="Labour">
      <input type="date" id="date">

      <div id="stitchBox"></div>
      <button onclick="addStitch()">+ Add</button>
      <button onclick="saveStitch()">Save</button>

      <table><tbody id="stitchTable"></tbody></table>
    `;
    renderStitch();
  }

  /* ===== FINISHED ===== */
  if(page==="finished"){
    c.innerHTML=`
      <h2>Finished</h2>

      <input type="date" id="date">
      <input id="labour" placeholder="Labour">

      <div id="finBox"></div>
      <button onclick="loadPending()">Load Pending</button>
      <button onclick="saveFinished()">Save</button>

      <table><tbody id="finTable"></tbody></table>
    `;
    renderFinished();
  }

  /* ===== SALES ===== */
  if(page==="sales"){
    c.innerHTML=`
      <h2>Sales</h2>

      <input type="date" id="date">
      <input id="order" placeholder="Order ID">

      <div id="saleBox"></div>
      <button onclick="addSale()">+ Add</button>
      <button onclick="saveSale()">Save</button>

      <table><tbody id="saleTable"></tbody></table>
    `;
    renderSales();
  }

  /* ===== RETURN ===== */
  if(page==="return"){
    c.innerHTML=`
      <h2>Return</h2>

      <input type="date" id="date">
      <div id="retBox"></div>

      <button onclick="addReturn()">+ Add</button>
      <button onclick="saveReturn()">Save</button>
    `;
  }

  /* ===== SETTINGS ===== */
  if(page==="settings"){
    c.innerHTML=`
      <h2>Settings</h2>
      <button onclick="localStorage.clear();alert('Cleared')">Clear Data</button>
    `;
  }
}

/* =========================
   FABRIC LOGIC
========================= */
function addFabric(){
  document.getElementById("fabBox").innerHTML+=`
    <input class="fName" placeholder="Fabric">
    <input class="fMeter" placeholder="Meter">
  `;
}

function saveFabric(){
  let data=getData("fabricData",[]);
  let total=0;

  document.querySelectorAll(".fMeter").forEach(i=>{
    total+=parseFloat(i.value||0);
  });

  data.push({total});
  setData("fabricData",data);
  renderFabric();
}

function renderFabric(){
  let data=getData("fabricData",[]);
  let t=document.getElementById("fabTable");
  if(!t)return;

  t.innerHTML=data.map(d=>`<tr><td>Party</td><td>${d.total}</td></tr>`).join("");
}

/* =========================
   CUTTING LOGIC
========================= */
function addCut(){
  document.getElementById("cutBox").innerHTML+=`
    <input class="cutQty" placeholder="Qty">
  `;
}

function saveCut(){
  let data=getData("cutData",[]);
  let total=0;

  document.querySelectorAll(".cutQty").forEach(i=>{
    total+=parseInt(i.value||0);
  });

  data.push({total});
  setData("cutData",data);
  renderCut();
}

function renderCut(){
  let data=getData("cutData",[]);
  let t=document.getElementById("cutTable");
  if(!t)return;

  t.innerHTML=data.map(d=>`<tr><td>${d.total}</td></tr>`).join("");
}

/* =========================
   STITCHING LOGIC
========================= */
function addStitch(){
  document.getElementById("stitchBox").innerHTML+=`
    <input class="stQty" placeholder="Qty">
  `;
}

function saveStitch(){
  let data=getData("stitchData",[]);
  let total=0;

  document.querySelectorAll(".stQty").forEach(i=>{
    total+=parseInt(i.value||0);
  });

  data.push({total});
  setData("stitchData",data);
  renderStitch();
}

function renderStitch(){
  let data=getData("stitchData",[]);
  let t=document.getElementById("stitchTable");
  if(!t)return;

  t.innerHTML=data.map(d=>`<tr><td>${d.total}</td></tr>`).join("");
}

/* =========================
   FINISHED + INVENTORY
========================= */
function saveFinished(){
  let inv=getData("inventory",{});
  inv["item"]=(inv["item"]||0)+10;
  setData("inventory",inv);
  alert("Added to inventory");
}

/* =========================
   SALES
========================= */
function addSale(){
  document.getElementById("saleBox").innerHTML+=`
    <input class="saleQty" placeholder="Qty">
  `;
}

function saveSale(){
  let inv=getData("inventory",{});
  document.querySelectorAll(".saleQty").forEach(i=>{
    inv["item"]=(inv["item"]||0)-parseInt(i.value||0);
  });
  setData("inventory",inv);
  alert("Sale saved");
}

/* =========================
   RETURN
========================= */
function addReturn(){
  document.getElementById("retBox").innerHTML+=`
    <input class="retQty" placeholder="Qty">
  `;
}

function saveReturn(){
  let inv=getData("inventory",{});
  document.querySelectorAll(".retQty").forEach(i=>{
    inv["item"]=(inv["item"]||0)+parseInt(i.value||0);
  });
  setData("inventory",inv);
  alert("Return added");
}
