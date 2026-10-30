import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import IslandMap from '../components/IslandMap'
import {useXp,levelOf} from '../xp'
import {getLearningPath,getStudentDashboard} from '../services/api'
export default function Dashboard(){
  const {xp}=useXp();const lv=levelOf(xp);const pct=((xp-lv*300)/300)*100
  const [path,setPath]=useState<Awaited<ReturnType<typeof getLearningPath>>>([])
  const [dash,setDash]=useState<Awaited<ReturnType<typeof getStudentDashboard>>|null>(null)
  const [err,setErr]=useState('')
  useEffect(()=>{getLearningPath().then(setPath).catch(e=>setErr(String(e)));getStudentDashboard().then(setDash).catch(e=>setErr(String(e)))},[])
  if(err)return <div className="card err">Could not load: {err}</div>
  if(!dash)return <div className="card">Loading…</div>
  return <>
    <section className="hero card"><div className="crystal" aria-hidden="true"/><div><span className="tag">LEVEL {lv}</span><h1>Ready to level up your logic?</h1><p className="mut">Every challenge makes you a better problem solver.</p>
      <div className="xpbar" role="progressbar" aria-label="XP to next level" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{width:pct+'%'}}/><span>XP</span></div>
      <p className="small">{xp-lv*300}/300 XP to level {lv+1}</p>
      <Link className="btn" to="/lab">Continue Learning</Link> <Link className="btn alt" to="/arena">Enter Logic Arena</Link></div></section>
    <h2>Your world</h2>
    <div className="dgrid"><IslandMap items={path.map(p=>({t:p.title,s:p.status,sub:'You are here'}))}/><aside><div className="card trophy"><div className="crystal sm" aria-hidden="true"/><b>{xp} XP</b></div><Link className="card tilt" to="/daily">Daily Goal</Link><Link className="card tilt" to="/lab">Current Project</Link><Link className="card tilt" to="/battles">Challenge</Link></aside></div>
    <div className="grid"><section className="card quest"><span className="tag">DAILY QUEST</span><h3>Master the Loop</h3><p className="mut">Solve 3 loop challenges. +150 XP</p><div className="xpbar"><i style={{width:'33%'}}/></div><Link className="btn" to="/daily">Start Mission</Link></section>
      <div className="card"><h3>Stats</h3><div className="row"><div className="stat"><b>{dash.student.solved}</b>solved</div><div className="stat"><b>{dash.student.accuracy}%</b>accuracy</div><div className="stat"><b>{dash.student.streak}</b>streak</div></div></div></div>
    <h2>Skills</h2>
    <div className="card">{dash.skills.map(s=><div key={s.n} className="row"><span className="lbl">{s.n}</span><div className="xpbar"><i style={{width:s.v+'%'}}/></div><span>{s.v}%</span></div>)}</div>
    <h2>Recommended</h2>
    <div className="grid"><Link className="card tilt" to="/arena">Practise loops</Link><Link className="card tilt" to="/dsa">Start binary search</Link><Link className="card tilt" to="/debug">Try a debugging mission</Link></div>
  </>
}
