import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { languages, readiness, battles, debugQs } from "../data/mock";
import { useAuth } from "../auth/useAuth";
import {
  getAchievements,
  getAttempts,
  getProfile,
  getProgress,
  updateProfile as saveProfile,
  type Achievement,
  type Attempt,
  type Progress,
} from "../services/api";
export function Languages(){
  const [sel,setSel]=useState('');const l=languages.find(x=>x.id===sel)
  if(l)return <><button className="ghost" onClick={()=>setSel('')}>← Languages</button><h1>{l.n} track</h1><div className="grid">{l.mods.map((m,n)=><div key={m} className={'isle '+(n<l.done?'done':n===l.done?'active':'locked')}><b>{n+1}. {m}</b><span className="small">{n<l.done?'Completed':n===l.done?'Next lesson':'Locked'}</span></div>)}</div><Link className="btn" to="/lab">Launch lesson</Link></>
  return <><h1>Programming Languages</h1><p className="small mut">Demo tracks; language-specific course progress is not currently provided by the backend.</p><div className="grid">{languages.map(x=><div key={x.id} className="card tilt"><h3>{x.n}</h3><div className="xpbar"><i style={{width:x.done/x.total*100+'%'}}/></div><p className="small">{x.done}/{x.total} lessons · {x.lv}</p><button className="btn" onClick={()=>setSel(x.id)}>Continue Learning</button></div>)}</div></>
}
export function Debug(){
  const [i,setI]=useState(0),[p,setP]=useState<number|null>(null),[sc,setSc]=useState(0),[done,setDone]=useState(false)
  if(done)return <div className="card"><h2>Demo complete</h2><p>Score {sc}/{debugQs.length}. Demo activities do not grant backend XP.</p><button className="btn" onClick={()=>{setI(0);setP(null);setSc(0);setDone(false)}}>Play again</button></div>
  const q=debugQs[i]
  return <><h1>Debugging Arena</h1><p className="small mut">Demo content. Answers here are not submitted to the backend and do not award XP.</p><div className="card"><pre>{q.c}</pre><p><b>{q.q}</b></p><div className="opts">{q.o.map((o,n)=><button key={o} disabled={p!==null} className={'opt'+(p!==null?(n===q.a?' ok':n===p?' bad':''):'')} onClick={()=>{setP(n);if(n===q.a)setSc(sc+1)}}>{o}</button>)}</div>
    {p!==null&&<><p>{p===q.a?'Correct. ':'Not quite. '}{q.e}</p><button className="btn" onClick={()=>{if(i+1<debugQs.length){setI(i+1);setP(null)}else{setDone(true)}}}>{i+1<debugQs.length?'Next':'Finish'}</button></>}</div></>
}
export function Daily(){return <><h1>Daily Challenge</h1><div className="card quest"><span className="tag">DEMO</span><h2>Daily quest preview</h2><p className="mut">Daily goals are not available from the backend yet. Published challenges are listed in the Logic Arena.</p><Link className="btn" to="/arena">Browse Challenges</Link></div></>}
export function Battles(){return <><h1>Coding Battles</h1><p className="mut">Sample listings only. No live multiplayer or real rankings.</p><div className="grid">{battles.map(b=><div key={b[0]} className="card tilt"><h3>{b[0]}</h3><p className="small">{b[1]} · {b[2]}</p></div>)}</div></>}
export function Readiness(){return <><h1>Placement Readiness</h1><div className="card"><div className="row"><div className="ring"><b>{readiness.score}</b>/100</div><p className="mut">Sample score for demo only. It does not guarantee placement or override college eligibility rules.</p></div>
  {readiness.parts.map(([n,v])=><div key={n} className="row"><span className="lbl">{n}</span><div className="xpbar"><i style={{width:v+'%'}}/></div><span>{v}</span></div>)}</div>
  <h2>Improvement plan</h2><div className="grid">{readiness.plan.map(([t,to])=><Link key={t} to={to} className="card tilt">{t}</Link>)}</div>
  <h2>Assessment history</h2><div className="card scroll"><table><thead><tr><th>Name</th><th>Date</th><th>Score</th><th>Level</th><th>Status</th></tr></thead><tbody>{readiness.history.map(r=><tr key={r[0]}>{r.map(c=><td key={c}>{c}</td>)}</tr>)}</tbody></table></div></>}
export function Achievements(){
  const [items,setItems]=useState<Achievement[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{let active=true;getAchievements().then((result)=>{if(active)setItems(result.achievements)}).catch((cause:unknown)=>{if(active)setError(cause instanceof Error?cause.message:"Unable to load achievements.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  if(loading)return <div className="card" role="status">Loading achievements...</div>;
  if(error)return <div className="card err" role="alert">{error}</div>;
  return <><h1>Achievements</h1>{items.length?<div className="grid">{items.map((item)=>{const label=item.name||item.title||item.code||"Achievement";return <div key={item.id} className={'card badge '+(item.is_unlocked?'on':'off')}><div className="hex">{item.is_unlocked?'★':'—'}</div><b>{label}</b>{item.description&&<span className="small">{item.description}</span>}<span className="small">{item.is_unlocked?'Unlocked':'Locked'}</span>{item.unlocked_at&&<span className="small">{new Date(item.unlocked_at).toLocaleDateString()}</span>}</div>})}</div>:<div className="card mut">No achievements are configured yet.</div>}</>;
}

export function ProgressPage(){
  const [items,setItems]=useState<Progress[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{let active=true;getProgress().then((result)=>{if(active)setItems(result)}).catch((cause:unknown)=>{if(active)setError(cause instanceof Error?cause.message:"Unable to load progress.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  if(loading)return <div className="card" role="status">Loading progress...</div>;
  if(error)return <div className="card err" role="alert">{error}</div>;
  return <><h1>Progress</h1>{items.length?<div className="grid">{items.map((item)=><section className="card" key={item.module_name}><h3>{item.module_name}</h3><div className="xpbar" role="progressbar" aria-valuenow={item.completion_percentage} aria-valuemin={0} aria-valuemax={100}><i style={{width:`${item.completion_percentage}%`}}/></div><p>{item.completed_challenges} of {item.total_challenges} challenges · {item.completion_percentage}%</p><p className="small">Updated {new Date(item.updated_at).toLocaleString()}</p></section>)}</div>:<div className="card mut">No completed challenge progress yet.</div>}</>;
}

export function AttemptsPage(){
  const [items,setItems]=useState<Attempt[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{let active=true;getAttempts().then((result)=>{if(active)setItems(result.attempts)}).catch((cause:unknown)=>{if(active)setError(cause instanceof Error?cause.message:"Unable to load submissions.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
  if(loading)return <div className="card" role="status">Loading submissions...</div>;
  if(error)return <div className="card err" role="alert">{error}</div>;
  return <><h1>Submissions</h1>{items.length?<div className="card scroll"><table><thead><tr><th>Challenge</th><th>Result</th><th>Submitted</th></tr></thead><tbody>{items.map((attempt,index)=>{const challenge=attempt.challenge_id;const timestamp=attempt.attempted_at;return <tr key={String(attempt.id??`${challenge??"attempt"}-${timestamp??index}`)}><td>{typeof challenge==="string"?challenge:"Challenge"}</td><td>{attempt.is_correct===true?"Correct":attempt.is_correct===false?"Incorrect":"Recorded"}</td><td>{typeof timestamp==="string"?new Date(timestamp).toLocaleString():"—"}</td></tr>})}</tbody></table></div>:<div className="card mut">No submissions yet.</div>}</>;
}

export function Profile() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [lang, setLang] = useState("Python");
  const [n, setN] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const { currentUser, updateProfile: updateAuthProfile } = useAuth();

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setName(profile.full_name || "");
        setUsername(profile.username || "");
        setCreatedAt(profile.created_at || profile.account_created_at || null);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Could not load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      setSaving(true);
      setMsg("");
      setError("");

      const updated = await saveProfile({
        full_name: name.trim(),
        username: username.trim(),
      });

      setName(updated.full_name || "");
      setUsername(updated.username || "");
      updateAuthProfile(updated);
      setMsg("Profile saved successfully.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="card" role="status">Loading profile...</div>;
  }

  if (error && !username) return <div className="card err" role="alert">{error}</div>;

  return (
    <>
      <h1>Profile and Settings</h1>

      <div className="card">
        <p className="mut">Total XP: {currentUser?.stats.total_xp ?? 0} · Level {currentUser?.stats.current_level ?? 0}</p>
        {createdAt && <p className="small">Account created {new Date(createdAt).toLocaleDateString()}</p>}
        <label>
          Display name<br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <p />

        <label>
          Username<br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <p />

        <label>
          Preferred language<br />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map((x) => (
              <option key={x.id}>{x.n}</option>
            ))}
          </select>
        </label>
        <p />

        <label>
          <input
            type="checkbox"
            checked={n}
            onChange={(e) => setN(e.target.checked)}
          />
          Daily reminder notifications
        </label>
        <p />

        <button className="btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>

        {error && <p className="err" role="alert">{error}</p>}
        {msg && <p role="status">{msg}</p>}

        <p className="small mut">
          Preferred language and reminder settings are currently demo-only.
        </p>
      </div>
    </>
  );
}
