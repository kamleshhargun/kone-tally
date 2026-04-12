function renderCuttingPage(){
let c=document.getElementById("content");
c.innerHTML=`     <h2>Cutting</h2>     <button onclick="saveCutting()">Test</button>
  `;
}

function saveCutting(){
cuttingData.push({test:1});
localStorage.setItem("cuttingData",JSON.stringify(cuttingData));
}
