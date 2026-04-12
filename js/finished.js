function renderFinishedPage(){
let c=document.getElementById("content");
c.innerHTML=`     <h2>Finished</h2>     <button onclick="saveFinished()">Test</button>
  `;
}

function saveFinished(){
finishedData.push({test:1});
localStorage.setItem("finishedData",JSON.stringify(finishedData));
}
