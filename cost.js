(function(){
const n0=n=>Number(n||0).toLocaleString("th-TH");
const st=document.createElement("style");
st.textContent=".cp{width:100%;border-collapse:collapse;font-size:13px}.cp th,.cp td{padding:6px 8px;text-align:right;border-bottom:1px solid var(--ln);white-space:nowrap}.cp th{color:var(--mut);font-weight:normal}.cp td:first-child,.cp th:first-child{text-align:left}.cp tr.t td{font-weight:600}.cs{overflow-x:auto;margin-top:8px}";
document.head.appendChild(st);
const rev=id=>S.rentals.filter(r=>r.pid==id).reduce((s,r)=>s+r.amt,0);
const cnt=id=>S.rentals.filter(r=>r.pid==id).length;

/* ---------- แท็บจัดการสินค้า ---------- */
const oldP=vP;
vP=function(v){
  oldP(v);
  v.querySelectorAll("[data-e]").forEach(b=>{
    const p=S.products.find(x=>x.id==b.dataset.e);if(!p)return;
    const R=rev(p.id),box=b.closest(".row").firstElementChild;
    if(p.cost>0){
      const d=R-p.cost;
      const t=d>=0?'<span style="color:var(--okt)">✅ คืนทุนแล้ว กำไร '+money(d)+"</span>":'<span style="color:var(--badt)">ยังขาดอีก '+money(-d)+"</span>";
      box.insertAdjacentHTML("beforeend",'<div class="mut">ต้นทุน '+money(p.cost)+" · ได้แล้ว "+money(R)+" · "+t+"</div>");
    }else box.insertAdjacentHTML("beforeend",'<div class="mut">ยังไม่ได้ใส่ต้นทุน</div>');
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="ต้นทุน";x.style.marginLeft="4px";
    x.onclick=()=>{
      const a=prompt("ต้นทุนซื้อกล้อง "+p.name+" (บาท)",p.cost||"");
      if(a===null)return;
      const n=parseFloat(String(a).replace(/,/g,""));
      if(!(n>=0))return alert("ใส่ตัวเลข");
      p.cost=n;save();render();
    };
    b.parentNode.insertBefore(x,b.nextSibling);
  });
  v.insertAdjacentHTML("beforeend",'<div class="card"><button class="btn g" id="bc">ตั้งต้นทุนหลายรุ่นพร้อมกัน</button></div>');
  $("bc").onclick=()=>{
    const s=prompt("พิมพ์ ชื่อรุ่น=ต้นทุน คั่นด้วยจุลภาค\nเช่น Ixy30s=2500,Ixy50s=1800,Instax mini 12=2200");
    if(!s)return;
    let ok=0;const miss=[];
    s.split(",").forEach(it=>{
      const i=it.lastIndexOf("=");if(i<0)return;
      const name=it.slice(0,i).trim().toLowerCase(),n=parseFloat(it.slice(i+1).replace(/\s/g,""));
      if(!name)return;
      const p=S.products.find(x=>x.name.trim().toLowerCase()==name);
      if(p&&n>=0){p.cost=n;ok++}else miss.push(it.slice(0,i).trim());
    });
    save();render();
    alert("ตั้งต้นทุน "+ok+" รุ่นแล้ว"+(miss.length?"\nไม่พบ: "+miss.join(", "):""));
  };
};

/* ---------- แท็บสรุปรายได้ ---------- */
const oldS=vS;
vS=function(v){
  oldS(v);
  let sc=0,sr=0;
  const rows=S.products.map(p=>{
    const R=rev(p.id),c=p.cost||0;sc+=c;sr+=R;
    const pct=c>0?Math.round(R/c*100):null,d=R-c;
    const res=c>0?(d>=0?'<span style="color:var(--okt)">กำไร '+n0(d)+"</span>":'<span style="color:var(--badt)">ขาด '+n0(-d)+"</span>"):"-";
    return "<tr><td>"+esc(p.name)+"</td><td>"+(c>0?n0(c):"-")+"</td><td>"+n0(R)+"</td><td>"+(pct===null?"-":pct+"%")+"</td><td>"+res+"</td><td>"+cnt(p.id)+"</td></tr>";
  }).join("");
  const tx=S.expenses.reduce((s,x)=>s+x.amt,0),net=sr-sc-tx;
  v.insertAdjacentHTML("beforeend",
   '<div class="card"><b>คืนทุน / กำไรแต่ละกล้อง (สะสมทุกปี)</b><div class="mut">ได้คืน % = ค่าเช่าที่ได้ ÷ ต้นทุนกล้อง ถ้าถึง 100% แปลว่าคืนทุนแล้ว</div><div class="cs"><table class="cp"><tr><th>รุ่น</th><th>ต้นทุน</th><th>ค่าเช่าที่ได้</th><th>ได้คืน</th><th>ผล</th><th>ครั้ง</th></tr>'
   +rows+'<tr class="t"><td>รวม</td><td>'+n0(sc)+"</td><td>"+n0(sr)+"</td><td>"+(sc>0?Math.round(sr/sc*100)+"%":"-")+"</td><td>"+n0(sr-sc)+"</td><td>"+S.rentals.length+"</td></tr></table></div>"
   +'<div class="mut" style="margin-top:8px">หักค่าใช้จ่ายร้านที่บันทึกไว้ทั้งหมด ('+n0(tx)+') แล้ว เหลือสุทธิ <b>'+n0(net)+"</b> บาท</div></div>");
};
render();
})();
