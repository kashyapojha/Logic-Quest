import {useEffect,useState} from 'react'
import {dryRun} from '../data/mock'
export default function CodeLab(){
  const S=dryRun.steps;const [i,setI]=useState(0),[run,setRun]=useState(false),[speed,setSpeed]=useState(1000)
  useEffect(()=>{if(!run)return;if(i>=S.length-1){setRun(false);return}const t=setTimeout(()=>setI(i+1),speed);return()=>clearTimeout(t)},[run,i,speed,S.length])
  const s=S[i],p=i>0?S[i-1]:null
  return <><h1>Visual Code Lab</h1><p className="mut">Python only. A scripted simulation of one example, not a real code runner.</p>
  <div className="lab">
    <div className="card hud"><h3>Code</h3><pre>{dryRun.code.map((l,n)=><div key={n} className={n===s.line?'hl':''}>{n+1}  {l}</div>)}</pre>
      <div className="timeline">{S.map((_,n)=><i key={n} className={n<=i?'on':''}/>)}<em style={{left:(i/(S.length-1))*100+'%'}}><span className="bot"/></em></div></div>
    <div className="card hud"><h3>Variables</h3><div className="crates">
      <div className={'crate'+(p&&p.total!==s.total?' chg':'')}><small>total</small><b>{s.total}</b><small>was {p?p.total:'—'}</small></div>
      <div className={'crate cy'+(p&&p.i!==s.i?' chg':'')}><small>i</small><b>{s.i??'—'}</b><small>was {p?.i??'—'}</small></div></div>
      <p>Output: <b>{s.out||'(none yet)'}</b></p></div>
    <div className="card hud"><h3>Step {i}/{S.length-1}</h3><p>{s.t}</p>
      <div className="row"><button className="hexbtn" onClick={()=>setRun(!run)}>{run?'Pause':'Run'}</button><button className="hexbtn sm" disabled={i===0} onClick={()=>{setRun(false);setI(i-1)}}>Step Back</button><button className="hexbtn sm" disabled={i===S.length-1} onClick={()=>{setRun(false);setI(i+1)}}>Step Forward</button><button className="hexbtn sm" onClick={()=>{setRun(false);setI(0)}}>Restart</button>
      <label className="small">Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={1800}>Slow</option><option value={1000}>Normal</option><option value={400}>Fast</option></select></label></div></div>
  </div></>
}
