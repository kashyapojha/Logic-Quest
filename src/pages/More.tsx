import {useState} from 'react'
import {Link} from 'react-router-dom'
import {languages,badges,readiness,battles,debugQs} from '../data/mock'
import {useXp} from '../xp'
export function Languages(){
  const [sel,setSel]=useState('');const l=languages.find(x=>x.id===sel)
  if(l)return <><button className="ghost" onClick={()=>setSel('')}>← Languages</button><h1>{l.n} track</h1><div className="grid">{l.mods.map((m,n)=><div key={m} className={'isle '+(n<l.done?'done':n===l.done?'active':'locked')}><b>{n+1}. {m}</b><span className="small">{n<l.done?'Completed':n===l.done?'Next lesson':'Locked'}</span></div>)}</div><Link className="btn" to="/lab">Launch lesson</Link></>
  return <><h1>Programming Languages</h1><div className="grid">{languages.map(x=><div key={x.id} className="card tilt"><h3>{x.n}</h3><div className="xpbar"><i style={{width:x.done/x.total*100+'%'}}/></div><p className="small">{x.done}/{x.total} lessons · {x.lv}</p><button className="btn" onClick={()=>setSel(x.id)}>Continue Learning</button></div>)}</div></>
}
export function Debug(){
  const {add}=useXp();const [i,setI]=useState(0),[p,setP]=useState<number|null>(null),[sc,setSc]=useState(0),[done,setDone]=useState(false)
  if(done)return <div className="card"><h2>Mission complete</h2><p>Score {sc}/{debugQs.length}. +80 XP.</p><button className="btn" onClick={()=>{setI(0);setP(null);setSc(0);setDone(false)}}>Play again</button></div>
  const q=debugQs[i]
  return <><h1>Debugging Arena</h1><div className="card"><pre>{q.c}</pre><p><b>{q.q}</b></p><div className="opts">{q.o.map((o,n)=><button key={o} disabled={p!==null} className={'opt'+(p!==null?(n===q.a?' ok':n===p?' bad':''):'')} onClick={()=>{setP(n);if(n===q.a)setSc(sc+1)}}>{o}</button>)}</div>
    {p!==null&&<><p>{p===q.a?'Correct. ':'Not quite. '}{q.e}</p><button className="btn" onClick={()=>{if(i+1<debugQs.length){setI(i+1);setP(null)}else{add(80);setDone(true)}}}>{i+1<debugQs.length?'Next':'Finish'}</button></>}</div></>
}
export function Daily(){return <><h1>Daily Challenge</h1><div className="card quest"><span className="tag">DAILY QUEST</span><h2>Master the Loop</h2><p className="mut">Topic: Loops · Intermediate · +150 XP · about 10 minutes</p><div className="xpbar"><i style={{width:'33%'}}/></div><p className="small">1 of 3 done</p><Link className="btn" to="/arena">Start Challenge</Link></div></>}
export function Battles(){return <><h1>Coding Battles</h1><p className="mut">Sample listings only. No live multiplayer or real rankings.</p><div className="grid">{battles.map(b=><div key={b[0]} className="card tilt"><h3>{b[0]}</h3><p className="small">{b[1]} · {b[2]}</p></div>)}</div></>}
export function Readiness(){return <><h1>Placement Readiness</h1><div className="card"><div className="row"><div className="ring"><b>{readiness.score}</b>/100</div><p className="mut">Sample score for demo only. It does not guarantee placement or override college eligibility rules.</p></div>
  {readiness.parts.map(([n,v])=><div key={n} className="row"><span className="lbl">{n}</span><div className="xpbar"><i style={{width:v+'%'}}/></div><span>{v}</span></div>)}</div>
  <h2>Improvement plan</h2><div className="grid">{readiness.plan.map(([t,to])=><Link key={t} to={to} className="card tilt">{t}</Link>)}</div>
  <h2>Assessment history</h2><div className="card scroll"><table><thead><tr><th>Name</th><th>Date</th><th>Score</th><th>Level</th><th>Status</th></tr></thead><tbody>{readiness.history.map(r=><tr key={r[0]}>{r.map(c=><td key={c}>{c}</td>)}</tr>)}</tbody></table></div></>}
export function Achievements(){const {xp}=useXp();return <><h1>Achievements</h1><p className="mut">{xp} XP total</p><div className="grid">{badges.map(b=><div key={b.n} className={'card badge '+(b.on?'on':'off')}><div className="hex">{b.on?'★':'—'}</div><b>{b.n}</b><span className="small">{b.on?'Earned':'Locked'}</span></div>)}</div></>}
export function Profile(){
  const {reset}=useXp();const [name,setName]=useState('Demo Student'),[lang,setLang]=useState('Python'),[n,setN]=useState(true),[msg,setMsg]=useState('')
  return <><h1>Profile and Settings</h1><div className="card"><label>Display name<br/><input value={name} onChange={e=>setName(e.target.value)} aria-invalid={!name.trim()}/></label><p/>
    <label>Preferred language<br/><select value={lang} onChange={e=>setLang(e.target.value)}>{languages.map(x=><option key={x.id}>{x.n}</option>)}</select></label><p/>
    <label><input type="checkbox" checked={n} onChange={e=>setN(e.target.checked)}/> Daily reminder notifications</label><p/>
    <button className="btn" onClick={()=>setMsg(name.trim()?'Saved (demo only, not stored).':'Name is required.')}>Save</button><button className="ghost" onClick={reset}>Reset demo progress</button>{msg&&<p>{msg}</p>}</div></>
}
