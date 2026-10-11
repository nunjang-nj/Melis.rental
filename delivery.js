(function(){
const M=["มารับเอง","ส่งโดย Messenger","พัสดุ"];
const lab=m=>m==2?"ที่อยู่จัดส่ง / เลขพัสดุ":m==1?"ที่อยู่ / เบอร์ผู้รับ":"";
function fixUrl(u){
  u=(u||"").trim();
  if(!u)return "";
  if(/^https?:\/\//i.test(u))return u;
  if(/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u))return "https://"+u;
  return "";
}

/* ช่องการจัดส่งในหน้าเช่าอุปกรณ์ */
const oldR=vR;
vR=function(v){
  oldR(v);
  if(!$("fi"))return;
  $("fi").insertAdjacentHTML("beforebegin",'<label>การจัดส่ง</label><select id="dm">'+M.map((x,i)=>'<option value="'+i+'">'+x+'</option>').join("")+'</select><div id="dw" style="display:none"><label id="dl"></label><input id="dn"><label>ลิงก์ Google Maps ที่ลูกค้าให้ไปส่ง</label><input id="dg" placeholder="วางลิงก์ที่นี่"></div>');
  $("dm").onchange=()=>{const m=+$("dm").value;$("dw").style.display=m?"block":"none";$("dl").textContent=lab(m)};
  const sv=$("sv"),orig=sv.onclick;
  sv.onclick=function(ev){
    const m=+$("dm").value,t=$("dn").value.trim(),g=m?$("dg").value.trim():"",n=S.rentals.length;
    orig.call(this,ev);
    if(S.rentals.length>n){const r=S.rentals[S.rentals.length-1];r.ship=m;r.shipNote=t;r.shipMap=fixUrl(g);save()}
  };
};

/* แสดงและแก้ไขในประวัติการเช่า */
const oldH=vH;
vH=function(v){
  oldH(v);
  v.querySelectorAll("[data-k]").forEach(b=>{
    const r=S.rentals.find(x=>x.id==b.dataset.k);if(!r)return;
    const row=b.closest(".row");
    row.firstElementChild.insertAdjacentHTML("beforeend",'<div class="mut">🚚 '+M[r.ship||0]+(r.shipNote?" · "+esc(r.shipNote):"")+(r.shipMap?' · <a href="'+esc(r.shipMap)+'" target="_blank" rel="noopener" style="color:var(--pk)">📍 เปิดแผนที่</a>':"")+"</div>");
    const x=document.createElement("button");
    x.className="btn g s";x.textContent="จัดส่ง";x.style.marginLeft="4px";
    x.onclick=()=>{
      const a=prompt("วิธีรับ-ส่ง: 1 = มารับเอง, 2 = ส่งโดย Messenger, 3 = พัสดุ",(r.ship||0)+1);
      if(a===null)return;
      const m=parseInt(a)-1;
      if(!(m>=0&&m<3))return alert("ใส่เลข 1, 2 หรือ 3");
      let t="",g="";
      if(m>0){
        t=prompt(lab(m),r.shipNote||"");if(t===null)return;
        g=prompt("ลิงก์ Google Maps ที่ลูกค้าให้ไปส่ง (เว้นว่างได้)",r.shipMap||"");if(g===null)return;
        if(g.trim()&&!fixUrl(g))return alert("ลิงก์ไม่ถูกต้อง ต้องขึ้นต้นด้วย https://");
      }
      r.ship=m;r.shipNote=m?t.trim():"";r.shipMap=m?fixUrl(g):"";save();render();
    };
    b.parentNode.appendChild(x);
  });
};
render();
})();
