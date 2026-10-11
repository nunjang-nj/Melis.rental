(function(){
const DL=["","จ่ายค่ามัดจำก่อน","จ่ายค่ามัดจำที่หลัง","จ่ายทั้งหมดแล้ว"];
const RL=["","จ่ายค่าเช่าก่อน","จ่ายค่าเช่าที่หลัง"];
function line(r){
  if(!r.depSt)return "";
  if(r.depSt==3)return "💰 มัดจำ "+money(r.dep)+" + ค่าเช่า: จ่ายทั้งหมดแล้ว ✅";
  return "💰 มัดจำ "+money(r.dep)+": "+DL[r.depSt]+(r.depSt==1?" ✅":" ⏳")+" · "+RL[r.rentSt||1]+((r.rentSt||1)==1?" ✅":" ⏳");
}
function owe(r){
  if(!r.depSt||r.depSt==3)return 0;
  return (r.depSt==2?(r.dep||0):0)+(r.rentSt==2?r.amt:0);
}

/* ---------- ช่องในหน้าเช่าอุปกรณ์ ---------- */
const oldR=vR;
vR=function(v){
  oldR(v);
  if(!$("fi"))return;
  $("fi").insertAdjacentHTML("beforebegin",
   '<label>ค่ามัดจำ (บาท)</label><input type="number" id="pd_amt" value="500">'
   +'<label>การจ่ายค่ามัดจำ</label><select id="pd_st"><option value="1">จ่ายค่ามัดจำก่อน</option><option value="2">จ่ายค่ามัดจำที่หลัง</option><option value="3">จ่ายทั้งหมดแล้ว</option></select>'
   +'<div id="pd_rw"><label>การจ่ายค่าเช่ากล้อง</label><select id="pd_rt"><option value="1">จ่ายค่าเช่าก่อน</option><option value="2">จ่ายค่าเช่าที่หลัง</option></select></div>');
  $("pd_st").onchange=()=>{$("pd_rw").style.display=$("pd_st").value=="3"?"none":"block"};
  const sv=$("sv"),orig=sv.onclick;
  sv.onclick=function(ev){
    const dep=parseFloat($("pd_amt").value)||0,ds=+$("pd_st").value,rs=ds==3?1:+$("pd_rt").value,n=S.rentals.length;
    orig.call(this,ev);
    if(S.rentals.length>n){const r=S.rentals[S.rentals.length-1];r.dep=dep;r.depSt=ds;r.rentSt=rs;save();render()}
  };
};

/* ---------- ประวัติการเช่า ---------- */
const oldH=vH;
vH=function(v){
  oldH(v);
  const due=S.rentals.reduce((s,r)=>s+owe(r),0);
  v.insertAdjacentHTML("afterbegin",'<div class="card"><div class="mut">ยอดค้างรับทั้งหมด (มัดจำ + ค่าเช่าที่ยังไม่จ่าย)</div><div class="big" style="color:'+(due?"var(--badt)":"var(--okt)")+'">'+money(due)+"</div></div>");
  v.querySelectorAll("[data-k]").forEach(b=>{
    const r=S.rentals.find(x=>x.id==b.dataset.k);if(!r)return;
    const t=line(r);
    if(t)b.closest(".row").firstElementChild.insertAdjacentHTML("beforeend",'<div class="mut">'+t+"</div>");
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="ชำระเงิน";x.style.marginLeft="4px";
    x.onclick=()=>{
      const a=prompt("พิมพ์ 2 ตัวเลข คั่นด้วยจุลภาค: สถานะมัดจำ,สถานะค่าเช่า\nมัดจำ: 1 = จ่ายก่อน ✅, 2 = จ่ายที่หลัง ⏳, 3 = จ่ายทั้งหมดแล้ว ✅\nค่าเช่า: 1 = จ่ายก่อน ✅, 2 = จ่ายที่หลัง ⏳\nเช่น 1,2 (ถ้าเลือกมัดจำ = 3 ใส่ค่าเช่าเป็น 1)",(r.depSt||1)+","+(r.rentSt||1));
      if(a===null)return;
      const p=a.split(",").map(s=>parseInt(s));
      if(!(p[0]>=1&&p[0]<=3&&p[1]>=1&&p[1]<=2))return alert("ใส่เช่น 1,2 (มัดจำ 1-3, ค่าเช่า 1-2)");
      if(!r.dep&&r.dep!==0)r.dep=500;
      r.depSt=p[0];r.rentSt=p[0]==3?1:p[1];save();render();
    };
    b.parentNode.appendChild(x);
  });
};
render();
})();
