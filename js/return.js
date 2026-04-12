function renderReturnPage(){
let c=document.getElementById("content");
c.innerHTML=`     <h2>Return</h2>     <button onclick="saveReturn()">Test</button>
  `;
}

function saveReturn(){
returnData.push({test:1});
localStorage.setItem("returnData",JSON.stringify(returnData));
}
