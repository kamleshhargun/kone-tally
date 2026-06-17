/* =========================
   Google Sheets Sync
   ========================= */

const SHEET_CONFIG = {

    scriptUrl:
    getStorage(
        "erpSettings"
    )?.scriptUrl || ""

};

/* =========================
   Generic API Call
   ========================= */

async function apiRequest(

    action,

    payload = {}

){

    if(
        !SHEET_CONFIG.scriptUrl
    ){

        showToast(
            "Apps Script URL Missing",
            "warning"
        );

        return null;

    }

    try{

        const response =
        await fetch(

            SHEET_CONFIG.scriptUrl,

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:

                JSON.stringify({

                    action,

                    payload

                })

            }

        );

        return await response.json();

    }

    catch(error){

        console.error(
            error
        );

        showToast(
            "Sync Failed",
            "error"
        );

        return null;

    }

}

/* =========================
   Fabric Sync
   ========================= */

async function syncFabric(){

    const data =
    getStorage(
        "fabricData"
    ) || [];

    return await apiRequest(

        "fabricSync",

        data

    );

}

/* =========================
   Cutting Sync
   ========================= */

async function syncCutting(){

    const data =
    getStorage(
        "cuttingData"
    ) || [];

    return await apiRequest(

        "cuttingSync",

        data

    );

}

/* =========================
   Stitching Sync
   ========================= */

async function syncStitching(){

    const data =
    getStorage(
        "stitchingData"
    ) || [];

    return await apiRequest(

        "stitchingSync",

        data

    );

}

/* =========================
   Finished Goods Sync
   ========================= */

async function syncFinishedGoods(){

    const data =
    getStorage(
        "finishedData"
    ) || [];

    return await apiRequest(

        "finishedSync",

        data

    );

}

/* =========================
   Inventory Sync
   ========================= */

async function syncInventory(){

    const data =
    getStorage(
        "inventoryMaster"
    ) || [];

    return await apiRequest(

        "inventorySync",

        data

    );

}

/* =========================
   Sales Sync
   ========================= */

async function syncSales(){

    const data =
    getStorage(
        "salesData"
    ) || [];

    return await apiRequest(

        "salesSync",

        data

    );

}

/* =========================
   Returns Sync
   ========================= */

async function syncReturns(){

    const data =
    getStorage(
        "returnsData"
    ) || [];

    return await apiRequest(

        "returnsSync",

        data

    );

}

/* =========================
   Settings Sync
   ========================= */

async function syncSettings(){

    const data =
    getStorage(
        "erpSettings"
    ) || {};

    return await apiRequest(

        "settingsSync",

        data

    );

}

/* =========================
   Full ERP Sync
   ========================= */

async function syncAllModules(){

    showToast(
        "Sync Started..."
    );

    await syncFabric();

    await syncCutting();

    await syncStitching();

    await syncFinishedGoods();

    await syncInventory();

    await syncSales();

    await syncReturns();

    await syncSettings();

    showToast(
        "Sync Completed"
    );

    addActivity(

        "Google Sheets",

        "ERP Data Synced"

    );

}

/* =========================
   Pull Data
   ========================= */

async function pullData(){

    const result =
    await apiRequest(

        "pullData"

    );

    if(!result){

        return;

    }

    Object.keys(
        result
    ).forEach(key=>{

        localStorage.setItem(

            key,

            JSON.stringify(

                result[key]

            )

        );

    });

    showToast(
        "Data Downloaded"
    );

}

/* =========================
   Sync Status
   ========================= */

async function checkSyncStatus(){

    const result =
    await apiRequest(
        "ping"
    );

    if(result){

        console.log(
            "Connected"
        );

    }

}

/* =========================
   Auto Sync
   ========================= */

setInterval(

    ()=>{

        syncAllModules();

    },

    300000

);

/* =========================
   Manual Sync Button
   ========================= */

function manualSync(){

    syncAllModules();

}

/* =========================
   Future Ready
   ========================= */

/*

Realtime Sync

Conflict Resolution

Offline Queue

Multi User Sync

Role Permissions

Warehouse Sync

Barcode Sync

WhatsApp Sync

*/
