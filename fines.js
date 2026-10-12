(function(){
const T=["ทำกล้องเป็นรอย","อุปกรณ์เสียหาย","ไม่คืนอุปกรณ์","อื่นๆ"];
const sum=r=>(r.fines||[]).reduce((s,f)=>s+f.amt,0);

/* ---------- ประวัติการเช่า ---------- */
const oldH=vH;
vH=function(v){
  oldH(v);
  const all=[];
  S.rentals.forEach(r=>(r.fines||[]).forEach(f=>all.push(f)));
  v.insertAdjacentHTML("afterbegin",'<div class="card"><div class="mut">ค่าปรับสะสมทั้งหมด</div><div class="big">'+money(all.reduce((s,f)=>s+f.amt,0))+'</div><div class="mut">'+all.length+" รายการ</div></div>");
  v.querySelectorAll("[data-k]").forEach(b=>{
    const r=S.rentals.find(x=>x.id==b.dataset.k);if(!r)return;
    const box=b.closest(".row").firstElementChild,fs=r.fines||[];
    if(fs.length){
      let h='<div class="mut" style="color:var(--badt)">⚠️ ค่าปรับ '+money(sum(r))+"</div>"
        +fs.map(f=>'<div class="mut">• '+esc(f.type)+" "+money(f.amt)+(f.note?" · "+esc(f.note):"")+' <a href="#" data-fd="'+r.id+":"+f.id+'" style="color:var(--pk)">ลบ</a></div>').join("");
      if(r.dep>0&&(r.depSt==1||r.depSt==3)){
        const n=r.dep-sum(r);
        h+='<div class="mut">มัดจำ '+money(r.dep)+" − ค่าปรับ → "+(n>=0?"คืนลูกค้า "+money(n):"เก็บเพิ่ม "+money(-n))+"</div>";
      }
      box.insertAdjacentHTML("beforeend",h);
    }
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="ค่าปรับ";x.style.marginLeft="4px";
    x.onclick=()=>{
      const a=prompt("เพิ่มค่าปรับ\nประเภท: "+T.map((t,i)=>(i+1)+" = "+t).join(", ")+"\nพิมพ์: เลขประเภท,จำนวนเงิน เช่น 1,300","");
      if(a===null)return;
      const p=a.split(",").map(s=>parseFloat(s));
      if(!(Number.isInteger(p[0])&&p[0]>=1&&p[0]<=T.length&&p[1]>0))return alert("ใส่เช่น 1,300 (เลขประเภท 1-"+T.length+", จำนวนเงินมากกว่า 0)");
      const note=prompt("หมายเหตุ (เว้นว่างได้) เช่น เลนส์เป็นรอย / ชาร์จเจอร์หาย","");
      if(note===null)return;
      (r.fines=r.fines||[]).push({id:S.next++,type:T[p[0]-1],amt:p[1],note:note.trim(),date:today()});
      save();render();
    };
    b.parentNode.appendChild(x);
  });
  v.querySelectorAll("[data-fd]").forEach(a=>a.onclick=e=>{
    e.preventDefault();
    const q=a.dataset.fd.split(":"),r=S.rentals.find(x=>x.id==q[0]);
    if(r&&confirm("ลบค่าปรับนี้?")){r.fines=(r.fines||[]).filter(f=>f.id!=q[1]);save();render()}
  });
};

/* ---------- สรุปรายได้ ---------- */
const oldS=vS;
vS=function(v){
  oldS(v);
  const by={};T.forEach(t=>by[t]=0);
  let tot=0,n=0;
  S.rentals.forEach(r=>(r.fines||[]).forEach(f=>{
    if(+f.date.slice(0,4)==yr){by[f.type]=(by[f.type]||0)+f.amt;tot+=f.amt;n++}
  }));
  v.insertAdjacentHTML("beforeend",'<div class="card"><b>ค่าปรับ (ปี '+(yr+543)+')</b><div class="mut">แยกจากรายได้ค่าเช่าด้านบน</div>'
    +T.map(t=>'<div class="row"><span>'+t+"</span><span>"+money(by[t])+"</span></div>").join("")
    +'<div class="row"><b>รวม ('+n+" ครั้ง)</b><b>"+money(tot)+"</b></div></div>");
};
render();
})();
