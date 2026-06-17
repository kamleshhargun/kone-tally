/* =========================
   KONE ERP Dashboard JS
   ========================= */

/* Dashboard Elements */

const fabricCount =
document.getElementById(
    "fabricCount"
);

const cuttingCount =
document.getElementById(
    "cuttingCount"
);

const stitchingCount =
document.getElementById(
    "stitchingCount"
);

const finishedCount =
document.getElementById(
    "finishedCount"
);

const inventoryCount =
document.getElementById(
    "inventoryCount"
);

const salesCount =
document.getElementById(
    "salesCount"
);

const activityTable =
document.getElementById(
    "activityTable"
);

/* =========================
   Dashboard Load
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);

/* =========================
   Load Dashboard
   ========================= */

function loadDashboard(){

    loadCounters();

    loadActivities();

    loadLowStock();

}

/* =========================
   Counters
   ========================= */

function loadCounters(){

    const fabric =
    getStorage(
        "fabricData"
    );

    const cutting =
    getStorage(
        "cuttingData"
    );

    const stitching =
    getStorage(
        "stitchingData"
    );

    const finished =
    getStorage(
        "finishedData"
    );

    const inventory =
    getStorage(
        "inventoryData"
    );

    const sales =
    getStorage(
        "salesData"
    );

    if(fabricCount){

        fabricCount.innerText =
        formatNumber(
            fabric.length
        );

    }

    if(cuttingCount){

        cuttingCount.innerText =
        formatNumber(
            cutting.length
        );

    }

    if(stitchingCount){

        stitchingCount.innerText =
        formatNumber(
            stitching.length
        );

    }

    if(finishedCount){

        finishedCount.innerText =
        formatNumber(
            finished.length
        );

    }

    if(inventoryCount){

        inventoryCount.innerText =
        formatNumber(
            inventory.length
        );

    }

    if(salesCount){

        salesCount.innerText =
        formatNumber(
            sales.length
        );

    }

}

/* =========================
   Activities
   ========================= */

function loadActivities(){

    if(!activityTable)
    return;

    const activities =
    getStorage(
        "activities"
    );

    if(
        activities.length === 0
    ){

        activityTable.innerHTML =

        `
        <tr>

            <td colspan="3">

                No Activity Found

            </td>

        </tr>
        `;

        return;

    }

    activityTable.innerHTML =

    activities
    .slice(0,10)
    .map(item =>

    `
    <tr>

        <td>

            ${formatDate(
                item.date
            )}

        </td>

        <td>

            ${item.module}

        </td>

        <td>

            ${item.description}

        </td>

    </tr>
    `

    ).join("");

}

/* =========================
   Low Stock
   ========================= */

function loadLowStock(){

    const inventory =
    getStorage(
        "inventoryData"
    );

    console.log(
        "Low Stock Items",
        inventory.filter(
            item =>
            item.stock <= 10
        )
    );

}

/* =========================
   Dashboard Refresh
   ========================= */

function refreshDashboard(){

    loadCounters();

    loadActivities();

    loadLowStock();

}

/* =========================
   Demo Data Generator
   ========================= */

function createDemoData(){

    setStorage(
        "fabricData",
        [
            {
                id:1,
                fabric:"Cotton"
            }
        ]
    );

    setStorage(
        "cuttingData",
        [
            {
                id:1
            }
        ]
    );

    setStorage(
        "stitchingData",
        [
            {
                id:1
            }
        ]
    );

    setStorage(
        "finishedData",
        [
            {
                id:1
            }
        ]
    );

    setStorage(
        "inventoryData",
        [
            {
                sku:"SKU001",
                stock:5
            },
            {
                sku:"SKU002",
                stock:50
            }
        ]
    );

    setStorage(
        "salesData",
        [
            {
                id:1
            }
        ]
    );

    addActivity(
        "System",
        "Demo Data Created"
    );

    refreshDashboard();

    showToast(
        "Demo Data Loaded"
    );

}

/* =========================
   Clear Demo Data
   ========================= */

function clearDemoData(){

    localStorage.removeItem(
        "fabricData"
    );

    localStorage.removeItem(
        "cuttingData"
    );

    localStorage.removeItem(
        "stitchingData"
    );

    localStorage.removeItem(
        "finishedData"
    );

    localStorage.removeItem(
        "inventoryData"
    );

    localStorage.removeItem(
        "salesData"
    );

    addActivity(
        "System",
        "Demo Data Cleared"
    );

    refreshDashboard();

    showToast(
        "Data Cleared",
        "warning"
    );

}

/* =========================
   Future Apps Script API
   ========================= */

/*

async function loadDashboard(){

    showLoader();

    try{

        const data =
        await api(
            "getDashboard"
        );

        updateCards(data);

    }
    catch(error){

        showToast(
            error.message,
            "error"
        );

    }

    hideLoader();

}

*/

/* =========================
   Ready
   ========================= */

console.log(
    "Dashboard Loaded"
);
