import {useState} from 'react'
import {dsa} from '../data/mock'
import IslandMap from '../components/IslandMap'
const A=[3,8,12,17,21,29,34,40,47,55]
export default function Dsa(){
  const [t,setT]=useState(29);const [k,setK]=useState(0)
  const steps:{lo:number,hi:number,mid:number,note:string}[]=[];let lo=0,hi=A.length-1
  while(lo<=hi){const mid=Math.floor((lo+hi)/2);if(A[mid]===t){steps.push({lo,hi,mid,note:`A[${mid}] = ${A[mid]} equals the target. Found at index ${mid}.`});break}
    if(A[mid]<t){steps.push({lo,hi,mid,note:`A[${mid}] = ${A[mid]} is less than ${t}, so discard the left half (low becomes ${mid+1}).`});lo=mid+1}
    else{steps.push({lo,hi,mid,note:`A[${mid}] = ${A[mid]} is greater than ${t}, so discard the right half (high becomes ${mid-1}).`});hi=mid-1}}
  const last=steps.length?steps.length-1:-1
  if(!steps.length||k>last)setK(Math.max(last,0))
  const s=steps[Math.min(k,last)]
  return <><h1>DSA Quest</h1>
    <IslandMap items={dsa.map(d=>({t:`L${d.l} ${d.n}`,s:d.s,sub:d.t}))}/>
    <h2>Binary Search</h2>
    <div className="card"><label>Target <select value={t} onChange={e=>{setT(Number(e.target.value));setK(0)}}>{[...A,30].map(x=><option key={x}>{x}</option>)}</select></label>
      <div className="arr">{A.map((v,n)=>{const out=s&&(n<s.lo||n>s.hi);return <div key={n} className={'cell'+(out?' out':'')+(s&&n===s.mid?' mid':'')}>{v}<small>{s&&n===s.lo?'low ':''}{s&&n===s.mid?'mid ':''}{s&&n===s.hi?'high':''}</small></div>})}</div>
      {s?<p>Step {k+1}/{steps.length}: {s.note}</p>:<p>Not found.</p>}
      <button className="ghost" disabled={k===0} onClick={()=>setK(k-1)}>Back</button> <button className="btn" disabled={k>=last} onClick={()=>setK(k+1)}>Next step</button>
      {k>=last&&last>=0&&steps[last].note.includes('Found')===false&&<p className="err">The range is empty after this step: target not in the array.</p>}</div></>
}
