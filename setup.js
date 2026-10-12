(function(){
const SK="rentalSyncUrl";
const ok=u=>/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec(\?[\w=&%-]*)?$/.test(u);

/* 1) ลิงก์ตั้งค่าอัตโนมัติ: ...#sync=<ลิงก์ Web App ที่เข้ารหัสแล้ว> */
let cfg="";
try{
  const m=location.hash.match(/^#sync=(.+)$/);
  if(m){
    const u=decodeURIComponent(m[1]).trim();
    history.replaceState(null,"",location.pathname+location.search);
    if(ok(u)){localStorage.setItem(SK,u);cfg=u}
    else alert("ลิงก์ตั้งค่าไม่ถูกต้อง กรุณาขอลิงก์ใหม่");
  }
}catch(e){}

/* 2) ถ้าเครื่องนี้ยังไม่เคยมีข้อมูล และมีลิงก์ซิงค์ ให้ดึงจาก Sheets ให้เอง (ไม่ทับข้อมูลเดิม) */
async function boot(){
  let u="",fresh=false;
  try{u=localStorage.getItem(SK)||"";fresh=localStorage.getItem(K)===null}catch(e){return}
  if(!u)return;
  if(!fresh){if(cfg)alert("ตั้งค่าซิงค์เรียบร้อยแล้ว\nเครื่องนี้มีข้อมูลอยู่แล้ว หากต้องการข้อมูลล่าสุดให้กด ⬇ ดึงจาก Sheets ที่ท้ายหน้า");return}
  try{
    const o=await (await fetch(u)).json();
    if(!(o&&o.products&&o.rentals&&o.expenses)){if(cfg)alert("ตั้งค่าซิงค์เรียบร้อยแล้ว แต่ใน Sheets ยังไม่มีข้อมูลให้ดึง");return}
    S=o;save();render();
    alert("ตั้งค่าซิงค์และดึงข้อมูลจาก Sheets เรียบร้อยแล้ว");
  }catch(e){if(cfg)alert("ตั้งค่าซิงค์แล้ว แต่ดึงข้อมูลไม่สำเร็จ ลองกด ⬇ ดึงจาก Sheets อีกครั้ง")}
}
boot();
})();
