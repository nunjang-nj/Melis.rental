(function(){
const K3="rentalPromoCsvUrl";
const g=()=>{try{return localStorage.getItem(K3)||""}catch(e){return ""}};
function csv(t){const R=[];let r=[],c="",q=false;
  for(let i=0;i<t.length;i++){const ch=t[i];
    if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}
    else if(ch=='"')q=true;
    else if(ch==","){r.push(c);c=""}
    else if(ch=="\n"||ch=="\r"){if(ch=="\r"&&t[i+1]=="\n")i++;r.push(c);c="";R.push(r);r=[]}
    else c+=ch}
  if(c||r.length){r.push(c);R.push(r)}return R}
const num=x=>parseFloat(String(x||"").replace(/,/g,""))||0;
const f=document.getElementById("ex").parentNode;
f.insertAdjacentHTML("beforeend",'<br><a href="#" id="cp" style="color:var(--pk)">นำเข้าโปรโมชั่นจาก Sheets (CSV)</a>');
document.getElementById("cp").onclick=async e=>{
  e.preventDefault();
  const u=prompt("วางลิงก์ CSV ของแท็บโปรโมชั่น",g());if(!u)return;
  try{localStorage.setItem(K3,u.trim())}catch(x){}
  try{
    const txt=await (await fetch(u.trim())).text();
    if(/^\s*</.test(txt))return alert("ลิงก์นี้ไม่ใช่ CSV ตรวจสอบว่าเผยแพร่เป็น CSV และคัดลอกลิงก์ทั้งหมด");
    const all=csv(txt).filter(r=>r.some(c=>c&&c.trim()));
    if(all.length<2)return alert("ไม่พบข้อมูลโปรโมชั่น");
    const H=all[0].map(h=>(h||"").trim());
    const col=re=>H.findIndex(h=>re.test(h));
    const iN=Math.max(0,col(/รุ่น|ชื่อ|name/i)),i1=col(/1\s*วัน/),i2=col(/2\s*วัน/),i3=col(/3\s*วัน/),i4=col(/4\s*วัน/),iE=col(/ต่อไป|ถัดไป/);
    if(i2<0||i3<0||i4<0||iE<0)return alert("หัวตารางต้องมีคำว่า 2 วัน, 3 วัน, 4 วัน และ วันต่อไป");
    let ok=0;const miss=[];
    all.slice(1).forEach(r=>{
      const name=(r[iN]||"").trim();if(!name)return;
      const p=S.products.find(x=>x.name.trim().toLowerCase()==name.toLowerCase());
      if(!p){miss.push(name);return}
      if(i1>=0&&num(r[i1])>0)p.price=num(r[i1]);
      p.promo={d2:num(r[i2]),d3:num(r[i3]),d4:num(r[i4]),ex:num(r[iE])};
      ok++;
    });
    save();render();
    alert("ตั้งโปรโมชั่น "+ok+" รายการแล้ว"+(miss.length?"\nไม่พบสินค้า: "+miss.join(", ")+"\n(นำเข้าสินค้าจาก Sheets ก่อน)":""));
  }catch(x){alert("นำเข้าไม่สำเร็จ ตรวจสอบลิงก์และอินเทอร์เน็ต")}
};
})();
