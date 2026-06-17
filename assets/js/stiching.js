/* =========================
   Stitching Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        addStitchingRow();

        loadStitchingHistory();

    }
);

/* =========================
   Add Row
   ========================= */

function addStitchingRow(){

    const tbody =
    document.getElementById(
        "stitchingBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "stitching-row"
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
        class="issued"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="completed"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="pending"
        value="0"
        readonly>

    </td>

    <td>

        <input
        type="number"
        class="rate"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="amount"
        value="0"
        readonly>

    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="removeStitchingRow(this)">
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

function removeStitchingRow(btn){

    btn.closest("tr").remove();

    calculateStitching();

}

/* =========================
   Row Events
   ========================= */

function attachRowEvents(row){

    row.querySelector(".issued")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

    row.querySelector(".completed")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

    row.querySelector(".rate")
    .addEventListener(
        "input",
        ()=>calculateRow(row)
    );

}

/* =========================
   Row Calculation
   ========================= */

function calculateRow(row){

    const issued =
    parseFloat(
        row.querySelector(
            ".issued"
        ).value
    ) || 0;

    const completed =
    parseFloat(
        row.querySelector(
            ".completed"
        ).value
    ) || 0;

    const rate =
    parseFloat(
        row.querySelector(
            ".rate"
        ).value
    ) || 0;

    const pending =
    issued - completed;

    const amount =
    completed * rate;

    row.querySelector(
        ".pending"
    ).value =
    pending > 0
    ? pending
    : 0;

    row.querySelector(
        ".amount"
    ).value =
    amount.toFixed(2);

    calculateStitching();

}

/* =========================
   Summary
   ========================= */

function calculateStitching(){

    let totalIssued = 0;
    let totalCompleted = 0;
    let totalPending = 0;
    let totalAmount = 0;

    document
    .querySelectorAll(
        "#stitchingBody tr"
    )
    .forEach(row=>{

        totalIssued +=
        parseFloat(
            row.querySelector(
                ".issued"
            ).value
        ) || 0;

        totalCompleted +=
        parseFloat(
            row.querySelector(
                ".completed"
            ).value
        ) || 0;

        totalPending +=
        parseFloat(
            row.querySelector(
                ".pending"
            ).value
        ) || 0;

        totalAmount +=
        parseFloat(
            row.querySelector(
                ".amount"
            ).value
        ) || 0;

    });

    document.getElementById(
        "totalIssued"
    ).innerText =
    totalIssued;

    document.getElementById(
        "totalCompleted"
    ).innerText =
    totalCompleted;

    document.getElementById(
        "totalPending"
    ).innerText =
    totalPending;

    document.getElementById(
        "totalAmount"
    ).innerText =
    "₹" +
    totalAmount.toFixed(2);

}

/* =========================
   Save Stitching
   ========================= */

function saveStitching(){

    const stitchingNo =
    document.getElementById(
        "stitchingNo"
    ).value;

    const stitchingDate =
    document.getElementById(
        "stitchingDate"
    ).value;

    const styleName =
    document.getElementById(
        "styleName"
    ).value;

    const karigarName =
    document.getElementById(
        "karigarName"
    ).value;

    if(!stitchingNo){

        showToast(
            "Stitching No Required",
            "error"
        );

        return;

    }

    const rows = [];

    document
    .querySelectorAll(
        "#stitchingBody tr"
    )
    .forEach(row=>{

        rows.push({

            size:
            row.querySelector(".size").value,

            issued:
            row.querySelector(".issued").value,

            completed:
            row.querySelector(".completed").value,

            pending:
            row.querySelector(".pending").value,

            rate:
            row.querySelector(".rate").value,

            amount:
            row.querySelector(".amount").value

        });

    });

    const stitchingData = {

        id:Date.now(),

        stitchingNo,

        stitchingDate,

        styleName,

        karigarName,

        totalIssued:
        document.getElementById(
            "totalIssued"
        ).innerText,

        totalCompleted:
        document.getElementById(
            "totalCompleted"
        ).innerText,

        totalPending:
        document.getElementById(
            "totalPending"
        ).innerText,

        totalAmount:
        document.getElementById(
            "totalAmount"
        ).innerText,

        rows

    };

    let data =
    getStorage(
        "stitchingData"
    );

    data.push(
        stitchingData
    );

    setStorage(
        "stitchingData",
        data
    );

    addActivity(
        "Stitching",
        "Production Saved"
    );

    showToast(
        "Stitching Saved"
    );

    loadStitchingHistory();

    clearStitchingForm();

}

/* =========================
   History
   ========================= */

function loadStitchingHistory(){

    const tbody =
    document.getElementById(
        "stitchingHistory"
    );

    const data =
    getStorage(
        "stitchingData"
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

        <td>${item.stitchingDate}</td>

        <td>${item.stitchingNo}</td>

        <td>${item.karigarName}</td>

        <td>${item.totalCompleted}</td>

        <td>${item.totalPending}</td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewStitching(${index})">
            View
            </button>

            <button
            class="btn btn-danger"
            onclick="deleteStitching(${index})">
            Delete
            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View
   ========================= */

function viewStitching(index){

    const data =
    getStorage(
        "stitchingData"
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

function deleteStitching(index){

    if(
        !confirm(
            "Delete Record?"
        )
    ) return;

    let data =
    getStorage(
        "stitchingData"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "stitchingData",
        data
    );

    loadStitchingHistory();

    showToast(
        "Record Deleted",
        "warning"
    );

}

/* =========================
   Clear Form
   ========================= */

function clearStitchingForm(){

    document.getElementById(
        "stitchingNo"
    ).value="";

    document.getElementById(
        "stitchingDate"
    ).value="";

    document.getElementById(
        "styleName"
    ).value="";

    document.getElementById(
        "karigarName"
    ).value="";

    document.getElementById(
        "stitchingBody"
    ).innerHTML="";

    addStitchingRow();

    calculateStitching();

}

/* =========================
   Print
   ========================= */

function printStitching(){

    window.print();

}

/* =========================
   Search
   ========================= */

document
.getElementById(
    "stitchingSearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value
        .toLowerCase();

        document
        .querySelectorAll(
            "#stitchingHistory tr"
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

Finished Goods Transfer

Inventory Update

Karigar Payment

Google Sheets API

Apps Script Backend

*/
