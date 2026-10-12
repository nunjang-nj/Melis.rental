(function(){
const SH=["มารับเอง","ส่งโดย Messenger","พัสดุ"];
const DL=["","จ่ายมัดจำก่อนแล้ว ✅","จ่ายมัดจำที่หลัง ⏳","จ่ายทั้งหมดแล้ว ✅"];
const RL=["","จ่ายค่าเช่าก่อนแล้ว ✅","จ่ายค่าเช่าที่หลัง ⏳"];
const ln=(a,b)=>b?'<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--ln)"><span class="mut" style="white-space:nowrap">'+a+'</span><span style="text-align:right;word-break:break-word">'+b+'</span></div>':"";
function fixUrl(u){
  u=(u||"").trim();
  if(!u)return "";
  if(/^https?:\/\//i.test(u))return u;
  if(/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u))return "https://"+u;
  return null;
}
function overlay(html){
  const old=$("qd_ov");if(old)old.remove();
  const ov=document.createElement("div");
  ov.id="qd_ov";
  ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:12px;overflow:auto";
  ov.innerHTML='<div class="card" style="width:100%;max-width:560px;margin:0;max-height:90vh;overflow:auto">'+html+'</div>';
  document.body.appendChild(ov);
  const close=()=>ov.remove();
  ov.onclick=e=>{if(e.target===ov)close()};
  return close;
}

/* ---------- หน้าดูรายละเอียด ---------- */
function show(r){
  const fs=r.fines||[],ft=fs.reduce((s,f)=>s+f.amt,0);
  const n=days(r.start,r.end);
  let pay="ไม่ได้บันทึก";
  if(r.depSt==3)pay="มัดจำ "+money(r.dep)+" + ค่าเช่า: "+DL[3];
  else if(r.depSt)pay="มัดจำ "+money(r.dep)+": "+DL[r.depSt]+"<br>"+RL[r.rentSt||1];
  const map=/^https?:\/\//i.test(r.shipMap||"")?'<a href="'+esc(r.shipMap)+'" target="_blank" rel="noopener" style="color:var(--pk)">📍 เปิดแผนที่</a>':"";
  const close=overlay(
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:18px">'+esc(pname(r.pid))+'</b><button class="btn g s" id="qd_x">ปิด ✕</button></div>'
    +ln("ผู้เช่า",esc(r.cust))
    +ln("วันรับ – วันคืน",fd(r.start)+" – "+fd(r.end)+" ("+n+" วัน)")
    +ln("ยอดค่าเช่า",money(r.amt))
    +ln("การรับ-ส่ง",SH[r.ship||0]+(r.shipNote?"<br>"+esc(r.shipNote):"")+(map?"<br>"+map:""))
    +ln("การชำระเงิน",pay)
    +(fs.length?ln("ค่าปรับ",fs.map(f=>esc(f.type)+" "+money(f.amt)+(f.note?" · "+esc(f.note):"")).join("<br>")+"<br><b>รวม "+money(ft)+"</b>"):"")
    +'<div style="display:flex;gap:8px;margin-top:14px"><button class="btn g" id="qd_ed" style="flex:1">✏️ แก้ไข</button><button class="btn" id="qd_ret" style="flex:1">รับคืนแล้ว</button></div>'
    +'<button class="btn g" id="qd_cl" style="width:100%;margin-top:8px">ปิด</button>');
  $("qd_x").onclick=close;$("qd_cl").onclick=close;
  $("qd_ed").onclick=()=>edit(r);
  $("qd_ret").onclick=()=>{
    if(!confirm("รับคืน "+pname(r.pid)+" จาก "+r.cust+" แล้วใช่ไหม?"))return;
    r.done=true;save();close();render();
  };
}

/* ---------- หน้าแก้ไข ---------- */
function edit(r){
  const m=r.ship||0,ds=r.depSt||0;
  const close=overlay(
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:18px">แก้ไข: '+esc(pname(r.pid))+'</b><button class="btn g s" id="qe_x">ปิด ✕</button></div>'
    +'<label>ชื่อผู้เช่า / เบอร์โทร</label><input id="qe_c" value="'+esc(r.cust)+'">'
    +'<div class="g2"><div><label>วันรับ</label><input type="date" id="qe_s" value="'+r.start+'"></div><div><label>วันคืน</label><input type="date" id="qe_e" value="'+r.end+'"></div></div>'
    +'<label>ยอดค่าเช่า (บาท)</label><input type="number" id="qe_a" value="'+(r.amt||0)+'">'
    +'<label>การรับ-ส่ง</label><select id="qe_m">'+SH.map((x,i)=>'<option value="'+i+'"'+(i==m?" selected":"")+">"+x+"</option>").join("")+"</select>"
    +'<div id="qe_dw" style="display:'+(m?"block":"none")+'"><label>ที่อยู่ / เลขพัสดุ</label><input id="qe_n" value="'+esc(r.shipNote||"")+'"><label>ลิงก์ Google Maps</label><input id="qe_g" value="'+esc(r.shipMap||"")+'" placeholder="วางลิงก์ที่นี่"></div>'
    +'<label>การชำระเงิน (มัดจำ)</label><select id="qe_ds"><option value="0"'+(ds==0?" selected":"")+'>ไม่ได้บันทึก</option><option value="1"'+(ds==1?" selected":"")+'>จ่ายมัดจำก่อนแล้ว</option><option value="2"'+(ds==2?" selected":"")+'>จ่ายมัดจำที่หลัง</option><option value="3"'+(ds==3?" selected":"")+'>จ่ายทั้งหมดแล้ว</option></select>'
    +'<div id="qe_dp" style="display:'+(ds?"block":"none")+'"><label>ค่ามัดจำ (บาท)</label><input type="number" id="qe_d" value="'+(r.dep||0)+'"></div>'
    +'<div id="qe_rw" style="display:'+(ds&&ds!=3?"block":"none")+'"><label>การจ่ายค่าเช่า</label><select id="qe_rs"><option value="1"'+((r.rentSt||1)==1?" selected":"")+'>จ่ายค่าเช่าก่อนแล้ว</option><option value="2"'+(r.rentSt==2?" selected":"")+'>จ่ายค่าเช่าที่หลัง</option></select></div>'
    +'<div style="display:flex;gap:8px;margin-top:10px"><button class="btn" id="qe_sv" style="flex:1">บันทึก</button><button class="btn g" id="qe_bk" style="flex:1">ยกเลิก</button></div>');
  $("qe_x").onclick=close;
  $("qe_bk").onclick=()=>show(r);
  $("qe_m").onchange=()=>{$("qe_dw").style.display=+$("qe_m").value?"block":"none"};
  $("qe_ds").onchange=()=>{const v=+$("qe_ds").value;$("qe_dp").style.display=v?"block":"none";$("qe_rw").style.display=v&&v!=3?"block":"none"};
  $("qe_sv").onclick=()=>{
    const c=$("qe_c").value.trim(),s=$("qe_s").value,e=$("qe_e").value;
    if(!c)return alert("กรุณาใส่ชื่อผู้เช่า");
    if(!s||!e||e<s)return alert("วันที่ไม่ถูกต้อง");
    const sm=+$("qe_m").value,mp=fixUrl($("qe_g").value);
    if(sm&&mp===null)return alert("ลิงก์ไม่ถูกต้อง ต้องขึ้นต้นด้วย https://");
    const x=S.rentals.find(o=>o.id!=r.id&&o.pid==r.pid&&!o.done&&o.start<=e&&s<=o.end);
    if(x&&!confirm("ช่วงนี้ติดคิวของ "+x.cust+" ("+fd(x.start)+" - "+fd(x.end)+") บันทึกซ้อนต่อไหม?"))return;
    const d=+$("qe_ds").value;
    r.cust=c;r.start=s;r.end=e;r.amt=parseFloat($("qe_a").value)||0;
    r.ship=sm;r.shipNote=sm?$("qe_n").value.trim():"";r.shipMap=sm?(mp||""):"";
    r.depSt=d;
    if(d){r.dep=parseFloat($("qe_d").value)||0;r.rentSt=d==3?1:+$("qe_rs").value}
    else{r.dep=0;r.rentSt=1}
    save();close();
    if(!(s<=qd&&qd<=e))qd=s;
    render();
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
