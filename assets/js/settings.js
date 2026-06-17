/* =========================
   Settings Module JS
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSettings();

    }
);

/* =========================
   Load Settings
   ========================= */

function loadSettings(){

    const settings =
    getStorage(
        "erpSettings"
    );

    if(!settings) return;

    document.getElementById(
        "companyName"
    ).value =
    settings.companyName || "";

    document.getElementById(
        "gstNo"
    ).value =
    settings.gstNo || "";

    document.getElementById(
        "companyMobile"
    ).value =
    settings.companyMobile || "";

    document.getElementById(
        "companyEmail"
    ).value =
    settings.companyEmail || "";

    document.getElementById(
        "invoicePrefix"
    ).value =
    settings.invoicePrefix || "INV";

    document.getElementById(
        "defaultGST"
    ).value =
    settings.defaultGST || 5;

    document.getElementById(
        "sheetId"
    ).value =
    settings.sheetId || "";

    document.getElementById(
        "scriptUrl"
    ).value =
    settings.scriptUrl || "";

}

/* =========================
   Save Settings
   ========================= */

function saveSettings(){

    const settings = {

        companyName:
        document.getElementById(
            "companyName"
        ).value,

        gstNo:
        document.getElementById(
            "gstNo"
        ).value,

        companyMobile:
        document.getElementById(
            "companyMobile"
        ).value,

        companyEmail:
        document.getElementById(
            "companyEmail"
        ).value,

        invoicePrefix:
        document.getElementById(
            "invoicePrefix"
        ).value,

        defaultGST:
        document.getElementById(
            "defaultGST"
        ).value,

        sheetId:
        document.getElementById(
            "sheetId"
        ).value,

        scriptUrl:
        document.getElementById(
            "scriptUrl"
        ).value

    };

    setStorage(
        "erpSettings",
        settings
    );

    showToast(
        "Settings Saved Successfully"
    );

    addActivity(
        "Settings",
        "ERP Settings Updated"
    );

}

/* =========================
   Backup ERP Data
   ========================= */

function backupData(){

    const backup = {

        fabricData:
        getStorage(
            "fabricData"
        ),

        cuttingData:
        getStorage(
            "cuttingData"
        ),

        stitchingData:
        getStorage(
            "stitchingData"
        ),

        finishedData:
        getStorage(
            "finishedData"
        ),

        inventoryMaster:
        getStorage(
            "inventoryMaster"
        ),

        salesData:
        getStorage(
            "salesData"
        ),

        returnsData:
        getStorage(
            "returnsData"
        ),

        activityLog:
        getStorage(
            "activityLog"
        ),

        erpSettings:
        getStorage(
            "erpSettings"
        ),

        backupDate:
        new Date()
        .toLocaleString()

    };

    const blob =
    new Blob(
        [
            JSON.stringify(
                backup,
                null,
                2
            )
        ],
        {
            type:
            "application/json"
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
    "kone-erp-backup.json";

    a.click();

    showToast(
        "Backup Downloaded"
    );

}

/* =========================
   Restore ERP Data
   ========================= */

function restoreData(){

    document
    .getElementById(
        "restoreFile"
    )
    .click();

}

document
.getElementById(
    "restoreFile"
)
?.addEventListener(
    "change",
    function(e){

        const file =
        e.target.files[0];

        if(!file){

            return;

        }

        const reader =
        new FileReader();

        reader.onload =
        function(event){

            try{

                const data =
                JSON.parse(
                    event.target.result
                );

                Object.keys(data)
                .forEach(key=>{

                    localStorage.setItem(

                        key,

                        JSON.stringify(
                            data[key]
                        )

                    );

                });

                showToast(
                    "Backup Restored"
                );

                location.reload();

            }

            catch(error){

                showToast(
                    "Invalid Backup File",
                    "error"
                );

            }

        };

        reader.readAsText(
            file
        );

    }
);

/* =========================
   Test Apps Script
   ========================= */

async function testConnection(){

    const url =
    document.getElementById(
        "scriptUrl"
    ).value;

    if(!url){

        showToast(
            "Enter Apps Script URL",
            "warning"
        );

        return;

    }

    try{

        const response =
        await fetch(url);

        const data =
        await response.text();

        showToast(
            "Connection Successful"
        );

        console.log(
            data
        );

    }

    catch(error){

        showToast(
            "Connection Failed",
            "error"
        );

    }

}

/* =========================
   Clear All Data
   ========================= */

function clearERPData(){

    if(
        !confirm(
            "Delete All ERP Data?"
        )
    ){

        return;

    }

    localStorage.clear();

    showToast(
        "ERP Data Cleared"
    );

    setTimeout(
        ()=>location.reload(),
        1000
    );

}

/* =========================
   Future Ready
   ========================= */

/*

Google Sheets Sync

Apps Script Sync

Multi User Login

Role Permission

Cloud Backup

Email Settings

WhatsApp Integration

Audit Logs

*/
