
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
function loadLayout(){
  loadPage("dashboard");
}

function loadPage(page){
  let c = document.getElementById("content");

  document.querySelectorAll(".menu a").forEach(a=>a.classList.remove("active"));
  event.target.classList.add("active");


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

<table><thead><tr><th>Item</th><th>Stock</th></tr></thead>
<tbody id="stock"></tbody></table>
`;

document.getElementById("cut").innerText =
cuttingData.reduce((a,b)=>a+(b.totalPcs||0),0);

document.getElementById("st").innerText =
stitchingData.reduce((a,b)=>a+(b.total||0),0);

document.getElementById("sa").innerText =
salesData.reduce((a,b)=>a+(b.total||0),0);

let inv=0;
for(let k in inventory) inv+=inventory[k];
document.getElementById("inv").innerText=inv;

let t=document.getElementById("stock");
for(let k in inventory){
t.innerHTML+=`<tr><td>${k}</td><td>${inventory[k]}</td></tr>`;
}
}


// ==========================
// FABRIC PURCHASE
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
}


// ==========================
// CUTTING (FABRIC → SKU)
// ==========================
function getFabricStock(){
let s={};

purchaseData.forEach(p=>{
p.fabrics.forEach(f=>{
if(!s[f.name]) s[f.name]=0;
s[f.name]+=f.meter;
});
});

cuttingData.forEach(c=>{
c.rows.forEach(r=>{
if(s[r.fabric]) s[r.fabric]-=r.meter;
});
});

return s;
}

function addCut(){
let stock=getFabricStock();

let d=document.createElement("div");
d.innerHTML=`
<select class="fabric">
${Object.keys(stock).map(f=>`<option>${f}</option>`)}
</select>
<input class="sku" placeholder="SKU">
<input class="qty" placeholder="Qty">
<input class="meter" placeholder="Meter">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("cutBox").appendChild(d);
}

function saveCut(){

let rows=[];

document.querySelectorAll("#cutBox div").forEach(r=>{
let fabric=r.querySelector(".fabric").value;
let sku=r.querySelector(".sku").value;
let qty=parseInt(r.querySelector(".qty").value);
let meter=parseFloat(r.querySelector(".meter").value);

if(fabric && sku && qty && meter){
rows.push({fabric,sku,qty,meter});
}
});

cuttingData.push({rows});
localStorage.setItem("cuttingData",JSON.stringify(cuttingData));
}


// ==========================
// STITCHING (SKU PENDING)
// ==========================
function getPendingSKU(){

let s={};

cuttingData.forEach(c=>{
c.rows.forEach(r=>{
if(!s[r.sku]) s[r.sku]=0;
s[r.sku]+=r.qty;
});
});

stitchingData.forEach(st=>{
st.entries.forEach(e=>{
if(s[e.item]) s[e.item]-=e.qty;
});
});

return s;
}

function addStitch(){
let stock=getPendingSKU();

let d=document.createElement("div");
d.innerHTML=`
<select class="item">
${Object.keys(stock).map(k=>`<option>${k}</option>`)}
</select>
<input class="qty">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("stBox").appendChild(d);
}

function saveStitch(){

let entries=[];

document.querySelectorAll("#stBox div").forEach(r=>{
let item=r.querySelector(".item").value;
let qty=parseInt(r.querySelector(".qty").value);

if(item && qty){
entries.push({item,qty});
}
});

stitchingData.push({entries});
localStorage.setItem("stitchingData",JSON.stringify(stitchingData));
}


// ==========================
// FINISHED (INVENTORY ADD)
// ==========================
function getPendingFinish(){

let s={};

stitchingData.forEach(st=>{
st.entries.forEach(e=>{
if(!s[e.item]) s[e.item]=0;
s[e.item]+=e.qty;
});
});

finishedData.forEach(f=>{
f.entries.forEach(e=>{
if(s[e.item]) s[e.item]-=e.qty;
});
});

return s;
}

function addFinish(){
let stock=getPendingFinish();

let d=document.createElement("div");
d.innerHTML=`
<select class="item">
${Object.keys(stock).map(k=>`<option>${k}</option>`)}
</select>
<input class="qty">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("finBox").appendChild(d);
}

function saveFinish(){

let entries=[];

document.querySelectorAll("#finBox div").forEach(r=>{
let item=r.querySelector(".item").value;
let qty=parseInt(r.querySelector(".qty").value);

if(item && qty){
entries.push({item,qty});

if(!inventory[item]) inventory[item]=0;
inventory[item]+=qty;
}
});

finishedData.push({entries});

localStorage.setItem("finishedData",JSON.stringify(finishedData));
localStorage.setItem("inventory",JSON.stringify(inventory));
}


// ==========================
// SALES (INVENTORY MINUS)
// ==========================
function addSale(){
let d=document.createElement("div");
d.innerHTML=`
<select class="item">
${Object.keys(inventory).map(i=>`<option>${i}</option>`)}
</select>
<input class="qty">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("saleBox").appendChild(d);
}

function saveSale(){

let items=[];

document.querySelectorAll("#saleBox div").forEach(r=>{
let item=r.querySelector(".item").value;
let qty=parseInt(r.querySelector(".qty").value);

if(item && qty){
items.push({item,qty});
inventory[item]-=qty;
}
});

salesData.push({items});

localStorage.setItem("salesData",JSON.stringify(salesData));
localStorage.setItem("inventory",JSON.stringify(inventory));
}


// ==========================
// RETURN (ADD BACK)
// ==========================
function addReturn(){
let d=document.createElement("div");
d.innerHTML=`
<select class="item">
${Object.keys(inventory).map(i=>`<option>${i}</option>`)}
</select>
<input class="qty">
<button onclick="this.parentElement.remove()">X</button>`;
document.getElementById("retBox").appendChild(d);
}

function saveReturn(){

document.querySelectorAll("#retBox div").forEach(r=>{
let item=r.querySelector(".item").value;
let qty=parseInt(r.querySelector(".qty").value);

if(item && qty){
inventory[item]+=qty;
}
});

localStorage.setItem("inventory",JSON.stringify(inventory));
}


// ==========================
// SETTINGS
// ==========================
function resetData(){
if(confirm("Reset All Data?")){
localStorage.clear();
location.reload();
}
}
