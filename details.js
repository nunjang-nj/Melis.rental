(function(){
const oldP=vP;
vP=function(v){
  oldP(v);
  v.querySelectorAll("[data-e]").forEach(b=>{
    const p=S.products.find(x=>x.id==b.dataset.e);if(!p)return;
    const row=b.closest(".row");
    if(p.note)row.firstElementChild.insertAdjacentHTML("beforeend",`<div class="mut">${esc(p.note)}</div>`);
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="รายละเอียด";x.style.marginLeft="4px";
    x.onclick=()=>{
      const n=prompt("รายละเอียดสินค้า (เช่น อุปกรณ์ที่แถม มัดจำ หมายเหตุ)",p.note||"");
      if(n!==null){p.note=n.trim();save();render()}
    };
    b.parentNode.insertBefore(x,b.nextSibling);
  });
};
const oldQ=vQ;
vQ=function(v){
  oldQ(v);
  v.querySelectorAll(".row").forEach(r=>{
    const nm=r.querySelector("b");if(!nm)return;
    const p=S.products.find(x=>x.name==nm.textContent);
    if(p&&p.note)r.firstElementChild.insertAdjacentHTML("beforeend",`<div class="mut">${esc(p.note)}</div>`);
  });
};
render();
})();
