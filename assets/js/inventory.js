/* =========================
   Inventory Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadInventory();

        loadMovementHistory();

        calculateSummary();

    }
);

/* =========================
   Add Inventory Row
   ========================= */

function addInventoryRow(){

    const tbody =
    document.getElementById(
        "inventoryBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "inventory-row"
    );

    row.innerHTML =

    `
    <td>
        <input type="text" class="sku">
    </td>

    <td>
        <input type="text" class="style">
    </td>

    <td>
        <select class="size">
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
        </select>
    </td>

    <td>
        <input type="number"
        class="stock"
        value="0">
    </td>

    <td>
        <input type="number"
        class="mrp"
        value="0">
    </td>

    <td>
        <input type="number"
        class="value"
        value="0"
        readonly>
    </td>

    <td class="status">
        -
    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="deleteRow(this)">
        Delete
        </button>

    </td>
    `;

    tbody.appendChild(row);

    attachInventoryEvents(row);

}

/* =========================
   Row Events
   ========================= */

function attachInventoryEvents(row){

    row.querySelector(".stock")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

    row.querySelector(".mrp")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

}

/* =========================
   Row Calculation
   ========================= */

function calculateRow(row){

    const stock =
    parseFloat(
        row.querySelector(".stock").value
    ) || 0;

    const mrp =
    parseFloat(
        row.querySelector(".mrp").value
    ) || 0;

    const value =
    stock * mrp;

    row.querySelector(".value").value =
    value.toFixed(2);

    const statusCell =
    row.querySelector(".status");

    if(stock <= 10){

        statusCell.innerHTML =
        `<span class="stock-low">
        Low
        </span>`;

    }

    else if(stock <= 30){

        statusCell.innerHTML =
        `<span class="stock-medium">
        Medium
        </span>`;

    }

    else{

        statusCell.innerHTML =
        `<span class="stock-good">
        Good
        </span>`;

    }

    calculateSummary();

}

/* =========================
   Summary Calculation
   ========================= */

function calculateSummary(){

    let totalSku = 0;

    let totalStock = 0;

    let lowStock = 0;

    let inventoryValue = 0;

    document
    .querySelectorAll(
        "#inventoryBody tr"
    )
    .forEach(row=>{

        totalSku++;

        const stock =
        parseFloat(
            row.querySelector(".stock").value
        ) || 0;

        const value =
        parseFloat(
            row.querySelector(".value").value
        ) || 0;

        totalStock += stock;

        inventoryValue += value;

        if(stock <= 10){

            lowStock++;

        }

    });

    document.getElementById(
        "totalSku"
    ).innerText =
    totalSku;

    document.getElementById(
        "totalStock"
    ).innerText =
    totalStock;

    document.getElementById(
        "lowStock"
    ).innerText =
    lowStock;

    document.getElementById(
        "inventoryValue"
    ).innerText =
    "₹" +
    inventoryValue.toFixed(2);

}

/* =========================
   Load From Finished Goods
   ========================= */

function loadInventory(){

    const data =
    getStorage(
        "inventoryData"
    );

    const tbody =
    document.getElementById(
        "inventoryBody"
    );

    if(!data.length){

        return;

    }

    tbody.innerHTML = "";

    data.forEach(item=>{

        const row =
        document.createElement("tr");

        row.innerHTML =

        `
        <td>${item.sku}</td>

        <td>${item.styleName}</td>

        <td>Mixed</td>

        <td>
            ${item.totalPacked}
        </td>

        <td>
            0
        </td>

        <td>
            0
        </td>

        <td>

            <span class="stock-good">
            Good
            </span>

        </td>

        <td>

            <button
            class="btn btn-danger"
            onclick="deleteInventory(this)">
            Delete
            </button>

        </td>
        `;

        tbody.appendChild(row);

    });

    calculateSummary();

    loadInventoryHistory();

}

/* =========================
   Save Inventory
   ========================= */

function saveInventory(){

    const rows = [];

    document
    .querySelectorAll(
        "#inventoryBody tr"
    )
    .forEach(row=>{

        rows.push({

            sku:
            row.children[0].innerText ||
            row.querySelector(".sku")?.value,

            style:
            row.children[1].innerText ||
            row.querySelector(".style")?.value,

            stock:
            row.querySelector(".stock")
            ? row.querySelector(".stock").value
            : row.children[3].innerText

        });

    });

    setStorage(
        "inventoryMaster",
        rows
    );

    showToast(
        "Inventory Saved"
    );

}

/* =========================
   Delete Row
   ========================= */

function deleteRow(btn){

    btn.closest("tr").remove();

    calculateSummary();

}

/* =========================
   Delete Inventory
   ========================= */

function deleteInventory(btn){

    if(
        !confirm(
            "Delete Stock?"
        )
    ) return;

    btn.closest("tr").remove();

    calculateSummary();

}

/* =========================
   Inventory History
   ========================= */

function loadInventoryHistory(){

    const tbody =
    document.getElementById(
        "inventoryHistory"
    );

    const data =
    getStorage(
        "inventoryData"
    );

    if(!data.length){

        tbody.innerHTML=

        `
        <tr>
            <td colspan="6">
            No Record Found
            </td>
        </tr>
        `;

        return;

    }

    tbody.innerHTML =

    data.map(item=>`

    <tr>

        <td>${item.sku}</td>

        <td>${item.styleName}</td>

        <td>${item.totalPacked}</td>

        <td>0</td>

        <td>Available</td>

        <td>

            <button
            class="btn btn-primary">
            View
            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   Movement History
   ========================= */

function loadMovementHistory(){

    const tbody =
    document.getElementById(
        "movementHistory"
    );

    const data =
    getStorage(
        "stockMovement"
    );

    if(!data.length){

        return;

    }

    tbody.innerHTML =

    data.map(item=>`

    <tr>

        <td>${item.date}</td>

        <td>${item.sku}</td>

        <td>${item.type}</td>

        <td>${item.qty}</td>

        <td>${item.remark}</td>

    </tr>

    `).join("");

}

/* =========================
   Search Inventory
   ========================= */

document
.getElementById(
    "inventorySearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value.toLowerCase();

        document
        .querySelectorAll(
            "#inventoryHistory tr"
        )
        .forEach(row=>{

            row.style.display =

            row.innerText
            .toLowerCase()
            .includes(search)

            ? ""

            : "none";

        });

    }
);

/* =========================
   Future Integration
   ========================= */

/*

Sales Module

Return Module

Barcode System

Google Sheets API

Apps Script Backend

Warehouse Module

Multi Location Stock

*/
