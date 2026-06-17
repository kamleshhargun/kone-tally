/* =========================
   Fabric Module JS
   ========================= */

let fabricPurchases = [];
let editIndex = -1;

/* =========================
   Init
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addFabricRow();

        loadPurchaseHistory();

        document
        .getElementById("gst")
        ?.addEventListener(
            "input",
            calculateSummary
        );

    }
);

/* =========================
   Add Fabric Row
   ========================= */

function addFabricRow(){

    const tbody =
    document.getElementById(
        "fabricBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "fabric-row"
    );

    row.innerHTML =

    `
    <td>
        <input type="text"
        class="fabric-name">
    </td>

    <td>
        <input type="text"
        class="fabric-color">
    </td>

    <td>
        <input type="number"
        class="fabric-gsm">
    </td>

    <td>
        <input type="text"
        class="fabric-width">
    </td>

    <td>
        <input type="text"
        class="fabric-roll">
    </td>

    <td>
        <input type="number"
        class="fabric-meter"
        value="0">
    </td>

    <td>
        <input type="number"
        class="fabric-rate"
        value="0">
    </td>

    <td>
        <input type="number"
        class="fabric-amount"
        readonly
        value="0">
    </td>

    <td>
        <button
        class="btn btn-danger"
        onclick="removeRow(this)">
        Delete
        </button>
    </td>
    `;

    tbody.appendChild(row);

    attachRowEvents(row);

}

/* =========================
   Remove Row
   ========================= */

function removeRow(button){

    button
    .closest("tr")
    .remove();

    calculateSummary();

}

/* =========================
   Row Events
   ========================= */

function attachRowEvents(row){

    const meter =
    row.querySelector(
        ".fabric-meter"
    );

    const rate =
    row.querySelector(
        ".fabric-rate"
    );

    meter.addEventListener(
        "input",
        () => calculateRow(row)
    );

    rate.addEventListener(
        "input",
        () => calculateRow(row)
    );

}

/* =========================
   Row Calculation
   ========================= */

function calculateRow(row){

    const meter =
    parseFloat(
        row.querySelector(
            ".fabric-meter"
        ).value
    ) || 0;

    const rate =
    parseFloat(
        row.querySelector(
            ".fabric-rate"
        ).value
    ) || 0;

    const amount =
    meter * rate;

    row.querySelector(
        ".fabric-amount"
    ).value =
    amount.toFixed(2);

    calculateSummary();

}

/* =========================
   Summary Calculation
   ========================= */

function calculateSummary(){

    let totalMeter = 0;
    let subtotal = 0;

    document
    .querySelectorAll(
        "#fabricBody tr"
    )
    .forEach(row => {

        const meter =
        parseFloat(
            row.querySelector(
                ".fabric-meter"
            ).value
        ) || 0;

        const amount =
        parseFloat(
            row.querySelector(
                ".fabric-amount"
            ).value
        ) || 0;

        totalMeter += meter;
        subtotal += amount;

    });

    const gstPercent =
    parseFloat(
        document.getElementById(
            "gst"
        ).value
    ) || 0;

    const gstAmount =
    subtotal *
    gstPercent / 100;

    const grandTotal =
    subtotal + gstAmount;

    document.getElementById(
        "totalMeter"
    ).innerText =
    totalMeter.toFixed(2);

    document.getElementById(
        "subTotal"
    ).innerText =
    "₹" +
    subtotal.toFixed(2);

    document.getElementById(
        "gstAmount"
    ).innerText =
    "₹" +
    gstAmount.toFixed(2);

    document.getElementById(
        "grandTotal"
    ).innerText =
    "₹" +
    grandTotal.toFixed(2);

}

/* =========================
   Save Purchase
   ========================= */

function saveFabric(){

    const partyName =
    document.getElementById(
        "partyName"
    ).value;

    const supplierName =
    document.getElementById(
        "supplierName"
    ).value;

    const invoiceNo =
    document.getElementById(
        "invoiceNo"
    ).value;

    const purchaseDate =
    document.getElementById(
        "purchaseDate"
    ).value;

    const gst =
    document.getElementById(
        "gst"
    ).value;

    if(!partyName){

        showToast(
            "Party Name Required",
            "error"
        );

        return;
    }

    const rows = [];

    document
    .querySelectorAll(
        "#fabricBody tr"
    )
    .forEach(row => {

        rows.push({

            fabric:
            row.querySelector(
                ".fabric-name"
            ).value,

            color:
            row.querySelector(
                ".fabric-color"
            ).value,

            gsm:
            row.querySelector(
                ".fabric-gsm"
            ).value,

            width:
            row.querySelector(
                ".fabric-width"
            ).value,

            roll:
            row.querySelector(
                ".fabric-roll"
            ).value,

            meter:
            row.querySelector(
                ".fabric-meter"
            ).value,

            rate:
            row.querySelector(
                ".fabric-rate"
            ).value,

            amount:
            row.querySelector(
                ".fabric-amount"
            ).value

        });

    });

    const purchase = {

        id: Date.now(),

        partyName,

        supplierName,

        invoiceNo,

        purchaseDate,

        gst,

        totalMeter:
        document.getElementById(
            "totalMeter"
        ).innerText,

        grandTotal:
        document.getElementById(
            "grandTotal"
        ).innerText,

        rows

    };

    let data =
    getStorage(
        "fabricPurchases"
    );

    data.push(
        purchase
    );

    setStorage(
        "fabricPurchases",
        data
    );

    addActivity(
        "Fabric",
        "Purchase Saved"
    );

    showToast(
        "Purchase Saved"
    );

    clearForm();

    loadPurchaseHistory();

}

/* =========================
   Purchase History
   ========================= */

function loadPurchaseHistory(){

    const tbody =
    document.getElementById(
        "purchaseHistory"
    );

    const data =
    getStorage(
        "fabricPurchases"
    );

    if(data.length===0){

        tbody.innerHTML=

        `
        <tr>
            <td colspan="6">
                No Purchase Found
            </td>
        </tr>
        `;

        return;
    }

    tbody.innerHTML =

    data.map((item,index)=>`

    <tr>

        <td>
            ${item.purchaseDate}
        </td>

        <td>
            ${item.invoiceNo}
        </td>

        <td>
            ${item.partyName}
        </td>

        <td>
            ${item.totalMeter}
        </td>

        <td>
            ${item.grandTotal}
        </td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewPurchase(${index})">
            View
            </button>

            <button
            class="btn btn-danger"
            onclick="deletePurchase(${index})">
            Delete
            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View Purchase
   ========================= */

function viewPurchase(index){

    const data =
    getStorage(
        "fabricPurchases"
    );

    const purchase =
    data[index];

    alert(
        JSON.stringify(
            purchase,
            null,
            2
        )
    );

}

/* =========================
   Delete Purchase
   ========================= */

function deletePurchase(index){

    if(
        !confirm(
            "Delete Purchase?"
        )
    ) return;

    let data =
    getStorage(
        "fabricPurchases"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "fabricPurchases",
        data
    );

    loadPurchaseHistory();

    showToast(
        "Purchase Deleted",
        "warning"
    );

}

/* =========================
   Clear Form
   ========================= */

function clearForm(){

    document.getElementById(
        "partyName"
    ).value = "";

    document.getElementById(
        "supplierName"
    ).value = "";

    document.getElementById(
        "invoiceNo"
    ).value = "";

    document.getElementById(
        "purchaseDate"
    ).value = "";

    document.getElementById(
        "fabricBody"
    ).innerHTML = "";

    addFabricRow();

    calculateSummary();

}

/* =========================
   Print
   ========================= */

function printPurchase(){

    window.print();

}

/* =========================
   Search History
   ========================= */

document
.getElementById(
    "historySearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value
        .toLowerCase();

        document
        .querySelectorAll(
            "#purchaseHistory tr"
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
