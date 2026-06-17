/* =========================
   KONE ERP - Common JS
   ========================= */

/* Sidebar */

const sidebar =
document.getElementById("sidebar");

/* =========================
   Toggle Sidebar
   ========================= */

function toggleSidebar(){

    if(!sidebar) return;

    sidebar.classList.toggle("show");

}

/* =========================
   Close Sidebar Outside Click
   ========================= */

document.addEventListener("click",function(e){

    if(window.innerWidth > 768) return;

    if(!sidebar) return;

    const menuBtn =
    document.querySelector(".menu-btn");

    const clickedSidebar =
    sidebar.contains(e.target);

    const clickedButton =
    menuBtn &&
    menuBtn.contains(e.target);

    if(
        !clickedSidebar &&
        !clickedButton
    ){
        sidebar.classList.remove("show");
    }

});

/* =========================
   Toast Container
   ========================= */

function createToastContainer(){

    if(
        document.getElementById(
            "toastContainer"
        )
    ) return;

    const container =
    document.createElement("div");

    container.id =
    "toastContainer";

    container.style.position =
    "fixed";

    container.style.top =
    "20px";

    container.style.right =
    "20px";

    container.style.zIndex =
    "99999";

    document.body.appendChild(
        container
    );

}

createToastContainer();

/* =========================
   Toast Notification
   ========================= */

function showToast(
    message,
    type="success"
){

    const container =
    document.getElementById(
        "toastContainer"
    );

    const toast =
    document.createElement("div");

    toast.innerText =
    message;

    toast.style.background =
    "#fff";

    toast.style.padding =
    "14px 18px";

    toast.style.marginBottom =
    "10px";

    toast.style.borderRadius =
    "10px";

    toast.style.boxShadow =
    "0 10px 20px rgba(0,0,0,.08)";

    toast.style.fontSize =
    "14px";

    toast.style.minWidth =
    "220px";

    toast.style.borderLeft =
    "5px solid #16a34a";

    if(type==="error"){

        toast.style.borderLeft =
        "5px solid #dc2626";

    }

    if(type==="warning"){

        toast.style.borderLeft =
        "5px solid #f59e0b";

    }

    container.appendChild(
        toast
    );

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transition=
        ".3s";

    },2500);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* =========================
   Loading Overlay
   ========================= */

function createLoader(){

    if(
        document.getElementById(
            "loadingOverlay"
        )
    ) return;

    const overlay =
    document.createElement("div");

    overlay.id =
    "loadingOverlay";

    overlay.innerHTML =

    `
    <div class="loader-box">

        <div class="loader-spinner"></div>

        <p>Loading...</p>

    </div>
    `;

    overlay.style.position =
    "fixed";

    overlay.style.top = 0;

    overlay.style.left = 0;

    overlay.style.right = 0;

    overlay.style.bottom = 0;

    overlay.style.display =
    "none";

    overlay.style.alignItems =
    "center";

    overlay.style.justifyContent =
    "center";

    overlay.style.background =
    "rgba(255,255,255,.7)";

    overlay.style.backdropFilter =
    "blur(3px)";

    overlay.style.zIndex =
    "999999";

    document.body.appendChild(
        overlay
    );

    const style =
    document.createElement("style");

    style.innerHTML =

    `
    .loader-box{
        text-align:center;
    }

    .loader-spinner{

        width:45px;
        height:45px;

        border:4px solid #ddd;

        border-top:
        4px solid #6d28d9;

        border-radius:50%;

        animation:
        spin 1s linear infinite;

        margin:auto;
        margin-bottom:10px;
    }

    @keyframes spin{

        from{
            transform:
            rotate(0deg);
        }

        to{
            transform:
            rotate(360deg);
        }

    }
    `;

    document.head.appendChild(
        style
    );

}

createLoader();

/* =========================
   Show Loader
   ========================= */

function showLoader(){

    const loader =
    document.getElementById(
        "loadingOverlay"
    );

    if(loader){

        loader.style.display =
        "flex";

    }

}

/* =========================
   Hide Loader
   ========================= */

function hideLoader(){

    const loader =
    document.getElementById(
        "loadingOverlay"
    );

    if(loader){

        loader.style.display =
        "none";

    }

}

/* =========================
   Number Format
   ========================= */

function formatNumber(value){

    return new Intl.NumberFormat(
        "en-IN"
    ).format(value || 0);

}

/* =========================
   Date Format
   ========================= */

function formatDate(date){

    const d =
    new Date(date);

    return d.toLocaleDateString(
        "en-IN"
    );

}

/* =========================
   Local Storage Helper
   ========================= */

function getStorage(key){

    return JSON.parse(
        localStorage.getItem(key)
    ) || [];

}

function setStorage(
    key,
    data
){

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}

/* =========================
   Temporary Demo Data
   ========================= */

if(
    !localStorage.getItem(
        "erpInitialized"
    )
){

    localStorage.setItem(
        "erpInitialized",
        true
    );

    setStorage(
        "activities",
        [
            {
                date:new Date(),
                module:"System",
                description:
                "ERP Initialized"
            }
        ]
    );

}

/* =========================
   Add Activity
   ========================= */

function addActivity(
    module,
    description
){

    const activities =
    getStorage("activities");

    activities.unshift({

        date:new Date(),

        module,

        description

    });

    setStorage(
        "activities",
        activities
    );

}

/* =========================
   Future API Ready
   ========================= */

/*

Later:

api("getDashboard");

api("saveFabric");

api("saveCutting");

api("saveSales");

*/

console.log(
    "KONE ERP Common JS Loaded"
);
