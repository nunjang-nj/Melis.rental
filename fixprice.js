(function(){
const T={400:230,350:180,180:99};
const fix=S.products.filter(p=>!(p.price>0)&&p.promo&&T[p.promo.d2]);
if(!fix.length)return;
const list=fix.map(p=>p.name+" → ฿"+T[p.promo.d2]+"/วัน").join("\n");
if(!confirm("พบสินค้า "+fix.length+" รายการที่ราคาต่อวันเป็น 0\nต้องการตั้งราคาให้ตามนี้ไหม\n\n"+list))return;
fix.forEach(p=>{p.price=T[p.promo.d2]});
save();render();
alert("ตั้งราคาให้ "+fix.length+" รายการแล้ว");
})();
