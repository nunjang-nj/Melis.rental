(function(){
TABS.push(["f","ขายฟิล์ม"]);
const n0=n=>Number(n||0).toLocaleString("th-TH");
const st=document.createElement("style");
st.textContent=".fp{width:100%;border-collapse:collapse;font-size:13px}.fp th,.fp td{padding:6px 8px;text-align:right;border-bottom:1px solid var(--ln)}.fp th{color:var(--mut);font-weight:normal}.fp td:first-child,.fp th:first-child{text-align:left}.fp tr.t td{font-weight:600}";
document.head.appendChild(st);
function ens(){
  if(!S.film)S.film={items:[{id:1,name:"Instax mini 10 ใบ",qty:10,cost:245,price:300},{id:2,name:"Instax mini 20 ใบ",qty:20,cost:490,price:600}],sales:[]};
  return S.film;
}
function vF(v){
  const F=ens();
  const rev=x=>x.units*x.price,pf=x=>x.units*(x.price-x.cost);
  const T=F.sales.reduce((a,x)=>({u:a.u+x.units,s:a.s+x.units*x.qty,r:a.r+rev(x),c:a.c+x.units*x.cost,p:a.p+pf(x)}),{u:0,s:0,r:0,c:0,p:0});
  const Y=new Date().getFullYear(),MN=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  const mo=Array.from({length:12},()=>({u:0,r:0,p:0}));
  F.sales.forEach(x=>{if(+x.date.slice(0,4)==Y){const m=mo[+x.date.slice(5,7)-1];m.u+=x.units;m.r+=rev(x);m.p+=pf(x)}});
  const L=[...F.sales].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  v.innerHTML='<div class="card"><b>บันทึกการขายฟิล์ม</b><label style="display:block;margin-top:8px">ชุดฟิล์ม</label><select id="ff_p">'
   +F.items.map(i=>'<option value="'+i.id+'">'+esc(i.name)+" (ขาย "+money(i.price)+" · ทุน "+money(i.cost)+")</option>").join("")
   +'</select><div class="g2"><div><label>จำนวนชุดที่ขาย</label><input type="number" id="ff_n" value="1" min="1"></div><div><label>วันที่</label><input type="date" id="ff_d" value="'+today()+'"></div></div>'
   +'<label>ผู้ซื้อ / หมายเหตุ</label><input id="ff_c"><button class="btn" id="ff_s">บันทึกการขาย</button></div>'
   +'<div class="card"><b>สรุปทั้งหมด</b><div class="g2" style="margin-top:8px"><div><div class="mut">ขายแล้ว</div><div class="big">'+T.u+' ชุด</div><div class="mut">'+T.s+' ใบ</div></div><div><div class="mut">รายรับ</div><div class="big">'+money(T.r)+'</div></div><div><div class="mut">ต้นทุน</div><div class="big">'+money(T.c)+'</div></div><div><div class="mut">กำไร</div><div class="big" style="color:var(--okt)">'+money(T.p)+"</div></div></div></div>"
   +'<div class="card"><b>รายเดือน (ปี '+(Y+543)+')</b><table class="fp"><tr><th>เดือน</th><th>ชุด</th><th>รายรับ</th><th>กำไร</th></tr>'
   +(mo.map((m,i)=>m.u?"<tr><td>"+MN[i]+"</td><td>"+m.u+"</td><td>"+n0(m.r)+"</td><td>"+n0(m.p)+"</td></tr>":"").join("")||'<tr><td colspan="4" class="mut">ยังไม่มีการขายในปีนี้</td></tr>')+"</table></div>"
   +'<div class="card"><b>ชุดฟิล์มและราคา</b>'+F.items.map(i=>'<div class="row"><div><b>'+esc(i.name)+'</b><div class="mut">ทุน '+money(i.cost)+" · ขาย "+money(i.price)+" · กำไร "+money(i.price-i.cost)+'/ชุด</div></div><button class="btn g s" data-ei="'+i.id+'">แก้ราคา</button></div>').join("")
   +'<button class="btn g" id="ff_a" style="margin-top:10px">+ เพิ่มชุดฟิล์มใหม่</button></div>'
   +'<div class="card"><b>ประวัติการขาย</b>'+(L.map(x=>'<div class="row"><div><b>'+esc(x.name)+" × "+x.units+'</b><div class="mut">'+fd(x.date)+(x.note?" · "+esc(x.note):"")+'</div></div><div style="text-align:right">'+money(rev(x))+'<div class="mut">กำไร '+money(pf(x))+'</div><button class="btn g s" data-ds="'+x.id+'">ลบ</button></div></div>').join("")||'<div class="mut">ยังไม่มีรายการขาย</div>')+"</div>";
  $("ff_s").onclick=()=>{
    const it=F.items.find(x=>x.id==$("ff_p").value),u=parseInt($("ff_n").value);
    if(!it)return alert("เลือกชุดฟิล์ม");
    if(!(u>0))return alert("ใส่จำนวนชุดที่ขาย");
    F.sales.push({id:S.next++,date:$("ff_d").value||today(),name:it.name,qty:it.qty,units:u,cost:it.cost,price:it.price,note:$("ff_c").value.trim()});
    save();render();
  };
  v.querySelectorAll("[data-ds]").forEach(b=>b.onclick=()=>{if(confirm("ลบรายการขายนี้?")){F.sales=F.sales.filter(x=>x.id!=b.dataset.ds);save();render()}});
  v.querySelectorAll("[data-ei]").forEach(b=>b.onclick=()=>{
    const it=F.items.find(x=>x.id==b.dataset.ei);
    const a=prompt("แก้ "+it.name+"\nพิมพ์: จำนวนใบ,ต้นทุน,ราคาขาย (เช่น 10,245,300)\n(ราคาใหม่มีผลกับการขายครั้งต่อไป ประวัติเดิมไม่เปลี่ยน)",[it.qty,it.cost,it.price].join(","));
    if(a===null)return;
    const n=a.split(",").map(x=>parseFloat(x));
    if(n.length!=3||n.some(x=>!(x>=0)))return alert("ใส่ตัวเลข 3 ตัวคั่นด้วยจุลภาค");
    if(/^Instax mini \d+ ใบ$/.test(it.name))it.name="Instax mini "+n[0]+" ใบ";
    it.qty=n[0];it.cost=n[1];it.price=n[2];save();render();
  });
  $("ff_a").onclick=()=>{
    const a=prompt("พิมพ์: ชื่อ,จำนวนใบ,ต้นทุน,ราคาขาย\nเช่น Instax Wide 10 ใบ,10,300,380");
    if(!a)return;
    const p=a.split(",").map(x=>x.trim()),n=p.slice(1).map(x=>parseFloat(x));
    if(p.length!=4||!p[0]||n.some(x=>!(x>=0)))return alert("ใส่ให้ครบ 4 ค่า คั่นด้วยจุลภาค");
    F.items.push({id:S.next++,name:p[0],qty:n[0],cost:n[1],price:n[2]});save();render();
  };
}
const oldRender=render;
render=function(){if(tab=="f"){nav();vF($("v"))}else oldRender()};
render();
})();
