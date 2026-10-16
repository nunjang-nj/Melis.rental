(function(){
const valid=o=>!!(o&&Array.isArray(o.products)&&Array.isArray(o.rentals)&&Array.isArray(o.expenses));
const foot=document.getElementById("ex").parentNode;
foot.insertAdjacentHTML("beforeend",'<br><a href="#" id="bk1" style="color:var(--pk)">⬇ ดาวน์โหลดข้อมูลสำรอง</a> · <a href="#" id="bk2" style="color:var(--pk)">⬆ นำเข้าจากไฟล์สำรอง</a>');

document.getElementById("bk1").onclick=e=>{
  e.preventDefault();
  const d=new Date(),p=n=>String(n).padStart(2,"0");
  const name="สำรองข้อมูลร้านเช่า-"+d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+".json";
  const blob=new Blob([JSON.stringify(S)],{type:"application/json"});
  const u=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=u;a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},1500);
};

document.getElementById("bk2").onclick=e=>{
  e.preventDefault();
  const inp=document.createElement("input");
  inp.type="file";inp.accept=".json,application/json";
  inp.onchange=()=>{
    const f=inp.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      let o;
      try{o=JSON.parse(r.result)}catch(x){return alert("อ่านไฟล์ไม่ได้ ไฟล์อาจไม่ใช่ไฟล์สำรองของระบบนี้")}
      if(!valid(o))return alert("ไฟล์นี้ไม่ใช่ไฟล์สำรองข้อมูลของระบบร้านเช่า");
      const msg="ไฟล์สำรองมี "+o.products.length+" สินค้า, "+o.rentals.length+" รายการเช่า, "+o.expenses.length+" ค่าใช้จ่าย\n\nข้อมูลในเครื่องนี้ ("+S.products.length+" สินค้า, "+S.rentals.length+" รายการเช่า, "+S.expenses.length+" ค่าใช้จ่าย) จะถูกแทนที่ด้วยข้อมูลจากไฟล์ ต้องการดำเนินการต่อไหม?";
      if(!confirm(msg))return;
      try{localStorage.setItem("rentalShopBeforeImport",JSON.stringify(S))}catch(x){}
      S=o;save();render();
      alert("นำเข้าข้อมูลเรียบร้อยแล้ว");
    };
    r.readAsText(f);
  };
  inp.click();
};
})();
