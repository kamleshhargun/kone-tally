/* =========================
   Returns Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        generateReturnNo();

        loadReturnHistory();

        addReturnRow();

    }
);

/* =========================
   Return Number
   ========================= */

function generateReturnNo(){

    const returnNo =

    "RTN-" +

    Date.now()
    .toString()
    .slice(-6);

    document.getElementById(
        "returnNo"
    ).value =
    returnNo;

}

/* =========================
   Add Return Row
   ========================= */

function addReturnRow(){

    const tbody =
    document.getElementById(
        "returnsBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "return-row"
    );

    row.innerHTML =

    `
    <td>

        <input
        type="text"
        class="sku">

    </td>

    <td>

        <input
        type="text"
        class="product">

    </td>

    <td>

        <input
        type="number"
        class="qty"
        value="1">

    </td>

    <td>

        <select class="reason">

            <option>Size Issue</option>
            <option>Damage</option>
            <option>Wrong Product</option>
            <option>Quality Issue</option>
            <option>Other</option>

        </select>

    </td>

    <td>

        <select class="type">

            <option>Exchange</option>
            <option>Refund</option>
            <option>Damage</option>

        </select>

    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="removeReturnRow(this)">

        Delete

        </button>

    </td>
    `;

    tbody.appendChild(row);

    attachReturnEvents(row);

}

/* =========================
   Remove Row
   ========================= */

function removeReturnRow(btn){

    btn.closest("tr").remove();

    calculateReturns();

}

/* =========================
   Events
   ========================= */

function attachReturnEvents(row){

    row.querySelector(".qty")
    .addEventListener(
        "input",
        calculateReturns
    );

    row.querySelector(".type")
    .addEventListener(
        "change",
        calculateReturns
    );

}

/* =========================
   Summary Calculation
   ========================= */

function calculateReturns(){

    let totalQty = 0;

    let damageQty = 0;

    let exchangeQty = 0;

    document
    .querySelectorAll(
        "#returnsBody tr"
    )
    .forEach(row=>{

        const qty =
        parseInt(
            row.querySelector(".qty").value
        ) || 0;

        const type =
        row.querySelector(".type").value;

        totalQty += qty;

        if(type === "Damage"){

            damageQty += qty;

        }

        if(type === "Exchange"){

            exchangeQty += qty;

        }

    });

    document.getElementById(
        "returnQty"
    ).innerText =
    totalQty;

    document.getElementById(
        "damageQty"
    ).innerText =
    damageQty;

    document.getElementById(
        "exchangeQty"
    ).innerText =
    exchangeQty;

}

/* =========================
   Save Return
   ========================= */

function saveReturn(){

    const returnData = {

        returnNo:
        document.getElementById(
            "returnNo"
        ).value,

        returnDate:
        document.getElementById(
            "returnDate"
        ).value,

        invoiceNo:
        document.getElementById(
            "invoiceNo"
        ).value,

        customerName:
        document.getElementById(
            "customerName"
        ).value,

        totalQty:
        document.getElementById(
            "returnQty"
        ).innerText,

        items:[]
    };

    document
    .querySelectorAll(
        "#returnsBody tr"
    )
    .forEach(row=>{

        returnData.items.push({

            sku:
            row.querySelector(".sku").value,

            product:
            row.querySelector(".product").value,

            qty:
            row.querySelector(".qty").value,

            reason:
            row.querySelector(".reason").value,

            type:
            row.querySelector(".type").value

        });

    });

    let data =
    getStorage(
        "returnsData"
    );

    data.push(
        returnData
    );

    setStorage(
        "returnsData",
        data
    );

    loadReturnHistory();

    showToast(
        "Return Saved Successfully"
    );

    addActivity(
        "Returns",
        "Return Entry Saved"
    );

}

/* =========================
   Inventory Restock
   ========================= */

function restockInventory(){

    let inventory =
    getStorage(
        "inventoryMaster"
    );

    const returns =
    getStorage(
        "returnsData"
    );

    if(!returns.length){

        showToast(
            "No Return Found",
            "warning"
        );

        return;

    }

    const latest =
    returns[
        returns.length - 1
    ];

    latest.items.forEach(item=>{

        if(
            item.type !==
            "Damage"
        ){

            inventory.forEach(stock=>{

                if(
                    stock.sku ===
                    item.sku
                ){

                    stock.stock =

                    parseInt(
                        stock.stock
                    ) +

                    parseInt(
                        item.qty
                    );

                }

            });

        }

    });

    setStorage(
        "inventoryMaster",
        inventory
    );

    showToast(
        "Inventory Restocked"
    );

}

/* =========================
   Return History
   ========================= */

function loadReturnHistory(){

    const tbody =
    document.getElementById(
        "returnsHistory"
    );

    const data =
    getStorage(
        "returnsData"
    );

    if(!data.length){

        tbody.innerHTML =

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

        <td>${item.returnNo}</td>

        <td>${item.returnDate}</td>

        <td>${item.invoiceNo}</td>

        <td>${item.customerName}</td>

        <td>${item.totalQty}</td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewReturn(${index})">

            View

            </button>

            <button
            class="btn btn-danger"
            onclick="deleteReturn(${index})">

            Delete

            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View Return
   ========================= */

function viewReturn(index){

    const data =
    getStorage(
        "returnsData"
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
   Delete Return
   ========================= */

function deleteReturn(index){

    if(
        !confirm(
            "Delete Return Entry?"
        )
    ) return;

    let data =
    getStorage(
        "returnsData"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "returnsData",
        data
    );

    loadReturnHistory();

    showToast(
        "Return Deleted"
    );

}

/* =========================
   Search Return
   ========================= */

document
.getElementById(
    "returnSearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value
        .toLowerCase();

        document
        .querySelectorAll(
            "#returnsHistory tr"
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
   Print Return
   ========================= */

function printReturn(){

    window.print();

}

/* =========================
   Future Ready
   ========================= */

/*

Refund Module

Exchange Module

Customer Analytics

Return Ratio Report

Google Sheets Sync

Apps Script Backend

*/
