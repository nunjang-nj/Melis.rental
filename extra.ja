(function(){
const SK="rentalSyncUrl",NK="rentalShopName";
const g=k=>{try{return localStorage.getItem(k)||""}catch(e){return ""}};
const st=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

/* ---------- ใบเสร็จ / สัญญาเช่า ---------- */
const oldH=vH;
vH=function(v){
  oldH(v);
  v.querySelectorAll("[data-k]").forEach(b=>{
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="ใบเสร็จ";x.style.marginLeft="4px";
    x.onclick=()=>receipt(+b.dataset.k);
    b.parentNode.appendChild(x);
  });
};
function receipt(id){
  const r=S.rentals.find(x=>x.id==id);if(!r)return;
  let n=g(NK);
  if(!n){n=prompt("ชื่อร้าน (แสดงบนใบเสร็จ)","")||"ร้านเช่า";st(NK,n)}
  const w=window.open("","_blank");
  if(!w)return alert("กรุณาอนุญาต pop-up ของเว็บนี้");
  w.document.write(`<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ใบเสร็จ ${r.id}</title><style>body{font-family:"Noto Sans Thai",Sarabun,sans-serif;max-width:600px;margin:20px auto;padding:0 16px;color:#222}h1{font-size:22px;margin:0}table{width:100%;border-collapse:collapse;margin:12px 0}td{padding:8px 0;border-bottom:1px solid #ddd}td:last-child{text-align:right}ol{padding-left:20px;font-size:14px;line-height:1.7}.sg{display:flex;justify-content:space-around;margin-top:48px;text-align:center;font-size:14px}.sg div{width:40%;border-top:1px solid #222;padding-top:6px}button{padding:10px 18px;font-size:16px;margin:8px 0}@media print{button{display:none}}</style></head><body>
<h1>${esc(n)}</h1><div>ใบเสร็จรับเงิน / สัญญาเช่า เลขที่ ${r.id}</div>
<table><tr><td>ผู้เช่า</td><td>${esc(r.cust)}</td></tr><tr><td>อุปกรณ์</td><td>${esc(pname(r.pid))}</td></tr><tr><td>วันรับ</td><td>${fd(r.start)}</td></tr><tr><td>วันคืน</td><td>${fd(r.end)}</td></tr><tr><td>จำนวนวัน</td><td>${days(r.start,r.end)} วัน</td></tr><tr><td><b>ยอดเงิน</b></td><td><b>${money(r.amt)}</b></td></tr></table>
<b>เงื่อนไขการเช่า</b>
<ol><li>ผู้เช่าต้องดูแลอุปกรณ์ให้อยู่ในสภาพดี และคืนตามกำหนด</li><li>หากอุปกรณ์เสียหายหรือสูญหาย ผู้เช่าต้องชดใช้ตามราคาที่ตกลงกับทางร้าน</li><li>คืนล่าช้าคิดค่าเช่าเพิ่มตามจำนวนวันที่เกิน</li></ol>
<div class="sg"><div>ผู้เช่า</div><div>ผู้ให้เช่า</div></div>
<button onclick="window.print()">พิมพ์ / บันทึกเป็น PDF</button></body></html>`);
  w.document.close();
}

/* ---------- ซิงค์ Google Sheets ---------- */
const f=document.getElementById("ex").parentNode;
f.insertAdjacentHTML("beforeend",'<br><a href="#" id="sy1" style="color:var(--pk)">ตั้งค่าซิงค์</a> · <a href="#" id="sy2" style="color:var(--pk)">⬆ ส่งขึ้น Sheets</a> · <a href="#" id="sy3" style="color:var(--pk)">⬇ ดึงจาก Sheets</a>');
document.getElementById("sy1").onclick=e=>{e.preventDefault();const u=prompt("วางลิงก์ Web App จาก Apps Script",g(SK));if(u!==null)st(SK,u.trim())};
document.getElementById("sy2").onclick=async e=>{
  e.preventDefault();const u=g(SK);if(!u)return alert("ตั้งค่าซิงค์ก่อน");
  try{await fetch(u,{method:"POST",body:JSON.stringify(S)});alert("ส่งข้อมูลขึ้น Sheets แล้ว")}catch(x){alert("ส่งไม่สำเร็จ ตรวจสอบลิงก์และอินเทอร์เน็ต")}
};
document.getElementById("sy3").onclick=async e=>{
  e.preventDefault();const u=g(SK);if(!u)return alert("ตั้งค่าซิงค์ก่อน");
  try{
    const o=await (await fetch(u)).json();
    if(!(o.products&&o.rentals&&o.expenses))return alert("ใน Sheets ยังไม่มีข้อมูลที่ใช้ได้");
    if(!confirm("ข้อมูลในเครื่องนี้จะถูกแทนที่ด้วยข้อมูลจาก Sheets ต้องการดำเนินการต่อไหม?"))return;
    S=o;save();render();
  }catch(x){alert("ดึงไม่สำเร็จ ตรวจสอบลิงก์และอินเทอร์เน็ต")}
};
render();
})();
