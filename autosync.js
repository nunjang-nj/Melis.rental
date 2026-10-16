(function(){
const SK="rentalSyncUrl",BK="rentalSyncBase";
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const st=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const strip=o=>JSON.stringify(o);
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h)};
const url=()=>g(SK)||"";
const valid=o=>!!(o&&o.products&&o.rentals&&o.expenses);
const typing=()=>{const a=document.activeElement;return !!a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)};
let working=false,conflict=false;

const foot=document.getElementById("ex").parentNode;
foot.insertAdjacentHTML("beforeend",'<br><span class="mut" id="as_st">ซิงค์อัตโนมัติ: กำลังเริ่ม...</span>');
const say=t=>{const e=document.getElementById("as_st");if(e)e.textContent="ซิงค์อัตโนมัติ: "+t};
const hm=()=>new Date().toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"});

function adopt(o){
  S=o;save();st(BK,hash(strip(o)));render();say("✅ อัปเดตจาก Sheets เมื่อ "+hm());
}
async function push(){
  const body=strip(S),h=hash(body);
  await fetch(url(),{method:"POST",body});
  st(BK,h);say("✅ ส่งขึ้น Sheets แล้วเมื่อ "+hm());
}
function ask(remote){
  conflict=true;
  say("⚠️ ข้อมูลไม่ตรงกัน");
  const d=document.createElement("div");
  d.style.cssText="position:fixed;left:12px;right:12px;top:12px;z-index:9999;background:var(--card,#fff);color:var(--tx,#222);border:2px solid #d9569a;border-radius:16px;padding:14px;box-shadow:0 8px 30px rgba(0,0,0,.3)";
  d.innerHTML='<b>ข้อมูลในเครื่องนี้กับ Sheets ไม่ตรงกัน</b><div style="font-size:13px;margin:6px 0 10px">ต้องเลือกว่าจะใช้ข้อมูลของที่ไหน อีกฝั่งจะถูกแทนที่</div>'
   +'<button class="btn" id="as_a" style="width:100%;margin-bottom:8px">ใช้ข้อมูลจาก Sheets (แทนที่ในเครื่องนี้)</button>'
   +'<button class="btn g" id="as_b" style="width:100%">ใช้ข้อมูลในเครื่องนี้ (แทนที่ใน Sheets)</button>';
  document.body.appendChild(d);
  document.getElementById("as_a").onclick=()=>{d.remove();conflict=false;adopt(remote)};
  document.getElementById("as_b").onclick=async()=>{
    d.remove();
    try{await push()}catch(e){say("ส่งไม่สำเร็จ จะลองใหม่")}
    conflict=false;
  };
}

async function tick(){
  if(working||conflict||!url())return;
  working=true;
  try{
    const remote=await (await fetch(url())).json();
    const cur=hash(strip(S)),base=g(BK);
    if(!valid(remote)){
      if(valid(S)&&g(K)!==null)await push();
      return;
    }
    const rh=hash(strip(remote));
    if(base===null){
      if(rh===cur){st(BK,cur);say("✅ ตรงกับ Sheets แล้ว");return}
      if(g(K)===null){adopt(remote);return}
      ask(remote);return;
    }
    const lc=cur!==base,rc=rh!==base;
    if(!lc&&!rc){say("✅ ข้อมูลเป็นปัจจุบัน "+hm());return}
    if(rc&&!lc){if(typing())return;adopt(remote);return}
    if(lc&&!rc){await push();return}
    if(rh===cur){st(BK,cur);say("✅ ตรงกับ Sheets แล้ว");return}
    ask(remote);
  }catch(e){say("ออฟไลน์ จะลองใหม่อัตโนมัติ")}
  finally{working=false}
}

if(!url())say("ยังไม่ได้ตั้งค่าลิงก์ซิงค์");
setTimeout(tick,2500);
setInterval(()=>{if(url()&&g(BK)!==null&&hash(strip(S))!==g(BK))tick()},3000);
setInterval(()=>{if(!document.hidden)tick()},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick()});
})();
