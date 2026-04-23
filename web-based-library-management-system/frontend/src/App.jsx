import { useState, useEffect, useCallback } from "react";

const BASE = "http://localhost:8080/api";

// Colors
const C = {
  bg:        "#FDF6EC",
  bgLight:   "#FFFDF8",
  sidebar:   "#4A2810",
  sidebarAc: "#6B3A2A",
  accent:    "#8B4513",
  accent2:   "#A0522D",
  border:    "#DEB887",
  text:      "#4A2810",
  textMid:   "#6B3A2A",
  textLight: "#8B6914",
  white:     "#ffffff",
  headerBg:  "#FAF0E6",
};

async function req(url, method="GET", body=null) {
  const opts={method,headers:{"Content-Type":"application/json"}};
  if(body) opts.body=JSON.stringify(body);
  const res=await fetch(url,opts);
  const json=await res.json();
  if(!res.ok) throw new Error(json.message||"Request failed");
  return json;
}

// ── Badge ──────────────────────────────────────────────────────────────────────
function Badge({val}) {
  const m={
    ACTIVE:{bg:"#D5F5E3",c:"#1E8449"},INACTIVE:{bg:"#FADBD8",c:"#A93226"},
    AVAILABLE:{bg:"#D5F5E3",c:"#1E8449"},UNAVAILABLE:{bg:"#FADBD8",c:"#A93226"},
    BORROWED:{bg:"#D6EAF8",c:"#1A5276"},RETURNED:{bg:"#D5F5E3",c:"#1E8449"},
    OVERDUE:{bg:"#FADBD8",c:"#A93226"},PENDING:{bg:"#FEF9E7",c:"#9A7D0A"},
    CONFIRMED:{bg:"#D5F5E3",c:"#1E8449"},CANCELLED:{bg:"#FADBD8",c:"#A93226"},
    COMPLETED:{bg:"#E8DAEF",c:"#6C3483"},UNPAID:{bg:"#FADBD8",c:"#A93226"},
    PAID:{bg:"#D5F5E3",c:"#1E8449"},FINE_PENDING:{bg:"#FEF9E7",c:"#9A7D0A"},FINE_PAID:{bg:"#D5F5E3",c:"#1E8449"},
  };
  const s=m[val]||{bg:"#F2F3F4",c:"#566573"};
  return <span style={{background:s.bg,color:s.c,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:"bold",whiteSpace:"nowrap",border:`1px solid ${s.c}30`}}>{val}</span>;
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({msg,type,onClose}) {
  useEffect(()=>{if(msg){const t=setTimeout(onClose,3500);return()=>clearTimeout(t);}},[msg]);
  if(!msg) return null;
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:type==="error"?"#922B21":C.accent,color:"#fff",padding:"13px 20px",borderRadius:12,fontSize:14,boxShadow:"0 8px 24px rgba(139,69,19,.2)",maxWidth:320,fontFamily:"Georgia,serif",border:`1px solid ${type==="error"?"#E74C3C":"#6B3A2A"}`}}>
      {type==="error"?"⚠ ":"📖 "}{msg}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({title,onClose,children}) {
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(74,40,16,.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:20,width:"100%",maxWidth:620,boxShadow:"0 20px 60px rgba(139,69,19,.2)",overflow:"hidden",animation:"fadeUp 0.25s ease",maxHeight:"90vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 24px",background:`linear-gradient(135deg,${C.sidebar},${C.sidebarAc})`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{color:"#fff",fontWeight:"bold",fontSize:16,fontFamily:"Georgia,serif"}}>📖 {title}</span>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:30,height:30,borderRadius:6,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"24px",overflowY:"auto",flex:1,background:C.bgLight}}>{children}</div>
      </div>
    </div>
  );
}

// ── View Modal ─────────────────────────────────────────────────────────────────
function ViewModal({data,fields,title,onClose}) {
  return(
    <Modal title={title} onClose={onClose}>
      {fields.map(f=>(
        <div key={f.key} style={{display:"flex",padding:"10px 0",borderBottom:`1px solid ${C.border}40`}}>
          <div style={{width:160,flexShrink:0,fontSize:12,fontWeight:"bold",color:C.textLight,fontFamily:"Georgia,serif"}}>{f.label}</div>
          <div style={{fontSize:13,color:C.text,fontFamily:"Georgia,serif"}}>{data[f.key]!=null?String(data[f.key]):"—"}</div>
        </div>
      ))}
    </Modal>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────────
function DeleteModal({onConfirm,onClose,saving,name}) {
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(74,40,16,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:C.bgLight,border:`1px solid ${C.border}`,borderRadius:20,maxWidth:380,width:"100%",padding:32,textAlign:"center",boxShadow:"0 20px 60px rgba(139,69,19,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:48,marginBottom:12}}>📕</div>
        <div style={{fontWeight:"bold",fontSize:17,color:C.text,marginBottom:8,fontFamily:"Georgia,serif"}}>Remove this record?</div>
        <div style={{color:C.textLight,fontSize:13,marginBottom:24,fontFamily:"Georgia,serif"}}>{name}</div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={onClose} style={{padding:"10px 24px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.white,cursor:"pointer",fontWeight:"bold",fontSize:13,color:C.text,fontFamily:"Georgia,serif"}}>Cancel</button>
          <button onClick={onConfirm} disabled={saving} style={{padding:"10px 24px",borderRadius:10,border:"none",background:saving?"#C4A882":"#922B21",color:"#fff",cursor:saving?"not-allowed":"pointer",fontWeight:"bold",fontSize:13,fontFamily:"Georgia,serif"}}>
            {saving?"Removing…":"Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Shared input styles ────────────────────────────────────────────────────────
const inp=(err)=>({width:"100%",padding:"10px 12px",borderRadius:8,fontSize:13,boxSizing:"border-box",border:`1.5px solid ${err?"#E74C3C":C.border}`,background:err?"#FEF3F0":C.bgLight,color:C.text,fontFamily:"Georgia,serif",outline:"none",transition:"all 0.2s"});
const lbl={display:"block",fontSize:11,fontWeight:"bold",color:C.textLight,marginBottom:6,letterSpacing:0.5,fontFamily:"Georgia,serif"};
const BtnPrimary=({onClick,disabled,children,style={}})=>(
  <button onClick={onClick} disabled={disabled} style={{padding:"10px 26px",borderRadius:10,border:"none",background:disabled?"#C4A882":`linear-gradient(135deg,${C.accent},${C.accent2})`,color:"#fff",cursor:disabled?"not-allowed":"pointer",fontSize:13,fontWeight:"bold",fontFamily:"Georgia,serif",boxShadow:disabled?"none":"0 4px 12px rgba(139,69,19,.25)",transition:"all 0.2s",...style}}>{children}</button>
);
const BtnSecondary=({onClick,children})=>(
  <button onClick={onClick} style={{padding:"10px 22px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.white,color:C.text,cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",fontWeight:"bold"}}>{children}</button>
);

// ─────────────────────────────────────────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────────────────────────────────────────
function UserForm({initial,onSave,onClose,saving}) {
  const [f,setF]=useState({name:"",email:"",phone:"",role:"STUDENT",status:"ACTIVE",address:"",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    const err={};
    if(!f.name?.trim()) err.name="Required";
    if(!f.email?.includes("@")) err.email="Valid email required";
    if(!f.phone?.trim()) err.phone="Required";
    if(Object.keys(err).length){setE(err);return;}
    onSave(f);
  };
  return(<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      {[["name","Full Name",true],["email","Email",true,"email"],["phone","Phone",true],["address","Address",false]].map(([k,lb,req,tp="text"])=>(
        <div key={k} style={{marginBottom:14,gridColumn:k==="address"?"1/-1":"auto"}}>
          <label style={lbl}>{lb}{req?" *":""}</label>
          <input style={inp(e[k])} value={f[k]||""} type={tp} onChange={x=>set(k,x.target.value)} placeholder={lb}/>
          {e[k]&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e[k]}</div>}
        </div>
      ))}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Role *</label>
        <select style={inp(false)} value={f.role} onChange={x=>set("role",x.target.value)}>
          {["STUDENT","LECTURER","STAFF"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["ACTIVE","INACTIVE"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Create User"}</BtnPrimary>
    </div>
  </>);
}

function BookForm({initial,onSave,onClose,saving}) {
  const [f,setF]=useState({title:"",author:"",isbn:"",category:"",publisher:"",quantity:1,available:1,status:"AVAILABLE",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    const err={};
    if(!f.title?.trim()) err.title="Required";
    if(!f.author?.trim()) err.author="Required";
    if(!f.isbn?.trim()) err.isbn="Required";
    if(Object.keys(err).length){setE(err);return;}
    onSave(f);
  };
  return(<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      {[["title","Book Title",true],["author","Author",true],["isbn","ISBN",true],["category","Category",false],["publisher","Publisher",false]].map(([k,lb,req])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={lbl}>{lb}{req?" *":""}</label>
          <input style={inp(e[k])} value={f[k]||""} onChange={x=>set(k,x.target.value)} placeholder={lb}/>
          {e[k]&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e[k]}</div>}
        </div>
      ))}
      {[["quantity","Quantity"],["available","Available"]].map(([k,lb])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={lbl}>{lb}</label>
          <input style={inp(false)} type="number" value={f[k]} onChange={x=>set(k,parseInt(x.target.value)||0)}/>
        </div>
      ))}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["AVAILABLE","UNAVAILABLE"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Add Book"}</BtnPrimary>
    </div>
  </>);
}

function BorrowForm({initial,onSave,onClose,saving}) {
  const [users,setUsers]=useState([]);
  const [books,setBooks]=useState([]);
  const [f,setF]=useState({userId:"",memberName:"",bookId:"",bookTitle:"",dueDate:"",status:"BORROWED",notes:"",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{
    req(`${BASE}/users`).then(r=>setUsers(r.data||[])).catch(()=>{});
    req(`${BASE}/books`).then(r=>setBooks((r.data||[]).filter(b=>b.status==="AVAILABLE"))).catch(()=>{});
  },[]);
  const pickUser=(id)=>{const u=users.find(x=>x.id==id);setF(p=>({...p,userId:id,memberName:u?u.name:""}));};
  const pickBook=(id)=>{const b=books.find(x=>x.id==id);setF(p=>({...p,bookId:id,bookTitle:b?b.title:""}));};
  const submit=()=>{
    const err={};
    if(!f.memberName) err.member="Select a member";
    if(!f.bookTitle) err.book="Select a book";
    if(!f.dueDate) err.dueDate="Required";
    else if(new Date(f.dueDate)<=new Date()) err.dueDate="Must be future date";
    if(Object.keys(err).length){setE(err);return;}
    onSave(f);
  };
  return(<>
    <div style={{marginBottom:14}}>
      <label style={lbl}>Select Member *</label>
      <select style={inp(e.member)} value={f.userId} onChange={x=>pickUser(x.target.value)}>
        <option value="">-- Choose Member --</option>
        {users.filter(u=>u.status==="ACTIVE").map(u=><option key={u.id} value={u.id}>#{u.id} — {u.name} ({u.role})</option>)}
      </select>
      {e.member&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.member}</div>}
    </div>
    {f.memberName&&<div style={{marginBottom:14,padding:"8px 14px",background:"#EBF5FB",borderRadius:8,border:"1px solid #AED6F1",fontSize:12,color:"#1A5276",fontFamily:"Georgia,serif"}}>👤 Member: <strong>{f.memberName}</strong></div>}
    <div style={{marginBottom:14}}>
      <label style={lbl}>Select Book *</label>
      <select style={inp(e.book)} value={f.bookId} onChange={x=>pickBook(x.target.value)}>
        <option value="">-- Choose Book (Available only) --</option>
        {books.map(b=><option key={b.id} value={b.id}>#{b.id} — {b.title} by {b.author} (Avail: {b.available})</option>)}
      </select>
      {e.book&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.book}</div>}
    </div>
    {f.bookTitle&&<div style={{marginBottom:14,padding:"8px 14px",background:"#EAFAF1",borderRadius:8,border:"1px solid #A9DFBF",fontSize:12,color:"#1E8449",fontFamily:"Georgia,serif"}}>📚 Book: <strong>{f.bookTitle}</strong></div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Due Date *</label>
        <input style={inp(e.dueDate)} type="date" value={f.dueDate} min={new Date(Date.now()+86400000).toISOString().split("T")[0]} onChange={x=>set("dueDate",x.target.value)}/>
        {e.dueDate&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.dueDate}</div>}
      </div>
      {initial&&<div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["BORROWED","RETURNED","OVERDUE"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>}
    </div>
    <div style={{marginBottom:14}}>
      <label style={lbl}>Notes</label>
      <input style={inp(false)} value={f.notes||""} onChange={x=>set("notes",x.target.value)} placeholder="Optional notes"/>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Issue Book"}</BtnPrimary>
    </div>
  </>);
}

function ReturnForm({initial,onSave,onClose,saving}) {
  const [borrows,setBorrows]=useState([]);
  const [f,setF]=useState({borrowId:"",memberName:"",bookTitle:"",dueDate:"",returnDate:new Date().toISOString().split("T")[0],status:"RETURNED",notes:"",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{req(`${BASE}/borrows?status=BORROWED`).then(r=>setBorrows(r.data||[])).catch(()=>{});},[]);
  const pickBorrow=(id)=>{const b=borrows.find(x=>x.id==id);if(b)setF(p=>({...p,borrowId:id,memberName:b.memberName,bookTitle:b.bookTitle,dueDate:b.dueDate}));};
  const submit=()=>{
    const err={};
    if(!f.memberName) err.borrow="Select a borrow record";
    if(!f.returnDate) err.returnDate="Required";
    if(Object.keys(err).length){setE(err);return;}
    onSave(f);
  };
  // Late days preview
  const late=f.dueDate&&f.returnDate?Math.max(0,Math.ceil((new Date(f.returnDate)-new Date(f.dueDate))/(1000*60*60*24))):null;
  return(<>
    {!initial&&<>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Select Borrow Record *</label>
        <select style={inp(e.borrow)} value={f.borrowId} onChange={x=>pickBorrow(x.target.value)}>
          <option value="">-- Choose active borrow --</option>
          {borrows.map(b=><option key={b.id} value={b.id}>#{b.id} — {b.memberName} → {b.bookTitle} (Due: {b.dueDate})</option>)}
        </select>
        {e.borrow&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.borrow}</div>}
      </div>
      {f.memberName&&<div style={{marginBottom:14,padding:"10px 14px",background:"#F4ECF7",borderRadius:8,border:"1px solid #C39BD3",fontSize:12,color:"#6C3483",fontFamily:"Georgia,serif"}}>
        👤 <strong>{f.memberName}</strong> → 📚 <strong>{f.bookTitle}</strong> | Due: {f.dueDate}
      </div>}
    </>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Return Date *</label>
        <input style={inp(e.returnDate)} type="date" value={f.returnDate} onChange={x=>set("returnDate",x.target.value)}/>
        {e.returnDate&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.returnDate}</div>}
      </div>
      {initial&&<div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["RETURNED","FINE_PENDING","FINE_PAID"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>}
    </div>
    {late!==null&&f.dueDate&&<div style={{marginBottom:14,padding:"10px 14px",background:late>0?"#FDEDEC":"#EAFAF1",borderRadius:8,border:`1px solid ${late>0?"#F1948A":"#A9DFBF"}`,fontSize:12,color:late>0?"#922B21":"#1E8449",fontFamily:"Georgia,serif"}}>
      {late>0?`⚠ Late by ${late} day${late>1?"s":""} — Fine: Rs.${late*10}`:"✓ On time — No fine!"}
    </div>}
    <div style={{marginBottom:14}}>
      <label style={lbl}>Notes</label>
      <input style={inp(false)} value={f.notes||""} onChange={x=>set("notes",x.target.value)} placeholder="Optional notes"/>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Record Return"}</BtnPrimary>
    </div>
  </>);
}

function ReservationForm({initial,onSave,onClose,saving}) {
  const [users,setUsers]=useState([]);
  const [books,setBooks]=useState([]);
  const [f,setF]=useState({memberName:"",memberEmail:"",bookTitle:"",author:"",isbn:"",dueDate:"",status:"PENDING",notes:"",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{
    req(`${BASE}/users`).then(r=>setUsers(r.data||[])).catch(()=>{});
    req(`${BASE}/books`).then(r=>setBooks(r.data||[])).catch(()=>{});
  },[]);
  const pickUser=(id)=>{const u=users.find(x=>x.id==id);if(u)setF(p=>({...p,memberName:u.name,memberEmail:u.email}));};
  const pickBook=(id)=>{const b=books.find(x=>x.id==id);if(b)setF(p=>({...p,bookTitle:b.title,author:b.author,isbn:b.isbn}));};
  const submit=()=>{
    const err={};
    if(!f.memberName) err.member="Select a member";
    if(!f.bookTitle) err.book="Select a book";
    if(!f.dueDate) err.dueDate="Required";
    else if(!initial&&new Date(f.dueDate)<=new Date()) err.dueDate="Must be future";
    if(Object.keys(err).length){setE(err);return;}
    onSave(f);
  };
  return(<>
    <div style={{marginBottom:14}}>
      <label style={lbl}>Select Member *</label>
      <select style={inp(e.member)} onChange={x=>pickUser(x.target.value)} defaultValue="">
        <option value="">-- Choose Member --</option>
        {users.filter(u=>u.status==="ACTIVE").map(u=><option key={u.id} value={u.id}>#{u.id} — {u.name} ({u.role})</option>)}
      </select>
      {e.member&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.member}</div>}
    </div>
    {f.memberName&&<div style={{marginBottom:14,padding:"8px 14px",background:"#EBF5FB",borderRadius:8,border:"1px solid #AED6F1",fontSize:12,color:"#1A5276",fontFamily:"Georgia,serif"}}>👤 <strong>{f.memberName}</strong> — {f.memberEmail}</div>}
    <div style={{marginBottom:14}}>
      <label style={lbl}>Select Book *</label>
      <select style={inp(e.book)} onChange={x=>pickBook(x.target.value)} defaultValue="">
        <option value="">-- Choose Book --</option>
        {books.map(b=><option key={b.id} value={b.id}>#{b.id} — {b.title} by {b.author}</option>)}
      </select>
      {e.book&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.book}</div>}
    </div>
    {f.bookTitle&&<div style={{marginBottom:14,padding:"8px 14px",background:"#EAFAF1",borderRadius:8,border:"1px solid #A9DFBF",fontSize:12,color:"#1E8449",fontFamily:"Georgia,serif"}}>📚 <strong>{f.bookTitle}</strong> — {f.isbn}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Due Date *</label>
        <input style={inp(e.dueDate)} type="date" value={f.dueDate}
          min={!initial?new Date(Date.now()+86400000).toISOString().split("T")[0]:undefined}
          onChange={x=>set("dueDate",x.target.value)}/>
        {e.dueDate&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.dueDate}</div>}
      </div>
      {initial&&<div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["PENDING","CONFIRMED","CANCELLED","COMPLETED","OVERDUE"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>}
    </div>
    <div style={{marginBottom:14}}>
      <label style={lbl}>Notes</label>
      <input style={inp(false)} value={f.notes||""} onChange={x=>set("notes",x.target.value)} placeholder="Optional"/>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Reserve"}</BtnPrimary>
    </div>
  </>);
}

function FineForm({initial,onSave,onClose,saving}) {
  const [borrows,setBorrows]=useState([]);
  const [f,setF]=useState({borrowId:"",memberName:"",bookTitle:"",dueDate:"",returnDate:new Date().toISOString().split("T")[0],finePerDay:10,status:"UNPAID",notes:"",...(initial||{})});
  const [e,setE]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  useEffect(()=>{req(`${BASE}/borrows`).then(r=>setBorrows(r.data||[])).catch(()=>{});},[]);
  const pickBorrow=(id)=>{const b=borrows.find(x=>x.id==id);if(b)setF(p=>({...p,borrowId:id,memberName:b.memberName,bookTitle:b.bookTitle,dueDate:b.dueDate}));};
  const late=f.dueDate&&f.returnDate?Math.max(0,Math.ceil((new Date(f.returnDate)-new Date(f.dueDate))/(1000*60*60*24))):0;
  const total=late*(f.finePerDay||10);
  const submit=()=>{
    const err={};
    if(!f.memberName) err.borrow="Select a borrow record";
    if(!f.returnDate) err.returnDate="Required";
    if(Object.keys(err).length){setE(err);return;}
    onSave({...f,lateDays:late,totalFine:total});
  };
  return(<>
    {!initial&&<>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Select Borrow Record *</label>
        <select style={inp(e.borrow)} value={f.borrowId} onChange={x=>pickBorrow(x.target.value)}>
          <option value="">-- Choose borrow record --</option>
          {borrows.map(b=><option key={b.id} value={b.id}>#{b.id} — {b.memberName} → {b.bookTitle} (Due: {b.dueDate})</option>)}
        </select>
        {e.borrow&&<div style={{color:"#E74C3C",fontSize:11,marginTop:3}}>⚠ {e.borrow}</div>}
      </div>
      {f.memberName&&<div style={{marginBottom:14,padding:"10px 14px",background:"#F4ECF7",borderRadius:8,border:"1px solid #C39BD3",fontSize:12,color:"#6C3483",fontFamily:"Georgia,serif"}}>
        👤 <strong>{f.memberName}</strong> → 📚 <strong>{f.bookTitle}</strong> | Due: {f.dueDate}
      </div>}
    </>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Return Date *</label>
        <input style={inp(e.returnDate)} type="date" value={f.returnDate} onChange={x=>set("returnDate",x.target.value)}/>
      </div>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Fine Per Day (Rs.)</label>
        <input style={inp(false)} type="number" value={f.finePerDay} onChange={x=>set("finePerDay",parseFloat(x.target.value)||10)}/>
      </div>
      {initial&&<div style={{marginBottom:14}}>
        <label style={lbl}>Status</label>
        <select style={inp(false)} value={f.status} onChange={x=>set("status",x.target.value)}>
          {["UNPAID","PAID"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>}
    </div>
    {f.dueDate&&f.returnDate&&<div style={{marginBottom:14,padding:"12px 16px",background:late>0?"#FDEDEC":"#EAFAF1",borderRadius:10,border:`1px solid ${late>0?"#F1948A":"#A9DFBF"}`,fontFamily:"Georgia,serif"}}>
      <div style={{fontSize:11,fontWeight:"bold",color:C.textLight,marginBottom:6}}>FINE CALCULATION</div>
      <div style={{fontSize:14,fontWeight:"bold",color:late>0?"#922B21":"#1E8449"}}>
        {late} day{late!==1?"s":""} × Rs.{f.finePerDay} = <strong>Rs.{total.toFixed(2)}</strong>
        {late===0&&" ✓ No fine!"}
      </div>
    </div>}
    <div style={{marginBottom:14}}>
      <label style={lbl}>Notes</label>
      <input style={inp(false)} value={f.notes||""} onChange={x=>set("notes",x.target.value)} placeholder="Optional"/>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
      <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
      <BtnPrimary onClick={submit} disabled={saving}>{saving?"Saving…":initial?"Update":"Calculate & Save"}</BtnPrimary>
    </div>
  </>);
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_VALS=["ACTIVE","INACTIVE","AVAILABLE","UNAVAILABLE","BORROWED","RETURNED","OVERDUE","PENDING","CONFIRMED","CANCELLED","COMPLETED","UNPAID","PAID","FINE_PENDING","FINE_PAID"];

function Table({columns,rows,onView,onEdit,onDelete,loading}) {
  return(
    <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(139,69,19,.06)"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:`linear-gradient(135deg,${C.sidebar},${C.sidebarAc})`}}>
              {[...columns,"Actions"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"left",color:"rgba(255,255,255,.85)",fontSize:11,fontWeight:"bold",letterSpacing:0.8,whiteSpace:"nowrap",fontFamily:"Georgia,serif"}}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading?(
              <tr><td colSpan={columns.length+1} style={{padding:48,textAlign:"center",color:C.textLight,fontSize:13,fontFamily:"Georgia,serif"}}>📖 Loading records…</td></tr>
            ):rows.length===0?(
              <tr><td colSpan={columns.length+1} style={{padding:56,textAlign:"center"}}>
                <div style={{fontSize:44,marginBottom:10}}>📚</div>
                <div style={{color:C.textLight,fontSize:14,fontFamily:"Georgia,serif"}}>No records found</div>
              </td></tr>
            ):rows.map((r,ri)=>(
              <tr key={ri} style={{borderBottom:`1px solid ${C.border}40`}}
                onMouseEnter={e=>e.currentTarget.style.background="#FDF6EC"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {r.cells.map((cell,ci)=>(
                  <td key={ci} style={{padding:"11px 14px",fontSize:13,color:C.text,maxWidth:180,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"Georgia,serif"}}>
                    {typeof cell==="string"&&STATUS_VALS.includes(cell)?<Badge val={cell}/>:String(cell??"")}
                  </td>
                ))}
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",gap:5}}>
                    {[{icon:"👁",title:"View",fn:onView},{icon:"✏️",title:"Edit",fn:onEdit},{icon:"🗑",title:"Delete",fn:onDelete}].map((btn,i)=>(
                      <button key={i} title={btn.title} onClick={()=>btn.fn(r.data)}
                        style={{padding:"5px 8px",borderRadius:6,fontSize:12,cursor:"pointer",border:`1px solid ${C.border}`,background:C.bgLight,color:C.text,transition:"all 0.15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background=C.accent;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=C.accent;}}
                        onMouseLeave={e=>{e.currentTarget.style.background=C.bgLight;e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.border;}}>
                        {btn.icon}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length>0&&<div style={{padding:"9px 14px",borderTop:`1px solid ${C.border}40`,fontSize:11,color:C.textLight,display:"flex",justifyContent:"space-between",fontFamily:"Georgia,serif",background:C.bgLight}}>
        <span>📖 {rows.length} record{rows.length!==1?"s":""}</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE PAGE
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG={
  users:{title:"User Management",icon:"👥",cols:["#","Name","Email","Phone","Role","Status"],cells:r=>[r.id,r.name,r.email,r.phone,r.role,r.status],fields:[{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"role",label:"Role"},{key:"status",label:"Status"},{key:"address",label:"Address"},{key:"createdAt",label:"Created At"}]},
  books:{title:"Book Management",icon:"📚",cols:["#","Title","Author","ISBN","Category","Available","Status"],cells:r=>[r.id,r.title,r.author,r.isbn,r.category||"—",r.available,r.status],fields:[{key:"title",label:"Title"},{key:"author",label:"Author"},{key:"isbn",label:"ISBN"},{key:"category",label:"Category"},{key:"publisher",label:"Publisher"},{key:"quantity",label:"Quantity"},{key:"available",label:"Available"},{key:"status",label:"Status"}]},
  borrows:{title:"Borrow Management",icon:"📖",cols:["#","Member","Book Title","Borrow Date","Due Date","Status"],cells:r=>[r.id,r.memberName,r.bookTitle,r.borrowDate,r.dueDate,r.status],fields:[{key:"memberName",label:"Member"},{key:"bookTitle",label:"Book"},{key:"borrowDate",label:"Borrow Date"},{key:"dueDate",label:"Due Date"},{key:"status",label:"Status"},{key:"notes",label:"Notes"}]},
  returns:{title:"Return Management",icon:"🔄",cols:["#","Member","Book","Return Date","Due Date","Late Days","Fine (Rs.)","Status"],cells:r=>[r.id,r.memberName,r.bookTitle,r.returnDate,r.dueDate,r.lateDays,r.fine,r.status],fields:[{key:"memberName",label:"Member"},{key:"bookTitle",label:"Book"},{key:"returnDate",label:"Return Date"},{key:"dueDate",label:"Due Date"},{key:"lateDays",label:"Late Days"},{key:"fine",label:"Fine (Rs.)"},{key:"status",label:"Status"},{key:"notes",label:"Notes"}]},
  reservations:{title:"Reservation Management",icon:"📋",cols:["#","Member","Book Title","Author","Due Date","Status"],cells:r=>[r.id,r.memberName,r.bookTitle,r.author,r.dueDate,r.status],fields:[{key:"memberName",label:"Member"},{key:"memberEmail",label:"Email"},{key:"bookTitle",label:"Book"},{key:"author",label:"Author"},{key:"isbn",label:"ISBN"},{key:"dueDate",label:"Due Date"},{key:"status",label:"Status"},{key:"notes",label:"Notes"}]},
  fines:{title:"Fine Management",icon:"💰",cols:["#","Member","Book","Due Date","Return Date","Late Days","Total Fine","Status"],cells:r=>[r.id,r.memberName,r.bookTitle,r.dueDate,r.returnDate,r.lateDays,`Rs.${r.totalFine||0}`,r.status],fields:[{key:"memberName",label:"Member"},{key:"bookTitle",label:"Book"},{key:"dueDate",label:"Due Date"},{key:"returnDate",label:"Return Date"},{key:"lateDays",label:"Late Days"},{key:"finePerDay",label:"Fine/Day (Rs.)"},{key:"totalFine",label:"Total Fine (Rs.)"},{key:"status",label:"Status"},{key:"notes",label:"Notes"}]},
};
const FORMS={users:UserForm,books:BookForm,borrows:BorrowForm,returns:ReturnForm,reservations:ReservationForm,fines:FineForm};

function ModulePage({moduleKey,notify}) {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [sel,setSel]=useState(null);
  const cfg=CONFIG[moduleKey];
  const Form=FORMS[moduleKey];

  const load=useCallback(async()=>{
    setLoading(true);
    try{const r=await req(`${BASE}/${moduleKey}`);setRows(r.data||[]);}
    catch(e){notify(e.message,"error");}
    finally{setLoading(false);}
  },[moduleKey]);
  useEffect(()=>{load();},[load]);

  const filtered=rows.filter(r=>Object.values(r).some(v=>String(v||"").toLowerCase().includes(search.toLowerCase())));
  const close=()=>{setModal(null);setSel(null);};
  const handleSave=async(form,id=null)=>{
    setSaving(true);
    try{
      if(id) await req(`${BASE}/${moduleKey}/${id}`,"PUT",form);
      else await req(`${BASE}/${moduleKey}`,"POST",form);
      notify(id?"Record updated ✓":"Record created ✓");
      close();load();
    }catch(e){notify(e.message,"error");}
    finally{setSaving(false);}
  };
  const handleDel=async()=>{
    setSaving(true);
    try{await req(`${BASE}/${moduleKey}/${sel.id}`,"DELETE");notify("Record deleted");close();load();}
    catch(e){notify(e.message,"error");}
    finally{setSaving(false);}
  };

  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:18}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search records…"
          style={{flex:1,minWidth:200,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.white,color:C.text,fontSize:13,outline:"none",fontFamily:"Georgia,serif"}}/>
        <button onClick={load} style={{padding:"9px 16px",borderRadius:10,border:`1.5px solid ${C.border}`,background:C.white,color:C.text,cursor:"pointer",fontSize:13,fontWeight:"bold",fontFamily:"Georgia,serif"}}>↺ Refresh</button>
        <BtnPrimary onClick={()=>{setSel(null);setModal("create");}}>+ Add New</BtnPrimary>
      </div>
      <Table columns={cfg.cols} rows={filtered.map(r=>({data:r,cells:cfg.cells(r)}))} onView={r=>{setSel(r);setModal("view");}} onEdit={r=>{setSel(r);setModal("edit");}} onDelete={r=>{setSel(r);setModal("delete");}} loading={loading}/>
      {modal==="create"&&<Modal title={`Add — ${cfg.title}`} onClose={close}><Form onSave={f=>handleSave(f)} onClose={close} saving={saving}/></Modal>}
      {modal==="edit"&&sel&&<Modal title={`Edit #${sel.id}`} onClose={close}><Form initial={sel} onSave={f=>handleSave(f,sel.id)} onClose={close} saving={saving}/></Modal>}
      {modal==="view"&&sel&&<ViewModal data={sel} fields={cfg.fields} title={`${cfg.icon} Record #${sel.id}`} onClose={close}/>}
      {modal==="delete"&&sel&&<DeleteModal onConfirm={handleDel} onClose={close} saving={saving} name={`Record #${sel.id}`}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({onNav}) {
  const [stats,setStats]=useState({});
  useEffect(()=>{
    Promise.all([req(`${BASE}/users/stats`),req(`${BASE}/books/stats`),req(`${BASE}/borrows/stats`),req(`${BASE}/reservations/stats`),req(`${BASE}/fines/stats`)])
      .then(([u,b,bw,r,f])=>setStats({u:u.data,b:b.data,bw:bw.data,r:r.data,f:f.data})).catch(()=>{});
  },[]);
  const cards=[
    {label:"Total Users",    value:stats.u?.total,      sub:`Active: ${stats.u?.active||0}`,          icon:"👥",nav:"users",        color:"#1A5276",bg:"#EBF5FB"},
    {label:"Total Books",    value:stats.b?.total,      sub:`Available: ${stats.b?.available||0}`,    icon:"📚",nav:"books",        color:"#1E8449",bg:"#EAFAF1"},
    {label:"Active Borrows", value:stats.bw?.borrowed,  sub:`Overdue: ${stats.bw?.overdue||0}`,       icon:"📖",nav:"borrows",      color:"#784212",bg:"#FEF9E7"},
    {label:"Reservations",   value:stats.r?.total,      sub:`Pending: ${stats.r?.pending||0}`,        icon:"📋",nav:"reservations", color:"#6C3483",bg:"#F4ECF7"},
    {label:"Unpaid Fines",   value:stats.f?.unpaid,     sub:`Rs.${stats.f?.totalAmount||0}`,          icon:"💰",nav:"fines",        color:"#922B21",bg:"#FDEDEC"},
  ];
  const modules=[
    {id:"users",icon:"👥",label:"User Management",desc:"Register & manage members"},
    {id:"books",icon:"📚",label:"Book Management",desc:"Add & track books"},
    {id:"borrows",icon:"📖",label:"Borrow Management",desc:"Issue books to members"},
    {id:"returns",icon:"🔄",label:"Return Management",desc:"Record book returns & fines"},
    {id:"reservations",icon:"📋",label:"Reservation Mgmt",desc:"Handle book reservations"},
    {id:"fines",icon:"💰",label:"Fine Management",desc:"Calculate & track overdue fines"},
  ];
  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:24,fontWeight:"bold",color:C.text,margin:0,fontFamily:"Georgia,serif"}}>📚 Library Management System</h1>
        <p style={{color:C.textLight,fontSize:13,marginTop:4,fontFamily:"Georgia,serif",fontStyle:"italic"}}>Welcome, Administrator — SLIIT · Group 2 · SE2030</p>
        <div style={{width:80,height:2,background:`linear-gradient(90deg,${C.accent},transparent)`,marginTop:10}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
        {cards.map((c,i)=>(
          <div key={i} onClick={()=>onNav(c.nav)}
            style={{background:c.bg,borderRadius:16,padding:"20px",cursor:"pointer",border:`1px solid ${c.color}30`,borderLeft:`4px solid ${c.color}`,transition:"all 0.2s",boxShadow:"0 2px 8px rgba(139,69,19,.06)"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 20px rgba(139,69,19,.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px rgba(139,69,19,.06)";}}>
            <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
            <div style={{fontSize:32,fontWeight:"bold",color:c.color,lineHeight:1,fontFamily:"Georgia,serif"}}>{c.value??0}</div>
            <div style={{fontSize:12,color:C.textMid,marginTop:6,fontWeight:"bold",fontFamily:"Georgia,serif"}}>{c.label}</div>
            <div style={{fontSize:11,color:C.textLight,marginTop:3,fontFamily:"Georgia,serif"}}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.white,borderRadius:16,padding:"24px",border:`1px solid ${C.border}`,boxShadow:"0 2px 8px rgba(139,69,19,.06)"}}>
        <div style={{fontWeight:"bold",color:C.textMid,marginBottom:16,fontSize:14,fontFamily:"Georgia,serif",display:"flex",alignItems:"center",gap:8}}>
          <span>📖</span> All Modules
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
          {modules.map(m=>(
            <button key={m.id} onClick={()=>onNav(m.id)}
              style={{padding:"16px",borderRadius:12,border:`1px solid ${C.border}`,background:C.bgLight,color:C.text,cursor:"pointer",fontFamily:"Georgia,serif",textAlign:"left",display:"flex",flexDirection:"column",gap:5,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=C.accent;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=C.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.background=C.bgLight;e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.border;}}>
              <span style={{fontSize:22}}>{m.icon}</span>
              <span style={{fontWeight:"bold",fontSize:13}}>{m.label}</span>
              <span style={{fontSize:11,opacity:0.7}}>{m.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",   icon:"🏠",label:"Dashboard"},
  {id:"users",       icon:"👥",label:"User Management"},
  {id:"books",       icon:"📚",label:"Book Management"},
  {id:"borrows",     icon:"📖",label:"Borrow Management"},
  {id:"returns",     icon:"🔄",label:"Return Management"},
  {id:"reservations",icon:"📋",label:"Reservation Mgmt"},
  {id:"fines",       icon:"💰",label:"Fine Management"},
];

export default function App({onLogout}) {
  const [activeNav,setActiveNav]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const [toast,setToast]=useState({msg:"",type:"success"});
  const notify=(msg,type="success")=>setToast({msg,type});
  const active=NAV.find(n=>n.id===activeNav);

  return(<>
    <style>{`
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:${C.bg};}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      input:focus,select:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px rgba(139,69,19,.12)!important;}
      ::-webkit-scrollbar{width:6px;height:6px}
      ::-webkit-scrollbar-track{background:${C.bg}}
      ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
    `}</style>
    <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:"success"})}/>
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"Georgia,serif"}}>

      {/* Sidebar */}
      <div style={{width:collapsed?64:240,background:`linear-gradient(180deg,${C.sidebar} 0%,${C.sidebarAc} 100%)`,display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden",flexShrink:0,boxShadow:"3px 0 12px rgba(74,40,16,.2)"}}>
        {/* Logo */}
        <div style={{padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:12,background:"rgba(0,0,0,.15)"}}>
          <div style={{width:38,height:38,borderRadius:10,flexShrink:0,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:"1px solid rgba(255,255,255,.2)"}}>📚</div>
          {!collapsed&&<div><div style={{color:"#fff",fontWeight:"bold",fontSize:14,fontFamily:"Georgia,serif"}}>LibraryOS</div><div style={{color:"rgba(255,255,255,.5)",fontSize:9,letterSpacing:1.5}}>ADMIN PANEL</div></div>}
        </div>

        {/* Collapse */}
        <button onClick={()=>setCollapsed(!collapsed)} style={{background:"rgba(0,0,0,.1)",border:"none",borderBottom:"1px solid rgba(255,255,255,.06)",color:"rgba(255,255,255,.4)",cursor:"pointer",padding:"6px 16px",fontSize:11,textAlign:"left",fontFamily:"Georgia,serif"}}>
          {collapsed?"▶":"◀ collapse"}
        </button>

        {/* Nav */}
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setActiveNav(item.id)}
              style={{width:"100%",padding:collapsed?"11px":"10px 16px",background:activeNav===item.id?"rgba(255,255,255,.15)":"transparent",border:"none",borderLeft:`3px solid ${activeNav===item.id?"#DEB887":"transparent"}`,color:activeNav===item.id?"#DEB887":"rgba(255,255,255,.6)",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:13,textAlign:"left",transition:"all 0.15s",justifyContent:collapsed?"center":"flex-start",fontFamily:"Georgia,serif"}}
              onMouseEnter={e=>{if(activeNav!==item.id)e.currentTarget.style.background="rgba(255,255,255,.08)";}}
              onMouseLeave={e=>{if(activeNav!==item.id)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:17,flexShrink:0}}>{item.icon}</span>
              {!collapsed&&<span style={{fontWeight:activeNav===item.id?"bold":"normal"}}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{padding:"12px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
          <button onClick={onLogout} style={{width:"100%",padding:"9px",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:12,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",gap:8,fontFamily:"Georgia,serif",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.2)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}>
            <span>📕</span>{!collapsed&&"Close Library"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <div style={{padding:"0 28px",height:56,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.headerBg,flexShrink:0,boxShadow:"0 1px 6px rgba(139,69,19,.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>{active?.icon}</span>
            <span style={{color:C.text,fontWeight:"bold",fontSize:16,fontFamily:"Georgia,serif"}}>{active?.label}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{color:C.textLight,fontSize:12,fontFamily:"Georgia,serif",fontStyle:"italic"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 14px",color:C.text,fontSize:12,fontWeight:"bold",display:"flex",alignItems:"center",gap:6,fontFamily:"Georgia,serif"}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#27AE60"}}/>Administrator
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflow:"auto",padding:"28px",background:C.bg}}>
          {activeNav==="dashboard"
            ?<Dashboard onNav={setActiveNav}/>
            :<ModulePage key={activeNav} moduleKey={activeNav} notify={notify}/>
          }
        </div>
      </div>
    </div>
  </>);
}
