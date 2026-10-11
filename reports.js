(function(){
const CATS=["ค่าขนส่ง","ค่าบำรุงกล้อง","ค่าอุปกรณ์","ค่าฟิล์ม","อื่นๆ"];
const MN=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const cat=x=>CATS.includes(x.cat)?x.cat:"อื่นๆ";
const n0=n=>n?Number(n).toLocaleString("th-TH"):"-";
const tot=a=>a.reduce((s,x)=>s+x,0);
const st=document.createElement("style");
st.textContent=".rp{width:100%;border-collapse:collapse;font-size:13px}.rp th,.rp td{padding:6px 8px;text-align:right;border-bottom:1px solid var(--ln);white-space:nowrap}.rp th{color:var(--mut);font-weight:normal}.rp td:first-child,.rp th:first-child{text-align:left}.rp .sk{position:sticky;left:0;background:var(--card)}.rp tr.t td{font-weight:600}.sc{overflow-x:auto;margin-top:8px}";
document.head.appendChild(st);

/* ---------- ค่าใช้จ่ายแยกหมวด ---------- */
const oldE=vE;
vE=function(v){
  oldE(v);
  const xd=$("xd");if(!xd)return;
  xd.previousElementSibling.insertAdjacentHTML("beforebegin",'<label>หมวดค่าใช้จ่าย</label><select id="xc">'+CATS.map(c=>"<option>"+c+"</option>").join("")+"</select>");
  const xs=$("xs"),orig=xs.onclick;
  xs.onclick=function(ev){
    const c=$("xc").value,n=S.expenses.length;
    orig.call(this,ev);
    if(S.expenses.length>n){S.expenses[S.expenses.length-1].cat=c;save();render()}
  };
  v.querySelectorAll("[data-d]").forEach(b=>{
    const x=S.expenses.find(e=>e.id==b.dataset.d);if(!x)return;
    b.closest(".row").firstElementChild.insertAdjacentHTML("beforeend",'<div class="mut">'+cat(x)+"</div>");
    const c=document.createElement("button");
    c.className="btn g s";c.textContent="หมวด";c.style.marginRight="4px";
    c.onclick=()=>{
      const a=prompt("เลือกหมวด:\n"+CATS.map((t,i)=>(i+1)+" = "+t).join("\n"),CATS.indexOf(cat(x))+1);
      if(a===null)return;
      const i=parseInt(a)-1;
      if(!(i>=0&&i<CATS.length))return alert("ใส่เลข 1-"+CATS.length);
      x.cat=CATS[i];save();render();
    };
    b.parentNode.insertBefore(c,b);
  });
};

/* ---------- สรุปรายได้ ---------- */
const oldS=vS;
vS=function(v){
  oldS(v);
  const inc=Array(12).fill(0),exp=Array(12).fill(0),pc={},cc={};
  CATS.forEach(c=>cc[c]=0);
  S.rentals.forEach(r=>{
    if(+r.start.slice(0,4)!=yr)return;
    const m=+r.start.slice(5,7)-1;
    inc[m]+=r.amt;
    (pc[r.pid]=pc[r.pid]||Array(12).fill(0))[m]+=r.amt;
  });
  S.expenses.forEach(x=>{
    if(+x.date.slice(0,4)!=yr)return;
    exp[+x.date.slice(5,7)-1]+=x.amt;cc[cat(x)]+=x.amt;
  });
  let h='<div class="card"><b>รายได้ · ค่าใช้จ่าย · กำไร รายเดือน (ปี '+(yr+543)+')</b><div class="sc"><table class="rp"><tr><th>เดือน</th><th>รายได้</th><th>ค่าใช้จ่าย</th><th>กำไร</th></tr>'
   +MN.map((m,i)=>"<tr><td>"+m+"</td><td>"+n0(inc[i])+"</td><td>"+n0(exp[i])+"</td><td>"+n0(inc[i]-exp[i])+"</td></tr>").join("")
   +'<tr class="t"><td>รวม</td><td>'+n0(tot(inc))+"</td><td>"+n0(tot(exp))+"</td><td>"+n0(tot(inc)-tot(exp))+"</td></tr></table></div></div>";
  const ids=[...new Set([...S.products.map(p=>p.id),...Object.keys(pc).map(Number)])];
  h+='<div class="card"><b>ยอดเช่าแต่ละรุ่น รายเดือน (บาท)</b><div class="mut">นับตามวันรับกล้อง เลื่อนตารางไปทางขวาเพื่อดูครบทุกเดือน</div><div class="sc"><table class="rp" style="min-width:900px"><tr><th class="sk">รุ่น</th>'
   +MN.map(m=>"<th>"+m+"</th>").join("")+"<th>รวม</th></tr>"
   +ids.map(id=>{const a=pc[id]||Array(12).fill(0);return '<tr><td class="sk">'+esc(pname(id))+"</td>"+a.map(x=>"<td>"+n0(x)+"</td>").join("")+"<td><b>"+n0(tot(a))+"</b></td></tr>"}).join("")
   +'<tr class="t"><td class="sk">รวม</td>'+inc.map(x=>"<td>"+n0(x)+"</td>").join("")+"<td>"+n0(tot(inc))+"</td></tr></table></div></div>";
  h+='<div class="card"><b>ค่าใช้จ่ายแยกตามหมวด (ปี '+(yr+543)+')</b><div class="sc"><table class="rp">'
   +CATS.map(c=>"<tr><td>"+c+"</td><td>"+n0(cc[c])+"</td></tr>").join("")
   +'<tr class="t"><td>รวม</td><td>'+n0(tot(exp))+"</td></tr></table></div></div>";
  v.insertAdjacentHTML("beforeend",h);
};
render();
})();
