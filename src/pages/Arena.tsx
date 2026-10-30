import {useNavigate,Link} from 'react-router-dom'
import Icon from '../components/Icons'
import {useEffect,useState} from 'react'
import {useXp} from '../xp'
import {getGames} from '../services/api'
type G=Awaited<ReturnType<typeof getGames>>
function Done({score,total,xp,back}:{score:number,total:number,xp:number,back:()=>void}){
  return <div className="card"><h2>Complete!</h2><p>Score {score}/{total}. +{xp} XP earned.</p><button className="btn" onClick={back}>Back to Arena</button></div>}
function Pattern({xpAward,back}:{xpAward:number,back:()=>void}){
  const qs=[{s:'2, 4, 6, 8, ?',o:[9,10,12,14],a:10,e:'Add 2 each time.'},{s:'1, 2, 4, 8, ?',o:[10,12,16,14],a:16,e:'Each number doubles.'},{s:'1, 4, 9, 16, ?',o:[20,25,24,36],a:25,e:'Perfect squares: 1², 2², 3², 4², 5².'}]
  const {add}=useXp();const [i,setI]=useState(0),[pick,setPick]=useState<number|null>(null),[sc,setSc]=useState(0),[done,setDone]=useState(false)
  if(done)return <Done score={sc} total={qs.length} xp={xpAward} back={back}/>
  const q=qs[i]
  return <div className="card"><h2>Pattern Detective ({i+1}/{qs.length})</h2><p className="big">{q.s}</p>
    <div className="opts">{q.o.map(o=><button key={o} disabled={pick!==null} className={'opt'+(pick!==null?(o===q.a?' ok':o===pick?' bad':''):'')} onClick={()=>{setPick(o);if(o===q.a)setSc(sc+1)}}>{o}</button>)}</div>
    {pick!==null&&<><p>{pick===q.a?'Correct. ':'Not quite. '}{q.e}</p><button className="btn" onClick={()=>{if(i+1<qs.length){setI(i+1);setPick(null)}else{add(xpAward);setDone(true)}}}>{i+1<qs.length?'Next':'Finish'}</button></>}</div>
}
function Sequencer({xpAward,back}:{xpAward:number,back:()=>void}){
  const right=['Start','Read a number','Calculate number % 2','Check if remainder is zero','Display the result','End']
  const {add}=useXp();const [o,setO]=useState([right[3],right[0],right[5],right[2],right[1],right[4]]);const [msg,setMsg]=useState('');const [ok,setOk]=useState(false)
  const mv=(i:number,d:number)=>{const j=i+d;if(j<0||j>=o.length)return;const n=[...o];[n[i],n[j]]=[n[j],n[i]];setO(n);setMsg('')}
  const check=()=>{const bad=o.findIndex((s,i)=>s!==right[i]);if(bad<0){setOk(true);add(xpAward);setMsg('')}else setMsg(`Step ${bad+1} is wrong: "${right[bad]}" should come here. We must read the number before calculating with it, and check before displaying.`)}
  if(ok)return <Done score={1} total={1} xp={xpAward} back={back}/>
  return <div className="card"><h2>Step Sequencer: check if a number is even</h2>
    {o.map((s,i)=><div key={s} className="row"><span className="grow">{i+1}. {s}</span><button className="ghost" aria-label={'Move up '+s} onClick={()=>mv(i,-1)}>Up</button><button className="ghost" aria-label={'Move down '+s} onClick={()=>mv(i,1)}>Down</button></div>)}
    <button className="btn" onClick={check}>Check order</button>{msg&&<p className="err">{msg}</p>}</div>
}
function Vault({xpAward,back}:{xpAward:number,back:()=>void}){
  const {add}=useXp();const [pick,setPick]=useState<number|null>(null);const [done,setDone]=useState(false)
  if(done)return <Done score={1} total={1} xp={xpAward} back={back}/>
  const vals=[5,8,16]
  return <div className="card"><h2>Variable Vault</h2><pre>x = 5{'\n'}x = x + 3{'\n'}x = x * 2</pre><p>What is x at the end?</p>
    <div className="opts">{[13,16,10,8].map(o=><button key={o} className={'opt'+(pick===o?(o===16?' ok':' bad'):'')} onClick={()=>setPick(o)}>{o}</button>)}</div>
    {pick!==null&&<><p>{pick===16?'Correct.':'Try again or read the trace.'} Trace: x = {vals.join(' → ')}. First 5, then 5+3 = 8, then 8×2 = 16.</p>
    {pick===16?<button className="btn" onClick={()=>{add(xpAward);setDone(true)}}>Claim XP</button>:<button className="btn alt" onClick={()=>setPick(null)}>Retry</button>}</>}</div>
}
const PLAY=['pattern','sequencer','vault','debug']
export default function Arena(){
  const [games,setG]=useState<G>([]);const [f,setF]=useState('All');const [play,setPlay]=useState('');const [sel,setSel]=useState(0);const [err,setErr]=useState('');const nav=useNavigate()
  useEffect(()=>{getGames().then(setG).catch(e=>setErr(String(e)))},[])
  if(err)return <div className="card err">{err}</div>
  const back=()=>setPlay('');const g=games.find(x=>x.id===play)
  if(g){const P={xpAward:g.xp,back};return <><button className="ghost" onClick={back}>← Arena</button>{g.id==='pattern'?<Pattern {...P}/>:g.id==='sequencer'?<Sequencer {...P}/>:<Vault {...P}/>}</>}
  const shown=games.filter(x=>f==='All'||x.level===f);const cur=shown[Math.min(sel,shown.length-1)]
  const go=()=>{if(!cur)return;if(cur.id==='debug')nav('/debug');else if(PLAY.includes(cur.id))setPlay(cur.id)}
  return <><h1>Logic Arena</h1>
    <div className="row">{['All','Beginner','Intermediate','Advanced'].map(x=><button key={x} className={'ghost'+(f===x?' on':'')} onClick={()=>{setF(x);setSel(0)}}>{x}</button>)}</div>
    {!shown.length?<div className="card">No games in this category.</div>:<div className="stage">{shown.map((x,n)=>{const o=n-(shown.length-1)/2,on=n===Math.min(sel,shown.length-1)
      return <div key={x.id} className="col" style={{transform:`translateY(${Math.abs(o)*12}px) rotateY(${-o*10}deg) scale(${on?1.12:1})`,zIndex:on?5:1}}>
        <button className={'gcard'+(n%2?' c':'')+(on?' sel':'')} aria-pressed={on} onClick={()=>setSel(n)}><Icon id={x.id}/><b>{x.title}</b><small>{x.level} · {x.min} min</small><small>+{x.xp} XP</small>{!PLAY.includes(x.id)&&<small className="soon">Coming soon</small>}</button><i className="plat"/></div>})}</div>}
    <div className="arenabar"><nav className="tabs2"><b className="on">Play</b><Link to="/achievements">Collection</Link><Link to="/achievements">Rewards</Link><Link to="/profile">Settings</Link></nav>
      <button className="hexplay" disabled={!cur||!PLAY.includes(cur.id)} onClick={go}>{cur&&!PLAY.includes(cur.id)?'COMING SOON':'PLAY SELECTED'}</button></div></>
}
