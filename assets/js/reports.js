/* =========================
   Reports Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboardKPIs();

        loadActivityLog();

        generateReport();

    }
);

/* =========================
   Generate Report
   ========================= */

function generateReport(){

    const reportType =
    document.getElementById(
        "reportType"
    ).value;

    let reportData = [];

    switch(reportType){

        case "sales":

            reportData =
            getSalesReport();

            break;

        case "inventory":

            reportData =
            getInventoryReport();

            break;

        case "returns":

            reportData =
            getReturnsReport();

            break;

        case "fabric":

            reportData =
            getStorage("fabricData");

            break;

        case "cutting":

            reportData =
            getStorage("cuttingData");

            break;

        case "stitching":

            reportData =
            getStorage("stitchingData");

            break;

        default:

            reportData =
            getCombinedReport();

    }

    renderReport(
        reportData
    );

}

/* =========================
   Combined Report
   ========================= */

function getCombinedReport(){

    return [

        ...getSalesReport(),

        ...getInventoryReport(),

        ...getReturnsReport()

    ];

}

/* =========================
   Sales Report
   ========================= */

function getSalesReport(){

    const sales =
    getStorage(
        "salesData"
    );

    return sales.map(item=>({

        date:
        item.invoiceDate,

        reference:
        item.invoiceNo,

        module:
        "Sales",

        details:
        item.customerName,

        amount:
        item.grandTotal

    }));

}

/* =========================
   Inventory Report
   ========================= */

function getInventoryReport(){

    const inventory =
    getStorage(
        "inventoryMaster"
    );

    return inventory.map(item=>({

        date:
        "-",

        reference:
        item.sku,

        module:
        "Inventory",

        details:
        item.style,

        amount:
        item.stock

    }));

}

/* =========================
   Returns Report
   ========================= */

function getReturnsReport(){

    const returns =
    getStorage(
        "returnsData"
    );

    return returns.map(item=>({

        date:
        item.returnDate,

        reference:
        item.returnNo,

        module:
        "Returns",

        details:
        item.customerName,

        amount:
        item.totalQty

    }));

}

/* =========================
   Render Report
   ========================= */

function renderReport(data){

    const tbody =
    document.getElementById(
        "reportTable"
    );

    if(!data.length){

        tbody.innerHTML =

        `
        <tr>

            <td colspan="5">

                No Data Available

            </td>

        </tr>
        `;

        return;

    }

    tbody.innerHTML =

    data.map(item=>`

    <tr>

        <td>${item.date}</td>

        <td>${item.reference}</td>

        <td>${item.module}</td>

        <td>${item.details}</td>

        <td>${item.amount}</td>

    </tr>

    `).join("");

}

/* =========================
   KPI Dashboard
   ========================= */

function loadDashboardKPIs(){

    const sales =
    getStorage(
        "salesData"
    );

    const inventory =
    getStorage(
        "inventoryMaster"
    );

    const returns =
    getStorage(
        "returnsData"
    );

    let totalSales = 0;

    sales.forEach(item=>{

        totalSales +=
        parseFloat(
            item.grandTotal
        ) || 0;

    });

    let inventoryValue = 0;

    inventory.forEach(item=>{

        inventoryValue +=

        parseInt(
            item.stock
        ) || 0;

    });

    document.getElementById(
        "totalSales"
    ).innerText =
    "₹" +
    totalSales.toFixed(2);

    document.getElementById(
        "totalOrders"
    ).innerText =
    sales.length;

    document.getElementById(
        "totalReturns"
    ).innerText =
    returns.length;

    document.getElementById(
        "inventoryValue"
    ).innerText =
    inventoryValue;

}

/* =========================
   Activity Log
   ========================= */

function loadActivityLog(){

    const activities =
    getStorage(
        "activityLog"
    );

    const container =
    document.getElementById(
        "activityLog"
    );

    if(!activities.length){

        container.innerHTML =

        `
        <div class="empty-state">

            No Activity Found

        </div>
        `;

        return;

    }

    container.innerHTML =

    activities.reverse()
    .map(item=>`

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
   Export CSV
   ========================= */

function exportExcel(){

    const rows =
    document.querySelectorAll(
        "#reportTable tr"
    );

    let csv = [];

    rows.forEach(row=>{

        const cols =
        row.querySelectorAll(
            "td"
        );

        let rowData = [];

        cols.forEach(col=>{

            rowData.push(
                col.innerText
            );

        });

        csv.push(
            rowData.join(",")
        );

    });

    const blob =
    new Blob(
        [csv.join("\n")],
        {
            type:
            "text/csv"
        }
    );

    const a =
    document.createElement(
        "a"
    );

    a.href =
    URL.createObjectURL(
        blob
    );

    a.download =
    "report.csv";

    a.click();

}

/* =========================
   Print Report
   ========================= */

function printReport(){

    window.print();

}

/* =========================
   Date Filter
   ========================= */

document
.getElementById(
    "fromDate"
)
?.addEventListener(
    "change",
    generateReport
);

document
.getElementById(
    "toDate"
)
?.addEventListener(
    "change",
    generateReport
);

document
.getElementById(
    "reportType"
)
?.addEventListener(
    "change",
    generateReport
);

/* =========================
   Future Ready
   ========================= */

/*

Profit Report

Expense Report

Fabric Analytics

Production Analytics

Google Sheets Reports

Apps Script Dashboard

Realtime Charts

*/
