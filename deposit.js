(function(){
const DEF=500,MINI=200;
const defDep=p=>p&&p.dep!=null&&p.dep!==""?+p.dep:(/mini/i.test(String((p&&p.name)||""))?MINI:DEF);

const oldP=vP;
vP=function(v){
  oldP(v);
  v.querySelectorAll("[data-e]").forEach(b=>{
    const p=S.products.find(x=>x.id==b.dataset.e);if(!p)return;
    const row=b.closest(".row"),d=defDep(p);
    row.firstElementChild.insertAdjacentHTML("beforeend",'<div class="mut">มัดจำ: '+(d?money(d):"ไม่มี")+'</div>');
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="มัดจำ";x.style.marginLeft="4px";
    x.onclick=()=>{
      const s=prompt("ค่ามัดจำของ "+p.name+" (บาท)\nใส่ 0 = ไม่เก็บมัดจำ\nเว้นว่าง = ใช้ค่าอัตโนมัติ (รุ่น mini = "+MINI+", รุ่นอื่น = "+DEF+")",p.dep!=null?p.dep:"");
      if(s===null)return;
      if(!s.trim()){delete p.dep;save();render();return}
      const n=parseFloat(s);
      if(!(n>=0))return alert("ใส่ตัวเลขตั้งแต่ 0 ขึ้นไป");
      p.dep=n;
      const same=S.products.filter(y=>y!==p&&y.price==p.price&&y.dep==null);
      if(same.length&&confirm("ใช้มัดจำ "+money(n)+" กับสินค้าอีก "+same.length+" รายการที่ราคา "+money(p.price)+"/วัน เท่ากันด้วยไหม?"))same.forEach(y=>y.dep=n);
      save();render();
    };
    b.parentNode.insertBefore(x,b.nextSibling);
  });
};

const oldR=vR;
vR=function(v){
  oldR(v);
  if(!$("fp")||!$("pd_amt"))return;
  const fill=()=>{
    const p=S.products.find(x=>x.id==$("fp").value);
    if(p){$("pd_amt").value=defDep(p)}
  };
  $("fp").addEventListener("change",fill);
  fill();
};
render();
})();
