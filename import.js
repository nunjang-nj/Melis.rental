(function(){
const K2="rentalCsvUrl";
const g=()=>{try{return localStorage.getItem(K2)||""}catch(e){return ""}};
function csv(t){const R=[];let r=[],c="",q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}
    else if(ch=='"')q=true;
    else if(ch==","){r.push(c);c=""}
    else if(ch=="\n"||ch=="\r"){if(ch=="\r"&&t[i+1]=="\n")i++;r.push(c);c="";R.push(r);r=[]}
    else c+=ch}
  if(c||r.length){r.push(c);R.push(r)}return R}
const f=document.getElementById("ex").parentNode;
f.insertAdjacentHTML("beforeend",'<br><a href="#" id="ci" style="color:var(--pk)">นำเข้าสินค้าจาก Sheets (CSV)</a>');
document.getElementById("ci").onclick=async e=>{
  e.preventDefault();
  const u=prompt("วางลิงก์ CSV จาก Google Sheets",g());if(!u)return;
  try{localStorage.setItem(K2,u.trim())}catch(x){}
  try{
    const rows=csv(await (await fetch(u.trim())).text()).slice(1).filter(r=>r[0]&&r[0].trim());
    if(!rows.length)return alert("ไม่พบข้อมูลสินค้า");
    rows.forEach(r=>{
      const name=r[0].trim(),price=parseFloat(String(r[1]||"").replace(/,/g,""))||0,note=(r[2]||"").trim();
      const p=S.products.find(x=>x.name==name);
      if(p){p.price=price;p.note=note}else S.products.push({id:S.next++,name,price,note});
    });
    save();render();alert("นำเข้า "+rows.length+" รายการแล้ว");
  }catch(x){alert("นำเข้าไม่สำเร็จ ตรวจสอบว่าเผยแพร่เป็น CSV แล้ว")}
};
})();
