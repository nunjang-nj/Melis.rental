(function(){
const SH=["มารับเอง","ส่งโดย Messenger","พัสดุ"];
const DL=["","จ่ายมัดจำก่อนแล้ว ✅","จ่ายมัดจำที่หลัง ⏳","จ่ายทั้งหมดแล้ว ✅"];
const RL=["","จ่ายค่าเช่าก่อนแล้ว ✅","จ่ายค่าเช่าที่หลัง ⏳"];
const ln=(a,b)=>b?'<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--ln)"><span class="mut" style="white-space:nowrap">'+a+'</span><span style="text-align:right;word-break:break-word">'+b+'</span></div>':"";

function show(r){
  const old=$("qd_ov");if(old)old.remove();
  const fs=r.fines||[],ft=fs.reduce((s,f)=>s+f.amt,0);
  const n=days(r.start,r.end);
  let pay="ไม่ได้บันทึก";
  if(r.depSt==3)pay="มัดจำ "+money(r.dep)+" + ค่าเช่า: "+DL[3];
  else if(r.depSt)pay="มัดจำ "+money(r.dep)+": "+DL[r.depSt]+"<br>"+RL[r.rentSt||1];
  const map=/^https?:\/\//i.test(r.shipMap||"")?'<a href="'+esc(r.shipMap)+'" target="_blank" rel="noopener" style="color:var(--pk)">📍 เปิดแผนที่</a>':"";
  const ov=document.createElement("div");
  ov.id="qd_ov";
  ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:12px;overflow:auto";
  ov.innerHTML='<div class="card" style="width:100%;max-width:560px;margin:0;max-height:90vh;overflow:auto">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:18px">'+esc(pname(r.pid))+'</b><button class="btn g s" id="qd_x">ปิด ✕</button></div>'
    +ln("ผู้เช่า",esc(r.cust))
    +ln("วันรับ – วันคืน",fd(r.start)+" – "+fd(r.end)+" ("+n+" วัน)")
    +ln("ยอดค่าเช่า",money(r.amt))
    +ln("การรับ-ส่ง",SH[r.ship||0]+(r.shipNote?"<br>"+esc(r.shipNote):"")+(map?"<br>"+map:""))
    +ln("การชำระเงิน",pay)
    +(fs.length?ln("ค่าปรับ",fs.map(f=>esc(f.type)+" "+money(f.amt)+(f.note?" · "+esc(f.note):"")).join("<br>")+"<br><b>รวม "+money(ft)+"</b>"):"")
    +'<div style="display:flex;gap:8px;margin-top:14px"><button class="btn" id="qd_ret" style="flex:1">รับคืนแล้ว</button><button class="btn g" id="qd_cl" style="flex:1">ปิด</button></div></div>';
  document.body.appendChild(ov);
  const close=()=>ov.remove();
  ov.onclick=e=>{if(e.target===ov)close()};
  $("qd_x").onclick=close;$("qd_cl").onclick=close;
  $("qd_ret").onclick=()=>{
    if(!confirm("รับคืน "+pname(r.pid)+" จาก "+r.cust+" แล้วใช่ไหม?"))return;
    r.done=true;save();close();render();
  };
}

const oldQ=vQ;
vQ=function(v){
  oldQ(v);
  const cards=v.querySelectorAll(".card");
  const rows=cards.length>1?cards[cards.length-1].querySelectorAll(".row"):[];
  S.products.forEach((p,i)=>{
    const row=rows[i];if(!row)return;
    const r=busy(p.id,qd);if(!r)return;
    const open=e=>{e.preventDefault();e.stopPropagation();show(r)};
    const pill=row.querySelector(".pill");
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="ดูรายละเอียด";x.type="button";x.onclick=open;
    if(pill)pill.parentNode.insertBefore(x,pill.nextSibling);
    row.firstElementChild.style.cursor="pointer";
    row.firstElementChild.onclick=open;
  });
};
render();
})();
