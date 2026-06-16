function getCount(key){

    const data = JSON.parse(localStorage.getItem(key)) || [];

    return data.length;

}

document.getElementById("fabricCount").innerText =
getCount("fabricInvoices");

document.getElementById("cuttingCount").innerText =
getCount("cuttingData");

document.getElementById("stitchingCount").innerText =
getCount("stitchingData");

document.getElementById("finishedCount").innerText =
getCount("finishedData");

document.getElementById("salesCount").innerText =
getCount("salesData");

document.getElementById("returnCount").innerText =
getCount("returnData");
