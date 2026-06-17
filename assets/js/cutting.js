/* =========================
   Cutting Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFabricOptions();

        addCuttingRow();

        loadCuttingHistory();

    }
);

/* =========================
   Add Row
   ========================= */

function addCuttingRow(){

    const tbody =
    document.getElementById(
        "cuttingBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "cutting-row"
    );

    row.innerHTML =

    `
    <td>

        <select
        class="size">

            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>

        </select>

    </td>

    <td>

        <input
        type="number"
        class="qty"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="consumption"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="meter"
        value="0"
        readonly>

    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="removeCuttingRow(this)">
        Delete
        </button>

    </td>
    `;

    tbody.appendChild(row);

    attachCuttingEvents(row);

}

/* =========================
   Remove Row
   ========================= */

function removeCuttingRow(btn){

    btn.closest("tr").remove();

    calculateCutting();

}

/* =========================
   Events
   ========================= */

function attachCuttingEvents(row){

    row.querySelector(".qty")
    .addEventListener(
        "input",
        () => calculateRow(row)
    );

    row.querySelector(".consumption")
    .addEventListener(
        "input",
        () => calculateRow(row)
    );

}

/* =========================
   Row Calculation
   ========================= */

function calculateRow(row){

    const qty =
    parseFloat(
        row.querySelector(
            ".qty"
        ).value
    ) || 0;

    const consumption =
    parseFloat(
        row.querySelector(
            ".consumption"
        ).value
    ) || 0;

    const meter =
    qty * consumption;

    row.querySelector(
        ".meter"
    ).value =
    meter.toFixed(2);

    calculateCutting();

}

/* =========================
   Summary
   ========================= */

function calculateCutting(){

    let totalQty = 0;

    let totalMeter = 0;

    document
    .querySelectorAll(
        "#cuttingBody tr"
    )
    .forEach(row=>{

        totalQty +=
        parseFloat(
            row.querySelector(
                ".qty"
            ).value
        ) || 0;

        totalMeter +=
        parseFloat(
            row.querySelector(
                ".meter"
            ).value
        ) || 0;

    });

    document.getElementById(
        "totalQty"
    ).innerText =
    totalQty;

    document.getElementById(
        "totalMeterUsed"
    ).innerText =
    totalMeter.toFixed(2);

    document.getElementById(
        "fabricBalance"
    ).innerText =
    "Pending";

}

/* =========================
   Fabric Dropdown
   ========================= */

function loadFabricOptions(){

    const select =
    document.getElementById(
        "fabricSelect"
    );

    if(!select) return;

    const purchases =
    getStorage(
        "fabricPurchases"
    );

    select.innerHTML =
    `<option value="">
        Select Fabric
    </option>`;

    purchases.forEach(item=>{

        item.rows.forEach(row=>{

            const option =
            document.createElement(
                "option"
            );

            option.value =
            row.fabric;

            option.textContent =
            row.fabric;

            select.appendChild(
                option
            );

        });

    });

}

/* =========================
   Save Cutting
   ========================= */

function saveCutting(){

    const cuttingNo =
    document.getElementById(
        "cuttingNo"
    ).value;

    const cuttingDate =
    document.getElementById(
        "cuttingDate"
    ).value;

    const styleName =
    document.getElementById(
        "styleName"
    ).value;

    const fabricName =
    document.getElementById(
        "fabricSelect"
    ).value;

    if(!cuttingNo){

        showToast(
            "Cutting No Required",
            "error"
        );

        return;

    }

    const rows = [];

    document
    .querySelectorAll(
        "#cuttingBody tr"
    )
    .forEach(row=>{

        rows.push({

            size:
            row.querySelector(
                ".size"
            ).value,

            qty:
            row.querySelector(
                ".qty"
            ).value,

            consumption:
            row.querySelector(
                ".consumption"
            ).value,

            meter:
            row.querySelector(
                ".meter"
            ).value

        });

    });

    const cuttingData = {

        id:Date.now(),

        cuttingNo,

        cuttingDate,

        styleName,

        fabricName,

        totalQty:
        document.getElementById(
            "totalQty"
        ).innerText,

        totalMeter:
        document.getElementById(
            "totalMeterUsed"
        ).innerText,

        rows

    };

    let data =
    getStorage(
        "cuttingData"
    );

    data.push(
        cuttingData
    );

    setStorage(
        "cuttingData",
        data
    );

    addActivity(
        "Cutting",
        "Cutting Saved"
    );

    showToast(
        "Cutting Saved"
    );

    loadCuttingHistory();

    clearCuttingForm();

}

/* =========================
   History
   ========================= */

function loadCuttingHistory(){

    const tbody =
    document.getElementById(
        "cuttingHistory"
    );

    const data =
    getStorage(
        "cuttingData"
    );

    if(data.length===0){

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

    data.map((item,index)=>`

    <tr>

        <td>
            ${item.cuttingDate}
        </td>

        <td>
            ${item.cuttingNo}
        </td>

        <td>
            ${item.styleName}
        </td>

        <td>
            ${item.totalQty}
        </td>

        <td>
            ${item.totalMeter}
        </td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewCutting(${index})">
            View
            </button>

            <button
            class="btn btn-danger"
            onclick="deleteCutting(${index})">
            Delete
            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View
   ========================= */

function viewCutting(index){

    const data =
    getStorage(
        "cuttingData"
    );

    alert(
        JSON.stringify(
            data[index],
            null,
            2
        )
    );

}

/* =========================
   Delete
   ========================= */

function deleteCutting(index){

    if(
        !confirm(
            "Delete Cutting?"
        )
    ) return;

    let data =
    getStorage(
        "cuttingData"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "cuttingData",
        data
    );

    loadCuttingHistory();

    showToast(
        "Cutting Deleted",
        "warning"
    );

}

/* =========================
   Clear Form
   ========================= */

function clearCuttingForm(){

    document.getElementById(
        "cuttingNo"
    ).value = "";

    document.getElementById(
        "cuttingDate"
    ).value = "";

    document.getElementById(
        "styleName"
    ).value = "";

    document.getElementById(
        "cuttingBody"
    ).innerHTML = "";

    addCuttingRow();

    calculateCutting();

}

/* =========================
   Print
   ========================= */

function printCutting(){

    window.print();

}

/* =========================
   Search History
   ========================= */

document
.getElementById(
    "cuttingSearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value
        .toLowerCase();

        document
        .querySelectorAll(
            "#cuttingHistory tr"
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

Inventory Deduction

Stitching Transfer

Google Sheets API

Apps Script Integration

*/
