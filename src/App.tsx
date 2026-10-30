import {NavLink,Route,Routes} from 'react-router-dom'
import {useState} from 'react'
import {useXp,levelOf} from './xp'
import {student} from './data/mock'
import Dashboard from './pages/Dashboard'
import Arena from './pages/Arena'
import CodeLab from './pages/CodeLab'
import Dsa from './pages/Dsa'
import {Languages,Debug,Daily,Battles,Readiness,Achievements,Profile} from './pages/More'
const nav:[string,string][]=[['/','Dashboard'],['/arena','Logic Arena'],['/lab','Visual Code Lab'],['/dsa','DSA Quest'],['/languages','Languages'],['/debug','Debugging Arena'],['/daily','Daily Challenge'],['/battles','Coding Battles'],['/readiness','Placement Readiness'],['/achievements','Achievements'],['/profile','Profile']]
function Soon({title}:{title:string}){return <div className="card"><h1>{title}</h1><p className="mut">This page is not built yet in this prototype. Its route and navigation work; the content is the next step.</p></div>}
export default function App(){
  const {xp,reset}=useXp();const [open,setOpen]=useState(false);const [menu,setMenu]=useState(false)
  return <div className="shell">
    <aside className={open?'side open':'side'}>
      <div className="brand">Logic<b>Quest</b></div>
      <nav>{nav.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}><span className="ic">{l[0]}</span><span>{l}</span></NavLink>)}</nav>
    </aside>
    <div className="main">
      <header className="top">
        <button className="ghost burger" aria-label="Toggle navigation" onClick={()=>setOpen(!open)}>Menu</button>
        <span className="shield" title="Level" aria-label={"Level "+levelOf(xp)}>{levelOf(xp)}</span><span className="pill"><i className="orb"/>{xp} XP</span><span className="pill"><i className="flame"/>{student.streak}</span>
        <div className="grow"/>
        <div className="rel"><button className="ghost" aria-haspopup="menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{student.name}</button>
          {menu&&<div className="menu" role="menu"><button role="menuitem" onClick={()=>{reset();setMenu(false)}}>Reset demo progress</button><button role="menuitem" onClick={()=>setMenu(false)}>Sign out (UI only)</button></div>}</div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard/>}/><Route path="/arena" element={<Arena/>}/><Route path="/lab" element={<CodeLab/>}/><Route path="/dsa" element={<Dsa/>}/>
          <Route path="/languages" element={<Languages/>}/><Route path="/debug" element={<Debug/>}/><Route path="/daily" element={<Daily/>}/><Route path="/battles" element={<Battles/>}/><Route path="/readiness" element={<Readiness/>}/><Route path="/achievements" element={<Achievements/>}/><Route path="/profile" element={<Profile/>}/>
          <Route path="*" element={<Soon title="Not found"/>}/>
        </Routes>
        <p className="mut small">All values are demo data, not verified student performance.</p>
      </main>
      <nav className="tabs">{nav.slice(0,4).map(([to,l])=><NavLink key={to} to={to} end={to==='/'}>{l.split(' ')[0]}</NavLink>)}<NavLink to="/profile">Profile</NavLink></nav>
    </div>
  </div>
}
