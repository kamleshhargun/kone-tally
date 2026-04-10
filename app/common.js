/* =========================
   LOAD FULL LAYOUT
========================= */

function loadLayout(defaultPage = "dashboard") {

  let container = document.getElementById("app");

  container.innerHTML = `
  
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
   LOAD PAGE CONTENT
========================= */

function loadPage(page) {

  let content = document.getElementById("content");

  setActive(page);

  if (page === "dashboard") {

    let inventory = getData("inventory", {});
    let total = Object.values(inventory).reduce((a,b)=>a+b,0);

    content.innerHTML = `
      <h2>Dashboard</h2>

      <div class="grid">
        <div class="card"><p>Inventory</p><h2>${total}</h2></div>
      </div>

      <table>
        <tr><th>Item</th><th>Stock</th></tr>
        ${Object.keys(inventory).map(k=>`
          <tr><td>${k}</td><td>${inventory[k]}</td></tr>
        `).join("")}
      </table>
    `;
  }


  if (page === "settings") {
    content.innerHTML = `
      <h2>Settings</h2>
      <button onclick="localStorage.clear(); alert('Data Cleared')">
        Clear All Data
      </button>
    `;
  }


  if (page === "fabric") {
    content.innerHTML = `<h2>Fabric Module (Add your UI)</h2>`;
  }

  if (page === "cutting") {
    content.innerHTML = `<h2>Cutting Module</h2>`;
  }

  if (page === "stitching") {
    content.innerHTML = `<h2>Stitching Module</h2>`;
  }

  if (page === "finished") {
    content.innerHTML = `<h2>Finished Module</h2>`;
  }

  if (page === "sales") {
    content.innerHTML = `<h2>Sales Module</h2>`;
  }

  if (page === "return") {
    content.innerHTML = `<h2>Return Module</h2>`;
  }

}


/* =========================
   ACTIVE MENU
========================= */

function setActive(page) {
  document.querySelectorAll(".menu a").forEach(a=>{
    a.classList.remove("active");

    if(a.innerText.toLowerCase() === page){
      a.classList.add("active");
    }
  });
}


/* =========================
   STORAGE HELPERS
========================= */

function getData(key, def=[]){
  return JSON.parse(localStorage.getItem(key)) || def;
}

function setData(key,data){
  localStorage.setItem(key, JSON.stringify(data));
}
