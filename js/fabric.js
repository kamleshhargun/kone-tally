let editIndex=null;

function renderFabricPage(){
let content=document.getElementById("content");
content.innerHTML=`     <h2>Fabric</h2>     <div id="fabricContainer"></div>     <button onclick="addFabricRow()">+ Add</button>     <button onclick="saveInvoice()">Save</button>     <table><tbody id="tableBody"></tbody></table>
  `;
addFabricRow();
renderFabricTable();
}

function addFabricRow(){
let div=document.createElement("div");
div.innerHTML=`<input class="fName"><input class="fMeter"><input class="fRate">`;
document.getElementById("fabricContainer").appendChild(div);
}

function saveInvoice(){
fabricData.push({test:1});
localStorage.setItem("fabricInvoices",JSON.stringify(fabricData));
renderFabricTable();
}

function renderFabricTable(){
let tb=document.getElementById("tableBody");
if(!tb)return;
tb.innerHTML=fabricData.length;
}
