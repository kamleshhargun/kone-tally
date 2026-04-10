/* =========================
   KONE SINGLE FILE SYSTEM
========================= */

// ==========================
// INIT LAYOUT
// ==========================
function initLayout(defaultPage = "dashboard") {

document.getElementById("app").innerHTML = `
   <div class="sidebar">
      <h2>ERP</h2>
      <h2>KONE</h2>
     <div class="menu">
       <a onclick="loadPage(event,'dashboard')">Dashboard</a>
       <a onclick="loadPage(event,'fabric')">Fabric</a>
       <a onclick="loadPage(event,'cutting')">Cutting</a>
       <a onclick="loadPage(event,'stitching')">Stitching</a>
       <a onclick="loadPage(event,'finished')">Finished</a>
       <a onclick="loadPage(event,'sales')">Sales</a>
       <a onclick="loadPage(event,'return')">Return</a>
       <a onclick="loadPage(event,'settings')">Settings</a>
     </div>
   </div>

   <div class="main">
     <div id="content"></div>
   </div>
`;

loadPage(null, defaultPage);
}


// ==========================
// STORAGE
// ==========================
let purchaseData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];
let finishedData = JSON.parse(localStorage.getItem("finishedData")) || [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
let returnData = JSON.parse(localStorage.getItem("returnData")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};


// ==========================
// PAGE LOAD
// ==========================
function loadPage(e, page){

  let c = document.getElementById("content");

  if(e){
    document.querySelectorAll(".menu a").forEach(a=>a.classList.remove("active"));
    e.target.classList.add("active");
  }


// ==========================
// DASHBOARD
// ==========================
if(page==="dashboard"){
c.innerHTML=`
<h2>Dashboard</h2>

<div class="grid">
<div class="card"><p>Cutting</p><h2 id="cut"></h2></div>
<div class="card"><p>Stitching</p><h2 id="st"></h2></div>
<div class="card"><p>Sales</p><h2 id="sa"></h2></div>
<div class="card"><p>Inventory</p><h2 id="inv"></h2></div>
</div>

<table>
<thead><tr><th>Item</th><th>Stock</th></tr></thead>
<tbody id="stock"></tbody>
</table>
`;

document.getElementById("cut").innerText =
cuttingData.reduce((a,b)=>a+(b.rows?.length||0),0);

document.getElementById("st").innerText =
stitchingData.reduce((a,b)=>a+(b.entries?.length||0),0);

document.getElementById("sa").innerText =
salesData.length;

let inv=0;
for(let k in inventory) inv+=inventory[k];
document.getElementById("inv").innerText=inv;

let t=document.getElementById("stock");
t.innerHTML="";
for(let k in inventory){
t.innerHTML+=`<tr><td>${k}</td><td>${inventory[k]}</td></tr>`;
}
}


// ==========================
// FABRIC
// ==========================
if(page==="fabric"){
c.innerHTML=`
<h2>Fabric</h2>
<input id="party" placeholder="Party">
<input id="invoice" placeholder="Invoice">

<button onclick="addFabric()">+ Add</button>
<div id="box"></div>

<button onclick="saveFabric()">Save</button>
`;
}


// ==========================
// CUTTING
// ==========================
if(page==="cutting"){
c.innerHTML=`
<h2>Cutting</h2>
<button onclick="addCut()">+ Add</button>
<div id="cutBox"></div>
<button onclick="saveCut()">Save</button>
`;
}


// ==========================
// STITCHING
// ==========================
if(page==="stitching"){
c.innerHTML=`
<h2>Stitching</h2>
<button onclick="addStitch()">+ Add</button>
<div id="stBox"></div>
<button onclick="saveStitch()">Save</button>
`;
}


// ==========================
// FINISHED
// ==========================
if(page==="finished"){
c.innerHTML=`
<h2>Finished</h2>
<button onclick="addFinish()">+ Add</button>
<div id="finBox"></div>
<button onclick="saveFinish()">Save</button>
`;
}


// ==========================
// SALES
// ==========================
if(page==="sales"){
c.innerHTML=`
<h2>Sales</h2>
<button onclick="addSale()">+ Add</button>
<div id="saleBox"></div>
<button onclick="saveSale()">Save</button>
`;
}


// ==========================
// RETURN
// ==========================
if(page==="return"){
c.innerHTML=`
<h2>Return</h2>
<button onclick="addReturn()">+ Add</button>
<div id="retBox"></div>
<button onclick="saveReturn()">Save</button>
`;
}


// ==========================
// SETTINGS
// ==========================
if(page==="settings"){
c.innerHTML=`
<h2>Settings</h2>
<button onclick="resetData()">Reset All Data</button>
`;
}

}


// ==========================
// FABRIC LOGIC
// ==========================
function addFabric(){
let d=document.createElement("div");
d.innerHTML=`
<input class="name" placeholder="Fabric">
<input class="meter" placeholder="Meter">
<input class="rate" placeholder="Rate">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("box").appendChild(d);
}

function saveFabric(){

let fabrics=[];

document.querySelectorAll("#box div").forEach(r=>{
let name=r.querySelector(".name").value;
let meter=parseFloat(r.querySelector(".meter").value);

if(name && meter){
fabrics.push({name,meter});
}
});

if(fabrics.length===0){alert("Fill");return;}

purchaseData.push({fabrics});
localStorage.setItem("fabricInvoices",JSON.stringify(purchaseData));

alert("Saved ✅");
}


// ==========================
// RESET
// ==========================
function resetData(){
if(confirm("Reset All Data?")){
localStorage.clear();
location.reload();
}
}


// ==========================
// AUTO START
// ==========================
window.onload = function(){
initLayout();
};
