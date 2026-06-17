/* =========================
   Sales Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        generateInvoiceNo();

        loadSalesHistory();

        addSalesRow();

    }
);

/* =========================
   Invoice Number
   ========================= */

function generateInvoiceNo(){

    const invoiceNo =

    "INV-" +

    Date.now()
    .toString()
    .slice(-6);

    document.getElementById(
        "invoiceNo"
    ).value =
    invoiceNo;

}

/* =========================
   Add Product Row
   ========================= */

function addSalesRow(){

    const tbody =
    document.getElementById(
        "salesBody"
    );

    const row =
    document.createElement("tr");

    row.classList.add(
        "sales-row"
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

        <input
        type="number"
        class="rate"
        value="0">

    </td>

    <td>

        <input
        type="number"
        class="total"
        value="0"
        readonly>

    </td>

    <td>

        <button
        class="btn btn-danger"
        onclick="removeSalesRow(this)">

        Delete

        </button>

    </td>
    `;

    tbody.appendChild(row);

    attachSalesEvents(row);

}

/* =========================
   Remove Row
   ========================= */

function removeSalesRow(btn){

    btn.closest("tr").remove();

    calculateInvoice();

}

/* =========================
   Events
   ========================= */

function attachSalesEvents(row){

    row.querySelector(".qty")
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

    const qty =
    parseFloat(
        row.querySelector(".qty").value
    ) || 0;

    const rate =
    parseFloat(
        row.querySelector(".rate").value
    ) || 0;

    const total =
    qty * rate;

    row.querySelector(
        ".total"
    ).value =
    total.toFixed(2);

    calculateInvoice();

}

/* =========================
   Invoice Calculation
   ========================= */

function calculateInvoice(){

    let subTotal = 0;

    document
    .querySelectorAll(
        "#salesBody tr"
    )
    .forEach(row=>{

        subTotal +=
        parseFloat(
            row.querySelector(".total").value
        ) || 0;

    });

    const discount =
    parseFloat(
        document.getElementById(
            "discount"
        ).value
    ) || 0;

    const gst =
    parseFloat(
        document.getElementById(
            "gst"
        ).value
    ) || 0;

    const afterDiscount =
    subTotal - discount;

    const gstAmount =
    afterDiscount * gst / 100;

    const grandTotal =
    afterDiscount + gstAmount;

    document.getElementById(
        "subTotal"
    ).value =
    subTotal.toFixed(2);

    document.getElementById(
        "grandTotal"
    ).value =
    grandTotal.toFixed(2);

}

/* =========================
   Discount & GST Change
   ========================= */

document
.getElementById("discount")
?.addEventListener(
    "input",
    calculateInvoice
);

document
.getElementById("gst")
?.addEventListener(
    "input",
    calculateInvoice
);

/* =========================
   Save Sale
   ========================= */

function saveSale(){

    const sale = {

        invoiceNo:
        document.getElementById(
            "invoiceNo"
        ).value,

        invoiceDate:
        document.getElementById(
            "invoiceDate"
        ).value,

        customerName:
        document.getElementById(
            "customerName"
        ).value,

        customerMobile:
        document.getElementById(
            "customerMobile"
        ).value,

        paymentMode:
        document.getElementById(
            "paymentMode"
        ).value,

        subTotal:
        document.getElementById(
            "subTotal"
        ).value,

        grandTotal:
        document.getElementById(
            "grandTotal"
        ).value,

        products:[]

    };

    document
    .querySelectorAll(
        "#salesBody tr"
    )
    .forEach(row=>{

        sale.products.push({

            sku:
            row.querySelector(".sku").value,

            product:
            row.querySelector(".product").value,

            qty:
            row.querySelector(".qty").value,

            rate:
            row.querySelector(".rate").value,

            total:
            row.querySelector(".total").value

        });

    });

    let data =
    getStorage(
        "salesData"
    );

    data.push(
        sale
    );

    setStorage(
        "salesData",
        data
    );

    deductInventoryStock(
        sale.products
    );

    loadSalesHistory();

    showToast(
        "Sale Saved Successfully"
    );

    clearSalesForm();

}

/* =========================
   Deduct Inventory
   ========================= */

function deductInventoryStock(products){

    let inventory =
    getStorage(
        "inventoryMaster"
    );

    products.forEach(item=>{

        inventory.forEach(stock=>{

            if(
                stock.sku === item.sku
            ){

                stock.stock =

                parseInt(
                    stock.stock
                ) -

                parseInt(
                    item.qty
                );

            }

        });

    });

    setStorage(
        "inventoryMaster",
        inventory
    );

}

/* =========================
   History
   ========================= */

function loadSalesHistory(){

    const tbody =
    document.getElementById(
        "salesHistory"
    );

    const data =
    getStorage(
        "salesData"
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

    data.map((sale,index)=>`

    <tr>

        <td>${sale.invoiceNo}</td>

        <td>${sale.invoiceDate}</td>

        <td>${sale.customerName}</td>

        <td>₹${sale.grandTotal}</td>

        <td>${sale.paymentMode}</td>

        <td>

            <button
            class="btn btn-primary"
            onclick="viewSale(${index})">

            View

            </button>

            <button
            class="btn btn-danger"
            onclick="deleteSale(${index})">

            Delete

            </button>

        </td>

    </tr>

    `).join("");

}

/* =========================
   View Sale
   ========================= */

function viewSale(index){

    const data =
    getStorage(
        "salesData"
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
   Delete Sale
   ========================= */

function deleteSale(index){

    if(
        !confirm(
            "Delete Invoice?"
        )
    ) return;

    let data =
    getStorage(
        "salesData"
    );

    data.splice(
        index,
        1
    );

    setStorage(
        "salesData",
        data
    );

    loadSalesHistory();

}

/* =========================
   Search Invoice
   ========================= */

document
.getElementById(
    "salesSearch"
)
?.addEventListener(
    "keyup",
    function(){

        const search =
        this.value.toLowerCase();

        document
        .querySelectorAll(
            "#salesHistory tr"
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
   Print Invoice
   ========================= */

function printInvoice(){

    window.print();

}

/* =========================
   Clear Form
   ========================= */

function clearSalesForm(){

    document.getElementById(
        "customerName"
    ).value="";

    document.getElementById(
        "customerMobile"
    ).value="";

    document.getElementById(
        "invoiceDate"
    ).value="";

    document.getElementById(
        "salesBody"
    ).innerHTML="";

    addSalesRow();

    generateInvoiceNo();

    calculateInvoice();

}

/* =========================
   Future Ready
   ========================= */

/*

GST Report

Daily Sales

Monthly Sales

Profit Report

Return Integration

Google Sheets API

Apps Script Backend

*/
