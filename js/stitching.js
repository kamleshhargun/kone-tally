function renderStitchPage(){
let c=document.getElementById("content");
c.innerHTML=`     <h2>Stitching</h2>     <button onclick="saveStitching()">Test</button>
  `;
}

function saveStitching(){
stitchingData.push({test:1});
localStorage.setItem("stitchingData",JSON.stringify(stitchingData));
}
