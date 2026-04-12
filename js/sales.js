function renderSalesPage(){
let c=document.getElementById("content");
c.innerHTML=`     <h2>Sales</h2>     <button onclick="saveSale()">Test</button>
  `;
}

function saveSale(){
salesData.push({test:1});
localStorage.setItem("salesData",JSON.stringify(salesData));
}
