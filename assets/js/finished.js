/* =========================
   Finished Goods JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addFinishedRow();

        loadFinishedHistory();

        generateSKU();

    }
);

/* =========================
   Add Row
   ========================= */

function addFinishedRow(){

    const tbody =
    document.getElementById(
        "finishedBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "finished-row"
    );

    row.innerHTML =

    `
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

        <input
        type="number"
        class="qty"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="pass"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="reject"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="packed"
        value="0"
        readonly>

    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="removeFinishedRow(this)">
        Delete
        </button>

    </td>
    `;

    tbody.appendChild(row);

    attachEvents(row);

}

/* =========================
   Remove Row
   ========================= */

function removeFinishedRow(btn){

    btn.closest("tr").remove();

    calculateFinished();

}

/* =========================
   Row Events
   ========================= */

function attachEvents(row){

    row.querySelector(".qty")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

    row.querySelector(".pass")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

    row.querySelector(".reject")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

}

/* =========================
   Row Calculation
   ========================= */

function calculateRow(row){

    const pass =
    parseFloat(
        row.querySelector(".pass").value
    ) || 0;

    const reject =
    parseFloat(
        row.querySelector(".reject").value
    ) || 0;

    const packed =
    pass - reject;

    row.querySelector(
        ".packed"
    ).value =
    packed > 0
    ? packed
    : 0;

    calculateFinished();

}

/* =========================
   Summary
   ========================= */

function calculateFinished(){

    let totalQty = 0;
    let totalPass = 0;
    let totalReject = 0;
    let totalPacked = 0;

    document
    .querySelectorAll(
        "#finishedBody tr"
    )
    .forEach(row=>{

        totalQty +=
        parseFloat(
            row.querySelector(".qty").value
        ) || 0;

        totalPass +=
        parseFloat(
            row.querySelector(".pass").value
        ) || 0;

        totalReject +=
        parseFloat(
            row.querySelector(".reject").value
        ) || 0;

        totalPacked +=
        parseFloat(
            row.querySelector(".packed").value
        ) || 0;

    });

    document.getElementById(
        "totalQty"
    ).innerText =
    totalQty;

    document.getElementById(
        "totalPass"
    ).innerText =
    totalPass;

    document.getElementById(
        "totalReject"
    ).innerText =
    totalReject;

    document.getElementById(
        "totalPacked"
    ).innerText =
    totalPacked;

}

/* =========================
   SKU Generator
   ========================= */

function generateSKU(){

    const skuField =
    document.getElementById(
        "sku"
    );

    if(!skuField) return;

    const sku =

    "SKU-" +

    Math.floor(
        Math.random() * 100000
    );

    skuField.value =
    sku;

}

/* =========================
   Save Finished
   ========================= */

function saveFinished(){

    const fgNo =
    document.getElementById(
        "fgNo"
    ).value;

    const fgDate =
    document.getElementById(
        "fgDate"
    ).value;

    const styleName =
    document.getElementById(
        "styleName"
    ).value;

    const sku =
    document.getElementById(
        "sku"
    ).value;

    if(!fgNo){

        showToast(
            "FG Number Required",
            "error"
        );

        return;

    }

    const rows = [];

    document
    .querySelectorAll(
        "#finishedBody tr"
    )
    .forEach(row=>{

        rows.push({

            size:
            row.querySelector(".size").value,

            qty:
            row.querySelector(".qty").value,

            pass:
            row.querySelector(".pass").value,

            reject:
            row.querySelector(".reject").value,

            packed:
            row.querySelector(".packed").value

        });

    });

    const entry = {

        id:Date.now(),

        fgNo,

        fgDate,

        styleName,

        sku,

        totalQty:
        document.getElementById(
            "totalQty"
        ).innerText,

        totalPass:
        document.getElementById(
            "totalPass"
        ).innerText,

        totalReject:
        document.getElementById(
            "totalReject"
        ).innerText,

        totalPacked:
        document.getElementById(
            "totalPacked"
        ).innerText,

        rows

    };

    let data =
    getStorage(
        "finishedData"
    );

    data.push(entry);

    setStorage(
        "finishedData",
        data
    );

    addActivity(
        "Finished Goods",
        "Entry Saved"
    );

    showToast(
        "Finished Goods Saved"
    );

    loadFinishedHistory();

    clearFinishedForm();

}

/* =========================
   Inventory Transfer
   ========================= */

function transferInventory(){

    const finishedData =
    getStorage(
        "finishedData"
    );

    setStorage(
        "inventoryData",
        finishedData
    );

    showToast(
        "Transferred To Inventory"
    );

}

/* =========================
   History
   ========================= */

function loadFinishedHistory(){

    const tbody =
    document.getElementById(
        "finishedHistory"
    );

    const data =
    getStorage(
        "finishedData"
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

        <td>${item.fgDate}</td>

        <td>${item.fgNo}</td>

        <td>${item.styleName}</td>

        <td>${item.totalPacked}</td>

        <td>${item.sku}</td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewFinished(${index})">
            View
            </button>

            <button
            class="btn btn-danger"
            onclick="deleteFinished(${index})">
            Delete
            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View
   ========================= */

function viewFinished(index){

    const data =
    getStorage(
        "finishedData"
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

function deleteFinished(index){

    if(
        !confirm(
            "Delete Entry?"
        )
    ) return;

    let data =
    getStorage(
        "finishedData"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "finishedData",
        data
    );

    loadFinishedHistory();

    showToast(
        "Entry Deleted",
        "warning"
    );

}

/* =========================
   Clear Form
   ========================= */

function clearFinishedForm(){

    document.getElementById(
        "fgNo"
    ).value="";

    document.getElementById(
        "fgDate"
    ).value="";

    document.getElementById(
        "styleName"
    ).value="";

    document.getElementById(
        "finishedBody"
    ).innerHTML="";

    addFinishedRow();

    generateSKU();

    calculateFinished();

}

/* =========================
   Print
   ========================= */

function printFinished(){

    window.print();

}

/* =========================
   Search
   ========================= */

document
.getElementById(
    "finishedSearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value
        .toLowerCase();

        document
        .querySelectorAll(
            "#finishedHistory tr"
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
   Future Ready
   ========================= */

/*

Barcode Generator

Inventory Sync

Google Sheets API

Apps Script Backend

*/
