(function(){
const mini=r=>{const p=S.products.find(x=>x.id==r.pid);return p&&/mini/i.test(p.name||"")};
const fix=S.rentals.filter(r=>mini(r)&&+r.dep===500);
if(!fix.length)return;
if(!confirm("พบรายการเช่า Instax mini "+fix.length+" รายการที่มัดจำ 500\nต้องการแก้เป็น 200 ไหม"))return;
fix.forEach(r=>{r.dep=200});
save();render();
alert("แก้มัดจำเป็น 200 แล้ว "+fix.length+" รายการ");
})();
