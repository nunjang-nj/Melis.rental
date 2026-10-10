(function(){
function tot(p,n){
  const b=p.price,o=p.promo;
  if(!o||n<2)return n*b;
  const t={2:o.d2,3:o.d3,4:o.d4};
  if(n<=4)return t[n]>0?t[n]:n*b;
  const base=o.d4>0?o.d4:4*b;
  return base+(n-4)*(o.ex>0?o.ex:b);
}
function setPromo(p){
  const o=p.promo||{};
  const s=prompt("โปรโมชั่น "+p.name+" (ราคาปกติ "+money(p.price)+"/วัน)\nใส่ตัวเลข 4 ตัวคั่นด้วยจุลภาค:\nราคารวม 2 วัน, 3 วัน, 4 วัน, ราคาต่อวันหลังวันที่ 4\nเช่น 400,550,700,150\n(เว้นว่าง = ลบโปร)",o.d2?[o.d2,o.d3,o.d4,o.ex].join(","):"");
  if(s===null)return;
  if(!s.trim()){delete p.promo;save();render();return}
  const a=s.split(",").map(x=>parseFloat(x.trim()));
  if(a.length!=4||a.some(x=>!(x>=0)))return alert("ใส่ตัวเลข 4 ตัวคั่นด้วยจุลภาค เช่น 400,550,700,150");
  p.promo={d2:a[0],d3:a[1],d4:a[2],ex:a[3]};
  const same=S.products.filter(x=>x!==p&&x.price==p.price&&!x.promo);
  if(same.length&&confirm("ใช้โปรนี้กับสินค้าอีก "+same.length+" รายการที่ราคา "+money(p.price)+"/วัน เท่ากันด้วยไหม?"))same.forEach(x=>x.promo=Object.assign({},p.promo));
  save();render();
}
const oldP=vP;
vP=function(v){
  oldP(v);
  v.querySelectorAll("[data-e]").forEach(b=>{
    const p=S.products.find(x=>x.id==b.dataset.e);if(!p)return;
    const row=b.closest(".row"),o=p.promo;
    if(o)row.firstElementChild.insertAdjacentHTML("beforeend",`<div class="mut">โปร: 2 วัน ${money(o.d2)} · 3 วัน ${money(o.d3)} · 4 วัน ${money(o.d4)} · วันถัดไป ${money(o.ex||p.price)}/วัน</div>`);
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="โปรโมชั่น";x.style.marginLeft="4px";
    x.onclick=()=>setPromo(p);
    b.parentNode.insertBefore(x,b.nextSibling);
  });
};
const oldR=vR;
vR=function(v){
  oldR(v);
  if(!$("fp"))return;
  const calc=()=>{
    const p=S.products.find(x=>x.id==$("fp").value),n=days($("fs").value,$("fe").value);
    if(n>0&&p){$("fa").value=tot(p,n);$("fi").textContent=n+" วัน"+(p.promo&&n>1?" (ราคาโปรโมชั่น)":"")}
  };
  ["fp","fs","fe"].forEach(i=>$(i).addEventListener("change",calc));
  calc();
};
render();
})();
