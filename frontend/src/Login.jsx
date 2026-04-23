import { useState } from "react";

export default function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showP, setShowP] = useState(false);

  const login = () => {
    setErr("");
    if (!u.trim() || !p.trim()) { setErr("Both fields are required"); return; }
    setLoading(true);
    setTimeout(() => {
      if (u === "admin" && p === "admin123") { onLogin(); }
      else { setErr("Invalid username or password"); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#FDF6EC 0%,#FAF0E6 40%,#FDF6EC 100%)",
      display:"flex", fontFamily:"Georgia, 'Times New Roman', serif",
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
        @keyframes sway{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1deg)}}
        .li:focus{outline:none!important;border-color:#8B4513!important;box-shadow:0 0 0 3px rgba(139,69,19,.15)!important;}
        .lb:hover{background:#5D2E0C!important;transform:translateY(-1px);box-shadow:0 6px 20px rgba(139,69,19,.3)!important;}
      `}</style>

      {/* Decorative bookshelf left */}
      <div style={{
        width:340, background:"linear-gradient(180deg,#8B6914 0%,#A0522D 30%,#8B4513 100%)",
        display:"flex", flexDirection:"column", justifyContent:"center",
        alignItems:"center", padding:"40px 32px", position:"relative", overflow:"hidden",
        boxShadow:"4px 0 20px rgba(0,0,0,.15)",
      }}>
        {/* Shelf decoration */}
        {[0,1,2].map(shelf=>(
          <div key={shelf} style={{
            width:"100%", marginBottom:32, position:"relative",
          }}>
            <div style={{display:"flex", gap:6, alignItems:"flex-end", marginBottom:6}}>
              {[
                {h:80,bg:"#C0392B",t:"Library\nSystem"},
                {h:96,bg:"#1A5276",t:"Books"},
                {h:72,bg:"#196F3D",t:"SLIIT"},
                {h:88,bg:"#784212",t:"2026"},
                {h:76,bg:"#6C3483",t:"SE\n2030"},
                {h:92,bg:"#1F618D",t:"Group\n2"},
              ].map((bk,i)=>(
                <div key={i} style={{
                  width:32, height:bk.h, background:bk.bg,
                  borderRadius:"2px 2px 0 0", display:"flex",
                  alignItems:"center", justifyContent:"center",
                  boxShadow:"inset -3px 0 6px rgba(0,0,0,.2), 2px 0 4px rgba(0,0,0,.15)",
                  cursor:"default", fontSize:7, color:"rgba(255,255,255,.8)",
                  fontWeight:"bold", textAlign:"center", lineHeight:1.2,
                  padding:2, wordBreak:"break-word",
                }}>
                  {bk.t.split("\n").map((l,j)=><div key={j}>{l}</div>)}
                </div>
              ))}
            </div>
            {/* Shelf board */}
            <div style={{height:12,background:"linear-gradient(180deg,#5D4037,#4E342E)",borderRadius:2,boxShadow:"0 3px 6px rgba(0,0,0,.3)"}}/>
          </div>
        ))}
        <div style={{textAlign:"center",color:"rgba(255,255,255,.7)",fontSize:12,marginTop:8}}>
          📚 SLIIT University Library<br/>
          <span style={{fontSize:10,opacity:0.6}}>Group 2 · SE2030 · 2026</span>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        padding:40,
      }}>
        <div style={{
          width:"100%", maxWidth:420,
          background:"#fff",
          borderRadius:20, padding:"40px 40px 36px",
          boxShadow:"0 8px 40px rgba(139,69,19,.12)",
          border:"1px solid #DEB887",
          animation:"fadeUp 0.5s ease",
          position:"relative",
        }}>
          {/* Bookmark decoration */}
          <div style={{
            position:"absolute", top:0, right:32,
            width:24, height:48,
            background:"#C0392B",
            clipPath:"polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)",
          }}/>

          <div style={{textAlign:"center", marginBottom:32}}>
            <div style={{fontSize:52, marginBottom:12}}>📚</div>
            <h1 style={{fontSize:24,fontWeight:"bold",color:"#4A2810",margin:0,letterSpacing:0.5}}>
              Library Management
            </h1>
            <p style={{color:"#8B6914",fontSize:13,margin:"6px 0 0",fontStyle:"italic"}}>
              System Administration Portal
            </p>
            <div style={{width:60,height:2,background:"linear-gradient(90deg,transparent,#8B4513,transparent)",margin:"12px auto 0"}}/>
          </div>

          {err && (
            <div style={{background:"#FEF3F0",border:"1px solid #F1948A",color:"#922B21",borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:20,textAlign:"center"}}>
              ⚠ {err}
            </div>
          )}

          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:12,fontWeight:"bold",color:"#6B3A2A",marginBottom:7,letterSpacing:0.5,fontFamily:"Georgia,serif"}}>
              USERNAME
            </label>
            <input className="li" value={u}
              onChange={e=>setU(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()}
              placeholder="Enter your username"
              style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"2px solid #DEB887",fontSize:14,boxSizing:"border-box",background:"#FFFDF8",fontFamily:"Georgia,serif",color:"#4A2810",transition:"all 0.2s"}}/>
          </div>

          <div style={{marginBottom:28}}>
            <label style={{display:"block",fontSize:12,fontWeight:"bold",color:"#6B3A2A",marginBottom:7,letterSpacing:0.5,fontFamily:"Georgia,serif"}}>
              PASSWORD
            </label>
            <div style={{position:"relative"}}>
              <input className="li" value={p}
                onChange={e=>setP(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&login()}
                type={showP?"text":"password"}
                placeholder="Enter your password"
                style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:10,border:"2px solid #DEB887",fontSize:14,boxSizing:"border-box",background:"#FFFDF8",fontFamily:"Georgia,serif",color:"#4A2810",transition:"all 0.2s"}}/>
              <button onClick={()=>setShowP(!showP)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16}}>
                {showP?"🙈":"👁"}
              </button>
            </div>
          </div>

          <button className="lb" onClick={login} disabled={loading} style={{
            width:"100%",padding:"13px",
            background:loading?"#C4A882":"linear-gradient(135deg,#8B4513,#A0522D)",
            border:"none",borderRadius:10,color:"#fff",
            fontSize:14,fontWeight:"bold",cursor:loading?"not-allowed":"pointer",
            fontFamily:"Georgia,serif",transition:"all 0.2s",letterSpacing:0.5,
            boxShadow:loading?"none":"0 4px 16px rgba(139,69,19,.3)",
          }}>
            {loading?"Opening the library…":"📖 Enter Library"}
          </button>

          <div style={{marginTop:20,padding:"12px 16px",background:"#FDF6EC",borderRadius:10,border:"1px solid #DEB887",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:"bold",color:"#8B6914",marginBottom:4,letterSpacing:0.5}}>DEMO CREDENTIALS</div>
            <div style={{fontSize:13,color:"#6B3A2A",fontFamily:"Georgia,serif"}}>
              Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>admin123</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
