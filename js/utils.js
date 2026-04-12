function clearAll(){
if(confirm("Delete all?")){
localStorage.clear();
location.reload();
}
}

function setupKeyboard(){
document.addEventListener("keydown",e=>{
if(e.altKey){
let pages=["dashboard","fabric","cutting","stitching","finished","sales","return","settings"];
let i=parseInt(e.key)-1;
if(pages[i]) loadPage(pages[i]);
}
});
}
