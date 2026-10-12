(function(){
const MN=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const SH=["รับเอง","Messenger","พัสดุ"];
let mSel=new Date().getMonth();

const q=v=>{v=String(v==null?"":v);return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
const line=a=>a.map(q).join(",");
function save2(name,rows){
  const blob=new Blob(["\ufeff"+rows.join("\r\n")],{type:"text/csv;charset=utf-8"});
  const u=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=u;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},1500);
}
const cat=x=>x.cat||"อื่นๆ";

function month(y,m){
  const key=y+"-"+String(m+1).padStart(2,"0");
  const R=S.rentals.filter(r=>r.start.slice(0,7)==key).sort((a,b)=>a.start.localeCompare(b.start));
  const E=S.expenses.filter(x=>x.date.slice(0,7)==key).sort((a,b)=>a.date.localeCompare(b.date));
  const inc=R.reduce((s,r)=>s+(r.amt||0),0),ex=E.reduce((s,x)=>s+(x.amt||0),0);
  const o=[line(["รายงานประจำเดือน "+MN[m]+" "+(y+543)]),"",
    line(["สรุป"]),line(["รายได้ค่าเช่า",inc]),line(["ค่าใช้จ่าย",ex]),line(["กำไร",inc-ex]),line(["จำนวนรายการเช่า",R.length]),"",
    line(["รายการเช่า (นับตามวันรับกล้อง)"]),line(["วันรับ","วันคืน","รุ่น","ลูกค้า","ค่าเช่า","มัดจำ","การรับ-ส่ง"])];
  R.forEach(r=>o.push(line([r.start,r.end,pname(r.pid),r.cust,r.amt||0,r.dep||0,SH[r.ship||0]])));
  o.push("",line(["ค่าใช้จ่าย"]),line(["วันที่","รายการ","หมวด","จำนวนเงิน"]));
  E.forEach(x=>o.push(line([x.date,x.desc,cat(x),x.amt||0])));
  o.push("",line(["หมายเหตุ","ยอดมัดจำและค่าปรับไม่รวมอยู่ในรายได้"]));
  save2("รายงาน-"+(y+543)+"-"+String(m+1).padStart(2,"0")+".csv",o);
}
function year(y){
  const o=[line(["รายงานรายเดือน ปี "+(y+543)]),"",line(["เดือน","รายได้ค่าเช่า","ค่าใช้จ่าย","กำไร","จำนวนรายการเช่า"])];
  let ti=0,te=0,tn=0;
  for(let m=0;m<12;m++){
    const key=y+"-"+String(m+1).padStart(2,"0");
    const R=S.rentals.filter(r=>r.start.slice(0,7)==key),E=S.expenses.filter(x=>x.date.slice(0,7)==key);
    const i=R.reduce((s,r)=>s+(r.amt||0),0),e=E.reduce((s,x)=>s+(x.amt||0),0);
    ti+=i;te+=e;tn+=R.length;
    o.push(line([MN[m],i,e,i-e,R.length]));
  }
  o.push(line(["รวม",ti,te,ti-te,tn]));
  save2("รายงานทั้งปี-"+(y+543)+".csv",o);
}

const oldS=vS;
vS=function(v){
  oldS(v);
  v.insertAdjacentHTML("beforeend",
   '<div class="card"><b>ดาวน์โหลดรายงาน</b><div class="mut">ไฟล์ CSV เปิดด้วย Excel, Numbers หรือ Google Sheets ได้</div>'
   +'<label>เดือน (ปี '+(yr+543)+')</label><select id="ex_m">'+MN.map((m,i)=>'<option value="'+i+'"'+(i==mSel?" selected":"")+">"+m+"</option>").join("")+"</select>"
   +'<button class="btn" id="ex_a" style="width:100%;margin-bottom:8px">⬇ ดาวน์โหลดรายงานเดือนนี้</button>'
   +'<button class="btn g" id="ex_y" style="width:100%">⬇ ดาวน์โหลดสรุปทั้งปี</button></div>');
  $("ex_m").onchange=e=>{mSel=+e.target.value};
  $("ex_a").onclick=()=>month(yr,+$("ex_m").value);
  $("ex_y").onclick=()=>year(yr);
};
render();
})();
