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
    const all=csv(await (await fetch(u.trim())).text()).filter(r=>r.some(c=>c&&c.trim()));
    if(all.length<2)return alert("ไม่พบข้อมูลสินค้า");
    const H=all[0].map(h=>(h||"").trim());
    let iN=H.findIndex(h=>/ชื่อ|name/i.test(h));if(iN<0)iN=0;
    const iP=H.findIndex(h=>/ราคา|price|ค่าเช่า|บาท/i.test(h));
    const skip=H.map(h=>/รูป|image|photo/i.test(h));
    const rows=all.slice(1).filter(r=>r[iN]&&r[iN].trim());
    rows.forEach(r=>{
      const name=r[iN].trim();
      const note=H.map((h,i)=>(i==iN||i==iP||skip[i]||!r[i]||!r[i].trim())?"":h+": "+r[i].trim()).filter(Boolean).join(" · ");
      const price=iP>=0?(parseFloat(String(r[iP]||"").replace(/,/g,""))||0):null;
      const p=S.products.find(x=>x.name==name);
      if(p){if(price!==null)p.price=price;p.note=note}
      else S.products.push({id:S.next++,name,price:price||0,note});
    });
    save();render();
    alert("นำเข้า "+rows.length+" รายการแล้ว"+(iP<0?"\nไม่พบคอลัมน์ราคา (หัวตารางต้องมีคำว่า ราคา) จึงตั้งราคาเป็น 0":""));
  }catch(x){alert("นำเข้าไม่สำเร็จ ตรวจสอบว่าเผยแพร่เป็น CSV แล้ว")}
};
})();
