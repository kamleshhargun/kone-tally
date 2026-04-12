/* =========================
GLOBAL DATA (ONLY ONCE)
========================= */
let fabricData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];
let finishedData = JSON.parse(localStorage.getItem("finishedData")) || [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
let returnData = JSON.parse(localStorage.getItem("returnData")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

let editIndex = null;
let stitchEditIndex = null;
let finishedEditIndex = null;
let saleEditIndex = null;
let returnEditIndex = null;
let openDetails = null;

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", () => {
let savedPage = localStorage.getItem("activePage") || "dashboard";
loadLayout(savedPage);
setupKeyboard();
});

/* ================= LAYOUT ================= */
function loadLayout(defaultPage) {
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
  <div class="main"><div id="content"></div></div>
  `;

document.querySelectorAll(".menu a").forEach(a=>{
a.onclick = ()=>loadPage(a.dataset.page);
});

loadPage(defaultPage);
}

/* ================= ROUTER ================= */
function loadPage(page){

localStorage.setItem("activePage", page);
setActive(page);

let content = document.getElementById("content");
content.innerHTML = "";

/* ===== DASHBOARD ===== */
if(page==="dashboard"){
let totalStock = Object.values(inventory).reduce((a,b)=>a+b,0);

```
content.innerHTML = `
  <h2>Dashboard</h2>
  <div class="grid">
    <div class="card">Fabric ${fabricData.length}</div>
    <div class="card">Cutting ${cuttingData.length}</div>
    <div class="card">Stitching ${stitchingData.length}</div>
    <div class="card">Finished ${finishedData.length}</div>
    <div class="card">Sales ${salesData.length}</div>
    <div class="card">Stock ${totalStock}</div>
  </div>
`;
```

}

/* ===== FABRIC ===== */
if(page==="fabric"){
content.innerHTML = `       <h2>Fabric</h2>       <input id="party" placeholder="Party">       <input id="invoice" placeholder="Invoice">       <div id="fabricContainer"></div>       <button onclick="addFabricRow()">+ Add</button>       <button onclick="saveInvoice()">Save</button>       <table><tbody id="tableBody"></tbody></table>
    `;
addFabricRow();
renderFabricTable();
}

/* ===== CUTTING ===== */
if(page==="cutting"){
content.innerHTML = `       <h2>Cutting</h2>       <div id="cuttingContainer"></div>       <button onclick="addCuttingRow()">+ Add</button>       <button onclick="saveCutting()">Save</button>       <table><tbody id="cuttingTable"></tbody></table>
    `;
addCuttingRow();
renderCuttingTable();
}

/* ===== STITCHING ===== */
if(page==="stitching"){
content.innerHTML = `       <h2>Stitching</h2>       <input id="labour" placeholder="Labour">       <div id="entryContainer"></div>       <button onclick="addStitchRow()">+ Add</button>       <button onclick="saveStitching()">Save</button>       <table><tbody id="stitchTable"></tbody></table>
    `;
addStitchRow();
renderStitchTable();
}

/* ===== FINISHED ===== */
if(page==="finished"){
content.innerHTML = `       <h2>Finished</h2>       <select id="labourSelect" onchange="loadPending()"></select>       <div id="entryContainer"></div>       <button onclick="saveFinished()">Save</button>       <table><tbody id="finishedTable"></tbody></table>
    `;
loadLabours();
renderFinishedTable();
}

/* ===== SALES ===== */
if(page==="sales"){
content.innerHTML = `       <h2>Sales</h2>       <div id="productContainer"></div>       <button onclick="addSaleRow()">+ Add</button>       <button onclick="saveSale()">Save</button>       <table><tbody id="saleTable"></tbody></table>
    `;
addSaleRow();
renderSaleTable();
}

/* ===== RETURN ===== */
if(page==="return"){
content.innerHTML = `       <h2>Return</h2>       <div id="productContainer"></div>       <button onclick="addReturnRow()">+ Add</button>       <button onclick="saveReturn()">Save</button>       <table><tbody id="returnTable"></tbody></table>
    `;
addReturnRow();
renderReturnTable();
}

/* ===== SETTINGS ===== */
if(page==="settings"){
content.innerHTML = `<button onclick="clearAll()">Clear Data</button>`;
}
}

/* ================= COMMON ================= */
function setActive(page){
document.querySelectorAll(".menu a").forEach(a=>{
a.classList.toggle("active", a.dataset.page===page);
});
}

/* ================= FABRIC ================= */
function addFabricRow(){
let div=document.createElement("div");
div.innerHTML=`     <input class="fName" placeholder="Fabric">     <input class="fMeter" type="number" placeholder="Meter">     <input class="fRate" type="number" placeholder="Rate">
  `;
document.getElementById("fabricContainer").appendChild(div);
}

function saveInvoice(){
let party=document.getElementById("party").value;
let invoice=document.getElementById("invoice").value;

let fabrics=[];
document.querySelectorAll("#fabricContainer div").forEach(r=>{
let n=r.querySelector(".fName").value;
let m=+r.querySelector(".fMeter").value;
let r1=+r.querySelector(".fRate").value;
if(n&&m&&r1){
fabrics.push({n,m,r1});
inventory[n]=(inventory[n]||0)+m;
}
});

fabricData.push({party,invoice,fabrics});
localStorage.setItem("fabricInvoices",JSON.stringify(fabricData));
localStorage.setItem("inventory",JSON.stringify(inventory));

renderFabricTable();
}

function renderFabricTable(){
let tb=document.getElementById("tableBody");
if(!tb)return;
tb.innerHTML="";
fabricData.forEach((f,i)=>{
tb.innerHTML+=`<tr><td>${f.party}</td><td>${f.invoice}</td></tr>`;
});
}

/* ================= CUTTING ================= */
function addCuttingRow(){
let div=document.createElement("div");
div.innerHTML=`<input class="sku"><input class="qty">`;
document.getElementById("cuttingContainer").appendChild(div);
}

function saveCutting(){
cuttingData.push({test:1});
localStorage.setItem("cuttingData",JSON.stringify(cuttingData));
renderCuttingTable();
}

function renderCuttingTable(){
let tb=document.getElementById("cuttingTable");
if(!tb)return;
tb.innerHTML=cuttingData.length;
}

/* ================= STITCH ================= */
function addStitchRow(){
let div=document.createElement("div");
div.innerHTML=`<input class="item"><input class="qty">`;
document.getElementById("entryContainer").appendChild(div);
}

function saveStitching(){
stitchingData.push({test:1});
localStorage.setItem("stitchingData",JSON.stringify(stitchingData));
renderStitchTable();
}

function renderStitchTable(){
let tb=document.getElementById("stitchTable");
if(!tb)return;
tb.innerHTML=stitchingData.length;
}

/* ================= FINISHED ================= */
function loadLabours(){}
function loadPending(){}

function saveFinished(){
finishedData.push({test:1});
localStorage.setItem("finishedData",JSON.stringify(finishedData));
renderFinishedTable();
}

function renderFinishedTable(){
let tb=document.getElementById("finishedTable");
if(!tb)return;
tb.innerHTML=finishedData.length;
}

/* ================= SALES ================= */
function addSaleRow(){
let div=document.createElement("div");
div.innerHTML=`<input class="item"><input class="qty">`;
document.getElementById("productContainer").appendChild(div);
}

function saveSale(){
salesData.push({test:1});
localStorage.setItem("salesData",JSON.stringify(salesData));
renderSaleTable();
}

function renderSaleTable(){
let tb=document.getElementById("saleTable");
if(!tb)return;
tb.innerHTML=salesData.length;
}

/* ================= RETURN ================= */
function addReturnRow(){
let div=document.createElement("div");
div.innerHTML=`<input class="item"><input class="qty">`;
document.getElementById("productContainer").appendChild(div);
}

function saveReturn(){
returnData.push({test:1});
localStorage.setItem("returnData",JSON.stringify(returnData));
renderReturnTable();
}

function renderReturnTable(){
let tb=document.getElementById("returnTable");
if(!tb)return;
tb.innerHTML=returnData.length;
}

/* ================= CLEAR ================= */
function clearAll(){
if(confirm("Delete all?")){
localStorage.clear();
location.reload();
}
}

/* ================= KEYBOARD ================= */
function setupKeyboard(){
document.addEventListener("keydown",e=>{
if(e.altKey){
let pages=["dashboard","fabric","cutting","stitching","finished","sales","return","settings"];
let i=parseInt(e.key)-1;
if(pages[i]) loadPage(pages[i]);
}
});
}
