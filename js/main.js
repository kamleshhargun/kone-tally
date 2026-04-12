/* GLOBAL DATA */
let fabricData = JSON.parse(localStorage.getItem("fabricInvoices")) || [];
let cuttingData = JSON.parse(localStorage.getItem("cuttingData")) || [];
let stitchingData = JSON.parse(localStorage.getItem("stitchingData")) || [];
let finishedData = JSON.parse(localStorage.getItem("finishedData")) || [];
let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
let returnData = JSON.parse(localStorage.getItem("returnData")) || [];
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
let savedPage = localStorage.getItem("activePage") || "dashboard";
loadLayout(savedPage);
setupKeyboard();
});

/* LAYOUT */
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

/* ROUTER */
function loadPage(page){
localStorage.setItem("activePage", page);
setActive(page);

let content = document.getElementById("content");
content.innerHTML = "";

if(page==="dashboard"){
let total = Object.values(inventory).reduce((a,b)=>a+b,0);
content.innerHTML = `<h2>Dashboard Stock: ${total}</h2>`;
}

if(page==="fabric") renderFabricPage();
if(page==="cutting") renderCuttingPage();
if(page==="stitching") renderStitchPage();
if(page==="finished") renderFinishedPage();
if(page==="sales") renderSalesPage();
if(page==="return") renderReturnPage();
if(page==="settings") content.innerHTML = `<button onclick="clearAll()">Clear</button>`;
}

/* ACTIVE */
function setActive(page){
document.querySelectorAll(".menu a").forEach(a=>{
a.classList.toggle("active", a.dataset.page===page);
});
}
