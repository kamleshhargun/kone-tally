/* =========================
   Dashboard Final JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboardCards();

        loadRecentActivity();

        loadSyncStatus();

    }
);

/* =========================
   Dashboard Cards
   ========================= */

function loadDashboardCards(){

    const fabric =
    getStorage(
        "fabricData"
    ) || [];

    const cutting =
    getStorage(
        "cuttingData"
    ) || [];

    const stitching =
    getStorage(
        "stitchingData"
    ) || [];

    const finished =
    getStorage(
        "finishedData"
    ) || [];

    const inventory =
    getStorage(
        "inventoryMaster"
    ) || [];

    const sales =
    getStorage(
        "salesData"
    ) || [];

    const returns =
    getStorage(
        "returnsData"
    ) || [];

    document.getElementById(
        "fabricCount"
    ).innerText =
    fabric.length;

    document.getElementById(
        "cuttingCount"
    ).innerText =
    cutting.length;

    document.getElementById(
        "stitchingCount"
    ).innerText =
    stitching.length;

    document.getElementById(
        "finishedCount"
    ).innerText =
    finished.length;

    /* Inventory Qty */

    let totalInventory = 0;

    inventory.forEach(item=>{

        totalInventory +=
        parseInt(
            item.stock || 0
        );

    });

    document.getElementById(
        "inventoryCount"
    ).innerText =
    totalInventory;

    /* Sales Amount */

    let totalSales = 0;

    sales.forEach(item=>{

        totalSales +=
        parseFloat(
            item.grandTotal || 0
        );

    });

    document.getElementById(
        "salesAmount"
    ).innerText =
    "₹" +
    totalSales.toLocaleString(
        "en-IN"
    );

    document.getElementById(
        "returnsCount"
    ).innerText =
    returns.length;

}

/* =========================
   Recent Activity
   ========================= */

function loadRecentActivity(){

    const container =
    document.getElementById(
        "dashboardActivity"
    );

    const activities =
    getStorage(
        "activityLog"
    ) || [];

    if(!activities.length){

        container.innerHTML =

        `
        <div class="empty-state">

            No Activity Found

        </div>
        `;

        return;

    }

    const latest =
    activities
    .slice(-10)
    .reverse();

    container.innerHTML =

    latest.map(item=>`

    <div class="activity-item">

        <div class="activity-title">

            ${item.module}

        </div>

        <div>

            ${item.message}

        </div>

        <div class="activity-date">

            ${item.date}

        </div>

    </div>

    `).join("");

}

/* =========================
   Sync Status
   ========================= */

function loadSyncStatus(){

    const settings =
    getStorage(
        "erpSettings"
    );

    if(
        !settings ||
        !settings.scriptUrl
    ){

        console.log(
            "Apps Script Not Configured"
        );

        return;

    }

    console.log(
        "Apps Script Connected"
    );

}

/* =========================
   Refresh Dashboard
   ========================= */

function refreshDashboard(){

    loadDashboardCards();

    loadRecentActivity();

}

/* =========================
   Auto Refresh
   ========================= */

setInterval(

    ()=>{

        refreshDashboard();

    },

    30000

);

/* =========================
   KPI Helpers
   ========================= */

function getTodaySales(){

    const sales =
    getStorage(
        "salesData"
    ) || [];

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    return sales.filter(

        item =>

        item.invoiceDate ===
        today

    );

}

function getLowStockItems(){

    const inventory =
    getStorage(
        "inventoryMaster"
    ) || [];

    return inventory.filter(

        item =>

        parseInt(
            item.stock
        ) <= 10

    );

}

/* =========================
   Dashboard Alerts
   ========================= */

function loadAlerts(){

    const lowStock =
    getLowStockItems();

    if(lowStock.length){

        console.warn(

            "Low Stock Items",

            lowStock

        );

    }

}

/* =========================
   Future Ready
   ========================= */

/*

Realtime Dashboard

Google Sheet Live Sync

Charts.js Analytics

Production Trends

Top Selling Products

Profit Dashboard

Multi Warehouse

Multi User

*/
